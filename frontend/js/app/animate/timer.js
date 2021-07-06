// depends ../utils/utils.js

const TIMER_STATE = {
	INIT: 'init',
	IN_PROGRESS: 'in_progress',
	COMPLETE: 'complete',
	CANCEL: 'cancel',
	ERROR: 'error',
	STOP: 'stop',
	PAUSE: 'pause',
};

class Waiter {
	constructor() {
		throw new Error("must create Waiter with factory");
	}

	static factory({onComplete, onCancel}) {
		let _res;
		const waiter = new Promise(res => { _res = res; });
		waiter.res = _res;
		waiter.onComplete = onComplete;
		waiter.onCancel = onCancel;
		waiter.complete = async () => {
			if (waiter.onComplete) {
				await waiter.onComplete();
			}
			waiter.res();
		}
		waiter.cancel = async () => {
			if (waiter.onCancel) {
				await waiter.onCancel();
			}
			waiter.res();
		}
		return waiter;
	}
}

class Timer {
	constructor({t, delta, callback}) {
		this.t = t;
		this.delta = delta;
		this.callback = callback;
		this.waiter = null;
	}

	get _() {
		return TIMER_STATE;
	}

	get timePercent() {
		return this.cur_t / this.t;
	}

	start() {
		if (this.waiter) {
			return this.waiter;
		}
		this.state = TIMER_STATE.IN_PROGRESS;
		this.waiter = Waiter.factory({
			onComplete: () => { this.state = TIMER_STATE.COMPLETE; },
			onCancel: async () => { 
				this.state = TIMER_STATE.CANCEL; 
				await $$.delay(this.delta);
			},
		});
		this.cur_t = 0;
		this._advance();
		return this.waiter;
	}

	async _advance() {
		if (this.state != TIMER_STATE.IN_PROGRESS) {
			await this.waiter.cancel();
			return;
		}
		if (this.cur_t > this.t) {
			await this.waiter.complete();
			return;
		}
		if (this.callback) {
			await this.callback(this.cur_t);
		}
		this.cur_t += this.delta;
		setTimeout(() => this._advance(), this.delta);
	}

	stop() {
		this.state = TIMER_STATE.STOP;
		if (this.waiter) {
			return this.waiter.cancel();
		}
	}
}

