from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# FastAPIアプリケーションのインスタンスを作成
app = FastAPI(
    title="Hello World API",
    description="A simple FastAPI Hello World application",
    version="1.0.0"
)

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """
    ルートエンドポイント - Hello Worldメッセージを返す
    """
    return {"message": "Hello World"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    """
    名前付きHelloエンドポイント
    """
    return {"message": f"Hello {name}"}

@app.get("/health")
async def health_check():
    """
    ヘルスチェックエンドポイント
    """
    return {"status": "healthy", "service": "fastapi-hello-world"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 