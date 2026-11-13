const totalMB=MODS.reduce((a,m)=>a+m.mb,0);
$("m-count").textContent=MODS.length;
$("m-size").textContent=Math.round(totalMB);
$("modlist").innerHTML=MODS.map((m,i)=>`<article class="mod" style="--i:${i}">
  <div class="mod-ic">${m.naam.charAt(0)}</div>
  <div class="mod-t"><h3>${m.naam}</h3><p>${m.uitleg}</p></div>
  <span class="dl">${m.mb} MB</span></article>`).join("");

const ov=$("overlay");
let timer=null;
function open(){
  ov.classList.add("show");$("cancel").textContent="Annuleren";
  $("o-title").textContent="Je download start zo…";
  let s=5;$("count").textContent=s;
  $("o-text").textContent="Even geduld, over 5 seconden begint het downloaden.";
  const ring=$("ringfg");ring.style.animation="none";void ring.getBoundingClientRect();ring.style.animation="";
  timer=setInterval(()=>{s--;if(s<=0){clearInterval(timer);start()}else{$("count").textContent=s;
    $("o-text").textContent=`Even geduld, over ${s} seconde${s===1?"":"n"} begint het downloaden.`}},1000);
}
function close(){clearInterval(timer);ov.classList.remove("show")}
function start(){
  if(MODS_ZIP.includes("JOUW-GITHUB-NAAM")){
    $("count").textContent="!";$("o-title").textContent="Nog niet ingesteld";
    $("o-text").textContent="De downloadlink in mods.js is nog niet ingevuld.";$("cancel").textContent="Sluiten";return;
  }
  $("count").textContent="⬇";$("o-title").textContent="Download gestart!";
  $("o-text").textContent="Pak de zip uit en zet de .jar-bestanden in je .minecraft/mods map.";
  $("cancel").textContent="Sluiten";
  const a=document.createElement("a");a.href=MODS_ZIP;a.download="LastLifeSMP-mods.zip";
  document.body.appendChild(a);a.click();a.remove();
}
$("install").onclick=open;
$("cancel").onclick=close;
addEventListener("keydown",e=>{if(e.key==="Escape"&&ov.classList.contains("show"))close()});
