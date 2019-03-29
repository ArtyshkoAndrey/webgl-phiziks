import fs from 'fs'
// Парсер файла. Переделать под наш
function fileGetContents (url) {
  let txt = fs.readFileSync(url, 'utf-8')
  let arr = txt.split('\n')
  let fix = []
  let fat = []
  let b = false
  for (let i = 0; i < arr.length; i++) {
    fix[i] = []
    for (let j = 0; j < arr[i].split(' ').length; j++) {
      if (arr[i].split(' ')[j] !== '') {
        fix[i].push(arr[i].split(' ')[j])
      }
    }
  }
  for (let i = 0; i < fix.length; i++) {
    if (b && fix[i].length >= 2) {
      if (fix[i][0] !== '') {
        fat.push(fix[i])
        if (fix[i + 1].length === 1) {
          b = false
        }
      }
    }
    if ((fix[i][0] + ' ' + fix[i][1]) === 'CARTESIAN COORDINATES') {
      b = true
      i += 4
      fat.push(fix[i])
    }
  }
  return fat
}

export { fileGetContents }
