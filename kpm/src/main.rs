use kpm::Context;
use std::{env, process};

fn main() {
    let mut context = Context::new(env::args()).unwrap_or_else(|error| {
        eprintln!("KPM setup error: {}", error);
        process::exit(1);
    });
    if let Err(error) = context.run() {
        eprintln!("KPM runtime error: {}", error);
    }
}
