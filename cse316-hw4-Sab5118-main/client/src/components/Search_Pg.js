import React, { Component } from 'react'

export class Search_Pg extends Component {
    constructor(props){
        super(props);
        this.handleTitleClick = this.handleTitleClick.bind(this);
    this.handleQButtonClick = this.handleQButtonClick.bind(this);
    }
    handleTitleClick(e) {
      this.props.onAnswerPg(e.target.id); 
    }
    handleQButtonClick(e){
      this.props.onQform();
    }
      render() {
        const title=this.props.title;
        const state = this.props.className;
        //const model = this.props.model;
        const questions_list = this.props.questions_list;
        return (
          <div className={state}>
            <table id="Qboard">
              <thead>
                <tr>
                  <th width="10%">{questions_list.length} Questions</th>
                  <th width="60%">{title}</th>
                  <th width="10%">
                    <button onClick={this.handleQButtonClick}>Ask A Question</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions_list.map((item,index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div>{item.views} Views</div>
                        <div>{item.ans_count} Answers</div>
                      </td>
                      <td>
                        <div className="title" id={item.qid} onClick={this.handleTitleClick}>
                          {item.title}
                        </div>
                        <div>
                          {item.tags.map((i) => {
                            return (
                              <span className="tagbuttons" key={i}>
                                {i}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td>
                      <div>Asked By {item.asked_by}</div>
                    <div>On {item.asked_on}</div>
                    <div>At {item.asked_at}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
}

export default Search_Pg