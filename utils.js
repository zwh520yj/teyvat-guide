/* ============================================================
   TEYVAT GUIDE — Image Loader v3 (Multi-CDN + Retry)
   ============================================================ */
function imgName(n){return n.replace(/\s+/g,'_').replace(/[']/g,'').replace(/[()]/g,'');}

// Build URLs for different CDN sources
function charUrls(name){
  var n=imgName(name), s=name.toLowerCase().replace(/\s+/g,'-').replace(/[']/g,'');
  return [
    'https://enka.network/ui/UI_AvatarIcon_Side_'+n+'.png',
    'https://enka.network/ui/UI_AvatarIcon_'+n+'.png',
    'https://gi.yatta.moe/assets/UI/UI_AvatarIcon_Side_'+n+'.png',
  ];
}
function weaponUrls(name){
  var n=imgName(name);
  return [
    'https://enka.network/ui/UI_EquipIcon_'+n+'.png',
    'https://gi.yatta.moe/assets/UI/UI_EquipIcon_'+n+'.png',
  ];
}
function artifactUrls(name){
  var n=imgName(name);
  return [
    'https://enka.network/ui/UI_RelicIcon_'+n+'_1.png',
    'https://enka.network/ui/UI_RelicIcon_'+n+'_2.png',
    'https://gi.yatta.moe/assets/UI/UI_RelicIcon_'+n+'_1.png',
  ];
}

// Inline HTML: character image with multi-CDN fallback
function charImgHTML(name, elColor){
  var u=charUrls(name), init=name.charAt(0).toUpperCase(), id='ci'+Math.random().toString(36).slice(2,8);
  return '<span style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;">'+
    '<span class="img-fb" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;z-index:1;font-size:inherit;">'+init+'</span>'+
    '<img id="'+id+'" src="'+u[0]+'" loading="lazy" alt="'+name+'" '+
    'onload="var f=this.parentElement.querySelector(\'.img-fb\');if(f)f.style.display=\'none\';this.style.display=\'block\';" '+
    'onerror="var t=this,f=t.parentElement.querySelector(\'.img-fb\');t._e=(t._e||0)+1;'+
    'if(t._e===1)t.src=\''+u[1]+'\';else if(t._e===2)t.src=\''+(u[2]||u[1])+'\';else{t.style.display=\'none\';if(f)f.style.display=\'\';}" '+
    'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none;z-index:2;"></span>';
}

// Weapon image HTML
function weaponImgHTML(name){
  var u=weaponUrls(name);
  return '<img src="'+u[0]+'" loading="lazy" alt="'+name+'" '+
    'onerror="var t=this;t._e=(t._e||0)+1;if(t._e===1)t.src=\''+u[1]+'\';else t.style.display=\'none\';" '+
    'style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;display:none;">';
}

// Artifact image HTML
function artifactImgHTML(name){
  var u=artifactUrls(name);
  return '<img src="'+u[0]+'" loading="lazy" alt="'+name+'" '+
    'onerror="var t=this;t._e=(t._e||0)+1;if(t._e===1)t.src=\''+u[1]+'\';else if(t._e===2)t.src=\''+(u[2]||u[1])+'\';else t.style.display=\'none\';" '+
    'style="width:100%;height:100%;object-fit:cover;display:none;">';
}

function createElementBadge(el){
  var d=(typeof ELEMENTS!=='undefined'&&ELEMENTS[el])?ELEMENTS[el]:null;
  var c=d?d.color:'#555',ic=d?d.icon:'fa-question',nm=d?d.name:el;
  return '<span class="element-badge" style="background:'+c+'"><i class="fa-solid '+ic+'"></i> '+nm+'</span>';
}
