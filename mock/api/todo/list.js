var RETURN = {
	"errno": "0",
	"error": "",
	"data": [{
		"title": "去吃饭",
		"time": "2018-10-31 21:21:21",
		"completed": false
	}, {
		"title": "去游泳",
		"time": "2018-12-31 20:20:21",
		"completed": false
	}, {
		"title": "剪头发",
		"time": "2018-07-21 20:20:21",
		"completed": true
	}]
}

module.exports = function (req, res, next) {
	setTimeout(function(){
		res.json(RETURN);
	},1000)
}
