var example = document.getElementById("example"),
			    ctx     = example.getContext('2d');
				
				// точки фигуры 4-x угольник
let points = [[10, 200],
				[100, 100],
					[200, 90],
						[200, 200]];
						
let points1 = [[50, 50],
				[60, 100],
					[70, 70]];
						// матрица смежности, лучше было сделать списком смежности,
let matrix = [  [0, 0, 0, 0],
				[1, 0, 0, 0],
				[0, 1, 0 , 0],
				[1, 0, 1, 0]];
				
let matrix1 = [  [0, 0, 0],
				[1, 0, 0],
				[1, 1, 0 ]];


//прямоугольная область вывода, можно задать люой выпуклый многоугольник, по идее, но тогда и нормали и ксторонам надо менять
let windowView = [[40, 40],
				  [40, 40],
				  [300, 300],
				[300, 300]];
				
//левый, верхний, правый, нижний нормали к сторонам
let vectNorm = [[1, 0],
				[0, 1],
				[-1, 0],
				[0, -1]]

function line (x1, x2, y1, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, x2);
	ctx.lineTo(y1, y2);
	ctx.stroke();
	ctx.closePath();
	ctx.save();
}

/*function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}*/
function clean() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function render(a, b) {
	let matrix = b;
	let points = a;
	for (let i=0; i<matrix.length; i++) {
		for (let j=0; j<matrix[i].length; j++) {
			if (matrix[i][j] === 1) {
				let x1;
				let x2;
				let	y1;
				let y2;
				x1 = points[i][0];
				y1 = points[i][1];
				x2 = points[j][0];
				y2 = points[j][1];
				let tmax=0, tmin=1;
				for (let i=0; i<vectNorm.length; i++)
				{
				/*	if ((x1-windowView[0][0])*vectNorm[i][0] + (y1 - windowView[0][1])*vectNorm[i][1] > 0) {
						if(((-(x1-windowView[0][0])*vectNorm[i][0]) + (-(y1-windowView[0][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1])) > tmax) 
							{
								let tmat;
								tmat = ((-(x1-windowView[0][0])*vectNorm[i][0]) + (-(y1-windowView[0][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1]));
								//if (tmat < 1)
									tmax = tmat;
										
							
							}
					} */
					if ((x1-windowView[i][0])*vectNorm[i][0] + (y1 - windowView[i][1])*vectNorm[i][1] < 0) {
						/*if(((-(x1-windowView[1][0])*vectNorm[i][0]) + (-(y1-windowView[1][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1])) < tmin) 
							{
								let tmit;
								tmit = ((-(x1-windowView[1][0])*vectNorm[i][0]) + (-(y1-windowView[1][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1]));
								//if (tmit > 0)
									tmin = tmit;
							}*/
							
						if ((x2-x1)*vectNorm[i][0] + (y2-y1)*vectNorm[i][1] > 0) {
							if(((-(x1-windowView[i][0])*vectNorm[i][0]) + (-(y1-windowView[i][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1])) > tmax) 
							{
								let tmat;
								tmat = ((-(x1-windowView[i][0])*vectNorm[i][0]) + (-(y1-windowView[i][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1]));
								//if (tmat < 1)
									tmax = tmat;
										
							
							}
						}
						else {
							if(((-(x1-windowView[i][0])*vectNorm[i][0]) + (-(y1-windowView[i][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1])) < tmin) 
							{
								let tmit;
								tmit = ((-(x1-windowView[i][0])*vectNorm[i][0]) + (-(y1-windowView[i][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1]));
								//if (tmit > 0)
									tmin = tmit;
							}
						}
					}
					
					
					
					
					if ((x2-windowView[i][0])*vectNorm[i][0] + (y2 - windowView[i][1])*vectNorm[i][1] < 0) {
						/*if(((-(x1-windowView[1][0])*vectNorm[i][0]) + (-(y1-windowView[1][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1])) < tmin) 
							{
								let tmit;
								tmit = ((-(x1-windowView[1][0])*vectNorm[i][0]) + (-(y1-windowView[1][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1]));
								//if (tmit > 0)
									tmin = tmit;
							}*/
							
						if ((x2-x1)*vectNorm[i][0] + (y2-y1)*vectNorm[i][1] > 0) {
							if(((-(x1-windowView[i][0])*vectNorm[i][0]) + (-(y1-windowView[i][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1])) > tmax) 
							{
								let tmat;
								tmat = ((-(x1-windowView[i][0])*vectNorm[i][0]) + (-(y1-windowView[i][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1]));
								//if (tmat < 1)
									tmax = tmat;
										
							
							}
						}
						else {
							if(((-(x1-windowView[i][0])*vectNorm[i][0]) + (-(y1-windowView[i][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1])) < tmin) 
							{
								let tmit;
								tmit = ((-(x1-windowView[i][0])*vectNorm[i][0]) + (-(y1-windowView[i][1])*vectNorm[i][1]))
							/(((x2-x1)*vectNorm[i][0])+((y2-y1)*vectNorm[i][1]));
								//if (tmit > 0)
									tmin = tmit;
							}
						}
					}
					
					
					
				}
				
				if (tmax > 1) tmax = 1;
				if (tmin < 0) tmin = 0;
				// проверяем нетривиальную невидимость прямой
				if (tmax > tmin) tmin = tmax;
				
				let x11;
				let x21;
					x11 = (x2-x1)*tmax + x1;
					x21	= (x2-x1)*tmin + x1;
				
				let y11;
				let y21;
					y11 = (y2-y1)*tmax + y1;
					y21 = (y2-y1)*tmin + y1;
					
					
				console.log(tmax, tmin, x1, x2, y1, y2, x11, x21, y11, y21);
				
				line(x11, y11, x21, y21);
				//line(points[i][0], points[i][1], points[j][0], points[j][1]);
				
				//выводим границы окна
				line (40, 300, 300, 300);
				line (40, 40, 300, 40);
				line (40, 40, 40, 300);
				line (300, 40, 300, 300);
			}
		}
	}
}

function start() {
	//line(400, 410, 422, 422);
	//line(422, 422, 0, 0);
	//setTimeout ( () => {
	//ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); }, 100);
	//line(422, 422, 0, 0);
	clean();
	render(points, matrix);
	render(points1, matrix1);
}

function moveRight() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][0] = points[i][0] + 5;
	}
	clean();
	render(points, matrix);
}

function moveLeft() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][0] = points[i][0] - 5;
	}
	clean();
	render(points, matrix);
}

function moveDown() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][1] = points[i][1] + 5;
	}
	clean();
	render(points, matrix);
}

function moveUp() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][1] = points[i][1] - 5;
	}
	clean();
	render(points, matrix);
}

function routeRight() {
	let x = 0;
	let y = 0;
	let cordSr = [];
	for (let i = 0; i<points.length; i++)
	{
		x += points[i][0];
		y += points[i][1];
	}
	cordSr[0] = x/points.length;
	cordSr[1] = y/points.length;
	for (let i = 0; i<points.length; i++)
	{
		x = points[i][0] - cordSr[0];
		y = points[i][1] - cordSr[1];
		
		//let lenVect = Math.sqrt(x*x + y*y);
			points[i][0] = cordSr[0] + x*Math.cos(Math.PI/12) - y*Math.sin(Math.PI/12);
			points[i][1] = cordSr[1] + x*Math.sin(Math.PI/12) + y*Math.cos(Math.PI/12);
	}
	clean();
	render(points, matrix);
}

function routeLeft() {
	let x = 0;
	let y = 0;
	let cordSr = [];
	for (let i = 0; i<points.length; i++)
	{
		x += points[i][0];
		y += points[i][1];
	}
	cordSr[0] = x/points.length;
	cordSr[1] = y/points.length;
	for (let i = 0; i<points.length; i++)
	{
		x = points[i][0] - cordSr[0];
		y = points[i][1] - cordSr[1];
		
			points[i][0] = cordSr[0] + x*Math.cos(-Math.PI/12) - y*Math.sin(-Math.PI/12);
			points[i][1] = cordSr[1] + x*Math.sin(-Math.PI/12) + y*Math.cos(-Math.PI/12);
	}
	clean();
	render(points, matrix);
}

function mashPlus() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][0] *= 1.1;
		points[i][1] *= 1.1;
	}
	clean();
	render(points, matrix);
}

function mashMin() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][0] /= 1.1;
		points[i][1] /= 1.1;
	}
	clean();
	render(points, matrix);
}

function tab() {
	let x = 0;
	let y = 0;
	let cordSr1 = [];
	for (let i = 0; i<points.length; i++)
	{
		x += points[i][0];
		y += points[i][1];
	}
	cordSr1[0] = x/points.length;
	cordSr1[1] = y/points.length;
	x = 0;
	y = 0;
	let cordSr2 = [];
	for (let i = 0; i<points1.length; i++)
	{
		x += points1[i][0];
		y += points1[i][1];
	}
	cordSr2[0] = x/points1.length;
	cordSr2[1] = y/points1.length;
	x = cordSr2[0] - cordSr1[0];
	y = cordSr2[1] - cordSr1[1];
	for (let i = 0; i<points.length; i++)
	{
		points[i][0] += x;
		points[i][1] += y;
	}
	for (let i = 0; i<points1.length; i++)
	{
		points1[i][0] -= x;
		points1[i][1] -= y;
	}
	clean();
	render(points, matrix);
	render(points1, matrix1);
	
}

document.man.start.addEventListener("click", start);
document.man.right.addEventListener("click", moveRight);
document.man.left.addEventListener("click", moveLeft);
document.man.down.addEventListener("click", moveDown);
document.man.up.addEventListener("click", moveUp);
document.man.routeRigt.addEventListener("click", routeRight);
document.man.routeLeft.addEventListener("click", routeLeft);
document.man.mashPlus.addEventListener("click", mashPlus);
document.man.mashMin.addEventListener("click", mashMin);
document.man.tab.addEventListener("click", tab);

