// CORPUS Desktop: zeigt die Web-App aus ../dist in einem eigenen Fenster – komplett offline.
// Die App wird über das eigene Schema corpus://app/ geladen. So bleiben absolute Pfade (/assets/…),
// ES-Module und der lokale Speicher (Notizen, Lernstand) zwischen den Starts stabil erhalten.
const { app, BrowserWindow, protocol, net, shell, Menu } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const ROOT = app.isPackaged ? path.join(process.resourcesPath, 'app') : path.join(__dirname, '..', 'dist');
const ORIGIN = 'corpus://app';

protocol.registerSchemesAsPrivileged([{
  scheme: 'corpus',
  privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true, allowServiceWorkers: true }
}]);

if (!app.requestSingleInstanceLock()) app.quit();

function serveFile(request) {
  const { pathname } = new URL(request.url);
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  const file = path.normalize(path.join(ROOT, rel));
  // Nur Dateien innerhalb des App-Ordners ausliefern.
  if (!file.startsWith(ROOT + path.sep)) return new Response('Not found', { status: 404 });
  return net.fetch(pathToFileURL(file).toString());
}

// Nur sichere Adressarten an das Betriebssystem weitergeben.
function openSafe(url) {
  try { if (['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(url).protocol)) shell.openExternal(url); } catch {}
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 980, minHeight: 680,
    title: 'CORPUS Anatomieatlas', backgroundColor: '#eff1f2', show: false, autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
  });
  win.once('ready-to-show', () => win.show());
  // Quellen-Links, tel: und alles Fremde im Standardbrowser bzw. System öffnen.
  win.webContents.setWindowOpenHandler(({ url }) => { if (!url.startsWith(ORIGIN)) openSafe(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(ORIGIN)) { e.preventDefault(); openSafe(url); } });
  win.loadURL(ORIGIN + '/');
}

app.on('second-instance', () => { const [w] = BrowserWindow.getAllWindows(); if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });

app.whenReady().then(() => {
  protocol.handle('corpus', serveFile);
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{ role: 'appMenu' }, { role: 'editMenu' }, { role: 'viewMenu' }, { role: 'windowMenu' }]));
  } else {
    Menu.setApplicationMenu(null);
  }
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
