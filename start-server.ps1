# Script to start Laravel server with SQLite database
$env:DB_CONNECTION = "sqlite"
$env:DB_DATABASE = "D:\ServBay\www\pt-binasol-app\database\database.sqlite"
$env:DB_FOREIGN_KEYS = "true"

Write-Host "Starting Laravel server with SQLite database..." -ForegroundColor Green
Write-Host "Database: $env:DB_DATABASE" -ForegroundColor Cyan

php artisan serve --host=localhost --port=8000
