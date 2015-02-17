// YOUR CODE HERE:
var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';

var lastDate = 0;
var openRooms = {};
var currentRoom = null;

app.init = function(){
};

app.send = function(message){
  $.ajax({
    // always use this url
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
  var holder = '<div class="chatBox">'+ message.username + ' says: '+ message.text + ' : ' + message.roomname + '</div>';
  $('#chats').prepend(holder);
  //console.log(holder);
};

app.fetch = function(){
  $.ajax({
    // always use this url
    url: app.server,
    limit: 25,
    type: 'GET',
    data : {
      order : "-createdAt",
      //where : "createdAt:{'$gte':lastDate}"
    },
    success: function (data) {
      // console.log(data);
      app.update(data);
      console.log('chatterbox: Message received');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }
  });
};
setInterval(app.fetch, 1000);

app.clearMessages = function(){
  $('#chats').empty();
};

app.addMessage = function(message) {
   $.ajax({
    // always use this url
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {

      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
  var holder = '<div class="chatBox">'+ message.username + ' says: '+ message.text + ' : ' + message.roomname + '</div>';
  $('#chats').prepend(holder);
  //console.log(holder);
  app.send(message);
};

app.addRoom = function(roomname){
  $('#roomSelect').prepend('<div>' + roomname + '</div>');
};

app.update = function(data) {
  // console.log(data);
  for(var i = 10; i>=0; i--){
    var room = data.results[i].roomname;
    var message = data.results[i].text;
    var userName = data.results[i].username;
    if (data.results[i].createdAt > lastDate){
      if(room !== undefined && typeof room !== 'function'
      && message !== undefined && typeof message !== 'function'
      && userName !== undefined && typeof userName !== 'function') {
        message = message.replace(/<[^>]*>/g, "<nice try>");
        userName = userName.replace(/<[^>]*>/g, "<nice try>");
        // If chatroom = null
        if (currentRoom === null || currentRoom === room){
          var holder = '<div class="chatBox">' + userName + ' says: ' + message + ' : ' + room + '</div>';
          $('#chats').append(holder);
        }
      }
    }
  }
  lastDate = data.results[0].createdAt;
  //$('#chats').empty();
}
app.room =function(data) {
  
};
setInterval(app.room, 1000);
//submit
$(document).ready(function(){
  $('#submit').on('click', function(e) {
      var name = window.location.search.slice(10);
      var text = $("#message").val();
      var roomput = $("#roomput").val();
      var message = {
        'username': name,
        'text': text,
        'roomname': roomput
      };
      app.addMessage(message);
      $("#message, #roomput").val("");
      //console.log(message);
      e.preventDefault();
      //e.stopPropagation();
  });
});
