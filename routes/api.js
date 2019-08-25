/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const ThreadHandler = require('../controllers/threadHandler.js');
const ReplyHandler = require('../controllers/replyHandler.js');

module.exports = function (app) {
  
  let threadHandler = new ThreadHandler();
  let replyHandler = new ReplyHandler();
  
  app.route('/api/threads/:board')
    .post(threadHandler.newThread)
    .get(threadHandler.threadList)
    .put(threadHandler.reportThread)
    .delete(threadHandler.deleteThread);
    
  app.route('/api/replies/:board')
    .post(replyHandler.newReply)
    .get(replyHandler.replyList)
    .put(replyHandler.reportReply)
    .delete(replyHandler.deleteReply);

};