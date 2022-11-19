// Answer-related queries
exports.addAnswer=function(connection,qid,ans_by,text,server){
    const add_to_answer='insert ignore into answer set?';

    let ans={
        ans_by:ans_by,
        text:text,
    }

    const add_to_qa='insert into qa set?';

    connection.beginTransaction(function(err){
        if(err){throw err;}

        connection.query(add_to_answer,[ans],function(err,result,field){
            if(err){
                return connection.rollback(function(err){
                    throw err;
                })
            }
            var qa={
                qstnid:qid,
                ansid:result.insertId
            }

            connection.query(add_to_qa,[qa],function(err,result,field){
                if(err){
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
                    console.log('ans saved!');
                    server.send('ans saved!');
                })
            })
        })
    })
}