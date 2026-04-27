let value=50;
let soundOn=true;

const fill=document.getElementById("fill");
const text=document.getElementById("text");

document.querySelectorAll(".zone").forEach(zone=>{
 zone.addEventListener("click",(e)=>{
  let type=zone.dataset.type;

  if(type==="forehead"){
    value+=7;
    text.innerText="おでこだいすきーー♡";
  }else{
    value+=3;
    text.innerText="気持ちいい♡";
  }

  if(value>100)value=100;

  fill.style.width=value+"%";

  if(value===100){
    text.innerText="だいすきーーー！！！♡";
  }
 });
});

document.getElementById("resetBtn").onclick=()=>{
 value=50;
 fill.style.width="50%";
 text.innerText="マロちゃん、なでてほしそう…";
};
