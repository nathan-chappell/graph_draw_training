class $$ {
	static get(...args) {
		return document.getElementById(...args);
	}

	static create(...args) {
		return document.createElement(...args);
	}

	static delay(t) {
		return new Promise(res => setTimeout(res, t));
	}
}

