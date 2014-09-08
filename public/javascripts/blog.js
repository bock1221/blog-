/**
 * @author steve bock
 */
var socket = io('http://localhost');
$(function() {

    var createCommentsButton = function(c, d) {
        var commentsDiv = d.find("div.commentsDiv");
        $.each(c, function(index, eachComment) {
            commentsDiv.append('<div class = "comment">' + eachComment + '</div>');
        });
        commentsDiv.hide();
        var clicked1, veiwCommentsButton = $('<a href="#"class=" viewComments"style="margin-left: 15px">Veiw Comments</a>');

        veiwCommentsButton.click(function() {
            if (clicked1) {
                commentsDiv.hide();
                clicked1 = false;
                return;
            }
            clicked1 = true;
            commentsDiv.show();
        });
        d.find("div.buttonsDiv").append(veiwCommentsButton);
    };

    socket.on("comment", function(data) {
        $("#" + data._id).append('<div class = "comment">' + data.comment + '</div>');
    });

    socket.on('message', function(data) {
        console.log(data);

        $.each(data, function(index, item) {
            var date = item.StringDate, commentsClicked, clicked, commentsButton = false, newVeiwButton, veiwComments, commentsArray = [], hidden, oldAtribute, div = $('<div class ="fullPost"><article ><h2>' + item.heading + '</h2><div class="article-info">Posted on <time datetime="2013-05-14">'
                    + item.stringDate + ',2014</time> by <a href="#" rel="author">' + item.name + '</a></div><p class ="post">' + item.my + '</p></article> <div class ="buttonsDiv"><a href="#"class="button" id ="comments" >Comments</a></div><div class ="commentsForm"></div><div  id ="' + item._id + '"class = "commentsDiv""></div></div>');
            if (item.comments) {
                commentsButton = true;
                commentsArray = item.comments;
                createCommentsButton(commentsArray, div);

            }

            $("#content").prepend(div);
            p = div.find("p");
            p.wrapInner('<div />');
            // wrap inner contents
            hidden = p.height() < p.children('div').height();
            p.children('div').replaceWith(p.children('div').html());
            //unwrap
            if (hidden) {
                div.find("div.buttonsDiv").append('<a href="#a"class="button more"style="margin-left: 15px">Read More</a>');
            }
            oldAtribute = false;

            $(".more").click(function() {
                var atribute = oldAtribute ? 55 : "auto";
                oldAtribute = oldAtribute ? false : true;
                div.find("p").css("height", atribute);
            });

            $("#comments").click(function() {
                if (commentsClicked) {
                    div.find(".body").remove();
                    commentsClicked = false;
                    return;
                }
                commentsClicked = true;
                div.append('<div  class="width body"<p>&nbsp;</p> <fieldset><legend>Please submit your comment</legend><form ><p><label for="name">Name:</label><input name="name" class="name" value="" type="text" /></</p><p><label for="commentArea">Comment:</label><textarea cols="80" rows="11" name="message" class="commentArea"></textarea></p><p><input  style="margin-left: 150px;" class="send" type="button" value ="send"  ></p></form></fieldset><div class="clear"></div></div>');

                $(".send").click(function() {
                    var singleComment = div.find("textArea.commentArea").val();
                    commentsArray.push(div.find("textArea.commentArea").val());
                    socket.emit("comment", {
                        singleComment: singleComment,
                        _id: item._id,
                        sender: div.find("input.name").val(),
                        comment: commentsArray
                    });
                    div.find(".body").remove();
                    if (commentsButton) {
                        div.find("div.commentsDiv").append('<div class = "comment">' + singleComment + '</div>');
                    } else {
                        commentsArray.push(div.find("textArea.commentArea").val());
                        commentsButton = true;
                        createCommentsButton(commentsArray, div);

                    }

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
                my: $("#message").val(),
                heading: $("#heading").val(),
                name: $('#name').val(),
                stringDate: date.toUTCString,
                timeStamp: date
            });
        });
    });
});
