#[derive(serde::Serialize)]
struct Card {
    id: i32,
    name: String,
    mana_cost: Option<String>,
    card_type: String,
    oracle_text: Option<String>,
}

pub struct CardList {
    cards: Vec<Card>,
}

pub struct CardDetail {
    card: Card,
}

pub struct CardSearch {
    cards: Vec<Card>,
}

