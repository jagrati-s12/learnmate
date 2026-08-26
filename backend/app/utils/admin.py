from fastapi import Depends, HTTPException, status

from app.models.user import User


def require_admin(current_user: User) -> User:
    """
    Dependency that ensures the current user has admin privileges.

    Usage in a route:
        @router.get("/admin-only")
        def admin_endpoint(user: User = Depends(get_current_user)):
            require_admin(user)
            ...

    Once you receive the admin keys from your friend, you can extend this
    to also validate an admin API key or role token.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required.",
        )
    return current_user
