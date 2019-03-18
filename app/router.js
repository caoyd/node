module.exports = app => {

  require('./router/backend')(app);
  require('./router/frontend')(app);
  require('./router/manager')(app);
  require('./router/h5')(app);
  require('./router/iot')(app);

};
