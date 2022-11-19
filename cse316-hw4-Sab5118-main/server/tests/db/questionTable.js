exports.insert = function(conn, callback, title, text, asked_by, ask_date_time, views) {
  let q = {
    title: title,
    text: text,
    asked_by: asked_by
  };
  if(ask_date_time) q.ask_date_time = ask_date_time;
  if(views) q.views = views;
  conn.query('insert into question set ?', q, function(error, results, fields) {
    callback(error, results);
  })
}
