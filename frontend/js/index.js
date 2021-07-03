// depends app/animate/animate.js
// depends app/api/api.js
// depends app/graph/graph.js
// depends app/render/render.js
// depends app/page.js

const main = () => {
	const canvasEl = Page.getCanvasEl();
	const graphData = dummyApi.getGraphData();
	const attrGraph = new AttrGraph(graphData);
	const renderer = new SimpleGraphRenderer(canvasEl);
	renderer.renderGraph(attrGraph);
}

main();
