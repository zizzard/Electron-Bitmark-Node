//When the manual update button is clicked, update the users preferences
function clickAutomaticUpdate(){
  // Fetch the user's settings and set auto_update to true
	const settings = require('electron').remote.require('electron-settings');
  settings.set('auto_update', true);
};

//When the manual update button is clicked, update the users preferences
function clickManualUpdate(){
  // Fetch the user's settings and set auto_update to false
  const settings = require('electron').remote.require('electron-settings');
  settings.set('auto_update', false);
};

//When the manual update button is clicked, update the users preferences
function clickAutomaticIP(){
  // Fetch the user's settings and set auto_ip to true
  const settings = require('electron').remote.require('electron-settings');
  settings.set('auto_ip', true);

  //Disable the textbox and button
  document.getElementById("textbox").readOnly = true;
  document.getElementById("save-button").disabled = true;
};

//When the manual update button is clicked, update the users preferences
function clickManualIP(){
  // Fetch the user's settings and set auto_ip to false
  const settings = require('electron').remote.require('electron-settings');
  settings.set('auto_ip', false);

  //Enable the textbox and button
  document.getElementById("textbox").readOnly = false;
  document.getElementById("save-button").disabled = false;
};

function savedIP(){
  //Get the textbox value, and display that on the screen
  var ip = document.getElementById('textbox').value
  var saved_text = document.getElementById('saved');
  saved_text.innerHTML = `Your IP address was set to: ${ip}`;
  saved_text.style.display = "block";   

  //Update the IP address in settings
  const settings = require('electron').remote.require('electron-settings');
  settings.set('ip', ip);
};

//Function to handle buttons
(function () {
    const remote = require('electron').remote;
    const ipc = require('electron').ipcRenderer;
    
    function init() { 
   	  //Control the minimize button
      document.getElementById("min").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.minimize(); 
      });
      
      //Control the maximize button
      document.getElementById("max").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        if (!window.isMaximized()) {
          window.maximize();
        } else {
          window.unmaximize();
        }  
      });
      
      //Control the close button
      document.getElementById("close").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.close();
      }); 

      // Tell main process to show the menu when demo button is clicked
      document.getElementById('menu').addEventListener('click', function () {
        ipc.send('show-context-menu');
      });
    }; 
    
    //When the page is ready, run init
    document.onreadystatechange = function () {
      if (document.readyState == "complete") {
        init(); 
      }
    };
})();