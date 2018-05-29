var builder = require('botbuilder');  
const request = require('request')
const express = require('express')
const app = express()

app.set('port', (process.env.PORT || 8080))

app.listen(app.get('port'), function() {
	console.log('bot running on port', app.get('port'))
});

var connector = null;

exports.init = function(id,password, callback) {
    // chat connector for communicating with the Bot Framework Service 
    connector = new builder.ChatConnector({     
        appId: id,
        appPassword: password
    });
}

app.post('/api/messages', function(req,res) {

});