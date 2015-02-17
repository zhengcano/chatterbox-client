// YOUR CODE HERE:
$(function(){

  var lastDate = 0;
  var openRooms = {};
  var currentRoom = null;


  //Update chatterbox messages
  setInterval(function(){
    var scrollPosition = $('document').height();
    //console.log('hi');
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      limit: 25,
      data : {
        order : "-createdAt",
        //where : "createdAt:{'$gte':lastDate}"
      },
      success: function (data) {
        // console.log(data);
        for(var i = 20; i>=0; i--){
          var room = data.results[i].roomname;
          var message = data.results[i].text;
          var userName = data.results[i].username;
          if (data.results[i].createdAt > lastDate){
            if(room !== undefined && typeof room !== 'function'
            && message !== undefined && typeof message !== 'function'
            && userName !== undefined && typeof userName !== 'function') {
              message = message.replace(/<[^>]*>/g, "<nice try>");
              userName = userName.replace(/<[^>]*>/g, "<nice try>");
              if (!openRooms.hasOwnProperty(room)){
                room = room.replace(/<[^>]*>/g, "<nice try>");
                openRooms[room] = true;
                var $room = $('<div class="roomname" id="'+room+'">'+ '# '+room+'</div>');
                $('.rooms').append($room);
                $('.roomname').on("click", function(){
                  currentRoom = $(this).attr('id');
                  $('h1').text(currentRoom);
                  $('#roomput').fadeOut();
                  if (currentRoom === "lobby"){
                    currentRoom = null;
                    $('h1').text('Chatterbox');
                    $('#roomput').fadeIn();
                  }
                  $('.chatBox').remove();
                });
              }
              // If chatroom = null
              if (currentRoom === null || currentRoom === room){
                var $chatMessage = $('<div class="chatBox">'+userName + ' says: '+message+'</div>');
                $('.chat').append($chatMessage);
              }
            }
          }
        }
        lastDate = data.results[0].createdAt;
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
    // if ($(".chat").scrollTop() === scrollPosition){
    $(".chat").animate({ scrollTop: $(".chat").height() }, "slow");
    // }
  }, 1000);

  //Post to chatterbox
  $('#submit').click(function (e) {
    var name = location.search.slice(10);
    var text = $("#text").val();
    var roomput = $("#roomput").val();
    var message = {
      'username': name,
      'text': text,
      'roomname': roomput
    };

    $("#text, #roomput").val("");
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        //console.log('chatterbox: Message sent');
        //console.log(message);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
    //e.preventDefault();
    e.defaultPrevented();

  });

});
