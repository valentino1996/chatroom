var express = require("express");
var socket_io = require("socket.io");
var http = require("http");

var app = express();
app.use(express.static("public"));

var server = http.Server(app);
var io = socket_io(server);

var count = 0;
var arr=[];
var arrs=[];

io.on("connection", function (socket){
	io.emit("connect");
	count++;
	io.emit("count", count);
	console.log(count);
	console.log("Client connected");
	
	socket.on("message", function(message, username){
		console.log("Received message: ", message);
		var msg = username + ": " + message;
		socket.broadcast.emit("message", msg);
		msg= "you: " + message;
		socket.emit("message", msg );
	});
	
	socket.on("disconnect", function(){
		count--;
		io.emit("count", count);
		console.log(count);
		console.log("Client disconneted");
		arr=[];
		io.emit("disconnected");
	});
	
	socket.on("offlineUser", function(user){
		arr.push(" "+user);
		console.log(arr);
		io.emit("checkUsers", arr);
	});
	
	socket.on("onlineUsers", function(user){
		arrs.push(user);
		console.log(arrs);
	});
	
	socket.on("button", function(username, message){
		socket.broadcast.emit("private", username, message);
	});
	
	socket.on("username", function(username){
		console.log(username);
		arr.push(" "+username);
		io.emit("users", arr);
	});
	
	socket.on("typing", function(username){
		socket.broadcast.emit("type", username);
	});
	
	socket.on("notTyping", function(){
		socket.broadcast.emit("notType");
	});
	
});
server.listen(process.env.PORT||8080);
