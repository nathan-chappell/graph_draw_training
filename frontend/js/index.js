// depends app/animate/animate.js
// depends app/api/api.js
// depends app/graph/graph.js
// depends app/render/render.js
// depends app/view/page.js
// depends app/view/pageView.js

class Mutex {
	constructor() {
		this.p = Promise.resolve(null);
	}

	async lock() {
		const oldP = this.p;
		let _res;
		this.p = new Promise(res => { _res = res; });
		await oldP;
		return _res;
	}
}

const mutex = new Mutex();

const randPos = graph =>
	[...graph.V].reduce((d,k) => ({...d, [k]: [Math.random(), Math.random()]}), {});

const count = 3;
const t = 1000;

let runningAnimation = null;

async function animate(attrGraph, renderer, clear) {
	if (runningAnimation) {
		await runningAnimation.stop();
	}
	const unlock = await mutex.lock();
	let animation = null;
	for (let i = 0; i < count; ++i) {
		const next = new AttrGraphAnimation(attrGraph, renderer);
		const toPosDict = randPos(attrGraph);
		next.to({toPosDict, t});
		animation = animation ? new ChainAnimation(animation, next) : next;
	}
	animation.start().then(unlock);
	runningAnimation = animation;
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
	let renderer;
	pageView = new PageView({
		animateCallback: attrGraph => animate(attrGraph, renderer),
	});
	renderer = new SimpleGraphRenderer(pageView.page.canvasEl);
	await pageView.initialize();
	animate(attrGraph, renderer);
	await testApi();
}

main();
