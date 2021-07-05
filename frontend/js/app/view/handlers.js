// depends ../api/api.js

class Handlers {
	constructor({pageView, api}) {
		this.pageView = pageView;
		this.api = api;
		this.attachHandlers();
	}

	attachHandlers() {
		this.pageView.page.graph.add.onclick = this.onGraphAdd.bind(this);
	}

	async onGraphAdd() {
		const name = this.pageView.graphName;
		const graph = {g: {}, attrs: {}, name};
		const response = await this.api.create(graph);
		console.log(response);
	}

	async onGraphDelete() {
		const id = this.pageView.selectedGraph;
		const response = await this.api.delete(id);
		console.log(response);
	}

}
