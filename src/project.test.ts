import assert from "node:assert/strict";
import test from "node:test";
import { parseArgs } from "./cli.js";
import { projectPackage, projectReadme, resolveSamplePackageUrl, resolveSettings } from "./project.js";

test("uses the directory basename and master as defaults", () => {
  const settings = resolveSettings({ directory: "my-game" });
  assert.equal(settings.projectId, "my-game");
  assert.equal(settings.title, "my-game");
  assert.equal(settings.engineVersion, "master");
});

test("accepts explicit project metadata and a short revision", () => {
  const settings = resolveSettings({ directory: "game", projectId: "game_2026", title: "My Game", engineVersion: "c8dbfd4" });
  assert.equal(settings.projectId, "game_2026");
  assert.equal(settings.title, "My Game");
  assert.equal(settings.engineVersion, "c8dbfd4");
});

test("rejects invalid project metadata", () => {
  assert.throws(() => resolveSettings({ directory: "a name" }), /Project ID/);
  assert.throws(() => resolveSettings({ directory: "game", title: "line\nbreak" }), /Title/);
});

test("parses new command options", () => {
  assert.deepEqual(parseArgs(["new", "game", "--project-id", "game-id", "--title", "Game", "--engine-version", "master", "--with-sample"]), {
    directory: "game", projectId: "game-id", title: "Game", engineVersion: "master", withSample: true,
  });
});

test("resolves the official latest sample ZIP link", () => {
  const html = '<a href="/download/studio/tyranoscript_v603b.zip">【最新版】Ver603bをダウンロード</a>';
  assert.equal(resolveSamplePackageUrl(html), "https://tyrano.jp/download/studio/tyranoscript_v603b.zip");
  assert.throws(() => resolveSamplePackageUrl("<a href=\"old.zip\">旧版</a>"), /latest TyranoScript ZIP/);
});

test("adds a reproducible local development server to generated projects", () => {
  const generated = projectPackage({ requestedRevision: "master", commit: "c8dbfd492afd3d79b0954fcf4477236f5c6c4830" });
  assert.deepEqual(generated.scripts, { dev: "http-server . -p 8000 -c-1 -o" });
  assert.deepEqual(generated.devDependencies, { "http-server": "14.1.1" });
  assert.equal(generated.packageManager, "pnpm@12.3.4");
  assert.deepEqual(generated.engines, { node: ">=26", pnpm: ">=12" });
});

test("writes local launch instructions for the generated game", () => {
  const readme = projectReadme("Hello, monog!");
  assert.match(readme, /^# Hello, monog!$/m);
  assert.match(readme, /pnpm install/);
  assert.match(readme, /pnpm dev/);
  assert.match(readme, /http:\/\/localhost:8000\//);
});
