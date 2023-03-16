// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext();
	const openid = wxContext.OPENID;
	return await functions[event.funName](event, openid);
}

var functions = {
	userInfo: async (data, openid) => {
		return await db.collection('user').where({
			_openid: openid
		}).field({ _id: false }).get().then(res => {
			let resData = res.data;
			if (resData.length) return resData[0];
			else return false;
		})
	},
	login: async (data, openid) => {
		let resData = await functions.userInfo(data, openid);
		if (resData) return resData;
		else return functions.register(data, openid);
	},
	register: (data, openid) => {
		let reqData = {
			_openid: openid,
			nickName: data.nickName,
			avatarUrl: data.avatarUrl,
			role: 0,
			phone: '',
			realName: '',
			idCard: '',
			isReal: false,
			order0: 0,
			order1: 0,
			order2: 0,
			order3: 0
		}
		return db.collection('user').add({ data: reqData }).then(res => {
			return functions.userInfo(data, openid);
		})
	},
	phone: (data, openid) => {
		return db.collection('user').where({ _openid: openid }).update({
			data: { phone: data.phone }
		}).then(res => {
			return functions.userInfo(data, openid);
		})
	},
	verified: (data, openid) => {
		return db.collection('user').where({ _openid: openid }).update({
			data: {
				realName: data.realName,
				idCard: data.idCard,
				isReal: true
			}
		}).then(res => {
			return functions.userInfo(data, openid);
		})
	}
}
