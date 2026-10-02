/* Dhruv's Birthday Casino — game engine */
(function(){
'use strict';
const D = window.DECKS;

/* ---------- utils ---------- */
const $ = (s, r=document)=>r.querySelector(s);
const esc = s=>String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle = a=>{a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;};
const pick = a=>a[Math.floor(Math.random()*a.length)];
const rint = (lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1));
let toastT;
function toast(msg, ms=2600){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(()=>t.classList.remove('show'), ms);
}

/* ---------- roster ---------- */
let players = [];
function loadPlayers(){ try{ const v = JSON.parse(localStorage.getItem('dbc_players')||'[]'); if(Array.isArray(v)) players = v.filter(x=>typeof x==='string').slice(0,15); }catch(e){} }
function savePlayers(){ try{ localStorage.setItem('dbc_players', JSON.stringify(players)); }catch(e){} }
function renderRoster(){
  const box = $('#pchips'); box.innerHTML = '';
  players.forEach((p,i)=>{
    const c = document.createElement('span'); c.className='pchip';
    c.innerHTML = esc(p)+' <button class="x" aria-label="Remove '+esc(p)+'">×</button>';
    c.querySelector('.x').addEventListener('click', ()=>{ players.splice(i,1); savePlayers(); renderRoster(); });
    box.appendChild(c);
  });
  $('#pcount').textContent = players.length+' / 15 players';
  $('#pempty').hidden = players.length>0;
  $('#pname').disabled = players.length>=15;
  $('#paddbtn').disabled = players.length>=15;
}
function addPlayer(){
  const inp = $('#pname'); const name = inp.value.trim().replace(/\s+/g,' ');
  if(!name) return;
  if(players.length>=15){ toast('Table’s full — 15 max'); return; }
  if(players.some(p=>p.toLowerCase()===name.toLowerCase())){ toast(name+' is already dealt in'); return; }
  players.push(name); savePlayers(); renderRoster(); inp.value=''; inp.focus();
}
function drawNames(n, from){
  const pool = shuffle(from||players); return pool.slice(0, n);
}

/* ---------- cards ---------- */
const SUITS = [['♠','b'],['♥','r'],['♣','b'],['♦','r']];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RVAL = r=>({'A':14,'J':11,'Q':12,'K':13}[r]||+r);
function buildDeck(){ const d=[]; for(const [s,c] of SUITS) for(const r of RANKS) d.push({r,s,c,v:RVAL(r)}); return shuffle(d); }
function cardFrontHTML(card){
  return '<div class="face front '+card.c+'">'
    +'<div class="corner">'+card.r+'<small>'+card.s+'</small></div>'
    +'<div class="corner flip2">'+card.r+'<small>'+card.s+'</small></div>'
    +'<div class="bigsuit">'+card.s+'</div>'
    +'<div class="rankword" id="rankword"></div></div>';
}
function flipCardEl(){
  const w = document.createElement('div'); w.className='deal-zone';
  w.innerHTML = '<div class="pcard" aria-hidden="true">'
    +'<div class="face back"><div class="bmono">D</div></div></div>';
  return w;
}
function dealInto(zone, card, word){
  const pc = zone.querySelector('.pcard');
  pc.classList.remove('flip','glint');
  pc.querySelectorAll('.front').forEach(f=>f.remove());
  pc.insertAdjacentHTML('beforeend', cardFrontHTML(card));
  if(word) pc.querySelector('#rankword').textContent = word;
  requestAnimationFrame(()=>requestAnimationFrame(()=>pc.classList.add('flip','glint')));
}

/* ---------- shared components ---------- */
function needPlayers(body, min, msg){
  if(players.length>=min) return false;
  body.innerHTML = '<div class="howto centered"><b>This table needs at least '+min+' players.</b><br>'
    +(msg||'Add more names to the roster first.')+'</div>'
    +'<button class="chipbtn big" id="gohome">Back to the Floor</button>';
  $('#gohome',body).addEventListener('click', goHome);
  return true;
}
function passScreen(body, name, sub, onReady, btn){
  body.innerHTML = '<p class="kicker-turn">Pass the phone to</p><p class="turn-name">'+esc(name)+'</p>'
    +'<p class="note">'+esc(sub||'No peeking, everyone else.')+'</p>'
    +'<button class="chipbtn big" id="ready">'+esc(btn||'I’m '+name+' — Ready')+'</button>';
  $('#ready',body).addEventListener('click', onReady);
}
function peekEl(who, secretHTML, hint){
  const d = document.createElement('div'); d.className='peek';
  d.setAttribute('role','button'); d.tabIndex=0;
  d.innerHTML = '<div class="hint">'+esc(hint||'Hold to reveal · release to hide')+'</div>'
    +'<div class="who">'+esc(who)+'</div><div class="body-slot"></div>';
  const slot = d.querySelector('.body-slot');
  const open = e=>{ e.preventDefault(); d.classList.add('open'); slot.innerHTML = secretHTML; };
  const close = ()=>{ d.classList.remove('open'); slot.innerHTML=''; };
  d.addEventListener('pointerdown', open);
  d.addEventListener('pointerup', close);
  d.addEventListener('pointercancel', close);
  d.addEventListener('pointerleave', close);
  d.addEventListener('keydown', e=>{ if(e.key===' '||e.key==='Enter'){ open(e); }});
  d.addEventListener('keyup', e=>{ if(e.key===' '||e.key==='Enter'){ close(); }});
  return d;
}
function playerGrid(list, onPick, opts){
  opts = opts||{};
  const g = document.createElement('div'); g.className='pgrid';
  list.forEach(p=>{
    const b = document.createElement('button'); b.className='opt'; b.textContent = p;
    if(opts.dead && opts.dead.includes(p)) b.classList.add('dead');
    b.addEventListener('click', ()=>onPick(p, b));
    g.appendChild(b);
  });
  return g;
}
function ringTimer(container, secs, onEnd){
  const R = 62, C = 2*Math.PI*R;
  container.innerHTML = '<div class="ringwrap" style="position:relative">'
    +'<svg class="ring" viewBox="0 0 140 140"><circle class="bg" cx="70" cy="70" r="'+R+'"/>'
    +'<circle class="fg" cx="70" cy="70" r="'+R+'" stroke-dasharray="'+C+'" stroke-dashoffset="0"/></svg>'
    +'<div class="ringnum" style="position:absolute">'+secs+'</div></div>';
  const fg = container.querySelector('.fg'), num = container.querySelector('.ringnum'), ring = container.querySelector('.ring');
  let left = secs, raf, t0 = performance.now(), stopped = false;
  function tick(now){
    if(stopped) return;
    const el = (now-t0)/1000; left = Math.max(0, secs-el);
    num.textContent = Math.ceil(left);
    fg.style.strokeDashoffset = String(C*(1-left/secs));
    if(left<=3) ring.classList.add('danger');
    if(left<=0){ stopped=true; onEnd&&onEnd(); return; }
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return { stop(){ stopped=true; cancelAnimationFrame(raf); } };
}
function fillNames(text){
  const two = drawNames(2);
  return text.replace(/\{p\}/g, two[0]||'Someone').replace(/\{q\}/g, two[1]||two[0]||'Someone else');
}
function promptCard(cat, text, sub, extraHTML){
  return '<div class="prompt-card"><div class="cat">'+esc(cat)+'</div>'
    +(extraHTML||'')
    +'<div class="ptext'+(text.length>110?' sm':'')+'">'+esc(text)+'</div>'
    +(sub?'<div class="sub">'+esc(sub)+'</div>':'')+'</div>';
}

/* =========================================================
   GAMES
========================================================= */
const GAMES = [];

/* ---------- 1. KINGS CUP ---------- */
GAMES.push({ id:'kings', name:'King’s Cup', pip:['K','♠','b'], hook:'Draw. Obey. Fear the 4th King.', min:2,
start(body){
  let deck = buildDeck(), kings = 0;
  body.innerHTML = '<div class="howto">Put one <b>King’s Cup</b> in the middle. Tap the deck, do what the card says. The 4th King chugs the cup. <b>Khel shuru.</b></div>'
    +'<div id="zone"></div><div id="ruleout"></div>'
    +'<div class="progress-lbl" id="meta"></div>'
    +'<button class="chipbtn big" id="draw">Deal a Card</button>';
  const zone = $('#zone',body); zone.appendChild(flipCardEl());
  const meta = ()=>{ $('#meta',body).textContent = deck.length+' cards left · '+kings+'/4 kings drawn'; };
  meta();
  $('#draw',body).addEventListener('click', ()=>{
    if(!deck.length){ deck = buildDeck(); kings=0; toast('Fresh deck shuffled'); }
    const card = deck.pop();
    const [t, d] = D.kingsRules[card.r];
    dealInto(zone, card, t);
    if(card.r==='K') kings++;
    const kingNow = card.r==='K' && kings===4;
    $('#ruleout',body).innerHTML = '<div class="big-result">'+esc(t)+'</div>'
      +'<p class="verdict">'+esc(d)+'</p>'
      +(kingNow?'<div class="sip-strip">4th King — finish the King’s Cup</div>':'');
    if(kingNow) toast('☠️ FOURTH KING. Bottoms up.');
    meta();
  });
}});

/* ---------- 2. IRISH POKER ---------- */
GAMES.push({ id:'irish', name:'Irish Poker', pip:['A','♥','r'], hook:'4 guesses. Give or take.', min:2,
start(body){
  const order = shuffle(players);
  let deck = buildDeck(), round = 0, idx = 0;
  const hands = {}; order.forEach(p=>hands[p]=[]);
  function draw(){ if(!deck.length) deck = buildDeck(); return deck.pop(); }
  function screen(){
    if(round>=4){
      body.innerHTML = '<div class="big-result">Table Cleared</div><p class="verdict">Four rounds done. Whoever’s still sober, teach us your ways.</p>'
        +'<button class="chipbtn big" id="again">Run It Back</button>';
      $('#again',body).addEventListener('click', ()=>GAMES.find(g=>g.id==='irish').start(body));
      return;
    }
    const rd = D.irish.rounds[round], p = order[idx], hand = hands[p];
    body.innerHTML = '<p class="progress-lbl">Round '+(round+1)+' of 4 · '+esc(rd.sips)+' sips riding</p>'
      +'<p class="kicker-turn">On the table</p><p class="turn-name">'+esc(p)+'</p>'
      +(hand.length?'<p class="note">Your cards so far: '+hand.map(c=>c.r+c.s).join(' · ')+'</p>':'')
      +'<div class="gamehead"><span class="suit b">'+esc(rd.name)+'</span></div>'
      +'<div id="zone"></div><div class="opts" id="opts"></div><div id="res"></div>';
    const zone = $('#zone',body); zone.appendChild(flipCardEl());
    const opts = $('#opts',body);
    rd.opts.forEach((o,i)=>{
      const b = document.createElement('button'); b.className='opt'; b.innerHTML='<span class="ol">'+(i+1)+'</span>'+esc(o);
      b.addEventListener('click', ()=>{
        opts.querySelectorAll('.opt').forEach(x=>x.style.pointerEvents='none');
        const card = draw(); dealInto(zone, card);
        let win=false;
        if(round===0) win = (card.c==='r')===(i===0);
        else if(round===1){ const f=hand[0]; win = card.v===f.v ? false : (card.v>f.v)===(i===0); }
        else if(round===2){ const [a,b2]=[Math.min(hand[0].v,hand[1].v),Math.max(hand[0].v,hand[1].v)];
          const inside = card.v>a && card.v<b2; win = (card.v===a||card.v===b2) ? false : inside===(i===0); }
        else win = rd.opts[i].includes(card.s);
        b.classList.add(win?'correct':'wrong');
        hand.push(card);
        $('#res',body).innerHTML = '<div class="big-result">'+(win?'GIVE '+rd.sips:'DRINK '+rd.sips)+'</div>'
          +'<p class="verdict">'+(win? esc(p)+' hands out '+rd.sips+' sips. Choose your victims.' : esc(p)+' drinks '+rd.sips+'. The house always wins.')+'</p>'
          +'<button class="chipbtn big" id="next">Next</button>';
        $('#next',body).addEventListener('click', ()=>{
          idx++; if(idx>=order.length){ idx=0; round++; } screen();
        });
      });
      opts.appendChild(b);
    });
  }
  screen();
}});

/* ---------- 3. MAFIA ---------- */
GAMES.push({ id:'mafia', name:'Mafia', pip:['A','♣','b'], hook:'The classic. Now with a body count.', min:6,
start(body){
  let dealer=null, playing=[], roles={}, dead=[], night=1;
  const isMafia = p=>roles[p]==='Mafia';
  const alive = ()=>playing.filter(p=>!dead.includes(p));
  function winCheck(){
    const m = alive().filter(isMafia).length, t = alive().length - m;
    if(m===0) return 'town'; if(m>=t) return 'mafia'; return null;
  }
  function endScreen(w){
    body.innerHTML = '<div class="big-result">'+(w==='town'?'Town Wins':'Mafia Wins')+'</div>'
      +'<p class="verdict">'+(w==='town'
        ?'The Mafia is busted — <b>Mafia members finish their drinks.</b>'
        :'The Mafia runs this casino now — <b>everyone else drinks 5.</b>')+'</p>'
      +'<p class="note">Roles: '+playing.map(p=>esc(p)+' — '+roles[p]).join(' · ')+'</p>'
      +'<button class="chipbtn big" id="again">New Game</button>';
    $('#again',body).addEventListener('click', ()=>GAMES.find(g=>g.id==='mafia').start(body));
  }
  // Step 0: pick dealer
  body.innerHTML = '<div class="howto"><b>One player is the Dealer</b> — they run the night, hold the phone, and don’t get a role. Everyone else gets a secret card.</div>'
    +'<p class="kicker-turn">Who’s dealing?</p>';
  body.appendChild(playerGrid(players, p=>{
    dealer = p; playing = players.filter(x=>x!==p);
    const n = playing.length;
    const mafiaN = n<=6?1 : n<=8?2 : n<=11?3 : 4;
    const bag = [];
    for(let i=0;i<mafiaN;i++) bag.push('Mafia');
    if(n>=5) bag.push('Doctor');
    if(n>=6) bag.push('Detective');
    while(bag.length<n) bag.push('Villager');
    const dealt = shuffle(bag);
    playing.forEach((pl,i)=>roles[pl]=dealt[i]);
    dealRoles(0);
  }));
  function roleHTML(r){
    const cls = r==='Mafia'?'role-bad':(r==='Villager'?'role-vill':'role-spec');
    const desc = {Mafia:'Kill by night. Lie by day. There are '+playing.filter(isMafia).length+' of you.',
      Doctor:'Each night, save one person. Yourself included.',
      Detective:'Each night, check one person’s loyalty.',
      Villager:'Find the Mafia. Trust no one. Drink moderately.'}[r];
    return '<div class="secret"><span class="'+cls+'">'+r+'</span></div><div class="sdesc">'+desc+'</div>';
  }
  function dealRoles(i){
    if(i>=playing.length) return nightPhase();
    passScreen(body, playing[i], 'Hold the card to see your role. Then pass on.', ()=>{
      body.innerHTML = '';
      body.appendChild(peekEl(playing[i], roleHTML(roles[playing[i]])));
      const b = document.createElement('button'); b.className='chipbtn big'; b.textContent = i<playing.length-1?'Pass to '+playing[i+1]:'Give the phone to the Dealer';
      b.style.marginTop='14px';
      b.addEventListener('click', ()=>dealRoles(i+1));
      body.appendChild(b);
    });
  }
  function nightPhase(){
    let victim=null, saved=null;
    const hasDoc = alive().some(p=>roles[p]==='Doctor');
    const hasDet = alive().some(p=>roles[p]==='Detective');
    function stepMafia(){
      body.innerHTML = '<p class="kicker-turn">Night '+night+' · Dealer reads aloud</p>'
        +'<div class="howto">“'+esc(pick(D.mafiaFlavor.nightOpen))+'”<br>“'+esc(pick(D.mafiaFlavor.kill))+'”</div>'
        +'<p class="note">Dealer: watch the Mafia’s silent pointing, then tap their target. Only you see this.</p>';
      body.appendChild(playerGrid(alive(), p=>{ victim=p; hasDoc?stepDoc():(hasDet?stepDet():morning()); }));
    }
    function stepDoc(){
      body.innerHTML = '<p class="kicker-turn">Night '+night+'</p>'
        +'<div class="howto">“'+esc(pick(D.mafiaFlavor.doctor))+'”</div>'
        +'<p class="note">Dealer: tap whoever the Doctor saves.</p>';
      body.appendChild(playerGrid(alive(), p=>{ saved=p; hasDet?stepDet():morning(); }));
    }
    function stepDet(){
      body.innerHTML = '<p class="kicker-turn">Night '+night+'</p>'
        +'<div class="howto">“'+esc(pick(D.mafiaFlavor.detective))+'”</div>'
        +'<p class="note">Dealer: tap who the Detective points at, then nod or shake your head.</p>';
      body.appendChild(playerGrid(alive(), (p,btn)=>{
        btn.classList.add(isMafia(p)?'wrong':'correct');
        btn.textContent = p + (isMafia(p)?' — MAFIA':' — clean');
        setTimeout(morning, 1600);
      }));
    }
    function morning(){
      const died = victim && victim!==saved ? victim : null;
      if(died) dead.push(died);
      const w = winCheck();
      body.innerHTML = '<p class="kicker-turn">Morning · Dealer reads aloud</p>'
        +'<div class="howto">“'+esc(died? D.mafiaFlavor.dayDeath[0].replace(/\{v\}/g,died) : pick(D.mafiaFlavor.dayNoDeath))+'”</div>'
        +(died?'<div class="sip-strip">'+esc(died)+' is out — 3 farewell sips</div>':'<div class="sip-strip">Everyone drinks 1 — to survival</div>')
        +'<button class="chipbtn big" id="day">Start the Day Debate</button>';
      $('#day',body).addEventListener('click', ()=> w?endScreen(w):dayPhase());
    }
    stepMafia();
  }
  function dayPhase(){
    body.innerHTML = '<p class="kicker-turn">Day '+night+' · Debate</p>'
      +'<div class="howto">Argue. Accuse. Defend. When the table’s ready, vote someone out — majority rules, dealer breaks ties.</div>'
      +'<div id="timerbox"></div>'
      +'<p class="note">Tap who the town voted out:</p>';
    const tb = $('#timerbox',body); ringTimer(tb, 120, ()=>toast('Time! Vote now.'));
    body.appendChild(playerGrid(alive(), p=>{
      dead.push(p);
      const was = roles[p];
      const w = winCheck();
      body.innerHTML = '<div class="big-result">'+esc(p)+' was '+(was==='Mafia'?'MAFIA':'innocent')+'</div>'
        +'<p class="verdict">'+(was==='Mafia'
          ? esc(p)+' drinks 5 and joins the graveyard. Good riddance.'
          : 'Oops. '+esc(p)+' was a '+was+'. They drink 3 — and the town drinks 2 for the misfire.')+'</p>'
        +'<button class="chipbtn big" id="cont">'+(w?'See the Verdict':'Night Falls Again')+'</button>';
      $('#cont',body).addEventListener('click', ()=>{ if(w) endScreen(w); else { night++; nightPhase(); } });
    }, {dead}));
  }
}});

/* ---------- 4. MR WHITE ---------- */
GAMES.push({ id:'mrwhite', name:'Mr. White', pip:['Q','♦','r'], hook:'One of you got no word at all.', min:4,
start(body){
  const n = players.length;
  const ucN = n>=8?2:1, mwN = n>=5?1:0;
  const [civWord, ucWord] = shuffle(pick(D.mrwhite));
  let order = shuffle(players);
  const roles = {};
  order.forEach(p=>roles[p]='civ');
  const special = shuffle(order).slice(0, ucN+mwN);
  special.forEach((p,i)=>roles[p] = i<ucN?'uc':'mw');
  // speaking order: Mr. White never first
  let speak = shuffle(players);
  while(mwN && roles[speak[0]]==='mw') speak = shuffle(players);
  let out = [];
  const aliveList = ()=>players.filter(p=>!out.includes(p));
  function counts(){ const a=aliveList(); return { bad:a.filter(p=>roles[p]!=='civ').length, civ:a.filter(p=>roles[p]==='civ').length }; }
  function secretHTML(p){
    if(roles[p]==='mw') return '<div class="secret"><span class="role-bad">You are MR. WHITE</span></div><div class="sdesc">You got no word. Listen hard, blend in, survive.</div>';
    const w = roles[p]==='uc'? ucWord : civWord;
    return '<div class="secret">Your word:<br><span class="role-vill">'+esc(w)+'</span></div><div class="sdesc">Describe it in one line each round. Don’t say the word.</div>';
  }
  function deal(i){
    if(i>=order.length) return table();
    passScreen(body, order[i], 'Hold the card to see your secret word.', ()=>{
      body.innerHTML='';
      body.appendChild(peekEl(order[i], secretHTML(order[i])));
      const b=document.createElement('button'); b.className='chipbtn big'; b.style.marginTop='14px';
      b.textContent = i<order.length-1?'Pass to '+order[i+1]:'Start the Round';
      b.addEventListener('click', ()=>deal(i+1));
      body.appendChild(b);
    });
  }
  function table(){
    body.innerHTML = '<div class="howto"><b>Speaking order:</b> '+speak.filter(p=>!out.includes(p)).map(esc).join(' → ')
      +'<br>One clue each, one word of truth at a time. Then vote someone out.</div>'
      +'<p class="note">Tap who the table voted out:</p>';
    body.appendChild(playerGrid(aliveList(), p=>eliminate(p)));
  }
  function eliminate(p){
    out.push(p);
    const r = roles[p];
    if(r==='mw') return mwGuess(p);
    const c = counts();
    let verdict, sips;
    if(r==='uc'){ verdict = esc(p)+' was the <b>UNDERCOVER</b> (word: '+esc(ucWord)+').'; sips = esc(p)+' drinks 4.'; }
    else { verdict = esc(p)+' was an innocent civilian.'; sips = esc(p)+' drinks 2 — and the accusers drink 1 for the bad read.'; }
    let endMsg = null;
    if(c.bad===0) endMsg = 'All impostors are out. <b>Civilians win!</b> Impostors drink 5. The word was “'+esc(civWord)+'”.';
    else if(c.bad>=c.civ) endMsg = 'Impostors outnumber the town. <b>Impostors win!</b> Civilians drink 5. Words: “'+esc(civWord)+'” vs “'+esc(ucWord)+'”.';
    body.innerHTML = '<div class="big-result">'+(r==='uc'?'Caught One!':'Wrong Call')+'</div>'
      +'<p class="verdict">'+verdict+'<br>'+sips+'</p>'
      +(endMsg?'<div class="howto centered">'+endMsg+'</div><button class="chipbtn big" id="again">Play Again</button>'
              :'<button class="chipbtn big" id="next">Next Round of Clues</button>');
    const again = $('#again',body); if(again) again.addEventListener('click', ()=>GAMES.find(g=>g.id==='mrwhite').start(body));
    const next = $('#next',body); if(next) next.addEventListener('click', table);
  }
  function mwGuess(p){
    body.innerHTML = '<div class="big-result">'+esc(p)+' was MR. WHITE</div>'
      +'<p class="verdict">Last chance, '+esc(p)+': guess the civilians’ word and steal the win.</p>'
      +'<input class="numin" id="guess" type="text" placeholder="The word is..." autocomplete="off">'
      +'<button class="chipbtn big" id="go">Lock the Guess</button>';
    $('#go',body).addEventListener('click', ()=>{
      const g = ($('#guess',body).value||'').trim().toLowerCase();
      const hit = g && (g===civWord.toLowerCase() || civWord.toLowerCase().includes(g) && g.length>=Math.min(4,civWord.length));
      const c = counts();
      let endMsg=null;
      if(!hit && c.bad===0) endMsg='That clears the board. <b>Civilians win!</b> Impostors drink 5.';
      body.innerHTML = '<div class="big-result">'+(hit?'MR. WHITE WINS':'Nice Try')+'</div>'
        +'<p class="verdict">'+(hit
          ? 'The word was “'+esc(civWord)+'” — and '+esc(p)+' sniffed it out. <b>Everyone else drinks 4.</b>'
          : 'The word was “'+esc(civWord)+'”. '+esc(p)+' drinks 4 and exits the stage.')+'</p>'
        +(hit||endMsg
          ? (endMsg?'<div class="howto centered">'+endMsg+'</div>':'')+'<button class="chipbtn big" id="again">Play Again</button>'
          : '<button class="chipbtn big" id="next">Keep Playing</button>');
      const again=$('#again',body); if(again) again.addEventListener('click', ()=>GAMES.find(g=>g.id==='mrwhite').start(body));
      const next=$('#next',body); if(next) next.addEventListener('click', table);
    });
  }
  deal(0);
}});

/* ---------- 5. BOLLYWOOD BATTLE ---------- */
GAMES.push({ id:'bolly', name:'Bollywood Battle', pip:['9','♥','r'], hook:'Emoji, dialogue, plots — team war.', min:4,
start(body){
  const ord = shuffle(players);
  const A = ord.filter((_,i)=>i%2===0), B = ord.filter((_,i)=>i%2===1);
  let deck = shuffle([
    ...D.bbEmoji.map(x=>({type:'Guess the movie — emoji',  show:'<div class="emojirow">'+x.e+'</div>', a:x.a})),
    ...D.bbDialogue.map(x=>({type:'Complete the dialogue', show:'<div class="ptext sm">'+esc(x.q)+'</div>', a:x.a, noq:true})),
    ...D.bbPlots.map(x=>({type:'Plot, explained badly',    show:'<div class="ptext sm">'+esc(x.q)+'</div>', a:x.a, noq:true}))
  ]);
  let sA=0, sB=0, turnA=true, timer=null;
  function scorebar(){
    return '<div class="scorebar"><div class="scorebox team-a"><div class="t">Team Shah Rukh</div><div class="v">'+sA+'</div></div>'
      +'<div class="scorebox team-b"><div class="t">Team Salman</div><div class="v">'+sB+'</div></div></div>';
  }
  function roundScreen(){
    if(timer){ timer.stop(); timer=null; }
    if(!deck.length) return endScreen();
    const item = deck.pop();
    const team = turnA?'Team Shah Rukh':'Team Salman';
    body.innerHTML = scorebar()
      +'<p class="kicker-turn">'+esc(team)+' — you’re up ('+deck.length+' cards left)</p>'
      +'<div class="prompt-card"><div class="cat">'+esc(item.type)+'</div>'+item.show+(item.noq?'':'')+'</div>'
      +'<div id="tm"></div>'
      +'<button class="chipbtn quiet big" id="reveal">Reveal Answer</button>'
      +'<div class="btnrow"><button class="chipbtn" id="got">✓ Got It</button><button class="chipbtn red" id="miss">✗ Missed</button></div>';
    timer = ringTimer($('#tm',body), 30, ()=>toast('⏰ Time’s up — reveal it!'));
    $('#reveal',body).addEventListener('click', e=>{
      e.target.outerHTML = '<div class="howto centered"><b>'+esc(item.a)+'</b></div>';
    });
    $('#got',body).addEventListener('click', ()=>{ turnA?sA++:sB++; toast(team+' +1 — other team drinks 1'); turnA=!turnA; roundScreen(); });
    $('#miss',body).addEventListener('click', ()=>{ toast(team+' missed — whole team drinks 2'); turnA=!turnA; roundScreen(); });
  }
  function endScreen(){
    const tie = sA===sB, w = sA>sB?'Team Shah Rukh':'Team Salman', l = sA>sB?'Team Salman':'Team Shah Rukh';
    body.innerHTML = scorebar()
      +'<div class="big-result">'+(tie?'It’s a Tie':w+' Wins')+'</div>'
      +'<p class="verdict">'+(tie?'Both teams drink 3. Bollywood won.' : l+' drinks 5. '+w+' takes a bow.')+'</p>'
      +'<button class="chipbtn big" id="again">Rematch</button>';
    $('#again',body).addEventListener('click', ()=>GAMES.find(g=>g.id==='bolly').start(body));
  }
  body.innerHTML = '<div class="howto"><b>Teams tonight:</b><br><span style="color:var(--red-hi)">♥</span> <b>Team Shah Rukh:</b> '+A.map(esc).join(', ')
    +'<br><span style="color:var(--bone)">♠</span> <b>Team Salman:</b> '+B.map(esc).join(', ')
    +'<ul><li>30 seconds a card, shout-outs allowed</li><li>Got it: other team drinks 1</li><li>Missed: your whole team drinks 2</li><li>Losing team finishes with 5</li></ul></div>'
    +'<button class="chipbtn big" id="go">Lights, Camera, Daaru</button>';
  $('#go',body).addEventListener('click', roundScreen);
}});

/* ---------- 6. TRIVIA ROYALE ---------- */
GAMES.push({ id:'trivia', name:'Trivia Royale', pip:['10','♠','b'], hook:'Wrong answer? That’s 3 sips.', min:2,
start(body){
  let qs = shuffle(D.trivia), i = 0, rota = shuffle(players), ri = 0;
  function next(){
    if(!qs.length){ qs = shuffle(D.trivia); }
    const q = qs.pop(); i++;
    const p = rota[ri++ % rota.length];
    body.innerHTML = '<p class="progress-lbl">Question '+i+' · '+esc(q.c)+'</p>'
      +'<p class="kicker-turn">In the hot seat</p><p class="turn-name">'+esc(p)+'</p>'
      +promptCard(q.c, q.q)
      +'<div class="opts" id="opts"></div><div id="res"></div>';
    const opts=$('#opts',body);
    q.o.forEach((o,oi)=>{
      const b=document.createElement('button'); b.className='opt';
      b.innerHTML='<span class="ol">'+'ABCD'[oi]+'</span>'+esc(o);
      b.addEventListener('click', ()=>{
        opts.querySelectorAll('.opt').forEach((x,xi)=>{ x.style.pointerEvents='none'; if(xi===q.a) x.classList.add('correct'); });
        const win = oi===q.a; if(!win) b.classList.add('wrong');
        $('#res',body).innerHTML = (win
          ?'<div class="sip-strip">Correct — give 2 sips</div>'
          :'<div class="sip-strip">Wrong — '+esc(p)+' drinks 3</div>')
          +'<button class="chipbtn big" id="next">Next Question</button>';
        $('#next',body).addEventListener('click', next);
      });
      opts.appendChild(b);
    });
  }
  next();
}});

/* ---------- 7. NEVER HAVE I EVER ---------- */
GAMES.push({ id:'nhie', name:'Never Have I Ever', pip:['7','♦','r'], hook:'If you’ve done it, drink 2.', min:2,
start(body){
  let deck = shuffle(D.nhie), n=0;
  function next(){
    if(!deck.length){ deck = shuffle(D.nhie); toast('Deck reshuffled — round 2, less innocence'); }
    n++;
    body.innerHTML = '<p class="progress-lbl">Card '+n+'</p>'
      +promptCard('Never Have I Ever', deck.pop())
      +'<div class="sip-strip">Done it? Drink 2. Own it.</div>'
      +'<button class="chipbtn big" id="next">Next Card</button>';
    $('#next',body).addEventListener('click', next);
  }
  next();
}});

/* ---------- 8. MOST LIKELY TO ---------- */
GAMES.push({ id:'mostly', name:'Most Likely To', pip:['8','♣','b'], hook:'On 3, point. Majority drinks.', min:3,
start(body){
  let deck = shuffle(D.mostly), n=0;
  function next(){
    if(!deck.length) deck = shuffle(D.mostly);
    n++;
    body.innerHTML = '<p class="progress-lbl">Card '+n+'</p>'
      +promptCard('Most Likely To', deck.pop(), 'Count 3-2-1 and everyone points. Then tap who got the most fingers.')
      +'<p class="note">Who got pointed at the most?</p>';
    body.appendChild(playerGrid(players, p=>{
      body.innerHTML = '<div class="big-result">'+esc(p)+'</div>'
        +'<div class="sip-strip">The people have spoken — '+esc(p)+' drinks 3</div>'
        +'<button class="chipbtn big" id="next">Next Card</button>';
      $('#next',body).addEventListener('click', next);
    }));
  }
  next();
}});

/* ---------- 9. TRUTH OR DARE ---------- */
GAMES.push({ id:'tod', name:'Truth or Dare', pip:['J','♥','r'], hook:'Refusing costs 5 sips.', min:2,
start(body){
  let truths = shuffle(D.truths), dares = shuffle(D.dares), rota = shuffle(players), ri=0;
  function next(){
    const p = rota[ri++ % rota.length];
    body.innerHTML = '<p class="kicker-turn">The spotlight finds</p><p class="turn-name">'+esc(p)+'</p>'
      +'<div class="btnrow"><button class="chipbtn" id="t">Truth</button><button class="chipbtn red" id="d">Dare</button></div>'
      +'<p class="note">Chicken out later = 5 sips. Choose wisely.</p>';
    $('#t',body).addEventListener('click', ()=>card('Truth'));
    $('#d',body).addEventListener('click', ()=>card('Dare'));
    function card(kind){
      if(!truths.length) truths = shuffle(D.truths);
      if(!dares.length) dares = shuffle(D.dares);
      const text = kind==='Truth'? truths.pop() : dares.pop();
      body.innerHTML = '<p class="kicker-turn">'+esc(p)+' chose</p>'
        +promptCard(kind, text)
        +'<div class="btnrow"><button class="chipbtn" id="done">✓ Did It</button><button class="chipbtn red" id="nope">🐔 Refused — 5 Sips</button></div>';
      $('#done',body).addEventListener('click', ()=>{ toast(p+' survives. Respect.'); next(); });
      $('#nope',body).addEventListener('click', ()=>{ toast(p+' drinks 5. Bawk bawk. 🐔'); next(); });
    }
  }
  next();
}});

/* ---------- 10. ODDS ARE ---------- */
GAMES.push({ id:'odds', name:'Odds Are', pip:['5','♠','b'], hook:'Same number = dare happens.', min:2,
start(body){
  function newRound(){
    const [asker, target] = drawNames(2);
    const dare = pick(D.oddsDares);
    let odds = 5, pick1 = null;
    function setup(){
      body.innerHTML = '<p class="kicker-turn">'+esc(asker)+' challenges</p><p class="turn-name">'+esc(target)+'</p>'
        +promptCard('Odds Are', 'Odds are you’ll '+dare+'.', null)
        +'<p class="note">'+esc(target)+', set your odds — "1 in..."</p>'
        +'<div class="btnrow" style="align-items:center">'
        +'<button class="chipbtn quiet" id="minus">−</button>'
        +'<div class="scorebox" style="flex:1.4"><div class="t">1 in</div><div class="v" id="ov">'+odds+'</div></div>'
        +'<button class="chipbtn quiet" id="plus">+</button></div>'
        +'<button class="chipbtn big" id="lock" style="margin-top:14px">Lock the Odds</button>';
      $('#minus',body).addEventListener('click', ()=>{ odds=Math.max(2,odds-1); $('#ov',body).textContent=odds; });
      $('#plus',body).addEventListener('click', ()=>{ odds=Math.min(10,odds+1); $('#ov',body).textContent=odds; });
      $('#lock',body).addEventListener('click', ()=>entry(target, v=>{ pick1=v;
        passScreen(body, asker, 'Your number stays hidden. Match it and the dare is ON.', ()=>entry(asker, v2=>reveal(v2)));
      }));
    }
    function entry(who, cb){
      body.innerHTML = '<p class="kicker-turn">'+esc(who)+' picks a number</p>'
        +'<p class="note">1 to '+odds+'. On three, both numbers get revealed.</p>'
        +'<div class="pgrid" id="nums"></div>';
      const g=$('#nums',body);
      for(let k=1;k<=odds;k++){
        const b=document.createElement('button'); b.className='opt'; b.textContent=k;
        b.addEventListener('click', ()=>cb(k));
        g.appendChild(b);
      }
    }
    function reveal(pick2){
      const match = pick1===pick2;
      body.innerHTML = '<div class="big-result">'+pick1+' · '+pick2+'</div>'
        +'<p class="verdict">'+(match
          ? '<b>MATCH.</b> '+esc(target)+', the universe has spoken: '+esc(dare)+'. Or finish your drink.'
          : 'No match. '+esc(target)+' escapes. '+esc(asker)+' drinks 2 for the failed manifestation.')+'</p>'
        +(match?'<div class="sip-strip">Dare it or drain it</div>':'')
        +'<button class="chipbtn big" id="next">Next Challenge</button>';
      $('#next',body).addEventListener('click', newRound);
    }
    setup();
  }
  newRound();
}});

/* ---------- 11. FLASH MATCH ---------- */
GAMES.push({ id:'flash', name:'Flash Match', pip:['6','♦','r'], hook:'Spot the common symbol first.', min:2,
start(body){
  function newRound(){
    const [p1, p2] = drawNames(2);
    passScreen(body, p1+' vs '+p2, 'Both of you watch the screen. Two cards share EXACTLY ONE symbol — first to shout it wins.', run, 'We’re Ready');
    function run(){
      let c = 3;
      body.innerHTML = '<div class="big-result" id="cd">3</div>';
      const iv = setInterval(()=>{
        c--; if(c>0){ $('#cd',body).textContent=c; return; }
        clearInterval(iv); show();
      }, 800);
    }
    function show(){
      const pool = shuffle(D.flashSymbols);
      const common = pool[0];
      const cardA = shuffle([common, ...pool.slice(1,6)]);
      const cardB = shuffle([common, ...pool.slice(6,11)]);
      const tilt = ()=>'--tilt:'+rint(-20,20)+'deg';
      body.innerHTML = '<p class="kicker-turn">'+esc(p1)+' vs '+esc(p2)+' — SHOUT IT</p>'
        +'<div class="dualcards">'
        +'<div class="symcard">'+cardA.map(s=>'<span style="'+tilt()+'">'+s+'</span>').join('')+'</div>'
        +'<div class="symcard">'+cardB.map(s=>'<span style="'+tilt()+'">'+s+'</span>').join('')+'</div></div>'
        +'<p class="note">Who shouted the matching symbol first?</p>'
        +'<div class="btnrow"><button class="chipbtn" id="w1">'+esc(p1)+'</button><button class="chipbtn" id="w2">'+esc(p2)+'</button></div>'
        +'<button class="chipbtn quiet big" id="none" style="margin-top:10px">Nobody got it</button>';
      const done = winner=>{
        body.innerHTML = '<div class="big-result">'+common+'</div>'
          +'<p class="verdict">'+(winner
            ? '<b>'+esc(winner)+'</b> takes it — '+esc(winner===p1?p2:p1)+' drinks 3.'
            : 'That was the match. Both of you drink 2 for sleeping on it.')+'</p>'
          +'<button class="chipbtn big" id="next">Next Duel</button>';
        $('#next',body).addEventListener('click', newRound);
      };
      $('#w1',body).addEventListener('click', ()=>done(p1));
      $('#w2',body).addEventListener('click', ()=>done(p2));
      $('#none',body).addEventListener('click', ()=>done(null));
    }
  }
  newRound();
}});

/* ---------- 12. HIGHER OR LOWER ---------- */
GAMES.push({ id:'hilo', name:'Higher or Lower', pip:['2','♣','b'], hook:'Bet sips. Ride the streak.', min:2,
start(body){
  let deck = buildDeck(), rota = shuffle(players), ri=0, streak=0;
  let current = deck.pop();
  function screen(){
    const p = rota[ri % rota.length];
    if(deck.length<2){ deck = buildDeck(); }
    let bet = 2;
    body.innerHTML = '<p class="kicker-turn">At the table</p><p class="turn-name">'+esc(p)+'</p>'
      +(streak>=3?'<div class="sip-strip">🔥 table streak '+streak+' — payouts doubled</div>':'')
      +'<div id="zone"></div>'
      +'<p class="note centered">Bet your sips, then call it.</p>'
      +'<div class="btnrow" style="align-items:center">'
      +'<button class="chipbtn quiet" id="minus">−</button>'
      +'<div class="scorebox" style="flex:1.2"><div class="t">Sips bet</div><div class="v" id="bv">2</div></div>'
      +'<button class="chipbtn quiet" id="plus">+</button></div>'
      +'<div class="btnrow"><button class="chipbtn" id="hi"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 15l7-7 7 7"/></svg> Higher</button>'
      +'<button class="chipbtn red" id="lo"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg> Lower</button></div>'
      +'<div id="res"></div>';
    const zone = $('#zone',body); zone.appendChild(flipCardEl());
    const pc = zone.querySelector('.pcard');
    pc.insertAdjacentHTML('beforeend', cardFrontHTML(current));
    pc.classList.add('flip');
    $('#minus',body).addEventListener('click', ()=>{ bet=Math.max(1,bet-1); $('#bv',body).textContent=bet; });
    $('#plus',body).addEventListener('click', ()=>{ bet=Math.min(6,bet+1); $('#bv',body).textContent=bet; });
    const call = dir=>{
      ['#hi','#lo','#minus','#plus'].forEach(s=>$(s,body).disabled=true);
      const nxt = deck.pop();
      // re-deal animation: flip back then forward with new card
      pc.classList.remove('flip','glint');
      setTimeout(()=>{ dealInto(zone, nxt); }, 300);
      setTimeout(()=>{
        const win = nxt.v===current.v ? false : (nxt.v>current.v)===(dir==='hi');
        const mult = streak>=3?2:1, pay = bet*mult;
        streak = win? streak+1 : 0;
        $('#res',body).innerHTML = '<div class="big-result">'+(win?'GIVE '+pay:'DRINK '+pay)+'</div>'
          +'<p class="verdict">'+(nxt.v===current.v?'Tie goes to the house. ':'')
          +(win? esc(p)+' deals out '+pay+' sips.' : esc(p)+' drinks '+pay+'. The felt is undefeated.')+'</p>'
          +'<button class="chipbtn big" id="next">Next Player</button>';
        current = nxt;
        $('#next',body).addEventListener('click', ()=>{ ri++; screen(); });
      }, 900);
    };
    $('#hi',body).addEventListener('click', ()=>call('hi'));
    $('#lo',body).addEventListener('click', ()=>call('lo'));
  }
  screen();
}});

/* ---------- 13. WHEEL OF FATE ---------- */
GAMES.push({ id:'wheel', name:'Wheel of Fate', pip:['3','♥','r'], hook:'Spin. Pray. Obey the wheel.', min:2,
start(body){
  const N = D.wheel.length, seg = 360/N;
  const colors = ['#C0392B','#0E4A37'];
  let rot = 0, rota = shuffle(players), ri = 0, spinning = false;
  function wheelSVG(){
    let paths='';
    for(let i=0;i<N;i++){
      const a0=(i*seg-90)*Math.PI/180, a1=((i+1)*seg-90)*Math.PI/180;
      const x0=160+150*Math.cos(a0), y0=160+150*Math.sin(a0);
      const x1=160+150*Math.cos(a1), y1=160+150*Math.sin(a1);
      const mid=(i+0.5)*seg-90;
      const tx = (160+102*Math.cos(mid*Math.PI/180)).toFixed(1), ty = (160+102*Math.sin(mid*Math.PI/180)).toFixed(1);
      paths += '<path d="M160 160 L'+x0.toFixed(1)+' '+y0.toFixed(1)+' A150 150 0 0 1 '+x1.toFixed(1)+' '+y1.toFixed(1)+' Z" fill="'+colors[i%2]+'" stroke="#D4AF37" stroke-width="1.5"/>'
        +'<text x="'+tx+'" y="'+ty+'" fill="#F3EBD8" font-size="9.5" font-family="Oswald, sans-serif" text-anchor="middle" dominant-baseline="middle" transform="rotate('+(mid+90)+' '+tx+' '+ty+')">'+esc(D.wheel[i].t)+'</text>';
    }
    return '<svg class="wheel" viewBox="0 0 320 320" aria-label="Wheel of fate">'
      +'<g class="wheel-rotor" id="rotor" style="transform-origin:160px 160px">'+paths
      +'<circle cx="160" cy="160" r="26" fill="#D4AF37"/><circle cx="160" cy="160" r="20" fill="#082B20"/>'
      +'<text x="160" y="166" fill="#F0D98C" font-size="14" font-family="Limelight, serif" text-anchor="middle">D</text></g>'
      +'<circle cx="160" cy="160" r="152" fill="none" stroke="#D4AF37" stroke-width="4"/></svg>';
  }
  function screen(){
    const p = rota[ri % rota.length];
    body.innerHTML = '<p class="kicker-turn">Spinning for</p><p class="turn-name">'+esc(p)+'</p>'
      +'<div class="wheelwrap"><div class="pointer"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M13 30 L2 4 Q13 -3 24 4 Z" fill="#F0D98C" stroke="#8C7426"/></svg></div>'+wheelSVG()+'</div>'
      +'<button class="chipbtn big" id="spin">SPIN</button><div id="res"></div>';
    $('#spin',body).addEventListener('click', ()=>{
      if(spinning) return; spinning = true;
      $('#spin',body).disabled = true;
      const target = rint(0,N-1);
      const spins = rint(5,7);
      // pointer at top: land target's mid at 0deg (top)
      const final = spins*360 + (360 - (target+0.5)*seg);
      rot = final;
      const rotor = $('#rotor',body);
      rotor.style.transform = 'rotate('+rot+'deg)';
      const done = ()=>{
        spinning = false;
        const w = D.wheel[target];
        $('#res',body).innerHTML = '<div class="big-result">'+esc(w.t)+'</div>'
          +'<p class="verdict">'+esc(p)+': '+esc(w.d)+'</p>'
          +'<button class="chipbtn big" id="next">Next Spinner</button>';
        $('#next',body).addEventListener('click', ()=>{ ri++; screen(); });
      };
      rotor.addEventListener('transitionend', done, {once:true});
      setTimeout(()=>{ if(spinning) done(); }, 5200); // safety if transitionend missed
    });
  }
  screen();
}});

/* ---------- 14. CATEGORIES ---------- */
GAMES.push({ id:'cats', name:'Categories', pip:['4','♠','b'], hook:'8 seconds. Blank = drink.', min:3,
start(body){
  let deck = shuffle(D.categories);
  let order = shuffle(players), idx = 0, timer = null, cat = null;
  function newCat(){ if(!deck.length) deck = shuffle(D.categories); cat = deck.pop(); idx = rint(0, order.length-1); turn(); }
  function turn(){
    if(timer){ timer.stop(); timer=null; }
    const p = order[idx % order.length];
    body.innerHTML = '<div class="prompt-card"><div class="cat">The category is</div><div class="ptext">'+esc(cat)+'</div></div>'
      +'<p class="kicker-turn">On the clock</p><p class="turn-name">'+esc(p)+'</p>'
      +'<div id="tm"></div>'
      +'<div class="btnrow"><button class="chipbtn" id="ok">✓ Said One</button><button class="chipbtn red" id="fail">✗ Blanked</button></div>';
    timer = ringTimer($('#tm',body), 8, ()=>fail(p));
    $('#ok',body).addEventListener('click', ()=>{ idx++; turn(); });
    $('#fail',body).addEventListener('click', ()=>fail(p));
  }
  function fail(p){
    if(timer){ timer.stop(); timer=null; }
    body.innerHTML = '<div class="big-result">'+esc(p)+' blanked</div>'
      +'<div class="sip-strip">'+esc(p)+' drinks 3 — fresh category incoming</div>'
      +'<button class="chipbtn big" id="next">New Category</button>';
    $('#next',body).addEventListener('click', newCat);
  }
  newCat();
}});

/* ---------- 15. CHAOS DECK ---------- */
GAMES.push({ id:'chaos', name:'Chaos Deck', pip:['J','★','r'], hook:'Picolo-style. Anything can happen.', min:3,
start(body){
  let deck = shuffle(D.chaos.map(c=>({...c}))); // copies
  let queue = [], n = 0;
  function next(){
    let card;
    if(queue.length && queue[0].at<=n){ card = queue.shift().card; }
    else {
      if(!deck.length){ deck = shuffle(D.chaos.map(c=>({...c}))); toast('Chaos deck reshuffled. Pray.'); }
      card = deck.pop();
    }
    n++;
    let text = card.t, endNote='';
    if(card.virus && card.end && !card._resolved){
      const two = drawNames(2);
      text = card.t.replace(/\{p\}/g, two[0]||'Someone').replace(/\{q\}/g, two[1]||two[0]||'Someone');
      const endText = card.end.replace(/\{p\}/g, two[0]||'Someone').replace(/\{q\}/g, two[1]||two[0]||'Someone');
      queue.push({ at: n + rint(4,7), card: {t:endText, _resolved:true} });
      queue.sort((a,b)=>a.at-b.at);
      endNote = '<div class="sip-strip">Rule card — stays live till the deck says stop</div>';
    } else if(!card._resolved){
      text = fillNames(text);
    }
    body.innerHTML = '<p class="progress-lbl">Card '+n+(queue.length?' · '+queue.length+' rule'+(queue.length>1?'s':'')+' pending':'')+'</p>'
      +promptCard(card._resolved?'Rule Over':'Chaos', text)
      +(endNote||'')
      +'<button class="chipbtn big" id="next">Next Card</button>';
    $('#next',body).addEventListener('click', next);
  }
  body.innerHTML = '<div class="howto">The deck does the thinking. Names get pulled automatically, rules stack, sips flow. Just read every card out loud and obey.</div>'
    +'<button class="chipbtn big" id="go">Unleash Chaos</button>';
  $('#go',body).addEventListener('click', next);
}});

/* =========================================================
   FLOOR + NAVIGATION
========================================================= */
function renderFloor(){
  const f = $('#floor'); f.innerHTML='';
  GAMES.forEach(g=>{
    const b = document.createElement('button'); b.className='table-card';
    const [rank, suit, col] = g.pip;
    b.innerHTML = '<span class="pip '+col+'">'+esc(rank)+'<small>'+esc(suit)+'</small></span>'
      +'<span class="pip '+col+' pip2">'+esc(rank)+'<small>'+esc(suit)+'</small></span>'
      +'<span class="players-need">'+g.min+'+</span>'
      +'<h3>'+esc(g.name)+'</h3><p>'+esc(g.hook)+'</p>';
    b.addEventListener('click', ()=>{ location.hash = 'g-'+g.id; });
    f.appendChild(b);
  });
}
let currentGame = null;
function openGame(id){
  const g = GAMES.find(x=>x.id===id);
  if(!g){ goHome(); return; }
  currentGame = g;
  $('#scr-home').classList.remove('on');
  $('#scr-game').classList.add('on');
  $('#gametitle').textContent = g.name;
  const body = $('#gamebody'); body.innerHTML='';
  window.scrollTo(0,0);
  if(players.length < g.min){ if(needPlayers(body, g.min)) return; }
  g.start(body);
}
function goHome(){
  if(location.hash) { location.hash=''; return; } // hashchange will route
  $('#scr-game').classList.remove('on');
  $('#scr-home').classList.add('on');
  currentGame = null;
  window.scrollTo(0,0);
}
function route(){
  const h = location.hash.replace('#','');
  if(h.startsWith('g-')) openGame(h.slice(2));
  else { $('#scr-game').classList.remove('on'); $('#scr-home').classList.add('on'); currentGame=null; }
}
window.addEventListener('hashchange', route);

/* ---------- boot ---------- */
loadPlayers(); renderRoster(); renderFloor();
$('#paddbtn').addEventListener('click', addPlayer);
$('#pname').addEventListener('keydown', e=>{ if(e.key==='Enter') addPlayer(); });
$('#backbtn').addEventListener('click', goHome);
$('#restartbtn').addEventListener('click', ()=>{ if(currentGame){ const b=$('#gamebody'); b.innerHTML=''; if(players.length<currentGame.min){ needPlayers(b,currentGame.min); return;} currentGame.start(b); toast('Table reset'); }});
route();
})();
