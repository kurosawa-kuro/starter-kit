Claude-Codeにウェブ、ML、Cloudエンジニアが設定すべき

agent skill harness mcpをアドバイス依頼

前提を「Claude Codeを実務の開発母艦にする」方向で整理します。今回は過剰に広げず、Web / ML / Cloud エンジニア向けの設定優先順位に絞ります。

思考時間: 13s
結論

Claude Codeに設定すべき構成は、Agentは役割分担、Skillは作業手順、Harnessは検証ゲート、MCPは外部接続として分けるのが一番実務向きです。

Web / ML / Cloud エンジニアなら、最初から大量に入れるより、まず以下の最小構成で十分です。

agents/
  backend-rust-axum
  python-ml-fastapi
  cloud-terraform
  reviewer
  test-fixer

skills/
  rust-api-implementation
  python-ml-pipeline
  terraform-plan-review
  project-skeleton-generation

harness/
  fmt-lint-test
  api-smoke-test
  ml-repro-check
  terraform-validate-plan

mcp/
  github
  filesystem
  docs/search
  gcp
  postgres

Claude Codeは、コードベースを読み、編集し、コマンド実行し、MCP経由で外部データソースとも連携できるエージェント型コーディングツールです。MCPは外部ツール・DB・APIへの接続標準として位置づけられています。

理由
1. Agentは「専門職」として切る

Claude Codeのsubagentは、専用プロンプト、ツール制限、権限、hooks、skillsを持たせられるため、巨大な万能エージェント1体より、役割別に分けた方が事故が減ります。

おすすめはこの5体です。

backend-rust-axum
  Rust / axum / CLI / バッチ担当

python-ml-fastapi
  Python / scikit-learn / LightGBM / FastAPI / GCP担当

cloud-terraform
  Terraform / GCP / AWS / IaC担当

reviewer
  仕様逸脱・過剰実装・セキュリティ・設計レビュー担当

test-fixer
  fmt / lint / test / smoke test の修正担当

黒澤さんの用途だと、Rust中心、ML/GCPはPython、IaCはTerraformなので、この分け方が一番迷いません。

2. Skillは「毎回やる作業手順」として切る

SkillはClaude Codeの能力拡張・共有用の仕組みです。
Agentが「担当者」なら、Skillは「作業手順書」です。

設定すべきSkillはこの4つで十分です。

rust-api-implementation
  axum APIを作るときの標準手順

python-ml-pipeline
  scikit-learn / LightGBM の学習・推論・評価手順

terraform-plan-review
  terraform fmt / validate / plan の確認手順

project-skeleton-generation
  テンプレートからスターターキットを生成する手順

ここで重要なのは、Skillに思想を書きすぎないことです。
「何を確認して、何を実行して、何を成果物にするか」だけでよいです。

3. Harnessは「AIに自由実装させた後の検問」にする

ここが一番重要です。

Claude Codeはファイル編集やコマンド実行までできますが、だからこそHarnessを検証ゲートとして置くべきです。
Anthropicのdocsでも、hooksにはPreToolUse / PostToolUse / Stop / SubagentStopなどのイベントがあり、Claude Codeの実行前後に処理を挟めます。

黒澤さん向けには、Harnessはこの4種類で十分です。

fmt-lint-test
  cargo fmt
  cargo clippy
  cargo test
  ruff
  pytest

api-smoke-test
  /health
  /version
  /docs
  主要APIの疎通確認

ml-repro-check
  学習スクリプトが再実行できるか
  モデル保存・推論が通るか
  評価指標が出るか

terraform-validate-plan
  terraform fmt
  terraform validate
  terraform plan

つまり、Claude Codeに期待するのは「実装」まで。
正しいかどうかはHarnessで機械的に潰す構成が強いです。

有力シナリオ
シナリオ1：個人開発・PoC中心

一番使う構成はこれです。

Agent:
  backend-rust-axum
  reviewer
  test-fixer

Skill:
  rust-api-implementation
  project-skeleton-generation

Harness:
  cargo fmt
  cargo clippy
  cargo test
  api smoke test

MCP:
  github
  filesystem

Rust製CLI、axum API、テンプレート生成ツールを作るならこれで十分です。

シナリオ2：MLアプリ中心

ML系だけPythonに寄せる構成です。

Agent:
  python-ml-fastapi
  reviewer
  test-fixer

Skill:
  python-ml-pipeline

Harness:
  ruff
  pytest
  notebook/script reproducibility check
  FastAPI smoke test

MCP:
  filesystem
  github
  gcp
  postgres

MLはscikit-learn / LightGBM、APIはFastAPI。
フロントはJinjaや簡易HTMLで十分です。

シナリオ3：Cloud / IaC中心

Cloud案件やポートフォリオで強い構成です。

Agent:
  cloud-terraform
  reviewer

Skill:
  terraform-plan-review

Harness:
  terraform fmt
  terraform validate
  terraform plan

MCP:
  github
  gcp
  aws
  docs/search

TerraformはAIに書かせるだけだと危険なので、plan確認を必須ゲートにするのが良いです。

破綻条件

この構成が破綻するのは、以下です。

1. Agentを増やしすぎる

最初から10体以上作ると、どのAgentを使うべきか曖昧になります。
まずは5体で十分です。

backend-rust-axum
python-ml-fastapi
cloud-terraform
reviewer
test-fixer
2. MCPを入れすぎる

MCPは便利ですが、外部接続が増えるほど権限・秘密情報・誤操作リスクが増えます。
Claude CodeはMCPで外部ツール、DB、APIへアクセスできます。
だから最初はGitHub、filesystem、docs/search程度からでよいです。

3. HarnessなしでAI実装を信用する

これは一番危険です。
AIに実装させること自体は有効ですが、fmt / lint / test / plan / smoke testを通らない成果物は未完了扱いにするべきです。

4. フロントをReact/Next.jsに寄せすぎる

黒澤さんの今の用途だと、フロント専属技術は重いです。
MLアプリや管理画面は、まずJinja / HTMLテンプレート / 最小JSで十分です。

実務・行動への影響

最初に作るべきは、以下の順番です。

1. reviewer agent
2. test-fixer agent
3. backend-rust-axum agent
4. python-ml-fastapi agent
5. cloud-terraform agent

その次にSkillです。

1. rust-api-implementation
2. project-skeleton-generation
3. python-ml-pipeline
4. terraform-plan-review

最後にHarnessです。

1. fmt-lint-test
2. api-smoke-test
3. terraform-validate-plan
4. ml-repro-check

MCPは最初はこれで十分です。

1. filesystem
2. github
3. docs/search
4. gcp
5. postgres

黒澤さんの構成なら、結論はこうです。

Claude Code本体:
  実装・修正・リファクタ担当

Agent:
  専門職分離

Skill:
  定型作業の手順化

Harness:
  AI実装の検証ゲート

MCP:
  外部情報・外部ツール接続

一番重要なのは、Agentを増やすことではなく、Harnessで失敗を機械的に検出することです。
Claude Codeを強くする本体は「賢いプロンプト」より、fmt → lint → test → smoke → plan の強制ゲートです。