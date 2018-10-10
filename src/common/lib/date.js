
/**
*	@description convert date to number date
*	@param{Number|String|Date}
*	@return  Date
**/

const regNumberDate = /^\d{13}$/;
export function tryToDate(date) {

	var tdate = date + '';
	// 先判断是否可以直接转换

	if (regNumberDate.test(tdate)) {
		return new Date( tdate - 0);
	}

	// 剩下的就是 2012-07-01,2016/02/01 ，2016 ／12 ／12 2:2:2
	// 先用parse直接转换，注意parse 转换不了－
	var converted = Date.parse(tdate);
    if (isNaN(converted)){   
        // 尝试把－替换成/
        converted = tdate.replace(/-/g, '/');
        converted = Date.parse(converted); 
        //如果还不是合法，好吧放弃了
        if(isNaN(converted)) {
        	return date;
        } else {
        	return new Date(converted);
        }
    }else{
    	return new Date(converted);
    }
    return date;
}


export function isValideDate(date) {
	return tryToDate(date) instanceof Date;
}
/**
*	@description format date
*	@{Number|String|Date} 	date   input
*	@{String}				format
*	@return{String}
*	
*	example:
*	format(new Date, 'yyyy-MM-dd')   2016-09-07
*/
export function format(date, format){
	if(!isValideDate(date)) return date;

	date = tryToDate(date);
	var o = {
		"M+" : date.getMonth() + 1, //month
		"d+" : date.getDate(),    //day
		"h+" : date.getHours(),   //hour
		"m+" : date.getMinutes(), //minute
		"s+" : date.getSeconds(), //second
		"q+" : Math.floor((date.getMonth() + 3) / 3),  //quarter
		"S" : date.getMilliseconds() //millisecond
	};
	if(/(y+)/.test(format)){
		format=format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o){
			if(new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
/**
*	@description is date a leap year
*	@param{Number|string|Date}		date input
*	@return{Boolean}	
*/

export function isLeapYear(date) {
	if (!isValideDate(date)) {
		throw new Error(date + 'is not valid date');
		return false;
	}

	date = tryToDate(date);

	return (0==date.getYear() % 4 && ((date.getYear() % 100 != 0) || (date.getYear() % 400 == 0)));   

}

/**
*	@description date add method
*	@param{String|Number|Date}		date  	input
*	@param{Number}					number  number to add
*	@param{String}					format	format to converted
*
*	@return{Date}
**/
export function add(date, number, format) {
	if (!isValideDate(date)) {
		throw new Error(date + 'is not valid date');
		return date;
	}
    var dtTmp = new Date(tryToDate(date)) - 0;
    number = isNaN(number)? 0 : number - 0;
    switch (format) {   
        case 's' : return new Date(dtTmp + (1000 * number));  
        case 'n' : return new Date(dtTmp + (60000 * number));  
        case 'h' : return new Date(dtTmp + (3600000 * number));  
        case 'd' : return new Date(dtTmp + (86400000 * number));  
        case 'w' : return new Date(dtTmp + ((86400000 * 7) * number));  
        case 'q' : return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'm' : return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'y' : return new Date((dtTmp.getFullYear() + number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
    	default: return dtTmp;
    }  
}  

/**
*	@description	convert date to array
*	@param{String|Number|Date}	date input date for using
*	@return{Array}	[year,month,date,hour,seconds,milseconds]
*/

export function toArray(date)  {
	if (!isValideDate(date)) {
		throw new Error(date + 'is not valid date');
		return [];
	}
    var myDate = tryToDate(date);  
    var myArray = Array();  
    myArray[0] = myDate.getFullYear();  
    myArray[1] = myDate.getMonth();  
    myArray[2] = myDate.getDate();  
    myArray[3] = myDate.getHours();  
    myArray[4] = myDate.getMinutes();  
    myArray[5] = myDate.getSeconds();  
    return myArray;  
}


/**
*	@description get timespan between end date and start date
*	@param{String|Number|Date}	start	
*	@param{String|Number|Date}	end	
*	@param{String}				format	format timespan
*
*	@return{Number}
*/
export function diff(start, end, format) {   
    start = tryToDate(start);
    end = tryToDate(end);

    if (!start instanceof Date || !end instanceof Date) {
    	throw new Error('start or end date is invalid');
    	return ;
    }
    switch (format) {   
        case 's' :return parseInt((end - start) / 1000); 
        case 'n' :return parseInt((end - start) / 60000);
        case 'h' :return parseInt((end - start) / 3600000); 
        case 'd' :return parseInt((end - start) / 86400000);
        case 'w' :return parseInt((end - start) / (86400000 * 7));
        case 'm' :return (end.getMonth() + 1) + ((end.getFullYear() - start.getFullYear()) * 12) - (start.getMonth() + 1);  
        case 'y' :return end.getFullYear() - end.getFullYear();
        default : return parseInt((end - start) / 86400000);
    }  
} 

/**
*	@description get max day of current month
*	@param{String|Number|Date}	date  valid date inpurt ,for 2016-2-2,2016/2/2, new Date()
*	
*	@return{Number}	max day of current month
*/
export function getMaxDayOfMonth(date) {
	date = date || new Date();

	date = tryToDate(date);

	if (!date instanceof Date) {
		date = new Date();
	}
	var dr = toArray(date);
	return diff(new Date(dr[0], dr[1], 1), new Date(dr[0], dr[1] + 1, 1), 'd');
}
/**
*   @description compare which is lingher
*   @param{String|Number|Date}  date1 first date 
*   @param{String|Number|Date}  date2 second date 
*
*   @return{Boolean} if date1 greater than date2 return true, else return false
*/
export function compare(date1, date2) {
    date1 = tryToDate(date1);
    date2 = tryToDate(date2);

    if (!date1 instanceof Date || !date2 instanceof Date) {
        throw new Error('start or end date is invalid');
        return ;
    }

    return date1 - date2 > 0;
}
