import process from 'process'
import path from 'path'
import { getUserName } from './utils/getUserName.js'
import { stdChunk, stdWrite } from './utils/stdWrite.js'
import cp from 'child_process'
import { fileURLToPath } from 'url'
import { Path } from './utils/Path.js'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const userName = getUserName(process.argv)

cp.fork(path.resolve(__dirname, 'utils', 'stdWrite.js'))

const currentPath = new Path()

const actions = async (argv) => {
  const [command, optionOne] = argv.split(' ')

  if (command === 'cd') {
    await currentPath.update(optionOne)
    stdWrite(null, currentPath.path)
    return
  } 

  if (command === 'up') {
    const val = currentPath.up()
    val ? stdWrite(null, currentPath.path) : stdWrite('Failed operation')
    return
  }

  if (command === 'ls') {
    const val = await currentPath.viewDir()
    if (val) stdWrite(null, currentPath.path) 
    return
  }

  stdWrite('Invalid input')
}

const createInputCLI = () => {
  stdWrite(`Welcome to the File Manager, ${userName}!`)
  stdWrite(null, currentPath.path)

  process.stdin.on('data', (chunk) => {
    actions(stdChunk(chunk))
  })
}

createInputCLI()