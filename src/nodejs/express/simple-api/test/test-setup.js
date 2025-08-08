/**
 * テスト設定
 * SQLiteテスト用の設定とヘルパー関数
 */

const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// テスト用データベースパス
const TEST_DB_PATH = path.join(__dirname, '../data/test-database.sqlite');

/**
 * テスト用データベースを初期化
 */
function initializeTestDatabase() {
    return new Promise((resolve, reject) => {
        // 既存のテストデータベースを削除
        if (fs.existsSync(TEST_DB_PATH)) {
            fs.unlinkSync(TEST_DB_PATH);
        }

        // テスト用データベースディレクトリを作成
        const dbDir = path.dirname(TEST_DB_PATH);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // テスト用データベースを作成
        const db = new sqlite3.Database(TEST_DB_PATH, (err) => {
            if (err) {
                reject(err);
                return;
            }

            // テスト用テーブルを作成
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS hello_world_messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            db.run(createTableSQL, (err) => {
                if (err) {
                    reject(err);
                } else {
                    // テーブルをクリア
                    db.run('DELETE FROM hello_world_messages', (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            db.close((err) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        }
                    });
                }
            });
        });
    });
}

/**
 * テスト用データベースをクリーンアップ
 */
function cleanupTestDatabase() {
    return new Promise((resolve) => {
        if (fs.existsSync(TEST_DB_PATH)) {
            fs.unlinkSync(TEST_DB_PATH);
        }
        resolve();
    });
}

/**
 * テスト用データベースにテストデータを挿入
 */
function insertTestData(testData) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(TEST_DB_PATH, (err) => {
            if (err) {
                reject(err);
                return;
            }

            const insertPromises = testData.map(data => {
                return new Promise((resolve, reject) => {
                    const sql = `
                        INSERT INTO hello_world_messages (name, message, created_at, updated_at)
                        VALUES (?, ?, datetime('now'), datetime('now'))
                    `;
                    db.run(sql, [data.name, data.message], function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this.lastID);
                        }
                    });
                });
            });

            Promise.all(insertPromises)
                .then(() => {
                    db.close((err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                })
                .catch(reject);
        });
    });
}

/**
 * テスト用データベースからデータを取得
 */
function getTestData() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(TEST_DB_PATH, (err) => {
            if (err) {
                reject(err);
                return;
            }

            db.all('SELECT * FROM hello_world_messages ORDER BY created_at DESC', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    db.close((err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                }
            });
        });
    });
}

/**
 * テスト用データベースをクリア
 */
function clearTestDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(TEST_DB_PATH, (err) => {
            if (err) {
                reject(err);
                return;
            }

            db.run('DELETE FROM hello_world_messages', (err) => {
                if (err) {
                    reject(err);
                } else {
                    db.close((err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    });
}

module.exports = {
    TEST_DB_PATH,
    initializeTestDatabase,
    cleanupTestDatabase,
    insertTestData,
    getTestData,
    clearTestDatabase
};
