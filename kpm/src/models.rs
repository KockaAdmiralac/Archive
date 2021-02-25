use serde_derive::{Deserialize, Serialize};

#[derive(Deserialize, Debug, Serialize)]
pub struct Provider {
    accounts: Vec<Account>,
    name: String,
}

#[derive(Deserialize, Debug, Serialize)]
pub struct Account {
    password: String,
    recovery_codes: Vec<String>,
    username: String,
}

impl Account {
    pub fn new(username: String, password: String) -> Account {
        Account {
            password,
            recovery_codes: vec![],
            username,
        }
    }
}
