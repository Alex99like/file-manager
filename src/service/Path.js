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
      const res = await fs.readdir(process.cwd())
      
      const result = []
      const unknown = []
      
      for await (const item of res) {
        if ((await fs.stat(path.join(process.cwd(), item))).isDirectory()) {
          result.push({Name: item, Types: 'dir'})
        } else if ((await fs.stat(path.join(process.cwd(), item))).isFile()) {
          result.push({Name: item, Types: 'file'})
        } else {
          unknown.push({Name: item, Types: 'unknown'})
        }
      }
      console.table(result.sort((a) => a.Types === 'dir' ? -1 : 1).concat(unknown))
      this.success()
    } catch(e) {
      this.error()
    }
  }
}
