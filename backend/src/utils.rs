use argon2::{password_hash::{SaltString, PasswordHasher, Error}, Argon2};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use crate::datamodels::users::Claims;
use dotenv::dotenv;
use std::env;

#[derive(Debug)]
pub enum JwtError {
    GenerationError,
}

impl std::fmt::Display for JwtError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            JwtError::GenerationError => write!(f, "Failed to generate JWT"),
        }
    }
}

impl std::error::Error for JwtError {}

pub(crate) fn hash_password(password: &str) -> Result<String, Error> {
    // Create an Argon2 instance
    let argon2 = Argon2::default();

    // Generate a random salt
    let salt = SaltString::generate(&mut rand::thread_rng());

    // Hash the password
    let password_hash = argon2.hash_password(password.as_bytes(), &salt)?.to_string();

    Ok(password_hash)
}

pub fn generate_jwt(user_id: i32, hash: String ) -> jsonwebtoken::errors::Result<String> {
    // Create the claims
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24)) // Set token expiry to 24 hours
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: user_id,       // Subject: user_id
        hash: hash,
        exp: expiration as usize, // Expiration: now + 24 hours
    };

    // Define your secret key
    let secret_key = get_secret_key().as_bytes(); // Replace with a strong secret and keep it secure

    // Encode the claims into a JWT
    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret_key.as_ref()))
}

fn verify_jwt(token: &str) -> Result<TokenData<Claims>, jsonwebtoken::errors::Error> {
    let key = get_secret_key().as_bytes(); // Use the same secret key used when signing the JWT
    let validation = Validation::default(); // Validates `exp` by default
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(key),
        &validation,
    )?;

    Ok(token_data)
}

fn get_secret_key() -> String {
    dotenv().ok(); // Load variables from .env file
    env::var("JWT_SECRET").expect("JWT_SECRET must be set")
}
