function  showCards(){
    var divs = document.getElementsByClassName("amp-dc-card journal-small-270x181");
    var lastChild = divs.length;
    var showcardlist=document.getElementsByClassName("show3cards").length;
    if(lastChild>6 && lastChild%3==0){
        for (var i = 6+showcardlist; i < 9+showcardlist; i++){
           divs[i].className += " show3cards";
        }
    }
   }