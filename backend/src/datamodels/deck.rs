use serde::{Deserialize, Serialize};
use crate::schema::cards::oracle_text;

#[derive(Debug, Serialize, Deserialize, rocket_db_pools::sqlx::FromRow )]
pub struct Deck {
    pub id: Option<i32>,
    pub name: Option<String>,
    pub creator_id: Option<i32>,
    pub creator_name: Option<String>,
    pub mainboard: serde_json::Value,
    pub sideboard: serde_json::Value,
    pub visibility: Option<String>,
    pub deck_image: Option<String>,
    pub description: Option<String>,
}

/// Represents the relationship between a deck and its cards
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct DeckCard {
    pub deck_id: i32,  // Foreign key to the `decks` table
    pub card_id: i32,  // Foreign key to the `cards` table
    pub quantity: i32, // Quantity of this card in the deck
    pub board: String, // Quantity of this card in the deck
}


#[derive(Debug, Deserialize, Clone)]
pub struct AddDeckPayload {
    pub name: String, // The ID of the card to add
    pub description: String, // The ID of the card to add
    pub visibility: String, // The ID of the card to add
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, Clone)]
pub struct DeckCardWithDetails {
    pub card_id: i32,
    pub deck_id: i32,
    pub quantity: i32,
    pub board: String,
    pub card_name: String,
    pub card_type: Option<String>,
    pub mana_cost: Option<Vec<String>>,
    pub set_code: Option<String>,
    pub super_types: Option<String>,
    pub colors: Option<Vec<String>>,
    pub o_text: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, Clone)]
pub struct DeckId {
    pub id: i32,
}