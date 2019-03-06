class Atoms {
	constructor () {
		this.ClolorAtomsForName = []
		this.atoms = []
	}

	finderAtoms (url) {
		let sssr = this.fileGetContents( url )
		let info = sssr.split(/\n/)
		if (info[info.length - 1].length < 1) {
			info.pop();
		}
		// переводим info в массив вида [ [ 1, C, -0.231579, -0.350841, -0.037475, 1, 2, 4, 5, 6 ], [2, C, 0.229441...] ... ]
		for (let i = 1; i < info.length; i++) {
			this.atoms[i - 1] = info[i].match(/\S+/g);
		}
		// например
		//0 - водород 1 - кислород  2 - углерод
		// название, цвет молекулы и ее размер в ангстремах
		//atoms['H'] = [ 0, 0x2a52be, 0.53];
		//atoms['O'] = [ 1, 0xff0000, 0.60];
		//atoms['C'] = [ 2, 0x00ff12, 0.91];
		let allAtomSymbol = ''
		let number = 0
		for (let i = 0; i < this.atoms.length; i++) {
			let AtomSymbol = String(this.atoms[i][1])
			let pos = allAtomSymbol.indexOf('#' + AtomSymbol + '#')
			if (pos < 0) {
				allAtomSymbol = allAtomSymbol + '#' + AtomSymbol + '#'
				if ( this.ClolorAtomsForName[AtomSymbol] === undefined ) this.ClolorAtomsForName[AtomSymbol] = [ number, Math.random() * 0xFFFFFF, 0.7 ]
				number++
			}
		}
		console.log(this.atoms)
	}

	fileGetContents (url) {
		let req = null
		try {
			req = new ActiveXObject("Msxml2.XMLHTTP")
		} catch (e) {
			try {
				req = new ActiveXObject("Microsoft.XMLHTTP")
			} catch (e) {
				try {
					req = new XMLHttpRequest()
				} catch (e) {}
			}
		}
		if (req == null) throw new Error('XMLHttpRequest not supported')
		req.open("GET", url, false)
		req.send(null)
		return req.responseText
	}
}
