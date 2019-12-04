//Select CVS
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

//Game Vars and Cons
let frames = 0;

//Load Sprite Images
const sprite = new Image();
sprite.src = "img/sprite.png";


// Background
const bg = {
	sX : 0,
	sY : 0,
	w : 275,
	h : 400,
	x : 0,
	y : 0,

	draw : function(){
		ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h );

		ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x + this.w ,this.y,this.w,this.h );
	}
}


const fg = {
	sX : 276,
	sY : 0,
	w : 224,
	h : 112,
	x : 0,
	y : cvs.height - 112,
	dx : 2,

	draw : function(){
		ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h );
		ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x + this.w,this.y,this.w,this.h );
	},

	update : function(){
	}
}
	

const bird = {
	sX : 276,
	sY : 113,
	x : 50,
	y : 150,
	w : 49,
	h : 34,

	draw : function(){


			ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x - this.w/2, this.y - this.h/2,this.w,this.h );
				
	},



update : function(){

	},
}

// Get Ready Message
const getReady = {
	sX : 0,
	sY : 376,
	w : 173,
	h : 152,
	x : cvs.width/2 - 173/2,
	y : 120,

	draw: function(){
		

			ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y,this.w,this.h)
		
	}
}

// GameOver Message
const gameOver = {
	sX : 175,
	sY : 378,
	w : 225,
	h : 202,
	x : cvs.width/2 - 225/2,
	y : 90,

	draw: function(){
		
			ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y,this.w,this.h)
	}
}

//Pipes
const pipes = {
	top : {
		sX : 553,
		sY : 0,		
	},
	bottom : {
		sX : 502,
		sY : 0,
	},

	w : 53,
	h : 400,
	gap : 85,
	x : cvs.width - 20,
	maxYPos : -250,
	
	draw : function(){

			let bottomYPos = this.maxYPos + this.h + this.gap;

			//Top Pipe
			ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, this.x, this.maxYPos,this.w,this.h);

			//Bottom Pipe
			ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, this.x, bottomYPos,this.w,this.h);
		
	},

	update: function(){

	},
} 

//draw
function draw(){

    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0,0, cvs.width, cvs.height)

    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
}

//update
function update(){
	bird.update();
	fg.update();
	pipes.update();
}

//Loop
function loop(){
	update();
	draw();
	frames++;

	requestAnimationFrame(loop);
}
loop();


