# python-batch

標準ライブラリ中心の、単純な Python バッチスターター。

CSV を読み込み、カテゴリ別の件数・合計・平均を JSON に出力する。外部 API、DB、クラウド連携を含めない最小構成。

## 使い方

```bash
make seed
make run
cat output/summary.json
```

テスト:

```bash
make setup
make test
```

## 構成

```text
.
├── Makefile
├── data/
│   └── items.csv
├── output/
│   └── summary.json
├── src/
│   ├── __init__.py
│   ├── main.py
│   └── processor.py
└── tests/
    └── test_processor.py
```

## 方針

- まずは標準ライブラリで済ませる
- 入力は `data/`、出力は `output/`
- 生成物はコミットしない
- 必要になった時だけ DB / GCP / キュー / スケジューラを追加する
