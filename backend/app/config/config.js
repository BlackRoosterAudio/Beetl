// BASIC CONFIG //

exports.routeTable = [
	{
		name    		: 'user',
	  	methods 		: ['GET', 'POST', 'PUT', 'DELETE'],
	  	setCallback 	: [{'field':'password','method':'saltPassword'}],
	  	getCallback 	: '',
	  	deleteCallback 	: '',
	  	updateCallback 	: [{'field':'password','method':'saltPassword'}]
	},
	{
		name    		: 'catalogue',
	  	methods 		: ['GET', 'POST', 'PUT', 'DELETE'],
	  	setCallback 	: '',
	  	getCallback 	: '',
	  	deleteCallback 	: '',
	  	updateCallback 	: ''
	},
	{
		name    		: 'project',
	  	methods 		: ['GET', 'POST', 'PUT', 'DELETE'],
	  	setCallback 	: '',
	  	getCallback 	: '',
	  	deleteCallback 	: '',
	  	updateCallback 	: ''
	},
	{
		name    		: 'result',
	  	methods 		: ['GET', 'POST', 'PUT', 'DELETE'],
	  	setCallback 	: '',
	  	getCallback 	: '',
	  	deleteCallback 	: '',
	  	updateCallback 	: ''
	}
];