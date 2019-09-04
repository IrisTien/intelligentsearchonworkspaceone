//dialog.js

let DialogService = function() {
   var dialog = document.getElementById('dialog-model');
   var closeBtn = document.getElementById('close-dialog');
   var returnValue = document.getElementById('return-value');

   var dialogTitle = document.getElementById('dialog-title');
   var dialogMessage = document.getElementById('dialog-message');
   var dialogImage = document.getElementById('dialog-image');
   var transition;

   closeBtn.addEventListener("click", () => {
      dialog.close("closed by user");
      dialog.classList.remove("dialog-active");
      clearTimeout(transition);
   });

   dialog.addEventListener('close', (exitCode) => {
      console.log("dialog closed");
   });

   dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
         dialog.close("closed by cancel");
         dialog.classList.remove("dialog-active");
         clearTimeout(transition);
      }
   });

   let openDialog = (title, properties, url) => {
      dialogTitle.innerHTML = title;
      //dialogMessage.innerHTML = content;
    var tbl=$("<table/>").attr("id","mytable");
    while (dialogMessage.firstChild) {
       dialogMessage.removeChild(dialogMessage.firstChild);
     }
    $(dialogMessage).append(tbl);
    for(var key in properties)
    {
        var tr="<tr>";
        var td1="<td>"+key + ":"+"</td>";
        var td3="<td>"+properties[key]+"</td></tr>";
       $("#mytable").append(tr+td1+td3); 
    }   
      dialogImage.style.display="none";
      if(url){
         dialogImage.src = url;
         dialogImage.onload = ()=>{
            console.log("success to load image for content at " + url);
            dialogImage.style.display="";
         };
         dialogImage.onerror = ()=>{
            console.log("failed to load image for content at " + url);
         };
      }
      dialog.showModal();
      transition = setTimeout(dialog.classList.add('dialog-active'), 0.5);
   }
   return {
      openDialog: openDialog
   };
};