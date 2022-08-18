// Global functions:
function msgBox(msg, style, timer_ms = 5000) {
  const floating_box = document.getElementById("float-message");
  const floating_box_msg = document.getElementById("float-message-text");
  function msgBoxStatus(isHidden) {
    floating_box.hidden = isHidden;
  }
  floating_box_msg.innerHTML = msg;
  msgBoxStatus(false);
  var colorBackground = "";
  switch (style) {
    case "warn":
      colorBackground = "hsl(29, 97%, 37%)"; // dark orange
      break;
    case "ok":
      colorBackground = "#77BA99"; // dark green
      break;
    default: // dark red
      colorBackground = "rgb(133, 15, 15)";
      break;
  }
  floating_box.style.background = colorBackground;
  setTimeout(function () {
    msgBoxStatus(true);
  }, timer_ms);
}
const invoke = window.__TAURI__.invoke;
function getTextInput() {
  document.querySelectorAll(".lds-ripple").style == "display: block;";
  const input_text = document.querySelector("#text_input").value;
  const selected_algorithm = document.querySelector("#hash_type").value;
  const isFileModeOn = document.querySelector(
    "#switch-button-checkbox"
  ).checked; // Only testing. Should be remved or implemented on other way
  console.log("Text submitted (js): ", input_text, selected_algorithm);
  invoke("text_hash_processing", {
    inputStr: input_text,
    hashType: selected_algorithm,
    isFileModeOn: isFileModeOn,
  }).then(
    (output_hash) =>
      (document.getElementById("hash_output_text").innerHTML = output_hash.hash)
  );
  document.querySelectorAll(".lds-ripple").style == "display: none;";
}
function hashMode() {
  let isFileModeOn = document.querySelector("#switch-button-checkbox"); // false == text mode
  console.log(typeof isFileModeOn.checked, isFileModeOn.checked);
}
/*
function getTimeElapsed(){
    const time_div = document.querySelector
} */

//MISC FUNCTIONS:
function copyToClipboard() {
  var copyText = document.getElementById("hash_output_text");
  navigator.clipboard.writeText(copyText.textContent);
  console.log(copyText.textContent);
  msgBox("Copied the text", "ok", 2000);
}
