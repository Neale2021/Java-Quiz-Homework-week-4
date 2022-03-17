//questions
var questions = [
    {
      title: "What does var mean in JavaScript?",
      multiChoice: ["Value", "String", "Variables"],
      answer: "Varibles"
    },
  
    {
      title: "What do Boolean variables return true or false?",
      multiChoice: [ "True", "Both","False"],
      answer: "Both"
    },
  
    {
      title: "What are the 3 scope variables?",
      multiChoice: [ "Global, Function, Block", "Local, Global, Block","Block, Function, Console "],
      answer: "Global, Function, Block"
    },
  
    {
      title: "True or False, The key value is an object?",
      multiChoice: [ "True","False"],
      answer: "True"
    },
  
    {
      title: "What does the index always start at?",
      multiChoice: [ "1", "0", "2"],
      answer: "a function that is passed into another function as an argument"
    }
  ];
  
// timer
var secondsLeft = 60;

//displays the time element
var timer = document.getElementById("timer");

//high scores
var scoresDiv = document.getElementById("scores-div");

var buttonsDiv = document.getElementById("buttons")

//high scores button
var viewScoresBtn = document.getElementById("view-scores")


//start button div
var startButton = document.getElementById("start-button");
startButton.addEventListener("click", setTime);



// questions title
var questionDiv = document.getElementById("question-div");

// hold the results
var results = document.getElementById("results");

// choices
var choices = document.getElementById("choices");


// store high scores array
var emptyArray = [];

//array of high scores from local storage
var storedArray = JSON.parse(window.localStorage.getItem("highScores"));

// keeping track of which question user is on
var questionCount = 0;

//keeping score of user
var score = 0

//starts timer when the user clicks startButton and removes questions if timer runs out
function setTime() {
  displayQuestions();
  var timerInterval = setInterval(function() {
    secondsLeft--;
    timer.textContent = "";
    timer.textContent = "Time: " + secondsLeft;
    if (secondsLeft <= 0 || questionCount === questions.length) {
      clearInterval(timerInterval);
      captureUserScore();
      removeEls (questionDiv);
    } 
  }, 1000);
}
console.log(displayQuestions);

//loads the questions on the page
function displayQuestions() {
  removeEls(startButton);

  if (questionCount < questions.length) {
    questionDiv.innerHTML = questions[questionCount].title;
    choices.textContent = "";

    for (let i = 0; i < questions[questionCount].multiChoice.length; i++) {
     let p = document.createElement("button");
      p.innerText = questions[questionCount].multiChoice[i];
      p.setAttribute("data-id", i);
      p.addEventListener("click", function (event) {
        event.stopPropagation();

        if (p.innerText === questions[questionCount].answer) {
          score += secondsLeft;
        } else {
          score -= 10;
          secondsLeft = secondsLeft - 15;
        }
        
        questionDiv.innerHTML = "";

        if (questionCount === questions.length) {
          return;
        } else {
          questionCount++;
          displayQuestions();
        }
      });
      choices.append(p);
    }
  }
}


function captureUserScore() {
  timer.remove();
  choices.textContent = "";

  var initialsInput = document.createElement("input");
  var postScoreBtn = document.createElement("input");

  results.innerHTML = `You scored ${score} points! Enter initials: `;
  initialsInput.setAttribute("type", "text");
  postScoreBtn.setAttribute("type", "button");
  postScoreBtn.setAttribute("value", "Post My Score!");
  postScoreBtn.addEventListener("click", function (event) {
    event.preventDefault();
    var scoresArray = defineScoresArray(storedArray, emptyArray);
    removeEls(postScoreBtn);
    removeEls(results);

    var initials = initialsInput.value;
    var userAndScore = {
      initials: initials,
      score: score,
    };

    scoresArray.push(userAndScore);
    saveScores(scoresArray);
   
   
  });
  results.append(initialsInput);
  results.append(postScoreBtn);
}

const saveScores = (array) => {
  window.localStorage.setItem("highScores", JSON.stringify(array));
}

const defineScoresArray = (arr1, arr2) => {
  if(arr1 !== null) {
    return arr1
  } else {
    return arr2
  }
}

const removeEls = (...els) => {
  for (var p of els) p.remove();
}

function displayAllScores() {
  removeEls(timer, startButton, results);
  var scoresArray = defineScoresArray(storedArray, emptyArray);

  scoresArray.forEach(obj => {
    var initials = obj.initials;
    var storedScore = obj.score;
    var resultsP = document.createElement("p");
    resultsP.innerText = `${initials}: ${storedScore}`;
    scoresDiv.append(resultsP);
  });
}

function viewScores() {
  viewScoresBtn.addEventListener("click", function(event) {
    event.preventDefault();
    displayAllScores()
    clearScoresBtn()
    removeEls(timer, startButton);
    removeEls(viewScoresBtn);
    viewScoresBtn.remove();
  });
}

function clearScoresBtn() {    
  var clearBtn = document.createElement("input");
  clearBtn.setAttribute("type", "button");
  clearBtn.setAttribute("value", "Clear Scores");
  clearBtn.addEventListener("click", function(event){
    event.preventDefault();
    removeEls(scoresDiv);
    window.localStorage.removeItem("highScores");
  })
  scoresDiv.append(clearBtn)
}


viewScores();
