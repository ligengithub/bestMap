/**
 * FileName: storage
 * Auth: admin
 * Created at: 2020/8/6
 * Description:
 */

const EXPIRE = 7 * 24 * 60 * 60;

const Storage = {

	setItem: (key, item, expire = EXPIRE) => {
		localStorage.setItem(key, JSON.stringify({ data: item, expire: +new Date() + expire * 1000}));
	},

	getItem(key) {
		const value = localStorage.getItem(key) || null;
		const item = JSON.parse(value) || {};
		const { data = null, expire = Number.MAX_SAFE_INTEGER } = item;

		if (new Date().getTime() > expire) {
			this.removeItem(key);
		}

		return data;
	},

	removeItem: key => {
		localStorage.removeItem(key);
	},

	clear: () => {
		localStorage.clear();
	},
};

export default Storage;