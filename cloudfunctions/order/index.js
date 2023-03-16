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
	publish: (data, openid) => {
		let pTime = new Date().toLocaleString('chinese', { hour12: false });
		let reqData = {
			area: data.area,
			community: data.community,
			title: data.title,
			content: data.content,
			time: data.time,
			pId: openid,
			pNmae: data.pNmae,
			cId: data.cId,
			state: 0,
			pTime: pTime,
			jTime: '-',
			oTime: '-',
			fTime: '-'
		}
		return db.collection('order').add({ data: reqData }).then(res => {
			return true;
		})
	},
	getList: (data, openid) => {
		return db.collection('order').where({
			cId: data.id,
			state: 0
		}).get().then(res => {
			return res.data;
		})
	},
	getDetail: (data, openid) => {
		return db.collection('order').where({ _id: data.id }).get().then(res => {
			return res.data[0];
		})
	},
	getOrder: (data, openid) => {
		let forTime = new Date().toLocaleString('chinese', { hour12: false });
		return db.collection('order').where({ _id: data.id }).update({
			data: {
				state: 2,
				oTime: forTime,
				jTime: forTime,
				uId: openid
			}
		}).then(res => {
			if (res.stats.updated == 1) return true;
			else return false;
		})
	},
	fishOrder: (data, openid) => {
		let fTime = new Date().toLocaleString('chinese', { hour12: false });
		return db.collection('order').where({ _id: data.id }).update({
			data: {
				state: 3,
				fTime: fTime
			}
		}).then(res => {
			if (res.stats.updated == 1) return true;
			else return false;
		})
	},
	getData: (data, openid) => {
		return db.collection('order').where({ state: data.state }).get().then(res => {
			return res.data;
		})
	},
}
