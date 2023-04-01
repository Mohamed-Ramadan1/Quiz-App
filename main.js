let countSpan = document.querySelector(".count span"),
    spanContainer = document.querySelector(".bullets .spans-container"),
    quizArea=document.querySelector(".quiz-area"),
    answerArea = document.querySelector(".answers-area"),
    submitBtn = document.querySelector(".submit-button"),
    bullets = document.querySelector(".bullets"),
    results = document.querySelector(".results"),
    countDownElement=document.querySelector(".countdown");


//set options
let currentIndex = 0,
    rigthAnswares = 0,
    countDownInterval;


// get the data from the json file .
function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState  === 4 && this.status === 200) {
            let qustionObject = JSON.parse(this.responseText);
            let qCount = qustionObject.length;
        

            
            createBullets(qCount);
            
            addQuestionData(qustionObject[currentIndex], qCount);
            
            countDown(5,qCount);

            submitBtn.onclick = () => {
                let rightAnswer = qustionObject[currentIndex].right_answer;

                currentIndex++;
    
                chekcAnswer(rightAnswer, qCount);

                //remove prev qustion to add the next.
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";


                addQuestionData(qustionObject[currentIndex], qCount);

                handleBullets();

                clearInterval(countDownInterval);
                countDown(5,qCount);

                showResult(qCount);

            };


        }
    }
    myRequest.open("GET", "html_qustion.json", true);
    myRequest.send();

}

// create the bullets depend on qustion number.

function createBullets(number) {
    // set the count value 
    countSpan.innerHTML = number;
    for (let i = 0; i < number; i++){
        let theBullets = document.createElement("span");

        if (i === 0) {
            theBullets.classList.add("on");
        }
        spanContainer.appendChild(theBullets);
    }

}


// adding the qustion to the boydy 
function addQuestionData(obj, count) {
    if (currentIndex < count) {
    
        // create question title and its text node .
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj.titile);

        //appending data
        questionTitle.appendChild(questionText);
        answerArea.appendChild(questionTitle);

        //craete the answers
        for (let i = 1; i <= 4; i++){
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";

            // create radio input and set his information
            let radioInput = document.createElement("input");
            radioInput.type = "radio";
            radioInput.name = "questions";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];



            // create label for input and set his information.
            let inputLabel = document.createElement("label");
            inputLabel.htmlFor = `answer_${i}`;
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            inputLabel.appendChild(labelText);
            
            // if the first answer mark it checked
            if (i === 1) {
                radioInput.checked = true;
            }
            
            //appending the data to (input ,label to main div) and the main div to(answer area).
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(inputLabel);
            answerArea.appendChild(mainDiv)

        }
    

    }
}


function chekcAnswer(rAnswer, count) {
    let answers = document.getElementsByName("questions");
    let theChoosenAnswer;
    // get the chosen answer.
    for (let i = 0; i < answers.length; i++){
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    // check if the right answers equal the chosen one .
    if (rAnswer === theChoosenAnswer) {
        rigthAnswares++;
    }

    
}


// handel the bullts.
function handleBullets() {
    let bulltesSpan = document.querySelectorAll(".bullets .spans-container span");
    let arrayOfSpans = Array.from(bulltesSpan);

    // remove all on class .
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.classList.add("on")
        }
    })
    
    
}


//show results..
function showResult(count) {
    var theResult;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitBtn.remove()
        bullets.remove();

        if (rigthAnswares > (count / 2) && rigthAnswares < count) {
            theResult=`<span class="good">Good</span> : ${rigthAnswares} from : ${count}`
        } else if (rigthAnswares ===count) {
            theResult=`<span class="perfect">Perfect</span> : ${rigthAnswares} from : ${count}`
            
        } else {
            theResult=`<span class="bad">Bad</span> : ${rigthAnswares} from : ${count}`
            
        }

    }
    results.innerHTML = theResult;
    

    
}

// count down function.
function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ?`0${minutes}`:minutes;
            seconds = seconds < 10 ?`0${seconds}`:seconds;

            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitBtn.click()
            }
            
        }, 1000);
    }
}


// get the question fromt the json file .
getQuestions();

