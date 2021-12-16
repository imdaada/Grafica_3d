var example = document.getElementById("example"),
			    ctx     = example.getContext('2d');
				
class Figure {
	constructor(points, sm_lst, z_index) {
		this.points = points;
		this.sm_lst = sm_lst;
		this.z_index = z_index;
		this.points_tmp = points;
		this.norms = [];
		this.center = [0, 0];
		for(let i =0; i<this.points.length; i++)
		{
			this.center[0] += this.points[i][0];
			this.center[1] += this.points[i][1];
		}
		this.center[0] /= this.points.length;
		this.center[1] /= this.points.length;
		
		/*for(let i =0; i<this.sm_lst.length; i++) {
			let x1 = points[this.sm_lst[i][0]][0];
			let y1 = points[this.sm_lst[i][0]][1];
			let x2 = points[this.sm_lst[i][1]][0];
			let y2 = points[this.sm_lst[i][1]][1];
			this.norms.push([y2-y1, -(x2-x1)])
			if (this.norms[i][0]*(this.center[0] - x1) + this.norms[i][1]*(this.center[1] - y1) < 0) {
				this.norms[i][0] *= -1;
				this.norms[i][1] *= -1;
			}
		}*/
		this.countNorms();
	}

	countNorms() {
		this.norms = [];
		for(let i =0; i<this.sm_lst.length; i++) {
			let x1 = this.points[this.sm_lst[i][0]][0];
			let y1 = this.points[this.sm_lst[i][0]][1];
			let x2 = this.points[this.sm_lst[i][1]][0];
			let y2 = this.points[this.sm_lst[i][1]][1];
			this.norms.push([y2-y1, -(x2-x1)])
			if (this.norms[i][0]*(this.center[0] - x1) + this.norms[i][1]*(this.center[1] - y1) < 0) {
				this.norms[i][0] *= -1;
				this.norms[i][1] *= -1;
			}
		}
	}
	countCenter() {
		this.center = [0, 0];
		for(let i =0; i<this.points.length; i++)
		{
			this.center[0] += this.points[i][0];
			this.center[1] += this.points[i][1];
		}
		this.center[0] /= this.points.length;
		this.center[1] /= this.points.length;
	}
	
}

class Render {
	constructor(figures) {
		this.figures = figures;
		this.figures.sort((a, b) => a.z_index - b.z_index);
	}
	
	sortByZIndex() {
		this.figures.sort((a, b) => a.z_index - b.z_index);
	}
	
	render() {
		let figures_tmp = [new Figure([[0, 0]], [[0, 0]], -1)];
		for(let j = 0; j<this.figures.length; j++) {
			
			for (let i =0; i<figures_tmp.length; i++) {
				for (let o=0; o<this.figures[j].sm_lst.length; o++) {
					//console.log('a');
					let tmaxmin = 0;
					let tminmax = 1;
					let x00 = this.figures[j].points[this.figures[j].sm_lst[o][0]][0];
					let y00 = this.figures[j].points[this.figures[j].sm_lst[o][0]][1];
					let x11 = this.figures[j].points[this.figures[j].sm_lst[o][1]][0];
					let y11 = this.figures[j].points[this.figures[j].sm_lst[o][1]][1];
					for (let k=0; k<figures_tmp[i].sm_lst.length; k++) {
						let x0 = figures_tmp[i].points[figures_tmp[i].sm_lst[k][0]][0];
						let y0 = figures_tmp[i].points[figures_tmp[i].sm_lst[k][0]][1];
						let x1 = figures_tmp[i].points[figures_tmp[i].sm_lst[k][1]][0];
						let y1 = figures_tmp[i].points[figures_tmp[i].sm_lst[k][1]][1];
						let t = ((y00-y0)*(x1-x0)-(x00-x0)*(y1-y0)) / ((x11-x00)*(y1-y0)-(y11-y00)*(x1-x0));
						let scalLN = (x11-x00)*figures_tmp[i].norms[k][0] + (y11-y00)*figures_tmp[i].norms[k][1];
						console.log(scalLN);
						if (scalLN > 0) {
							if(t > tmaxmin) tmaxmin = t;
						}
						if (scalLN < 0) {
							if(t < tminmax) tminmax = t;
						}
						if (scalLN === 0) {
							tmaxmin = 999;
							tminmax = 1;
							//line(x00, y00, x11, y11);
							//break;
						}
						
					}
					//if (i===0) break;
					if (tmaxmin > tminmax) {
						line(x00, y00, x11, y11);
						continue;
					}
					if (tmaxmin !== 999) {
						let xmi = (x11-x00)*tmaxmin + x00;
						let ymi = (y11-y00)*tmaxmin + y00;
						let xma = (x11-x00)*tminmax + x00;
						let yma = (y11-y00)*tminmax + y00;
						line(x00, y00, xmi, ymi);
						lineINV(xmi, ymi, xma, yma);
						line(xma, yma, x11, y11);
					}
				}
			}
			figures_tmp.push(this.figures[j]);
		}
	}
	
}


let fig1 = new Figure([[10, 10],
					[300, 300],
					[10, 300]],
					[[0, 1],
					[1, 2],
					[2,0]],
					0);
let fig2 = new Figure([[190, 200],
					[400, 400],
					[20, 400]],
					[[0, 1],
					[1, 2],
					[2,0]],
					1);

let fig3 = new Figure([[100, 200],
					[390, 370],
					[30, 390]],
					[[0, 1],
					[1, 2],
					[2,0]],
					2); 
let render = new Render([fig1, fig2, fig3]);
render.render();


function line (x1, x2, y1, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, x2);
	ctx.lineTo(y1, y2);
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000000';
	ctx.stroke();
	ctx.closePath();
	ctx.save();
}

function lineINV (x1, x2, y1, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, x2);
	ctx.lineTo(y1, y2);
	ctx.lineWidth = 3;
	ctx.strokeStyle = '#1a2edb';
	ctx.stroke();
	ctx.closePath();
	ctx.save();
}
function clean() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
	/*for (let i = 0; i<points.length; i++)
	{
		points[i][0] = points[i][0] + 5;
	}*/
	for (let i = 0; i<fig3.points.length; i++)
	{
		fig3.points[i][0] = fig3.points[i][0] + 5;
	}
	fig3.countCenter();
	fig3.countNorms();
	clean();
	render.render();
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
	for (let i = 0; i<fig3.points.length; i++)
	{
		x += fig3.points[i][0];
		y += fig3.points[i][1];
	}
	cordSr[0] = x/fig3.points.length;
	cordSr[1] = y/fig3.points.length;
	for (let i = 0; i<fig3.points.length; i++)
	{
		x = fig3.points[i][0] - cordSr[0];
		y = fig3.points[i][1] - cordSr[1];
		
		//let lenVect = Math.sqrt(x*x + y*y);
			fig3.points[i][0] = cordSr[0] + x*Math.cos(Math.PI/12) - y*Math.sin(Math.PI/12);
			fig3.points[i][1] = cordSr[1] + x*Math.sin(Math.PI/12) + y*Math.cos(Math.PI/12);
	}
	clean();
	fig3.countNorms();
	render.render();
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
	/*let x = 0;
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
	render(points1, matrix1);*/
	let z = fig1.z_index;
	fig1.z_index = fig3.z_index;
	fig3.z_index = z;
	clean();
	render.sortByZIndex();
	render.render();
	
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

