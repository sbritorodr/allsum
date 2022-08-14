const invoke = window.__TAURI__.invoke
function getTextInput(){
    const input_text = document.querySelector('#text_input').value
    const selected_algorithm = document.querySelector('#hash_type').value
    const mode = document.querySelector('input[name="hash_mode"]:checked').value

    console.log("Text submitted (js): ", input_text, selected_algorithm, mode)
    console.log(typeof(mode))
    invoke('text_hash_processing', {inputStr: input_text, hashType: selected_algorithm, mode: mode})
    .then((output_hash) => document.getElementById('hash_output_text').innerHTML = output_hash)
}
//MISC FUNCTIONS:
function copyToClipboard(){
    var copyText = document.getElementById('hash_output_text');
    navigator.clipboard.writeText(copyText.textContent);
    console.log(copyText.textContent)
    document.getElementById('copied_msg').innerHTML = "Copied the Text!"
}
