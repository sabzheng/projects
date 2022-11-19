exports.insert = function(conn, callback, qid, tid) {
  let qt = {
    qstnId: qid,
    tagId: tid
  };
  conn.query('insert into qt set ?', qt, function(error, results, fields) {
    callback(error, results);
  })
}
