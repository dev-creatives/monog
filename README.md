# monog

TyranoScript 向けの非公式プロジェクト管理CLIです。初期版では、新しいTyranoScriptプロジェクトを生成する `monog new` を提供します。

TyranoScriptおよびTyranoStudioの公式／公認ツールではありません。

## 必要環境

- Node.js 26以降
- pnpm 12以降
- エンジン取得時のインターネット接続

## 開発版を使う

リポジトリを取得後、依存関係のインストールとビルドを行います。

```sh
pnpm install
pnpm build
```

グローバルコマンドとして使うには、リポジトリ直下で次を実行します。

```sh
pnpm add --global .
```

初回のみ `pnpm setup` を実行してシェルを再起動し、pnpmのグローバルbinディレクトリを `PATH` に追加してください。

```sh
pnpm setup
```

グローバル登録せずに試す場合は、リポジトリ直下で直接実行できます。

```sh
node dist/cli.js new my-game
```

## 使い方

```sh
monog new <directory> [--project-id <id>] [--title <title>] [--engine-version <Gitリビジョン>]
```

例:

```sh
monog new hello-monog --project-id hello_monog --title "Hello, monog!"
```

| 引数 | 説明 |
| --- | --- |
| `<directory>` | 新規プロジェクトの出力先。既に存在する場合はエラーになり、内容は変更しません。 |
| `--project-id <id>` | TyranoScriptの内部識別子。`Config.tjs` の `projectID` に設定します。省略時は出力先ディレクトリ名です。半角英数字、ハイフン、アンダースコアだけを使えます。 |
| `--title <title>` | ゲーム表示名。`Config.tjs` の `System.title` に設定します。省略時はプロジェクトIDです。 |
| `--engine-version <Gitリビジョン>` | `ShikemokuMK/tyranoscript` のブランチ名、タグ、短縮SHA、完全SHAなど。省略時は `master` の先端です。 |

エンジンはnpmパッケージに同梱せず、指定リビジョンをGitHubから取得します。生成時に解決した完全コミットSHAは、プロジェクトの `package.json` の `monog.engine` に記録されます。再現可能な生成には、そのSHAを `--engine-version` で指定してください。

## 生成されるプロジェクト

```text
<directory>/
├── package.json
├── index.html
├── tyrano/                         # 指定リビジョンのTyranoエンジン
│   └── ...
└── data/
    ├── scenario/
    │   └── first.ks                # Hello Worldシナリオ
    └── system/
        ├── Config.tjs
        └── KeyConfig.js
```

公式サンプルのシナリオ、画像、音声などの素材は生成しません。エンジンの取得・展開・検証は一時領域で行い、成功時だけ出力先へ配置します。

## 開発

```sh
pnpm test
```

依存関係を更新する場合は、テスト後に `package.json` と `pnpm-lock.yaml` の差分を確認してください。

```sh
pnpm update --latest
pnpm test
```
