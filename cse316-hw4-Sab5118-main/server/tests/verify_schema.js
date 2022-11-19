var async      = require('async');
var mysql      = require('mysql');
var qstnTable = require('./db/questionTable');
var ansTable = require('./db/ansTable');
var tagTable = require('./db/tagTable');
var qaTable = require('./db/qaTable');
var qtTable = require('./db/qtTable');

let userArgs = process.argv.slice(2);

if(userArgs.length == 0) {
  console.log('missing arguments');
  console.log('Correct Usage: node verify_schema -u <mysqlusername> -p <mysqlpassword>');
  return;
}

if(userArgs.length != 4) {
  console.log('Bad arguments');
  console.log('Correct Usage: node verify_schema -u <mysqlusername> -p <mysqlpassword>');
  return;
}

if(userArgs[0] != '-u') {
  console.log('username missing');
  return;
}

if(userArgs[2] != '-p') {
  console.log('password missing');
  return;
}

user = userArgs[1];
pass = userArgs[3];

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : user,
  password : pass,
  database : 'fake_so'
});

connection.connect();

async.parallel(
  [
    function(callback) {
      qstnTable.insert(connection, callback, 'Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', 'Joji John');
    },
    function(callback) {
      qstnTable.insert(connection, callback, 'android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', 'saltyPeter', null, 121);
    },
    function(callback) {
      ansTable.insert(connection, callback, 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'hamkalo');
    },
    function(callback) {
      ansTable.insert(connection, callback, 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'azad');
    },
    function(callback) {
      ansTable.insert(connection, callback, 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'abaya');
    },
    function(callback) {
      ansTable.insert(connection, callback, 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'alia');
    },
    function(callback) {
      ansTable.insert(connection, callback, 'I just found all the above examples just too confusing, so I wrote my own. ', 'sana');
    },
    function(callback) {
      tagTable.insert(connection, callback, 'react');
    },
    function(callback) {
      tagTable.insert(connection, callback, 'javascript');
    },
    function(callback) {
      tagTable.insert(connection, callback, 'android-studio');
    },
    function(callback) {
      tagTable.insert(connection, callback, 'shared-preferences');
    }
  ],
  function(err, results) {
    if(err) {
      connection.end();
      throw err;
    }
    addRelationships(results);
  })

function addRelationships(entityIds) {
  async.parallel([
    function(callback) {
      qaTable.insert(connection, callback, entityIds[0].insertId, entityIds[2].insertId)
    },
    function(callback) {
      qaTable.insert(connection, callback, entityIds[0].insertId, entityIds[3].insertId)
    },
    function(callback) {
      qaTable.insert(connection, callback, entityIds[1].insertId, entityIds[4].insertId)
    },
    function(callback) {
      qaTable.insert(connection, callback, entityIds[1].insertId, entityIds[5].insertId)
    },
    function(callback) {
      qaTable.insert(connection, callback, entityIds[1].insertId, entityIds[6].insertId)
    },
    function(callback) {
      qtTable.insert(connection, callback, entityIds[0].insertId, entityIds[7].insertId)
    },
    function(callback) {
      qtTable.insert(connection, callback, entityIds[0].insertId, entityIds[8].insertId)
    },
    function(callback) {
      qtTable.insert(connection, callback, entityIds[1].insertId, entityIds[9].insertId)
    },
    function(callback) {
      qtTable.insert(connection, callback, entityIds[1].insertId, entityIds[10].insertId)
    },
    function(callback) {
      qtTable.insert(connection, callback, entityIds[1].insertId, entityIds[8].insertId)
    },
  ],
  function(err, results) {
    if(err) {
      connection.end();
      throw err;
    }
    console.log('done! Schema Valid');
    connection.end();
  })
}
