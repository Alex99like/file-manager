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

  async compress(pathFile) {
    try {
      const pipe = promisify(pipeline)
      const gzip = zlib.createGzip()
      const input = createReadStream(pathFile)
      await fs.stat(pathFile)

      const out = createWriteStream(pathFile + '.gz')
      await pipe(input, gzip, out);
      this.success()
    } catch(e) {
      this.error()
    }
  }

  async decompress(pathFile) {
    try {
      const pipe = promisify(pipeline)
      const gzip = zlib.createUnzip()
      const input = createReadStream(pathFile)
      await fs.stat(pathFile)

      const nameGz = pathFile.replace('.gz', '')
      const out = createWriteStream(nameGz)
      await pipe(input, gzip, out);
      this.success()
    } catch(e) {
      this.error()
    }
  }
}