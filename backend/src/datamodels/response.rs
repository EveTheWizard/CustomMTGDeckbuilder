use rocket::serde::Deserialize;
use rocket_db_pools::Database;
// Use `serde` to deserialize query parameters

#[derive(Deserialize, FromForm, Debug)]
pub struct CardQuery {
    pub name: Option<String>,    // Filter by name (e.g., partial match)
    pub rarity: Option<String>, // Filter by rarity (e.g., common, rare)
    pub mana_cost: Option<String>, // Filter by rarity (e.g., common, rare)
    pub card_type: Option<String>, // Filter by card type (e.g., instant, creature)
    pub power: Option<String>, // Filter by card type (e.g., instant, creature)
    pub toughness: Option<String>, // Filter by card type (e.g., instant, creature)
    pub colors: Option<String>,
    pub mana_value: Option<i32>,
    pub colors_exact: Option<String>,
    pub colors_subset: Option<String>,
    pub colors_superset: Option<String>,
    pub T: Option<String>,
    pub CT: Option<String>,
    pub mv_exact: Option<i32>,
    pub mv_superset: Option<i32>,
    pub mv_subset: Option<i32>
}