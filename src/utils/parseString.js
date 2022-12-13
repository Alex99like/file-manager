export const parseString = (path) => {
  const res = []

  let single = 0
  let double = 0

  let string = ''
  for (let i = 0; i < path.length; i++) {
    if (path[i] !== ' ') {
      if (path[i] === '\'') single += 1
      if (path[i] === '\"') double += 1
      if (single === 2) single = 0
      if (double === 2) double = 0

      if (path[i] !== '\'' && path[i] !== '\"') {
        string += path[i]
      }
    } else {
      if (single === 0 && double === 0) {
        res.push(string)
        string = ''
      } else {
        string += ' '
      }
    }

    if (i === path.length - 1) {
      res.push(string)
    }
  }
  return res.filter(el => !!el)
}