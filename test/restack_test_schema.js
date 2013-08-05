module.exports = {
	model:{
		BlogPost:{
			title:{type: "String", trim: true},
			timestamp:{type:"Date", 'default':'now'},
			version: {type: 'Number'}
		},
		BlogComment:{
			emailAddress: {type: "String", trim: true, index: true, required: true},
			timestamp:{type:"Date", 'default':'now'},
			postId:{type: 'Id'}
		}
	},
	directives:{
		cache:{'BlogComment':'lru','BlogPost':'static'},
		history:{'BlogComment':'audit','BlogPost':'archive'}
	}
}