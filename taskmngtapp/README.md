# Task Management App (taskmngtapp)

A task management web application built with **Laravel 12**, **Vue**, and **Tailwind CSS**, using **PostgreSQL** as the database.

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm
- PostgreSQL and pgAdmin
- Git
- XAMPP (optional, for the `htdocs` folder)

## Installation

### 1. Clone the repository

Open Command Prompt or the Visual Studio Code terminal, navigate to your web folder, and clone the project:

```bash
cd C:\xampp\htdocs\taskapp
git clone https://github.com/RyanClarkEspinosa/taskmngtapp
```

### 2. Open the project folder

```bash
cd taskmngtapp/taskmngtapp
```

### 3. Install dependencies

```bash
composer install
npm install
```

### 4. Create the environment file

```bash
copy .env.example .env
php artisan key:generate
```

### 5. Configure the database

Create an empty PostgreSQL database named `taskmngtapp` in pgAdmin. Then open `.env` and update the following values with your own credentials:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=taskmngtapp
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 6. Set up the database tables

The database file is located at:

```
taskapp/taskmngtapp/taskmngtapp/taskmngtapp.sql
```

Choose **one** of the following:

- **Import the SQL file:** in pgAdmin, right-click the `taskmngtapp` database, choose **Restore** (or open the **Query Tool** and run the contents of `taskmngtapp.sql`).
- **Run the migrations:**

```bash
  php artisan migrate
```

> If you imported `taskmngtapp.sql` and it already created the tables, skip `php artisan migrate`, as it may report that the tables already exist.

### 7. Clear the caches

```bash
php artisan config:clear
php artisan optimize:clear
```

### 8. Run the application

Open two terminals in the project folder.

**Terminal 1 (backend):**

```bash
php artisan serve
```

**Terminal 2 (frontend):**

```bash
npm run dev
```

Open the application at **http://127.0.0.1:8000**.

## Troubleshooting

| Problem                         | Solution                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `could not find driver`         | In `C:\xampp\php\php.ini`, remove the `;` before `extension=pdo_pgsql` and `extension=pgsql`, then restart `php artisan serve`. |
| `No application encryption key` | Run `php artisan key:generate`.                                                                                                 |
| `Vite manifest not found`       | Run `npm run dev` or `npm run build`.                                                                                           |
| 500 Server Error                | Check `storage/logs/laravel.log` for the exact message.                                                                         |
| Changes to `.env` not applied   | Run `php artisan config:clear`.                                                                                                 |
