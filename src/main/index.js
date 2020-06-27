/* globals INCLUDE_RESOURCES_PATH */
import { app, ipcMain } from 'electron'
import git from 'isomorphic-git'
import fs from 'fs'
import http from 'isomorphic-git/http/node'

/**
 * Set `__resources` path to resources files in renderer process
 */
global.__resources = undefined // eslint-disable-line no-underscore-dangle
// noinspection BadExpressionStatementJS
INCLUDE_RESOURCES_PATH // eslint-disable-line no-unused-expressions
if (__resources === undefined) console.error('[Main-process]: Resources path is undefined')

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('c-clone', async (event, dir, url) => {
  return git.clone({
    fs,
    http,
    dir,
    url,
    singleBranch: true,
    depth: 1
  }).then(() => {
    return {
      success: true
    }
  }).catch(err => {
    return {
      success: false,
      reason: err
    }
  })
})

// Load here all startup windows
require('./mainWindow')
