class GraphRenderer {
	constructor(canvasEl) {
		this.el = canvasEl;
		this.ctx = canvasEl.getContext('2d');
		this.fill = '#eee';
	}

	clear() {
		this.ctx.fillStyle = this.fill;
		this.ctx.fillRect(0,0,this.el.width, this.el.height);
	}

	mapPos(pos) {
		return [pos[0]*this.el.width, pos[1]*this.el.height];
	}

	renderGraph(attrGraph) {
		this.clear();
		for (let e of attrGraph.E) {
			const [u,v] = attrGraph.edgeKeyToNodes(e);
			const uPos = attrGraph.nodePos(u);
			const vPos = attrGraph.nodePos(v);
			this.renderEdge(e, this.mapPos(uPos), this.mapPos(vPos));
		}
		for (let v of attrGraph.V) {
			this.renderNode(v, this.mapPos(attrGraph.nodePos(v)));
		}
	}
}

class SimpleGraphRenderer extends GraphRenderer {
	constructor(canvasEl) {
		super(canvasEl);
		this.nodeColor = '#52e';
		this.nodeR = this.el.width / 30;
		this.edgeColor = '#d34';
		this.lineWidth = 3.0;
	}

	renderNode(name, pos) {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.nodeColor;
		this.ctx.arc(...pos, this.nodeR, 0, 2*Math.PI);
		this.ctx.fill();
	}

	renderEdge(e, uPos, vPos) {
		this.ctx.beginPath();
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.strokeStyle = this.edgeColor;
		this.ctx.moveTo(...uPos);
		this.ctx.lineTo(...vPos);
		this.ctx.stroke();
	}
}


