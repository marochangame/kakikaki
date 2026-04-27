let value=50;
const fill=document.getElementById("fill");
const text=document.getElementById("text");

document.body.addEventListener("click", ()=>{
 value+=5;
 if(value>100)value=100;
 fill.style.width=value+"%";

 if(value==100){
  text.innerText="だいすきーー！！";
 }else{
  text.innerText="気持ちいい♡";
 }
});
