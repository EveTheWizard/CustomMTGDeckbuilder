use diesel::{Insertable, Queryable};
use crate::schema::users;
use rocket::serde::{Deserialize, Serialize, json::Json};

#[derive(Queryable, Serialize, Deserialize, sqlx::FromRow, Debug)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub user_type: String,
    pub access_token: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub activated: bool,
}

#[derive(Insertable, Deserialize)]
#[table_name = "users"]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub user_type: String,
    pub created_at: chrono::NaiveDateTime,
    pub activated: bool,
}

#[derive(Debug, Deserialize)]
pub struct NewUserRequest {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub(crate) username: String,
    pub(crate) password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub(crate) message: String,
    pub(crate) status: String,
    pub(crate) token: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct Claims {
    pub(crate) sub: i32,                // Subject (User ID, for example)
    pub(crate) exp: usize,              // Expiration time (in seconds since epoch)
}
