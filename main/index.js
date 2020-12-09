const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const url = require('url')

const readSync = require('node-yaml').readSync

let mainWindow // 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
//判断命令行脚本的第二参数是否含--debug
const development = /--development/.test(process.argv[2]);

function createWindow() {
	// 隐藏菜单栏
	Menu.setApplicationMenu(null)
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		frame: true,
		webPreferences: {
			javascript: true,
			plugins: true,
			nodeIntegration: true, // 是否集成 Nodejs
			webSecurity: false,
			preload: path.join(__dirname, './renderer.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
		}
	})

	// 加载应用 打包
	// console.log(development)
	if (development) {
		mainWindow.loadURL('http://localhost:8000')
	} else {
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file:',
			slashes: true
		}))
	}

	if (development) {
		// 打开开发者工具，默认不打开
		mainWindow.webContents.openDevTools({
			// 浮动
			mode: 'detach'
		})
	}
	// 关闭window时触发下列事件.
	mainWindow.on('closed', () => {
		mainWindow = null
	})

}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
	createWindow()
	app.on('activate', function () {
		// macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})
// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
	// macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
	if (process.platform !== 'darwin') {
		app.quit()
	}
})