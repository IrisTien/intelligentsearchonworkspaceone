module.exports = (function() {
   let nodes = {};
   let processNode = function(node) {
      let nodeId = getID(node);
      if(!nodes.hasOwnProperty(nodeId)){
         nodes[nodeId]={
            id: nodeId,
            dataType: getType(node),
            properties: getProperties(node),
            connectedTo:[],
            connectedInfo: []
         };
      }
   };
   let processEdge = function(node1, node2, relationship) {
      //console.log(relationship);
      let localNode1 = nodes[getID(node1)];
      let localNode2 = nodes[getID(node2)];
      //console.log(localNode1, localNode2);
      if(!localNode1 || !localNode1) {
         console.error("invalid edge");
         return;
      }
      localNode1.connectedInfo.push({
         connectedID: getID(node2),
         id: relationship.identity.low,
         type: relationship.type,
         properties: relationship.properties
      });

      if(localNode1.connectedTo.indexOf(getID(node2))==-1){
         localNode1.connectedTo.push(getID(node2));
         localNode2.connectedTo.push(getID(node1));
         //console.log("X")
      }
   };

   let convertToArray = function(nodes){
      let array = [];
      let counter = 0;
      let map = {};
      for(let key in nodes) {
         let index = counter;
         counter++;
         array.push(JSON.parse(JSON.stringify(nodes[key])));
         map[key] = index;
      }
      for(let i=0;i<array.length;i++) {
         let node = array[i];
         for(let j=0;j<node.connectedTo.length;j++) {
            node.connectedTo[j] = map[node.connectedTo[j]];
         }
      }
      //TODO: connectedInfo change
      return array;
   }
   let random = function(min,max){
      return Math.random()*(max-min)+min;
   }
   let addAttributes = function() {
      for(let key in nodes) {
         if(nodes.hasOwnProperty(key)){
            let node = nodes[key];

            node.previewData={
               title:"preview",
               content:JSON.stringify(node.properties),
            }
            node.title = node.properties.name || node.properties.title;
            node.url = node.properties.url || node.properties.link;
            node.m = 1;
            node.position = {
               x: random(-2000,2000),
               y: random(-2000,2000),
            };
            node.v = {
               x: 0,
               y: 0,
            };

            node.fixed = false;
            node.removed = false;
            node.type= "leaf";
            if(node.dataType !== "Idea"){
               node.dataType = "person";
            } else {
               node.dataType = "feature";
            }
         }
      }

   };


   let getID= function(node) {
      return node.identity.low;
   }
   let getType= function(node) {
      return node.labels[0];
   }
   let getProperties = function(node){
      return node.properties;
   }
   return {
      requestByMatch: async function(matchString, session) {
         if(!matchString) {
            matchString = 'MATCH p=()-[r:reportTo]->() RETURN p LIMIT 300';
            //'match (p:Person)-[r:reportTo]->(m:Person) return p,m,r;'//
            //'MATCH p=()-[r:DIRECTED]->() RETURN p LIMIT 25'
         }
         const resultPromise = session.run(matchString);

         let result = await resultPromise;
         nodes = {};

         //console.log(result)
         for (let i = 0; i < result.records.length; i++) {

            let singleRecord = result.records[i];
            let node = singleRecord.get(0);
            //console.log(node.segments)
            if(!!node.start && !!node.end){
               //console.log(".")
               processNode(node.start);
               processNode(node.end);
               //console.log(node)
               processEdge(node.start, node.end, node.segments[0].relationship);
            }
         }
         addAttributes();

         //console.log(nodes);
         return nodes;
      }
   };
}());