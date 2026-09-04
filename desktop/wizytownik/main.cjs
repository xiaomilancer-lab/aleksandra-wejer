"use strict";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { app, BrowserWindow, session } = require("electron");

const APP_ORIGIN = "https://aleksandrawejer.pl";
const START_URL = `${APP_ORIGIN}/wizytownik?source=windows-app`;
const PRIVATE_PARTITION = "wizytownik-private";

app.enableSandbox();
app.setAppUserModelId("pl.aleksandrawejer.wizytownik");

function isTrustedUrl(value) {
  try {
    return new URL(value).origin === APP_ORIGIN;
  } catch {
    return false;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 840,
    minHeight: 640,
    show: false,
    backgroundColor: "#F8F5F0",
    autoHideMenuBar: true,
    icon: `${__dirname}/build/icon.png`,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      webviewTag: false,
      devTools: false,
      spellcheck: true,
      partition: PRIVATE_PARTITION,
    },
  });

  win.setMenu(null);
  win.setContentProtection(true);
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (event, url) => {
    if (!isTrustedUrl(url)) event.preventDefault();
  });
  win.webContents.on("before-input-event", (event, input) => {
    const blocked = input.key === "F12" || ((input.control || input.meta) && input.shift && ["I", "J", "C"].includes(input.key.toUpperCase()));
    if (blocked) event.preventDefault();
  });
  win.once("ready-to-show", () => win.show());
  win.loadURL(START_URL);
}

const hasLock = app.requestSingleInstanceLock();
if (!hasLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    // No `persist:` prefix: login tokens and browsing data disappear when the
    // program closes, so a copied Windows profile does not carry the session.
    const appSession = session.fromPartition(PRIVATE_PARTITION, { cache: false });
    appSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
    appSession.setPermissionCheckHandler(() => false);
    appSession.on("will-download", (event, item) => {
      const source = item.getURL();
      if (!isTrustedUrl(source) || !source.includes("/api/wizytownik/")) event.preventDefault();
    });
    createWindow();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}

app.on("window-all-closed", () => app.quit());
