var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx=2, dy=-2;
var color='';
var paddleWidth = 75, paddleHeight = 10;
var paddleX = (canvas.width - paddleWidth)/2;
var rightPressed = false, leftPressed = false;
var score = 0;
var lives = 3;

var brickRowCount = 3, brickColumnCount = 5;
var brickWidth = 70, brickHeight = 18;
var brickpadding = 15;                      //間距
var brickOffsetTop = 30, brickOffsetLeft = 30;
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {     //初始化陣列
  bricks[c] = [];                           //加上二維
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x:0, y:0, status: 1 };    //初始化座標, 是否消失
  }
}

function rColor(){
  var r = Math.floor(Math.random()*256);
  var g = Math.floor(Math.random()*256);
  var b = Math.floor(Math.random()*256);
  return `rgb(${r}, ${g}, ${b})`;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup",keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {      //按鍵
  // == (e.key == "Right" || e.key == "ArrowRight")
  if(e.keyCode == 39) {     
    rightPressed = true;
  }else if(e.keyCode == 37) {
    leftPressed = true;
  }
}
function keyUpHandler(e) {    //放鍵
  if(e.keyCode == 39) {
    rightPressed = false;
  }else if(e.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  //console.log(e.clientX+'  '+canvas.offsetLeft);
  var relativeX = e.clientX - canvas.offsetLeft;   //游標位址 - 網頁最左與canvas區域的間格 = 游標在canvas的x座標
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function collisionDetection() {   //brick碰撞偵測器
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x - ballRadius && x < b.x+brickWidth + ballRadius && y > b.y - ballRadius && y < b.y+brickHeight + ballRadius) {  //球跑進brick就反彈
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickColumnCount*brickRowCount) {
            if(score == brickColumnCount*brickRowCount) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.font = "36px Arial";
              ctx.fillStyle = "#0095DD";
              ctx.textAlign = "center";
              ctx.fillText("Congratulations!", canvas.width/2, canvas.height/2);
              cancelAnimationFrame(request);
            }
          }
        }
      }
    }
  }
}

function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        var brickX = brickOffsetLeft + (c * (brickpadding + brickWidth));   //定位每塊brick
        var brickY = brickOffsetTop + (r * (brickpadding + brickHeight));
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillstyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Score：'+score, 8, 20);  //fillText(字, X座標, Y座標)
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = '#0095DD';
  ctx.fillText('Lives：'+lives, canvas.width-85, 20);  //fillText(字, X座標, Y座標)
}

function drawBall(){
  ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = '#0095DD';
	ctx.fill();
	ctx.closePath();
}

function draw() {	
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  
  //超過右邊界 || 超過左邊界 -> 球反彈
  if(x + dx > canvas.width - ballRadius || x +  dx < ballRadius) {
      dx = -dx;
      color = rColor();
  }
  //超過上邊界 -> 球反彈
  if(y + dy < ballRadius) {
      dy = -dy;
      color = rColor();
  }else if(y + dy > canvas.height - ballRadius) {   //超過下邊界
    if(x > paddleX && x < paddleX+paddleWidth) {    //有反彈到
      dy = -dy;
      color = rColor();
    }else {                                         //無反彈到
      lives--;
      if(lives<0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "36px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.textAlign = "center";
        ctx.fillText("game over!!",canvas.width/2, canvas.height/2);
        cancelAnimationFrame(request);
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 2;
        dy = -2;
        paddleX = canvas.width-paddleWidth/2;
      }
    }
  }
  
  if(rightPressed && paddleX < canvas.width-paddleWidth) {    //移動反彈器
    paddleX +=5;
  }
  if(leftPressed && paddleX > 0) {
    paddleX -=5;
  }
  
   x+=dx
	 y+=dy
  const request = requestAnimationFrame(draw);
}

draw();
