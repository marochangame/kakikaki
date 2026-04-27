
let friend=50;
let sleeping=false;

const fill=document.getElementById("friendFill");
const val=document.getElementById("friendValue");
const txt=document.getElementById("reactionText");

document.querySelector("img").onclick=()=>{
 if(sleeping) return;
 friend+=5;
 if(friend>100) friend=100;

 fill.style.width=friend+"%";
 val.innerText=friend;

 if(friend==100){
  sleeping=true;
  txt.innerText="すやぁ…zzz（満足して寝ちゃった）";
 }else{
  txt.innerText="うれしい♡";
 }
};

document.getElementById("resetBtn").onclick=()=>{
 friend=50;
 sleeping=false;
 fill.style.width="50%";
 val.innerText=50;
 txt.innerText="マロちゃん、なでてほしそう…";
};
