/**
 * FileName: request
 * Auth: admin
 * Created at: 2020/8/6
 * Description:
 */
import axios from 'axios';
import { Message } from 'element-ui';
import Storage from '../util/storage';

const codeMessage = {
	200: '服务器成功返回请求的数据。',
	201: '新建或修改数据成功。',
	202: '一个请求已经进入后台排队（异步任务）。',
	204: '删除数据成功。',
	400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
	401: '用户没有权限（令牌、用户名、密码错误）。',
	403: '用户得到授权，但是访问是被禁止的。',
	404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
	406: '请求的格式不可得。',
	410: '请求的资源被永久删除，且不会再得到的。',
	422: '当创建一个对象时，发生一个验证错误。',
	500: '服务器发生错误，请检查服务器。',
	502: '网关错误。',
	503: '服务不可用，服务器暂时过载或维护。',
	504: '网关超时。',
};

export const throwMessage = (res, sMsg=true) => {
	return res.then((data) => {
		if (data.code === '8001') {
			sMsg && Message.success(`${data.msg}`);
		} else {
			Message.error(`${data.msg}`);
		}
		return data;
	}).catch((data) => {
		Message.error(`${data.message}`);
		return data;
	});
};

class Request {
	constructor() {
		this.setDefaultConfig();
	}

	setDefaultConfig() {
		axios.defaults.baseURL = '/';
		axios.defaults.timeout = 5000;
		axios.defaults.withCredentials = true;
		axios.defaults.headers.Authorization = Storage.getItem('token');
	}

	checkApiStatus = res => {
		if (res.status >= 200 && res.status < 300) return res;
	};

	handleResponseData = res => {
		const { data } = res;
		const { url } = res.config;
		if (data.code === '8001') {
			return data;
		} else if (/locales\/.*\.json/.test(url)) {
			// 如果是语言包选项
			return data;
		} else if (url.indexOf('/export') > 0) {
			return data;
		} else {
			return Promise.reject({ status: data.code, message: data.msg });
		}
	};

	handleThrowError = err => {
		let statusText = '';
		let status = '';

		// 响应时状态码处理
		if (err.response) {
			status = err.response.status;
			statusText = codeMessage[status] || err.response.statusText;
		} else {
			statusText = err.message;
		}

		return Promise.reject({
			name: 'Error',
			message: statusText,
			status: status,
		});
	};

	requestMethod(url, options = {}) {
		const { method = 'GET', data = {}, ...option } = options;
		const $method = method.toLocaleLowerCase(); // 统一标准小写

		switch (method) {
			case 'GET':
			case 'DELETE':
				return axios[$method](url, option);
			case 'PUT':
			case 'POST':
				return axios[$method](url, data, option);
			default:
				return axios.get(url, option);
		}
	}

	fetch = (url, options) =>
		this.requestMethod(url, options)
			.then(this.checkApiStatus)
			.then(this.handleResponseData)
			.catch(this.handleThrowError);

	get = (url, options) => this.fetch(url, options);

	post = (url, options) => this.fetch(url, { ...options, method: 'POST' });

	put = (url, options) => this.fetch(url, { ...options, method: 'PUT' });

	delete = (url, options) => this.fetch(url, { ...options, method: 'DELETE' });
}

export default new Request();
