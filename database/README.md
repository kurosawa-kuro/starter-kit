# データベース設計ドキュメント

## テーブル一覧

| No | テーブル名               | 説明                         |
|----|--------------------------|------------------------------|
| 1  | users                    | ユーザー情報                 |
| 2  | microposts               | 投稿記事                     |
| 3  | categories               | 記事のカテゴリ情報           |
| 4  | categories_microposts    | カテゴリと投稿の関連付け     |
| 5  | roles                    | ユーザー権限（ロール）情報   |
| 6  | roles_users              | ユーザーとロールの関連付け   |

---

## テーブル詳細（カラム一覧）

### users

| カラム名   | 型            | 制約                 | 説明                     |
|------------|---------------|----------------------|--------------------------|
| id         | SERIAL        | PRIMARY KEY          | ユーザーID（連番）       |
| email      | VARCHAR(255)  | UNIQUE, NOT NULL     | メールアドレス           |
| name       | VARCHAR(100)  | NOT NULL             | ユーザー名               |
| password   | VARCHAR(255)  | NOT NULL             | パスワード（ハッシュ済） |
| avatar     | VARCHAR(500)  | NOT NULL             | アバター画像のURL        |
| created_at | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP | 作成日時            |

### microposts

| カラム名   | 型            | 制約                       | 説明               |
|------------|---------------|----------------------------|--------------------|
| id         | SERIAL        | PRIMARY KEY                | 投稿ID（連番）     |
| user_id    | INTEGER       | NOT NULL, FK(users.id)     | 投稿したユーザーID |
| title      | VARCHAR(255)  | NOT NULL                   | 投稿タイトル       |
| content    | TEXT          | NOT NULL                   | 投稿内容           |
| created_at | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP  | 作成日時           |

### categories

| カラム名   | 型            | 制約                  | 説明            |
|------------|---------------|-----------------------|-----------------|
| id         | SERIAL        | PRIMARY KEY           | カテゴリID（連番） |
| name       | VARCHAR(100)  | UNIQUE, NOT NULL      | カテゴリ名      |
| created_at | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP | 作成日時       |

### categories_microposts（中間テーブル）

| カラム名      | 型        | 制約                      | 説明          |
|---------------|-----------|---------------------------|---------------|
| category_id   | INTEGER   | PK, FK(categories.id)     | カテゴリID    |
| micropost_id  | INTEGER   | PK, FK(microposts.id)     | 投稿ID        |

### roles

| カラム名   | 型            | 制約                 | 説明                  |
|------------|---------------|----------------------|-----------------------|
| id         | SERIAL        | PRIMARY KEY          | ロールID（連番）      |
| name       | VARCHAR(100)  | UNIQUE, NOT NULL     | ロール名（管理者など）|
| created_at | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP | 作成日時          |

### roles_users（中間テーブル）

| カラム名   | 型        | 制約                 | 説明          |
|------------|-----------|----------------------|---------------|
| role_id    | INTEGER   | PK, FK(roles.id)     | ロールID      |
| user_id    | INTEGER   | PK, FK(users.id)     | ユーザーID    |

---

## ER図

```
users (1) ────< (多) microposts ────< categories_microposts >──── categories
│
│
└─────< roles_users >───── roles
```

- 「───<」は1対多の関係を表す
- 「───< 中間テーブル >───」は多対多の関係を表す

## 備考

- 全テーブルの主キーはSERIAL型の整数連番を使用。
- 外部キー制約により参照整合性を確保。
- ON DELETE CASCADEにより親テーブル削除時に関連データを自動削除。

