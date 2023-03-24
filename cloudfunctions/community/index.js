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
	create: (data, openid) => {
		let reqData = {
			name: data.name,
			area: data.area,
			image: data.image,
			_openid: openid,
			nickName: data.nickName,
			avatar: data.avatar
		}
		return db.collection('community').add({ data: reqData }).then(res => {
			return db.collection('user').where({ _openid: openid }).update({
				data: { role: 1 }
			}).then(res => {
				return true;
			})
		})
	},
	getList: (data, openid) => {
		return db.collection('community').where({ area: data.area }).get().then(res => {
			return res.data;
		})
	},
	detail: (data, openid) => {
		return db.collection('community').where({ _id: data.id }).get().then(res => {
			return res.data[0];
		})
	},
	getCommunity: (data, openid) => {
		return db.collection('community').where({ _openid: openid }).get().then(res => {
			return res.data[0];
		})
	},
	checkUser: (data, openid) => {
		return db.collection('apply').where({
			 cId: data.cId,
			 aId: openid
		}).get().then(res => {
			let resData = res.data;
			if (resData.length) return resData[0];
			else return false;
		})
	},
	joinCommunity: (data, openid) => {
		let reqData = {
			cId: data.cId,
			uId: data.uId,
			aId: openid,
			aName: data.aName,
			aAvatar: data.aAvatar,
			state: 0
		}
		return db.collection('apply').add({ data: reqData }).then(res => {
			if (res._id) return true;
			else return false;
		})
	},
	getApply: (data, openid) => {
		return db.collection('apply').where({
			uId: openid,
			state: data.state
		}).get().then(res => {
			return res.data;
		})
	},
	editApply: (data, openid) => {
		return db.collection('apply').where({ _id: data.id }).update({
			data: { state: data.state }
		}).then(res => {
			if (res.stats.updated == 1) return true;
			else return false;
		})
	}
}
