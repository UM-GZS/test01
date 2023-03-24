// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext();
	const openid = wxContext.OPENID;
	return await functions[event.funName](event, openid);
}

var functions = {
	getChat: (data, openid) => {
		return db.collection('chat').where(
			_.or([
				{ sId: data.tId, tId: openid },
				{ sId: openid, tId: data.tId }
			])
		).get().then(res => {
			let resData = res.data;
			if (resData.length) return resData[0];
			else return functions.addChat(data, openid);
		})
	},
	addChat: (data, openid) => {
		let reqData = {
			sId: openid,
			tId: data.tId,
			tName: data.tName,
			tAvatar: data.tAvatar,
			sName: data.sName,
			sAvatar: data.sAvatar
		}
		return db.collection('chat').add({ data: reqData }).then(res => {
			if (res._id) return { _id: res._id };
			else return false;
		})
	},
	getChats: (data, openid) => {
		return db.collection('chat').aggregate().lookup({
			from: 'message',
			let: {
				id: '$_id'
			},
			pipeline: $.pipeline().match(
				_.expr($.and([$.eq(['$cId', '$$id'])]))
			).sort({
				time: -1
			}).done(),
			as: 'msgArr'
		}).match(
			_.or([
				{ sId: openid },
				{ tId: openid }
			])
		).end().then(res => {
			return res.list;
		})
	},
	getMessage: (data, openid) => {
		return db.collection('message').where({
			cId: data.cId
		}).get().then(res => {
			return res.data;
		})
	},
	addMessage: (data, openid) => {
		let reqData = {
			cId: data.cId,
			sId: openid,
			tId: data.tId,
			sName: data.sName,
			sAvatar: data.sAvatar,
			data: data.data,
			type: data.type,
			time: data.time
		}
		return db.collection('message').add({ data: reqData }).then(res => {
			if (res._id) return true;
			else return false;
		})
	}
}
