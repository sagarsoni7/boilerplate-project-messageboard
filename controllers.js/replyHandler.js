const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const DB = process.env.DB;

function ReplyHandler() {
  
  this.newReply = (req, res) => {
    let board = req.params.board;
    let reply = {
      _id: new ObjectId(),
      text: req.body.text,
      created_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password
    };
    mongo.connect(DB, (err, data) => {
      let collection = data.collection(board);
      collection.findAndModify({_id: new ObjectId(req.body.thread_id)}, [], {$set: {bumped_on: new Date()}, $push: { replies : reply }}, (err, data) => {})
    })
    res.redirect(`/b/${board}/${req.body.thread_id}`)
  }
  
  this.replyList = (req, res) => {
    let board = req.params.board;
    mongo.connect(DB, (err, data) => {
      let collection = data.collection(board);
      collection.find({_id: new ObjectId(req.query.thread_id)}, {reported: 0, delete_password: 0 ,'replies.delete_password': 0, 'replies.reported': 0}).toArray((err, data) => {
        res.json(data[0])
      })
    })
  }
  
  this.reportReply = (req, res) => {
    let board = req.params.board;
    mongo.connect(DB, (err, data) => {
      let collection = data.collection(board);
      collection.findAndModify({_id: new ObjectId(req.body.thread_id), 'replies._id': new ObjectId(req.body.reply_id)}, [], {$set: {'replies.$.reported': true}}, (err, data) => {})
    })
    res.send('reported')
  }
  
  this.deleteReply = (req, res) => {
    let board = req.params.board;
    mongo.connect(DB, (err, data) => {
      let collection = data.collection(board);
      collection.findAndModify({_id: new ObjectId(req.body.thread_id), replies: {$elemMatch: {_id: new ObjectId(req.body.reply_id), delete_password: req.body.delete_password}}}, [], {$set: {'replies.$.text': '[deleted]'}}, (err, data) => {
        data.value === null ? res.send('incorrect password') : res.send('success')
      })
    })
  }

}



module.exports = ReplyHandler;