use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sqlx::Acquire;
use crate::datamodels::models::Card;
use crate::db::connection::Postgres;

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

