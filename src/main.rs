#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use md5;



fn allsum_md5(md5_input: &str) -> String{
  let digest = md5::compute(md5_input.as_bytes());
  format!("{:x}", digest)
}

#[tauri::command]
fn text_hash_processing(input_str: &str, hash_type: &str) -> String {
  match hash_type {
    "md5" => allsum_md5(input_str),
    _ => panic!("ERROR, INVALID INPUT")
  }
}


fn main() {
  let aaa = text_hash_processing("A", "md5");
  println!("{:?}", aaa);
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![text_hash_processing]) //add all used commands here to communicate to js
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
