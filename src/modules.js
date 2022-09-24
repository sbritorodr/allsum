const invoke = window.__TAURI__.invoke;
const open = window.__TAURI__.dialog.open;
async function inputFileProcess(){
  console.log("Processing file");
  

  const selected = await open({
    multiple: false,
    
  });
  if (selected == null){ // User cancelled the dialog
    console.log("Open file dialog cancelled by user")

  } else {
    console.log("Selected: ", selected);
  }
};
inputFileProcess()