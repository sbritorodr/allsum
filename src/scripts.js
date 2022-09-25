// System Info:
const os = window.__TAURI__.os;
async function getSystemInfo(){
  const platformName = await os.platform();
  const osType = await os.type();

  console.log("SYSTEM INFORMATION:\nPlatform Name: ", platformName, "\nOsType: ", String(osType).type);

}
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
  switch (style) { // warn, ok, error
    case "warn":
      colorBackground = "hsl(29, 97%, 37%)"; // dark orange
      break;
    case "ok":
      colorBackground = "#77BA99"; // dark green
      break;
    default: // (Error) dark red
      colorBackground = "rgb(133, 15, 15)";
      console.error(msg);
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
    inputField.type = "button"; //changes the html to display only the file option dinamically
    inputField.id = "file_input";
    inputField.setAttribute("onclick", "inputFileProcess();") //Add the "open file" dialog function declared later
    inputField.classList.remove('text'); inputField.classList.add('file');
    containerField.classList.remove('text'); containerField.classList.add('file');
    msgfileInputHidden.style.display = 'block'

  } else { // Text Mode:
    inputField.type = "text";
    inputField.id = "text_input";
    inputField.removeAttribute("onlick");
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

// FILE MANAGE:
/// OPEN DIALOG AND SEND BYTES TO RUST:
const open = window.__TAURI__.dialog.open;
const readBinaryFile = window.__TAURI__.fs.readBinaryFile;
async function inputFileProcess(){
  console.log("Processing file");
  const selected = await open({
    multiple: false,
    directory: false,
    title: "Select file to be hashed",
  });
  if (selected == null){ // User cancelled the dialog. 
                        //(Doesn't Work!! Gives me this error: 
                        //"Unhandled Promise Rejection: invalid type: null, expected path string")
    console.error("Open file dialog cancelled by user");
  } else {
    console.log("Selected: ", selected, "\nAnd it's a: ", selected.type); 
  };
  /* REGEX: https://regexr.com/*/
  const osType = await os.type();
  switch (osType){
    case 'Windows_NT': // /[^\\]+(\.+)?$/gi
      var regExString = new RegExp("[^\\]+(\.+)?$", "gi");
    case 'Linux': // /(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)/gi
      var regExString = new RegExp("(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)", "gi");
    case 'Darwin': // /(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)/gi (MacOS)
      var regExString = new RegExp("(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)", "gi");
    default:
      // WARNING: THIS SHOULD BE DELETED AND FIXED (TODO) WHEN I MIGRATE TO TS:
      var regExString = new RegExp("(\w+)(\.\w+)+(?!.*(\w+)(\.\w+)+)", "gi"); //Since I'm using linux
      msgBox("Error!. OS Not supported. " + osType)
  };
  // Get filename and extension: filename
  var regExStringFilename = new RegExp(".*(?=(\.\w*$))", "gi")
  var regExStringExtension = new RegExp("[^\.]+$", "gi");

  var fileString = regExString.exec(String(selected))
  var filename = regExStringFilename.exec(fileString); // regex: /[^\.]+$/gim
  var extension = regExStringExtension.exec(fileString);
  console.log("Filename: ", filename, "\nExtension: ", extension)

  const fileContentInBinary = await readBinaryFile(selected); // As Uint8Array
  if (!fileContentInBinary){
    msgBox("Couldn't read file!");
    return
  }
  msgBox("File Readed!", "ok"); // This is just a dummy. In future versions I'll work better on the frontend
  console.log("FILE IN BINARY: ", fileContentInBinary);
};

//MISC FUNCTIONS:
function copyToClipboard() {
  var copyText = document.getElementById("hash_output_text");
  navigator.clipboard.writeText(copyText.textContent);
  console.log(copyText.textContent);
  msgBox("Copied the text", "ok", 2000);
}

// Load this functions at startup:

getSystemInfo()