var example = document.getElementById("example"),
			    ctx     = example.getContext('2d');
				


class Light {
	constructor(vector, color) {
		this.vector = vector;
		this.color = color;
	}
}

class Kub {
	constructor(cords_center, color) {
		this.cords_center = cords_center;
		this.color = color;
		this.cords_planes = [[0, 0, -1, 1],
							[-1, 0, 0, 1],
							[0, 0, 1, 1],
							[1, 0, 0, 1],
							[0, -1, 0, 1],
							[0, 1, 0, 1]];
		this.cords_planes_xs = [[0, 0, 1],
							[1, 0, 0],
							[0, 0, -1],
							[-1, 0, 0],
							[0, 1, 0],
							[0, -1, 0]];
							
	}
	
	xToXCenter() {
		for (let i=0; i<this.cords_planes.length; i++) {
			this.cords_planes[i][0] = this.cords_planes[i][0]*10000;
			this.cords_planes[i][1] = this.cords_planes[i][1]*10000;
			this.cords_planes[i][2] = this.cords_planes[i][2]*10000;
			this.cords_planes[i][3] = this.cords_planes[i][3]*10000;
		}
		for (let i=0; i<this.cords_planes.length; i++) {
			this.cords_planes[i][0] = this.cords_planes[i][0]*this.cords_planes_xs[i][0]/(this.cords_planes_xs[i][0] + this.cords_center[0]);
			this.cords_planes[i][1] = this.cords_planes[i][1]*this.cords_planes_xs[i][1]/(this.cords_planes_xs[i][1] + this.cords_center[1]);
			this.cords_planes[i][2] = this.cords_planes[i][2]*this.cords_planes_xs[i][2]/(this.cords_planes_xs[i][2] + this.cords_center[2]);
			
			if (((this.cords_planes[i][0] != 0) && (this.cords_planes_xs[i][0] > 0) && (this.cords_planes_xs[i][0] + this.cords_center[0] < 0)) 
				|| ((this.cords_planes[i][0] != 0) && (this.cords_planes_xs[i][0] < 0) && (this.cords_planes_xs[i][0] + this.cords_center[0] > 0)) 
				|| ((this.cords_planes[i][1] != 0) && (this.cords_planes_xs[i][1] > 0) && (this.cords_planes_xs[i][1] + this.cords_center[1] < 0)) 
				|| ((this.cords_planes[i][1] != 0) && (this.cords_planes_xs[i][1] < 0) && (this.cords_planes_xs[i][1] + this.cords_center[1] > 0))
				|| ((this.cords_planes[i][2] != 0) && (this.cords_planes_xs[i][2] > 0) && (this.cords_planes_xs[i][2] + this.cords_center[2] < 0))
				|| ((this.cords_planes[i][2] != 0) && (this.cords_planes_xs[i][2] < 0) && (this.cords_planes_xs[i][2] + this.cords_center[2] > 0))) {
					this.cords_planes[i][0] *= -1;
					this.cords_planes[i][1] *= -1;
					this.cords_planes[i][2] *= -1;
					this.cords_planes[i][3] *= -1;
				}
		}
		console.log(this.cords_planes);
	}
	
	distance (x1, y1, z1, x2, y2, z2) {
		for (let plan of this.cords_planes) {
			let a = plan[0];
			let b = plan[1];
			let c = plan[2];
			let d = plan[3];
			let t = (-d-a*x1-b*y1-c*z1)/(a*(x2-x1)+b*(y2-y1)+c*(z2-z1));
			let x = t*(x2-x1) + x1;
			let y = t*(y2-y1) + y1;
			let z = t*(z2-z1) + z1;
			
			let flag = true;
			for (let plan1 of this.cords_planes) {
				let a1 = plan1[0];
				let b1 = plan1[1];
				let c1 = plan1[2];
				let d1 = plan1[3];
				if (plan1 !== plan) {
				if(a1*x + b1*y + c1*z + d1 <= 0) {
					flag = false;
					break;
				}
				}
				if(a*x1 + b*y1 + c*z1 + d > 0) {
					flag = false;
					break;
				}
				if(a*x2 + b*y2 + c*z2 + d > 0) {
					flag = false;
					break;
				}
				if(a*(x2-x1) + b*(y2-y1) + c*(z2-z1) < 0) {
					flag = false;
					break;
				}
			}
			if (flag) {
				return Math.sqrt((x-x1)*(x-x1) + (y-y1)*(y-y1) + (z-z1)*(z-z1));
			}
		}
		return Infinity;
	}
	ray(x1, y1, z1, x2, y2, z2, lights, objects) {
		for (let plan of this.cords_planes) {
			let a = plan[0];
			let b = plan[1];
			let c = plan[2];
			let d = plan[3];
			let t = (-d-a*x1-b*y1-c*z1)/(a*(x2-x1)+b*(y2-y1)+c*(z2-z1));
			let x = t*(x2-x1) + x1;
			let y = t*(y2-y1) + y1;
			let z = t*(z2-z1) + z1;
			
			let flag = true;
			for (let plan1 of this.cords_planes) {
				let a1 = plan1[0];
				let b1 = plan1[1];
				let c1 = plan1[2];
				let d1 = plan1[3];
				if (plan1 !== plan) {
				if(a1*x + b1*y + c1*z + d1 <= 0) {
					flag = false;
					break;
				}
				}
				if(a*x1 + b*y1 + c*z1 + d > 0) {
					flag = false;
					break;
				}
				if(a*x2 + b*y2 + c*z2 + d > 0) {
					flag = false;
					break;
				}
				if(a*(x2-x1) + b*(y2-y1) + c*(z2-z1) < 0) {
					flag = false;
					break;
				}
			}
			if (flag) {
				let currColor = [0, 0, 0];
				a = -a;
				b = -b;
				c = -c;
				for (let light of lights) {
				//let cosA = (a*(x2-x1)+b*(y2-y1)+c*(z2-z1))/(Math.sqrt(a*a + b*b+c*c)*Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)+(z2-z1)*(z2-z1))); 
				let scalNN =  a*a + b*b+c*c; //скалярное произведение вектора нормали на самого себя
				let scalVN = a*(x2-x1)+b*(y2-y1)+c*(z2-z1); //скалярное произведение вектора нормали на вектор луча
				let vectorRefl = [2*a*scalVN/scalNN - (x2-x1),  2*b*scalVN/scalNN - (y2-y1), 2*c*scalVN/scalNN - (z2-z1)]; //вектор отражения луча
				let cosVN = (a*(light.vector[0])+b*(light.vector[1])+c*(light.vector[2]))
				/(Math.sqrt(a*a + b*b+c*c)*Math.sqrt((light.vector[0]*light.vector[0])+(light.vector[1]*light.vector[1])+(light.vector[2]*light.vector[2]))); //между нормалью и лучем падения
				let cosVRF = ((x2-x1)*(light.vector[0])+(y2-y1)*(light.vector[1])+(z2-z1)*(light.vector[2]))/(Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)+(z2-z1)*(z2-z1))*Math.sqrt((light.vector[0]*light.vector[0])+(light.vector[1]*light.vector[1])+(light.vector[2]*light.vector[2]))); ;
				// между лучем и вектором света
				//cosA = 1.3*cosA + 0.1;
				cosVRF = 0.4*Math.pow(cosVRF, 4);
				cosVN = 0.9*cosVN;
				let colR = currColor[0] + light.color[0]*cosVRF + light.color[0]*cosVN;
				let colB = currColor[1] + light.color[1]*cosVRF + light.color[1]*cosVN;
				let colG = currColor[2] + light.color[2]*cosVRF + light.color[2]*cosVN;
				
				currColor = [colR, colB, colG];
				
				for (let object of objects) {
					if (object.cords_center !== this.cords_center) {
						if (object.distance(x, y, z, x - light.vector[0], y - light.vector[1], z - light.vector[2]) === Infinity) {
							currColor[0] -= light.color[0];
							currColor[1] -= light.color[1];
							currColor[2] -= light.color[2];
							break;
						}
					}
				}
				}
				
				
				if (currColor[0] < 0) currColor[0] = 0;
				if (currColor[1] < 0) currColor[1] = 0;
				if (currColor[2] < 0) currColor[2] = 0;
				
				
				return currColor;}
		}
		return [0, 0, 0, 0];
	}
	mashPlus () {
		for (let plan of this.cords_planes) {
			plan[0] /= 2;
			plan[1] /= 2;
			plan[2] /= 2;
		}
		for (let plan of this.cords_planes_xs) {
			plan[0] *= 2;
			plan[1] *= 2;
			plan[2] *= 2;
		}
	}
	
}

class Reytreiser {
	constructor(screenSize, camPosition, objects, lights) {
		this.screenSize = screenSize;
		this.camPosition = camPosition;
		this.colorPixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
		this.objects = objects;
		this.arrOfAngels = [];
		this.lights = lights;
	}
	
	colorPixelsF() {
		ctx.putImageData(this.colorPixels, 0, 0);
	}
	
	ray(x, y, z, Aangle, Bangle) {
		let colorPix = [0, 0, 0, 255];
		
		let xk = this.camPosition[0];
			let yk = this.camPosition[1];
			let zk = this.camPosition[2];
			
			let xk1 = xk;
			let yk1 = yk;
			let zk1 = zk;
			
			let yp = y;
			let xp = x;
			let zp = z;
			
			let yp1 = yp;
			let xp1 = xp;
			let zp1 = zp;
			/*let rk = Math.sqrt(xk*xk+yk*yk+zk*zk);
			let Fk = Math.acos(zk/rk);
			let fk = Math.PI / 2 - Math.atan(yk/xk);
			yk = rk*Math.sin(Fk + Aangle)*Math.cos(fk + Bangle);
			xk = rk*Math.sin(Fk + Aangle)*Math.sin(fk + Bangle);
			zk = rk*Math.cos(Fk + Aangle);*/
			
			//for (let angels of this.arrOfAngels) {
			
			//let Aangle = angels[0];
			//let Bangle = angels[1];
			xk1 = xk*Math.cos(Aangle)-zk*Math.sin(Aangle) ;
			zk1 = xk*Math.sin(Aangle)+zk*Math.cos(Aangle) ;
			zk = zk1;
			xk = xk1;
			xk1 = xk*Math.cos(Bangle)-yk*Math.sin(Bangle);
			yk1 = xk*Math.sin(Bangle)+yk*Math.cos(Bangle);
			
			//xk = yk;
			//yk = xk;
			
			
			/*let rp = Math.sqrt(xp*xp+yp*yp+zp*zp);
			let Fp = Math.acos(zp/rp);
			let fp = Math.PI / 2 - Math.atan(yp/xp);
			yp = rp*Math.sin(Fp + Aangle)*Math.cos(fp + Bangle);
			xp = rp*Math.sin(Fp + Aangle)*Math.sin(fp + Bangle);
			zp = rp*Math.cos(Fp + Aangle);*/
			
			
			xp1 = xp*Math.cos(Aangle)-zp*Math.sin(Aangle);
			zp1 = xp*Math.sin(Aangle)+zp*Math.cos(Aangle);
			xp = xp1;
			zp = zp1;
			xp1 = xp*Math.cos(Bangle)-yp*Math.sin(Bangle);
			yp1 = xp*Math.sin(Bangle)+yp*Math.cos(Bangle);
			
			//xp = yp1;
			//yp = xp1;
			//}
			let minDsts = this.objects[0].distance(xk1, yk1, zk1, 
			 xp1, yp1, zp1);
			let minObject = this.objects[0]; //объект с минимальным расстоянием от камеры
			 for (let fig of this.objects) {
				 let dsts = fig.distance(xk1, yk1, zk1, 
			 xp1, yp1, zp1);
				if (dsts < minDsts) {
					minDsts = dsts;
					minObject = fig;
				}
			 }
		//for (let fig of this.objects) {
			 let col1 = minObject.ray(xk1, yk1, zk1, 
			 xp1, yp1, zp1, this.lights, this.objects);
			 colorPix[0] += col1[0];
			 colorPix[1] += col1[1];
			 colorPix[2] += col1[2];
		//}
		this.colorPixels.data[4*(x + this.screenSize[0]/2) + 4*(-y + (this.screenSize[1]/2))*ctx.canvas.width] = colorPix[0];
		this.colorPixels.data[4*(x + this.screenSize[0]/2) + 1 + 4*(-y + (this.screenSize[1]/2))*ctx.canvas.width] = colorPix[1];
		this.colorPixels.data[4*(x + this.screenSize[0]/2) + 2 + 4*(-y + (this.screenSize[1]/2))*ctx.canvas.width] = colorPix[2];
		this.colorPixels.data[4*(x + this.screenSize[0]/2) + 3 + 4*(-y + (this.screenSize[1]/2))*ctx.canvas.width] = colorPix[3];
	}
	
	reytraise(Aangle, Bangle) {
		//this.arrOfAngels.push([Aangle, Bangle]);
		for (let x = -this.screenSize[0]/2; x < this.screenSize[0]/2; x++) {
			for (let y = -this.screenSize[1]/2; y < this.screenSize[1]/2; y++) {
				this.ray(x , y, this.camPosition[2]+200, Aangle, Bangle);
			}
		}
		this.colorPixelsF();
	}
}

let lig1 = new Light([0, 0, -1], [255, 0, 0]);
let lig2 = new Light([0, -1, 0], [0, 255, 0]);
let lig3 = new Light([-1, 0, 0], [0, 0, 255]);

let kub2 = new Kub([-320, 50, 100], [0, 0, 0, 0]);
let kub3 = new Kub([-100, -50, 400], [0, 0, 0, 0]);

let ret = new Reytreiser([500, 500], [0, 0, -850], [new Kub([300, 100, 50], [0, 0, 0, 0]), kub2, kub3], [lig1, lig2, lig3]);

ret.objects[0].mashPlus();
ret.objects[0].mashPlus();
ret.objects[0].mashPlus();
ret.objects[0].mashPlus();
ret.objects[0].mashPlus();
ret.objects[0].mashPlus();
ret.objects[0].mashPlus();
ret.objects[0].xToXCenter();

ret.objects[1].mashPlus();
ret.objects[1].mashPlus();
ret.objects[1].mashPlus();
ret.objects[1].mashPlus();
ret.objects[1].mashPlus();
ret.objects[1].mashPlus();
ret.objects[1].mashPlus();
ret.objects[1].xToXCenter();

ret.objects[2].mashPlus();
ret.objects[2].mashPlus();
ret.objects[2].mashPlus();
ret.objects[2].mashPlus();
ret.objects[2].mashPlus();
ret.objects[2].mashPlus();
ret.objects[2].mashPlus();
ret.objects[2].xToXCenter();

let a = Math.PI/1;
let b = Math.PI/1;

ret.reytraise(a, b);




function routeRight() {
	a -= Math.PI/16;
	clean();
	ret.reytraise(a, b);
}

function routeLeft() {
	b -= Math.PI/16;
	clean();
	ret.reytraise(a, b);
}

function clean() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
document.man.routeRigt.addEventListener("click", routeRight);
document.man.routeLeft.addEventListener("click", routeLeft);
document.man.mashPlus.addEventListener("click", mashPlus);
document.man.mashMin.addEventListener("click", mashMin);