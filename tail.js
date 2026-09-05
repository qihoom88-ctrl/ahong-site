/* 全站共用「頁尾動線帶」　單一真相源（40-0905-02／40-0905-03）
   每頁只要在 </body> 前放一行：<script src="/tail.js" defer></script>
   長出三塊：①接下來看這個（同主題 3 張卡）②合作推薦（只在居家主題頁出現）③回首頁／全部知識
   🔴 樣式全部鎖在 .ahtail 底下，不碰各頁原有排版；不載 site.config.js 的頁也能跑。
   🔴 物件簡報頁（/wujian/<案>/）是第二階索取層，🚫不掛本檔。
   改卡片文字、改合作廠商、加新頁：只改這個檔。 */
(function () {
  var S = window.SITE || {};
  var BRAND = S.cBrand || '#1F5C46', GOLD = S.cGold || '#C9A24B', NIGHT = S.cNight || '#101613';

  /* ── 頁面登記簿：path → 標題／一句話／標籤／是否居家主題 ── */
  var P = {
    '/about/':        {t:'關於阿宏',            d:'一身水電看房子，十年商場看人性',                 g:['品牌']},
    '/baoguo/':       {t:'代收包裹運毒踩雷',     d:'幫人收包裹，怎麼變成刑事被告',                   g:['防詐','租屋']},
    '/baozu/':        {t:'包租代管房東自查',     d:'交給代管前，房東自己先看這 12 條',               g:['房東','租屋','交屋'], hw:['pipe','tank','ac']},
    '/bianmin/':      {t:'便民查詢',            d:'垃圾車、停車場，搬進去以後每天要面對的事',       g:['生活'], hw:['water','ac']},
    '/bianmin/shenghuo/': {t:'雙北在地生活通',   d:'垃圾清運、1999、警消、健保診所、重劃區、公車捷運，官方入口一頁點到底', g:['生活'], hw:['water','ac']},
    '/bikeng/':       {t:'買房避坑透視器',       d:'34 條攻略＋買房 20 問',                          g:['買房','驗屋'], hw:['pipe']},
    '/chahe/':        {t:'非自然死亡查核表',     d:'中古屋交易前，這幾個字要停手',                   g:['買房','風險']},
    '/chewei/':       {t:'三種車位自查表',       d:'你那格車位是誰的',                               g:['買房','謄本']},
    '/chifen/':       {t:'持分出售免稅額',       d:'簽約前查核清單',                                 g:['稅務','持分']},
    '/dianmian/':     {t:'買店面前消防三件事',   d:'檢修申報、防火管理、天花板照片',                 g:['店面','買房']},
    '/dijiashui/':    {t:'地價稅自用稅率',       d:'9 月 22 日前要送的那張申請書',                   g:['稅務']},
    '/fangzha/':      {t:'防詐完整懶人包',       d:'房產詐騙的固定套路，先看過再談',                 g:['防詐']},
    '/gongchengkuan/':{t:'預售屋繼承',          d:'契約先看六欄，拋棄繼承三個月',                   g:['繼承','預售']},
    '/guide/':        {t:'買房四步驟',          d:'政策、建案、成交價、建商評價一次查完',           g:['買房']},
    '/guobao/':       {t:'65 歲國保檢查表',     d:'該領的沒領，這張表對一次',                       g:['福利','長輩']},
    '/hangqing/':     {t:'成交行情怎麼查',       d:'實價登錄看懂了才不會出錯價',                     g:['買房','估價']},
    '/heyue/':        {t:'買賣合約自查表',       d:'現況交屋不是免死金牌',                           g:['買房','合約','交屋'], hw:['pipe','tank','ac']},
    '/huanyue/':      {t:'預售屋換約速算',       d:'賣方實拿多少，先算再簽',                         g:['預售','賣房']},
    '/jiaren/':       {t:'家人自查清單',         d:'房子不是突然被騙走',                             g:['長輩','防詐']},
    '/jicheng/':      {t:'房產繼承懶人包',       d:'7000 萬沒先規劃，輸掉的不只是財產',              g:['繼承']},
    '/jisuanji/':     {t:'房產萬能計算機',       d:'貸款、稅費、實拿，一頁算完',                     g:['工具','估價']},
    '/kaixiang/':     {t:'物件開箱',            d:'每一間都拍給你看，缺點先講完',                   g:['物件']},
    '/lajiche/':      {t:'新北垃圾車查詢',       d:'住進去以後每天要對的時間',                       g:['生活']},
    '/liegan/':       {t:'換屋退稅列管 5 年',    d:'退到手不是結束',                                 g:['稅務','換屋']},
    '/maifang/':      {t:'買方配案',            d:'填你的條件，我從手上的委託幫你挑',               g:['買房','物件']},
    '/maiwusunyi/':   {t:'賣屋損益試算',         d:'賣掉實拿多少，先算再決定',                       g:['賣房','估價','工具']},
    '/qingan/':       {t:'青安 3.0 懶人包',      d:'申辦利多與避雷',                                 g:['買房','貸款']},
    '/quanzhuang/':   {t:'房貸繳清≠抵押權消失', d:'塗銷沒做，賣房會卡',                             g:['謄本','賣房']},
    '/shangquan/':    {t:'社區生活圈',           d:'樹林、新莊在地店家，住進去以後真的會用到的',     g:['生活'], hw:['water','ac','pipe']},
    '/shefu/':        {t:'六大社福津貼',         d:'現在衝去領多數會白跑',                           g:['福利']},
    '/shenshou/':     {t:'估價神獸',            d:'手機版估價，三價分開算',                         g:['估價','工具']},
    '/shuihen/':      {t:'水痕怎麼看',           d:'屋主說修好了，你怎麼確認',                       g:['驗屋','漏水'], hw:['fix','pipe']},
    '/shuiwei/':      {t:'貸款送件前自查',       d:'卡的不是銀行水位',                               g:['貸款']},
    '/shuiwu-faq/':   {t:'房產稅務快答',         d:'一問一答，不繞圈',                               g:['稅務']},
    '/shuiwu/':       {t:'賣房要繳多少稅',       d:'房地合一、土增稅、重購退稅一次講清楚',           g:['稅務','賣房']},
    '/teliufen/':     {t:'特留分修法後',         d:'單身族與頂客族遺囑懶人包',                       g:['繼承']},
    '/tengben/':      {t:'他項權利防雷',         d:'謄本寫 1200 萬，不代表屋主欠 1200 萬',           g:['謄本']},
    '/tingche/':      {t:'停車場位置查詢',       d:'新北台北公有路外停車場',                         g:['生活']},
    '/tongche/':      {t:'交通利多查證三步',     d:'動工年不是通車年',                               g:['買房','風險']},
    '/tools/':        {t:'免費工具站',           d:'試算、查詢、自查表全部在這',                     g:['工具']},
    '/wujian/':       {t:'在售物件',            d:'新北嚴選委託',                                   g:['物件']},
    '/xiushan/':      {t:'修繕報價行情',         d:'九工種數字，三站並列不取平均',                   g:['修繕','驗屋'], hw:['fix','pipe','ac']},
    '/zhangbei/':     {t:'70 歲以上長輩福利',    d:'6 項福利檢查懶人包',                             g:['福利','長輩']},
    '/zhishi/':       {t:'房產知識總覽',         d:'買賣房子該懂的事，白話講完',                     g:['索引']},
    '/zhishi/guotu-fenqu-chaxun/': {t:'國土功能分區查詢', d:'國土計畫法延到 2031 前先查的三件事',  g:['土地','買房']},
    '/zhishi/tengben-guide/':      {t:'謄本三秒判讀圖解', d:'一類二類差在哪、哪幾個字要停手',      g:['謄本']},
    '/zuchan/':       {t:'共有持分自查',         d:'祖產掛一排名字的先看這頁',                       g:['持分','繼承']},
    '/zuwu/':         {t:'租屋自保懶人包',       d:'看房到退租一頁通關',                             g:['租屋','交屋'], hw:['pipe','ac','tank']}
  };

  /* ── 合作廠商：啟康愛清洗（阿宏過去經營的子公司，現為合作廠商）
        8 條深連結 2026-09-05 逐一實開驗過 200。改這裡，全站跟著改。 ── */
  var HW = {
    name: '啟康愛清洗', tag: '合作廠商',
    home: 'https://www.hwash.com.tw/files/200-1314-21087.php',
    svc: {
      pipe:  {t:'水管清洗',     u:'https://www.hwash.com.tw/files/200-1314-21482.php'},
      tank:  {t:'水塔清洗',     u:'https://www.hwash.com.tw/files/200-1314-23636.php'},
      ac:    {t:'冷氣家電清洗', u:'https://www.hwash.com.tw/files/200-1314-23637.php'},
      fix:   {t:'水管補漏修繕', u:'https://www.hwash.com.tw/files/200-1314-23640.php'},
      water: {t:'居家淨水',     u:'https://www.hwash.com.tw/files/200-1314-23641.php'}
    },
    note: '交屋前後最常被問的三件事：水管、水塔、冷氣。這家是阿宏合作的清洗廠商，服務內容與價格以該站為準。'
  };

  var CSS =
    '.ahtail{margin:40px 0 0;padding:34px 18px 26px;background:#F4F6F5;border-top:3px solid ' + GOLD + ';' +
      'font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei UI",system-ui,sans-serif;color:#1C2320;line-height:1.7;font-size:15px}' +
    '.ahtail *{box-sizing:border-box}' +
    '.ahtail .in{max-width:1120px;margin:0 auto}' +
    '.ahtail .eb{font-size:12px;font-weight:700;letter-spacing:.2em;color:' + BRAND + ';margin:0 0 4px}' +
    '.ahtail h2{margin:0 0 14px;font-size:21px;font-weight:900;letter-spacing:.02em}' +
    '.ahtail .cards{display:grid;gap:12px;grid-template-columns:1fr;margin:0 0 26px}' +
    '@media(min-width:640px){.ahtail .cards{grid-template-columns:repeat(3,1fr)}}' +
    '.ahtail a.c{display:block;background:#fff;border:1px solid #E4E7E4;border-radius:14px;padding:18px 18px 16px;text-decoration:none;color:inherit;' +
      'transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}' +
    '.ahtail a.c:hover{border-color:' + GOLD + ';transform:translateY(-3px);box-shadow:0 14px 28px -18px rgba(16,22,19,.4)}' +
    '.ahtail a.c b{display:block;font-size:16.5px;font-weight:900;margin:0 0 4px;color:#1C2320}' +
    '.ahtail a.c span{display:block;font-size:13.5px;color:#4A534E}' +
    '.ahtail a.c i{display:inline-block;font-style:normal;font-size:11px;font-weight:700;letter-spacing:.12em;color:' + BRAND + ';margin-bottom:8px}' +
    '.ahtail .hw{background:#fff;border:1px solid #E4E7E4;border-left:5px solid ' + GOLD + ';border-radius:14px;padding:18px 18px 16px;margin:0 0 26px}' +
    '.ahtail .hw .hd{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 6px}' +
    '.ahtail .hw .hd b{font-size:17px;font-weight:900}' +
    '.ahtail .hw .hd em{font-style:normal;font-size:11px;font-weight:700;letter-spacing:.12em;color:#fff;background:' + BRAND + ';border-radius:999px;padding:3px 10px}' +
    '.ahtail .hw p{margin:0 0 12px;font-size:14px;color:#4A534E}' +
    '.ahtail .hw .sv{display:flex;flex-wrap:wrap;gap:8px}' +
    '.ahtail .hw .sv a{display:inline-flex;align-items:center;gap:6px;border:1.5px solid ' + BRAND + ';color:' + BRAND + ';border-radius:999px;padding:8px 15px;font-size:14px;font-weight:700;text-decoration:none}' +
    '.ahtail .hw .sv a:hover{background:' + BRAND + ';color:#fff}' +
    '.ahtail .hw small{display:block;margin-top:10px;font-size:11.5px;color:#78807A}' +
    '.ahtail .nav{display:flex;flex-wrap:wrap;gap:10px;align-items:center;border-top:1px solid #E4E7E4;padding-top:18px}' +
    '.ahtail .nav a{display:inline-flex;align-items:center;border-radius:999px;padding:10px 20px;font-size:14px;font-weight:700;text-decoration:none;border:2px solid transparent}' +
    '.ahtail .nav .h{background:' + NIGHT + ';color:#fff}.ahtail .nav .h:hover{background:' + BRAND + '}' +
    '.ahtail .nav .g{border-color:' + GOLD + ';color:#7A5C1C}.ahtail .nav .g:hover{background:rgba(201,162,75,.14)}' +
    '.ahtail .nav .l{background:#06C755;color:#fff}' +
    '.ahtail .lg{margin:18px 0 0;font-size:11.5px;color:#78807A;line-height:1.9}' +
    '@media print{.ahtail{display:none!important}}';

  function here() {
    var p = location.pathname.replace(/index\.html$/, '');
    if (p.charAt(p.length - 1) !== '/') p += '/';
    return p;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  function related(cur) {
    var me = P[cur], out = [], k, sc;
    if (!me) return out;
    for (k in P) {
      if (k === cur || !P.hasOwnProperty(k)) continue;
      sc = 0;
      for (var i = 0; i < me.g.length; i++) if (P[k].g.indexOf(me.g[i]) >= 0) sc++;
      if (sc) out.push({k: k, s: sc});
    }
    out.sort(function (a, b) { return b.s - a.s; });
    var keys = out.slice(0, 3).map(function (o) { return o.k; });
    var pad = ['/zhishi/', '/tools/', '/wujian/', '/maifang/'];        /* 同主題不足 3 張時補總覽頁 */
    for (var j = 0; keys.length < 3 && j < pad.length; j++)
      if (pad[j] !== cur && keys.indexOf(pad[j]) < 0) keys.push(pad[j]);
    return keys;
  }

  function mount() {
    if (document.getElementById('ahtail')) return;
    var cur = here(), me = P[cur];
    if (!me) return;                       /* 沒登記的頁不長，避免長在物件簡報頁 */

    var st = document.createElement('style');
    st.id = 'ahtail-css'; st.textContent = CSS;
    document.head.appendChild(st);

    var h = '<div class="in">';
    var rel = related(cur);
    if (rel.length) {
      h += '<p class="eb">NEXT</p><h2>接下來看這個</h2><div class="cards">';
      for (var i = 0; i < rel.length; i++) {
        var r = P[rel[i]];
        h += '<a class="c" href="' + rel[i] + '"><i>' + esc(r.g[0]) + '</i><b>' + esc(r.t) + '</b><span>' + esc(r.d) + '</span></a>';
      }
      h += '</div>';
    }
    if (me.hw && me.hw.length) {
      h += '<div class="hw"><div class="hd"><em>' + esc(HW.tag) + '</em><b>' + esc(HW.name) + '</b></div><p>' + esc(HW.note) + '</p><div class="sv">';
      for (var j = 0; j < me.hw.length; j++) {
        var s = HW.svc[me.hw[j]];
        if (s) h += '<a href="' + s.u + '" target="_blank" rel="noopener noreferrer sponsored">' + esc(s.t) + ' ↗</a>';
      }
      h += '<a href="' + HW.home + '" target="_blank" rel="noopener noreferrer sponsored">全部服務 ↗</a>';
      h += '</div><small>外部網站。合作廠商頁面，服務內容與價格以該站為準；本站不經手訂單與款項。</small></div>';
    }
    h += '<div class="nav"><a class="h" href="/">回首頁</a><a class="g" href="/zhishi/">全部知識</a><a class="g" href="/tools/">免費工具</a>' +
         '<a class="l" href="' + (S.line || 'https://line.me/R/ti/p/@798ulmws') + '" target="_blank" rel="noopener noreferrer">LINE 問阿宏</a></div>';
    /* 法遵欄＋證號：頁面本身沒揭示才補（A0 紅線：證號揭示／開價≠成交價） */
    var bodyTxt = (document.body.innerText || '');
    if (bodyTxt.indexOf('年登字') < 0) {
      h += '<p class="lg">' + esc(S.company || '住商不動產 樹林站前加盟店') + '｜' + esc(S.companyLtd || '鴻石不動產經紀有限公司') +
           '｜經紀人證號 ' + esc(S.brokerLic || '(96) 北縣字第001399號') +
           '｜' + esc(S.agentTitle || '不動產經紀營業員') + ' ' + esc(S.agentName || '何志宏') + ' ' + esc(S.agentLic || '（114）年登字第495065號') +
           '<br>' + esc(S.legal || '本站所有試算為決策輔助，稅費以國稅局／地方稅捐處核定為準，行情以實價登錄揭露為準，屋況以現場與謄本為準。開價≠成交價。') + '</p>';
    }
    h += '</div>';

    var box = document.createElement('section');
    box.id = 'ahtail'; box.className = 'ahtail'; box.setAttribute('aria-label', '接下來看這個');
    box.innerHTML = h;
    var fab = document.getElementById('ahfab');
    if (fab) document.body.insertBefore(box, fab); else document.body.appendChild(box);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
