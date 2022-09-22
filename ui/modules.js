const invoke = window.__TAURI__.invoke;
import { open } from './@tauri-apps/api/dialog';

async function inputFileProcess(){
  console.log("Processing file");
  

  const selected = await open({
    multiple: false,
    filters: [{
      // Any filter should go here
    }],
  })
  if (selected == null){ // User cancelled the dialog
    console.log("Open file dialog cancelled by user")

  } else {
    console.log("Selected: ", selected);
  }
}