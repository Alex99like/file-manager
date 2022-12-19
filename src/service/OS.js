import os from 'os'

export class OS {
  constructor(error, success) {
    this.success = success
    this.error = error
  }

  eol() {
    console.log(`${JSON.stringify(os.EOL)}`)
  }

  cpus() {
    const cpus = os.cpus()
    console.log(`CPUS: ${cpus.length}`)
    cpus.forEach((el, i) => {
      const [model, frequency] = el.model.split('@')
      if (model && frequency) {
        console.log(`${i + 1}: \n model: ${model} \n frequency: ${frequency}`)
      } else {
        console.log(`${i + 1}: ${el.model} \n`)
      }
    })
  }

  homedir() {
    console.log(`${os.homedir()}`)
  }

  username() {
    console.log(`${os.userInfo().username}`)
  }

  homedir() {
    console.log(`${os.homedir()}`)
  }

  architecture() {
    console.log(`${os.arch()}`)
  }

  listen(option) {
    switch(option) {
      case '--EOL': {
        this.eol()
        this.success()
        break
      }
      case '--cpus': {
        this.cpus()
        this.success()
        break
      }
      case '--homedir': {
        this.homedir()
        this.success()
        break
      }
      case '--username': {
        this.username()
        this.success()
        break
      }
      case '--architecture': {
        this.architecture()
        this.success()
        break
      }
      default: {
        console.log('Invalid input')
      }
    }
  }
}