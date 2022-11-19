import React, { Component } from "react";

export class Qform extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit=this.handleSubmit.bind(this);
  }
  handleSubmit(e){
    e.preventDefault();
    let title_empty_err=false;
    let title_too_long=false;
    let Text_err=false;
    let Tag_err=false;
    let user_empty_error=false;
    let user_too_long_error=false;
    let title=e.target.Qtitle.value;
    if(title.length===0){
      title_empty_err=true;
    }else if(title.length>100){
      title_too_long=true;
    }
    let text=e.target.Qtext.value;
    if(text.length===0){
      Text_err=true;
    }
    let tag=e.target.QTag.value;
    if(tag.length===0){
      Tag_err=true;
    }
    let user=e.target.QUser.value;
    if(user.length===0){
      user_empty_error=true;
    }else if(user.length>15){
      user_too_long_error=true;
    }
    console.log(this.state);
    console.log("title: " +title);
    console.log("Text: "+ text);
    console.log("Tag: " +tag);
    console.log("User: "+user);
    console.log("refresh prevented");
    if(title_empty_err===true||title_too_long===true||Text_err===true||Tag_err===true||user_empty_error===true||user_too_long_error===true){
    this.props.handleError("question_form",title_empty_err,title_too_long,Text_err,Tag_err,user_empty_error,user_too_long_error);
    }
    else{
      this.props.pushNewQuestion(title,text,tag,user);
      e.target.reset();
    }

  };
  render() {
    const state = this.props.className;
    const Title_empty_error=this.props.Title_empty_err;
    const Title_too_long=this.props.Title_too_long_err;
    const Text_error=this.props.Text_err;
    const Tag_error=this.props.Tag_err;
    const user_empty_error=this.props.user_empty_err;
    const user_too_long_error=this.props.user_too_long_err;
    
    return (
      <div className={state}>
        <form id="Qform" onSubmit={this.handleSubmit}>
        <div className={Title_empty_error?"error":"error hide"}>Title field cannot be empty!</div>
        <div className={Title_too_long?"error":"error hide"}>Title field cannot exceed 100 characters!</div>
        <div className={Text_error?"error":"error hide"}>Text box should not be empty!</div>
        <div className={Tag_error?"error":"error hide"}>Tags can not be empty!</div>
        <div className={user_empty_error?"error":"error hide"}>Username cannot be empty!</div>
        <div className={user_too_long_error?"error":"error hide"}>Username cannot be more than 15 characters!</div> 
          <div>
          <label>Question Title</label>
          Title should not be more than 100 characters<br></br>
          <input id="Qtitle"></input>
          <label>Question Text</label>
          Add details<br></br>
          <textarea type="text" rows="4" cols="50" id="Qtext"></textarea>
          <label>Question Tags</label>
          Add keywords separated by whitespace<br></br>
          <textarea type="text" rows="4" cols="50" id="QTag"></textarea>
          <label>Username</label>
          Should not be more than 15 characters<br></br>
          <input type="text" id="QUser"></input>
          <br></br>
          <button type="submit" >Post Question</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Qform;
