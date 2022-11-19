exports.insert = function(conn, callback, text, ans_by, ans_date_time) {
  let a = {
    text: text,
    ans_by: ans_by
  };
  if(ans_date_time) a.ans_date_time = ans_date_time;
  conn.query('insert into answer set ?', a, function(error, results, fields) {
    callback(error, results);
  })
}
