#!/usr/bin/env node

import { createProject, type CreateProjectOptions } from "./project.js";
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

const usage = `Usage: monog new <directory> [options]

Options:
  --project-id <id>          TyranoScript projectID (default: directory name)
  --title <title>            Game title (default: project ID)
  --engine-version <ref>     Git revision of ShikemokuMK/tyranoscript (default: master)
  --with-sample              Add the official sample novel data
  -h, --help                 Show this help`;

function fail(message: string): never {
  throw new Error(`${message}\n\n${usage}`);
}

export function parseArgs(args: string[]): CreateProjectOptions {
  if (args[0] !== "new") fail("The only supported command is 'new'.");
  if (args.length === 1) fail("Missing <directory>.");

  const directory = args[1];
  if (directory.startsWith("-")) fail("Missing <directory>.");
  const options: CreateProjectOptions = { directory };

  for (let index = 2; index < args.length; index += 1) {
    const option = args[index];
    if (option === "--help" || option === "-h") fail(usage);
    if (option === "--with-sample") {
      options.withSample = true;
      continue;
    }
    const value = args[index + 1];
    if (!value || value.startsWith("-")) fail(`Missing value for ${option}.`);
    if (option === "--project-id") options.projectId = value;
    else if (option === "--title") options.title = value;
    else if (option === "--engine-version") options.engineVersion = value;
    else fail(`Unknown option: ${option}`);
    index += 1;
  }
  return options;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    process.stdout.write(`${usage}\n`);
    return;
  }
  const result = await createProject(parseArgs(args));
  process.stdout.write(`Created TyranoScript project at ${result.path}\n`);
  process.stdout.write(`Engine revision: ${result.engineCommit}\n`);
}

function isEntrypoint(entryPath: string | undefined): boolean {
  if (!entryPath) return false;
  try {
    return realpathSync(entryPath) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isEntrypoint(process.argv[1])) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`monog: ${message}\n`);
    process.exitCode = 1;
  });
}
