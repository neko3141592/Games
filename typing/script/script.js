'use strict'

const $doc = document;
const $score = $doc.getElementById('score');
const $timer = $doc.getElementById('timer');
const $questionInput = $doc.getElementById('question');
const $type = $doc.getElementById('type');
const $scoreC = $doc.getElementById('scoreC');

const wrongSound = new Audio("../audio/wrong.mp3");
const typeSound = new Audio("../audio/type.mp3");
const startSount = new Audio("../audio/start.mp3");
const finishSound = new Audio("../audio/finish.mp3");
const nextSount = new Audio("../audio/next.mp3");

let sec , pts = 0;
let questionSize = data[0].size;
let questionIndex , typeIndex;
let typeKeys = 0 , missKeys = 0 , word = 0;
let questionNum;
let isFinish = 0 , isClick = 0;
let used = [];

const random = (min , max) => {
    for(let i = min; i <= max; i++){
        while(1){
            let tmp = intRandom(min, max);
            if(!used.includes(tmp)){
                used.push(tmp);
                break;
            }
        }   
    }
}

const intRandom = (min, max) =>{
    return Math.floor( Math.random() * (max - min + 1)) + min;
}

const creation = () => {
    typeIndex = 0;

    // while (used.some((value) => value === questionNum)) {
    //     questionNum = Math.floor(Math.random() * questions.length);
    // }
    // used.push(questionNum);

    questionNum = used[questionIndex];
    
    while($type.firstChild){
        $type.removeChild($type.firstChild);
    }

    $score.textContent = pts;
    $questionInput.textContent = questions[questionNum].question;

    const target = questions[questionNum].type;
    for(let i = target.length; i >= 0; i--){
        let element = $doc.createElement('p');
        element.textContent = target.substr(i , 1);
        $type.insertBefore(element , $type.firstChild);
    }
}

const finish = () => {
    isFinish = 1;

    while($type.firstChild){
        $type.removeChild($type.firstChild);
    }

    $questionInput.textContent = "finish!!";

    let perSec = Math.floor(word / sec * 100) / 100;

    pts -= data[0].lostPoint * missKeys;
    pts *= perSec / 3;
    if(pts <= 0) pts = 1;
    pts = Math.floor(pts);
    $score.textContent = pts;

    const element = $doc.createElement('h2');
    element.textContent = `miss:${missKeys}|type key:${typeKeys}|Accuracy rate:${Math.floor((word/typeKeys * 100) * 100) / 100}%|${perSec}key/s`;
    if(!missKeys) element.classList.add('noMiss');
    $type.insertBefore(element , $type.firstChild);
    $scoreC.style.display = 'block';

    finishSound.play();
    finishSound.currentTime = 0;
}

const keyHandler = (e) => {
    const $keys = $type.children;
    if ($keys) {
        typeKeys++;
        if(e.key == $keys[typeIndex].innerHTML){
            $keys[typeIndex].classList.add('change');
            word++;
            typeIndex++;
            typeSound.play();
            typeSound.currentTime = 0;
        } else {
            missKeys++;
            wrongSound.play();
            wrongSound.currentTime = 0;
        }

        if(typeIndex === questions[questionNum].type.length){
            pts += data[0].point;
            if(questionIndex < questionSize - 1){
                questionIndex++;
                creation();
                nextSount.play();
                nextSount.currentTime = 0;
            }else{
                finish();
            }
        }
    }
}

const init = () => {
    $scoreC.style.display = 'none';
    $timer.textContent = data[0].init_sec;
    sec = data[0].init_sec;
    random(0 , questions.length - 1);
    questionNum = used[0];
    used.push(questionNum);
    questionIndex = 0;
    typeIndex = 0;
    creation();
}

const start = () => {
    startSount.play();
    startSount.currentTime = 0;
    $doc.addEventListener('keydown' , (event) => {
        keyHandler(event);
    });
    window.setInterval(() => {
        if(!isFinish){
            sec++;
            $timer.textContent = sec;
        }
    }, 1000);
}

$doc.addEventListener('click' , () => {
    if(!isClick){
        init();
        start();
    }
    isClick++;
});