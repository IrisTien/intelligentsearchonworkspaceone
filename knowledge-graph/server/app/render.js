function node(name, properties) {
   this.name = name;
   this.properties = properties;
}

function edge(name, properties, relationPicker) {
   this.name = name;
   this.properties = properties;
   this.relationPicker = relationPicker;
}
/*
function Model() {
   this.renderer = new Renderer();
   this.renderer.init();
}

new Model();*/

//F_damping(i)=-cvi
//F_elastic(i,j)=k*d(i,j)
//F_Coulomb(i,j) = (k_map(typei,typej)/r(i,j))^2
//F_Bound(i) = g*mi*r(i,rect0)^2 // weaken version
//F_Gravity(i) = G*r(i,rect0)
let types = ["bug", "feature", "document", "person", "jira", "git", "review"];
let iconsPathes = {
   "bug": "bug.jpeg",
   "document": "spec.png",
   "git": "git.png",
   "person": "person.jpg",
   "jira": "task.jpg",
   "review": "review.jpeg",
   "feature": "feature.png"
};
let iconsAdjustFactor = {
   "bug": 1.2,
   "document": 0.9,
   "git": 1.3,
   "person": 1.75,
   "jira": 1,
   "review": 1,
   "feature": 0.95
};
let colors = {
   "bug": "red",
   "document": "blue",
   "git": "yellow",
   "person": "blue",
   "jira": "green",
   "review": "pink",
   "feature": "yellow"
}
let icons = {};

const baseCanvasScale = 1.0;
let canvasScale = baseCanvasScale;//TODO: base/500

setTimeout(() => {
   for (let key in iconsPathes) {
      if (iconsPathes.hasOwnProperty(key)) {
         (function() {
            let copiedKey = key;
            var tempImage = document.createElement('img');
            tempImage.src = "./icons/" + iconsPathes[key];
            tempImage.onload = function() {
               icons[copiedKey] = tempImage;
            };
         })();
      }
   }
}, 0);
let NodeTypes = ["center", "leaf"];

function Renderer(radius) {
   const convasSize = {
      width: 768,
      height: 768
   };
   this.canvas = document.getElementById("myCanvas");
   this.context = this.canvas.getContext('2d');
   //============================================================
   const targetDistance = 50;
   const targetSeperation = 200;
   const g = 0.1;
   const G = 0.1;
   const MaxForce = 1000;
   let norm2 = function(vector) {
      return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
   };

   this.isSkipElastic = function(nodeA, nodeB) {
      if (!this.lossLines) {
         return false;
      }
      for (let i = 0; i < this.lossLines.length; i++) {
         let lossLine = this.lossLines[i];
         if ((lossLine.P1 === nodeA.id && lossLine.P2 === nodeB.id) ||
            (lossLine.P1 === nodeB.id && lossLine.P2 === nodeA.id)) {
            return true;
         }
      }
      return false;
   };
   this.getElastic = function(nodeA, nodeB) {

      const k = 1 / targetDistance;
      let r = {
         x: nodeB.position.x - nodeA.position.x,
         y: nodeB.position.y - nodeA.position.y,
      };

      if (this.isSkipElastic(nodeA, nodeB)) {
         // this is not typo
         return {
            x: 6 * (r.y / norm2(r)) + 1 / k * -1 / r.y,
            y: 6 * (-r.x / norm2(r)) + 1 / k * -1 / r.x
         };
      }
      return {
         x: k * r.x,
         y: k * r.y
      };
   };
   this.applyElastic = function(node) {
      let F = {
         x: 0,
         y: 0
      };
      for (let i = 0; i < node.connectedTo.length; i++) {
         let anotherNode = this.nodes[node.connectedTo[i]];
         if (!anotherNode) {
            console.error("connect to unknow nodes from", node, node.connectedTo[i])
         }
         let f = this.getElastic(node, anotherNode);
         F = {
            x: F.x + f.x,
            y: F.y + f.y
         };
      }
      return F;
   };
   this.applyDamping = function(node) {
      const c = 0.5;
      return {
         x: -node.v.x * c,
         y: -node.v.y * c
      };
   };

   this.getCoulomb = function(nodeA, nodeB) {
      if (Math.abs(nodeA.position.x - nodeB.position.x) < 0.1 && Math.abs(nodeA.position.y - nodeB.position.y) < 0.1) {
         return {
            x: 50 * (Math.random() - 0.5),
            y: 50 * (Math.random() - 0.5),
         };
      }
      const k_map = {
         center: {
            center: targetSeperation,
            leaf: targetDistance
         },
         leaf: {
            center: targetDistance,
            leaf: targetDistance
         },
      }
      let k = k_map[nodeA.type][nodeB.type];
      if (!(k > 0)) {
         console.error("unkown node type for coulomb");
      }
      let r = {
         x: nodeB.position.x - nodeA.position.x,
         y: nodeB.position.y - nodeA.position.y,
      };
      let direction = {
         x: -r.x / norm2(r),
         y: -r.y / norm2(r),
      }
      let k_r2 = k / norm2(r);
      return {
         x: k_r2 * k_r2 * direction.x,
         y: k_r2 * k_r2 * direction.y
      };
   };
   this.applyCoulomb = function(node) {
      let F = {
         x: 0,
         y: 0
      };
      for (let i in this.nodes) {
         let anotherNode = this.nodes[i];
         if (anotherNode === node) {
            continue;
         }
         let f = this.getCoulomb(node, anotherNode);
         F = {
            x: F.x + f.x,
            y: F.y + f.y
         };
      }
      return F;
   };

   this.applyGravity = function(node) {
      center = {
         x: this.canvas.width / 2,
         y: this.canvas.height / 2
      };
      let dx = (center.x - node.position.x) / 100.0 / canvasScale / canvasScale;
      let dy = (center.y - node.position.y) / 100.0 / canvasScale / canvasScale;
      return {
         x: dx * dx * dx / 10,
         y: dy * dy * dy / 10
      };
   }

   //============================================================

   this.renderingProcess = async function(max, current){
      let currentProgress = current/max;
      let percentage = Math.round(currentProgress*25)*4;
      if(this.lastPercentage !== percentage){
         this.lastPercentage = percentage;
         console.log(percentage);
         await this.rendering(percentage+"%");
      }
   }
   this.deploy= async function(timePhase1, timePhase2, timePhase3, timePhase4){
      let timeStep0 = 0.5; //seconds
      let timeStep = 0.1; //seconds
      this.lastPercentage = -1;
      let totleSteps = timePhase1/timeStep0 + (timePhase2+timePhase3+timePhase4)/timeStep;
      let counter = 0;
      for (t = 0; t < timePhase1; t += timeStep0) {
         this.update(timeStep);
         await this.renderingProcess(totleSteps, counter++);
      }
      for (t = 0; t < timePhase2; t += timeStep) {
         this.update(timeStep);
         await this.renderingProcess(totleSteps, counter++);
      }
      let counter1= 0;
      for (t = 0; t < timePhase3; t += timeStep) {
         if (counter1%10 == 0) {
            this.updateCrossLines();
         }
         this.update(timeStep);
         await this.renderingProcess(totleSteps, counter++);
      }
      for (t = 0; t < timePhase4; t += timeStep) {
         this.update(timeStep);
         await this.renderingProcess(totleSteps, counter++);
      }
   };
   this.rendering = function( extraText){
      return new Promise((resolve)=>{
         setTimeout(()=>{
            this.clearCanvas();

            var context = this.context;

            context.beginPath();
            context.fillStyle = "black";
            context.font = '48px serif';
            context.fillText("rendering: "+ extraText, 300, 300);
            context.stroke();
            resolve();
         });
      });
   }
   this.init = function(nodes) {

      let canvasScale = baseCanvasScale*Math.max(1,Object.keys(nodes).length/200);
      this.canvas.width = convasSize.width*canvasScale;
      this.canvas.height = convasSize.height*canvasScale;
      this.canvas.style.width = convasSize.width;
      this.canvas.style.height = convasSize.height;
      this.nodes = nodes;
      console.log("deploy started");

      this.deploy(50, 0, 60, 200).then(()=>{
         console.log("deploy done");
         this.lossLines = [];
         this.renderTimer = setInterval(() => {
            this.updateDisplay(0.2);
         }, 20);

      });
      return this.canvas;
   }
   this.update = function(timeInterval) {
      let mass = 1;
      //console.log("updating", this.nodes);
      //console.log("updating", this.nodes[0].position, this.nodes[1].position, this.nodes[2].position);
      for (let i in this.nodes) {
         let node_i = this.nodes[i];
         if (node_i.fixed === true) {
            continue;
         }
         let F_elastic = this.applyElastic(node_i);
         let F_damping = this.applyDamping(node_i);
         let F_coulomb = this.applyCoulomb(node_i);
         let F_Gravity = this.applyGravity(node_i);
         //console.log(F_elastic, F_damping, F_coulomb, F_Gravity, this.nodes);
         let F = {
            x: F_elastic.x + F_damping.x + F_coulomb.x + F_Gravity.x,
            y: F_elastic.y + F_damping.y + F_coulomb.y + F_Gravity.y
         };

         let a = {
            x: F.x / node_i.m,
            y: F.y / node_i.m
         };
         let v_start = node_i.v;
         let v_end = {
            x: v_start.x + a.x * timeInterval,
            y: v_start.y + a.y * timeInterval
         };
         let moveDistance = {
            x: (v_start.x + v_end.x) / 2 * timeInterval,
            y: (v_start.y + v_end.y) / 2 * timeInterval
         };

         if (Number.isNaN(moveDistance.x) || Number.isNaN(moveDistance.y)) {
            let a = 1;
            this.applyCoulomb(node_i);
         }
         node_i.v = v_end;
         node_i.position = {
            x: node_i.position.x + moveDistance.x,
            y: node_i.position.y + moveDistance.y
         };
      }
   };
   this.updateDisplay = function(timeInterval) {
      const timeStep = 0.03; //seconds
      for (t = 0; t <= timeInterval - timeStep; t += timeStep) {
         this.update(timeStep);
      }
      this.update(timeInterval - t);
      this.render();
   };
   this.drawCircle = function(x, y, label, dataType) {
      var context = this.context;
      var color = colors[dataType];
      var icon = icons[dataType];

      context.beginPath();
      context.fillStyle = color;
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = '#003300';
      context.stroke();

      if (icon) {
         let ctx = context;
         let tmpCtx = context;

         const innerFactor = 0.85;
         const innerRadius = innerFactor * radius;
         const innerImageFactor = iconsAdjustFactor[dataType];
         tmpCtx.save();
         tmpCtx.beginPath();
         tmpCtx.arc(x, y, innerRadius, 0, Math.PI * 2, true);
         tmpCtx.closePath();
         tmpCtx.clip();

         tmpCtx.drawImage(icon, x - innerRadius * innerImageFactor, y - innerRadius * innerImageFactor, innerRadius * 2.0 * innerImageFactor, innerRadius * 2.0 * innerImageFactor);

         tmpCtx.beginPath();
         tmpCtx.arc(0, 0, 25, 0, Math.PI * 2, true);
         tmpCtx.clip();
         tmpCtx.closePath();
         tmpCtx.restore(); //*/

      }
   };
   this.drawLabel = function(x, y, label, color, icon) {
      var context = this.context;

      context.beginPath();
      context.fillStyle = "black";
      context.font = '10px serif';
      context.fillText(label, x - 20, y - 13);
      context.stroke();
   };
   this.drawLine = function(x1, y1, x2, y2, isRed) {
      var ctx = this.context;
      ctx.beginPath(); // Start a new path
      ctx.moveTo(x1, y1); // Move the pen to (30, 50)
      ctx.lineTo(x2, y2); // Draw a line to (150, 100)

      if (isRed) {
         ctx.strokeStyle = "red";
      } else {
         ctx.strokeStyle = "blue";
      }
      ctx.stroke();
   };
   this.clearCanvas = function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
   };

   function Vector(P1, P2) {
      this.x = P2.x - P1.x;
      this.y = P2.y - P1.y;
   }
   vector_product = function(v1, v2) {
      return v1.x * v2.y - v1.y * v2.x;
   };
   this.iscrossing = function(Pa, Pb, Pc, Pd) {
      let AC = new Vector(Pa, Pc);
      let AD = new Vector(Pa, Pd);
      let BC = new Vector(Pb, Pc);
      let BD = new Vector(Pb, Pd);
      let CA = new Vector(Pc, Pa);
      let CB = new Vector(Pc, Pb);
      let DA = new Vector(Pd, Pa);
      let DB = new Vector(Pd, Pb);
      let com1 = vector_product(AC, AD) * vector_product(BC, BD);
      let com2 = vector_product(CA, CB) * vector_product(DA, DB);
      if (com1 < 0 || com2 < 0) {
         let c = 1;
      }
      return com1 < 0 && com2 < 0; //com1<=0 && com2<=0;
   }
   // P1,P2, crosswith
   this.updateCrossLossMatrix = function(lines) {
      // set this.crosslossMatrix
      for (let i = 0; i < lines.length; i++) {
         let line1 = lines[i];
         let Pa = this.nodes[line1.P1].position;
         let Pb = this.nodes[line1.P2].position;
         for (let j = 0; j < i; j++) {
            let line2 = lines[j];
            let Pc = this.nodes[line2.P1].position;
            let Pd = this.nodes[line2.P2].position;
            if (this.iscrossing(Pa, Pb, Pc, Pd)) {
               line1.crossWith.push(line2);
               line2.crossWith.push(line1);
               //console.log(this.nodes[line1.P1].id, this.nodes[line1.P2].id, this.nodes[line2.P1].id, this.nodes[line2.P2].id)
            }
         }
      }

      this.lossLines = [];
      for (let i = 0; i < lines.length; i++) {
         let line1 = lines[i];
         if (line1.crossWith.length > 0) {
            if (Math.random() > 1 / (1 + line1.crossWith.length)) {
               this.lossLines.push(line1);
            }
         }
      }
   };
   counter = 0;
   this.updateCrossLines = function() {
      let lines = [];
      for (let i in this.nodes) {
         let node = this.nodes[i];
         //this.drawCircle(node.position.x,node.position.y, node.title,colors[node.dataType],icons[node.dataType]);
         for (let j = 0; j < node.connectedTo.length; j++) {
            let k = node.connectedTo[j];
            let anotherNode = this.nodes[k];
            if (1||k > i) {
               //this.drawLine(node.position.x,node.position.y,anotherNode.position.x,anotherNode.position.y);
               lines.push({
                  P1: i,
                  P2: k,
                  crossWith: []
               });
            }
         }
      }
      this.updateCrossLossMatrix(lines);

   };
   this.render = function() {
      this.clearCanvas();
      counter++;
      let lines = [];
      for (let i in this.nodes) {
         let node = this.nodes[i];
         //this.drawCircle(node.position.x,node.position.y, node.title,colors[node.dataType],icons[node.dataType]);
         for (let j = 0; j < node.connectedTo.length; j++) {
            let k = node.connectedTo[j];
            let anotherNode = this.nodes[k];
            if (1||k > i) {
               //this.drawLine(node.position.x,node.position.y,anotherNode.position.x,anotherNode.position.y);
               lines.push({
                  P1: i,
                  P2: k,
                  crossWith: []
               });
            }
         }
      }
      //if (counter > 400 && counter % 1 === 0) {
         //this.updateCrossLossMatrix(lines);
      //}

      let m = 0;
      for (let i in this.nodes) {
         let node = this.nodes[i];
         for (let j = 0; j < node.connectedTo.length; j++) {
            let k = node.connectedTo[j];
            let anotherNode = this.nodes[k];
            if (1||k > i) {
               this.drawLine(node.position.x, node.position.y, anotherNode.position.x, anotherNode.position.y, lines[m].crossWith.length > 0);

               m++;
            }
         }
      }

      for (let i in this.nodes) {
         let node = this.nodes[i];
         this.drawCircle(node.position.x, node.position.y, node.title, node.dataType);
      }
      for (let i in this.nodes) {
         let node = this.nodes[i];
         this.drawLabel(node.position.x, node.position.y, node.title, node.dataType);
      }
   };
   this.stop = function() {
      if(this.renderTimer){
         clearInterval(this.renderTimer);
      }
      this.clearCanvas();
   }
}