
// Tag related queries
exports.get_all_tags = function(connection,server){
    const tag_count_query = 
    'select tid,name,count(name) as count\
    from tag inner join qt on tid=tagid group by name;'

    connection.query(tag_count_query,function(error,results,fields){
        server.send(results);
    })
}
