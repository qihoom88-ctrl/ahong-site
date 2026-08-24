/* 類似物件區塊（物件簡報頁末端，人話段之前）
   資料源：/wujian/listings.json 單一正本。
   結案回收：把 listings.json 裡該筆 status 改成「已售出」或「已下架」，
   全站簡報頁即刻不再推薦它，不必逐頁改 HTML。
   一筆都撈不到（含載入失敗）＝整區塊不顯示，不出現空狀態。 */
(function () {
  'use strict';

  var HOST = document.getElementById('similar-listings');
  if (!HOST) return;

  var CSS = [
    '#similar-listings{display:none}',
    '#similar-listings.on{display:block;margin:26px 0 0}',
    '.simi-lead{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);',
    'padding:20px 19px;color:var(--ink);box-shadow:0 8px 22px rgba(43,58,74,.05)}',
    '.simi-lead .simi-kicker{font-size:.78rem;font-weight:900;letter-spacing:.12em;color:var(--warm);margin-bottom:8px}',
    '.simi-lead p{margin:0 0 9px;line-height:1.95;font-size:.95rem}',
    '.simi-lead p:last-child{margin-bottom:0;color:var(--muted)}',
    '.simi-grid{display:grid;gap:12px;grid-template-columns:1fr;margin-top:14px}',
    '@media (min-width:680px){.simi-grid{grid-template-columns:repeat(3,1fr)}}',
    '.simi-card{display:block;text-decoration:none;color:var(--ink);background:var(--card);',
    'border:1px solid var(--line);border-radius:18px;padding:16px 16px 15px}',
    '.simi-card .simi-dist{font-size:.76rem;font-weight:800;letter-spacing:.06em;color:var(--muted)}',
    '.simi-card h4{margin:5px 0 9px;font-size:1.02rem;font-weight:900;line-height:1.5}',
    '.simi-card .simi-price{font-size:1.18rem;font-weight:900;color:var(--gold);',
    'font-variant-numeric:tabular-nums;line-height:1.3}',
    '.simi-card .simi-price em{font-style:normal;font-size:.76rem;font-weight:800;color:var(--muted);margin-right:5px}',
    '.simi-card .simi-spec{margin:7px 0 0;font-size:.85rem;color:var(--muted);line-height:1.7}',
    '.simi-card .simi-sell{margin:9px 0 0;font-size:.88rem;line-height:1.75;color:var(--ink)}',
    '.simi-card .simi-go{margin:11px 0 0;font-size:.82rem;font-weight:900;color:var(--warm)}',
    '.simi-note{margin:12px 2px 0;font-size:.8rem;line-height:1.8;color:var(--muted)}'
  ].join('');

  function injectCss() {
    var s = document.createElement('style');
    s.setAttribute('data-simi', '1');
    s.appendChild(document.createTextNode(CSS));
    document.head.appendChild(s);
  }

  function currentSlug() {
    var parts = location.pathname.split('/').filter(function (x) { return x; });
    return parts.length ? parts[parts.length - 1].replace(/\.html?$/i, '') : '';
  }

  /* 縣市＝「行政區」欄前 3 字（「新北市樹林區」→「新北市」）。 */
  function city(x) {
    var v = x && x['行政區'] ? String(x['行政區']) : '';
    return v.length >= 3 ? v.slice(0, 3) : v;
  }

  /* 三層挑選，依序補到 3 筆為止：
     ① 同行政區 ② 同縣市 ③ 開價 ±20%
     沒有第②層時，桃園的物件會直接被新北的物件填滿（實測 jiasheng 蘆竹區
     推出三間新北老三房，而同為桃園的 puxin 反而落選），故補上。 */
  function pick(list, me) {
    var live = list.filter(function (x) {
      return x && x.slug && x.slug !== me.slug && x.status === '在售';
    });
    var byPrice = function (a, b) {
      if (me['開價萬'] == null) return 0;
      var da = a['開價萬'] == null ? 1e9 : Math.abs(a['開價萬'] - me['開價萬']);
      var db = b['開價萬'] == null ? 1e9 : Math.abs(b['開價萬'] - me['開價萬']);
      return da - db;
    };
    var same = live.filter(function (x) {
      return me['行政區'] && x['行政區'] === me['行政區'];
    }).sort(byPrice);

    var meCity = city(me);
    var sameCity = live.filter(function (x) {
      return same.indexOf(x) < 0 && meCity && city(x) === meCity;
    }).sort(byPrice);

    var near = [];
    if (me['開價萬'] != null) {
      near = live.filter(function (x) {
        return same.indexOf(x) < 0 && sameCity.indexOf(x) < 0 &&
          x['開價萬'] != null &&
          Math.abs(x['開價萬'] - me['開價萬']) <= me['開價萬'] * 0.2;
      }).sort(byPrice);
    }
    return same.concat(sameCity, near).slice(0, 3);
  }

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function card(x) {
    var spec = [x['房數'], x['權狀坪數'], x['樓層屋齡']].filter(function (v) {
      return v;
    }).join('｜');
    var price = x['開價萬'] == null ? '' :
      '<div class="simi-price"><em>開價</em>' + esc(x['開價萬']) + ' 萬</div>';
    return '<a class="simi-card" href="../' + esc(x.slug) + '/">' +
      (x['行政區'] ? '<span class="simi-dist">' + esc(x['行政區']) + '</span>' : '') +
      '<h4>' + esc(x['案名']) + '</h4>' + price +
      (spec ? '<p class="simi-spec">' + esc(spec) + '</p>' : '') +
      (x['一句話賣點'] ? '<p class="simi-sell">' + esc(x['一句話賣點']) + '</p>' : '') +
      '<p class="simi-go">看這一間的完整簡報 →</p>' +
      '</a>';
  }

  function render(picked) {
    HOST.innerHTML =
      '<div class="simi-lead">' +
        '<div class="simi-kicker">如果這一間不合適</div>' +
        '<p>看到這裡如果覺得不對，那就是不對，沒有關係。沒有哪一間是好的或壞的，只有合不合，' +
        '不合適的先放掉，不用勉強自己去說服自己。</p>' +
        '<p>下面這幾間是我手上性質比較接近的，順路看一眼就好。' +
        '一間都沒中意也不要緊，跟我說你真正在意的是什麼，我再幫你留意。</p>' +
        '<div class="simi-grid">' + picked.map(card).join('') + '</div>' +
        '<p class="simi-note">開價不等於成交價；物件狀態可能異動，以來電或 LINE 確認為準。</p>' +
      '</div>';
    HOST.className = 'on';
  }

  function boot() {
    var me = currentSlug();
    if (!me) return;
    fetch('../listings.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (doc) {
        if (!doc || !Array.isArray(doc['物件'])) return;
        var self = null, i;
        for (i = 0; i < doc['物件'].length; i++) {
          if (doc['物件'][i].slug === me) { self = doc['物件'][i]; break; }
        }
        if (!self) return;
        var picked = pick(doc['物件'], self);
        if (!picked.length) return;
        injectCss();
        render(picked);
      })
      .catch(function () { /* 撈不到就整區隱藏，不出空狀態 */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
