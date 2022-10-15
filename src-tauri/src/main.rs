#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![allow(non_snake_case)]
// For some reason™️, tauri converts variables from snake_case to camelCase, creating an error of unused keys

use std::time::{Instant};
use serde::{Serialize, Deserialize}; //by looking at .toml, serde_json is enabled
use file::readFilefromPath;
mod file;
mod algorithms;
use algorithms::*;
use tauri_plugin_fs_extra::FsExtra;
use wasm_typescript_definition::TypescriptDefinition;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(TypescriptDefinition, Serialize, Deserialize)] 
#[serde(tag = "tag", content = "fields")]
enum OutputHash{
  Hash(String)
}
// Tauri for some reason™️ gives me a strange error if I don't add this.
#[derive(Serialize)]
struct OutputToJS { // Tauri official guide really has the worst beginner documentation 

  hash: String,     // I've ever seen. (I still think Tauri is a wonderful api)
  etime: String
} // This struct will help me to "Store" in a cstruct all the output all the "hash backend" is
  // Doing in order have less function calls between both.

#[tauri::command]
fn text_hash_processing(inputStr: &str, hashType: &str, isFileModeOn: bool) -> String { 
  let input_bytes: Vec<u8> = 
  if isFileModeOn {
    let input_vec = readFilefromPath(inputStr);
    input_vec
  } else {
    inputStr.as_bytes().to_owned()
  };
  bytes_hash_processing(&input_bytes, hashType).hash // ToDo: Complete rework of etime
}

fn bytes_hash_processing(input: &[u8], hashType: &str) -> OutputToJS { //Separated in order to be re-used if I add the sum file mode instead of text
  let now = Instant::now();
  let output = match hashType {
    "md5" => allsum_md5(input),
    "sha1" => allsum_sha1(input),
    "sha256" => allsum_sha256(input),
    "sha512" => allsum_sha512(input),
    "blake3" => allsum_blake3(input),
    "crc32" => allsum_crc32(input),
    "whirlpool" => allsum_whirpool(input),
    _ => format!("Hash type '{}' is not avaliable", hashType)
  };
  let time_elapsed_ms:String = now.elapsed().as_millis().to_string(); //needs to be a string. JavaScript doesn't support u128
  println!("Time Consumption: {} milliseconds", time_elapsed_ms);
  OutputToJS { hash: output, etime: time_elapsed_ms }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![text_hash_processing]) //add all used commands here to communicate to js
    .plugin(FsExtra::default()) 
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}