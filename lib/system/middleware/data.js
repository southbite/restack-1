var data = function (req,res,next) {

	console.log('data called');
	next();	
}

module.exports = data;