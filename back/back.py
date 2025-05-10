from fastapi import FastAPI, Depends, HTTPException, status # type: ignore
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # type: ignore
from typing import Optional
import jwt # type: ignore
from datetime import datetime, timedelta
import os
import json
from passlib.context import CryptContext # type: ignore

# Настройка FastAPI приложения
app = FastAPI(title="Бэкенд для авторизации")

# Настройка CORS для взаимодействия с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Секретный ключ для JWT
SECRET_KEY = "your_secret_key"  # В реальном приложении используйте безопасный ключ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Хэширование паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Объект для работы с токенами
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Модель пользователя
class User(BaseModel):
    username: str
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

# Модель токена
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Модель для создания пользователя
class UserCreate(BaseModel):
    username: str
    password: str

# Модель для ответа с пользователями
class UserResponse(BaseModel):
    username: str
    disabled: bool

# Хранилище пользователей (в реальном приложении используйте базу данных)
def get_users_db():
    users_db_file = os.path.join(os.path.dirname(__file__), "users.json")
    
    if not os.path.exists(users_db_file):
        # Создаем файл с тестовым пользователем, если его нет
        test_user = {
            "admin": {
                "username": "admin",
                "hashed_password": get_password_hash("admin"),
                "disabled": False
            }
        }
        with open(users_db_file, "w") as f:
            json.dump(test_user, f)
    
    with open(users_db_file, "r") as f:
        users_db = json.load(f)
    
    return users_db

# Функции для работы с паролями
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Функции для аутентификации
def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)

def authenticate_user(users_db, username: str, password: str):
    user = get_user(users_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(get_users_db(), username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# API эндпоинты
@app.get("/")
async def root():
    """
    Корневой маршрут с информацией о доступных эндпоинтах
    """
    return {
        "message": "API Authentication is working",
        "status": "OK",
        "docs": "/docs",
        "endpoints": {
            "token": "/token - POST for getting token",
            "me": "/users/me - GET for user info (requires token)",
            "test": "/test - GET for testing (no auth required)"
        }
    }

@app.get("/test")
async def test_endpoint():
    """
    Тестовый эндпоинт для проверки работоспособности сервера
    """
    return {
        "status": "success",
        "message": "Test endpoint is working"
    }

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    users_db = get_users_db()
    user = authenticate_user(users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/check-token")
async def check_token(token: str = None):
    """
    Проверка валидности токена без аутентификации
    """
    if not token:
        return {"valid": False, "error": "No token provided"}
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            return {"valid": False, "error": "Invalid token payload"}
        
        # Проверяем, есть ли пользователь
        user = get_user(get_users_db(), username)
        if not user:
            return {"valid": False, "error": "User not found"}
        
        # Проверяем срок действия
        if "exp" in payload:
            expiration = datetime.fromtimestamp(payload["exp"])
            if datetime.utcnow() > expiration:
                return {"valid": False, "error": "Token expired", "expires": str(expiration)}
            
        return {"valid": True, "username": username, "expires": str(datetime.fromtimestamp(payload["exp"]))}
    except jwt.PyJWTError as e:
        return {"valid": False, "error": f"JWT error: {str(e)}"}
    except Exception as e:
        return {"valid": False, "error": f"Unexpected error: {str(e)}"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/users", response_model=list[UserResponse])
async def get_users(current_user: User = Depends(get_current_active_user)):
    """
    Получение списка всех пользователей (только для авторизованных)
    """
    users_db = get_users_db()
    return [UserResponse(username=username, disabled=user["disabled"]) 
            for username, user in users_db.items()]

@app.post("/users", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    current_user: User = Depends(get_current_active_user)
):
    """
    Создание нового пользователя (только для авторизованных)
    """
    users_db = get_users_db()
    
    if user.username in users_db:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "username": user.username,
        "hashed_password": hashed_password,
        "disabled": False
    }
    
    users_db[user.username] = new_user
    
    # Сохраняем обновленную базу пользователей
    with open(os.path.join(os.path.dirname(__file__), "users.json"), "w") as f:
        json.dump(users_db, f, indent=4)
    
    return UserResponse(username=user.username, disabled=False)

@app.delete("/users/{username}")
async def delete_user(
    username: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Удаление пользователя (только для авторизованных)
    """
    users_db = get_users_db()
    
    if username not in users_db:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Нельзя удалить самого себя
    if username == current_user.username:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete yourself"
        )
    
    del users_db[username]
    
    # Сохраняем обновленную базу пользователей
    with open(os.path.join(os.path.dirname(__file__), "users.json"), "w") as f:
        json.dump(users_db, f, indent=4)
    
    return {"message": "User deleted successfully"}

# Запуск приложения
if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run(app, host="0.0.0.0", port=8000)