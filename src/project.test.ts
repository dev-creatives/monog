import assert from "node:assert/strict";
import test from "node:test";
import { parseArgs } from "./cli.js";
import { resolveSettings } from "./project.js";

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
  assert.deepEqual(parseArgs(["new", "game", "--project-id", "game-id", "--title", "Game", "--engine-version", "master"]), {
    directory: "game", projectId: "game-id", title: "Game", engineVersion: "master",
  });
});
