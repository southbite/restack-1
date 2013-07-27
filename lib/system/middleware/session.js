
var session = function (req,res,next) {

	console.log('session called');
	next();	
}

module.exports = session;