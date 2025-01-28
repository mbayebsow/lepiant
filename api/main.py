from fastapi import FastAPI
from scalar_fastapi import get_scalar_api_reference
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi_paginate import add_pagination
from scalar_fastapi.scalar_fastapi import Layout
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from .v1 import v1_router
from common.config import Config, tags_metadata, contact, servers, logo_url
from logtail import LogtailHandler
import logging

handler = LogtailHandler(source_token=Config.BETTERSTACK_LOG_TOKEN)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(handler)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=f"{Config.APP_NAME} - API DOCUMENTATION",
    version="1.0",
    docs_url=None,
    redoc_url=None,
    openapi_tags=tags_metadata,
    description=Config.API_DESCRIPTION,
    servers=servers,
    contact=contact,
    debug=True,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(GZipMiddleware)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# version 1 router
app.include_router(v1_router, prefix="/v1")


@app.get(Config.DOC_URL["public"], include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        scalar_favicon_url=logo_url,
        openapi_url=app.openapi_url or "/openapi.json",
        title=app.title,
        layout=Layout.MODERN,
        hide_download_button=True,
        default_open_all_tags=True,
        servers=servers,
    )


add_pagination(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
