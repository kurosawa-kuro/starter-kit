## ベストプラクティス早見表

（前提：**EKS 本番／kind ローカル、AI コーディングツール：Devin・Claude Code を併用**）

| フェーズ                                        | 推奨 DB 配置                             | 代表的ツール                                                | 主なメリット                                                                         | 注意点                 |
| ------------------------------------------- | ------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------- |
| **ローカル開発**<br>(kind／Docker Desktop)         | コンテナ化 Postgres                       | *Docker Compose* or *helm chart* (bitnami/postgresql) | すぐ起動・捨てやすい／AI が環境構築を自動化しやすい                                                    | ボリュームマウント忘れに注意      |
| **CI／AI エージェント実行**<br>(Devin, Claude Code)  | **Neon ブランチ**(Serverless PG)         | Neon branch per-PR                                    | *copy-on-write* で秒単位生成 → 並列 E2E が高速([Neon][1], [Neon][2])                      | インターネット必須／接続数上限     |
| **ステージング／小規模本番**                            | **Amazon RDS / Aurora (PostgreSQL)** | RDS Multi-AZ, Aurora Serverless v2                    | バックアップ・パッチ・HA を AWS に丸投げ。ACK コントローラで GitOps 可能([Amazon Web Services, Inc.][3]) | 高トラフィック時のコストに注意     |
| **Kubernetes ネイティブ運用が必須**<br>(クラウド可搬性・オンプレ) | **Postgres Operator** を EKS にデプロイ    | CloudNativePG or Crunchy PGO                          | GitOps で DB も宣言管理、クロスリージョン DR([DEV Community][4], [Crunchy Data][5])           | ストレージ／バックアップ設計が自己責任 |
| **データサンドボックス**<br>(アドホック検証・LLM フィード)        | テンポラリ Neon/Compose + Atlas seed      | Atlas `schema apply` + sqlc                           | AI から一発でスキーマ→DB→型安全コード生成                                                       | コスト／TTL を CI で自動掃除  |

---

### 推奨ワークフロー

1. **スキーマ管理** … Atlas
   *`atlas migrate diff → apply` で DB を最新化 →*
2. **型安全コード生成** … sqlc
   *`sqlc generate` で pgx 対応 DAO を再生成*
3. **ローカル／CI** … Neon branched DB or Docker Compose
4. **本番** … RDS/Aurora（99 % のケースで最小運用コスト）

   * GitOps 派なら **AWS ACK RDS コントローラ** を EKS に入れて YAML から管理
5. **特殊要件**（マルチクラウド・エッジ）… CloudNativePG/Crunchy PGO Operator

> **理由**
>
> * **AI ツールとの相性**：Neon のブランチ API は Devin が PR ごとに“使い捨て DB”を自動発行しやすい。Atlas + sqlc で型が揃うと LLM が差分を安全に適用できる。
> * **本番の可用性**：RDS/Aurora は OS パッチ・バックアップ・再起動を AWS が担保し、ACK で K8s から宣言的に制御可能。運用負荷とリスクを最小化。([Amazon Web Services, Inc.][3])
> * **K8s ネイティブが必要な場合**：Postgres Operator は PV / バックアップ / フェイルオーバを CRD で管理し、CloudNativePG は EKS 公式ワークロードの 1 つとして採用例が急増中。([DEV Community][4])

---

### “OS 直接インストール” はいつ使う？

* ほぼ **使わない**。

  * 例外：超軽量なラボ環境や IoT Edge で < 1 GiB DB をサイドカー無しで動かしたい場合のみ。

---

## あなたの PoC→本番に即したテンプレ

```mermaid
graph TD
  subgraph Local Dev (kind)
    A(Postgres via Compose) --> B(App + Chi)
  end
  subgraph CI (Devin/Claude)
    C(Neon Branch) --> D(Test Pods)
  end
  subgraph Prod (EKS)
    E(App Pods) -->|RDS ACK YAML| F(RDS Aurora)
  end
  click A "https://hub.docker.com/_/postgres" "Docker Hub"
  click C "https://neon.com" "Neon"
```

---

### 迷ったらこの判断基準

1. **“運用を DB 専門家に任せたい”** → RDS / Aurora
2. **“K8s だけで完結させたい・マルチクラウド要件”** → CloudNativePG / Crunchy PGO
3. **“ブランチごとに一瞬で DB が欲しい”** → Neon
4. **“本当にローカルだけ”** → Docker Compose or Testcontainers

これをベースに、さらに詳細設計（バックアップ戦略、ストレージクラス、コスト試算など）が必要であればいつでも声をかけてください。

[1]: https://neon.com/?utm_source=chatgpt.com "Neon Serverless Postgres — Ship faster"
[2]: https://neon.com/docs/use-cases/use-cases-overview?utm_source=chatgpt.com "Neon use cases - Neon Docs"
[3]: https://aws.amazon.com/blogs/containers/kubernetes-as-a-platform-vs-kubernetes-as-an-api-2/ "Kubernetes as a platform vs. Kubernetes as an API | Containers"
[4]: https://dev.to/aws-builders/data-on-kubernetes-part-2-deploying-databases-in-k8s-with-postgresql-cloudnative-pg-and-ceph-rook-on-amazon-eks-2366?utm_source=chatgpt.com "Data on Kubernetes: Part 2 - Deploying Databases in K8s with ..."
[5]: https://www.crunchydata.com/products/crunchy-postgresql-for-kubernetes?utm_source=chatgpt.com "Crunchy Postgres For Kubernetes"
