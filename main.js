const electron = require('electron');
const app = electron.app;
const shell = electron.shell;
const Menu = electron.Menu;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;

const path = require('path');
const url = require('url');

let mainWindow;

var fullscreen = false;

function createWindow() {
    mainWindow = new BrowserWindow({ icon: "img/infos.png", width: 950 });
    if (process.platform === "darwin") {
        var template = [{
                label: "View",
                submenu: [
                    { role: 'togglefullscreen' }
                ]
            },
            {
                role: 'help',
                submenu: [{
                    label: 'Learn More',
                    click() {
                        shell.openExternal('http://herobone.com');
                    }
                }]
            }
        ];

        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services', submenu: [] },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        });

        var menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    } else {
        mainWindow.setMenu(null);
    }

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('focus', registerKeys);

    mainWindow.on('blur', unregisterKeys);

    ipc.on("togglefullscreen", () => {
        if (fullscreen === false) {
            mainWindow.setFullScreen(true);
            fullscreen = true;
        } else {
            mainWindow.setFullScreen(false);
            fullscreen = false;
        }
    });

    ipc.on('goToPage', (event, arg) => {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, arg),
            protocol: 'file:',
            slashes: true
        }));
    });

    function registerKeys() {
        globalShortcut.register('CommandOrControl+I', () => {
            mainWindow.webContents.openDevTools();
        });
        globalShortcut.register('CommandOrControl+R', () => {
            mainWindow.webContents.reloadIgnoringCache();
        });
    }

    function unregisterKeys() {
        globalShortcut.unregister('CommandOrControl+I');
        globalShortcut.unregister('CommandOrControl+R');
    }

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}
app.on('ready', createWindow);

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow();
    }
});