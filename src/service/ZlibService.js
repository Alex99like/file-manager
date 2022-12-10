import zlib from 'zlib'
import { createReadStream, createWriteStream } from 'fs'
import path from 'path'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { stdWrite } from './stdWrite.js'

export class ZlibService {
  async compress(pathFile, currentPath) {
    const pipe = promisify(pipeline)
    const gzip = zlib.createGzip()
    const input = createReadStream(pathFile)
    const out = createWriteStream(pathFile + '.gz')
    try {
      await pipe(input, gzip, out);
      stdWrite(null, currentPath)
    } catch(e) {
      stdWrite('Failed operation')
    }
  }

  async decompress(pathFile, currentPath) {
    const pipe = promisify(pipeline)
    const gzip = zlib.createUnzip()
    const input = createReadStream(pathFile)
    const nameGz = pathFile.replace('.gz', '')
    const out = createWriteStream(nameGz)
    try {
      await pipe(input, gzip, out);
      stdWrite(null, currentPath)
    } catch(e) {
      stdWrite('Failed operation')
    }
  }
}