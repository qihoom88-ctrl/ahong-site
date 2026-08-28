/* 全站共用浮動 CTA（LINE ＋ 電話）　單一真相源
   每頁只要在 </body> 前放一行：<script src="/cta.js" defer></script>
   🔴 不要再逐頁手寫 fab-line／fab-phone，改樣式只改這個檔。

   版面：右下直排兩顆圓鈕，上 LINE 下電話（照站上原本 .fab 版本 1:1 搬過來）
   需要把圓鈕往上抬的頁面（自己有底部固定列），在該頁 CSS 寫：
     :root{--ahfab-bottom:70px}
*/
(function () {
  var S = window.SITE || {};
  /* 🔴 這兩個預設值必須與 site.config.js 的 line／tel 一致（36 頁沒載 site.config.js 才吃這裡） */
  var LINE = S.line || 'https://line.me/R/ti/p/@798ulmws';
  var TELTXT = S.tel || '02-2687-8822';
  var TELNUM = TELTXT.replace(/[^0-9+]/g, '');

  var CSS =
    '.ahfab{position:fixed;right:14px;' +
      'bottom:calc(var(--ahfab-bottom,14px) + env(safe-area-inset-bottom,0px));' +
      'display:flex;flex-direction:column;gap:10px;z-index:50}' +
    '.ahfab a{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;' +
      'text-decoration:none;box-shadow:0 6px 18px rgba(43,58,74,.28);' +
      'transition:transform .18s ease,filter .18s ease}' +
    '.ahfab a:hover{transform:translateY(-2px);filter:brightness(1.06)}' +
    '.ahfab a:focus-visible{outline:3px solid #C9A24B;outline-offset:3px}' +
    '.ahfab .ahfab-line{background:#06C755}' +
    '.ahfab .ahfab-phone{background:#2B3A4A}' +
    '.ahfab svg{width:27px;height:27px;fill:#fff;display:block}' +
    '@media print{.ahfab{display:none!important}}';

  function mount() {
    if (document.getElementById('ahfab')) return;
    var st = document.createElement('style');
    st.id = 'ahfab-css';
    st.textContent = CSS;
    document.head.appendChild(st);

    var box = document.createElement('div');
    box.id = 'ahfab';
    box.className = 'ahfab';
    box.setAttribute('aria-label', '聯絡阿宏');
    box.innerHTML =
      '<a class="ahfab-line" href="' + LINE + '" target="_blank" rel="noopener noreferrer" ' +
        'aria-label="加官方 LINE 私訊"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 5.64 2 10.13c0 4.03 3.57 7.4 8.4 8.04.33.07.78.22.89.5.1.26.07.66.03.92l-.14.86c-.04.26-.2 1.01.89.55 1.09-.46 5.87-3.46 8.01-5.92C21.56 13.35 22 11.8 22 10.13 22 5.64 17.52 2 12 2zM8.39 12.8H6.16a.53.53 0 0 1-.53-.53V8.51a.53.53 0 0 1 1.06 0v3.23h1.7a.53.53 0 1 1 0 1.06zm1.83-.53a.53.53 0 0 1-1.06 0V8.51a.53.53 0 0 1 1.06 0v3.76zm4.51 0a.53.53 0 0 1-.36.5.55.55 0 0 1-.17.03.53.53 0 0 1-.42-.21l-1.92-2.61v2.29a.53.53 0 0 1-1.06 0V8.51a.53.53 0 0 1 .95-.32l1.92 2.62V8.51a.53.53 0 0 1 1.06 0v3.76zm3.38-2.41a.53.53 0 1 1 0 1.06h-1.7v.82h1.7a.53.53 0 1 1 0 1.06h-2.23a.53.53 0 0 1-.53-.53V8.51c0-.29.24-.53.53-.53h2.23a.53.53 0 1 1 0 1.06h-1.7v.82h1.7z"/></svg></a>' +
      '<a class="ahfab-phone" href="tel:' + TELNUM + '" ' +
        'aria-label="撥打電話 ' + TELTXT + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg></a>';
    document.body.appendChild(box);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
