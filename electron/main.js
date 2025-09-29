import { app, BrowserWindow, session } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win = null

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    autoHideMenuBar: true,
    title: "PaySlipGenerator", // ✅ window title
    icon: path.join(process.env.VITE_PUBLIC, 'LOGO.png'), // ✅ app icon
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false
    },
  })

  // 🚫 Remove menu completely
  win.setMenu(null)

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  // 🚫 Disable right-click & DevTools in production
  if (!VITE_DEV_SERVER_URL) {
    win.webContents.on('context-menu', (e) => e.preventDefault())
    win.webContents.on('before-input-event', (event, input) => {
      if (input.control && input.shift && input.key.toLowerCase() === 'i') {
        event.preventDefault()
      }
    })
  }

  // ✅ Allow downloads
  const ses = win.webContents.session
  ses.on('will-download', (event, item) => {
    const savePath = path.join(app.getPath('downloads'), item.getFilename())
    item.setSavePath(savePath)

    item.on('updated', (event, state) => {
      if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log(`Download completed: ${savePath}`)
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
}

// ✅ Set application name globally
app.setName("PaySlipGenerator")

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
