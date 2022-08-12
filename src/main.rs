#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![allow(non_snake_case)] // For some reason, tauri converts variables from snake_case to camelCase, creating an error of unused keys
use md5;
use sha2::{Sha256, Sha512, Digest};
use blake3;


fn allsum_sha256(sha256_input: &str) -> String{

  let mut hasher = Sha256::new();
  hasher.update(sha256_input.as_bytes());
  let result = hasher.finalize();
  format!("{:x}", result)
}

fn allsum_sha512(sha512_input: &str) -> String {
  let mut hasher = Sha512::new();
  hasher.update(sha512_input.as_bytes());
  let result = hasher.finalize();
  format!("{:x}", result)
}

fn allsum_blake3(blake3_input: &str) -> String {
  eprintln!("Generating BLAKE-3 algorithm...");
  let result = blake3::hash(blake3_input.as_bytes());
  format!("{}", result.to_hex())
}

fn allsum_md5(md5_input: &str) -> String{
  eprintln!("Generating md5 output...");
  let digest = md5::compute(md5_input.as_bytes());
  format!("{:x}", digest)
}

#[tauri::command]
fn text_hash_processing(inputStr: &str, hashType: &str) -> String { 
  match hashType {
    "md5" => allsum_md5(inputStr),
    "sha256" => allsum_sha256(inputStr),
    "sha512" => allsum_sha512(inputStr),
    "blake3" => allsum_blake3(inputStr),
    _ => format!("Hash type '{}' is not avaliable", hashType)
  }
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![text_hash_processing]) //add all used commands here to communicate to js
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
