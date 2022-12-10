import process from 'process'
import { getUserName } from './utils/getUserName.js'
import { stdChunk, stdWrite } from './service/stdWrite.js'
import { actions } from './service/actions.js'
import os from 'os'

const userName = getUserName(process.argv)

const createInputCLI = (userName) => {
  if (!userName) {
    stdWrite('Failed operation')
    process.exit()
  }

  stdWrite(`Welcome to the File Manager, ${userName}!`)
  stdWrite(null, os.homedir())

  process.stdin.on('data', (chunk) => {
    actions(stdChunk(chunk))
  })

  process.on('exit', () => {
    stdWrite(`Thank you for using File Manager, ${userName}, goodbye!`)
  })
}

createInputCLI(userName)