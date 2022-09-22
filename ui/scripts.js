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
  console.log(typeof isFileModeOn.checked, "Is file mode on?: ",isFileModeOn.checked);
  const inputField = document.querySelector(".input");
  const containerField = document.querySelector(".input-container");
  let msgfileInputHidden = document.getElementById("input-file-msg");
  if (isFileModeOn.checked){ // File Mode:
    inputField.type = "file"; //changes the html to display only the file option dinamically
    inputField.id = "file_input";
    inputField.classList.remove('text'); inputField.classList.add('file');
    containerField.classList.remove('text'); containerField.classList.add('file');
    msgfileInputHidden.style.display = 'block'

  } else { // Hash Mode:
    inputField.type = "text";
    inputField.id = "text_input";
    inputField.classList.remove('file'); inputField.classList.add('text');
    containerField.classList.remove('file'); containerField.classList.add('text');
    msgfileInputHidden.style.display = 'none'
  }
}
function inputProcess(){
  console.log("INPUTPROCESS CALLED");
  var file = document.getElementById('file_input').files[0];
  console.log(file.name);
  var path = file.target.value;
  console.log('path:', path);
  const reader = new FileReader();
  /*reader.addEventListener('load', (event) => {
    file.src = event.target.result;
  });*/
  var output = reader.readAsBinaryString(file);
  console.log('Output bytes: \n', output);

}
/*
function getTimeElapsed(){
    const time_div = document.querySelector
} */
// File upload

//MISC FUNCTIONS:
function copyToClipboard() {
  var copyText = document.getElementById("hash_output_text");
  navigator.clipboard.writeText(copyText.textContent);
  console.log(copyText.textContent);
  msgBox("Copied the text", "ok", 2000);
}