const { app, BrowserWindow } = require('electron'); //Electron Default BrowserWindow - Used to display UI
const {Menu} = require('electron'); //Electron Default Menu
const path = require('path'); //Electron-Preferences (https://github.com/tkambler/electron-preferences)
const os = require('os'); //Electron-Preferences (https://github.com/tkambler/electron-preferences)
const ElectronPreferences = require('electron-preferences'); //Electron-Preferences (https://github.com/tkambler/electron-preferences)
const storage = require('electron-json-storage'); //Electron-JSON-Storage (https://github.com/electron-userland/electron-json-storage)
const publicIp = require('public-ip'); //Public-IP - Used to get external IP address (https://github.com/sindresorhus/public-ip)
const notifier = require('node-notifier'); //Notifications (https://www.npmjs.com/package/node-notifier)
const { exec } = require('child_process'); //Electron Default Child Process - Used to run CLI commands
const electron = require('electron');

var fs = require('fs'); //Used to check to see if directories exist/create ones
var userHome = require('user-home'); //User-Home (https://github.com/sindresorhus/user-home)

//Global variables to hold user preferences and external IP address
var network, auto_update, folder, public_IP;

//Get the location of the preferences directory and pass that to storage
const prefDir = app.getPath('userData');
storage.setDataPath(prefDir);

//Get the location of the preferences file
const prefLoc = path.resolve(app.getPath('userData'), 'preferences.json');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window and load the bitmarkNode UI
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
  });
  mainWindow.loadURL('http://localhost:9980');

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  //Get user preferences and update the IP address
  updatePrefs();
  getPublicIP();

  //Pull update if auto_update is on
  if(auto_update){
    console.log("Checking for updates...");
    pullUpdate();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//Update global variables that hold user preference
function updatePrefs(){
	//Get the JSON file
	storage.get('preferences', function(error, data) {
	  if (error) throw error;

	  //Update global variables
	  network = data.blockchain.network;
	  auto_update = data.update.auto_update;
	  folder = data.directory.folder;
	});
};

function getPublicIP(){
	publicIp.v4().then(ip => {
	  public_IP = ip;
	});
};

//Change the network to bitmark
function setNetworkBitmark(){
	updatePrefs();
	if(network === "testing"){
		//Gets default JSON, inputs users defined variables for folder and auto_update, and changes the network to bitmark
		storage.set('preferences', {"about": {},"blockchain": { "network": "bitmark" },"directory": { "folder": `${folder}`}, "drawer": { "show": true }, "markdown": { "auto_format_links": true, "show_gutter": false }, "preview": { "show": true }, "update": { "auto_update": `${auto_update}` } }, function(error){
			if (error) throw error;
			console.log("Changing to bitmark");
			notifier.notify(
				{
					title: "Bitmark Node",
					message: "Changing the network to 'bitmark'.",
					icon: path.join(__dirname, 'logo.png'),
					sound: true,
					wait: false
				}
			);
			updatePrefs();
		});
	} else {
		console.log("Already on bitmark");
		notifier.notify(
			{
				title: "Bitmark Node",
				message: "The network is already set to 'bitmark'.",
				icon: path.join(__dirname, 'logo.png'),
				sound: true,
				wait: false
			}
		);
	}
};

//Change the network to testing
function setNetworkTesting(){
	updatePrefs();
	if(network === "bitmark"){
		//Gets default JSON, inputs users defined variables for folder and auto_update, and changes the network to testing
		storage.set('preferences', {"about": {},"blockchain": { "network": "testing" },"directory": { "folder": `${folder}`}, "drawer": { "show": true }, "markdown": { "auto_format_links": true, "show_gutter": false }, "preview": { "show": true }, "update": { "auto_update": `${auto_update}` } }, function(error){
			if (error) throw error;
			console.log("Changing to testing");
			notifier.notify(
				{
					title: "Bitmark Node",
					message: "Changing the network to 'testing'.",
					icon: path.join(__dirname, 'logo.png'),
					sound: true,
					wait: false
				}
			);
			updatePrefs();
		});
	} else {
		console.log("Already on testing");
		notifier.notify(
			{
				title: "Bitmark Node",
				message: "The network is already set to 'testing'.",
				icon: path.join(__dirname, 'logo.png'),
				sound: true,
				wait: false
			}
		);
	}
};

//Check to see if dir is defined and if not create it
function directoryCheck(dir){
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	    console.log(`The directory ${dir} does not exist. Creating it now...`);
	}else{
		console.log("The directory exists.")
	}
}

//Check directories
function directoryCheckHelper(){
	bitmarknode = `${folder}/bitmark-node-data`;
	db = `${bitmarknode}/db`;
	data = `${bitmarknode}/data`;
	datatest = `${bitmarknode}/data-test`;

	directoryCheck(bitmarknode);
	directoryCheck(db);
	directoryCheck(data);
	directoryCheck(datatest);

	notifier.notify(
		{
			title: "Bitmark Node",
			message: "The neccessary directories were already setup or recently created.",
			icon: path.join(__dirname, 'logo.png'),
			sound: true,
			wait: false
		}
	);
}


//Terminal Functions
function startBitmarkNode(){
	exec("docker start bitmarkNode", (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    console.log("Error");
	    notifier.notify(
	    	{
	    		title: "Bitmark Node",
	    		message: "The Docker container has failed to start.",
	    		icon: path.join(__dirname, 'logo.png'),
	    		sound: true,
	    		wait: false
	    	}
	    );
	    return;
	  }

	  notifier.notify(
	  	{
	  		title: "Bitmark Node",
	  		message: "The Docker container has started.",
	  		icon: path.join(__dirname, 'logo.png'),
	  		sound: true,
	  		wait: false
	  	}
	  );

	  console.log(`${stdout}`);
	  mainWindow.reload();
	});
};

function stopBitmarkNode(){
	
	notifier.notify(
		{
			title: "Bitmark Node",
			message: "Stopping the Docker container... (This may take some time)",
			icon: path.join(__dirname, 'logo.png'),
			sound: true,
			wait: false
		}
	);

	exec("docker stop bitmarkNode", (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    console.log("Error");
	    notifier.notify(
	    	{
	    		title: "Bitmark Node",
	    		message: "The Docker container has failed to stop.",
	    		icon: path.join(__dirname, 'logo.png'),
	    		sound: true,
	    		wait: false
	    	}
	    );
	    return;
	  }

	  notifier.notify(
	  	{
	  		title: "Bitmark Node",
	  		message: "The Docker container has stopped.",
	  		icon: path.join(__dirname, 'logo.png'),
	  		sound: true,
	  		wait: false
	  	}
	  );

	  console.log(`${stdout}`);
	  mainWindow.reload();
	});
};

function removeBitmarkNode(){
  exec("docker rm bitmarkNode", (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log("Error");
      notifier.notify(
      	{
      		title: "Bitmark Node",
      		message: "The Docker could not be removed.",
      		icon: path.join(__dirname, 'logo.png'),
      		sound: true,
      		wait: false
      	}
      );
      return;
    }

    notifier.notify(
    	{
    		title: "Bitmark Node",
    		message: "The Docker container has been removed.",
    		icon: path.join(__dirname, 'logo.png'),
    		sound: true,
    		wait: false
    	}
    );

    console.log(`${stdout}`);
  });
};

function getContainerStatus(){
	exec("docker inspect -f '{{.State.Running}}' bitmarkNode", (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    console.log("Not setup");
	    notifier.notify(
	    	{
	    		title: "Bitmark Node",
	    		message: "The Docker container is not setup.",
	    		icon: path.join(__dirname, 'logo.png'),
	    		sound: true,
	    		wait: false
	    	}
	    );
	    return;
	  }

	  var str = stdout.toString();

	  if(str){
	  	console.log("Running");
	  	notifier.notify(
	  		{
	  			title: "Bitmark Node",
	  			message: "The Docker container is running.",
	  			icon: path.join(__dirname, 'logo.png'),
	  			sound: true,
	  			wait: false
	  		}
	  	);
      	return "Running";
	  }else{
	  	console.log("Stopped");
	  	notifier.notify(
	  		{
	  			title: "Bitmark Node",
	  			message: "The Docker container is stopped.",
	  			icon: path.join(__dirname, 'logo.png'),
	  			sound: true,
	  			wait: false
	  		}
	  	);
      	return "Stopped"
	  }
	});
};

function pullUpdate(){

	notifier.notify(
		{
			title: "Bitmark Node",
			message: "Checking for updates... (This may take some time)",
			icon: path.join(__dirname, 'logo.png'),
			sound: true,
			wait: false
		}
	);

	exec("docker pull bitmark/bitmark-node", (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    console.log("Error");
	    return;
	  }

	  var str = stdout.toString();

	  //Check to see if the up to date/updated text is present
	  if(str.indexOf("Image is up to date for bitmark/bitmark-node") !== -1){
	  	console.log("No Updates");
	  	notifier.notify(
	  		{
	  			title: "Bitmark Node",
	  			message: "No updates to the Bitmark Node software have been found.",
	  			icon: path.join(__dirname, 'logo.png'),
	  			sound: true,
	  			wait: false
	  		}
	  	);
	  }
	  else if(str.indexOf("Downloaded newer image for bitmark/bitmark-node") !== -1){
	  	console.log("Updated");
	  	notifier.notify(
	  		{
	  			title: "Bitmark Node",
	  			message: "The Bitmark Node software has been updated.",
	  			icon: path.join(__dirname, 'logo.png'),
	  			sound: true,
	  			wait: false
	  		}
	  	);
	  }else{
	  	console.log("Error");
	  }
	});
};

function getRunningNetwork(){
	exec("docker exec bitmarkNode printenv NETWORK", (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    console.log("Container not running");
	    notifier.notify(
	    	{
	    		title: "Bitmark Node",
	    		message: "The Docker container is not running.",
	    		icon: path.join(__dirname, 'logo.png'),
	    		sound: true,
	    		wait: false
	    	}
	    );
	    return;
	  }

    //Get network and remove whitespace
	  var str = stdout.toString().trim();

	  if(str === "bitmark"){
	  	console.log("Bitmark");
	  	notifier.notify(
	  		{
	  			title: "Bitmark Node",
	  			message: "The Docker container is running the 'bitmark' blockchain.",
	  			icon: path.join(__dirname, 'logo.png'),
	  			sound: true,
	  			wait: false
	  		}
	  	);
	  } else if (str === "testing"){
	  	console.log("Testing");
	  	notifier.notify(
	  		{
	  			title: "Bitmark Node",
	  			message: "The Docker container is running the 'testing' blockchain.",
	  			icon: path.join(__dirname, 'logo.png'),
	  			sound: true,
	  			wait: false
	  		}
	  	);
	  } else{
	  	console.log("Network Error");
	  	notifier.notify(
	  		{
	  			title: "Bitmark Node",
	  			message: "The Docker container is running on an unknown blockchain.",
	  			icon: path.join(__dirname, 'logo.png'),
	  			sound: true,
	  			wait: false
	  		}
	  	);
	  }
	});
};

//The command may have to be adjusted for the system (same with the folder)
function createContainer(){
	//Docker create container command (all on one line)
	var command = `docker run -d --name bitmarkNode -p 9980:9980 -p 2136:2136 -p 2130:2130 -e PUBLIC_IP=${public_IP} -e NETWORK=${network} -v ${folder}/bitmark-node-data/db:/.config/bitmark-node/db -v ${folder}/bitmark-node-data/data:/.config/bitmark-node/bitmarkd/bitmark/data -v ${folder}/bitmark-node-data/data-test:/.config/bitmark-node/bitmarkd/testing/data bitmark/bitmark-node`
	exec(command, (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    console.log("Error");
	    notifier.notify(
	    	{
	    		title: "Bitmark Node",
	    		message: "The Docker container failed to be created.",
	    		icon: path.join(__dirname, 'logo.png'),
	    		sound: true,
	    		wait: false
	    	}
	    );
	    return;
	  }

	  notifier.notify(
	  	{
	  		title: "Bitmark Node",
	  		message: "The Docker container was created successfully.",
	  		icon: path.join(__dirname, 'logo.png'),
	  		sound: true,
	  		wait: false
	  	}
	  );
	  console.log(`${stdout}`);
	  mainWindow.reload();
	});
};

//Testing functions
function printPrefs(){
	console.log(network);
	console.log(auto_update);
	console.log(folder);
	console.log(public_IP);
};

//Menu for UI
const menuTemplate = [
    {
    label: 'File',
    submenu: [
      {
        label: 'Preferences',
        accelerator: 'CmdOrCtrl+,',
        click () { preferences.show(); }
      },
      {
        role: 'quit'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://bitmark.com/tools-api/node') }
      }
    ]
  },
    {
    label: 'Testing',
    submenu: [
    	{
    	  label: 'Development Only'
    	},
    	{
    	  type: 'separator'
    	},
	  	{
	  	  label: 'Update Preferences',
	  	  click () { updatePrefs(); }
	  	},
	  	{
	  	  label: 'Print Parameters',
	  	  click () { printPrefs(); }
	  	},
	  	{
	  	  label: 'Start bitmarkNode',
	  	  click () { startBitmarkNode(); }
	  	},
	  	{
	  	  label: 'Stop bitmarkNode',
	  	  click () { stopBitmarkNode(); }
	  	},
      {
        label: 'Remove bitmarkNode',
        click () { removeBitmarkNode(); }
      },
	  	{
	  	  label: 'Get Container Status',
	  	  click () { getContainerStatus(); }
	  	},
      {
        label: 'Create Container',
        click () { createContainer(); }
      },
      {
        label: 'Check Directories',
        click () { directoryCheckHelper(); }
      },
      {
        label: 'Get Running Network',
        click () { getRunningNetwork(); }
      },
	  	{
	  	  label: 'Change to Bitmark',
	  	  click () { setNetworkBitmark(); }
	  	},
	  	{
	  	  label: 'Change to Testing',
	  	  click () { setNetworkTesting(); }
	  	},
	  	{
	  	  label: 'Pull Update',
	  	  click () { pullUpdate(); }
	  	},
      {
        label: 'Get IP Address',
        click () { getPublicIP(); }
      }
    ]
  }
]


if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

//Add the menu from the template
const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

//Get the default data directory
const dataDir = `${userHome}`;

//Preferences Menu
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
            "auto_update": "true"
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
                                    {'label': 'Automatically check for updates', 'value': 'true'},
                                    {'label': 'Manually check for updates', 'value': 'false'},
                                ],
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