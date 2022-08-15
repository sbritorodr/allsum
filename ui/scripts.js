// Global functions:
function msgBox(msg, style) {
    const floating_box = document.getElementById('float-message');
    const floating_box_msg = document.getElementById('float-message-text');

    floating_box_msg.innerHTML = msg;
    floating_box.hidden = false;
    var colorBackground = ""
    switch (style) {
        case 'warn':
            colorBackground = "hsl(29, 97%, 37%)" // dark orange
            break
        case 'ok':
            colorBackground = "hsl(127, 79%, 30%)" // dark green
            break
        default:
            colorBackground = "rgb(133, 15, 15)" // dark red
            break
    }
    floating_box.style.background = colorBackground
}


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
/*
function getTimeElapsed(){
    const time_div = document.querySelector
} */

//MISC FUNCTIONS:
function copyToClipboard(){
    var copyText = document.getElementById('hash_output_text');
    navigator.clipboard.writeText(copyText.textContent);
    console.log(copyText.textContent)
    document.getElementById('copied_msg').innerHTML = "Copied the Text!"
}
