# PostgreSQL 管理コマンド集

## 1. クラスター状態の確認
```bash
# PostgreSQLクラスターの一覧と状態を確認
sudo pg_lsclusters
```

## 2. サービスの停止
```bash
# 方法1: pg_ctlclusterを使用
sudo pg_ctlcluster 16 main stop

# 方法2: systemctlを使用
sudo systemctl stop postgresql@16-main
```

## 3. サービスの起動
```bash
# 方法1: pg_ctlclusterを使用
sudo pg_ctlcluster 16 main start

# 方法2: systemctlを使用
sudo systemctl start postgresql@16-main
```

## 4. 自動起動の無効化
```bash
# システム起動時の自動起動を無効にする
sudo systemctl disable postgresql@16-main

# 自動起動の状態を確認
sudo systemctl is-enabled postgresql@16-main
```

## 5. PostgreSQLへの接続と操作

### 5.1 postgresユーザーとしてpsqlに接続
```bash
sudo -u postgres psql
```

### 5.2 基本的なpsqlコマンド
| コマンド | 説明 |
|---------|------|
| `\l` | データベース一覧を表示 |
| `\dt` | 現在のデータベースのテーブル一覧を表示 |
| `\du` | ユーザー一覧を表示 |
| `\q` | psqlを終了 |

### 5.3 よく使うSQLコマンド
```sql
-- データベース一覧
SELECT datname FROM pg_database;

-- テーブル一覧
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- 現在のデータベース名を確認
SELECT current_database();
```

## 6. トラブルシューティング

### 6.1 サービス状態の確認
```bash
# systemctlで状態確認
sudo systemctl status postgresql@16-main

# プロセス確認
ps aux | grep postgres
```

### 6.2 ログの確認
```bash
# PostgreSQLログを確認
sudo tail -f /var/log/postgresql/postgresql-16-main.log
```

## 7. 注意事項
- PostgreSQL 16を使用することを前提としています
- クラスター名が「main」であることを前提としています
- 必要に応じてバージョン番号やクラスター名を変更してください