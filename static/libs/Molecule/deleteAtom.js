function deleteAtom (numAtom) {
  let glavAtom = this.getAtom(numAtom)
  this.atomsTest.delete(glavAtom)
  glavAtom.Object3D.material.dispose()
  glavAtom.Object3D.geometry.dispose()
  this.ObjectMolecule.remove(glavAtom.Object3D)
  glavAtom.connections.forEach((con) => {
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
    tempAtom.connections.splice(tempAtom.connections.indexOf(numAtom), 1)
  })
}

export { deleteAtom }
