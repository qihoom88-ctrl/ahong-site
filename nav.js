/* 全站共用頂欄／頁尾／配色　全部讀 site.config.js
   每頁：<div id="ahnav"></div> … <div id="ahfoot"></div>
        <script src="/site.config.js"></script><script src="/nav.js"></script> */
(function(){
  var S=window.SITE||{};
  var here=location.pathname.replace(/index\.html$/,'');

  var css='<style>'+
  ':root{--brand:'+S.cBrand+';--brand-dk:'+S.cBrandDk+';--brandsoft:'+S.cBrandSoft+
  ';--gold:'+S.cGold+';--gold-dk:'+S.cGoldDk+';--night:'+S.cNight+';--night2:'+S.cNight2+
  ';--ink:#1C2320;--ink2:#4A534E;--fade:#78807A;--paper:#fff;--alt:#F6F8F7;--line:#E4E7E4;--lineC:#06C755}'+
  '*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}'+
  'body{margin:0;background:var(--paper);color:var(--ink);font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei UI",system-ui,sans-serif;font-size:16px;line-height:1.75;-webkit-font-smoothing:antialiased}'+
  'img{max-width:100%;display:block}a{color:inherit;text-decoration:none}'+
  ':focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:4px}'+
  '@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto}}'+
  '.wrap{max-width:1120px;margin:0 auto;padding:0 18px}'+
  'section{padding:44px 0}section.alt{background:var(--alt)}'+
  '.eyebrow{font-size:12px;font-weight:700;letter-spacing:.22em;color:var(--brand);margin:0 0 6px}'+
  'h2.sec{margin:0 0 6px;font-size:26px;font-weight:900;letter-spacing:.02em;line-height:1.4}'+
  '.sec-note{margin:0 0 22px;font-size:14.5px;color:var(--ink2)}'+
  '.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:999px;padding:14px 28px;font-size:15.5px;font-weight:700;border:2px solid transparent;cursor:pointer}'+
  '.btn-gold{background:var(--gold);color:#1A1508}.btn-gold:hover{background:var(--gold-dk);color:#fff}'+
  '.btn-line{background:var(--lineC);color:#fff}'+
  '.btn-ghost{border-color:var(--gold);color:var(--gold);background:transparent}.btn-ghost:hover{background:rgba(201,162,75,.14)}'+
  '.btn-brand{background:var(--brand);color:#fff}.btn-brand:hover{background:var(--brand-dk)}'+
  '.cards{display:grid;gap:16px;grid-template-columns:1fr}'+
  '@media(min-width:600px){.cards{grid-template-columns:1fr 1fr}}'+
  '@media(min-width:940px){.cards.c4{grid-template-columns:repeat(4,1fr)}.cards.c3{grid-template-columns:repeat(3,1fr)}}'+
  '.wcard{background:#fff;border:1px solid var(--line);border-radius:16px;padding:26px 22px;min-height:200px;scroll-margin-top:100px;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}'+
  'a.wcard:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 16px 32px -20px rgba(16,22,19,.35)}'+
  '.wcard .ic{width:48px;height:48px;border-radius:13px;background:var(--brandsoft);color:var(--brand);display:grid;place-items:center;font-size:20px;font-weight:900;margin-bottom:14px}'+
  '.wcard h3{margin:0 0 6px;font-size:18px;font-weight:900}'+
  '.wcard p{margin:0;font-size:13.5px;color:var(--ink2);line-height:1.75}'+
  '.pagehd{background:var(--night);color:#fff;padding:34px 0 30px}'+
  '.pagehd .eyebrow{color:var(--gold)}'+
  '.pagehd h1{margin:0 0 10px;font-size:28px;font-weight:900;letter-spacing:.03em;line-height:1.35;text-wrap:balance}'+
  '@media(min-width:720px){.pagehd h1{font-size:36px}}'+
  '.pagehd p{margin:0;font-size:15px;color:rgba(255,255,255,.8);line-height:1.85;max-width:720px}'+
  '.band{background:var(--night);color:#fff;text-align:center;padding:42px 0}'+
  '.band .wrap{display:flex;flex-direction:column;align-items:center;gap:16px}'+
  '@media(min-width:820px){.band .wrap{flex-direction:row;justify-content:space-between;align-items:center;text-align:left;gap:24px}.band .btxt{max-width:600px}}'+
  '.band h2{margin:0 0 8px;font-size:22px;font-weight:900;letter-spacing:.02em;line-height:1.4}'+
  '@media(min-width:720px){.band h2{font-size:27px}}'+
  '.band h2 em{font-style:normal;color:var(--gold)}'+
  '.band p{margin:0;font-size:14px;color:rgba(255,255,255,.78);line-height:1.8}'+
  '.band .bbtns{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}'+
  '@media(min-width:820px){.band .bbtns{justify-content:flex-end}}'+
  '.band .btn{flex:none}'+
  '.note{border-left:3px solid var(--gold);background:#FBF8F1;padding:13px 16px;border-radius:0 8px 8px 0;font-size:14px;color:var(--ink2);line-height:1.85;margin:16px 0}'+
  '.note b{color:var(--ink)}'+

  '.ahtop{background:var(--night);color:rgba(255,255,255,.82);font-size:12.5px}'+
  '.ahtop-in{max-width:1180px;margin:0 auto;padding:7px 18px;display:flex;align-items:center;gap:12px}'+
  '.ahtop a:hover{color:var(--gold)}.ahtop .sp{flex:1}'+
  '.ahtop .tel{font-weight:700;color:var(--gold);letter-spacing:.03em}'+
  '.ahtop .soc{display:flex;gap:7px}'+
  '.ahtop .soc a{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:700}'+
  '.ahtop .soc .f{background:#1877F2;color:#fff}.ahtop .soc .l{background:#06C755;color:#fff}.ahtop .soc .g{background:var(--gold);color:var(--night)}'+
  '@media(max-width:760px){.ahtop .hide-s{display:none}}'+
  '.ahnav{position:sticky;top:0;z-index:60;background:#fff;border-bottom:1px solid var(--line);box-shadow:0 2px 12px -8px rgba(16,22,19,.4)}'+
  '.ahnav-in{max-width:1180px;margin:0 auto;padding:9px 18px;display:flex;align-items:center;gap:10px}'+
  '.ahlogo{display:flex;align-items:center;gap:9px;flex:none}'+
  '.ahlogo .mk{height:84px;border-radius:9px;color:var(--gold);display:grid;place-items:center;font-weight:900;font-size:19px;overflow:hidden}'+
  '.ahlogo .mk:not(.imgmk){width:38px;height:38px}'+
  '.ahlogo .mk img{height:84px;width:auto;max-width:240px;object-fit:contain;display:block}'+
  '.ahlogo b{display:block;font-size:15.5px;font-weight:900;color:var(--ink);line-height:1.2;letter-spacing:.03em}'+
  '.ahlogo i{display:block;font-style:normal;font-size:10.5px;color:var(--fade);letter-spacing:.05em}'+
  '.ahmenu{display:none;flex:1;gap:2px;justify-content:center}'+
  '.ahmenu a{position:relative;padding:10px 11px;font-size:14px;font-weight:650;color:var(--ink);white-space:nowrap}'+
  '.ahmenu a:after{content:"";position:absolute;left:11px;right:11px;bottom:5px;height:2px;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .22s ease}'+
  '.ahmenu a:hover{color:var(--brand)}'+
  '.ahmenu a:hover:after,.ahmenu a.on:after{transform:scaleX(1)}'+
  '.ahmenu a.on{color:var(--brand);font-weight:900}'+
  '.ahcta{flex:none;background:var(--gold);color:#1A1508;border-radius:999px;padding:11px 20px;font-size:14.5px;font-weight:900;white-space:nowrap;transition:transform .18s ease,background .18s ease}'+
  '.ahcta:hover{background:var(--gold-dk);color:#fff;transform:translateY(-2px)}'+
  '.ahburger{flex:none;margin-left:auto;width:40px;height:40px;border:1px solid var(--line);border-radius:8px;background:#fff;display:grid;place-items:center;cursor:pointer;font-size:18px;color:var(--ink)}'+
  '.ahdrop{display:none;border-top:1px solid var(--line);background:#fff}.ahdrop.on{display:block}'+
  '.ahdrop a{display:block;padding:13px 18px;font-size:15px;border-bottom:1px solid #F1F3F1}'+
  '.ahdrop a.on{color:var(--brand);font-weight:900;background:var(--brandsoft)}'+
  '@media(min-width:1080px){.ahmenu{display:flex}.ahburger{display:none}}'+
  '.ahfoot{background:var(--night2);color:rgba(255,255,255,.72);font-size:13px;line-height:1.9;padding:34px 0 96px}'+
  '@media(min-width:1080px){.ahfoot{padding-bottom:34px}}'+
  '.ahfg{display:grid;gap:22px;grid-template-columns:1fr}'+
  '@media(min-width:700px){.ahfg{grid-template-columns:1fr 1fr 1.2fr}}'+
  '.ahfoot h4{margin:0 0 8px;font-size:13.5px;font-weight:900;color:var(--gold);letter-spacing:.08em}'+
  '.ahfoot a:hover{color:#fff}'+
  '.ahlegal{margin-top:22px;padding-top:16px;border-top:1px solid rgba(255,255,255,.14);font-size:11.5px;color:rgba(255,255,255,.5);line-height:1.9}'+
  /* 踢館 Q&A 浮動面板 */
  '.tkbtn{position:fixed;right:14px;bottom:96px;z-index:72;width:56px;height:56px;border-radius:50%;border:0;cursor:pointer;background:var(--gold);color:#1A1508;font-size:11px;font-weight:900;line-height:1.2;box-shadow:0 6px 20px -4px rgba(16,22,19,.5);display:grid;place-items:center;letter-spacing:.02em}'+
  '.tkbtn:hover{background:var(--gold-dk);color:#fff}'+
  '@media(min-width:1080px){.tkbtn{bottom:24px}}'+
  '.tkmask{position:fixed;inset:0;z-index:80;background:rgba(10,14,12,.72);display:none}'+
  '.tkmask.on{display:block}'+
  '.tkpanel{position:fixed;right:0;top:0;bottom:0;z-index:81;width:min(100%,420px);background:var(--paper);display:none;flex-direction:column;box-shadow:-12px 0 40px -16px rgba(0,0,0,.6)}'+
  '.tkpanel.on{display:flex}'+
  '.tkhd{background:var(--night);color:#fff;padding:16px 18px;display:flex;align-items:flex-start;gap:12px;flex:none}'+
  '.tkhd h3{margin:0 0 3px;font-size:17px;font-weight:900;color:var(--gold)}'+
  '.tkhd p{margin:0;font-size:12px;color:rgba(255,255,255,.72);line-height:1.65}'+
  '.tkx{margin-left:auto;flex:none;width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;font-size:17px;cursor:pointer}'+
  '.tktabs{display:flex;gap:6px;padding:12px 18px 0;flex:none;background:var(--paper)}'+
  '.tktabs button{flex:1;padding:9px 4px;font-size:13px;font-weight:800;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--ink2);cursor:pointer}'+
  '.tktabs button.on{background:var(--brand);border-color:var(--brand);color:#fff}'+
  '.tkbody{flex:1;overflow-y:auto;padding:14px 18px 24px}'+
  '.tkitem{background:#fff;border:1px solid var(--line);border-radius:14px;margin-bottom:10px;overflow:hidden}'+
  '.tkq{width:100%;text-align:left;border:0;background:transparent;padding:15px 16px;font-size:14.5px;font-weight:800;color:var(--ink);cursor:pointer;line-height:1.65;display:flex;gap:10px;align-items:flex-start}'+
  '.tkq:before{content:"Q";flex:none;width:22px;height:22px;border-radius:6px;background:var(--brandsoft);color:var(--brand);font-size:12px;font-weight:900;display:grid;place-items:center;margin-top:2px}'+
  '.tka{display:none;padding:0 16px 15px 48px;font-size:13.5px;color:var(--ink2);line-height:1.85}'+
  '.tkitem.on .tka{display:block}'+
  '.tkitem.on .tkq{color:var(--brand)}'+
  '.tka .tknext{display:inline-block;margin-top:10px;font-size:13px;font-weight:800;color:var(--gold-dk);border-bottom:1px solid var(--gold)}'+
  '.tkfoot{flex:none;padding:12px 18px;border-top:1px solid var(--line);background:#fff;font-size:11.5px;color:var(--fade);line-height:1.7}'+
  '.tkfoot a{color:var(--brand);font-weight:800}'+
  '.ahdock{position:fixed;left:0;right:0;bottom:0;z-index:70;display:flex;gap:8px;padding:8px 14px 12px;background:rgba(16,22,19,.96);border-top:1px solid rgba(201,162,75,.3)}'+
  '.ahdock a{flex:1;text-align:center;border-radius:999px;padding:12px;font-size:14.5px;font-weight:700}'+
  '.ahdock .g{background:var(--gold);color:#1A1508}.ahdock .l{background:#06C755;color:#fff}'+
  '@media(min-width:1080px){.ahdock{display:none}}'+
  '.ahviewtoggle{display:none;margin-top:12px;padding:0;font:inherit;font-size:11.5px;color:rgba(255,255,255,.55);background:none;border:0;text-decoration:underline;cursor:pointer}'+
  '.ahviewtoggle:hover{color:#fff}'+
  /* 版面比例切換晶片：常駐可見，顯示當下模式與比例 */
  '.vchip{position:fixed;left:12px;bottom:96px;z-index:72;display:flex;align-items:center;gap:7px;padding:7px 12px 7px 9px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.94);backdrop-filter:blur(8px);box-shadow:0 5px 18px -6px rgba(16,22,19,.4);cursor:pointer;font:inherit;font-size:12px;font-weight:800;color:var(--ink)}'+
  '.vchip:hover{border-color:var(--gold)}'+
  '@media(min-width:1080px){.vchip{bottom:24px}}'+
  '.vchip .vico{flex:none;width:15px;border:1.5px solid var(--brand);border-radius:2.5px}'+
  '.vchip.m .vico{height:24px}'+
  '.vchip.d .vico{height:11px;width:19px}'+
  '.vchip .vnow{color:var(--brand)}'+
  '.vchip .vratio{font-weight:600;color:var(--fade);font-variant-numeric:tabular-nums}'+
  '.vchip .vsw{padding-left:7px;margin-left:1px;border-left:1px solid var(--line);color:var(--gold-dk);font-weight:800}'+
  '</style>';

  var menu=(S.nav||[]).map(function(n){
    return '<a href="'+n.u+'"'+(here===n.u?' class="on"':'')+'>'+n.t+'</a>';
  }).join('');
  var mk=S.markImg?'<img src="'+S.markImg+'" alt="">':S.mark;
  var mkCls=S.markImg?'mk imgmk':'mk';

  var nav=css+
  '<div class="ahtop"><div class="ahtop-in">'+
    '<span class="hide-s">'+S.company+'</span>'+
    '<a class="tel" href="tel:'+(S.tel||'').replace(/-/g,'')+'">｜ '+S.tel+'</a>'+
    '<span class="sp"></span>'+
    '<span class="hide-s">關注 · 預約阿宏</span><span class="soc">'+
    '<a class="f" href="'+S.fb+'" aria-label="Facebook">f</a>'+
    '<a class="l" href="'+S.line+'" aria-label="LINE">L</a>'+
    '<a class="g" href="'+S.social+'" aria-label="'+S.socialName+'">社</a></span>'+
  '</div></div>'+
  '<div class="ahnav"><div class="ahnav-in">'+
    '<a class="ahlogo" href="/"><span class="'+mkCls+'">'+mk+'</span><span><b>'+S.brandName+'</b><i>'+S.brandSub+'</i></span></a>'+
    '<nav class="ahmenu">'+menu+'</nav>'+
    '<a class="ahcta" href="'+S.line+'">'+S.ctaText+'</a>'+
    '<button class="ahburger" id="ahbg" aria-label="開啟選單" aria-expanded="false">☰</button>'+
  '</div><div class="ahdrop" id="ahdd">'+menu+'</div></div>';

  var foot='<div class="ahfoot"><div class="wrap"><div class="ahfg">'+
    '<div><h4>判斷所服務</h4>'+(S.services||[]).join('｜')+'<br>屋況與謄本判讀</div>'+
    '<div><h4>網站導覽</h4>'+(S.nav||[]).slice(1).map(function(n){return '<a href="'+n.u+'">'+n.t+'</a>'}).join('<br>')+'</div>'+
    '<div><h4>聯絡阿宏</h4>公司電話 '+S.tel+'<br>LINE　<a href="'+S.line+'">'+S.lineId+'</a><br>'+
      '<a href="'+S.fb+'">Facebook 開箱</a>　<a href="'+S.social+'">'+S.socialName+'</a><br>服務區域　'+S.area+'</div>'+
    '</div><div class="ahlegal">'+
    S.agentName+'｜'+S.agentTitle+S.agentLic+'<br>'+
    S.company+'｜'+S.companyLtd+'｜經紀人 '+S.brokerLic+'<br>'+
    S.legal+'<br>'+S.privacy+
    '<button class="ahviewtoggle" id="ahViewToggle" type="button"></button>'+
    '</div></div></div>'+
    '<div class="ahdock"><a class="g" href="/wujian/">看在售物件</a><a class="l" href="'+S.line+'">LINE 諮詢</a></div>';

  var n=document.getElementById('ahnav'); if(n) n.innerHTML=nav;
  var f=document.getElementById('ahfoot'); if(f) f.innerHTML=foot;
  var bg=document.getElementById('ahbg'), dd=document.getElementById('ahdd');
  if(bg&&dd) bg.addEventListener('click',function(){
    var on=dd.classList.toggle('on');
    bg.setAttribute('aria-expanded',on?'true':'false');
    bg.textContent=on?'✕':'☰';
  });

  /* 版面比例切換：手機 9:16 為主，電腦版為次；晶片常駐顯示當下模式與比例 */
  var VDK='ahViewDesktop';
  function forcedDesktop(){return localStorage.getItem(VDK)==='1'}
  function flip(){ localStorage.setItem(VDK, forcedDesktop()?'0':'1'); location.reload(); }

  var vt=document.getElementById('ahViewToggle');
  if(vt){
    vt.textContent=forcedDesktop()?'切換回手機版畫面':'查看電腦版畫面';
    vt.addEventListener('click',flip);
  }

  var chip=document.createElement('button');
  chip.type='button'; chip.id='ahVChip';
  function paintChip(){
    var d=forcedDesktop();
    /* 未強制電腦版時，依實際視窗寬判斷現在是哪種版面 */
    var wide=d||window.innerWidth>=1080;
    chip.className='vchip '+(wide?'d':'m');
    /* 只有窄螢幕（真的在手機上看）才需要切換；桌機本來就是電腦版，只顯示狀態 */
    var canSwitch = d || window.innerWidth < 1080;
    chip.innerHTML='<span class="vico"></span>'+
      '<span class="vnow">'+(wide?'電腦版':'手機版')+'</span>'+
      '<span class="vratio">'+(wide?'16:10':'9:16')+'</span>'+
      (canSwitch?'<span class="vsw">'+(d?'回手機版':'看電腦版')+'</span>':'');
    chip.disabled=!canSwitch;
    chip.style.cursor=canSwitch?'pointer':'default';
    chip.setAttribute('aria-label','目前版面為'+(wide?'電腦版 16:10':'手機版 9:16')+
      (canSwitch?'，點擊切換':''));
  }
  paintChip();
  chip.addEventListener('click',flip);
  window.addEventListener('resize',paintChip);
  document.body.appendChild(chip);

  /* 踢館 Q&A　資料在 /tikuan.js（阿宏策展，情緒與政治發言不收錄） */
  var TK=window.AHTIKUAN||[];
  if(TK.length){
    var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
    var TABS=[{k:'all',t:'全部'},{k:'buyer',t:'買方'},{k:'seller',t:'賣方'},{k:'peer',t:'同業'}];
    var box=document.createElement('div');
    box.innerHTML=
      '<button class="tkbtn" id="tkOpen" aria-label="打開踢館 Q&amp;A">踢館<br>Q&amp;A</button>'+
      '<div class="tkmask" id="tkMask"></div>'+
      '<aside class="tkpanel" id="tkPanel" role="dialog" aria-label="踢館 Q&amp;A" aria-modal="true">'+
        '<div class="tkhd"><div><h3>踢館 Q&amp;A</h3>'+
          '<p>最難聽的問題放這裡，不挑好聽的答</p></div>'+
          '<button class="tkx" id="tkClose" aria-label="關閉">✕</button></div>'+
        '<div class="tktabs" id="tkTabs">'+TABS.map(function(x,i){
          return '<button data-k="'+x.k+'"'+(i===0?' class="on"':'')+'>'+x.t+'</button>'}).join('')+'</div>'+
        '<div class="tkbody" id="tkBody"></div>'+
        '<div class="tkfoot">這裡是常見的尖銳提問，不是客戶留言記錄。想直接問我沒列到的，走 '+
          '<a href="'+S.line+'">官方 LINE</a>。</div>'+
      '</aside>';
    document.body.appendChild(box);

    var body=document.getElementById('tkBody');
    function render(k){
      var L=TK.filter(function(x){return k==='all'||x.who===k});
      body.innerHTML=L.length?L.map(function(x){
        return '<div class="tkitem"><button class="tkq" type="button">'+esc(x.q)+'</button>'+
          '<div class="tka">'+esc(x.a)+
          (x.next?'<a class="tknext" href="'+esc(x.nu||'#')+'">'+esc(x.next)+' →</a>':'')+
          '</div></div>'}).join('')
        :'<p style="color:var(--fade);font-size:13.5px">這個分類還沒有收錄的提問。</p>';
    }
    render('all');

    body.addEventListener('click',function(e){
      var q=e.target.closest('.tkq'); if(!q) return;
      q.parentNode.classList.toggle('on');
    });
    document.getElementById('tkTabs').addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b) return;
      [].forEach.call(this.children,function(c){c.classList.remove('on')});
      b.classList.add('on'); render(b.dataset.k);
    });

    var panel=document.getElementById('tkPanel'), mask=document.getElementById('tkMask');
    function toggle(on){
      panel.classList.toggle('on',on); mask.classList.toggle('on',on);
      document.body.style.overflow=on?'hidden':'';
    }
    document.getElementById('tkOpen').addEventListener('click',function(){toggle(true)});
    document.getElementById('tkClose').addEventListener('click',function(){toggle(false)});
    mask.addEventListener('click',function(){toggle(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false)});
  }
})();
