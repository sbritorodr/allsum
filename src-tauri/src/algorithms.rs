use md5;
use sha1::{self, Sha1};
use sha2::{Sha256, Sha512, Digest};
use blake3;
use crc32fast;
use whirlpool;

//  All algorithms are inside this list: https://github.com/RustCrypto/hashes
// There are some algorithms, such us BLAKE 3 that aren't in this list
pub fn allsum_crc32(crc32_input: &[u8]) -> String {
    let mut hasher = crc32fast::Hasher::new();
    hasher.update(crc32_input);
    let checksum = hasher.finalize();
    format!("{:x}", checksum)
  }
  
pub fn allsum_sha1(sha1_input: &[u8]) -> String {
    let mut hasher = Sha1::new();
    hasher.update(sha1_input);
    let result = hasher.finalize();
    format!("{:x}", result)
}
  
pub fn allsum_sha256(sha256_input: &[u8]) -> String{
    let mut hasher = Sha256::new();
    hasher.update(sha256_input);
    let result = hasher.finalize();
    format!("{:x}", result)
}
  
pub fn allsum_sha512(sha512_input: &[u8]) -> String {
    let mut hasher = Sha512::new();
    hasher.update(sha512_input);
    let result = hasher.finalize();
    format!("{:x}", result)
}
  
pub fn allsum_blake3(blake3_input: &[u8]) -> String {
    eprintln!("Generating BLAKE-3 algorithm...");
    let result = blake3::hash(blake3_input);
    format!("{}", result.to_hex())
}
  
pub fn allsum_md5(md5_input: &[u8]) -> String{ // For some reason, this website is wrong and it's at the first search result in google if you search "md5 online" https://www.md5.cz/ 
    eprintln!("Generating md5 output...");
    let digest = md5::compute(md5_input);
    format!("{:x}", digest)
}
pub fn allsum_whirpool(whirlpool_input: &[u8]) -> String {
    eprintln!("Generating whirpool output");
    let mut hasher = whirlpool::Whirlpool::new();
    hasher.update(whirlpool_input);
    let result = hasher.finalize();
    format!("{:x}", result)
}