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
	getMessage: (data, openid) => {
		return db.collection('user').where({
			tid: _.or(data.tId, openid),
			fId: _.or(openid, data.tId)
		}).get().then(res => {
			
		})
	},
	addMessage: (data, openid) => {
		let reqData = {
			fId: openid,
			fName: data.fName,
			userpic: data.userpic,
			tId: data.tId,
			data: data.data,
			time: data.time,
			getTime: data.getTime,
			type: data.type
		}
		return db.collection('message').add({ data: reqData }).then(res => {
			if (res._id) return true;
			else return false;
		})
	}
}
