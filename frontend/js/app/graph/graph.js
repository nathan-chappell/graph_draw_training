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

	addNode(id) {
		this.baseGraph[id] = [];
	}

	deleteNode(id) {
		delete this.baseGraph[id];
	}

	get V() {
		return new Set([...Object.keys(this.baseGraph), ...Object.values(this.baseGraph).flat()]);
	}

	get E() {
		return new Set(Object.values(this.G).reduce((acc,v) => [...acc,...v],[]));
	}

	get G() {
		return Object.fromEntries([...this.V].map(k => [k, this.edgeSet(k)]));
	}

	buildGraph() {
		/*
		this.V = new Set([...Object.keys(this.baseGraph), ...Object.values(this.baseGraph).flat()]);
		this.G = Object.fromEntries([...this.V].map(k => [k, this.edgeSet(k)]));
		this.E = new Set(Object.values(this.G).reduce((acc,v) => [...acc,...v],[]));
		*/
	}

	toJson() {
		return JSON.stringify(this.baseGraph);
	}
}

const makeAttrProxy = attrs => new Proxy(attrs, {
	get: (t, key) => {
		if (!t[key]) {
			t[key] = {};
		}
		return t[key];
	}
});

const randInt = (max) => Math.floor(Math.random() * max);
const randChar = () => String.fromCharCode('a'.charCodeAt(0) + randInt(26));
const randomName = () => [...Array(randInt(4) + 2)].map(_ => randChar()).join('');
const randomPos = () => [Math.random(), Math.random()];

/*
 * pos: [0,1]x[0,1]
 */
class AttrGraph extends BaseGraph {
	constructor({g = {}, attrs = {}, name}) {
		super(g);
		this.attrs = makeAttrProxy(attrs);
		this.name = name;
	}

	nodePos(v) {
		let pos = this.attrs.pos[v];
		if (!pos) {
			pos = this.attrs.pos[v] = randomPos();
		}
		// console.log('nodePos',v,pos);
		return pos;
	}

	deleteNode(id) {
		super.deleteNode(id);
		Object.keys(this.attrs).forEach(k => {
			delete this.attrs[k][id];
		});
	}

	toJson() {
		return JSON.stringify({
			name: this.name,
			g: this.baseGraph,
			attrs: this.attrs.target,
		});
	}
}

