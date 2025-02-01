use rocket::serde::{json::Json, Deserialize, Serialize};

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
    pub set_code: Option<String>,
    pub mv_exact: Option<i32>,
    pub mv_superset: Option<i32>,
    pub mv_subset: Option<i32>,
    pub t_exact: Option<i32>,
    pub t_superset: Option<i32>,
    pub t_subset: Option<i32>,
    pub p_exact: Option<i32>,
    pub p_superset: Option<i32>,
    pub p_subset: Option<i32>
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct SingleStringPayload {
    pub data: String // The ID of the card to add
}
