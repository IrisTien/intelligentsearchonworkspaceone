

NodeTypes = ["center", "leaf"];
window.testData =[{
         id:0,
         m: 1,
         position: {
            x: 300,
            y: 200
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: true,
         connectedTo: [1, 2],
         removed: false,
         type: "center",
         dataType: "person",
         title:"Jerry Zero",
         url: "https://en.wikipedia.org/wiki/Tom_and_Jerry",
         previewData:{
            title: "Jerry Zero",
            content: "Jerry The initial, known as Jerry Zero, is a senior actor in Tom and Jerry, who died in an accident when playing with Tom the First"
         }
      }, {
         id:1,
         m: 1,
         position: {
            x: 300,
            y: 201
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [0, 2],
         removed: false,
         type: "leaf",
         dataType: "person",
         title:"Jerry One",
         url: "https://en.wikipedia.org/wiki",
         previewData:{
            title: "Jerry 2",
            content: ""
         }
      }, {
         id:2,
         m: 1,
         position: {
            x: 301,
            y: 200
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [0, 1],
         removed: false,
         type: "leaf",
         dataType: "person",
         title:"Jerry Two"
      },{

         id:3,
         m: 1,
         position: {
            x: 300,
            y: 400
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [4, 5],
         removed: false,
         type: "center",
         dataType: "person",
         title:"Tom Two"
      }, {
         id:4,
         m: 1,
         position: {
            x: 300,
            y: 401
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [3,8],
         removed: false,
         type: "leaf",
         dataType: "document",
         title:"LOE of GDPM 2735"
      }, {
         id:5,
         m: 1,
         position: {
            x: 301,
            y: 600
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [3],
         removed: false,
         type: "leaf",
         dataType: "document",
         title:"LOE of DPM 2734"
      }, {
         id:6,
         m: 1,
         position: {
            x: 1300,
            y: 1401
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [7],
         removed: false,
         type: "leaf",
         dataType: "bug",
         title:"234567890"
      }, {

         id:7,
         m: 1,
         position: {
            x: 1301,
            y: 1600
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [6],
         removed: false,
         type: "leaf",
         dataType: "bug",
         title:"234567891"
      }, {
         id:8,
         m: 1,
         position: {
            x: 2300,
            y: 2401
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [4,9,10,11,16,17, 12, 13],
         removed: false,
         type: "leaf",
         dataType: "person",
         title:"Tom One"
      }, {

         id:9,
         m: 1,
         position: {
            x: 1301,
            y: 1600
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [8],
         removed: false,
         type: "leaf",
         dataType: "feature",
         title:"DPM 1234"
      }, {

         id:10,
         m: 1,
         position: {
            x: 2300,
            y: 2401
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [8],
         removed: false,
         type: "leaf",
         dataType: "feature",
         title:"DPM 2234"
      }, {
         id:11,
         m: 1,
         position: {
            x: 1301,
            y: 1600
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [8,12,13],
         removed: false,
         type: "leaf",
         dataType: "git",
         title:"abc12345678"
      }, {
         id:12,
         m: 1,
         position: {
            x: 2300,
            y: 2401
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [8,11,14],
         removed: false,
         type: "leaf",
         dataType: "bug",
         title:"12345678"
      }, {
         id:13,
         m: 1,
         position: {
            x: 1301,
            y: 1600
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [8,11,15],
         removed: false,
         type: "leaf",
         dataType: "bug",
         title:"123456789"
      },{
         id:14,
         m: 1,
         position: {
            x: 1301,
            y: 1600
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [12],
         removed: false,
         type: "leaf",
         dataType: "document",
         title:"KB XXX1"
      },{
         id:15,
         m: 1,
         position: {
            x: 1301,
            y: 1600
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [13],
         removed: false,
         type: "leaf",
         dataType: "document",
         title:"KB XXX2"
      },{
         id:16,
         m: 1,
         position: {
            x: 1301,
            y: 1600
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [8],
         removed: false,
         type: "leaf",
         dataType: "document",
         title:"KB XXX2"
      },{
         id:17,
         m: 1,
         position: {
            x: 1301,
            y: 1600
         },
         v: {
            x: 0,
            y: 0
         },
         fixed: false,
         connectedTo: [8],
         removed: false,
         type: "leaf",
         dataType: "document",
         title:"KB XXX2"
      }];