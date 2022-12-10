export const getUserName = (argv) => {
  argv.splice(0, 2)
  const argFilter = argv.filter(el => el.includes('--username='))
  if (argFilter.length === 0) return false
  const res = argFilter[0].replace('--username=', '')
  return res
}