import process from 'process'
import path from 'path'
import { getUserName } from './utils/getUserName.js'
import { stdChunk, stdWrite } from './service/stdWrite.js'
import cp from 'child_process'
import { fileURLToPath } from 'url'
import { Path } from './service/PathService.js'
import { FileService } from './service/FileService.js'
import { OsService } from './service/OsService.js'
import { getHash } from './service/getHash.js'
import { ZlibService } from './service/ZlibService.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const userName = getUserName(process.argv)


cp.fork(path.resolve(__dirname, 'service', 'stdWrite.js'))

const currentPath = new Path()
const fileService = new FileService()
const osService = new OsService()
const zlibService = new ZlibService()

const actions = async (argv) => {
  const [command, optionOne, optionTwo] = argv.split(' ')

  let filePath;
    if (optionOne)
    if (path.isAbsolute(optionOne)) {
      filePath = optionOne
    } else {
      filePath = path.join(currentPath.path, optionOne)
    }

  if (command === '.exit') {
    process.exit()
  }

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

  if (command === 'cat' && filePath) {
    fileService.readFile(filePath, currentPath.path)
    return
  }

  if (command === 'rn' && filePath && optionTwo) {
    fileService.renameFile(filePath, currentPath.path, optionTwo)
    return
  }

  if (command === 'cp' && filePath && optionTwo) {
    fileService.copyFile(filePath, currentPath.path, optionTwo)
    return
  }

  if (command === 'mv' && filePath && optionTwo) {
    fileService.copyFile(filePath, currentPath.path, optionTwo, 'rm')
    return
  }

  if (command === 'rm' && filePath) {
    await fileService.deleteFile(filePath, currentPath.path)
    return
  }

  if (command === 'add') {
    fileService.createFile(filePath, currentPath.path)
    return
  }

  if (command === 'hash') {
    getHash(filePath, currentPath.path)
    return
  }

  if (command === 'compress') {
    zlibService.compress(filePath, currentPath.path)
    return
  }

  if (command === 'decompress') {
    zlibService.decompress(filePath, currentPath.path)
    return
  }

  if (command === 'os') {
    if (optionOne === '--EOL') {
      osService.eol(currentPath.path)
      return
    }

    if (optionOne === '--cpus') {
      osService.cpus(currentPath.path)
      return
    }

    if (optionOne === '--homedir') {
      osService.homedir(currentPath.path)
      return
    }

    if (optionOne === '--username') {
      osService.username(currentPath.path)
      return
    }

    if (optionOne === '--architecture') {
      osService.architecture(currentPath.path)
      return
    }
  }

  stdWrite('Invalid input')
}

const createInputCLI = (userName) => {
  

  if (!userName) {
    stdWrite('Failed operation')
    process.exit()
  }

  stdWrite(`Welcome to the File Manager, ${userName}!`)
  stdWrite(null, currentPath.path)

  process.stdin.on('data', (chunk) => {
    actions(stdChunk(chunk))
  })

  process.on('exit', () => {
    stdWrite(`Thank you for using File Manager, ${userName}, goodbye!`)
  })
}

createInputCLI(userName)