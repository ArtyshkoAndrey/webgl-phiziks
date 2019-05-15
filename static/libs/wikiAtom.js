export default class WikiAtom {
  constructor (name, symbol, color, radius, covalentRadius, doubleCovalentRadius, tripleCovalentRadius) {
    this.name = name
    this.symbol = symbol
    this.color = color
    this.radius = Number(radius)
    this.doubleCovalentRadius = Number(doubleCovalentRadius)
    this.covalentRadius = Number(covalentRadius)
    this.tripleCovalentRadius = Number(tripleCovalentRadius)
    console.log(doubleCovalentRadius)
  }
  clone () {
    return new WikiAtom(this.name, this.symbol, this.color, this.radius, this.covalentRadius)
  }
}
