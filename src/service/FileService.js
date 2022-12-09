import { createReadStream, createWriteStream } from 'fs'
import fs from 'fs'
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
}