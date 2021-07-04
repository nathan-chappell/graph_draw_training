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

	attachHandlers(handlers) {
		this.keys.forEach(k => {
			this[k].add.onclick = handlers[k].add;
			this[k].delete.onclick = handlers[k].delete;
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
		const allGraphs = await api.read('_all');
		Object.entries(allGraphs).forEach(([id,g]) => {
			const option = DC('option');
			option.value = id;
			option.text = g.name || id;
			this.graph.select.options.add(option)
		});
	}

	async load(api) {
		const handlers = {
			graph: {
				add: () => api.create({ name: this.graph.input.value, g: {}, attrs: {}}),
				delete: () => api.delete(this.graph.select.value),
			},
		}
		await this.loadGraphOptions(api);
		this.attachHandlers(handlers);
	}
}
