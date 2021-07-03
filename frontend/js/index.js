// depends app/animate/animate.js
// depends app/api/api.js
// depends app/graph/graph.js
// depends app/render/render.js
// depends app/page.js

const randPos = graph =>
	[...graph.V].reduce((d,k) => ({...d, [k]: [Math.random(), Math.random()]}), {});

async function animate(attrGraph, renderer) {
	renderer.renderGraph(attrGraph);
	const animation = new AttrGraphAnimation(attrGraph, renderer);
	const toPos = randPos(attrGraph);
	await animation.to(toPos, 1500);
	animate(attrGraph, renderer);
}

const main = () => {
	const canvasEl = Page.getCanvasEl();
	const graphData = dummyApi.getGraphData();
	const attrGraph = new AttrGraph(graphData);
	const renderer = new SimpleGraphRenderer(canvasEl);
	animate(attrGraph, renderer);
}

main();
