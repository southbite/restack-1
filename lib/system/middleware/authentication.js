module.exports = function (req, res, next) {

	if (req.operation.type == 'Account' && req.method == 'POST'){
		//trying to create an account, so we don't check for a valid token
		next();
	}
	else if (req.operation.type == 'AuthToken' && req.method == 'GET'){
		//we authenticate the user credentials and return an authtoken, use passport here?
		req.operation.credentials = {user:{id:'testuserid'}, account:{id:'testaccountid'}};
		next();
	}
	else{
		//we authenticate the authtoken included as part of the request headers
		req.operation.credentials = {user:{id:'testuserid'}, account:{id:'testaccountid'}};
		next();
	}
}