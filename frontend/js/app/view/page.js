const DC = (...args) => document.createElement(...args);

class Page {
	constructor() {
		// this.keys = [ 'graph', 'node', 'edge' ];
		this.keys = [ 'graph'];
		this.attachElements();
	}

	attachElements() {
		this.canvasEl = document.getElementById('graph-canvas');
		this.keys.forEach(k => {
			this[k] = {
				add: document.getElementById(`add-${k}`),
				delete: document.getElementById(`delete-${k}`),
				input: document.getElementById(`input-${k}`),
				select: document.getElementById(`select-${k}`),
			}
		});
	}

	clearOptions(k) {
		const el = this[k].select;
		while (el.options.length > 0) {
			el.options.remove(0);
		}
	}

	clearAllOptions() {
		this.keys.map(k => this.clearOptions(k));
	}

	async loadGraphOptions(api) {
		this.clearAllOptions();
		const response = await api.read('_all');
		console.log('response',response);
		Object.entries(response.json).forEach(([id,g]) => {
			const option = DC('option');
			option.value = id;
			option.text = g.name || id;
			this.graph.select.options.add(option)
		});
	}

	async load(api) {
		await this.loadGraphOptions(api);
	}
}
