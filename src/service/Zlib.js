import zlib from 'zlib'
import path from 'path'
import fs from 'fs/promises'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { createReadStream, createWriteStream } from 'fs'

export class Zlib {
  constructor(error, success) {
    this.success = success
    this.error = error
  }

  async compress(pathFile, newPath) {
    try {
      await fs.access(pathFile)
      const pipe = promisify(pipeline)
      const gzip = zlib.createBrotliCompress()
      const input = createReadStream(pathFile)
      
      const nameGz = newPath.endsWith('.gz') ? newPath : newPath + '.gz'
      const out = createWriteStream(nameGz)
      await pipe(input, gzip, out);
      this.success()
    } catch(e) {
      this.error()
    } 
  }

  async decompress(pathFile, newPath) {
    try {
      await fs.access(pathFile)
      const pipe = promisify(pipeline)
      const gzip = zlib.createBrotliDecompress()
      const input = createReadStream(pathFile)

      const nameGz = newPath.endsWith('.gz') ? newPath.replace('.gz', '') : newPath
      const out = createWriteStream(nameGz)
      await pipe(input, gzip, out);
      this.success()
    } catch(e) {
      this.error()
    }
  }
}