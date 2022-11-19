// Question-related Queries
exports.get_all_question_info = function(connection,server){
    //server.send("All questions");
    // connection.connect();
    // const question_info_query = 'select qid from question;';
     const question_info_query = 
     'select qid,views,title,asked_by,\
     date_format(ask_date_time,\'%b %d, %Y\') as asked_on,\
     date_format(ask_date_time,\'%H:%i\') as asked_at,\
     group_concat(distinct name) as tags,\
     text from question inner join qa inner join tag\
     inner join qt on qt.qstnid=qid\
     and tag.tid=qt.tagid group by qid order by ask_date_time desc;';

     const ans_count=
     'select qid,count(ansid) as ans_count from qa right outer join question on qid=qstnid group by qid'

    connection.beginTransaction(function(err){
        if(err){throw err;}
        connection.query(question_info_query,function(error,results,fields){
            if(error) {
                return connection.rollback(function(error) {
                  throw error;
                });
              }
            results.map(function(result){
                return result.tags=result.tags.split(",");
            })
            connection.query(ans_count,function(error,count,field){
                if(error) {
                    return connection.rollback(function(error) {
                        throw error;
                    });
                }
                let merged = results.map(t1 => ({...t1, ...count.find(t2 => t2.qid === t1.qid)}))

                connection.commit(function(err) {
                    if (err) {
                      return connection.rollback(function() {
                        throw err;
                      });
                    }
                    server.send(merged);
                  });
            })
        });
    })
}

exports.get_question_by_id=function(connection,server,id){
    const question_properties=
    'select qid, text, views, title, asked_by,\
     date_format(ask_date_time,\'%b %d, %Y\') as asked_on,\
     date_format(ask_date_time,\'%H:%i\') as asked_at\
     from question where qid = ?;'

     const incr_view=
     'update question set views=views+1 where qid=?;'

     const ans_list=
     'select aid, answer.text,ans_by,\
     date_format(ans_date_time,\'%b %d, %Y\') as ans_on,\
     date_format(ans_date_time,\'%H:%i\') as ans_at\
     from question inner join answer inner join qa on qid=qstnid and aid=ansid\
     where qid=? order by ans_date_time desc;'

    connection.beginTransaction(function(err){
        if(err) throw err;
        connection.query(incr_view,[id],function(error,result,field){
            if(error){
                return connection.rollback(function(error){
                    throw error;
                });
            }
            connection.commit(function(err){
                if(err){
                    return connection.rollback(function(){
                        throw err;
                    })
                }
                connection.query(question_properties,[id],function(error,result,field){
                    if(error){
                        return connection.rollback(function(error){
                            throw error;
                        })
                    }
                    connection.query(ans_list,[id],function(err,results,field){
                        if(err){
                            return connection.rollback(function(error){
                                throw error;
                            });
                        }
                        result[0].answers=results;
                        console.log('saved!');
                        server.send(result[0]);
                    })
                })
            })
        })
    })
}

exports.get_all_questions_by_tag=function(connection,server,tag_name){
    const question_info_query = 
    'select qid,views,title,asked_by,\
    date_format(ask_date_time,\'%b %d, %Y\') as asked_on,\
    date_format(ask_date_time,\'%H:%i\') as asked_at,\
    group_concat(distinct name) as tags,\
    text from question inner join qa inner join tag\
    inner join qt on qt.qstnid=qid\
    and tag.tid=qt.tagid group by qid order by ask_date_time desc;';

    const ans_count=
    'select qid,count(ansid) as ans_count from qa right outer join question on qid=qstnid group by qid'

   connection.beginTransaction(function(err){
       if(err){throw err;}
       connection.query(question_info_query,function(error,results,fields){
           if(error) {
               return connection.rollback(function(error) {
                 throw error;
               });
             }
           results.map(function(result){
               return result.tags=result.tags.split(",");
           })
           connection.query(ans_count,function(error,count,field){
               if(error) {
                   return connection.rollback(function(error) {
                       throw error;
                   });
               }
               let merged = results.map(t1 => ({...t1, ...count.find(t2 => t2.qid === t1.qid)}))

               connection.commit(function(err) {
                   if (err) {
                     return connection.rollback(function() {
                       throw err;
                     });
                   }
                   let filteredResult=merged.filter(function(result){
                    return result.tags.includes(tag_name);
                })
                server.send(filteredResult);
                 });
           })
       });
   })
}
exports.addQuestion=function(connection,title,text,asked_by,tag_list){
    let add_question = 
    'insert into question set ?';

    let e = {
        title:title,
        text:text,
        asked_by:asked_by
    };

    let add_tag = 'insert into tag set name=?';

    let add_qt = 'insert into qt set ?';

    connection.beginTransaction(function(err){
        if(err){throw err;}

        connection.query(add_question,e,function(error,result,field){
            if(error){
                return connection.rollback(function(err){
                    throw err;
                });
            }
            var qstnid=result.insertId;
        
            connection.commit(function(err){
                if(err){
                    return connection.rollback(function(){
                        throw err;
                    })
                }
                console.log('question saved');
                //add tag to tag table
                tag_list.forEach(function(tag){
                    connection.query(add_tag,tag,function(error,result,field){
                    if(error){
                        return connection.rollback(function(err){
                            throw err;
                        })
                    }
                    let tagid=result.insertId;
                    connection.commit(function(err){
                        if(err){
                            return connection.rollback(function(){
                                throw err;
                            })
                        }
                        let qt={
                            qstnid:qstnid,
                            tagid:tagid
                        }
                        connection.query(add_qt,qt,function(error,result,field){
                            if(error){
                                return connection.rollback(function(err){
                                   throw err;
                                })
                            }
                            connection.commit(function(err){
                                if(err){
                                    return connection.rollback(function(){
                                        throw err;
                                    })
                                }
                            })
                        })

                    })
                })

                //take result.insertid as qid

                //add to qt (qid,tid)
            })
        });
    })      
})
}

