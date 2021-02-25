use crate::{models::*, Context};
use rand::Rng;
use rand::distributions::Alphanumeric;
use std::error::Error;

pub trait Action {
    fn execute(context: &mut Context) -> Result<ActionResult, Box<dyn Error>> {
        Ok(ActionResult::Nothing)
    }
}

pub enum ActionResult {
    Modified,
    Nothing
}

pub struct NewAction;

impl NewAction {
    fn generate_password(length: usize) -> String {
        let password: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(length)
            .collect();
        password
    }
}

impl Action for NewAction {
    fn execute(context: &mut Context) -> Result<ActionResult, Box<dyn Error>> {
        println!("New.");
        match &mut context.data {
            Some(data) => {
                let username = match context.parameters.get(0) {
                    Some(value) => value.to_owned(),
                    None => {
                        return Ok(ActionResult::Nothing);
                    }
                };
                let password = match context.parameters.get(1) {
                    Some(value) => value.to_owned(),
                    None => match context.options.get("random") {
                        Some(len) => {
                            let length: usize = len.parse()?;
                            NewAction::generate_password(length)
                        },
                        None => NewAction::generate_password(128)
                    }
                };
                data.push(Account::new(username, password));
                Ok(ActionResult::Modified)
            },
            None => Ok(ActionResult::Nothing)
        }
    }
}
