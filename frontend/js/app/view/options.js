
class Options {
	constructor({get, selectEl, onLoad}) {
		this.get = get;
		this.selectEl = selectEl;
		this.onLoad = onLoad;
		this.data = {};
	}

	get options() {
		return this.selectEl.options;
	}

	get selected() {
		return this.selectEl.selectedOptions[0];
	}

	clear() {
		while (this.options.length > 0) {
			this.options.remove(0);
		}
	}

	set() {
		this.data.forEach(({value, text}) => {
			const option = $$.create('option');
			option.value = value;
			option.text = text;
			this.options.add(option)
		});
	}

	select(_value) {
		const index = this.data.findIndex(({value, text}) => value === _value);
		if (index !== -1) {
			this.options.selectedIndex = index;
		}
	}

	async load() {
		const selected = this.selected;
		this.clear();
		const data = await this.get();
		this.data = data;
		this.set();
		if (selected) {
			this.select(selected.value);
		}
		if (typeof this.onLoad === 'function') {
			await this.onLoad();
		}
	}
}


