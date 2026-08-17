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
  '.cards{display:grid;gap:12px;grid-template-columns:1fr}'+
  '@media(min-width:600px){.cards{grid-template-columns:1fr 1fr}}'+
  '@media(min-width:940px){.cards.c4{grid-template-columns:repeat(4,1fr)}.cards.c3{grid-template-columns:repeat(3,1fr)}}'+
  '.wcard{background:#fff;border:1px solid var(--line);border-radius:12px;padding:18px 16px}'+
  'a.wcard:hover{border-color:var(--gold)}'+
  '.wcard .ic{width:40px;height:40px;border-radius:10px;background:var(--brandsoft);color:var(--brand);display:grid;place-items:center;font-size:19px;font-weight:900;margin-bottom:10px}'+
  '.wcard h3{margin:0 0 5px;font-size:16px;font-weight:900}'+
  '.wcard p{margin:0;font-size:13.5px;color:var(--ink2);line-height:1.7}'+
  '.pagehd{background:var(--night);color:#fff;padding:34px 0 30px}'+
  '.pagehd .eyebrow{color:var(--gold)}'+
  '.pagehd h1{margin:0 0 10px;font-size:28px;font-weight:900;letter-spacing:.03em;line-height:1.35;text-wrap:balance}'+
  '@media(min-width:720px){.pagehd h1{font-size:36px}}'+
  '.pagehd p{margin:0;font-size:15px;color:rgba(255,255,255,.8);line-height:1.85;max-width:720px}'+
  '.band{background:var(--night);color:#fff;text-align:center}'+
  '.band h2{margin:0 0 10px;font-size:24px;font-weight:900;letter-spacing:.04em;line-height:1.5}'+
  '.band h2 em{font-style:normal;color:var(--gold)}'+
  '.band p{margin:0 auto 20px;max-width:640px;font-size:15px;color:rgba(255,255,255,.82);line-height:1.85}'+
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
  '.ahlogo .mk{height:60px;border-radius:9px;color:var(--gold);display:grid;place-items:center;font-weight:900;font-size:19px;overflow:hidden}'+
  '.ahlogo .mk:not(.imgmk){width:38px;height:38px}'+
  '.ahlogo .mk img{height:60px;width:auto;max-width:170px;object-fit:contain;display:block}'+
  '.ahlogo b{display:block;font-size:15.5px;font-weight:900;color:var(--ink);line-height:1.2;letter-spacing:.03em}'+
  '.ahlogo i{display:block;font-style:normal;font-size:10.5px;color:var(--fade);letter-spacing:.05em}'+
  '.ahmenu{display:none;flex:1;gap:1px;justify-content:center}'+
  '.ahmenu a{padding:8px 10px;font-size:14px;font-weight:500;color:var(--ink);border-radius:6px;white-space:nowrap}'+
  '.ahmenu a:hover{background:var(--brandsoft);color:var(--brand)}'+
  '.ahmenu a.on{color:var(--brand);font-weight:900}'+
  '.ahcta{flex:none;background:var(--gold);color:#1A1508;border-radius:999px;padding:11px 20px;font-size:14.5px;font-weight:900;white-space:nowrap}'+
  '.ahcta:hover{background:var(--gold-dk);color:#fff}'+
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
  '.ahdock{position:fixed;left:0;right:0;bottom:0;z-index:70;display:flex;gap:8px;padding:8px 14px 12px;background:rgba(16,22,19,.96);border-top:1px solid rgba(201,162,75,.3)}'+
  '.ahdock a{flex:1;text-align:center;border-radius:999px;padding:12px;font-size:14.5px;font-weight:700}'+
  '.ahdock .g{background:var(--gold);color:#1A1508}.ahdock .l{background:#06C755;color:#fff}'+
  '@media(min-width:1080px){.ahdock{display:none}}'+
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
    S.legal+'<br>'+S.privacy+'</div></div></div>'+
    '<div class="ahdock"><a class="g" href="/wujian/">看在售物件</a><a class="l" href="'+S.line+'">LINE 諮詢</a></div>';

  var n=document.getElementById('ahnav'); if(n) n.innerHTML=nav;
  var f=document.getElementById('ahfoot'); if(f) f.innerHTML=foot;
  var bg=document.getElementById('ahbg'), dd=document.getElementById('ahdd');
  if(bg&&dd) bg.addEventListener('click',function(){
    var on=dd.classList.toggle('on');
    bg.setAttribute('aria-expanded',on?'true':'false');
    bg.textContent=on?'✕':'☰';
  });
})();
