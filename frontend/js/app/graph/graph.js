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

