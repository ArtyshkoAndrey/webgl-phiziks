import path from "path"

process.on('storeMolecule', (info) => {
  if (info.get === 'creat') {
    func1()
  }
})

function func1 () {
  process.send('created')
}

// let fork = require('child_process').fork
// let example = fork(path.resolve('/static/libs/thearding.js'))
// example.on('storeMolecule', (m) => {
//   console.log(m)
// })
// example.send(this.atoms[i])
