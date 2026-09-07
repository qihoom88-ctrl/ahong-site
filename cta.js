/* 全站共用浮動 CTA　單一真相源
   每頁只要在 </body> 前放一行：<script src="/cta.js" defer></script>
   🔴 不要再逐頁手寫 fab-line／fab-phone，改樣式只改這個檔。

   2026-09-08（40-0908 對比同事站）：手機版改成「一條底部列」——
     主頁／物件／LINE／技術Q&A（頁面有才出現）／電話，五格一眼看完；
     原本右下三顆圓鈕＋左下版面晶片在手機上疊四層，阿宏判準「白癡都會操作」過不了。
   電腦版（≥1080px）維持右下圓鈕不變。
   自帶底部列的頁面（宣告 :root{--ahfab-bottom:...} 的）不長底部列，維持圓鈕往上抬的舊行為。
*/
(function () {
  var S = window.SITE || {};
  /* 🔴 這兩個預設值必須與 site.config.js 的 line／tel 一致（沒載 site.config.js 的頁才吃這裡） */
  var LINE = S.line || 'https://line.me/R/ti/p/@798ulmws';
  var TELTXT = S.tel || '02-2687-8822';
  var TELNUM = TELTXT.replace(/[^0-9+]/g, '');
  var BRAND = S.cBrand || '#1F5C46', GOLD = S.cGold || '#C9A24B';

  var ICON_LINE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.03 3.57 7.4 8.4 8.04.33.07.78.22.89.5.1.26.07.66.03.92l-.14.86c-.04.26-.2 1.01.89.55 1.09-.46 5.87-3.46 8.01-5.92C21.56 13.35 22 11.8 22 10.13 22 5.64 17.52 2 12 2zM8.39 12.8H6.16a.53.53 0 0 1-.53-.53V8.51a.53.53 0 0 1 1.06 0v3.23h1.7a.53.53 0 1 1 0 1.06zm1.83-.53a.53.53 0 0 1-1.06 0V8.51a.53.53 0 0 1 1.06 0v3.76zm4.51 0a.53.53 0 0 1-.36.5.55.55 0 0 1-.17.03.53.53 0 0 1-.42-.21l-1.92-2.61v2.29a.53.53 0 0 1-1.06 0V8.51a.53.53 0 0 1 .95-.32l1.92 2.62V8.51a.53.53 0 0 1 1.06 0v3.76zm3.38-2.41a.53.53 0 1 1 0 1.06h-1.7v.82h1.7a.53.53 0 1 1 0 1.06h-2.23a.53.53 0 0 1-.53-.53V8.51c0-.29.24-.53.53-.53h2.23a.53.53 0 1 1 0 1.06h-1.7v.82h1.7z"/></svg>';
  var ICON_TEL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>';
  var ICON_HOME = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z"/></svg>';
  var ICON_LIST = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v3H4zm0 5.5h16v3H4zM4 16h16v3H4z"/></svg>';
  var ICON_QA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a9 9 0 0 0-9 9c0 2.4.94 4.58 2.47 6.19L4 22l4.9-1.4A9 9 0 1 0 12 2zm.9 13.6h-1.8v-1.8h1.8zm1.6-6.1-.8.8c-.6.6-.8 1-.8 1.9h-1.8v-.4c0-1 .3-1.7.9-2.3l1.1-1.1a1.5 1.5 0 1 0-2.6-1.1H8.7a3.3 3.3 0 1 1 5.8 2.2z"/></svg>';

  var CSS =
    '.ahfab{position:fixed;right:14px;' +
      'bottom:calc(var(--ahfab-bottom,14px) + env(safe-area-inset-bottom,0px));' +
      'display:flex;flex-direction:column;gap:10px;z-index:50}' +
    '.ahfab a{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;' +
      'text-decoration:none;box-shadow:0 6px 18px rgba(43,58,74,.28);' +
      'transition:transform .18s ease,filter .18s ease}' +
    '.ahfab a:hover{transform:translateY(-2px);filter:brightness(1.06)}' +
    '.ahfab a:focus-visible{outline:3px solid ' + GOLD + ';outline-offset:3px}' +
    '.ahfab .ahfab-line{background:#06C755}' +
    '.ahfab .ahfab-phone{background:#2B3A4A}' +
    '.ahfab svg{width:27px;height:27px;fill:#fff;display:block}' +
    /* 手機底部列 */
    '.ahbar{position:fixed;left:0;right:0;bottom:0;z-index:60;display:none;' +
      'background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-top:1px solid #E4E7E4;' +
      'padding:6px 4px calc(6px + env(safe-area-inset-bottom,0px));' +
      'box-shadow:0 -8px 24px -16px rgba(16,22,19,.45);' +
      'font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei UI",system-ui,sans-serif}' +
    '.ahbar-in{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:2px;max-width:640px;margin:0 auto}' +
    '.ahbar a,.ahbar button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;' +
      'min-height:52px;border:0;background:none;border-radius:12px;padding:4px 2px;' +
      'text-decoration:none;color:#4A534E;font:inherit;font-size:11.5px;font-weight:800;letter-spacing:.02em;cursor:pointer}' +
    '.ahbar svg{width:22px;height:22px;fill:currentColor;display:block}' +
    '.ahbar .on{color:' + BRAND + '}' +
    '.ahbar .line{color:#06C755}' +
    '.ahbar .line .ic{width:34px;height:34px;border-radius:50%;background:#06C755;display:grid;place-items:center;margin-top:-10px;box-shadow:0 6px 14px -4px rgba(6,199,85,.55)}' +
    '.ahbar .line .ic svg{fill:#fff;width:22px;height:22px}' +
    '.ahbar .tel{color:' + BRAND + '}' +
    '@media(max-width:1079px){' +
      'body.ahbar-on{padding-bottom:calc(66px + env(safe-area-inset-bottom,0px))}' +
      'body.ahbar-on .ahbar{display:block}' +
      'body.ahbar-on .ahfab{display:none}' +
      'body.ahbar-on .tkbtn{display:none}' +
      'body.ahbar-on .vchip{bottom:calc(76px + env(safe-area-inset-bottom,0px));left:auto;right:12px;transform:scale(.86);transform-origin:right bottom}' +
      'body.ahbar-on .ahtail{padding-bottom:40px}' +
    '}' +
    '@media print{.ahfab,.ahbar{display:none!important}}';

  function hasOwnBar() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--ahfab-bottom');
    return v && v.trim() !== '' && v.trim() !== '14px';
  }

  function mount() {
    if (document.getElementById('ahfab')) return;
    var st = document.createElement('style');
    st.id = 'ahfab-css';
    st.textContent = CSS;
    document.head.appendChild(st);

    /* 電腦版／自帶底部列的頁：右下圓鈕 */
    var box = document.createElement('div');
    box.id = 'ahfab';
    box.className = 'ahfab';
    box.setAttribute('aria-label', '聯絡阿宏');
    box.innerHTML =
      '<a class="ahfab-line" href="' + LINE + '" target="_blank" rel="noopener noreferrer" aria-label="加官方 LINE 私訊">' + ICON_LINE + '</a>' +
      '<a class="ahfab-phone" href="tel:' + TELNUM + '" aria-label="撥打電話 ' + TELTXT + '">' + ICON_TEL + '</a>';
    document.body.appendChild(box);

    if (hasOwnBar()) return;

    /* 手機版：一條底部列 */
    var here = location.pathname.replace(/index\.html$/, '');
    var tk = document.getElementById('tkOpen');
    var bar = document.createElement('nav');
    bar.id = 'ahbar'; bar.className = 'ahbar'; bar.setAttribute('aria-label', '快速功能列');
    bar.innerHTML = '<div class="ahbar-in">' +
      '<a href="/"' + (here === '/' ? ' class="on"' : '') + '>' + ICON_HOME + '主頁</a>' +
      '<a href="/wujian/"' + (here.indexOf('/wujian/') === 0 ? ' class="on"' : '') + '>' + ICON_LIST + '物件</a>' +
      '<a class="line" href="' + LINE + '" target="_blank" rel="noopener noreferrer"><span class="ic">' + ICON_LINE + '</span>加LINE</a>' +
      (tk ? '<button type="button" id="ahbarQA">' + ICON_QA + '技術Q&amp;A</button>' : '<a href="/zhishi/"' + (here.indexOf('/zhishi/') === 0 ? ' class="on"' : '') + '>' + ICON_QA + '知識</a>') +
      '<a class="tel" href="tel:' + TELNUM + '">' + ICON_TEL + '電話</a>' +
      '</div>';
    document.body.appendChild(bar);
    document.body.classList.add('ahbar-on');
    if (tk) document.getElementById('ahbarQA').addEventListener('click', function () { tk.click(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
