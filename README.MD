# Allsum!
<div style="display: grid; 
grid-template-columns: repeat(2, 1fr); 
grid-template-rows: 1fr; 
grid-column-gap: 0px;
grid-row-gap: 0px;">
<img src=./src-tauri/icons/icon.png style="Height:7rem;">
<img src="./website/allsum.png" style="height. 4rem;">
</div>
<br>
<img src= "website\example.gif" alt="(App showcase gif. View it in your browser if this doesn't load)">

Advanced and fast hash generator/checker for files and plain text.
Using Tauri!
# Full vs Essentials:
| Characteristics         | Essentials | Full |
|-------------------------|------------|------|
| Free, forever           | ✅         | ✅   |
| Made with love          | ✅         | ✅   |
| FOSS                    | ✅         | ✅   |
| GPLv3                   | ✅         | ✅   |
| Lighweight              | ✅         | ❌   |

| Supported<br>Algorithms | Essentials | Full |
|-------------------------|------------|------|
| md5                     | ✅          | ✅    |
| sha-1 \| 256 \| 512     | ✅          | ✅    |
| md5                     | ✅          | ✅    |
| crc-32                  | ✅          | ✅    |
| whirlpool               | ❌          | ✅    |
| BLAKE-3                 | ❌          | ✅    |
| belT                    | ❌          | ✅    |

# Build:
1. It's important to add this tauri plugin before starting. Should be installed by 
running `npm install` inside the project dir.

`pnpm add github:tauri-apps/tauri-plugin-fs-extra`

`npm install github:tauri-apps/tauri-plugin-fs-extra`

# Contribute:
## Add more algorithms:
All extra hash functions should be added only for the full version, keep in mind to 
enable the function to work with the "full" feature. If you think a function is used 
enough to be bundled inside full and essentials edition, please discuss it in you PR.

I've tried to make the coding easier for adding more hash algorithms, though isn't 
something like a plugin but more than a extra code to be added.

1. Check if the hash is in [crates.io](crates.io)
2. Go to `src-tauri\Cargo.toml`, and edit this line under `[dependencies]`: You should 
add the `optional = "true"` line. For example, let's call a brand new hash "foo"
```toml
## Hashes: 
md5 = "0.7.0" # MIT
# ...
whirlpool = { version ="0.10.1", optional = true } # MIT 
belt-hash = {version = "0.1.0", optional = true} # MIT or APACHE2
# add here other hash functions:
foo = {version "x.x.x", optional = true}
```
3. Edit this line in `Cargo.toml`:
```toml
[features]
full = ["dep:blake3", "dep:whirlpool", "dep:belt-hash", "dep:foo"]
```
4. Go to `src-tauri\src\main.rs`. Add a new entry inside `bytes_hash_processing()`:
```rust
#[cfg(feature="full")]
fn bytes_hash_processing(input: &[u8], hashType: &str) -> OutputToJS {
  let now = Instant::now();
  let output = match hashType {
    "md5" => allsum_md5(input),
    // some stuff ommited here
    "foo" => allsum_foo(input),
    _ => format!("Hash type '{}' is not avaliable", hashType)
  };
```
5. Go to `src-tauri\src\algorithms.rs` and create a new function at the end of the file. 
<br>The function **must** have a `[&u8]` input and a `String` output. The function content 
doesn't matter if the hash works for text and files. <br>If your hash function is using the `Digest` 
crate or it's inside [RustCrypto/hashes](https://github.com/RustCrypto/hashes) repo, it's easy to implement!:
```rust
#[cfg(feature="full")]
pub fn allsum_foo(foo_input:&[u8])-> String {
    eprintln!("Generating foo output");
    let mut hasher = foo_hash::FooHash::new();
    hasher.update(foo_input);
    let result = hasher.finalize();
    format!("{:x}", result)
}
```
6. Go to `src-tauri/src/features.rs` and add the new hash inside `algorithms_selector_string()` 
function (**THE FULL VERSION FUNCTION, NOT THE SECOND ONE!**). The function should have `#[cfg(feature="full")]` at the top!:

```rust
#[cfg(feature="full")] // FULL VERSION
#[tauri::command]
pub fn algorithms_selector_string() -> String{
    let enabled_algorithms:Vec<&str> = vec![..., "foo",];
    ...
}
```

7. Congrats! Your hash function is added!. Now test it with `pnpm tauri dev -f full`


# Copyleft licenses:
- Donate symbol: <div>Icon made from <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a> 
is licensed by CC BY 3.0</div>
