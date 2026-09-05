# 現時点の決定事項

最終更新: 2026-09-06

## 目的

- TyranoScript 向けの、非公式プロジェクト管理 CLI を作る。
- PowerShell 限定ではなく、npm で配布できるクロスプラットフォームなツールにする。
- 初期版はプロジェクト生成だけを扱い、開発サーバー・公開・パッケージングは後続段階とする。

## 名称と配布

- 製品名・実行コマンド名は `monog` とする。
- npm パッケージ名は `@dev-creatives/monog` とする。
- TyranoScript の公式／公認ツールと誤認されないよう、製品名に `tyrano` / `tyranoscript` を含めない。
- README では「TyranoScript 向けの非公式プロジェクト管理 CLI」と明示する。
- TypeScript / Node.js で実装し、pnpm で開発・npm で配布する。MoonBit / Wasm は初期版では採用しない。

## 初期 CLI インターフェース

```sh
monog new <directory> [--project-id <id>] [--title <title>] [--engine-version <Gitリビジョン>]
```

- `new` は新しいディレクトリを作成するコマンドとする。
- 既存ディレクトリをプロジェクト化する `init` は、将来必要になった段階で別の意味を保って追加する。初期版には含めない。
- 生成先が既に存在する場合はエラーにし、既存ファイルを変更しない。
- `<directory>` はプロジェクトの出力先ディレクトリとする。
- `--project-id` は `Config.tjs` の `projectID` に設定する内部識別子とする。省略時は `<directory>` の末尾要素を使い、半角英数字・ハイフン・アンダースコア以外を含む場合はエラーにする。
- `--title` は `Config.tjs` の `System.title` に設定するゲーム表示名とする。省略時は `projectID` を使う。改行とダブルクォートは受け付けない。

## エンジン取得とバージョン

- エンジンは npm パッケージに同梱せず、公式 GitHub リポジトリ `ShikemokuMK/tyranoscript` から利用者環境へ取得する。
- `--engine-version` を省略した場合は、GitHub の `master` 先端を実行時に解決して使う。
- `--engine-version` には、GitHubリポジトリでGitが解決できるリビジョン（短縮SHA、完全SHA、タグ、ブランチ名など）を受け付ける。
- 解決した完全 SHA、要求したリビジョン、取得元リポジトリ、生成日時を生成先の `package.json` の `monog` 名前空間に記録する。
- 初期版では `stable` のような monog 管理の固定エイリアスを提供しない。再現可能な生成には、解決済みの完全SHAを明示指定する。

## 生成するプロジェクト

- Tyrano エンジンと起動に必要な設定ファイルに加え、最小の Hello World シナリオを生成する。
- 公式サンプルのシナリオ、画像、音声などの素材は含めない。
- `package.json` は生成するが、初期版では依存関係や npm scripts は追加しない。`private: true` と monog の生成メタデータを記録する。
- GitHub Pages のワークフロー生成、公開操作の自動化、ローカル開発サーバーは初期版の対象外とする。

### 生成ディレクトリ構造

`monog new <directory>` は、指定先に以下を生成する。`tyrano/` は解決済みGitリビジョンのエンジンディレクトリ全体を配置し、`data/` には起動・Hello Worldに必要なファイルだけを配置する。

```text
<directory>/
├── package.json
├── index.html
├── tyrano/                         # 解決済みリビジョンのTyranoエンジン一式
│   └── ...
└── data/
    ├── scenario/
    │   └── first.ks                # Hello Worldを表示する最初のシナリオ
    └── system/
        ├── Config.tjs              # projectIDとゲーム表示名を含むプロジェクト設定
        └── KeyConfig.js            # キー操作設定
```

- `index.html` はTyranoエンジンと `data/system/KeyConfig.js` を読み込む起動ページとする。
- `data/bgimage/`、`data/bgm/`、`data/fgimage/`、`data/image/`、`data/sound/` などのアセット用ディレクトリ、および `config.ks`・`title.ks`・`tyrano.ks` を含む公式サンプルシナリオは生成しない。

## 実装上の前提

- GitHubアーカイブは一時領域へ取得・展開し、検証完了後にのみ生成先へ配置する。失敗時に未完成のプロジェクトを残さない。
- Node.js 20 以降をサポート対象とする。
- リリース前に、既定の `master` HEAD と公式配布 ZIP の対応を必要に応じて照合し、照合元 ZIP と検証結果をリポジトリで追跡する。

## 初期版の検証観点

- 既定値（`master`）とGitリビジョン指定の参照解決・入力検証。
- 既存生成先、ネットワーク失敗、不明 SHA、不正アーカイブ、必須ファイル欠落時の安全な失敗。
- 生成物にサンプル素材が混入しないこと、`package.json` のメタデータが正しいこと。
- 静的 HTTP サーバー経由で Hello World がブラウザ起動できること。
