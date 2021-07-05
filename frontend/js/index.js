// depends app/animate/animate.js
// depends app/api/api.js
// depends app/graph/graph.js
// depends app/render/render.js
// depends app/view/page.js
// depends app/view/pageView.js

const randPos = graph =>
	[...graph.V].reduce((d,k) => ({...d, [k]: [Math.random(), Math.random()]}), {});

let count = 2;

async function animate(attrGraph, renderer) {
	renderer.renderGraph(attrGraph);
	const animation = new AttrGraphAnimation(attrGraph, renderer);
	const toPos = randPos(attrGraph);
	await animation.to(toPos, 1500);
	if (++count < 3) {
		animate(attrGraph, renderer);
	}
}

const testApi = async () => {
	const api = new GraphApi();
	const hello = await api.helloWorld();
	console.log(hello.data);
	const helloPost = await api.postHelloWorld();
	console.log(helloPost.json);
}

const main = async () => {
	const graphData = dummyApi.getGraphData();
	const attrGraph = new AttrGraph(graphData);
	// const page = new Page();
	// page.load(new GraphApi());
	let renderer;
	pageView = new PageView({
		animateCallback: attrGraph => animate(attrGraph, renderer),
	});
	await pageView.initialize();
	renderer = new SimpleGraphRenderer(pageView.page.canvasEl);
	animate(attrGraph, renderer);
	await testApi();
	/*
	const api = new GraphApi();
	pageView = new PageView({page, api});
	pageView.attachHandlers();
	*/
}

main();
