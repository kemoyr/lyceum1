# Учебная Платформа

Проект представляет собой веб-приложение с учебными материалами, включающее бэкенд на FastAPI и фронтенд на Next.js.

## Обзор архитектуры:

*   **Бэкенд (`lyceum1/back/`)**:
    *   Написан на Python с использованием FastAPI.
    *   Управляет аутентификацией пользователей и предоставляет API для доступа к учебным материалам.
    *   Использует PostgreSQL в качестве базы данных.
*   **Фронтенд (`lyceum1/front1/`)**:
    *   Разработан с использованием Next.js.
    *   Взаимодействует с бэкендом для отображения данных и управления пользовательским интерфейсом.

## Требования для запуска:

*   **Python** (версия 3.8 или выше)
*   **Pip**
*   **Node.js** (версия 16 или выше)
*   **NPM** или **Yarn**
*   **PostgreSQL**

## Настройка и запуск

### 1. Клонирование репозитория

```bash
git clone <https://github.com/kemoyr/lyceum1.git>
```

### 2. Настройка Бэкенда

**a. Установка PostgreSQL:**

*   **macOS (с использованием Homebrew):**
    ```bash
    brew install postgresql
    brew services start postgresql 
    ```
*   **Linux (Ubuntu/Debian):**
    ```bash
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    ```
*   **Windows:** Загрузите установщик с [официального сайта PostgreSQL](https://www.postgresql.org/download/windows/).

**b. Создание базы данных и пользователя PostgreSQL:**

   Войдите в консоль `psql`:
   ```bash
   sudo -u postgres psql # Для Linux
   psql postgres        # Для macOS (после установки через Homebrew)
   ```

   Внутри `psql` выполните следующие команды (замените `your_db_name`, `your_db_user`, `your_db_password` на желаемые значения):
   ```sql
   CREATE DATABASE your_db_name;
   CREATE USER your_db_user WITH PASSWORD 'your_db_password';
   ALTER DATABASE your_db_name OWNER TO your_db_user;
   GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_db_user;
   \q 
   ```

**c. Конфигурация подключения к БД в приложении:**

   Откройте файл `/back/back.py` и найдите секцию с параметрами подключения:

   ```python
   DB_HOST = "localhost"
   DB_NAME = "your_db_name"
   DB_USER = "your_db_user"
   DB_PASS = "your_db_password"
   DB_PORT = "5432"
   ```

   Замените значения на те, что вы настроили для вашей локальной PostgreSQL.

**d. Установка зависимостей Python:**

   ```bash
   cd /back
   pip install -r requirements.txt
   ```

**e. Запуск бэкенд-сервера:**

   Находясь в каталоге `/back`, запустите сервер:

   ```bash
   python back.py
   ```

   Или через Uvicorn:

   ```bash
   uvicorn back:app --reload --port 8000
   ```

   Бэкенд будет по адресу `http://localhost:8000` с логином и паролем `admin`. 

### 3. Настройка Фронтенда (`/front1`)

**a. Установка зависимостей Node.js:**

   Перейдите в каталог фронтенда и установите зависимости:

   ```bash
   cd ../front1  # Если вы были в /back
   ```

   Если используется `npm`:

   ```bash
   npm install
   ```

   Если используется `yarn`:

   ```bash
   yarn install
   ```

**b. Запуск фронтенд сервера:**

   Находясь в каталоге `/front1`:
   Если используется `npm`:

   ```bash
   npm run dev
   ```

   Если используется `yarn`:

   ```bash
   yarn dev
   ```

   Фронтенд будет по адресу `http://localhost:3000`.

## Доступ к приложению

После запуска бэкенда и фронтенда:

1. Откройте веб-браузер.
2. Перейдите по адресу фронтенда (обычно `http://localhost:3000`).