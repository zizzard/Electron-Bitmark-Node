//When the manual update button is clicked, update the users preferences
function clickAutomatic(){
  // Fetch the user's settings and set auto_update to true
	const settings = require('electron').remote.require('electron-settings');
  settings.set('auto_update', true);
};

//When the manual update button is clicked, update the users preferences
function clickManual(){
  // Fetch the user's settings and set auto_update to false
  const settings = require('electron').remote.require('electron-settings');
  settings.set('auto_update', false);
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