exports.insert = function(conn, callback, name) {
  let t = {
    name: name
  };
  conn.query('insert into tag set ?', t, function(error, results, fields) {
    callback(error, results);
  })
}
