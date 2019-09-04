//operation.js
//
function ActionHooker(radius, position, onLeftClick, onRightClick, onHover){
   this.radius = radius;
   this.position = position;
   this.onLeftClick = onLeftClick;
   this.onRightClick = onRightClick;
   this.onHover = onHover;
};

ActionHooker.prototype.onPositionUpdate = function(position) {
   this.position = position;
};



ActionDetector = function(canvas, onRightClick, onClick) {
   let container = document.getElementById("container")
   /*const gridSize = 100;
   this.gridSize={
      width: Math.floor(canvas.width/gridSize),
      height: Math.floor(canvas.height/gridSize),
   };
   this.grids=Array(this.gridSize);*/
   this.size = {
      width: canvas.width,
      height: canvas.height
   };
   this.onContextMenuCallback = (e)=>{
      let rect=canvas.getBoundingClientRect();
      onRightClick({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
      });
      e.preventDefault();
   }
   canvas.addEventListener("contextmenu",this.onContextMenuCallback);
   /*canvas.addEventListener("dblclick",(e)=>{
      console.log(e)
   });*/
   this.onClickCallback = (e)=>{
      let rect=canvas.getBoundingClientRect();
      onClick({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
      });
      e.preventDefault();
   };
   canvas.addEventListener("click",this.onClickCallback);
   /*canvas.addEventListener("mousemove",(e)=>{
      console.log(e)
   });*/

   this.stop = function(){
      canvas.removeEventListener("contextmenu",this.onContextMenuCallback);
      canvas.removeEventListener("click",this.onClickCallback);
   }
}