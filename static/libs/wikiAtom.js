export default class WikiAtom {
  constructor (name, symbol, color, radius, covalentRadius) {
    this.name = name
    this.symbol = symbol
    this.color = color
    this.radius = Number(radius)
    this.covalentRadius = Number(covalentRadius)
  }
  clone () {
    return new WikiAtom(this.name, this.symbol, this.color, this.radius, this.covalentRadius)
  }
}
