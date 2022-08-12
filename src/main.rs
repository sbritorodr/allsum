#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![allow(non_snake_case)] // For some reason, tauri converts variables from snake_case to camelCase, creating an error of unused keys
use md5;



fn allsum_md5(md5_input: &str) -> String{
  eprintln!("Generating md5 output...");
  let digest = md5::compute(md5_input.as_bytes());
  format!("{:x}", digest)
}

#[tauri::command]
fn text_hash_processing(inputStr: &str, hashType: &str) -> String { 
  match hashType {
    "md5" => allsum_md5(inputStr),
    _ => format!("Hash type '{}' is not avaliable", hashType)
  }
}


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![text_hash_processing]) //add all used commands here to communicate to js
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
