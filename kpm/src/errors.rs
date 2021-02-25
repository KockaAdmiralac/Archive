use std::error::Error;
use std::fmt::{self, Display, Formatter};

#[derive(Debug)]
pub struct ParsingError(pub String);

impl Display for ParsingError {
    fn fmt(&self, f: &mut Formatter) -> Result<(), fmt::Error> {
        write!(f, "{}", self.0)
    }
}
impl Error for ParsingError {}
