// depends ../render/render.js
// depends ./timer.js

const li_scalar = (u, v, t) => (1-t)*u + t*v;
const li_array = (a1, a2, t) => a1.map((s,i) => li_scalar(s,a2[i],t));
const li_pos_out = (pos1, pos2, t, outpos) => {
	for (let i = 0; i < outpos.length; ++i) {
		outpos[i] = li_scalar(pos1[i], pos2[i], t);
	}
}

class PosAnimator {
	constructor({t, delta, callback, fromPosArray, toPosArray, outPosArray}) {
		this.timer = new Timer({t, delta, callback: this.onTimer.bind(this)});
		this.start = this.timer.start.bind(this.timer);
		this.stop = this.timer.stop.bind(this.timer);
		this.callback = callback;
		this.fromPosArray = fromPosArray;
		this.toPosArray = toPosArray;
		this.outPosArray = outPosArray;
	}

	onTimer() {
		const t = this.timer.timePercent;
		for (let i = 0; i < this.outPosArray.length; ++i) {
			li_pos_out(this.fromPosArray[i], this.toPosArray[i], t, this.outPosArray[i]);
		}
		this.callback();
	}
}

class AttrGraphAnimation {
	constructor(attrGraph, renderer) {
		this.attrGraph = attrGraph;
		this.renderer = renderer;
		this.posAnimator = null;
		this.animationParams = null;
	}

	_makeAnimator() {
		const { t, toPosDict, delta } = this.animationParams;
		const keys = Object.keys(toPosDict);
		const fromPosArray = keys.map(k => this.attrGraph.nodePos(k));
		const toPosArray = keys.map(k => toPosDict[k]);
		const outPosArray = fromPosArray.map(pos => [...pos]); // fresh copy
		const callback = () => {
			for (let i = 0; i < keys.length; ++i) {
				this.attrGraph.attrs.pos[keys[i]] = outPosArray[i];
			}
			this.renderer.renderGraph(this.attrGraph);
		}
		this.posAnimator = new PosAnimator({t, delta, callback, fromPosArray, toPosArray, outPosArray});
	}

	to({toPosDict, t = 1000, delta = 10}) {
		this.animationParams = {
			toPosDict,
			t,
			delta
		};
	}

	start() {
		this._makeAnimator();
		return this.posAnimator.start();
	}

	stop() {
		return this.posAnimator.stop();
	}
}

class ChainAnimation {
	constructor(a,b) {
		this.a = a;
		this.b = b;
		this.waiter = null;
		this.running = null;
	}

	_complete() {
		this.running = null;
		this.waiter.res();
	}

	async stop() {
		const running = this.running;
		this._complete();
		if (running) {
			await running.stop();
		}
	}

	start() {
		if (this.waiter !== null) {
			return this.waiter;
		}
		this.waiter = Waiter.factory({
			onComplete: this._complete.bind(this),
			onCancel: this.stop.bind(this),
		});
		this.running = this.a;
		this.a.start()
			.then(this._continue.bind(this))
			.then(this._complete.bind(this));
		return this.waiter;
	}

	_continue() {
		if (this.running === null) {
			return;
		}
		this.running = this.b;
		return this.b.start()
	}

	static test() {
		let i = 0;
		const logi = m => () => console.log(m, 'i', ++i);
		const t1 = new Timer({t: 2000, delta: 500, callback: logi('t1')});
		const t2 = new Timer({t: 2000, delta: 500, callback: logi('t2')});
		const t3 = new Timer({t: 2000, delta: 500, callback: logi('t3')});
		const c1 = new ChainAnimation(t1, t2);
		const c2 = new ChainAnimation(c1, t3);
		return [c1, c2];
	}
}
