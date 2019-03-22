var dateFormatter = {};

//格式化成"yyyy-MM-dd"
dateFormatter.dateToStr = function(value) {
	if(value) {
		var d = new Date(value);
		var month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
		var day = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
		return d.getFullYear() + '-' + month + '-' + day;
	} else {
		return '';
	}

}

//格式化成"yyyy-MM-dd hh:mm:ss"
dateFormatter.dateTimeToStr = function(value) {
	if(value) {
		var d = new Date(value);
		var month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);
		var day = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();
		var hour = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();
		var minute = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
		var second = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds();
		return d.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
	} else {
		return '';
	}

}



export {
	dateFormatter
}