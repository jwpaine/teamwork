const request = require('request')
access_token = null;
endpoint = null;
user = null;

exports.authenticate = function(auth_code, callback) {
    console.log('using auth code: ' + auth_code);
    console.log('sending post request to teamwork launchpad to get perm access token...');
    uri = 'https://www.teamwork.com/launchpad/v1/token.json'
    request.post(
        uri,
        { json: { code:  auth_code} },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
               access_token = body.access_token;
               endpoint = body.installation.apiEndPoint;
               user = body.user;
               callback(null, ('Welcome to ' + endpoint + ', ' + user.firstName + '!'));
              
            }
        }
    );
};
exports.getEndpoint = function(callback) {
    callback(endpoint);
}
exports.getUser = function(callback) {
    callback(user);
}