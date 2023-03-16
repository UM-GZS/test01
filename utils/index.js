const parseTime = {
	getChatTime(newT, oldT) {
		newT = newT.toString().length < 13 ? newT * 1000 : newT
		oldT = oldT.toString().length < 13 ? oldT * 1000 : oldT
		if ((newT - oldT) / 1000 > 300) {
			return this.parsetime(newT)
		} 
	},
	//将时间戳转换成正常时间格式
	parsetime(timestamp) {
		timestamp = timestamp.toString().length < 13 ? timestamp * 1000 : timestamp
		var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		var nowDate = new Date();
		var nowTime = new Date().getTime();
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = date.getDate() + ' ';
		var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
		var m = (date.getMinutes() <10 ? '0' +(date.getMinutes()) : date.getMinutes());
		var s = date.getSeconds();
		if (nowTime - date < 86400000) {
			if (date.getDay() !== nowDate.getDay()) {
				return "昨天" + h + m;
			}
			return h + m;
		} else if (nowTime - date < 604800000) {
			var a = ["日", "一", "二", "三", "四", "五", "六"];
			return "星期" + a[date.getDay()] + h + m;
		} else {
			return Y + M + D + h + m;
		}
	}
}
export default parseTime;
