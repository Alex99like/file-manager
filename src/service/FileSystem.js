import { createReadStream, createWriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { promisify } from 'util'
import { pipeline } from 'stream'
import { readFile } from 'fs'

export class FileSystem {
  constructor(error, success) {
    this.success = success
    this.error = error
  }
  
  cat(pathName) {
    const stream = createReadStream(pathName)
    stream.on('data', (data) => {
      process.stdout.write(data.toString('utf-8') + '\n')
    })
    stream.on('error', () => this.error())
    stream.on('end', () => {
      this.success()
      stream.close()
    })
  }

  async add(pathName) {

    readFile(pathName, (err, data) => {
      if (err) {
          const stream = createWriteStream(pathName)
          stream.on('error', () => this.error())
          stream.on('ready', () => {
          this.success()
          stream.close()
        })
      } else {
        this.error()
      }
    })
    
  }

  async rm(pathName) {
    try {
      await fs.unlink(pathName)
      this.success()
    } catch(e) {
      this.error()
    }
  }

  async rn(pathName, newName) {
    try {
      const basename = pathName.split(path.sep)
      const newFile = path.resolve(pathName.replace(basename[basename.length - 1], newName))
    
      await fs.rename(pathName, newFile)
      this.success()
    } catch(e) {
      this.error()
    }
  }

  async cp(pathFile, newPath, rm) {
    try {
      await fs.access(pathFile)
      const basename = pathFile.split(path.sep)
      const two = path.resolve(newPath, basename[basename.length - 1])

      const input = createReadStream(pathFile)
      const out = createWriteStream(two)
      const pipe = promisify(pipeline)

      if (pathFile === two) throw new Error()

      await pipe(input, out);
      if (rm) await fs.rm(pathFile)
      input.close()
      out.close()
      this.success()
    } catch(e) {
      this.error()
    }
  }
}