class GraphApi {
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

