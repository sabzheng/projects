import React from "react";

export class Aform extends React.Component {
  constructor(props){
    super(props);
    this.handleSubmit=this.handleSubmit.bind(this);
  }
  handleSubmit(e){
    e.preventDefault();
    console.log(e);
    let title_empty_err=false;
    let title_too_long=false;
    let Text_err=false;
    let Tag_err=false;
    let user_empty_error=false;
    let user_too_long_error=false;
  
    let text=e.target.ans.value;
    if(text.length===0){
      Text_err=true;
    }
    let user=e.target.username.value;
    if(user.length===0){
      user_empty_error=true;
    }else if(user.length>15){
      user_too_long_error=true;
    }
    console.log("empty text:"+Text_err);
    console.log("empty username:"+user_empty_error);
    console.log("too long username:"+user_too_long_error)
    console.log("Text: "+ text);
    console.log("User: "+user);
    console.log("refresh prevented");
    if(Text_err===true||user_empty_error===true||user_too_long_error===true){
    this.props.handleError("answer_form",title_empty_err,title_too_long,Text_err,Tag_err,user_empty_error,user_too_long_error);
    }
    else{
      this.props.pushNewAnswer(text,user);
      e.target.reset();
    }

  };
  render() {
    const Text_error=this.props.Text_err;
    const user_empty_error=this.props.user_empty_err;
    const user_too_long_error=this.props.user_too_long_err;
    const state = this.props.className;
    return (
      <div className={state}>
        <form id="Aform" onSubmit={this.handleSubmit}>
          <div className={Text_error?"error":"error hide"}>Answer Text can not be empty</div>
          <div className={user_empty_error?"error":"error hide"}>Username can not be empty</div>
          <div className={user_too_long_error?"error":"error hide"}>Username can not exceed 15 characters</div>
          <label>Answer Text</label>
          <textarea type="text" rows="4" cols="50" id="ans"></textarea>
          <label>Username</label>
          Should not be more than 15 characters <br></br>
          <input type="text" id="username"></input>
          <br></br>
          <button type="submit" >Post Answer</button>
        </form>
      </div>
    );
  }
}

export default Aform;
