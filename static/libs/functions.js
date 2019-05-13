import WikiAtom from './wikiAtom.js'
import fs from 'fs'
function addWikiAtoms () {
  let wa = new WikiAtoms()
  wa.add('Hydrogenium', 'H', '#ADFF2F', 53, 32)
  wa.add('Helium', 'He', '#00FFFF', 31, 28)
  wa.add('Lithium', 'Li', '#FFA07A', 145, 134)
  wa.add('Beryllium', 'Be', '#FFA500', 112, 90)
  wa.add('Borum', 'Bo', '#CD853F', 98, 82)
  wa.add('Carboneum', 'C', '#32CD32', 77, 77)
  wa.add('Nitrogenium', 'N', '#2E8B57', 92, 75)
  wa.add('Oxygenium', 'O', '#00FA9A', 60, 73)
  wa.add('Fluorum', 'F', '#F0E68C', 73, 72)
  wa.add('Neon', 'Ne', '#48D1CC', 38, 58)
  wa.add('Natrium', 'Na', '#DDA0DD', 190, 154)
  wa.add('Magnesium', 'Mg', '#FFDAB9', 160, 136)
  wa.add('Aluminium', 'Al', '#BA55D3', 143, 121)
  wa.add('Silicium', 'Si', '#BDB76B', 132, 111)
  wa.add('Phosphorus', 'P', '#90EE90', 128, 106)
  wa.add('Sulfur', 'S', '#9ACD32', 127, 102)
  wa.add('Chlorum', 'Cl', '#F4A460', 99, 102)
  wa.add('Argon', 'Ar', '#87CEEB', 71, 106)
  wa.add('Kalium', 'K', '#FFC0CB', 235, 203)
  wa.add('Calcium', 'Ca', '#FFEFD5', 197, 174)
  wa.add('Scandium', 'Sc', '#8A2BE2', 162, 144)
  wa.add('Titanium', 'Ti', '#483D8B', 147, 132)
  wa.add('Vanadium', 'V', '#0000CD', 134, 122)
  wa.add('Chromium', 'Cr', '#8B008B', 130, 118)
  wa.add('Manganum', 'Mn', '#BC8F8F', 127, 117)
  wa.add('Ferrum', 'Fe', '#B0E0E6', 126, 117)
  wa.add('Cobaltum', 'Co', '#5F9EA0', 125, 116)
  wa.add('Niccolum', 'Ni', '#FFDEAD', 124, 115)
  wa.add('Cuprum', 'Cu', '#FF8C00', 128, 117)
  wa.add('Zincum', 'Zn', '#B0C4DE', 138, 125)
  wa.add('Gallium', 'Ga', '#6495ED', 141, 126)
  wa.add('Germanium', 'Ge', '#D8BFD8', 122.5, 122)
  wa.add('Arsenicum', 'As', '#9932CC', 139, 120)
  wa.add('Selenium', 'Se', '#00FF7F', 140, 116)
  wa.add('Bromum', 'Br', '#E9967A', 140, 114)
  wa.add('Krypton', 'Kr', '#008B8B', 88, 116)
  wa.add('Rubidium', 'Rb', '#4B0082', 248, 216)
  wa.add('Strontium', 'Sr', '#F5DEB3', 215, 191)
  wa.add('Yttrium', 'Y', '#191970', 178, 162)
  wa.add('Zirconium', 'Zr', '#6A5ACD', 160, 145)
  wa.add('Niobium', 'Nb', '#FF00FF', 146, 164)
  wa.add('Molybdaenum', 'Mo', '#9370DB', 139, 130)
  wa.add('Technetium', 'Tc', '#4169E1', 136, 127)
  wa.add('Ruthenium', 'Ru', '#1E90FF', 134, 125)
  wa.add('Rhodium', 'Rh', '#ADD8E6', 134, 125)
  wa.add('Palladium', 'Pd', '#9400D3', 137, 128)
  wa.add('Argentum', 'Ag', '#4682B4', 144, 134)
  wa.add('Cadmium', 'Cd', '#00CED1', 154, 148)
  wa.add('Indium', 'In', '#40E0D0', 166, 144)
  wa.add('Stannum', 'Sn', '#FFE4B5', 162, 141)
  wa.add('Stibium', 'Sb', '#AFEEEE', 159, 140)
  wa.add('Tellurium', 'Te', '#7B68EE', 160, 136)
  wa.add('Iodum', 'I', '#FF69B4', 136, 133)
  wa.add('Xenon', 'Xe', '#6B8E23', 108, 140)
  wa.add('Сaesium', 'Cs', '#98FB98', 267, 235)
  wa.add('Barium', 'Ba', '#C71585', 222, 198)
  wa.add('Lanthanum', 'La', '#135С70', 187, 169)
  wa.add('Cerium', 'Ce', '#a5c950', 181, 165)
  wa.add('Praseodymium', 'Pr', '#6fc2e7', 182, 165)
  wa.add('Neodymium', 'Nd', '#6a62a2', 182, 184)
  wa.add('Promethium', 'Pm', '#f34779', 183, 199)
  wa.add('Samarium', 'Sm', '#631df0', 181, 162)
  wa.add('Europium', 'Eu', '#0a53c0', 199, 185)
  wa.add('Gadolinium', 'Gd', '#2c90ef', 179, 161)
  wa.add('Terbium', 'Tb', '#93f627', 180, 159)
  wa.add('Dysprosium', 'Dy', '#ece84f', 180, 159)
  wa.add('Holmium', 'Ho', '#293a7f', 179, 158)
  wa.add('Erbium', 'Er', '#9875fa', 178, 157)
  wa.add('Thulium', 'Tm', '#edeea6', 177, 156)
  wa.add('Ytterbium', 'Yb', '#f6b8a3', 194, 170)
  wa.add('Lutetium', 'Lu', '#31305c', 175, 156)
  wa.add('Hafnium', 'Hf', '#ce5ac5', 167, 144)
  wa.add('Tantalum', 'Ta', '#89bd9c', 149, 134)
  wa.add('Wolframium', 'W', '#68715d', 141, 170)
  wa.add('Rhenium', 'Re', '#35607c', 137, 128)
  wa.add('Osmium', 'Os', '#45ff82', 135, 126)
  wa.add('Iridium', 'Ir', '#d7a1b2', 136, 127)
  wa.add('Platinum', 'Pt', '#74852b', 139, 130)
  wa.add('Aurum', 'Au', '#ffd700', 144, 134)
  wa.add('Hydrargyrum', 'Hg', '#9f3360', 157, 149)
  wa.add('Thallium', 'Tl', '#f222c6', 171, 148)
  wa.add('Plumbum', 'Pb', '#b08af1', 175, 147)
  wa.add('Bismuthum', 'Bi', '#23834f', 170, 146)
  wa.add('Polonium', 'Po', '#62cfc2', 176, 146)
  wa.add('Astatium', 'At', '#ab8fb0', 145, 145)
  wa.add('Radon', 'Rn', '#181ce9', 214, 145)
  wa.add('Francium', 'Fr', '#3277b9', 290, 348)
  wa.add('Thorium', 'Th', '#6960eb', 180, 165)
  wa.add('Uranium', 'U', '#9bd3b9', 138, 142)
  wa.add('Neptunium', 'Np', '#d885c3', 130, 110)
  wa.add('Plutonium', 'Pu', '#feb1f0', 162, 200)
  wa.add('Americium', 'Am', '#c192c0', 173, 107)
  return wa
}

class WikiAtoms {
  constructor () {
    this.atoms = {}
  }

  add (name, symbol, color, radius, covalentRadius) {
    this.atoms[symbol] = new WikiAtom(name, symbol, color, radius, covalentRadius)
  }

  get (symbol) {
    return this.atoms[symbol]
  }

  parseJSON (json) {
    this.atoms = JSON.parse(json)
  }

  toJSON () {
    return JSON.stringify(this.atoms)
  }
}

function readOutFile (url) {
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

export { addWikiAtoms, readOutFile }
