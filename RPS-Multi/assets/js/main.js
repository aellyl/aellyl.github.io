  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBPuLfU8aO5FJI9OobmOKANNvNwe9Y5ChM",
    authDomain: "rps-multi-6f07a.firebaseapp.com",
    databaseURL: "https://rps-multi-6f07a.firebaseio.com",
    projectId: "rps-multi-6f07a",
    storageBucket: "rps-multi-6f07a.appspot.com",
    messagingSenderId: "442777488712"
  };
  firebase.initializeApp(config);

//set databse obj
var database = firebase.database();
var playersRef= database.ref("/players");
var chatRef=database.ref("/chats");

var player1=null;
var player2=null;
var chatkey;
var msgCnt=0;
var turn=1; //turn indicator on who's turn is it
var round=0;
var thisPlayer="";

function displayGamePlay()
{
	//set the html for rps game play
	$("#gamePlay").html("<div class=\"row\"><!--common game play area--><div id=\"roundResult\" class=\"col-md-9 col-md-offset-2\"></div></div><div class=\"row\"><div id=\"player1\" class=\"col-md-4 col-md-offset-2 yourturn\"><h4>"+player1.name +"</h4><div class=\"row\"><div class=\"col-md-5\"><!--score--><div class=\"panel panel-default\"><div class=\"panel-heading\">Score</div><div class=\"panel-body\"><p>Win<span class=\"badge\">"+player1.win+"</span></p><p>Loss<span class=\"badge\">"+player1.loss+"</span></p><p>Tied<span class=\"badge\">"+player1.tie+"</span></p></div></div></div><div class=\"col-md-7\"><button type=\"button\" class=\"btn btn-default choiceOpt\">Rock</button><button type=\"button\" class=\"btn btn-default choiceOpt\">Paper</button><button type=\"button\" class=\"btn btn-default choiceOpt\">Scissors</button></div></div></div><div id=\"player2\" class=\"col-md-4 col-md-offset-1 noturn\"><h4>"+player2.name+"</h4><div class=\"row\"><div class=\"col-md-5\"><!--score--><div class=\"panel panel-default\"><div class=\"panel-heading\">Score</div><div class=\"panel-body\"><p>Win<span class=\"badge\">"+player2.win+"</span></p><p>Loss<span class=\"badge\">"+player2.loss+"</span></p><p>Tied<span class=\"badge\">"+player2.tie+"</span></p></div></div></div><div class=\"col-md-7\"><button type=\"button\" class=\"btn btn-default choiceOpt\">Rock</button><button type=\"button\" class=\"btn btn-default choiceOpt\">Paper</button><button type=\"button\" class=\"btn btn-default choiceOpt\">Scissors</button></div></div></div></div><!--close row-->");

};

playersRef.on("value", function(snapshot) {
	if (snapshot.child("1").exists())
	{
		//player1 exist
		player1=snapshot.child("1").val();

	}else
	{
		player1=null;
	}

	if (snapshot.child("2").exists())
	{
		//player1 exist
		player2=snapshot.child("2").val();


	}else{
		player2=null;
	}


	if(player1 && player2)
	{
		if (round ===0)
		{
			database.ref("/instruction").set("Game started");
		}else
		{
			database.ref("/instruction").set(player1.name+" and "+ player2.name+" are in play.")
		}
		displayGamePlay();
	}

	if(!player1 && !player2)
	{
		chatRef.remove();
		database.ref("/turn").remove();
		database.ref("/result").remove()

		$("#gamePlay").empty();
		$("#chat-display").empty();
		database.ref("/instruction").set("Please Enter your name to play the game.");
	}

	if((player1 && !player2)||(!player1 && player2))
	{
		
		database.ref("/instruction").set("There is one player in the game. Waiting for another player");
		$("#gamePlay").empty();
	}

});

playersRef.on("child_added", function(snapshot) {
	//put in chat message that a player has enter the game
		if(snapshot.val().name)
		{
			$("#chat-display").append("<div>"+snapshot.val().name + " is in the game</div>");
		}


});
playersRef.on("child_removed", function(snapshot) {
	//put in chat message that a player has enter the game

		$("#chat-display").append(snapshot.val().name + " has left the game<br>");

		chatRef.child(chatkey).remove();
		
});

// playersRef.on("child_removed",)
database.ref("/chats").on("child_added", function(snapshot){
	
			var chatname=snapshot.child("name").val();
			var chatmsg=snapshot.child("msg").val();
			if(chatmsg)
			{
				var entry=$("<div>").html(chatname+": "+chatmsg);
				$("#chat-display").append(entry);
			}



});

database.ref("/turn").on("value",function(snapshot){
	turn=snapshot.val();
	if(turn===1)
	{
		$("#player1").removeClass("noturn");
		$("#player1").addClass("yourturn");
		$("#player2").removeClass("yourturn");
	}else{
		$("#player2").removeClass("noturn");
		$("#player2").addClass("yourturn");
		$("#player1").removeClass("yourturn");
	}

});

database.ref("/result").on("value", function(snapshot){
	round=snapshot.child("round").val();
	if(round > 0)
	{
		$("#roundResult").html("<h1>Round: "+round+"</h1><p class=\"lead\">"+snapshot.child("result").val()+"</p>");
	}

});

database.ref("/instruction").on("value",function(snapshot){
	$("#instruction").html(snapshot.val());
});

//button section
$("#addPlayer").click(function(){
	event.preventDefault();

	var playerName=$("#name-input").val().trim();

	//check if both player exists
	if( !(player1 && player2))
	{
		//if there is no player one
		if (player1 === null)
		{
			//initialize player1 object
			player1 = {
				name: playerName,
				win: 0,
				loss: 0,
				tie: 0,
				choice: ""
			};
			playersRef.child(1).set(player1);
			// chatkey=chatRef.push().key;
			// chatRef.child(chatkey).set({name:playerName});
			thisPlayer=playerName; //store the player to the player's screen
			//set the turn indicator to 1
			database.ref().child("/turn").set(1);
			database.ref("/result").child("/round").set(0);
			
			database.ref("/players/1").onDisconnect().remove();

		}//if there is no player one
		else if (player2 === null)
		{
			//initialize player1 object
			player2 = {
				name: playerName,
				win: 0,
				loss: 0,
				tie: 0,
				choice: ""
			};
			playersRef.child(2).set(player2);
			database.ref("/result").child("/round").set(0);
			// chatkey=chatRef.push().key;
			// chatRef.child(chatkey).set({name:playerName});
			thisPlayer=playerName;
			database.ref("/players/2").onDisconnect().remove();

		}
	}


});

$("#msgSend").click(function(){
	event.preventDefault();

	var msg=$("#chat-input").val().trim();
	chatkey=chatRef.push().key;
	chatRef.child(chatkey).set({name:thisPlayer,msg:msg});
	$("#chat-input").val("");

});

$("body #gamePlay").on("click", "#player1 .choiceOpt", function(event){
	event.preventDefault();
	if(player1)
	{
		if(turn===1 && thisPlayer===player1.name){
			var choice=$(this).text().trim();

			playersRef.child("/1/choice").set(choice);

			database.ref().child("/turn").set(2);
		}else if(turn===1&&thisPlayer!==player1.name)
		{
			database.ref("/instruction").set("It's "+ player1.name+"'s turn");
		}else{
			database.ref("/instruction").set("It's "+ player2.name+"'s turn");
		}
	}


});

$("body #gamePlay").on("click", "#player2 .choiceOpt", function(event){
	event.preventDefault();

	if(player2)
	{
		if(turn===2 && thisPlayer===player2.name){
			var choice=$(this).text().trim();

			playersRef.child("/2/choice").set(choice);

			//check for who wins
			rpsChecks();
		}else if(turn===2&&thisPlayer!==player2.name)
		{
			database.ref("/instruction").set("It's "+ player2.name+"'s turn");
		}else
		{
			database.ref("/instruction").set("It's "+ player1.name+"'s turn");
		}
	}


});

function rpsChecks(){

	round++;
    if(player1.choice === player2.choice)
    {
     
      player1.tie++;
      playersRef.child("/1/tie").set(player1.tie);
      player2.tie++;
      playersRef.child("/2/tie").set(player2.tie);
      database.ref("/result").set({round:round, result:"It's a Tie!"});

    }else if(player1.choice === "Rock" && player2.choice === "Paper"){
      player1.loss++;
      playersRef.child("/1/loss").set(player1.loss);
      player2.win++;
      playersRef.child("/2/win").set(player2.win);
      database.ref("/result").set({round:round, result:"Winner is "+player2.name});

    }else if(player1.choice === "Scissors" && player2.choice === "Rock"){
      player1.loss++;
      playersRef.child("/1/loss").set(player1.loss);
      player2.win++;
      playersRef.child("/2/win").set(player2.win);
      database.ref("/result").set({round:round, result:"Winner is "+player2.name});

    }else if(player1.choice === "Paper" && player2.choice ==="Scissors"){
      player1.loss++;
      playersRef.child("/1/loss").set(player1.loss);
      player2.win++;
      playersRef.child("/2/win").set(player2.win);
      database.ref("/result").set({round:round, result:"Winner is "+player2.name});

    }else{
      player1.win++;
      playersRef.child("/1/win").set(player1.win);
      player2.loss++;
      playersRef.child("/2/loss").set(player2.loss);
      database.ref("/result").set({round:round, result:"Winner is "+player1.name});
    }

    database.ref().child("/turn").set(1);
}

