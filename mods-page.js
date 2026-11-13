const modUrl=f=>"mods/"+encodeURIComponent(f);
const totalMB=MODS.reduce((a,m)=>a+m.mb,0);
$("m-count").textContent=MODS.length;
$("m-size").textContent=Math.round(totalMB);
$("modlist").innerHTML=MODS.map((m,i)=>`<article class="mod" style="--i:${i}">
  <div class="mod-ic">${m.naam.charAt(0)}</div>
  <div class="mod-t"><h3>${m.naam}</h3><p>${m.uitleg}</p></div>
  <a class="dl" href="${modUrl(m.bestand)}" download="${m.bestand}">${m.mb} MB</a></article>`).join("");

const ov=$("overlay"),ring=$("ringfg"),bar=$("bar"),fill=$("barfill");
let timer=null,cancelled=false,busy=false;

function open(){
  cancelled=false;busy=true;ov.classList.add("show");bar.classList.remove("show");fill.style.width="0";
  $("o-title").textContent="Je download start zo…";
  let s=5;$("count").textContent=s;$("count").style.display="";
  $("o-text").textContent="Even geduld, over 5 seconden begint het downloaden.";
  ring.style.animation="none";void ring.getBoundingClientRect();ring.style.animation="";
  timer=setInterval(()=>{s--;if(s<=0){clearInterval(timer);start()}else{$("count").textContent=s;
    $("o-text").textContent=`Even geduld, over ${s} seconde${s===1?"":"n"} begint het downloaden.`}},1000);
}
function close(){clearInterval(timer);cancelled=true;busy=false;ov.classList.remove("show")}

async function start(){
  $("count").textContent="⬇";$("o-title").textContent="Mods worden ingepakt…";
  $("o-text").textContent="Niet afsluiten, dit duurt even.";bar.classList.add("show");
  try{
    if(!window.JSZip) throw new Error("JSZip");
    const zip=new JSZip();let done=0;
    for(const m of MODS){
      if(cancelled) return;
      const r=await fetch(modUrl(m.bestand));
      if(!r.ok) throw new Error(m.bestand);
      zip.file("mods_lastlifesmp/"+m.bestand,await r.arrayBuffer(),{binary:true});
      done+=m.mb;fill.style.width=Math.round(done/totalMB*90)+"%";
      $("o-text").textContent=`${m.naam} ✓`;
    }
    const blob=await zip.generateAsync({type:"blob",compression:"STORE"},md=>{fill.style.width=(90+md.percent/10)+"%"});
    if(cancelled) return;
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="LastLifeSMP-mods.zip";
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),60000);
    fill.style.width="100%";$("count").textContent="✓";$("o-title").textContent="Klaar! Download gestart";
    $("o-text").textContent="Pak de zip uit en zet de .jar-bestanden in je mods map.";
    $("cancel").textContent="Sluiten";busy=false;
  }catch(e){
    $("count").textContent="!";$("o-title").textContent="Automatisch downloaden lukte niet";
    $("o-text").textContent="Download de mods hieronder los, één voor één.";bar.classList.remove("show");
    $("cancel").textContent="Sluiten";busy=false;
  }
}
$("install").onclick=()=>{$("cancel").textContent="Annuleren";open()};
$("cancel").onclick=close;
addEventListener("keydown",e=>{if(e.key==="Escape"&&ov.classList.contains("show"))close()});
