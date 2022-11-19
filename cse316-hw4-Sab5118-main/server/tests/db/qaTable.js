exports.insert = function(conn, callback, qid, aid) {
  let qa = {
    qstnId: qid,
    ansId: aid
  };
  conn.query('insert into qa set ?', qa, function(error, results, fields) {
    callback(error, results);
  })
}
