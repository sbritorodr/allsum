// main.ts
// Disabled "unused vars and functions. Check tsconfig.json file for more"
// Imports:
import { invoke } from "@tauri-apps/api/tauri";
import * as os from '@tauri-apps/api/os'
import { open as openLink} from "@tauri-apps/api/shell";
import { open as openFile} from "@tauri-apps/api/dialog"
import { readBinaryFile } from '@tauri-apps/api/fs'

// Constants: 
const donationLink = "https://ko-fi.com/sbritorodr"

// System Info:
// @ts-ignore
async function getSystemInfo(){
  const platformName = await os.platform();
  const osType = await os.type();

  console.log("SYSTEM INFORMATION:\nPlatform Name: ", platformName, "\nOsType: ", osType);

}
// addEventListener
let hashModeButton = document.getElementById('switch-button-checkbox');
let getTextInputButton = document.getElementById('submit_button_text');
let copyToClipboardAction = document.getElementById('hash_text_output_div');
let donationButton = document.getElementById('donate_div');

hashModeButton?.addEventListener("click", hashMode);
getTextInputButton?.addEventListener("click", getTextInput);
copyToClipboardAction?.addEventListener("click", copyToClipboard);
donationButton?.addEventListener("click", () => openLink(donationLink), false); // Go to donation section

// donation button:

// Global functions:

export function msgBox(msg:string, style:string, timer_ms = 5000) {
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

export async function getTextInput() {
  //document.getElementsByClassName("lds-ripple")[0].setAttribute("style", "display: block;" );
  const input_text = (document.querySelector("#text_input")! as HTMLInputElement).value;
  const selected_algorithm = (document.querySelector("#hash_type")! as HTMLInputElement).value;
  const isFileModeOn = (document.querySelector("#switch-button-checkbox")! as HTMLInputElement).checked; // Only testing. Should be remved or implemented on other way
  console.log("Text submitted (js): ", input_text, selected_algorithm);

  document.getElementById("hash_output_text")!.innerHTML = await invoke("text_hash_processing", {
    inputStr: input_text,
    hashType: selected_algorithm,
    isFileModeOn: isFileModeOn,
  });
  //invoke('open_splashscreen')
}
export function hashMode() {
  let isFileModeOn = document.querySelector("#switch-button-checkbox")! as HTMLInputElement; // false == text mode
  console.log(typeof isFileModeOn.checked, "Is file mode on?: ",isFileModeOn.checked);
  const inputField = document.querySelector(".input")! as HTMLInputElement;
  const containerField = document.querySelector(".input-container")!;
  let msgfileInputHidden = document.getElementById("input-file-msg")!;
  if (isFileModeOn.checked){ // File Mode:
    inputField.type = "button"; //changes the html to display only the file option dinamically
    inputField.id = "file_input";
    /*inputField.setAttribute("onclick", "inputFileProcess();")*/ //Add the "open file" dialog function declared later
    let inputFileProcessAction = document.getElementById('file_input');
    inputFileProcessAction?.addEventListener("click", inputFileProcess);

    inputField.classList.remove('text'); inputField.classList.add('file');
    containerField.classList.remove('text'); containerField.classList.add('file');
    msgfileInputHidden.style.display = 'block'

  } else { // Text Mode:
    inputField.type = "text";
    inputField.id = "text_input";
    inputField.classList.remove('file'); inputField.classList.add('text');
    containerField.classList.remove('file'); containerField.classList.add('text');
    msgfileInputHidden.style.display = 'none'
    document.getElementById('text_input')?.removeEventListener("click", inputFileProcess);
  }
}


// FILE MANAGE:
/// OPEN DIALOG AND SEND BYTES TO RUST:

export async function inputFileProcess(){
  console.log("Processing file");
  let selected = await openFile({
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

  document.getElementById("hash_output_text")!.innerHTML = await invoke("text_hash_processing", {
    inputStr: selectedPathString,
    hashType: selected_algorithm,
    isFileModeOn: isFileModeOn,
  });
  console.log(document.getElementById("hash_output_text")!.innerHTML)

};

//MISC FUNCTIONS:
export function copyToClipboard() {
  var copyText = document.getElementById("hash_output_text")!;
  if (copyText != null){

  }
  navigator.clipboard.writeText(copyText.textContent!);
  console.log(copyText.textContent);
  msgBox("Copied the text", "ok", 2000);
}



// Load this functions at startup:
document.addEventListener('DOMContentLoaded', () => {
  // This will wait for the window to load, but you could
  // run this function on whatever trigger you want
  //invoke('close_splashscreen')
})
//// Debug Only:
//getSystemInfo()