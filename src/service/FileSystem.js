import { createReadStream, createWriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { promisify } from 'util'
import { pipeline } from 'stream'

export class FileSystem {
  constructor(error, success) {
    this.success = success
    this.error = error
  }
  
  cat(pathName) {
    
    const stream = createReadStream(path.resolve(process.cwd(), pathName))
    stream.on('data', (data) => {
      process.stdout.write(data.toString('utf-8') + '\n')
    })
    stream.on('error', () => this.error())
    stream.on('end', () => this.success())
  }

  add(pathName) {
    const stream = createWriteStream(path.resolve(process.cwd(), pathName))
    stream.on('error', () => this.error())
    stream.on('ready', () => this.success())
  }

  async rm(pathName) {
    try {
      await fs.rm(path.resolve(process.cwd(), pathName))
      this.success()
    } catch(e) {
      this.error()
    }
  }

  async rn(pathName, newName) {
    const oldFile = path.resolve(process.cwd(), pathName)
    const newFile = path.resolve(oldFile.replace(path.win32.basename(oldFile), newName))
    try {
      await fs.rename(oldFile, newFile)
      this.success()
    } catch(e) {
      this.error()
    }
  }

  async cp(pathFile, newPath, rm) {
    try {
      const one = path.resolve(process.cwd(), pathFile)
      const two = path.resolve(newPath, path.win32.basename(pathFile))

      const input = createReadStream(one)
      const out = createWriteStream(two)
      const pipe = promisify(pipeline)

      await pipe(input, out);
      if (rm) await fs.rm(one)
      this.success()
    } catch(e) {
      this.error()
    }
  }
}