import os from 'os'
import path from 'path'
import fs from 'fs/promises'

export class Path {
  constructor() {
    this.arrPath = os.homedir().split(path.sep)
  }

  async update(newPath) {
    const pathAbs = path.isAbsolute(newPath) 
    
    if (pathAbs) {
      try {
        await fs.stat(path.join(newPath))
        let pathArr = newPath.split(path.sep)
        if (pathArr.length === 1) pathArr = newPath.split('/')
        this.arrPath = pathArr
      } catch(e) {
        console.log('Failed operation')
      }
    } else {
      try {
        await fs.stat(path.join(...this.arrPath, newPath))
        let pathArr = newPath.split(path.sep)
        if (pathArr.length === 1) pathArr = newPath.split('/')
        pathArr.forEach((el) => {
          this.arrPath.push(el)
        })  
      } catch(e) {
        console.log('Failed operation')
      }
    }
  }

  up() {
    if (this.arrPath.length > 1) {
      this.arrPath.splice(this.arrPath.length - 1, 1)
      return true
    } else return false
  }

  async viewDir() {
    try {
      const res = await fs.readdir(path.join(...this.arrPath))
      const result = []
      
      for await (const item of res) {
        if ((await fs.stat(path.join(...this.arrPath, item))).isDirectory()) {
          result.push({Name: item, Types: 'dir'})
        } else {
          result.push({Name: item, Types: 'file'})
        }
      }
      console.table(result.sort((a) => a.Types === 'dir' ? -1 : 1))
      return true
    } catch(e) {
      console.log('Failed operation')
      return false
    }
  }

  get path() {
    return path.join(...this.arrPath)
  }
}