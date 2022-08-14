use std::fs::File;
use std::io::{BufReader};
use std::io::Read;


pub fn readFilefromPath(path: &str) -> Vec<u8>{
    let file = File::open(path)
        .expect("Cannot read file."); // Needs to be a "You didn't select a file" error. For now on, only unwraps:
                                          // value: Os { code: 2, kind: NotFound, message: "No such file or directory" }
                                          // Also, an ErrorKind will be good and just pop out an alert without crashing.
    dbg!(&file);
    let mut reader = BufReader::new(file);
    let mut buffer = Vec::new();

    reader.read_to_end(&mut buffer).expect("Couldn't read!");

    buffer
}