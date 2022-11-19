import React, { Component } from "react";
export class Answer_Pg extends Component {
    constructor(props){
        super(props);
        this.handleQButtonClick = this.handleQButtonClick.bind(this);
        this.handleAButtonClick = this.handleAButtonClick.bind(this);
    }
    handleQButtonClick(e){
      this.props.onQform();
    }
    handleAButtonClick(e){
      this.props.onAform();
    }
  render() {
    const state=this.props.className;
    const title=this.props.title;
    const views=this.props.views;
    const answer=this.props.answer;
    const answercount=this.props.answercount;
    const askedAt=this.props.askedAt;
    const askedBy=this.props.askedBy;
    const askedOn=this.props.askedOn;
    const text=this.props.text;
    return (
      <div className={state}>
        <table id="Aboard">
      <thead>
        <tr>
          <th width="10%" id="Acounter">{answercount} Answers</th>
          <th width="60%" id="ATitle">{title}</th>
          <th width="10%">
            <button onClick={this.handleQButtonClick}>Ask A Question</button>
          </th>
        </tr>
        <tr>
        <td id="Aviews">{views} views</td>
        <td id="Qtext">{text}</td>
        <td>
          <div id="Auser">Asked By {askedBy}</div>
          <div id="Adate">On {askedOn}</div>
          <div id="Atime">At {askedAt}</div>
        </td>
        </tr>
      </thead>
      <tbody>
        {answer.map((ans,i)=>{
          return (
              <tr key={i}>
                <td></td>
                <td><div>{ans.text}</div></td>
                <td>
                  <div>Ans By {ans.ans_by}</div>
                  <div>On {ans.ans_on}</div>
                  <div>At {ans.ans_at}</div>
                </td>
                </tr>
          )
        })}
        <tr></tr>
        <tr></tr>
      </tbody>
      </table>
      <div id="answerq"><button onClick={this.handleAButtonClick}>Answer Question</button></div>
      </div>
    )
  }
}

export default Answer_Pg