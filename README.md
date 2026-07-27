--name task-postgres → name of our database container
POSTGRES_USER=admin → database username
POSTGRES_PASSWORD=password123 → database password
POSTGRES_DB=task_platform → database name
-p 5432:5432 → expose PostgreSQL port
-d postgres → run PostgreSQL in background