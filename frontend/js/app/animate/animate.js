const li_scalar = (u, v, t) => (1-t)*u + t*v;
const li_array = (a1, a2, t) => a1.map((s,i) => li_scalar(s,a2[i],t));
const li_pos_out = (pos1, pos2, t, outpos) => {
	for (let i = 0; i < outpos.length; ++i) {
		outpos[i] = li_scalar(pos1[i], pos2[i], t);
	}
}

// depends ../render/render.js

const TIMER_STATE = {
	INIT: 'init',
	IN_PROGRESS: 'in_progress',
	COMPLETE: 'complete',
	ERROR: 'error',
	STOP: 'stop',
};

class Timer {
	constructor({t, delta, callback}) {
		this.t = t;
		this.delta = delta;
	}

	get timePercent() {
		return this.cur_t / this.t;
	}

	start() {
		this.state = TIMER_STATE.IN_PROGRESS;
		let _res;
		this.waiter = new Promise(res => { _res = res; });
		this.onComplete = () => {
			_res;
			this.state = TIMER_STATE.COMPLETE;
		}
		this.cur_t = 0;
		this._advance();
		return this.waiter;
	}

	async _advance() {
		if (this.state != TIMER_STATE.IN_PROGRESS) {
			return;
		}
		if (this.cur_t > t) {
			this.onComplete();
			return;
		}
		await callback(this.cur_t);
		this.cur_t += this.delta;
		setTimeout(this._advance, this.delta);
	}

	stop() {
		this.state = TIMER_STATE.STOP;
	}
}

class PosAnimator {
	constructor({t, delta, callback, fromPosArray, toPosArray, outPosArray}) {
		this.timer = new Timer({t, delta, callback: this.onTimer.bind(this)});
		this.start = this.timer.start.bind(this.timer);
		this.stop = this.timer.stop.bind(this.timer);
	}

	onTimer() {
		const t = this.timer.timePercent;
		for (let i = 0; i < outPosArray.length; ++i) {
			li_pos_out(this.fromPosArray[i], this.toPosArray[i], t, this.outPosArray);
		}
		this.callback();
	}
}

class AttrGraphAnimation {
	constructor(attrGraph, renderer) {
		this.attrGraph = attrGraph;
		this.renderer = renderer;
	}

	to(nodePosDict, t = 1, delta = 100) {
		const keys = Object.keys(nodePosDict);
		const fromPosArray = keys.map(k => this.attrGraph.nodePos(k));
		const outPosArray = fromPosArray.map(pos => [...pos]); // fresh copy
		const callback = () => {
			for (let i = 0; i < keys.length; ++i) {
				this.attrGraph.attrs.pos[keys[i]] = outPosArray[i];
			}
			this.renderer.renderGraph(this.attrGraph);
		}
		this.posAnimator = new PosAnimator({t, delta, callback, fromPosArray, toPosArray, outPosArray});
		return this.posAnimator.start();
	}
}
