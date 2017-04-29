$(document).ready(function() {

	var game={
		score: {
			win: 0,
			loss: 0,
		},
		numTries: 11,
		gameStatus: "end",
		guessedLetters: [],
		currWord: "",
		pickWord: function(wordArr){
			var ranNum= Math.floor(Math.random() * wordArr.length);

			this.currWord = wordArr[ranNum];

		},
		isLetterInWord: function(char){
			var pos = this.currWord.indexOf(char);
			if (pos > -1){ return true;}
			else{return false;}
			
		},
		alreadyGuessed: function(char){
			var pos = this.guessedLetters.indexOf(char);
			if (pos != -1){ return true;}
			else{return false;}
		},
		storeGuessLetter: function(char){
			this.guessedLetters.push(char);
		},
		initi: function(){
			//this.score.win=0;
			//this.score.loss=0;
			this.numTries=11;
			this.guessedLetters=[];
			this.currWord="";
			this.gameStatus="start";
		},
		getAllIndexes: function (val) {
		    var indexes = [], i;
		    for(i = 0; i < this.currWord.length; i++)
		        if (this.currWord[i] === val)
		            indexes.push(i);
		    return indexes;
	}

	};

	var words=["dog","cat","mouse","whale","deer","bear","shark",
				"cow","chicken","horse","lion","panther","bobcat",
				"turtle","goat","monkey","owl","sparrow","eagle",
				"squirrel","elephant","dolphin","hummingbird","rabbit",
				"tiger","snake","boar","wolf","fox","penguin","giraffe",
				"zebra","armadillo","otter","flamingo","hedgehog","hyena",
				"gorilla","jellyfish","woodpecker","rhinoceros","panda"];

	var guessWord=document.getElementById("guessword");
	var instruction=document.getElementById("instruction");
	var gussedChar=document.getElementById("gussedChar");
	var losscnt=document.getElementById("loss");
	var wincnt=document.getElementById("win");
	var allLetters="abcdefghijklmnopqrstuvwxyz";
	var hangman=document.getElementById("hangman");

	document.onkeyup = function(event){

	var currChar = event.key.toLowerCase();
		if(currChar === " " && game.gameStatus === "end")
		{
			game.initi();
			guessWord.innerHTML="";
			gussedChar.innerHTML="";
			game.pickWord(words);
			for(var i=0; i < game.currWord.length; i ++)
			{
				var newSpan = document.createElement("span");
				newSpan.textContent= "_ ";
				newSpan.setAttribute("id","char"+i);
				guessWord.appendChild(newSpan);
			}

			//reset instruction's styling
			instruction.innerHTML="<strong>Please press any letter to guess!</strong>";
			instruction.className= "col-md-6 col-md-offset-3 alert alert-info"

			//reset hangman picture
			// hangman.innerHTML="<img src=\"./assets/image/hangman"+game.numTries+".png\">";
			hangman.src="./assets/image/hangman"+game.numTries+".png";

		} 
		else 
		{	
			// while(game.gameStatus==="start" && game.numTries != 0)
			// {
				if(allLetters.indexOf(currChar)> -1 && game.alreadyGuessed(currChar) == false && game.gameStatus === "start")
				{
					//the input letter is not in the guessed letter list
				
						game.storeGuessLetter(currChar);

						//display gussed letter
						var newSpan = document.createElement("span");
						newSpan.textContent= currChar.toUpperCase();
						gussedChar.appendChild(newSpan);
					

					if(game.isLetterInWord(currChar))
					{
						//input letter is the word, diplay letter
						//find all the matching places in the word
						var allIndexes = game.getAllIndexes(currChar)
						//display all the matching letters
						for (var j=0;j<allIndexes.length;j++)
						{	
							var currSpan=document.getElementById("char"+allIndexes[j]);
							currSpan.textContent=currChar.toUpperCase();
						}


						//if we got all the letters right
						var checkWord = guessWord.textContent.toLowerCase();
						if(checkWord === game.currWord)
						{
							//update win count

							game.gameStatus="end";
							game.score.win++;
							instruction.innerHTML="<strong>You got it! Please press space bar to play more.</strong>";
							instruction.className=instruction.className.replace("alert-info","alert-success");
							hangman.src="./assets/image/"+game.currWord+".jpg";
							wincnt.textContent=game.score.win;
						}

					}
					else
					{
						game.numTries--;
						//update hangman picture
						// hangman.innerHTML="<img src=\"./assets/image/hangman"+game.numTries+".png\">";
						hangman.src="./assets/image/hangman"+game.numTries+".png";

						if(game.numTries == 0)
						{ 
							game.gameStatus="end";
							game.score.loss++;
							instruction.innerHTML="<strong>WRONG! Press space bar to try again!</strong>";
							instruction.className=instruction.className.replace("alert-info","alert-danger");

							
							losscnt.textContent=game.score.loss;

						}



					}


				}
			// }
		}

	} //close onkey up function
});