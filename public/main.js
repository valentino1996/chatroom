$(document).ready(function() {
	 var socket = io();
    var input = $('#input');
    var messages = $('#messages');
	var username;
	var count;
	var displayText;
	var array=[];

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };
	
	socket.on("connect", function(){
		username = "User" + Math.floor(Math.random()*100+1);
		$("h1").html("Hi "+username);
		socket.emit("username", username);
	});
	
	socket.on("users", function(arr){
		array=arr;
		$("h3").html(arr);
	});
	
	socket.on("message", addMessage);
	
	socket.on("count", function(counts) {
		count=counts;
		$("p").html(count + " Clients online");
	});
		
	socket.on("disconnected", function(){
		console.log("Disconnected!!!!");
		socket.emit("offlineUser", username);
	});
	
	socket.on("checkUsers", function(arr){
		$("h3").html(arr);
	});
	
	socket.on("type", function(user){
		$("p").html(user + " is typing...");
	});
	
	socket.on("notType", function(){
		$("p").html(count + " Clients online");
	});
		
    input.on('keydown', function(event) {
		
        if (event.keyCode != 13) {
			socket.emit("typing", username);
            return;
			if(event.keyCode == 8){
				socket.emit("notTyping", username);
			}
        }
		socket.emit("notTyping");
		$("p").html(count + " Clients online ");
        var message = input.val();
		socket.emit("message", message, username);
        input.val('');
    });
	
	$("button").on("click", function(){
		socket.emit("button", $("#username").val(), $("#message").val());
		var a = $("#username").val();
		console.log(a);
	});
	
	socket.on("private", function(user, msg){
		if(user==username){
			messages.append('<div>' + "(private) " + user + ": " + msg + '</div>');
		}
	});
	
});