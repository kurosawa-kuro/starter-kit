from fastapi import Depends, FastAPI, Form, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from gcp import RequestLoggingMiddleware, configure_logging
from models import Micropost

Base.metadata.create_all(bind=engine)

logger = configure_logging("micropost-api")

app = FastAPI(title="Micropost CRUD")
app.add_middleware(RequestLoggingMiddleware, logger=logger)
templates = Jinja2Templates(directory="templates")


@app.get("/healthz")
def healthz():
    """Cloud Run / GKE liveness 用の軽量エンドポイント。"""
    return {"status": "ok"}


@app.get("/", response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db)):
    posts = db.query(Micropost).order_by(Micropost.created_at.desc()).all()
    return templates.TemplateResponse(
        "index.html", {"request": request, "posts": posts}
    )


@app.get("/microposts/new", response_class=HTMLResponse)
def new_form(request: Request):
    return templates.TemplateResponse(
        "form.html",
        {"request": request, "post": None, "action": "/microposts", "title": "New Micropost"},
    )


@app.post("/microposts")
def create(
    title: str = Form(...),
    content: str = Form(...),
    db: Session = Depends(get_db),
):
    post = Micropost(title=title.strip(), content=content.strip())
    db.add(post)
    db.commit()
    db.refresh(post)
    return RedirectResponse(url=f"/microposts/{post.id}", status_code=status.HTTP_303_SEE_OTHER)


@app.get("/microposts/{post_id}", response_class=HTMLResponse)
def show(post_id: int, request: Request, db: Session = Depends(get_db)):
    post = db.get(Micropost, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Micropost not found")
    return templates.TemplateResponse(
        "detail.html", {"request": request, "post": post}
    )


@app.get("/microposts/{post_id}/edit", response_class=HTMLResponse)
def edit_form(post_id: int, request: Request, db: Session = Depends(get_db)):
    post = db.get(Micropost, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Micropost not found")
    return templates.TemplateResponse(
        "form.html",
        {
            "request": request,
            "post": post,
            "action": f"/microposts/{post.id}",
            "title": "Edit Micropost",
        },
    )


@app.post("/microposts/{post_id}")
def update(
    post_id: int,
    title: str = Form(...),
    content: str = Form(...),
    db: Session = Depends(get_db),
):
    post = db.get(Micropost, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Micropost not found")
    post.title = title.strip()
    post.content = content.strip()
    db.commit()
    return RedirectResponse(url=f"/microposts/{post.id}", status_code=status.HTTP_303_SEE_OTHER)


@app.post("/microposts/{post_id}/delete")
def delete(post_id: int, db: Session = Depends(get_db)):
    post = db.get(Micropost, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Micropost not found")
    db.delete(post)
    db.commit()
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)
