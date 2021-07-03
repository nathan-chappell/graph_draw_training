// depends ./httpClient.js

class GraphApi {
	constructor() {
		this.httpClient = new HttpClient({
			baseAddress: 'http://localhost:8888'
		});
	}

	helloWorld() {
		return this.httpClient.get();
	}

	postHelloWorld() {
		return this.httpClient.post({data: {foo:'bar'}});
	}
}

const demoGraphData = {
	// g: { 'a': ['b', 'c', 'd'], b: ['c'] },
	g: { 
		a: ['b', 'c', 'd'], 
		b: ['c'], 
		e: ['a', 'f'],
		h: ['c'],
	},
	attrs: {},
};

// fake graph
const dummyApi = {
	getGraphData: () => demoGraphData,
}

