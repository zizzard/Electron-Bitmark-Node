/* TODO
  1. Add context menu
  2. Windows testing
  3. MacOS testing
*/

const electron = require('electron'); //Electron
const {app, BrowserWindow} = require('electron'); //Electron Default BrowserWindow - Used to display UI
const {Menu} = require('electron'); //Electron Default Menu
const MenuItem = electron.MenuItem //Electron Menu Item - Context Menu
const path = require('path'); //Electron-Preferences (https://github.com/tkambler/electron-preferences)
const os = require('os'); //Electron-Preferences (https://github.com/tkambler/electron-preferences)
const ElectronPreferences = require('electron-preferences'); //Electron-Preferences (https://github.com/tkambler/electron-preferences)
const publicIp = require('public-ip'); //Public-IP - Used to get external IP address (https://github.com/sindresorhus/public-ip)
const notifier = require('node-notifier'); //Notifications (https://www.npmjs.com/package/node-notifier)
const { exec } = require('child_process'); //Electron Default Child Process - Used to run CLI commands
const windowStateKeeper = require('electron-window-state'); //Electron-Window-State - Keep window state from instances of program (https://www.npmjs.com/package/electron-window-state)
const ipc = electron.ipcMain //IPC used to display context menu (hamburger menu)

var fs = require('fs'); //Used to check to see if directories exist/create ones
var userHome = require('user-home'); //User-Home (https://github.com/sindresorhus/user-home)

//Get the location of the preferences file
const prefLoc = path.resolve(app.getPath('userData'), 'preferences.json');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {

	//On application start-up, run containerCheck
	containerCheck();

	// Load the previous state with fallback to defaults
	let mainWindowState = windowStateKeeper({
	  defaultWidth: 1200,
	  defaultHeight: 800
	});
		
	// Create the window using the state information
	mainWindow = new BrowserWindow({
		// Set window location and size as what is was on close
		'x': mainWindowState.x,
		'y': mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		//Set the title
		title: "Bitmark Node User Interface",
		icon: path.join(__dirname, 'assets/icons/icon.png'),
    	frame: false,
    	darkTheme: true
	});

	//Load the webpage
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
	  // Dereference the window object, usually you would store windows
	  // in an array if your app supports multi windows, this is the time
	  // when you should delete the corresponding element.
	  mainWindow = null;
	});

	// Let us register listeners on the window, so we can update the state
	// automatically (the listeners will be removed when the window is closed)
	// and restore the maximized or full screen state
	mainWindowState.manage(mainWindow);

	//Check for check for updates if auto update is on after 2 seconds
	setTimeout(autoUpdateCheck, 2000);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

/* User Interface Functions */

//Display notification with str text
function newNotification(str){
	notifier.notify(
		{
			title: "Bitmark Node",
			message: `${str}`,
			icon: path.join(__dirname, 'assets/icons/icon.png'),
			sound: true,
			wait: false
		}
	);
};

//Pull update if auto_update is on
function autoUpdateCheck(){
	const auto_update = preferences.value('update.auto_update');
	if(auto_update == true){
		console.log("Checking for updates with auto updater");
		pullUpdate();
	}
};


/* Terminal Calling Functions */

/* Ran on startup and checks the status of the container
    1. If the container is not setup, it creates it
    2. If the container is not start, it starts it
    3. If the container is running, it does nothing
*/
function containerCheck(){

	exec("docker inspect -f '{{.State.Running}}' bitmarkNode", (err, stdout, stderr) => {
	  //If the container is not setup, create it
	  if (err) {
	  	createContainerHelper();
	  }

	  //If the container is stopped, start it
	  var str = stdout.toString().trim();
	  if(str === "false"){
		startBitmarkNode_noNotif();
	  }
	});
};

// Start the bitmarkNode Docker container
function startBitmarkNode(){

	exec("docker inspect -f '{{.State.Running}}' bitmarkNode", (err, stdout, stderr) => {
	  //If the container is not setup, create it
	  if (err) {
	  	console.log("Failed to start container");
	  	newNotification("The Docker container is not setup. Please restart the application.");
	  	return;
	  }

	  //If the container is stopped, start it
	  var str = stdout.toString().trim();
	  if(str === "true"){
	  	console.log("Container already running.");
	  	newNotification("The Docker container is already running.");
	  }else{
	  	exec("docker start bitmarkNode", (err, stdout, stderr) => {
	  	  if (err) {
	  	    // node couldn't execute the command
	  	    console.log("Failed to start container");
	  	    newNotification("The Docker container has failed to start.");
	  	    return;
	  	  }

	  	  newNotification("The Docker container has started.");

	  	  console.log(`${stdout}`);
	  	  mainWindow.reload();
	  	});
	  }
	});
};

// Start the bitmarkNode Docker container without a notification
function startBitmarkNode_noNotif(){
	exec("docker start bitmarkNode", (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    console.log("Failed to start container");
	    return;
	  }

	  console.log(`${stdout}`);
	  mainWindow.reload();
	});
};

// Stop the bitmarkNode Docker container
function stopBitmarkNode(){
	
	newNotification("Stopping the Docker container... (This may take some time)");

	exec("docker stop bitmarkNode", (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    console.log("Failed to stop container");
	    newNotification("The Docker container has failed to stop.");
	    return;
	  }

	  console.log(`${stdout}`);
	  newNotification("The Docker container has stopped.");
	  mainWindow.reload();
	});
};


//Create the container with no information given
function createContainerHelper(){
	const net = preferences.value('blockchain.network');
	const dir = preferences.value('directory.folder');

	publicIp.v4().then(ip => {
	  createContainer(ip, net, dir);
	});
}

// Create the container with the network and directory given
function createContainerHelperIPOnly(net, dir){
	publicIp.v4().then(ip => {
	  createContainer(ip, net, dir);
	});
}

//The command may have to be adjusted for the system (same with the folder)
//Create the docker container
function createContainer(ip, net, dir){

	directoryCheckHelper(dir);

	//Attempt to remove and stop the container before creating the container.
	exec("docker stop bitmarkNode", (err, stdout, stderr) => {
		if (err) {
			//Continue if failed to remove the container as the container may not exist
			console.log("Failed to stop container");
	  	}

		console.log(`${stdout}`);

		exec("docker rm bitmarkNode", (err, stdout, stderr) => {
	    	if (err) {
	    		//Continue if failed to remove the container as the container may not exist
	    		console.log("Failed to remove container");
	    	}

	    	console.log(`${stdout}`);

	    	var command = `docker run -d --name bitmarkNode -p 9980:9980 -p 2136:2136 -p 2130:2130 -e PUBLIC_IP=${ip} -e NETWORK=${net} -v ${dir}/bitmark-node-data/db:/.config/bitmark-node/db -v ${dir}/bitmark-node-data/data:/.config/bitmark-node/bitmarkd/bitmark/data -v ${dir}/bitmark-node-data/data-test:/.config/bitmark-node/bitmarkd/testing/data bitmark/bitmark-node`
	    	exec(command, (err, stdout, stderr) => {
	    		if (err) {
	        		console.log("Failed to create container");
	        		newNotification("The Docker container failed to be created. Ensure you're connected to the Internet.");
	        		return;
	    		}

	    		console.log(`${stdout}`);
	    		newNotification("The Docker container was created successfully.");
	    	});
		});
	});
	//Reload the window when completed
	mainWindow.reload();
};

// Check for updates from bitmark/bitmark-node
function pullUpdate(){

	newNotification("Checking for updates... (This may take some time)");

	exec("docker pull bitmark/bitmark-node", (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    console.log("Failed to pull update");
	    newNotification("There was an error checking for an update. Please check your Internet connection and restart the Docker application.");
	    return;
	  }

	  var str = stdout.toString();

	  //Check to see if the up to date/updated text is present
	  if(str.indexOf("Image is up to date for bitmark/bitmark-node") !== -1){
	  	console.log("No Updates");
	  	newNotification("No updates to the Bitmark Node software have been found.");
	  }
	  else if(str.indexOf("Downloaded newer image for bitmark/bitmark-node") !== -1){
	  	console.log("Updated");
	  	newNotification("The Bitmark Node software has downloaded. Installing updates now.");
	  	createContainerHelper();
	  	newNotification("The Bitmark Node software has been updated.");
	  }else{
	  	console.log("Unknown update error");
	  	newNotification("There was an error checking for an update. Please check your Internet connection and restart the Docker application.");
	  }
	});
};

/* Directory Functions */

//Check to see if dir is defined and if not create it
function directoryCheck(dir){
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	    console.log(`The directory ${dir} does not exist. Creating it now...`);
	}else{
		console.log("The directory exists.")
	}
};

//Check directories
function directoryCheckHelper(dir){

	const folder = dir;

	bitmarknode = `${folder}/bitmark-node-data`;
	db = `${bitmarknode}/db`;
	data = `${bitmarknode}/data`;
	datatest = `${bitmarknode}/data-test`;

	directoryCheck(bitmarknode);
	directoryCheck(db);
	directoryCheck(data);
	directoryCheck(datatest);
};

const menu = new Menu()
menu.append(new MenuItem({ label: 'Hello' }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))

app.on('browser-window-created', function (event, win) {
  win.webContents.on('context-menu', function (e, params) {
    menu.popup(win, params.x, params.y)
  })
})

ipc.on('show-context-menu', function (event) {
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})


//Preferences Menu

//Get the default data directory
const dataDir = `${userHome}`;

const preferences = new ElectronPreferences({
    /**
     * Where should preferences be saved?
     */
    'dataStore': prefLoc,
    /**
     * Default values.
     */
    'defaults': {
        'markdown': {
            'auto_format_links': true,
            'show_gutter': false
        },
        'preview': {
            'show': true
        },
        'drawer': {
            'show': true
        },
        "blockchain": {
            "network": "bitmark"
        },
        "update": {
            "auto_update": true
        },
        "directory": {
            "folder": dataDir
        },
    },
    /**
     * If the `onLoad` method is specified, this function will be called immediately after
     * preferences are loaded for the first time. The return value of this method will be stored as the
     * preferences object.
     */
    'onLoad': (preferences) => {
        // ...
        return preferences;
    },
    /**
     * The preferences window is divided into sections. Each section has a label, an icon, and one or
     * more fields associated with it. Each section should also be given a unique ID.
     */
    'sections': [
        {
            'id': 'blockchain',
            'label': 'Blockchain Settings',
            'icon': 'settings-gear-63',
            'form': {
                'groups': [
                    {
                        'label': 'Blockchain Settings',
                        'fields': [
                            {
                                'heading': 'Blockchain Network',
                                'content': "<p>The 'bitmark' blockchain is the offical version of the Bitmark blockchain.\
                                               The 'testing' is a testnet version of the blockchain used for development testing.</p>",
                                'type': 'message',
                            },
                            {
                                'key': 'network',
                                'type': 'radio',
                                'options': [
                                    {'label': 'Bitmark', 'value': 'bitmark'},
                                    {'label': 'Testing', 'value': 'testing'},
                                ],
                                'help': 'Select which Blockchain you would like to use.'
                            }
                        ]
                    }
                ]
            }
        },
        {
            'id': 'update',
            'label': 'Update Settings',
            'icon': 'square-download',
            'form': {
                'groups': [
                    {
                        /**
                         * Group heading is optional.
                         */
                        'label': 'Update Settings',
                        'fields': [
                            {
                                'label': 'How would you like to check for updates?',
                                'key': 'auto_update',
                                'type': 'radio',
                                'options': [
                                    {'label': 'Automatically check for updates', 'value': true},
                                    {'label': 'Manually check for updates', 'value': false},
                                ],
                                'help': 'Note: Automatic updates will be installed automatically.'
                            },
                        ]
                    }
                ]
            }
        },
        {
            'id': 'directory',
            'label': 'File Directory',
            'icon': 'folder-15',
            'form': {
                'groups': [
                    {
                        'label': 'File Directory',
                        'fields': [
                            {
                            	'label': 'Blockchain storage directory',
                                'key': 'folder',
                                'type': 'directory',
                                'help': 'The location where the Bitmark Node container will store its data.'
                            }
                        ]
                    }
                ]
            }
        },
        {
            'id': 'about',
            'label': 'About',
            'icon': 'badge-13',
            'form': {
                'groups': [
                    {
                        'label': 'About Bitmark Node',
                        'fields': [
                        	{
                        	    'label': 'description',
                        	    'heading': 'Description',
                        	    'content': "<p>The Bitmark node software enables any computer on the Internet to join the Bitmark network as a fully-validating peer.\
                        	                   The Bitmark blockchain is an independent chain, optimized for storing property titles, or bitmarks, and does not have its own internal currency (transaction fees are in bitcoin or litecoin).\
                        	                   The peer-to-peer network is written in Go and uses the ZeroMQ distributed messaging library. Consensus is secured using the Argon2 hashing algorithm as proof-of-work.</p>",
                        	    'type': 'message',
                        	},
                            {
                                'label': 'container',
                                'heading': 'Bitmark Node Docker Container',
                                'content': "<p>https://hub.docker.com/r/bitmark/bitmark-node/</p>",
                                'type': 'message',
                            },
                            {
                                'label': 'electron',
                                'heading': 'Electron',
                                'content': "<p>https://electronjs.org/</p>",
                                'type': 'message',
                            },
                        ]
                    }
                ]
            }
        }
    ]
});