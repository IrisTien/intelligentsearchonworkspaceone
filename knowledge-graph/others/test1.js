
org = [{
         id: "y1",
         length: 910,
         extra: 10
      }, {
         id: "y2",
         length: 2300,
         extra: 10
      }, {
         id: "y3",
         length: 1000,
         extra: 0
      }, {
         id: "y4",
         length: 1030,
         extra: 40
      }, {
         id: "y5",
         length: 1110,
         extra: 40
      }, {
         id: "y6",
         length: 1570,
         extra: 0
      },
      //////
      {
         id: "k1",
         length: 260,
         extra: 40
      }, {
         id: "k2",
         length: 540,
         extra: 40
      }, {
         id: "k3",
         length: 2530,
         extra: 0
      }, {
         id: "k4",
         length: 1540,
         extra: 0
      }, {
         id: "k5",
         length: 2790,
         extra: 0
      }, {
         id: "k6",
         length: 990,
         extra: 0
      },
      //////
      {
         id: "b1",
         length: 1470,
         extra: 0
      }, {
         id: "b2",
         length: 350,
         extra: 40
      }, {
         id: "b3",
         length: 300,
         extra: 40
      }, {
         id: "b4",
         length: 790,
         extra: 0
      }, {
         id: "b5",
         length: 260,
         extra: 40
      }, {
         id: "b6",
         length: 400,
         extra: 40
      }, {
         id: "b7",
         length: 1510,
         extra: 0
      }, {
         id: "b8",
         length: 1540,
         extra: 0
      }
   ];
let Edge = function(data) {
   this.length = data.length;
   switch(data.id[0]){
      case "b":
         this.type = "bathroom";
         break;
      case "k":
         this.type = "kitchen";
         break;
      case "y":
         this.type = "balcony";
         break;
   }
   this.id = data.id;
   this.getLength = ()=>{return this.length+this.extra;};
   this.extra = data.extra;
   this.getName=()=>{
      if(this.extra>0){
         return this.length+"+"+this.extra;
      }else {
         return this.length
      }
   };
}

let a = org.map((data)=>{return new Edge(data)});


a = a.sort((a, b) => {
   return b.getLength()-a.getLength();
});
console.log(a);

   totalLength = 3000;

   tolerence = 70;
   binLimit = 8;
   bins = [];

   function IdenticalTypeInBin(type, bin){
      let allIsSame = true;
      for(let j=0;j<bin.contains.length;j++){
         let previousNode = bin.contains[j];
         if(previousNode.type !== type) {
            allIsSame = false;
            break;
         }
      }
      return allIsSame;
   }
   function allTypeInBin(type, bin){
      let hasType={
         bathroom: false,
         kitchen: false,
         balcony: false
      };
      for(let j=0;j<bin.contains.length;j++){
         let previous = bin.contains[j];
         hasType[previous.type] = true;
      }
      return hasType.bathroom && hasType.kitchen && hasType.balcony;
   }
   function getBestFitIn(n1,type) {
      let jumpIfNoBin = false;
      if (bins.length < binLimit/2) {
         return null;
      }
      if(bins.length < binLimit) {
         jumpIfNoBin = true;
      }
      for (let i = 0; i < bins.length; i++) {
         let bin = bins[i];
         if (bin.remains > n1 + tolerence) {
            if(jumpIfNoBin) {
               let allIsSame = IdenticalTypeInBin(type, bin);
               if(allIsSame){
                  return i;
               }
            } else {
               let not3rdInBin = !allTypeInBin(type,bin);
               if(not3rdInBin){
                  return i;
               }
            }
         }
      }
      return null;
   }
   for (let i = 0; i < a.length; i++) {
      let bestfitIn = getBestFitIn(a[i].getLength(),a[i].type);
      if (bestfitIn === null) {
         bins.push({
            remains: totalLength - 10 - (a[i].getLength() + tolerence),
            contains: [a[i]],
            tolerent: tolerence,
            mainType: a[i].type
         });
      } else {
         bins[bestfitIn].contains.push(a[i]);
         bins[bestfitIn].remains -= a[i].getLength() + tolerence;
         bins[bestfitIn].tolerent += tolerence
      }
   }
   console.log(bins);
   console.log(JSON.stringify(bins));


   const convasSize = {
      width: 1024,
      height: 768
   };

   let canvas = document.getElementById("myCanvas");

      canvas.width = convasSize.width;
      canvas.height = convasSize.height;
      canvas.style.width = convasSize.width;
      canvas.style.height = convasSize.height;
   let context = canvas.getContext('2d');


   clearCanvas = function(){
      context.clearRect(0,0,convasSize.width,convasSize.height);
   };
   let colors={
      bathroom: "blue",
      kitchen: "green",
      balcony: "red"
   }
   let textColors={
      bathroom: "yellow",
      kitchen: "yellow",
      balcony: "white"
   }
   drawRectFrame = function(x,y,width, height){
      var ctx = context;
      ctx.rect(x, y, width, height);
   };

      const graphLength= 800;
   drawRect = function(x,y,width, height, type, lengthText, label,hasTail){
      var ctx = context;
      var textColor = textColors[type];
      var color = colors[type];
      ctx.beginPath();

      ctx.fillStyle = color;
      ctx.rect(x, y, width, height);
      ctx.fill();
      /*ctx.fillStyle = "black";
      ctx.rect(x+width, y, Math.round(40.0/3000*graphLength), height);
      ctx.fill();*/

      ctx.fillStyle = "black";
      ctx.font = '18px serif';
      ctx.fillText(label,x+width/2-10,y-3);
      ctx.fillStyle = textColor;
      ctx.font = '14px serif';
      ctx.fillText(lengthText,x+width/2-20,y+height-5);

      ctx.stroke();
      ctx.closePath();

   };
//drawRect(100,100,200,20,"balcony","2230","b1")


   drawLine=function(bin, index){
      const yStart = 100;
      const yStep = 50;
      const xStart = 100;
      const xScale = graphLength/3000.0;

      const lineHeight = 20;

      const y= yStep*index+yStart

      const x = xStart


      //drawRectFrame(x,y,graphLength,lineHeight)
      let accumulatedLength = x;
      let leftLength = bin.tolerent+bin.remains;
      let segmentNumber = bin.contains.length;
      let margin = segmentNumber>1? leftLength/(segmentNumber-1) : leftLength;
      margin*=xScale;

      for(let i=0;i<segmentNumber;i++){
         let element = bin.contains[i];
         let segmentLength = element.getLength()*xScale;
         //console.log(Math.round(accumulatedLength),y+1,Math.round(segmentLength),lineHeight-1,element.type,element.getLength(),element.id,element);
         drawRect(Math.round(accumulatedLength),y+1,Math.round(segmentLength),lineHeight-1,element.type,element.getName(),element.id)

         accumulatedLength += margin+segmentLength;
      }
   }
      //drawLine(bins[4],4)

   for(let i=0;i<bins.length;i++){
      drawLine(bins[i],i)
   }//*/