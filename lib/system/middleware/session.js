
var session = function (req,res,next) {

	this.handle.restack.log('session called');
	
	/*
	 	data['account'] = req.operation.session.account.id;
		data['createdBy'] = req.operation.session.user.id;
	 */
	
	req.operation.session = {user:{id:'testuserid'}, account:{id:'testaccountid'}};
	
	next();	
}

module.exports = session;