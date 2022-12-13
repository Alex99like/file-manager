import EventEmitter from "events";
import { Path } from "./Path.js";
import { FileSystem } from './FileSystem.js'
import path from "path";
import process from "process";
import { OS } from "./OS.js";
import { Hash } from "./Hash.js";
import { Zlib } from "./Zlib.js";
import { parseString } from "../utils/parseString.js";

export class Emitter {
  constructor() {
    this.emitter = new EventEmitter()
    this.pathService = new Path(this.error, this.success)
    this.fileService = new FileSystem(this.error, this.success)
    this.osService = new OS(this.error, this.success)
    this.hashService = new Hash(this.error, this.success)
    this.zlibService = new Zlib(this.error, this.success)
    this.init()
  }

  success() {
    console.log(`You are currently in ${process.cwd()}`)
  }

  error() {
    console.log('Failed operation')
  }

  init() {
    this.emitter.on('.exit', () => process.exit())

    this.emitter.on('cd', (path) => this.pathService.cd(path))

    this.emitter.on('up', () => this.pathService.up())

    this.emitter.on('ls', () => this.pathService.ls())

    this.emitter.on('cat', (path) => this.fileService.cat(path))

    this.emitter.on('add', (path) => this.fileService.add(path))

    this.emitter.on('rm', (path) => this.fileService.rm(path))

    this.emitter.on('rn', (path, name) => this.fileService.rn(path, name))

    this.emitter.on('cp', (path, newPath) => this.fileService.cp(path, newPath))

    this.emitter.on('mv', (path, newPath) => this.fileService.cp(path, newPath, 'rm'))

    this.emitter.on('os', (option) => this.osService.listen(option))

    this.emitter.on('hash', (path) => this.hashService.hash(path))

    this.emitter.on('compress', (pathFile, newPath) => this.zlibService.compress(pathFile, newPath))

    this.emitter.on('decompress', (pathFile, newPath) => this.zlibService.decompress(pathFile, newPath))
  }

  async listen(parameters) {
    const [command, optionOne, optionTwo] = parseString(parameters)

    try {
      if (this.emitter.eventNames().includes(command)) {
        this.emitter.emit(command, optionOne, optionTwo)
      } else {
        console.log('Invalid input')
      }
    } catch {
      this.error()
    }
  }
}