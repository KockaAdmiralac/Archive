mod actions;
mod errors;
mod models;

use crate::{actions::*, errors::ParsingError, models::*};
use clipboard::{ClipboardContext, ClipboardProvider};
use notify_rust::{Notification, NotificationHint};
use std::{
    collections::HashMap,
    env::Args,
    error::Error,
    fs::File,
    io::{BufReader, BufWriter},
};
use xdg::BaseDirectories;

pub struct Context {
    action: String,
    clipboard: ClipboardContext,
    data: Option<Vec<Account>>,
    dirs: BaseDirectories,
    executable: String,
    options: HashMap<String, String>,
    parameters: Vec<String>,
}

impl Context {
    pub fn new(mut args: Args) -> Result<Context, Box<dyn Error>> {
        let executable = args.next().unwrap();
        let action = match args.next() {
            None => {
                print_help();
                return Err(Box::new(ParsingError(
                    "KPM action not specified.".into(),
                )));
            },
            Some(value) => value,
        };
        let mut parameters = Vec::new();
        let mut options = HashMap::new();
        for arg in args {
            if arg.starts_with("--") {
                let mut split = arg.split('=');
                let option = split.next().unwrap()[2..].to_owned();
                let collection: Vec<&str> = split.collect();
                options.insert(option, collection.join("="));
            } else if arg.starts_with("-") {
                let mut split = arg.chars();
                split.next();
                split.for_each(|c| {
                    options.insert(shorthand(c), "".to_owned());
                });
            } else {
                parameters.push(arg);
            }
        }
        println!("{:#?}, {:#?}", options, parameters);
        Ok(Context {
            action,
            clipboard: ClipboardProvider::new()?,
            data: None,
            dirs: BaseDirectories::with_prefix("kpm")?,
            executable,
            options,
            parameters,
        })
    }

    pub fn run(&mut self) -> Result<(), Box<dyn Error>> {
        self.data = Some(self.load_data()?);
        let result = match self.action.as_ref() {
            "new" => NewAction::execute(self)?,
            _ => {
                print_help();
                return Err(Box::new(ParsingError("Unknown action.".into())));
            },
        };
        match result {
            ActionResult::Modified => self.save_data()?,
            ActionResult::Nothing => (),
        };
        Ok(())
    }

    pub fn load_data(&mut self) -> Result<Vec<Account>, Box<dyn Error>> {
        match self.dirs.find_data_file("data.json") {
            Some(data_file) => {
                let accounts: Vec<Account> = serde_json::from_reader(
                    BufReader::new(File::open(data_file)?),
                )?;
                Ok(accounts)
            },
            None => {
                let data_path = self.dirs.place_data_file("data.json")?;
                serde_json::to_writer(
                    BufWriter::new(File::create(data_path)?),
                    &serde_json::json!([]),
                )?;
                Ok(vec![])
            },
        }
    }

    pub fn save_data(&mut self) -> Result<(), Box<dyn Error>> {
        let data_path = self.dirs.place_data_file("data.json")?;
        serde_json::to_writer(
            BufWriter::new(File::create(data_path)?),
            &self.data,
        )?;
        Ok(())
    }

    fn copy(&mut self, text: &str) -> Result<(), Box<dyn Error>> {
        self.clipboard.set_contents(text.to_owned())
    }

    fn notification(&self, title: &str, contents: &str) -> Notification {
        let mut notification = Notification::new();
        notification
            .summary(title)
            .body(contents)
            .action("default", "default")
            .appname("kpm");
        notification
    }

    fn error_notification(&self, contents: &str) -> Notification {
        let mut notification = self.notification("KPM error", contents);
        notification
            .icon("error")
            .hint(NotificationHint::Category("error".to_owned()));
        notification
    }
}

fn print_help() {
    //
}

fn shorthand(option: char) -> String {
    match option {
        'p' => String::from("password"),
        _ => option.to_string(),
    }
}
