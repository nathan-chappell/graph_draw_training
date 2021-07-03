class HttpClient {
	constructor({baseAddress}) {
		this.baseAddress = baseAddress;
	}

	makeUrl({route, params}) {
		// TODO: url encoding
		const qs = params ? ('?' + Object.entries(params).map(([k,v]) => `${k}=${v}`).join('&')) : '';
		const path = route ? `/${route}` : '';
		const url = `${this.baseAddress}${path}${qs}`;
		return url;
	}

	async readData(body) {
		let result = '';
		let chunks = [];
		let doneReading = false;
		const reader = body.getReader();
		while (!doneReading) {
			const { done, value } = await reader.read();
			if (value) {
				chunks.push(value);
			}
			doneReading = done
		}
		const readChunk = chunk => {
			for (let i = 0; i < chunk.length; ++i) {
				result += String.fromCharCode(chunk[i]);
			}
		}
		chunks.forEach(readChunk);
		return result;
	}

	async handleResponse(response) {
		const data = await this.readData(response.body);
		const result = { data, response };
		Object.defineProperty(data, 'json', {
			get: () => JSON.parse(data),
		});
		return result;
	}

	async get({route, params} = {}) {
		const url = this.makeUrl({route, params});
		const response = await fetch(url);
		return this.handleResponse(response);
	}

	async post({route, params, data} = {}) {
		const url = this.makeUrl({route, params});
		const response = await fetch(url, {
			method: 'POST',
			mode: 'same-origin',
			body: JSON.stringify(data),
			headers: {
				'content-type': 'application/json',
			},
		});
		return this.handleResponse(response);
	}
}