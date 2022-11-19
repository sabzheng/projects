// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
var mysql = require('mysql');
var Answer = require('./db/Answer');
var Question = require('./db/Question');
var Tag = require('./db/Tag');
let userArgs = process.argv.slice(2);

const express = require('express');
const app=express();
const port=8000;
const cors=require('cors');

if(userArgs.length == 0) {
    console.log('missing arguments');
    console.log('Correct Usage: node server/server.js -u <username> -p <password>');
    return;
}

if(userArgs.length != 4) {
    console.log('Bad arguments');
    console.log('Correct Usage: node server/server.js -u <username> -p <password>');
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
process.on('SIGINT',()=>{
    console.log("process terminating...\n");
    if(connection){
        console.log('Server closed.\n');
        console.log('Database instance disconnected!');
        connection.close();
    }
});

function logger_check(req,res,next){
    console.log(req.url);
    next();
}

app.use(cors());
app.use(express.json()); //have to apply to use req.body
app.use(express.urlencoded({extended:false}));
app.use(logger_check);
app.use(cors());
app.use(express.json());

question_list=function(req,res){
    Question.get_all_question_info(connection,res);
}

question_create_post=function(req,res){
    let title=req.body.title;
    let text=req.body.text;
    let asked_by=req.body.asked_by;
    let tag=req.body.tag.split(" ");
    //new question has:
    //0 views, title, text,tag,asked_by
    
    //create new question in question

    //create new tag in tag

    //create new tag relationship in qt

    //console.log(new_question);
    Question.addQuestion(connection,title,text,asked_by,tag);
    //Question.add_question(connection,new_question);
    //Tag.add_tag(connection,new_tag);
}

question_update_post=function(req,res){
    let qid=req.params.id;
    let ans_by=req.body.ans_by;
    let text=req.body.text;

    Answer.addAnswer(connection,qid,ans_by,text,res);
}

question_detail=function(req,res){
    let qid=req.params.id;
    Question.get_question_by_id(connection,res,qid);
    //create a function in question that gets all question details
    //(qid,title,incremented views,answers,answercount,askedBy,text,askedOn,askedAt)

}

search_content=function(req,res){}

tag_list=function(req,res){
    Tag.get_all_tags(connection,res);
}

question_of_tag=function(req,res){
    let tag_name=req.params.id;
    Question.get_all_questions_by_tag(connection,res,tag_name);
}



//question routes
//handle incoming get of the question page
app.get('/posts/question',question_list);
app.post('/posts/question/add',question_create_post);
app.post("/posts/question/:id",question_update_post);
app.get('/posts/question/:id',question_detail);
app.get('/', function(req,res){
    res.redirect('/posts/question');
});

app.get('/posts/tag',tag_list);
app.get('/posts/tag/:id',question_of_tag);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}\n`);
});






