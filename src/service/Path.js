import process from "process";
import path from "path";
import fs from 'fs/promises'

export class Path {
  constructor(error, success) {
    this.success = success
    this.error = error
  }

  cd(pathCD) {
    process.chdir(pathCD)
    this.success()
  }

  up() {
    if (process.cwd().length < 4) throw new Error() 
    process.chdir('../')
    this.success()
  }

  async ls() {
    try {
      const res = await fs.readdir(path.resolve(process.cwd()))
      const result = []
      const unknown = []
      for await (const item of res) {
        try {
          const el = await fs.stat(path.join(process.cwd(), item))
          if (el.isDirectory()) {
            result.push({Name: item, Types: 'directory'})
          } else if (el.isFile()) {
            result.push({Name: item, Types: 'file'})
          } else {
            unknown.push({Name: item, Types: 'unknown'})
          }
        } catch (e) {
        }
      }
      console.table(result.sort((a) => a.Types === 'directory' ? -1 : 1).concat(unknown))
      this.success()
    } catch(e) {
      console.log(e)
      this.error()
    }
  }
}
