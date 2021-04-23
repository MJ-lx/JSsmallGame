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

​		在定时器中，每过0.01s就将birdY++，实现小鸟不断下降的动画效果。

####  柱子生成与得分计算

​		利用一个对象来作为容器存放一对对柱子的基本信息：包括两个Image对象用来存放上下柱子图片信息；positionX变量用来存放上方的柱子的起始绘制x位置（固定数值），positionY变量用来存放上方的柱子的起始绘制y位置，用随机函数生产此数值从而使得柱子的长度不一样；用时间戳作为标识符存放在id变量中。将柱子对象初始化过程放在定时器中，每过1.8s生成1个，并存放在columnArr数组中，并在Canvascolumn()中遍历绘制columnArr数组中的column对象，并改变其column的起始绘制x位置，使其产生向前移动的效果。

​		同时，通过小鸟的起始绘制点与上下柱子的x，y位置的关系可以判断小鸟是否碰到柱子，是否通过柱子（使用id来辨识是不是同一对柱子）。详细判断如下图示意：

![](D:\MyDownloads\Typora\files\imgs\画图示意.png)

####  游戏结束重新开始

当游戏失败时，清除birdtimer和columntimer定时器，同时显示最终得分面板，当点击new按钮时，会触发location的reload的事件，重新游戏。