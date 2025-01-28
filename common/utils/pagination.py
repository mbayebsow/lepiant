from typing import List, Dict, Any
from fastapi import Request


def paginate(
    request: Request,
    items: List[Dict],
    total: int = 0,
    page: int = 1,
    size: int = 20,
    extra_params: Dict[str, Any] | None = None,
) -> Dict:
    """
    Create a standardized pagination response
    """
    total_pages = (total + size - 1) // size
    base_url = str(request.scope["path"])
    params = [f"size={size}"]

    if extra_params:
        for key, value in extra_params.items():
            if value is not None:
                params.append(f"{key}={value}")

    base_url += "?" + "&".join(params)

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": total_pages,
        "next": f"{base_url}&page={page + 1}" if page < total_pages else None,
        "previous": f"{base_url}&page={page - 1}" if page > 1 else None,
        "first": f"{base_url}&page=1" if page > 1 else None,
        "last": f"{base_url}&page={total_pages}" if page < total_pages else None,
    }
