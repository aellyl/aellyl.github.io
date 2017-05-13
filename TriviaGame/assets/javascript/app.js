//$(document).ready(function() {

var trivaQTime;
var qCnt=0; //question count
var showNextQ;
var numQs=15;
//array of trivia questions
var questions= [
{question: "What is world's most popular color?",
 answer: "blue",
 options: ["Red","Blue","Yellow","Green"]
},

{question: "What is the first color that a baby can see?",
 answer: "red",
 options: ["Red","Blue","Yellow","Green"]
},

{question: "What is the best color to suppress anxiety and anger?",
 answer: "pink",
 options: ["Baby Blue","Yellow","Pink","Teal"]
},

{question: "Which car body color will reduce the chance of being in a car accident?",
 answer: "white",
 options: ["Black","Navy Blue","Red","White"]
},

{question: "Which color combination will most likely make you hungry?",
 answer: "yellow + red",
 options: ["White + Yellow","Green + Red","Blue + Yellow","Yellow + Red"]
},

{question: "What color will be soothing for chickens?",
 answer: "red",
 options: ["Yellow","Red","Black","Brown"]
},

{question: "Which color will attract mosquitoes the most?",
 answer: "blue",
 options: ["White","Green","Blue","Black"]
},

{question: "which color will most likely to cause nauseating feeling?",
 answer: "yellow",
 options: ["Black","Purple","Red","Yellow"]
},

{question: "What is the true color of the Sun?",
 answer: "white",
 options: ["Red","White","Yellow","Orange"]
},

{question: "Which color is to believe to increase concentration?",
 answer: "green",
 options: ["White","Brown","Green","Blue"]
},

{question: "What are primary colors?",
 answer: "red, yellow, blue",
 options: ["Purle, Orange, Green","Black, White, Brown","Teal, Mangenta, Maroon","Red, Yellow, Blue"]
},

{question: "In traditional chinese culture, which color of cloth is used in a funeral?",
 answer: "white",
 options: ["White","Black","Grey","Brown"]
},

{question: "Which color is most likely to associate with growth?",
 answer: "green",
 options: ["Blue","Green","Orange","Purple"]
},

{question: "Which color is most likely to assoicate with energy?",
 answer: "orange",
 options: ["Yellow","Red","White","Orange"]
},

{question: "There are two color systems: addtive and substractive, in which color system, you will create the color black when mixing all the colors together?",
 answer: "substractive color",
 options: ["Additive color","Substractive color"]
}
]//close question array

var timerId;
var timerCount=30;
var correctCnt=0;
var incorrectCnt=0;
var qNotAnswered=0;

//User input section
//start game when start button is clicked
$("#startBtn").click(startGame);
// $("#restartBtn").click(resetGame);
$("body").on("click", "#restartBtn", function(event){
	resetGame();
}); 

$("body").on("click",".ansOpt",function(e){
	var userAns=$(this).attr("data"); //get user's answer choice
	if(userAns === questions[qCnt].answer)
	{
		//display win screen
		correctCnt++;
		clearInterval(timerId);//stop timer
		winScreen(userAns);

	}
	else
	{
		//display loss screen
		incorrectCnt++;
		clearInterval(timerId);//stop timer
		wrongScreen(userAns);
	}


});



//Game function section
function displayQuestion(){

	
	$("#triviaQs").html("<h2>"+(qCnt+1) +". " + questions[qCnt].question+"</h2");
	$("#triviaQs").append("<p class=\"lead\">Time Remaining: " + "<span id=timer>" + timerCount +" seconds</span></p>");

	
	//display options
	for(var i=0;i< questions[qCnt].options.length;i++)
	{
		var currOption=questions[qCnt].options[i];
		var ansOpt=$("<button>");
		ansOpt.addClass("ansOpt btn btn-primary btn-lg btn-block");
		ansOpt.attr("data",currOption.toLowerCase());
		ansOpt.html(currOption);
		$("#triviaQs").append(ansOpt);
	}

}

function nextQuestion(){
	
	if(qCnt < questions.length)
	{
		timer(); //start the quiz timer
		displayQuestion();
	}
	else
	{
		endGame();
	}


}

var timeoutGreenting=["Time is out!","Out of Time.","Think fast, next time.","Time's up!"]
var timeoutGifs=["notfair.gif","outoftime.gif","timesup.gif","timesup2.gif"];

function timeoutScreen(){
	//display the correct answer
	var randIndex= Math.floor(Math.random() * timeoutGreenting.length);
	$("#triviaQs").html("<h2>"+timeoutGreenting[randIndex]+"</h2>");
	$("#triviaQs").append("<p class=\"lead\">You didn't choose an answer before the time is up.<br>The correct answer is: <u>" + questions[qCnt].answer+"</u></p>");
	// randIndex= Math.floor(Math.random() * timeoutGifs.length);
	$("#triviaQs").append("<img src=./assets/images/" + timeoutGifs[randIndex]+">");

	qNotAnswered++;
	//prep for next question
	prepForNextQuestion();
}

function prepForNextQuestion(){
	//prep for next question
	setTimeout(nextQuestion,5000);// wait 5 second to diplay next question
	qCnt++;//go to next question counter
	timerCount=30;//reset the timer
}

var winGreenting=["Yes!","Correct!!","You are right.","Hooray"]
var winGifs=["brilliant.gif","right.gif","pokemonHooray.gif","minionHooray.gif"];

function winScreen(userAnswer)
{
	var randIndex= Math.floor(Math.random() * winGreenting.length);
	$("#triviaQs").html("<h2>"+winGreenting[randIndex]+"</h2>");
	$("#triviaQs").append("<p class=\"lead\">Your answer is " + userAnswer+ " and it is correct.</p>");
	// randIndex= Math.floor(Math.random() * winGifs.length);
	$("#triviaQs").append("<img src=./assets/images/" + winGifs[randIndex]+">");

	//prep for next question
	prepForNextQuestion();
}
 var wrongGreeting=["Wrong!!","Nope","Incorrect","Try Again"]
 var wrongGifs=["catwrong.gif","nono.gif","wrong.gif","think.gif"];
function wrongScreen(userAnswer)
{
	var randIndex= Math.floor(Math.random() * wrongGreeting.length);
	$("#triviaQs").html("<h2>"+wrongGreeting[randIndex]+"</h2>");
	$("#triviaQs").append("<p class=\"lead\">Your picked: "+userAnswer + "<br>The correct answer is: <u>" + questions[qCnt].answer+"</u></p>");
	// randIndex= Math.floor(Math.random() * wrongGifs.length);
	$("#triviaQs").append("<img src=./assets/images/" + wrongGifs[randIndex]+">");

	//prep for next question
	prepForNextQuestion();
}

function startGame() {

  // showNextQ=setInterval(nextQuestion, 30000);
  nextQuestion();
  // $("#triviaQs").html("<img src=./assets/images/loading.gif height=85%>")

}

function endGame()
{

	$("#triviaQs").html("<h2>That's all! Here is how you did</h2><ul class=\"list-group\"><li class=\"list-group-item\"><span class=\"badge\">"+correctCnt+"</span>Corret Answers </li><li class=\"list-group-item\"><span class=\"badge\">"+incorrectCnt+"</span>Wrong Answers </li><li class=\"list-group-item\"><span class=\"badge\">"+qNotAnswered+"</span>Missed Questions</li></ul>");
	//add done image
	$("#triviaQs").append("<img src=./assets/images/done.gif>");


	//add restart button
	$("#triviaQs").append("<button type=\"button\" class=\"btn btn-primary btn-lg btn-block\" id=\"restartBtn\">Restart</button>");
}
function randomOrder() {
 return (Math.round(Math.random())-0.5);
};

function resetGame()
{
	qCnt=0;
	correctCnt=0;
	incorrectCnt=0;
	qNotAnswered=0;
	timerCount=30; //timer counter number
	questions.sort(randomOrder);//reduce the chance to get the same character

	startGame();

}

function timer(){
	timerId = setInterval(timerCounter, 1000);
	function timerCounter() {
		if (timerCount === 0) {
			clearInterval(timerId);
			//display lose screen due to time out
			timeoutScreen();
		}
		if (timerCount > 0) {
			timerCount--;
		}
		$("#timer").html(timerCount+" seconds");
	}
}

//});//close document ready