const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const http = require("http");
const socketIO = require("socket.io");
// const session = require('express-session')

const userModel = require("./app/api/models/user")
const messageModel = require("./app/api/models/message")

const aboutus = require("./routes/aboutus");
const assignment = require("./routes/assignment");
const assignmentStudent = require("./routes/assignmentStudent");
const auth = require('./routes/auth');
const blog = require("./routes/blog");
const campus = require("./routes/campus");
const comment = require("./routes/comment");
const commonSetting = require("./routes/commonSetting");
const coupon = require("./routes/coupon");
const event = require("./routes/event");
const exam = require("./routes/exam");
const examPool = require("./routes/examPool");
const helper = require("./routes/helper");
const iconBox = require("./routes/iconBox");
const level = require("./routes/level");
const newComment = require("./routes/newComment");
const newsLetter = require("./routes/newsLetter");
const notification = require("./routes/notification");
const part = require("./routes/part");
const partGroup = require("./routes/partGroup");
const price = require("./routes/price");
const program = require("./routes/program");
const programSetting = require("./routes/programSetting");
const question = require("./routes/question");
const replit = require("./routes/replit");
const slider = require("./routes/slider");
const studentBlock = require("./routes/studentBlock");
const studentPayment = require("./routes/studentPayment");
const subject = require("./routes/subject");
const testimonial = require("./routes/testimonial");
const user = require('./routes/user');
const payment = require('./routes/payment');
const company = require("./routes/company");
const file = require("./routes/file");
const feature = require("./routes/feature");
const group = require("./routes/group");
const videoGroup = require("./routes/videoGroup");
const message = require("./routes/message");
const mongoose = require('./config/database'); //database configuration
const { authenticate, authError } = require('./app/middleware');
const Config= require('./config/config');

const { port, secretKey } = Config;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.set('secretKey', secretKey); // jwt secret token
app.use(logger('dev'));
// Set body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({ origin: '*' }));
app.use(fileUpload());

app.get('/api', function(req, res){
  res.json({"status" : "Server Running ...."});
});
// public route
app.use("/api/aboutus", aboutus);
app.use("/api/assignment", assignment);
app.use("/api/assignmentStudent", assignmentStudent);
app.use('/api/auth', auth);
app.use("/api/blog", blog);
app.use("/api/campus", campus);
app.use("/api/comment", comment);
app.use("/api/commonSetting", commonSetting);
app.use("/api/coupon", coupon);
app.use("/api/event", event);
app.use("/api/exam", exam);
app.use("/api/examPool", examPool);
app.use("/api/helper", helper);
app.use("/api/iconBox", iconBox);
app.use("/api/level", level);
app.use("/api/newComment", newComment);
app.use("/api/newsLetter", newsLetter);
app.use("/api/notification", notification);
app.use("/api/part", part);
app.use("/api/partGroup", partGroup);
app.use("/api/price", price);
app.use("/api/program", program);
app.use("/api/programSetting", programSetting);
app.use("/api/question", question);
app.use("/api/replit", replit);
app.use("/api/slider", slider);
app.use("/api/studentBlock", studentBlock);
app.use("/api/studentPayment", studentPayment);
app.use("/api/subject", subject);
app.use("/api/testimonial", testimonial);
app.use("/api/company", company);
app.use("/api/file", file);
app.use("/api/feature", feature);
app.use("/api/group", group);
app.use("/api/videoGroup", videoGroup);
app.use("/api/message", message);
// private route
app.use('/api/user', [authenticate, authError], user);
app.use("/api/payment", [authenticate, authError], payment);
// handle errors
app.use(function(err, req, res, next) {
	console.log(err);
  if(err.status === 404)
  	res.status(404).json({message: "Not found"});
  else
    res.status(500).json({message: "Something looks wrong :( !!!"});
});

let connectedUsers = {};
io.on('connection', function(socket) {

  socket.on('disconnect', function() {
    var userData = connectedUsers[socket.id];
    if (typeof userData !== "undefined") {
      socket.leave(connectedUsers[socket.id]);
      delete connectedUsers[socket.id];
    }
  });
  socket.on('joinRoom', async function (req, callback) {
    var nameTaken = false;
    Object.keys(connectedUsers).forEach(function(socketId) {
      var userInfo = connectedUsers[socketId];
      if (userInfo.companyId === req.companyId && userInfo.assignmentId === req.assignmentId && userInfo.userId === req.userId) {
        nameTaken = true;
      }
    });

    if (nameTaken) {
      callback({
        available: true,
      });
    } else {
      let user = await userModel.findById(req.userId);
      connectedUsers[socket.id] = req;
      let roomName = `company${req.companyId}_assignment${req.assignmentId}`
      connectedUsers[socket.id].room = roomName
      socket.join(roomName);
      const current = new Date()
      socket.broadcast.to(roomName).emit("message", {
        description: `${user.firstName} has joined!`,
        isFile: false,
        from: req.userId,
        to: -1,
        createdAt: current,
      });
      messageModel.create({
        description: `${user.firstName} has joined!`,
        isFile: false,
        from: req.userId,
        to: -1,
        assignmentID: req.assignmentId,
        companyID: req.companyId,
        createdAt: current,
      });
      callback({
        available: true
      });
    }
  });

  socket.on('message', function (message) {
    const current = new Date()
    message.createdAt = current
    const room = connectedUsers[socket.id]?.room;
    console.log(room)
    io.to(room).emit('message', message);
    messageModel.create(message)
  });

});

server.listen(port, function(){
	console.log('server listening on port ',port);
});
