use rocket::serde::json::Json;
use rocket_db_pools::Connection;
use sqlx::Acquire;
use crate::datamodels::models::Card;
use crate::db::connection::Postgres;
use crate::datamodels::response::CardQuery;

#[get("/cards?<params..>")]
pub async fn list_cards(mut conn: Connection<Postgres>,
                        params: Option<CardQuery>
) -> Result<Json<Vec<Card>>, rocket::http::Status> {
    // Acquire the SQLx connection explicitly
    let pg_conn = conn.acquire().await.map_err(|_| rocket::http::Status::InternalServerError)?;

    // Start the SQL base query
    let mut sql = String::from("SELECT id, name, mana_cost, card_type, oracle_text, power, toughness, colors, rarity, set_code, mana_value FROM cards");
    let mut conditions = Vec::new();
    let mut bind_params = Vec::new();


    println!("Params: {:?}", params);
    // Dynamically construct filters based on the optional query parameters
    // Handle query parameters dynamically
    if let Some(params) = params {
        if let Some(name) = &params.name {
            conditions.push(format!("name ILIKE ${}", bind_params.len() + 1));
            bind_params.push(format!("%{}%", name)); // Partial match
        }

        if let Some(name) = &params.set_code{
            conditions.push(format!("set_code ILIKE ${}", bind_params.len() + 1));
            bind_params.push(format!("%{}%", name)); // Partial match
        }

        if let Some( card_type) = &params.CT {
            conditions.push(format!("card_type ILIKE ${}", bind_params.len() + 1));
            bind_params.push(format!("%{}%", card_type)); // Partial match
        }

        if let Some(text) = &params.T{
            conditions.push(format!("oracle_text ILIKE ${}", bind_params.len() + 1));
            bind_params.push(format!("%{}%", text)); // Partial match
        }

        if let Some(rarity) = &params.rarity{
            conditions.push(format!("rarity = ${}", bind_params.len() + 1));
            bind_params.push(format!("{}", rarity)); // Partial match
        }

        if let Some( value) = &params.t_exact{
            conditions.push(format!("toughness = ${}", bind_params.len() + 1));
            bind_params.push(value.clone().to_string());
        }

        if let Some( value) = &params.p_exact{
            conditions.push(format!("power = ${}", bind_params.len() + 1));
            bind_params.push(value.clone().to_string());
        }

        if let Some( value) = &params.p_superset {
            conditions.push(format!("power::INTEGER >=  ${}::INTEGER", bind_params.len() + 1));
            bind_params.push(value.clone().to_string());
        }

        if let Some( value) = &params.p_subset {
            conditions.push(format!("power::INTEGER <= ${}::INTEGER)", bind_params.len() + 1));
            bind_params.push(value.clone().to_string());
        }

        if let Some( value) = &params.mv_exact{
            conditions.push(format!("mana_value = ${}::INTEGER", bind_params.len() + 1));
            bind_params.push(value.clone().to_string());
        }

        if let Some( value) = &params.mv_superset {
            conditions.push(format!("mana_value >=  ${}::INTEGER", bind_params.len() + 1));
            bind_params.push(value.clone().to_string());
        }

        if let Some( value) = &params.mv_subset {
            conditions.push(format!("mana_value <= ${}::INTEGER)", bind_params.len() + 1));
            bind_params.push(value.clone().to_string());
        }

        if let Some(colors_exact) = &params.colors_exact {
            // Exact match
            conditions.push(format!("colors = ARRAY[${}]", bind_params.len() + 1));
            bind_params.push(colors_exact.clone());
        }

        if let Some(colors_subset) = &params.colors_subset {
            // Split the input string (e.g., "BU") into individual characters
            let colors_array: Vec<String> = colors_subset
                .chars()
                .map(|c| c.to_string())
                .collect();

            // Add the condition for superset matching
            conditions.push(format!("colors <@ ${}::text[]", bind_params.len() + 1)); // Use PostgreSQL array syntax
            bind_params.push(format!("{{{}}}", colors_array.join(","))); // Format as PostgreSQL arra
        }

        if let Some(colors_superset) = &params.colors_superset {
            // Split the input string (e.g., "BU") into individual characters
            let colors_array: Vec<String> = colors_superset
                .chars()
                .map(|c| c.to_string())
                .collect();

            // Add the condition for superset matching
            conditions.push(format!("colors @> ${}::text[]", bind_params.len() + 1)); // Use PostgreSQL array syntax
            bind_params.push(format!("{{{}}}", colors_array.join(","))); // Format as PostgreSQL array
        }
    }

    // Append conditions if any exist
    if !conditions.is_empty() {
        sql.push_str(" WHERE ");
        sql.push_str(&conditions.join(" AND "));
    }

    // Add an optional sorting clause
    sql.push_str(" ORDER BY name ASC");

    // Use the acquired connection for the query
    println!("Bind Params: {:?}", bind_params);
    // Build the SQL query
    let mut query = sqlx::query_as::<_, Card>(&sql);
    for param in bind_params {
        query = query.bind(param); // Safely bind the parameters
    }

    println!("Query: {}", sql);

    // Execute the query and fetch results
    let result = query
        .fetch_all(pg_conn)
        .await
        .map_err(|e|  {
            println!("Error: {}", e);
            rocket::http::Status::InternalServerError
        });


    Ok(Json(result?))
}

