#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![allow(non_snake_case)]
use std::time::{Instant};
use file::readFilefromPath;
// For some reason, tauri converts variables from snake_case to camelCase, creating an error of unused keys
mod file;
mod algorithms;
use algorithms::*;

struct OutputToJS {
  output_hash: String,
  output_time_ms: u128
}

#[tauri::command]
fn text_hash_processing(inputStr: &str, hashType: &str, mode: &str) -> String { 
  //let input_bytes:&[u8] = inputStr.as_bytes();
  let input_bytes: Vec<u8> = 
  if mode == "Text" {
    inputStr.as_bytes().to_owned()
  } else {
    let input_vec = readFilefromPath(inputStr);
    input_vec
  };
  bytes_hash_processing(&input_bytes, hashType)
}

fn bytes_hash_processing(input: &[u8], hashType: &str) -> String { //Separated in order to be re-used if I add the sum file mode instead of text
  let now = Instant::now();
  let output = match hashType {
    "md5" => allsum_md5(input),
    "sha1" => allsum_sha1(input),
    "sha256" => allsum_sha256(input),
    "sha512" => allsum_sha512(input),
    "blake3" => allsum_blake3(input),
    "crc32" => allsum_crc32(input),
    _ => format!("Hash type '{}' is not avaliable", hashType)
  };
  let time_elapsed_ms:u128 = now.elapsed().as_millis();
  println!("Time Consumption: {} milliseconds", time_elapsed_ms);
  output
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![text_hash_processing]) //add all used commands here to communicate to js
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}