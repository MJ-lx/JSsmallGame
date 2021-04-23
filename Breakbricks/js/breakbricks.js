var startbtn = document.getElementById("start");
var timenow = new Date();

function randomRgb(min,max){
	return Math.floor(Math.random()*max)+min;
}
startbtn.onclick = function(){
	document.getElementsByClassName("gemeover")[0].style.display = "none";
	var timestring = timenow.getFullYear()+"/"+(timenow.getMonth()+1)+"/"+timenow.getDate();
	if(startbtn.innerText == "开始游戏")
	{
	var blockbreak = new BlockBreak();
	blockbreak.bricksColor();
	blockbreak.keydown();
	blockbreak.ballmove();
	// 显示时间
	var timetext = document.getElementById("nowtime");
	timetext.innerHTML = timestring;
	startbtn.innerHTML = "重新开始";
	}
	else{
		startbtn.innerHTML = "开始游戏";
		location.reload();
	}
}

function BlockBreak(){
	this.box = document.getElementById("gameblank");//容器
	this.brickList = document.getElementById("bricks").children;//砖块列表
	this.ball = document.getElementById("ball");//小球
	this.broad = document.getElementById("board");//挡板
	this.fx = 1//横向初始速度
	this.fy = -1//纵向初始速度
	this.initrow = 0;
	this.score = 0;
	this.hitbrick = 0;
}
BlockBreak.prototype.bricksColor=function(){
	this.initrow = 0;
	for(var i=0;i<this.brickList.length;i++){
		var j = i%10;
		this.brickList[i].style.left = j*this.brickList[i].offsetWidth+"px";
		this.brickList[i].style.top = this.initrow*this.brickList[i].offsetHeight+"px";
		if(j==9){
			this.initrow++;
		}
		this.brickList[i].style.backgroundColor = "rgb("+randomRgb(0,255)+","+randomRgb(0,255)+","+randomRgb(0,255)+")";		
	}
};
//挡板运动
BlockBreak.prototype.keydown = function(){
	var that = this;
	document.onkeydown = function(e){
		var e = e || event;
		//向左移动
		if(e.keyCode == 37){
			that.broad.style.left = that.broad.offsetLeft-15+"px";
			console.log(that.broad.style.left)
			if(that.broad.offsetLeft<0)
			{
				that.broad.style.left = "0px";
			}
		}
		if(e.keyCode == 39){
			that.broad.style.left = that.broad.offsetLeft+15+"px";
			if(that.broad.offsetLeft>that.box.offsetWidth - that.broad.offsetWidth)
			{
				that.broad.style.left = that.box.offsetWidth - that.broad.offsetWidth+"px";
			}
		}
	}
}
//小球运动
BlockBreak.prototype.ballmove = function(){
	var movetimer = null;
	var that = this;
	
	movetimer = setInterval(function(){
		that.ball.style.left = that.ball.offsetLeft+that.fx+"px";
		that.ball.style.top = that.ball.offsetTop+that.fy+"px";
		//撞到四壁
		//上
		if(that.ball.offsetTop == 0){
			that.fy *=-1;
		}
		//左
		if(that.ball.offsetLeft == 0){
			that.fx *=-1;
		}
		//右
		if(that.ball.offsetLeft+that.ball.offsetWidth == that.box.offsetWidth){
			that.fx *=-1;
		}
		//下
		if(that.ball.offsetTop+that.ball.offsetHeight == that.box.offsetHeight){
			//游戏结束
			clearInterval(movetimer);
			document.getElementsByClassName("gemeover")[0].style.display = "block";
			startbtn.innerHTML = "重新开始";
		}
		//撞到砖块
		for(var i = 0;i<that.brickList.length;i++){
			if(that.ball.offsetTop <= that.brickList[i].offsetTop+that.brickList[i].offsetHeight){
				if(that.ball.offsetLeft>=that.brickList[i].offsetLeft){
					if(that.ball.offsetLeft<=that.brickList[i].offsetLeft+that.brickList[i].offsetWidth)
					{
						that.brickList[i].style.display = "none";
						that.fy*=-1;
						that.score++;
						document.getElementById("score").innerHTML=that.score+"分";
						document.getElementById("gamestatus").innerHTML="撞击砖块";
					}
				}
			}
			
		}
		//撞到挡板
		if(that.ball.offsetTop+that.ball.offsetHeight >= that.broad.offsetTop){
			if(that.ball.offsetLeft<=that.broad.offsetLeft+that.broad.offsetWidth){
				if(that.ball.offsetLeft+that.ball.offsetWidth>=that.broad.offsetLeft)
				{
					that.fy*=-1;
					that.hitbrick++;
					document.getElementById("brickcounts").innerHTML=that.hitbrick+"次";
					document.getElementById("gamestatus").innerHTML="撞击挡板";
				}
			}
		}
	},10);
}