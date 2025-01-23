pub mod auth;
mod cards;
pub(crate) mod decks;

use rocket::Route;

pub fn routes() -> Vec<Route> {
    routes![auth::register]
}
