/**
 * テストシーケンサー
 * テストファイルの実行順序を制御
 */

const TestSequencer = require('@jest/test-sequencer').default;

class CustomTestSequencer extends TestSequencer {
    sort(tests) {
        // テストファイルの実行順序を定義
        const testOrder = [
            'hello-world.test.js'
        ];

        return tests.sort((testA, testB) => {
            const indexA = testOrder.findIndex(name => testA.path.includes(name));
            const indexB = testOrder.findIndex(name => testB.path.includes(name));
            
            if (indexA === -1 && indexB === -1) {
                return 0;
            }
            if (indexA === -1) {
                return 1;
            }
            if (indexB === -1) {
                return -1;
            }
            
            return indexA - indexB;
        });
    }
}

module.exports = CustomTestSequencer;
