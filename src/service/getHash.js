
import { fileURLToPath } from 'url'
import { stdChunk, stdWrite } from './stdWrite.js'
import { createReadStream } from 'fs'
import path from 'path'
import cp from 'child_process'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

cp.fork(path.join(__dirname, 'stdWrite.js'))

export const getHash = (path, currentPath) => {
  const hash = crypto.createHash('sha256')
  const input = createReadStream(path)

  input.on('error', () => {
    stdWrite('Failed error')
  })

  input.on('readable', () => {
    const data = input.read();
    if (data)
      hash.update(data);
    else {
      stdWrite(`${hash.digest('hex')}`);
      stdWrite(null, currentPath)
    }
  });
}