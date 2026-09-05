# monog

`monog` is an unofficial project management CLI for TyranoScript.

## Usage

```sh
monog new <directory> [--project-id <id>] [--title <title>] [--engine-version <Git revision>]
```

The default engine revision is the current `master` branch of `ShikemokuMK/tyranoscript`. The generated project's `package.json` records the resolved full commit SHA.

`--project-id` defaults to the output directory name and accepts ASCII letters, digits, hyphens, and underscores. `--title` defaults to the project ID.
