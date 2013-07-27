var cache = {check:function (req,res,next) {
	
		console.log('check cache called');
		next();	
	},update:function (req,res,next) {
	
		console.log('update cache called');
		next();	
	}
}

module.exports = cache;