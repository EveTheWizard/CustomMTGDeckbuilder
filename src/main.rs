#[macro_use]
extern crate rocket;

use rocket::response::status;
use rocket_db_pools::{sqlx, Database, Connection};
use rocket_contrib::json::Json;
use rocket::serde::json::Json;
use serde::{Deserialize, Serialize};

#[derive(Database)]
#[database("postgres_db")]
struct Postgres(sqlx::PgPool);

#[get("/")]
fn index() -> &'static str {
    "Welcome to the MTG Deckbuilder API!"
}

#[get("/cards")]
async fn list_cards(conn: Connection<Postgres>) -> Json<Vec<Card>> {
    let result = sqlx::query_as!(Card, "SELECT id, name, mana_cost, type as card_type, oracle_text FROM cards")
        .fetch_all(&*conn)
        .await
        .unwrap();
    Json(result)
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Postgres::init())
        .mount("/", routes![index])
}

