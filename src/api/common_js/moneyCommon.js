var moneyFormatter = {};

//格式化金额

moneyFormatter.formatterMoney = function(s, n) { //始终保持两位小数
	if(!n || n == "") {
		n = 2;
	}
	if (typeof(s) == "undefined" || s == null || s == "") { 
    		return "";
	}   
//	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
//	if(isNaN(s) || ((s + "").replace(/\s/g, "")) == "") {
//		return "";
//	}
	n = n > 0 && n <= 20 ? n : 2;
//	var l = s.split(".")[0].split("").reverse(),
//		r = s.split(".")[1];
//	var t = "";
//	for(var i = 0; i < l.length; i++) {
//		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
//	}
//	return t.split("").reverse().join("") + "." + r;

	return (Number(s)).toLocaleString(undefined, {minimumFractionDigits: n, maximumFractionDigits: n});

}

moneyFormatter.formatterMoneyNoPoint = function(s, n) { //如果有小数点就保留2位，如果没有就不带小数点
	if(String(s).indexOf(".") == -1) {
		n = 0;
	} else {
		n = 2;
	}
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	if(isNaN(s) || ((s + "").replace(/\s/g, "")) == "") {
		return "";
	}
	//	n = n > 0 && n <= 20 ? n : 0;
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	var t = "";
	for(var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	if(r) {
		return t.split("").reverse().join("") + "." + r;
	} else {
		return t.split("").reverse().join("");
	}

}

//格式化百分比
moneyFormatter.formatterPer = function(s) {
	var n = 0;
	var num='0';
	if(String(s).indexOf(".") > -1) {
		if(String(s).split(".")[1].length == 2) {
			n = 0;
		} else if(String(s).split(".")[1].length == 3) {
			n = 1;
		} else {
			n = 2;
		}
		 num = (Math.round(s * 10000) / 100).toFixed(n).toString();
		if(num.substring(num.length - 1) == 0) {
			num = num.substring(0, num.length - 1); //将最后一个0截取掉 ，如：0.58798，变成百分比就是58.8%，而不是58.80%
		};
	}else{
		 num = (Math.round(s * 10000) / 100).toFixed(n).toString(); //0,1的情况
	}
	
	return num + '%';
}

// 金额格式化还原函数
moneyFormatter.resetMoney = function(s) {
	var ret = (s + "").replace(/[^\d\.-]/g, "");
	return parseFloat(ret);
}

export {
	moneyFormatter
}