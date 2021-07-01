/*
 * baseGraph:
 * {
 *	node: [neighbors]
 *	...
 * }
 */

class BaseGraph {
	constructor(baseGraph) {
		this.edgeJoiner = ' -> ';
		this.baseGraph = baseGraph;
		this.buildGraph();
	}

	edgeKeyToNodes(key) {
		return key.split(this.edgeJoiner);
	}

	edgeKey(u, v) {
		return u <= v ? `${u}${this.edgeJoiner}${v}` : this.edgeKey(v,u);
	}

	edgeSet(u) {
		let N = this.baseGraph[u];
		return N ? new Set(this.baseGraph[u].map(v => this.edgeKey(u,v))) : new Set();
	}

	buildGraph() {
		this.V = new Set([...Object.keys(this.baseGraph), ...Object.values(this.baseGraph).flat()]);
		this.G = Object.fromEntries([...this.V].map(k => [k, this.edgeSet(k)]));
		this.E = new Set(Object.values(this.G).reduce((acc,v) => [...acc,...v],[]));
	}
}

class AttrGraph extends BaseGraph {
	constructor({g, attrs}) {
		super(g);
		this.attrs = attrs;
	}

	nodePos(v) {
		let attrs = this.attrs[v];
		if (!attrs) {
			attrs = this.attrs[v] = {};
		}
		let pos = attrs.pos;
		if (!pos) {
			pos = attrs.pos = [Math.random(), Math.random()];
		}
		console.log('nodePos',v,pos);
		return pos;
	}
}

class GraphRenderer {
	constructor(canvasEl) {
		this.el = canvasEl;
		this.ctx = canvasEl.getContext('2d');
		this.fill = '#eee';
	}

	clear() {
		this.ctx.fillStyle = this.fill;
		this.ctx.fillRect(0,0,this.el.width, this.el.height);
	}

	mapPos(pos) {
		return [pos[0]*this.el.width, pos[1]*this.el.height];
	}

	renderGraph(attrGraph) {
		this.clear();
		for (let e of attrGraph.E) {
			const [u,v] = attrGraph.edgeKeyToNodes(e);
			const uPos = attrGraph.nodePos(u);
			const vPos = attrGraph.nodePos(v);
			this.renderEdge(e, this.mapPos(uPos), this.mapPos(vPos));
		}
		for (let v of attrGraph.V) {
			this.renderNode(v, this.mapPos(attrGraph.nodePos(v)));
		}
	}
}

class SimpleGraphRenderer extends GraphRenderer {
	constructor(canvasEl) {
		super(canvasEl);
		this.nodeColor = '#52e';
		this.nodeR = this.el.width / 30;
		this.edgeColor = '#d34';
		this.lineWidth = 3.0;
	}

	renderNode(name, pos) {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.nodeColor;
		this.ctx.arc(...pos, this.nodeR, 0, 2*Math.PI);
		this.ctx.fill();
	}

	renderEdge(e, uPos, vPos) {
		this.ctx.beginPath();
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.strokeStyle = this.edgeColor;
		this.ctx.moveTo(...uPos);
		this.ctx.lineTo(...vPos);
		this.ctx.stroke();
	}
}

class GraphApi {
}

// fake graph
const dummyApi = {
	getGraphData: () => {
		const g = { 'a': ['b', 'c', 'd'], b: ['c'] };
		const attrs = {};
		return { g, attrs };
	},
}

const page = {
	getCanvasEl: () => document.getElementById('graph-canvas'),
}

const main = () => {
	const canvasEl = page.getCanvasEl();
	const graphData = dummyApi.getGraphData();
	const attrGraph = new AttrGraph(graphData);
	const renderer = new SimpleGraphRenderer(canvasEl);
	renderer.renderGraph(attrGraph);
}

main();
