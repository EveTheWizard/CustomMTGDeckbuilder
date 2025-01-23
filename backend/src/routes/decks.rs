use jsonwebtoken::errors::Error;
use jsonwebtoken::TokenData;
use rocket::http::Status;
use rocket::serde::Deserialize;
use rocket::serde::json::{json, Json};
use rocket_db_pools::Connection;
use serde_json::Value;
use sqlx::Acquire;
use crate::datamodels::models::{Card};
use crate::datamodels::deck::{Deck, DeckCard, DeckCardWithDetails};
use crate::datamodels::users::{Claims, Token};
use crate::db::connection::Postgres;
use crate::utils::verify_jwt;

#[get("/api/decks")]
pub async fn list_decks(
        mut conn: Connection<Postgres>,
        token: Option<Token<'_>>,
    )
    -> Result<Json<Vec<Deck>>, rocket::http::Status> {
    // Acquire the SQLx connection explicitly
    let pg_conn = conn.acquire().await.map_err(|_| rocket::http::Status::InternalServerError)?;

    if let Some(token) = token {
        // Verify the JWT and extract Claims
        match verify_jwt(token) {
            Ok(claims) => {
                println!("Claims: {:?}", claims);
                let user_id = claims.sub; // Extract user_id from claims
                // Run SQL query using user_id for authenticated requests
                let decks = sqlx::query_as!(
                    Deck,
                    r#"
                    SELECT * FROM decks
                    WHERE visibility = 'public'
                    OR creator_id = $1
                    "#,
                    user_id
                )
                    .fetch_all(pg_conn)
                    .await
                    .map_err(|_| Status::InternalServerError)?;

                // Return the decks for the authenticated user
                return Ok(Json(decks));
            }
            Err(_) => {
                // If the JWT verification fails, return Unauthorized
                println!("JWT verification failed");
                return Err(Status::Unauthorized);
            }
        }
    }

    // If there's no token, fetch only public decks
    let decks = sqlx::query_as!(
        Deck,
        r#"SELECT * FROM decks WHERE visibility = 'public'"#
    )
        .fetch_all(pg_conn)
        .await
        .map_err(|_| Status::InternalServerError)?;

    // Return the public decks
    Ok(Json(decks))
}

#[get("/api/decks/<deck_id>")]
pub async fn get_single_deck(
    mut conn: Connection<Postgres>,
    deck_id: i32, // Deck ID from the request path
    token: Option<Token<'_>>, // Optional JWT token
) -> Result<Json<Value>, Status> {
    // Acquire the SQLx connection explicitly
    let pg_conn = conn.acquire().await.map_err(|_| Status::InternalServerError)?;

    println!("Deck ID: {}", deck_id);

    if let Some(token) = token {
        // Verify the JWT and extract Claims
        match verify_jwt(token) {
            Ok(claims) => {
                let user_id = claims.sub; // Extract user_id from claims

                // Fetch the deck if the user has access (public or owned by the user)
                let deck = sqlx::query_as!(
                    Deck,
                    r#"
                    SELECT *
                    FROM decks
                    WHERE id = $1 AND (visibility = 'public' OR creator_id = $2)
                    "#,
                    deck_id,
                    user_id
                )
                    .fetch_optional(&mut *pg_conn)
                    .await
                    .map_err(|_| Status::InternalServerError)?;

                let cards = sqlx::query_as!(
                    DeckCardWithDetails,
                    r#"
                    SELECT
                        deck_cards.card_id,
                        deck_cards.deck_id,
                        deck_cards.quantity,
                        deck_cards.board,
                        cards.name AS card_name,
                        cards.card_type AS card_type,
                        cards.mana_cost AS mana_cost,
                        cards.oracle_text AS o_text,
                        cards.set_code AS set_code,
                        cards.colors AS colors
                    FROM deck_cards
                    JOIN cards ON deck_cards.card_id = cards.id
                    WHERE deck_cards.deck_id = $1
                    AND deck_cards.quantity > 0
                    ORDER BY cards.card_type ASC
                    "#,
                    deck_id
                )
                    .fetch_all(&mut *pg_conn)
                    .await
                    .map_err(|_| Status::InternalServerError)?;

                let mainboard: Vec<DeckCardWithDetails> = cards
                    .iter()
                    .filter(|card| card.board == "mainboard")
                    .cloned()
                    .collect();

                let sideboard: Vec<DeckCardWithDetails> = cards
                    .iter()
                    .filter(|card| card.board == "sideboard")
                    .cloned()
                    .collect();

                if let Some(mut deck) = deck {
                    //let cards_json = serde_json::to_value(cards).map_err(|_| Status::InternalServerError)?;
                    //println!("Cards: {:?}", cards_json[0]);
                    //deck.mainboard = cards_json;
                    return Ok(Json(json!({
                        "deck": deck,
                        "mainboard": mainboard,
                        "sideboard": sideboard,
                    })))
                } else {
                    return Err(Status::NotFound)
                }
            }
            Err(_) => {
                // If the JWT verification fails, return Unauthorized
                println!("JWT verification failed");
                return Err(Status::Unauthorized);
            }
        }
    }

    // If there's no token, fetch only public decks
    let deck = sqlx::query_as!(
        Deck,
        r#"
        SELECT *
        FROM decks
        WHERE id = $1 AND visibility = 'public'
        "#,
        deck_id
    )
        .fetch_optional(&mut *pg_conn)
        .await
        .map_err(|_| Status::InternalServerError)?;

    let cards = sqlx::query_as!(
                    DeckCardWithDetails,
                    r#"
                    SELECT
                        deck_cards.card_id,
                        deck_cards.deck_id,
                        deck_cards.quantity,
                        deck_cards.board,
                        cards.name AS card_name,
                        cards.card_type AS card_type,
                        cards.mana_cost AS mana_cost,
                        cards.oracle_text AS o_text,
                        cards.set_code AS set_code,
                        cards.colors AS colors
                    FROM deck_cards
                    JOIN cards ON deck_cards.card_id = cards.id
                    WHERE deck_cards.deck_id = $1
                    AND deck_cards.quantity > 0
                    ORDER BY cards.card_type ASC
                    "#,
                    deck_id
                )
        .fetch_all(&mut *pg_conn)
        .await
        .map_err(|_| Status::InternalServerError)?;

    let mainboard: Vec<DeckCardWithDetails> = cards
        .iter()
        .filter(|card| card.board == "mainboard")
        .cloned()
        .collect();

    let sideboard: Vec<DeckCardWithDetails> = cards
        .iter()
        .filter(|card| card.board == "sideboard")
        .cloned()
        .collect();

    if let Some(mut deck) = deck {
        //let cards_json = serde_json::to_value(cards).map_err(|_| Status::InternalServerError)?;
        //println!("Cards: {:?}", cards_json[0]);
        //deck.mainboard = cards_json;
        Ok(Json(json!({
                        "deck": deck,
                        "mainboard": mainboard,
                        "sideboard": sideboard,
                    })))
    } else {
        Err(Status::NotFound)
    }
}

#[derive(Debug, Deserialize)]
pub struct AddCardPayload {
    card_id: i32, // The ID of the card to add
}

#[post("/decks/<deck_id>/addCard", data = "<payload>")]
pub async fn add_card(
    mut conn: Connection<Postgres>,
    deck_id: i32, // Deck ID from the route
    payload: Json<AddCardPayload>, // Card ID from the request body
    token: Option<Token<'_>>, // JWT token for authentication
) -> Result<Status, Status> {
    // Acquire a database connection
    let pg_conn = conn.acquire().await.map_err(|_| Status::InternalServerError)?;

    println!("Payload: {}", payload.card_id);
    // Check if the token exists
    if let Some(token) = token {
        // Verify the JWT token
        match verify_jwt(token) {
            Ok(claims) => {
                let user_id = claims.sub; // Get user ID from JWT claims

                println!("JWT verified successfully.");

                // Check if the user owns the deck or the deck is public
                let owning_deck = sqlx::query!(
                    r#"
                    SELECT id
                    FROM decks
                    WHERE id = $1 AND creator_id = $2
                    "#,
                    deck_id,
                    user_id
                )
                    .fetch_optional(&mut *pg_conn)
                    .await
                    .map_err(|_| Status::InternalServerError)?;

                if owning_deck.is_none() {
                        println!("User does not own this deck.");
                        return Err(Status::Forbidden); // User doesn't own the deck
                }

                // Check if the card exists
                let valid_card = sqlx::query!(
                    r#"
                    SELECT id
                    FROM cards
                    WHERE id = $1
                    "#,
                    payload.card_id
                )
                    .fetch_optional(&mut *pg_conn)
                    .await
                    .map_err(|_| Status::InternalServerError)?;

                println!("Card exists");
                if valid_card.is_none() {
                    return Err(Status::NotFound); // Card doesn't exist
                }

                // Insert the association into the deck_cards table
                let insert_result = sqlx::query!(
                    r#"
                    INSERT INTO deck_cards (deck_id, card_id, quantity, board)
                    VALUES ($1, $2, 1, 'mainboard')
                    "#,
                    deck_id,
                    payload.card_id
                )
                    .execute(&mut *pg_conn)
                    .await;
                println!("Inserted into deck_cards");

                // Check if the insertion was successful
                if let Err(_) = insert_result {
                    let update_result = sqlx::query!(
                    r#"
                    UPDATE deck_cards SET quantity = 1
                    WHERE deck_id = $1 AND card_id = $2
                    "#,
                    deck_id,
                    payload.card_id
                )
                        .execute(pg_conn)
                        .await;

                    if let Err(_) = insert_result {
                        println!("Failed to insert into deck_cards");
                        return Err(Status::InternalServerError); // Database error
                    }
                }

                // Return success
                Ok(Status::Ok)
            }
            Err(_) => Err(Status::Unauthorized), // Invalid token
        }
    } else {
        Err(Status::Unauthorized) // No token provided
    }
}

#[put("/decks/<deck_id>/cards/<card_id>/increment")]
pub async fn increment_card_quantity(
    mut conn: Connection<Postgres>,
    deck_id: i32,
    card_id: i32,
    token: Option<Token<'_>>,
) -> Result<Json<Value>, Status> {
    let pg_conn = conn.acquire().await.map_err(|_| Status::InternalServerError)?;

    if let Some(token) = token {
        match verify_jwt(token) {
            Ok(claims) => {
                let user_id = claims.sub;

                sqlx::query!(
                    r#"
                    UPDATE deck_cards
                    SET quantity = quantity + 1
                    WHERE deck_id = $1 AND card_id = $2
                    "#,
                    deck_id,
                    card_id
                )
                    .execute(pg_conn)
                    .await
                    .map_err(|_| Status::InternalServerError)?;

                return Ok(Json(json!({
                        "card_id": card_id,
                    })))
            }
            Err(_) => Err(Status::Unauthorized),
        }
    } else {
        Err(Status::Unauthorized)
    }
}

#[put("/decks/<deck_id>/cards/<card_id>/decrement")]
pub async fn decrement_card_quantity(
    mut conn: Connection<Postgres>,
    deck_id: i32,
    card_id: i32,
    token: Option<Token<'_>>,
) -> Result<Status, Status> {
    if let Some(token) = token {
        // Same logic as increment, but with `quantity - 1` and additional check for `quantity > 0`
        sqlx::query!(
            r#"
            UPDATE deck_cards
            SET quantity = GREATEST(quantity - 1, 0)
            WHERE deck_id = $1 AND card_id = $2
            "#,
            deck_id,
            card_id
        )
            .execute(conn.acquire().await.map_err(|_| Status::InternalServerError)?)
            .await
            .map_err(|_| Status::InternalServerError)?;

        Ok(Status::Ok)
    } else {
        Err(Status::Unauthorized)
    }
}