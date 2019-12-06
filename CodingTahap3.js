//Select CVS
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

//Game Vars and Cons
let frames = 0;
const DEGREE = Math.PI/180;

//Load Sprite Images
const sprite = new Image();
sprite.src = "img/sprite.png";

//Load Sounds
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

//Game State
const state = {
	current : 0,
	getReady : 0,
	game : 1,
	over : 2
}

//Start Button Coor
const startBtn = {
	x : 120,
	y : 263,
	w : 83,
	h :29
}

//Control The Game
cvs.addEventListener("click", function(evt){
	switch(state.current){
		case state.getReady:
			state.current = state.game;
			SWOOSHING.play();
			break;
		case state.game:
			bird.flap();
			FLAP.play();
			break;
		case state.over:
			let rect = cvs.getBoundingClientRect();
			let clickX = evt.clientX - rect.left;
			let clickY = evt.clientY - rect.top;

			//check if we click on the start button
			if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
				pipes.reset();
				poops.reset();
				bird.speedReset();
				score.reset();
				state.current = state.getReady;
			}
			
			break;
	}
});


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
		if(state.current == state.game){
			this.x = (this.x - this.dx)%(this.w/2)
		}
	}
}


const anim = {
	animation : [
	{sX : 276 , sY : 113},
	{sX : 276 , sY : 148},
	{sX : 276 , sY : 184},
	{sX : 276 , sY : 148}
	],
	w : 49,
	h : 34,
}


	

const bird = {

	x : 50,
	y : 150,

	radius : 12,

	frame : 0,

	gravity : 0.08,
	jump : 2.0,
	speed : 0,
	rotation : 0,


	draw : function(){

			let bird = anim.animation[this.frame];

			ctx.save();
			ctx.translate(this.x , this.y);
			ctx.rotate(this.rotation);
			ctx.drawImage(sprite,bird.sX,bird.sY,anim.w,anim.h,- anim.w/2,- anim.h/2,anim.w,anim.h );

			ctx.restore();
	
	},


	flap : function(){
		this.speed =- this.jump;
	},

update : function(){

		//If current state is "get ready", then bird must flap slowly
		this.period = state.current == state.getReady ? 10 : 5;
		//we increment the frame by 1, each period
		this.frame += frames%this.period == 0 ? 1 : 0;
		// Freame goes from 0 to 4, then again to 0
		this.frame = this.frame%anim.animation.length;

		if(state.current == state.getReady){
			this.y = 150;
			this.rotation = 0 * DEGREE;
		}
		else{
			this.speed += this.gravity;
			this.y += this.speed

			if(this.y + anim.h/2 >= cvs.height - fg.h){
				this.y = cvs.height - fg.h - anim.h/2;
				if(state.current == state.game){
					state.current = state.over;
					DIE.play();
				}
			}

			//If the speed is greater than jump means the bird falling down
			if(this.speed >= this.jump){
				this.rotation = 90 * DEGREE;
				this.frame = 1;
			}
			else{
				this.rotation = -25 * DEGREE;	
			}
		}

	},

	speedReset : function(){
		this.speed = 0;
	}
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
		
			if(state.current == state.getReady){
			ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y,this.w,this.h)
		}
		
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
		
			if(state.current == state.over){
			ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y,this.w,this.h)
			}
	}
}

//Pipes
const pipes = {
	position : [],

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
	maxYPos : -150,
	dx : 2,

	draw : function(){
		for(let i = 0; i < this.position.length; i++){
			let p = this.position[i];

			let topYPos = p.y;
			let bottomYPos = p.y + this.h + this.gap;

			//Top Pipe
			ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, p.y,this.w,this.h);

			//Bottom Pipe
			ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos,this.w,this.h);
		}
	},

	update: function(){

		if(state.current !== state.game) return;

		if(frames%100 == 0){
			this.position.push({
				x : cvs.width,
				y : this.maxYPos * ( Math.random() + 1)
			});
		}
		for(let i = 0; i < this.position.length; i++){
			let p = this.position[i];

			let bottomPipeYPos = p.y + this.h + this.gap;

		

			//Collision Detection
			//Top Pipe
			if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
			state.current = state.over;
			HIT.play();
			}

			//Bottom Pipe
			if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
			state.current = state.over;
			HIT.play();
			}
			
			

			//Move the pipes to the left
			p.x -= this.dx;


			// if the pipes go beyond canvas, we delete them from array.
			if(p.x + this.w <= 0){
				this.position.shift();
				score.value += 1;
				SCORE_S.play();
				score.best = Math.max(score.value, score.best);
				localStorage.setItem("best", score.best);
			}
		}
	},

	reset : function(){
		this.position = [];
	}
}

//Poops
const poops = {
	position : [],
	animationPoop : [
	{sX : 330 , sY : 114},
	{sX : 330 , sY : 150},
	{sX : 330 , sY : 184},
	{sX : 330 , sY : 114}
	],
	w : 49,
	h : 34,
	dx : 2,

	frame : 0,


	draw : function(){
		let poop = this.animationPoop[this.frame];

		for (let i = 0 ; i < this.position.length ; i++){
			let p = this.position[i];

			ctx.drawImage(sprite,poop.sX,poop.sY,this.w,this.h,p.x,p.y,this.w,this.h );
		}
		
	},

	update : function(){

		if (state.current !== state.game) return;

		//increment frame by 1 every 5 frames
		this.frame += frames % 5 == 0 ? 1 : 0;

		//return a value from 0 to 4 each frames
		this.frame = this.frame % this.animationPoop.length;

		if (frames%100 == 0){

			rdm = Math.random();

			if(rdm < 0.1){
				this.position.push({
					x : cvs.width + pipes.w + 8,
					y : 0,
				});
			}
			else{
				this.position.push({
					x : cvs.width + pipes.w + 8,
					y : ((cvs.height - fg.h) * rdm ) - (this.h),
				});
			}
			
		}


		for(let i = 0; i < this.position.length ; i++){
			let p = this.position[i];

			//Collision Detection
			//Top Pipe
			if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
				this.position.shift();
			}


			p.x -= this.dx;

			//if poops go beyond the canvas, remove the corresponding poop from array
			if (p.x + this.w <= 0){
				this.position.shift();
			}

		}
	},

	reset : function(){
		this.position = [];
	}

}

//Score 

const score = {

	best : parseInt(localStorage.getItem("best")) || 0,
	value : 0,

	draw : function(){
		ctx.fillStyle = "#FF0000";
		ctx.strokeStyle = "#FF0000";

		if(state.current == state.game){
			ctx.lineWidth = 2;
			ctx.font = "35px Teko";
			ctx.fillText(this.value, cvs.width/2, 50);
			ctx.strokeText(this.value, cvs.width/2, 50);
		}
		else if(state.current == state.over){
			// Score Value
			ctx.font = "25px Teko";
			ctx.fillText(this.value, 225, 186);
			ctx.strokeText(this.value, 225, 186);
			// Best Score
			ctx.fillText(this.best, 225, 228);
			ctx.strokeText(this.best, 225, 228);
		}
	},

	reset : function(){
		this.value = 0;
	}
}

//draw
function draw(){

    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0,0, cvs.width, cvs.height)

    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    poops.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

//update
function update(){
	bird.update();
	fg.update();
	pipes.update();
	poops.update();
}

//Loop
function loop(){
	update();
	draw();
	score.draw();
	frames++;

	requestAnimationFrame(loop);
}
loop();


