import React, { Component } from 'react';

export class Tag_Pg extends Component {
    constructor(props){
        super(props);
        this.handleQButtonClick=this.handleQButtonClick.bind(this);
        this.handleTagClick=this.handleTagClick.bind(this);
    }
    handleQButtonClick(e){
      this.props.onQform();
  
    }
    handleTagClick(e){
      console.log(e.target.id);
      this.props.showTagQ(e.target.id);
    }
  render() {
    const state=this.props.className;
    const tag_list=this.props.tag_list;
    return (
      <div className={state}>
          <table>
          <thead>
            <tr>
              <th width="10%">{tag_list.length} Tags</th>
              <th width="60%">All Tags</th>
              <th width="10%">
                <button onClick={this.handleQButtonClick}>Ask A Question</button>
              </th>
            </tr>
          </thead>
          </table>

          <table className="tags_table">
          <tbody>
            {
            tag_list.map((tag,i)=>{
              if(i%3===0){
               return(
                   <tr key={i}>
                   <td onClick={this.handleTagClick} id={tag.name}>
                       <span onClick={this.handleTagClick} className="tag" id={tag.name}>{tag.name}</span><br></br>
                       {/* <span onClick={this.handleTagClick} id={tag.name}>{model.getNumOfQuestions(tag.tid)} Questions</span> */}
                       <span onClick={this.handleTagClick} id={tag.name}>{tag.count} Questions</span>
                       {/* Check num question to get from mongoDB */}
                    </td>
                    {tag_list.map((tag_row,j)=>{
                      if(j<i+3&&j>i){
                        return(
                          <td key={j} onClick={this.handleTagClick} id={tag_row.name}>
                            <span  onClick={this.handleTagClick} className="tag" id={tag_row.name}>{tag_row.name}</span><br></br>
                            {/* <span  onClick={this.handleTagClick} id={tag_row.name}>{model.getNumOfQuestions(tag_row.tid)} Questions</span> */}
                            <span  onClick={this.handleTagClick} id={tag_row.name}>{tag_row.count} Questions</span>
                            {/* Check num question to get from mongoDB */}
                          </td>
                        )
                      }
                    })}
                   </tr>
                   );
               }
               else{
                return;
              }
               }
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Tag_Pg;