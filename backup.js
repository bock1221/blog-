/**
 * @author steve bock
 */
var socket = io('http://localhost');
$(function() {
	function createCommentsButton() {
		veiwCommentsButton = $('<a href="#a"class=" viewComments"style="margin-left: 15px">Veiw Comments</a>').click((function() {
			if (clicked) {
				$(".commentsDiv").remove();
				clicked = false;
				return;
			}
			clicked = true;
			$.each(commentsArray, function(index, eachComment) {

				div.append('<div class = "commentsDiv">' + eachComment + '</div>');

			});
		}));
	}

	//var socket = io('http://localhost');

	socket.on('message', function(data) {
		console.log(data);

		$.each(data, function(index, item) {
			var date = item.StringDate, clicked, newVeiwButton, veiwCommentsButton, commentsButton, commentsArray = [], hidden, oldAtribute, div = $('<article><h2>' + item.heading + '</h2><div class="article-info">Posted on <time datetime="2013-05-14">' + item.stringDate + ',2014</time> by <a href="#" rel="author">' + item.name + '</a></div><p class ="post">' + item.my + '</div></p><a href="#a"class="button" id ="comments" >Comments</a></article>');
			if (item.comments) {
				commentsArray = item.comments;
				veiwCommentsButton = $('<a href="#a"class=" viewComments"style="margin-left: 15px">Veiw Comments</a>').click((function() {
					if (clicked) {
						$(".commentsDiv").remove();
						clicked = false;
						return;
					}
					clicked = true;
					$.each(commentsArray, function(index, eachComment) {

						div.append('<div class = "commentsDiv">' + eachComment + '</div>');

					});
				}));
				div.append(veiwCommentsButton);
			}

			$("#content").prepend(div);
			p = div.find("p");
			p.wrapInner('<div />');
			// wrap inner contents
			hidden = p.height() < p.children('div').height();
			p.children('div').replaceWith(p.children('div').html());
			//unwrap
			if (hidden) {
				div.append('<a href="#a"class="button more"style="margin-left: 15px">Read More</a>');
			}
			oldAtribute = false;

			$(".more").click(function() {
				var atribute = oldAtribute ? 55 : "auto";
				oldAtribute = oldAtribute ? false : true;
				div.find("p").css("height", atribute);
			});

			$("#comments").click(function() {
				div.append('<div  class="width body"<p>&nbsp;</p> <fieldset><legend>Please submit your comment</legend><form ><p><label for="name">Name:</label><input name="name" class="name" value="" type="text" /></</p><p><label for="commentArea">Comment:</label><textarea cols="80" rows="11" name="message" class="commentArea"></textarea></p><p><input  style="margin-left: 150px;" class="send" type="button" value ="send"  ></p></form></fieldset><div class="clear"></div></div>');

				$(".send").click(function() {
					commentsArray.push(div.find("textArea.commentArea").val());
					console.log("hi");
					console.log(div.find("input.name").val());
					console.log(div.find("textArea.commentArea").val());
					console.log(item._id);
					socket.emit("comment", {
						_id : item._id,
						sender : div.find("input.name").val(),
						comment : commentsArray
					});
					div.find(".body").remove();

					if (!commentsButton) {
						newVeiwButton = $('<a href="#a"class=" viewComments"style="margin-left: 15px">Veiw Comments</a>').click((function() {
							if (clicked) {
								$(".commentsDiv").remove();
								clicked = false;
								return;
							}
							clicked = true;
							$.each(commentsArray, function(index, eachComment) {

								div.append('<div class = "commentDiv">' + eachComment + '</div>');

							});
						}));
						commentsButton = true;
					}

					$(".veiwComments").click(function() {
						if (clicked) {
							$(".commentsDiv").remove();
							clicked = false;
							return;
						}
						$.each(commentsArray, function(index, eachComment) {
							div.append('<div class = "commentDiv">' + eachComment + '</div>');
							clicked = true;
						});
					});
				});
			});
		});

		socket.on("sent", function(data) {
			console.log(data);
		});

		$(".formbutton").click(function() {
			if (!$("#message").val()) {
				return;

			}
			var date = new Date();
			window.location.href = "index.html";
			socket.emit('sent', {
				my : $("#message").val(),
				heading : $("#heading").val(),
				name : $('#name').val(),
				stringDate : date.toUTCString,
				timeStamp : date
			});
		});
	});
});
