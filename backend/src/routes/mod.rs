pub mod auth;
mod cards;

use rocket::Route;

pub fn routes() -> Vec<Route> {
    routes![auth::register]
}
