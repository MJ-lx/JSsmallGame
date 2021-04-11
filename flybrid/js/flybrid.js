
//绘制底板
var canvas = document.getElementById("gameblank");
var content =canvas.getContext('2d');
content.fillStyle = "#ffffff";
content.fillRect(0,0,600,400);

var show = document.getElementById("showgame");
var beginBtn = document.getElementById("begin");
var countImg = document.getElementById("Countdown");
var newgame = document.getElementById("newgame");
var count = 0;//标志倒计时
var begintimer = null;//倒计时定时器

//1.创建图片
var img = new Image();//承载小鸟图
var birdtimer = null;//小鸟飞行定时器
var birdX = 200;//小鸟的横坐标
var birdY = 100;//小鸟的纵坐标

var mark = 0;//分数
var same = 0;//辨别经过的柱子



//当开始游戏按钮被点击时，开始游戏
beginBtn.onclick = function(){
	show.style.display = "none";
	countImg.style.display = "block";
	//倒计时
	begintimer = setInterval(function(){
		switch (count)
		{	case 0:
				countImg.style.width = "80px";
				countImg.style.height = "120px";
				countImg.style.left = "550px";
				countImg.src = "img/font_053.png";
				break;
			case 1:
				countImg.src = "img/font_052.png";
				break;
			case 2:
				countImg.src = "img/font_051.png";
				break;
			case 3:
				countImg.src = "img/font_050.png";
				break;
			case 4:
				countImg.src = "img/font_049.png";
				break;
			case 5:
				countImg.src = "img/font_048.png";
				break;
			default:
				countImg.style.display = "none";
				fly();
				Createcolumn();//开始添加柱子
				clearInterval(begintimer);
		}	
		count++;
	},1000);	
}
newgame.onclick = function(){
	location.reload();
}

//在图片加载完成后进行绘制

function fly(){
	img.src = "img/bird0_0.png";
	img.onload = function(){
		//在切换图片链接时，onload方法会再次调用，而使得产生多个定时器，加快下降速度
		//在birdtimer不为null时，才重新开启定时器
		if(birdtimer==null){
			birdtimer = setInterval(function(){
				//小鸟只能在画布的范围内活动 和倒计时结束
				if(birdY<376 && birdY>0){
					//清除画布，防止影响下次绘制
					content.clearRect(0,0,600,400);
					content.fillStyle = "#ffffff";
					content.fillRect(0,0,600,400);
					birdY++;//小鸟下降
					content.drawImage(img,birdX,birdY);
					Canvascolumn();//画柱子
				}
				else{
					gameOver();
				}
			},10);
			
		}	
	}
}


//小鸟的点击响应事件
canvas.onmousedown = function(){
	img.src = "img/bird0_2.png";
	birdY=birdY-30;
}
canvas.onmouseup = function(){
		img.src = "img/bird0_0.png";
}

//柱子
var columnArr = [];//承载数组
var columntimer = null;//生成柱子的定时器

//创建柱子
function Createcolumn(){
	columntimer = setInterval(function(){
		var column={};//一对柱子的容器
		
		column.columnup = new Image();//上面的柱子
		column.columndown = new Image();//下面的柱子
		column.columnup.src = "img/pipe_down.png";
		column.columndown.src = "img/pipe_up.png";
		
		column.positionX = 550;//上面柱子的起始绘制位置
		column.positionY = -Math.round(Math.random()*200+50);//随机生成其绘制的高度，使其呈现不同的高度
		column.id = (new Date()).getTime();//用时间戳作为标识符
		columnArr.push(column);
	
	},1800);	
}


//绘制柱子
function Canvascolumn(){
	console.log(count);
	if(columnArr.length>0){
		for(var i=0;i<columnArr.length;i++){
			columnArr[i].positionX--;
			content.drawImage(columnArr[i].columnup,columnArr[i].positionX,columnArr[i].positionY);
			content.drawImage(columnArr[i].columndown,columnArr[i].positionX,420+columnArr[i].positionY);
		
			//计算得分
			if(birdX+34>=columnArr[i].positionX&&birdX-45<columnArr[i].positionX){
				//判断失败
				if(birdY-5<columnArr[i].positionY+320||birdY+39>420+columnArr[i].positionY){
					gameOver();
				}
				
				if(columnArr[i].id!=same){
					mark++;
					same = columnArr[i].id;
					document.getElementById("mark").innerHTML = "得分："+mark;
				}
			}	
		}
	}	
}
//游戏结束后的操作
function gameOver(){
	clearInterval(birdtimer);
	clearInterval(columntimer);
	
	var res = document.getElementById("res");
	res.style.display = "block";
	res.children[0].innerText = "最终得分："+mark;
	if(mark<10){
		res.children[1].src = "img/medals_3.png";
	}
	else if(mark<50){
		res.children[1].src = "img/medals_2.png";
	}
	else if(mark<100){
		res.children[1].src = "img/medals_1.png";
	}
	else{
		res.children[1].src = "img/medals_0.png";
	}
}