
const request = require('request')
var teamwork = require('./teamwork.js');
var config = require('./config.js');
var fs = require('fs');






getTasks(function(err, remoteTasks) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Received: ' + remoteTasks.tasks.length + " tasks from remote");
   // compareLists(tasks.tasks, readTasks().tasks);
   readTasks(function(err, localTasks) {
       if (err) {
           console.log(err)
           return
       }
       compareLists(remoteTasks.tasks, localTasks.tasks);
   });
}) 

function compareLists(remote, local) {
    console.log('comparing remote to local');
  /*  for (var r in remote) {
        console.log(remote[r].id);
    } */
     for (var l in local) {
        console.log(local[l].id);
    }
}
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
            
            //now it an object
         /*   obj.table.push({id: 2, square:3}); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
         */
    
        });
    }




