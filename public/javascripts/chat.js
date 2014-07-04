/**
 * @author steve bock
 */
var socket = io('http://localhost');
$(function() {
	//var socket = io('http://localhost');
	socket.on('message', function(data) {
		console.log(data);
		$.each(data, function(index, item) {
		var	month = item.month+1;
			var div = $('<article><h2>'+item.heading+'</h2><div class="article-info">Posted on <time datetime="2013-05-14">'+month+','+item.day+',2014</time> by <a href="#" rel="author">'+item.name+'</a></div><p>' + item.my + '</p><a href="#"class="button">Read more</a><a href="#"class="button" style="margin-left: 15px">Comments</a></article>');
			$("#content").prepend(div);
		});

	});
	socket.on("sent", function(data) {
		console.log(data);
	});
	$(".formbutton").click(function() {
		if (!$("#message").val()) {
			return;

		}
		date =new Date();
		window.location.href = "index.html";
		socket.emit('sent', {
			my : $("#message").val(),
			heading : $("#heading").val(),
			name : $('#name').val(),
			day : date.getDay(),
			month : date.getMonth()
		});
	});
});
