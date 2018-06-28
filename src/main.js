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
            'id': 'about',
            'label': 'About You',
            /**
             * See the list of available icons below.
             */
            'icon': 'single-01',
            'form': {
                'groups': [
                    {
                        /**
                         * Group heading is optional.
                         */
                        'label': 'About You',
                        'fields': [
                            {
                                'label': 'First Name',
                                'key': 'first_name',
                                'type': 'text',
                                /**
                                 * Optional text to be displayed beneath the field.
                                 */
                                'help': 'What is your first name?'
                            },
                            {
                                'label': 'Last Name',
                                'key': 'last_name',
                                'type': 'text',
                                'help': 'What is your last name?'
                            },
                            {
                                'label': 'Gender',
                                'key': 'gender',
                                'type': 'dropdown',
                                'options': [
                                    {'label': 'Male', 'value': 'male'},
                                    {'label': 'Female', 'value': 'female'},
                                    {'label': 'Unspecified', 'value': 'unspecified'},
                                ],
                                'help': 'What is your gender?'
                            },
                            {
                                'label': 'Which of the following foods do you like?',
                                'key': 'foods',
                                'type': 'checkbox',
                                'options': [
                                    { 'label': 'Ice Cream', 'value': 'ice_cream' },
                                    { 'label': 'Carrots', 'value': 'carrots' },
                                    { 'label': 'Cake', 'value': 'cake' },
                                    { 'label': 'Spinach', 'value': 'spinach' }
                                ],
                                'help': 'Select one or more foods that you like.'
                            },
                            {
                                'label': 'Coolness',
                                'key': 'coolness',
                                'type': 'slider',
                                'min': 0,
                                'max': 9001
                            },
                            {
                                'label': 'Eye Color',
                               'key': 'eye_color',
                                'type': 'color',
                                'format': 'hex', // can be hex, hsl or rgb
                                'help': 'Your eye color'
                            },
                            {
                                'label': 'Hair Color',
                                'key': 'hair_color',
                                'type': 'color',
                                'format': 'rgb',
                                'help': 'Your hair color'
                            }
                        ]
                    }
                ]
            }
        },
        {
            'id': 'notes',
            'label': 'Notes',
            'icon': 'folder-15',
            'form': {
                'groups': [
                    {
                        'label': 'Stuff',
                        'fields': [
                            {
                                'label': 'Read notes from folder',
                                'key': 'folder',
                                'type': 'directory',
                                'help': 'The location where your notes will be stored.'
                            },
                            {
                                'heading': 'Important Message',
                                'content': '<p>The quick brown fox jumps over the long white fence. The quick brown fox jumps over the long white fence. The quick brown fox jumps over the long white fence. The quick brown fox jumps over the long white fence.</p>',
                                'type': 'message',
                            }
                        ]
                    }
                ]
            }
        },
        {
            'id': 'space',
            'label': 'Other Settings',
            'icon': 'spaceship',
            'form': {
                'groups': [
                    {
                        'label': 'Other Settings',
                        'fields': [
                            {
                                'label': 'Phone Number',
                                'key': 'phone_number',
                                'type': 'text',
                                'help': 'What is your phone number?'
                            },
                            {
                                'label': "Foo or Bar?",
                                'key': 'foobar',
                                'type': 'radio',
                                'options': [
                                    {'label': 'Foo', 'value': 'foo'},
                                    {'label': 'Bar', 'value': 'bar'},
                                    {'label': 'FooBar', 'value': 'foobar'},
                                ],
                                'help': 'Foo? Bar?'
                            }
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