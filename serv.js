
const request = require('request')

var teamwork = require('./teamwork.js');
var config = require('./config.js');
var bot = require('./bot.js');
var fs = require('fs');

setInterval(run, config.teamwork.pullIntervalMinutes*60000);

function run() {

    getTasks(function(err, remoteTasks) {
        if (err) {
            console.log(err)
            return
        }
        console.log('Received: ' + remoteTasks.tasks.length + " tasks from remote");
        
        // check if tasks.json exists locally
        if (fs.existsSync('tasks.json')) {
            readTasks(function(err, localTasks) {
                if (err) {
                    console.log(err)
                    return
                }
                compareTaskLists(remoteTasks.tasks, localTasks.tasks);
            });
            return
        }
        // tasks.json does not exist, write task list
        console.log('recording tasks locally');
        writeTasks(remoteTasks);
      
    }) 
    
}
function compareTaskLists(remote, local) {
    console.log('comparing remote to local in O(n)');
  
    dict = {};
    for (var l in local) {
        dict[local[l].id] = true;
    }
    for (var r in remote) {
        if (dict[remote[r].id] == undefined) {
            console.log(remote[r]);
        }
    }
}
function getTasks(callback) {
    teamwork.getTasks(config.teamwork.api_key, 175854, function(err, tl) {
    
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
function readTasks(callback) {
    fs.readFile('tasks.json', 'utf8', function readFileCallback(err, data){
        if (err){
            callback(err, null)
            return;
        } 
            obj = JSON.parse(data); 
            callback(null, obj)
    });
}

bot.init(config.bot.id, config.bot.password, function(c) {

});


