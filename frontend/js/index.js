const main = () => {
	const canvasEl = page.getCanvasEl();
	const graphData = dummyApi.getGraphData();
	const attrGraph = new AttrGraph(graphData);
	const renderer = new SimpleGraphRenderer(canvasEl);
	renderer.renderGraph(attrGraph);
}

main();
