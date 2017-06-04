const electron = require('electron');
const app = electron.app;
const shell = electron.shell;
const Menu = electron.Menu;
const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ icon: "img/infos.png" });

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

    if (process.platform === 'darwin') {
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
    }

    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('focus', registerKeys);

    mainWindow.on('blur', unregisterKeys);

    function registerKeys() {
        globalShortcut.register('CommandOrControl+I', () => {
            mainWindow.webContents.openDevTools();
        });
    }

    function unregisterKeys() {
        globalShortcut.unregister('CommandOrControl+I');
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