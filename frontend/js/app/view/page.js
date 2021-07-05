// depends ../utils/utils.js

class Page {
	constructor() {
		// this.keys = [ 'graph', 'node', 'edge' ];
		this.keys = [ 'graph', 'node' ];
		this.attachElements();
	}

	attachElements() {
		this.canvasEl = $$.get('graph-canvas');
		this.animate = $$.get('animate');
		this.keys.forEach(k => {
			this[k] = {
				add: $$.get(`add-${k}`),
				delete: $$.get(`delete-${k}`),
				input: $$.get(`input-${k}`),
				select: $$.get(`select-${k}`),
			}
		});
	}

	get graphName() {
		return this.graph.input.value;
	}

	get selectedGraph() {
		return this.graph.select.value;
	}

	get nodeName() {
		return this.node.input.value;
	}

	get selectedNode() {
		return this.node.select.value;
	}
}
