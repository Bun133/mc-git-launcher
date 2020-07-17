/*
**  Nuxt
*/
const http = require('http')
const { Nuxt, Builder } = require('nuxt')
let config = require('./nuxt.config.js')
config.rootDir = __dirname // for electron-builder
// Init Nuxt.js
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)
// Build only in dev mode
let _NUXT_URL_ = '';
if (false && config.dev) {
    builder.build().catch(err => {
        console.error(err) // eslint-disable-line no-console
        process.exit(1)
    })
    // Listen the server
    server.listen()
    _NUXT_URL_ = `http://localhost:${server.address().port}`
    console.log(`Nuxt working on ${_NUXT_URL_}`)
} else {

    _NUXT_URL_ = 'file://' + __dirname + '/dist/index.html';

}


/*
** Electron
*/
let win = null // Current window
const electron = require('electron')
const app = electron.app
const newWin = () => {
    win = new electron.BrowserWindow({
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        preload: __dirname + '/preload.js'
      }
    })
    // win.maximize()
    win.on('closed', () => win = null)
    if (false && config.dev) {
        // Wait for nuxt to build
        const pollServer = () => {

            http.get(_NUXT_URL_, (res) => {
                if (res.statusCode === 200) {
                    win.loadURL(_NUXT_URL_)
                } else {
                    console.log("restart poolServer");
                    setTimeout(pollServer, 300)
                }
            })
                .on('error', pollServer)

        }
        pollServer()
    } else {
        return win.loadURL(_NUXT_URL_)
    }
}
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
