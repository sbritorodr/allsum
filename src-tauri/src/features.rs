// "full" feature is a free edition for allsum that uses all checksums avaliable
// on rust. I'ts made for users with better storage.

// sorting code for play.rust-lang.org:

/*
fn main() {
    let mut vector = vec!["crc32", "md5", "sha1", "sha256", "sha512"];
    vector.sort();
    println!("{:?}", vector)
}
*/

#[tauri::command]
pub fn algorithms_selector_string() -> String{
    // to avoid unnecesary sort functions, sort this using the provided above
    let enabled_algorithms:Vec<&str> = match cfg!(feature="full"){
        // FULL EDITION:
        true => vec!["belT", "blake2", "blake3", "crc32", "fsb", "md5", "sha1", "sha256", "sha512", "shabal", "tiger", "whirlpool"],
        // ESSENTIALS EDITION:
        _ => vec!["crc32", "md5", "sha1", "sha256", "sha512"]
    };
    let mut innerHTML:String = String::new(); 
    for algorithmTag in enabled_algorithms{
        innerHTML.push_str(format!("<option value={}>{}</option>\n", algorithmTag, algorithmTag).as_str())
    }
    innerHTML
}

