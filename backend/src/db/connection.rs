use diesel::r2d2::{self, ConnectionManager};
use diesel::PgConnection;
use rocket_db_pools::Database;

pub type Pool = r2d2::Pool<ConnectionManager<PgConnection>>;
pub type Connection = r2d2::PooledConnection<ConnectionManager<PgConnection>>;

#[derive(Database)]
#[database("postgres_db")]
pub struct Postgres(sqlx::PgPool);

pub fn establish_connection() -> Pool {
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::builder()
        .build(manager)
        .expect("Failed to create database connection pool")
}
