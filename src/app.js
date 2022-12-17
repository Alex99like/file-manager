import process from 'process'
import os from 'os'
import { Emitter } from './service/Emitter.js'
import { getUserName } from './utils/getNameUser.js'

const initCLI = () => {
  try {
    const username = getUserName(process.argv)
    
    if (!username) {
      throw new Error()
    } else {
      console.log(`Welcome to the File Manager, ${username}!`)
    }

    const emit = new Emitter()

    process.chdir(os.homedir())
    console.log(`You are currently in ${process.cwd()}`)
    
    process.on('SIGINT', () => {
      process.stdout.write(`Thank you for using File Manager, ${username}, goodbye! \n`)
      process.exit()
    })

    process.stdin.on('data', (data) => {
      emit.listen(data.toString('utf-8').trim())
    })

  } catch(e) {
    console.log('Failed operation')
  }
}

initCLI()


