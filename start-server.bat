@echo off
echo Starting Laravel server with SQLite database...
set DB_CONNECTION=sqlite
set DB_DATABASE=D:\ServBay\www\pt-binasol-app\database\database.sqlite
set DB_FOREIGN_KEYS=true
echo Database: %DB_DATABASE%
php artisan serve --host=localhost --port=8000
