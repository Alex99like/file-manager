import { createReadStream, createWriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import cp from 'child_process'
import { fileURLToPath } from 'url'
import { stdChunk, stdWrite } from './stdWrite.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

cp.fork(path.join(__dirname, 'stdWrite.js'))

export class FileService {
  readFile(pathOpt, currentPath) {

    const readStream = createReadStream(pathOpt)
    readStream.on('data', (chunk) => {
      stdWrite(stdChunk(chunk))
    })
    readStream.on('end', () => {
      stdWrite(null, currentPath)
      readStream.close()
    })
    readStream.on('error', () => {
      stdWrite('Failed operation')
      readStream.close()
    })
  }

  createFile(pathOpt, currentPath) {

    const stream = createWriteStream(pathOpt)
    stream.on('error', () => {
      stdWrite('Failed operation')
    })

    stream.on('ready', () => {
      stdWrite(currentPath)
      stream.close()
    })
  }

  async deleteFile(pathOpt, currentPath) {
    try {
      await fs.rm(pathOpt)
      stdWrite(currentPath)
    } catch(e) {
      stdWrite('Failed operation')
    }
  }

  async renameFile(pathOpt, currentPath, newName) {
    const arrPath = pathOpt.split(path.sep)
    const pathFile = pathOpt.replace(arrPath[arrPath.length - 1], newName)
    try {
      await fs.rename(pathOpt, pathFile)
      stdWrite(currentPath)
    } catch(e) {
      stdWrite('Failed operation')
    }
  }

  async copyFile(pathOpt, currentPath, newPathOpt, rm) {
    const arr = pathOpt.split(path.sep)
    const newPath = path.join(newPathOpt, arr[arr.length - 1])
     
    if (pathOpt === newPath) {
      stdWrite('Failed operation')
      return
    } 

    const input = createReadStream(pathOpt)
    const out = createWriteStream(newPath)

    input.on('error', () => stdWrite('Failed operation'))
    out.on('error', () => stdWrite('Failed operation'))

    out.on('ready', async () => {
      try {
        if (rm) await fs.rm(pathOpt)
        stdWrite(currentPath)
      } catch(e) {
        console.log('Filed operation')
      }
    })

    input.pipe(out)
  }

}