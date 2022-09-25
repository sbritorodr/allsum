
// System Info:
const os = window.__TAURI__.os;
async function getSystemInfo(){
  const platformName = await os.platform();
  const osType = await os.type();

  console.log("SYSTEM INFORMATION:\nPlatform Name: ", platformName, "\nOsType: ", osType);

}
// Global functions:
function msgBox(msg:string, style:string, timer_ms = 5000) {
  const floating_box = document.getElementById("float-message");
  const floating_box_msg = document.getElementById("float-message-text");
  function msgBoxStatus(isHidden:boolean) {
    floating_box!.hidden = isHidden;
  }
  floating_box_msg!.innerHTML = msg;
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
  floating_box!.style.background = colorBackground;
  setTimeout(function () {
    msgBoxStatus(true);
  }, timer_ms);
}
const invoke = window.__TAURI__.invoke;
 function getTextInput() {
  document.getElementsByClassName("lds-ripple")[0].setAttribute("style", "display: block;" );
  const input_text = (document.querySelector("#text_input")! as HTMLInputElement).value;
  const selected_algorithm = (document.querySelector("#hash_type")! as HTMLInputElement).value;
  const isFileModeOn = (document.querySelector("#switch-button-checkbox")! as HTMLInputElement).checked; // Only testing. Should be remved or implemented on other way
  console.log("Text submitted (js): ", input_text, selected_algorithm);
  
  invoke("text_hash_processing", {
    inputStr: input_text,
    hashType: selected_algorithm,
    isFileModeOn: isFileModeOn,
  }).then(
    (output_hash) =>
      (document.getElementById("hash_output_text")!.innerHTML = output_hash.hash)
  );
}
 function hashMode() {
  let isFileModeOn = document.querySelector("#switch-button-checkbox")! as HTMLInputElement; // false == text mode
  console.log(typeof isFileModeOn.checked, "Is file mode on?: ",isFileModeOn.checked);
  const inputField = document.querySelector(".input")! as HTMLInputElement;
  const containerField = document.querySelector(".input-container")!;
  let msgfileInputHidden = document.getElementById("input-file-msg")!;
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
    inputField.removeAttribute('onclick');
    inputField.classList.remove('file'); inputField.classList.add('text');
    containerField.classList.remove('file'); containerField.classList.add('text');
    msgfileInputHidden.style.display = 'none'
  }
}


// FILE MANAGE:
/// OPEN DIALOG AND SEND BYTES TO RUST:
//const open = window.__TAURI__.dialog.open;
const readBinaryFile = window.__TAURI__.fs.readBinaryFile;
 async function inputFileProcess(){
  console.log("Processing file");
  let selected = await window.__TAURI__.dialog.open({
    multiple: false,
    directory: false,
    title: "Select file to be hashed",
  });
  if (selected == null){ // User cancelled the dialog. 
                        //(Doesn't Work!! Gives me this error: 
                        //"Unhandled Promise Rejection: invalid type: null, expected path string")
    console.error("Open file dialog cancelled by user");
  } else {
    
  };
  let selectedPathString = selected?.toString()!
  console.log("Selected: ", selectedPathString); 
  /* REGEX: https://regexr.com/*/

  var regExString = new RegExp(/(\w|[-.])+$/)
  var regExStringExtension = new RegExp(/(\.\w+$)/);
  // Get filename and extension
  var fileName = regExString.exec(selectedPathString)![0];
  let isExtensionKnown = regExStringExtension.test(String(fileName));
  if (isExtensionKnown){
    var extension = regExStringExtension.exec(String(fileName))![0];
  } else {
    var extension = "";
  };
  console.log("Filename: ", fileName, "\nExtension: ", extension, "isExtensionKnown", isExtensionKnown)

  const fileContentInBinary = await readBinaryFile(selectedPathString); // As Uint8Array
  if (!fileContentInBinary){
    msgBox("Couldn't read file!", "error");
    return
  }
  msgBox("File Readed!", "ok"); // This is just a dummy. In future versions I'll work better on the frontend
  
  /*let fileMetadata = await metadata(selectedPathString);
  console.log("METADATA: ", fileMetadata)*/
  const selected_algorithm = (document.querySelector("#hash_type")! as HTMLInputElement).value;
  const isFileModeOn = (document.querySelector("#switch-button-checkbox")! as HTMLInputElement).checked; // Only testing. Should be remved or implemented on other way
  invoke("text_hash_processing", {
    inputStr: selectedPathString,
    hashType: selected_algorithm,
    isFileModeOn: isFileModeOn,
  }).then(
    (output_hash) =>
      (document.getElementById("hash_output_text")!.innerHTML = output_hash.hash)
  );
};

//MISC FUNCTIONS:
 function copyToClipboard() {
  var copyText = document.getElementById("hash_output_text")!;
  if (copyText != null){

  }
  navigator.clipboard.writeText(copyText.textContent!);
  console.log(copyText.textContent);
  msgBox("Copied the text", "ok", 2000);
}

// Load this functions at startup:

getSystemInfo()