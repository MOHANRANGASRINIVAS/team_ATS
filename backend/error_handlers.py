from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
from typing import Union
from pymongo.errors import PyMongoError
from bson.errors import InvalidId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CustomHTTPException(HTTPException):
    def __init__(self, status_code: int, detail: str, error_code: str = None):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code

class ValidationError(CustomHTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=422, detail=detail, error_code="VALIDATION_ERROR")

class DatabaseError(CustomHTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=500, detail=detail, error_code="DATABASE_ERROR")

class AuthenticationError(CustomHTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=401, detail=detail, error_code="AUTHENTICATION_ERROR")

class AuthorizationError(CustomHTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=403, detail=detail, error_code="AUTHORIZATION_ERROR")

class NotFoundError(CustomHTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=404, detail=detail, error_code="NOT_FOUND")

class ConflictError(CustomHTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=409, detail=detail, error_code="CONFLICT")

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors from Pydantic"""
    logger.warning(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors(),
            "error_code": "VALIDATION_ERROR"
        }
    )

async def http_exception_handler(request: Request, exc: Union[HTTPException, StarletteHTTPException]):
    """Handle HTTP exceptions"""
    logger.warning(f"HTTP error {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": getattr(exc, 'error_code', 'HTTP_ERROR')
        }
    )

async def pymongo_exception_handler(request: Request, exc: PyMongoError):
    """Handle MongoDB errors"""
    logger.error(f"MongoDB error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Database error occurred",
            "error_code": "DATABASE_ERROR"
        }
    )

async def invalid_id_exception_handler(request: Request, exc: InvalidId):
    """Handle invalid ObjectId errors"""
    logger.warning(f"Invalid ObjectId: {str(exc)}")
    return JSONResponse(
        status_code=400,
        content={
            "detail": "Invalid ID format",
            "error_code": "INVALID_ID"
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """Handle all other exceptions"""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error_code": "INTERNAL_ERROR"
        }
    )

def register_exception_handlers(app):
    """Register all exception handlers with the FastAPI app"""
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(PyMongoError, pymongo_exception_handler)
    app.add_exception_handler(InvalidId, invalid_id_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler) 