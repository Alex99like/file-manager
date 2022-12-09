import process from 'process'

export const stdWrite = (text, currentPath) => {
  if (currentPath) {
    process.stdout.write(`You are currently in ${currentPath} \n`)
  } else {
    process.stdout.write(text + ' \n')
  }
}

export const stdChunk = (chunk) => {
  return chunk.toString('utf-8').trim()
}