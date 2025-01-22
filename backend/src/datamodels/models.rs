use serde::{Deserialize, Serialize};
//use rocket_db_pools::sqlx::FromRow;
//use sqlx::FromRow;
// Use FromRow from rocket_db_pools’s sqlx

/// Represents a single card in your database
#[derive(Debug, Serialize, Deserialize, rocket_db_pools::sqlx::FromRow )]
pub struct Card {
    pub id: i32,                  // Primary key
    pub name: Option<String>,             // Card name
    pub mana_cost: Option<String>, // Optional mana cost (e.g., "{G}{G}")
    pub card_type: Option<String>,        // Card type (e.g., Creature, Sorcery)
    pub oracle_text: Option<String>, // The rules text of the card (optional)
    pub power: Option<String>,       // Power for creatures
    pub toughness: Option<String>,   // Toughness for creatures
    pub rarity: Option<String>,           // Card rarity (e.g., common, rare)
    pub set_code: Option<String>,           // Card rarity (e.g., common, rare)
}

/// Represents a deck in your database
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Deck {
    pub id: i32,           // Primary key
    pub name: String,      // Deck name
    pub creator_id: i32,   // Foreign key to the `users` table
}

/// Represents the relationship between a deck and its cards
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct DeckCard {
    pub deck_id: i32,  // Foreign key to the `decks` table
    pub card_id: i32,  // Foreign key to the `cards` table
    pub quantity: i32, // Quantity of this card in the deck
}

