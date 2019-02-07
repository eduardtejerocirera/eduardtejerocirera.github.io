var YoutubeManager = {
	
	init: function(){
		// 1. Load the JavaScript client library.
		gapi.load('client', function(){
			gapi.client.setApiKey('AIzaSyB9YEy-gexTaNCGhMCgbwSG5OrkB83b7n4');
			gapi.client.load("youtube","v3",function(){

			});
		});
	},
	initClient: function(){
		// 2. Initialize the JavaScript client library.
  		gapi.client.init({
    		'apiKey': 'AIzaSyB9YEy-gexTaNCGhMCgbwSG5OrkB83b7n4',
    		'discoveryDocs': ['https://people.googleapis.com/$discovery/rest']
    		// clientId and scope are optional if auth is not required.
    		/*'clientId': 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    		'scope': 'profile',*/
  		});
	},

}
