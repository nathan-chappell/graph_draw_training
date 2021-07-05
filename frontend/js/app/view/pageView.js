// depends ./page.js
// depends ./handlers.js

class PageView {
	constructor({page, api}) {
		this.page = page;
		this.handlers = new Handlers({pageView: this, api});
	}

	attachHandlers() {
		this.page.graph.add.onclick = this.handlers.onGraphAdd.bind(this.handlers);
		this.page.graph.delete.onclick = this.handlers.onGraphDelete.bind(this.handlers);
	}

	get graphName() {
		return this.page.graph.input.value;
	}

	get selectedGraph() {
		return this.page.graph.select.value;
	}
}
