// HoneyChat - JS
var chat_counter = 0;


var appendHoneyChat = function(text){
    $("#chatlog")[0].value += text;
}

var clearHoneyChat = function(){
    $("#chatlog")[0].value = "";
}


var sendHoneyChat = function(handle, message){
    $.post( "tmp_unsafe_xmlpersistance.php", { func: "post_msg", name: handle, msg: message },  function() {
        $("#chatfield")[0].value = "";
        console.log("chatfield should be cleared");
    }).fail(function() {
        appendHoneyChat("error while posting chat!");
    })
    console.log("sendhoneychat out");
}

var receiveHoneyChat = function(last_msgid){
    $.post( "tmp_unsafe_xmlpersistance.php", { func: "poll_msg", counter: last_msgid },  function(data) {
        console.log(data);
        appendHoneyChat(data);
    }).fail(function() {
        appendHoneyChat("error while polling chat!");
    });
    console.log("receivehoneychat out");
}

var updateChatCount = function(){
    $.post("tmp_unsafe_xmlpersistance.php", {func:"init"}, function(data){
        chat_counter = parseInt(data);
        console.log("updated count : " + chat_counter);
    });
}

var poll_update = function(){
    var current_counter = chat_counter;
    updateChatCount();
    receiveHoneyChat(current_counter);
    
}

$( document ).ready(function() {
    $("#postbutton").click(function() {
        sendHoneyChat($("#nicknamefield")[0].value, $("#chatfield")[0].value);
        console.log("postbutton clicked");
    });
    setInterval(poll_update, 1000);
    console.log( "honeychat JS loaded" );
});