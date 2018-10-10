import Vue from 'vue';
const TIME_OUT = 10000;

let json = async (url, cfg = {}) => {
	cfg.needEncrypt = false;
	cfg.noErrorNo = true;
	cfg.noExtend = true;
	return get(url, cfg);
};
let encrypt = (params) => {
	return params;
};

let get = async (url, cfg = {}) => {
	let { params, accross, noErrorNo, needEncrypt, ...rest } = cfg;

	params = params || {};
	if (!accross) {
		/* eslint-disable */
		params.nginx_cors = false;
	}
	params = Object.assign(params, cfg.body);
	return Promise.resolve().then(() => {
		if (needEncrypt) {
			// 需要签名的传递needEncrypt = true
			return encrypt(params);
		} else {
			// 不需要签名的直接resolve原始params
			return params;
		}
	}).then(params => {
		return Vue.http.get(url, {
			params,
			timeout: TIME_OUT,
			...rest
		}).then(res => {
			return res.json();
		}).then(res => {
			// 有些请求没有errno
			if (noErrorNo) {
				return res;
			} else {
				if (+res.errno === 0) {
					return res.data || res;
				} else {
					return Promise.reject(res);
				}
			}
		}).catch(err => {
			return Promise.reject({
				errno: 'request_error',
				errmsg: err
			});
		});
	});
};

let post = async (url, cfg = {}) => {
	let { body, options, accross, noErrorNo, needEncrypt } = cfg;
	options = options || {};
	if (!accross && options) {
		options.params = {
			...options.params,
			/* eslint-disable */
			nginx_cors: false
		};
	}
	return Promise.resolve().then(() => {
		return options.params;
	}).then(params => {
		options.params = params;
		options.timeout = TIME_OUT;
		return Vue.http.post(url, body, options).then(res => {
			return res.json();
		}).then(res => {
			// 有些请求没有errno
			if (noErrorNo) {
				return res;
			} else {
				if (+res.errno === 0) {
					return res.data || res;
				} else {
					return Promise.reject(res);
				}
			}
		}).catch(err => {
			return Promise.reject({
				errno: 'request_error',
				errmsg: err
			});
		});
	});
};

let jsonp = async (url, cfg = {}) => {
	// headers和accross对于jsonp来说没有意义，因此把它们解析出来，但是不再发送
	let { headers, accross, needEncrypt, noErrorNo, params, ...rest } = cfg; // eslint-disable-line no-unused-vars

	return new Promise((resolve, reject) => {
		Promise.resolve().then(() => {
			return params;
		}).then(params => {
			let options = {
				...rest,
				params,
				timeout: TIME_OUT,
				before: (req) => {
					setTimeout(() => {
						reject('timeout');
					}, req.timeout);
				}
			};
			Vue.http.jsonp(url, options).then(res => {
				return res.json();
			}).then(res => {
				if (noErrorNo) {
					return res;
				} else {
					if (+res.errno === 0) {
						resolve(res.data || res);
					} else {
						reject(res);
					}
				}
			});
		});
	});
};

export default {
	get,
	post,
	json,
	jsonp
};
