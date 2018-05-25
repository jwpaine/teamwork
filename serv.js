
const request = require('request')
var teamwork = require('./teamwork.js');
var config = require('./config.js');
var fs = require('fs');






getTasks(function(err, tasks) {
    if (err) {
        console.log(err)
        return
    }
    console.log(tasks);
})





function getTasks(callback) {
    teamwork.getTasks(config.api_key, 175854, function(err, tl) {
    
        if (err) {
        callback(err, null);
        return
        }
        var tasklist = JSON.parse(tl)['todo-items'];
        var obj = {
            tasks : []
        };
        for (var task in tasklist) {

            var t = {
                id : tasklist[task].id,
                content : tasklist[task].content,
                description : tasklist[task]['description'],
                owner : {
                    'firstname' : tasklist[task]['responsible-party-firstname'],
                    'lastname' : tasklist[task]['responsible-party-lastname']
                } 
            }
            obj.tasks.push(t);
        }

        console.log('Received ' + obj.tasks.length + ' tasks');
        callback(null, obj);
    });
};

function writeTasks(obj) {
    var json = JSON.stringify(obj);
    fs.writeFile('tasks.json', json, function(err) {
        if (err) {
           console.log(err)
        }
       
    });
}



