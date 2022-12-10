import { fileURLToPath } from 'url'
import { stdChunk, stdWrite } from './stdWrite.js'
import path from 'path'
import cp from 'child_process'
import os from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

cp.fork(path.join(__dirname, 'stdWrite.js'))

export class OsService {
  eol(path) {
    stdWrite(`${os.type()}\n${os.platform()}\n${os.release()}`)
    stdWrite(null, path)
  }

  cpus(path) {
    const cpus = os.cpus()
    stdWrite(`CPUS ${cpus.length}`)
    cpus.forEach((el, i) => {
      const [model, frequency] = el.model.split('@')
      if (model && frequency) {
        stdWrite(`${i + 1}: \n model: ${model} \n frequency: ${frequency}`)
      } else {
        stdWrite(`${i + 1}: ${el.model} \n`)
      }
    })
    stdWrite(null, path)
  }

  homedir(path) {
    stdWrite(`${os.homedir()}`)
    stdWrite(null, path)
  }

  username(path) {
    stdWrite(`${os.userInfo().username}`)
    stdWrite(null, path)
  }

  homedir(path) {
    stdWrite(`${os.homedir()}`)
    stdWrite(null, path)
  }

  architecture(path) {
    stdWrite(`${os.arch()}`)
    stdWrite(null, path)
  }
}