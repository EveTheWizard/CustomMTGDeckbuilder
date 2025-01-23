mod datamodels;
mod routes;
mod utils;
mod db;
mod schema;

#[macro_use]
extern crate rocket;

use dotenv::dotenv;
use rocket::response::status;
use rocket::http::Method;
use rocket_db_pools::{sqlx, Database, Connection};
//use rocket_contrib::json::Json;
use rocket::serde::json::Json;
//use rocket_db_pools::sqlx::types::Json;
use rocket_db_pools::sqlx::query_as;
use serde::{Deserialize, Serialize};
use sqlx::Acquire;
use crate::datamodels::models::{Card};
use crate::datamodels::deck::{Deck, DeckCard};
use rocket_cors::{AllowedHeaders, AllowedOrigins, CorsOptions};
use crate::db::connection::establish_connection;
use crate::db::connection::Postgres;

#[get("/")]
fn index() -> &'static str {
    "Welcome to the MTG Deckbuilder API!"
}

#[get("/cards")]
async fn list_cards(mut conn: Connection<Postgres>) -> Result<Json<Vec<Card>>, rocket::http::Status> {
    // Acquire the SQLx connection explicitly
    let pg_conn = conn.acquire().await.map_err(|_| rocket::http::Status::InternalServerError)?;

    // Use the acquired connection for the query
    let result = sqlx::query_as!(
    Card,
    r#"SELECT id, name, mana_cost, card_type, oracle_text, power, toughness, rarity, set_code FROM cards"#)
        .fetch_all(pg_conn) // Pass the acquired SQLx-compatible connection
        .await
        .map_err(|_| rocket::http::Status::InternalServerError)?;

    Ok(Json(result))
}


#[launch]
fn rocket() -> _ {
    dotenv().ok();

    let cors = CorsOptions {
        // Allow all origins
        allowed_origins: AllowedOrigins::all(),
        // Allow commonly used HTTP methods
        allowed_methods: vec![Method::Get, Method::Post, Method::Patch, Method::Put, Method::Delete]
            .into_iter()
            .map(From::from)
            .collect(),
        // Allow the "Content-Type" header
        allowed_headers: AllowedHeaders::some(&["Content-Type", "Authorization"]),
        allow_credentials: true,
        ..Default::default()
    }
        .to_cors()
        .expect("Error creating CORS fairing");

    let pool = establish_connection();

    rocket::build()
        .attach(Postgres::init())
        .manage(pool)
        .mount("/", routes![index, list_cards, routes::auth::register, routes::auth::login, routes::decks::list_decks,
        routes::decks::get_single_deck, routes::decks::add_card, routes::decks::increment_card_quantity, routes::decks::decrement_card_quantity ],  )
        .attach(cors)
}

