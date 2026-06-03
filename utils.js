/* ============================================================
   TEYVAT GUIDE — Image Loader v7 (Complete)
   Primary: genshin.jmp.blue (characters/weapons/artifacts)
   Fallback: enka.network + gi.yatta.moe
   ============================================================ */

/* ── Convert display name → genshin.jmp.blue kebab-case ── */
function toKebab(name) {
  return name.toLowerCase()
    .replace(/'s\b/g, '-s')          // Wolf's → wolf-s, Dragon's → dragon-s
    .replace(/['‘’]/g, '') // Remove remaining apostrophes
    .replace(/[()]/g, '')            // Remove parentheses
    .replace(/[^a-z0-9\s-]/g, '')    // Remove other special chars
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join('-');
}

/* ── Character name → jmp.blue kebab-name mapping ──
   Most work with toKebab(). Only list exceptions here. */
var CHAR_JMP_MAP = {
  'Raiden Shogun': 'raiden',
  'Itto': 'arataki-itto',
  'Heizou': 'shikanoin-heizou',
  'Tartaglia (Childe)': 'tartaglia',
  'Wanderer (Scaramouche)': 'wanderer',
  'Traveler (Anemo)': 'traveler-anemo',
  'Traveler (Geo)': 'traveler-geo',
  'Traveler (Electro)': 'traveler-electro',
  'Traveler (Dendro)': 'traveler-dendro',
  'Traveler (Hydro)': 'traveler-hydro',
};

/* ── Weapon name → jmp.blue kebab-name exceptions ── */
var WEAPON_JMP_MAP = {
  'Tome of the Eternal Flow': 'tome-of-the-eternal',
  'Amos\' Bow': 'amos-bow',
  'Apprentice\'s Notes': 'apprentice-s-notes',
  'Beginner\'s Protector': 'beginner-s-protector',
  'Old Merc\'s Pal': 'old-merc-s-pal',
  'Seasoned Hunter\'s Bow': 'seasoned-hunter-s-bow',
  'Sharpshooter\'s Oath': 'sharpshooter-s-oath',
  'Traveler\'s Handy Sword': 'traveler-s-handy-sword',
  'Prospector\'s Drill': 'prospectors-drill',
  'The Dockhand\'s Assistant': 'the-dockhands-assistant',
};

function charJmpName(name) {
  if (CHAR_JMP_MAP[name]) return CHAR_JMP_MAP[name];
  // Also try with underscores→spaces (handles Raiden_Shogun etc.)
  var spaced = name.replace(/_/g, ' ');
  if (spaced !== name && CHAR_JMP_MAP[spaced]) return CHAR_JMP_MAP[spaced];
  return toKebab(name);
}
function weaponJmpName(name) {
  return WEAPON_JMP_MAP[name] || toKebab(name);
}
function artifactJmpName(name) {
  return toKebab(name);
}

/* ══════════════════════════════════════════════════════════════
   URL GENERATORS
   ══════════════════════════════════════════════════════════════ */

function charUrls(name) {
  var kb = charJmpName(name);
  var wikiName = name.replace(/\s*\(.*?\)\s*/, '').trim();
  var en = name.replace(/\s+/g, '_').replace(/['‘’]/g, '').replace(/[()]/g, '');
  var cap = name.replace(/\s+/g, '_').replace(/['‘’]/g, '').replace(/[()]/g, '');
  cap = cap.charAt(0).toUpperCase() + cap.slice(1);
  return [
    'https://genshin.jmp.blue/characters/' + kb + '/icon-big',
    'https://genshin.jmp.blue/characters/' + kb + '/icon',
    'https://gi.yatta.moe/assets/UI/UI_AvatarIcon_Side_' + cap + '.png',
    'https://enka.network/ui/UI_AvatarIcon_Side_' + en + '.png',
    'https://genshin-impact.fandom.com/wiki/Special:FilePath/' + encodeURIComponent(wikiName) + '_Card.png',
  ];
}

function weaponUrls(name) {
  var kb = weaponJmpName(name);
  return [
    'https://genshin.jmp.blue/weapons/' + kb + '/icon',
    'https://gi.yatta.moe/assets/UI/UI_EquipIcon_' + name.replace(/\s+/g, '_').replace(/['‘’]/g, '').replace(/[()]/g, '') + '.png',
    'https://enka.network/ui/UI_EquipIcon_' + name.replace(/\s+/g, '_').replace(/['‘’]/g, '').replace(/[()]/g, '') + '.png',
  ];
}

function artifactUrls(name) {
  var kb = artifactJmpName(name);
  return [
    'https://genshin.jmp.blue/artifacts/' + kb + '/flower-of-life',
    'https://genshin.jmp.blue/artifacts/' + kb + '/circlet-of-logos',
    'https://gi.yatta.moe/assets/UI/UI_RelicIcon_' + name.replace(/\s+/g, '_').replace(/['‘’]/g, '').replace(/[()]/g, '') + '_1.png',
    'https://enka.network/ui/UI_RelicIcon_' + name.replace(/\s+/g, '_').replace(/['‘’]/g, '').replace(/[()]/g, '') + '_1.png',
  ];
}

/* ── Convenience ── */
function charImgUrl(name)   { return charUrls(name)[0]; }
function weaponImgUrl(name) { return weaponUrls(name)[0]; }
function artifactImgUrl(name) { return artifactUrls(name)[0]; }
// charIconName — returns Enka-compatible name (backward compat for teams.html, wish-sim.html)
function charIconName(name) {
  return name.replace(/\s+/g, '_').replace(/['\\u2018\\u2019]/g, '').replace(/[()]/g, '');
}

/* ══════════════════════════════════════════════════════════════
   INLINE HTML GENERATORS
   ══════════════════════════════════════════════════════════════ */

/** Bare <img> tag with multi-CDN retry — starts visible, hides only on final failure */
function charImgTag(name) {
  var urls = charUrls(name);
  var json = JSON.stringify(urls);
  return '<img src="' + urls[0] + '" alt="' + name + '" ' +
    'onload="this.classList.add(\'img-ok\');var p=this.parentElement;if(p){var fb=p.querySelector(\'.img-fb\');if(fb)fb.style.display=\'none\';var tx=p.childNodes;for(var i=0;i<tx.length;i++){if(tx[i].nodeType===3&&tx[i].textContent.trim()){tx[i].textContent=\'\';}}}" ' +
    'onerror="var t=this,u=' + json + ';t._e=(t._e||0)+1;' +
    'if(t._e<u.length){t.src=u[t._e];}else{t.style.opacity=\'0\';t.style.visibility=\'hidden\';}" ' +
    'style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:2;">';
}

/** Self-contained character image + fallback letter — flat siblings, both absolute */
function charImgHTML(name, elColor) {
  var urls = charUrls(name);
  var json = JSON.stringify(urls);
  var init = name.charAt(0).toUpperCase();
  return '<span class="img-fb" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;z-index:1;font-size:inherit;pointer-events:none;">' + init + '</span>' +
    '<img src="' + urls[0] + '" alt="' + name + '" ' +
    'onload="var s=this.previousElementSibling;if(s&&s.classList.contains(\'img-fb\'))s.style.display=\'none\';this.classList.add(\'img-ok\');" ' +
    'onerror="var t=this,s=t.previousElementSibling,u=' + json + ';t._e=(t._e||0)+1;' +
    'if(t._e<u.length){t.src=u[t._e];}else{t.style.opacity=\'0\';t.style.visibility=\'hidden\';if(s&&s.classList.contains(\'img-fb\'))s.style.display=\'\';}" ' +
    'style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2;border-radius:inherit;">';
}

function weaponImgHTML(name) {
  var urls = weaponUrls(name);
  var json = JSON.stringify(urls);
  return '<img src="' + urls[0] + '" alt="' + name + '" ' +
    'onload="this.classList.add(\'img-ok\');var i=this.parentElement.querySelector(\'.fa-solid\');if(i)i.style.display=\'none\';" ' +
    'onerror="var t=this,u=' + json + ';t._e=(t._e||0)+1;' +
    'if(t._e<u.length){t.src=u[t._e];}else{t.style.opacity=\'0\';t.style.visibility=\'hidden\';}" ' +
    'style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:2;">';
}

function artifactImgHTML(name) {
  var urls = artifactUrls(name);
  var json = JSON.stringify(urls);
  return '<img src="' + urls[0] + '" alt="' + name + '" ' +
    'onload="this.classList.add(\'img-ok\');var j=this.parentElement.querySelector(\'.fa-gem\');if(j)j.style.display=\'none\';" ' +
    'onerror="var t=this,u=' + json + ';t._e=(t._e||0)+1;' +
    'if(t._e<u.length){t.src=u[t._e];}else{t.style.opacity=\'0\';t.style.visibility=\'hidden\';}" ' +
    'style="width:100%;height:100%;object-fit:cover;position:relative;z-index:1;">';
}

/* ── Legacy ── */
function imgName(n) { return toKebab(n); }
function createElementBadge(el) {
  var d = (typeof ELEMENTS !== 'undefined' && ELEMENTS[el]) ? ELEMENTS[el] : null;
  var c = d ? d.color : '#555', ic = d ? d.icon : 'fa-question', nm = d ? d.name : el;
  return '<span class="element-badge" style="background:' + c + '"><i class="fa-solid ' + ic + '"></i> ' + nm + '</span>';
}
