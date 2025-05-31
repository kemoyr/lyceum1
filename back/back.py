from fastapi import FastAPI, Depends, HTTPException, status, Query # type: ignore
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel, RootModel # type: ignore
from typing import Optional, List, Dict
import jwt # type: ignore
from datetime import datetime, timedelta
from passlib.context import CryptContext # type: ignore
import psycopg2 # type: ignore
from psycopg2.extras import RealDictCursor # type: ignore

# Настройка FastAPI приложения
app = FastAPI(title="Бэкенд для авторизации")

# Настройка CORS для взаимодействия с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Адрес фронтенда
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Секретный ключ для JWT
SECRET_KEY = "your_secret_key"  # В реальном приложении используйте безопасный ключ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Параметры подключения к PostgreSQL (ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ)
DB_HOST = "localhost"
DB_NAME = "mydatabase"
DB_USER = "kemori"
DB_PASS = "02160216"
DB_PORT = "5432"

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

# Модели для учебных материалов
class Resource(BaseModel):
    title: str
    url: Optional[str] = None

class TheoryContent(BaseModel):
    type: str
    content: str
    additional: List[Resource]

class PracticeContent(BaseModel):
    type: str
    content: str
    tasks: List[str]
    additional: List[Resource]

class LessonData(BaseModel):
    theory: TheoryContent
    practice: PracticeContent

class SubjectTopics(RootModel):
    root: Dict[str, LessonData]

class LessonMaterials(RootModel):
    root: Dict[str, SubjectTopics]

# Функции для работы с паролями
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Функции для аутентификации
def get_user(username: str):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user_record = cursor.fetchone()
    cursor.close()
    conn.close()
    if user_record:
        return UserInDB(**user_record)
    return None

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=DB_PORT
    )
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Создание таблицы users
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            hashed_password VARCHAR(255) NOT NULL,
            disabled BOOLEAN DEFAULT FALSE
        );
    """)

    # Создание таблицы subjects
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subjects (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );
    """)

    # Создание таблицы topics
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS topics (
            id SERIAL PRIMARY KEY,
            subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            UNIQUE (subject_id, name)
        );
    """)

    # Создание таблицы materials
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS materials (
            id SERIAL PRIMARY KEY,
            topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
            type VARCHAR(50) NOT NULL, -- 'theory' or 'practice'
            content_type VARCHAR(50) NOT NULL, -- 'text' or 'tasks'
            content TEXT
        );
    """)

    # Создание таблицы additional_materials
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS additional_materials (
            id SERIAL PRIMARY KEY,
            material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            url VARCHAR(255)
        );
    """)

    # Создание таблицы practice_tasks
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS practice_tasks (
            id SERIAL PRIMARY KEY,
            material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
            task_description TEXT NOT NULL
        );
    """)
    
    # Добавление тестового пользователя admin, если его еще нет
    cursor.execute("SELECT username FROM users WHERE username = 'admin';")
    if not cursor.fetchone():
        hashed_password = get_password_hash("admin")
        cursor.execute(
            "INSERT INTO users (username, hashed_password, disabled) VALUES (%s, %s, %s);",
            ("admin", hashed_password, False)
        )

    conn.commit()
    cursor.close()
    conn.close()

# Вызов init_db() при старте приложения
init_db()

def authenticate_user(username: str, password: str):
    user = get_user(username)
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
    user = get_user(username=token_data.username)
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
    user = authenticate_user(form_data.username, form_data.password)
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
        user = get_user(username)
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
async def get_all_users(current_user: User = Depends(get_current_active_user)):
    """
    Получение списка всех пользователей (только для авторизованных)
    """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT username, disabled FROM users")
    users_records = cursor.fetchall()
    cursor.close()
    conn.close()
    return [UserResponse(**user) for user in users_records]

@app.post("/users", response_model=UserResponse)
async def create_new_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_active_user) # Оставляем для проверки прав (например, только админ может создавать)
):
    """
    Создание нового пользователя (только для авторизованных)
    """
    # Проверка, если нужно, что current_user имеет права на создание новых пользователей
    # if current_user.username != "admin": 
    #     raise HTTPException(status_code=403, detail="Not enough permissions")

    existing_user = get_user(user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, hashed_password, disabled) VALUES (%s, %s, %s) RETURNING username, disabled",
            (user_data.username, hashed_password, False)
        )
        new_user_record = cursor.fetchone()
        conn.commit()
    except psycopg2.Error as e: # Обработка возможных ошибок БД
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        cursor.close()
        conn.close()

    if not new_user_record:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    # RealDictCursor не используется для INSERT RETURNING, так что new_user_record будет кортежем
    return UserResponse(username=new_user_record[0], disabled=new_user_record[1])

@app.delete("/users/{username_to_delete}") # Изменено имя параметра для ясности
async def delete_existing_user(
    username_to_delete: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Удаление пользователя (только для авторизованных)
    """
    # Проверка, если нужно, что current_user имеет права на удаление (например, админ)
    # или что пользователь удаляет сам себя (если это разрешено, но сейчас запрещено)

    if username_to_delete == current_user.username:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete yourself"
        )
    
    # Проверка, существует ли пользователь перед удалением
    user_to_delete = get_user(username_to_delete)
    if not user_to_delete:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM users WHERE username = %s RETURNING username", (username_to_delete,))
        deleted_user_record = cursor.fetchone()
        conn.commit()
    except psycopg2.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        cursor.close()
        conn.close()

    if not deleted_user_record:
        # Это может произойти, если пользователь был удален между get_user и DELETE
        raise HTTPException(
            status_code=404,
            detail="User not found or already deleted"
        )
    
    return {"message": f"User '{deleted_user_record[0]}' deleted successfully"}

# Эндпоинты для работы с материалами
@app.get("/materials")
async def get_all_materials_from_db():
    """
    Получение всех учебных материалов из БД
    """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    materials_data = {}

    try:
        # 1. Получаем все предметы
        cursor.execute("SELECT id, name FROM subjects ORDER BY name")
        subjects = cursor.fetchall()

        for subject in subjects:
            subject_name = subject['name']
            materials_data[subject_name] = {}

            # 2. Для каждого предмета получаем его темы
            cursor.execute("SELECT id, name FROM topics WHERE subject_id = %s ORDER BY name", (subject['id'],))
            topics = cursor.fetchall()

            for topic in topics:
                topic_name = topic['name']
                lesson_data = {"theory": None, "practice": None}

                # 3. Для каждой темы получаем ее материалы (теория и практика)
                cursor.execute("""
                    SELECT id, type, content_type, content 
                    FROM materials 
                    WHERE topic_id = %s
                """, (topic['id'],))
                topic_materials = cursor.fetchall()

                for material in topic_materials:
                    material_type = material['type'] # 'theory' or 'practice'
                    content_data = {
                        "type": material['content_type'],
                        "content": material['content'],
                        "additional": [],
                        "tasks": [] # Только для практики
                    }

                    # 4. Получаем дополнительные материалы (ресурсы)
                    cursor.execute("""
                        SELECT title, url 
                        FROM additional_materials 
                        WHERE material_id = %s 
                        ORDER BY id
                    """, (material['id'],))
                    additional_resources = cursor.fetchall()
                    content_data["additional"] = [Resource(**res) for res in additional_resources]

                    if material_type == 'theory':
                        lesson_data['theory'] = TheoryContent(**content_data)
                    elif material_type == 'practice':
                        # 5. Для практических материалов получаем задачи
                        cursor.execute("""
                            SELECT task_description 
                            FROM practice_tasks 
                            WHERE material_id = %s 
                            ORDER BY id
                        """, (material['id'],))
                        practice_tasks_records = cursor.fetchall()
                        content_data["tasks"] = [rec['task_description'] for rec in practice_tasks_records]
                        lesson_data['practice'] = PracticeContent(**content_data)
                
                materials_data[subject_name][topic_name] = LessonData(**lesson_data)
       
    except psycopg2.Error as e:
        # В случае ошибки можно вернуть пустой объект или ошибку сервера
        raise HTTPException(status_code=500, detail=f"Database error while fetching materials: {e}")
    finally:
        cursor.close()
        conn.close()
       
    return materials_data

@app.get("/materials/{subject_name}/{topic_name}")
async def get_specific_lesson_material(
    subject_name: str,
    topic_name: str
):
    """
    Получение материала по конкретной теме из БД
    """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    lesson_data = {"theory": None, "practice": None}

    try:
        # 1. Найти ID предмета
        cursor.execute("SELECT id FROM subjects WHERE name = %s", (subject_name,))
        subject_record = cursor.fetchone()
        if not subject_record:
            raise HTTPException(status_code=404, detail=f"Предмет '{subject_name}' не найден")
        subject_id = subject_record['id']

        # 2. Найти ID темы
        cursor.execute("SELECT id FROM topics WHERE subject_id = %s AND name = %s", (subject_id, topic_name))
        topic_record = cursor.fetchone()
        if not topic_record:
            raise HTTPException(status_code=404, detail=f"Тема '{topic_name}' не найдена в предмете '{subject_name}'")
        topic_id = topic_record['id']

        # 3. Получить материалы (теория и практика) для этой темы
        cursor.execute("""
            SELECT id, type, content_type, content 
            FROM materials 
            WHERE topic_id = %s
        """, (topic_id,))
        topic_materials = cursor.fetchall()

        if not topic_materials:
            # Если для темы нет материалов, это может быть ошибкой или просто пустая тема
             raise HTTPException(status_code=404, detail=f"Материалы для темы '{topic_name}' не найдены")

        for material in topic_materials:
            material_type = material['type']
            content_data = {
                "type": material['content_type'],
                "content": material['content'],
                "additional": [],
                "tasks": []
            }

            # 4. Получить дополнительные материалы (ресурсы)
            cursor.execute("""
                SELECT title, url 
                FROM additional_materials 
                WHERE material_id = %s 
                ORDER BY id
            """, (material['id'],))
            additional_resources = cursor.fetchall()
            content_data["additional"] = [Resource(**res) for res in additional_resources]

            if material_type == 'theory':
                lesson_data['theory'] = TheoryContent(**content_data)
            elif material_type == 'practice':
                # 5. Для практических материалов получить задачи
                cursor.execute("""
                    SELECT task_description 
                    FROM practice_tasks 
                    WHERE material_id = %s 
                    ORDER BY id
                """, (material['id'],))
                practice_tasks_records = cursor.fetchall()
                content_data["tasks"] = [rec['task_description'] for rec in practice_tasks_records]
                lesson_data['practice'] = PracticeContent(**content_data)
        
        # Убедимся, что и теория и практика были найдены, если они должны быть
        # Pydantic модели LessonData ожидают оба поля. Если одно из них None, нужно решить, как это обрабатывать.
        # Можно возвращать частичные данные или требовать наличия обоих.
        # Для простоты, если чего-то нет, оно останется None, и Pydantic может выдать ошибку, если поля обязательные.
        # Если поля в TheoryContent/PracticeContent опциональные или имеют default, это сработает.
        # Проверим, что наши Pydantic модели TheoryContent и PracticeContent могут быть созданы с None.
        # Если LessonData требует и theory и practice, то нужно обеспечить их наличие или изменить модель.
        # В данном случае, если нет теории или практики, соответствующее поле в lesson_data останется None.
        # Модель LessonData(theory: TheoryContent, practice: PracticeContent) требует оба. 
        # Это значит, что тема ДОЛЖНА иметь и теорию и практику.
        # Если это не так, нужно либо сделать поля в LessonData Optional, либо обеспечить их создание.
        # Пока оставим как есть, подразумевая, что каждая тема имеет и теорию и практику.

    except HTTPException: # Перехватываем свои же HTTPException, чтобы не попасть в общий psycopg2.Error
        raise
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        cursor.close()
        conn.close()
    
    # Если после всех операций lesson_data все еще содержит None для theory или practice,
    # а модель LessonData их требует, будет ошибка валидации Pydantic.
    # Это правильное поведение, если мы ожидаем, что каждая тема ПОЛНОСТЬЮ укомплектована.
    if not lesson_data["theory"] or not lesson_data["practice"]:
        # Можно вернуть ошибку, если тема не полная
        raise HTTPException(status_code=404, detail=f"Тема '{topic_name}' не содержит всех необходимых материалов (теория/практика)")

    return LessonData(**lesson_data)

@app.post("/materials/{subject_name}/{topic_name}", response_model=LessonData)
async def create_or_update_lesson_material(
    subject_name: str,
    topic_name: str,
    lesson_data_payload: LessonData, # Изменено имя переменной
    current_user: User = Depends(get_current_active_user) # Авторизация
):
    """
    Создание или обновление материала по теме в БД (требуется авторизация)
    """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        conn.autocommit = False # Начинаем транзакцию

        # 1. Найти или создать предмет
        cursor.execute("SELECT id FROM subjects WHERE name = %s", (subject_name,))
        subject_record = cursor.fetchone()
        if subject_record:
            subject_id = subject_record['id']
        else:
            cursor.execute("INSERT INTO subjects (name) VALUES (%s) RETURNING id", (subject_name,))
            subject_id = cursor.fetchone()['id']

        # 2. Найти или создать тему
        cursor.execute("SELECT id FROM topics WHERE subject_id = %s AND name = %s", (subject_id, topic_name))
        topic_record = cursor.fetchone()
        if topic_record:
            topic_id = topic_record['id']
            # Если тема существует, удаляем старые материалы, чтобы перезаписать
            # Сначала зависимые: additional_materials и practice_tasks
            cursor.execute("""
                DELETE FROM additional_materials 
                WHERE material_id IN (SELECT id FROM materials WHERE topic_id = %s)
            """, (topic_id,))
            cursor.execute("""
                DELETE FROM practice_tasks 
                WHERE material_id IN (SELECT id FROM materials WHERE topic_id = %s AND type = 'practice')
            """, (topic_id,))
            # Затем сами материалы темы
            cursor.execute("DELETE FROM materials WHERE topic_id = %s", (topic_id,))
        else:
            cursor.execute("INSERT INTO topics (subject_id, name) VALUES (%s, %s) RETURNING id", (subject_id, topic_name))
            topic_id = cursor.fetchone()['id']

        # 3. Сохранить теорию
        theory_payload = lesson_data_payload.theory
        cursor.execute("""
            INSERT INTO materials (topic_id, type, content_type, content) 
            VALUES (%s, 'theory', %s, %s) RETURNING id
        """, (topic_id, theory_payload.type, theory_payload.content))
        theory_material_id = cursor.fetchone()['id']

        for res in theory_payload.additional:
            cursor.execute("""
                INSERT INTO additional_materials (material_id, title, url) 
                VALUES (%s, %s, %s)
            """, (theory_material_id, res.title, res.url))

        # 4. Сохранить практику
        practice_payload = lesson_data_payload.practice
        cursor.execute("""
            INSERT INTO materials (topic_id, type, content_type, content) 
            VALUES (%s, 'practice', %s, %s) RETURNING id
        """, (topic_id, practice_payload.type, practice_payload.content))
        practice_material_id = cursor.fetchone()['id']

        for task_desc in practice_payload.tasks:
            cursor.execute("""
                INSERT INTO practice_tasks (material_id, task_description) 
                VALUES (%s, %s)
            """, (practice_material_id, task_desc))

        for res in practice_payload.additional:
            cursor.execute("""
                INSERT INTO additional_materials (material_id, title, url) 
                VALUES (%s, %s, %s)
            """, (practice_material_id, res.title, res.url))

        conn.commit() # Фиксируем транзакцию
        conn.autocommit = True

    except psycopg2.Error as e:
        conn.rollback() # Откатываем изменения в случае ошибки
        conn.autocommit = True
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        cursor.close()
        conn.close()
       
    return lesson_data_payload # Возвращаем исходные данные, так как они были успешно сохранены

@app.delete("/materials/{subject_name}/{topic_name}")
async def delete_specific_lesson_material(
    subject_name: str,
    topic_name: str,
    current_user: User = Depends(get_current_active_user) # Авторизация
):
    """
    Удаление материала по теме из БД (требуется авторизация)
    Удаляет тему и все связанные с ней материалы.
    Если предмет после удаления темы не содержит других тем, он остается.
    """
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    deleted_topic_name = None

    try:
        conn.autocommit = False
        # 1. Найти ID предмета
        cursor.execute("SELECT id FROM subjects WHERE name = %s", (subject_name,))
        subject_record = cursor.fetchone()
        if not subject_record:
            raise HTTPException(status_code=404, detail=f"Предмет '{subject_name}' не найден")
        subject_id = subject_record['id']

        # 2. Найти ID темы и удалить ее (каскадное удаление в БД позаботится об остальном)
        # Связанные записи в `materials`, `additional_materials`, `practice_tasks` будут удалены
        # благодаря ON DELETE CASCADE в определениях таблиц.
        cursor.execute("DELETE FROM topics WHERE subject_id = %s AND name = %s RETURNING name", (subject_id, topic_name))
        deleted_topic_record = cursor.fetchone()
        
        if not deleted_topic_record:
            raise HTTPException(status_code=404, detail=f"Тема '{topic_name}' не найдена в предмете '{subject_name}'")
        
        deleted_topic_name = deleted_topic_record['name']
        conn.commit()
        conn.autocommit = True

    except HTTPException: # Перехват своих ошибок
        conn.rollback()
        conn.autocommit = True
        raise
    except psycopg2.Error as e:
        conn.rollback()
        conn.autocommit = True
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        cursor.close()
        conn.close()
       
    return {"message": f"Материал по теме '{deleted_topic_name}' в предмете '{subject_name}' успешно удален"}

# Запуск приложения
if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run(app, host="0.0.0.0", port=8000)