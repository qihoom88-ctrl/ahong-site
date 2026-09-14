/* 哪一邊頁 第二集 資產結構五格：準備清單＋五格試算。數字只在頁面記憶體裡算，不送出、不存、不出站 */
(function(){
  /* 準備清單：只記勾選狀態，不記任何試算數字 */
  var KEY='lazypack_zichanjiegou_check_v1';
  var boxes=[].slice.call(document.querySelectorAll('#clbox2 input[type=checkbox]'));
  var score=document.getElementById('score2');
  if(boxes.length&&score){
    var render=function(){
      var n=boxes.filter(function(b){return b.checked;}).length;
      if(n===0){score.textContent='還沒有勾選任何一項。';}
      else if(n<=3){score.textContent='還有 '+n+' 項沒準備。快了，補完就可以把五格算完。';}
      else if(n<=6){score.textContent='還有 '+n+' 項沒準備。先找繳款單跟存摺，前兩格就算得出來。';}
      else{score.textContent='還有 '+n+' 項沒準備。找一個晚上，把繳款單跟存摺拿出來一次備齊。';}
      try{localStorage.setItem(KEY,JSON.stringify(boxes.map(function(b){return b.checked?1:0;})));}catch(e){}
    };
    try{var raw=localStorage.getItem(KEY);if(raw){var s=JSON.parse(raw);boxes.forEach(function(b,i){b.checked=!!s[i];});}}catch(e){}
    boxes.forEach(function(b){b.addEventListener('change',render);});
    render();
  }
})();

(function(){
  /* 五格試算：數字只在這個頁面的記憶體裡，不送出、不存、不出站 */
  var fields=[].slice.call(document.querySelectorAll('input.f'));
  var touched={};
  function num(k){
    var el=fields.filter(function(f){return f.getAttribute('data-k')===k&&f.value!=='';})[0];
    if(!el)return NaN;
    var v=parseFloat(el.value);
    return isFinite(v)&&v>=0?v:NaN;
  }
  function setAll(k,v,src){
    fields.forEach(function(f){ if(f!==src&&f.getAttribute('data-k')===k){ f.value=v; } });
  }
  function fmt(n){ return Math.round(n).toLocaleString('zh-TW'); }
  function pmt(loanWan,years,rate){
    var L=loanWan*10000, n=Math.round(years*12), r=rate/100/12;
    if(!(L>0)||!(n>0))return NaN;
    if(r===0)return L/n;
    return L*r/(1-Math.pow(1+r,-n));
  }
  function out(id,html){ document.getElementById(id).innerHTML=html; }
  var P1=NaN, P1up=NaN;

  function calc(){
    var loan=num('loan'), years=num('years'), rate=num('rate');
    P1=NaN; P1up=NaN;
    if(isFinite(loan)&&isFinite(years)&&isFinite(rate)&&years>0){
      P1=pmt(loan,years,rate); P1up=pmt(loan,years,rate+0.25);
    }
    if(isFinite(P1)){
      out('o1','現在月付約 <span class="n">'+fmt(P1)+'</span> 元<br>升一碼（'+(rate+0.25).toFixed(3).replace(/0+$/,'').replace(/\.$/,'')+'%）後約 <span class="n">'+fmt(P1up)+'</span> 元<br>每個月多出約 <span class="n">'+fmt(P1up-P1)+'</span> 元，一年約 '+fmt((P1up-P1)*12)+' 元');
      if(!touched.pay){ setAll('pay',Math.round(P1),null); }
    }else{
      out('o1','填完三格，這裡會出現現在的月付與升一碼後的月付。');
    }

    var income=num('income'), pay=num('pay'), fixed=num('fixed');
    var extra=(isFinite(P1)&&isFinite(P1up))?(P1up-P1):NaN;
    if(isFinite(income)&&isFinite(pay)){
      var f=isFinite(fixed)?fixed:0;
      var left=income-pay-f;
      var t='每月扣完房貸'+(isFinite(fixed)?'與固定支出':'')+'，剩約 <span class="n">'+fmt(left)+'</span> 元';
      if(isFinite(extra)){ t+='<br>升一碼後剩約 <span class="n">'+fmt(left-extra)+'</span> 元'; }
      if(left<0||(isFinite(extra)&&left-extra<0)){ t+='<br>出現負數：這個家每個月已經在動用存款。'; }
      out('o2',t);
      if(!touched.spend){ setAll('spend',Math.round(pay+f),null); }
    }else{
      out('o2','填完收入與支出，這裡會出現每月剩多少，以及升一碼後剩多少。');
    }

    var house=num('house'), other=num('other'), shock=num('shock');
    if(isFinite(house)&&isFinite(other)&&house+other>0){
      var ratio=house/(house+other)*100;
      var t3='房子占你全部資產約 <span class="n">'+ratio.toFixed(1)+'%</span>';
      if(isFinite(loan)){
        var eq=house-loan;
        t3+='<br>扣掉貸款，你在房子裡的權益約 <span class="n">'+fmt(eq)+'</span> 萬元';
        if(isFinite(shock)&&shock>0&&shock<=100){
          var cut=house*shock/100;
          t3+='<br>假設價格往回走 '+shock+'%：房子少約 '+fmt(cut)+' 萬元，這一塊全部先從你的權益扣';
          if(eq>0){ t3+='，占你權益的 '+Math.min(100,cut/eq*100).toFixed(1)+'%'; }
        }
      }
      out('o3',t3);
    }else{
      out('o3','填完估值與資產，這裡會出現房子占資產幾成、你的權益多少。');
    }

    if(isFinite(pay)&&isFinite(income)&&income>0){
      var r4=pay/income*100;
      var t4='房貸月付占收入約 <span class="n">'+r4.toFixed(1)+'%</span>，議事錄那把尺是 30%';
      t4+=(r4>30)?'，你家高過那把尺':'，你家在那把尺以內';
      if(isFinite(extra)){ t4+='<br>升一碼後約 <span class="n">'+((pay+extra)/income*100).toFixed(1)+'%</span>'; }
      out('o4',t4);
    }else{
      out('o4','填完兩格，這裡會出現月付占收入的比例，以及升一碼後的比例。');
    }

    var cash=num('cash'), spend=num('spend');
    if(isFinite(cash)&&isFinite(income)&&isFinite(spend)){
      var gap=spend-income*0.7;
      if(gap<=0){
        out('o5','收入少三成後，每月仍有約 <span class="n">'+fmt(-gap)+'</span> 元剩下，這一格暫時不用動到存款');
      }else{
        var m=cash*10000/gap;
        out('o5','收入少三成後，每月缺約 <span class="n">'+fmt(gap)+'</span> 元<br>存款撐得過約 <span class="n">'+(Math.floor(m*10)/10)+'</span> 個月');
      }
    }else{
      out('o5','填完三格，這裡會出現收入少三成時，存款撐得過幾個月。');
    }
  }

  fields.forEach(function(f){
    f.addEventListener('input',function(){
      var k=f.getAttribute('data-k');
      if(k==='pay'||k==='spend'){ touched[k]=f.value!==''; }
      setAll(k,f.value,f);
      calc();
    });
  });
  calc();
})();
