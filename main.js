const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
let cppChild;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Path to your C++ program executable
  const cppProgramPath = path.join('C:', 'Users', 'ttz03', 'Desktop', 'RevoluteApp', 'keyRemap', 'main.exe');
  cppChild = spawn(cppProgramPath);

  cppChild.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  cppChild.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  cppChild.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
}

// Handle IPC messages from the renderer process
ipcMain.on('update-key-assignment', (event, arg) => {
  const { oldKey, newKey } = arg;

  // Send the key reassignment to the C++ program
  if (cppChild) {
    cppChild.stdin.write(`${oldKey} ${newKey}\n`);
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
