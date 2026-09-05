/* 居家清洗 合作推薦　單一真相源（獨立元件，跟修繕／導覽分開）
   2026-09-05 阿宏：「一個是維修、一個是清洗，維修的項目這麼多了，另外站一個視窗」
   → 啟康愛清洗只做「清洗＋淨水」，🚫不放補漏修繕、🚫不併進修繕工種、🚫不塞在頁尾導覽帶裡。
   每頁只要在 </body> 前放：<script src="/qingxi.js" defer></script>
   只在 PAGES 有登記的頁面出現；物件簡報頁永不掛。
   5 條深連結 2026-09-05 逐一實開驗過 200。 */
(function () {
  var S = window.SITE || {};
  var BRAND = S.cBrand || '#1F5C46', GOLD = S.cGold || '#C9A24B';

  var HW = {
    name: '啟康愛清洗', tag: '合作廠商・居家清洗',
    home: 'https://www.hwash.com.tw/files/200-1314-21087.php',
    svc: {
      pipe:  {t:'水管清洗',     d:'熱水管變小、出水發黃',   u:'https://www.hwash.com.tw/files/200-1314-21482.php'},
      tank:  {t:'水塔清洗',     d:'交屋後第一件事',         u:'https://www.hwash.com.tw/files/200-1314-23636.php'},
      ac:    {t:'冷氣家電清洗', d:'冷氣有味道、洗衣機發霉', u:'https://www.hwash.com.tw/files/200-1314-23637.php'},
      water: {t:'居家淨水',     d:'全戶式淨水器、濾心',     u:'https://www.hwash.com.tw/files/200-1314-23641.php'}
    },
    note: '交屋前後最常被問的是水管、水塔、冷氣要不要洗。這家是阿宏合作的清洗廠商，只做清洗與淨水，不做修繕。服務內容與價格以該站為準。'
  };

  /* 哪一頁出現、出現哪幾項（改這裡） */
  var PAGES = {
    '/baozu/':            ['pipe','tank','ac'],
    '/bianmin/':          ['water','ac'],
    '/bianmin/shenghuo/': ['water','ac'],
    '/bikeng/':           ['pipe','tank'],
    '/heyue/':            ['pipe','tank','ac'],
    '/shangquan/':        ['water','ac','pipe'],
    '/shuihen/':          ['pipe','tank'],
    '/xiushan/':          ['pipe','tank','ac','water'],
    '/zuwu/':             ['pipe','ac','tank']
  };

  var CSS =
    '.ahqx{margin:36px 0 0;padding:0 18px;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei UI",system-ui,sans-serif;color:#1C2320;line-height:1.7}' +
    '.ahqx .in{max-width:1120px;margin:0 auto;background:#fff;border:1px solid #E4E7E4;border-top:4px solid ' + GOLD + ';border-radius:16px;padding:22px 20px 18px;box-shadow:0 10px 28px -22px rgba(16,22,19,.4)}' +
    '.ahqx .eb{margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:.2em;color:' + BRAND + '}' +
    '.ahqx h2{margin:0 0 4px;font-size:21px;font-weight:900;line-height:1.35;display:flex;align-items:center;gap:10px;flex-wrap:wrap}' +
    '.ahqx h2 em{font-style:normal;font-size:11px;font-weight:700;letter-spacing:.1em;color:#fff;background:' + BRAND + ';border-radius:999px;padding:3px 10px}' +
    '.ahqx p{margin:0 0 14px;font-size:14px;color:#4A534E}' +
    '.ahqx .sv{display:grid;gap:10px;grid-template-columns:1fr}' +
    '@media(min-width:600px){.ahqx .sv{grid-template-columns:1fr 1fr}}' +
    '@media(min-width:940px){.ahqx .sv{grid-template-columns:repeat(4,1fr)}}' +
    '.ahqx .sv a{display:flex;flex-direction:column;gap:2px;border:1.5px solid #E4E7E4;border-radius:12px;padding:12px 14px;text-decoration:none;color:#1C2320;transition:border-color .15s,transform .15s}' +
    '.ahqx .sv a:hover{border-color:' + BRAND + ';transform:translateY(-2px)}' +
    '.ahqx .sv a b{font-size:15px;font-weight:900;color:' + BRAND + '}' +
    '.ahqx .sv a span{font-size:12.5px;color:#78807A}' +
    '.ahqx .all{display:inline-block;margin-top:12px;font-size:13.5px;font-weight:800;color:' + BRAND + ';text-decoration:none}' +
    '.ahqx small{display:block;margin-top:8px;font-size:11.5px;color:#78807A}' +
    '@media print{.ahqx{display:none!important}}';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function mount() {
    if (document.getElementById('ahqx')) return;
    var cur = location.pathname.replace(/index\.html$/, '');
    if (cur.charAt(cur.length - 1) !== '/') cur += '/';
    var keys = PAGES[cur];
    if (!keys || !keys.length) return;

    var st = document.createElement('style'); st.id = 'ahqx-css'; st.textContent = CSS;
    document.head.appendChild(st);

    var h = '<div class="in"><p class="eb">CLEANING</p><h2>居家清洗<em>' + esc(HW.tag) + '</em></h2><p>' + esc(HW.note) + '</p><div class="sv">';
    for (var i = 0; i < keys.length; i++) {
      var s = HW.svc[keys[i]]; if (!s) continue;
      h += '<a href="' + s.u + '" target="_blank" rel="noopener noreferrer sponsored"><b>' + esc(s.t) + ' ↗</b><span>' + esc(s.d) + '</span></a>';
    }
    h += '</div><a class="all" href="' + HW.home + '" target="_blank" rel="noopener noreferrer sponsored">' + esc(HW.name) + ' 全部服務 ↗</a>' +
         '<small>外部網站。合作廠商頁面，服務內容與價格以該站為準；本站不經手訂單與款項。</small></div>';

    var box = document.createElement('section');
    box.id = 'ahqx'; box.className = 'ahqx'; box.setAttribute('aria-label', '居家清洗合作推薦');
    box.innerHTML = h;
    /* 站在頁尾動線帶之前、內文之後：自己一格，不跟導覽混 */
    var slot = document.getElementById('ahqx-slot'), tail = document.getElementById('ahtail');
    if (slot) slot.appendChild(box);
    else if (tail) tail.parentNode.insertBefore(box, tail); else document.body.appendChild(box);
  }

  function ready() {
    /* tail.js 也是 defer，等它掛完再站位；沒有 tail 就直接掛 */
    if (document.getElementById('ahqx-slot') || document.getElementById('ahtail') || !document.querySelector('script[src*="/tail.js"]')) mount();
    else setTimeout(ready, 30);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
