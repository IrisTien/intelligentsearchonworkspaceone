
let app = null;
let dataService = null;
let dialogService = null;
function App(){
   const radius = 12;
   const iframe = document.getElementById("myIframe");
   const loadingIframe = document.getElementById("loadingIframe");
   let getDistance = function(P1,P2){
      return (P1.x-P2.x)*(P1.x-P2.x) + (P1.y-P2.y)*(P1.y-P2.y)
   };
   this.findCloseNodeAt = (mousePoint)=>{
      for (let i in this.nodes) {
         if(getDistance(this.nodes[i].position, mousePoint) <= radius*radius){
            console.log("node " + i + " found")
            return i;
         }
      }
      return null;
   };
   this.onRightClick=(P)=>{
      let nodeIndex = this.findCloseNodeAt(P);
      console.log("rightClick on " + nodeIndex);
      if(nodeIndex!== null && !!this.nodes[nodeIndex] && this.nodes[nodeIndex].url){
         //window.open(this.nodes[nodeIndex].url);
         console.log("loading url" + this.nodes[nodeIndex].url);
         iframe.src=this.nodes[nodeIndex].url;
         iframe.style.display="none";
         loadingIframe.style.display="";
         iframe.onload = ()=>{
            loadingIframe.style.display="none";
            iframe.style.display="";
         };
      } else {
         iframe.src="./loading.html";
         console.log("hide");
         iframe.style.display="none";
         loadingIframe.style.display="none";
         iframe.onload = ()=>{};
      }
   };
   this.onClick=(P)=>{
      let nodeIndex = this.findCloseNodeAt(P);
      console.log("Click on " + nodeIndex);
      if(nodeIndex!== null && !!this.nodes[nodeIndex] && this.nodes[nodeIndex].previewData){
         //alert(this.nodes[nodeIndex].previewData.content);
         let previewData = this.nodes[nodeIndex].previewData;
         dialogService.openDialog(previewData.title, this.nodes[nodeIndex].properties, previewData.imageURL);
      }
   };
   this.start = function(nodes){
      this.nodes = nodes;
      this.renderer = new Renderer(radius);
      let canvas = this.renderer.init(this.nodes);
      this.actionDetector = new ActionDetector(canvas, this.onRightClick, this.onClick);
   };
   this.stop = function() {
      if(this.renderer){
         this.renderer.stop();
         this.renderer = null;
      }

      if(this.actionDetector){
         this.actionDetector.stop();
         this.actionDetector = null;
      }
   };
}

setTimeout(()=>{
   dataService = new DataService();
   dialogService = new DialogService();
   app = new App();
})
window.onSearch = function(){
   let searchTextElement = document.getElementById("search-bar");
   let searchText = searchTextElement.value;
   console.log("search for: " + searchText);
   app.stop();
   if(searchText){
      dataService.requestGraph(searchText).then((data)=>{
         //app.start(testData);
         app.start(data);
      });
   }
};