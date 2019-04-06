function deleteAtom (numAtom) {
  console.log(this.atoms.length)
  let glavAtom = this.getAtom(numAtom)
  glavAtom.Object3D.material.dispose()
  glavAtom.Object3D.geometry.dispose()
  this.ObjectMolecule.remove(glavAtom.Object3D)
  // this.atoms.remove(glavAtom)
  // this.atoms.indexOf(glavAtom)
  glavAtom.connections.forEach((con) => {
    console.log(con)
    let tempAtom = this.getAtom(con)
    tempAtom.Object3D.children.forEach((cycle) => {
      console.log(cycle)
      if (cycle.userData['from'] === numAtom) {
        console.log('Yes')
        tempAtom.Object3D.remove(cycle)
        cycle.material.dispose()
        cycle.geometry.dispose()
      }
    })
  })
  this.atoms.splice(this.atoms.indexOf(glavAtom), 1)
  console.log(this.atoms.length)
}

export { deleteAtom }
