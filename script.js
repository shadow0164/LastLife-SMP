const BASE="";
const EXT=location.protocol==="file:"?".html":"";   // online: /regels  |  lokaal: regels.html
const PAGES=[["index","Home"],["deelnemers","Deelnemers"],["dead","Dead"],["regels","Regels"],["mods","Mods"],["team","Ons team"],["changelogs","Changelogs"],["inschrijven","Inschrijven"]];
const url=n=>n==="index"?(EXT?"index.html":"/"):(EXT?"":"/")+n+EXT;
const file=location.pathname.split("/").pop().replace(".html","")||"index";
const here=PAGES.some(p=>p[0]===file)?file:(file==="bevestiging"?"inschrijven":file==="contact"?"":"index");

/* Navigatie + footer */
document.body.insertAdjacentHTML("afterbegin",`
<canvas id="embers" aria-hidden="true"></canvas>
<header class="nav">
  <a class="brand" href="${url('index')}"><img src="${BASE}images/logo.png" alt="LastLife logo" onerror="this.style.display='none'"><span>LastLife HardCore SMP</span></a>
  <button class="burger" aria-label="Menu" onclick="document.getElementById('menu').classList.toggle('open')">☰</button>
  <nav><ul id="menu">${PAGES.map(([h,n])=>`<li><a href="${url(h)}" class="${h===here?'active':''}${h==='inschrijven'?' cta':''}">${n}</a></li>`).join("")}</ul></nav>
</header>`);
document.body.insertAdjacentHTML("beforeend",`<footer><div class="foot"><a href="${url('contact')}">Contact</a><a href="https://discord.gg/qHJDhk7SPQ" target="_blank" rel="noopener">Discord</a></div>© 2026 LastLife HardCore SMP · Je hebt maar één leven.</footer>`);

/* Foto lijstje */
function kaart(src,naam,i,rang,cls=""){
  const later=naam==="Later bekend";
  const letter=naam.trim().charAt(0).toUpperCase();
  return `<article class="card ${cls}${later?' later':''}" style="--i:${i}">
    <div class="frame">${later?'<div class="ph">?</div>':`<img src="${src}" alt="${naam}" loading="lazy" onerror="this.parentNode.innerHTML='<div class=ph>${letter}</div>'">`}</div>
    <div class="name">${naam}</div>${rang?`<span class="rank">${rang}</span>`:""}</article>`;
}
const $=id=>document.getElementById(id);
if($("deelnemers")) $("deelnemers").innerHTML=DEELNEMERS.map((n,i)=>kaart(`${BASE}images/${i+1}.png`,n,i)).join("");
if($("dead")) $("dead").innerHTML=DEAD.length?DEAD.map((n,i)=>kaart(`${BASE}images/${i+1}_dead.png`,n,i,"","dead")).join(""):`<div class="empty">Nog niemand dood… Wie is de eerste?</div>`;
if($("staff")) $("staff").innerHTML=STAFF.map((s,i)=>kaart(`${BASE}images/${i+1}_staff.png`,s.naam,i,s.rang)).join("");
if($("log")) $("log").innerHTML=CHANGELOGS.length?CHANGELOGS.map((c,i)=>`<div class="entry ${i===0?'new':''}" style="--i:${i}"><time>${c.datum}</time>${i===0?'<span class="tag">NIEUW</span>':''}<p>${c.tekst}</p></div>`).join(""):`<div class="empty">Nog niks. Seizoen 4 is net begonnen, houd deze pagina in de gaten!</div>`;
if($("log")&&!CHANGELOGS.length) $("log").classList.add("leeg");
if($("regels")) $("regels").innerHTML=REGELS.map((r,i)=>`<article class="rule" style="--i:${i}"><div class="num">${i+1}</div><div><h3>${r.titel}</h3><p>${r.tekst}</p></div></article>`).join("");
if($("n-spelers")) $("n-spelers").textContent=DEELNEMERS.filter(n=>n!=="Later bekend").length;
if($("n-dead")) $("n-dead").textContent=DEAD.length;

/* Embers (vonkjes) */
(function(){
  const c=$("embers"),x=c.getContext("2d");let w,h,p=[];
  const size=()=>{w=c.width=innerWidth;h=c.height=innerHeight};size();addEventListener("resize",size);
  for(let i=0;i<45;i++)p.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2.2+.6,v:Math.random()*.6+.2,d:Math.random()*6});
  (function f(){x.clearRect(0,0,w,h);
    for(const a of p){a.y-=a.v;a.x+=Math.sin(a.y/40+a.d)*.4;if(a.y<-5){a.y=h+5;a.x=Math.random()*w}
      x.beginPath();x.arc(a.x,a.y,a.r,0,7);x.fillStyle=`rgba(255,${100+a.r*30|0},40,${.25+a.r/6})`;x.fill()}
    requestAnimationFrame(f)})();
})();

document.querySelectorAll("a[data-p]").forEach(a=>a.href=url(a.dataset.p));

/* Inschrijfformulier (Formspree) -> eigen bevestigingspagina */
if($("inschrijf")){
  const f=$("inschrijf"),btn=$("verstuur"),fout=$("fout");
  f.addEventListener("submit",async e=>{
    e.preventDefault();fout.textContent="";btn.disabled=true;btn.textContent="Versturen…";
    try{
      const r=await fetch(f.action,{method:"POST",body:new FormData(f),headers:{Accept:"application/json"}});
      if(!r.ok) throw 0;
      location.href=url("bevestiging");
    }catch(_){
      fout.textContent="Er ging iets mis met versturen. Probeer het opnieuw of stuur ons een bericht op Discord.";
      btn.disabled=false;btn.textContent="Inschrijven";
    }
  });
}
