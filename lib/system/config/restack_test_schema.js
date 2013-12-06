module.exports = {
	model:{
		StaticTest:{
			constraints:{
				property1: {type: "String", index: true, required: true},
				property2: {type: "String", index: true, required: true}
			},
			directives:{
				history:'audit',
				checkVersionConcurrency:true,
				cacheTTLMinutes:0
			}
		},
		ArchiveTest:{
			constraints:{
				property1: {type: "String", index: true, required: true},
				property2: {type: "String", index: true, required: true}
			},
			directives:{
				history:'archive',
				cacheTTLMinutes:30
			}
		},
		AuditTest:{
			constraints:{
				property1: {type: "String", index: true, required: true},
				property2: {type: "String", index: true, required: true}
			},
			directives:{
				history:'audit',
				cacheTTLMinutes:30
			}
		},
		ConcurrencyTest:{
			constraints:{
				property1: {type: "String", index: true, required: true},
				property2: {type: "String", index: true, required: true}
			},
			directives:{
				checkVersionConcurrency:true,
				cacheTTLMinutes:30
			}
		}
	}
}
