// 各モジュールのインポート
const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

// ブラウザウィンドウに関する処理
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // ウィンドウプロセスの初期化スクリプト指定
    },
  });

  // URLの読み込み
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
};

// 初期化が完了し、ウィンドウの起動準備ができたときに呼ばれる処理
app.whenReady().then(() => {
  createWindow();

  // Djangoをgunicornで起動する処理
  app.on("active", function () {
    // 開いているウィンドウがなければ開く
    BrowserWindow.getAllWindows().length === 0 && createWindow();
  });
});

// ウィンドウが閉じたときの処理（macOSでは明示的にアプリケーションを終了したとき）
app.on("window-all-closed", function () {
  process.platform !== "darwin" && app.quit();
});
