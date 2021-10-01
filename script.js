//canvas setup and styling
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const cursor = document.querySelector('.cursor');
const title = document.querySelector('#title');
const body = document.querySelector('#body');
const subtitle = document.querySelector('#subtitle');
const start = document.querySelector('#start');
const gameOver = document.querySelector('#gameOver');
const final = document.querySelector('#final');
const btn = document.querySelector('a');

var window_h = window.innerHeight;
var window_w = window.innerWidth;

var targetScore = 5;
var score = -1;
var click = 0;
var missed = 0;
var accuracy2 = 0;

canvas.width = window_w;
canvas.height = window_h;
canvas.style.background = "#65737e";

const tl = new TimelineMax();//using gsap js library
gameOver.style.display = "none";
btn.style.display = "none";

tl.fromTo(title, 1.7, { opacity: 0, x: "100%" }, { opacity: 1, x: "0%", ease: Power2.easInOut })
    .fromTo(subtitle, 1, { opacity: 0, y: "250%" }, { opacity: 1, y: "0%", ease: Power2.easInOut }, "-=0.7")
    .fromTo(start, 1, { opacity: 0, y: "250%" }, { opacity: 0.7, y: "0%", ease: Power2.easInOut }, "-=1");

//circle
class Circle {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    randCircle(ran_x, ran_y, ran_r) {
        this.r = ran_r;
        this.x = ran_x;
        this.y = ran_y;

        new Circle(ran_x, ran_y, ran_r);
        this.draw(ctx);
    }
    clickCircle(xmouse, ymouse) {
        //Pythagorean theorem, xmouse & ymouse are x,y coordinates of mouse and this.x and this.y are x,y coordinates of circle
        const d = Math.sqrt((xmouse - this.x) ** 2 + (ymouse - this.y) ** 2);

        if (d < this.r) {
            fadeOut();
            click++;
            score++;
            //clears clicked circle
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //randomized timer for spawning circles from 0 - 4 seconds
            if (score < targetScore) {
                setTimeout(() => {
                    this.randCircle(Math.floor((Math.random() * (window_w - this.r)) + this.r), Math.floor((Math.random() * (window_h - this.r)) + this.r), Math.floor(Math.random() * 65) + 15);
                },
                    Math.random() * 4000
                );
            }
            trackScore();
            return true;
        } else {
            if (click > 0) { missed++; }
            return false;
        }
    }
}

//default circle at beginning of game
let circle = new Circle(window_w / 2, window_h / 2, 60, 'cyan');
circle.draw(ctx);

//fade out animations
function fadeOut() {
    tl.fromTo(title, 1, { opacity: 1, y: "0%" }, { opacity: 0, y: "-100%", ease: Power2.easInOut })
        .fromTo(subtitle, 1, { opacity: 1, y: "0%" }, { opacity: 0, y: "-250%", ease: Power2.easInOut }, "-=1")
        .fromTo(start, 1, { opacity: 0.7, y: "0%" }, { opacity: 0, y: "-250%", ease: Power2.easInOut }, "-=1");

    setTimeout(() => {
        title.style.display = 'none';
        subtitle.style.display = 'none';
        start.style.display = 'none';
    }, 1000);
}

//track score and
function trackScore() {
    document.getElementById("gameScore").innerHTML = "Score: " + score;
    if (click == 1) {
        gameScore.style.animation = "moveScore1 1.5s";
    }
    if (score == targetScore) {
        gameScore.style.animation = "moveScore2 1.5s";
        setTimeout(() => {
            gameScore.setAttribute("style", "top: 30%");//styling after animation is done to match those when anumations is done
        }, 1500);

        gameOver.style.display = 'inherit';//show game over
        tl.fromTo(gameOver, 1, { opacity: 0 }, { opacity: 1, ease: Power2.easInOut });

        if (missed == 0) {
            accuracy2 = 100;
        } else {
            accuracy = (score / (score + missed)) * 100;
            var accuracy2 = accuracy.toFixed(2);//for decimal point accuracy
        }

        if (missed == 1) {
            document.getElementById("final").innerHTML = "Good job you hit all the targets with an accuracy of " + accuracy2 + "%";
            final.style.animation = "moveFinal 1.5s";
        } else {
            document.getElementById("final").innerHTML = "Good job you hit all the targets with an accuracy of " + accuracy2 + "%";
            final.style.animation = "moveFinal 1.5s";
        }
        playAgain();
    }
}

function playAgain() {
    btn.style.display = "inherit";
    document.getElementById("gameScore").innerHTML = "Score: " + score + "<br>" + "<br>" + "Missed: " + missed;
    btn.style.animation = "fadeIn 2s";
    document.addEventListener('click', () => {
        location.reload();
    })
}

//event listener for mouse click, will start listening after 2.5s of refreshing the tab
setTimeout(() => {
    document.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        circle.clickCircle(x, y);
    })
}, 2500);

//event listener for custom cursor
document.addEventListener('mousemove', (e) => {
    cursor.setAttribute("style", "top: " + (e.pageY - 7) + "px; left: " + (e.pageX - 7) + "px;")
})