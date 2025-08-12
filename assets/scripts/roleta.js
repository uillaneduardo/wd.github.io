
  /* ===== REDIRECIONA AO CLICAR NO BOTÃO HOME ===== */
  document.getElementById('spinHome').addEventListener('click', ()=>{
    // if(!isLoggedIn) return openLogin();
    // alert('Prêmio resgatado! (simulação)');
    window.location.href = 'index.html';
    // Simula redirecionamento para roleta
  });

  /* ===== Splash: esconde quando a roleta estiver pronta ===== */
  const appLoader = document.getElementById('appLoader');
  function hideLoader(){
    if(!appLoader) return;
    appLoader.classList.add('hide');
    // remove do DOM depois da animação
    setTimeout(()=> appLoader.remove(), 400);
  }

  // Já existe a função resizeCanvas() que termina chamando drawWheel().
  // Vamos garantir que, na PRIMEIRA renderização completa, esconda o loader.
  let firstWheelPainted = false;
  const _drawWheelOriginal = drawWheel;
  drawWheel = function(){
    _drawWheelOriginal();
    if(!firstWheelPainted){
      firstWheelPainted = true;
      // pequeno delay para sensação de “app”
      setTimeout(hideLoader, 350);
    }
  };

  // fallback: se algo atrasar demais
  window.addEventListener('load', () => {
    setTimeout(()=> { if(!firstWheelPainted) hideLoader(); }, 2500);
  });

  /* ===== Estado de login (mesmo padrão de gating do index) ===== */
  let isLoggedIn = false;

  const loginPopup = document.getElementById('loginPopup');
  const closeLoginPopup = document.getElementById('closeLoginPopup');
  const userIcon = document.getElementById('userIcon');

  function openLogin(){ loginPopup.style.display = 'block'; }
  function closeLogin(){ loginPopup.style.display = 'none'; }

  userIcon.addEventListener('click', openLogin);
  closeLoginPopup.addEventListener('click', closeLogin);
  document.getElementById('loginGoogle').addEventListener('click', ()=>{ isLoggedIn=true; closeLogin(); alert('Logado com Google (simulação)'); });
  document.getElementById('loginApple').addEventListener('click', ()=>{ isLoggedIn=true; closeLogin(); alert('Logado com Apple (simulação)'); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && loginPopup.style.display==='block') closeLogin(); });

  /* ===== Navegação básica ===== */
  document.getElementById('spinHome').addEventListener('click', ()=>{ window.location.href='index.html'; });

  /* ===== Conquistas (popup ancorado + responsivo) ===== */
  const conquistasBtn   = document.getElementById('conquistas');
  const achievementsPop = document.getElementById('achievementsPopup');

  function openAchievements(){ achievementsPop.style.display = 'block'; layoutAchievements(); }
  function closeAchievements(){ achievementsPop.style.display = 'none'; }

  function layoutAchievements(){
    // Em mobile, alinhar ao header dinamicamente
    const isMobile = window.matchMedia('(max-width: 576px)').matches;
    if(!isMobile) return; // CSS cobre desktop/tablet
    const header = document.querySelector('.header-home');
    const top = Math.round(header.getBoundingClientRect().bottom) + 8; // 8px gap
    achievementsPop.style.top = top + 'px';
  }

  conquistasBtn.addEventListener('click', ()=>{
    if(achievementsPop.style.display === 'block') closeAchievements();
    else openAchievements();
  });

  // Clique/touch fora fecha (mobile e desktop)
  function outsideHandler(e){
    const wrap = e.target.closest('.conquistas-wrap');
    if(!wrap && achievementsPop.style.display === 'block') closeAchievements();
  }
  document.addEventListener('click', outsideHandler, {passive:true});
  document.addEventListener('touchstart', outsideHandler, {passive:true});

  // Recalcula posição quando redimensionar/orientação mudar
  window.addEventListener('resize', ()=>{ if(achievementsPop.style.display==='block') layoutAchievements(); }, {passive:true});
  window.addEventListener('orientationchange', ()=>{ if(achievementsPop.style.display==='block') layoutAchievements(); });

  /* ===== Roleta ===== */
  const canvas  = document.getElementById('wheelCanvas');
  const ctx     = canvas.getContext('2d');
  const spinBtn = document.getElementById('spinBtn');

  // Modos de roleta (mantendo visual consistente)
  const modes = {
    free:    { label:'Free',    prizes:["50 Coins","100 Coins","Extra Spin","Common Skin","75 Coins","150 Coins","Fuel +1","200 Coins"], colors:["#ffc107","#fff","#ffc107","#fff","#ffc107","#fff","#ffc107","#fff"] },
    special: { label:'Special', prizes:["Epic Skin","500 Coins","Rare Car","1000 Coins","Fuel +3","Legendary Skin","750 Coins","Jackpot"], colors:["#fff","#ffc107","#fff","#ffc107","#fff","#ffc107","#fff","#ffc107"] }
  };

  let currentMode = 'free';
  let prizes = modes[currentMode].prizes.slice();
  let colors = modes[currentMode].colors.slice();

  const arc = Math.PI / (prizes.length/2);
  let startAngle = 0;
  let spinAngle = 0;
  let spinTime = 0;
  let spinTimeTotal = 0;
  let animReq = null;

  function drawWheel(){
    // Use sempre pixels de CSS ao desenhar (evita "dobro de escala" no mobile)
    const dpr = window.devicePixelRatio || 1;
    const cssSize = canvas.clientWidth || canvas.getBoundingClientRect().width || 320;
    const size = cssSize;                 
    const center = size / 2;
    const outsideRadius = center - 10;
    const insideRadius  = Math.max(34, Math.round(size * 0.09));
    const textRadius    = center - Math.max(52, Math.round(size * 0.14));
    const fontPx        = Math.max(12, Math.round(size * 0.04));

    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr,0,0,dpr,0,0);

    ctx.strokeStyle = "#000";
    ctx.lineWidth   = 2;
    ctx.font        = `bold ${fontPx}px system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial, sans-serif`;

    for(let i=0;i<prizes.length;i++){
      const angle = startAngle + i*arc;
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(center, center, outsideRadius, angle, angle+arc, false);
      ctx.arc(center, center, insideRadius,  angle+arc, angle, true);
      ctx.fill();

      // Label
      ctx.save();
      ctx.fillStyle = "#000";
      ctx.translate(
        center + Math.cos(angle+arc/2) * textRadius,
        center + Math.sin(angle+arc/2) * textRadius
      );
      ctx.rotate(angle + arc/2);
      const label = prizes[i];
      ctx.fillText(label, -ctx.measureText(label).width/2, 0);
      ctx.restore();
    }

    // Hub central
    ctx.beginPath();
    ctx.arc(center, center, insideRadius, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  
  function easeOut(t, b, c, d){
    let ts = (t/=d)*t; let tc = ts*t;
    return b + c*(tc + -3*ts + 3*t);
  }

  function rotateWheel(){
    spinTime += 16; // ~60fps
    if(spinTime >= spinTimeTotal){ stopRotateWheel(); return; }
    const spinAngleIncrement = easeOut(spinTime, 0.25, spinAngle, spinTimeTotal);
    startAngle += (spinAngleIncrement * Math.PI/180);
    drawWheel();
    animReq = requestAnimationFrame(rotateWheel);
  }

  function stopRotateWheel(){
    if(animReq) cancelAnimationFrame(animReq);
    const degrees = startAngle * 180/Math.PI + 90; // ponteiro em cima
    const arcd = arc * 180/Math.PI;
    let index = Math.floor((360 - (degrees % 360)) / arcd);
    index = Math.min(Math.max(index,0), prizes.length-1);
    const won = prizes[index];
    addToInventory(won);
    alert("Você ganhou: " + won);
  }

  spinBtn.addEventListener('click', ()=>{
    if(!isLoggedIn){ openLogin(); return; }
    spinAngle = Math.random()*10 + 12;        // velocidade
    spinTime = 0;
    spinTimeTotal = Math.random()*2800 + 4200; // duração
    rotateWheel();
  });

  // Alternância de modo
  const modeFreeBtn    = document.getElementById('modeFree');
  const modeSpecialBtn = document.getElementById('modeSpecial');

  function setMode(mode){
    currentMode = mode;
    prizes = modes[mode].prizes.slice();
    colors = modes[mode].colors.slice();
    startAngle = 0;
    [modeFreeBtn,modeSpecialBtn].forEach(b=>b.classList.remove('active'));
    (mode==='free'? modeFreeBtn : modeSpecialBtn).classList.add('active');
    drawWheel();
  }
  modeFreeBtn.addEventListener('click', ()=>setMode('free'));
  modeSpecialBtn.addEventListener('click', ()=>setMode('special'));

  // Inventário (grid 3x3)
  const invGrid = document.getElementById('inventoryGrid');
  const clearBtn = document.getElementById('clearInventory');

  function renderEmptyInventory(){
    invGrid.innerHTML = '';
    for(let i=0;i<9;i++){
      const div = document.createElement('div');
      div.className = 'inv-item empty';
      div.textContent = '-';
      invGrid.appendChild(div);
    }
  }
  function addToInventory(item){
    const slot = invGrid.querySelector('.inv-item.empty');
    if(slot){
      slot.classList.remove('empty');
      slot.textContent = item;
    } else {
      const div = document.createElement('div');
      div.className = 'inv-item';
      div.textContent = item;
      invGrid.appendChild(div);
    }
  }
  clearBtn.addEventListener('click', renderEmptyInventory);

  // Responsivo: mantém canvas nítido em HiDPI
  function resizeCanvas(){
    const dpr = window.devicePixelRatio || 1;
    const wrap = document.querySelector('.wheel-wrap');

    const wrapWidth = Math.round(wrap.getBoundingClientRect().width);
    canvas.style.width  = wrapWidth + 'px';
    canvas.style.height = wrapWidth + 'px';

    const cssSize = Math.round(canvas.clientWidth);
    canvas.width  = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);

    ctx.setTransform(dpr,0,0,dpr,0,0);
    drawWheel();
  }

  // Boot/responsividade
  window.addEventListener('resize', resizeCanvas, {passive:true});
  window.addEventListener('orientationchange', resizeCanvas);
  requestAnimationFrame(resizeCanvas);
  renderEmptyInventory();

