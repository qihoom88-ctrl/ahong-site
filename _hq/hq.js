/* ═══════════════════════════════════════════════════════════
   鴻觀資產 後台　hq.js
   🔴 PRIVATE：不掛導覽、robots 擋、noindex。網址不要貼給客戶。
   資料來源＝直接讀線上三個檔，改動先存 localStorage，
   按「出貨」才產出新檔覆蓋回 repo。
   ═══════════════════════════════════════════════════════════ */

const KEY = 'ah-hq-draft-v1';
const LIVE = {
  wu : (window.AHLISTINGS || []),
  cfg: (window.AHCONFIG || {}),
  fb : (window.AHFB || {})
};

let D = load();

function load(){
  try{
    const s = localStorage.getItem(KEY);
    if(s) return JSON.parse(s);
  }catch(e){}
  return fresh();
}
function fresh(){
  return {
    wu : JSON.parse(JSON.stringify(LIVE.wu)),
    cfgListings: JSON.parse(JSON.stringify(LIVE.cfg.listings || [])),
    fb : JSON.parse(JSON.stringify(LIVE.fb))
  };
}
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(D)); }catch(e){}
  markDirty();
  render();
}
function markDirty(){
  const el = document.getElementById('dirty');
  const changed = JSON.stringify(D) !== JSON.stringify(fresh());
  el.textContent = changed ? '有未出貨的修改' : '未修改';
  el.className = changed ? 'pill hot' : 'pill';
}
function reset(){
  if(!confirm('丟掉後台裡所有暫存修改，回到網站目前的線上資料？')) return;
  try{ localStorage.removeItem(KEY); }catch(e){}
  D = fresh(); save(); toast('已回到線上版');
}

/* ───────── 防呆閘門 ─────────
   來源＝阿宏既有鐵律，不是憑空發明：
   底價/屋主/門牌不外流、貼文禁署名手機、預設不秀單坪價、
   距離只寫公尺、商業用禁房室、開價≠成交價、地名不准被改。 */
const GUARD = [
  { lv:'stop', re:/(底價|實拿|屋主願意|可以談到|談到\s*\d|最低可到|成本價|急售價|賠售價)/,
    msg:'出現底價／議價空間字眼', fix:'公開頁只放開價或委託總價，議價空間走私訊' },
  { lv:'stop', re:/(屋主電話|屋主姓名|屋主手機|賣方姓名|地主電話|地主姓名)/,
    msg:'出現屋主個資欄位', fix:'屋主資訊永不外流，整段刪掉' },
  { lv:'stop', re:/\d+\s*號/,
    msg:'出現完整門牌（○號）', fix:'改成商圈或路段名，例：「新莊・光華商圈」' },
  { lv:'stop', re:/09\d{2}[-\s]?\d{3}[-\s]?\d{3}/,
    msg:'出現手機號碼', fix:'貼文禁署名手機；電話只出現在懶人包法遵欄' },
  { lv:'stop', re:/(單坪|每坪|坪單價|單價\s*\d)/,
    msg:'出現單坪價', fix:'預設只寫總價＋坪數（034 單價誤植公開抓包後拍板）' },
  { lv:'stop', re:/(步行|走路|徒步|車程|開車)\s*(約)?\s*\d+\s*分/,
    msg:'距離寫成時間', fix:'一律改「約 X 公尺（距離依 Google 地圖）」' },
  { lv:'stop', re:/(保證|穩賺|絕對|一定會漲|包漲|零風險|無風險)/,
    msg:'出現保證獲利字眼', fix:'廣告不實紅線，換成可驗證的敘述' },

  { lv:'warn', re:/\d+\s*巷/,
    msg:'寫到巷號，接近完整門牌', fix:'確認這個精度是必要的，能拿掉就拿掉' },
  { lv:'warn', re:/屋主/,
    msg:'提到屋主', fix:'確認沒帶到姓名、電話、賣房動機等可辨識資訊' },
  { lv:'warn', re:/(森林|樹森)/,
    msg:'疑似地名誤植', fix:'「樹林」曾被 AI 改成「森林」，逐字確認' },
  { lv:'warn', re:/(成交價|實價登錄顯示|鄰居賣)/,
    msg:'提到成交行情', fix:'沒有可查證來源就不要寫，開價≠成交價' }
];

function scan(obj){
  const text = JSON.stringify(obj);
  const hits = [];
  GUARD.forEach(g=>{
    const m = text.match(g.re);
    if(m) hits.push({lv:g.lv, msg:g.msg, fix:g.fix, hit:m[0]});
  });
  // 商業用禁房室：主要用途非住宅時，不得使用「房」「室」
  if(/商業用|非住宅|事務所|一般事務所/.test(text) && /\d\s*房|\d\s*室/.test(text)){
    hits.push({lv:'stop', msg:'商業用建物寫了「房／室」', hit:'商業用＋房室',
      fix:'改成隔間數寫法，例：3+2+2 隔間'});
  }
  return hits;
}
function guardHTML(hits, quiet){
  if(!hits.length) return quiet ? '' :
    '<div class="guard pass"><b>✅ 防呆通過</b>沒有掃到底價、屋主個資、門牌、手機、單坪價、時間距離、保證字眼。</div>';
  const stop = hits.filter(h=>h.lv==='stop');
  const warn = hits.filter(h=>h.lv==='warn');
  let h = '';
  if(stop.length) h += '<div class="guard stop"><b>🔴 擋下來了　'+stop.length+' 項不能出門</b><ul>'
    + stop.map(x=>'<li>'+x.msg+'　<code>'+esc(x.hit)+'</code><br><span style="opacity:.85">→ '+x.fix+'</span></li>').join('')
    + '</ul></div>';
  if(warn.length) h += '<div class="guard warn"><b>🟡 要你自己看一眼　'+warn.length+' 項</b><ul>'
    + warn.map(x=>'<li>'+x.msg+'　<code>'+esc(x.hit)+'</code><br><span style="opacity:.85">→ '+x.fix+'</span></li>').join('')
    + '</ul></div>';
  return h;
}
function hasStop(hits){ return hits.some(h=>h.lv==='stop'); }

/* ───────── 物件列表 ───────── */
function render(){
  renderList(); renderFb(); renderCheck(); renderCounts();
}
function renderCounts(){
  document.getElementById('n1').textContent = '（'+D.wu.length+' 筆物件）';
  document.getElementById('n2').textContent = '（配案工具 '+D.cfgListings.length+' 筆）';
  document.getElementById('n3').textContent = '（'+(D.fb.videos||[]).length+' 影片 / '+(D.fb.posts||[]).length+' 貼文）';
}
function renderList(){
  const box = document.getElementById('list');
  if(!D.wu.length){ box.innerHTML = '<div class="empty">目前沒有在售物件</div>'; return; }
  box.innerHTML = D.wu.map((o,i)=>{
    const hits = scan(o);
    const inCfg = matchCfg(o) >= 0;
    const fl = [];
    if(o.grade==='A') fl.push('<span class="fl a">首頁跑馬</span>');
    fl.push(inCfg ? '<span class="fl ok">配案工具 已收錄</span>'
                  : '<span class="fl wa">配案工具 未收錄</span>');
    if(hasStop(hits)) fl.push('<span class="fl no">防呆 '+hits.filter(h=>h.lv==='stop').length+' 項未過</span>');
    return '<div class="row">'
      + '<div class="hd"><div class="m">'
      +   '<div class="n">'+esc(o.n||'（未命名）')+'</div>'
      +   '<div class="s">'+esc(o.loc||'')+'　'+esc((o.sp||[]).slice(0,2).join('・'))+'</div>'
      + '</div><div class="price">'+(o.p||'?')+'<span style="font-size:11px">萬</span></div></div>'
      + '<div class="flags">'+fl.join('')+'</div>'
      + '<div class="btnrow" style="margin-top:10px">'
      +   '<button class="btn sm" onclick="edit('+i+')">編輯</button>'
      +   '<button class="btn sm d" onclick="offshelf('+i+')">下架</button>'
      + '</div></div>';
  }).join('');
}

/* data.js 一筆 ↔ config.js listings 一筆的配對：用留言碼(code)或名稱關鍵字 */
function matchCfg(o){
  return D.cfgListings.findIndex(c=>{
    const note = (c.note||'') + (c.name||'');
    if(o.code && note.includes(o.code)) return true;
    if(o.n){
      const head = o.n.split('｜')[0].replace(/\s/g,'');
      if(head && (c.name||'').replace(/\s/g,'').includes(head)) return true;
    }
    return false;
  });
}

/* ───────── 編輯表單 ───────── */
function edit(i){
  const isNew = i < 0;
  const o = isNew
    ? {id:'',n:'',loc:'',r:'',p:'',pt:'委託總價',grade:'',sp:[],sell:'',honest:'',code:'',img:''}
    : JSON.parse(JSON.stringify(D.wu[i]));
  const ci = isNew ? -1 : matchCfg(o);
  const c  = ci >= 0 ? JSON.parse(JSON.stringify(D.cfgListings[ci])) : {};

  openSheet(isNew ? '新增物件' : '編輯物件', `
    <div class="f"><label>物件名稱 <i>／ 用全形｜分隔主副標</i></label>
      <input type="text" id="e_n" value="${att(o.n)}" placeholder="例：光華商圈｜850萬4房"></div>
    <div class="f2">
      <div class="f"><label>地點 <i>／ 只到商圈或路段</i></label>
        <input type="text" id="e_loc" value="${att(o.loc)}" placeholder="新莊・光華商圈"></div>
      <div class="f"><label>區域標籤 <i>／ 篩選用</i></label>
        <input type="text" id="e_r" value="${att(o.r)}" placeholder="新莊"></div>
    </div>
    <div class="f2">
      <div class="f"><label>總價（萬）</label>
        <input type="number" id="e_p" value="${att(o.p)}" inputmode="numeric"></div>
      <div class="f"><label>價格名目</label>
        <select id="e_pt">
          ${['委託總價','開價','開價(含車位)','委託總價(含車位)'].map(v=>
            `<option ${o.pt===v?'selected':''}>${v}</option>`).join('')}
        </select></div>
    </div>
    <div class="f"><label>規格 <i>／ 一行一項，例：22.07坪</i></label>
      <textarea id="e_sp" style="min-height:96px">${esc((o.sp||[]).join('\n'))}</textarea></div>
    <div class="f"><label>賣點 <i>／ 為什麼值得看</i></label>
      <textarea id="e_sell">${esc(o.sell)}</textarea></div>
    <div class="f"><label>誠實揭露 <i>／ 缺點直球，這欄不准空</i></label>
      <textarea id="e_honest">${esc(o.honest)}</textarea></div>
    <div class="f2">
      <div class="f"><label>留言關鍵字</label>
        <input type="text" id="e_code" value="${att(o.code)}" placeholder="光華2樓"></div>
      <div class="f"><label>網址代號 id <i>／ 英數</i></label>
        <input type="text" id="e_id" value="${att(o.id)}" placeholder="gh023"></div>
    </div>
    <div class="f"><label>封面圖路徑 <i>／ 圖檔本身要另外放進 repo，這裡只填路徑</i></label>
      <input type="text" id="e_img" value="${att(o.img)}" placeholder="/wujian/guanghua/a/cover.jpg"></div>
    <div class="f"><label>首頁跑馬</label>
      <select id="e_grade">
        <option value="" ${o.grade!=='A'?'selected':''}>不上首頁</option>
        <option value="A" ${o.grade==='A'?'selected':''}>A ＝ 首頁跑馬主打</option>
      </select></div>

    <hr>
    <h3 style="font-size:15px;font-weight:800;margin-bottom:4px">同步到買方配案工具</h3>
    <p class="sub">關掉＝這筆不出現在 /tools/#/match。下架時兩邊會一起清。</p>
    <div class="f"><label>收錄狀態</label>
      <select id="e_incfg">
        <option value="1" ${ci>=0?'selected':''}>收錄</option>
        <option value="0" ${ci<0?'selected':''}>不收錄</option>
      </select></div>
    <div class="f2">
      <div class="f"><label>行政區全名 <i>／ 配案篩選用</i></label>
        <input type="text" id="e_region" value="${att(c.region)}" placeholder="新北市新莊區"></div>
      <div class="f"><label>房數 <i>／ 只填數字</i></label>
        <input type="text" id="e_rooms" value="${att(c.rooms)}" placeholder="4"></div>
    </div>
    <div class="f"><label>配案標籤 <i>／ 逗號分隔</i></label>
      <input type="text" id="e_tags" value="${att((c.tags||[]).join(','))}"
        placeholder="elevator, parking, near_mrt, renovated, rare_layout"></div>

    <div id="gbox"></div>
    <div class="btnrow grow" style="margin-top:14px">
      <button class="btn" onclick="closeSheet()">取消</button>
      <button class="btn p" onclick="saveItem(${i})">存起來</button>
    </div>
  `);
  document.getElementById('sheetIn').addEventListener('input', ()=>liveGuard(), {once:false});
  liveGuard();
}
function liveGuard(){
  const g = document.getElementById('gbox');
  if(!g) return;
  g.innerHTML = guardHTML(scan(collect()));
}
function collect(){
  const v = id => (document.getElementById(id)||{}).value || '';
  return {
    id:v('e_id').trim(), n:v('e_n').trim(), loc:v('e_loc').trim(), r:v('e_r').trim(),
    p:Number(v('e_p'))||0, pt:v('e_pt'), grade:v('e_grade'),
    sp:v('e_sp').split('\n').map(s=>s.trim()).filter(Boolean),
    sell:v('e_sell').trim(), honest:v('e_honest').trim(),
    code:v('e_code').trim(), img:v('e_img').trim(),
    _incfg:v('e_incfg')==='1', _region:v('e_region').trim(), _rooms:v('e_rooms').trim(),
    _tags:v('e_tags').split(',').map(s=>s.trim()).filter(Boolean)
  };
}
function saveItem(i){
  const o = collect();
  if(!o.n){ toast('物件名稱不能空'); return; }
  if(!o.honest){ toast('誠實揭露不能空——缺點要寫'); return; }
  const hits = scan(o);
  if(hasStop(hits)){ toast('防呆沒過，先修紅色那幾項'); return; }

  const incfg = o._incfg, region = o._region, rooms = o._rooms, tags = o._tags;
  delete o._incfg; delete o._region; delete o._rooms; delete o._tags;
  if(!o.id) o.id = 'p' + Date.now().toString(36);
  if(!o.grade) delete o.grade;
  if(!o.img) delete o.img;

  const old = i>=0 ? D.wu[i] : null;
  const ci  = old ? matchCfg(old) : -1;

  if(i>=0) D.wu[i] = o; else D.wu.push(o);

  if(incfg){
    const rec = {
      name : o.n.replace(/｜/g,'｜'),
      price: o.p,
      region: region || o.r,
      note : (o.sp||[]).join('、') + (o.code ? '。留言關鍵字：'+o.code : '')
    };
    if(rooms) rec.rooms = rooms;
    if(tags.length) rec.tags = tags;
    if(ci>=0) D.cfgListings[ci] = Object.assign({}, D.cfgListings[ci], rec);
    else D.cfgListings.push(rec);
  }else if(ci>=0){
    D.cfgListings.splice(ci,1);
  }
  closeSheet(); save(); toast(i>=0?'已更新':'已新增');
}

/* ───────── 下架（兩邊一起清） ───────── */
function offshelf(i){
  const o = D.wu[i];
  const ci = matchCfg(o);
  const extra = [];
  extra.push('・/wujian/data.js　移除這筆');
  if(ci>=0) extra.push('・/tools/config.js　買方配案工具同步移除');
  if(o.id) extra.push('・/wujian/'+o.id+'/　個案簡報頁：頁面本身要另外處理（後台不會刪資料夾）');
  (D.fb.videos||[]).forEach(v=>{
    if(o.code && (v.t+v.d).includes(o.code)) extra.push('・首頁影片區有一支關聯影片，記得一起看');
  });
  if(!confirm('下架「'+o.n+'」？\n\n這次會做：\n'+extra.join('\n')+'\n\n出貨覆蓋檔案後才會真的生效。')) return;
  D.wu.splice(i,1);
  if(ci>=0) D.cfgListings.splice(ci,1);
  save();
  toast('已下架，記得到「出貨」拿新檔覆蓋');
}

/* ───────── 影片文章 ───────── */
function renderFb(){
  ['videos','posts'].forEach(k=>{
    const box = document.getElementById(k==='videos'?'vlist':'plist');
    const arr = D.fb[k] || [];
    box.innerHTML = arr.length ? arr.map((x,i)=>
      '<div class="row"><div class="hd"><div class="m">'
      + '<div class="n">'+esc(x.t)+'</div>'
      + '<div class="s">'+esc(x.d)+'</div>'
      + '<div class="tiny" style="margin-top:4px;word-break:break-all">'+esc(x.u)+'</div>'
      + '</div></div><div class="btnrow" style="margin-top:10px">'
      + '<button class="btn sm" onclick="editFb(\''+k+'\','+i+')">編輯</button>'
      + '<button class="btn sm d" onclick="delFb(\''+k+'\','+i+')">移除</button>'
      + '</div></div>').join('')
      : '<div class="empty" style="padding:18px">還沒有</div>';
  });
}
function addFb(k){ editFb(k,-1); }
function editFb(k,i){
  const isNew = i<0;
  const x = isNew ? {t:'',d:'',u:'',img:''} : JSON.parse(JSON.stringify(D.fb[k][i]));
  const isVid = k==='videos';
  openSheet(isNew?('新增'+(isVid?'影片':'貼文')):'編輯', `
    <div class="f"><label>標題 <i>／ 鉤子，一句話</i></label>
      <input type="text" id="v_t" value="${att(x.t)}"></div>
    <div class="f"><label>說明</label>
      <textarea id="v_d">${esc(x.d)}</textarea></div>
    <div class="f"><label>連結網址</label>
      <input type="text" id="v_u" value="${att(x.u)}" placeholder="https://www.facebook.com/reel/..."></div>
    ${isVid?`<div class="f"><label>縮圖路徑</label>
      <input type="text" id="v_img" value="${att(x.img)}" placeholder="/wujian/xxx/a/cover.jpg"></div>`:''}
    <div id="gbox"></div>
    <div class="btnrow grow" style="margin-top:14px">
      <button class="btn" onclick="closeSheet()">取消</button>
      <button class="btn p" onclick="saveFb('${k}',${i},${isVid})">存起來</button>
    </div>
  `);
  document.getElementById('sheetIn').addEventListener('input', ()=>{
    const g=document.getElementById('gbox');
    if(g) g.innerHTML = guardHTML(scan(collectFb(isVid)));
  });
}
function collectFb(isVid){
  const v = id => (document.getElementById(id)||{}).value || '';
  const o = {t:v('v_t').trim(), d:v('v_d').trim(), u:v('v_u').trim()};
  if(isVid) o.img = v('v_img').trim();
  return o;
}
function saveFb(k,i,isVid){
  const o = collectFb(isVid);
  if(!o.t){ toast('標題不能空'); return; }
  if(!o.u){ toast('連結不能空'); return; }
  if(hasStop(scan(o))){ toast('防呆沒過'); return; }
  if(isVid && !o.img) delete o.img;
  D.fb[k] = D.fb[k] || [];
  if(i>=0) D.fb[k][i] = o; else D.fb[k].push(o);
  closeSheet(); save(); toast('已存');
}
function delFb(k,i){
  if(!confirm('移除「'+D.fb[k][i].t+'」？')) return;
  D.fb[k].splice(i,1); save(); toast('已移除');
}

/* ───────── 同步檢查 ───────── */
function renderCheck(){
  const box = document.getElementById('ckout');
  const orphan = [];
  D.cfgListings.forEach((c,i)=>{
    const back = D.wu.findIndex(o=>matchCfg(o)===i);
    if(back < 0) orphan.push({c,i});
  });
  const missing = D.wu.filter(o=>matchCfg(o)<0);
  const badGuard = D.wu.map((o,i)=>({o,i,h:scan(o)})).filter(x=>hasStop(x.h));

  let h = '';

  h += '<div class="card"><h3>物件總數</h3>'
    + '<p class="muted">在售物件 <b>'+D.wu.length+'</b> 筆　·　買方配案工具 <b>'+D.cfgListings.length+'</b> 筆</p></div>';

  if(orphan.length){
    h += '<div class="card"><h3>🔴 只在配案工具、物件頁沒有　'+orphan.length+' 筆</h3>'
      + '<p class="muted">這種最危險：物件頁下架了，配案工具還在推。逐筆決定要補回物件頁還是直接清掉。</p>'
      + orphan.map(x=>'<div class="row" style="margin-top:10px"><div class="hd"><div class="m">'
        + '<div class="n">'+esc(x.c.name)+'</div>'
        + '<div class="s">'+esc(x.c.region||'')+'　'+(x.c.price||'?')+'萬</div></div></div>'
        + '<div class="btnrow" style="margin-top:10px">'
        + '<button class="btn sm d" onclick="dropCfg('+x.i+')">從配案工具清掉</button>'
        + '</div></div>').join('')
      + '</div>';
  }
  if(missing.length){
    h += '<div class="card"><h3>🟡 只在物件頁、配案工具沒有　'+missing.length+' 筆</h3>'
      + '<p class="muted">不一定是錯——刻意不放配案工具的就略過。要收錄的話進「物件」頁編輯，把「同步到買方配案工具」打開。</p><ul class="muted">'
      + missing.map(o=>'<li>'+esc(o.n)+'</li>').join('') + '</ul></div>';
  }
  if(badGuard.length){
    h += '<div class="card"><h3>🔴 防呆未過　'+badGuard.length+' 筆</h3>'
      + badGuard.map(x=>'<div style="margin-top:10px"><b>'+esc(x.o.n)+'</b>'
        + guardHTML(x.h, true) + '</div>').join('') + '</div>';
  }
  if(!orphan.length && !missing.length && !badGuard.length){
    h += '<div class="card"><div class="guard pass" style="margin:0">'
      + '<b>✅ 兩邊對齊，防呆全過</b>物件頁與買方配案工具內容一致，沒有掃到紅線字眼。</div></div>';
  }

  h += '<div class="card"><h3>後台管不到的、要自己看的</h3><ul class="muted">'
    + '<li><b>個案簡報頁</b>（/wujian/&lt;id&gt;/）是獨立 HTML，下架物件不會自動刪頁，要另外處理</li>'
    + '<li><b>robots.txt</b> 的 Disallow 清單，noindex 的個案頁要記得加進去</li>'
    + '<li><b>圖檔本身</b>不能從這裡上傳，靜態站要把檔案放進 repo，這裡只填路徑</li>'
    + '<li><b>sitemap.xml</b> 新增頁面時要補</li>'
    + '</ul></div>';

  box.innerHTML = h;
}
function dropCfg(i){
  if(!confirm('從買方配案工具清掉「'+D.cfgListings[i].name+'」？')) return;
  D.cfgListings.splice(i,1); save(); toast('已清掉');
}

/* ───────── 產檔 ───────── */
function q(s){ return "'" + String(s==null?'':s).replace(/\\/g,'\\\\').replace(/'/g,"\\'") + "'"; }
function buildData(){
  const head =
`/* 在售物件資料　單一來源
   首頁跑馬與 /wujian/ 列表共用。改這裡兩邊同步。
   grade:'A' = 首頁跑馬會顯示（主打案）。
   內容一律以 Notion 物件素材庫為準，開價≠成交價。
   🔧 由 /_hq/ 後台產出，時間 ${stamp()} */
window.AHLISTINGS = [
`;
  const body = D.wu.map(o=>{
    let s = ' {id:'+q(o.id)+', n:'+q(o.n)+', loc:'+q(o.loc)+', r:'+q(o.r)
          + ', p:'+(o.p||0)+', pt:'+q(o.pt);
    if(o.grade) s += ', grade:'+q(o.grade);
    s += ',\n  sp:['+(o.sp||[]).map(q).join(',')+'],';
    s += '\n  sell:'+q(o.sell)+',';
    s += '\n  honest:'+q(o.honest)+',';
    s += '\n  code:'+q(o.code);
    if(o.img) s += ', img:'+q(o.img);
    return s + '}';
  }).join(',\n\n');
  return head + body + '\n];\n';
}
function buildCfg(){
  const c = JSON.parse(JSON.stringify(LIVE.cfg));
  c.listings = D.cfgListings;
  return `/* 阿宏不動產工具站　設定檔
   由 /_hq/ 後台產生。放在 index.html 同一個資料夾即可生效。
   不要手改，回後台改完重新下載覆蓋。
   最後產出：${stamp()} */
window.AHCONFIG = ` + JSON.stringify(c, null, 2) + ';\n';
}
function buildFb(){
  const V = (D.fb.videos||[]).map(v=>{
    let s = '    {t:'+q(v.t)+', d:'+q(v.d)+',\n     u:'+q(v.u);
    if(v.img) s += ', img:'+q(v.img);
    return s + '}';
  }).join(',\n');
  const P = (D.fb.posts||[]).map(p=>
    '    {t:'+q(p.t)+', d:'+q(p.d)+',\n     u:'+q(p.u)+'}').join(',\n');
  return `/* FB 內容整合資料　只放已上架、已驗證的公開內容。
   新片新文上架後在這裡加一筆，首頁自動更新。
   🚫 不寫讚數留言數（會過時且無法自動更新）。
   🔧 由 /_hq/ 後台產出，時間 ${stamp()} */
window.AHFB = {
  page: ${q(D.fb.page||'')},
  videos: [
${V}
  ],
  posts: [
${P}
  ]
};
`;
}
const BUILD = {data:buildData, cfg:buildCfg, fb:buildFb};
const FNAME = {data:'data.js', cfg:'config.js', fb:'fbfeed.js'};
const FPATH = {data:'/wujian/data.js', cfg:'/tools/config.js', fb:'/fbfeed.js'};

function show(k){ document.getElementById('peek').value = BUILD[k](); }

/* 複製：iPhone 三層備援 */
function ship(k){
  const text = BUILD[k]();
  const done = ()=> toast('已複製 '+FNAME[k]+'　貼回 '+FPATH[k]);
  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).then(done).catch(()=>fallback());
  } else fallback();
  function fallback(){
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.focus(); ta.select(); ta.setSelectionRange(0, text.length);
    let ok = false;
    try{ ok = document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta);
    if(ok) done();
    else { document.getElementById('peek').value = text;
      switchPane('out');
      toast('複製失敗，內容已放到最下面的框，長按全選');
    }
  }
}
function dl(k){
  const blob = new Blob([BUILD[k]()], {type:'text/javascript;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = FNAME[k];
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 100);
  toast('已下載，覆蓋回 '+FPATH[k]);
}

/* ───────── 雜項 ───────── */
function stamp(){
  const d = new Date(), z = n=>String(n).padStart(2,'0');
  return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+' '+z(d.getHours())+':'+z(d.getMinutes());
}
function esc(s){ return String(s==null?'':s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function att(s){ return esc(s).replace(/"/g,'&quot;'); }
function openSheet(title, html){
  document.getElementById('sheetIn').innerHTML =
    '<div class="sheet-h"><b>'+esc(title)+'</b>'
    + '<button class="btn sm" onclick="closeSheet()">關閉</button></div>' + html;
  document.getElementById('sheet').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeSheet(){
  document.getElementById('sheet').classList.remove('on');
  document.body.style.overflow = '';
}
document.getElementById('sheet').addEventListener('click', e=>{
  if(e.target.id === 'sheet') closeSheet();
});
let tt;
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('on');
  clearTimeout(tt); tt = setTimeout(()=>el.classList.remove('on'), 2600);
}
function switchPane(p){
  document.querySelectorAll('.tabs button').forEach(b=>
    b.setAttribute('aria-selected', b.dataset.p===p ? 'true':'false'));
  document.querySelectorAll('.pane').forEach(el=>
    el.classList.toggle('on', el.id === 'p-'+p));
  window.scrollTo(0,0);
}
document.querySelectorAll('.tabs button').forEach(b=>
  b.addEventListener('click', ()=>switchPane(b.dataset.p)));

render(); markDirty();
