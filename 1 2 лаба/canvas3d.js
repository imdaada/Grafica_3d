var example = document.getElementById("example"),
			    ctx     = example.getContext('2d');
				
let points_3d = [[100, 100, 100],
				[100, 100, -100],
				[100, -100, 100],
				[100, -100, -100],
				[-100, 100, 100],
				[-100, 100, -100],
				[-100, -100, 100],
				[-100, -100, -100]];
				
let list_sm_3d = [[0, 1],
				  [0, 2],
				  [0, 4],
				  [1, 3],
				  [1, 5],
				  [2, 3],
				  [2, 6],
				  [3, 7],
				  [4, 5],
				  [4, 6],
				  [5, 7],
				  [6, 7]];
				  
let poligons_lines = [
				[1, 3, 5, 0],
				[2, 4, 8, 0],
				[1, 6, 9, 2],
				[4, 10, 7, 3],
				[6, 11, 7, 5],
				[8, 11, 10, 9]
				];
				
let poligons_points = [
				[0, 1, 3, 2],
				[0, 1, 4, 5],
				[0, 2, 4, 6],
				[1, 3, 5, 7],
				[2, 3, 6, 7],
				[4, 5, 6, 7]
				];
				  
let screenSize = [500, 500];
let p_3d = 50;
let angleF = Math.PI/4;
let angleT = Math.PI/4;

/* let v_matrix = [[-Math.sin(angleT), -Math.cos(angleF)*Math.cos(angleT), -Math.sin(angleF)*Math.cos(angleT), 0],
				[Math.cos(angleT), -Math.cos(angleF)*Math.sin(angleT), -Math.sin(angleF)*Math.sin(angleT), 0],
				[0, Math.sin(angleF), -Math.cos(angleF), 0],
				[0, 0, p_3d, 1]]; */



//прямоугольная область вывода, можно задать люой выпуклый многоугольник, по идее, но тогда и нормали и ксторонам надо менять
let windowView = [[-250, -250],
				  [-250, -250],
				  [250, 250],
				[250, 250]];
				
//левый, верхний, правый, нижний нормали к сторонам
let vectNorm = [[1, 0],
				[0, 1],
				[-1, 0],
				[0, -1]]
				
function color_poligon(poligon_lines, list_sm_3d, points_3d, color) {
	let sred = [screenSize[0]/2, screenSize[1]/2];
	//ctx.strokeStyle = '#B70A02';
	ctx.fillStyle = "rgba("+color[0]+","+color[1]+","+color[2]+","+color[3]+")";
	ctx.beginPath();
	ctx.moveTo(points_3d[list_sm_3d[poligon_lines[0]][0]][0] +sred[0], -points_3d[list_sm_3d[poligon_lines[0]][0]][1]+sred[0]);
	
	for (let i=0; i<poligon_lines.length; i++) {
		ctx.lineTo(points_3d[list_sm_3d[poligon_lines[i]][1]][0] +sred[0], -points_3d[list_sm_3d[poligon_lines[i]][1]][1]+sred[0]);
	}
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	ctx.strokeStyle = '#000000';
	ctx.fillStyle = '#000000';
}
				
function getPoligonPlane (poligon_points, points_3d) {
	let a = 0;
	let b = 0;
	let c = 0;  
	let d;
	for (let i = 0; i<poligon_points.length - 1; i++) {
		let j;
		if (i === (poligon_points.length - 2)) j = 0;
		else j = i+1;
		a += (points_3d[poligon_points[i]][1] - points_3d[poligon_points[j]][1]) * (points_3d[poligon_points[i]][2] + points_3d[poligon_points[j]][2]);
		b += (points_3d[poligon_points[i]][2] - points_3d[poligon_points[j]][2]) * (points_3d[poligon_points[i]][0] + points_3d[poligon_points[j]][0]);
		c += (points_3d[poligon_points[i]][0] - points_3d[poligon_points[j]][0]) * (points_3d[poligon_points[i]][1] + points_3d[poligon_points[j]][1]);
	}
	d = -1*(a*points_3d[poligon_points[0]][0] + b*points_3d[poligon_points[0]][1] + c*points_3d[poligon_points[0]][2]);
	return [a, b, c, d];
}
				
function vectorXmatrix(a_vector, b_matrix) {
	let result = [];
	for (let i = 0; i<b_matrix.length; i++) {
		let res_i = 0;
		for (let j=0; j<a_vector.length; j++) {
			res_i += a_vector[j]*b_matrix[j][i];
		}
		result.push(res_i);
	}
	return result;
}

function matrixXmatrix(a, b) {
	let result = [];
	for (let i=0; i<a.length; i++)
	{
		result.push(vectorXmatrix(a[i], b));
	}
	return result;
}

function render_3d () {
	let v_matrix = [[-Math.sin(angleT), -Math.cos(angleF)*Math.cos(angleT), -Math.sin(angleF)*Math.cos(angleT), 0],
				[Math.cos(angleT), -Math.cos(angleF)*Math.sin(angleT), -Math.sin(angleF)*Math.sin(angleT), 0],
				[0, Math.sin(angleF), -Math.cos(angleF), 0],
				[0, 0, p_3d, 1]];
	let points_2d = [];
	for (let i = 0; i<points_3d.length; i++) {
		let current_point = vectorXmatrix([points_3d[i][0], points_3d[i][1], points_3d[i][2], 1], v_matrix);
		points_2d.push([(current_point[0]/current_point[2])*p_3d*10, (current_point[1]/current_point[2])*p_3d*10]);
	}
	//render(points_2d, list_sm_3d); 
	
	let points_preobr= [];
	for (let i = 0; i<points_3d.length; i++) {
		let current_point = vectorXmatrix([points_3d[i][0], points_3d[i][1], points_3d[i][2], 1], v_matrix);
		points_preobr.push([(current_point[0]/current_point[2])*p_3d*30, (current_point[1]/current_point[2])*p_3d*30, current_point[2]]);
	}
	console.log(points_preobr);
	let poligon_planes = [];
	
	for (let i=0; i<poligons_points.length; i++) {
		poligon_planes.push(getPoligonPlane(poligons_points[i], points_preobr));
	}
	//console.log(poligon_planes[0]);
	let x_ins = 0;
	let y_ins = 0;
	let z_ins = 0;
	for (let i = 0; i<points_preobr.length; i++) {
		x_ins += points_preobr[i][0];
		y_ins += points_preobr[i][1];
		z_ins += points_preobr[i][2];
	}
	x_ins = x_ins / points_preobr.length;
	y_ins = y_ins / points_preobr.length;
	z_ins = z_ins / points_preobr.length;
	
	for (let i=0; i<poligon_planes.length; i++) {
		if (poligon_planes[i][0]*x_ins + poligon_planes[i][1]*y_ins + poligon_planes[i][2]*z_ins + poligon_planes[i][3] < 0) {
			for (let j = 0; j < poligon_planes[i].length; j++) {
				poligon_planes[i][j] = -poligon_planes[i][j];
			}
		}
	}
	
	let non_face_planes = [];
	for (let i=0; i<poligon_planes.length; i++) {
		if (poligon_planes[i][2] < 0) non_face_planes.push(i);
	}
	
	points_2d = [];
	
	for (let i = 0; i < points_preobr.length; i++) {
		points_2d.push([points_preobr[i][0], points_preobr[i][1]]);
	}
	
	let list_sm_2d = [];
	
	let invisible_lines = [];
	for (let i=0; i<non_face_planes.length; i++)
	{
		for (let j= i+1; j<non_face_planes.length; j++) {
				for (let k =0; k < poligons_lines[non_face_planes[i]].length; k++) {
					for (let t = 0; t < poligons_lines[non_face_planes[j]].length; t++) {
							if (poligons_lines[non_face_planes[i]][k] === poligons_lines[non_face_planes[j]][t]) {
								invisible_lines.push(poligons_lines[non_face_planes[i]][k]);
							}
					}
				}
		}
	}
	
	for (let i = 0; i<list_sm_3d.length; i++)
	{
		let flag = 0;
		for (let j = 0; j<invisible_lines.length; j++) {
			if (i === invisible_lines[j]) {
				flag = 1;
			}
		}
		if (flag === 0) {
			list_sm_2d.push(list_sm_3d[i]);
		}
	}
	console.log (invisible_lines, non_face_planes);
	for (let i=0; i<poligons_lines.length; i++) {
		let flag = 0;
		for (let j=0; j<non_face_planes.length; j++) {
			if (i === non_face_planes[j]) flag = 1;
		}
		if (flag === 0) {
			let r = 2*poligon_planes[i][2]*poligon_planes[i][0]
			color_poligon(poligons_lines[i], list_sm_3d, points_preobr, [0,0,0,0.1+0.000001*r]);
		}
	}
	//color_poligon(poligons_lines[5], list_sm_3d, points_preobr, [0,0,0,1-1/2]);
	render(points_2d, list_sm_2d);
}

function line (x1, x2, y1, y2) {
	let sred = [screenSize[0]/2, screenSize[1]/2];
	ctx.beginPath();
	ctx.moveTo(x1+sred[0], -x2+sred[1]);
	ctx.lineTo(y1+sred[0], -y2+sred[1]);
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

function render(a_point, b_list) {
	let matrix = b_list;
	let points = a_point;
	for (let i=0; i<matrix.length; i++) {
				let x1;
				let x2;
				let	y1;
				let y2;
				x1 = points[matrix[i][0]][0];
				y1 = points[matrix[i][0]][1];
				x2 = points[matrix[i][1]][0];
				y2 = points[matrix[i][1]][1];
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
				line (-250, 250, 250, 250);
				line (250, 250, 250, -250);
				line (250, -250, -250, -250);
				line (-250, -250, -250, 250);
	}
}

let my_img_date;

function start_draw_pixel () {
	 my_img_date = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function draw_pixel (x, y, R_color, G_color, B_color, A_channel) {
	my_img_date.data[4*(x + screenSize[0]/2) + 4*(-y + (screenSize[1]/2))*ctx.canvas.width] = R_color;
	my_img_date.data[4*(x + screenSize[0]/2) + 1 + 4*(-y + (screenSize[1]/2))*ctx.canvas.width] = G_color;
	my_img_date.data[4*(x + screenSize[0]/2) + 2 + 4*(-y + (screenSize[1]/2))*ctx.canvas.width] = B_color;
	my_img_date.data[4*(x + screenSize[0]/2) + 3 + 4*(-y + (screenSize[1]/2))*ctx.canvas.width] = A_channel;
}

function commit_draw_pixel () {
	ctx.putImageData(my_img_date, 0, 0);
}

function start() {
	for(let i = 0; i < points_3d.length; i++) {
		points_3d[i][0] = points_3d[i][0]/100;
		points_3d[i][1] = points_3d[i][1]/100;
		points_3d[i][2] = points_3d[i][2]/100;
		//points_3d[i][0] += 10;
	}
	clean();
	render_3d();
	start_draw_pixel();
	draw_pixel(0, 0, 0, 0, 0, 255);
	draw_pixel(1, 1, 0, 0, 0, 100);
	commit_draw_pixel();
}

function moveRight() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][0] = points[i][0] + 5;
	}
	clean();
	render(points, list_sm);
}

function moveLeft() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][0] = points[i][0] - 5;
	}
	clean();
	render(points, list_sm);
}

function moveDown() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][1] = points[i][1] + 5;
	}
	clean();
	render(points, list_sm);
}

function moveUp() {
	for (let i = 0; i<points.length; i++)
	{
		points[i][1] = points[i][1] - 5;
	}
	clean();
	render(points, list_sm);
}

function routeRight() {
	angleT += Math.PI/12;
	clean();
	render_3d();
}

function routeLeft() {
	angleF += Math.PI/12;
	clean();
	render_3d();
}

function mashPlus() {
	for (let i = 0; i<points_3d.length; i++)
	{
		points_3d[i][0] *= 1.1;
		points_3d[i][1] *= 1.1;
		points_3d[i][2] *= 1.1;
	}
	clean();
	render_3d();
}

function mashMin() {
	for (let i = 0; i<points_3d.length; i++)
	{
		points_3d[i][0] /= 1.1;
		points_3d[i][1] /= 1.1;
		points_3d[i][2] /= 1.1;
	}
	clean();
	render_3d();
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

