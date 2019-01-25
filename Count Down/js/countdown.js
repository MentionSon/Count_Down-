const WINDOW_WIDTH = document.body.clientWidth;
const WINDOW_HEIGHT = document.documentElement.clientHeight;
const RADIUS = Math.round(WINDOW_WIDTH*4/5/108) - 1;
const MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);
const MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
const endTime = new Date(2019, 0, 24, 23, 55);
console.log(endTime);

var curShowTimeSeconds = 0;  // 初始化当前时间

var balls = [];  //  初始化彩色小球数组
const colors = ['#006699','#0099CC','#00CCFF','#336699','#663366','#669999','#993366','#99CCCC','#CC3333','#CC6666','#CC99CC','#FF9933','#FFFF66','#FFCCCC','#660000','#CCCC00','#99CC00','#FF6600','#FF9900'];

window.onload = function() {

    var canvas = document.getElementById('canvas');
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    var context = canvas.getContext('2d');

    curShowTimeSeconds = getCurrentShowTimeSeconds();

    setInterval(() => {
        render(context);
        updata();
    }, 50);   
};

function render(context) {  //  所有倒计时数字球体阵列渲染
    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    let hours, minutes, seconds;
    hours = parseInt(curShowTimeSeconds/3600);
    minutes = parseInt((curShowTimeSeconds - hours*3600)/60);
    seconds = curShowTimeSeconds % 60;

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), context);
    renderDigit(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, hours%10, context);
    renderDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, context);
    renderDigit(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), context);
    renderDigit(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, minutes%10, context);
    renderDigit(MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, context);
    renderDigit(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), context);
    renderDigit(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, seconds%10, context); 
    renderColorBalls(context);  //  彩色动画小球渲染
}

function updata() {  // 根据倒计时变化更新数字球体的阵列
    let nextShowTimeSeconds = getCurrentShowTimeSeconds();

    let nextHours, nextMinutes, nextSeconds;
    nextHours = parseInt(nextShowTimeSeconds/3600);
    nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600)/60);
    nextSeconds = nextShowTimeSeconds % 60;

    let curHours, curMinutes, curSeconds;
    curHours = parseInt(curShowTimeSeconds/3600);
    curMinutes = parseInt((curShowTimeSeconds - curHours*3600)/60);
    curSeconds = curShowTimeSeconds % 60;

    if (nextSeconds !== curSeconds) {
        if (parseInt(curHours/10) !== parseInt(nextHours/10)) {
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours/10));
        }
        if (parseInt(curHours%10) !== parseInt(nextHours%10)) {
            addBalls(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10));
        }
        if (parseInt(curMinutes/10) !== parseInt(nextMinutes/10)) {
            addBalls(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes/10));
        }
        if (parseInt(curMinutes%10) !== parseInt(nextMinutes%10)) {
            addBalls(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes%10));
        }
        if (parseInt(curSeconds/10) !== parseInt(nextSeconds/10)) {
            addBalls(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds/10));
        }
        if (parseInt(curSeconds%10) !== parseInt(nextSeconds%10)) {
            addBalls(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(curSeconds%10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updataBalls();
    console.log(balls.length);
}

function updataBalls() {  //  彩色动画小球的动画路径规划
    for (let s of balls) {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += s.g;

        if (s.y >= WINDOW_HEIGHT - RADIUS) {
            s.y = WINDOW_HEIGHT - RADIUS;
            s.vy = -s.vy * 0.75;
        }
        if (s.x >= WINDOW_WIDTH - RADIUS) {
            s.x = WINDOW_WIDTH - RADIUS;
            s.vx = -s.vx * 0.75;
        }
    }

    var count = 0;
    for (let s of balls) {  //  彩色小球数量约束
        if ((s.x+RADIUS) > 0 && (s.x-RADIUS) < WINDOW_WIDTH) {
            balls[count++] = s;
        }     
    }
    while (balls.length > Math.min(400, count)) {
        balls.pop();
    }
}

function addBalls(x, y, num) {  // 根据变化的数字生成相应数量的球体，计算出球的位置及动画参数并添加进彩球数组
    for (let i=0; i<digit[num].length; i++) {
        for (let j=0; j<digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                let aBall = {
                    x: calPostion(x,j),
                    y: calPostion(y,i),
                    r: RADIUS,
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random()*2)) * 5,
                    vy: -(Math.ceil(Math.random()*5) + 5),
                    color: colors[Math.floor(Math.random()*colors.length)] 
                }
                balls.push(aBall);
            }         
        }
    }
}

function renderColorBalls(context) {  //  根据彩球数组生成彩球
    for (let s of balls) {
        context.fillStyle = s.color;

        context.beginPath();
        context.arc(s.x, s.y, RADIUS, 0, 2*Math.PI);
        context.closePath();

        context.fill();
    }
}

function renderDigit(x, y, num, context) {  // 生成单个数字球体整列的方法
    context.fillStyle = 'rgb(0, 102, 153)';

    for (let i=0; i<digit[num].length; i++) {
        for (let j=0; j<digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                context.beginPath();
                context.arc(calPostion(x, j), calPostion(y, i), RADIUS, 0, 2*Math.PI);
                context.closePath();

                context.fill();
            }
        }
    }   
}

function calPostion(k,n) {  //  计算球体位置
    return k + n*2*(RADIUS+1) + (RADIUS+1);
}

function getCurrentShowTimeSeconds() {  // 当前事件与目标时间的时间差
    let curTime = new Date();
    let diffSec = endTime.getTime() - curTime.getTime();
    diffSec = Math.round(diffSec/1000);
    return diffSec >= 0 ? diffSec : 0;
}