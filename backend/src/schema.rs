use diesel::table;

table! {
    users (id) {
        id -> Integer,
        username -> Text,
        email -> Text,
        password_hash -> Text,
        access_token -> Text,
        created_at -> Timestamp,
        activated -> Bool,
        user_type -> Text,
    }
}

table! {
    cards (id) {
        id -> Integer,
        name -> Text,
        mana_cost -> Text,
        card_type -> Text,
        oracle_text -> Text,
        power -> Integer,
        toughness -> Integer,
        rarity -> Text,
        set_code -> Text,
    }
}
