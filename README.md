# JSsmallGame



## 飞翔的小鸟游戏实现（jS）

2021.04.11

### HTML布局

​		由五部分组成，一个canvas画布，一个用来显示开始游戏状态的div，一个用于展示开始倒计时的img标签，开始游戏展示得分的div以及游戏结束展示结果的div。具体实现细节如下：

~~~ html
<canvas id="gameblank" width="800" height="400">
			如果浏览器不支持canvas，则会显示这里的信息
		</canvas>
		<div id="showgame">
			<img src="img/title.png" />
			<button id="begin"></button>
		</div>
		<img id="Countdown" src="img/text_ready.png" />
		<div id="mark"></div>
		<div id="res">
			<h3>最终得分：100</h3>
			<img src="img/medals_3.png">
			<button id="newgame"></button>
		</div>
~~~

效果图

<img src="D:\软件\HBuilderX.2.8.8.20200820\source\JSsmallGame\flybrid\img\效果图.PNG" style="zoom:80%;" />

<img src="D:\软件\HBuilderX.2.8.8.20200820\source\JSsmallGame\flybrid\img\效果图2.PNG" style="zoom:80%;" />

###  JS 动画实现思路

####  全局变量

~~~ js
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

var columnArr = [];//承载数组
var columntimer = null;//生成柱子的定时器
~~~



####  游戏开始倒计时

​	为id为begin按钮设置点击事件，设置一个定时器，每1s切换一下显示图片，使用switch语句实现切换，用count变量来识别切换到哪一张了。当count=6的时候，倒计时结束，游戏开始。此时运行fly()和Createcolumn()函数，关闭此定时器。

####  游戏开始主函数fly()

​		js是异步实现，为了避免在图片尚未加载完毕就进行了图片绘制使得绘制无效。所以，为img设置onload事件。因为**在切换图片链接时，onload方法会再次调用，而使得产生多个定时器，加快下降速度** ，为了避免此情况的发生，则在定时器birdtimer为null时，才重新开启新的定时器。在定时器中，先判断小鸟是否在画布内，在则继续游戏，不再则停止游戏。

​		动画帧速率设置为每秒60帧以上较位顺畅，即动画频率为16.6ms。在定时器中，每过0.01s就将birdY++，实现小鸟不断下降的动画效果。

####  柱子生成与得分计算

​		利用一个对象来作为容器存放一对对柱子的基本信息：包括两个Image对象用来存放上下柱子图片信息；positionX变量用来存放上方的柱子的起始绘制x位置（固定数值），positionY变量用来存放上方的柱子的起始绘制y位置，用随机函数生产此数值从而使得柱子的长度不一样；用时间戳作为标识符存放在id变量中。将柱子对象初始化过程放在定时器中，每过1.8s生成1个，并存放在columnArr数组中，并在Canvascolumn()中遍历绘制columnArr数组中的column对象，并改变其column的起始绘制x位置，使其产生向前移动的效果。

​		同时，通过小鸟的起始绘制点与上下柱子的x，y位置的关系可以判断小鸟是否碰到柱子，是否通过柱子（使用id来辨识是不是同一对柱子）。详细判断如下图示意：

![](D:\MyDownloads\Typora\files\imgs\画图示意.png)

####  游戏结束重新开始

当游戏失败时，清除birdtimer和columntimer定时器，同时显示最终得分面板，当点击new按钮时，会触发location的reload的事件，重新游戏。



## 打砖块游戏

### HTML布局

​	一个div作为游戏面板，分为左右两部分：左边是游戏界面，右边是游戏记录面板。左边的游戏砖块是由无序列表ul>li构成，10*4的布局。按照常规思路当然使用float布局即可实现，但是由于后续打击砖块后会隐藏其中一些li元素，如果使用float布局，会影响未被打击砖块的位置，产生打击此砖块其后续砖块全都消失不符合预期效果的游戏bug。因此，使用绝对定位absolute，并在开始游戏随机生成砖块颜色时同步设置位置。还有一个开始游戏按钮。

效果图

![](D:\软件\HBuilderX.2.8.8.20200820\source\JSsmallGame\Breakbricks\效果图1.PNG)

![](D:\软件\HBuilderX.2.8.8.20200820\source\JSsmallGame\Breakbricks\效果图2.PNG)

### JS动画实现思路

#### 构建打砖块游戏类

​	利用面对对象的思路，为此游戏定义一个类为BlockBreak，其中包含属性挡板、小球、砖块、小球的初始速度、游戏等分，并在原型上添加挡板运动方法、小球运动方法。

```javascript
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
```

#### 小球碰撞运动

​	小球碰撞运动分为三种情况：撞击四周、撞击挡板、撞击砖块。当撞击时，只需改变相应方位速度的方向即可。在实现撞击挡板和砖块时，难点时判断是否撞击，可使用小球自身的长宽以及在游戏界面中的相对位置，与挡板（砖块）的相对位置进行比较。以挡板为例：

```javascript
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
```

​	打击砖块消失的实现原理与判断方式和撞击挡板相似，符合条件则改变其垂直方向的速度，并隐藏此元素块。