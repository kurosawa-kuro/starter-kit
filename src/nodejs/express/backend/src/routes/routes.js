/**
 * ルーティング設定
 * APIエンドポイント定義
 */

const express = require('express');
const router = express.Router();

// コントローラー読み込み
const healthController = require('../controllers/health');
const { 
    HelloWorldController, 
    createHelloWorldValidator
} = require('../controllers/helloWorld');

// Hello Worldコントローラーインスタンス
const helloWorldController = new HelloWorldController();

// ヘルスチェックルート
router.get('/health', healthController.checkHealth.bind(healthController));

// Hello Worldルート
router.get('/hello-world', helloWorldController.getHelloWorld.bind(helloWorldController));
router.post('/hello-world', createHelloWorldValidator, helloWorldController.addHelloWorld.bind(helloWorldController));
router.get('/hello-world/list', helloWorldController.listHelloWorld.bind(helloWorldController));

module.exports = router; 