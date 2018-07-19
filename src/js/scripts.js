const { ipcRenderer, remote } = require('electron');

function startBitmarkNodeLocal(){
	startBitmarkNode();
};

function stopBitmarkNodeLocal(){
	stopBitmarkNode();
};

function restartBitmarkNodeLocal(){
	newNotification("Restarting container. This may take some time.");
	createContainerHelperLocal();
};

function refreshWindow(){
	var window = remote.getCurrentWindow();
	window.reload();
}

function showPreferences(){
	// Display the preferences window
	ipcRenderer.send('showPreferences');
};

function setNetworkBitmark(){
	// Fetch the preferences JSON object
	const preferences = ipcRenderer.sendSync('getPreferences');
	var network = preferences.blockchain.network;

	if(network === "testing"){
		preferences.blockchain.network = "bitmark";
		ipcRenderer.sendSync('setPreferences', {...preferences});
		console.log("Changing to bitmark");
		newNotification("Changing the network to 'bitmark'. This may take some time.");
		createContainerHelperLocal();
	} else {
		console.log("Already on bitmark");
		newNotification("The network is already set to 'bitmark'.");
	}
};

function setNetworkTesting(){
	// Fetch the preferences JSON object
	const preferences = ipcRenderer.sendSync('getPreferences');
	var network = preferences.blockchain.network;

	if(network === "bitmark"){
		preferences.blockchain.network = "testing";
		ipcRenderer.sendSync('setPreferences', {...preferences});
		console.log("Changing to testing");
		newNotification("Changing the network to 'testing'. This may take some time.");
		//Calls local createContainerHelper
		createContainerHelperLocal();
	} else {
		console.log("Already on testing");
		newNotification("The network is already set to 'testing'.");
	}
};

//Get the network and directory and pass it to the main function to get the IP then create the container
function createContainerHelperLocal(){
	const preferences = ipcRenderer.sendSync('getPreferences');
	var net = preferences.blockchain.network;
	var dir = preferences.directory.folder;
	var isWin = remote.getGlobal('process').platform === "win32";
	createContainerHelperIPOnly(net, dir, isWin)
};

//Function to handle buttons
(function () {
    const remote = require('electron').remote;
    const ipc = require('electron').ipcRenderer;
    
    function init() { 
      document.getElementById("min").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.minimize(); 
      });
      
      document.getElementById("max").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        if (!window.isMaximized()) {
          window.maximize();
        } else {
          window.unmaximize();
        }  
      });
      
      document.getElementById("close").addEventListener("click", function (e) {
        const window = remote.getCurrentWindow();
        window.close();
      }); 

      // Tell main process to show the menu when demo button is clicked
      document.getElementById('menu').addEventListener('click', function () {
        ipc.send('show-context-menu');
      });
    }; 
    
    document.onreadystatechange = function () {
      if (document.readyState == "complete") {
        init(); 
      }
    };
})();