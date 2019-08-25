const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const DB = process.env.DB;



function ThreadHandler() {
  
  this.newThread = (req, res) => {
    let board = req.params.board;
    let thread = {
      text: req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    }; 
    mongo.connect(DB, (err, data) => { 
      let collection = data.collection(board);
      collection.insert(thread, () => {
      res.redirect(`/b/${board}/`)
      })
    })
  }
  
  this.threadList = (req, res) => {
    let board = req.params.board;
    mongo.connect(DB, (err, data) => {
      let collection = data.collection(board);
      collection.find({}, {reported:0, delete_password:0, 'replies.delete_password':0, 'replies.reported':0}).sort({bumped_on:-1}).limit(10).toArray((err, data) => {
        data.forEach((datum) => {
          datum.replycount = datum.replies.length;
          datum.replies.length > 3 ? datum.replies = datum.replies.slice(-3) : null;
        })
        res.json(data)
      })
    })
  }
  
  this.reportThread = (req, res) => {
    let board = req.params.board;
    mongo.connect(DB, (err, data) => {
      let collection = data.collection(board);
      collection.findAndModify(
        {_id: new ObjectId(req.body.report_id)},
        [],
        {$set: { reported : true }},
        (err, data) => {}
      )
    })
    res.send('reported')
  }
  
  this.deleteThread = (req, res) => {
    let board = req.params.board;
    mongo.connect(DB, (err, data) => {
      let collection = data.collection(board);
      collection.findAndModify({_id: new ObjectId(req.body.thread_id), delete_password: req.body.delete_password}, [], {}, {remove: true, new: false}, (err, data) => {
        data.value === null ? res.send('incorrect password') : res.send('success')
      })
    })
  }
  
}

module.exports = ThreadHandler;