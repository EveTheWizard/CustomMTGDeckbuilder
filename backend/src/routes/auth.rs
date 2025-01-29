use chrono::Utc;
use rocket::serde::{json::Json};
use rocket::State;
use crate::{datamodels, datamodels::users::NewUser, schema::users};
use crate::utils::{generate_jwt, hash_password, verify_jwt};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager };
use diesel::row::NamedRow;
use rocket::http::{CookieJar, Status};
use rocket::response::status;
use rocket_db_pools::{sqlx, Database, Connection};
//use jsonwebtoken::create
use sqlx::{Acquire, PgPool};
use argon2::{self, Argon2, PasswordVerifier, password_hash::PasswordHash};
use crate::datamodels::users::{NewUserRequest, User};
use crate::db::connection::Pool;
use crate::datamodels::users::{ LoginRequest, LoginResponse, Claims };
use crate::db::connection::Postgres;

#[post("/api/register", data = "<new_user>")]
pub async fn register(
    new_user: Json<NewUserRequest>,
    pool: &State<Pool>,
) -> Result<Json<&'static str>, String> {
    println!("New User Json: {:?}", new_user);
    let new_user = new_user.into_inner();
    let mut conn = pool.get().map_err(|_| "Failed to get database connection")?;
    let password_hash = hash_password(&new_user.password)
        .map_err(|_| "Failed to hash password")?;

    let new_user = NewUser {
        username: new_user.username.clone(),
        email: new_user.email.clone(),
        password_hash: password_hash.clone(),
        user_type: "user".to_string(),
        created_at: Utc::now().naive_utc(),
        activated: false,
    };

    diesel::insert_into(users::table)
        .values(&new_user)
        .execute(&mut conn)
        .map_err(|_| "Failed to insert user")?;

    Ok(Json("User registered successfully"))
}


#[post("/api/login", format = "json", data = "<login_request>")]
pub async fn login(
    mut conn: Connection<Postgres>,
    login_request: Json<LoginRequest>,
    cookies: &CookieJar<'_>,
) -> Result<Json<LoginResponse>, status::Custom<Json<LoginResponse>>> {
    let pg_conn = conn.acquire().await.map_err(|_| status::Custom(Status::InternalServerError, Json(LoginResponse { message: "Error accessing database".into(), status: "100 ERROR".to_string(), token: None })) )?;

    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = $1")
        .bind(&login_request.username)
        .fetch_optional(pg_conn)
        .await
        .map_err(|_| status::Custom(Status::InternalServerError, Json(LoginResponse { message: "Error with Query".into(), status: "100 ERROR".to_string(), token: None })))?;

    /*
        match user {
            Ok(Some(user)) => {
                // Query succeeded, user found
                println!("User found: {:?}", user);
            }
            Ok(None) => {
                // Query succeeded but user was not found
                eprintln!("No user found for username: {}", login_request.username);
            }
            Err(e) => {
                // Query failed, print the error
                eprintln!("SQL Error: {:?}", e); // Debug-level error logging
                return Err(status::Custom(
                    Status::InternalServerError,
                    Json(LoginResponse {
                        message: "Internal Server Error".into(),
                        status: "500 ERROR".into(),
                        token: None,
                    })
                ));
            }
        }
        */

        if let Some(user) = user {
            // Verify hashed password
            let argon2 = Argon2::default();
            if let Ok(parsed_hash) = PasswordHash::new(&user.password_hash) {
                if argon2.verify_password(
                    login_request.password.as_bytes(),
                    &parsed_hash,
                ).is_ok() {
                    // Option 1: Return a JWT
                    let jwt_token = generate_jwt(user.id, user.password_hash ).map_err(|_| {
                        status::Custom(
                            Status::InternalServerError,
                            Json(LoginResponse { message: "Failed to generate JWT".to_string(), status: "".to_string(), token: Option::from("".to_string()) }), // Replace with appropriate error response
                        )
                    })?;
                    println!("JWT Token generated: {}", jwt_token);
                    return Ok(Json(LoginResponse { message: "Login successful".into(), status: "200 OK".to_string(), token: Some(jwt_token) }));
                } else {
                    //Handle failed verify password
                    return Err(status::Custom(Status::Unauthorized, Json(LoginResponse { message: "Invalid credentials".into(), status: "580 ERROR".to_string(), token: None })))
                }
            } else {
                //Handle failed parsed hash

            }
        }

    return Err(status::Custom(Status::Unauthorized, Json(LoginResponse { message: "Invalid credentials".into(), status: "580 ERROR".to_string(), token: None })))
}

#[get("/api/verify_login")]
pub async fn verify_login(
    mut conn: Connection<Postgres>,
    cookies: &CookieJar<'_>,
) -> Result<Json<User>, Status> {
    // Extract JWT from cookie or localStorage equivalent (if using headers)
    let token = cookies.get("jwt").map(|cookie| cookie.value().to_string());

    if let Some(token) = token {
        match verify_jwt(&token) {
            Ok(claims) => {
                // Fetch user from database using claims.user_id
                let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
                    .bind(claims.user_id)
                    .fetch_one(&mut *conn)
                    .await
                    .map_err(|_| Status::Unauthorized)?;

                return Ok(Json(user));
            }
            Err(_) => return Err(Status::Unauthorized),
        }
    }

    Err(Status::Unauthorized)
}