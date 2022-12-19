import path from 'path'
import process from 'process'
import crypto from 'crypto'
import { createReadStream } from 'fs'

export class Hash {
  constructor(error, success) {
    this.success = success
    this.error = error
  }
  
  hash(pathFile) {
    const hash = crypto.createHash('sha256')
    const input = createReadStream(pathFile)
    input.on('error', () => this.error())

    input.on('readable', () => {
      const data = input.read();
      if (data)
        hash.update(data);
      else {
        console.log(`${hash.digest('hex')}`);
        this.success()
        input.close()
      }
    });
    }
} 