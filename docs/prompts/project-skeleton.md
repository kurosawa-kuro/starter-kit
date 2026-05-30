下記のフォルダ・ファイルを、まずはスケルトンで作成してください。

目的は、今後このリポジトリを AI コーディングしやすくするための最小構成を整えることです。
中身は本格実装ではなく、見出し・役割・最低限の雛形だけで構いません。

## 作成するファイル

```text
README.md
Makefile
CLAUDE.md
AGENTS.md
doppler.yaml

.gitignore
.dockerignore

docs/
  01_仕様書.md
  02_実装カタログ.md
  03_運用.md
```

## 参考: 実例雛形

このスケルトンを具体化したドキュメント一式の実例が
[`../templates/project-docs/`](../templates/project-docs/) にある。
各ドキュメントの役割・権威順位・更新ルールは
[`../templates/project-docs/README.md`](../templates/project-docs/README.md) を参照。