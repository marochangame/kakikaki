// 100%で寝る機能追加

const friendFill = document.getElementById("friendFill");
const friendValue = document.getElementById("friendValue");
const reactionText = document.getElementById("reactionText");

let friend = 50;
let sleeping = false;

function updateFriend(delta){
  if(sleeping) return;

  friend += delta;
  if(friend > 100) friend = 100;
  if(friend < 0) friend = 0;

  friendFill.style.width = friend + "%";
  friendValue.innerText = friend;

  if(friend === 100){
    sleeping = true;
    reactionText.innerText = "すやぁ…zzz（満足して寝ちゃった）";
  }
}

document.querySelectorAll(".zone").forEach(zone=>{
  zone.addEventListener("pointerdown", ()=>{
    updateFriend(5);
  });
});

document.getElementById("resetBtn").onclick = ()=>{
  friend = 50;
  sleeping = false;
  friendFill.style.width = "50%";
  friendValue.innerText = 50;
  reactionText.innerText = "マロちゃん、なでてほしそう…";
};
