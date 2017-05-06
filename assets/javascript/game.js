$(document).ready(function() {

//define game character object
var character={
	name:"",
	baseAttPower:0,
	attackPower:0,
	healthPoint:0,
	counterAttack:0,
	aliveFlag:true,
	charaPhoto:"",
	init: function(name,photoUrl)
	{
		this.name = name;
		this.baseAttPower = Math.floor(Math.random() * 10)+5;
		this.attackPower = this.baseAttPower;
		this.healthPoint = Math.floor(Math.random() * 250)+100;
		this.counterAttack = Math.floor(Math.random() * 15)+6;
		this.charaPhoto = photoUrl;
	},
	attack: function(opp)
	{
		opp.healthPoint -= this.attackPower;
		this.healthPoint -= opp.counterAttack;
	},
	increaseAttackPower: function(attachNum)
	{
		this.attackPower= this.baseAttPower * attachNum;
	}

}

 var charaArray= ["doctor","daleks","cybermen","master","silence","angels","rose","martha","donna","river"];
 var charaInPlay=[];
 var gameStatus="start";
 var player,enemy;
 var playerChosen=false;
 var enemyChosen=false;

function displayCharacter(obj,loc)
{
	//overall div
	var display=$("<button>");
	display.addClass("characDisplay");

	//define character info row
	var characInfo=$("<div>");
	characInfo.addClass("row");

	var characName=$("<div>");
	characName.addClass("col-md-8");
	characName.html(obj.name.toUpperCase());
	display.attr("character",obj.name);

	var characHP=$("<div>");
	characHP.addClass("col-md-4");
	if (loc==="yourPlayer")
	{
		characHP.attr("id","playerHP");
	}
	if(loc ==="enemy")
	{
		characHP.attr("id","enemyHP");
	}
	characHP.html(obj.healthPoint);

	// add two columns to character info row
	characInfo.append(characName);
	characInfo.append(characHP);

	//define character photo row
	var characPhoto=$("<div>");
	characPhoto.addClass("row");

	var characPhotoCol=$("<div>");
	characPhotoCol.addClass("col-md-12");
	characPhotoCol.html("<img src="+obj.charaPhoto+" height=200px>");
	//add phot column to character photo row
	characPhoto.append(characPhotoCol);

	//add two rows to display div
	display.append(characInfo);
	display.append(characPhoto);

	return display;

};

function randomOrder() {
 return (Math.round(Math.random())-0.5);
};

function chosenCharacter(name,loc)
{
		//get the name of character that is being clicked
		
		var currIndex;
		//get the index of the chosen character
		for(var i=0; i< charaInPlay.length; i++)
		{	
			if(name===charaInPlay[i].name)
			{
				currIndex=i;
			}
		}

		if(loc==="yourPlayer")
		{
			player=charaInPlay[currIndex];
		}
		else
		{
			enemy=charaInPlay[currIndex];
		}
		//remove the display block from displayCharacters div
		$(".characDisplay").remove(":contains(\'"+name.toUpperCase()+"\')");
		//append to yourPlayer's div
		var temp=displayCharacter(charaInPlay[currIndex],loc);
		return temp;
}

var alreadyInPlay=[];

 
//define characters
//get numbr of characters will generate in the game
var numCharacter = Math.floor(Math.random() * 4)+3;
for(var i =0; i < numCharacter;i++)
{
	var usedFlag=false;
	var currCharacter = Object.create(character);
	// charaArray.sort(randomOrder);//reduce the chance to get the same character
	var randIndex= Math.floor(Math.random() * charaArray.length);

	var name= charaArray[randIndex];

	if (alreadyInPlay.length > 0)
	{
		
		//search if this name is already in play
		for(var j=0; j<alreadyInPlay.length;j++)
		{	//found alreay use
			if(alreadyInPlay[j]===name)
			{
				usedFlag=true;
			}
		}

		if(usedFlag)
		{
			i--;
		}
		else
		{
			currCharacter.init(name,"./assets/images/"+name+".png");
			charaInPlay.push(currCharacter);
			alreadyInPlay.push(name);
		}

		
	}
	else
	{
		currCharacter.init(name,"./assets/images/"+name+".png");
		charaInPlay.push(currCharacter);
		alreadyInPlay.push(name);
	}
	

}

//display all the characters
for(var i=0;i< charaInPlay.length;i++)
{

	var displayCurr=displayCharacter(charaInPlay[i]);
	$("#displayCharacters").append(displayCurr);

}

//user choose a character
$(".characDisplay").on("click", function() {
	if (gameStatus==="start")
	{
		if(playerChosen) //chosoe a enemy
		{
			
			var currName= $(this).attr("character");
			if(!enemyChosen)
			{
				$("#enemy").append(chosenCharacter(currName,"enemy"));
			}
			enemyChosen=true;

		}
		else//choose a player
		{
			playerChosen=true;
			var currName= $(this).attr("character");
			$("#yourPlayer").append(chosenCharacter(currName,"yourPlayer"));
			numCharacter--;
			$("#instruction").html("Please Pick an Enemy to flight");

		}

		if(enemyChosen)
		{
			//attack
			$("#gameStatus").html("Now Attack");
		}
		else
		{
			$("#gameStatus").html("No Enemy to Attack");
		}
	}

});

var attackCnt=0;
$("#attackBtn").on("click", function(){

	if(gameStatus==="start" && enemyChosen)
	{
		attackCnt++;
		player.attack(enemy);
		
		$("#playerHP").html(player.healthPoint);
		$("#enemyHP").html(enemy.healthPoint);
		var playerText=player.name+ " attacked with " + player.attackPower +" points. ";
		var enemyText=enemy.name + " counter attacked with "+enemy.attackPower+ " points.";
		playerText=playerText.substr(0,1).toUpperCase()+playerText.substr(1);
		enemyText=enemyText.substr(0,1).toUpperCase()+enemyText.substr(1);
		$("#gameStatus").html(playerText+"<br>"+enemyText);

		player.increaseAttackPower(attackCnt);

		if(player.healthPoint < 50)
		{
			$("#playerHP").css({"text-shadow": "0 0 10px #f00","font-size":"30px"});
		};
	};



	if(enemy.healthPoint <= 0 && enemyChosen)
	{
		$("#gameStatus").html("defeated enemy");
		// $("#enemy").remove("button");
		$(".characDisplay").remove(":contains(\'"+enemy.name.toUpperCase()+"\')");
		enemyChosen=false;
		$("#gameStatus").html("choose another enemy");
		
		numCharacter--;
			if(numCharacter <= 0)
			{
				$("#gameStatus").html("You WIN!");
				gameStatus="end";
				$("#instruction").html("Refresh to play again.");
			}

		
	};

	if(player.healthPoint <= 0)
	{
		$("#gameStatus").html("You DIED!!!");
		gameStatus="end";
		$(".characDisplay").remove(":contains(\'"+player.name.toUpperCase()+"\')");
		$("#instruction").html("Refresh to play again.");
	};


	if(enemy.healthPoint <=0 && player.healthPoint <=0)
	{
		$("#gameStatus").html("You both fight to the DEATH.");
		if(numCharacter >0)
		{
			$("#gameStatus").append("<br> But you still have enemies left.Game Over!")
		}

	}

});

});//close document ready
