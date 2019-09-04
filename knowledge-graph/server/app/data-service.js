function DataService() {
   this.init = function() {
      //TODO:
   };

   this.generateGraph = function() {
      // convert to graph

   }
   this.requestGraph = function(searchOption) {
      return new Promise((resolve, reject)=>{
         //TODO: send searchOption to server
         const http = new XMLHttpRequest();
         const url='./api/query?match='+searchOption;
         http.open("GET", url);
         http.send();

         http.onreadystatechange = (e) => {
            if(http.readyState===4){
              //console.log(http);
              //console.log(http.responseText);
              resolve(JSON.parse(http.responseText));
            }
         }
      });
   };

};