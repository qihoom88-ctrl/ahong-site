/* 買房避坑透視器｜物件簡報頁末端固定入口　單一真相源
   ------------------------------------------------------------------
   每頁只要在 </body> 前放一行：
     <script src="../../a/bikeng-entry.js" defer></script>
   🔴 不要逐頁手寫這段 HTML／文案／樣式，改文案只改這個檔（19 頁一起變）。
   立律依據：feedback_shared_component_single_source（2026-08-28）

   掛載位置：`.closing`（最後講一句人話）之後、法遵頁尾 `.footer` 之前。
   🔴 不碰第一屏（2026-08-28 信任軸三關改版過，動它要重跑那套驗收）。

   只掛在售物件頁：`.closing` 或 `.footer` 都找不到就整段不顯示，
   不會在下架頁／已售出頁（guanghua、nanshulin）長出東西。

   文案判準（2026-08-28 信任軸）：講讀者的處境，不自誇「別人沒提供」。
   這是免費工具不是推銷，語氣要輕，不跟物件本身的 CTA 搶。
   事實來源：/bikeng/ 頁面本體——標題「34條攻略＋買房20問」、
   buildRequestText() 註解載明個資完全不經伺服器只留在使用者裝置。

   🔴 這支檔案裝的是「對外文案」，但 qa_copy_guard 的 hook 只綁 Edit|Write 且
   只掃 .txt／指定目錄，掃不到 /a/*.js——所以改完文案必須手動跑一次出廠閘門：
     python "D:/技能包/影片自動化/qa_copy_guard.py" "D:/ahong-site/a/bikeng-entry.js"
   實測本檔可直接被該閘門讀取並判 PASS／FAIL，FAIL 不准 commit。
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var URL_BIKENG = 'https://0930848000.com/bikeng/';
  var MOUNT_ID = 'bikeng-entry';

  var CSS = [
    '#bikeng-entry{margin:26px 0 0;padding:22px 21px;border-radius:var(--radius,22px);',
      'background:var(--card,#fff);border:1px solid var(--line,#DDE3E8);',
      'box-shadow:0 8px 22px rgba(43,58,74,.05);max-width:100%;box-sizing:border-box}',
    '#bikeng-entry .bk-kicker{font-size:.78rem;font-weight:900;letter-spacing:.12em;',
      'color:var(--muted,#5E6874);margin:0 0 8px}',
    '#bikeng-entry h2{margin:0 0 12px;font-size:1.12rem;font-weight:900;',
      'line-height:1.6;color:var(--ink,#1D2731)}',
    '#bikeng-entry p{margin:0 0 9px;font-size:.95rem;line-height:1.95;color:var(--ink,#1D2731)}',
    '#bikeng-entry p.bk-quiet{color:var(--muted,#5E6874);font-size:.89rem;margin-bottom:0}',
    '#bikeng-entry .bk-go{display:block;margin:16px 0 0;padding:14px 16px;text-align:center;',
      'text-decoration:none;font-weight:900;font-size:.96rem;border-radius:14px;',
      'border:1px solid var(--trust,#2B3A4A);color:var(--trust,#2B3A4A);background:transparent;',
      'transition:background .18s ease,color .18s ease}',
    '#bikeng-entry .bk-go:hover{background:var(--trust,#2B3A4A);color:var(--card,#fff)}',
    '#bikeng-entry .bk-go:focus-visible{outline:3px solid var(--gold,#8A6410);outline-offset:3px}',
    '#bikeng-entry .bk-url{display:block;margin:9px 0 0;font-size:.78rem;line-height:1.7;',
      'color:var(--muted,#5E6874);word-break:break-all;overflow-wrap:anywhere;text-align:center}'
  ].join('');

  /* 掛載點：.closing 之後（同層＝仍在 .wrap 內，吃得到頁面 max-width）。
     找不到 .closing 就退而求其次插在 .footer 之前。兩個都沒有＝不是在售
     物件簡報頁，整段放棄不顯示（不做 body append，避免長在奇怪的地方）。 */
  function anchor() {
    var closing = document.querySelector('.closing');
    if (closing && closing.parentNode) return { el: closing, how: 'afterend' };
    var footer = document.querySelector('.footer');
    if (footer && footer.parentNode) return { el: footer, how: 'beforebegin' };
    return null;
  }

  function mount() {
    if (document.getElementById(MOUNT_ID)) return;
    var at = anchor();
    if (!at) return;

    var st = document.createElement('style');
    st.setAttribute('data-bikeng', '1');
    st.appendChild(document.createTextNode(CSS));
    document.head.appendChild(st);

    var sec = document.createElement('section');
    sec.id = MOUNT_ID;
    sec.setAttribute('aria-labelledby', 'bk-entry-h');
    sec.innerHTML =
      '<p class="bk-kicker">離開這一頁之前</p>' +
      '<h2 id="bk-entry-h">看完這一間<br>下一間你也用得到</h2>' +
      '<p>這一頁只講得完這一間。可是你要看的房子，不會只有這一間。</p>' +
      '<p>看屋當下該自己核對的事，我整理成 34 條，手機打開就能一條一條對。' +
        '後面接一份買房 20 問，答完會產生一張你自己的需求單。</p>' +
      '<p class="bk-quiet">填的內容不會送出去，只留在你自己的手機裡。' +
        '不用先加我，也不用是我的客戶。</p>' +
      '<a class="bk-go" href="' + URL_BIKENG + '" target="_blank" rel="noopener noreferrer">' +
        '打開買房避坑透視器</a>' +
      '<span class="bk-url">' + URL_BIKENG + '</span>';

    at.el.insertAdjacentElement(at.how, sec);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
