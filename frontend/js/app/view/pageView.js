// depends ./page.js
// depends ./handlers.js
// depends ../utils/utils.js
// depends ../graph/graph.js
// depends ./options.js

class PageView {
	/// init

	constructor({page, api, animateCallback} = {}) {
		this.page = page || new Page();
		this.api = api || new GraphApi();
		this.animateCallback = animateCallback;
		this.graphs = {};
		this.options = {
			graph: new Options({
				get: async () => {
					await this.getGraphData();
					return Object.entries(this.graphs).map(([id,g]) => ({ value: id, text: g.name || id}));
				},
				selectEl: this.page.graph.select,
				onLoad: this.animate.bind(this),
			}),
			node: new Options({
				get: () => {
					const graph = this.selectedGraph;
					if (graph) {
						return [...graph.V].map(id => ({ value: id, text: id }));
					} else {
						return [];
					}
				},
				selectEl: this.page.node.select,
				onLoad: this.animate.bind(this),
			}),
		};
		this.attachHandlers();
		window.pageView = this;
	}

	async initialize() {
		await this.options.graph.load();
		await this.options.node.load();
	}

	attachHandlers() {
		this.page.graph.add.onclick = this.onGraphAdd.bind(this);
		this.page.graph.delete.onclick = this.onGraphDelete.bind(this);
		this.page.graph.select.oninput = async () => {
			await this.options.node.load()
		}

		this.page.node.add.onclick = this.onNodeAdd.bind(this);
		this.page.node.delete.onclick = this.onNodeDelete.bind(this);

		this.page.animate.onclick = this.animate.bind(this);
	}

	animate() {
		this.animateCallback(this.selectedGraph);
	}

	mapGraphs(rawGraphs) {
		return Object.entries(rawGraphs).reduce((acc,kv) => {
			const attrGraph = new AttrGraph(kv[1]);
			return {...acc, [kv[0]]: attrGraph};
		}, {});
	}

	/// getters - setters

	get selectedGraph() {
		const selectedOption = this.options.graph.selected;
		if (selectedOption) {
			return this.graphs[selectedOption.value];
		} else {
			return null;
		}
	}

	/// graph

	async getGraphData() {
		const response = await this.api.read('_all');
		console.log(response);
		const rawGraphs = response.json;
		this.graphs = this.mapGraphs(rawGraphs);
	}

	async onGraphAdd() {
		const name = this.page.graphName;
		const graph = {g: {}, attrs: {}, name};
		const response = await this.api.create(graph);
		await this.options.graph.load();
	}

	async onGraphDelete() {
		const id = this.pageView.selectedGraph;
		const response = await this.api.delete(id);
		await this.options.graph.load();
	}

	/// node

	async onNodeAdd() {
		const name = this.page.nodeName;
		const graph = this.selectedGraph;
		const id = this.options.graph.selected.value;
		graph.addNode(name);
		const response = await this.api.update(id, graph);
		await this.options.graph.load();
		await this.options.node.load();
	}

	async onNodeDelete() {
		const name = this.page.selectedNode;
		const graph = this.selectedGraph;
		const id = this.options.graph.selected.value;
		graph.deleteNode(name);
		const response = await this.api.update(id, graph);
		await this.options.graph.load();
		await this.options.node.load();
	}
}
