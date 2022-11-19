import React from 'react';
import axios from 'axios';
import Question_Pg from "./Question_Pg";
import Tag_Pg from "./Tag_Pg";
import Answer_Pg from "./Answer_Pg";
import Qform from "./Qform";
import Aform from "./Aform";
import Search_Pg from "./Search_Pg";
import Tag_Click_Pg from "./Tag_Click_Pg";

export default class FakeStackOverflow extends React.Component {
  constructor(props){
    super(props);
    this.state={
      page:'question_page',
      questions_list:[{
        qid:'',
        title:'title',
        text:'text',
        tags:['tag1','tag2'],
        ans_count: 0,
        asked_by:'user',
        asked_at:'time',
        asked_on:'date',
        views: 0
      }],
      qid:'',
      views:0,
      answers:[],
      tag:[],
      answercount:0,
      askedAt:'time',
      askedBy:'user',
      askedOn:'date',
      text:'text',
      err:{
        title_empty_err:false,
        Title_too_long_err:false,
        Text_err:false,
        Tag_err:false,
        user_empty_err:false,
        user_too_long_err:false
      },
      searchItem:''
    }
      //Click on nav bar question button to go to question page
      this.handleClickQ=this.handleClickQ.bind(this);
      //Click on nav bar tag button to go to tag page
      this.handleClickT=this.handleClickT.bind(this);
      //Click on ask button and display qform 
      this.handleQform=this.handleQform.bind(this);
      //Click on question titles and display ans
      this.handleApg=this.handleApg.bind(this);
      //Change state of err to display if needed
      this.displayError=this.displayError.bind(this);
      //add question to database
      this.addQuestion=this.addQuestion.bind(this);
      //Click on ans button and display aform
      this.handleAform=this.handleAform.bind(this);
      //add answer to database
      this.addAnswer=this.addAnswer.bind(this);
      //handle search function to modify question_list in state and then display it
      this.startSearch=this.startSearch.bind(this);
      //prevent forms from resetting on submit
      this.preventReset=this.preventReset.bind(this);
      //display questions of a specific tag
      this.handleTagClick=this.handleTagClick.bind(this);
      this.searchContent=this.searchContent.bind(this);
  }

handleTagClick(e){
    //e is name of the tag
    //identify the TObj first 
    //qlist is all the questions of the clicked tag e
    axios.get('http://localhost:8000/posts/tag/'+e).then(
      res=>{
        console.log(res.data);
        this.setState({
          page:"tag_q_page",
          questions_list:res.data,
          searchItem:e
        })
      }
    )
  }
  searchContent(data,key_word,tag){
    let result=[];
    let foundintitle=[];
    let foundintext=[];
    console.log("inside search Content:");
    console.log("inside search Content:"+key_word);
    console.log("inside search Content:"+tag);

    key_word.forEach(key=>{
      if(key.length!==0){
        let k=key.toLowerCase();
        console.log(k);
        foundintitle=data.filter(n=>n.title.toLowerCase().includes(k));
        foundintext=data.filter(n=>n.text.toLowerCase().includes(k));
        result.unshift(...foundintext);
        result.unshift(...foundintitle);
      }
    })
    let foundintag=[];
    tag.forEach(t=>{
      foundintag=data.filter(n=>{
        console.log(n);
        console.log(t.toLowerCase());
        let result=n.tags.filter(s=>s.toLowerCase()===(t.toLowerCase()));
        return result.length>0;
      });
      result.unshift(...foundintag);
    })
    let search_result=[];
    if(result.length>0){
      search_result=[...new Set(result)];
    }
    return search_result;
  }
  startSearch(e){
    e.preventDefault();
    axios.get('http://localhost:8000/posts/question').then(
    //e.key===Enter then
    //search (value=e.target.value)
    res=>{
    if(e.key==='Enter'){
      console.log(res.data);
      let search=e.target.value;
      if(search.length>0){
      console.log(search);
      let tag_list=[];
      let key_words=[];
      let searchResult=[];
      console.log(search.match(/\[.+?\]/g)!=null);
      if(search.match(/\[.+?\]/g)!=null){
        tag_list=search.match(/\[.+?\]/g).map(i=>{return i.slice(1,-1)});
        key_words=search.replace(/\[.+?\]/g," ").split(" ");
        searchResult=this.searchContent(res.data,key_words,tag_list);

      }
      else{
        key_words=search.split(" ");
        searchResult=this.searchContent(res.data,key_words,[]);
      }
      console.log("result search: "+searchResult.length);
      console.log("tag:"+tag_list);
      console.log("Key words:"+key_words);
      this.setState({
      page:'search_page', 
      questions_list:searchResult,
      qid:"",
      title:"title", 
      views:0, 
      answers:[], 
      answercount:0, 
      askedAt: "time", 
      askedBy:"user", 
      askedOn:"date", 
      text:"",
      err:{
        title_empty_err:false,
        Title_too_long_err:false,
        Text_err:false,
        Tag_err:false,
        user_empty_err:false,
        user_too_long_err:false
      },
      searchItem: searchResult.length>0?search:"No Question Found!"});
    }
    else{
      this.handleClickQ();
    }}})}
  
    preventReset(e){
    e.preventDefault();
  }
  //post to server and from there save to database
  addQuestion(title,text,tag,user){
    //call post to add to database
    const data={title:title,text:text,tag:tag,asked_by:user}
    axios.post('http://localhost:8000/posts/question/add',data).then(
      res=>{
      window.location.reload();
      console.log(res);
      }
    )
  }
  //post to server and modify database (add to answers and modify question object by updating the answer list)
  addAnswer(text,user){
    //call post to add to ans database
    //out put the ans
    const data={text:text,ans_by:user}
    axios.post('http://localhost:8000/posts/question/'+this.state.qid,data)
    .then(
      this.handleApg(this.state.qid)
    )
  }
  displayError(form,title_empty_err,Title_too_long_err,Text_err,Tag_err,user_empty_err,user_too_long_err){
    this.setState({
      page:form,
      err:{
        title_empty_err:title_empty_err,
        Title_too_long_err:Title_too_long_err,
        Text_err:Text_err,
        Tag_err:Tag_err,
        user_empty_err:user_empty_err,
        user_too_long_err:user_too_long_err
      }
    });
  }
  handleApg(e){
    axios.get('http://localhost:8000/posts/question/'+e).then(
      res=>{
        console.log(res.data);
        //res.data should contain:
        //qid,title, incremented views,answers[],answercount,
        //askedBy,text,askedOn,askedAt
        this.setState({
          page:"answer_page",
          qid:res.data.qid,
          title:res.data.title,
          views:res.data.views,
          answers:res.data.answers,
          answercount:res.data.answers.length,
          askedBy:res.data.asked_by,
          text:res.data.text,
          askedOn:res.data.asked_on,
          askedAt:res.data.asked_at
        })
      }
    )
  }

  //Click on nav bar question button to go to question page
  handleClickQ(){
    axios.get('http://localhost:8000/posts/question')
    .then(res=>{ 
      console.log(res.data);
      this.setState({
        page:"question_page", 
        questions_list:res.data,
        //reset error in forms
        err:{
          title_empty_err:false,
          Title_too_long_err:false,
          Text_err:false,
          Tag_err:false,
          user_empty_err:false,
          user_too_long_err:false
        },
        searchItem:""//resets searchItem to empty
      });
    });
  }
  handleClickT(){
    axios.get('http://localhost:8000/posts/tag')
    .then(res=>{
      console.log(res.data);
      this.setState({
        page:"tag_page", 
        tag:res.data,//tag stores is get from the data
        //error in forms reset
        err:{
          title_empty_err:false,
          Title_too_long_err:false,
          Text_err:false,
          Tag_err:false,
          user_empty_err:false,
          user_too_long_err:false
        },
        searchItem:""
      });
    });
    // this.setState({
    //   page:'tag_page'
    // })
  }
  handleQform(){
    this.setState({
      page:"question_form",
      err:{
        title_empty_err:false,
        Title_too_long_err:false,
        Text_err:false,
        Tag_err:false,
        user_empty_err:false,
        user_too_long_err:false
      },
      searchItem:""
    });
  }
  handleAform(){
    this.setState({
      page:"answer_form",
      err:{
        title_empty_err:false,
        Title_too_long_err:false,
        Text_err:false,
        Tag_err:false,
        user_empty_err:false,
        user_too_long_err:false
      },
      searchItem:""
    });
  }
  
  componentDidMount(){
    axios.get('http://localhost:8000/posts/question')
    .then(res=>{
      console.log(res);
      this.setState({
        page:"question_page",
        //show questin page to begin
        questions_list:res.data 
        //res.data is the question data
      });
    })
  }
  
  render() {
    const active=this.state.page;
    const q_list=this.state.questions_list;
    //console.log(q_list);
    const title=this.state.title;
    const views=this.state.views;
    const answercount=this.state.answercount;
    const answer=this.state.answers;
    const askedBy=this.state.askedBy;
    const askedAt=this.state.askedAt;
    const askedOn=this.state.askedOn;
    const text=this.state.text;
    const search=this.state.searchItem;
    const tag_list=this.state.tag;
    return (
    <div>
      <nav>
        <ul>
          <li id="question_bar">
            <a
              onClick={this.handleClickQ}
              className={active==='question_page'?"active":""}
            >Questions</a>
          </li>
          <li id='tag_bar'>
              <a
                onClick={this.handleClickT}
                className={active==='tag_page' ? "active" : ""}
              >
                Tags
              </a>
          </li>
        </ul>
        <div className="logo">Fake Stack Overflow</div>
          <div>
            <form onSubmit={this.preventReset}>
              <input 
              placeholder="search..." 
              type="text" 
              id="searchItem" 
              onKeyUp={this.startSearch}
              ></input>
            </form>
          </div>
      </nav>
      <Tag_Pg
          className={active==='tag_page' ? "" : "hide"}
          tag_list={tag_list}
          //model={model}
          onQform={this.handleQform}
          showTagQ={this.handleTagClick}
        />
        <Qform
          className={active==='question_form' ? "" : "hide"}
          handleError={this.displayError}
          Title_empty_err={this.state.err.title_empty_err}
          Title_too_long_err={this.state.err.Title_too_long_err}
          Text_err={this.state.err.Text_err}
          Tag_err={this.state.err.Tag_err}
          user_empty_err={this.state.err.user_empty_err}
          user_too_long_err={this.state.err.user_too_long_err}
          pushNewQuestion={this.addQuestion}
        />
        <Aform
          className={active==="answer_form"? "" : "hide"}
          handleError={this.displayError}
          Text_err={this.state.err.Text_err}
          user_empty_err={this.state.err.user_empty_err}
          user_too_long_err={this.state.err.user_too_long_err}
          pushNewAnswer={this.addAnswer}
        />
        <Question_Pg
          className={active==='question_page'? "" : "hide"}
          questions_list={q_list}
          //model={model}
          onQform={this.handleQform}
          onAnswerPg={this.handleApg}
        />
        <Search_Pg
          className={active==='search_page'? "" : "hide"}
          questions_list={q_list}
          onQform={this.handleQform}
          onAnswerPg={this.handleApg}
          title={search}
        />
        <Tag_Click_Pg
          className={active==="tag_q_page"? "":"hide"}
          questions_list={q_list}
          //model={model}
          onQform={this.handleQform}
          onAnswerPg={this.handleApg}
          title={search}
        />
        <Answer_Pg
          className={active==='answer_page' ? "" : "hide"}
          onQform={this.handleQform}
          onAform={this.handleAform}
          title={title}
          views={views}
          answer={answer}
          answercount={answercount}
          askedAt={askedAt}
          askedBy={askedBy}
          askedOn={askedOn}
          text={text}
        />
    </div>
    );
  }
}