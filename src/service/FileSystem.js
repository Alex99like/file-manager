import { createReadStream, createWriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import process from 'process'

export class FileSystem {
  constructor(error, success) {
    this.success = success
    this.error = error
  }
  
  cat(pathName) {
    const stream = createReadStream(path.join(process.cwd(), pathName))
    stream.on('data', (data) => {
      process.stdout.write(data.toString('utf-8') + '\n')
    })
    stream.on('error', () => this.error())
    stream.on('end', () => this.success())
  }

  add(pathName) {
    const stream = createWriteStream(path.join(process.cwd(), pathName))
    stream.on('error', () => this.error())
    stream.on('ready', () => this.success())
  }

  async rm(pathName) {
    try {
      await fs.rm(path.join(process.cwd(), pathName))
      this.success()
    } catch(e) {
      this.error()
    }
  }

  async rn(pathName, newName) {
    const oldFile = path.join(process.cwd(), pathName)
    const newFile = path.join(process.cwd(), newName)
    try {
      await fs.rename(oldFile, newFile)
      this.success()
    } catch(e) {
      this.error()
    }
  }

  async cp(pathFile, newPath, rm) {
    const one = path.join(process.cwd(), pathFile)
    const two = path.join(newPath, pathFile)

    const input = createReadStream(one)
    const out = createWriteStream(two)

    input.on('error', () => this.error())
    out.on('error', () => this.error())

    out.on('ready', async () => {
      try {
        if (rm) await fs.rm(one)
        this.success()
      } catch(e) {
        this.error()
      }
    })

    input.pipe(out)
  }
}