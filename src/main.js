const { app, BrowserWindow } = require('electron'); //Bitmark UI
const {Menu} = require('electron') //Menu
const path = require('path'); //Electron-Preferences
const os = require('os'); //Electron-Preferences
const ElectronPreferences = require('electron-preferences'); //Electron-Preferences

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:9980');

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
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

//Preferences - Currently not setup
const preferences = new ElectronPreferences({
    /**
     * Where should preferences be saved?
     */
    'dataStore': path.resolve(app.getPath('userData'), 'preferences.json'),
    /**
     * Default values.
     */
    'defaults': {
        'notes': {
            'folder': path.resolve(os.homedir(), 'Notes')
        },
        'markdown': {
            'auto_format_links': true,
            'show_gutter': false
        },
        'preview': {
            'show': true
        },
        'drawer': {
            'show': true
        }
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

//Menu
const menuTemplate = [
    {
    label: 'File',
    submenu: [
      {
        label: 'Preferences',
        accelerator: 'CmdOrCtrl+,',
        click: () => preferences.show()
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

const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)