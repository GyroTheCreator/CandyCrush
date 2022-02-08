/*
 ▄▄▄▄    ██▀███   ▒█████   ██ ▄█▀▓█████  ███▄    █ 
▓█████▄ ▓██ ▒ ██▒▒██▒  ██▒ ██▄█▒ ▓█   ▀  ██ ▀█   █ 
▒██▒ ▄██▓██ ░▄█ ▒▒██░  ██▒▓███▄░ ▒███   ▓██  ▀█ ██▒
▒██░█▀  ▒██▀▀█▄  ▒██   ██░▓██ █▄ ▒▓█  ▄ ▓██▒  ▐▌██▒
░▓█  ▀█▓░██▓ ▒██▒░ ████▓▒░▒██▒ █▄░▒████▒▒██░   ▓██░
░▒▓███▀▒░ ▒▓ ░▒▓░░ ▒░▒░▒░ ▒ ▒▒ ▓▒░░ ▒░ ░░ ▒░   ▒ ▒ 
▒░▒   ░   ░▒ ░ ▒░  ░ ▒ ▒░ ░ ░▒ ▒░ ░ ░  ░░ ░░   ░ ▒░
 ░    ░   ░░   ░ ░ ░ ░ ▒  ░ ░░ ░    ░      ░   ░ ░ 
 ░         ░         ░ ░  ░  ░      ░  ░         ░ 
      ░                                            
*/

	// Connection with the canvas
	let canvas=document.getElementById("dessin");
	let ctx=canvas.getContext("2d");
	
	let lx = 70;// Width of the image in x
	let ly = 70;// Height of the image in y
	let Ox = 40;// Origin of the grid in x
	let Oy = 40;// Origin of the grid in y
	let score = 0; // Score of the game
	let shots = 0; // Shots of the game
	
	let memClickCol = 0;// Memory of the clicked column
	let memClickLine = 0;// Memory of the clicked line
	
	let aPacket = []; // Found paquets table
	
	// Game table
	let aGame = [ [0,3,1,2,1,3],
				[1,0,1,3,0,2],
				[2,2,3,3,1,1],
				[0,3,1,0,1,3],
				[1,3,1,1,2,3],
				[2,1,3,1,2,2],
				[0,0,3,2,3,1]
				];
				
	let aImagesNames=[
		"images/blue_candy.png",
		"images/green_candy.png",
		"images/purple_candy.png",
		"images/orange_candy.png"
		];
	
	// Loeading of the images
	let aImages = [];
	for (i=0;i<aImagesNames.length; i++){
		aImages[i]= new Image();
		aImages[i].src=aImagesNames[i];	
	}
	
	// Calling the drawing function
	setTimeout(fnDrawing,500);
	
	function fnDrawing(){
		// This function will draw all the elements on the game
		for (line=0;line< aGame.length; line++){
			for (column=0;column<aGame[line].length;column++){
				// A little pink square at every case
				let gradient=ctx.createLinearGradient(column*lx+Ox, line*ly+Oy,column*lx+Ox+lx,line*ly+Oy+ly) 
				gradient.addColorStop(0,"lightpink");
				gradient.addColorStop(1,"purple");
				ctx.fillStyle = gradient;	
				ctx.fillRect(column*lx+Ox+2, line*ly+Oy+2,lx-4,ly-4);
				if (aGame[line][column]>=0)
					ctx.drawImage(aImages[aGame[line][column]],column*lx+Ox, line*ly+Oy,lx,ly);
			}
		}
		ctx.fillStyle="purple";
		ctx.font="20pt Georgia";
		ctx.clearRect(200,570,400,80);
		ctx.fillText("Score: " + score, 200, 600);
		ctx.fillText("Shots: " + shots, 200, 630);

		if(shots>=2){
			ctx.clearRect(0,0,canvas.width, canvas.height);

			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle="black";
			ctx.font="15pt Georgia";
			ctx.textAlign="center";
			ctx.fillText("You've already used all your moves!",250,180);
			ctx.fillText("Press F5 for restart the game and maybe try better",250,210);

			ctx.fillStyle="purple";
			ctx.fillText("You've been scored " + score + " points",250,400);
		}
	}
	
	canvas.addEventListener('mousedown', function(evt)
    { var rect = canvas.getBoundingClientRect();
        x=evt.clientX - rect.left;
        y=evt.clientY - rect.top; 
		fnClick(x,y);
    }, false);
	
	function fnClick(x,y){
		let column=Math.floor((x-Ox)/lx);
		let line=Math.floor((y-Oy)/ly);				
		memClickCol=column;
		memClickLine=line;
	}
	
	canvas.addEventListener('mouseup', function(evt)
    { var rect = canvas.getBoundingClientRect();
        x=evt.clientX - rect.left;
        y=evt.clientY - rect.top; 
		fnClickUp(x,y);
    }, false);
	
	function fnClickUp(x,y){
		let column=Math.floor((x-Ox)/lx);
		let line=Math.floor((y-Oy)/ly);				
		fnExchange(memClickCol,memClickLine,column,line);
	}
	
	function fnExchange(col1,line1, col2, line2){
		// This function exchange the emplacement of two cases
		if (shots<=29){
		if ( (col1>=0) && (col1<=5) && (col2>=0) && (col2<=5) &&
			(line1>=0) && (line1<=6) && (line2>=0) && (line2<=6) ){
			let distcol= Math.abs(col2-col1);
			let distline= Math.abs(line2-line1);
			if (distcol+distline==1){
				let temp=aGame[line1][col1];
				aGame[line1][col1]=aGame[line2][col2];
				aGame[line2][col2]=temp;
				fnDrawing();
				let fini=0;
				let n=0;
				let itera=-1;
				shots++;
				while (fini==0){
					aPacket=fnPacketsDetect();
					if (aPacket.length==0) fini=1;
					n+=aPacket.length;
					score+=40*aPacket.length;
					itera++;
					fnRemovePackets();
				}
				console.log("Iteration:" + itera + " cases:" + n);
			}}
		}
		fnDrawing();
	}
	
	function fnRemovePackets(){
		// This function search and find all the packets
		// Then when a packet is found, the function delete it
	
		for (let i=0;i<aPacket.length;i++){
			fnRemoveAndFall(aPacket[i].line,aPacket[i].column);		
		}		
	}
	
	function fnPacketsDetect(){
		// This function search and detect the packets

		let aPacket=[];
		for (line=0; line<=6; line++){
			for (column=0;column<=5; column++){
				let neighborline="";
				let beginneighborline=Math.max(0,column-2);
				let finneighborline=Math.min(5,column+2);
				for (let i=beginneighborline;i<=finneighborline;i++){
					neighborline+=aGame[line][i]
				}

				let neighborcolumn="";
				let beginneighborcolumn=Math.max(0,line-2);
				let finneighborcolumn=Math.min(6,line+2);
				for (let i=beginneighborcolumn;i<=finneighborcolumn;i++){
					neighborcolumn+=aGame[i][column]
				}
				
				searchChain="";
				for (let i=1;i<=3; i++){
					searchChain+=aGame[line][column];
				}

				if ((neighborline.indexOf(searchChain,0)>=0) ||
						(neighborcolumn.indexOf(searchChain,0)>=0)){
					aPacket.push({line,column});
				}
	
			}
		}
		return aPacket;
	}
	
	function fnRemoveAndFall(line, column){
		// This function will make fall the cases like a real candy crush

		for (let li=line;li>=1; li--){
			aGame[li][column]=aGame[li-1][column]
			ctx.fillStyle="gray";
			ctx.fillRect(column*lx+Ox-2, li*ly+Oy-2,lx+4,ly+4);
		}
		aGame[0][column]=Math.floor(Math.random()*4);
		ctx.fillRect(Ox+column*lx-2,Oy-2,lx+4,ly+4);
	}
