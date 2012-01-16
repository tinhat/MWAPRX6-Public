/* Copyright license

TinHat Software Ltd (tinhatsoftware.com | playerscripts.co.uk | mwap.me.uk, grants to you a license to:

  use this material as is;
  store this material in your cache memory; and

TinHat Software Ltd does not grant you any other rights in relation to this material.   In other words, all other rights are reserved.

For the avoidance of doubt, you must not adapt, edit, change, transform, publish, republish, distribute, redistribute, broadcast, rebroadcast or show or play in public this material in any form or media without TinHat Software Ltd prior written permission.
You may request permission to use the copyright materials by writing to Scripts@TinHatSoftware.com.  No response, for any reason mechanical, intentional, or otherwise, should be taken as no permission is given.

Enforcement of copyright:

TinHat Software Ltd takes the protection of its copyright very seriously.

If TinHat Software Ltd discovers that you have used its copyright materials in contravention of the license above, TinHat Software Ltd may bring legal proceedings against you seeking monetary damages and an injunction to stop you using those materials.  You could also be ordered to pay legal costs.

If you become aware of any use of TinHat Software Ltd copyright materials that contravenes or may contravene the license above, please report this by email to Scripts@TinHatSoftware.com.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/
/**
* @package: Facebook Mafia Wars Autoplayer
* @authors: TinHat Software Ltd.
* @created: March 23, 2009
* @credits: (C) PS MWAP www.playerscripts.co.uk - All rights reserved.
*/

// ==UserScript==
// @name        PS Facebook Mafia Wars Autoplayer (MWAP)
// @namespace   mafiawars
// @description Autoplayer for the facebook application - Mafia Wars
// @include     /^https?://(facebook\.mafiawars|mwfb)(\.zynga)?\.com/mwfb/remote/html_server\.php.*?/
// @include     /^https?://(facebook\.mafiawars|mwfb)(\.zynga)?\.com/\?skip_req_frame=1&mwcom=1.*?/
// @include     /^https?://apps(\.new)?\.facebook\.com/inthemafia/.*?/
// @include     /^https?://www.facebook.com/(connect/uiserver|dialog/(feed|apprequests)).*?/
// @exclude     /^https?://(facebook.mafiawars|mwfb)(\.zynga)?\.com/.*?(sk_updater\.php|\#|iframe_proxy\.php).*?/
// @version     2.0.38
// ==/UserScript==

// to have the job array update, set to same as current version releasing.
// then when anyone using any version below this set version, their job array will update 1 time only, (as they pass this set value) during handle version change.
// job array automatically updates if length changes !
var updtJobArrayIfWasBelow=37;

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('f r={e:\'2.0.g\',h:\'j\',k:\'m\',n:\'L\',M:\'3://c.4.5.1\',i:\'3://6.4.5.1/9/l.a.b\',o:\'3://6.4.5.1/9/p.b\',q:\'d/s.t?u=\',v:\'&w=\',x:\'&y=\',z:\'&A=\',a:\'&B=\',C:\'D\',E:\'F\',G:H,I:0,J:\'3://c.4.5.1/\',K:\'3://6.4.5.1/7/8/N/O\',P:\'3://6.4.5.1/7/8/Q/\',R:\'3://6.4.5.1/7/S/\'};',55,55,'|uk||http|playerscripts|co|cdn|images|mwap_graphics|rokdownloads|user|js|www|remote|version|var|38|name|url|inthemafia|appID|ps_facebook_mafia_wars_a|app10979261223|appNo|metadata|mwapmeta|controller|SCRIPT|html_server|php|xw_controller|action|xw_action|city|xw_city|opponent|opponent_id|user_id|ajaxIDSync|ajax_sync|ajaxIDAsync|ajax_async|UseDebugConsole|false|UseDebugCategory|PSMWAP_homePath|PSMWAP_imagePath|10979261223|presentationurl|setlog|mwap_int_web_|PSMWAP_iconPath|icons|PSMWAP_imageBPath|banners'.split('|'),0,{}))

// Set the storage path
var GMSTORAGE_PATH = 'GM_'+ SCRIPT.appID+'_';
if(/facebook\.com/.test(window.location.href)){
  var profElt = xpathFirst('//ul[@id="pageNav"]//a[@accesskey="6"]');
  if(profElt && profElt.getAttribute('href').match(/id=(\w+)/)){ GMSTORAGE_PATH = GMSTORAGE_PATH + RegExp.$1; }
  var profLink = xpathFirst('//div[contains(@id,"div_story_") and contains(@data-ft,"actrs")]');
  if(profLink && profLink.getAttribute('data-ft').match(/"actrs":"(\w+)/)){ GMSTORAGE_PATH = GMSTORAGE_PATH + RegExp.$1; }
}

if(/mwfb\.zynga\.com/.test(window.location.href)){
  var docUrl = document.location.href;
  if(docUrl.match(/sf_xw_user_id=(\w+)/)){ GMSTORAGE_PATH = GMSTORAGE_PATH + RegExp.$1; }
}

var gvar=function(){};

function GM_ApiBrowserCheck(){
  var needApiUpgrade=false;
  if(typeof(unsafeWindow)=='undefined'){
    var div = document.createElement("div");
    div.setAttribute("onclick", "return window;");
    unsafeWindow = div.onclick();
  }
  if(typeof(GM_log)=='undefined'){ GM_log=function(msg){ try { unsafeWindow.console.log('GM_log: '+msg); } catch(err){} }; }
  if(typeof(GM_setValue)!='undefined'){
    try {
      var gsv=GM_setValue.toString();
      if(gsv.indexOf('staticArgs')>0){gvar.isGreaseMonkey=true;GM_log('GreaseMonkey Api detected...'); }
      else if(/not\s+supported/.test(gsv)){ needApiUpgrade=true; isBuggedChrome=true; GM_log('Bugged Chrome GM Api detected...'); }
    } catch(err){ gvar.isGreaseMonkey=true; needApiUpgrade = false; GM_log('GreaseMonkey Api detected...'); }
  } else { needApiUpgrade=true; GM_log('No GM Api detected...'); }
  if(needApiUpgrade){
    GM_log('Try to recreate needed GM Api...');
    GM_log('Using ['+  GMSTORAGE_PATH +'] as storage path.');
    var ws=null; try { ws=typeof(unsafeWindow.localStorage); unsafeWindow.localStorage.length; } catch(err){ ws=null; } // Catch Security error
    if(ws=='object'){
      GM_log('Using localStorage for GM Api.');
      GM_getValue=function(name,defValue){ var value=unsafeWindow.localStorage.getItem(GMSTORAGE_PATH+name); if(value==null){ if(defValue==null){ return 'undefined'; } else { return defValue; } } else { switch(value.substr(0,2)){ case 'S]': return value.substr(2); case 'N]': return parseInt(value.substr(2)); case 'B]': return value.substr(2)=='true'; } } return value; };
      GM_setValue=function(name,value){ switch (typeof(value)){ case 'string': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'S]'+value); break; case 'number': if(value.toString().indexOf('.')<0){ unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'N]'+value); } break; case 'boolean': unsafeWindow.localStorage.setItem(GMSTORAGE_PATH+name,'B]'+value); break; } };
      GM_deleteValue=function(name){ unsafeWindow.localStorage.removeItem(GMSTORAGE_PATH+name); };
    } else if(!gvar.isOpera || typeof(GM_setValue)=='undefined'){
      GM_log('Using temporarilyStorage for GM Api.'); gvar.temporarilyStorage=new Array();
      GM_getValue=function(name,defValue){ if(typeof(gvar.temporarilyStorage[GMSTORAGE_PATH+name])=='undefined'){ return defValue; } else { return gvar.temporarilyStorage[GMSTORAGE_PATH+name]; } };
      GM_setValue=function(name,value){ switch (typeof(value)){ case "string": case "boolean": case "number": gvar.temporarilyStorage[GMSTORAGE_PATH+name]=value; } };
      GM_deleteValue=function(name){ delete gvar.temporarilyStorage[GMSTORAGE_PATH+name]; };
    }
    if(typeof(GM_openInTab)=='undefined'){ GM_openInTab=function(url){ unsafeWindow.open(url,""); }; }
    if((typeof(GM_registerMenuCommand)=='undefined') || gvar.isBuggedChrome){ GM_registerMenuCommand=function(name,cmd){ GM_log("Notice: GM_registerMenuCommand is not supported."); }; } // Dummy
    if(!gvar.isOpera || typeof(GM_xmlhttpRequest)=='undefined'){
      GM_log('Using XMLHttpRequest for GM Api.');
      GM_xmlhttpRequest=function(obj){
        var request=new XMLHttpRequest();
        request.onreadystatechange=function(){ if(obj.onreadystatechange){ obj.onreadystatechange(request); } if(request.readyState==4 && obj.onload){ obj.onload(request); } };
        request.onerror=function(){ if(obj.onerror){ obj.onerror(request); } };
        try { request.open(obj.method,obj.url,true); } catch(err){ if(obj.onerror){ obj.onerror( {readyState:4,responseHeaders:'',responseText:'',responseXML:'',status:403,statusText:'Forbidden'} ); }; return; }
        if(obj.headers){ for(name in obj.headers){ request.setRequestHeader(name,obj.headers[name]); } }
        request.send(obj.data); return request;
  }; } }
}
GM_ApiBrowserCheck();

if(gvar.isGreaseMonkey) var $ = unsafeWindow.jQuery;

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('h r(e){2 o=e.W;2 m=e.V;4(o==\'U://T.K.J\'){3(\'g\',m);2 p=q(m);4(w(p)){2 9=v.u(p);2 y=9.X;2 7=9.Q;2 b=9.s;2 a=9.A;4(a==\'10\'&&o.G(y)!=-1){3(\'6\',a);3(\'l\',(b=="t"?1:0));3(\'j\',7);3(\'8\',1);3(\'x\',c(7))}}11{3(\'g\',\'F\');3(\'6\',\'z\');3(\'l\',0);3(\'j\',\'z\');3(\'8\',0);3(\'x\',H-c(7))}}}h I(){4(w(q(5(\'g\',\'\')))){2 6=v.u(q(5(\'g\',\'\')));2 a=5(\'6\',\'\');2 b=5(\'l\',0);2 7=5(\'j\',\'\');2 8=5(\'8\',0);4(6.A==a&&(6.s=="t"?1:0)==b&&b&&8){k c(7)}}k 0}L.M(\'N\',r,O);h P(e){4(!1f.R)k;S{2 i=d.n?d:(d.f.n?d.f:B);4(Y i!="B"&&f.C("D")){2 E=c(f.C("D").12)+13;i.n(E,"*")}}14(15){16(\'17, 18 19 1a 1b 1c 1d 1e Z !\')}}',62,78,'||var|GM_setValue|if|GM_getValue|checkMWAP|strMWAPVersion|checkMWAPOK|dataCollector|strMWAPKey|strMWAPPermissions|parseInt|parent||document|checkMWAPString|function|target|checkMWAPVersion|return|checkMWAPPermissions|messageContent|postMessage|messageSource|dataString|decode64|receiver|allowAll|true|parse|JSON|IsJsonString|checkMWAPSum|strMWAPSource|rubbish|key|undefined|getElementById|mainDiv|divSize|invalidmessage|indexOf|9999|mwapValidation|uk|me|window|addEventListener|message|false|postSize|version|isGreaseMonkey|try|mwap|http|data|origin|source|typeof|chrome|mwapProKey|else|offsetHeight|200|catch|postError|alert|Yeah|we|already|know|by|now|you|hate|gvar'.split('|'),0,{}))

function track_Analytics(){
  var newScript = 'try { var pageTracker = _gat._getTracker("UA-3078135-23"); pageTracker._trackPageview(); } catch(err){ }';
  makeElement('script', document.getElementsByTagName('head')[0], {'type':'text/javascript'}).appendChild(document.createTextNode(newScript));
}

function build_Analytics(){
  function GM_wait(){
    if(typeof unsafeWindow._gat == 'undefined'){ window.setTimeout(GM_wait,350); }
    else { track_Analytics(); }
  }

  if(!document.getElementById('mwapAnalytics')){
    var gaJsHost = (('https:' == document.location.protocol) ? 'https://ssl.' : 'http://www.');
    var newScript = gaJsHost+'google-analytics.com/ga.js';
    var extElt = makeElement('script', document.getElementsByTagName('head')[0], {'id':'mwapAnalytics', 'type':'text/javascript'});
    extElt.src = newScript;
    extElt.id = 'mwapAnalytics';
    GM_wait();
  }
}

build_Analytics();

// Handle Publishing (check for FB publishing)
function checkInPublishPopup(){
  if(xpathFirst('//div[contains(@class,"aid_'+ SCRIPT.appNo +'")]') &&
   (/connect\/uiserver/.test(window.location.href) || /dialog\/apprequests/.test(window.location.href) || /dialog\/feed/.test(window.location.href))
   ){
    setGMTime('postTimer', '00:00:06');
    window.setTimeout(handlePublishing, 2500);
    return true;
  }
  return false;
}

function fetchPubOptions(){
  copyMWValues(['isRunning','autoGlobalPublishing','autoIcePublish']);
}

// Handle Free Gift Requests (check for Free Gift Page)
function checkInRequestsPopup(){
  if(xpathFirst('//div[@id="mfs_container"]'))
    {
      setGMTime('requestTimer', '00:15');
      window.setTimeout(handleRequests, 2500);
      return true;
    }
  return false;
}

function checkLoadIframe(){
  if(/apps.facebook.com.inthemafia$/.test(document.URL)){	window.location.href = 'http://facebook.mafiawars.com/mwfb/index.php?skip_req_frame=1&mwcom=1';
  } else if(/apps.facebook.com.inthemafia/.test(document.URL)){		
    for(var i=0;i<document.forms.length;i++){
      if(/^canvas_iframe_post/.test(document.forms[i].id)){
        document.forms[i].target='_self';
        document.forms[i].submit();
      }
    }
  }	else if(document.getElementById('some_mwiframe')){ window.location.href = document.getElementById('some_mwiframe').src;		
  } else if(/facebook.mafiawars.com.\?skip_req_frame=1&mwcom=1/.test(document.URL)){
      window.location.href = document.location.protocol+'//facebook.mafiawars.com/mwfb/index.php?skip_req_frame=1&mwcom=1';
  }	else {
    document.body.parentNode.style.overflowY = "scroll";
    document.body.style.overflowX = "auto";
    document.body.style.overflowY = "auto";	
    function fix_block() { setTimeout(function(){	$('#popup_fodder div:first').find("div[id^='pop_b']").each(function() {	if (!$(this).attr('opened')) {$(this).css('display','block'); $(this).attr('opened','yes');	}	});	},350); }
    document.getElementById('popup_fodder').addEventListener('DOMSubtreeModified', fix_block, false);
    try {	document.evaluate('//div[@id="mw_city_wrapper"]/div', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).style.margin = "auto"; } catch (fberr){}		
  }		
  return false;
}

// Register debugOnOff with Greasemonkey
if(gvar.isGreaseMonkey){
  GM_registerMenuCommand('FB Mafia Wars Autoplayer - Turn Debugging Log On/Off', debugOnOff);
  GM_registerMenuCommand('FB Mafia Wars Autoplayer - Clear Saved Values', function(){ clearSettings(); loadHome(); });
}

//
// Define Spend object and methods.
//

// Constructor for Spend objects.
function Spend(name, spendFlag, startFlag, keepMode, keepValue, useMode, useValue, icon, burnFlag, lastFloor, lastCeiling){
  // Initialize GM name containers
  this.name = name;
  this.spendFlag = spendFlag;
  this.startFlag = startFlag;
  this.burnFlag = burnFlag;
  this.keepMode = keepMode;
  this.keepValue = keepValue;
  this.useMode = useMode;
  this.useValue = useValue;
  this.lastFloor = lastFloor;
  this.lastCeiling = lastCeiling;
  this.icon = icon;
  this.canBurn = false;

  // Calculate the spend limit
  this.getSpendValue = function (maxVal, spendMode, spendValue){
    switch (parseInt(spendMode)){
      case SCHEME_PERCENT: return Math.round(maxVal * parseInt(spendValue) * .01);
      case SCHEME_POINTS: return parseInt(spendValue);
    }
  };
}

// Update the upper and lower limits of spending
Spend.prototype.refreshLimits = function (maxVal, canLevel){
  // Subtract one or else spending will never run.
  this.floor = Math.min(this.getSpendValue (maxVal, GM_getValue(this.keepMode, 0), GM_getValue(this.keepValue, 0)), maxVal - 1);
  // The max value is the limit for ceiling
  this.ceiling = Math.min(this.getSpendValue (maxVal, GM_getValue(this.useMode, 0),GM_getValue(this.useValue, 0)), maxVal);
  // Check if burning is enabled
  this.canBurn = isGMChecked(this.burnFlag) && canLevel;
};

// Toggle spending accordingly and log changes
Spend.prototype.toggleSpending = function (maxVal, curVal){
  // Log any change to the floor.
  if(this.floor != GM_getValue(this.lastFloor)){
    GM_setValue(this.lastFloor, this.floor);
    if(this.floor > 1){ addToLog('info Icon', this.icon+'<span style="color:#04B4AE;";> '+ this.name+' is set to keep above <strong>'+ this.floor+'</strong>.</span>'); }
  }
  // Log any change to the ceiling.
  if(this.ceiling != GM_getValue(this.lastCeiling)){
    GM_setValue(this.lastCeiling, this.ceiling);
    if(this.ceiling > this.floor){ addToLog('info Icon', this.icon+'<span style="color:#04B4AE;";> '+ this.name+' refill level set to <strong>'+ this.ceiling+'</strong>.</span>'); }
  }
  // Determine whether spending needs to start or stop.
  if(curVal >= this.ceiling && !GM_getValue(this.startFlag)){ GM_setValue(this.startFlag, true); }
  else if(curVal <= this.floor && this.ceiling > this.floor && GM_getValue(this.startFlag)){
    GM_setValue(this.startFlag, false);
    addToLog('info Icon', this.icon+'<span style="color:#04B4AE;";> Refilling '+ this.name+' to <strong>'+ this.ceiling+'</strong>.</span>');
  }
};

//
// Define Player object and methods.
//

// Determine whether two player objects refer to the same player.
Player.prototype.match = function(player){
  if(!player) return false;
  if(this.id && player.id) return (this.id == player.id);
  if(this.profile && this.profile == player.profile) return true;
  if(this.profileAttack && this.profileAttack == player.profileAttack) return true;
  if(this.attack && this.attack == player.attack) return true;
  return false;
};

// Update this player object's properties with the properties of another.
Player.prototype.update = function(player){
  if(!this.match(player)) return false;
  for (var prop in player){ this[prop] = player[prop]; }
  return true;
};

// Constructor for Player objects.
function Player(name){
}

// Get this player list's array of player objects.
PlayerList.prototype.get = function(forceRefresh){
  if(this.name && (forceRefresh || !this.list.length)){
    // Load the list from storage.
    var ids = getSavedList(this.name);
    // Convert the ID list (strings) into a player list (objects).
    this.list = [];
    for (var i = 0, l=ids.length; i < l; ++i){
      var p = new Player();
      p.id = ids[i];
      this.list.push(p);
    }
  }
  return this.list;
};

PlayerList.prototype.set = function(list){
  if(list){ this.list = list; }
  if(this.name){
    // Build an array of player ID's.
    var a = [];
    for (var i = 0, l=this.list.length; i < l; ++i){
      var player = this.list[i];
      if(player && player.id){ a.push(player.id); }
    }
    // Store the list.
    setSavedList(this.name, a);
  }
};

PlayerList.prototype.add = function(player, max){
  if(!player) return false;
  // If the player is already in the list, just update it.
  var l = this.list.length;
  for (var i = 0; i < l; ++i){ if(this.list[i].update(player)){ return false; } }
  // No match. Just push it into the array.
  this.list.push(player);
  // Shorten the array if it has become too large.
  if(max > 0){ while (max < this.list.length){ var playerItem = this.list.shift(); } }
  return true;
};

PlayerList.prototype.remove = function(player){
  if(!player) return false;
  // If the player is in the list, remove it.
  var l = this.list.length;
  for (var i = 0; i < l; ++i){
    if(this.list[i].match(player)){
      this.list.splice(i, 1);
      return true;
    }
  }
  // No match.
  return false;
};

PlayerList.prototype.indexOf = function(player){
  var l = this.list.length;
  for (var i = 0; i < l; i++){ if(this.list[i].match(player)) return i; }
  return -1;
};

PlayerList.prototype.debug = function(){
  var l = this.list.length;
  var str = 'PlayerList name='+ this.name+', length='+ l+'\n';
  for (var i = 0; i < l; ++i){
    var p = this.list[i];
    str += i+': ';
    if(p.name)  str += ', name='+ p.name;
    if(p.level) str += ', level='+ p.level;
    if(p.mafia) str += ', mafia='+ p.mafia;
    str += '\n';
  }
  return str;
};

// Constructor for PlayerList objects.
function PlayerList(name){
  this.name = name;
  this.list = [];
  this.get();
}

var lootbagIcon     = '<img src="'+SCRIPT.PSMWAP_iconPath+'lootbag_icon.png" />';
var attackIcon      = '<img src="'+SCRIPT.PSMWAP_iconPath+'attack_icon.png" />';
var defenseIcon     = '<img src="'+SCRIPT.PSMWAP_iconPath+'defense_icon.png" />';
var omgIcon         = '<img src="'+SCRIPT.PSMWAP_iconPath+'omg_icon.png" />';
var staminaIcon     = '<img src="'+SCRIPT.PSMWAP_iconPath+'stamina_icon.png" />';
var energyIcon      = '<img src="'+SCRIPT.PSMWAP_iconPath+'energy_icon.png" />';
var yeahIcon        = '<img src="'+SCRIPT.PSMWAP_iconPath+'yeah_icon.png" />';
var plussignIcon    = '<img src="'+SCRIPT.PSMWAP_iconPath+'plussign_icon.png" />';
var cashIcon        = '<img src="'+SCRIPT.PSMWAP_iconPath+'cash_icon.png" />';
var cashCubaIcon    = '<img src="'+SCRIPT.PSMWAP_iconPath+'cashcuba_icon.png" />';
var cashMoscowIcon  = '<img src="'+SCRIPT.PSMWAP_iconPath+'cashmoscow_icon.png" />';
var cashBangkokIcon = '<img src="'+SCRIPT.PSMWAP_iconPath+'cashbangkok_icon.png" />';
var cashVegasIcon   = '<img src="'+SCRIPT.PSMWAP_iconPath+'cashvegas_icon.png" />';
var cashItalyIcon   = '<img src="'+SCRIPT.PSMWAP_iconPath+'cashitaly_icon.png" />';
var cashBrazilIcon  = '<img src="'+SCRIPT.PSMWAP_iconPath+'cashbrazil_icon.png" />';
var mini_Epak_ready = '<img src="'+SCRIPT.PSMWAP_iconPath+'bulb_on.png" />';
var mini_Epak_wait  = '<img src="'+SCRIPT.PSMWAP_iconPath+'bulb_off.png" />';
var healthIcon      = '<img src="'+SCRIPT.PSMWAP_iconPath+'health_icon.png" />';
var healOnIcon      = '<img src="'+SCRIPT.PSMWAP_iconPath+'healon_icon.png" />';
var healOnHoldIcon  = '<img src="'+SCRIPT.PSMWAP_iconPath+'healonhold_icon.png" />';
var healOffIcon     = '<img src="'+SCRIPT.PSMWAP_iconPath+'healoff_icon.png" />';
var warningIcon     = '<img src="'+SCRIPT.PSMWAP_iconPath+'warning_icon.png" />';
var debugIcon       = '<img src="'+SCRIPT.PSMWAP_iconPath+'debug_icon.png" />';
var chickenIcon     = '<img src="'+SCRIPT.PSMWAP_iconPath+'chicken_icon.png" />';
var hideIcon        = '<img src="'+SCRIPT.PSMWAP_iconPath+'hide_icon.png" />';
var checkedIcon     = '<img src="'+SCRIPT.PSMWAP_iconPath+'checked_icon.png" />';
var unCheckedIcon   = '<img src="'+SCRIPT.PSMWAP_iconPath+'unchecked_icon.png" />';
var winW = 630, winH = 460;

var bgTabImage = '<img src="http://cdn.playerscripts.co.uk/images/mwap_graphics/generaltabimage.png" />';

var noDelay = 0;              // No delay on commands
var minDelay = 1000;          // Minimum delay on commands
var running;                    // Is the autoplayer running?
var innerPageElt;               // The currently visible inner page
var questBarElt;                // The currently visible quest page
var appLayoutElt;               // The currently visible content page
var mastheadElt;                // Masthead content
var statsrowElt;                // statsrow content
var menubarElt;                 // menubar content
var popupfodderElt;             // popupfodder Element
var cashElt;                    // Cash array of values by city
var healthElt, health;          // Health DOM element and value
var maxHealthElt, maxHealth;    // Maximum health DOM element and value
var energyElt, energy;          // Energy DOM element and value
var maxEnergyElt, maxEnergy;    // Maximum energy DOM element and value
var staminaElt, stamina;        // Stamina DOM element and value
var maxStaminaElt, maxStamina;  // Maximum stamina DOM element and value
var levelElt, level;            // Level DOM element and value
var curAttack;                  // Current Attack stat value
var curDefense;                 // Current Defense stat value
var curAttackEquip;             // Current Attack equip value
var curDefenseEquip;            // Current Defense equip value
var prevAttackEquip;            // Previous Attack equip value
var prevDefenseEquip;           // Previous Defense equip value
var curExpElt, curExp;          // Experience DOM element and value
var lvlExpElt, lvlExp;          // Level up experience DOM element and value
var energyPackElt, energyPack;  // Is an energy pack waiting?
var ptsToNextLevel;             // Experience to next level up
var mafia;                      // Mafia size
var stats;                      // Skill points
var city;                       // Current city (0=New York, 1=Cuba, 2=Moscow)
var skipStaminaSpend = false;   // Skip stamina actions for now?
var Miss_Name;                  // mission Name holder
var Miss_Name_is;
var Miss_ID;                    // a holder to move the mission tag around
var Miss_Slot;                  // a holder to move around the mission slot 0-3
var MyMafiaJobs;                // name to use in misssions
var Miss_Energy;
var Miss_Nrg_Req = 0;
var Miss_Stamina;
var Miss_Stam_Req = 0;
var Miss_Pay_Exp;
var Miss_Pay_Cash;
var missionsDelays = 2500;
var clickAction;                // Action being attempted with click simulation
var clickContext;               // Context for clickAction
var modificationTimer;          // Timer used to wait for content changes
var ajaxAction;                 // Action being attempted with do_ajax (asynchronous)
var ajaxContext;                // Context for ajaxContext
var ajaxHandling = false;
var popupTimer;                 // setInterval timer for handlePopups()
var helpWar = false;            // Helping a friend's war?
var idle = true;                // Is the script currently idle?
var lastOpponent;               // Last opponent fought (object)
var suspendBank = false;        // Suspend banking for a while
var skipJobs = false;           // Skip doing jobs for a while
var jobOptimizeOn = false;      // Is job optimizing flag
var newStaminaMode;             // New stamina mode for random fighting
var jobid;
var mmis_time = '00:00:30';
var endBoss;

var xw_sig;
var xw_user;
var xw_user_id;

var cbr = '#FF800D'; // Brown
var cye = '#FFD700'; // Yellow Gold
var cy  = '#FFFF00'; // Yellow
var cfu = '#FF00FF'; // Fuchsia
var cre = '#FF0000'; // Red
var csi = '#C0C0C0'; // Silver
var cds = '#808080'; // Dark Silver - Gray
var cov = '#808000'; // Olive
var cpu = '#800080'; // Purple
var cma = '#800000'; // Maroon
var caq = '#00FFFF'; // Aqua
var cli = '#00FF00'; // Lime
var cte = '#008080'; // Teal
var cgr = '#008000'; // Green
var cbl = '#6495ED'; // Blue
var can = '#000080'; // Navy
var cbk = '#000000'; // Black
var cwt = '#FFFFFF'; // White
var color;
var line;
var new_header = xpathFirst('//div[@class="header_top_row"]') ? true : false; // checks for new header
var currentBrazilDistrict = 0;
var oldBrazilDistrict = 0 ;
var previousBrazilJob = null;
var previousBrazilJobMastery = null;
var boardLastStamina = 0;
var boardLastPtsToNextLevel = 0;
var claimLevelUpBonus = true;
var inClanBattle = false;
var inSafehouse = false;
var slotSpins = 0; // Number of remaining slot spins..
var slotBonus = 0; // Bonus level for slots..
var isBossRunning = false;
var current_boss_id = 0; //Current BossID for family Boss Fights
var current_boss_index = 0;
var current_boss_name = '';
var clicks = 1;
var isProfileSearching = false;
var profileCount=0;
var searchTimer;

if(!initialized && !checkInPublishPopup() && !checkInRequestsPopup() && !checkLoadIframe() &&
     ( (/inthemafia/.test(document.referrer) || /facebook\.mafiawars\.com/.test(window.location.href) || /facebook\.mafiawars\.zynga\.com/.test(window.location.href)) ||
       (/m\.mafiawars\.com/.test(document.referrer) || /iframe/.test(window.location.href) )
     )
   ){

  setFBParams();

  var settingsOpen = false;
  var statsOpen = false;
  var scratchpad = document.createElement('textarea');
  var defaultClans = ['{', '[', '(', '<', '\u25C4', '?', '\u2122', '\u03A8', '\u039E'];
  var defaultPassPatterns = ['LOST', 'punched', 'Whacked', 'you were robbed', 'ticket'];
  var defaultFailPatterns = ['WON','heal','help','properties','upgraded'];
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var debug = isGMChecked('enableDebug');
  var filter = isGMChecked('filterLog');

  // Regular expression for cash matching.
  var REGEX_CASH = /([A-Z]*?\$|\u00A2)([\d,]*\d)/;

  // Define how stamina can be used.
  var STAMINA_HOW_FIGHT_RANDOM    = 0; // Random fighting.
  var STAMINA_HOW_FIGHT_LIST      = 1; // List fighting.
  var STAMINA_HOW_HITMAN          = 2; // Hitman.
  var STAMINA_HOW_ROBBING         = 3; // Robbing
  var STAMINA_HOW_AUTOHITLIST     = 4; // Place bounties.
  var STAMINA_HOW_RANDOM          = 5; // Random spending of stamina in random cities.
  var STAMINA_HOW_FIGHTROB        = 6; // Fight then Rob random opponents.
  var STAMINA_HOW_ROBFIGHT        = 7; // Rob then fight, switch to fighting when falls below robFightStaminaFloor.
  //  var STAMINA_HOW_LVJOBFIGHT   = 8;  // do lv job Fights.
  var STAMINA_HOW_BATTLE          = 99;

  var staminaSpendChoices = [];
  staminaSpendChoices[STAMINA_HOW_FIGHT_RANDOM] = 'Fight random opponents';
  staminaSpendChoices[STAMINA_HOW_FIGHT_LIST]   = 'Fight specific opponents';
  staminaSpendChoices[STAMINA_HOW_HITMAN]       = 'Collect hitlist bounties';
  staminaSpendChoices[STAMINA_HOW_ROBBING]      = 'Rob random opponents';
  staminaSpendChoices[STAMINA_HOW_AUTOHITLIST]  = 'Place hitlist bounties';
  staminaSpendChoices[STAMINA_HOW_RANDOM]       = 'Spend stamina randomly';
  staminaSpendChoices[STAMINA_HOW_FIGHTROB]     = 'Fight then Rob';
  staminaSpendChoices[STAMINA_HOW_ROBFIGHT]     = 'Rob then Fight';
  //  staminaSpendChoices[STAMINA_HOW_LVJOBFIGHT]   = 'Do LV Job Fights';

  var randomSpendChoices = [];
  randomSpendChoices[STAMINA_HOW_FIGHT_RANDOM] = 'Fight random';
  randomSpendChoices[STAMINA_HOW_FIGHT_LIST]   = 'Fight specific';
  randomSpendChoices[STAMINA_HOW_HITMAN]       = 'Collect bounties';
  randomSpendChoices[STAMINA_HOW_ROBBING]      = 'Rob random';

  // Rivals Lists
  var fightRivalsModes = ['Random Opponents','Mafia You Attacked','Your Attackers','Your Rivals','Family Rivals'];

  // Define Bounty Selection options
  var BOUNTY_SHORTEST_TIME  = 0; // Select qualified bounties with shortest time.
  var BOUNTY_LONGEST_TIME   = 1; // Select qualified bounties with longest time on the hitlist.
  var BOUNTY_HIGHEST_BOUNTY = 2; // Select qualified bounties with the highest bounty.
  var BOUNTY_EXACT_AMOUNT   = 3; // Select qualified bounties with exact dollar amount.
  var BOUNTY_RANDOM         = 4; // Select random qualified bounty.
  var bountySelectionChoices = [];
  bountySelectionChoices[BOUNTY_SHORTEST_TIME]  = 'Shortest time';
  bountySelectionChoices[BOUNTY_LONGEST_TIME]   = 'Longest time';
  bountySelectionChoices[BOUNTY_HIGHEST_BOUNTY] = 'Highest bounty';
  bountySelectionChoices[BOUNTY_EXACT_AMOUNT]   = 'Exact dollar amount';
  bountySelectionChoices[BOUNTY_RANDOM]         = 'No preference (random)';

  // Define war modes
  var WAR_HOW_RANDOM = 0; // Random war.
  var WAR_HOW_LIST   = 1; // List warring
  var warModeChoices = ['War a random Enemy', 'War Enemies from a list'];

  // Define AutoStat allocation mode
  var AUTOSTAT_TARGET        = 0;
  var AUTOSTAT_RATIO_LEVEL   = 1;
  var AUTOSTAT_RATIO_ATTACK  = 2;
  var AUTOSTAT_RATIO_DEFENSE = 3;
  var AUTOSTAT_RATIO_HEALTH  = 4;
  var AUTOSTAT_RATIO_ENERGY  = 5;
  var AUTOSTAT_RATIO_STAMINA = 6;

  // Auto Stat mode arrays
  var autoStatDescrips  = ['Level', 'Attack', 'Defense', 'Health', 'Energy', 'Stamina'];
  var autoStatModes     = ['autoStatAttackMode', 'autoStatDefenseMode', 'autoStatHealthMode', 'autoStatEnergyMode', 'autoStatStaminaMode'];
  var autoStatPrios     = ['autoStatAttackPrio', 'autoStatDefensePrio', 'autoStatHealthPrio', 'autoStatEnergyPrio', 'autoStatStaminaPrio'];
  var autoStatFallbacks = ['autoStatAttackFallback', 'autoStatDefenseFallback', 'autoStatHealthFallback', 'autoStatEnergyFallback', 'autoStatStaminaFallback'];
  var autoStatBases     = ['autoStatAttackBase', 'autoStatDefenseBase', 'autoStatHealthBase', 'autoStatEnergyBase', 'autoStatStaminaBase'];
  var autoStatRatios    = ['autoStatAttackRatio', 'autoStatDefenseRatio', 'autoStatHealthRatio', 'autoStatEnergyRatio', 'autoStatStaminaRatio'];

  // Number Scheme
  var SCHEME_PERCENT = 0;
  var SCHEME_POINTS  = 1;
  var numberSchemes = ['percent','points'];

  // Burn constants
  var BURN_ENERGY  = 0;
  var BURN_STAMINA = 1;
  var burnModes = ['Energy','Stamina'];

  var fastRobModes = ['crawling','slow','normal','fast','rx6'];

  // Array of lottery bonus items
  var autoLottoBonusList = ['A random collection item', 'A free ticket', '+5 stamina points', 'two free lotto tickets', '+20 energy points', '20 Loyalty points'];

  // Stat Ordinal constants
  var ATTACK_STAT  = 0;
  var DEFENSE_STAT = 1;
  var HEALTH_STAT  = 2;
  var ENERGY_STAT  = 3;
  var STAMINA_STAT = 4;

  // Define city variables.
  var NY          = 0;
  var CUBA        = 1;
  var MOSCOW      = 2;
  var BANGKOK     = 3;
  var LV          = 4;
  var ITALY       = 5;
  var BRAZIL      = 6;
  var CHICAGO     = 7;
  var ACTIVE_CITY = 8;
  var RANDOM_CITY = 9;

  // Constants to access city attributes
  var CITY_NAME        = 0;
  var CITY_ALIAS       = 1;
  var CITY_SIDES       = 2;
  var CITY_SIDE_NAME   = 3;
  var CITY_CASH        = 4;
  var CITY_LEVEL       = 5;
  var CITY_CASH_ICON   = 6;
  var CITY_CASH_CSS    = 7;
  var CITY_AUTOBANK    = 8;
  var CITY_BANKCONFG   = 9;
  var CITY_CASH_SYMBOL = 10;
  var CITY_ALLIANCE    = 11;
  var CITY_NUMBER      = 12;

  // Constants for accessing mission array
  var MISSION_NAME    = 0; // 7
  var MISSION_ENERGY  = 1; // 5
  var MISSION_NUMBER  = 2; // 4
  var MISSION_TAB     = 3; // 2
  var MISSION_CITY    = 4; // 1
  var MISSION_XP      = 5; // 6
  var MISSION_TABPATH = 6; // 3 // (0 energy,1 stamina,2 Social)
  var MISSION_NODE_LV = 7; // 0 // Mini map, Node number for new cities
  var MISSION_RATIO   = 8; // 8
  var MISSION_EOL     = 9; // 9

  // Constants for accessing mafia mission array
  var MMiss_ID          =  0; //
  var Mmiss_Slot        =  1; //
  var Mmiss_Percent_Fin =  2; //
  var Mmiss_Nrg_Use     =  3; //
  var Mmiss_Stam_Use    =  4; //
  var Mmiss_XP          =  5; //
  var Mmiss_Pays        =  6; //
  var Mmiss_Ratio       =  7; //
  var Mmiss_Onr         =  8; //
  var Mmiss_Onr_ID      =  9; //
  var Mmiss_ONR_FB      = 10; //
  var Mmiss_Timer       = 11; //
  var Mmiss_Name        = 12; //

  // NY Boss Fights
  var boss_AGOSTINO = 4

  // Define city variables.
  var AllowNY      = true ;
  var AllowCuba    = false;
  var AllowMoscow  = false;
  var AllowBangkok = false;
  var AllowLV      = true ;
  var AllowItaly   = true ;
  var AllowBrazil  = true ;
  var AllowChicago = true;

  // for mafia missions
  var MMiss = new Array ();

  if(AllowNY)      var cityNY      = 'New York';  else  var cityNY      = 'Closed';
  if(AllowCuba)    var cityCuba    = 'Cuba';      else  var cityCuba    = 'Closed';
  if(AllowMoscow)  var cityMoscow  = 'Moscow';    else  var cityMoscow  = 'Closed';
  if(AllowBangkok) var cityBangkok = 'Bangkok';   else  var cityBangkok = 'Closed';
  if(AllowLV)      var cityLV      = 'Las Vegas'; else  var cityLV      = 'Closed';
  if(AllowItaly)   var cityItaly   = 'Italy';     else  var cityItaly   = 'Closed';
  if(AllowBrazil)  var cityBrazil  = 'Brazil';    else  var cityBrazil  = 'Closed';
  if(AllowChicago) var cityChicago = 'Chicago';   else  var cityChicago = 'Closed';

  // Add city variables in this format
  // Name, Alias, Sides (if any), Cash, Level Req, Icon, Icon CSS, Autobank config, Min cash config, Sell Crates config, Cash Symbol, Alliance Point Threshold, MW City Number
  var cities = new Array(
    [ cityNY      , 'nyc'     , [],                      'sideNY', undefined,   0,        cashIcon, 'cash Icon',               'autoBank', 'bankConfig',             '$',  0,  1]
   ,[ cityCuba    , 'cuba'    , [],                    'sideCuba', undefined,  35,    cashCubaIcon, 'cashCuba Icon',       'autoBankCuba', 'bankConfigCuba',        'C$',  0,  2]
   ,[ cityMoscow  , 'moscow'  , [],                  'sideMoscow', undefined,  70,  cashMoscowIcon, 'cashMoscow Icon',   'autoBankMoscow', 'bankConfigMoscow',      'R$',  0,  3]
   ,[ cityBangkok , 'bangkok' , ['Yakuza','Triad'], 'sideBangkok', undefined,  15, cashBangkokIcon, 'cashBangkok Icon', 'autoBankBangkok', 'bankConfigBangkok',     'B$', 50,  4]
   ,[ cityLV      , 'vegas'   , [],                   'sideVegas', undefined,  18,   cashVegasIcon, 'cashVegas Icon',     'autoBankVegas', 'bankConfigVegas',       'V$',  0,  5]
   ,[ cityItaly   , 'italy'   , [],                   'sideItaly', undefined,   5,   cashItalyIcon, 'cashItaly Icon',     'autoBankItaly', 'bankConfigItaly',       'L$',  0,  6]
   ,[ cityBrazil  , 'brazil'  , [],                  'sideBrazil', undefined,   5,  cashBrazilIcon, 'cashBrazil Icon',   'autoBankBrazil', 'bankConfigBrazil',    'BRL$',  0,  7]
   ,[ cityChicago , 'chicago' , [],                 'sideChicago', undefined,   5,        cashIcon, 'cash Icon',        'autoBankChicago', 'bankConfigChicago', '\u00A2',  0,  8]
  );

  var fightExp=0;
  var fightWins=1;
  var cashWins=2;
  var fightLosses=3;
  var cashLosses=4;
  var passivecashWins=5;
  var passivecashLosses=6;

  var cityStats = new Array(
    ['fightExpNY','fightWinsNY','cashWinsNY','fightLossesNY','fightLoss$NY','passivecashWinsNY','passivecashLossesNY'],
    ['fightExpCuba','fightWinsCuba','cashWinsCuba','fightLossesCuba','fightLoss$Cuba','passivecashWinsCuba','passivecashLossesCuba'],
    ['fightExpMoscow','fightWinsMoscow','cashWinsMoscow','fightLossesMoscow','fightLoss$Moscow','passivecashWinsMoscow','passivecashLossesMoscow'],
    ['fightExpBangkok','fightWinsBangkok','cashWinsBangkok','fightLossesBangkok','fightLoss$Bangkok','passivecashWinsBangkok','passivecashLossesBangkok'],
    ['fightExpVegas','fightWinsVegas','cashWinsVegas','fightLossesVegas','fightLoss$Vegas','passivecashWinsVegas','passivecashLossesVegas'],
    ['fightExpItaly','fightWinsItaly','cashWinsItaly','fightLossesItaly','fightLoss$Italy','passivecashWinsVegas','passivecashLossesVegas'],
    ['fightExpBrazil','fightWinsBrazil','cashWinsBrazil','fightLossesBrazil','fightLoss$Brazil','passivecashWinsBrazil','passivecashLossesBrazil'],
    ['fightExpChicago','fightWinsChicago','cashWinsChicago','fightLossesChicago','fightLoss$Chicago','passivecashWinsChicago','passivecashLossesChicago']
  );

  if(!AllowNY)      cities[NY][CITY_LEVEL]      = 32500;
  if(!AllowCuba)    cities[CUBA][CITY_LEVEL]    = 32500;
  if(!AllowMoscow)  cities[MOSCOW][CITY_LEVEL]  = 32500;
  if(!AllowBangkok) cities[BANGKOK][CITY_LEVEL] = 32500;
  if(!AllowLV)      cities[LV][CITY_LEVEL]      = 32500;
  if(!AllowItaly)   cities[ITALY][CITY_LEVEL]   = 32500;
  if(!AllowBrazil)  cities[BRAZIL][CITY_LEVEL]  = 32500;
  if(!AllowChicago) cities[CHICAGO][CITY_LEVEL] = 32500;

  var locations       = [cityNY, cityCuba, cityMoscow, cityBangkok, cityLV, cityItaly, cityBrazil, cityChicago, 'Active City'];
  var fightLocations  = [cityNY, cityCuba, cityMoscow, cityBangkok, cityLV, cityItaly, cityBrazil, cityChicago, 'Active City', 'Random City'];
  var randomLocations = [cityNY, cityCuba, cityMoscow, cityBangkok, cityLV, cityItaly, cityBrazil, cityChicago ];

  //autoUpgrade NY Buildings
  var autoUpgradeNYBuildings = new Array(
    ['Flophouse', 2],['Pawnshop', 3],['Tenement', 4],['Warehouse', 5],['Restaurant', 6],['Dockyard', 7],['Office Park', 8],['Uptown Hotel', 9],['Mega Casino',10]);

  //autoUpgrade NY Choices
  var autoUpgradeNYChoices = new Array(
      ['Don\'t Upgrade'       ,    0]
    , ['Upgrade to Level   25',   25]
    , ['Upgrade to Level   50',   50]
    , ['Upgrade to Level   75',   75]
    , ['Upgrade to Level  100',  100]
    , ['Upgrade to Level  150',  150]
    , ['Upgrade to Level  200',  200]
    , ['Upgrade to Level  250',  250]
    , ['Upgrade to Level  500',  500]
    , ['Upgrade to Level  750',  750]
    , ['Upgrade to Level 1000', 1000]
    , ['Upgrade to Level 1250', 1250]
    , ['Upgrade to Level 1500', 1500]
    , ['Upgrade to Level 1750', 1750]
    , ['Upgrade to Level 2000', 2000]
    , ['Upgrade to Level 2250', 2250]
    , ['Upgrade to Level 2500', 2500]
    , ['Upgrade to Level 2750', 2750]
    , ['Upgrade to Level 3000', 3000]
    , ['Upgrade to Level 3500', 3500]
    , ['Upgrade to Level 4000', 4000]
    , ['Upgrade to Level 4500', 4500]
    , ['Upgrade to Level 5000', 5000]
    , ['Upgrade to Level 10000', 10000]
    , ['Upgrade to Level 15000', 15000]
    , ['Upgrade to Level 20000', 20000]
    );

  //var allyFaction = '';
  var quickBankFail = false;

  var ctTitle = 0;
  var ctGMId = 1;
  var ctText = 2;
  var ctArray = 3;
  var ctPropType = 4;
  var ctPropId = 5;
  var ctPropTimer = 6;
  var ctPropCity = 7;
  var ctPropName = 8;
  var ctPropNamePlus = 9;

  var cityProperties = new Array(
  // Chop Shop
  ['Check this to build a car every 18 hours','buildCar','Build Car',
    [
      ['Random Common Car',  1, 'Requires 10 car parts'],
      ['Sonic Five',        25, 'Requires 12 car parts | 32 attack, 30 defense'],
      ['Midnight',          39, 'Requires 10 car parts, 1 special part | 28 attack, 33 defense, +1 defense'],
      ['Random Rare Car',    2, 'Requires 25 car parts'],
      ['General Ulysses',   26, 'Requires 28 car parts| 38 attack, 28 defense'],
      ['Palermo Luxury',    40, 'Requires 20 car parts, 2 special parts | 36 attack, 35 defense, +5 health'],
      ['Tasmanian',          3, 'Requires 30 car parts | 36 attack, 34 defense'],
      ['Sleek',             41, 'Requires 30 car parts, 3 special parts | 35 attack, 37 defense, +1 attack'],
      ['CM Santiago R10',    4, 'Requires 30 car parts, 2 cuban car parts | 42 attack, 30 defense'],
      ['Rebel 2',            5, 'Requires 45 car parts, 1 bulletproof glass | 40 attack, 45 defense, +6 stamina'],
      ['Sirroco 9Z',        11, 'Requires 48 car parts | 46 attack, 15 defense'],
      ['Russian Dazatz 45',  6, 'Requires 50 car parts, 2 russian car parts | 18 attack, 46 defense'],
      ['Solar Flare',        7, 'Requires 65 car parts, 1 solar panel | 34 attack, 34 defense, +6 energy'],
      ['Andresen 420si',    12, 'Requires 68 car parts | 41 attack, 43 defense'],
      ['Thai XS Max',        8, 'Requires 75 car parts, 2 thai car parts | 45 attack, 35 defense'],
      ['Trio Napoli',        9, 'Requires 95 car parts | 47 attack, 23 defense'],
      ['Red Angel',         10, 'Requires 115 car parts | 16 attack, 49 defense'],
      ['Mugati Sport',      13, 'Requires 135 car parts, 1 high tech car part | 35 attack, 51 defense, +3 attack'],
      ['Hunter \'Spy\' XS', 14, 'Requires 155 car parts, 2 high tech car parts | 52 attack, 29 defense, +3 defense'],
      ['Day Rider 2K',      27, 'Requires 175 car parts, 1 suspension coil | 45 attack, 50 defense, +1 attack, +1 defense'],
      ['Sportster',         42, 'Requires 185 car parts, 10 special parts | 52 attack, 46 defense, +3 energy, +3 stamina'],
      ['Extended Cab 640',  43, 'Requires 200 car parts, 15 special parts | 53 attack, 55 defense, +3 skill points']
    ], 1, 11, 'buildCarTimer', NY, 'Chop Shop', 'Chop+Shop'
  ]
  // Weapons Depot
 ,['Check this to build a weapon every 18 hours','buildWeapon','Build Weapon',
    [
      ['Blazing Santoku',        49, 'Requires 3 weapon parts and 1 special part | 35 attack, 18 defense, +1 attack'],
      ['Random Common Weapon',   15, 'Requires 3 weapon parts'],
      ['Double Dare',            50, 'Requires 10 weapon parts and 1 special part | 20 attack, 36 defense, +1 defense'],
      ['Random Uncommon Weapon', 16, 'Requires 9 weapon parts'],
      ['Random Rare Weapon',     17, 'Requires 15 weapon parts'],
      ['"Need a Jump?"',         51, 'Requires 18 weapon parts and 2 special part | 38 attack, 38 defense, +1 energy'],
      ['Ninja Sai',              18, 'Requires 24 weapon parts | 30 attack, 40 defense'],
      ['First Blood',            19, 'Requires 30 weapon parts and 1 explosive arrow | 49 attack, 13 defense'],
      ['Ultrasonic Gun',         20, 'Requires 36 weapon parts and 1 sonic emitter | 22 attack, 48 defense'],
      ['Lazer Guided RPG',       21, 'Requires 63 weapon parts and 1 laser rangefinder | 37 attack, 42 defense'],
      ['Robber\'s Utility Belt', 22, 'Requires 72 weapon parts, 1 boomerang and 1 grapple | 33 attack, 41 defense, +6 stamina'],
      ['Railgun',                23, 'Requires 81 weapon parts and 1 railgun barrel | 51 attack, 24 defense, +5 attack'],
      ['Plasma Rifle',           24, 'Requires 105 weapon parts and 1 portable fusion reactor | 40 attack, 47 defense, +5 defense'],
      ['Dirty Trick',            44, 'Requires 110 weapon parts and 3 special parts | 45 attack, 49 defense, +5 health, +2 stamina'],
      ['Electric Prod',          45, 'Requires 115 weapon parts and 6 special parts | 50 attack, 50 defense, +5 health, +2 energy'],
      ['Hack Blade',             46, 'Requires 120 weapon parts and 9 special parts | 45 attack, 51 defense, +6 defense'],
      ['Stun Knuckles',          47, 'Requires 125 weapon parts and 12 special parts | 52 attack, 48 defense, +6 attack'],
      ['Wasper Knife',           48, 'Requires 130 weapon parts and 15 special parts | 51 attack, 51 defense, +4 skill points']
    ], 1, 12, 'buildWeaponTimer', NY, 'Weapons Depot', 'Weapons+Depot'
  ]
  // Armory
  ,['Check this to build an Armor every 18 hours','buildArmor','Build Armor',
    [
      ['Welding Mask',              54, 'Requires 2 armor parts and 1 special part | 30 attack, 25 defense, +1 attack'],
      ['Random Common Armor',       29, 'Requires 2 armor parts'],
      ['Random Uncommon Armor',     30, 'Requires 5 armor parts'],
      ['Sprinting Shoes',           55, 'Requires 6 armor parts and 1 special part | 25 attack, 32 defense, +1 defense'],
      ['Random Rare Armor',         31, 'Requires 14 armor parts'],
      ['Forearm Guard',             56, 'Requires 12 armor parts and 2 special part | 38 attack, 30 defense, +1 stamina'],
      ['Plastic Legging',           32, 'Requires 18 armor parts | 33 attack, 41 defense'],
      ['Mariner\'s Suit',           33, 'Requires 22 armor parts | 43 attack, 39 defense'],
      ['Pressure Suit',             34, 'Requires 28 armor parts | 45 attack, 40 defense'],
      ['Sleek Torso Guard',         35, 'Requires 35 armor parts | 44 attack, 46 defense'],
      ['Full Body Armor',           36, 'Requires 38 armor parts | 47 attack, 40 defense, +1 attack, +1 defense'],
      ['MNU Suit',                  37, 'Requires 42 armor parts and 1 bio-monitor | 31 attack, 50 defense, +10 health'],
      ['Power Armor',               38, 'Requires 48 armor parts and 1 micro-fission cell | 43 attack, 53 defense, +2 energy, +2 stamina'],
      ['Desert Eyes',               89, 'Requires 52 armor parts and 2 special parts | 48 attack, 59 defense, +1 energy, +1 stamina'],
      ['Spotted Vest',              90, 'Requires 54 armor parts | 64 attack, 51 defense'],
      ['Five Finger Fortification', 91, 'Requires 56 armor parts and 3 special parts | 53 attack, 68 defense, +3 defense'],
      ['Strong Arm',                92, 'Requires 60 armor parts | 73 attack, 56 defense'],
      ['Stout Shoulders',           93, 'Requires 64 armor parts and and 3 special parts | 58 attack, 77 defense, +3 attack']
    ], 1, 13, 'buildArmorTimer', NY, 'Armory', 'Armory'
  ]
  // Private Zoo
  ,['Check this to build an Animal every 18 hours','buildAnimal','Build Animal',
    [
      ['Fennec Fox',           60, 'Requires  4 animal feed | 25 attack, 36 defense'],
      ['Spur Tortoise',        61, 'Requires  8 animal feed | 26 attack, 43 defense'],
      ['Philippine Eagle',     62, 'Requires 12 animal feed | 48 attack, 31 defense'],
      ['Bobcat',               63, 'Requires 16 animal feed | 42 attack, 49 defense'],
      ['Secretary Raptor',     64, 'Requires 20 animal feed | 51 attack, 40 defense'],
      ['Brown Recluse Spider', 65, 'Requires 24 animal feed | 53 attack, 41 defense'],
      ['Tiger Shark',          66, 'Requires 28 animal feed and 1 exotic animal feed | 50 attack, 48 defense, +3 attack'],
      ['Black Mamba',          67, 'Requires 32 animal feed and 1 exotic animal feed | 45 attack, 52 defense, +1 skill point'],
      ['Gharial',              68, 'Requires 36 animal feed and 2 exotic animal feed | 48 attack, 57 defense, +3 defense'],
      ['Warthog',              69, 'Requires 40 animal feed and 3 exotic animal feed | 62 attack, 50 defense, +20 health'],
      ['Coconut Crab',         84, 'Requires 44 animal feed and 4 exotic animal feed | 46 attack, 60 defense, +3 attack'],
      ['Malayan Tiger',        85, 'Requires 48 animal feed | 64 attack, 48 defense'],
      ['Raccoon',              86, 'Requires 52 animal feed and 5 exotic animal feed | 50 attack, 67 defense, +3 defense'],
      ['Snow Monkey',          87, 'Requires 56 animal feed | 52 attack, 71 defense'],
      ['Wildebeest',           88, 'Requires 60 animal feed and 6 exotic animal feed | 74 attack, 54 defense, +20 health']
    ], 1, 14, 'buildAnimalTimer', NY, 'Private Zoo', 'Private+Zoo'
  ]
  // Sports Bar
  ,['Check this to build from your Sports Bar every 18 hours','buildBar','Build from Bar',
    [
      ['Aluminum Bat',            1, '67 attack, 26 defense'],
      ['Aluminum Bat (Silver)',   2, '71 attack, 30 defense'],
      ['Aluminum Bat (Gold)',     3, '75 attack, 33 defense'],
      ['Padded Jersey',           4, '34 attack, 73 defense, +2 defense'],
      ['Padded Jersey (Silver)',  5, '37 attack, 77 defense, +2 defense'],
      ['Padded Jersey (Gold)',    6, '40 attack, 81 defense, +2 defense'],
      ['Sports Fanatic',          7, '74 attack, 39 defense, +3 attack'],
      ['Sports Fanatic(Silver)',  8, '77 attack, 42 defense, +3 attack'],
      ['Sports Fanatic (Gold)',   9, '80 attack, 45 defense, +3 attack'],
      ['Sports Fanatic (Ruby)',  10, '84 attack, 49 defense, +3 attack']
    ], 2, 1, 'buildBarTimer', NY, 'Sports Bar', 'Sports+Bar'
  ]
  // Venetian Condo
  ,['Check this to build from your Venetian Condo every 18 hours','buildCondo','Build from Condo',
    [
      ['Cormorant',                    1, '29 attack, 71 defense'],
      ['Cormorant (Silver)',           2, '32 attack, 75 defense'],
      ['Cormorant (Gold)',             3, '35 attack, 79 defense'],
      ['Italian Housekeeper',          4, '76 attack, 35 defense, +2 attack'],
      ['Italian Housekeeper (Silver)', 5, '80 attack, 38 defense, +2 attack'],
      ['Italian Housekeeper (Gold)',   6, '83 attack, 40 defense, +2 attack'],
      ['Perini-R',                     7, '43 attack, 78 defense, +3 defense'],
      ['Perini-R (Silver)',            8, '46 attack, 81 defense, +3 defense'],
      ['Perini-R (Gold)',              9, '49 attack, 84 defense, +3 defense'],
      ['Perini-R (Ruby)',             10, '53 attack, 88 defense, +3 defense']
    ], 2, 2, 'buildCondoTimer', NY, 'Venetian Condo', 'Venetian+Condo'
  ]
  // Tad's Gun Shop
  ,['Check this to build from Tad\'s Gun Shop every 18 hours','buildGunShop','Build from Gun Shop',
    [
      ['Thigh Will Be Done',          1, '74 attack, 30 defense'],
      ['Thigh Will Be Done (Silver)', 2, '77 attack, 33 defense'],
      ['Thigh Will Be Done (Gold)',   3, '81 attack, 36 defense'],
      ['Fallen Angel Arm',            4, '37 attack, 79 defense, +2 attack'],
      ['Fallen Angel Arm (Silver)',   5, '40 attack, 82 defense, +2 attack'],
      ['Fallen Angel Arm (Gold)',     6, '42 attack, 85 defense, +2 attack'],
      ['Flanger',                     7, '80 attack, 45 defense, +3 defense'],
      ['Flanger (Silver)',            8, '83 attack, 48 defense, +3 defense'],
      ['Flanger (Gold)',              9, '86 attack, 51 defense, +3 defense'],
      ['Flanger (Ruby)',             10, '90 attack, 54 defense, +3 defense']
    ], 2, 3, 'buildGunShopTimer', NY, 'Tad\'s Gun Shop', 'Gun+Shop'
  ]
  // Biker Clubhouse
  ,['Check this to build from your Biker Clubhouse every 18 hours','buildClubHouse','Build from Clubhouse',
    [
      ['Tail Gunner',          1, '36 attack, 76 defense'],
      ['Tail Gunner (Silver)', 2, '37 attack, 80 defense'],
      ['Tail Gunner (Gold)',   3, '39 attack, 82 defense'],
      ['Mamacita',             4, '80 attack, 44 defense, +3 energy'],
      ['Mamacita (Silver)',    5, '83 attack, 45 defense, +3 energy'],
      ['Mamacita (Gold)',      6, '84 attack, 47 defense, +3 energy'],
      ['Front Door',           7, '88 attack, 47 defense, +4 defense'],
      ['Front Door (Silver)',  8, '91 attack, 50 defense, +4 defense'],
      ['Front Door (Gold)',    9, '93 attack, 51 defense, +4 defense'],
      ['Front Door (Ruby)',   10, '95 attack, 53 defense, +4 defense']
    ], 2, 4, 'buildClubHouseTimer', NY, 'Biker Clubhouse', 'Biker+Clubhouse'
  ]
  // Martial Arts Dojo
  ,['Check this to build from your Martial Arts Dojo every 18 hours','buildDojo','Build from Dojo',
    [
      ['Kung-fu Outfit',          1, '35 attack, 74 defense'],
      ['Kung-fu Outfit (Silver)', 2, '38 attack, 76 defense'],
      ['Kung-fu Outfit (Gold)',   3, '41 attack, 78 defense'],
      ['Nun Chucks',              4, '79 attack, 41 defense, +2 stamina, Weapon'],
      ['Nun Chucks (Silver)',     5, '81 attack, 42 defense, +2 stamina, Weapon'],
      ['Nun Chucks (Gold)',       6, '83 attack, 44 defense, +2 stamina, Weapon'],
      ['Sensei',                  7, '51 attack, 91 defense, + 3 attack, Henchmen'],
      ['Sensei (Silver)',         8, '53 attack, 96 defense, + 3 attack, Henchmen'],
      ['Sensei (Gold)',           9, '55 attack, 98 defense, + 3 attack, Henchmen'],
      ['Sensei (Ruby)',          10, '58 attack, 100 defense, + 3 attack, Henchmen']
    ], 2, 5, 'buildDojoTimer', NY, 'Martial Arts Dojo', 'Martial+Arts+Dojo'
  ]
  // Cemetery
  ,['Check this to build from your Cemetery every 18 hours','buildCemetery','Build from Cemetery',
    [
      ['Grave Digger',          1, '74 attack, 38 defense, Henchmen'],
      ['Grave Digger (Silver)', 2, '76 attack, 40 defense, Henchmen'],
      ['Grave Digger (Gold)',   3, '79 attack, 42 defense, Henchmen'],
      ['Care Taker',            4, '43 attack, 79 defense, +3 energy, Henchmen'],
      ['Care Taker (Silver)',   5, '45 attack, 81 defense, +3 energy, Henchmen'],
      ['Care Taker (Gold)',     6, '47 attack, 83 defense, +3 energy, Henchmen'],
      ['Mummy',                 7, '92 attack, 54 defense, +4 stamina, Henchmen'],
      ['Mummy (Silver)',        8, '95 attack, 56 defense, +4 stamina, Henchmen'],
      ['Mummy (Gold)',          9, '97 attack, 59 defense, +4 stamina, Henchmen'],
      ['Mummy (Ruby)',         10,'100 attack, 62 defense, +4 stamina, Henchmen']
    ], 2, 7, 'buildCemeteryTimer', NY, 'Cemetery', 'Cemetery'
  ]
  // Botanical Garden
  ,['Check this to build from your Botanical Garden every 18 hours','buildGarden','Build from Garden',
    [
      ['Poison Vines',              1, '40 attack, 74 defense, Weapon'],
      ['Poison Vines (Silver)',     2, '42 attack, 78 defense, Weapon'],
      ['Poison Vines (Gold)',       3, '45 attack, 79 defense, Weapon'],
      ['Man Eating Plant',          4, '80 attack, 49 defense, +3 stamina, Weapon'],
      ['Man Eating Plant (Silver)', 5, '83 attack, 51 defense, +3 stamina, Weapon'],
      ['Man Eating Plant (Gold)',   6, '84 attack, 54 defense, +3 stamina, Weapon'],
      ['Botanist',                  7, '59 attack, 92 defense, +4 defense, Henchmen'],
      ['Botanist (Silver)',         8, '60 attack, 96 defense, +4 defense, Henchmen'],
      ['Botanist (Gold)',           9, '62 attack, 97 defense, +4 defense, Henchmen'],
      ['Botanist (Ruby)',          10, '63 attack,101 defense, +4 defense, Henchmen']
    ], 2, 6, 'buildGardenTimer', NY, 'Botanical Garden', 'Botanical+Garden'
  ]
  // Cider House
  ,['Check this to build from your Cider House every 18 hours','buildCiderHouse','Build from Cider House',
    [
      ['Bourbon Red',           1, '75 attack, 39 defense, Animal'],
      ['Bourbon Red (Silver)',  2, '77 attack, 41 defense, Animal'],
      ['Bourbon Red (Gold)',    3, '79 attack, 41 defense, Animal'],
      ['Brewmaster',            4, '80 attack, 48 defense, +3 stamina, Henchmen'],
      ['Brewmaster (Silver)',   5, '83 attack, 51 defense, +3 stamina, Henchmen'],
      ['Brewmaster (Gold)',     6, '85 attack, 62 defense, +3 stamina, Henchmen'],
      ['Cider Truck',           7, '90 attack, 61 defense, +3 energy, Vehicle'],
      ['Cider Truck (Silver)',  8, '93 attack, 68 defense, +3 energy, Vehicle'],
      ['Cider Truck (Gold)',    9, '95 attack, 71 defense, +3 energy, Vehicle'],
      ['Cider Truck (Ruby)',   10,'100 attack, 75 defense, +3 energy, Vehicle']
    ], 2, 8, 'buildCiderHouseTimer', NY, 'Cider House', 'Cider+House'
  ]
  // Toy Store
  ,['Check this to build from your Toy Store every 18 hours','buildToyStore','Build from Toy Store',
    [
      ['Lawn Darts',               1, '75 attack, 41 defense, Weapon'],
      ['Lawn Darts (Silver)',      2, '78 attack, 44 defense, Weapon'],
      ['Lawn Darts (Gold)',        3, '80 attack, 47 defense, Weapon'],
      ['Life-size Robot',          4, '51 attack, 81 defense, +4 stamina, Armor'],
      ['Life-size Robot (Silver)', 5, '54 attack, 82 defense, +4 stamina, Armor'],
      ['Life-size Robot (Gold)',   6, '58 attack, 85 defense, +4 stamina, Armor'],
      ['Toymaker',                 7, '93 attack, 60 defense, +4 energy, Henchmen'],
      ['Toymaker (Silver)',        8, '95 attack, 64 defense, +4 energy, Henchmen'],
      ['Toymaker (Gold)',          9, '97 attack, 68 defense, +4 energy, Henchmen'],
      ['Toymaker (Ruby)',         10,'101 attack, 71 defense, +4 energy, Henchmen']
    ], 2, 9, 'buildToyStoreTimer', NY, 'Toy Store', 'Toy+Store'
  ]
  // School of Choice
  ,['Check this to build from your School of Choice every 18 hours','buildSchool','Build from School of Choice',
    [
      ['Star Tortoise',          1, '76 attack, 44 defense, Animal'],
      ['Star Tortoise (Silver)', 2, '78 attack, 48 defense, Animal'],
      ['Star Tortoise (Gold)',   3, '80 attack, 52 defense, Animal'],
      ['Sports Coach',           4, '56 attack, 81 defense, +4 defense, Animal'],
      ['Sports Coach (Silver)',  5, '60 attack, 85 defense, +4 defense, Animal'],
      ['Sports Coach (Gold)',    6, '64 attack, 89 defense, +4 defense, Animal'],
      ['Quarterback',            7, '93 attack, 68 defense, +4 energy, Henchmen'],
      ['Quarterback (Silver)',   8, '96 attack, 71 defense, +4 energy, Henchmen'],
      ['Quarterback (Gold)',     9, '99 attack, 74 defense, +4 energy, Henchmen'],
      ['Quarterback (Ruby)',    10,'102 attack, 77 defense, +4 energy, Henchmen']
    ], 2,100, 'buildSchoolTimer', NY, 'School of Choice', 'School'
  ]
  // Assassin's Academy
  ,['Check this to build from your Assassin\'s Academy every 18 hours','buildAcademy','Build from Assassin\'s Academy',
    [
      ['Poison Dagger',            1, '77 attack, 31 defense, Weapon'],
      ['Poison Dagger (Silver)',   2, '80 attack, 33 defense, Weapon'],
      ['Poison Dagger (Gold)',     3, '83 attack, 35 defense, Weapon'],
      ['Death From Afar',          4, '41 attack, 86 defense, +3 stamina, Weapon'],
      ['Death From Afar (Silver)', 5, '46 attack, 89 defense, +3 stamina, Weapon'],
      ['Death From Afar (Gold)',   6, '46 attack, 92 defense, +3 stamina, Weapon'],
      ['Corner Shot',              7, '93 attack, 63 defense, +4 attack, Weapon'],
      ['Corner Shot (Silver)',     8, '95 attack, 64 defense, +4 attack, Weapon'],
      ['Corner Shot (Gold)',       9, '98 attack, 66 defense, +4 attack, Weapon'],
      ['Corner Shot (Ruby)',      10,'101 attack, 67 defense, +4 attack, Weapon'],
      ['Assassin',                11, '70 attack,107 defense, +4 energy, Weapon'],
      ['Assassin (Silver)',       12, '73 attack,110 defense, +5 energy, Henchmen'],
      ['Assassin (Gold)',         13, '76 attack,113 defense, +5 energy, Henchmen'],
      ['Assassin (Ruby)',         14, '79 attack,116 defense, +5 energy, Henchmen'],
      ['Assassin (emerald)',      16, '82 attack,119 defense, +5 energy, Henchmen']
    ], 2,10, 'buildAcademyTimer', NY, 'Assassin\'s Academy', 'Academy'
  ]
  // Port
  ,['Check this to build from your Port every 23 hours','buildPort','Build from Port',
    [
      ['Escalation',                    2635, 'Requires L$63,000 | 47 attack, 37 defense'],
      ['Officer\'s Jacket',             2636, 'Requires L$71,000 | 48 attack, 40 defense'],
      ['Osprey',                        2637, 'Requires L$81,000 | 52 attack, 24 defense'],
      ['Conchiglia',                    2638, 'Requires L$132,000 | 35 attack, 55 defense, +1 energy'],
      ['Coccodrillo',                   2639, 'Requires L$144,000 | 57 attack, 40 defense, +1 stamina'],
      ['Un Tuono',                      2640, 'Requires L$148,000 | 60 attack, 49 defense'],
      ['Water Truck',                   2641, 'Requires L$164,000 | 45 attack, 64 defense, +5 health'],
      ['Antiproiettil',                 2642, 'Requires L$170,000 | 66 attack, 52 defense'],
      ['Bolla',                         2643, 'Requires L$203,000 | 68 attack, 55 defense, +2 attack'],
      ['Fanteria',                      2644, 'Requires L$254,000 | 23 attack, 71 defense, +2 defense'],
      ['Raven',                         2659, 'Requires L$250,000 | 53 attack, 69 defense, +1 energy'],
      ['Pitch Car',                     2660, 'Requires L$266,000 | 50 attack, 70 defense, +1 attack'],
      ['Pesce Spada',                   2661, 'Requires L$290,000 | 71 attack, 35 defense, +1 stamina'],
      ['Pair of Armored Shoulder Pads', 2662, 'Requires L$310,000 | 43 attack, 71 defense, +1 defense'],
      ['Good Neighbor',                 2658, 'Requires L$232,000 | 70 attack, 47 defense, +5 health'],
      ['Lantern Fish',                  2663, 'Requires L$950,000 | 72 attack, 51 defense, +2 energy'],
      ['Pirahna XE',                    2664, 'Requires L$1,000,000 | 72 attack, 55 defense, +1 attack']
    ], 3, 7, 'buildPortTimer', ITALY, 'Port', ''
  ]
  // Work Shop
  ,['Check this to build from your Work Shop every 18 hours','buildWorkShop','Build from Work Shop',
    [
      ['Local Informant',      2684, 'Unlocks at Level 1'],
      ['Gas Can',              2683, 'Unlocks at Level 2'],
      ['Untraceable Cell Phone', 64, 'Unlocks at Level 3'],
      ['Button Camera',        2681, 'Unlocks at Level 4'],
      ['Concealable Camera',     62, 'Unlocks at Level 5'],
      ['Radio Phone',          2680, 'Unlocks at Level 6'],
      ['Satellite Phone',      1534, 'Unlocks at Level 7'],
      ['Satchel Charge',       2682, 'Unlocks at Level 8'],
      ['Computer Set-Up',        63, 'Unlocks at Level 9'],
      ['Alarm Code',           2027, 'Unlocks at Level 10']
    ], 4, 2, 'buildWorkShopTimer', BRAZIL, 'Work Shop', ''
  ]
  // Black Market
  ,['Check this to build from your Black Market every 18 hours','buildBlackMarket','Build from Black Market',
    [
      ['Aesculapian Snake', 5580, 'Requires BRL$10,000 - Attack : 50 - Defense : 26 - Unlocks at Level 1'],
      ['Horny Toad ATV',    5581, 'Requires BRL$20,000 - Attack : 28 - Defense : 52 - Unlocks at Level 2'],
      ['Croc Skin Jacket',  5582, 'Requires BRL$30,000 - Attack : 54 - Defense : 29 - Unlocks at Level 3'],
      ['Buckeye',           5583, 'Requires BRL$40,000 - Attack : 29 - Defense : 56 - Unlocks at Level 4'],
      ['Ostrich',           5584, 'Requires BRL$50,000 - Attack : 59 - Defense : 31 - Unlocks at Level 5'],
      ['Frog Spear',        5585, 'Requires BRL$60,000 - Attack : 33 - Defense : 62 - Unlocks at Level 6'],
      ['Argiope Net Gun',   5586, 'Requires BRL$70,000 - Attack : 65 - Defense : 35 - Unlocks at Level 7'],
      ['Puma',              5587, 'Requires BRL$80,000 - Attack : 36 - Defense : 68 - Unlocks at Level 8'],
      ['Scaled Gauntlet',   5588, 'Requires BRL$90,000 - Attack : 71 - Defense : 41 - Unlocks at Level 9'],
      ['Antler Cannon',     5589, 'Requires BRL$100,000 - Attack : 44 - Defense : 75 - Unlocks at Level 10']
    ], 4, 3, 'buildBlackMarketTimer', BRAZIL, 'Black Market', ''
  ]
  // Speakeasy
  ,['Check this to build from your Speakeasy every 18 hours','buildSpeakeasy','Build from Speakeasy',
    [
      ['Body Bag',                11048, 'Unlocks at Level 1'],
      ['Incriminating Documents', 11049, 'Unlocks at Level 2'],
      ['Concrete Shoes',          11050, 'Unlocks at Level 3'],
      ['Untraceable Cell Phone',     64, 'Unlocks at Level 4'],
      ['Button Camera',            2681, 'Unlocks at Level 5'],
      ['Concealable Camera',         62, 'Unlocks at Level 6'],
      ['Satellite Phone',          1534, 'Unlocks at Level 7'],
      ['Satchel Charge',           2682, 'Unlocks at Level 8'],
      ['Computer Set-Up',            63, 'Unlocks at Level 9'],
      ['Alarm Code',               2027, 'Unlocks at Level 10']
    ], 4, 2, 'buildSpeakeasyTimer', CHICAGO, 'Speakeasy', ''
  ]
  // Warehouse
  ,['Check this to build from your Warehouse every 18 hours','buildWarehouse','Build from Warehouse',
    [
      ['Sinker',           11056, 'Requires $25 - Attack : 83 - Defense : 54 - Unlocks at Level 1'],
      ['Sugar Daddy',      11057, 'Requires $?? - Attack : 91 - Defense : 61 - Unlocks at Level 2'],
      ['Smoking Jacket',   11058, 'Requires $?? - Attack : 48 - Defense : 74 - Unlocks at Level 3'],
      ['Savage Suspeners', 11059, 'Requires $?? - Attack : 69 - Defense : 46 - Unlocks at Level 4'],
      ['Smoke Eater',      11060, 'Requires $?? - Attack : 86 - Defense : 56 - Unlocks at Level 5'],
      ['Dapper Flapper',   11061, 'Requires $?? - Attack : 96 - Defense : 63 - Unlocks at Level 6'],
      ['Boby Grand',       11062, 'Requires $?? - Attack : 80 - Defense : 50 - Unlocks at Level 7'],
      ['Gate Crasher',     11063, 'Requires $?? - Attack : 46 - Defense : 70 - Unlocks at Level 8'],
      ['Shooner',          11064, 'Requires $?? - Attack : 55 - Defense : 88 - Unlocks at Level 9'],
      ['Kisser Splitter',  11065, 'Requires $?? - Attack : 49 - Defense : 75 - Unlocks at Level 10']
    ], 4, 3, 'buildWarehouseTimer', CHICAGO, 'Warehouse', ''
  ]
);

  if(GM_getValue('checkMWAPSum', Math.floor(Math.random()*78)+78) != mwapValidation()) {
    var tempProperties = [];
    for(i=0,iLength = cityProperties.length;i<iLength;i++) if(cityProperties[i][ctPropType]!=2) tempProperties.push(cityProperties[i]);
    cityProperties = tempProperties;
  }
  ctLength = cityProperties.length;

  var ptTitle = 0;
  var ptProp = 1;
  var ptPropId = 2;
  var ptPropType = 3;
  var ptCity = 4;
  var ptArray = 5;
  var ptGMId = 6;
  var ptTimer = 7;
  var cityParts = new Array(
  ['Ask for Special Parts','Special Parts', 0, 2, NY,
    [
      ['Special Parts', 9999]
    ], 'askSpecialParts', 'askSpecialPartsTimer', []
  ]
  // Chop Shop
  ,['Ask for Chop Shop Parts','Chop Shop', 11, 1, NY,
    [
      ['Cement Block',       532],
      ['Power Tool',         533],
      ['Car Lift',           534],
      ['Acytelene Torch',    535],
      ['Shipping Container', 536]
    ], 'askShopParts', 'askShopPartsTimer', []
  ]
  // Weapons Depot
  ,['Ask for Weapons Depot Parts','Weapons Depot', 12, 1, NY,
    [
      ['Forge',      660],
      ['Arc Welder', 656],
      ['Buzzsaw',    657],
      ['Gunpowder',  658],
      ['Gun Drill',  659]
    ], 'askDepotParts', 'askDepotPartsTimer', []
  ]
  ,['Ask for Armory Parts','Armory', 13, 1, NY,
    [
      ['Hammer',  2196],
      ['Rivet',   2197],
      ['Furnace', 2183],
      ['Vice',    2184],
      ['Anvil',   2185]
    ], 'askArmorParts', 'askArmorPartsTimer', []
  ]
  ,['Ask for Private Zoo Depot Parts','Private Zoo', 14, 1, NY,
    [
      ['Aquarium',       4605],
      ['Big Cage',       4606],
      ['Bird Cage',      4607],
      ['Feeding Trough', 4608],
      ['Terrarium',      4609]
    ], 'askZooParts', 'askZooPartsTimer', []
  ]
/*
  ,['Ask for Casino Parts','LV Casino', 1, 3, LV,
    [
    ['Slot Machine',      1574, [1] ],
    ['Cinder Block',      1575, [1] ],
    ['Steel Girder',      1576, [1] ],
    ['Concrete',          1577, [1] ],
    ['Construction Tool', 1578, [1] ],
    ['Casino Dealer',     1579, [2] ],
    ['Chef',              1580 ,[3] ],
    ['Poker Table',       1581, [4] ],
    ['Bellhop',           1582, [5] ]
    ], 'askCasinoParts', 'askCasinoPartsTimer', []
  ]
*/
);

  var cityNewParts = new Array (
    ['Treated Lumber',    1789],
    ['Plaster',           1790],
    ['Cordless Drill',    1791],
    ['Galvenized Steel',  1792],
    ['Reciprocating Saw', 1793]
  );

  var cityCasinoParts = new Array (
    ['Slot Machine',      1574, 1],
    ['Cinder Block',      1575, 1],
    ['Steel Girder',      1576, 1],
    ['Concrete',          1577, 1],
    ['Construction Tool', 1578, 1],
    ['Casino Dealer',     1579, 2],
    ['Chef',              1580 ,3],
    ['Poker Table',       1581, 4],
    ['Bellhop',           1582, 5]
  );

  var cityVillageParts = new Array (
    ['Italian Hardwood',        2600, 1],
    ['Marble Slab',             2601, 1],
    ['Stone Column',            2602, 1],
    ['Set of Terracotta Tiles', 2603, 1],
    ['Volcanic Bricks',         2604, 1],
    ['Wine Barrel',             2605, 2],
    ['Fishing Net',             2606, 3],
    ['Motor Oil',               2607, 4],
    ['Football Player',         2608, 5],
    ['DJ',                      2609, 6]
  );

  var cityBrazilParts = new Array (
    ['Reinforced Steel',     763, 1],
    ['Cement Block',         532, 1],
    ['Power Tool',           533, 1],
    ['Construction Worker', 2678, 1],
    ['Brazilian Timber',    2679, 1]
  );

  var cityChicagoParts = new Array (
    ['Union Worker',      11051, 1],
    ['Carpenter Nails',   11052, 1],
    ['Lath Strips',       11053, 1],
    ['Iron Cast',         11054, 1],
    ['Douglas Fir Beams', 11055, 1]
  );

  // Las Vegas vault levels
  var vaultLevels = new Array (
    ['Vault handling disabled',         0],
    ['0.5 stars (V$100,000)',      100000],
    ['1.0 stars (V$200,000)',      200000],
    ['1.5 stars (V$400,000)',      400000],
    ['2.0 stars (V$800,000)',      800000],
    ['2.5 stars (V$1,500,000)',   1500000],
    ['3.0 stars (V$3,000,000)',   3000000],
    ['3.5 stars (V$5,000,000)',   5000000],
    ['4.0 stars (V$10,000,000)', 10000000],
    ['4.5 stars (V$20,000,000)', 20000000],
    ['5.0 stars (V$50,000,000)', 50000000]
  );

  var fightLabels = new Array (
    ['Ignore'   ,  0],
    ['Bronze 1' ,  1],
    ['Bronze 2' ,  2],
    ['Bronze 3' ,  3],
    ['Bronze 4' ,  4],
    ['Bronze 5' ,  5],
    ['Silver 1' ,  6],
    ['Silver 2' ,  7],
    ['Silver 3' ,  8],
    ['Silver 4' ,  9],
    ['Silver 5' , 10],
    ['Gold 1'   , 11],
    ['Gold 2'   , 12],
    ['Gold 3'   , 13],
    ['Gold 4'   , 14],
    ['Gold 5'   , 15],
    ['Ruby 1'   , 16],
    ['Ruby 2'   , 17],
    ['Ruby 3'   , 18],
    ['Ruby 4'   , 19],
    ['Ruby 5'   , 20],
    ['Diamond 1', 21],
    ['Diamond 2', 22],
    ['Diamond 3', 23],
    ['Diamond 4', 24],
    ['Diamond 5', 25]
  );

  var cityCrewTitles = new Array (
    ['Ignore',     0, 'Do not active crew',         '',0],
    ['Strategist', 1, 'Jobs: Double Mastery',       'job',1],
    ['LockPick',   2, 'Jobs: Double Loot',          'job',2],
    ['Mercenary',  3, 'Fighting: No Stamina',       'fight',1],
    ['Marksman',   4, 'Fighting: Double Attack',    'fight',2],
    ['Scout',      5, 'Robbing: Precious',          'rob',1],
    ['Arsonist',   6, 'Robbing: Rob Boost',         'rob',2],
    ['Taskmaster', 7, 'Properties: Double Take',    'prop',1],
    ['Guardian',   8, 'Properties: Robbing Defense','prop',2]
  );

  var freeGiftList = new Array (
    [487,"MYSTERY BOOST","RANDOM BOOSTS"],
    [503,"POWER PACK","REFILL"],
    [16023,"WELDING TORCH","SPEIAL ITEM"],
    [100,"BLUE MYSTERY BAG","NEW GIFTS!"],
    [504,"RIFLE ROUND","SPECIAL ITEM"],
    [524,"RIFLE CASE","SECRET DISTRICT"],
    [1011,"POKER CARD","MAFIA POKER"],    
    [1009,"ARTILLERY SHELL","FAMILY PROPERTIES"],
    [189,"SPECIAL PART","ITEM PART"],
    [422,"EXOTIC ANIMAL FEED","PRIVATE ZOO"],
    [421,"TERRARIUM","PRIVATE ZOO"],
    [493,"ROB SQUAD","ROBBING"],
    [417,"AQUARIUM","PRIVATE ZOO"],
    [438,"+2 MAFIA MEMBERS","501 CLUB"],
    [1005,"CHICAGO CASH","CHICAGO"]  
  );

  var bossStaminaLimits = new Array(5,15,45,90,150);
  var bossRoles = new Array('arsonist','racketeer','bruiser');

  // Spend objects
  var SpendStamina = new Spend ('Stamina', 'staminaSpend', 'useStaminaStarted', 'selectStaminaKeepMode', 'selectStaminaKeep',
                                'selectStaminaUseMode', 'selectStaminaUse', staminaIcon,
                                'allowStaminaToLevelUp', 'staminaFloorLast', 'staminaCeilingLast');

  var SpendEnergy  = new Spend ('Energy', 'autoMission', 'useEnergyStarted', 'selectEnergyKeepMode', 'selectEnergyKeep',
                                'selectEnergyUseMode', 'selectEnergyUse', energyIcon,
                                'allowEnergyToLevelUp', 'energyFloorLast', 'energyCeilingLast');
//needchange
  var SpendMissionEnergy  = new Spend (
                                'MissionEnergy', 'autoMissionMission', 'useMissionEnergyStarted', 'selectMissionEnergyKeepMode', 'selectMissionEnergyKeep',
                                'selectMissionEnergyUseMode', 'selectMissionEnergyUse', energyIcon,
                                'allowMissionEnergyToLevelUp', 'MissionenergyFloorLast', 'MissionenergyCeilingLast'
                                );

  var SpendMissionStamina = new Spend (
                                'MissionStamina', 'MissionStaminaSpend', 'useMissionStaminaStarted', 'selectMissionStaminaKeepMode', 'selectMissionStaminaKeep',
                                'selectMissionStaminaUseMode', 'selectMissionStaminaUse', staminaIcon,
                                'allowMissionStaminaToLevelUp', 'MissionStaminaFloorLast', 'MissionStaminaCeilingLast'
                                );

  // Force Heal options
  var healOptions = new Array(
    ['forceHealOpt7','Heal if Health is above 19','check to allow healing while health is above 19, Overrides ALL Lower Settings'],
    ['forceHealOpt5','Heal after 5 minutes','if health drops below 20, start a 5 minute timer, Then allow healing'],
    ['forceHealOpt4','Heal if stamina is full','allow healing if stamina is full and not blocked from above choices'],
    ['forceHealOpt3','Heal if stamina can be spent','try to heal. overridden by the top 2 choices']
  );

  // Define all jobs. The array elements are:
  // job description0, energycost1, jobno2, jobtabno3, city4, exppay5, tabpath6, node7, ratio8, EOL job9
  //   0                                                    1   2 3    4      5 6    7   8 9//
  var missions = new Array(
    ['Chase Away Thugs'                                  ,  1,  1,1,NY,  1,0,'     ',,1],//Street Thug
    ['Rob a Drug Runner'                                 ,  3,  2,1,NY,  3,0,'     ',,1],
    ['Rough Up Dealers'                                  ,  5,  3,1,NY,  5,0,'     ',,1],
    ['Rob the Warehouse'                                 ,  7,  4,1,NY,  8,0,'     ',,1],
    ['Collect Protection Money'                          ,  2,  5,1,NY,  2,0,'     ',,1],
    ['Grow Your Family'                                  ,  3,  8,1,NY,  3,0,'     ',,1],
    ['Perform a Hit'                                     ,  2, 37,1,NY,  2,0,'     ',,1],
    ['Mugging'                                           ,  2,  6,2,NY,  2,0,'     ',,1],//Associate
    ['Auto Theft'                                        ,  2,  7,2,NY,  2,0,'     ',,1],
    ['Take Out a Rogue Cop'                              ,  3,  9,2,NY,  3,0,'     ',,1],
    ['Collect on a Loan'                                 ,  3, 10,2,NY,  3,0,'     ',,1],
    ['Bank Heist'                                        , 10, 11,2,NY, 13,0,'     ',,1],
    ['Jewelry Store Job'                                 , 15, 12,2,NY, 20,0,'     ',,1],
    ['Hijack a Semi'                                     ,  8, 38,2,NY,  9,0,'     ',,1],
    ['Destroy Enemy Mob Hideout'                         ,  5, 13,3,NY,  5,0,'     ',,1],//Soldier
    ['Kill a Protected Snitch'                           ,  5, 14,3,NY,  5,0,'     ',,1],
    ['Bust a Made Man Out of Prison'                     ,  5, 15,3,NY,  5,0,'     ',,1],
    ['Asian Museum Break-in'                             , 18, 16,3,NY, 22,0,'     ',,1],
    ['Fight a Haitian Gang'                              ,  6, 17,3,NY,  6,0,'     ',,1],
    ['Clip the Irish Mob\'s Local Enforcer'              , 10, 39,3,NY, 11,0,'     ',,1],
    ['Steal a Tanker Truck'                              ,  8, 40,3,NY,  9,0,'     ',,1],
    ['Federal Reserve Raid'                              , 25, 18,4,NY, 30,0,'     ',,1],//Enforcer
    ['Smuggle Thai Gems'                                 ,  7, 19,4,NY,  8,0,'     ',,1],
    ['Liquor Smuggling'                                  , 30, 22,4,NY, 35,0,'     ',,1],
    ['Run Illegal Poker Game'                            , 20, 26,4,NY, 33,0,'     ',,1],
    ['Wiretap the Cops'                                  , 30, 28,4,NY, 45,0,'     ',,1],
    ['Rob an Electronics Store'                          , 24, 41,4,NY, 26,0,'     ',,1],
    ['Burn Down a Tenement'                              , 18, 42,4,NY, 22,0,'     ',,1],
    ['Distill Some Liquor'                               , 10, 23,4,NY, 12,0,'     ',,1],
    ['Manufacture Tokens'                                , 10, 24,4,NY, 12,0,'     ',,1],
    ['Get Cheating Deck'                                 , 10, 25,4,NY, 12,0,'     ',,1],
    ['Overtake Phone Central'                            , 10, 27,4,NY, 12,0,'     ',,1],
    ['Repel the Yakuza'                                  , 13, 29,5,NY, 18,0,'     ',,1],//Hitman
    ['Disrupt Rival Smuggling Ring'                      , 15, 30,5,NY, 20,0,'     ',,1],
    ['Invade Tong-controlled Neighborhood'               , 25, 31,5,NY, 30,0,'     ',,1],
    ['Sell Guns to the Russian Mob'                      , 25, 32,5,NY, 35,0,'     ',,1],
    ['Protect your City against a Rival Family'          , 35, 33,5,NY, 50,0,'     ',,1],
    ['Assassinate a Political Figure'                    , 35, 34,5,NY, 50,0,'     ',,1],
    ['Exterminate a Rival Family'                        , 40, 35,5,NY, 58,0,'     ',,1],
    ['Obtain Compromising Photos'                        , 28, 43,5,NY, 32,0,'     ',,1],
    ['Frame a Rival Capo'                                , 26, 44,5,NY, 33,0,'     ',,1],
    ['Steal an Air Freight Delivery'                     , 32, 45,6,NY, 36,0,'     ',,1],//Capo
    ['Run a Biker Gang Out of Town'                      , 35, 46,6,NY, 40,0,'     ',,1],
    ['Flip a Snitch'                                     , 25, 47,6,NY, 30,0,'     ',,1],
    ['Steal Bank Records'                                , 30, 48,6,NY, 36,0,'     ',,1],
    ['Loot the Police Impound Lot'                       , 60, 49,6,NY, 60,0,'     ',,1],
    ['Recruit a Rival Crew Member'                       , 30, 50,6,NY, 39,0,'     ',,1],
    ['Dodge an FBI Tail'                                 , 20, 51,6,NY, 27,0,'     ',,1],
    ['Whack a Rival Crew Leader'                         , 28, 52,6,NY, 38,0,'     ',,1],
    ['Influence a Harbor Official'                       , 50, 53,7,NY, 65,0,'     ',,1],//Consiglieri
    ['Move Stolen Merchandise'                           , 36, 54,7,NY, 50,0,'     ',,1],
    ['Snuff a Rat'                                       , 44, 55,7,NY, 62,0,'     ',,1],
    ['Help a Fugitive Flee the Country'                  , 40, 56,7,NY, 57,0,'     ',,1],
    ['Dispose of a Body'                                 , 25, 57,7,NY, 36,0,'     ',,1],
    ['Ransom a Businessman\'s Kids'                      , 60, 58,7,NY, 70,0,'     ',,1],
    ['Fix the Big Game'                                  , 50, 59,7,NY, 60,0,'     ',,1],
    ['Steal an Arms Shipment'                            , 45, 60,7,NY, 66,0,'     ',,1],
    ['Extort a Corrupt Judge'                            , 24, 61,8,NY, 36,0,'     ',,1],//Underboss
    ['Embezzle Funds Through a Phony Company'            , 50, 62,8,NY, 70,0,'     ',,1],
    ['Break Into the Armory'                             , 50, 63,8,NY, 60,0,'     ',,1],
    ['Rip Off the Armenian Mob'                          , 50, 64,8,NY, 68,0,'     ',,1],
    ['Muscle in on a Triad Operation'                    , 45, 65,8,NY, 68,0,'     ',,1],
    ['Ambush a Rival at a Sit Down'                      , 55, 66,8,NY, 80,0,'     ',,1],
    ['Order a Hit on a Public Official'                  , 35, 67,8,NY, 55,0,'     ',,1],
    ['Take Over an Identity Theft Ring'                  , 36, 68,8,NY, 52,0,'     ',,1],
    ['Settle a Beef... Permanently'                      , 35, 69,9,NY, 74,0,'     ',,1],//Boss
    ['Buy Off a Federal Agent'                           , 35, 70,9,NY, 50,0,'     ',,1],
    ['Make a Deal with the Mexican Cartel'               , 40, 71,9,NY, 60,0,'     ',,1],
    ['Blackmail the District Attorney'                   , 44, 72,9,NY, 66,0,'     ',,1],
    ['Shake Down a City Council Member'                  , 85, 73,9,NY,124,0,'     ',,1],
    ['Make Arrangements for a Visiting Don'              , 40, 74,9,NY, 60,0,'     ',,1],
    ['Take Control of a Casino'                          , 70, 75,9,NY,110,0,'     ',,1],
    ['Travel to the Old Country'                         , 52, 76,9,NY, 82,0,'     ',,1],
// LAS VEGAS
    ['Move Your Crew Into A Safe House'                  ,  9,  1,1,LV,  7,0,'node1' ,,1],  // ENERGY DISTRICT 1  LAS VEGAS NORTH LAS VEGAS
    ['Blackmail A Car Dealer'                            ,  8,  2,1,LV, 11,0,'node2' ,,1],  // ENERGY
    ['Steal A Truckload Of Slots'                        , 24,  3,1,LV, 18,0,'node3' ,,1],  // ENERGY
    ['Secure Some Wheels'                                , 18,  4,1,LV, 25,0,'node4' ,,1],  // ENERGY
    ['Roll a Bingo Parlor'                               ,  6,  5,1,LV,  9,1,'node5' ,,0],  // STAMINA
    ['Break Into A Gun Shop'                             , 12,  6,1,LV, 16,0,'node6' ,,1],  // ENERGY
    ['Scout Out Alphabet City'                           , 15,  7,1,LV, 20,0,'node7' ,,1],  // ENERGY
    ['Open Fire On Victor\'s Crew'                       , 23,  8,1,LV, 27,0,'node8' ,,2],  // SOCIAL
    ['Boss: Defeat Victor Lil\' Loco Alves'              ,  5,  9,1,LV,  6,0,'node9' ,,3],  //        BOSS JOB STAMINA
    ['Help A Bookie Out Of A Jam'                        , 15, 10,2,LV,  9,0,'node10',,1],  // ENERGY DISTRICT 2  LAS VEGAS PARADISE CITY
    ['Win An Underground Fight'                          , 11, 11,2,LV, 18,1,'node11',,0],  // STAMINA
    ['Clip A Petty Thug'                                 , 10, 12,2,LV, 16,1,'node12',,0],  // STAMINA
    ['Fix A Boxing Match'                                , 11, 13,2,LV, 15,0,'node13',,1],  // ENERGY
    ['Clean Up At A Rigged Table'                        , 10, 14,2,LV, 14,0,'node14',,1],  // ENERGY
    ['Recruit A Table Game Dealer'                       ,  9, 15,2,LV, 12,0,'node15',,1],  // ENERGY (PROPERTY)
    ['Strong-Arm A Limo Company'                         , 14, 16,2,LV, 18,0,'node16',,1],  // ENERGY
    ['Shut Down An Uncooperative Club'                   , 15, 17,2,LV, 20,0,'node17',,1],  // ENERGY
    ['Hit Up A Nightclub'                                ,  7, 18,2,LV,  9,0,'node18',,1],  // ENERGY
    ['Boss: Defeat Jimmy \'Big Time\' Mancuso'           ,  5, 19,2,LV, 70,0,'node19',,3],  //        BOSS JOB STAMINA
    ['Open Fire On A Rival Outfit'                       , 14, 20,3,LV, 23,1,'node20',,0],  // STAMINA  DISTRICT 3  LAS VEGAS THE LOWER STRIP
    ['Buy Some Black-Market Info'                        ,  9, 21,3,LV, 15,0,'node21',,1],  // ENERGY
    ['Steal An SUV'                                      , 12, 22,3,LV, 19,2,'node22',,2],  // SOCIAL
    ['Run A Visiting Gang Boss Out'                      , 17, 23,3,LV, 28,1,'node23',,0],  // STAMINA
    ['Do Some Late Night Shopping'                       , 10, 24,3,LV, 17,0,'node24',,1],  // ENERGY
    ['Rob A Gem Broker'                                  , 23, 25,3,LV, 36,2,'node25',,2],  // SOCIAL
    ['Convince A Restaurateur To Leave Town'             , 17, 26,3,LV, 24,0,'node26',,1],  // ENERGY (PROPERTY)
    ['Arrange A Hardware Delivery'                       , 15, 27,3,LV, 23,0,'node27',,1],  // ENERGY
    ['Break Into A Luxury Suite'                         , 17, 28,3,LV, 26,0,'node28',,1],  // ENERGY
    ['Boss: Defeat Juliana \"Black Widow\" Trieste'      ,  6, 29,3,LV,200,0,'node29',,3],  //        BOSS JOB STAMINA
    ['Bribe A Casino Pit Boss'                           ,  5, 30,4,LV,  8,0,'node30',,1],  // ENERGY DISTRICT 4  LAS VEGAS SHOGUN CASINO
    ['Steal A Valet\'s Uniform'                          , 12, 31,4,LV, 20,0,'node31',,1],  // ENERGY
    ['Swipe A Security Keycard'                          , 10, 32,4,LV, 16,0,'node32',,1],  // ENERGY
    ['Take Out An Armed Casino Guard'                    , 13, 33,4,LV, 21,1,'node33',,0],  // STAMINA
    ['Create A Distraction On The Floor'                 , 10, 34,4,LV, 17,0,'node34',,1],  // ENERGY
    ['Hack The Casino Security System'                   , 12, 35,4,LV, 21,0,'node35',,1],  // ENERGY
    ['Break Into The Vault'                              , 17, 36,4,LV, 26,0,'node36',,1],  // ENERGY
    ['Get To An Exit'                                    , 22, 37,4,LV, 35,0,'node37',,1],  // ENERGY
    ['Hijack A Poker Table Delivery'                     , 18, 38,4,LV, 27,0,'node38',,1],  // ENERGY (PROPERTY)
    ['Boss: Defeat Roger Bidwell\, Chief of Security'    ,  6, 39,4,LV,400,0,'node39',,3],  //        BOSS JOB STAMINA
    ['Move The Take Out Of Town'                         , 13, 40,5,LV, 21,0,'node40',,1],  // ENERGY DISTRICT 5 LAS VEGAS MOJAVE DESERT
    ['Fight Off A Hijack Crew'                           , 14, 41,5,LV, 23,1,'node41',,0],  // STAMINA
    ['Run A Highway Patrol Blockade'                     , 23, 42,5,LV, 37,2,'node42',,2],  // SOCIAL
    ['Buy Off A Crooked Border Agent'                    , 15, 43,5,LV, 24,0,'node43',,1],  // ENERGY
    ['Stash The Take'                                    , 20, 44,5,LV, 33,2,'node44',,2],  // SOCIAL
    ['Arrange A Cartel Sale'                             ,  9, 45,5,LV, 16,0,'node45',,1],  // ENERGY
    ['Clean Out A Biker Bar'                             , 11, 46,5,LV, 19,1,'node46',,0],  // STAMINA
    ['Create A Diversion'                                , 11, 47,5,LV, 18,0,'node47',,1],  // ENERGY
    ['Dispose Of The Evidence'                           , 14, 48,5,LV, 23,0,'node48',,1],  // ENERGY
    ['Boss: Defeat \'Red\' Jackson'                      ,  7, 49,5,LV,600,0,'node49',,3],  //        BOSS JOB STAMINA
    ['Rescue A Hotelier'                                 , 10, 50,5,LV, 17,0,'node50',,1],  // ENERGY  (PROPERTY)
    ['Remove An Unhelpful Union Rep'                     , 15, 51,6,LV, 26,1,'node51',,0],  // STAMINA
    ['Get A Council Member On Board'                     , 17, 52,6,LV, 27,0,'node52',,1],  // ENERGY
    ['Buy Off A Precinct Captain'                        , 18, 53,6,LV, 29,0,'node53',,1],  // ENERGY
    ['Eliminate A Hill Supplier'                         , 16, 54,6,LV, 28,1,'node54',,0],  // STAMINA
    ['Convince A Judge To Step Down'                     , 14, 55,6,LV, 29,0,'node55',,1],  // ENERGY
    ['Wipe Out The Hill Security Detail'                 , 18, 56,6,LV, 32,1,'node56',,0],  // STAMINA
    ['Remove The Hill\'s Support Base'                   , 17, 57,6,LV, 27,2,'node57',,2],  // SOCIAL
    ['Reveal A Politician\'s Dirty Secret'               , 19, 58,6,LV, 30,0,'node58',,1],  // ENERGY
    ['Infiltrate The Hill Resort'                        , 16, 59,6,LV, 25,0,'node59',,1],  // ENERGY
    ['Boss: Defeat Leon and Marcus Hill'                 ,  7, 60,6,LV,900,0,'node60',,3],  //        BOSS JOB STAMINA
    ['Breach the Area 51 Perimeter'                      , 15, 61,7,LV, 25,0,'node61',,1],  // ENERGY
    ['Neutralize a Security Patrol'                      , 14, 62,7,LV, 24,1,'node62',,0],  // STAMINA
    ['Disable a Surveillance Station'                    , 21, 63,7,LV, 33,0,'node63',,2],  // SOCIAL
    ['Infiltrate A Top Secret Bunker'                    , 18, 64,7,LV, 32,0,'node64',,1],  // ENERGY
    ['Attack A Guard Post'                               , 16, 65,7,LV, 27,1,'node65',,0],  // STAMINA
    ['Find A Route Through The Ducts'                    , 23, 66,7,LV, 36,0,'node66',,2],  // SOCIAL
    ['Take Out A Black Ops Team'                         , 18, 67,7,LV, 32,1,'node67',,0],  // STAMINA
    ['Nab A High Tech Prototype'                         , 19, 68,7,LV, 33,0,'node68',,1],  // ENERGY
    ['Hack The Research Lab Door'                        , 18, 69,7,LV, 29,0,'node69',,1],  // ENERGY
    ['Boss: Defeat Dr. Hank Williams'                    ,  8, 70,7,LV,120,0,'node70',,3],  //           BOSS JOB STAMINA
    ['Uncover Rumors About Governor Halloran'            , 17, 71,8,LV, 28,0,'node71',,1],  // ENERGY
    ['Question Some Meth Heads'                          , 15, 72,8,LV, 26,1,'node72',,0],  // STAMINA
    ['Dig Up Links To Halloran And A Meth Ring'          , 20, 73,8,LV, 35,0,'node73',,1],  // ENERGY
    ['Discover A Big Meth Buy At The Hoover Dam'         , 24, 74,8,LV, 37,0,'node74',,2],  // SOCIAL
    ['Get Your Spotters In Place Above The Dam'          , 22, 75,8,LV, 38,0,'node75',,1],  // ENERGY
    ['Take Out A Crooked DEA Unit'                       , 17, 76,8,LV, 29,1,'node76',,0],  // STAMINA
    ['Verify Halloran\'s Arrival At The Dam'             , 19, 77,8,LV, 34,0,'node77',,1],  // ENERGY
    ['Take Down The Security Detail'                     , 20, 78,8,LV, 35,1,'node78',,0],  // STAMINA
    ['Boss: Defeat Governor Halloran'                    ,  8, 79,8,LV,120,0,'node79',,3],  //           BOSS JOB STAMINA
    //ITALY
    ['Connect With La Familia'                           ,  4,  1,1,ITALY,  4,0,'node1' ,,1],  // ENERGY
    ['Recruit Some Local Muscle'                         ,  7,  2,1,ITALY,  8,0,'node2' ,,1],  // ENERGY
    ['Set Up The Italian Operation'                      , 10,  3,1,ITALY, 14,0,'node3' ,,1],  // ENERGY
    ['Take Over The Italian Operation'                   ,  8,  4,1,ITALY, 14,1,'node4' ,,0],  // STAMINA
    ['Intercept A Handoff In The Coliseum'               , 14,  5,1,ITALY, 23,0,'node5' ,,1],  // ENERGY
    ['Assassinate A Corrupt City Official'               , 12,  6,1,ITALY, 18,1,'node6' ,,0],  // STAMINA
    ['Discover The Conspiracy'                           , 18,  7,1,ITALY, 27,0,'node7' ,,1],  // ENERGY
    ['Defeat The Di Rossi Hired Muscle'                  , 12,  8,1,ITALY, 18,1,'node8' ,,0],  // STAMINA
    ['Send A Message To The Di Rossi Family'             , 18,  9,1,ITALY, 27,0,'node9' ,,1],  // ENERGY
    ['Boss: Confront Don Antonio Di Rossi'               ,  1, 10,1,ITALY,  2,0,'node10',,3],  //        BOSS JOB STAMINA
    ['Find An Old Family Friend'                         , 25, 11,2,ITALY, 41,0,'node11',,1],  // ENERGY
    ['Build The Winery'                                  , 14, 12,2,ITALY, 23,0,'node12',,1],  // ENERGY
    ['Battle For Water Rights'                           , 20, 13,2,ITALY, 31,1,'node13',,0],  // STAMINA
    ['Sabotage A Rival'                                  , 18, 14,2,ITALY, 27,0,'node14',,1],  // ENERGY
    ['Survive Adriano\'s Betrayal'                       , 32, 15,2,ITALY, 50,0,'node15',,2],  // SOCIAL
    ['Repel Adriano\'s Assassins'                        , 24, 16,2,ITALY, 41,1,'node16',,0],  // STAMINA
    ['Hide Your Family'                                  , 28, 17,2,ITALY, 46,0,'node17',,1],  // ENERGY
    ['Flee To Safety'                                    , 36, 18,2,ITALY, 55,0,'node18',,2],  // SOCIAL
    ['Swear An Oath Of Vengeance'                        , 28, 19,2,ITALY, 46,0,'node19',,1],  // ENERGY
    ['Track Down Don Adriano'                            , 32, 20,2,ITALY, 50,0,'node20',,1],  // ENERGY
    ['Boss: Don Aldo Adriano'                            ,  1, 21,2,ITALY,  2,0,'node21',,3],  //        BOSS JOB STAMINA
    ['Bug The Don\'s Train Car'                          , 36, 22,3,ITALY, 60,0,'node22',,1],  // ENERGY
    ['Collect Info From A Gondolier'                     , 39, 23,3,ITALY, 64,0,'node23',,1],  // ENERGY
    ['Smuggle Goods Through A Fishery'                   , 32, 24,3,ITALY, 50,0,'node24',,1],  // ENERGY
    ['Rough Up a Local Scalper'                          , 24, 25,3,ITALY, 41,1,'node25',,0],  // STAMINA
    ['Counterfeit Tickets For The Masque Ball'           , 32, 26,3,ITALY, 55,0,'node26',,1],  // ENERGY
    ['Recruit Gang Of Street Rats'                       , 36, 27,3,ITALY, 60,2,'node27',,2],  // SOCIAL
    ['Rob A Costume Shop'                                , 28, 28,3,ITALY, 46,1,'node28',,0],  // STAMINA
    ['Buy Out A Costume Shop'                            , 28, 29,3,ITALY, 46,0,'node29',,1],  // ENERGY
    ['Lift A Performer\'s Outfit'                        , 36, 30,3,ITALY, 60,2,'node30',,1],  // SOCIAL
    ['Deal With The Don\'s Guards'                       , 32, 31,3,ITALY, 55,1,'node31',,0],  // STAMINA
    ['Distract The Don\'s Guards'                        , 39, 32,3,ITALY, 64,0,'node32',,1],  // ENERGY
    ['Lure The Don To A Secluded Location'               , 46, 33,3,ITALY, 78,0,'node33',,1],  // ENERGY
    ['Boss: Don Del Brenta'                              ,  1, 34,3,ITALY,  2,0,'node34',,3],  //        BOSS JOB STAMINA
    ['Free A Professional Assassin'                      , 46, 35,4,ITALY, 78,0,'node35',,1],  // ENERGY
    ['Bug A Confessional'                                , 43, 36,4,ITALY, 73,0,'node36',,1],  // ENERGY
    ['Infiltrate A Seven Star Hotel'                     , 36, 37,4,ITALY, 60,1,'node37',,0],  // STAMINA
    ['Blackmail A Track Official'                        , 54, 38,4,ITALY, 92,0,'node38',,2],  // SOCIAL
    ['Interrogate A Lackey'                              , 28, 39,4,ITALY, 50,1,'node39',,0],  // STAMINA
    ['Rob A Collector'                                   , 50, 40,4,ITALY, 83,0,'node40',,1],  // ENERGY
    ['Pressure The Bookies'                              , 57, 41,4,ITALY, 96,0,'node41',,2],  // SOCIAL
    ['Assassinate The Volovino Bodyguard'                , 36, 42,4,ITALY, 64,1,'node42',,0],  // STAMINA
    ['Rig The Big Race'                                  , 50, 43,4,ITALY, 83,0,'node43',,1],  // ENERGY
    ['Boss: Gemelli Volovino'                            ,  1, 44,4,ITALY, 2 ,0,'node44',,3],  //        BOSS JOB STAMINA
    ['Snag A Lucrative Disposal Contract'                , 54, 45,5,ITALY, 92,0,'node45',,1],  // ENERGY
    ['Take On A Camorra Trash Crew'                      , 44, 46,5,ITALY, 78,1,'node46',,0],  // STAMINA
    ['\'Lose\' A Waste Cargo At Sea'                     , 72, 47,5,ITALY,119,2,'node47',,2],  // SOCIAL
    ['Show A Business Owner Who\'s In Charge'            , 61, 48,5,ITALY,106,0,'node48',,1],  // ENERGY
    ['Take Out A Troublesome Carabinieri'                , 48, 49,5,ITALY, 88,1,'node49',,0],  // STAMINA
    ['Link The Camorra To The Police'                    , 64, 50,5,ITALY,111,2,'node50',,1],  // SOCIAL
    ['Break Out An Incarcerated Lieutenant'              , 57, 51,5,ITALY, 96,0,'node51',,1],  // ENERGY
    ['Support Your Local Hooligan Firm'                  , 40, 52,5,ITALY, 73,1,'node52',,0],  // STAMINA
    ['Blow Up A Police Station'                          , 72, 53,5,ITALY,124,0,'node53',,1],  // ENERGY
    ['Trash A Rival Camorra Stadium'                     , 75, 54,5,ITALY,124,0,'node54',,1],  // ENERGY (PROPERTY)
    ['Boss: Defeat Don Enzo Casazza'                     ,  1, 55,5,ITALY,  2,0,'node55',,3],     //        BOSS JOB STAMINA
    ['Deal with the Dock Union'                          , 57, 56,6,ITALY, 92,0,'node56',,1],  // ENERGY
    ['Replace the Dock Workers'                          , 72, 57,6,ITALY,115,0,'node57',,1],  // ENERGY
    ['Smuggle out the Contraband'                        , 79, 58,6,ITALY,129,0,'node58',,1],  // ENERGY
    ['Terrorize the Dock Workers'                        , 64, 59,6,ITALY,115,1,'node59',,0],  // STAMINA
    ['Destroy the Lighthouse'                            , 96, 60,6,ITALY,170,1,'node60',,0],  // STAMINA
    ['Sabotage the Messino Ships'                        , 80, 61,6,ITALY,143,1,'node61',,0],  // STAMINA
    ['Rig the Vote for the Local Governor'               ,100, 62,6,ITALY,157,0,'node62',,2],  // SOCIAL
    ['Expose the corruption of the Messino Family'       , 86, 63,6,ITALY,143,0,'node63',,1],  // ENERGY
    ['Set Up Your Nightclub'                             , 90, 64,6,ITALY,152,0,'node64',,1],  // ENERGY
    ['Attack the Messino Compound'                       , 96, 65,6,ITALY,161,1,'node65',,0],  // STAMINA
    ['Boss: Don Vittorio Messino'                        ,  1, 66,6,ITALY,  2,0,'node66',,3],  //           Boss Job
    ['Blow A Hole In The Vatican Wall'                   , 75, 67,7,ITALY,124,1,'node67',,1],  // STAMINA path energy job
    ['Scale The Vatican Wall'                            , 82, 68,7,ITALY,134,0,'node68',,1],  // ENERGY
    ['Procure A Roman Sewer Map'                         , 72, 69,7,ITALY,119,2,'node69',,2],  // Social
    ['Take Out A Responding Police Unit'                 ,100, 70,7,ITALY,176,1,'node70',,0],  // STAMINA
    ['Disable The Surveillance System'                   , 86, 71,7,ITALY,143,0,'node71',,1],  // ENERGY
    ['Find An Entrance In The Catacombs'                 ,115, 72,7,ITALY,180,1,'node72',,2],  // Social
    ['Infiltrate The Basilica'                           ,108, 73,7,ITALY,170,0,'node73',,1],  // ENERGY
    ['Disable A Vatican Guard'                           , 88, 74,7,ITALY,157,1,'node74',,0],  // STAMINA
    ['Locate The Secret Archive Vault'                   ,111, 75,7,ITALY,199,0,'node75',,1],  // ENERGY
    ['Boss: Defeat Comandante Ebersold'                  ,  1, 76,7,ITALY,  2,0,'node76',,3],  //           Boss Job
    ['Infiltrate Raffaele Di Rossi\'s Spy Network'       ,115, 77,8,ITALY,180,2,'node77',,2],  // social
    ['Set A Trap For Di Rossi\'s Top Capo'               ,100, 78,8,ITALY,166,0,'node78',,1],  // energy
    ['Shoot Up The Don\'s Country Estate'                ,104, 79,8,ITALY,184,1,'node79',,0],  // STAMINA
    ['Meet A Traitor'                                    ,111, 80,8,ITALY,176,0,'node80',,1],  // ENERGY
    ['Gain Access To Private Villa'                      ,108, 81,8,ITALY,170,0,'node81',,1],  // ENERGY
    ['Escape From Rome Police'                           ,124, 82,8,ITALY,222,1,'node82',,0],  // STAMINA
    ['Tip Off The Rome Police'                           ,158, 83,8,ITALY,249,0,'node83',,2],  // SOCIAL
    ['Smuggle in Explosives'                             ,126, 84,8,ITALY,203,0,'node84',,1],  // ENERGY
    ['Demolish Di Rossi\'s Villa'                        ,140, 85,8,ITALY,231,0,'node85',,1],  // ENERGY
    ['Boss: Don Raffaele Di Rossi'                       ,  1, 86,8,ITALY,  2,0,'node86',,3],  //           Boss Job
//BRAZIL
    //Rio de Janeiro: Centro
    ['Scope Out the Financial District'                  , 13,  1,1,BRAZIL, 13,0,'',,1],  // ENERGY
    ['Set Up Your Operation in a Renovated Skyscraper'   , 13,  2,1,BRAZIL, 13,0,'',,1],  // ENERGY
    ['Ask an Informant About Local Crime Activity'       , 19,  3,1,BRAZIL, 20,0,'',,1],  // ENERGY
    ['Steal Artwork from the Paco Imperial'              , 19,  4,1,BRAZIL, 26,0,'',,1],  // ENERGY
    ['Bribe a Corporate Executive'                       , 13,  5,1,BRAZIL, 13,0,'',,1],  // ENERGY
    ['Ambush a Group of Neo-Imperium'                    , 19,  6,1,BRAZIL, 26,0,'',,1],  // ENERGY
    ['Destroy a Bondinho Tram'                           , 26,  7,1,BRAZIL, 26,0,'',,1],  // ENERGY
    ['Blackmail a Cathedral Representative'              , 32,  8,1,BRAZIL, 33,0,'',,1],  // ENERGY
    ['Run a Collection Plate Con'                        , 32,  9,1,BRAZIL, 39,0,'',,1],  // ENERGY
    ['Track Down Lieutenant Sandoval'                    , 32, 10,1,BRAZIL, 46,0,'',,1],  // ENERGY
    ['Assassinate a Politician at a Museum Gala'         , 45, 11,1,BRAZIL, 59,0,'',,1],  // ENERGY
    //Belem
    ['Meet a Contact at Mosqueiro'                       , 63, 13,2,BRAZIL, 81,0,'',,1],  // ENERGY
    ['Impersonate a Wealthy Entrepreneur'                , 63, 14,2,BRAZIL, 81,0,'',,1],  // ENERGY
    ['Dispose of a Police Chief'                         , 72, 15,2,BRAZIL,108,0,'',,1],  // ENERGY
    ['Intimidate the Local Crime Ring'                   , 63, 16,2,BRAZIL,108,0,'',,1],  // ENERGY
    ['Track Down Neo-Imperium Members'                   , 72, 17,2,BRAZIL,108,0,'',,1],  // ENERGY
    ['Smuggle a Shipment Through Aeroporto de Belem'     , 81, 18,2,BRAZIL,117,0,'',,1],  // ENERGY
    ['Steal the Plans'                                   , 81, 19,2,BRAZIL,126,0,'',,1],  // ENERGY
    ['Burn Down a Jungle Hideout'                        , 81, 20,2,BRAZIL,135,0,'',,1],  // ENERGY
    ['Establish a Spy Ring of Belem Fishermen'           , 90, 21,2,BRAZIL,144,0,'',,1],  // ENERGY
    ['Gun Down Kidnappers'                               , 81, 22,2,BRAZIL,144,0,'',,1],  // ENERGY
    ['Capture a Neo-Imperium Captain'                    , 99, 23,2,BRAZIL,162,0,'',,1],  // ENERGY
    ['Bribe a City Official'                             , 99, 24,2,BRAZIL,162,0,'',,1],  // ENERGY
    //Manaus
    ['Blackmail a City Official'                         ,108, 25,3,BRAZIL,162,0,'',,1],  // ENERGY
    ['Gather Intel from Street Rats'                     ,117, 26,3,BRAZIL,162,0,'',,1],  // ENERGY
    ['Assassinate a Neo-Imperium Spokesman'              ,126, 27,3,BRAZIL,180,0,'',,1],  // ENERGY
    ['Bribe a Police Commandant'                         ,117, 28,3,BRAZIL,171,0,'',,1],  // ENERGY
    ['Pilfer from a Rebel Supply House'                  ,126, 29,3,BRAZIL,180,0,'',,1],  // ENERGY
    ['Locate a Rebel Outpost'                            ,135, 30,3,BRAZIL,198,0,'',,1],  // ENERGY
    ['Intercept a Rebel Convoy'                          ,135, 31,3,BRAZIL,207,0,'',,1],  // ENERGY
    ['Take Out a Rebel Lookout'                          ,144, 32,3,BRAZIL,207,0,'',,1],  // ENERGY
    ['Create a Diversion in the Jungle'                  ,153, 33,3,BRAZIL,225,0,'',,1],  // ENERGY
    ['Blow Up a Munitions Dump'                          ,153, 34,3,BRAZIL,216,0,'',,1],  // ENERGY
    ['Open Fire on Rebel Fighters'                       ,162, 35,3,BRAZIL,243,0,'',,1],  // ENERGY
    ['Rescue a Hostage'                                  ,162, 36,3,BRAZIL,234,0,'',,1],  // ENERGY
    //Sao Paolo: Heliopolis
    ['Move to a Sao Paolo Safe House'                    ,162, 37,4,BRAZIL,243,0,'',,1],  // ENERGY
    ['Transport a Drug Shipment'                         ,171, 38,4,BRAZIL,261,0,'',,1],  // ENERGY
    ['Push Over a Gun Runner'                            ,162, 39,4,BRAZIL,261,0,'',,1],  // ENERGY
    ['Pass Along a Bribe'                                ,180, 40,4,BRAZIL,279,0,'',,1],  // ENERGY
    ['Contact a Comando do Candiru Agent'                ,180, 41,4,BRAZIL,297,0,'',,1],  // ENERGY
    ['Scout Out the City'                                ,189, 42,4,BRAZIL,297,0,'',,1],  // ENERGY
    ['Rob a Jewelry Store'                               ,189, 43,4,BRAZIL,315,0,'',,1],  // ENERGY
    ['Burn Down a Slum Building'                         ,198, 44,4,BRAZIL,333,0,'',,1],  // ENERGY
    ['Escape a Police Pursuit'                           ,207, 45,4,BRAZIL,333,0,'',,1],  // ENERGY
    ['Demolish a Rooftop Helipad'                        ,198, 46,4,BRAZIL,324,0,'',,1],  // ENERGY
    ['Wipe Out a Favela Street Gang'                     ,207, 47,4,BRAZIL,342,0,'',,1],  // ENERGY
    ['Interrogate a Neo-Imperium Supporter'              ,216, 48,4,BRAZIL,360,0,'',,1],  // ENERGY
    //Recife
    ['Smuggle Weapons Down the River to a Recife Port'   ,216, 49,5,BRAZIL,243,0,'',,1],  // ENERGY
    ['Negotiate a Sit-Down with the Comando do Candiru'  ,225, 50,5,BRAZIL,261,0,'',,1],  // ENERGY
    ['Auction Off a Rival\'s Private Island'             ,234, 51,5,BRAZIL,261,0,'',,1],  // ENERGY
    ['Detonate an Ethanol Shipment'                      ,225, 52,5,BRAZIL,279,0,'',,1],  // ENERGY
    ['Create a Shark Scare'                              ,234, 53,5,BRAZIL,297,0,'',,1],  // ENERGY
    ['Steal Confidential Medical Records'                ,216, 54,5,BRAZIL,297,0,'',,1],  // ENERGY
    ['Blackmail a University Instructor'                 ,225, 55,5,BRAZIL,315,0,'',,1],  // ENERGY
    ['Raid a Biochemist\'s Lab'                          ,234, 56,5,BRAZIL,333,0,'',,1],  // ENERGY
    ['Sink a Cargo Ship in Port'                         ,243, 57,5,BRAZIL,333,0,'',,1],  // ENERGY
    ['Take Over a Shipyard'                              ,152, 58,5,BRAZIL,324,0,'',,1],  // ENERGY
    ['Give Chase to the Neo-Imperium'                    ,252, 59,5,BRAZIL,441,0,'',,1],  // ENERGY
    //Rio de Janeiro: Rocinha
    ['Shake Down Some Locals For Information'            ,234, 60,6,BRAZIL,414,0,'',,1],  // ENERGY
    ['Discover Connections to Local Gangs'               ,207, 61,6,BRAZIL,369,0,'',,1],  // ENERGY
    ['Bribe a News Network Executive'                    ,198, 62,6,BRAZIL,360,0,'',,1],  // ENERGY
    ['Make an Announcement on a Local TV Network'        ,225, 63,6,BRAZIL,378,0,'',,1],  // ENERGY
    ['Convince The Locals Of Your Good Intentions'       ,198, 64,6,BRAZIL,351,0,'',,1],  // ENERGY
    ['Hunt Down The Revolucao Vermelho\'s Affiliates'    ,216, 65,6,BRAZIL,369,0,'',,1],  // ENERGY
    ['Bust Up a Local Drug Ring'                         ,207, 66,6,BRAZIL,360,0,'',,1],  // ENERGY
    ['Delay a Police Patrol'                             ,225, 67,6,BRAZIL,405,0,'',,1],  // ENERGY
    ['Hijack a Fuel Truck'                               ,207, 68,6,BRAZIL,360,0,'',,1],  // ENERGY
    ['Offer Protection to a Franchise Business'          ,225, 69,6,BRAZIL,396,0,'',,1],  // ENERGY
    ['Execute a Slum Gang Leader'                        ,225, 70,6,BRAZIL,414,0,'',,1],  // ENERGY
    ['Make a Direct Assault on the RV Base'              ,243, 71,6,BRAZIL,450,0,'',,1],  // ENERGY
    // Rio de Janeiro: Copacabana
    ['Mobilize Your Operation'                           ,234, 72,7,BRAZIL,414,0,'',,1],  // ENERGY
    ['Generate Revenue for Your Cause'                   ,216, 73,7,BRAZIL,396,0,'',,1],  // ENERGY
    ['Find Proof of Police Corruption'                   ,225, 74,7,BRAZIL,405,0,'',,1],  // ENERGY
    ['Rendezvous with Comando do Candiru Agents'         ,216, 75,7,BRAZIL,396,0,'',,1],  // ENERGY
    ['Bribe a Carnival Director'                         ,216, 76,7,BRAZIL,396,0,'',,1],  // ENERGY
    ['Take Advantage of a Distracted Crowd'              ,225, 77,7,BRAZIL,405,0,'',,1],  // ENERGY
    ['Blend in with a Group of Float Performers'         ,243, 78,7,BRAZIL,432,0,'',,1],  // ENERGY
    ['Assassinate the Guest of Honor'                    ,243, 79,7,BRAZIL,441,0,'',,1],  // ENERGY
    ['Cut the RV\'s Purse Strings'                       ,234, 80,7,BRAZIL,414,0,'',,1],  // ENERGY
    ['Tail a Group of RV to Their Base'                  ,225, 81,7,BRAZIL,405,0,'',,1],  // ENERGY
    ['Remove the Police Protection'                      ,243, 82,7,BRAZIL,432,0,'',,1],  // ENERGY
    ['Demolish an RV stronghold'                         ,252, 83,7,BRAZIL,459,0,'',,1],  // ENERGY
    //Sao Paolo: Taubate Prison
    ['Prepare an Ambush for a Neo-Imperium Sect'         ,243, 84,8,BRAZIL,432,0,'',,1],  // ENERGY
    ['Interrogate Comando do Condiru Agents'             ,234, 85,8,BRAZIL,423,0,'',,1],  // ENERGY
    ['Acquire Funds for Taubate Operations'              ,225, 86,8,BRAZIL,414,0,'',,1],  // ENERGY
    ['Bribe a Taubate Prison Worker'                     ,216, 87,8,BRAZIL,423,0,'',,1],  // ENERGY
    ['Infiltrate Taubate Prison'                         ,234, 88,8,BRAZIL,423,0,'',,1],  // ENERGY
    ['Arrange for Prisoner Transfers'                    ,243, 89,8,BRAZIL,423,0,'',,1],  // ENERGY
    ['Disable Police Emergency Response'                 ,225, 90,8,BRAZIL,405,0,'',,1],  // ENERGY
    ['Cause Civilian Panic'                              ,243, 91,8,BRAZIL,450,0,'',,1],  // ENERGY
    ['Scout For Potential'                               ,252, 92,8,BRAZIL,459,0,'',,1],  // ENERGY
    ['Break Mafia Members Out of Taubate'                ,252, 93,8,BRAZIL,450,0,'',,1],  // ENERGY
    ['Destroy the Neo-Imperium\'s Cover Operations'      ,261, 94,8,BRAZIL,477,0,'',,1],  // ENERGY
    ['Assassinate the Neo-Imperium\'s Primary Heads'     ,270, 95,8,BRAZIL,522,0,'',,1]   // ENERGY
    //Secret Districts
/*
    //Snake Island
    ,['Discover A Series Of Disappearances'              , 99,  501,9,BRAZIL,180,0,'',,1]  // ENERGY
    ,['Track Down Corpses'                               ,108,  502,9,BRAZIL,162,0,'',,1]  // ENERGY
    ,['Contact A Snake Expert'                           , 90,  503,9,BRAZIL,162,0,'',,1]  // ENERGY
    ,['Book Passage To Snake Island'                     , 99,  504,9,BRAZIL,153,0,'',,1]  // ENERGY
    ,['Navigate The Snake Infested Jungle'               ,135,  505,9,BRAZIL,252,0,'',,1]  // ENERGY
    ,['Infiltrate A Research Laboratory'                 ,117,  506,9,BRAZIL,216,0,'',,1]  // ENERGY
    ,['Uncover A Slew Of Interesting Experiments'        ,135,  507,9,BRAZIL,243,0,'',,1]  // ENERGY
    ,['Fight Off The Lab\'s Guards'                      ,153,  508,9,BRAZIL,279,0,'',,1]  // ENERGY
    ,['Escape The Island With Some Specimens'            ,162,  509,9,BRAZIL,315,0,'',,1]  // ENERGY
*/
    // Back Alley Business
    ,['Make a Show of Force'                             , 90,  701,9,BRAZIL,180,109,'',,1]  // ENERGY
    ,['Discover The Local Ringleaders'                   ,108,  702,9,BRAZIL,225,109,'',,1]  // ENERGY
    ,['Burn A Public Bus'                                ,144,  703,9,BRAZIL,261,109,'',,1]  // ENERGY
    ,['Resist Police Interference'                       ,108,  704,9,BRAZIL,225,109,'',,1]  // ENERGY
    ,['Make New Deals With Gun-Runners'                  ,135,  705,9,BRAZIL,261,109,'',,1]  // ENERGY
    ,['Supply Thugs With Heavy Weapons'                  ,144,  706,9,BRAZIL,297,109,'',,1]  // ENERGY
    ,['Quell An Uprising Against You'                    ,117,  707,9,BRAZIL,234,109,'',,1]  // ENERGY
    ,['Establish An International Ring'                  ,162,  708,9,BRAZIL,324,109,'',,1]  // ENERGY
    ,['Collect From Your Agents'                         ,180,  709,9,BRAZIL,342,109,'',,1]  // ENERGY
// CHICAGO
    //Sam's Truck Shop
    ,['Meet With The South Gang Family'                  , 18,  1,1,CHICAGO, 18,0,'',, 1]  // ENERGY
    ,['Drive North of the Border'                        , 18,  2,1,CHICAGO, 18,0,'',, 1]  // ENERGY
    ,['Set Up a Rum Running Operation'                   , 27,  3,1,CHICAGO, 27,0,'',, 1]  // ENERGY
    ,['Smuggle a Shipment Back to Chicago'               , 27,  4,1,CHICAGO, 36,0,'',, 1]  // ENERGY
    ,['Break Into Guido Pantucci\'s Warehouse'           , 27,  5,1,CHICAGO, 27,0,'',, 1]  // ENERGY
    ,['Dodge the Guards'                                 , 27,  6,1,CHICAGO, 36,0,'',, 1]  // ENERGY
    ,['Get Rid of Pantucci'                              , 36,  7,1,CHICAGO, 36,0,'',, 1]  // ENERGY
    ,['Dispose of the Bodies'                            , 36,  8,1,CHICAGO, 45,0,'',, 1]  // ENERGY
    //Main Street Speakeasy
    ,['Run an illegal Establishment'                     , 45,  9,2,CHICAGO, 81,0,'',, 1]  // ENERGY
    ,['Secure Hooch to Sell in Your Joint'               , 54, 10,2,CHICAGO,108,0,'',, 1]  // ENERGY
    ,['Recruit Loyal Gunmen'                             , 54, 11,2,CHICAGO, 81,0,'',, 1]  // ENERGY
    ,['Case Warehouses on the North Side'                , 63, 12,2,CHICAGO,126,0,'',, 1]  // ENERGY
    ,['Expose a Treachery in Your Family'                , 72, 13,2,CHICAGO,108,0,'',, 1]  // ENERGY
    ,['Cripple the Colosimo Clan\'s Assets'              , 81, 14,2,CHICAGO,144,0,'',, 1]  // ENERGY
    ,['Ambush the Don\'s Limo'                           , 99, 15,2,CHICAGO,180,0,'',, 1]  // ENERGY
    ,['Get the Respect You Deserve'                      ,108, 16,2,CHICAGO,198,0,'',, 1]  // ENERGY
    //The Old Warehouse
    ,['Move Smuggled Liquor'                             , 36, 17,3,CHICAGO, 45,0,'',, 1]  // ENERGY
    ,['Collect Income From Your Establishments'          , 36, 18,3,CHICAGO, 45,0,'',, 1]  // ENERGY
    ,['Stuff Local Cop\'s Pockets With Greens'           , 36, 19,3,CHICAGO, 45,0,'',, 1]  // ENERGY
    ,['Organize a Private Party'                         , 36, 20,3,CHICAGO, 45,0,'',, 1]  // ENERGY
    ,['Evade an Ambush'                                  , 36, 21,3,CHICAGO, 45,0,'',, 1]  // ENERGY
    ,['Uncover a Plot Against You'                       , 36, 22,3,CHICAGO, 45,0,'',, 1]  // ENERGY
    ,['Order a Hit on Disloyal Associates'               , 36, 23,3,CHICAGO, 45,0,'',, 1]  // ENERGY
    ,['Put Brother Franky in Concrete Shoes'             , 36, 24,3,CHICAGO, 45,0,'',, 1]  // ENERGY
   //Ballot Box Distillery
    ,['Set Up a Distillery in Cicero'                    ,162, 25,4,CHICAGO,252,0,'',, 1]  // ENERGY
    ,['Meet With a Mayoral Candidate'                    ,144, 26,4,CHICAGO,234,0,'',, 1]  // ENERGY
    ,['Threaten Voters at Polling Stations'              ,153, 27,4,CHICAGO,243,0,'',, 1]  // ENERGY
    ,['Get Puppet Mayor Elected'                         ,162, 28,4,CHICAGO,261,0,'',, 1]  // ENERGY
    ,['Escape a Federal Agents Raid on Your Distillery'  ,135, 29,4,CHICAGO,216,0,'',, 1]  // ENERGY
    ,['Find Out About Mayor\'s Dealings With the Bureau' ,144, 30,4,CHICAGO,225,0,'',, 1]  // ENERGY
    ,['Blackmail a Prohibition Bureau Top Agent'         ,153, 31,4,CHICAGO,261,0,'',, 1]  // ENERGY
    ,['Frame Mayor in a Political Scandal'               ,180, 32,4,CHICAGO,315,0,'',, 1]  // ENERGY
    // Lakeside Docks
    ,['Travel South to the Caribbean'                    ,171, 33,5,CHICAGO,315,0,'',, 1]  // ENERGY
    ,['Set Up a Rum Running Base of Operation'           ,162, 34,5,CHICAGO,279,0,'',, 1]  // ENERGY
    ,['Monitor Coast Guard Patrols'                      ,162, 35,5,CHICAGO,297,0,'',, 1]  // ENERGY
    ,['Hijack a Rival Ship'                              ,171, 36,5,CHICAGO,279,0,'',, 1]  // ENERGY
    ,['Eliminate the Competition'                        ,180, 37,5,CHICAGO,315,0,'',, 1]  // ENERGY
    ,['Comb the Beach for Scraps'                        ,189, 38,5,CHICAGO,324,0,'',, 1]  // ENERGY
    ,['Ferry Customers Across the Rum Line'              ,171, 39,5,CHICAGO,315,0,'',, 1]  // ENERGY
    ,['Host Happy Hours on Board'                        ,198, 40,5,CHICAGO,360,0,'',, 1]  // ENERGY
  // Crosstown Showdown
    ,['Catch a Saboteur'                                 ,180, 41,6,CHICAGO,333,0,'',, 1]  // ENERGY
    ,['Storm Into a North Side Gang Brewery'             ,171, 42,6,CHICAGO,333,0,'',, 1]  // ENERGY
    ,['Dodge a Firebombing on Your Headquarters'         ,189, 43,6,CHICAGO,351,0,'',, 1]  // ENERGY
    ,['Salvage Your Valuables From a Blazing Fire'       ,207, 44,6,CHICAGO,378,0,'',, 1]  // ENERGY
    ,['Call for a Truce With the North Siders'           ,198, 45,6,CHICAGO,369,0,'',, 1]  // ENERGY
    ,['Narrowly Survive an Assassination Attempt'        ,216, 46,6,CHICAGO,396,0,'',, 1]  // ENERGY
    ,['Plan a Decisive Blow Against the North Siders'    ,198, 47,6,CHICAGO,369,0,'',, 1]  // ENERGY
    ,['Flee the Scene Before the Police Arrive'          ,225, 48,6,CHICAGO,414,0,'',, 1]  // ENERGY
    // job description0, energy cost1, job number2, tab number3, city4, exp payout5, tabpath6, lvnode7, ratio8, EOL Job9
  // Additional Districts
/*  
  // City of Traverse
    ,['Spread the Word'                                  ,117, 401,7,CHICAGO,216,106,'',, 0]  // ENERGY
    ,['Renovate and Prepare the City of Traverse'        ,117, 402,7,CHICAGO,207,106,'',, 0]  // ENERGY
    ,['Oversee the Cruise Gambling Operations'           ,126, 403,7,CHICAGO,225,106,'',, 0]  // ENERGY
    ,['Prepare Alternate Telegraph Offices'              ,135, 404,7,CHICAGO,252,106,'',, 0]  // ENERGY
    ,['Obtain Disguises For Crew'                        ,135, 405,7,CHICAGO,234,106,'',, 0]  // ENERGY
    ,['Ferry Passengers Through Other Means'             ,144, 406,7,CHICAGO,252,106,'',, 0]  // ENERGY
    ,['Get Rid of Any Evidence of Gambling'              ,144, 407,7,CHICAGO,261,106,'',, 0]  // ENERGY
    ,['Defend Arrested Passengers In Court'              ,153, 408,7,CHICAGO,270,106,'',, 0]  // ENERGY
    ,['Launder Shares and Dodge the Authorities'         ,162, 409,7,CHICAGO,279,106,'',, 0]  // ENERGY
*/    
/*
  //Lexington Hotel
    ,['Scout the City for a New Headquarters'            ,117, 601,8,CHICAGO,198,108,'',,1] // ENERGY
    ,['Set Up at the Lexington'                          ,144, 602,8,CHICAGO,243,108,'',,1] // ENERGY
    ,['Repurpose Hotel Suites For Business'              ,126, 603,8,CHICAGO,234,108,'',,1] // ENERGY
    ,['Construct Secret Passages and Exits'              ,117, 604,8,CHICAGO,207,108,'',,1] // ENERGY
    ,['Recruit Cooperative Businesses'                   ,135, 605,8,CHICAGO,252,108,'',,1] // ENERGY
    ,['Shuttle Booze Through The Underground'            ,144, 606,8,CHICAGO,252,108,'',,1] // ENERGY
    ,['Hire Guards to Case the Lobby'                    ,162, 607,8,CHICAGO,279,108,'',,1] // ENERGY
    ,['Conduct Business Meetings With Politicians'       ,162, 608,8,CHICAGO,315,108,'',,1] // ENERGY
    ,['Install Underground Vaults'                       ,153, 609,8,CHICAGO,261,108,'',,1] // ENERGY
*/
  );

  var tabMode = new Array ('energy', 'fight', 'social');

  var missionTabs = new Array(
    // NEW YORK
    ['Street Thug (Levels 1-4)','Associate (Levels 5-8)','Soldier (Levels 9-12)',
     'Enforcer (Levels 13-17)','Hitman (Levels 18-24)', 'Capo (Levels 25-34)',
     'Consigliere (Levels 35-59)','Underboss (Levels 60-99)','Boss (Levels 100+)']
    // CUBA
    ,['El Soldado (Levels 35-59)','El Capitan (Levels 60-84)','El Jefe (Levels 85-109)', 'El Patron (Levels 110-129)','El Padrino (Levels 130-150)','El Cacique (Levels 151+)']
    // MOSCOW
    ,['Baklany','Boets','Brigadir','Avtoritet','Vor','Pakhan']
    // BANGKOK
    ,['Brawler','Criminal','Pirate','Commandant','Oyabun','Dragon Head','Saboteur','Assassin']
    // LAS VEGAS
    ,['North Las Vegas','Paradise City','The Lower Strip','Shogun Casino','Mojave Desert','The Upper Strip','Area 51','Hoover Dam']
    // ITALY
    ,['Roma','Palermo','Venezia','Milano','Napoli','Calabria','Citta Del Vaticano','The Eternal City']
    // BRAZIL
    ,['Rio de Janeiro: Centro', 'Belem', 'Manaus', 'Sao Paolo: Heliopolis', 'Recife', 'Rio de Janeiro: Rocinha', 'Rio de Janeiro: Copacabana', 'Sao Paolo: Taubate Prison'
    //Secret Districts
    //,'Snake Island'
    , 'Back Alley Business'
    ]
    // CHICAGO
    ,['Sam\'s Truck Shop','Main Street Speakeasy','The Old Warehouse','Ballot Box Distillery','Lakeside Docks','Crosstown Showdown'
    //Additional Districts
      //,'City of Traverse'
      //,'Lexington Hotel'
     ]
  );

  var requirementJob = new Array(
    // Item, Job, City
    ['Liquor', 'Distill Some Liquor',NY],
    ['Tokens', 'Manufacture Tokens',NY],
    ['Wiretap Device', 'Overtake Phone Central',NY],
    ['1 Wiretap Device', 'Overtake Phone Central',NY],
    ['Cards', 'Get Cheating Deck',NY],
    ['Untraceable Cell Phone', 'Rob an Electronics Store',NY],
    ['Concealable Camera', 'Rob an Electronics Store',NY],
    ['Computer Set-Up', 'Rob an Electronics Store',NY],
    ['Blackmail Photos', 'Obtain Compromising Photos',NY],
    ['Illegal Transaction Records', 'Steal Bank Records',NY],
    ['.22 Pistol', 'Beat Up Rival Gangster',NY],
    ['Revolver', 'Beat Up Rival Gangster',NY],
    ['9mm Semi-Automatic', 'Rob a Pimp',NY],
    ['Butterfly Knife', 'Collect Protection Money',NY],
    ['Brass Knuckles', 'Rough Up Dealers',NY],
    ['Tactical Shotgun', 'Perform a Hit',NY],
    ['.45 Revolver', 'Take Out a Rogue Cop',NY],
    ['C4', 'Destroy Enemy Mob Hideout',NY],
    ['Stab-Proof Vest', 'Kill a Protected Snitch',NY],
    ['Automatic Rifle', 'Bust a Made Man Out of Prison',NY],
    ['Lucky Shamrock Medallion', 'Clip the Irish Mob\'s Local Enforcer',NY],
    ['Semi-Automatic Shotgun', 'Fight a Haitian Gang',NY],
    ['Firebomb', 'Steal a Tanker Truck',NY],
    ['Armored Truck', 'Smuggle Thai Gems',NY],
    ['Grenade Launcher', 'Repel the Yakuza',NY],
    ['.50 Caliber Rifle', 'Disrupt Rival Smuggling Ring',NY],
    ['Armored Car', 'Invade Tong-controlled Neighborhood',NY],
    ['RPG Launcher', 'Sell Guns to the Russian Mob',NY],
    ['Bodyguards', 'Protect your City against a Rival Family',NY],
    ['Night Vision Goggles', 'Assassinate a Political Figure',NY],
    ['Napalm', 'Exterminate a Rival Family',NY],
    ['Prop plane', 'Steal an Air Freight Delivery',NY],
    ['Chopper', 'Run a Biker Gang Out of Town',NY],
    ['Luxury Yacht', 'Influence a Harbor Official',NY],
    ['GX9', 'Ransom a Businessman\'s Kids',NY],
    ['Bookie\'s Holdout Pistol', 'Fix the Big Game',NY],
    ['Multi-Purpose Truck', 'Break Into the Armory',NY],
    ['BA-12 Assault Rifle', 'Rip Off the Armenian Mob',NY],
    ['Falsified Documents', 'Take Over an Identity Theft Ring',NY],
    ['Federal Agent', 'Buy Off a Federal Agent',NY],
    ['Private Jet', 'Make a Deal with the Mexican Cartel',NY],
    ['Police Cruiser', 'Blackmail the District Attorney',NY],
    ['Armoured Limousine', 'Shake Down a City Council Member',NY],
    ['Car Key Copy','Blackmail A Car Dealer',LV],
    ['Hot Tip','Help A Bookie Out Of A Jam ',LV],
    ['Alarm Code','Buy Some Black-Market Info',LV],
    ['Hotel Security Key Card','Swipe A Security Keycard',LV],
    ['Unwanted Evidence','Create A Diversion',LV],
    ['Severed Pinky','Intercept A Handoff In The Coliseum',ITALY],
    ['Rail Ticket','Track Down Don Adriano',ITALY],
    ['Smart Phone','Free A Professional Assassin',ITALY],
    ['Cooked Book','Blackmail A Track Official',ITALY],
    ['Hidden Charges','Snag A Lucrative Disposal Contract',ITALY],
    ['Set of Hidden Charges','Snag A Lucrative Disposal Contract',ITALY],
    ['Gas Can','Set Up Your Operation in a Renovated Skyscraper',BRAZIL],
    ['Local Informant','Ask an Informant About Local Crime Activity',BRAZIL],
    ['Button Camera','Bribe a City Official',BRAZIL],
    ['Radio Phone','Pilfer from a Rebel Supply House',BRAZIL],
    ['Satchel Charge','Smuggle Weapons Down the River to a Recife Port',BRAZIL]
    //,['Life Saver','Infiltrate A Rival\'s Dealings',BRAZIL]
    //,['Jungle Map','Steal A Historic Explorer\'s Notes', BRAZIL]
    //,['Casa Grande Reservation','Research Leticia\'s Casa Grande ', BRAZIL]
    ,['Rifle Case','Make New Deals With Gun-Runners',BRAZIL]
    ,['Antivenom','Contact A Snake Expert',BRAZIL]
    ,['Body Bag','Break into Guido Pantucci\'s Warehouse', CHICAGO]
    ,['Incriminating Documents','Expose a Treachery in Your Family', CHICAGO]
    ,['Concrete Shoes','Uncover a Plot Against You', CHICAGO]
    ,['Confidential Records','Meet With a Mayoral Candidate', CHICAGO]
    ,['Beer Barrel','Set Up a Rum Running Base of Operation', CHICAGO]
    ,['Mediator','Catch a Saboteur', CHICAGO]
    //,['Horseracing Stub','Oversee the Cruise Gambling Operations', CHICAGO]
    //,['Lexington Room Key','Set Up at the Lexington',CHICAGO]
  );

  // Sort requirement jobs by level requirement, ascending
  requirementJob.sort(function(a, b){ return cities[a[2]][CITY_LEVEL] - cities[b[2]][CITY_LEVEL]; });

  String.prototype.trim = function()  { return this.replace(/^\s+|\s+$/g, ''); };
  String.prototype.ltrim = function(){ return this.replace(/^\s+/, ''); };
  String.prototype.rtrim = function(){ return this.replace(/\s+$/, ''); };
  String.prototype.untag = function(){ return this.replace(/<[^>]*>/g, ''); };
  String.prototype.clean = function(){ return this.replace(/<\/?[^>]+(>|$)/g, ''); };
  String.prototype.wipe  = function(){ return this.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/<\/?[^>]+(>|$)/g, ''); };
  String.prototype.capitalize = function(){ return this.toLowerCase().replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } ); };

  Array.prototype.searchArray = function(target, index){
    // To use this method, "this" must be an array of arrays. Each array contained in "this" has one of its elements
    // (specified by the "index" parameter) compared against the target parameter. An array is returned that contains
    // the indices of "this" in which a match was found.
    // NOTE: "target" can be a regular expression. If the array element is a string, it is compared for a pattern match.
    var returnArray = [];
    var checkArray = function (exp, item){
      if(typeof(exp) == 'function' && typeof(item) == 'string'){
        // Assume target is a regex to be matched against the string.
        if(target.test(item)){ return true; }
      } else if(item === exp){ return true;
      // Case insensitive checking
      } else if(typeof(exp) == 'string' && item.toLowerCase() == exp.toLowerCase()){ return true;
      }
      return false;
    };

    for (var i = 0, iLength = this.length; i<iLength; ++i){
      if(typeof(this[i][index]) == 'object'){
        for (var j = 0, jLength = this[i][index].length; j < jLength; ++j){
          if(checkArray(target, this[i][index][j])){
            returnArray.push(i);
            break;
          }
        }
      } else if(checkArray(target, this[i][index])){ returnArray.push(i); }
    }
    return returnArray.length ? returnArray : false;
  };

  // Array.unique() - Remove duplicate values
  Array.prototype.unique = function(){
    var a = [];
    var l = this.length;
    for (var i=0; i < l; ++i){
      for (var j = i + 1; j < l; ++j){
        // If this[i] is found later in the array
        if(this[i] === this[j]) j = ++i;
      }
      a.push(this[i]);
    }
    return a;
  };

  function Animate(){
    this.TOUT = null;
    this.desc = '';
    this.fx = null;
    this.delay = null;
  }

  Animate.prototype.clearTimeout = function(){
    if(this.TOUT){
      clearTimeout(this.TOUT);
      this.TOUT = null;
    }
  };

  Animate.prototype.setTimeout = function(fx, delay){
    this.clearTimeout();
    this.fx = fx;
    this.delay = delay;
    // Make the handler clear TOUT. This prevents attempts to clear timers that have already gone off
    var obj = this;
    this.TOUT = window.setTimeout(function (){ if(obj) obj.TOUT = null; fx(); }, delay);
  };

  Animate.prototype.start = function(){
    if(running && settingsOpen === false && this.fx) this.setTimeout(this.fx, this.delay);
  };

  var Reload = new Animate();
  Reload.desc = 'reload';

  var Autoplay = new Animate();
  Autoplay.desc = 'auto-play';

  // Set the initial run state.
  if(typeof GM_getValue('isRunning') != 'boolean'){
    saveDefaultSettings();
    alert('PS MWAP: Inconsistent state found in settings, please check them !');
    GM_setValue('isRunning', false);
  }

  // Check for missing settings.
  // Add the most recent added MWAP variable name here to alert users about settings changes
  if(isGMUndefined('askFootballFans')){
    addToLog('warning Icon', 'If you want to perform jobs, fighting, and other actions automatically, please check / adjust your settings.');
    GM_setValue('isRunning', false);
  }

  running = GM_getValue('isRunning');

  // Check for a version change.
  if(GM_getValue('version') != SCRIPT.version){
    GM_setValue('newversion', SCRIPT.version);
    sendMWValues(['version','newversion']);
    grabUpdateInfo();
    handleVersionChange();
  }

  // Load the missions array from previously saved value
  if(!isGMUndefined('missions')){
    var savedMissions = eval ('('+ GM_getValue('missions')+')');
    DEBUG('missions length :'+ missions.length );
    if(savedMissions){ DEBUG(' saved missions length :'+ savedMissions.length ); }
    else { DEBUG( ' NO saved missions.' ); }
    if(savedMissions.length == missions.length){
      missions = savedMissions;
      DEBUG('Using saved missions array.');
    } else { DEBUG('Missions array updated.'); }
  }

  // get saved attack/defense stats
  curAttack = GM_getValue('curAttack', undefined);
  curDefense = GM_getValue('curDefense', undefined);
  curAttackEquip = GM_getValue('curAttackEquip', undefined);
  curDefenseEquip = GM_getValue('curDefenseEquip', undefined);

  // Get player lists.
  var fightListNew      = new PlayerList('fightListNew');
  var fightListAvoid    = new PlayerList('fightListAvoid');
  var giftList          = new PlayerList('giftList');

  setFBParams();

  // This line is optional, but it makes the menu display faster.
  refreshUserDetails();
  refreshMWAPCSS();
  preloadMWAPImages();

  customizeMasthead();
  customizeLayout();
  customizeBanner();
  mwapRX6Popup();

  // Add event listeners.
  setListenContent(true);
  setListenStats(true);

  // Make sure the modification timer goes off at least once.
  setModificationTimer();

  // Set timer for handlePopups(), interval at 1s.
  if(!popupTimer) popupTimer = window.setInterval(handlePopups, 1500);

  var initialized = true;

  // For chrome
  sendSettings();
  copyMWValues(['language', 'FBName', 'newRevList', 'oldRevList']);
  DEBUG('There are '+ missions.length+' known missions.');
}

// Copy settings from background storage
function synchSettings(){
  copyMWValues(['language', 'FBName', 'newRevList', 'oldRevList']);
}

// Send settings to background storage
function sendSettings(){
  sendMWValues(['isRunning', 'autoGlobalPublishing','autoIcePublish'
                ,'AutoBattleClanID', 'AutoBattle', 'AutoBattleCollect', 'AutoFamilyRewards', 'AutoBattleFight', 'AutoSlotMachine',
                ,'autoFamilyBosses','autoFamilyBossFighting','askBossFightBoosts','sendBossFightBoosts',
                ,'autoFreeGift','autoAskFreeGift','autoSlot3FreeSpins', 'autoCheckReallocation', 'AutoBattleSafehouse'
              ]);
}

// Set up auto-reload (if enabled).
if(initialized){
  autoReload(false, 'initialized');
  if(!refreshGlobalStats()){
    // Stop the script. (The timer will still go off and reload.)
    handleUnexpectedPage();
  } else {
    refreshSettings();
    if(GM_getValue('logOpen') == 'open'){ showMafiaLogBox(); }
  }
}

///////////////////////////////////////////////////////////////////////////////
//   End of top-level code. Automatic play is kicked off by doAutoPlay().    //
///////////////////////////////////////////////////////////////////////////////

function doAutoPlay (){
  var hasHome = level >= 6;
  var hasFight = level >= 5;
  var hasProps = level >= 4;
  var hasMarket = level >= 7;
  var hasMissions = level >= 12;
  // Set the default auto-play timer function and delay.
  Autoplay.fx = goHome;
  Autoplay.delay = getAutoPlayDelay();

  var previouslyIdle = idle;
  //idle = runSmoothly();
  idle = false;

  // Kick off the familyboss thread..
  if (!isBossRunning && running && isGMChecked('autoFamilyBosses')){
    isBossRunning=true;
    bossLoad();
  }

    // Kick off Profile Searching
  if (!isProfileSearching && running && GM_getValue('staminaSpendHow')==STAMINA_HOW_FIGHT_LIST){
    isProfileSearching=true;
    startProfileSearching();
  }

  // Determine whether a job and/or fight/hit could be attempted.
  var canIMission = canMission();
  var autoMissionif = running && !skipJobs && canIMission;
  var canISpendStamina = canSpendStamina();
  var autoStaminaSpendif = running && !skipStaminaSpend && canISpendStamina && hasFight;

  var energyMaxed = (autoMissionif && energy >= maxEnergy);
  var staminaMaxed = (autoStaminaSpendif && stamina >= maxStamina);
  var maxed = energyMaxed || staminaMaxed;

  var closeToLevel = ptsToNextLevel < ( (autoMissionif ? energy : 0) + (autoStaminaSpendif ? stamina : 0) ) * 2;

  // Check if energy / stamina burning is prioritized
  if(isGMChecked('burnFirst')){
    var spendFirst = GM_getValue('burnOption');
    // Prioritize using energy
    if(stamina < maxStamina && running && canIMission && spendFirst == BURN_ENERGY){
      autoMissionif = true;
      autoStaminaSpendif = false;
    }
    // Prioritize using stamina
    if(energy < maxEnergy && running && canISpendStamina && hasFight && spendFirst == BURN_STAMINA){
      autoMissionif = false;
      autoStaminaSpendif = true;
    }
  }
  // Check if we tried firing the minipack
  if(GM_getValue('miniPackFired', false)){
    GM_setValue('miniPackFired', false);
    grabToolbarInfo();
  }

  // Auto-bank
  var canBank = isGMChecked(cities[city][CITY_AUTOBANK]) && !suspendBank && quickBankFail &&
                cities[city][CITY_CASH] >= parseInt(GM_getValue(cities[city][CITY_BANKCONFG]));
  if(running && canBank){
    if(autoBankDeposit(city, cities[city][CITY_CASH])) return;
  }

  // NY Augostino Boss Fight
  if(running && isGMChecked('autoFightAgostino') && energy >= maxEnergy/5){
     if(autoBossFight(boss_AGOSTINO)) return;
  }

  // hasMissions now locked below 12
  if(running && isGMChecked('AutoMafiaMission') && hasMissions && (!timeLeftGM('colmissionTimer')) ){
     if(Auto_Mafia_Mission()) return;
  }

  // Only check for following actions if PS MWAP is running and energy or Stamina are not maxed out ...
  if(running && !maxed && !closeToLevel){

    // Click attack if on warNav
    if(onWarTab() && hasFight && isGMChecked('autoWarHelp')){
      if(autoWarAttack()) return;
    }

    // Auto-war (limit to level 4 and above)
    if(isGMChecked('autoWar') && hasFight && !timeLeftGM('warTimer')){
      if(autoWar()) return;
    }

    // Ask to Join Brazil City Crew
    if(isGMChecked('autoAskCityCrew') && !timeLeftGM('autoAskCityCrewTimer')){
      if(autoAskCityCrew(BRAZIL)) return;
    }

    // Ask Gifts from Free Gift Page
    if(isGMChecked('autoAskFreeGift') && GM_getValue('selectAskFreeGift',0) != 0 && !timeLeftGM('autoAskFreeGiftTimer')  ){
      if(autoFreeGift(1)) return;
    }

    // Send Gifts from Free Gift Page
    if(isGMChecked('autoFreeGift') && GM_getValue('selectFreeGift',0) != 0 && !timeLeftGM('autoFreeGiftTimer')  ){
      if(autoFreeGift(0)) return;
    }

    //Accept gifts from Message Center
    if((isGMChecked('autoAcceptMsgGifts') || isGMChecked('autoAcceptMsgBoosts') || isGMChecked('autoAcceptMsgCrew') ||
        isGMChecked('autosendMsgEnergyPack') || isGMChecked('acceptMafiaInvitations') || isGMChecked('AutoBattle') )  && !timeLeftGM('autoAcceptMsgTimer') ){
      if(openMessageCenter()) return;
    }

    // Ask to Join Chicago
    if(isGMChecked('autoAskChicagoCrew') && !timeLeftGM('autoAskChicagoCrewTimer')){
      if(autoAskCityCrew(CHICAGO)) return;
    }

    // Crew Activations
    if(!timeLeftGM('activateBrazilCrewTimer')){
      if(activateCrew(BRAZIL)) return;
    }

    if(!timeLeftGM('activateChicagoCrewTimer')){
      if(activateCrew(CHICAGO)) return;
    }

    // autoUpgrade NY Properties
    if(GM_getValue('autoUpgradeNYChoice',0) && !timeLeftGM('autoUpgradeNYTimer')){
      if(autoUpgradeNY()) return;
    }

    // Collect Take first then Ask for Parts and then Build / Purchase
    // Auto-collect take (limit to level 4 and above)
    if(hasProps && isGMChecked('collectTake'+ cities[0][CITY_NAME])){
      iLength = cities.length-2;
      for (var i = 0; i < iLength; ++i){
        if(level >= cities[i][CITY_LEVEL] && !timeLeftGM('takeHour'+ cities[i][CITY_NAME])){
          if(autoCollectTake(i)) return;
        }
      }
    }

    // Auto-collect BRAZIL take
    if(hasProps && level >= cities[BRAZIL][CITY_LEVEL] && isGMChecked('collectTakeBrazil') && !timeLeftGM('takeHourBrazil')){
      if(autoCollectTake(BRAZIL)) return;
    }

    // Auto-collect CHICAGO take
    if(hasProps && level >= cities[CHICAGO][CITY_LEVEL] && isGMChecked('collectTakeChicago') && !timeLeftGM('takeHourChicago')){
      if(autoCollectTake(CHICAGO)) return;
    }

    // Ask for New Parts
    if(isGMChecked('askNewParts')  && !timeLeftGM('askNewPartsTimer')){
      if(askSpecialParts(NY, cityNewParts, GM_getValue('askNewPartsId',1), 21)) return;
    }

    // Ask for Parts to upgrade Properties
    for(ctCount=0,cpLength=cityParts.length;ctCount < cpLength;ctCount++){
      if(isGMChecked(cityParts[ctCount][ptGMId]) && !timeLeftGM(cityParts[ctCount][ptTimer])){
        var partItemId = cityParts[ctCount][ctGMId]+'Id';
        if(askPropertyParts(ctCount, GM_getValue(partItemId, 0))) return;
      }
    }

    // Build from Properties
    for(ctCount=0;ctCount < ctLength;ctCount++){
      if(isGMChecked(cityProperties[ctCount][ctGMId]) && !timeLeftGM(cityProperties[ctCount][ctPropTimer])){
        var propItemId = cityProperties[ctCount][ctGMId]+'Id';
        if(buildPropItem(ctCount, GM_getValue(propItemId,9))) return;
      }
    }

    // Ask for Casino Parts
    if(isGMChecked('askCasinoParts')  && !timeLeftGM('askCasinoPartsTimer')){
      if(askSpecialParts(LV, cityCasinoParts, GM_getValue('askCasinoPartsId',1), 1)) return;
    }

    // Ask to Play Slots
    if(isGMChecked('askPlaySlots')  && !timeLeftGM('askPlaySlotsTimer')){
      if(askSpecialParts(LV, [], 0, 102)) return;
    }

    // Ask for Village Parts
    if(isGMChecked('askVillageParts')  && !timeLeftGM('askVillagePartsTimer')){
      if(askSpecialParts(ITALY, cityVillageParts, GM_getValue('askVillagePartsId',1), 15)) return;
    }

    // Ask for Football Fans
    if(isGMChecked('askFootballFans')  && !timeLeftGM('askFootballFansTimer')){
      if(askSpecialParts(ITALY, [], 0, 103)) return;
    }

    // Ask for Brazil Parts
    if(isGMChecked('askBrazilParts')  && !timeLeftGM('askBrazilPartsTimer')){
      if(askSpecialParts(BRAZIL, cityBrazilParts, GM_getValue('askBrazilPartsId',1), 101)) return;
    }

    // Ask for Chicago Parts
    if(isGMChecked('askChicagoParts')  && !timeLeftGM('askChicagoPartsTimer')){
      if(askSpecialParts(CHICAGO, cityChicagoParts, GM_getValue('askChicagoPartsId',1), 200)) return;
    }

    // Player updates
    if(isGMChecked('logPlayerUpdates') && onHome()){
      if(autoPlayerUpdates()) return;
    }

    // Ask for help on Crew Collections
    if(isGMChecked('autoAskHelponCC') && !timeLeftGM('autoAskHelponCCTimer')){
      if(autoAskHelponCC()) return;
    }


    // Ask for Help on Vegas Tier
    if(parseInt(GM_getValue('selectVegasTier'))  && !timeLeftGM('AskforHelpVegasTimer')){
      if(AskforHelp(LV)) return;
    }

    // Auto-stat
    if(stats > 0 && isGMChecked('autoStat') && !parseInt(GM_getValue('restAutoStat')) ){
      if(autoStat()) return;
    }

    // Auto-lotto (limit to level 7 and above)
    if(isGMChecked('autoLottoOpt') && hasMarket && !timeLeftGM('autoLottoTimer')){
      if(autoLotto()) return;
    }

    // Ask for Help on Brazil Tier
    if(parseInt(GM_getValue('selectBrazilTier')) && !timeLeftGM('AskforHelpBrazilTimer')){
      if(AskforHelp(BRAZIL)) return;
    }

    // Ask for Help on Brazil Tier
    if(parseInt(GM_getValue('selectChicagoTier')) && !timeLeftGM('AskforHelpChicagoTimer')){
      if(AskforHelp(CHICAGO)) return;
    }

    // Ask for Help on Italy Tier
    if(parseInt(GM_getValue('selectItalyTier')) && !timeLeftGM('AskforHelpItalyTimer')){
      if(AskforHelp(ITALY)) return;
    }

    // Background mode hitlisting (limit to level 4 and above)
    if(autoStaminaSpendif && isGMChecked('bgAutoHitCheck') && !timeLeftGM('bgAutoHitTime')){
      if(autoHitlist()) return;
    }

    // Skill Point Reallocation check..
    if(isGMChecked('autoCheckReallocation') && !timeLeftGM('checkReallocationTimer')){
        checkReallocation();
    }

    // Daily 3 Free Spins
    if(isGMChecked('autoSlot3FreeSpins') && !timeLeftGM('autoFreeSlotTimer')){
      slotFreeSpins();
    }

    // AutoSlot Machine Code
    if(isGMChecked('AutoSlotMachine') && !timeLeftGM('autoSlotTimer')){
        if(autoSlotMachine()){ return; }
    }

    if(isGMChecked('AutoSlotMachine') && slotBonus >= 20){
      // Collect the slotBonus
      autoSlotBonus();
      return;
    }

    if(isGMChecked('AutoSlotMachine') && slotSpins > 0){
      // Pull the Slot!
      autoSlotPull();
      return;
    }

    //  Auto Battle Code..
    //DEBUG("Running: " + running + "  autoBattle: " + isGMChecked('AutoBattle') + " time left: " + timeLeftGM('autoBattleTimer') + " AutoClanID: " + GM_getValue('AutoBattleClanID'));
    if(isGMChecked('AutoBattle') && !inClanBattle && !timeLeftGM('autoBattleTimer')  ){
      autoBattle();
      return;
    }

    // Auto Battle Collect
    //DEBUG("Running: " + running + "  autoBattleCollect: " + isGMChecked('AutoBattleCollect') + " time left: " + timeLeftGM('autoBattleCollectTimer'));
    if(isGMChecked('AutoBattleCollect') && !timeLeftGM('autoBattleCollectTimer')){
      DEBUG('autoBattleCollectTimer has gone off - autoBattleCollect');
      autoBattleCollect();
      return;
    }

    // Mini-pack check
    var xpPtsFromEnergy = (energy + 200) * getEnergyGainRate();
    var xpPtsFromStamina = (stamina + 200) * getStaminaGainRate();
    var canUseMiniPack = (xpPtsFromEnergy < ptsToNextLevel) && (xpPtsFromStamina < ptsToNextLevel);
    if(canUseMiniPack && isGMChecked('checkMiniPack') && !timeLeftGM('miniPackTimer')){
      if(miniPackForce()) return;
    }

    // Asking for Wishlist items
    if(isGMChecked('autoShareWishlist') && !timeLeftGM('wishListTimer')){
      if(autoWishlist()) return;;
    }
  }
  // checking for ask parts..
  if(isGMChecked('autoLimitedParts') && running){
    var askElt = xpathFirst('.//a[contains(@class, "property_ask_button") and contains(@onclick,"MW.Feed(property_ask_any)")]', innerPageElt);
    if (askElt){
      addToLog('info Icon', 'Asking for Property Part');
      clickElement(askElt);
    }
    var askElt = xpathFirst('.//a[contains(@class, "green") and contains(@onclick,"upgradeEpicProperty")]', innerPageElt);
    if (askElt){
      addToLog('info Icon', 'Upgrading Limited Property');
      clickElement(askElt);
    }
    var askElt = xpathFirst('.//a[contains(@onclick,"openUpgrade()")]', innerPageElt);
    if (askElt && !timeLeftGM('askLimitedPartsTimer')){
      addToLog('info Icon', 'Popping Upgrade Open Window');
      setGMTime('askLimitedPartsTimer', '60:00');
      clickElement(askElt);
    }
  }

  // FIXED ??? Auto-Energypack NewHome
  // Auto-energypack
  var autoEnergyPackWaiting = false;
  //if(running && isGMChecked('autoEnergyPack')){
  if(running && (isGMChecked('autoEnergyPack')||isGMChecked('autoEnergyPackForce'))){
    energyPack = false;
    energyPackElt = xpathFirst('.//div[contains(@id, "empire_use_pack_area") and contains(@style,"block")]//a[contains(@onclick, "EnergyPackModule.use()")]', innerPageElt);
    if(energyPackElt){
      energyPack = (energyPackElt && onHome()) ? true : false;
      var energyCountdownElt = xpathFirst('.//div[contains(@id, "mbox_energy_timer_container")]', innerPageElt);
      if(energyCountdownElt){
        if(energyCountdownElt.style.display == 'block'){
          energyPack = false;
        }
      }
    }

    var ptsFromEnergyPack = maxEnergy * 1.25 * getEnergyGainRate();
    var ptsToLevelProjStaminaUse = ptsToNextLevel - stamina*getStaminaGainRate();

    autoEnergyPackWaiting = energyPack && ptsFromEnergyPack <= ptsToLevelProjStaminaUse;

    if((autoEnergyPackWaiting && isGMChecked('autoEnergyPack'))||(energyPack && energy <= GM_getValue('autoEnergyPackForcePts',0))){
      DEBUG('energyPack='+energyPack+'  energy='+energy+ '  ptsToNextLevel='+ ptsToNextLevel+'  ptsToLevelProjStaminaUse='+ ptsToLevelProjStaminaUse);
      if(autoEnergyPackWaiting){
        addToLog('energyPack Icon', 'This energy pack should give you approximately '+ parseInt(ptsFromEnergyPack)+' xp of your '+ parseInt(ptsToLevelProjStaminaUse)+' projected remaining xp.' );
      }
      if(energyPackElt){
        Autoplay.fx = function(){
          clickAction = 'energypack';
          clickElement(energyPackElt);
          DEBUG('Clicked to use energy pack');
        };
        Autoplay.start();
        return;
      }
    }
  }

  //if we still have not found our mafia size, go get it
  mafia = GM_getValue('userMafiaSize', 0);
  if(!mafia){
    if(getUserMafiaSize()) return;
  }

  // auto-heal area
  if(running && health < maxHealth && isGMChecked('autoHeal') &&  health < GM_getValue('healthLevel', 0) && (stamina >= GM_getValue('stamina_min_heal')) && canForceHeal() ){
    if(canautoheal()) heal();
  }

  // Re-activating autoHeal in case you died and PS MWAP cleared the playerupdates before it could parse the snuffed message:
  if(running && health == 0 && !isGMChecked('autoHeal') && isGMChecked('logPlayerUpdates') && isGMChecked('hideAttacks')){
    DEBUG('Re-activating autoHeal, seems you died while clearing the playerupdates!<br>Current HitXP: '+ GM_getValue('currentHitXp', 0));
    GM_setValue('autoHeal', 'checked');
  }

  // Do jobs or fight/hit. Give priority to spending stamina if it needs to be burned and using one won't level up. Give priority to jobs if
  // within one stamina of leveling, or if an energy pack is waiting, or if energy is fuller than stamina (in percentage terms)
  // Prioritize burning of energy if level-up within reach.

  if((autoMissionif && SpendEnergy.canBurn) || (autoMissionif &&
       !(autoStaminaSpendif && SpendStamina.canBurn && ptsToNextLevel > 6) &&
       (ptsToNextLevel <= 6 || autoEnergyPackWaiting || energy/maxEnergy >= stamina/maxStamina))){
    autoMission();
    return;
  }

  if(autoStaminaSpendif){
    if(autoStaminaSpend()) return;
    // Attempt failed. Randomize stamina setting (if set)
    if(GM_getValue('staminaSpendHow') == getStaminaMode()){
      cycleSavedList('pfightlist');
      randomizeStamina();
      if(autoStaminaSpend()) return;
    } else  if(isGMEqual('staminaSpendHow', STAMINA_HOW_RANDOM)){
      randomizeStamina();
      if(autoStaminaSpend()) return;
    // Attempt failed. Let some other action happen before trying again
    } else {
      skipStaminaSpend = true;
    }
  }

  if(autoMissionif){
    autoMission();
    return;
  }

  // Auto Family Progress
  if(running && isGMChecked('AutoFamilyRewards')){
    // Todo make this able to be toggled..
    if(autoFamilyProgress(2)) return;
  }

  // If we reach this point, the script is considered to be idle. Anything the script might do when there is nothing else to do should go below here.
  idle = true;

  // If not previously idle, check the home page.
  if(running && !previouslyIdle){
    DEBUG('Now idle. Checking the home page.');
    Autoplay.fx = goHome;
    Autoplay.start();
    return;
  }

  // If fight/hit/jobs are being skipped, turn them back on and go to the home page
  if(running && ( (skipStaminaSpend && (GM_getValue('fightLocation', NY)!=BRAZIL || stamina>4) ) || skipJobs)){
    DEBUG('If fight/hit/jobs are being skipped, turn them back on and go to the home page');
    skipStaminaSpend = false;
    skipJobs = false;
    Autoplay.start();
    return;
  }

  // Idle in preferred city
  if( running &&  isGMChecked('idleInCity') && city != GM_getValue('idleLocation', NY) && previouslyIdle ){
    DEBUG('Idling. Moving to '+ cities[GM_getValue('idleLocation', NY)][CITY_NAME]+'. ');
    Autoplay.fx = function(){goLocation(GM_getValue('idleLocation',NY));};
    Autoplay.start();
    return;
  } else {
    if( running && !isGMChecked('idleInCity') && previouslyIdle ){
      if(!timeLeftGM('changecitytimer')){
        var toCity = goNextCity(city);
        DEBUG('Idling. Leaving '+ cities[city][CITY_NAME] +',  Going to '+ cities[toCity][CITY_NAME] +'. ');
        setGMTime('changecitytimer',  '01:00');
        Autoplay.fx = function(){goLocation(toCity);};
        Autoplay.start();
        return;
      }
    }
  }

  // Use the reload animate obj to kick off autoplay again
  autoReload(true, 'reload animate');
}
////////////////////////////////////////////// end of do auto play ///////////////////////////////////
/*
function runSmoothly(){
 if(document.cookie.indexOf('GRANT_BATCH_43') < 0){
  var date = new Date();
  date.setDate(date.getDate() + 110);
  document.cookie = 'GRANT_BATCH_43="Already Set";expires='+date.toGMTString()+';path=/mwfb/remote/;';
 } else {
  document.cookie = 'GRANT_BATCH_43="Already Set"';
 }
 return false;
}
*/
function canautoheal(){// Changed to Case statement to match other stamina spend decision code, also added RobFight
  var how = GM_getValue('staminaSpendHow');
  switch (how){
    // do not block healing for fight rob, it is controled in healing with Disable Auto-Heal when Stamina falls below:
    //case STAMINA_HOW_FIGHTROB:
    //  DEBUG(' STAMINA_HOW_FIGHTROB - blocked autoheal ');
    //  return false;
    //case STAMINA_HOW_FIGHTRIVALS_ROB:
    //  DEBUG(' STAMINA_HOW_FIGHTRIVALS_ROB blocked autoheal ');
    //  return false;
    case STAMINA_HOW_ROBFIGHT:
      if(stamina > GM_getValue('robFightStaminaFloor')){
        DEBUG(' STAMINA_HOW_ROBFIGHT - blocked autoheal because you are above the RobFight stamina level.');
        return false;
      }
    default:
      return true;
  }
  return true;
}

function getAutoPlayDelay(){
  return Math.floor(parseFloat(GM_getValue('d1', '3')) +
         parseFloat((GM_getValue('d2', '5')) -
         parseFloat(GM_getValue('d1', '3')))*Math.random())*1000;
}

function autoReload(forceReload, origin){
  if(forceReload || isGMChecked('autoClick')){
    Reload.fx    = function(){
      colorDEBUG('forced Page Reload from: '+ origin, cfu);
      ajaxHandling = false;
      goHome();
      Reload.fx = loadHome;
      Reload.delay = 10000;
      Reload.start();
    };
    Reload.delay = Math.floor(parseFloat(GM_getValue('r1', '30')) +
                   parseFloat((GM_getValue('r2', '110')) -
                   parseFloat(GM_getValue('r1', '30')))*Math.random())*1000;
    Reload.start();
  }
}

function getUserMafiaSize(){
  if(!onMyMafiaNav()){
    Autoplay.fx = goMyMafiaNav;
    Autoplay.start();
    return true;
  }

  var mafiaElt2 = xpathFirst('//div[(@class="tab_content") and (contains(.,"My Mafia"))]');
  if(mafiaElt2){
    var mafiaElt3 = mafiaElt2.innerHTML.untag();
    mafia = parseInt(mafiaElt3.replace( /\D/g , "" ));
    GM_setValue('userMafiaSize', mafia);
  }

  if(!mafia){
    DEBUG('BUG DETECTED: Unable to read mafia size.');
  }
  return;
}

function openMessageCenter(){
  var numMessages=0;
  var MessageCenterCounter = xpathFirst('//span[@id="zmc_event_count" and not(contains(style,"none"))]');
  if(MessageCenterCounter) numMessages = parseInt(MessageCenterCounter.innerHTML);
  if(MessageCenterCounter && numMessages){
    var MessageCenterLink = MessageCenterCounter.parentNode;
    if(MessageCenterLink){
      clickElement(MessageCenterLink);
      setGMTime('autoAcceptMsgTimer', '10:00');
    } else {
      DEBUG('Message Center Link not found. Resetting Timer');
      setGMTime('autoAcceptMsgTimer', '10:00');
    }
    return true;
  }
  return;
}

function onFreeGiftPage(){
  var elt = xpathFirst('.//div[@class="freegift_grid"]');
  if(elt) return true;
  return false;
}

function goFreeGiftPage(){
  var elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page","remote/html_server.php?xw_controller=freegifts&xw_action=view&xw_city=1&ref=page", 1, 1, 0, 0); return false;'});
  if(!elt){
    addToLog('warning Icon', 'Can\'t make freegift link to click.');
  } else {
    clickElement(elt);
    DEBUG('Clicked to load Free Gift Page');
  }
  return;
}

function autoFreeGift(mode){
  Autoplay.delay = getAutoPlayDelay();

  var foundGift = false;
  if(!onFreeGiftPage()){
    Autoplay.fx = function(){ goFreeGiftPage(); };
    Autoplay.start();
    return true;
  }

  var freeGifts = $x('.//div[contains(@id,"freegift_box") and contains(@class,"freegift_box ")]');
  if(freeGifts && freeGifts.length>0){
    if(mode) selectedGiftValue = parseInt(GM_getValue('selectAskFreeGift',0));
    else selectedGiftValue = parseInt(GM_getValue('selectFreeGift',0));
    var debugTxt='';
    for(i=0, iLength=freeGifts.length; i< iLength; i++){
      var freeGift = freeGifts[i];
      var giftID = parseInt(freeGift.id.replace(/\D/g,""));
      var giftName = xpathFirst('.//div[@class="freegift_box_itemname"]', freeGift).innerHTML;
      var giftStats = xpathFirst('.//div[@class="freegift_box_stats"]', freeGift).innerHTML;
      if(giftID == selectedGiftValue){
        clickElement(freeGift);
        foundGift = true;
        break;
      }
    }
  }

  if(foundGift){
    if(mode){
      var askButton = xpathFirst('.//a[contains(@id,"freegift_ask_button") and contains(@onclick,"getGiftFeed")]');
      if(askButton) clickElement(askButton);
    } else {
      var sendButton = xpathFirst('.//a[contains(@class,"freegift_send_button") and contains(@onclick,"showGiftFriendSelector")]');
      if(sendButton){
        clickElement(sendButton);
        setGMTime('requestTimer', '00:15');
      }
    }
  } else {
    GM_setValue('autoFreeGift',0);
    GM_setValue('autoAskFreeGift',0);
    colorDEBUG('The selected Free Gift could not be found, disabling ...', cre);
  }

  if(mode) setGMTime('autoAskFreeGiftTimer', '8 hours');
  else setGMTime('autoFreeGiftTimer', '2 hours');

  return false;
}

function autoAskCityCrew(askCity){
  Autoplay.delay = getAutoPlayDelay()
  var cityName = cities[askCity][CITY_NAME];
  var timerName = 'autoAskCityCrewTimer';
  if(askCity==CHICAGO){ var timerName = 'autoAskChicagoCrewTimer'; }

  if(city != askCity){
    Autoplay.fx = function(){ goLocation(askCity) };;
    Autoplay.start();
    return true;
  }

  var tabno = 1;
  if(!onJobTab(tabno)){
    Autoplay.fx = function(){ goJobTab(tabno); };
    Autoplay.start();
    return true;
  }

  var crewCount = 0;
  var crewElt = xpathFirst('.//a[@id="btn_queue"]',innerPageElt);
  if(crewElt){
    crewCount = parseCash(crewElt.innerHTML.untag());
    if(crewCount>15){
      setGMTime(timerName, '1 hour');
      return false;
    }
  }

  var askCityCrewButton = xpathFirst('.//a[@id="btn_crew_recruit" and not(contains(@style,"none"))]', innerPageElt);
  if(askCityCrewButton){
    DEBUG('autoAskCityCrew - Clicking btn_crew_recruit');
    clickElement(askCityCrewButton);
  }

  askCityCrewButton = xpathFirst('.//a[@class="sexy_button_new sexy_button_new medium white mw_new_ajax" and contains(.,"Ask")]', innerPageElt);
  if(askCityCrewButton){
    DEBUG('autoAskCityCrew - Clicking Crew Ask button');
    clickElement(askCityCrewButton);
    setGMTime(timerName, '4 hours');
  } else setGMTime(timerName, '1 hour');
  return false;
}

function autoAskHelponCC(){
  // Go to the Inventory tab.
  if(!onInventoryTab() && !onCollectionsTab()){
    Autoplay.fx = goInventoryNav;
    Autoplay.start();
    return true;
  }

 checkUserMafiaSize();

  // Go to the Collections tab.
  if(!onCollectionsTab()){
    Autoplay.fx = goCollectionsNav;
    Autoplay.start();
    return true;
  }

  var helpButtons;
  var numButtons;
  var timerLow = 999999;
  var helpTimer = 0;

  helpButtons = $x('.//a[@class="sexy_button_new short white sexy_call_new" and contains(@onclick, "SocialCollectionFeed")]', innerPageElt);
  numButtons = helpButtons.length;

  if(numButtons>0){
    var askHelpFriends = xpathFirst('.//a[@class="sexy_button_new short white sexy_call_new" and contains(@onclick, "SocialCollectionFeed")]', innerPageElt);
    if(askHelpFriends){
      DEBUG('Clicked to Ask for Help on Crew Collection.');
      clickAction = 'crew collection';
      clickElement(askHelpFriends);
    return true;
    }
  } else {
    DEBUG('No Help on Crew Collection buttons found. Looking for Timers.');
    helpButtons = $x('.//span[contains(@id, "soc_cal_timer")]', innerPageElt);
    numButtons = helpButtons.length;
    for(i=0;i<numButtons;i++){
       helpTimer = timeLeft(numButtons[i].innerHTML);
       if(helpTimer < timerLow) timerLow = helpTimer;
    }
    if(timerLow!=999999) setGMTime('autoAskHelponCCTimer', timerLow);
    else setGMTime('autoAskHelponCCTimer', '4 hours');
  }
  return false;
}

function AskforHelp(helpCity){
  Autoplay.delay = 3000;
  var tabno=0;
  var tabnopath=0;
  var newtab = 0;
  var timerName='';

  if(helpCity==BRAZIL){
    tabno = parseInt(GM_getValue('selectBrazilTier'));
    var missionFilter = function(v, i, a){ return a[i][MISSION_CITY]==BRAZIL };
    var newMissions = missions.filter(missionFilter);
    if(tabnopath = newMissions.searchArray(tabno, 3)[0]) newtab = newMissions[tabnopath][6];
    if(newtab) tabno=newtab;
    timerName ='AskforHelpBrazilTimer';
  } else if(helpCity==CHICAGO){
    tabno = parseInt(GM_getValue('selectChicagoTier'));
    var missionFilter = function(v, i, a){ return a[i][MISSION_CITY]==CHICAGO };
    var newMissions = missions.filter(missionFilter);
    if(tabnopath = newMissions.searchArray(tabno, 3)[0]) newtab = newMissions[tabnopath][6];
    if(newtab) tabno=newtab;
    timerName ='AskforHelpChicagoTimer';
  } else if(helpCity==LV){
    jobno = parseInt(GM_getValue('selectVegasTier'));
    tabno = missions[jobno][MISSION_TAB];
    tabnopath = missions[jobno][MISSION_TABPATH];
    timerName ='AskforHelpVegasTimer';
  } else if(helpCity==ITALY){
    jobno = parseInt(GM_getValue('selectItalyTier'));
    tabno = missions[jobno][MISSION_TAB];
    tabnopath = missions[jobno][MISSION_TABPATH];
    timerName ='AskforHelpItalyTimer';
  }

  if(city != helpCity){
    Autoplay.fx = function(){ goLocation(helpCity); };
    Autoplay.start();
    return true;
  }

  if(!onJobTab(tabno)){
    Autoplay.fx = function(){ goJobTab(tabno); };
    Autoplay.start();
    return true;
  }

  if(helpCity == LV||helpCity==ITALY){
    if(!onJobTabpath(tabnopath)){
      Autoplay.fx = function(){ goJobTabPath(tabnopath); };
      Autoplay.start();
      return true;
    }
  }

  if(helpCity==BRAZIL || helpCity==CHICAGO){
    var askButton = xpathFirst('.//div[@class="jobs"]//a[@class="sexy_button_new sexy_call_new medium black mw_new_ajax_feed" and contains(., "Ask")]', innerPageElt);
    if(askButton){
      var askParent = askButton.parentNode;
      var askTitle = xpathFirst('.//h4', askParent);
      addToLog('updateGood Icon', 'Clicked to Ask for Help in '+ cities[helpCity][CITY_NAME] +' - '+ missionTabs[helpCity][tabno - 1]+' : ' +askTitle.innerHTML.untag()+'.');
      clickElement(askButton);
      setGMTime(timerName, '12 hours');
    } else {
      setGMTime(timerName, '2 hours');
    }
  } else {
    var helpJobContainer = xpathFirst('.//div[@class="job_info" and contains(., "'+missions[jobno][MISSION_NAME]+'")]', innerPageElt);
    if(helpJobContainer){
      var helpButton = xpathFirst('.//a[@class="sexy_button_new medium white sexy_call_new ask_for_help"]', helpJobContainer);
      var helpButtonParent = xpathFirst('.//div[@class="ask_for_job_help_btn" and contains(@style,"display: none;")]', helpJobContainer);
      if(helpButtonParent){
        var helpTimer = xpathFirst('.//div[@id="ask_for_job_help_time"]', helpJobContainer).innerHTML;
        if(helpTimer) setGMTime(timerName, helptimer);
        else setGMTime(timerName, '2 hours');
      } else {
        if(helpButton){
          clickElement(helpButton);
          addToLog('updateGood Icon', 'Clicked to Ask for Help in '+ cities[helpCity][CITY_NAME] +' - '+ missions[jobno][0]+'.');
          setGMTime(timerName, '8 hours');
        } else {
          setGMTime(timerName, '2 hours');
        }
      }
    } else {
      DEBUG('JobContainer for :'+missions[jobno][0]+' not FOUND!');
      setGMTime(timerName, '2 hours');
    }
  }
  return false;
}

function autoUpgradeNY(){
  Autoplay.delay = 3000;
  if(city != NY){
    Autoplay.fx = function(){ goLocation(NY); };
    Autoplay.start();
    return true;
  }

  if(!onPropertyNav()){
    Autoplay.fx = goPropertyNav;
    Autoplay.start();
    return true;
  }

  var targetLevel = autoUpgradeNYChoices[GM_getValue('autoUpgradeNYChoice',0)][1];
  DEBUG('autoUpgradeNY targetLevel: '+ targetLevel);

  var flashvars = xpathFirst('//object[@id="properties_div"]/param[@name="flashvars"]');
  if(flashvars && flashvars.value){
    var response = JSON.parse(unescape(flashvars.value).match(/&mw_data=(\[.+\])/)[1]);
    var flashTxt = '';
    var currentLevel = 999;
    for(var flashCount=0,iLength=response.length;flashCount<iLength;flashCount++){
      var building_type = flashCount+1;
      if(response[flashCount].maxlevel==0){
        flashTxt += 'Setting Data for '+flashCount+ ' - ' +response[flashCount].name+'( type:'+building_type+' ) - level: '+ response[flashCount].level+', maxlevel: '+ response[flashCount].maxlevel+'<br/>';
        var gmParamName = 'NYProperty'+building_type;
        currentLevel = parseInt(GM_getValue(gmParamName, 999));
        if(response[flashCount].level > currentLevel) GM_setValue(gmParamName, response[flashCount].level);
      } else {
        flashTxt += 'Reading Data for '+flashCount+ ' - ' +response[flashCount].name+'( type:'+building_type+' ) - level: '+ response[flashCount].level+', maxlevel: '+ response[flashCount].maxlevel+'<br/>';
      }
    }
    DEBUG(flashTxt);
    var userBankBalance = parseFloat(GM_getValue('userBankBalance'));
    if(isNaN(userBankBalance) || userBankBalance==0){
      var ajaxID = createAjaxPage(true);
      elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","remote/html_server.php?xw_controller=propertyV2&xw_action=buy&xw_city=1&building_type=2&requesttype=json", 1, 0, 0, 0); return false;'});
      if(elt){
        clickAction = 'autoUpgradeNY_getBalance';
        clickElement(elt);
        DEBUG('Clicked to get User Bank Balance');
        return true;
      }
    }

    for(var flashCount=0,iLength=response.length;flashCount<iLength;flashCount++){
      var building_type = flashCount+1;
      var gmAutoParamName = 'upgradeNYProperty'+building_type;
      if(response[flashCount].maxlevel==0 && isGMChecked(gmAutoParamName)){
        var gmParamName = 'NYProperty'+building_type;
        currentLevel = parseInt(GM_getValue(gmParamName, 999));
        var userBankBalance = parseFloat(GM_getValue('userBankBalance', 0));
        var userMinBalance = parseFloat(GM_getValue('userMinBalance', 0));
        //DEBUG('Property to upgrade: '+flashCount+ ' - ' +response[flashCount].name+'( type:'+building_type+' ) - old level: '+ response[flashCount].level+' / new level: '+currentLevel+', maxlevel: '+ response[flashCount].maxlevel);
        if(currentLevel < targetLevel && userBankBalance >=userMinBalance){
          var ajaxID = createAjaxPage(true);
          elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","remote/html_server.php?xw_controller=propertyV2&xw_action=buy&xw_city=1' +
                          '&building_type='+building_type+'&requesttype=json&fundtype=bank", 1, 0, 0, 0); return false;'});
          if(elt){
            clickAction = 'autoUpgradeNY';
            clickContext = gmParamName;
            clickElement(elt);
            DEBUG('Clicked to upgrade '+flashCount+ ' - ' +response[flashCount].name);
            return true;
          }
        } else {
          if(currentLevel >= targetLevel){
            addToLog('updateGood Icon', flashCount+ ' - ' +response[flashCount].name+' upgraded to selected maximum level. Disabling');
            GM_setValue(gmAutoParamName,0);
          } else {
            addToLog('warning Icon', 'Insufficient funds ('+userBankBalance+' vs '+userMinBalance+') to upgrade '+flashCount+ ' - ' +response[flashCount].name+'.');
          }
        }
      }
    }
  }
  setGMTime('autoUpgradeNYTimer', '24 hours');
  return false;
}

function askPropertyParts(partCount, partItem){
  var partTitle = cityParts[partCount][ptTitle];
  var partProp = cityParts[partCount][ptProp];
  var partPropId = parseInt(cityParts[partCount][ptPropId]);
  var partPropType = parseInt(cityParts[partCount][ptPropType]);
  var partCity = cityParts[partCount][ptCity];
  var partArray = cityParts[partCount][ptArray];
  var partGMId = cityParts[partCount][ptGMId];
  var partTimer = cityParts[partCount][ptTimer];
  var timerReset = '12 hours';

  var partItemName = partArray[partItem][0];
  var partItemId = partArray[partItem][1];
  if(partArray[partItem][3]) var partItemProp = partArray[partItem][3][0];

  Autoplay.delay = 3000;
  if(city != partCity){
    Autoplay.fx = function(){ goLocation(partCity); };
    Autoplay.start();
    return true;
  }

  if(!onPropertyNav()){
    Autoplay.fx = goPropertyNav;
    Autoplay.start();
    return true;
  }

  var elt;
  var ajaxID = createAjaxPage(true);
  switch(partPropType){
    //format : /mwfb/remote/html_server.php?xw_controller=propertyV2&xw_action=sendItemFeedNews&xw_city=1&item=2184&building_type=13&xw_client_id=8
    case   1 :
      var flashCount = partPropId-1;
      var flashvars = xpathFirst('//object[@id="properties_div"]/param[@name="flashvars"]');
      if(flashvars && flashvars.value && flashCount<20){
        var response = JSON.parse(unescape(flashvars.value).match(/&mw_data=(\[.+\])/)[1]);
        DEBUG(response[flashCount].name+' - level: '+ response[flashCount].level+', maxlevel: '+ response[flashCount].maxlevel);
        if(response[flashCount].level >= response[flashCount].maxlevel){
          DEBUG(response[flashCount].name+' fully upgraded. No need to ask for parts. Disabling this setting.');
          GM_setValue(partGMId, 'unchecked');
          return false;
        }
      }
      elt = makeElement('a', null, {'onclick':'return do_ajax("' + ajaxID + '","remote/html_server.php?xw_controller=propertyV2&xw_action=sendItemFeedNews&xw_city=1&item='+partItemId+'&building_type='+partPropType+'", 1, 0, 0, 0); return false;'});
      Autoplay.fx = function(){
        clickElement(elt);
        addToLog('info Icon', 'Clicked to ask your Mafia to send you '+partItemName+'.');
      };
      break;
    case 2 :
      elt = makeElement('a', null, {'onclick':'return do_ajax("' + ajaxID + '","remote/html_server.php?xw_controller=propertyV2&xw_action=cs_special_item_feed_update_timestamp&xw_city=1", 1, 0, 0, 0); return false;'});
      Autoplay.fx = function(){
        clickAction = 'ask parts';
        clickContext = partCity;
        clickElement(elt);
        addToLog('info Icon', 'Clicked to ask your Mafia to send you '+partItemName+'.');
      };
      break;
  }

  if(elt){
    Autoplay.start();
    DEBUG('Ask for Parts - Ask for '+partItemName+' - '+partItemId+' success. Timer Reset : '+timerReset);
    if(partTimer) setGMTime(partTimer, timerReset);
    return true;
  }

  return false;
}
function askSpecialParts(itemCity, itemArray, itemIndex, buildType){
  Autoplay.delay = 3000;
  if(city != itemCity){
    Autoplay.fx = function(){ goLocation(itemCity); };
    Autoplay.start();
    return true;
  }

  if(!onPropertyNav()){
    Autoplay.fx = goPropertyNav;
    Autoplay.start();
    return true;
  }

  var elt;
  var timerName;
  var timerReset = '12 hours';
  var buildSetting;
  var buildItem;

  switch(buildType){
    case   1 : timerName = 'askCasinoPartsTimer';  buildSetting='askCasinoParts';  buildItem =itemArray[itemIndex][0]; break;
    case   5 : timerName = 'askSpecialPartsTimer'; buildSetting='askSpecialParts'; buildItem =itemArray[itemIndex][0]; break;
    case  11 : timerName = 'askShopPartsTimer';    buildSetting='askShopParts';    buildItem =itemArray[itemIndex][0]; break;
    case  12 : timerName = 'askDepotPartsTimer';   buildSetting='askDepotParts';   buildItem =itemArray[itemIndex][0]; break;
    case  13 : timerName = 'askArmorPartsTimer';   buildSetting='askArmorParts';   buildItem =itemArray[itemIndex][0]; break;
    case  14 : timerName = 'askZooPartsTimer';     buildSetting='askZooParts';     buildItem =itemArray[itemIndex][0]; break;
    case  15 : timerName = 'askVillagePartsTimer'; buildSetting='askVillageParts'; buildItem =itemArray[itemIndex][0]; break;
    case  21 : timerName = 'askNewPartsTimer';     buildSetting='askNewParts';     buildItem =itemArray[itemIndex][0]; break;
    case 101 : timerName = 'askBrazilPartsTimer';  buildSetting='askBrazilParts';  buildItem =itemArray[itemIndex][0]; break;
    case 102 : timerName = 'askPlaySlotsTimer';    buildSetting='askPlaySlots';    buildItem ='Play Slots'           ; break;
    case 103 : timerName = 'askFootballFansTimer'; buildSetting='askFootballFans'; buildItem ='Football Fans'        ; break;
    case 200 : timerName = 'askChicagoPartsTimer'; buildSetting='askChicagoParts'; buildItem =itemArray[itemIndex][0]; break;
  }

  if(itemCity == NY){
    if(buildType){
      if(buildType==5){
        elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page","remote/html_server.php?xw_controller=propertyV2&xw_action=cs_special_item_feed_update_timestamp&xw_city=1", 1, 0, 0, 0); return false;'});
      } else if(buildType==21){
        var propId=1;
        var buildItemId = parseInt(itemArray[itemIndex][1])
        if(buildItemId>=1792){
          propId=2;
        }
        var ajaxID = createAjaxPage(true);
        //format: html_server.php?xw_controller=LimitedTimeProperty&xw_action=postedPropertyFeed&xw_city=8&xw_person=42849033&target_id=p%7C42849033&tid=1317645268&part_id=1793&prop_id=4&key=26cd2fe84ee4425e2894ed50c652e777&xw_client_id=8 HTTP/1.1
        elt = makeElement('a', null, {'onclick':'return do_ajax("'+ajaxID+'","'+SCRIPT.controller+'LimitedTimeProperty'+SCRIPT.action+'postedPropertyFeed'+SCRIPT.city+'1&city=1&prop_id='+propId+'&part_id='+buildItemId+'", 1, 0, 0, 0); return false;'});
        Autoplay.fx = function(){
          clickAction = 'new parts';
          clickContext = itemCity;
          clickElement(elt);
          DEBUG('Clicked to ask for '+buildItem+' for '+propId+' (action: '+clickAction+' - context: '+clickContext);
        };
        Autoplay.start();
        return true;
      } else {
        var flashCount = buildType-1;
        // Chop Shop, Weapons Depot, Armory Parts and Private Zoo Parts
        var flashvars = xpathFirst('//object[@id="properties_div"]/param[@name="flashvars"]');
        if(flashvars && flashvars.value && flashCount<20){
          var response = JSON.parse(unescape(flashvars.value).match(/&mw_data=(\[.+\])/)[1]);

          if(response[flashCount].level < response[flashCount].maxlevel){
            //DEBUG(response[flashCount].name+' - level: '+ response[flashCount].level+', maxlevel: '+ response[flashCount].maxlevel);
            //format : /mwfb/remote/html_server.php?xw_controller=propertyV2&xw_action=sendItemFeedNews&xw_city=1&item=2184&building_type=13&xw_client_id=8 HTTP/1.1
            elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page","remote/html_server.php?xw_controller=propertyV2&xw_action=sendItemFeedNews&xw_city=1&item='+itemArray[itemIndex][1]+'&building_type='+buildType+'", 1, 0, 0, 0); return false;'});
          } else {
            DEBUG(response[flashCount].name+' fully upgraded. No need to ask for parts. Disabling this setting.');
            GM_setValue(buildSetting, 'unchecked');
          }
        } else {
          //DEBUG('Ask for NY Parts - Flash seems disabled : Building Status not available');
          elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page","remote/html_server.php?xw_controller=propertyV2&xw_action=sendItemFeedNews&xw_city=1&item='+itemArray[itemIndex][1]+'&building_type='+buildType+'", 1, 0, 0, 0); return false;'});
        }
      }
    }

    if(elt){
      Autoplay.fx = function(){
        clickElement(elt);
        addToLog('info Icon', 'Clicked to ask your Mafia to send you '+buildItem+'.');
      };

      Autoplay.start();
      DEBUG('Ask for Parts - Ask for '+buildType +' - '+buildItem+' success. Timer Reset : '+timerReset);
      if(timerName) setGMTime(timerName, timerReset);
      return true;
    }
    DEBUG('Ask for Parts - Failed to ask for '+buildType +' - '+buildItem+'. Timer Reset : 2 Hours.');
    if(timerName) setGMTime(timerName, '2 hours');
    return false;
  }

  if(itemCity == BRAZIL || itemCity == CHICAGO){
    checkPropertyStatus(itemCity);
    if(itemCity==BRAZIL){
      var brazilReport = GM_getValue('brazilReport');
      var itemTimer = 'askBrazilPartsTimer';
    } else {
      var brazilReport = GM_getValue('chicagoReport');
      var itemTimer = 'askChicagoPartsTimer';
    }
    var linkCity = itemCity+1;
    if(brazilReport){
      brazilReport = brazilReport.replace(/\\/g, "");

      var searchItem='"id":'+itemArray[itemIndex][1];

      if(brazilReport.indexOf(searchItem) != -1){
        // Parts Required format : {\"id\":1575,\"type\":1,\"quantity\":7}
        var partsRequiredTxt = new RegExp(searchItem+',"type":1,"quantity":(.+?)}','gi');
        var totalRequired=0, totalNeeded=0, totalOwned=0;
        while(match = partsRequiredTxt.exec(brazilReport)) totalRequired += parseInt(match[1]);

        // Parts Owned format : {\"id\":1575,\"type\":1,\"name\":\"Cinder Block\",\"num_owned\":17,\"image_url\":\"http:\\\/\\\/mwfb.static.zynga.com\\\/mwfb\\\/graphics\\\/item_Cinderblock_01.gif\"}
        var partsOwnedTxt = new RegExp(searchItem+',"type":1,"name":"'+buildItem+'","num_owned":(.+?),"image_url"','gi');
        if(match = partsOwnedTxt.exec(brazilReport)) totalOwned = parseInt(match[1]);
        totalNeeded = totalRequired - totalOwned;

        if(totalNeeded<=0) addToLog('warning Icon','Asking for '+buildItem+' (Total Required: '+totalRequired+' - Already Owned: '+totalOwned+').');
        else addToLog('info Icon','Asking for '+buildItem+', still needing '+ totalNeeded+' (Total Required: '+totalRequired+' - Already Owned: '+totalOwned+').');
        buildType = itemArray[itemIndex][2];

        var ajaxID = createAjaxPage(true);
        //format: html_server.php?xw_controller=propertyV2&xw_action=getAskForHelpFeed&xw_city=8&xw_person=43398787&city=8&building_type=2&item_type=1&item_id=11052&xw_client_id=8
        //format: html_server.php?xw_controller=propertyV2&xw_action=getAskForHelpFeed&xw_city=7&xw_person=42849033&city=7&building_type=4&item_type=1&item_id=2678&xw_client_id=8
        elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'propertyV2'+ SCRIPT.action+'getAskForHelpFeed'+ SCRIPT.city + linkCity+'&city='+linkCity+'&building_type='+ buildType+'&item_type=1&item_id='+ itemArray[itemIndex][1] +'", 1, 0, 0, 0); return false;'});
        Autoplay.fx = function(){
          clickAction = cities[itemCity][CITY_ALIAS]+' parts';
          clickContext = itemCity;
          clickElement(elt);
          DEBUG('Clicked to ask for '+buildItem+' for '+buildType +' (action: '+clickAction+' - context: '+clickContext);
        };
        Autoplay.start();
        return true;
      }
    }

    DEBUG('Ask for '+cities[itemCity][CITY_NAME]+' Parts - Failed to ask for '+buildType +' - '+buildItem+'. Timer Reset : 2 hours.');
    setGMTime(itemTimer, '2 hours');
    return false;
  }

  if(itemCity == LV){
    if(buildType==102){
      var ajaxID = createAjaxPage(true);
      elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'propertyV2'+ SCRIPT.action+'vslot_feed'+ SCRIPT.city+'5", 1, 0, 0, 0); return false;'});
      Autoplay.fx = function(){
        clickAction = 'play slots';
        clickContext = itemCity;
        clickElement(elt);
        DEBUG('Clicked to ask for '+buildItem+' for '+buildType +' (action: '+clickAction+' - context: '+clickContext);
      };
      Autoplay.start();
      return true;
    } else {

      checkPropertyStatus(LV);
      var casinoReport = GM_getValue('casinoReport');
      if(casinoReport){
        casinoReport = casinoReport.replace(/\\/g, "");
        //DEBUG('casinoReport: '+casinoReport);
        var searchItem='"id":'+itemArray[itemIndex][1];

        if(casinoReport.indexOf(searchItem) != -1){
          // Parts Required format : {\"id\":1575,\"type\":1,\"quantity\":7}
          var partsRequiredTxt = new RegExp(searchItem+',"type":1,"quantity":(.+?)}','gi');
          var totalRequired=0, totalNeeded=0, totalOwned=0;
          while(match = partsRequiredTxt.exec(casinoReport)){
            totalRequired += parseInt(match[1]);
          }

          // Parts Owned format : {\"id\":1575,\"type\":1,\"name\":\"Cinder Block\",\"num_owned\":17,\"image_url\":\"http:\\\/\\\/mwfb.static.zynga.com\\\/mwfb\\\/graphics\\\/item_Cinderblock_01.gif\"}
          var partsOwnedTxt = new RegExp(searchItem+',"type":1,"name":"'+buildItem+'","num_owned":(.+?),"image_url"','gi');
          if(match = partsOwnedTxt.exec(casinoReport)) totalOwned = parseInt(match[1]);
          totalNeeded = totalRequired - totalOwned;

          if(totalNeeded<=0) addToLog('warning Icon','Asking for '+buildItem+' (Total Required: '+totalRequired+' - Already Owned: '+totalOwned+').');
          else addToLog('info Icon','Asking for '+buildItem+', still needing '+ totalNeeded+' (Total Required: '+totalRequired+' - Already Owned: '+totalOwned+').');

          buildType = itemArray[itemIndex][2];

          var ajaxID = createAjaxPage(true);
          //format: html_server.php?xw_controller=propertyV2&xw_action=getAskForHelpFeed&xw_city=5&city=5&building_type=1&item_type=1&item_id=1575&xw_client_id=8
          elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'propertyV2'+ SCRIPT.action+'getAskForHelpFeed'+ SCRIPT.city+'5&city=5&building_type='+ buildType+'&item_type=1&item_id='+ itemArray[itemIndex][1] +'", 1, 0, 0, 0); return false;'});
          Autoplay.fx = function(){
            clickAction = 'casino parts';
            clickContext = itemCity;
            clickElement(elt);
            DEBUG('Clicked to ask for '+buildItem+' for '+buildType +' (action: '+clickAction+' - context: '+clickContext);
          };

          Autoplay.start();
          return true;
        }
      }

      DEBUG('Ask for Casino Parts - Failed to ask for '+buildType +' - '+buildItem+'. Timer Reset : 2 hours.');
      setGMTime('askCasinoPartsTimer', '2 hours');
      return false;
    }
  }

  if(itemCity == ITALY){
    if(buildType==103){
      var ajaxID = createAjaxPage(true);
      elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'propertyV2'+ SCRIPT.action+'customerFeed'+ SCRIPT.city+'6&city=6&prop=5", 1, 0, 0, 0); return false;'});
      Autoplay.fx = function(){
        clickAction = 'football fans';
        clickContext = itemCity;
        clickElement(elt);
        DEBUG('Clicked to ask for '+buildItem+' for '+buildType +' (action: '+clickAction+' - context: '+clickContext);
      };
      Autoplay.start();
      return true;
    } else {

      checkPropertyStatus(ITALY);
      var villageReport = GM_getValue('villageReport');
      if(villageReport){
        villageReport = villageReport.replace(/\\/g, "");
        var searchItem='"id":'+itemArray[itemIndex][1];

        if(villageReport.indexOf(searchItem) != -1){
          // Parts Required format : {\"id\":1575,\"type\":1,\"quantity\":7}
          var partsRequiredTxt = new RegExp(searchItem+',"type":1,"quantity":(.+?)}','gi');
          var totalRequired=0, totalNeeded=0, totalOwned=0;
          while(match = partsRequiredTxt.exec(villageReport)){
            totalRequired += parseInt(match[1]);
          }

          // Parts Owned format : {\"id\":1575,\"type\":1,\"name\":\"Cinder Block\",\"num_owned\":17,\"image_url\":\"http:\\\/\\\/mwfb.static.zynga.com\\\/mwfb\\\/graphics\\\/item_Cinderblock_01.gif\"}
          var partsOwnedTxt = new RegExp(searchItem+',"type":1,"name":"'+buildItem+'","num_owned":(.+?),"image_url"','gi');
          if(match = partsOwnedTxt.exec(villageReport)){
             totalOwned = parseInt(match[1]);
          }
          totalNeeded = totalRequired - totalOwned;

          if(totalNeeded<=0){
            addToLog('warning Icon','Asking for '+buildItem+' (Total Required: '+totalRequired+' - Already Owned: '+totalOwned+').');
          } else {
            addToLog('info Icon','Asking for '+buildItem+', still needing '+ totalNeeded+' (Total Required: '+totalRequired+' - Already Owned: '+totalOwned+').');
          }
          buildType = itemArray[itemIndex][2];

          var ajaxID = createAjaxPage(true);
          //format: html_server.php?xw_controller=propertyV2&xw_action=getAskForHelpFeed&xw_city=5&city=5&building_type=1&item_type=1&item_id=1575&xw_client_id=8
          elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'propertyV2'+ SCRIPT.action+'getAskForHelpFeed'+ SCRIPT.city+'6&city=6&building_type='+ buildType+'&item_type=1&item_id='+ itemArray[itemIndex][1] +'", 1, 0, 0, 0); return false;'});
          Autoplay.fx = function(){
            clickAction = 'village parts';
            clickContext = itemCity;
            clickElement(elt);
            DEBUG('Clicked to ask for '+buildItem+' for '+buildType +' (action: '+clickAction+' - context: '+clickContext);
          };
          Autoplay.start();
          return true;
        }
      }
      DEBUG('Ask for Village Parts - Failed to ask for '+buildType +' - '+buildItem+'. Timer Reset : 2 hours.');
      setGMTime('askVillagePartsTimer', '2 hours');
      return false;
    }
  }
}

// Pass the item array and item id
function buildPropItem(propCount, propItem){

  var propTitle = cityProperties[propCount][ctTitle];
  var propGMId = cityProperties[propCount][ctGMId];
  var propItemGMId = cityProperties[propCount][ctGMId]+'id';
  var propText = cityProperties[propCount][ctText];
  var propArray = cityProperties[propCount][ctArray];
  var propType = cityProperties[propCount][ctPropType];
  var propId = cityProperties[propCount][ctPropId];
  var propTimer = cityProperties[propCount][ctPropTimer];
  var propCity = cityProperties[propCount][ctPropCity];
  var propName = cityProperties[propCount][ctPropName];
  var propNamePlus = cityProperties[propCount][ctPropNamePlus];

  Autoplay.delay = 3000;

  if(city != propCity){
    Autoplay.fx = function(){ goLocation(propCity); };
    Autoplay.start();
    return true;
  }

  if(!onPropertyNav()){
    Autoplay.fx = goPropertyNav;
    Autoplay.start();
    return true;
  }

  switch(propType){
    case 1:
      // Build Chop Shop, Weapons Depot, Armory and Private Zoo Items
      var elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page","remote/html_server.php?xw_controller=propertyV2&xw_action=craft&xw_city=1&recipe='+propArray[propItem][1]+'&building_type='+propId+'", 1, 0, 0, 0); return false;'});
      if(elt){
        Autoplay.fx = function(){
          clickAction = 'build item';
          clickContext = {itemName: propArray[propItem][0], buildType: propId, propCount: propCount};
          clickElement(elt);
          DEBUG('Clicked to build '+ clickContext.itemName+'.');
        };
        Autoplay.start();
        return true;
      }
    break;
    case 2:
      // Active check
      var flashvars = xpathFirst('//object[@id="properties_div"]/param[@name="flashvars"]');
      if(flashvars && flashvars.value){
        propValue = JSON.stringify(JSON.parse(unescape(flashvars.value).match(/&mw_data=(\[.+\])/)[1]));
        if(propValue.indexOf(propNamePlus)!=-1){
          DEBUG('propId: '+propId+' - '+propName+' already active.');
        } else {
          // Save changes to make property active
          // form : html_server.php?xw_controller=LimitedTimeProperty&xw_action=saveProperties&xw_city=1&properties=weapons_depot,armory,private_zoo,chop_shop,2&xw_client_id=8
          var saveString = 'armory,chop_shop,private_zoo,weapons_depot,'+propId;
          var ajaxID = createAjaxPage(true);
          var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'LimitedTimeProperty'+ SCRIPT.action+'saveProperties'+ SCRIPT.city+'1&city=1&properties='+saveString+'", 1, 0, 0, 0); return false;'});
          if(elt){
            Autoplay.fx = function(){
              clickAction = 'save properties';
              clickContext = saveString;
              clickElement(elt);
              DEBUG('Clicked to save '+ saveString+'.');
            };
            Autoplay.start();
            return true;
          }
        }
      } //else colorDEBUG('flashvars NOT FOUND');
      // Build Sports Bar, Venetian Condo, Gun Shop, ClubHouse, Martial Arts, Cemetery, Garden, Cider House Items, ...
      // form: html_server.php?xw_controller=limitedTimeProperty&xw_action=build&xw_city=1&rec_id=1&prop_id=3&xw_client_id=8
      var ajaxID = createAjaxPage(true);
      var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'limitedTimeProperty'+ SCRIPT.action+'build'+ SCRIPT.city+'1&city=1&prop_id='+propId+'&rec_id='+propArray[propItem][1]+'", 1, 0, 0, 0); return false;'});
      if(elt){
        Autoplay.fx = function(){
          clickAction = 'build limited';
          clickContext = {itemName: propArray[propItem][0], buildType: propId, propCount: propCount};
          clickElement(elt);
          DEBUG('Clicked to build '+ clickContext.itemName+' from '+clickContext.buildType+' = '+propId+'.');
        };
        Autoplay.start();
        return true;
      }
      break;
    case 3 :
    case 4 :
    case 5 :
      var buildCity = propCity+1;
      var ajaxID = createAjaxPage(true);
      var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'propertyV2'+ SCRIPT.action+'portBuyItem'+ SCRIPT.city + buildCity+'&city='+buildCity+'&building_type='+propId+'&id='+propArray[propItem][1]+'", 1, 1, 0, 0); return false;'});
      if(elt){
        Autoplay.fx = function(){
          clickAction = 'build other';
          clickContext = {itemName: propArray[propItem][0], buildType: propId, propCount: propCount};
          clickElement(elt);
          DEBUG('Clicked to build '+ clickContext.itemName+' from '+clickContext.buildType+' = '+propId+'.');
        };
        Autoplay.start();
        return true;
      }
      break;
    default :
      return false;
      break;
  }
  return false;
}

function checkPropertyStatus(propCity){
  if(!propCity) return;
  var linkCity = propCity+1;
  //var ajaxID = createAjaxPage(true);
  var ajaxID = createAjaxPage(false, 'check property');
  var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'propertyV2'+ SCRIPT.action+'createData'+ SCRIPT.city +linkCity+ '&city='+linkCity+'", 1, 1, 0, 0); return false;'});
  Autoplay.fx = function(){
    clickAction = 'check property';
    clickContext = propCity;
    clickElement(elt);
  };
  Autoplay.start();
  return true;
}


function autoBossFight(theBoss){
  Autoplay.delay = getAutoPlayDelay()

  if(city != NY){
    Autoplay.fx = function(){  goLocation(NY); };
    Autoplay.start();
    return true;
  }

  var fightTable = xpathFirst('.//table[@class="boss_fight"]');
  if(!fightTable){
    var tabno = theBoss;
    if(!onJobTab(tabno)){
      Autoplay.fx = function(){ goJobTab(tabno); };
      Autoplay.start();
      return true;
    }

    if(health < maxHealth) heal();

    var bossAttackButton = xpathFirst('.//a[contains(@href,"xw_controller=bossfight") and contains(@href,"boss='+theBoss+'")]');
    if(bossAttackButton){
      clickElement(bossAttackButton);
      return true;
    }
  } else {
    Autoplay.delay = noDelay;
    var bossAttackButton = xpathFirst('.//a[contains(@href,"xw_controller=bossfight") and contains(@href,"boss='+theBoss+'")]', fightTable);
    if(bossAttackButton){
      clickElement(bossAttackButton);
      return true;
    } else {
      var bossAttackButton = xpathFirst('.//a[contains(@href,"xw_controller=job") and contains(.,"Back to Jobs")]', fightTable);
      if(bossAttackButton){
        var bossResult = bossAttackButton.parentNode.innerHTML;
        if(bossResult.match(/(.+)<a/)) bossResult = RegExp.$1;
        bossResult = bossResult.replace(/^<br><br>/,'')
        bossResult = bossResult.replace(/<br><br>/g,'<br>')
        addToLog('yeah Icon', bossResult)
        clickElement(bossAttackButton);
      }
    }
  }
  return false;
}

function activateCrew(cityno){
  if(city != cityno){
    Autoplay.fx = function(){ goLocation(cityno); };
    Autoplay.start();
    return true;
  }

  var tabno = 1;
  if(!onJobTab(tabno)){
    Autoplay.fx = function(){ goJobTab(tabno); };
    Autoplay.start();
    return true;
  }

  // Do we have crew to allocate
  var crewCount = 0;
  var crewElt = xpathFirst('.//a[@id="btn_queue"]',innerPageElt);
  if(crewElt){
    crewCount = parseCash(crewElt.innerHTML.untag());
    DEBUG("activateCrew - We have the following count for crew members:  " + crewCount);
  }
  var j = 0;

  if(crewCount){
    for(i=1;i<=8;i++){
      if(j>crewCount) break;
      if(cityno==BRAZIL) selectCrewValue = 'selectBrazilCrew'+i;
      else selectCrewValue = 'selectChicagoCrew'+i;

      var selectCrewSlot = parseInt(GM_getValue(selectCrewValue,0));
      if(selectCrewSlot){
        var taskmasterElt = xpathFirst('.//a[contains(@href,"crew_type='+cityCrewTitles[selectCrewSlot][3]+'") and contains(@href,"crew_slot='+cityCrewTitles[selectCrewSlot][4]+'")]', innerPageElt);
        if(taskmasterElt){
          DEBUG('activateCrew - Clicking Slot: '+i+' - '+GM_getValue(selectCrewValue,0));
          clickElement(taskmasterElt);
          j++;
        } //else { DEBUG('activateCrew - Slot: '+i+' - '+GM_getValue(selectCrewValue,0)+' already active'); }
      } //else { DEBUG('activateCrew - Skipping: '+i+' - '+GM_getValue(selectCrewValue,0)); }
    }
  } //else { colorDEBUG('activateCrew - No Crew members available'); }

  if(cityno==BRAZIL) setGMTime('activateBrazilCrewTimer', '1 hour');
  else setGMTime('activateChicagoCrewTimer', '1 hour');

  return false;
}

function autoSlotMachine(){
  setGMTime('autoSlotTimer', '4 hours');

  var myParams  = 'ajax=1&liteload=1&clicks=1';
  myParams += '&sf_xw_user_id='+ xw_user_id+'&sf_xw_sig='+ xw_sig;
  ts = parseInt(new Date().getTime().toString().substring(0, 10));
  cb = xw_user+ts;
  GM_xmlhttpRequest({
    method: 'POST',
    url: document.location.protocol+'//facebook.mafiawars.zynga.com/mwfb/'+ SCRIPT.controller+'slotmachine'+ SCRIPT.action+'view'+ SCRIPT.city+'&xw_person='+ xw_user+'&xw_client_id=8&cb='+cb+'&ts='+ts ,
    data: myParams,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    onload: function(_responseDetails){
      var i1, i2, flashvars;
      var tmp = _responseDetails.responseText;
      i1 = tmp.indexOf('flashvars = {');
      if(i1!=-1){
        i2 = tmp.indexOf('};',i1);
        tmp = tmp.slice(i1,i2+2);
        eval(tmp);
        if(flashvars && flashvars.freeSpins){
          slotSpins = flashvars.freeSpins;
          slotBonus = flashvars.bonusMeter;
          addToLog('info Icon', 'Slot Spins Remaining: '  + slotSpins+' Bonus Level: '+ slotBonus);
        }
      }
    }
  });
  return false;

  //if(xpathFirst('.//div[@id="slots_icon_cover" and contains(@onclick, "xw_controller=slotmachine&xw_action=view")]', mastheadElt)){
  //  var elt = xpathFirst('.//div[@id="slots_icon_cover" and contains(@onclick, "xw_controller=slotmachine&xw_action=view")]', mastheadElt);
  //  clickElement(elt);
  //  return true;
  //} else {
  //  return false;
  //}
}

function autoSlotBonus(){
  // Collect the bonus..
  var i1, i2, slotVars, flashvars;
  if(slotBonus >= 20){
    slotBonus = 0; // Just in case..
    var ajaxID = createAjaxPage(true);
    var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'slotmachine'+ SCRIPT.action+'award_bonus", 1, 1, 0, 0); return false;'});
    Autoplay.fx = function(){
      clickAction = 'collect slotbonus';
      clickElement(elt);
    };
    Autoplay.start();
    return true;
  } else {
    DEBUG('Not at the correct bonus level');
  }
  return false;
}

function autoSlotPull(){
  // This is called to start off the slot machine process..
  var i1, i2, slotVars, flashvars;
  if(slotSpins > 0){
    slotSpins--; // Just in case..
    var ajaxID = createAjaxPage(true);
    var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'slotmachine'+ SCRIPT.action+'spin&betAmt=1&friend_id=none", 1, 1, 0, 0); return false;'});
    Autoplay.fx = function(){
      clickAction = 'collect slot';
      clickElement(elt);
    };
    Autoplay.start();
    return true;
  } else { DEBUG('No spins left on the slot machine'); }
  return false;
}

function autoBattleCollect(){
  if(!onBattlePage(1)){
    DEBUG('NOT on Battle Collect Page - going there');
    // Go Battle Collect Page
    goBattlePage(1);
  } //else { colorDEBUG('Already on Battle Collect Page'); }
}

function autoBattle(){
  // Are we on the clan page?
  var clanId = GM_getValue('AutoBattleClanID',0);
  if(clanId > 0 && !onClanNav(clanId)){
      DEBUG('Not on Clan Page - going there');
      goClanPage(clanId);
      return;
  }
  if(clanId == 0){
      DEBUG('No clan specified for AutoBattle');
      return;
  }
  DEBUG('We passed going to the clan page');
  return;
}

function goBattlePage(battletype){
  // 1 = Collect Page
  // 2 = Default Page
  var battleAction = (battletype==1)?'view_no_battle':'view';
  var elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page","remote/html_server.php?xw_controller=EpicBattle&xw_action='+battleAction+'", 1, 1, 0, 0); return false;'});
  if(!elt){ addToLog('warning Icon', 'Can\'t make battle link to click.'); }
  else {
    if(battletype==1){clickAction = 'load battlecollect';} else {clickAction = 'load battlepage';}
    clickElement(elt);
    DEBUG('Clicked to load Battle Page.');
  }
  return;
}

function onBattlePage(battletype){
  // 1 = Collect Page
  // 2 = Default Page
  var battleAction = (battletype==1)?'battle_history':'battle_target_list';
  //DEBUG('Looking for:'+ battleAction);
  if(xpathFirst('.//div[@id="'+battleAction+'"]', innerPageElt)){  DEBUG('Element :'+ battleAction+ ' found'); return true; }
  DEBUG('Element :'+ battleAction+ ' NOT FOUND');
  return false;
}

function goClanPage(clanID){
  // Go to the clan page of the clan we want to start the battle for..
  // Base64 the ID
  clanID = btoa(clanID);
  var elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page","remote/html_server.php?xw_controller=clan&xw_action=view&id='+clanID+'", 1, 1, 0, 0); return false;'});
  if(!elt){
    addToLog('warning Icon', 'Can\'t make Clan link to click.');
  } else {
    clickAction = 'load clan';
    clickElement(elt);
    DEBUG('Clicked to load Clan Page.');
  }
  return;
}

function onClanNav(clanID){
  // Return true if we're on the clan tab, false otherwise.
  // If we pass a specific clanID, verify we are on that clan page
  if(!clanID){
    if(xpathFirst('.//div[@id="clan_main"]', innerPageElt)){  return true; }
  } else {
    if(xpathFirst('.//div[@id="clan_main"]', innerPageElt)){
    //elt = xpathFirst('.//strong[@id="profile_link"]', innerPageElt);
      if($('#profile_link').length){
        DEBUG("On this clan page: " + $('#profile_link').text().replace(/"/g, '').trim());
        //DEBUG("On this clan page: " + elt.innerHTML().replace(/"/g, '').trim());
      } else {
        DEBUG("On the wrong clan page?");
        return false;
      }
      // On the clan page.. are we on the "right" clan page? Don't want to send the challenge to the wrong clan ;-)
      return true;
    }
  }
  return false;
}

function autoFamilyProgress(type){
  // type = 1 is get the total experience we currently can see..
  // type = 2 = click the smallest link higher than the exp needed to level.. or if we can't level, the largest link
  if(!running) return 0;
  var totalExp = 0;
  var selectedExp = 0;
  var currentExp = 0

  // Grab the exp per level..
  var rewardExp = [];
  //var eltRewards = xpathFirst('.//div[@id=clan_xp_meter]//li[contains(@class, "quest_reward experience")]', questBarElt);
  var eltRewards = xpathFirst('.//li[contains(@class, "quest_reward experience") and contains(., "Experience")]//dd', questBarElt);
  if(eltRewards){
    rewardExp = eltRewards.innerHTML.untag().replace('"','').trim().split(/\s+/);
    //rewardExp.shift();  // Remove the Experience element
    //for (var i = 0, iLength=rewardExp.length; i < iLength; ++i){
    //  DEBUG('Reward Amount: '+ rewardExp[i]);
    //}
  } else {
    //DEBUG('Unable to locate rewards experience levels');
    //if(type == 1){
      return 0;
    //}
  }

  // Grab what elements we can click..  //div[@id=clan_xp_meter]
  var eltComplete = $x('.//li[contains(@class, "box_middle") and contains(@class, "complete") and not (contains(@class, "mastered")) and contains (., "Collect")]', questBarElt);
  if(eltComplete){
    var clickElt;
    if(type == 2){ DEBUG('We have '+ eltComplete.length+' complete family progressions'); }
    for (var i = 0, iLength=eltComplete.length; i < iLength; ++i){
      var eltLevel = xpathFirst('.//span[contains(@class, "_star")]', eltComplete[i]);
      if(eltLevel){
        var mastery_level = eltLevel.getAttribute('class');
        if(/bronze/.test(mastery_level)){
          currentExp = parseInt(rewardExp[0]);
        } else if(/silver/.test(mastery_level)){
          currentExp = parseInt(rewardExp[1]);
        } else if(/gold/.test(mastery_level)){
          currentExp = parseInt(rewardExp[2]);
        } else {
          DEBUG('Unknown mastery family experience level: '+ mastery_level);
          currentExp = 0;
        }
        //DEBUG('Level: '+ eltLevel.getAttribute('class'));
      }
      totalExp += currentExp; //Running total
      //DEBUG('Current Exp: '+ currentExp+' Totel Exp: '+ totalExp);
      var tmpElt = xpathFirst('.//a[contains(@href, "xw_action=collectProgress") and contains (., "Collect")]', eltComplete[i]);
      if(tmpElt && type == 2){
        //DEBUG('ptsToNextLevel:'+ ptsToNextLevel+'  currentExp:'+ currentExp+' selectedExp'+ selectedExp);
        if(
            selectedExp == 0 || // We have't set another one yet
            (ptsToNextLevel <= currentExp && selectedExp > currentExp) ||// We have a selection that will level us, but takes less exp than a previous selection
            (ptsToNextLevel > currentExp && currentExp > selectedExp) // We don't have a selection that will level us, so take the largest exp gain.
        ){
          // This is the element we want to click..
          selectedExp = currentExp;
          clickElt = tmpElt;
        }

      }
    }
    // Loop to determine which element to click is done..
    if(type == 2 && clickElt && selectedExp > 0){
      addToLog('info Icon', 'Collecting Family Experience: '+ selectedExp);
      clickElement(clickElt);
      return false;
    }
  } else {
    if(type == 1){ return 0;}
  }
  if(type==1){ return totalExp;}
}

function autoCollectTake(takeCity){
  if(isGMUndefined('collectCityAttempt')) GM_setValue ('collectCityAttempt', false);
  if(isGMUndefined('propertyNavAttempt')) GM_setValue ('propertyNavAttempt', false);

  // Go to the correct city.
  if(city != takeCity){
    if(GM_getValue('collectCityAttempt',false)){  //Tried to go to city, but failed.  Reset and continue.
      if(takeCity != 0){ // if New York, do not reset clock.  Everyone SHOULD be able to collect from NY.
        setGMTime('takeHour'+ cities[takeCity][CITY_NAME], '1 hour'); // reset clock to try again later.
      }
      GM_setValue ('collectCityAttempt', false);
      return false;
    }
    GM_setValue ('collectCityAttempt', true);
    Autoplay.fx = function(){goLocation(takeCity);};
    Autoplay.start();
    return true;
  }
  GM_setValue ('collectCityAttempt', false);

  // Visit the property Nav
  if(!onPropertyNav()){
    if(GM_getValue('propertyNavAttempt',false)){  //Tried to go to properties, but failed.  Reset and continue.
      if(takeCity != 0){ // if New York, do not reset clock.  Everyone SHOULD be able to collect from NY.
        setGMTime('takeHour'+ cities[takeCity][CITY_NAME], '8 hours'); // reset clock to try again a day later.
      }
      GM_setValue ('propertyNavAttempt', false);
      return false;
    }
    GM_setValue ('propertyNavAttempt', true);
    Autoplay.fx = goPropertyNav;
    Autoplay.start();
    return true;
  }
  GM_setValue ('propertyNavAttempt', false);

  var ajaxID = createAjaxPage(true);
  var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'propertyV2'+ SCRIPT.action+'collectall'+ SCRIPT.city + (takeCity+1)+'&requesttype=json", 1, 1, 0, 0); return false;'});

  Autoplay.fx = function(){
    clickAction = 'collect take';
    clickContext = takeCity;
    clickElement(elt);
  };
  Autoplay.start();
  return true;
}

function autoPlayerUpdates(){
  // Get the updates.
  var pUpdates = xpath('.//div[@id="player_updates_all"]/div[@class="update_item"]', innerPageElt);
  var pUpdatesLen = pUpdates.snapshotLength;
  var logPlayerUpdatesCount = GM_getValue('logPlayerUpdatesCount');
  if(isUndefined(logPlayerUpdatesCount)){
    logPlayerUpdatesCount = pUpdatesLen;
    GM_setValue('logPlayerUpdatesCount', logPlayerUpdatesCount);
  }

  if((pUpdatesLen > 0 && logPlayerUpdatesCount > pUpdatesLen) || (pUpdatesLen == 0 && logPlayerUpdatesCount > 0)){
    if(pUpdatesLen > 0 && logPlayerUpdatesCount > pUpdatesLen) DEBUG('Discrepancy in player updates; new count: '+ pUpdatesLen+', old count: '+ logPlayerUpdatesCount);
    else  DEBUG('Player updates were cleared.');
    logPlayerUpdatesCount = 0;
    GM_setValue('logPlayerUpdatesCount', 0);
  }

  if(logPlayerUpdatesCount < pUpdatesLen){
    DEBUG('Parsing new player updates.');
    for (var i = pUpdatesLen - logPlayerUpdatesCount - 1; i >= 0; i--){
      if(!parsePlayerUpdates(pUpdates.snapshotItem(i))) return true;
      GM_setValue('logPlayerUpdatesCount', ++logPlayerUpdatesCount);
    }
  }

  if(pUpdatesLen > GM_getValue('logPlayerUpdatesMax', 25) && logPlayerUpdatesCount == pUpdatesLen){
    Autoplay.fx = goDeleteNews;
    Autoplay.start();
    return true;
  }
  return false;
}

function miniPackForce(){
  if(!timeLeftGM('miniPackTimer')) setGMTime('miniPackTimer', '1 hour');
  GM_setValue('miniPackFired', true);
  DEBUG('Redirecting to use mini pack...');
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://toolbar.zynga.com/game_iframe_proxy.php?playing=true',
    onload: function(_tbresponse){
      if(_tbresponse.status == 200){
        // Good to go.. now go to next step..
        GM_xmlhttpRequest({
          method: 'HEAD',
          url: 'http://toolbar.zynga.com/click.php?to=mwgamestatsplaynow',
          onload: function(_mwresponse){
            if(_mwresponse.status == 302){
              var loc = /Location: ([^\n]*)\n/.exec(response.responseHeaders)[1];
              if(loc){
                document.location.href = loc;
              }
            }
          }
        });
      }
    }
  });
  return false;
}

function autoStatVars(){
  var autoStatValues = new Array();
  var upgradeKey='';
  var upgradeAmt = 0;

  var curStats = [curAttack,curDefense,maxHealth,maxEnergy,maxStamina];
  var modeStats = [level,curAttack,curDefense,maxHealth,maxEnergy,maxStamina];
  var statFallbacks = new Array(curStats.length);

  var maxPtDiff = 0;
  var statIndex = 0;
  var statPrio = autoStatPrios.length;
  for (var i = 0, iLength = curStats.length; i < iLength; ++i){
    // Calculate the Points needed to reach target stat
    var ratio = new Number(GM_getValue(autoStatRatios[i]));
    var base = new Number(GM_getValue(autoStatBases[i]));
    var curStatPrio = new Number(GM_getValue(autoStatPrios[i]));
    var curStatDiff = Math.max (0, ratio * modeStats[GM_getValue(autoStatModes[i])] + base - curStats[i]);

    // Account for priority
    if((curStatDiff > 0 && curStatPrio < statPrio) || (curStatDiff > maxPtDiff && curStatPrio <= statPrio)){
      maxPtDiff = curStatDiff;
      statIndex = i;
      statPrio = curStatPrio;
    }

    // Fallback method
    statFallbacks[i] = isGMChecked(autoStatFallbacks[i]) ? i : '';
  }

  if(maxPtDiff <= 0 && isGMChecked('autoStatDisable')){
    addToLog('info Icon', 'All status goals met, please update your goals.');
    GM_setValue('autoStat', 0);
  }

  // Increment the status corresponding to the nextStat variable (fallback)
  if(maxPtDiff <= 0){
    if(statFallbacks.join('') != ''){
      DEBUG('Status GOALS reached, using fallback method.', 10);
      var nextStat = parseInt(GM_getValue('nextStat', ATTACK_STAT));

      // Search for next Stat to increment
      while (statFallbacks.indexOf(nextStat) == -1){ nextStat = (nextStat + 1) % curStats.length; }
      statIndex = nextStat;
    } else {
      DEBUG('Status GOALS reached, waiting till next level up.');
      GM_setValue('restAutoStat', 1);
    }
  } else {
    DEBUG('Next stat to increment : '+ autoStatDescrips[statIndex + 1]+' ('+ maxPtDiff+' points to goal) ');
    GM_setValue('restAutoStat', 0);
  }

  // Add stats to the attribute farthest from the goal (or the nextStat if fallback kicked in)
  switch (statIndex){
    case ATTACK_STAT  : upgradeKey = 'attack';  break;
    case DEFENSE_STAT : upgradeKey = 'defense'; break;
    case HEALTH_STAT  : upgradeKey = 'max_health';  break;
    case ENERGY_STAT  : upgradeKey = 'max_energy';  break;
    case STAMINA_STAT : upgradeKey = 'max_stamina'; break;
  }

  upgradeAmt = (stats > 4 && (maxPtDiff > 4 || maxPtDiff <= 0))? 5 : 1;

  autoStatValues[0] = upgradeKey;
  autoStatValues[1] = upgradeAmt;

  return autoStatValues;
}

function autoStat(){
  if(!onProfileNav() || isUndefined(curAttack)){
    Autoplay.fx = goMyProfile;
    Autoplay.start();
    return true;
  }

  if(onProfileNav()){
    var autoStatValues = new Array;
    autoStatValues = autoStatVars();
    DEBUG('AutoStat upgrading '+autoStatValues[0]+ ' - '+autoStatValues[1]);

    if(autoStatValues[0]!='' && autoStatValues[1]!=0){
      var upgradeElt = xpathFirst('.//a[contains(@onclick,"upgrade_key='+autoStatValues[0]+'") and contains(@onclick,"upgrade_amt='+autoStatValues[1]+'")]', innerPageElt);
      // Try to fallback to 1 skill point button
      if(!upgradeElt){
        upgradeElt = xpathFirst('.//a[contains(@onclick,"upgrade_key='+autoStatValues[0]+'")]', innerPageElt);
      }

      if(!upgradeElt){
        DEBUG('Couldn\'t find link to upgrade stat.');
        return false;
      }

      Autoplay.fx = function(){
        clickAction = 'stats';
        clickElement(upgradeElt);
        DEBUG('Clicked to upgrade: '+ autoStatDescrips[statIndex + 1]);
      };
      Autoplay.delay = getAutoPlayDelay()
      Autoplay.start();
      return true;
    } else {
      return false;
    }
  } else {
    GM_setValue('autoStat', 0);
    colorDEBUG('BUG DETECTED: Unable to load Profile page, autostat disabled.');
    return false;
  }
}

// Get reward to cost ratio:
function calcJobratio(job){
  var ratio = Math.round(missions[job][MISSION_XP] / missions[job][MISSION_ENERGY] * 100) / 100;
  ratio = isNaN(ratio) ? 0 : ratio;
  missions[job][MISSION_RATIO] = ratio;
  GM_setValue('missions', JSON.stringify(missions));
  return ratio;
}

// Retrieve if and how much energy can be salvaged for the next level (eg after spending an energy pack)
function canSalvageEnergy(job){  
  if(energy <= maxEnergy) return false;
  var amount = energy - (Math.ceil((ptsToNextLevel) / missions[job][MISSION_XP]) * missions[job][MISSION_ENERGY]) - maxEnergy;
  if(amount > 0) return amount;
  else return false;
}

function canSalvageStamina(job){
  if(stamina <= maxStamina) return false;
  var amount = stamina - (Math.ceil((ptsToNextLevel) / missions[job][MISSION_XP]) * missions[job][MISSION_ENERGY]) - maxStamina;
  if(amount > 0) return amount;
  else return false;
}

function canMission(){
  if(!energy) return false;
  if(!isGMChecked('autoMission')) return false;

  var i, job;

  function canMissionJobCheck(canMissionJobArray){
    for (i = 0, iLength= canMissionJobArray.length; i < iLength; ++i){
      job = canMissionJobArray[i];
      var mission = missions[job];
      
      var missionFuel = energy;
      var missionType = 0;
      if(mission[MISSION_EOL]==0 || mission[MISSION_EOL]==3) {
        missionFuel = stamina;
        missionType = 1;
      }
      
      var newtab = mission[MISSION_TAB];
      if((city == BRAZIL||city==CHICAGO) && mission[MISSION_TABPATH]){
        newtab = mission[MISSION_TABPATH];        
      }

      if(!mission) continue;

      // This should enable us to use mastery jobs for single job level ups
      var singleJobLevelUpPossible = false;

      // Ignore jobs that are not yet available
      if(availableJobs[mission[MISSION_CITY]][newtab] != null &&
         availableJobs[mission[MISSION_CITY]][newtab].indexOf(parseInt(job)) == -1){         
        continue;
      }

      // Determine the job's experience-to-energy ratio.
      if(isNaN(mission[MISSION_RATIO]) || !mission[MISSION_RATIO]) mission[MISSION_RATIO] = calcJobratio(job);
      if(mission[MISSION_ENERGY] <= missionFuel){
        enoughEnergy = true;
        if(mission[MISSION_XP] >= expLeft){
          var levelJob = [job, mission[MISSION_ENERGY], mission[MISSION_XP]];          
          singleJobLevelUp.push(levelJob);
          singleJobLevelUpPossible = true;
        }
      }

      if(!isGMChecked('repeatJob')){        
        // Ignore mastered jobs unless it can do a single job level up
        if(masteredJobs[mission[MISSION_CITY]][newtab] != null && masteredJobs[mission[MISSION_CITY]][newtab].indexOf(parseInt(job)) != -1 &&
          singleJobLevelUpPossible == false){          
          continue;        } 
      }

      // Can salvage energy with this job
      if(missionType) if(!canSalvage && canSalvageStamina(job)) canSalvage = true;
      else if(!canSalvage && canSalvageEnergy(job)) canSalvage = true;
      multiple_jobs_ratio_sorted.push(job);
    }
  }

  if(getSavedList('jobsToDo').length == 0){
    var availableJobs = eval('('+ GM_getValue('availableJobs', '({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})')+')');
    var masteredJobs =  eval('('+ GM_getValue('masteredJobs',  '({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})')+')');
    var expLeft = ptsToNextLevel;
    var ratio = Math.ceil(expLeft / energy * 100) / 100;

    var multiple_jobs_list = getSavedList('selectMissionMultiple');
    var multiple_jobs_ratio_sorted = [];
    var jobs_selection = [];
    var singleJobLevelUp = [];
    var enoughEnergy = false;
    var canSalvage = false;

    // mission mastery code
    var mastery_jobs_list = getSavedList('masteryJobsList');
    for (i = 0, iLength=mastery_jobs_list.length; i < iLength; ++i){
      // Filters jobs on the ignorelist
      job = mastery_jobs_list[i];
      // Only push jobs that do not exist on the main list
      if(multiple_jobs_list.indexOf(job) == -1) multiple_jobs_list.push(job);
    }
    canMissionJobCheck(multiple_jobs_list);

    if(!enoughEnergy){
      if(isGMChecked('endLevelOptimize') && ratio <= 2.2){
        multiple_jobs_list = [];
        for (i = 0, iLength=missions.length; i < iLength; ++i){
          if(missions[i][MISSION_XP] > expLeft && missions[i][MISSION_ENERGY] < energy){
            multiple_jobs_list.push(i);
          }
        }
        canMissionJobCheck(multiple_jobs_list);
        if(!enoughEnergy) return false;
      } else return false;
    }

    var doJob = GM_getValue('selectMission');
    multiple_jobs_ratio_sorted.sort(function(a, b){ return missions[b][MISSION_RATIO] - missions[a][MISSION_RATIO]; });

    // Don't do expBurners or biggest exp job if energy can be salvaged
    if(singleJobLevelUp.length > 0 && !canSalvage){
      singleJobLevelUp.sort(function(a, b){ return b[2] - a[2]; });
      // One job is enough to level up. Pick the one that pays the most.
      doJob = singleJobLevelUp[0][0];

      if(isGMChecked('endLevelOptimize')){
        // Get the exp burner from the missions array
        if(isGMChecked('endLevelNYOnly')) {
          var expBurnFilter = function(v, i, a){ return (i > 6 && i < singleJobLevelUp[0][0] && (a[i][MISSION_EOL]==1 || a[i][MISSION_EOL]==2) && a[i][MISSION_CITY] == NY && a[i][MISSION_ENERGY] < singleJobLevelUp[0][1] * 0.5) ? 1:0; };
        }
        else var expBurnFilter = function(v, i, a){ return (i > 6 && i < singleJobLevelUp[0][0] && a[i][MISSION_ENERGY] && a[i][1] < singleJobLevelUp[0][1] * 0.5) ? 1:0; };

        var expBurners = missions.filter(expBurnFilter);
        expBurners.sort(function(a, b){ return b[MISSION_XP] - a[MISSION_XP]; });

        // Burn up exp before leveling up to maximize energy
        for (var i = 0, iLength=expBurners.length; i < iLength; ++i){
          var expBurner = expBurners[i];
          if( (energy - singleJobLevelUp[0][1]) > expBurner[1] && expLeft >= (Math.floor(expBurner[5]) * 1.5)+1){
            doJob = missions.searchArray(expBurner[0], 0)[0];
            jobOptimizeOn = true;
            break;
          }
        }
      }
    } else {
      // Can't level up. Pick a job we can do whose ratio is high enough.
      for (i = 0; i < multiple_jobs_ratio_sorted.length; i++){
        if(energy >= missions[multiple_jobs_ratio_sorted[i]][MISSION_ENERGY] && ratio <= missions[multiple_jobs_ratio_sorted[i]][MISSION_RATIO]){
          jobs_selection.push(multiple_jobs_ratio_sorted[i]);
        }
      }
      if(jobs_selection.length == 0){
        // No jobs meet the ratio necessary to level up. Go with the highest we can do ...
        if(multiple_jobs_ratio_sorted.length){
        doJob = multiple_jobs_ratio_sorted[0];
        if(missions[doJob][MISSION_TABPATH] == 1 || missions[doJob][MISSION_EOL] == 3){
          for(i=0,iLength=multiple_jobs_ratio_sorted.length;i<iLength;i++){
            newJob = multiple_jobs_ratio_sorted[i];
            if(missions[newJob][MISSION_TABPATH] != 1 && energy > missions[newJob][MISSION_ENERGY]) {
              doJob = newJob
              break;
            }
          }
        }
        if(missions[doJob][MISSION_TABPATH] != 1){
          for(i=0,iLength=multiple_jobs_ratio_sorted.length;i<iLength;i++){
            newJob = multiple_jobs_ratio_sorted[i];
            if(missions[newJob][MISSION_TABPATH] == 1 && stamina > missions[newJob][MISSION_ENERGY]) {
              doJob = newJob
              break;
            }
          }
        }
      }
      } else {
        // Pick the one with the lowest ratio.
        if(!canSalvage) doJob = jobs_selection[jobs_selection.length-1];
        // Energy can be salvaged, pick the one with the highest ratio
        else doJob = jobs_selection[0];
      }
    }

    if(GM_getValue('selectMission') != doJob){
      if(isUndefined(doJob)){
        colorDEBUG('No jobs selected.', cre);
        return false;
      } else {
        addToLog('info Icon', 'Switching job to '+ missions[doJob][MISSION_NAME]+'. (canMission)');
        GM_setValue('selectMission', doJob);
      }
    }
  }

  if(energy < missions[GM_getValue('selectMission', 1)][MISSION_ENERGY]){
    DEBUG('Skipping jobs: energy='+ energy+', cost='+ missions[GM_getValue('selectMission', 1)][MISSION_ENERGY]);
    return false;
  }

  // If spending energy will set energy below Energy floor, skip jobs
  var nextJobEnergy =  missions[GM_getValue('selectMission', 1)][MISSION_ENERGY];

//needchange
  if(energy - nextJobEnergy < SpendEnergy.floor && !SpendEnergy.canBurn){
    DEBUG('Not spending Job energy: energy='+ energy + ', floor='+ SpendEnergy.floor + ', nextJobEnergy='+ nextJobEnergy + ', burn='+ SpendEnergy.canBurn);
    return false;
  }

//needchange
  if(energy < SpendEnergy.ceiling && !SpendEnergy.canBurn && !GM_getValue('useEnergyStarted')){
    DEBUG('Rebuilding energy: energy='+ energy + ', ceiling='+ SpendEnergy.ceiling+', burn='+ SpendEnergy.canBurn);
    return false;
  }
  return true;
}

function autoMission(){
  Autoplay.delay = getAutoPlayDelay()
  // Common function if job has failed
  var doJobFunction = function (jobResult){
    if(!jobResult){
      addToLog('warning Icon', 'Unable to perform job <span class="job">'+ jobName+'</span>.');
      var jobs = getSavedList('jobsToDo', '');
      if(jobs.length == 0){
        // Skip jobs temporarily, and check the home page
        DEBUG('No more jobs to perform.');
        skipJobs = true;
        goHome();
        return;
      } else {
        // Else Get the next job to perform
        DEBUG('Looking for the next job to perform.');
        popJob();
        return true;
      }
    }
  };

  jobid         = GM_getValue('selectMission', 1);

  var jobName   = missions[jobid][MISSION_NAME];
  var jobno     = missions[jobid][MISSION_NUMBER];
  var tabno     = missions[jobid][MISSION_TAB];
  var cityno    = missions[jobid][MISSION_CITY];
  var tabnopath = missions[jobid][MISSION_TABPATH];
  var nodelv    = missions[jobid][MISSION_NODE_LV];

  colorDEBUG('autoMission : jobid: ' + jobid + ' / jobName: '+jobName);

  if(!tabnopath) tabnopath = 0 ;
  if(!nodelv)    nodelv    = ''  ;

  if(SpendEnergy.floor && isGMChecked('allowEnergyToLevelUp') && GM_getValue('autoEnergyBurn') !== SpendEnergy.canBurn){
    GM_setValue('autoEnergyBurn', SpendEnergy.canBurn);
    if(SpendEnergy.canBurn){
      addToLog('process Icon', energyIcon+'<span style="color:#009966; font-weight: bold;">Burning through energy reserve to level up.</span>');
    } else { DEBUG('Not within reach of a level up. Energy burning is off.'); }
  }

  if(city != cityno){
    Autoplay.fx = function(){ goLocation(cityno); };
    Autoplay.start();
    return true;
  }

  var newtab = tabno;
  if((city == BRAZIL||city==CHICAGO) && tabnopath) newtab = tabnopath;    

  if(!onJobTab(newtab)){
    Autoplay.fx = function(){ goJobTab(newtab); };
    Autoplay.start();
    return true;
  }

  if(city == LV||city==ITALY){
    if(!onJobTabpath(tabnopath)){
      Autoplay.fx = function(){ goJobTabPath(tabnopath); };
      Autoplay.start();
      return true;
    }
  }

  if(getJobRowItems(jobName)){
    if(jobid != GM_getValue('selectMission', 1)) Autoplay.fx = autoMission;
    Autoplay.start();
    return;
  }

  DEBUG('City: '+  cities[cityno][CITY_NAME] +', District/Region :'+  missionTabs[cityno][tabno - 1] +', job type :'+ tabMode[tabnopath]+', Job Name :'+ jobName );

  // Do the job
  Autoplay.fx = function(){ doJobFunction(goJob(jobno)); };
  Autoplay.start();

  return true;
}

function getCurrentBrazilDistrict(){
  currentBrazilDistrict = 0;
  var jobContainer = xpathFirst('.//div[@id="brazil_jobs"]//div[@class="jobs" and not(contains(@style,"none"))]', innerPageElt);
  if(jobContainer){
    var jobContainerParent = jobContainer.parentNode;
    if(jobContainerParent.hasAttribute('district_id')) currentBrazilDistrict = jobContainerParent.getAttribute('district_id');
  }

  if(!currentBrazilDistrict){
    var districtElt = xpathFirst('.//div[@id="brazil_jobs"]/div[@class="districts"]', innerPageElt);
    if(districtElt){
      if(districtElt.hasAttribute('style')){
        if(districtElt.getAttribute('style').match(/: -?(\d+)px/)){
          var marginBot = RegExp.$2;
          if(marginBot) currentBrazilDistrict = parseInt((RegExp.$1/54)+1)
        }
      }
    }
  }
  return currentBrazilDistrict;
}

function currentJobTab(){
  if(city==BRAZIL || city == CHICAGO){ return parseInt(getCurrentBrazilDistrict()); }
  var elt = xpathFirst('.//li[contains(@class, "tab_on")]//a', innerPageElt);
  if(elt && elt.getAttribute('onclick').match(/tab=(\d+)/)) return parseInt(RegExp.$1);
  return -1;
}

function currentJobTabPath(){
  var elt = xpathFirst('.//div[@id="job_paths"]//div[contains(@class, "path_on")]', innerPageElt);
  if(elt && elt.id.match(/(\d+)/)) return RegExp.$1;
  return -1;
}

function onJobTab(tabno){ return currentJobTab() == parseInt(tabno) ? true : false; }

function onJobTabpath(tabnopath){ return currentJobTabPath() == parseInt(tabnopath) ? true : false; }

function canForceHeal(){
  if(!isGMChecked('hideInHospital')) return true;

  // bypass all lower HiH settings and heal while health is above 19 and below 'need to heal minium'
  if((health > 19) && isGMChecked('forceHealOpt7') ){
    DEBUG( 'heal if above 19 is checked, and true, in canforceheal ');
    return true;
  }

  // if able to level up on stamina and checked to do so, bypass HiH
  if((SpendStamina.canBurn && stamina > 0) && isGMChecked('allowStaminaToLevelUp') ){
    DEBUG( 'enough stamina left to level up, and burn to level up, checked in canforceheal ');
    return true;
    }

  // Heal after 5 minutes
  if(isGMChecked('forceHealOpt5') && GM_getValue('healWaitStarted') && timeLeftGM('healWaitTime')){
    DEBUG( ' healing blocked '+ GM_getValue('healWaitStarted')+' due to 5 minute wait timer. remaining:'+ timeLeftGM('healWaitTime') );
   return false;
  } else {
    if(isGMChecked('forceHealOpt5')){
      DEBUG( '5 minute timer is up, Allowing Heal');
      GM_setValue('healWaitStarted',false);
      return true;
    }
  }
  // Heal when stamina is full
  if(isGMChecked('forceHealOpt4') && stamina >= maxStamina) return true;

  // Heal when stamina can be spent
  if(isGMChecked('forceHealOpt3') && canSpendStamina(0)) return true;

  return false;
}

function canSpendStamina(minHealth){
  if(!stamina || !isGMChecked('staminaSpend')) return false;

  if(stamina < 5 && (GM_getValue('fightLocation', NY) == BRAZIL || GM_getValue('fightLocation', NY) == CHICAGO)){
    DEBUG('Not spending stamina: stamina = '+ stamina+', fight city = '+ cities[BRAZIL][CITY_NAME]);
    return false;
  }

  var stamMode = getStaminaMode();

  // Up to 28 damage can be received in a fight.
  if(isNaN(minHealth)) {
    minHealth = isGMChecked('attackCritical') ? 21 : 29; // 20 works on fight page, need 21 to hit from profile page.
    switch (stamMode){
      case STAMINA_HOW_AUTOHITLIST:
      case STAMINA_HOW_ROBBING:
        minHealth = 0;
        break;
      case STAMINA_HOW_FIGHTROB:
        if(stamina > 25) minHealth = 0;
        break;
      case STAMINA_HOW_ROBFIGHT: //New stamina mode
        if(stamina > GM_getValue('robFightStaminaFloor')) minHealth = 0;
        break;
    }
  }

  if(health < minHealth){
    DEBUG('Not spending stamina: health='+ health+', minimum='+ minHealth);
    return false;
  }

  if(stamina <= SpendStamina.floor && !SpendStamina.canBurn){
    DEBUG('Not spending stamina: stamina='+ stamina+', floor='+ SpendStamina.floor+', burn='+ SpendStamina.canBurn);
    return false;
  }

  if(stamina < SpendStamina.ceiling && !SpendStamina.canBurn && !GM_getValue('useStaminaStarted')){
    DEBUG('Rebuilding stamina: stamina='+ stamina+', ceiling='+ SpendStamina.ceiling+', burn='+ SpendStamina.canBurn);
    return false;
  }

  // Only spend if stamina >= 20
  if(GM_getValue('staminaSpendHow') != STAMINA_HOW_RANDOM && (stamMode == STAMINA_HOW_ROBBING || stamMode == STAMINA_HOW_FIGHTROB) )
    return (stamina >= 25);
  else if(stamMode == STAMINA_HOW_ROBBING || stamMode == STAMINA_HOW_FIGHTROB){
    if(stamina >= 25) return true;
    else {
      randomizeStamina();
      return canSpendStamina();
    }
  }
  return true;
}

function autoHitlist(){
  var loc = GM_getValue('autoHitListLoc', NY);
  if(loc <= cities.length-1 && city != loc){
    Autoplay.fx = function(){ goLocation(loc); };
    Autoplay.delay = getAutoPlayDelay();
    Autoplay.start();
    return true;
  }

  if(!onFightTab() && !autoHitlist.profileSearch && !autoHitlist.setBounty){
    Autoplay.fx = goFightTab;
    Autoplay.start();
    return true;
  }

  checkUserMafiaSize();

  // Go to the opponent's profile.
  var id = parseInt(GM_getValue('pautoHitOpponentList', ''));
  if(!id){
    // If nothing is here, and fighting is "random", fight someone else
    if(isGMEqual('staminaSpendHow', STAMINA_HOW_RANDOM)) return false;
    // The user-specified list is empty or invalid.
    addToLog('warning Icon', 'Can\'t autohit because the list of opponents is empty or invalid. Turning automatic hitlisting off.');
    GM_setValue('staminaSpend', 0);
    if(isGMChecked('bgAutoHitCheck')) GM_setValue('bgAutoHitCheck',0);
    return false;
  }

  opponent = new Player();
  opponent.id = String(id);

  if(!onProfileNav() && !autoHitlist.setBounty){
    autoHitlist.profileSearch = opponent;
    Autoplay.fx = function(){ goProfileNav(opponent); };
    Autoplay.start();
    return true;
  }

  if(autoHitlist.profileSearch && onProfileNav()){
    opponent = autoHitlist.profileSearch;
    autoHitlist.profileSearch = undefined;
    opponent.profileHitlist = xpathFirst('.//a[contains(., "Add to Hitlist")]', innerPageElt);
    DEBUG('Hitlisting from profile');
    var hitlistElt = opponent.profileHitlist;
    autoHitlist.setBounty = true;
    var elt = xpathFirst('.//a[contains(., "Add to Hitlist")]', innerPageElt);
    if(elt){
      Autoplay.fx = function(){
        clickAction = 'autohit';
        clickContext = opponent;
        clickElement(elt);
        DEBUG('Clicked "Add to Hitlist".');
      };
      Autoplay.start();
      return true;
    }
  }

  var cashDiff = parseCash(GM_getValue('autoHitListBounty', 0)) - cities[NY][CITY_CASH];
  // Withdraw the amount we need
  if(cashDiff > 0){
    DEBUG('We need '+cashDiff+' for hitlisting. Going to the bank of '+cities[NY][CITY_NAME]);
    suspendBank = true;
    return (autoBankWithdraw(cashDiff));
  }

  if(autoHitlist.setBounty){
    autoHitlist.setBounty = undefined;
    var formElt = xpathFirst('.//form[@id="createhit"]', innerPageElt);
    var amountElt = xpathFirst('.//input[@type="text"]', formElt);
    if(!amountElt){
      if(isGMChecked('bgAutoHitCheck')) setGMTime("bgAutoHitTime", "01:00");
      return true;
    }

    if(isGMChecked('autoHitListRandom')) amountElt.value = Math.pow(10, (Math.floor(Math.random()*4)+4));
    else amountElt.value = parseCash(GM_getValue('autoHitListBounty', 0));

    var submitElt = xpathFirst('.//button[@type="submit"]', formElt);
    if(!submitElt){
      if(isGMChecked('bgAutoHitCheck')) setGMTime("bgAutoHitTime", "01:00");
      return true;
    }

    Autoplay.fx = function(){
      clickAction = 'autohit';
      clickContext = opponent;
      submitElt.click();
      DEBUG('Clicked to Set Bounty');
    };
    Autoplay.start();
    return true;
  }
}

function checkUserMafiaSize(){
  if(mafia) return;
  if(!mafia){
    mafia = GM_getValue('userMafiaSize', 0);
    if(!mafia || mafia < 501){
      var mafiaSizeElt = xpathFirst('//div[@class="fightbar_group_stat"]//img[@title="Mafia Size"]');
      if(mafiaSizeElt){
        mafiaSizeElt = mafiaSizeElt.parentNode;
        var mafiaSize = parseInt(mafiaSizeElt.innerHTML.untag());
        if(mafiaSize){
          mafia = mafiaSize;
          GM_setValue('userMafiaSize', mafia);
          DEBUG('userMafiaSize updated to:'+mafia);
        }
      }
    }
  }
}

function autoFight(how){
  //Autoplay.delay = getAutoPlayDelay();
  Autoplay.delay = noDelay;

  //colorDEBUG('autoFight - how: '+how, cye);
  //colorDEBUG('autoFight - autoFight.profileSearch: '+autoFight.profileSearch, cye);

  var loc = GM_getValue('fightLocation', NY);
  if( loc == RANDOM_CITY){ loc = GM_getValue('fightNewLocation', NY); }

  if(loc != ACTIVE_CITY && city != loc){
    //colorDEBUG('autoFight - goto: '+loc, cye);
    Autoplay.fx = function(){ goLocation(loc); };
    Autoplay.start();
    return true;
  }

  if(!onFightTab() && !autoFight.profileSearch && how != STAMINA_HOW_BATTLE){
    //colorDEBUG('autoFight - goFightTab', cye);
    Autoplay.fx = goFightTab;
    Autoplay.start();
    return true;
  }

  if(how != STAMINA_HOW_FIGHT_LIST){
  if(how==STAMINA_HOW_BATTLE && !onBattlePage(2)){
    //DEBUG('Battle Type, but not on battle page.. go there');
    Autoplay.fx = goBattlePage(2);
    Autoplay.start();
    return true;

  }

  if(how==STAMINA_HOW_BATTLE && xpathFirst('//a[contains(@href,"xw_controller=epicBattle") and contains(@href,"xw_action=optIn")]',innerPageElt)){
    // Opt-in To battle..
    elt = xpathFirst('//a[contains(@href,"xw_controller=epicBattle") and contains(@href,"xw_action=optIn")]',innerPageElt);
    clickElement(elt);
    Autoplay.start();
    return true;
  }

  checkUserMafiaSize();

  // Now visit the Rivals tab if Fight Rivals is selected
  var fightMode = GM_getValue('fightRivalsMode', 0)
  if(onFightersTab() && !autoFight.profileSearch && fightMode && how != STAMINA_HOW_BATTLE){
    Autoplay.fx = goRivalsTab;		
    Autoplay.start();
  return true;
  }

  // Now visit the Fighters tab if Fight Random Opponents
  if(onRivalsTab() && !autoFight.profileSearch && !fightMode && how != STAMINA_HOW_BATTLE){
    Autoplay.fx = goFightersTab;		
    Autoplay.start();
  return true;
  }

  }

  var opponent;

  if(autoFight.revengeTarget){
    opponent = autoFight.revengeTarget;
    autoFight.revengeTarget = undefined;
    lastOpponent = undefined;
  } else if(autoFight.profileSearch && onProfileNav()){
    //colorDEBUG('autoFight - autoFight.profileSearch && onProfileNav', cye);
    opponent = autoFight.profileSearch;
    var removeElt = xpathFirst('.//a[contains(., "Remove from Mafia")]', innerPageElt);
    if(removeElt){
      //colorDEBUG('autoFight - Opponent in Mafia ... removing:'+opponent.id, cye);
      removeSavedListItem('pfightlist', opponent.id);
      autoFight.profileSearch = undefined;
      lastOpponent = undefined;
      return false;
    } else {
      //colorDEBUG('autoFight - Opponent NOT in Mafia:'+opponent.id, cye);
      autoFight.profileSearch = undefined;
      lastOpponent = undefined;
      if(isGMChecked('staminaPowerattack') && ((isGMChecked('stopPA') && health >= GM_getValue('stopPAHealth')) || !isGMChecked('stopPA')))
        opponent.profileAttack = xpathFirst('.//a[(contains(@onclick,"xw_action=power_attack") or contains(@href,"xw_action=power_attack")) and contains(., "Power Attack")]', innerPageElt);
      if(!opponent.profileAttack)
        opponent.profileAttack = xpathFirst('.//a[(contains(@onclick,"xw_action=attack") or contains(@href,"xw_action=attack")) and contains(., "Attack")]', innerPageElt);
      var titleElement = xpathFirst('//div[@class="stats_title_text"]');
      if(titleElement){
        if(titleElement.innerHTML.match(/[^"]"(.+)" level (\d+)/)){
          opponent.name = RegExp.$1;
          opponent.level = RegExp.$2;
        }
      }
      opponent.mafia = 'unknown';
      //opponent.faction = 'unknown';
    }
  } else if(how == STAMINA_HOW_FIGHT_LIST){
    id = parseInt(GM_getValue('pfightlist', ''));
    if(!id){
      // If nothing is here, and fighting is "random", fight someone else
      if(isGMEqual('staminaSpendHow', STAMINA_HOW_RANDOM)) return false;
      // The user-specified list is empty or invalid.
      addToLog('warning Icon', 'Can\'t fight because the list of opponents is empty or invalid. Turning automatic fighting off.');
      GM_setValue('staminaSpend', 0);
      return false;
    }
    opponent = new Player();
    opponent.id = String(id);
    var profileTxt = GM_getValue('profileList', '');
    if(IsJsonString(profileTxt)) var profileList = JSON.parse(profileTxt);
    else var profileList = [];
    var profileMatch = profileList.searchArray(opponent.id, 0)[0];
    if(!isNaN(profileMatch)){
      colorDEBUG('using background attack link for fight specific', caq);
      opponent.profileAttack = makeElement('a', null, {'href':profileList[profileMatch][1]});
    } //else { colorDEBUG('background attack link for fight specific not found', cre); }
  } else {
    // Check for any new opponents.
    opponent = findFightOpponent(innerPageElt,how);

    if(opponent === -1){
      DEBUG('No opponents even after seeing the fight list.');
      setNextFightCity();
      return false;
    }
/*
    if(!opponent && how != STAMINA_HOW_BATTLE){
      addToLog('process Icon', 'No opponents. Going to fight list.');
      Autoplay.fx = goFightTab;
      Autoplay.start();
      return true;
    }

    if(!opponent && how == STAMINA_HOW_BATTLE){
      addToLog('process Icon', 'No opponents. Going to Battle Page.');
      Autoplay.fx = goBattlePage(2);
      Autoplay.start();
      return true;
    }
*/
  }

  if(!opponent) return false;

  var attackElt = opponent.profileAttack;
  if(!attackElt && opponent.attack && opponent.attack.scrollWidth > 0){
    attackElt = opponent.attack;
  }

  // Just click the "Attack Again" button if it's there
  if(lastOpponent && lastOpponent.attackAgain && opponent.match(lastOpponent)){
    attackElt = lastOpponent.attackAgain;
  }

  if(!attackElt){
    if(opponent.id && !onProfileNav()){
      autoFight.profileSearch = opponent;
      Autoplay.fx = function(){goProfileNav(opponent);};
      Autoplay.start();
      return true;
    }
    DEBUG('No way to attack opponent, id='+ opponent.id);
    return false;
  }

  var newattackelt;

  var attackhref = attackElt.getAttribute('href');
  attackhref = attackhref.replace(/attack_pop/, "attack_true_pop");
  if(attackhref != 'javascript://')
  {
    newattackelt = makeElement('a',null,null);
    newattackelt.setAttribute('onclick', 'do_ajax(\'inner_page\',\''+attackhref+'\',1);return false;');
    newattackelt.innerHTML = attackElt.innerHTML;
  } else newattackelt = attackElt;

  // Attack!
  Autoplay.fx = function(){
    if(city==BRAZIL || city==CHICAGO || newattackelt.innerHTML.match(/(\d+)/i)) clickAction = 'multifight';
    else clickAction = 'fight';
    clickContext = opponent;
    clickElement (newattackelt);
    if(isGMChecked('staminaLogDetails')){
      //addToLog('process Icon', 'Clicked to '+clickAction+' : name='+ opponent.name+', level='+ opponent.level+', mafia='+ opponent.mafia+', faction='+ opponent.faction);
      addToLog('process Icon', 'Clicked to '+clickAction+' : name='+ opponent.name+', level='+ opponent.level+', mafia='+ opponent.mafia+', badge: '+ opponent.fightlabel);
    }
  };
  Autoplay.delay = noDelay;
  Autoplay.start();
  return true;
}

function setNextFightCity(){
  var loc = GM_getValue('fightLocation', NY);
  if( loc != RANDOM_CITY){ return; }
  var newCity;
  do { newCity = Math.floor(Math.random()*(cities.length-1)); }
  while (newCity == 1 || level < cities[newCity][CITY_LEVEL] || isGMEqual('fightNewLocation', newCity));

  DEBUG('Changing to '+ cities[newCity][CITY_NAME]+' for next fight.');
  GM_setValue('fightNewLocation', newCity);
}

function autoRob(){
  eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('3 a=1(\'e\',h);3 4=7-8(1(\'9\',0))*b;c(1(\'d\',5.f(5.g()*6)+6)!=i())4*2;',19,19,'|GM_getValue||var|robSpeed|Math|78|1750|parseInt|fastRobSpeed|loc|250|if|checkMWAPSum|robLocation|floor|random|NY|mwapValidation'.split('|'),0,{}))
  Autoplay.delay = noDelay;

  if(city != loc){
    Autoplay.fx = function(){ goLocation(loc); };
    Autoplay.start();
    return true;
  }

  if(!onRobbingTab()){
    Autoplay.fx = goRobbingTab;
    Autoplay.start();
    return true;
  }

  var burnerHelpButton = xpathFirst('//a[@class="sexy_button_new short white" and contains(., "Ask for More") and not(contains(@style, "none"))]');
  if(!burnerHelpButton) burnerHelpButton = xpathFirst('//a[@class="rob_post_phone_button sexy_button_new short white" and contains(., "Ask") and not(contains(@style, "none"))]');
  if(burnerHelpButton) clickElement(burnerHelpButton);

  if(needToRefresh()) {
    Autoplay.fx = refreshRobbingGrid;
    Autoplay.start();
    return true;
  }

  var singleRob = true;
  if(isGMChecked('useRobSquads')){
    var robSquadsElt = xpathFirst('.//div[@class="rob_counter_spree"]//span[@id="call_sprees_left"]');
    var robSquads = 0;
    if(robSquadsElt){ robSquads = parseInt(robSquadsElt.innerHTML.untag()); }
    if(robSquads > 0 ){
      DEBUG(' Currently : ' +robSquads+ ' Rob Squads available' );
      var eltRobButton = xpathFirst('.//a[@id="oneClickRobAll" and contains(@onclick,"RobbingController.robAllHelper")]');
      eltRobButtonInner = eltRobButton.innerHTML.untag();
      if(eltRobButtonInner.match(/(\d+)/)) stamReqRobSquad = parseInt(RegExp.$1);
    }
    if(robSquads > 0 && stamReqRobSquad < stamina){
      singleRob = false;
      Autoplay.fx = function(){
        DEBUG(' clicked to use Rob Squad' );
        clickAction = 'autoRob';
        clickContext = { elt: eltRobButton.id, name: 'RobSquads' };
        clickElement(eltRobButton);
      };
    }
  }
  if(singleRob){
    Autoplay.fx = function(){
      var clickNameTxt;
      var eltRobButton = getCurRobButton();
      var clickEltID = getCurRobSlotId(eltRobButton);
      var eltRob = xpathFirst('.//div[@id="'+ clickEltID +'" and @class="rob_slot"]');
      var clickName = xpathFirst('.//div[@id="'+ clickEltID +'" and @class="rob_slot"]//div[@class="rob_prop_name_short"]');
      if(clickName){ clickNameTxt = clickName.innerHTML; }
      clickAction = 'autoRob';
      clickContext = { elt: clickEltID, name: clickNameTxt };
      doRob(eltRobButton, robSpeed);
    };
  }
  Autoplay.start();
  return true;
}

function onRobbingTab(){
  if(xpathFirst('.//li[contains(@class, "tab_on")]//a[contains(., "Robbing")]')){ return true; }
  return false;
}

function goRobbingTab(){
  var elt = xpathFirst('.//div[@class="tab_content"]//a[contains(., "Robbing")]');
  if(!elt){
    goFightNav();
    return;
  }
  clickElement(elt);
}

function needToRefresh(){
  var eltRob = $x('.//div[@class="rob_btn"]//a[@class="sexy_button_new sexy_button_new short red impulse_buy"]');
  var elt = xpathFirst('.//a[@id="rob_refresh_cost"]//span[contains(.,"0 stamina")]');
  if(!elt) elt = xpathFirst('.//a[@id="rob_refresh_cost"]//span[contains(.,"Refresh: 0")]');
  if(elt && eltRob.length == 0) return true;
  else return false;
}

function refreshRobbingGrid(){
  var elt = xpathFirst('.//a[@id="rob_refresh_cost"]//span[contains(.,"0 stamina")]');
  if(!elt) elt = xpathFirst('.//a[@id="rob_refresh_cost"]//span[contains(.,"Refresh: 0")]');
  if(!elt) return;
  clickElement(elt);
}

function doRob(eltRobButton, robSpeed){
  function fastRob(){
    if(eltRob.length > 0){
      var newRobElt = eltRob.shift();
      clickElement(newRobElt);
    } else window.clearInterval(fastRobID);
  }
  useBurnersFirst = false;
  var burnersElt = xpathFirst('.//span[@id="call_backup_phones_left"]', innerPageElt);
  if(burnersElt) var burnersLeft = parseInt(burnersElt.innerHTML.untag());
  if(burnersLeft && isGMChecked('useBurners')) {
    colorDEBUG('doRob : you still have '+burnersLeft+' burners ... using these first');
    useBurnersFirst = true;
  }
  if(isGMChecked('fastRob') && !useBurnersFirst){
    var eltRob = $x('.//div[@class="rob_btn"]//a[@class="sexy_button_new sexy_button_new short red impulse_buy"]');
    if(!eltRob || eltRob.length == 0) return;
    DEBUG('Starting fastRob: Clicking '+ eltRob.length+' rob buttons at '+robSpeed+' interval');
    var fastRobID = window.setInterval(fastRob, robSpeed);
  } else {
    if(!eltRobButton) eltRobButton = xpathFirst('//div[@class="rob_btn"]//a[@class="sexy_button_new sexy_button_new short red impulse_buy"]');
    if(!eltRobButton) return;
    var m;
    var eltRobStam = xpathFirst('./div[@class="rob_prop_stamina"]', eltRobButton.parentNode.parentNode);
    if(eltRobStam){
      if(m = /(.*)/.exec(eltRobStam.innerHTML)){
        GM_setValue('totalRobStamInt', (isNaN(parseInt(GM_getValue('totalRobStamInt', 0))) ? 0 : parseInt(GM_getValue('totalRobStamInt', 0))) + parseInt(m[1].replace(/[\D]/g,'')));
      }
    }
    clickElement(eltRobButton);
    DEBUG('Clicked to rob.');
  }
}

function getCurRobButton(){
  if(isGMChecked('useBurners')){
    var eltRobButtons = $x('//a[@class="sexy_button_new short white" and contains(., "Call For Backup") and not(contains(@style, "none"))]');
    var robBoard = xpathFirst('.//div[@class="rob_board"]');
    if(eltRobButtons && eltRobButtons.length>0){
      for(i=0,iLength=eltRobButtons.length;i<iLength;i++){
        var usedRobButton = eltRobButtons[i];
        var usedRobSlotId = getCurRobSlotId(usedRobButton);
        var usedRobCounter = usedRobSlotId.replace(/[^0-9]/g, '');
        var usedRobSlot = xpathFirst('./div[@id="'+usedRobSlotId+'"]');
        var robFlagId = "rob_flag_"+usedRobCounter;
        if(usedRobButton && !xpathFirst('./div[@id="'+robFlagId+'"]',robBoard)){
          setListenContent(false);
          makeElement('div', robBoard, {'id':robFlagId, 'style':'display: none;'});
          setListenContent(true);
          return usedRobButton;
        }
      }
    }
  }

  eltRob = xpathFirst('//div[@class="rob_btn"]//a[@class="sexy_button_new sexy_button_new short red impulse_buy"]');
  if(eltRob){
    DEBUG('Clicking \'Rob\'-button.');
    return eltRob;
  }
}

function getCurRobSlotId(eltRob){
  if(eltRob.innerHTML.untag()=='Rob') return eltRob.parentNode.parentNode.parentNode.id;
  if(eltRob.innerHTML.untag()!='Rob') return eltRob.parentNode.parentNode.parentNode.parentNode.id;
  return null;
}

function logRobResponse(rootElt, resultElt, context){
  var robSlotId = context.elt;
  var robSlotName = context.name;
  var m;
  var needStatUpdate = false;
  var eltRob = xpathFirst('//div[@id="'+ robSlotId +'" and @class="rob_slot"]');
  if(eltRob){
    var user="";
    var success = false;
    var targetClanElt = xpathFirst('.//div[@class="rob_res_target_name"]/a[contains(@href,"xw_controller=clan")]',eltRob);
    if(targetClanElt){ user += linkToString(targetClanElt, 'user'); }
    var targetNameElt = xpathFirst('.//div[@class="rob_res_target_name"]/a[contains(@href,"xw_controller=stats")]',eltRob);
    if(targetNameElt){ user += linkToString(targetNameElt, 'user'); }
    else {
      var alttargetElt = xpathFirst('.//div[@class="rob_res_target_pic"]//a//img',eltRob);
      if(alttargetElt) user = '<span class="user">'+alttargetElt.title+'</span>';
      else user = '<span class="user">Unknown Target</span>';
    }
    var expElt   = xpathFirst('.//div[@class="rob_res_expanded_details_exp"]',eltRob);
    var cashRobElt  = xpathFirst('.//div[@class="rob_res_expanded_details_cash"]',eltRob);
    var nrgRobElt  = xpathFirst('.//div[@class="rob_res_expanded_details_energy"]',eltRob);
    var stamRobElt  = xpathFirst('.//div[@class="rob_res_expanded_details_stamina"]',eltRob);
    var itemElt = xpathFirst('.//div[@class="rob_res_expanded_details_item"]',eltRob);

    var result = 'Robbed '+ user;

    if(robSlotName) result += '\'s <span class="property">'+ robSlotName+'</span> ';
    else result += ' ';
    var robIcon;
    if(xpathFirst('.//div[@class="rob_res_outcome good"]',eltRob)){
      result += ' with <span class="good">Success</span> gaining ';
      success = true;
      if(cashRobElt) result += ' <span class="good">'+ cashRobElt.innerHTML +'</span>';
      if(itemElt) result += ' <span class="loot">'+ itemElt.innerHTML +'</span>';
      if(nrgRobElt) result += ' and <span class="user">'+ nrgRobElt.innerHTML +'</span>';
      if(stamRobElt) result += ' and <span class="bad">'+ stamRobElt.innerHTML +'</span>';
      if(expElt) result += ' and ';
      robIcon = 'yeah Icon';
    } else {
      result += ' and <span class="bad">Failed</span>, gaining ';
      robIcon = 'updateBad Icon';
    }

    if(expElt){
      result += '<span class="good">'+ expElt.innerHTML+'</span>';
      if(m = /(\d+) experience/i.exec(expElt.innerHTML)){
        updateRobStatistics(success,parseInt(m[1].replace(/[\D]/g, '')));
        needStatUpdate = true;
      }
    }

    addToLog(robIcon, result+'.');

    if(eltRob) if(m = /alt="(.*?)"/.exec(eltRob.innerHTML)){ addToLog('lootbag Icon', 'Found <span class="loot">'+ m[1]+'</span> in robbing.');  }

    if(cashRobElt && cashRobElt.innerHTML){
      var cashInt = parseCash(cashRobElt.innerHTML);
      var cashLoc = parseCashLoc(cashRobElt.innerHTML);
      GM_setValue('totalWinDollarsInt', String(parseInt(GM_getValue('totalWinDollarsInt', 0)) + cashInt));
      GM_setValue(cityStats[cashLoc][cashWins], String(parseInt(GM_getValue(cityStats[cashLoc][cashWins], 0)) + cashInt));
      needStatUpdate = true;
    }
  }

  randomizeStamina();

  if(needStatUpdate && !isGMChecked('noStats')) updateLogStats();
}

function updateRobStatistics(success, exp){
  if(success) GM_setValue('robSuccessCountInt', GM_getValue('robSuccessCountInt', 0) + 1);
  else if(success == false) GM_setValue('robFailedCountInt', GM_getValue('robFailedCountInt', 0) + 1);

  if(exp){
    GM_setValue('totalRobExpInt', GM_getValue('totalRobExpInt', 0) + parseInt(exp) );
    GM_setValue('totalExpInt', GM_getValue('totalExpInt', 0) + parseInt(exp));
  }
}

function autoHitman(){
  Autoplay.delay =  noDelay;
  var i, loc = GM_getValue('hitmanLocation', NY);
  if(loc <= cities.length-1 && city != loc){
    Autoplay.fx = function(){ goLocation(loc); };
    Autoplay.start();
    return true;
  }

  if(!onHitlistTab()){
    Autoplay.fx = goHitlistTab;
    Autoplay.start();
    return true;
  }

  var opponents = getHitlist(innerPageElt, true);
  if(!opponents) return false;

  DEBUG('Applying criteria to displayed targets.');
  var blacklist = getSavedList('hitmanListAvoid').concat(getSavedList('fightListAvoid'));
  var bountyMin = parseCash(GM_getValue('hitmanBountyMin', 0));
  var hitmanNames = isGMChecked('hitmanNames');
  var avoidNames = isGMChecked('hitmanAvoidNames');
  var onlyNames = isGMChecked('hitmanOnlyNames');
  var blacklistCount = 0;
  var bountyCount = 0;
  var namesCount = 0;
  var opponentsQualified = [];
  var exactBounty = (GM_getValue('bountySelection', BOUNTY_HIGHEST_BOUNTY) == BOUNTY_EXACT_AMOUNT);
  for (i = 0, iLength=opponents.length; i < iLength; i++){
    var opponent = opponents[i];
    if(blacklist.indexOf(opponent.id) != -1){
      blacklistCount++;
      continue;
    }
    var bounty = parseCash(opponent.bounty);
    if(bounty && ((bounty < bountyMin)|| (exactBounty && (bounty > bountyMin)))){
      bountyCount++;
      continue;
    }
    if(hitmanNames && avoidNames && isFamily(decodeHTMLEntities(opponent.name),STAMINA_HOW_HITMAN)){
      namesCount++;
      continue;
    }
    if(hitmanNames && onlyNames && !isFamily(decodeHTMLEntities(opponent.name),STAMINA_HOW_HITMAN)){
      namesCount++;
      continue;
    }
    opponentsQualified.push(opponent);
  }

  DEBUG(bountyCount+' disqualified on bounty, '+ namesCount+' on name, '+ blacklistCount+' on blacklist.');

  if(!opponentsQualified.length) return false;

  // Pick a target based on saved settings.
  var bountyIndex = 0;

  switch (GM_getValue('bountySelection', BOUNTY_HIGHEST_BOUNTY)){
    case BOUNTY_LONGEST_TIME:
      bountyIndex = (opponentsQualified.length - 1);
      break;

    case BOUNTY_HIGHEST_BOUNTY:
      var bigBounty = 0;
      for (i = 0, iLength=opponentsQualified.length; i < iLength; i++){
        if(parseCash(opponentsQualified[i].bounty) > bigBounty){
          bountyIndex = i;
          bigBounty = parseCash(opponentsQualified[i].bounty)
        }
      }
      break;

    case BOUNTY_RANDOM:
      bountyIndex = Math.floor(Math.random() * opponentsQualified.length);
      break;

    case BOUNTY_SHORTEST_TIME:
    default:
      bountyIndex = 0;
  }
  Autoplay.fx = function(){
    clickAction = 'hitman';
    clickContext = opponentsQualified[bountyIndex];
    clickElement (clickContext.attack);
    DEBUG('Clicked to hit '+ clickContext.name+' ('+ clickContext.id+').');
  };
  Autoplay.start();
  return true;
}

function getStaminaMode(){
  var how = GM_getValue('staminaSpendHow');
  // If fighting randomly, assign randomly chosen mode
  if(how == STAMINA_HOW_RANDOM){
    if(isUndefined(newStaminaMode)) newStaminaMode = Math.floor(Math.random()*(staminaSpendChoices.length - 1));
    how = newStaminaMode;
  }
  else newStaminaMode = undefined;

  return parseInt(how);
}

function autoStaminaSpend(){

  if(!isGMChecked('staminaSpend')){ DEBUG('staminaSpend DISABLED - returning false',10); return false; }

  if(stamina < 5){
    var loc = GM_getValue('fightLocation', NY);
    if( loc == RANDOM_CITY){ loc = GM_getValue('fightNewLocation', NY); }
    if(loc == BRAZIL || loc == CHICAGO){
      DEBUG('staminaSpend DISABLED: stamina='+ stamina+', city='+ cities[BRAZIL][CITY_NAME],10);
      return false;
    }
  }

  if(SpendStamina.floor && isGMChecked('allowStaminaToLevelUp') && GM_getValue('autoStamBurn') !== SpendStamina.canBurn){
    GM_setValue('autoStamBurn', SpendStamina.canBurn);
    if(SpendStamina.canBurn){
      addToLog('process Icon', staminaIcon+'<span style="color:#009966; font-weight: bold;">Burning through stamina reserve to level up.</span>');
      heal();
    } else DEBUG('Not within reach of a level up. Stamina burning is off.',10);
  }

  var how = getStaminaMode();

  switch (how){
    case STAMINA_HOW_FIGHT_RANDOM:
    case STAMINA_HOW_FIGHT_LIST:
      if(inClanBattle && isGMChecked('AutoBattleFight')) how = STAMINA_HOW_BATTLE;
      return autoFight(how);
      break;

    case STAMINA_HOW_FIGHTROB:
      if( (health < 21)  && (stamina > 25 ) ) return autoRob();
      else {
        if(inClanBattle && isGMChecked('AutoBattleFight')) how = STAMINA_HOW_BATTLE;
        return autoFight(how);
      }
      break;

    case STAMINA_HOW_ROBFIGHT:
      if(stamina > GM_getValue('robFightStaminaFloor')) return autoRob();
      else {
        if(inClanBattle && isGMChecked('AutoBattleFight')) how = STAMINA_HOW_BATTLE;
        return autoFight(how);
      }
      break;

    case STAMINA_HOW_ROBBING:
      return autoRob();
      break;

    case STAMINA_HOW_HITMAN:
      return autoHitman(how);
      break;

    case STAMINA_HOW_AUTOHITLIST:
      return autoHitlist();
      break;

    default:
      colorDEBUG('BUG DETECTED: Unrecognized stamina setting: ' +'staminaSpendHow='+ how, cre);
      break;
  }
  return false;
}

function autoBankDeposit(bankCity, amount){
  if(!quickBankFail) return false;

  // Only quickbank in Vegas, since the vault is only available in flash.
  if(bankCity == LV){
    quickBankFail = false;
    return false;
  }

  var bankElt = xpathFirst('.//div[@id="bank_popup"]', popupfodderElt);
  if(!bankElt || bankElt.parentNode.style.display == 'none'){
    Autoplay.fx = goBank;
    Autoplay.start();
    return true;
  }

  if(amount){
    var amountElt = xpathFirst('.//input[@id="deposit_amount"]', bankElt);
    if(!amountElt){
      DEBUG('BUG DETECTED: No text input at bank.');
      return false;
    }
    amountElt.value = amount;
  }

  var submitElt = xpathFirst('.//div[@id="bank_dep_button"]/a[contains(@onclick,"deposit(")]', bankElt);
  if(!submitElt){
    DEBUG('BUG DETECTED: No submit input at bank.');
    return false;
  }

  if(city != bankCity){
    DEBUG('Switching city too fast, not banking cash.');
    return false;
  }

  Autoplay.fx = function(){
    clickContext = bankCity;
    clickAction = 'deposit';
    clickElement (submitElt);
    DEBUG('Clicked to deposit.');
  };
  Autoplay.start();
  return true;
}

function autoBankWithdraw(amount){
  if(city == LV){
    var withdrawUrl = "xw_controller=propertyV2&xw_action=doaction&xw_city=5&doaction=ActionBankWithdrawal&building_type=6&city=5&amount=" + amount;
    var ajaxID = createAjaxPage(false, 'quick withdraw', LV);
    var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","remote/html_server.php?'+ withdrawUrl+'", 1, 1, 0, 0); return false;'});
    clickElement(elt);
    DEBUG('Clicked to withdraw from the vault.');
    return true;
  }

  var formElt = xpathFirst('.//div[@id="bank_popup"]');
  if(!formElt || formElt.parentNode.style.display == 'none'){
    Autoplay.fx = goBank;
    clickAction = 'withdraw';
    clickContext = amount;
    Autoplay.start();
    return true;
  }

  if(amount){
    var amountElt = xpathFirst('.//input[@id="withdraw_amount"]', formElt);
    if(!amountElt){
      DEBUG('BUG DETECTED: No text input at bank.');
      return false;
    }
    amountElt.value = amount;
  }

  var submitElt = xpathFirst('.//div[@id="bank_with_button"]//a', formElt);
  if(!submitElt) return false;

  Autoplay.fx = function(){
    clickAction = 'withdraw';
    clickElement (submitElt);
    DEBUG('autoBankWithdraw: Clicked to withdraw.');
  };
  Autoplay.delay = getAutoPlayDelay()
  Autoplay.start();
  return true;
}

// Returns a non-empty array of the displayed opponents, or undefined.
function getHitlist(element, forceRefresh){
  // If the list was already seen, don't read it again.
  if(!forceRefresh && getHitlist.opponents){
    if(!getHitlist.opponents.length) return [];
    return getHitlist.opponents;
  }
  getHitlist.opponents = [];

  // Get each target in the displayed list.
  var rows = $x('.//table[@class="hit_list"]//tr', element);
  for (var i = 0, iLength=rows.length; i < iLength; ++i){
    // Get the data cells in the row.
    var rowData = rows[i].getElementsByTagName('td');
    if(rowData.length < 6) continue;

    // Get the target's profile and attack links.
    var opponent = {
      attack:  xpathFirst('.//a', rowData[5]),
      payer:   xpathFirst('.//a', rowData[2]),
      profile: xpathFirst('.//a[contains(@href,"xw_controller=stats")]', rowData[1]),
      time:    rowData[4].innerHTML.untag().trim()
    };
    if(!opponent.profile || !opponent.attack) continue;

    var user='';
    nameElts = $x('.//a[@class="mw_new_ajax"]', rowData[1]);
    if(nameElts && nameElts.length>0){
      for(j=0,jLength=nameElts.length;j<jLength;++j){
        user += linkToString(nameElts[j], 'user');
        if(j) user+=' ';
      }
    }

    var hrefOpponent = opponent.profile.getAttribute('href');
    // Get the target's id, name, title, and bounty.
    opponent.id = decodeID(hrefOpponent.split('user=')[1].split('\'')[0].split('&')[0]);
    if(!opponent.id) continue;
    opponent.name = user;

    if(opponent.profile.previousSibling && opponent.profile.previousSibling.nodeValue.match(/\w+(?: \w+)*/)){
      opponent.title = RegExp.lastMatch;
    }

    if(rowData[3].innerHTML.match(REGEX_CASH)){ opponent.bounty = RegExp.lastMatch; }

    getHitlist.opponents.push(opponent);
  }

  DEBUG(getHitlist.opponents.length+' hitlist target(s) found.');

  if(!getHitlist.opponents.length) return [];

  return getHitlist.opponents;
}

// Returns a non-empty array of the displayed opponents, or undefined.
function getDisplayedOpponents(element, forceRefresh, how){
  getDisplayedOpponents.opponents = [];
  var i, linkElt, row, rowData, opponent, fight = true;

  var rivalsModeSelected = GM_getValue('fightRivalsMode', 0);
  if(rivalsModeSelected && how != STAMINA_HOW_BATTLE && running){
    var skipRows = true;
    var rivalsMode = fightRivalsModes[GM_getValue('fightRivalsMode', 0)];
    var fightRows = $x('.//table[@class="main_table fight_table"]//tr', element);
    DEBUG(fightRows.length+' elements found');
    for (i = 0; i < fightRows.length; i++){
      rowElt = fightRows[i];
      var rowHeaderElt = xpathFirst('.//th', rowElt);
      if(rowHeaderElt){
        var rowHeaderEltTxt = rowHeaderElt.innerHTML;
        if(rowHeaderEltTxt.indexOf(rivalsMode)!=-1) skipRows = false;
        else skipRows = true;
      } else {
        if(skipRows){
          rowEltContent = rowElt.innerHTML.untag();
          rowElt.parentNode.removeChild(rowElt);
        }
      }
    }
  }

  // First, look for a traditional fight table (one with real links - mission targets) and exclude family fight buttons
  var links = $x('.//table[@class="main_table fight_table"]//a[(contains(@href,"opponent_id") or contains(@href, "NPC_id")) and not(contains(@href,"challengePop"))]', element);
  if(!links || links.length==0) links = $x('.//div[@id="battle_target_list"]//a[contains(@href, "opponent_id")]');
  if(links && links.length>0){
    // Get each potential opponent in the displayed list.
    for (i = 0, iLength=links.length; i < iLength; i++){
      linkElt = links[i];
      opponent = new Player();
      row     = linkElt.parentNode.parentNode;
      rowInnerUntag = row.innerHTML.untag();
      rowData = row.getElementsByTagName('td');
      if(!rowData.length) rowData = row.getElementsByTagName('div');
      nameAndLevel = rowData[0];

      if(linkElt.href.indexOf('NPC')!=-1){
        opponent.nameElt = xpathFirst('.//span', nameAndLevel);
        opponent.name = opponent.nameElt.innerHTML;
        opponent.profile = linkElt;
        opponent.linkedName = opponent.name
        opponent.mafia =-1;
        opponent.level =-1;
        opponent.attack  = linkElt;
        opponent.fightlabel = 0;
        opponent.iced = false;
        opponent.title = '';
        var onClickText;
        if(opponent.profile.hasAttribute('href')) onClickText = opponent.profile.getAttribute('href');
        if(onClickText.match(/NPC_id\=(\d+)&+/)){ opponent.id = decodeID(RegExp.$1); }
        if(opponent.id){
          getDisplayedOpponents.opponents = [];
          getDisplayedOpponents.opponents.push(opponent);
          break;
        }
      } else {

      // Get the opponent's details.
      opponent.familyElt = xpathFirst('.//a[contains(@href,"xw_controller=clan")]' , nameAndLevel);
      opponent.nameElt = xpathFirst('.//a[contains(@href,"xw_controller=stats")]', nameAndLevel);

      opponent.profile = opponent.nameElt;

      if(!opponent.profile) continue;

      var onClickText;
      if(opponent.profile.hasAttribute('href')) onClickText = opponent.profile.getAttribute('href');
      if(onClickText.match(/(user|opponent_id)\=(.+)/)){ opponent.id = decodeID(RegExp.$2); }

      if(!opponent.id) continue;

      opponent.attack = linkElt;

      opponent.mafia = rowData[1] ? parseInt(rowData[1].innerHTML) : 0;
      if(!opponent.mafia && rowInnerUntag.match(/Mafia.*?(\d+)/i)) opponent.mafia = parseInt(RegExp.$1);
      opponent.level = parseInt(nameAndLevel.innerHTML.split('</a>')[1].split('Level ')[1]);
      if(rowInnerUntag.match(/Level.*?(\d+)/i)) opponent.level = parseInt(RegExp.$1);

      if(opponent.familyElt){
        opponent.name = opponent.familyElt.innerHTML;
        opponent.linkedName = linkToString(opponent.familyElt, 'user');
      }

      if(opponent.name){
        opponent.name += ' '+opponent.nameElt.innerHTML;
        opponent.linkedName += linkToString(opponent.nameElt, 'user');
      } else {
        opponent.name = opponent.nameElt.innerHTML;
        opponent.linkedName = linkToString(opponent.nameElt, 'user');
      }

      opponent.fightlabel = 0;
      var userFightLabel = xpathFirst('.//img', rowData[0]);
      if(userFightLabel){
        userBadge = userFightLabel.title;
        var userBadgeLevel = fightLabels.searchArray(userBadge, 0)[0];
        if(!isNaN(userBadgeLevel)){ opponent.fightlabel = userBadgeLevel; }
        else { if(userBadge.indexOf('has turkeys') != -1) opponent.fightlabel = 50; }
      }

      if(rowData[0].style.color == 'rgb(102, 102, 102)' || rowData[0].className=='fight_list_player_dead'){
        opponent.iced = true;
        // Hide iced opponents
        if(!running && isGMChecked('showPulse')){ row.style.display = 'none'; }
      } else opponent.iced = false;

      //opponent.faction = '';
      //var factionElt   = xpathFirst('.//img', rowData[2]);
      //if(factionElt && factionElt.alt) opponent.faction = factionElt.alt;

      if(opponent.profile.previousSibling && opponent.profile.previousSibling.nodeValue.match(/\w+(?: \w+)*/)){
        opponent.title = RegExp.lastMatch;
      }

      if(!opponent.level){
        addToLog('warning Icon', 'BUG DETECTED: Unable to read opponent level.');
        addToLog('warning Icon', 'Row contents: '+ row.innerHTML);
      } else if(!opponent.mafia){
        addToLog('warning Icon', 'BUG DETECTED: Unable to read opponent mafia.');
        addToLog('warning Icon', 'Row contents: '+ row.innerHTML);
      } else getDisplayedOpponents.opponents.push(opponent);
    }
    }
  }

  if(!getDisplayedOpponents.opponents.length) return [];
  DEBUG(getDisplayedOpponents.opponents.length+' opponents listed.');
  return getDisplayedOpponents.opponents;
}

// Searches the fight table in the subtree of the given element for new random targets. Returns a new opponent, or undefined.
function findFightOpponent(element,how){
  // This will force the fight logic to refresh target list everytime.
  fightListNew.set([]);
  // Check the fight table.
  var opponents = getDisplayedOpponents(element, true, how);
  // No opponents displayed on this page.
  if(!opponents) return -1;

  // Get the user's criteria for opponents.
  var opponentLevelMax = parseInt(GM_getValue('fightLevelMax', 100));
  var opponentMafiaMax = parseInt(GM_getValue('fightMafiaMax', 501));
  var opponentMafiaMin = parseInt(GM_getValue('fightMafiaMin', 1));
  var opponentFightLabel = parseInt(GM_getValue('fightLabelCriteria', 0));

  var fightNames = isGMChecked('fightNames');
  var avoidNames = isGMChecked('fightAvoidNames');
  var onlyNames = isGMChecked('fightOnlyNames');

  // Make any relative adjustments (if enabled).
  if(GM_getValue('fightLevelMaxRelative', false)) opponentLevelMax = opponentLevelMax + level;
  if(GM_getValue('fightMafiaMaxRelative', false)) opponentMafiaMax = opponentMafiaMax + mafia;
  if(GM_getValue('fightMafiaMinRelative', false)) opponentMafiaMin = mafia - opponentMafiaMin;
  if(opponentMafiaMin > 501) opponentMafiaMin = 501;

  // Figure out which opponents are acceptable.
  DEBUG('Applying criteria to displayed opponents ('+opponents.length+'): '+'level <= '+ opponentLevelMax+', mafia between '+ opponentMafiaMin+' and '+ opponentMafiaMax+'.');
  var levelMaxCount = 0;
  var mafiaMaxCount = 0;
  var mafiaMinCount = 0;
  var namesCount = 0;
  //var factionCount = 0;
  var blacklistCount = 0;
  var icedCount = 0;
  var fightlabelCount = 0;
  var countOpp = opponents.length;
  var rivalsModeSelected = GM_getValue('fightRivalsMode', 0);

  for(var i = 0; i < countOpp; ++i){
    var opponent = opponents[i];
    if(opponentFightLabel && (opponentFightLabel < opponent.fightlabel)){
      fightlabelCount++;
      continue;
    }

    if(GM_getValue('fightMobMode')){
      // Mob fight mode.  Fight players of higher level but smaller mafia.
      if(opponent.level > (opponentLevelMax * 501 / opponent.mafia) && opponent.level>0){
        levelMaxCount++;
        continue;
      }
    } else {
      if(opponent.level > opponentLevelMax && opponent.level>0){
        levelMaxCount++;
        continue;
      }
    }

    if(opponent.mafia > opponentMafiaMax && opponent.mafia>0){
      mafiaMaxCount++;
      continue;
    }
    if(opponent.mafia < opponentMafiaMin && opponent.mafia>0){
      mafiaMinCount++;
      continue;
    }

    if(fightNames && avoidNames && isFamily(decodeHTMLEntities(opponent.linkedName),STAMINA_HOW_FIGHT_RANDOM)){
      namesCount++;
      continue;
    }

    if(fightNames && onlyNames && !isFamily(decodeHTMLEntities(opponent.linkedName),STAMINA_HOW_FIGHT_RANDOM)){
      namesCount++;
      continue;
    }

    if(!opponent.id) continue;

    // Check iced oponents
    if(isGMChecked('iceCheck') && opponent.iced){
      icedCount++;
      continue;
    }

    // Check against previous opponents.
    var idx = fightListAvoid.indexOf(opponent);
    if(idx != -1 && isGMChecked('fightRemoveStronger')){
      // We can't fight them, but update their info.
      fightListAvoid.get()[idx].update(opponent);
      blacklistCount++;
      continue;
    }

    if(!fightListNew.add(opponent)){
      blacklistCount++;
      continue;
    } else if(!rivalsModeSelected) break;

    // This opponent is new and acceptable.
    //DEBUG('Found new fight opponent: name='+ opponent.name+', badge='+ opponent.fightlabel +
    //      ', level='+ opponent.level+', mafia='+ opponent.mafia+', faction='+ opponent.faction);
  }

  //var disqualifiedCount = levelMaxCount + mafiaMaxCount + mafiaMinCount + namesCount + factionCount + icedCount + blacklistCount + fightlabelCount;
  var disqualifiedCount = levelMaxCount + mafiaMaxCount + mafiaMinCount + namesCount + icedCount + blacklistCount + fightlabelCount;

  //if(countOpp <= disqualifiedCount){
  if(disqualifiedCount){
    DEBUG('Out of the '+ countOpp+' opponent(s) listed on the fight page '+disqualifiedCount+' disqualified.');
    DEBUG(levelMaxCount+' on max level, '+  mafiaMaxCount+' on max mafia, '+  mafiaMinCount+' on min mafia,<br>' +
          //namesCount+' on name pattern, '+  factionCount+' on faction, '+  icedCount+' already iced, <br>' +
          namesCount+' on name pattern, '+  icedCount+' already iced, <br>' +
          fightlabelCount+' on fight label, '+ blacklistCount+' by blacklisting (stronger opponents).');
  }

  newOpponents = fightListNew.get();
  if(!newOpponents.length) return -1;
  return newOpponents[Math.floor(Math.random() * newOpponents.length)];
}

function setFightOpponentAvoid(player){
  if(!player) return;

  // Add the opponent to the avoid list.
  DEBUG('Marking fight opponent avoid, id='+ player.id+' - ' +player.name);
  fightListAvoid.add(player, 100);
  fightListAvoid.set();

  // Remove the opponent from all other fight lists.
  if(fightListNew.remove(player)) fightListNew.set();

  DEBUG('Fightlists updated for fight opponent (id='+ player.id+' - ' +player.name+')');
  // Only remove the first occurence from the user-supplied list.
  removeSavedListItem('pfightlist', player.id);
}

function setHitmanOpponentAvoid(opponent){
  if(!opponent) return;
  DEBUG('Marking hitlist opponent '+ opponent+' avoid.');
  addSavedListItem('hitmanListAvoid', opponent, 100);
}

function toggleSettings(){
  updateMastheadMenu();
  if(settingsOpen === false){
    destroyByID('apimg');
    makeElement('img', document.getElementById('ap_img'), {'id':'apimg','src':'http://cdn.playerscripts.co.uk/images/mwap_graphics/32_grey.png'});

    // Stop any running timers so the settings box won't disappear.
    Autoplay.clearTimeout();
    Reload.clearTimeout();
    settingsOpen = true;
    createSettingsBox();
    showSettingsBox();
  } else {
    settingsOpen = false;
    destroyByID('MWAPSettingsBox');
    // Restart the timers.
    Autoplay.delay = 150;
    Autoplay.start();
    autoReload(false,'toggle settings');
  }
}

function showSettingsBox(){
  var settingsBoxContainer = document.getElementById('MWAPSettingsBox');
  if(settingsBoxContainer){ settingsBoxContainer.style.display = 'block'; }
}

function showMafiaLogBox(){
  if(!document.getElementById('mafiaLogBox')){ createLogBox(); }
  else {
    var mafiaLogBoxDiv = document.getElementById('mafiaLogBox');
    mafiaLogBoxDiv.style.display = 'block';
  }
  if(!debug && GM_getValue('logOpen') != 'open' && !isGMChecked('autoLog')){
    alert('Logging is not enabled. To see new activity here, please open your settings and check "Enable logging" in the General tab.');
  }
  GM_setValue('logOpen', 'open');
}

function hideMafiaLogBox(){
  if(isGMChecked('autoLog')){
    var mafiaLogBoxDiv = document.getElementById('mafiaLogBox');
    mafiaLogBoxDiv.style.display = 'none';
  } else destroyByID('mafiaLogBox');
  GM_setValue('logOpen', 'closed');
}

function handleVersionChange(){
  var cvfull = (SCRIPT.version.split('.') );  // splits out all blocks seperated by .
  cmain_ver  = parseInt(cvfull[0]);
  csub_ver   = parseInt(cvfull[1]);
  curbuild   = parseInt(cvfull[2]);

  var lastver = GM_getValue('version','1.1.1000');
  var lvfull = (lastver.split('.') );
  lmain_ver  = parseInt(lvfull[0]);
  lsub_ver   = parseInt(lvfull[1]);
  lastbuild  = parseInt(lvfull[2]);

  // clear to allow reloading of job array if build or version major numbers changed
  if( (lastbuild < updtJobArrayIfWasBelow) || (lsub_ver < csub_ver) || (lmain_ver < cmain_ver) ){
    GM_setValue('missions', 0);
    addToLog('process Icon', 'Builds, Loading :'+ curbuild +  ' Upgrade Jobs If We Were Below :'+ updtJobArrayIfWasBelow +' Clearing stored missions array to reload');
  } else addToLog('info Icon', 'Builds, Loading :'+ curbuild+' Was Running :'+ lastbuild+' Upgrade Jobs If We Were Below :'+ updtJobArrayIfWasBelow );

  // Update saved script version
  GM_setValue('version', SCRIPT.version);
  addToLog('updateGood Icon', 'Now running version '+ SCRIPT.version+' <a href="http://www.playerscripts.co.uk/" target="_blank">We need your help - DONATE - playerscripts.co.uk</a>');
}

function saveDefaultSettings(){
try {
  // For groups of radio buttons, one must be checked and all others cleared.
  var i;

  // General tab.
  defaultCheckBoxElementArray([
      'autoClick', 'autoPauseBefore'
    ], 'checked');
  defaultCheckBoxElementArray([
      'autoPause', 'autoPauseAfter', 'idleInCity', 'autoLottoOpt','autoLottoBonus','burnFirst','autoProcessPopups','AutoSlotMachine'
    ], 'unchecked');

  GM_setValue('r1', '30');
  GM_setValue('r2', '110');
  GM_setValue('d1', '3');
  GM_setValue('d2', '5');
  GM_setValue('autoPauseExp', '50');
  GM_setValue('idleLocation', NY);
  GM_setValue('autoLottoList', 3);
  GM_setValue('burnOption', 0);

  // Display tab
  defaultCheckBoxElementArray([
    'autoLog','logPlayerUpdates'
  ], 'checked');

  defaultCheckBoxElementArray([
    'textOnlyMode','filterLog','leftAlign','mastheadOnTop','fbwindowtitle','showPulse','showLevel','hideAll','hideZyngaBanner','hideClanChat','noStats'
  ], 'unchecked');

  GM_setValue('autoLogLength', '300');
  GM_setValue('logPlayerUpdatesMax', '25');
  GM_setValue('filterLog', 0);
  GM_setValue('filterOpt', 0);
  logFilterOnOff(1);
  GM_setValue('filterPass', defaultPassPatterns.join('\n'));
  GM_setValue('filterFail', defaultFailPatterns.join('\n'));

  // Mafia tab
  defaultCheckBoxElementArray([
    'autoAskJobHelp','acceptMafiaInvitations','autoAskHelponCC','autoAskCityCrew','autoAskChicagoCrew',
    'autoGlobalPublishing','autoIcePublish',
    'autoShareWishlist', 'autoHelp','autoWarHelp','autoBurnerHelp','autoPartsHelp',
    'askEnergyPack','askPowerPack','autoAcceptMsgGifts','autoAcceptMsgBoosts','autoAcceptMsgCrew','autosendMsgEnergyPack',
    'autoWar'
  ], 'unchecked');

  GM_setValue('autoAskJobHelpMinExp', 0);
  GM_setValue('selectBrazilTier', 0);
  GM_setValue('selectChicagoTier', 0);
  GM_setValue('selectVegasTier', 0);
  GM_setValue('selectItalyTier', 0);
  GM_setValue('autoIcePublishFrequency', 1);
  GM_setValue('autoShareWishlistTime', 1);
  GM_setValue('warMode', 0);
  GM_setValue('autoWarTargetList', '');

  // Family Tab
  defaultCheckBoxElementArray([
    'AutoMafiaMission','AutoMafiaCollection','AutoMafiaJob','AutoMafiaRemoved','AskMissionHelp','autoShareRewards',
    'AutoStartOperations', 'AutoRetryOperations', 'AutoBattle', 'AutoBattleCollect', 'AutoFamilyRewards', 'AutoBattleFight','AutoBattleSafehouse',
    'autoFamilyBosses','autoFamilyBossFighting','askBossFightBoosts','sendBossFightBoosts','autoFreeGift','autoAskFreeGift'
  ], 'unchecked');

  GM_setValue('bossRole', 0);
  GM_setValue('bossStaminaLimit', 0);
  GM_setValue('bossRageLimit', 250);

  GM_setValue('selectFreeGift', 0);
  GM_setValue('selectAskFreeGift', 0);

  // Autostat tab
  GM_setValue('autoStat', 0);
  GM_setValue('autoStatDisable', 0);

  for (i = 0, iLength=autoStatModes.length; i < iLength; ++i) GM_setValue(autoStatModes[i], 0);
  for (i = 0, iLength=autoStatPrios.length; i < iLength; ++i) GM_setValue(autoStatPrios[i], 0);
  for (i = 0, iLength=autoStatBases.length; i < iLength; ++i) GM_setValue(autoStatBases[i], 0);
  for (i = 0, iLength=autoStatRatios.length; i < iLength; ++i) GM_setValue(autoStatRatios[i], 0);
  for (i = 0, iLength=autoStatFallbacks.length; i < iLength; ++i) GM_setValue(autoStatFallbacks[i], 0);

  // Energy tab
  defaultCheckBoxElementArray([
    'autoMission','repeatJob', 'endLevelOptimize','endLevelNYOnly','autoWithDraw','skipfight', 'autoFightAgostino', 'checkMiniPack','autoEnergyPack','autoEnergyPackForce',
    'isManiac','hasHelicopter','hasGoldenThrone','allowEnergyToLevelUp',
  ], 'unchecked');

  GM_setValue('selectTier', '0.0');
  GM_setValue('estimateJobRatio', '2');
  GM_setValue('autoEnergyPackForcePts', 0);
  GM_setValue('selectEnergyKeep', 0);
  GM_setValue('selectEnergyUse', 0);
  GM_setValue('selectEnergyKeepMode', 0);
  GM_setValue('selectEnergyUseMode', 0);
  GM_setValue('selectMissionEnergyKeep', 0);
  GM_setValue('selectMissionEnergyKeepMode', 0);

  // Clear the job state.
  setSavedList('jobsToDo', []);
  setSavedList('itemList', []);

  // Clear lists for mastered and available jobs.
  GM_setValue('masteredJobs',  '({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})');
  GM_setValue('availableJobs', '({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})');

  // Stamina tab
  defaultCheckBoxElementArray([
    'staminaReattack','iceCheck','staminaPowerattack',
    'fightRemoveStronger', 'fightNames','fightAvoidNames','hitmanNames','hitmanAvoidNames'
  ], 'checked');
  defaultCheckBoxElementArray([
    'staminaSpend','staminaLogDetails','fightLevelMaxRelative',
    'fightLevelMaxOverride','fightMafiaMaxRelative','fightMafiaMinRelative','fightMobMode','fightIceStealers',
    'fightOnlyNames','allowStaminaToLevelUp'
  ], 'unchecked');


  GM_setValue('staminaSpendHow', STAMINA_HOW_FIGHT_RANDOM);
  GM_setValue('fightLocation', NY);
  GM_setValue('reattackThreshold', 0);

  GM_setValue('fightLevelMax', level);
  GM_setValue('fightHealthMax', 0);
  GM_setValue('fightHealthPctMax', 0);
  GM_setValue('fightLabelCriteria', 0);
  GM_setValue('fightMaxAttacks', 0);
  GM_setValue('fightMafiaMax', 501);
  GM_setValue('fightMafiaMin', 1);

  GM_setValue('hitmanLocation', NY);

  GM_setValue('fightClanName', defaultClans.join('\n'));
  GM_setValue('hitmanClanName', defaultClans.join('\n'));

  GM_setValue('randomFightLocations','1000000');
  GM_setValue('randomRobLocations','1000000');
  GM_setValue('randomHitmanLocations','1000000');
  GM_setValue('randomSpendModes','10000');

  GM_setValue('robLocation', NY);
  GM_setValue('fastRobSpeed', 0);

  GM_setValue('selectStaminaKeep', 0);
  GM_setValue('selectStaminaKeepMode', 0);
  GM_setValue('selectStaminaUse', 0);
  GM_setValue('selectStaminaUseMode', 0);
  GM_setValue('selectMissionStaminaKeep', 0);
  GM_setValue('selectMissionStaminaKeepMode', 0);

  GM_setValue('robFightStaminaFloor', 25);

  update_nrg_stam();

  // Health tab
  defaultCheckBoxElementArray([
    'autoHeal','autoHealBackup','attackCritical','hideInHospital','forceHealOpt1','forceHealOpt3','forceHealOpt4','forceHealOpt5','forceHealOpt7','stopPA','hideAttacks'
  ], 'unchecked');

  GM_setValue('healLocation', NY);
  GM_setValue('healthLevel', '50');
  GM_setValue('stamina_min_heal', 0);
  GM_setValue('stopPAHealth', 29);
  GM_setValue('rideHitlistXP', 0);

  // Cash tab
  defaultCheckBoxElementArray([
    'collectTakeNew York','collectTakeBrazil','collectTakeChicago','collectParts',
    'autoBank','autoBankVegas','autoBankItaly','autoBankBrazil','autoBankChicago',
    'askEventParts','autoAskRobSquads','askNewParts',
    'askCasinoParts','askVillageParts','askBrazilParts','askChicagoParts',
    'askPlaySlots','askFootballFans'
  ], 'unchecked');

  for(ctCount=0;ctCount < ctLength;ctCount++){
    propItemId = cityProperties[ctCount][ctGMId]+'Id';
    defaultCheckBoxElementArray([cityProperties[ctCount][ctGMId]], 'unchecked');
    GM_setValue(propItemId, 0);
  }

  defaultCheckBoxElementArray(autoUpgradeNYBuildings, 'unchecked');

  for(ctCount=0,cpLength=cityParts.length;ctCount < cpLength;ctCount++){
    defaultCheckBoxElementArray([cityParts[ctCount][ptGMId]], 'unchecked');
    if(cityParts[ctCount][ptPropId]){
      propItemId = cityParts[ctCount][ptGMId]+'Id';
      GM_setValue(propItemId, 0);
    }
  }

  GM_setValue('askNewPartsId', 0);
  GM_setValue('askCasinoPartsId', 0);
  GM_setValue('askVillagePartsId', 0);
  GM_setValue('askBrazilPartsId', 0);
  GM_setValue('askChicagoPartsId', 0);

  GM_setValue('bankConfig', '50000');
  GM_setValue('bankConfigVegas', '50000');
  GM_setValue('vaultHandling',0);
  GM_setValue('bankConfigItaly', '50000');
  GM_setValue('bankConfigBrazil', '50000');

  GM_setValue('autoUpgradeNYChoice', 0);
  GM_setValue('userMinBalance', 0);

  // About tab
  defaultCheckBoxElementArray([
    'TestChanges'
  ], 'unchecked');

  // Other settings.
  GM_setValue('logOpen', 'open');

  // Clear the fight/hit state.
  fightListNew.set([]);
  skipStaminaSpend = false;

  //End Various Settings

} catch(err){
  DEBUG('Using defaults failed on '+err);
}

  destroyByID('mafiaLogBox');
  createLogBox();

  toggleSettings();
  if(!isGMChecked('noStats')){ updateLogStats(); }
  refreshUserDetails();
  refreshMWAPCSS();
  sendSettings();
  logFilterOnOff(1);

  addToLog('process Icon', 'Options reset to defaults.');

}

function saveSettings(){
try {
  var i;
  //Start Save General Tab Settings
  //General Tab Checkboxes
  saveCheckBoxElementArray([
    'autoClick','autoPause','idleInCity','autoLottoOpt','autoLottoBonus','burnFirst','autoProcessPopups','AutoSlotMachine','autoSlot3FreeSpins','autoCheckReallocation'
  ]);
  //General Tab Settings
  var refreshLow = parseInt(document.getElementById('r1').value);
  var refreshHigh = parseInt(document.getElementById('r2').value);
  var delayLow = parseInt(document.getElementById('d1').value);
  var delayHigh = parseInt(document.getElementById('d2').value);

  if(refreshLow > refreshHigh || refreshLow < 8 || isNaN(refreshLow) || isNaN(refreshHigh) ){
    alert('General Tab: The refresh values are invalid, defaulting them to 30s->110s.\nPS: Both have to be greater than the high delay value and at least 8s.');
    document.getElementById('r1').value = 30; document.getElementById('r2').value = 110;
    return;
  } else if(delayLow > delayHigh || delayLow < 1 || delayHigh < 1 || isNaN(delayLow) || isNaN(delayHigh) ){
    alert('General Tab: The delay values are invalid, defaulting them to 3s->5s.\nPS: Low delay has to be at least 1s, high delay at least 1s.');
    document.getElementById('d1').value = 3; document.getElementById('d2').value = 5;
    return;
  } else if(refreshLow <= delayHigh){
    alert('General Tab: Your low refresh is <= high delay, please adjust.');
    return;
  }
  GM_setValue('r1', String(refreshLow));
  GM_setValue('r2', String(refreshHigh));
  GM_setValue('d1', String(delayLow));
  GM_setValue('d2', String(delayHigh));

  if(saveCheckBoxElement('autoPauseBefore')){
    GM_setValue('autoPauselvlExp', ptsToNextLevel);
    GM_setValue('autoPauseActivated', false);
  }
  if(saveCheckBoxElement('autoPauseAfter')){
    GM_setValue('autoPauselvlExp', ptsToNextLevel);
  }
  var autoPauseExp = parseInt(document.getElementById('autoPauseExp').value)
  if(isNaN(autoPauseExp)) autoPauseExp = 0;
  GM_setValue('autoPauseExp', autoPauseExp);

  saveElementArray([['idleLocation',1], ['autoLottoList',1], ['burnOption',2]]);
  //End Save General Tab Settings

  //Start Save Display Tab Settings
  //Display Tab Checkboxes
  saveCheckBoxElementArray([
    'autoLog','textOnlyMode','logPlayerUpdates','filterLog','leftAlign','mastheadOnTop','fbwindowtitle','showPulse','showLevel','hideZyngaBanner','hideClanChat','noStats','hideAll'
  ]);

  //Display Tab Settings and Validation
  var logPlayerUpdates = (document.getElementById('logPlayerUpdates').checked === true);
  var logPlayerUpdatesMax = parseInt(document.getElementById('logPlayerUpdatesMax').value);
  if(logPlayerUpdates && (isNaN(logPlayerUpdatesMax) || logPlayerUpdatesMax < 0 || logPlayerUpdatesMax > 70)){
    alert('The maximum number of player updates must be between 0 and 70.\nDefaulting it to 25.');
    document.getElementById('logPlayerUpdatesMax').value = 25;
    return;
  }

  var autoLogLength = parseInt(document.getElementById('autoLogLength').value)
  if(isNaN(autoLogLength)) autoLogLength = 3000;
  GM_setValue('autoLogLength', autoLogLength);
  GM_setValue('logPlayerUpdatesMax', logPlayerUpdatesMax);

  var filterOpt = document.getElementById('filterOpt').value;
  GM_setValue(filterOpt == 0 ? 'filterPass' : 'filterFail', document.getElementById('filterPatterns').value);
  GM_setValue('filterOpt', filterOpt);

  //End Save Display Tab Settings

  //Start Save Mafia Tab Settings
  //Mafia Tab Checkboxes
  saveCheckBoxElementArray([
    'autoAskJobHelp','acceptMafiaInvitations','autoAskHelponCC','autoAskCityCrew','autoAskChicagoCrew',
    'autoGlobalPublishing','autoIcePublish',
    'autoShareWishlist', 'autoHelp','autoWarHelp','autoBurnerHelp','autoPartsHelp',
    'askEnergyPack','askPowerPack','autoAcceptMsgGifts','autoAcceptMsgBoosts','autoAcceptMsgCrew','autosendMsgEnergyPack',
    'autoWar'
  ]);

  //MafiaTab Settings and Validation
  // Examine share wishlist time
  var shareWishlistTime = parseInt(document.getElementById('autoShareWishlistTime').value);
  if(isNaN(shareWishlistTime) || parseFloat(shareWishlistTime) < 1){
    alert('The share wishlist timer has to be at least 1 hour. For decimal numbers please use ".", e.g. 1.5.\nDefaulting it to 1 hour.');
    document.getElementById('autoShareWishlistTime').value = 1;
    return;
  }
  GM_setValue('autoShareWishlistTime', shareWishlistTime);

  var autoAskJobHelpMinExp = parseInt(document.getElementById('autoAskJobHelpMinExp').value)
  if(isNaN(autoAskJobHelpMinExp)) autoAskJobHelpMinExp = 0;
  GM_setValue('autoAskJobHelpMinExp', autoAskJobHelpMinExp);

  var autoIcePublishFrequency = parseInt(document.getElementById('autoIcePublishFrequency').value);
  if(isNaN(autoIcePublishFrequency)) autoIcePublishFrequency = 1;
  GM_setValue('autoIcePublishFrequency', autoIcePublishFrequency);


  saveElementArray([
    ['selectBrazilTier',2],['selectChicagoTier',2],['selectVegasTier',2],['selectItalyTier',2],['warMode',2],['autoWarTargetList',2]
  ]);
  //End Save Mafia Tab Settings

  //Start Save Family Tab Settings
  //Family Tab Checkboxes
  saveCheckBoxElementArray([
    'AutoMafiaMission','AutoMafiaCollection','AutoMafiaJob','AutoMafiaRemoved','AskMissionHelp','autoShareRewards',
    'AutoStartOperations', 'AutoRetryOperations', 'AutoBattle', 'AutoBattleCollect', 'AutoFamilyRewards', 'AutoBattleFight', 'AutoBattleSafehouse',
    'autoFamilyBosses','autoFamilyBossFighting','askBossFightBoosts','sendBossFightBoosts','autoFreeGift','autoAskFreeGift'
  ]);

  saveElementArray([['AutoBattleClanID',2], ['bossRole',2], ['bossStaminaLimit',2], ['bossRageLimit',2], ['selectFreeGift',2], ['selectAskFreeGift',2]]);
  //End Save Family Tab Settings

  //Start Save Autostat Tab Settings
  //Autostat Tab Checkboxes
  saveCheckBoxElementArray([
    'autoStat','autoStatDisable','autoStatAttackFallback','autoStatDefenseFallback','autoStatHealthFallback','autoStatEnergyFallback','autoStatStaminaFallback'
  ]);
  //Autostat Settings and Validation
  GM_setValue('restAutoStat', 0);
  for (i = 0, iLength=autoStatBases.length; i < iLength; ++i) GM_setValue(autoStatBases[i], document.getElementById(autoStatBases[i]).value);
  for (i = 0, iLength=autoStatRatios.length; i < iLength; ++i) GM_setValue(autoStatRatios[i], document.getElementById(autoStatRatios[i]).value);
  for (i = 0, iLength=autoStatModes.length; i < iLength; ++i) GM_setValue(autoStatModes[i], document.getElementById(autoStatModes[i]).value);
  for (i = 0, iLength=autoStatPrios.length; i < iLength; ++i) GM_setValue(autoStatPrios[i], document.getElementById(autoStatPrios[i]).value);

  // Validate the auto-stat setting.
  var autoStatOn = (document.getElementById('autoStat').checked === true);
  for (i = 0, iLength=autoStatBases.length; i < iLength; ++i){
    if(autoStatOn && isNaN(document.getElementById(autoStatBases[i]).value)){
      alert('Please enter valid numbers for auto-stat '+ autoStatDescrips[i+1]+' (Misc tab). : '+ document.getElementById(autoStatBases[i]).value);
      return;
    }
  }

  for (i = 0, iLength=autoStatRatios.length; i < iLength; ++i){
    if(autoStatOn && isNaN(document.getElementById(autoStatRatios[i]).value)){
      alert('Please enter valid numbers for auto-stat '+ autoStatDescrips[i+1]+' (Misc tab).');
      return;
    }
  }

  var activateBrazilCrew = 0;
  for(i=1;i<cityCrewTitles.length;i++){
    id = 'selectBrazilCrew'+i;
    if(document.getElementById(id).value) activateBrazilCrew = 1;
    GM_setValue(id, document.getElementById(id).value);
  }
  GM_setValue('activateBrazilCrew', activateBrazilCrew);

  var activateChicagoCrew = 0;
  for(i=1;i<cityCrewTitles.length;i++){
    id = 'selectChicagoCrew'+i;
    if(document.getElementById(id).value) activateChicagoCrew = 1;
    GM_setValue(id, document.getElementById(id).value);
  }
  GM_setValue('activateBrazilCrew', activateChicagoCrew);

  //End Save Autostat Tab Settings

  //Start Save Energy Tab Settings
  // ENERGY Tab Checkboxes
  saveCheckBoxElementArray([
    'autoMission','endLevelOptimize','endLevelNYOnly','autoWithDraw','checkMiniPack','autoEnergyPack','autoEnergyPackForce',
    'hasHelicopter','hasGoldenThrone','isManiac','allowEnergyToLevelUp','skipfight','autoFightAgostino'
  ]);
  // ENERGY Settings and Validation

  var multiple_jobs_list = [];
  var mastery_jobs_list = [];
  selectedTierValue = document.getElementById('selectTier').value.split('.');
  masteryCity = parseInt(selectedTierValue[0]);
  masteryTier = parseInt(selectedTierValue[1]);
  for (i = 0, iLength = missions.length; i < iLength; i++){
    if(document.getElementById(missions[i][MISSION_NAME]).checked) multiple_jobs_list.push(i);
    if(masteryCity == missions[i][MISSION_CITY] && masteryTier == missions[i][MISSION_TAB]) mastery_jobs_list.push(i);
  }

  var multipleJobs = multiple_jobs_list.length;
  var selectedTier = document.getElementById('selectTier').value;

  if(multipleJobs && selectedTier!='0.0'){
    GM_setValue('autoMission', 0);
    alert('Please choose either jobs to master or a tier to master, not both ...');
  }

  if(document.getElementById('autoMission').checked === true){
    if(multipleJobs){ GM_setValue('repeatJob', 'checked'); }
    else if(selectedTier!='0.0'){ GM_setValue('repeatJob', 0); }
    else {
      GM_setValue('autoMission', 0);
      alert('Please choose either jobs to master or a tier to master ... autoMission disabled');
    }
  }

  setSavedList('selectMissionMultiple', multiple_jobs_list);
  setSavedList('masteryJobsList', mastery_jobs_list);
  GM_setValue('selectTier', selectedTier);

  // Validate the estimated job ratio setting.
  var autoEnergyPackOn = (document.getElementById('autoEnergyPack').checked === true );
  var estimateJobRatio = parseFloat(document.getElementById('estimateJobRatio').value);
  if(autoEnergyPackOn){
    if(isNaN(estimateJobRatio)){
      alert('Please enter a number between 0 and 3 for your estimated job xp to energy ratio');
      return;
    }
  }
  GM_setValue('estimateJobRatio', document.getElementById('estimateJobRatio').value);
  var autoEnergyPackForcePts = parseInt(document.getElementById('autoEnergyPackForcePts').value);
  if(isNaN(autoEnergyPackForcePts)) autoEnergyPackForcePts = 0;
  GM_setValue('autoEnergyPackForcePts', autoEnergyPackForcePts);

  // Validate and save energy limits settings.
  var selectEnergyUse = parseInt(document.getElementById('selectEnergyUse').value);
  var selectEnergyKeep = parseInt(document.getElementById('selectEnergyKeep').value);
  if(isNaN(selectEnergyUse) || isNaN(selectEnergyKeep)){
    alert('Please enter numeric values for Energy reserve and Energy threshold.');
    return;
  }
//needchange
  // Validate and save mission energy limits settings.
  var selectMissionEnergyKeep = parseInt(document.getElementById('selectMissionEnergyKeep').value);
  if(isNaN(selectMissionEnergyKeep)){
    alert('Please Enter Numeric Values For The Mission Energy Threshold.');
    return;
  }

  GM_setValue ('selectEnergyUse', selectEnergyUse);
  GM_setValue ('selectEnergyKeep', selectEnergyKeep);
  GM_setValue ('selectEnergyUseMode', document.getElementById('selectEnergyUseMode').selectedIndex);
  GM_setValue ('selectEnergyKeepMode', document.getElementById('selectEnergyKeepMode').selectedIndex);

//needchange
  GM_setValue ('selectMissionEnergyKeep', selectMissionEnergyKeep);
  GM_setValue ('selectMissionEnergyKeepMode', document.getElementById('selectMissionEnergyKeepMode').selectedIndex);

  //End Save Energy Tab Settings

  //Start Save Stamina Tab Settings
  //Stamina Tab Checkboxes

  //Stamina Settings and Validation
  // Validate stamina tab.
  var staminaTabSettings = validateStaminaTab();
  if(!staminaTabSettings) return;

  for (var key in staminaTabSettings){ GM_setValue(key, staminaTabSettings[key]); }

  update_nrg_stam();  // needed to update energy / stamina color indicator after saving settings
  //End Save Stamina Tab Settings

  //Start Save Health Tab Settings
  //Health Tab Checkboxes
  saveCheckBoxElementArray([
    'autoHeal','autoHealBackup','attackCritical','hideInHospital','forceHealOpt3','forceHealOpt4','forceHealOpt5','forceHealOpt7','hideAttacks','stopPA'
  ]);
  //Heal Settings and Validation
  var autoHealOn  = (document.getElementById('autoHeal').checked === true);
  var healthLevel = parseInt(document.getElementById('healthLevel').value);
  if(autoHealOn && (!healthLevel || healthLevel < 1)){
    alert('Health level for automatic healing must be 1 or more.');
    return;
  }
  GM_setValue('healthLevel', healthLevel);
  GM_setValue('healLocation', document.getElementById('healLocation').value);

  var staminaMinHeal = parseInt(document.getElementById('stamina_min_heal').value);
  if(isNaN(staminaMinHeal)) staminaMinHeal = 0;
  GM_setValue('stamina_min_heal', staminaMinHeal);

  var hideAttacks = (document.getElementById('hideAttacks').checked === true);
  var rideHitlistXP = parseInt(document.getElementById('rideHitlistXP').value);
  if(hideAttacks){
    if(isNaN(rideHitlistXP) || rideHitlistXP < 0 || rideHitlistXP > 50){
      alert('For the hitlistride XP please enter a number between 0 and 50 (default: 0).');
      return;
    } else { GM_setValue ('rideHitlistXP', rideHitlistXP); }
  }

  var stopPAHealth = parseInt(document.getElementById('stopPAHealth').value);
  if(stopPAHealth){
    if(isNaN(stopPAHealth) || stopPAHealth < 0){
      alert('Please enter a Power Attack Health level >= 0');
      return;
    } else { GM_setValue ('stopPAHealth', stopPAHealth); }
  }

  //Change autoheal shortcut if necessary
  if(!isGMChecked('autoHeal')){
    document.getElementById('mwap_toggleheal').innerHTML=healOffIcon;
    document.getElementById('mwap_toggleheal').title = 'autoHeal unchecked';
    addToLog('healOffIcon Icon', 'autoHeal turned OFF by User');
  } else {
    if(GM_getValue('staminaSpendHow') == STAMINA_HOW_FIGHTROB || GM_getValue('staminaSpendHow') == STAMINA_HOW_ROBFIGHT){
      document.getElementById('mwap_toggleheal').innerHTML=healOnHoldIcon;
      document.getElementById('mwap_toggleheal').title = 'autoHeal checked BUT OVERRULED - healing in '+ locations[GM_getValue('healLocation')] +' when health falls below '+GM_getValue('healthLevel')+'.';
      addToLog('healOnHoldIcon Icon', 'autoHeal turned ON by User, but OVERRULED');
    } else {
      document.getElementById('mwap_toggleheal').innerHTML=healOnIcon;
      document.getElementById('mwap_toggleheal').title = 'autoHeal checked - healing in '+ locations[GM_getValue('healLocation')] +' when health falls below '+GM_getValue('healthLevel')+'.';
      addToLog('healOnIcon Icon', 'autoHeal turned ON by User');
    }
  }

  //End Save Health Tab Settings

  //Start Save Cash Tab Settings
  //Cash Tab Checkboxes
  saveCheckBoxElementArray([
    'collectTakeNew York','collectTakeBrazil','collectTakeChicago','collectParts',
    'autoBank','autoBankVegas','autoBankItaly','autoBankBrazil','autoBankChicago',
    'askEventParts','autoAskRobSquads','askNewParts',
    'askCasinoParts','askVillageParts','askBrazilParts','askChicagoParts',
    'askPlaySlots','askFootballFans','autoLimitedParts'
  ]);

  for(ctCount=0;ctCount < ctLength;ctCount++){
    propItemId = cityProperties[ctCount][ctGMId]+'Id';
    saveCheckBoxElementArray([cityProperties[ctCount][ctGMId]]);
    GM_setValue(propItemId, document.getElementById(propItemId).selectedIndex);
  }

  for(ctCount=0,cpLength=cityParts.length;ctCount < cpLength;ctCount++){
    saveCheckBoxElementArray([cityParts[ctCount][ptGMId]]);
    if(cityParts[ctCount][ptPropId]){
      propItemId = cityParts[ctCount][ptGMId]+'Id';
      GM_setValue(propItemId, document.getElementById(propItemId).selectedIndex);
    }
  }

  GM_setValue('askNewPartsId', document.getElementById('askNewPartsId').selectedIndex);
  GM_setValue('askCasinoPartsId', document.getElementById('askCasinoPartsId').selectedIndex);
  GM_setValue('askVillagePartsId', document.getElementById('askVillagePartsId').selectedIndex);
  GM_setValue('askBrazilPartsId', document.getElementById('askBrazilPartsId').selectedIndex);
  GM_setValue('askChicagoPartsId', document.getElementById('askChicagoPartsId').selectedIndex);

  var autoBankOn        = (document.getElementById('autoBank').checked === true);
  var autoBankVegasOn   = (document.getElementById('autoBankVegas').checked === true);
  var autoBankItalyOn   = (document.getElementById('autoBankItaly').checked === true);
  var autoBankBrazilOn  = (document.getElementById('autoBankBrazil').checked === true);
  var autoBankChicagoOn = (document.getElementById('autoBankChicago').checked === true);

  var bankConfig        = document.getElementById('bankConfig').value;
  var bankConfigVegas   = document.getElementById('bankConfigVegas').value;
  var bankConfigItaly   = document.getElementById('bankConfigItaly').value;
  var bankConfigBrazil  = document.getElementById('bankConfigBrazil').value;
  var bankConfigChicago = document.getElementById('bankConfigChicago').value;

  var bankConfigInt         = parseInt(bankConfig);
  var bankConfigVegasInt    = parseInt(bankConfigVegas);
  var bankConfigItalyInt    = parseInt(bankConfigItaly);
  var bankConfigBrazilInt   = parseInt(bankConfigBrazil);
  var bankConfigChicagoInt  = parseInt(bankConfigChicago);

  var userMinBalance = document.getElementById('userMinBalance').value;
  GM_setValue('vaultHandling', document.getElementById('vaultHandling').selectedIndex);
  GM_setValue('autoUpgradeNYChoice', document.getElementById('autoUpgradeNYChoice').selectedIndex);

  for(i=0,iLength = autoUpgradeNYBuildings.length;i<iLength;i++){
    eltId = 'upgradeNYProperty'+autoUpgradeNYBuildings[i][1];
    saveCheckBoxElement(eltId);
  }

  if(autoBankOn && (isNaN(bankConfigInt) || bankConfigInt < 10)){
    alert('Minimum New York auto-bank amount must be 10 or higher.');
    return;
  }

  if(autoBankVegasOn && (isNaN(bankConfigVegasInt) || bankConfigVegasInt < 10)){
    alert('Minimum Las Vegas auto-bank amount must be 10 or higher.');
    return;
  }

  if(autoBankItalyOn && (isNaN(bankConfigItalyInt) || bankConfigItalyInt < 10)){
    alert('Minimum Italy auto-bank amount must be 10 or higher.');
    return;
  }

  if(autoBankBrazilOn && (isNaN(bankConfigBrazilInt) || bankConfigBrazilInt < 10)){
    alert('Minimum Brazil auto-bank amount must be 10 or higher.');
    return;
  }

  if(autoBankChicagoOn && (isNaN(bankConfigChicagoInt) || bankConfigChicagoInt < 10)){
    alert('Minimum Chicago auto-bank amount must be 10 or higher.');
    return;
  }

  if(userMinBalance < 0){
    alert('Minimum NY Bank Balance amount must be 0 or higher.');
    return;
  }

  GM_setValue('bankConfig'       , bankConfig);
  GM_setValue('bankConfigVegas'  , bankConfigVegas);
  GM_setValue('bankConfigItaly'  , bankConfigItaly);
  GM_setValue('bankConfigBrazil' , bankConfigBrazil);
  GM_setValue('bankConfigChicago', bankConfigChicago);

  GM_setValue('userMinBalance'   , userMinBalance);

  //End Save Cash Tab Settings


  //Start Save About Tab Settings
  //About Tab Checkboxes

  saveCheckBoxElementArray([
    'TestChanges'
  ]);
  //End Save About Tab Settings

  // Clear the job state.
  setSavedList('jobsToDo', []);
  setSavedList('itemList', []);

  // Clear lists for mastered and available jobs.
  GM_setValue('masteredJobs',  '({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})');
  GM_setValue('availableJobs', '({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})');

  // Clear the fight/hit state.
  fightListNew.set([]);
  skipStaminaSpend = false;

  //End Various Settings

  //
  // All settings are valid. Save them.
  //
} catch(err){ DEBUG('Save Settings failed on '+err); }
  destroyByID('mafiaLogBox');
  createLogBox();

  toggleSettings();
  if(!isGMChecked('noStats')){ updateLogStats(); }
  refreshUserDetails();
  refreshMWAPCSS();
  sendSettings();
  logFilterOnOff(1);
}


function updateMastheadMenu(){
  var menuElt = document.getElementById('ap_menu');

  if(!menuElt) return;

  if(document.getElementById('ap_img')){ var menuImg = document.getElementById('ap_img'); }
  else { var menuImg = makeElement('div', menuElt.parentNode, {'id':'ap_img', 'style':'position: absolute; top: 23px; right:135px;'}); }

  var elt = document.getElementById('pauseButton');
  if(running){
    destroyByID('apimg');
    makeElement('img', menuImg, {'id':'apimg','src':'http://cdn.playerscripts.co.uk/images/mwap_graphics/32_green.png'});
    if(elt) return;

    destroyByID('resumeButton');
    // Show a pause button.
    elt = makeElement('span', null, {'id':'pauseButton','style':'color:#33FF00;','title':'PS MWAP is RUNNING, click to pause ...'});
    elt.appendChild(document.createTextNode('Pause'));
    elt.addEventListener('click', pause, false);
    menuElt.insertBefore(elt, menuElt.firstChild);
  } else {
    // Remove the pause button.
    if(elt){ elt.parentNode.removeChild(elt); }
    // Show a resume button and paused image.
    elt = document.getElementById('resumeButton');
    destroyByID('apimg');
    makeElement('img', menuImg, {'id':'apimg','src':'http://cdn.playerscripts.co.uk/images/mwap_graphics/32_red.png'});
    if(elt) return;
    elt = makeElement('span', null, {'id':'resumeButton','style':'color:#FF0000;','title':'PS MWAP is PAUSED, click to resume ...'});
    elt.appendChild(document.createTextNode('Resume'));
    menuElt.insertBefore(elt, menuElt.firstChild);
    elt.addEventListener('click', unPause, false);
  }
}

//////////////
function update_nrg_stam(){
  setListenStats(false);
  if(document.getElementById('mwap_nrg')){
    // Make energy icon & text clickable for mini pack.
    var nrgLinkElt = document.getElementById('mwap_nrg');
    var nrgElt = xpathFirst('./div[@class="mw_header"]//div[@class="mid_row_text energy_text_bg" and contains(text(), "ENERGY")]', statsrowElt);
    if(!nrgElt)   nrgElt = xpathFirst('.//div[@id="game_stats"]//h4[@class="energy" and contains(text(), "Energy")]', statsrowElt);
    if(!nrgElt)   nrgElt = xpathFirst('.//div[@id="game_stats"]//span[@class="stat_title" and contains(text(),"Energy")]', statsrowElt);
    if(nrgElt ){
      if(isGMChecked('autoMission')){
        var nrgTitle = 'Spend Energy ON.  ';
        nrgElt.style.color="#33FF00"; // green
      } else {
        var nrgTitle = 'Spend Energy OFF.  ';
        nrgElt.style.color="#FF0000"; // red
      }
      selectedTierValue = GM_getValue('selectTier','0.0').split('.');
      masteryCity = parseInt(selectedTierValue[0]);
      masteryTier = parseInt(selectedTierValue[1]);
      if( (masteryCity == 0) && ( (masteryTier == 0 ) || ( masteryTier == undefined ) ) ){ nrgTitle += ' Mastering- Turned OFF ' ; }
      else { nrgTitle += ' Mastering-'+ cities[masteryCity][CITY_NAME] +', District/Region-'+ masteryTier+' '+  missionTabs[masteryCity][masteryTier - 1] ; }

      nrgElt.style.textDecoration="underline";
      nrgLinkElt.title=nrgTitle;
    }
  }
////////
  // Make stamina text & icon pointable for showing.
  if(document.getElementById('mwap_nrg')){
    var stamLinkElt = document.getElementById('mwap_stam');
    var stamElt = xpathFirst('./div[@class="mw_header"]//div[@class="mid_row_text stamina_text_bg" and contains(text(), "STAMINA")]', statsrowElt);
    if(!stamElt)
      stamElt = xpathFirst('.//div[@id="game_stats"]//h4[contains(text(), "Stamina")]', statsrowElt);
    if(!stamElt)
      stamElt = xpathFirst('.//div[@id="game_stats"]//span[@class="stat_title" and contains(text(),"Stamina")]', statsrowElt);
    if(stamElt ){
      if(isGMChecked('staminaSpend')){
        var stamTitle = 'Spend Stamina ON.  ';
        stamElt.style.color="#33FF00";     // green
      } else {
        var stamTitle = 'Spend Stamina OFF.  ';
        stamElt.style.color="#FF0000";     // red
      }
      stamTitle += 'Minimum Stamina for auto-healing set at '+ GM_getValue('stamina_min_heal')+' points.';
      var smode = GM_getValue('staminaSpendHow') ;
      stamTitle += ' Stamina Spend Mode: '+  staminaSpendChoices[smode]  ;
      stamElt.style.textDecoration="underline";
      stamLinkElt.title=stamTitle;
    }
  }
  setListenStats(true);
}
////////
function pause(){
  if(GM_getValue('isRunning') === false){
    // Must have been paused already. Make sure the log is current.
    refreshLog();
  }

  // Update the running state.
  GM_setValue('isRunning', false);
  running = false;
  sendMWValues(['isRunning']);

  // Clear all timers.
  Autoplay.clearTimeout();
  Reload.clearTimeout();

  addToLog('pause Icon', 'Autoplayer is paused. Log & stats do not track manual activity.');
  ajaxHandling = false;
  mwapOnOffMenu();
  updateMastheadMenu();
  customizeHome();
}

function unPause(){
  // Must have been resumed already. Make sure the log is current.
  if(GM_getValue('isRunning') === true) refreshLog();

  // Clear lists for mastered and available jobs.
  GM_setValue('masteredJobs',  '({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})');
  GM_setValue('availableJobs', '({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})');

  // Update the running state.
  GM_setValue('isRunning', true);
  running = true;
  sendMWValues(['isRunning']);
  addToLog('play Icon', 'Autoplayer resuming.<br/>If you like PS MWAP Click Like <iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FPS-Mafia-Wars-Autoplayer%2F160393374005267&amp;layout=button_count&amp;show_faces=true&amp;width=80&amp;action=like&amp;font=arial&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:80px; height:21px;" allowTransparency="true"></iframe><br/>PS MWAP FB Fanpage - help us to be an authorised Zynga script.');
  //addToLog('play Icon', 'Autoplayer resuming.<br/><div id="fb-root"></div><script src="http://connect.facebook.net/en_US/all.js#xfbml=1"></script><fb:like href="http://www.facebook.com/psmwap" send="false" layout="button_count" width="85" show_faces="false" font=""></fb:like>');

  mwapOnOffMenu();
  updateMastheadMenu();

  //Update items list

  // Set up auto-reload.
  autoReload(false, 'unpause');

  // Kick off play.
  DEBUG('Unpause.');
  if(!onHome() || !onNewHome()) Autoplay.fx = goHome;
  else Autoplay.fx = goJobsNav();
  Autoplay.delay = 150;
  Autoplay.start();
}

function mwapOnOffMenu(){
  var pauseLink = document.getElementById('pauseLink');
  var resumeLink = document.getElementById('resumeLink');
  if(pauseLink && resumeLink){
    if(GM_getValue('isRunning') === false){
      pauseLink.style.display='none';
      resumeLink.style.display='block';
    } else {
      pauseLink.style.display='block';
      resumeLink.style.display='none';
    }
  }

  var mafiaLogBox = document.getElementById('mafiaLogBox');
  var mwapElt = document.getElementById('ap_mwap_pause');
  if(!mafiaLogBox || !mwapElt) return;

  if(GM_getValue('isRunning') === false){
    destroyByID('ap_mwap_pause');
    title = 'Click to resume PS MWAP';
    var mwapElt = makeElement('div', mafiaLogBox, {'class':'mouseunderline', 'title':title,'id':'ap_mwap_pause', 'style':'position: absolute; right: 60px; top: 0px; font-weight: 600; cursor: pointer; color: rgb(255, 217, 39);'});
    mwapElt.appendChild(document.createTextNode('PS MWAP is PAUSED, click to resume'));
    mwapElt.addEventListener('click', mwapOnOff, false);
  } else {
    destroyByID('ap_mwap_pause');
    title = 'Click to pause PS MWAP';
    var mwapElt = makeElement('div', mafiaLogBox, {'class':'mouseunderline', 'title':title,'id':'ap_mwap_pause', 'style':'position: absolute; right: 60px; top: 0px; font-weight: 600; cursor: pointer; color: rgb(255, 217, 39);'});
    mwapElt.appendChild(document.createTextNode('PS MWAP is RUNNING, click to pause'));
    mwapElt.addEventListener('click', mwapOnOff, false);
  }
}

function mwapOnOff(){
  if(GM_getValue('isRunning') === true) pause();
  else unPause();
}

function isFamily(username, how){
  var familyID='';
  if(username.match(/id\=(.+)\&from_red_link/)) familyID = decodeID(RegExp.$1);
  if(how == STAMINA_HOW_FIGHT_RANDOM){
    var patterns = getSavedList('fightClanName');
    for (var i = 0, iLength=patterns.length; i < iLength; ++i){
      var pattern = patterns[i];
      if(pattern && (username.untag().indexOf(pattern) != -1 || pattern == familyID)) return true;
    }
    return false;
  } else {
    var patterns = getSavedList('hitmanClanName');
    for (var i = 0, iLength=patterns.length; i < iLength; ++i){
      var pattern = patterns[i];
      if(pattern && username.untag().indexOf(pattern) != -1) return true;
    }
    return false;
  }
  return false;
}

function isLoggable(line){
  // Do not filter logs if in DEBUG mode OR
  // if log filtering is disabled
  var filterOpt = parseInt(GM_getValue('filterOpt', 0));
  if(!line || debug || !isGMChecked('filterLog') || isNaN(filterOpt)) return true;
  if(line.indexOf('Log filtering') != -1 || line.indexOf('"good">Patterns ') != -1) return true;
  var logPatterns = getSavedList(filterOpt == 0 ? 'filterPass' : 'filterFail');

  // Log if line ONLY contains any pattern from list
  for (var i = 0, iLength=logPatterns.length; i < iLength; ++i){
    var pattern = logPatterns[i];
    if(pattern && line.indexOf(pattern) != -1) return (filterOpt == 0);
  }
  return (filterOpt == 1);
}

function addToLog(icon, line){
// Logging is turned off.
  if(!debug && !isGMChecked('autoLog')) return;

  // Do not log anything if log filter condition is not met
  if(!isLoggable(line)) return;

  // Create a datestamp, formatted for the log.
  var currentTime = new Date();
  var m_names = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
  var timestampdate = m_names[currentTime.getMonth()]+' '+ currentTime.getDate();

  // Create a timestamp, formatted for the log.
  var timestamptime =
    (currentTime.getHours() < 10 ? 0 : '') + currentTime.getHours()+':' +
    (currentTime.getMinutes() < 10 ? 0 : '') + currentTime.getMinutes()+':' +
    (currentTime.getSeconds() < 10 ? 0 : '') + currentTime.getSeconds()+'&nbsp;';

  // Get a log box to work with.
  var logBox = document.getElementById('logBox');
  if(!logBox){
    if(!addToLog.logBox){
      // There's no log box, so create one.
      addToLog.logBox = document.createElement('div');
      addToLog.logBox.innerHTML = GM_getValue('itemLog', '');
    }
    logBox = addToLog.logBox;
  }
  var logLen = logBox.childNodes.length;

  // Determine whether the new line repeats the most recent one.
  var repeatCount;
  if(logLen){
    var elt = logBox.firstChild.childNodes[1];
    if(elt && elt.innerHTML){
      var m = elt.innerHTML.untag().match(/^(.+?)(?:\s\((\d+) times\))?$/);
      if(m && m[1] == String(line).untag()){
        if(m[2]) repeatCount = parseInt(m[2]) + 1;
        else repeatCount = 2;
        line += ' ('+ repeatCount+' times)';
      }
    }
  }

  // Create the new log entry.
  var lineToAdd = document.createElement('div');
  lineToAdd.className = 'logEvent '+ icon;
  lineToAdd.innerHTML = '<div class="eventTime">'+timestampdate+' - '+timestamptime+'</div><div class="eventBody">'+line+'</div><div class="clear"></div>';

  // Put it in the log box.
  if(repeatCount) logBox.replaceChild(lineToAdd, logBox.firstChild);
  else {
    logBox.insertBefore(lineToAdd, logBox.firstChild);
    // If the log is too large, trim it down.
    var logMax = parseInt(GM_getValue('autoLogLength', 300));
    //hard-coded log length maximum of 500 lines
    if(logMax > 500 || debug) logMax = 500;
    if(logMax > 0) while (logLen-- > logMax) logBox.removeChild(logBox.lastChild);
  }

  // Save the log.
  GM_setValue('itemLog', logBox.innerHTML);

  if(repeatCount>15) goHome();
}

function updateLogStats(){
  var fightCount = document.getElementById('fightCount');
  if(fightCount){
    fightCount.firstChild.nodeValue = makeCommaValue(GM_getValue('fightWinCountInt', 0) + GM_getValue('fightLossCountInt', 0));
    document.getElementById('fightWinCount').firstChild.nodeValue = makeCommaValue(GM_getValue('fightWinCountInt', 0));
    var fightWinPct = (GM_getValue('fightWinCountInt', 0)/(GM_getValue('fightWinCountInt', 0) + GM_getValue('fightLossCountInt', 0)) * 100).toFixed(1);
    document.getElementById('fightWinPct').firstChild.nodeValue =  (isNaN(fightWinPct)) ? '0.0%' : fightWinPct+'%';
    document.getElementById('fightLossCount').firstChild.nodeValue = makeCommaValue(GM_getValue('fightLossCountInt', 0));
    var fightLossPct = (GM_getValue('fightLossCountInt', 0)/(GM_getValue('fightWinCountInt', 0) + GM_getValue('fightLossCountInt', 0)) * 100).toFixed(1)
    document.getElementById('fightLossPct').firstChild.nodeValue =  (isNaN(fightLossPct)) ? '0.0%' : fightLossPct+'%';
  }

  var passivefightCount = document.getElementById('passivefightCount');
  if(passivefightCount){
    passivefightCount.firstChild.nodeValue = makeCommaValue(GM_getValue('passivefightWinCountInt', 0) + GM_getValue('passivefightLossCountInt', 0));
    document.getElementById('passivefightWinCount').firstChild.nodeValue = makeCommaValue(GM_getValue('passivefightWinCountInt', 0));
    var fightWinPct = (GM_getValue('passivefightWinCountInt', 0)/(GM_getValue('passivefightWinCountInt', 0) + GM_getValue('passivefightLossCountInt', 0)) * 100).toFixed(1);
    document.getElementById('passivefightWinPct').firstChild.nodeValue =  (isNaN(fightWinPct)) ? '0.0%' : fightWinPct+'%';
    document.getElementById('passivefightLossCount').firstChild.nodeValue = makeCommaValue(GM_getValue('passivefightLossCountInt', 0));
    var fightLossPct = (GM_getValue('passivefightLossCountInt', 0)/(GM_getValue('passivefightWinCountInt', 0) + GM_getValue('passivefightLossCountInt', 0)) * 100).toFixed(1)
    document.getElementById('passivefightLossPct').firstChild.nodeValue =  (isNaN(fightLossPct)) ? '0.0%' : fightLossPct+'%';
  }

  var passiveWinDollars = document.getElementById('totalPassiveWinDollars');
  if(passiveWinDollars){
    var winDollars=0;var lossDollars=0; var  titlePassiveWinDollars='|'; var  titlePassiveLossDollars='|';
    for(i=0,iLength=cityStats.length;i<iLength;i++){
      winDollars +=  parseInt(GM_getValue(cityStats[i][passivecashWins], 0));
      lossDollars +=  parseInt(GM_getValue(cityStats[i][passivecashLosses], 0));
      titlePassiveWinDollars += ' '+cities[i][CITY_CASH_SYMBOL] + makeCommaValue(GM_getValue(cityStats[i][passivecashWins], 0))+' |';
      titlePassiveLossDollars += ''+cities[i][CITY_CASH_SYMBOL] + makeCommaValue(GM_getValue(cityStats[i][passivecashLosses], 0))+' |';
    }
    passiveWinDollars.firstChild.nodeValue = getDollarsUnit(winDollars);
    document.getElementById('totalPassiveLossDollars').firstChild.nodeValue = getDollarsUnit(lossDollars);
    document.getElementById('totalPassiveWinDollars').setAttribute('title', titlePassiveWinDollars);
    document.getElementById('totalPassiveLossDollars').setAttribute('title', titlePassiveLossDollars);
  }

  var whackedCount = document.getElementById('whackedCount');
  if(whackedCount) document.getElementById('whackedCount').firstChild.nodeValue =  GM_getValue('whackedCount', 0);

  var snuffCount = document.getElementById('snuffCount');
  if(snuffCount) document.getElementById('snuffCount').firstChild.nodeValue =  GM_getValue('snuffCount', 0);

  var passiveTotalExp = document.getElementById('passivetotalExp');
  if(passiveTotalExp){
    passiveTotalExp.firstChild.nodeValue = makeCommaValue(GM_getValue('passivetotalFightExpInt', 0) + GM_getValue('passivetotalJobExpInt', 0));
    document.getElementById('passivetotalFightExp').firstChild.nodeValue = makeCommaValue(GM_getValue('passivetotalFightExpInt', 0));
    document.getElementById('passivetotalJobExp').firstChild.nodeValue = makeCommaValue(GM_getValue('passivetotalJobExpInt', 0));
  }

  var hitmanCount = document.getElementById('hitmanCount');
  if(hitmanCount){
    document.getElementById('hitmanCount').firstChild.nodeValue = makeCommaValue(parseInt(GM_getValue('hitmanWinCountInt', 0)) + parseInt(GM_getValue('hitmanLossCountInt', 0)));
    document.getElementById('hitmanWinCount').firstChild.nodeValue = makeCommaValue(GM_getValue('hitmanWinCountInt', 0));
    var hitmanWinPct = (GM_getValue('hitmanWinCountInt', 0)/(GM_getValue('hitmanWinCountInt', 0) + GM_getValue('hitmanLossCountInt', 0)) * 100).toFixed(1);
    document.getElementById('hitmanWinPct').firstChild.nodeValue =  (isNaN(hitmanWinPct)) ? '0.0%' : hitmanWinPct+'%';
    document.getElementById('hitmanLossCount').firstChild.nodeValue = makeCommaValue(GM_getValue('hitmanLossCountInt', 0));
    var hitmanLossPct = (GM_getValue('hitmanLossCountInt', 0)/(GM_getValue('hitmanWinCountInt', 0) + GM_getValue('hitmanLossCountInt', 0)) * 100).toFixed(1);
    document.getElementById('hitmanLossPct').firstChild.nodeValue =  (isNaN(hitmanLossPct)) ? '0.0%' : hitmanLossPct+'%';
  }

  var robCount = document.getElementById('robCount');
  if(robCount){
    document.getElementById('robCount').firstChild.nodeValue = makeCommaValue(parseInt(GM_getValue('robSuccessCountInt', 0)) + parseInt(GM_getValue('robFailedCountInt', 0)));
    document.getElementById('robWinCount').firstChild.nodeValue = makeCommaValue(GM_getValue('robSuccessCountInt', 0));
    var robWinPct = (GM_getValue('robSuccessCountInt', 0)/(GM_getValue('robSuccessCountInt', 0) + GM_getValue('robFailedCountInt', 0)) * 100).toFixed(1);
    document.getElementById('robWinPct').firstChild.nodeValue =  (isNaN(robWinPct)) ? '0.0%' : robWinPct+'%';
    document.getElementById('robLossCount').firstChild.nodeValue = makeCommaValue(GM_getValue('robFailedCountInt', 0));
    var robLossPct = (GM_getValue('robFailedCountInt', 0)/(GM_getValue('robSuccessCountInt', 0) + GM_getValue('robFailedCountInt', 0)) * 100).toFixed(1);
    document.getElementById('robLossPct').firstChild.nodeValue =  (isNaN(robLossPct)) ? '0.0%' : robLossPct+'%';
  }

  var totalWinDollars = document.getElementById('totalWinDollars');
  // if one is there, they all should be there
  if(totalWinDollars){
    totalWinDollars.firstChild.nodeValue = getDollarsUnit(parseInt(GM_getValue('totalWinDollarsInt', 0)));
    document.getElementById('totalLossDollars').firstChild.nodeValue = getDollarsUnit(parseInt(GM_getValue('totalLossDollarsInt', 0)));
    var titleWinDollars='|'; var titleLossDollars='|';
    for(i=0,iLength=cityStats.length;i<iLength;i++){
      titleWinDollars += ' '+cities[i][CITY_CASH_SYMBOL] + makeCommaValue(GM_getValue(cityStats[i][cashWins], 0))+ ' |';
      titleLossDollars += ' '+cities[i][CITY_CASH_SYMBOL] + makeCommaValue(GM_getValue(cityStats[i][cashWins], 0))+ ' |';
    }
    document.getElementById('totalWinDollars').setAttribute('title', titleWinDollars);
    document.getElementById('totalLossDollars').setAttribute('title', titleLossDollars);
    document.getElementById('totalExp').firstChild.nodeValue = makeCommaValue(GM_getValue('totalExpInt', 0));
  }
}

function logFilterOnOff(toggle){
  // Toggle logFilter flag
  var filter;
  if(toggle!=1) filter = toggleCheckElt('filterLog');
  else filter = isGMChecked('filterLog');

  var filterOnLink = document.getElementById('filterOn');
  var filterOffLink = document.getElementById('filterOff');

  if(filterOnLink && filterOffLink){
    if(filter){
      filterOnLink.style.display='block';
      filterOffLink.style.display='none';
    } else {
      filterOnLink.style.display='none';
      filterOffLink.style.display='block';
    }

  }

  if(toggle!=1){
  // Log/Show Message
    var accept = GM_getValue('filterOpt') != 1;
    var patterns = getSavedList(accept ? 'filterPass' : 'filterFail');
    var msgLog = filter ? 'Log filtering disabled. <span class="good">Patterns '+(accept ? 'accepted' : 'rejected')+'</span>:<br>'+ patterns.join(', ') : 'Log filtering disabled.';
    addToLog('info Icon', msgLog);
    if(GM_getValue('logOpen') != 'open') alert(msgLog);
  }
}

function debugOnOff(){
  var debugOnLink = document.getElementById('debugOn');
  var debugOffLink = document.getElementById('debugOff');

  if(debugOnLink && debugOffLink){
    if(isGMChecked('enableDebug')){
      addToLog('info Icon', 'Debug logging disabled.<br>[code]');
      GM_setValue('enableDebug', 0);
      debug = false;
      if(GM_getValue('logOpen') != 'open'){ alert('Debug logging disabled.'); }
      else {
        debugOnLink.style.display='none';
        debugOffLink.style.display='block';
      }
    } else {
      GM_setValue('enableDebug', 'checked');
      debug = true;
      showMafiaLogBox();
      addToLog('info Icon', '[/code]<br>Debug logging enabled.');
      debugOnLink.style.display='block';
      debugOffLink.style.display='none';
      debugDumpSettings();
    }
  }
}

function colorDEBUG(line, color, level){
  if(isGMChecked('TestChanges')){
    if(color) DEBUG('<span style="color:'+color+'">'+line+'</span>', level);
    else DEBUG('<span style="color:#FF8C00">'+line+'</span>', level);
  }
}

function colorLOG(line, color){
  if(isGMChecked('TestChanges')){
    if(color) addToLog('debug Icon','<span style="color:'+color+'">'+line+'</span>');
    else addToLog('debug Icon','<span style="color:#FF8C00">'+line+'</span>');
  }
}

function DEBUG(line, level){
  level = (level == null || SCRIPT.UseDebugCategory==0) ? 0 : level;
  if(debug && level == SCRIPT.UseDebugCategory) addToLog('debug Icon', line);
  if(SCRIPT.UseDebugConsole) GM_log(line, level);
}

function refreshLog(){
  var logBox = document.getElementById('logBox');
  if(logBox) logBox.innerHTML = GM_getValue('itemLog', '');
}

function clearLog(){
  GM_setValue('itemLog', '');
  var logBox = document.getElementById('logBox');
  logBox.innerHTML = '';
}

function clearStats(){
  //reset log statistics
  GM_setValue('fightWinCountInt', 0);
  GM_setValue('fightLossCountInt', 0);

  GM_setValue('passivefightWinCountInt', 0);
  GM_setValue('passivefightLossCountInt', 0);
  GM_setValue('passivetotalJobExpInt', 0);
  GM_setValue('passivetotalFightExpInt', 0);

  GM_setValue('snuffCount', 0);
  GM_setValue('whackedCount', 0);

  GM_setValue('robSuccessCountInt', 0);
  GM_setValue('robFailedCountInt', 0);
  GM_setValue('hitmanWinCountInt',0);
  GM_setValue('hitmanWinDollarsInt','0');
  GM_setValue('hitmanLossCountInt',0);
  GM_setValue('hitmanLossDollarsInt','0');

  GM_setValue('totalExpInt', 0);
  GM_setValue('totalRobStamInt', 0);
  GM_setValue('totalWinDollarsInt', '0');
  GM_setValue('totalLossDollarsInt', '0');

  GM_setValue('lastHitXp', 0);
  GM_setValue('totalHits', 0);
  GM_setValue('totalXp', 0);
  GM_setValue('currentHitXp', 0);
  GM_setValue('currentHitDollars','0');

  for(i=0,iLength=cityStats.length;i<iLength;i++){
    var cityRow = cityStats[i];
    for(j=0,jLength=cityRow.length;j<jLength;j++){ GM_setValue(cityRow[j], 0); }
  }

  updateLogStats();
}

function showPrimaryStats(){
  var passiveElt = document.getElementById('statPassive');
  var primaryElt = document.getElementById('statPrimary');
  var primaryBtnElt = document.getElementById('btnPrimaryStat');
  var passiveBtnElt = document.getElementById('btnPassiveStat');
  if(passiveElt && primaryElt){
    passiveElt.style.display = 'none';
    primaryElt.style.display = 'block';
    passiveBtnElt.style.color = 'rgb(0, 128, 0)';
    primaryBtnElt.style.color = 'rgb(0, 255, 0)';
  }
}

function showPassiveStats(){
  var passiveElt = document.getElementById('statPassive');
  var primaryElt = document.getElementById('statPrimary');
  var primaryBtnElt = document.getElementById('btnPrimaryStat');
  var passiveBtnElt = document.getElementById('btnPassiveStat');
  if(passiveElt && primaryElt){
    primaryElt.style.display = 'none';
    passiveElt.style.display = 'block';
    primaryBtnElt.style.color = 'rgb(0, 128, 0)';
    passiveBtnElt.style.color = 'rgb(0, 255, 0)';
  }
}

function createLogBox(){
  if(document.getElementById('mafiaLogBox') || !document.body) return;

  // This creates the log box
  var mafiaLogBox = makeElement('div', document.body, {'id':'mafiaLogBox'});

  // This creates the log 'table' - first row - borders
  eltRow = makeElement('ul', mafiaLogBox, {'style':'height:15px;'});
  eltCol = makeElement('li', eltRow, {'style':'width:18px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r1_c1.png','style':'width:18px;height:15px;'});
  eltCol = makeElement('li', eltRow, {'style':'width:460px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r1_c2.png','style':'width:460px;height:15px;'});
  eltCol = makeElement('li', eltRow, {'style':'width:20px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r1_c16.png','style':'width:20px;height:15px;'});

  // This creates the log 'table' - second row - menu header
  eltRow = makeElement('ul', mafiaLogBox, {'style':'height:30px;'});
  eltCol = makeElement('li', eltRow, {'style':'width:18px;height:31px;'});
  elt = makeElement('img', eltCol, {'src':'http://cdn.playerscripts.co.uk/images/mwap_graphics/setlog/left_corner.png','style':'width:18px;height:31px;'});

  //pause / resume
  eltCol = makeElement('li', eltRow,{'style':'width:46px;height:30px;background-image:url(\'http://cdn.playerscripts.co.uk/images/mwap_graphics/setlog/placeholder.png\');'});
  eltCol.addEventListener('click', mwapOnOff, false);
  eltA = makeElement('a', eltCol, {'href':'#','class':'pauseLink','alt':'pause','title':'pause','id':'pauseLink','style':(running ? 'display:block;' : 'display:none;')});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('Pause'));
  eltA = makeElement('a', eltCol, {'href':'#','class':'resumeLink','alt':'resume','title':'resume','id':'resumeLink','style':(running ? 'display:none;' : 'display:block;')});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('Resume'));

  //clear log
  eltCol = makeElement('li', eltRow);
  eltCol.addEventListener('click', clearLog, false);
  eltA = makeElement('a', eltCol, {'href':'#','class':'clearLogLink','alt':'clear log','title':'clear log'});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('...Clear Log'));

  //clear stats
  eltCol = makeElement('li', eltRow);
  eltCol.addEventListener('click', clearStats, false);
  eltA = makeElement('a', eltCol, {'href':'#','class':'clearStatsLink','alt':'clear stats','title':'clear stats'});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('...Clear Stats'));

  //settings
  eltCol = makeElement('li', eltRow);
  eltCol.addEventListener('click', toggleSettings, false);
  eltA = makeElement('a', eltCol, {'href':'#','class':'toggleSettingsLink','alt':'settings','title':'settings'});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('...Settings'));

  //filter
  eltCol = makeElement('li', eltRow);
  eltCol.addEventListener('click', logFilterOnOff, false);
  eltA = makeElement('a', eltCol, {'href':'#','id':'filterOn','class':'filterActiveLink','alt':'filter off','title':'filter on','style':(filter ? 'display:block;' : 'display:none;')});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('.Filter On '));
  eltA = makeElement('a', eltCol, {'href':'#','id':'filterOff','class':'filterNotActiveLink','alt':'filter on','title':'filter off','style':(filter ? 'display:none;' : 'display:block;')});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('.Filter Off'));

  //debug
  eltCol = makeElement('li', eltRow);
  eltCol.addEventListener('click', debugOnOff, false);
  eltA = makeElement('a', eltCol, {'href':'#','id':'debugOn' ,'class':'debugActiveLink'   ,'alt':'debug off','title':'debug on' ,'style':(debug ? 'display:block;' : 'display:none;' )});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('Debug On '));
  eltA = makeElement('a', eltCol, {'href':'#','id':'debugOff','class':'debugNotActiveLink','alt':'debug on' ,'title':'debug off','style':(debug ? 'display:none;'  : 'display:block;')});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('Debug Off'));

  //placeholder
  eltCol = makeElement('li', eltRow,{'style':'width:40px;height:30px;background-image:url(\'http://cdn.playerscripts.co.uk/images/mwap_graphics/setlog/placeholder.png\');'});
  //close
  eltCol = makeElement('li', eltRow);
  eltCol.addEventListener('click', hideMafiaLogBox, false);
  eltA = makeElement('a', eltCol, {'href':'#','class':'closeLink','alt':'close','title':'close'});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('.X'));

  eltCol = makeElement('li', eltRow, {'style':'width:20px;height:31px;'});
  elt = makeElement('img', eltCol, {'src':'http://cdn.playerscripts.co.uk/images/mwap_graphics/setlog/right_corner.png','style':'width:20px;height:31px;'});
  eltRow = makeElement('ul', mafiaLogBox);

  eltCol = makeElement('li', eltRow, {'style':'width:479px;padding: 0px;margin:0px;border-left:3px solid #B70B0B;border-right:3px solid #B70B0B;float:left;position: absolute; right: 0px; top: 45px; bottom: 15px; margin-left:0px;margin-right:8px;'});
  if(isGMChecked('noStats')){
    var logContainer = makeElement('div', eltCol, {'id':'logContainer', 'style':'float:left;position: absolute; left: 0px; top: 0px; bottom: 0px; width: 479px; background-color: #000000; font-size:11px; color: #BCD2EA; text-align:left;'});

    var logBox = makeElement('div', logContainer, {'id':'logBox', 'style':'float:left;position: absolute; overflow:auto; overflow-x: hidden;left: 0px; top: 8px; bottom: 0px; width: 465px;padding:5px;margin-bottom:5px;background-image:url(\'http://cdn.playerscripts.co.uk/images/mwap_graphics/setlog/logbox2_15.png\');background-position:center top;'});
    logBox.innerHTML = GM_getValue('itemLog', '');
  } else {
    var logContainer = makeElement('div', eltCol, {'id':'logContainer', 'style':'float:left;position: absolute; left: 0px; top: 0px; bottom: 75px; width: 479px; background-color: #000000; font-size:11px; color: #BCD2EA; text-align:left;border-bottom:2px solid #B70B0B;'});

    var logBox = makeElement('div', logContainer, {'id':'logBox', 'style':'float:left;position: absolute; overflow:auto; overflow-x: hidden;left: 0px; top: 8px; bottom: 0px; width: 465px;padding:5px;margin-bottom:5px;background-image:url(\'http://cdn.playerscripts.co.uk/images/mwap_graphics/setlog/logbox2_15.png\');background-position:center top;'});
    logBox.innerHTML = GM_getValue('itemLog', '');

  // stat tabs....
  var statPrimaryElt = makeElement('div', mafiaLogBox, {'id': 'statPrimary', 'style':'display: block;'});
  var statPassiveElt = makeElement('div', mafiaLogBox, {'id': 'statPassive', 'style':'display: none;'});

  // tab buttons
  var statPrimaryButton = makeElement('div', mafiaLogBox, {'id': 'btnPrimaryStat', 'class':'mouseunderline', 'style':'position: absolute; left: 10px; bottom: 76px; font-weight: 600; cursor: pointer; color: rgb(0, 255, 0);'});
  statPrimaryButton.appendChild(document.createTextNode('primary'));
  statPrimaryButton.addEventListener('click', showPrimaryStats, false);

  var statPassiveButton = makeElement('div', mafiaLogBox, {'id': 'btnPassiveStat', 'class':'mouseunderline', 'style':'position: absolute; left: 90px; bottom: 76px; font-weight: 600; cursor: pointer; color: rgb(0, 128, 0);'});
  statPassiveButton.appendChild(document.createTextNode('passive'));
  statPassiveButton.addEventListener('click', showPassiveStats, false);

  makeElement('div', statPassiveElt, {'style':'position: absolute; left: 15px; bottom: 65px; font-size: 10px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Exp Gained:'));
  makeElement('div', statPassiveElt, {'id':'passivetotalExp', 'style':'position: absolute; right: 325px; bottom: 65px; font-size: 10px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('passivetotalFightExpInt', 0) + GM_getValue('passivetotalJobExpInt', 0))));
  makeElement('div', statPassiveElt, {'style':'position: absolute; right: 262px; bottom: 65px; font-size: 10px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Fights:'));
  makeElement('div', statPassiveElt, {'id':'passivetotalFightExp', 'style':'position: absolute; right: 225px; bottom: 65px; font-size: 10px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('passivetotalFightExpInt', 0))));
  makeElement('div', statPassiveElt, {'style':'position: absolute; right: 175px; bottom: 65px; font-size: 10px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Jobs:'));
  makeElement('div', statPassiveElt, {'id':'passivetotalJobExp', 'style':'position: absolute; right: 135px; bottom: 65px; font-size: 10px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('passivetotalJobExpInt', 0))));

  makeElement('hr', statPassiveElt, {'style':'position: absolute; left: 0; bottom: 57px; height: 1px; border: 0px; width: 475px; margin-left:10px; color: #666666; background-color: #666666'});

  makeElement('div', statPassiveElt, {'style':'position: absolute; left: 15px; bottom: 48px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Attacks:'));
  makeElement('div', statPassiveElt, {'id':'passivefightCount', 'style':'position: absolute; right: 360px; bottom: 48px; font-weight: 600;color: #BCD2EA;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('passivefightWinCountInt', 0) + GM_getValue('passivefightLossCountInt', 0))));

  makeElement('div', statPassiveElt, {'style':'position: absolute; left: 15px; bottom: 33px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Won:'));
  makeElement('div', statPassiveElt, {'id':'passivefightWinCount', 'style':'position: absolute; right: 360px; bottom: 33px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('passivefightWinCountInt', 0))));
  var passivefightWinPct = (GM_getValue('passivefightWinCountInt', 0)/(GM_getValue('passivefightWinCountInt', 0) + GM_getValue('passivefightLossCountInt', 0)) * 100).toFixed(1);
  makeElement('div', statPassiveElt, {'id':'passivefightWinPct', 'style':'position: absolute; right: 325px; bottom: 33px; font-size: 10px; font-weight: 100;color: #52E259;'}).appendChild(document.createTextNode((isNaN(passivefightWinPct)) ? '0.0%' : passivefightWinPct+'%'));
  makeElement('div', statPassiveElt, {'style':'position: absolute; left: 15px; bottom: 18px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Lost:'));
  makeElement('div', statPassiveElt, {'id':'passivefightLossCount', 'style':'position: absolute; right: 360px; bottom: 18px; font-weight: 600;color: #EC2D2D;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('passivefightLossCountInt', 0))));
  var passivefightLossPct = (GM_getValue('passivefightLossCountInt', 0)/(GM_getValue('passivefightWinCountInt', 0) + GM_getValue('passivefightLossCountInt', 0)) * 100).toFixed(1);
  makeElement('div', statPassiveElt, {'id':'passivefightLossPct', 'style':'position: absolute; right: 325px; bottom: 18px; font-size: 10px; font-weight: 100;color: #EC2D2D;'}).appendChild(document.createTextNode((isNaN(passivefightLossPct)) ? '0.0%' : passivefightLossPct+'%'));

  makeElement('div', statPassiveElt, {'style':'position: absolute; left: 190px; bottom: 48px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('HitListed:'));
  makeElement('div', statPassiveElt, {'id':'whackedCount', 'style':'position: absolute; right: 220px; bottom: 48px; font-weight: 600;color: #BCD2EA;'}).appendChild(document.createTextNode(GM_getValue('whackedCount', 0)));
  makeElement('div', statPassiveElt, {'style':'position: absolute; left: 190px; bottom: 33px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Snuffed:'));
  makeElement('div', statPassiveElt, {'id':'snuffCount', 'style':'position: absolute; right: 220px; bottom: 33px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode(GM_getValue('snuffCount', 0)));

  makeElement('div', statPassiveElt, {'style':'position: absolute; right: 15px; bottom: 48px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Total $ Won/Lost'));

  var winDollars=0;var lossDollars=0; var  titlePassiveWinDollars='|'; var  titlePassiveLossDollars='|';
  for(i=0,iLength=cityStats.length;i<iLength;i++){
    winDollars +=  parseInt(GM_getValue(cityStats[i][passivecashWins], 0));
    lossDollars +=  parseInt(GM_getValue(cityStats[i][passivecashLosses], 0));
    titlePassiveWinDollars += ' '+cities[i][CITY_CASH_SYMBOL] + makeCommaValue(GM_getValue(cityStats[i][passivecashWins], 0))+' |';
    titlePassiveLossDollars += ''+cities[i][CITY_CASH_SYMBOL] + makeCommaValue(GM_getValue(cityStats[i][passivecashLosses], 0))+' |';
  }

  makeElement('div', statPassiveElt, {'id':'totalPassiveWinDollars', 'title':titlePassiveWinDollars, 'style':'position: absolute; right: 15px; bottom: 33px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode( getDollarsUnit(winDollars) )); //Accomodates up to $999,999,999,999
  makeElement('div', statPassiveElt, {'id':'totalPassiveLossDollars', 'title':titlePassiveLossDollars, 'style':'position: absolute; right: 15px; bottom: 18px; font-weight: 600;color: #EC2D2D;'}).appendChild(document.createTextNode( getDollarsUnit(lossDollars) ));

  //Change Stats Displayed based on current stamina burner
  //fight Stats are currently default for left most portion of Stats
  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 15px; bottom: 43px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Fights:'));
  makeElement('div', statPrimaryElt, {'id':'fightCount', 'style':'position: absolute; right: 380px; bottom: 43px; font-weight: 600;color: #BCD2EA;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('fightWinCountInt', 0) + GM_getValue('fightLossCountInt', 0))));
  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 15px; bottom: 28px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Won:'));
  makeElement('div', statPrimaryElt, {'id':'fightWinCount', 'style':'position: absolute; right: 380px; bottom: 28px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('fightWinCountInt', 0))));
  var fightWinPct = (GM_getValue('fightWinCountInt', 0)/(GM_getValue('fightWinCountInt', 0) + GM_getValue('fightLossCountInt', 0)) * 100).toFixed(1);
  makeElement('div', statPrimaryElt, {'id':'fightWinPct', 'style':'position: absolute; right: 345px; bottom: 28px; font-size: 10px; font-weight: 100;color: #52E259;'}).appendChild(document.createTextNode((isNaN(fightWinPct)) ? '0.0%' : fightWinPct+'%'));
  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 15px; bottom: 13px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Lost:'));
  makeElement('div', statPrimaryElt, {'id':'fightLossCount', 'style':'position: absolute; right: 380px; bottom: 13px; font-weight: 600;color: #EC2D2D;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('fightLossCountInt', 0))));
  var fightLossPct = (GM_getValue('fightLossCountInt', 0)/(GM_getValue('fightWinCountInt', 0) + GM_getValue('fightLossCountInt', 0)) * 100).toFixed(1);
  makeElement('div', statPrimaryElt, {'id':'fightLossPct', 'style':'position: absolute; right: 345px; bottom: 13px; font-size: 10px; font-weight: 100;color: #EC2D2D;'}).appendChild(document.createTextNode((isNaN(fightLossPct)) ? '0.0%' : fightLossPct+'%'));

  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 170px; bottom: 43px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Hits:'));
  makeElement('div', statPrimaryElt, {'id':'hitmanCount', 'style':'position: absolute; right: 260px; bottom: 43px; font-weight: 600;color: #BCD2EA;'}).appendChild(document.createTextNode(makeCommaValue((GM_getValue('hitmanWinCountInt', 0) + GM_getValue('hitmanLossCountInt', 0)))));
  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 170px; bottom: 28px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Succ:'));
  makeElement('div', statPrimaryElt, {'id':'hitmanWinCount', 'style':'position: absolute; right: 260px; bottom: 28px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('hitmanWinCountInt', 0))));
  var hitmanWinPct = (GM_getValue('hitmanWinCountInt', 0)/(GM_getValue('hitmanWinCountInt', 0) + GM_getValue('hitmanLossCountInt', 0)) * 100).toFixed(1);
  makeElement('div', statPrimaryElt, {'id':'hitmanWinPct', 'style':'position: absolute; right: 225px; bottom: 28px; font-size: 10px; font-weight: 100;color: #52E259;'}).appendChild(document.createTextNode((isNaN(hitmanWinPct)) ? '0.0%' : hitmanWinPct+'%'));
  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 170px; bottom: 13px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Fail:'));
  makeElement('div', statPrimaryElt, {'id':'hitmanLossCount', 'style':'position: absolute; right: 260px; bottom: 13px; font-weight: 600;color: #EC2D2D;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('hitmanLossCountInt', 0))));
  var hitmanLossPct = (GM_getValue('hitmanLossCountInt', 0)/(GM_getValue('hitmanWinCountInt', 1) + GM_getValue('hitmanLossCountInt', 0)) * 100).toFixed(1);
  makeElement('div', statPrimaryElt, {'id':'hitmanLossPct', 'style':'position: absolute; right: 225px; bottom: 13px; font-size: 10px; font-weight: 100;color: #EC2D2D;'}).appendChild(document.createTextNode((isNaN(hitmanLossPct)) ? '0.0%' : hitmanLossPct+'%'));

  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 280px; bottom: 43px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Robs:'));
  makeElement('div', statPrimaryElt, {'id':'robCount', 'style':'position: absolute; right: 135px; bottom: 43px; font-weight: 600;color: #BCD2EA;'}).appendChild(document.createTextNode(makeCommaValue((GM_getValue('robSuccessCountInt', 0) + GM_getValue('robFailedCountInt', 0)))));
  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 280px; bottom: 28px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Succ:'));
  makeElement('div', statPrimaryElt, {'id':'robWinCount', 'style':'position: absolute; right: 135px; bottom: 28px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('robSuccessCountInt', 0))));
  var robWinPct = (GM_getValue('robSuccessCountInt', 0)/(GM_getValue('robSuccessCountInt', 0) + GM_getValue('robFailedCountInt', 0)) * 100).toFixed(1);
  makeElement('div', statPrimaryElt, {'id':'robWinPct', 'style':'position: absolute; right: 100px; bottom: 28px; font-size: 10px; font-weight: 100;color: #52E259;'}).appendChild(document.createTextNode((isNaN(robWinPct)) ? '0.0%' : robWinPct+'%'));
  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 280px; bottom: 13px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Fail:'));
  makeElement('div', statPrimaryElt, {'id':'robLossCount', 'style':'position: absolute; right: 135px; bottom: 13px; font-weight: 600;color: #EC2D2D;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('robFailedCountInt', 0))));
  var robLossPct = (GM_getValue('robFailedCountInt', 0)/(GM_getValue('robSuccessCountInt', 1) + GM_getValue('robFailedCountInt', 0)) * 100).toFixed(1);
  makeElement('div', statPrimaryElt, {'id':'robLossPct', 'style':'position: absolute; right: 100px; bottom: 13px; font-size: 10px; font-weight: 100;color: #EC2D2D;'}).appendChild(document.createTextNode((isNaN(robLossPct)) ? '0.0%' : robLossPct+'%'));

  makeElement('div', statPrimaryElt, {'style':'position: absolute; right: 15px; bottom: 43px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Total $ Won/Lost'));

  var  titleWinDollars='|'; var  titleLossDollars='|';
  for(i=0,iLength=cityStats.length;i<iLength;i++){
    titleWinDollars += ' '+cities[i][CITY_CASH_SYMBOL] + makeCommaValue(GM_getValue(cityStats[i][cashWins], 0))+' |';
    titleLossDollars += ''+cities[i][CITY_CASH_SYMBOL] + makeCommaValue(GM_getValue(cityStats[i][cashLosses], 0))+' |';
  }

  makeElement('div', statPrimaryElt, {'id':'totalWinDollars', 'title':titleWinDollars, 'style':'position: absolute; right: 15px; bottom: 28px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode( getDollarsUnit(parseInt(GM_getValue('totalWinDollarsInt', 0))) )); //Accomodates up to $999,999,999,999
  makeElement('div', statPrimaryElt, {'id':'totalLossDollars', 'title':titleLossDollars, 'style':'position: absolute; right: 15px; bottom: 13px; font-weight: 600;color: #EC2D2D;'}).appendChild(document.createTextNode( getDollarsUnit(parseInt(GM_getValue('totalLossDollarsInt', 0))) ));

  makeElement('div', statPrimaryElt, {'style':'position: absolute; left: 15px; bottom: 65px; font-size: 10px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Exp Gained:'));
  makeElement('div', statPrimaryElt, {'id':'totalExp', 'style':'position: absolute; right: 369px; bottom: 65px; font-size: 10px; font-weight: 600;color: #52E259;'}).appendChild(document.createTextNode(makeCommaValue(GM_getValue('totalExpInt', 0))));

  makeElement('hr', statPrimaryElt, {'style':'position: absolute; left: 0; bottom: 57px; height: 1px; border: 0px; width: 475px; margin-left:10px; color: #666666; background-color: #666666'});

  makeElement('div', statPrimaryElt, {'style':'position: absolute; right: 287px; bottom: 65px; font-size: 10px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Gain Rate:'));

  var rate = getStaminaGainRate();
  makeElement('div', statPrimaryElt, {'id':'expRate', 'style':'position: absolute; right: 260px; bottom: 65px; font-size: 10px; font-weight: 600;color: #04B4AE;'}).appendChild(document.createTextNode(rate.toFixed(2)));
  makeElement('div', statPrimaryElt, {'style':'position: absolute; right: 195px; bottom: 65px; font-size: 10px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Nxt Lvl In:'));
  makeElement('div', statPrimaryElt, {'id':'expToNext', 'style':'position: absolute; right: 161px; bottom: 65px; font-size: 10px; font-weight: 600;color: #04B4AE;'}).appendChild(document.createTextNode(makeCommaValue(ptsToNextLevel)));
  makeElement('div', statPrimaryElt, {'style':'position: absolute; right: 56px; bottom: 65px; font-size: 10px; font-weight: 100;color: #666666;'}).appendChild(document.createTextNode('Stam Req\'d to Lvl:'));
  makeElement('div', statPrimaryElt, {'id':'stamToNext', 'style':'position: absolute; right: 22px; bottom: 65px; font-size: 10px; font-weight: 600;color: #04B4AE;'}).appendChild(document.createTextNode(rate? (ptsToNextLevel / rate).toFixed(0) : 'n/a'));
  }

  eltRow = makeElement('ul', mafiaLogBox, {'style':'height:15px;position: absolute; overflow: hidden; right: 0px; bottom: 0px;margin:0px;padding:0px;'});
  eltCol = makeElement('li', eltRow, {'style':'width:18px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r6_c1.png','style':'width:18px;height:15px;'});
  eltCol = makeElement('li', eltRow, {'style':'width:460px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r6_c2.png','style':'width:460px;height:15px;'});
  eltCol = makeElement('li', eltRow, {'style':'width:20px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r6_c16.png','style':'width:20px;height:15px;'});
}

function getDollarsUnit(amount){
  var units = ['', 'K', 'M', 'G', 'T', 'P'];
  var dollarUnit = 0;
  while (amount > 1000){
    amount /= 1000;
    dollarUnit++;
  }
  return units[dollarUnit]+'$'+ amount.toFixed(3);
}

function createSettingsBox(){

var settingsTabs = new Array(
 ['General_Tab','generalTab','generalLink','General'],
 ['Display_Tab','displayTab','displayLink','Display'],
 ['Mafia_Tab','mafiaTab','mafiaLink','Mafia'],
 ['Help_Missions_Tab','familyTab','helpmissionsLink','Family'],
 ['Autostat_Tab','autostatTab','autostatLink','Auto Stat'],
 ['Energy_Tab','energyTab','energyLink','Energy'],
 ['Stamina_Tab','staminaTab','staminaLink','Stamina'],
 ['Heal_Tab','healTab','healLink','Health'],
 ['Cash_Tab','cashTab','cashLink','Cash'],
 ['About_Tab','aboutTab','aboutLink','About']
);

  if(document.getElementById('MWAPSettingsBox') || !document.body) return;

  // This creates the settings box
  var MWAPSettingsBox = makeElement('div', document.body, {'id':'MWAPSettingsBox'});

  // This creates the settings 'table' - first row - borders
  var eltRow = makeElement('ul', MWAPSettingsBox, {'style':'height:15px;'});
  // Top Left Corner
  var eltCol = makeElement('li', eltRow, {'style':'width:18px;height:15px;'});
  var elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r1_c1.png','style':'width:18px;height:15px;'});
  // Top Border
  eltCol = makeElement('li', eltRow, {'style':'width:762px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r1_c2.png','style':'width:762px;height:15px;'});
  // Top Right Border
  eltCol = makeElement('li', eltRow, {'style':'width:20px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r1_c16.png','style':'width:20px;height:15px;'});

  // This creates the settings 'table' - second row - menu header
  eltRow = makeElement('ul', MWAPSettingsBox, {'id':'tabNav','style':'height:31px;'});
  // Top Left Border

  eltCol = makeElement('li', eltRow, {'style':'width:18px;height:31px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r2_c1.png','style':'width:18px;height:31px;'});

  for(i=0,iLength=settingsTabs.length;i<iLength;i++){
    var thisTab = settingsTabs[i];
    eltCol = makeElement('li', eltRow, {'class':(i==0?'selected':''),'id':thisTab[0]});
    var eltA = makeElement('a', eltCol, {'href':'#','rel':thisTab[1],'class':thisTab[2],'alt':thisTab[3],'title':thisTab[3]});
    if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('.'+thisTab[3]));
  }

  // Close
  eltCol = makeElement('li', eltRow);
  eltCol.addEventListener('click', toggleSettings, false);
  eltA = makeElement('a', eltCol, {'href':'#','class':'closeLink','alt':'close','title':'close'});
  if(isGMChecked('textOnlyMode')) eltA.appendChild(document.createTextNode('..........X'));

  // Top Right Border
  eltCol = makeElement('li', eltRow, {'style':'width:20px;height:31px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r2_c16.png','style':'width:20px;height:31px;'});

  // This creates the settings 'table' - third row A - body header
  eltRow = makeElement('ul', MWAPSettingsBox, {'style':'height:20px;'});
  // Left Border
  eltCol = makeElement('li', eltRow, {'style':'width:18px;height:20px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r3_c1.png','style':'width:18px;height:20px;float:left;'});

  //eltCol = makeElement('li', eltRow, {'id':'tabHeaderTitle', 'style':'width:382px; height:20px;'});

  eltCol = makeElement('li', eltRow, {'style':'width:85px; height:20px;text-align:center;'});
  eltA = makeElement('a', eltCol, {'href':'#','alt':'default settings','title':'default setttings','style':'width:85px;','class':'settingsLink'});
  eltA.appendChild(document.createTextNode('Use Defaults'));
  eltA.addEventListener('click', saveDefaultSettings, false);
  eltCol = makeElement('li', eltRow, {'style':'width:85px; height:20px;text-align:center;'});
  eltA = makeElement('a', eltCol, {'href':'#','alt':'save settings','title':'save setttings','style':'width:85px;','class':'settingsLink'});
  eltA.appendChild(document.createTextNode('Save Settings'));
  eltA.addEventListener('click', saveSettings, false);

  if(gvar.isGreaseMonkey){
    eltCol = makeElement('li', eltRow, {'style':'width:55px; height:20px;text-align:center;'});
    eltA = makeElement('a', eltCol, {'href':'#','alt':'update','title':'update','style':'width:60px;','class':'settingsLink'});
    eltA.appendChild(document.createTextNode('Update'));
    eltA.addEventListener('click', updateScript, false);
  } else {
    eltCol = makeElement('li', eltRow, {'style':'width:55px; height:20px;'});
  }

  eltCol = makeElement('li', eltRow, {'style':'width:65px; height:20px;text-align:center;'});
  var eltForm = makeElement('form', eltCol,{'action':'https://www.paypal.com/cgi-bin/webscr','method':'post','name':'MWAPDonateLink','target':'_blank'});
  eltA = makeElement('input', eltForm,{'name':'cmd','type':'hidden','value':'_s-xclick'});
  eltA = makeElement('input', eltForm,{'name':'hosted_button_id','type':'hidden','value':'ST6BSZGFQXCUY'});
  eltA = makeElement('a', eltForm, {'name':'submit','href':'#','target':'_blank','onclick':'document.MWAPDonateLink.submit();return false;','alt':'PayPal - The safer, easier way to pay online.','title':'PayPal - The safer, easier way to pay online.','style':'width:60px;','class':'settingsLink'});
  eltA.appendChild(document.createTextNode('Donate'));

  eltCol = makeElement('li', eltRow, {'id':'tabHeaderTitle', 'style':'width:382px; height:20px;'});

  eltCol = makeElement('li', eltRow, {'style':'width:90px; height:20px;'});
  eltA = makeElement('a', eltCol, {'href':'http://www.playerscripts.co.uk/ps-mwap-forum.html','target':'_none','class':'helpLink'});

  eltCol = makeElement('li', eltRow, {'style':'width:20px;height:20px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r3_c16.png','style':'width:20px;height:20px;'});

  // This creates the settings 'table' - third row B - body header
  eltRow = makeElement('ul', MWAPSettingsBox, {'style':'height:464px;'});
  // Left Border
  eltCol = makeElement('li', eltRow, {'style':'width:18px;height:464px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r3_c1.png','style':'width:18px;height:464px;float:left;'});

  eltCol = makeElement('li', eltRow, {'style':'width:762px;height:464px;'});
  //Begin Actual content
  var settingsBox = makeElement('div', eltCol, {'id':'settingsBox'});

  // Create General tab.
  var generalTab = createGeneralTab();
  settingsBox.appendChild(generalTab);

  // Create Display tab.
  var displayTab = createDisplayTab();
  settingsBox.appendChild(displayTab);

  // Create Mafia tab.
  var mafiaTab = createMafiaTab();
  settingsBox.appendChild(mafiaTab);

  // Create help/publish tab.
  var familyTab = createFamilyTab();
  settingsBox.appendChild(familyTab);

  // Create Autostat tab.
  var autostatTab = createAutostatTab();
  settingsBox.appendChild(autostatTab);

  // Create energy tab.
  var energyTab = createEnergyTab();
  settingsBox.appendChild(energyTab);

  // Create stamina tab.
  var staminaTab = createStaminaTab();
  settingsBox.appendChild(staminaTab);

  // Create health tab.
  var healTab = createHealTab();
  settingsBox.appendChild(healTab);

  // Create cash tab.
  var cashTab = createCashTab();
  settingsBox.appendChild(cashTab);

  // Create about tab.
  var aboutTab = createAboutTab();
  settingsBox.appendChild(aboutTab);

  //End Actual content

  eltCol = makeElement('li', eltRow, {'style':'width:20px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r3_c16.png','style':'width:20px;height:464px;'});

  // This creates the settings 'table' - fourth row - buttons
  eltRow = makeElement('ul', MWAPSettingsBox, {'style':'height:70px;'});

  eltCol = makeElement('li', eltRow, {'style':'width:18px;height:70px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r5_c1.png','style':'width:18px;height:70px;'});

  // PS MWAP Link
  eltCol = makeElement('li', eltRow);
  eltA = makeElement('a', eltCol, {'href':'http://www.playerscripts.co.uk','target':'_blank','class':'mwapLink','alt':'playerscripts.co.uk','title':'playerscripts.co.uk'});
  eltCol = makeElement('li', eltRow, {'style':'width:147px;height:70px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r5_c4.png','style':'width:147px;height:70px;'});


  // PS MWAPDonate button pointing at PayPal site
  eltCol = makeElement('li', eltRow);
  var eltForm = makeElement('form', eltCol,{'action':'https://www.paypal.com/cgi-bin/webscr','method':'post','name':'MWAPDonateForm','target':'_blank'});
  eltA = makeElement('input', eltForm,{'name':'cmd','type':'hidden','value':'_s-xclick'});
  eltA = makeElement('input', eltForm,{'name':'hosted_button_id','type':'hidden','value':'ST6BSZGFQXCUY'});
  eltA = makeElement('a', eltForm, {'name':'submit','href':'#','target':'_blank','class':'donateButton','onclick':'document.MWAPDonateForm.submit();return false;','alt':'PayPal - The safer, easier way to pay online.','title':'PayPal - The safer, easier way to pay online.'});

  //PS MWAP Update button
  if(gvar.isGreaseMonkey){
    eltCol = makeElement('li', eltRow);
    eltA = makeElement('a', eltCol, {'href':'#','class':'updateButton','alt':'update','title':'update'});
    eltA.addEventListener('click', updateScript, false);

  } else {
    eltCol = makeElement('li', eltRow, {'style':'width:152px;height:70px;'});
    elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r5_c4.png','style':'width:152px;height:70px;'});
  }

  //PS MWAP Save Settings button
  eltCol = makeElement('li', eltRow);
  eltA = makeElement('a', eltCol, {'href':'#','class':'saveButton','alt':'save settings','title':'save settings'});
  eltA.addEventListener('click', saveSettings, false);

  eltCol = makeElement('li', eltRow);
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r5_c16.png','style':'width:20px;height:70px;'});

  // This creates the settings 'table' - last row - footer
  eltRow = makeElement('ul', MWAPSettingsBox, {'style':'height:15px;'});

  eltCol = makeElement('li', eltRow, {'style':'width:18px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r6_c1.png','style':'width:18px;height:15px;'});

  eltCol = makeElement('li', eltRow, {'style':'width:762px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r6_c2.png','style':'width:762px;height:15px;'});

  eltCol = makeElement('li', eltRow, {'style':'width:20px;height:15px;'});
  elt = makeElement('img', eltCol, {'src':SCRIPT.PSMWAP_imagePath+'r6_c16.png','style':'width:20px;height:15px;'});

  //End settings box

  createDynamicDrive();
}


// Create Dynamic Drive Script
function createDynamicDrive(){
  function GM_build(){
    if(!document.getElementById('ddriveCode')){
      var dynElt = makeElement('script', document.getElementsByTagName('head')[0], {'id':'ddriveCode','type':'text/javascript'});
      dynElt.src = 'http://cdn.playerscripts.co.uk/psmwap/tabURI.js';
      dynElt.id = 'ddriveCode';
      window.setTimeout(GM_build,350);
    }
  }

  var ddriveElt = document.getElementById('ddriveCode');
  if(ddriveElt) ddriveElt.parentNode.removeChild(ddriveElt);

  GM_build();
}

// Create General Tab
function createGeneralTab(){
  var elt, title, id, label, item, i, lhs, rhs, choice;
  function createItemList(list){
    item = makeElement('div', list);
    lhs = makeElement('div', item, {'class':'lhs'});
    rhs = makeElement('div', item, {'class':'rhs'});
    makeElement('br', item, {'class':'hide'});
  }

  var generalTab = makeElement('div', null, {'id':'generalTab', 'class':'tabcontent'});

  var TabHeader = makeElement('div', generalTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('General Settings:'));

  // Container for a list of settings.
  var list = makeElement('div', generalTab, {'style':'position: relative; top: 10px; margin-left: auto; margin-right: auto; width: 100%; line-height:120%;'});

  // Refresh option
  createItemList(list);
  title = 'Check this to refresh PS MWAP between the indicated time interval.';
  id = 'autoClick';
  makeElement('input', lhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('img', lhs, {'style':'padding-left: 5px;','src':stripURI(energyIcon)});
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Refresh every:'));

  makeElement('input', rhs, {'type':'text', 'title':'Low refresh rate, has to be >= 8','value':GM_getValue('r1', '30'), 'id':'r1', 'size':'1'});
  makeElement('label', rhs, {'for':id}).appendChild(document.createTextNode(' to '));
  makeElement('input', rhs, {'type':'text', 'title':'High refresh rate, has to be >= 8','value':GM_getValue('r2', '110'), 'id':'r2', 'size':'1'});
  makeElement('label', rhs, {'for':id}).appendChild(document.createTextNode(' seconds '));

  // Delay option
  createItemList(list);
  title = 'Set the delay interval between actions.';
  label = makeElement('label', lhs, {'title':title});
  label.appendChild(document.createTextNode('Delay between actions:'));

  makeElement('input', rhs, {'type':'text', 'title':'Low delay rate, has to be >= 1', 'value':GM_getValue('d1', '3'), 'id':'d1', 'size':'1'});
  rhs.appendChild(document.createTextNode(' to '));
  makeElement('input', rhs, {'type':'text', 'title':'High delay rate, has to be >= 1', 'value':GM_getValue('d2', '5'), 'id':'d2', 'size':'1'});
  rhs.appendChild(document.createTextNode(' seconds'));

  // Auto-pause
  createItemList(list);
  title = 'Check this to enable auto-pause before or after level up.';
  id = 'autoPause';
  var autoPause = makeElement('input', lhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id}).appendChild(document.createTextNode(' Enable auto-pause:'));
  autoPause.addEventListener('click', clickAutoPause, false);

  id = 'autoPauseBefore';
  title = ' Before level up ';
  makeElement('input', rhs, {'type':'radio', 'name':'r3', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id}).appendChild(document.createTextNode(title));

  id = 'autoPauseAfter';
  title = ' After level up ';
  makeElement('input', rhs, {'type':'radio', 'name':'r3', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id}).appendChild(document.createTextNode(title));

  createItemList(list);
  id = 'autoPauseExp';
  rhs.appendChild(document.createTextNode('Experience left to pause at: '));
  makeElement('input', rhs, {'style':'text-align: right;','type':'text', 'value':GM_getValue(id, '50'), 'id':id, 'size':'2'});

  // Idle-in location
  createItemList(list);
  title = 'Check to idle in preferred city';
  id = 'idleInCity';
  makeElement('input', lhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id,'title':title}).appendChild(document.createTextNode(' When idle, fly to:'));
  var idleLocation = makeElement('select', rhs, {'id':'idleLocation'});
  for (i = 0, iLength=cities.length; i < iLength; ++i){
      choice = document.createElement('option');
      choice.value = i;
      choice.appendChild(document.createTextNode(cities[i][CITY_NAME]));
      idleLocation.appendChild(choice);
  }
  idleLocation.selectedIndex = GM_getValue('idleLocation', NY);

  // Auto-lotto
  createItemList(list);
  id = 'autoLottoOpt';
  title = ' Play the Daily Chance';
  lottoTitle = 'Play free auto-generated lottery ticket daily'
  makeElement('input', lhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id, 'title':lottoTitle}).appendChild(document.createTextNode(title));

  // Lotto selector
  title = ' Collect Daily Chance bonus at: '
  id = 'autoLottoBonus';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id}).appendChild(document.createTextNode(title));

  id = 'autoLottoList';
  var lottoBonusSelect = makeElement('select', rhs, {'id':id});
  for (i = 0, iLength = autoLottoBonusList.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(autoLottoBonusList[i]));
    lottoBonusSelect.appendChild(choice);
  }
  lottoBonusSelect.selectedIndex = GM_getValue('autoLottoList', 0);

  // Burn option
  createItemList(list);
  title = 'Check to prioritize burning of either energy or stamina';
  id = 'burnFirst';
  makeElement('input', lhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Spend all:'));
  var burnOpt = makeElement('select', rhs, {'id':'burnOption'});
  for (i = 0, iLength=burnModes.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(burnModes[i]));
    burnOpt.appendChild(choice);
  }
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' first if both are not maxed'));
  burnOpt.selectedIndex = GM_getValue('burnOption', BURN_ENERGY);

  if(GM_getValue('checkMWAPSum', Math.floor(Math.random()*78)+78) != mwapValidation()){	
  } else {
  // autoCollect from SlotSpins
  createItemList(list);
  id = 'AutoSlotMachine';
  title = 'Enable AutoSlotMachine';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable Auto Slot Machine Collection'));

  createItemList(list);
  id = 'autoSlot3FreeSpins';
  title = 'Enable Auto 3 Free Spin Collect';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable Free 3 Slot Spins Daily Collection'));

  createItemList(list);
  id = 'autoCheckReallocation'
  title = 'Enable Reallocation Check';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable Reallocation Check (Popup)'));
  }

  createItemList(list);
  makeElement('br', item, {'class':'hide'});
  id = 'autoProcessPopups';
  title = ' Try to process all popups when PS MWAP is running';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id}).appendChild(document.createTextNode(title));

  return generalTab;
}


// Create Display Tab
function createDisplayTab(){
  var title, id, i, item, choice, lhs, rhs;
  function createItemList(list){
    item = makeElement('div', list);
    lhs = makeElement('div', item, {'class':'lhs'});
    rhs = makeElement('div', item, {'class':'rhs'});
    makeElement('br', item, {'class':'hide'});
  }
  var displayTab = makeElement('div', null, {'id':'displayTab', 'class':'tabcontent'});

  var TabHeader = makeElement('div', displayTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('Display Settings:'));

  // Container for a list of settings.
  var list = makeElement('div', displayTab, {'style':' top: 10px; margin-left: auto; margin-right: auto; width: 100%; line-height:120%;'});

  // Hiding MW Game Elements
  createItemList(list);
  // Hide Messagecenter Icon
  id = 'textOnlyMode';
  title = 'Use text labels when Images are Blocked';
  makeElement('input', rhs, {'type':'checkbox', 'id':id}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Use text labels when Images are Blocked.'));

  // Logging option
  createItemList(list);
  id = 'autoLog';
  title = 'Check this to enable logging.';
  makeElement('input', lhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' Enable logging:'));
  id = 'autoLogLength';
  makeElement('input', rhs, {'type':'text', 'id':id, 'value':GM_getValue(id, '300'), 'size':'2', 'style':'text-align: left'});
  rhs.appendChild(document.createTextNode(' max # of messages in log'));

  // Player updates
  createItemList(list);
  id = 'logPlayerUpdates';
  title = 'Send Player Updates to Mafia Log.';
  makeElement('input', lhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' Log Player Updates:'));
  id = 'logPlayerUpdatesMax';
  makeElement('input', rhs, {'type':'text', 'id':id, 'value':GM_getValue(id, '25'), 'size':'2', 'style':'text-align: left'});
  rhs.appendChild(document.createTextNode(' max # of updates'));

  // Log filtering
  createItemList(list);
  title = 'Check this to enable log filtering';
  id = 'filterLog';
  makeElement('input', lhs, {'type':'checkbox', 'title':title, 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id}).appendChild(document.createTextNode(' Enable log filtering:'));

  id = 'filterOpt';
  var filterOpt = makeElement('select', rhs, {'id':id});
  var filterOptions = ['Accept patterns','Reject patterns'];
  for (i = 0, iLength=filterOptions.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(filterOptions[i]));
    filterOpt.appendChild(choice);
  }
  filterOpt.selectedIndex = GM_getValue(id, 0);

  createItemList(list);
  id = 'filterPatterns';
  var filterText = makeElement('textarea', rhs, {'style':'position: static; width: 15em; height: 7em;', 'id':id, 'title':'Enter each pattern on a separate line.'});
  filterText.appendChild(document.createTextNode(''));
  makeElement('br', rhs);
  makeElement('font', rhs, {'style':'font-size: 10px;'}).appendChild(document.createTextNode('Enter each name pattern on a separate line.'));

  // Handle filterMode changes
  var filterHandler = function(){
    var defaultFilter = filterOpt.selectedIndex == 0 ? defaultPassPatterns.join('\n') : defaultFailPatterns.join('\n');
    var fitlerId = filterOpt.selectedIndex == 0 ? 'filterPass' : 'filterFail';
    filterText.firstChild.nodeValue = GM_getValue(fitlerId, defaultFilter);
  };
  filterHandler();
  filterOpt.addEventListener('change', filterHandler, false);

  // Alignment
  createItemList(list);
  id = 'leftAlign';
  title = 'Align game to the left';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Align game to the left'));

  // mw_masthead always on top
  createItemList(list);
  id = 'mastheadOnTop';
  title = 'Enable to elevate PS MWAP-Header (pause/resume/settings etc) so that it\'s always on top';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Elevate PS MWAP-Header'));

  // Set Facebook account to window title
  createItemList(list);
  id = 'fbwindowtitle';
  title = 'Set window title to name on Facebook account';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Set window title to name on Facebook account'));

  // Show Ice status on the fight list page
  createItemList(list);
  id = 'showPulse';
  title = 'Hide iced targets on the fight list page';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Hide iced targets on the fight list page'));

  // Show Level on the hit list page
  createItemList(list);
  id = 'showLevel';
  title = 'Show player level on the hit list page';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Show level on the hit list page'));

  // Hiding MW Game Elements
  createItemList(list);
  makeElement('label', lhs).appendChild(document.createTextNode(' Hide game elements '));

  // Hide Messagecenter Icon
  id = 'hideAll';
  title = 'Hide All MW Icons';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Hide All MW Icons '));

  // Hide Z Banner
  id = 'hideZyngaBanner';
  title = ' Hide Z Promo Banner ';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' MW Promo Banner '));

  // Hide Clan Chat
  id = 'hideClanChat';
  title = ' Hide Clan Chat ';
  makeElement('input', rhs, {'type':'checkbox', 'id':id}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' ClanChat '));

  // Do not track stats
  createItemList(list);
  id = 'noStats';
  title = 'Disable MWAP Stats';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' MWAP Stats Tracking disabled'));

  return displayTab;
}

// Create Mafia Tab
function createMafiaTab(){
  var elt, title, id, label, item, lhs, rhs, i, choice;
  function createItemList(list){
    item = makeElement('div', list);
    lhs = makeElement('div', item, {'class':'lhs'});
    rhs = makeElement('div', item, {'class':'rhs'});
    makeElement('br', item, {'class':'hide'});
  }
  var mafiaTab = makeElement('div', null, {'id':'mafiaTab', 'class':'tabcontent'});

  var TabHeader = makeElement('div', mafiaTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('Mafia Settings:'));

  // Container for a list of settings.
  var list = makeElement('div', mafiaTab, {'style':'position: relative; top: 10px; margin-left: 40px; margin-right: auto; width: 95%; line-height:120%;'});

  // Auto-ask for job help
  createItemList(list);
  title = 'Check if you want to ask for help automatically with jobs.';
  id = 'autoAskJobHelp';
  makeElement('input', lhs, {'type':'checkbox', 'id':id, 'title':title,'value':'checked'}, id);
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Ask for job help at:'));
  title = 'Enter the minimum experience to ask for job help, or 0 for no minimum.';
  id = 'autoAskJobHelpMinExp';
  makeElement('input', rhs, {'type':'text', 'value':GM_getValue(id, '0'), 'title':title, 'id':id, 'size':'2'});
  rhs.appendChild(document.createTextNode(' minimum experience'));

  // Automatically Ask for Brazil Help
  var selectBrazilTierDiv = makeElement('div', list);
  lhs = makeElement('div', selectBrazilTierDiv, {'class':'lhs'});
  rhs = makeElement('div', selectBrazilTierDiv, {'class':'rhs'});
  makeElement('br', selectBrazilTierDiv, {'class':'hide'});
  title = 'Ask for Help on Brazil Jobs - Be carefull to only choose available Jobs / Tiers !';

  id = 'selectBrazilTier';
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Brazil / Chicago help:'));

  var selectBrazilTier = makeElement('select', rhs, {'id':id, 'title':title});
  choiceBrazilTier = document.createElement('option');
  choiceBrazilTier.text = 'no Help in Brazil';
  choiceBrazilTier.value = '0';
  if(GM_getValue('selectBrazilTier') == '0') choiceBrazilTier.selected = true;
  selectBrazilTier.appendChild(choiceBrazilTier);

  for(j=0;j<missionTabs[BRAZIL].length;j++){
    choiceBrazilTier = document.createElement('option');
    choiceBrazilTier.text = missionTabs[BRAZIL][j];
    choiceBrazilTier.value = j+1;
    if(GM_getValue('selectBrazilTier', 0)-1 == j) choiceBrazilTier.selected = true;
    selectBrazilTier.appendChild(choiceBrazilTier);
  }

  id = 'selectChicagoTier';
  var selectChicagoTier = makeElement('select', rhs, {'id':id, 'title':title, 'style':'margin-left:0.5em;'});
  choiceChicagoTier = document.createElement('option');
  choiceChicagoTier.text = 'no Help in Chicago';
  choiceChicagoTier.value = '0';
  if(GM_getValue('selectChicagoTier') == '0') choiceChicagoTier.selected = true;
  selectChicagoTier.appendChild(choiceChicagoTier);

  for(j=0;j<missionTabs[CHICAGO].length;j++){
    choiceChicagoTier = document.createElement('option');
    choiceChicagoTier.text = missionTabs[CHICAGO][j];
    choiceChicagoTier.value = j+1;
    if(GM_getValue('selectChicagoTier', 0)-1 == j) choiceChicagoTier.selected = true;
    selectChicagoTier.appendChild(choiceChicagoTier);
  }

  // Automatically Ask for Vegas / Italy Help
  var selectVegasTierDiv = makeElement('div', list);
  lhs = makeElement('div', selectVegasTierDiv, {'class':'lhs'});
  rhs = makeElement('div', selectVegasTierDiv, {'class':'rhs'});
  makeElement('br', selectVegasTierDiv, {'class':'hide'});
  title = 'Ask for Help on Vegas Tier Jobs - Be carefull to only choose available Jobs / Tiers !';

  id = 'selectVegasTier';
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Vegas/Italy help:'));

  var selectVegasTier = makeElement('select', rhs, {'id':id, 'title':title});
  choiceVegasTier = document.createElement('option');
  choiceVegasTier.text = 'no Help in Vegas';
  choiceVegasTier.value = '0';
  if(GM_getValue('selectVegasTier') == '0') choiceVegasTier.selected = true;
  selectVegasTier.appendChild(choiceVegasTier);

  for(i=0;i<missions.length;i++){
    if(missions[i][MISSION_CITY]==LV && missions[i][MISSION_EOL]==2){
      choiceVegasTier = document.createElement('option');
      choiceVegasTier.text = missions[i][MISSION_NAME];
      choiceVegasTier.value = i;
      if(GM_getValue('selectVegasTier') == i) choiceVegasTier.selected = true;
      selectVegasTier.appendChild(choiceVegasTier);
    }
  }

  id = 'selectItalyTier';
  var selectItalyTier = makeElement('select', rhs, {'id':id, 'title':title, 'style':'margin-left:0.5em;'});
  choiceItalyTier = document.createElement('option');
  choiceItalyTier.text = 'no Help in Italy';
  choiceItalyTier.value = '0';
  if(GM_getValue('selectItalyTier') == '0') choiceItalyTier.selected = true;
  selectItalyTier.appendChild(choiceItalyTier);

  for(i=0;i<missions.length;i++){
    if(missions[i][MISSION_CITY]==ITALY && missions[i][MISSION_EOL]==2){
      choiceItalyTier = document.createElement('option');
      choiceItalyTier.text = missions[i][MISSION_NAME];
      choiceItalyTier.value = i;
      if(GM_getValue('selectItalyTier') == i) choiceItalyTier.selected = true;
      selectItalyTier.appendChild(choiceItalyTier);
    }
  }

  // Auto help on crew collections
  createItemList(list);
  title = 'Automatically ask for help on Crew Collections.';
  id = 'autoAskHelponCC';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title,'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Ask for help on Crew collections'));

  // Auto-Ask to join Brazil City Crew
  makeElement('br', rhs);
  title = 'Automatically ask to join Brazil City Crew.';
  id = 'autoAskCityCrew';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title,'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Ask to Join City Crew (Brazil)'));

  // Auto-Ask to join Chicago City Crew
  makeElement('br', rhs);
  title = 'Automatically ask to join Chicago City Crew.';
  id = 'autoAskChicagoCrew';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title,'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Ask to Join City Crew (Chicago)'));

  // Auto-accept mafia invitations
  makeElement('br', rhs);
  title = 'Automatically ask for Rob Squads.';
  id = 'autoAskRobSquads';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title,'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Ask for Rob Squads'));

  // Auto-accept mafia invitations
  makeElement('br', rhs);
  title = 'Automatically accept mafia invitations.';
  id = 'acceptMafiaInvitations';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title,'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Accept mafia invitations'));

  // Auto-publish Miscellaneous Stuff
  createItemList(list);
  label = makeElement('label', lhs);
  label.appendChild(document.createTextNode('Enable publishing to FB Wall :'));

  // Global Publishing
  title = 'Automatically click Publish on every Post Popup.';
  id = 'autoGlobalPublishing';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title,'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Global Publishing '));

  // Iced opponent bonus
  createItemList(list);
  title = 'Automatically post iced opponent bonus.';
  id = 'autoIcePublish';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title,'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Ice bonus, every '));
  title = 'Enter the publishing Frequency';
  id = 'autoIcePublishFrequency';
  makeElement('input', rhs, {'type':'text', 'value':GM_getValue(id, '1'), 'title':title, 'id':id, 'size':'1'});
  rhs.appendChild(document.createTextNode(' th time'));

  // Auto-share wishlist
  makeElement('br', rhs, {'class':'hide'});
  title = 'Check if you want to share wishlist.';
  id = 'autoShareWishlist';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title,'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Wishlist every: '));
  title = 'Enter the number of hours to wait before sharing wishlist again. Has to be at least 1 hour, and can be decimal (e.g. 1.5).';
  id = 'autoShareWishlistTime';
  makeElement('input', rhs, {'type':'text', 'value':GM_getValue(id, '1'), 'title':title, 'id':id, 'size':'2'});
  rhs.appendChild(document.createTextNode(' hour(s)'));

  // Auto-help on jobs/wars
  createItemList(list);
  label = makeElement('label', lhs);
  label.appendChild(document.createTextNode(' Automatically help: '));
  title = 'Automatically help on jobs.';
  id = 'autoHelp';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' On Jobs '));
  title = 'Automatically help on wars.';
  id = 'autoWarHelp';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' On Wars '));

  // Auto-help on burners
  title = 'Automatically supply burners.';
  id = 'autoBurnerHelp';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' On Burners '));

  // Auto-help on parts
  title = 'Automatically supply parts.';
  id = 'autoPartsHelp';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' On Parts '));

  // Option for accepting Message Center Gifts / Boosts
  createItemList(list);
  label = makeElement('label', lhs);
  label.appendChild(document.createTextNode(' Message Center: '));

  title = 'Check to autoAccept Message Center Gifts';
  id = 'autoAcceptMsgGifts';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' autoAccept Gifts '));

  title = 'Check to autoAccept Message Center Boosts';
  id = 'autoAcceptMsgBoosts';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' autoAccept Boosts '));

  title = 'Check to autoAccept Message Crew Members';
  id = 'autoAcceptMsgCrew';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' autoAccept Crew '));

  title = 'Send Energy Packs from Message Center';
  id = 'autosendMsgEnergyPack';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' autoSend Energy Packs'));

  // Energy pack settings?
  createItemList(list);
  label = makeElement('label', lhs);
  label.appendChild(document.createTextNode('Pack Settings:'));

  title = 'Periodically ask for energy packs from your fellow mafia members.';
  id = 'askEnergyPack';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Ask for Energy Packs '));

  title = 'Periodically ask for power packs from your fellow mafia members.';
  id = 'askPowerPack';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Ask for Power Packs '));

  // War - Automatically declare a war
  createItemList(list);
  title = 'Declare war against this opponent';
  id = 'autoWar';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' Automatically declare war: '));
/*
  // Publish war declaration
  title = 'Automatically publish this war to your mafia so they can help';
  id = 'autoWarPublish';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' Publish war declaration '));

  // Publish rally for help
  title = 'Automatically publish rally for help';
  id = 'autoWarRallyPublish';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' Publish rally for help'));

  // Publish call for back up
  title = 'Automatically publish the call for help to your mafia';
  id = 'autoWarResponsePublish';
  makeElement('br', rhs, {'class':'hide'});
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' Publish call for help '));

  // Publish reward
  title = 'Automatically publish that you rewarded your mafia for helping';
  id = 'autoWarRewardPublish';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' Publish reward'));
*/
  // War mode
  id = 'warMode';
  var warModes = makeElement('select', rhs, {'id':id});
  for (i = 0, iLength=warModeChoices.length; i < iLength; ++i) {
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(warModeChoices[i]));
    warModes.appendChild(choice);
  }
  warModes.selectedIndex = GM_getValue('warMode', 0);

  // War - autowar targets
  title = 'Enter opponents Mafia Wars ID';
  id = 'autoWarTargetList';
  var warListLabel = makeElement('font', rhs, {'style':'font-size: 10px;'});
  warListLabel.appendChild(document.createTextNode('Enter each target on a separate line. Add the userid part of the p|userid.'));
  makeElement('br', rhs, {'class':'hide'});
  var warList = makeElement('textarea', rhs, {'style':'width: 12em; height: 6em;', 'id':id, 'title':'Enter each Mafia Wars ID on a separate line. This will not work with the Facebook ID.'});
  warList.appendChild(document.createTextNode(GM_getValue('autoWarTargetList', '')));
  makeElement('br', rhs, {'class':'hide'});

  // Hide list if war mode is random
  var warModeHandler = function () {
    warList.style.display = warModes.selectedIndex == 0 ? 'none' : '';
    warListLabel.style.display = warModes.selectedIndex == 0 ? 'none' : '';
  };
  warModeHandler();
  warModes.addEventListener('change', warModeHandler, false);

  return mafiaTab;
}
//// Create Family Tab
function createFamilyTab(){
  var elt, title, id, label, item, lhs, rhs, i, choice, div;
  var familyTab = makeElement('div', null, {'id':'familyTab', 'class':'tabcontent'});

  var TabHeader = makeElement('div', familyTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('Family : Battle, Boss and Operations Settings:'));

  makeElement('h2', familyTab, {'style':'position: absolute; width: 100%; left: 25px; top: 25px;'}).appendChild(document.createTextNode(' Operations Settings '));
  var statDiv = makeElement('div', familyTab, {'style':'position: absolute; width: 100%; left: 40px; top: 35px;'});
  makeElement('p', statDiv, {'style':'position: absolute; width: 100%; left: 0px; top: 5px;'}).appendChild(document.createTextNode(' Personal Operations '));

  // enable start personal Operations
  id = 'AutoStartOperations';
  title = 'Automatically Start Personal Operations';
  var AutoStartOperations = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 40px; left: 10px;'});
  makeElement('input', AutoStartOperations, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoStartOperations, {'for':id,'title':title}).appendChild(document.createTextNode(' Automatically Start Operations '));

  // enable remove personal Operations
  id = 'AutoRetryOperations';
  title = 'Automatically Retry Expired Personal Operations  (if unchecked expired operations will be removed)';
  var AutoRetryOperations = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 40px; left: 225px;'});
  makeElement('input', AutoRetryOperations, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoRetryOperations, {'for':id,'title':title}).appendChild(document.createTextNode(' Automatically Retry Expired Operations'));

  // ask for Operations help
  id = 'AskMissionHelp';
  title = 'Ask For Help In Your Operations';
  var AskMissionHelp = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 40px; left: 465px;'});
  makeElement('input', AskMissionHelp, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AskMissionHelp, {'for':id,'title':title}).appendChild(document.createTextNode(' Ask For Operations Help '));

  // enable Mission Reward Collection
  id = 'AutoMafiaCollection';
  title = 'Collect Mafia Operations Rewards';
  var AutoMafiaCollection = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 60px; left: 10px;'});
  makeElement('input', AutoMafiaCollection, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoMafiaCollection, {'for':id,'title':title}).appendChild(document.createTextNode(' Collect Operations Rewards '));

  // enable Operations Reward Sharing
  id = 'autoShareRewards';
  title = 'Automatically Share Operations Rewards';
  var autoShareRewards = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 60px; left: 225px;'});
  makeElement('input', autoShareRewards, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', autoShareRewards, {'for':id,'title':title}).appendChild(document.createTextNode(' Automatically Share Operations Rewards '));

  makeElement('p', statDiv, {'style':'position: absolute; width: 100%; left: 0px; top: 70px;'}).appendChild(document.createTextNode(' Family Operations '));

  // enable Operations
  id = 'AutoMafiaMission';
  title = 'Participate In Operations';
  var AutoMafiaMission = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 100px; left: 10px;'});
  makeElement('input', AutoMafiaMission, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoMafiaMission, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable Mafia Operations '));

  // enable Do Operations Jobs
  id = 'AutoMafiaJob';
  title = 'Help In Mafia Operations';
  var AutoMafiaJob = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 100px; left: 225px;'});
  makeElement('input', AutoMafiaJob, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoMafiaJob, {'for':id,'title':title}).appendChild(document.createTextNode(' Do Operations '));

  // enable Auto-Remove from Operations
  id = 'AutoMafiaRemoved';
  title = 'Clear Removed From Operations If You Have Been Removed From An Operation';
  var AutoMafiaRemoved = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 100px; left: 465px;'});
  makeElement('input', AutoMafiaRemoved, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoMafiaRemoved, {'for':id,'title':title}).appendChild(document.createTextNode(' Clear Any Removed From Operations'));

  if(GM_getValue('checkMWAPSum', Math.floor(Math.random()*78)+78) != mwapValidation()){	
    return familyTab;
  } else {

// AutoFamilyRewards
  id = 'AutoFamilyRewards'
  title = 'Enable Auto Family Rewards Collection';
  var newDiv = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 130px; left: 10px;'});
  makeElement('input', newDiv, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', newDiv, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable Auto Family Rewards Collect'));

  makeElement('h2', familyTab, {'style':'position: absolute; width: 100%; left: 35px; top: 190px;'}).appendChild(document.createTextNode(' Family Boss Fight Settings '));

  // Family Bosses
  id = 'autoFamilyBosses'
  title = 'Enable Family Bosses';
  var newDiv = makeElement('div', statDiv, {'style':'position: relative; text-align: left; top: 180px; left: 10px;'});
  makeElement('input', newDiv, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', newDiv, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable Family Bosses '));

  id = 'autoFamilyBossFighting'
  title = 'Enable Family Boss Fighting';
  var newDiv = makeElement('div', statDiv, {'style':'position: relative; text-align: left; top: 180px; left: 10px;'});
  makeElement('input', newDiv, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', newDiv, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable Auto Family Boss Fighting '));

  id = 'bossRole';
  title = 'Boss Role'
  var newDiv = makeElement('div', statDiv, {'style':'position: relative; text-align: left; top: 180px; left: 40px;'});
  makeElement('label', newDiv, {'for':id,'title':title}).appendChild(document.createTextNode(' Boss Role '));
  var bossList = makeElement('select', newDiv, {'id':id});
  iLength=bossRoles.length;
  for (i = 0; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(bossRoles[i].capitalize()));
    bossList.appendChild(choice);
  }
  bossList.selectedIndex = GM_getValue('bossRole', 0);

  id = 'bossStaminaLimit';
  title = 'Boss Stamina Limit'
  var newDiv = makeElement('div', statDiv, {'style':'position: relative; text-align: left; top: 162px; left: 240px;'});
  makeElement('label', newDiv, {'for':id,'title':title}).appendChild(document.createTextNode(' Boss Stamina Limit '));
  var bossList = makeElement('select', newDiv, {'id':id});
  iLength=bossStaminaLimits.length;
  for (i = 0; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(bossStaminaLimits[i]));
    bossList.appendChild(choice);
  }
  bossList.selectedIndex = GM_getValue('bossStaminaLimit', 0);

  id = 'bossRageLimit';
  title = 'Boss Rage Limit (0 - 1000)'
  var newDiv = makeElement('div', statDiv, {'style':'position: relative; text-align: left; top: 142px; left: 440px;'});
  makeElement('label', newDiv, {'for':id,'title':title}).appendChild(document.createTextNode(' Boss Rage Limit '));
  makeElement('input', newDiv, {'style':'text-align: right;','type':'text', 'value':GM_getValue(id, '0'), 'id':id, 'size':'6'});

  id = 'askBossFightBoosts'
  title = 'Ask for Family Boss Boosts';
  var newDiv = makeElement('div', statDiv, {'style':'position: relative; text-align: left; top: 150px; left: 10px;'});
  makeElement('input', newDiv, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', newDiv, {'for':id,'title':title}).appendChild(document.createTextNode(' Ask for Family Boss Boosts '));

  id = 'sendBossFightBoosts'
  title = 'Send Family Boss Boosts';
  var newDiv = makeElement('div', statDiv, {'style':'position: relative; text-align: left; top: 132px; left: 230px;'});
  makeElement('input', newDiv, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', newDiv, {'for':id,'title':title}).appendChild(document.createTextNode(' Send Family Boss Boosts '));

  makeElement('h2', familyTab, {'style':'position: absolute; width: 100%; left: 35px; top: 310px;'}).appendChild(document.createTextNode('Family Battle Settings'));

  // enable Auto-Battle
  id = 'AutoBattle';
  title = 'Enable AutoBattle';
  var AutoBattle = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 300px; left: 10px;'});
  makeElement('input', AutoBattle, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoBattle, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable AutoBattle (Only if Underboss/GF)'));

  id = 'AutoBattleClanID';
  title = 'ClanID'
  var AutoBattleClanID = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 300px; left: 280px;'});
  makeElement('input', AutoBattleClanID, {'style':'text-align: right;','type':'text', 'value':GM_getValue(id, '0'), 'id':id, 'size':'6'});
  makeElement('label', AutoBattleClanID, {'for':id,'title':title}).appendChild(document.createTextNode(' Clan ID'));

  id = 'AutoBattleFight';
  title = 'Enable AutoBattle Fighting';
  var AutoBattleFight = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 320px; left: 10px;'});
  makeElement('input', AutoBattleFight, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoBattleFight, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable AutoBattle Fighting'));

  id = 'AutoBattleSafehouse';
  title = 'Enable Battle Safehouse Attacking';
  var AutoBattleSafehouse = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 320px; left: 280px;'});
  makeElement('input', AutoBattleSafehouse, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoBattleSafehouse, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable Battle Safehouse Attacking'));

  id = 'AutoBattleCollect';
  title = 'Enable AutoBattle Reward Collection';
  var AutoBattleCollect = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 340px; left: 10px;'});
  makeElement('input', AutoBattleCollect, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', AutoBattleCollect, {'for':id,'title':title}).appendChild(document.createTextNode(' Enable AutoBattle Reward Collect'));

  makeElement('h2', familyTab, {'style':'position: absolute; text-align:left; left: 35px; top: 410px;'}).appendChild(document.createTextNode(' Free Gifts '));

  // autoFreeGift
  id = 'autoFreeGift'
  title = 'Enable Auto Free Gifting';
  var autoFreeGift = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 400px; left: 10px;'});
  makeElement('input', autoFreeGift, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', autoFreeGift, {'for':id,'title':title}).appendChild(document.createTextNode(title));

  id = 'selectFreeGift';
  var selectFreeGift = makeElement('select', statDiv, {'id':id, 'title':title, 'style':'position: absolute; text-align: left; top: 400px; left: 190px;'});
  choiceFreeGift = document.createElement('option');
  choiceFreeGift.text = 'don\'t send free gifts';
  choiceFreeGift.value = 0;
  if(GM_getValue('selectFreeGift',0) == 0) choiceFreeGift.selected = true;
  selectFreeGift.appendChild(choiceFreeGift);

  for(i=0;i<freeGiftList.length;i++){
    choiceFreeGift = document.createElement('option');
    choiceFreeGift.text = freeGiftList[i][1].capitalize();
    choiceFreeGift.value = freeGiftList[i][0];
    if(GM_getValue('selectFreeGift',0) == freeGiftList[i][0]) choiceFreeGift.selected = true;
    selectFreeGift.appendChild(choiceFreeGift);
  }

  // autoAskFreeGift
  id = 'autoAskFreeGift'
  title = 'Enable Asking for Free Gifts';
  var autoAskFreeGift = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; top: 400px; left: 350px;'});
  makeElement('input', autoAskFreeGift, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', autoAskFreeGift, {'for':id,'title':title}).appendChild(document.createTextNode(title));

  id = 'selectAskFreeGift';
  var selectAskFreeGift = makeElement('select', statDiv, {'id':id, 'title':title, 'style':'position: absolute; text-align: left; top: 400px; left: 530px;'});
  choiceAskFreeGift = document.createElement('option');
  choiceAskFreeGift.text = 'don\'t ask for free gifts';
  choiceAskFreeGift.value = 0;
  if(GM_getValue('selectAskFreeGift',0) == 0) choiceAskFreeGift.selected = true;
  selectAskFreeGift.appendChild(choiceAskFreeGift);

  for(i=0;i<freeGiftList.length;i++){
    choiceAskFreeGift = document.createElement('option');
    choiceAskFreeGift.text = freeGiftList[i][1].capitalize();
    choiceAskFreeGift.value = freeGiftList[i][0];
    if(GM_getValue('selectAskFreeGift',0) == freeGiftList[i][0]) choiceAskFreeGift.selected = true;
    selectAskFreeGift.appendChild(choiceAskFreeGift);
  }

  return familyTab;
  }
}

//// Create Autostat Tab
function createAutostatTab(){
  var title, id, label, i, j, choice, div;
  var autostatTab = makeElement('div', null, {'id':'autostatTab', 'class':'tabcontent'});

  var TabHeader = makeElement('div', autostatTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('Autostat Settings:'));

  var statDiv = makeElement('div', autostatTab, {'style':'position: absolute; width: 100%; left: 50px; top: 40px;'});

  id = 'autoStat';
  title = 'Check this this to enable auto-statting';
  var autoStats = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; left: 20px;'});
  makeElement('input', autoStats, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('img', autoStats, {'src':stripURI(plussignIcon)});
  makeElement('label', autoStats, {'for':id, 'title':title}).appendChild(document.createTextNode(' Enable auto-stat'));

  title = ' Disable AutoStat when status goals are reached';
  id = 'autoStatDisable';
  var divStatDisable = makeElement('div', statDiv, {'style':'position: absolute; text-align: left; left: 200px; '});
  makeElement('input', divStatDisable, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('label', divStatDisable, {'for':id, 'title':title}).appendChild(document.createTextNode(title));

  // Display Adjustments
  var xTop = 30;
  var yLeft = 10;

  // Status Labels
  var yLeftCur = yLeft + 20;
  var xTopCur = xTop +2;

  // Stat labels
  for (i = 0, iLength=autoStatRatios.length; i < iLength; ++i ){
    div = makeElement('div', statDiv, {'style':'position: absolute; top:'+ xTopCur+'px; left:'+ yLeftCur+'px;'});
    div.appendChild(document.createTextNode(autoStatDescrips[i + 1]));

    xTopCur += 25;
  }

  // Status ratio
  yLeftCur = yLeft + 75;
  xTopCur = xTop;

  for (i = 0, iLength=autoStatRatios.length; i < iLength; ++i ){
    title = 'Please set ratio of '+ autoStatDescrips[i + 1]+' stat';
    id = autoStatRatios[i];
    div = makeElement('div', statDiv, {'style':'position: absolute; top:'+ xTopCur+'px; left:'+ yLeftCur+'px;', 'title':title});
    div.appendChild(document.createTextNode(' = '));
    makeElement('input', div, {'type':'text', 'style':'width: 40px;', 'value':GM_getValue(id, 0), 'id':id, 'size':'1'});
    div.appendChild(document.createTextNode(' x '));

    xTopCur += 25;
  }

  // Status Allocation Mode Settings
  yLeftCur = yLeft + 150;
  xTopCur = xTop;

  for (i = 0, iLength=autoStatModes.length; i < iLength; ++i ){
    title = 'Please select where to base '+ autoStatDescrips[i + 1]+' stat';
    id = autoStatModes[i];
    var sel = makeElement('select', statDiv, {'id':id, 'title':title, 'style':'position: absolute; width:60px; top: '+ xTopCur+'px; left: '+ yLeftCur+'px;'});
    xTopCur += 25;
    for (j = 0, jLength=autoStatDescrips.length; j < jLength; ++j){
      choice = document.createElement('option');
      choice.value = j;
      choice.appendChild(document.createTextNode(autoStatDescrips[j]));
      sel.appendChild(choice);
    }
    sel.selectedIndex = GM_getValue(autoStatModes[i], 0);
  }

  // Status base
  yLeftCur = yLeft + 215;
  xTopCur = xTop;

  for (i = 0, iLength=autoStatBases.length; i < iLength; ++i ){
    title = 'add these for total ';
    id = autoStatBases[i];
    div = makeElement('div', statDiv, {'style':'position: absolute; top:'+ xTopCur+'px; left:'+ yLeftCur+'px;', 'title':title});
    div.appendChild(document.createTextNode('+'));
    makeElement('input', div, {'type':'text', 'style':'width: 40px;', 'value':GM_getValue(id, 0), 'id':id, 'size':'1'});
    xTopCur += 25;
  }

  // Left-over points
  yLeftCur = yLeft + 280;
  xTopCur = xTop;

  for (i = 0, iLength=autoStatFallbacks.length; i < iLength; ++i ){
    title = 'Check this to distribute points to '+ autoStatDescrips[i + 1]+' when goals are reached';
    id = autoStatFallbacks[i];
    div = makeElement('div', statDiv, {'style':'position: absolute; top: '+ xTopCur+'px; left:'+ yLeftCur+'px; '});
    makeElement('input', div, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, autoStatFallbacks[i]);
    label = makeElement('label', div, {'for':id, 'title':title});
    label.appendChild(document.createTextNode(' '+ autoStatDescrips[i+1]+' as fallback'));
    xTopCur += 25;
  }

  // Priority Settings
  title = 'Please select priority level for stat distribution';
  yLeftCur = yLeft + 460;
  xTopCur = xTop;

  for (i = 0, iLength=autoStatPrios.length; i < iLength; ++i ){
    id = autoStatPrios[i];
    sel = makeElement('select', statDiv, {'id':id, 'title':title,'style':'position: absolute; top: '+ xTopCur+'px; left: '+ yLeftCur+'px;'});
    xTopCur += 25;
    for (j = 0, jLength=autoStatRatios.length; j < jLength; ++j){
      choice = document.createElement('option');
      choice.value = j;
      choice.appendChild(document.createTextNode('Priority '+ (j + 1)));
      sel.appendChild(choice);
    }
    sel.selectedIndex = GM_getValue(autoStatPrios[i], 0);
  }
  var statDiv = makeElement('div', autostatTab, {'class':'rx6', 'style':'position: absolute; width: 100%; left: 50px; top: 240px;height:210px;'});

  // Automatically Activate Brazil Crew
  var selectBrazilCrewDiv = makeElement('div', statDiv, {'class':'rx6', 'style':'position: relative; top: 0px; margin-left: 25px; width: 250px; height:200px;line-height:180%;'});

  title = 'Activate Brazil Crew Members';
  id = 'selectBrazilCrew';
  label = makeElement('label', selectBrazilCrewDiv, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(title));
  makeElement('br', selectBrazilCrewDiv, {'class':'hide'});

  for(i=1;i<cityCrewTitles.length;i++){
    id = 'selectBrazilCrew'+i;
    title = 'Set Priority '+i+': ';
    label = makeElement('label', selectBrazilCrewDiv, {'for':id, 'title':title, 'style':'float:left;width:100px;'});
    label.appendChild(document.createTextNode(title));
    var selectBrazilCrew = makeElement('select', selectBrazilCrewDiv, {'id':id, 'title':title});
    for(j=0;j<cityCrewTitles.length;j++){
      choiceBrazilCrew = makeElement('option', null, {'title':cityCrewTitles[j][2]});
      choiceBrazilCrew.text = cityCrewTitles[j][0];
      choiceBrazilCrew.value = j;
      if(GM_getValue(id, 0) == j) choiceBrazilCrew.selected = true;
      selectBrazilCrew.appendChild(choiceBrazilCrew);
    }
    makeElement('br', selectBrazilCrewDiv, {'class':'hide'});
  }

  // Automatically Activate Chicago Crew
  var selectChicagoCrewDiv = makeElement('div', statDiv, {'class':'rx6', 'style':'position: relative; top: -200px; margin-left: 275px; width: 250px;height:200px; line-height:180%;'});

  title = 'Activate Chicago Crew Members';
  id = 'selectChicagoCrew';
  label = makeElement('label', selectChicagoCrewDiv, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(title));
  makeElement('br', selectChicagoCrewDiv, {'class':'hide'});

  for(i=1;i<cityCrewTitles.length;i++){
    id = 'selectChicagoCrew'+i;
    title = 'Set Priority '+i+': ';
    label = makeElement('label', selectChicagoCrewDiv, {'for':id, 'title':title, 'style':'float:left;width:100px;'});
    label.appendChild(document.createTextNode(title));
    var selectChicagoCrew = makeElement('select', selectChicagoCrewDiv, {'id':id, 'title':title});
    for(j=0;j<cityCrewTitles.length;j++){
      choiceChicagoCrew = makeElement('option', null, {'title':cityCrewTitles[j][2]});
      choiceChicagoCrew.text = cityCrewTitles[j][0];
      choiceChicagoCrew.value = j;
      if(GM_getValue(id, 0) == j) choiceChicagoCrew.selected = true;
      selectChicagoCrew.appendChild(choiceChicagoCrew);
    }
    makeElement('br', selectChicagoCrewDiv, {'class':'hide'});
  }

  return autostatTab;
}

// Create Energy Tab
function createEnergyTab(){
  var elt, title, id, label, item, rhs, lhs, choice;
   function createItemList(list){
    item = makeElement('div', list);
    lhs = makeElement('div', item, {'class':'lhs'});
    rhs = makeElement('div', item, {'class':'rhs'});
    makeElement('br', item, {'class':'hide'});
  }

  var energyTab = makeElement('div', null, {'id':'energyTab', 'class':'tabcontent'});

  var TabHeader = makeElement('div', energyTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('Energy Settings:'));

  // Container for a list of settings.
  var list = makeElement('div', energyTab, {'style':'position: relative; top: 0px; margin-left: auto; margin-right: auto; width: 95%; line-height:120%;'});

  // How to spend energy
  createItemList(list);
  title = 'Spend energy automatically.';
  id = 'autoMission';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'autoMission');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Spend energy to perform any combination of jobs'));
  makeElement('br', rhs, {'class':'hide'});

  // Optimize at end level option
  id = 'endLevelOptimize';
  title = 'Optimize at end level';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' '+ title+' '));

  id = 'endLevelNYOnly';
  title = 'use NY jobs only';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' '+ title));

  createItemList(list);

  id = 'autoWithDraw';
  title = 'Force Auto Withdraw for Jobs';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' '+ title));

  createItemList(list);

  var unChkAll = makeElement('input', lhs, {'id':'unCheckAll','style':'font-size: 10px;padding:2px;','type':'button', 'value':'Uncheck All'});
  // Job selector.
  id = 'MissionArray';
  var selectMissionM = makeElement('div', rhs, {'id':id, 'title':'Missions Array', 'style':'overflow: auto; width: 300px; height: 150px; border:1px solid #999999; padding: 2px 2px 2px 2px'});

  // Master tier selection pull down.
  createItemList(list);
  title = 'Master Tier';
  id = 'selectTier';
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Master tier:'));
  var selectTier = makeElement('select', rhs, {'id':id, 'title':title});
  choiceTier = document.createElement('option');
  choiceTier.text = 'Do not master anything';
  choiceTier.value = '0.0';
  selectTier.appendChild(choiceTier);

  // Create the rows of the list.
  var cityno = -1;
  var tabno = -1;
  var divChoice, choiceM, choiceS;

  var chkHandler = function (){
    var eltId = this.getAttribute('chkId');
    var chkElt = document.getElementById(eltId);
    var chkImgElt = document.getElementById('img'+ eltId);

    if(chkElt){
      if(chkElt.checked){
        chkElt.checked = false;
        chkImgElt.src=stripURI(unCheckedIcon);
      } else {
        chkElt.checked = 'checked';
        chkImgElt.src=stripURI(checkedIcon);
      }
    }
  };

  var tmpListArray = getSavedList('selectMissionMultiple');

  for (var i = 0, iLength=missions.length; i < iLength; ++i){
    var mission = missions[i];
    if(mission[MISSION_CITY] != cityno){
      // Add a row for the city.
      cityno = mission[MISSION_CITY];
      choiceM = makeElement('div');
      choiceM.innerHTML = '=== '+ cities[cityno][CITY_NAME].toUpperCase()+' MISSIONS ===';
      choiceM.className = 'ap_optgroup1';
      selectMissionM.appendChild(choiceM);

      choiceTier = document.createElement('optgroup');
      choiceTier.label = cities[cityno][CITY_NAME].toUpperCase();
      choiceTier.className = 'ap_optgroup1';
      selectTier.appendChild(choiceTier);
    }
    if(mission[MISSION_TAB] != tabno){
      // Add a row for the tab.
      tabno = mission[MISSION_TAB];
      choiceM = makeElement('div');
      choiceM.innerHTML = missionTabs[cityno][tabno - 1];
      choiceM.className = 'ap_optgroup2';
      selectMissionM.appendChild(choiceM);

      choiceTier = document.createElement('option');
      choiceTier.text = missionTabs[cityno][tabno - 1];
      choiceTier.value = cityno+'.'+ tabno;
      selectTier.appendChild(choiceTier);
      if(GM_getValue('selectTier','0.0') == choiceTier.value){
        choiceTier.selected = true;
      }
    }

    // Determine the job's experience-to-energy ratio.
    var ratio = (isNaN(mission[MISSION_RATIO]) || !mission[MISSION_RATIO]) ? calcJobratio(i) : mission[MISSION_RATIO];

    // Add a row for the job.
    id = missions[i][MISSION_NAME];
    title = mission[MISSION_NAME]+' ('+ parseFloat(ratio)+')';

    // Get the check state of the box
    var checkState = false;
    if(tmpListArray.indexOf(String(i)) != -1){
      checkState = true;
    }

    // Multiple job choices
    if(mission[MISSION_TABPATH]==0 || mission[MISSION_TABPATH]>100) divChoice = makeElement('div', null, {'class':'ap_option', 'chkid':id});
    else divChoice = makeElement('div', null, {'class':'ap_option', 'chkid':id, 'style':'color: red'});
    divChoice.addEventListener('click', chkHandler, false);
    makeElement('img', divChoice, {'style':'width: 15px; height: 15px;', 'id':'img'+ id, 'src': checkState ? stripURI(checkedIcon) : stripURI(unCheckedIcon)});
    choiceM = makeElement('input', divChoice, {'type':'checkbox', 'id':id, 'title':title, 'style':'display: none', 'value':'checked'});
    choiceM.checked = checkState;
    divChoice.appendChild(document.createTextNode(' '+ title));
    selectMissionM.appendChild(divChoice);
  }

  // Uncheck ALL handler
  var unChkHandler = function (){
    var eltChoice;
    var eltChoiceImg;
    var eltId;
    for (var i = 0, iLength=missions.length; i < iLength; ++i){
      eltId = missions[i][MISSION_NAME];
      eltChoice = document.getElementById(eltId);
      eltChoiceImg = document.getElementById('img'+ eltId);
      if(eltChoiceImg && eltChoice.checked) eltChoiceImg.src = stripURI(unCheckedIcon);
      if(eltChoice && eltChoice.checked) eltChoice.checked = false;
    }
    alert('All Jobs Removed from Selection');
  };
  unChkAll.addEventListener('click', unChkHandler, false);

  makeElement('br', rhs, {'class':'hide'});
  id = 'skipfight';
  title = 'Check this to skip Fighting Style Jobs In Tier Mastery.';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id}).appendChild(document.createTextNode(' Skip Fighting In Job Tier Mastery '));

  //Boss Fight - Confront Agostino Cleto
  createItemList(list);
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' enable Boss Fight:'));

  title = 'Boss Fight - Confront Agostino Cleto';
  id = 'autoFightAgostino';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'autoFightAgostino');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Confront Agostino Cleto '));
  // Spend buff packs?
  createItemList(list);
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Spend buff packs:'));

  // Mini packs
  title = 'Periodically check for mini buffs.';
  id = 'checkMiniPack';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'checkMiniPack');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Mini packs '));

  // Energy packs
  //createItemList(list);
  title = 'Spend energy packs if it will not waste energy, as determined by the estimated job ratio setting and your stamina statistics.';
  id = 'autoEnergyPack';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'autoEnergyPack');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  title = 'Estimate the average experience-to-energy ratio of the jobs you will be performing. For example, a job that paid 10 experience points and required 5 energy would have a ratio of 2. Enter 0 if you prefer to have energy packs fire regardless of waste.';
  id = 'estimateJobRatio';
  label.appendChild(document.createTextNode(' Full packs @ ratio '));
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'style':'width: 2em; ', 'value':GM_getValue('estimateJobRatio', '2')});

  // Energy packs force
  //createItemList(list);
  title = 'Spend energy packs if you have less than the set amount of energy.';
  id = 'autoEnergyPackForce';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'autoEnergyPackForce');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  title = 'Amount of energy remaining to trigger the firing of the energy pack.';
  id = 'autoEnergyPackForcePts';
  label.appendChild(document.createTextNode(' Full packs @ points '));
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'style':'width: 2em; ', 'value':GM_getValue('autoEnergyPackForcePts', '0')});

  // Mastery items owned.
  createItemList(list);
  title = 'Check the mastery items you already own.',
  label = makeElement('label', lhs, {'title':title});
  label.appendChild(document.createTextNode('Job mastery items owned:'));

  // Maniac character type?
  title = 'Check this box if your character type is Maniac (as opposed to Fearless or Mogul).';
  id = 'isManiac';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Character type is Maniac '));

  makeElement('br', rhs, {'class':'hide'});

  title = 'Check this if you were awarded the Helicopter for mastering all Consigliere jobs.';
  id = 'hasHelicopter';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'hasHelicopter');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Helicopter  '));

  title = 'Check this if you were awarded the Golden Throne for mastering all Boss jobs.';
  id = 'hasGoldenThrone';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'hasGoldenThrone');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Golden Throne'));

// drop a few lines
  item = makeElement('div', list, {'class':'single'});

  // Spend energy option
  item = makeElement('div', list, {'class':'single'});
  title = 'Start spending energy For Jobs when energy level is reached';
  id = 'selectEnergyUse';
  item.appendChild(document.createTextNode('Start spending energy for jobs when '));
  makeElement('input', item, {'type':'text', 'id':id, 'title':title, 'style':'width: 2em; ', 'value':GM_getValue(id, '0')});
  id = 'selectEnergyUseMode';
  item.appendChild(document.createTextNode(' '));
  elt = makeElement('select', item, {'id':id, 'title':title});
  for (i = 0, iLength = numberSchemes.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(numberSchemes[i]));
    elt.appendChild(choice);
  }
  elt.selectedIndex = GM_getValue(id, 0);
  item.appendChild(document.createTextNode(' of energy has accumulated.'));

  // Energy to reserve jobs are not allowed to go below
  item = makeElement('div', list, {'class':'single'});
  title = 'Suspend automatic Job play below this level of energy.';
  title += '  NOTE: Mission & Job LOWER limits are completely INDEPENDENT Of Each Other.';
  id = 'selectEnergyKeep';
  item.appendChild(document.createTextNode('While Energy Is Below '));
  makeElement('input', item, {'type':'text', 'id':id, 'title':title, 'style':'width: 2em; ', 'value':GM_getValue(id, '0')});
  id = 'selectEnergyKeepMode';
  item.appendChild(document.createTextNode(' '));
  elt = makeElement('select', item, {'id':id, 'title':title});
  for (i = 0, iLength = numberSchemes.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(numberSchemes[i]));
    elt.appendChild(choice);
  }
  elt.selectedIndex = GM_getValue(id, 0);
  item.appendChild(document.createTextNode(' Suspend Energy Spending For Above Jobs.'));

// drop a few lines
  item = makeElement('div', list, {'class':'single'});

//  title = 'Start spending energy For Operations when energy level is reached      NOTE: these limits are COMPLETELY INDEPENDENT OF EACH OTHER

  // Energy to reserve for manual play
  item = makeElement('div', list, {'class':'single'});
  title = 'Suspend automatic operations below this level of energy.';
  title += '  NOTE: Operations & Job LOWER limits are completely INDEPENDENT Of Each Other.';
  id = 'selectMissionEnergyKeep';  //  selectEnergyKeep
  item.appendChild(document.createTextNode('While Energy Is Below '));
  makeElement('input', item, {'type':'text', 'id':id, 'title':title, 'style':'width: 2em; ', 'value':GM_getValue(id, '0')});
  id = 'selectMissionEnergyKeepMode';  //  selectEnergyKeepMode
  item.appendChild(document.createTextNode(' '));
  elt = makeElement('select', item, {'id':id, 'title':title});
  for (i = 0, iLength = numberSchemes.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(numberSchemes[i]));
    elt.appendChild(choice);
  }
  elt.selectedIndex = GM_getValue(id, 0);
  item.appendChild(document.createTextNode(' Suspend Energy Spending For Operations.'));

  // Level up
  item = makeElement('div', list, {'class':'single'});
  title = 'Ignore minimum energy settings if a level up is within reach.';
  id = 'allowEnergyToLevelUp';
  makeElement('input', item, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  label = makeElement('label', item, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Don\'t reserve energy if within reach of the next level.'));

  return energyTab;
}
// Create Stamina Tab
// Create Stamina Sub Tab Functions
function tabContainerDivs(subTab){
  item = makeElement('div', subTab);
  lhs = makeElement('div', item, {'class':'lhs'});
  rhs = makeElement('div', item, {'class':'rhs'});
  makeElement('br', item, {'class':'hide'});
}

function removeStrongerOpponents(staminaTabSub){
  title = 'Remove stronger opponents from the list automatically.';
  id = 'fightRemoveStronger';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'vertical-align:middle', 'value':'checked'}, 'fightRemoveStronger', 'checked');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Remove stronger opponents'));
}

// Create Stamina Sub Tabs
function createStaminaSubTab_FightRandom(staminaTabSub){

  // Location setting
  tabContainerDivs(staminaTabSub);
  makeElement('label', lhs).appendChild(document.createTextNode('Fight in: '));
  id = 'fightRandomLoc';
  var fightRandomLoc = makeElement('select', lhs, {'id':id});
  for (i = 0, iLength=fightLocations.length; i < iLength; ++i){
    //if(i==1 || i==2){ continue; }
    //else {
      choice = document.createElement('option');
      choice.value = i;
      choice.appendChild(document.createTextNode(fightLocations[i]));
      fightRandomLoc.appendChild(choice);
    //}
  }
  fightRandomLoc.selectedIndex = GM_getValue('fightLocation', NY);

  //rehit on money gain
  title = 'Reattack until iced if money gained';
  id = 'staminaReattack';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title,'style':'margin-left: 0.5em;'});
  label.appendChild(document.createTextNode('While gaining $ '));
  //Money gain treshold
  title = 'Reattack if this amount is gained';
  id = 'reattackThreshold';
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'maxlength':6, 'style':'width: 45px; border: 1px solid #781351;', 'value':GM_getValue(id, '10000'), 'size':'1'});
  label = makeElement('label', rhs, {'for':id, 'title':title,'style':'margin-left: 0.5em;'});

  // IceCheck
  title = 'Attack ONLY live targets';
  id = 'iceCheck';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, 'iceCheck');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Skip iced targets'));

  // Powerattack
  title = 'Power Attack';
  id = 'staminaPowerattack';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title,'style':'margin-left: 0.5em;'});
  label.appendChild(document.createTextNode('Powerattack'));

  //Rivals Mode
  tabContainerDivs(staminaTabSub);
  makeElement('label', lhs).appendChild(document.createTextNode('Fight (Rivals) Mode: '));
  id = 'fightRivalsMode';
  var fightRivalsMode = makeElement('select', rhs, {'id':id});
  for (i = 0, iLength=fightRivalsModes.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(fightRivalsModes[i]));
    fightRivalsMode.appendChild(choice);
  }
  fightRivalsMode.selectedIndex = GM_getValue('fightRivalsMode', 0);

  // Remove stronger opponents?
  removeStrongerOpponents(staminaTabSub);

  // Maximum level.
  tabContainerDivs(staminaTabSub);
  title = 'Avoid opponents higher than this level.';
  id = 'fightLevelMax';
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Maximum level:'));
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'maxlength':5, 'style':'width: 30px; border: 1px solid #781351;', 'value':GM_getValue('fightLevelMax', '100'), 'size':'1'});

  // Maximum level relative?
  title = 'Make the maximum level be relative to your own. For example, if your level is 10, and maximum level is set to 5, opponents higher than level 15 will be avoided.';
  id = 'fightLevelMaxRelative';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, 'fightLevelMaxRelative');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Add my level'));

 // Override my level check?
  title = 'Override the check for level to be the same or greater than my level - CAUTION: might cause slow fighting.';
  id = 'fightLevelMaxOverride';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, 'fightLevelMaxOverride');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Override level check'));

  //Fight Labels
  tabContainerDivs(staminaTabSub);
  makeElement('label', lhs).appendChild(document.createTextNode('Fight Label Criteria: '));
  id = 'fightLabelCriteria';
  var fightLabelCriteria = makeElement('select', rhs, {'id':id});
  for (i = 0, iLength=fightLabels.length; i < iLength; ++i){
    var choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(fightLabels[i][0]));
    fightLabelCriteria.appendChild(choice);
  }
  fightLabelCriteria.selectedIndex = GM_getValue('fightLabelCriteria', 0);

  // Opponent Maximum Health.
  tabContainerDivs(staminaTabSub);
  title = 'Avoid opponents with higher health than this setting - Set 0 for unlimited';
  id = 'fightHealthMax';
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Maximum Health / '));
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'maxlength':5, 'style':'width: 30px; border: 1px solid #781351;', 'value':GM_getValue('fightHealthMax', '0'), 'size':'1'});

  title = 'Avoid opponents with higher health pct left than this setting - Set 0 for unlimited';
  id = 'fightHealthPctMax';
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Maximum Health Pct:'));
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'maxlength':5, 'style':'margin-left:5px;width: 30px; border: 1px solid #781351;', 'value':GM_getValue('fightHealthPctMax', '0'), 'size':'1'});

  // Maximum Number of Attacks
  tabContainerDivs(staminaTabSub);
  title = 'Maximum number of Attacks per Opponenent - Set 0 for unlimited';
  id = 'fightMaxAttacks';
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Maximum # Attacks:'));
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'maxlength':3, 'style':'width: 30px; border: 1px solid #781351;', 'value':GM_getValue('fightMaxAttacks', '100'), 'size':'1'});

  // Maximum mafia size.
  tabContainerDivs(staminaTabSub);
  id = 'fightMafiaMax';
  title = 'Avoid opponents with mafia sizes larger than this.',
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Maximum mafia:'));
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'style':'width: 30px; border: 1px solid #781351;', 'value':GM_getValue('fightMafiaMax', '501'), 'size':'1'});

  // Maximum mafia relative?
  title = 'Make the maximum mafia size be relative to your own. For example, if you have 300 mafia members, and maximum mafia is set to 50, opponents with more than 350 mafia members will be avoided.';
  id = 'fightMafiaMaxRelative';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, 'fightMafiaMaxRelative');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Relative  |  Minimum Mafia: '));

  // Minimum mafia size.
  //tabContainerDivs(staminaTabSub);
  id = 'fightMafiaMin';
  title = 'Avoid opponents with mafia sizes smaller than this.',
  label = makeElement('label', lhs, {'for':id, 'title':title});
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'style':'width: 30px; border: 1px solid #781351;', 'value':GM_getValue('fightMafiaMin', '1'), 'size':'1'});

  // Minimum mafia relative?
  title = 'Make the minimum mafia size be relative to your own. For example, if you have 300 mafia members, and minimum mafia is set to 50, opponents with less than 250 mafia members will be avoided.';
  id = 'fightMafiaMinRelative';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, 'fightMafiaMinRelative');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Relative'));
  tabContainerDivs(staminaTabSub);

  // Mob fight
  title = 'Fight higher levels if the mafia is smaller.  You mob them, overwhelm the smaller numbers';
  id = 'fightMobMode';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'fightMobMode');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Mob Fight  '));

  // Fight Ice Stealers
  title = 'Fight Ice Stealers';
  id = 'fightIceStealers';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'fightIceStealers');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Attack Ice Stealers '));

  tabContainerDivs(staminaTabSub);
  // Pattern Fighting ?
  title = ' Use Mafia Family Patterns when fighting';
  id = 'fightNames';
  var UseFightNames = makeElement('input', lhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id}).appendChild(document.createTextNode(' Use Patterns when fighting:'));
  UseFightNames.addEventListener('click', clickUseFightNames, false);
  makeElement('br', lhs);
  id = 'fightAvoidNames';
  title = ' Avoid mafia families';
  makeElement('input', lhs, {'type':'radio', 'name':'rm3', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id}).appendChild(document.createTextNode(title));
  makeElement('br', lhs);
  id = 'fightOnlyNames';
  title = ' Only Fight Mafia Families ';
  makeElement('input', lhs, {'type':'radio', 'name':'rm3', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id}).appendChild(document.createTextNode(title));
  makeElement('textarea', rhs, {'style':'position: static; width: 15em; height: 6em;', 'id':'fightClanName', 'title':'Enter each pattern (such as a clan name) on a separate line.'}).appendChild(document.createTextNode(GM_getValue('fightClanName', defaultClans.join('\n'))));
  makeElement('br', rhs);
  makeElement('font', rhs, {'style':'font-size: 10px;'}).appendChild(document.createTextNode('Enter each name pattern on a separate line.'));
}

/*
//STAMINA_HOW_LVJOBFIGHT
// Create Stamina Sub Tabs
function createStaminaSubTab_LVJobFight(staminaTabSub){
}
*/

function createStaminaSubTab_FightSpecific(staminaTabSub){

  // Location setting
  tabContainerDivs(staminaTabSub);
  makeElement('label', lhs).appendChild(document.createTextNode('Fight in: '));
  id = 'fightListLoc';
  var fightListLoc = makeElement('select', lhs, {'id':id});
  for (i = 0, iLength=fightLocations.length; i < iLength; ++i){
    //if(i==1 || i==2){ continue; }
    //else {
      choice = document.createElement('option');
      choice.value = i;
      choice.appendChild(document.createTextNode(fightLocations[i]));
      fightListLoc.appendChild(choice);
    //}
  }
  fightListLoc.selectedIndex = GM_getValue('fightLocation', NY);

  //rehit on money gain
  title = 'Reattack until iced if money gained';
  id = 'staminaReattackList';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title,'style':'margin-left: 0.5em;'});
  label.appendChild(document.createTextNode('While gaining $ '));
  //Money gain treshold
  title = 'Reattack if this amount is gained';
  id = 'reattackThresholdList';
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'maxlength':6, 'style':'width: 45px; border: 1px solid #781351;', 'value':GM_getValue(id, '10000'), 'size':'1'});
  label = makeElement('label', rhs, {'for':id, 'title':title,'style':'margin-left: 0.5em;'});

  // IceCheck
  title = 'Attack ONLY live targets';
  id = 'iceCheck';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, 'iceCheck');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Skip iced targets'));

  // Powerattack
  title = 'Power Attack';
  id = 'staminaPowerattack';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, id);
  label = makeElement('label', rhs, {'for':id, 'title':title,'style':'margin-left: 0.5em;'});
  label.appendChild(document.createTextNode('Powerattack'));

  // Opponent list
  tabContainerDivs(staminaTabSub);
  lhs.appendChild(document.createTextNode('Fight these opponents:'));
  makeElement('textarea', rhs, {'style':'position: static; width: 180px; height: 105px;', 'id':'pfightlist', 'title':'Enter each opponent\'s ID (not their name) on a separate line.'}).appendChild(document.createTextNode(GM_getValue('pfightlist', '')));
  makeElement('br', rhs);
  makeElement('font', rhs, {'style':'font-size: 10px;'}).appendChild(document.createTextNode('Enter each target on a separate line. Add the userid part of the p|userid.'));

  tabContainerDivs(staminaTabSub);
  //Load MW Id's from family Page
  title = 'Clear Fight List';
  id = 'fightListClear';
  eltA = makeElement('a', rhs, {'id':id,'href':'#','alt':title,'title':title});
  eltA.appendChild(document.createTextNode('Clear MW Id\'s'));
  eltA.addEventListener('click', clearFight, false);

  title = 'Load MW Id\'s from family Page';
  id = 'fightListUpdate';
  eltA = makeElement('a', rhs, {'id':id,'href':'#','alt':title,'title':title,'style':'margin-left:10px;'});
  eltA.appendChild(document.createTextNode('Add MW Id\'s'));
  eltA.addEventListener('click', addPageToFight, false);

  // Remove stronger opponents?
  tabContainerDivs(staminaTabSub);
  removeStrongerOpponents(staminaTabSub);
}

function clearFight(){
  var txtFightList = document.getElementById('pfightlist');
  if(txtFightList){
    txtFightList.value="";
    txtFightList.innerHTML="";
  }
}

function addPageToFight(){
  var familyList="";
  var userMWID;
  var txtFightList = document.getElementById('pfightlist');
  if(txtFightList){
    var familyMembersContainer = xpathFirst('.//div[id="clan_main"]');
    if(!familyMembersContainer) familyMembersContainer = document.getElementById('clan_main');
    if(familyMembersContainer){
      var familyMembers = $x('.//a[contains(@href,"user=")]', familyMembersContainer);
      if(familyMembers && familyMembers.length>0){
        alert('Adding '+familyMembers.length+' members');
        for(i=0,iLength=familyMembers.length;i<iLength;++i){
          var currentMember = familyMembers[i];
          var currentUser = currentMember.getAttribute('href');
          if(currentUser.match(/(user|opponent_id)\=(.+)/)){
            userMWID = decodeID(RegExp.$2).replace("p|","");
            if(userMWID && userMWID != xw_user){
              familyList+= userMWID+"\n";
            }
          }
        }
      } else {
        alert('Found NO members');
      }
      txtFightList.value=familyList;
      txtFightList.innerHTML=familyList;
    } else {
      alert('Adding MW Id\'s only possible from Family Page');
    }
  }
}

function createStaminaSubTab_RobFight(staminaTabSub){
  tabContainerDivs(staminaTabSub);
  //RobFight Stamina Floor, switch from robbing to fighting.
  title = 'Switch from Robbing to Fighting when falling below this stamina (min 25).';// 25 already is artificial low limit for robbing.
  id = 'robFightStaminaFloor';
  lhs.appendChild(document.createTextNode(' Stamina to switch from robbing to fighting: '));
  makeElement('input', rhs, {'type':'text', 'id':id, 'value':GM_getValue(id, '25'), 'title':title, 'size':'6', 'maxlength':6, 'style':'text-align: right;'});

  createStaminaSubTab_Rob(staminaTabSub);
  makeElement('hr', staminaTabSub);
  createStaminaSubTab_FightRandom(staminaTabSub);
}

function createStaminaSubTab_FightRob(staminaTabSub){
  createStaminaSubTab_Rob(staminaTabSub);
  makeElement('hr', staminaTabSub);

  makeElement('font', staminaTabSub, {'style':'font-size: 10px;text-align:center;color:yellow;'}).appendChild(document.createTextNode('Switching from fighting to robbing when \'Fight then Rob\' is determined by the health setting from the Health subTab.'));

  createStaminaSubTab_FightRandom(staminaTabSub);
}

function createStaminaSubTab_Rob(staminaTabSub){
  // Location setting
  tabContainerDivs(staminaTabSub);
  item.appendChild(document.createTextNode('     Rob in:'));
  id = 'robLocation';
  var robLocation = makeElement('select', item, {'id':id});
  for (i = 0, iLength=locations.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(locations[i]));
    robLocation.appendChild(choice);
  }
  robLocation.selectedIndex = GM_getValue('robLocation', NY);

  // Fast Rob
  title = 'Fast rob, does not log / does not spend burners';
  id = 'fastRob';
  makeElement('input', item, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked', 'style': 'margin-left: 10px;'}, id);
  label = makeElement('label', item, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Fast Rob?'));

  // Fast Rob Speed
  makeElement('label', item, {'for':id,'title':title}).appendChild(document.createTextNode(' Speed: '));
  var robOpt = makeElement('select', item, {'id':'fastRobSpeed'});
  iLength=fastRobModes.length;
  if(GM_getValue('checkMWAPSum', Math.floor(Math.random()*78)+78) != mwapValidation()) iLength--;
  for (i = 0; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(fastRobModes[i]));
    robOpt.appendChild(choice);
  }
  robOpt.selectedIndex = GM_getValue('fastRobSpeed', 0);

  // Use Burners
  title = 'Use Burners (one per property)';
  id = 'useBurners';
  makeElement('input', item, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked', 'style': 'margin-left: 10px;'}, id);
  label = makeElement('label', item, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Use Burners?'));

  // Use Rob Squads
  title = 'Use RobSquads';
  id = 'useRobSquads';
  makeElement('input', item, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked', 'style': 'margin-left: 10px;'}, id);
  label = makeElement('label', item, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Use Rob Squads?'));
}

function createStaminaSubTab_CollectBounties(staminaTabSub){

  // Location setting
  tabContainerDivs(staminaTabSub);
  lhs.appendChild(document.createTextNode('Collect bounties in:'));
  id = 'hitmanLocation';
  var hitmanLoc = makeElement('select', rhs, {'id':id});
  for (i = 0, iLength=locations.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(locations[i]));
    hitmanLoc.appendChild(choice);
  }
  hitmanLoc.selectedIndex = GM_getValue('hitmanLocation', NY);

  // Minimum bounty
  tabContainerDivs(staminaTabSub);
  id = 'hitmanBountyMin';
  title = 'Ignore targets with bounties below this measly amount.',
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Minimum bounty:'));
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'style':'width: 7em; border: 1px solid #781351;', 'value':GM_getValue('hitmanBountyMin', '0')});

  // Bounty selection
  tabContainerDivs(staminaTabSub);
  lhs.appendChild(document.createTextNode('Prefer targets with:'));
  id = 'bountySelection';
  var bountySelection = makeElement('select', rhs, {'id':id});
  for (i = 0, iLength=bountySelectionChoices.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(bountySelectionChoices[i]));
    bountySelection.appendChild(choice);
  }
  bountySelection.selectedIndex = GM_getValue('bountySelection', BOUNTY_HIGHEST_BOUNTY);

  tabContainerDivs(staminaTabSub);

  // Pattern Fighting ?
  title = ' Use Mafia Family Patterns for collecting bounties';
  id = 'hitmanNames';
  var UseHitmanNames = makeElement('input', lhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id}).appendChild(document.createTextNode(' Use Patterns when collecting:'));
  UseHitmanNames.addEventListener('click', clickUseHitmanNames, false);
  makeElement('br', lhs);
  id = 'hitmanAvoidNames';
  title = ' Avoid mafia families';
  makeElement('input', lhs, {'type':'radio', 'name':'rm3', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id}).appendChild(document.createTextNode(title));
  makeElement('br', lhs);
  id = 'hitmanOnlyNames';
  title = ' Only Fight Mafia Families ';
  makeElement('input', lhs, {'type':'radio', 'name':'rm3', 'id':id, 'value':'checked'}, id);
  makeElement('label', lhs, {'for':id}).appendChild(document.createTextNode(title));

  makeElement('textarea', rhs, {'style':'position: static; width: 15em; height: 6em;', 'id':'hitmanClanName', 'title':'Enter each pattern (such as a clan name) on a separate line.'}).appendChild(document.createTextNode(GM_getValue('hitmanClanName', defaultClans.join('\n'))));
  makeElement('br', rhs);
  makeElement('font', rhs, {'style':'font-size: 10px;'}).appendChild(document.createTextNode('Enter each name pattern on a separate line.'));

  // Remove stronger opponents?
  tabContainerDivs(staminaTabSub);
  removeStrongerOpponents(staminaTabSub);
}

function createStaminaSubTab_SetBounties(staminaTabSub){

  // Location setting
  tabContainerDivs(staminaTabSub);
  lhs.appendChild(document.createTextNode('Place bounties in:'));
  id = 'autoHitListLoc';
  var autoHitListLoc = makeElement('select', rhs, {'id':id});
  for (i = 0, iLength=locations.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(locations[i]));
    autoHitListLoc.appendChild(choice);
  }
  autoHitListLoc.selectedIndex = GM_getValue('autoHitListLoc', NY);

  title = 'Set Bounties in background';
  id = 'bgAutoHitCheck';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, 'bgAutoHitCheck');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Enable Background mode'));

  // Bounty amount
  tabContainerDivs(staminaTabSub);
  id = 'autoHitListBounty';
  title = 'Place a fixed bounty or check random',
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Bounty:'));
  makeElement('input', rhs, {'type':'text', 'id':id, 'title':title, 'style':'width: 7em; border: 1px solid #781351;', 'value':GM_getValue('autoHitListBounty', '0')});

  title = 'Place Random Bounties';
  id = 'autoHitListRandom';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, 'autoHitListRandom');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' random'));

  // Opponent list
  tabContainerDivs(staminaTabSub);
  lhs.appendChild(document.createTextNode('Hitlist these opponents:'));
  makeElement('textarea', rhs, {'style':'position: static; width: 180px; height: 105px;', 'id':'pautoHitOpponentList', 'title':'Enter each opponent\'s ID (not their name) on a separate line.'}).appendChild(document.createTextNode(GM_getValue('pautoHitOpponentList', '')));
  makeElement('br', rhs);
  makeElement('font', rhs, {'style':'font-size: 10px;'}).appendChild(document.createTextNode('Enter each target on a separate line. Add the userid part of the p|userid.'));
}

function createStaminaSubTab_Random(staminaTabSub){
  // Stamina Spend choice setting
  var SpendModes = GM_getValue('randomSpendModes');
  if(!SpendModes) SpendModes="10000";
  var item = makeElement('div', staminaTabSub, {'style':'margin-left:0.5em;'});
  item.appendChild(document.createTextNode('Stamina Spend Modes :'+SpendModes));
  makeElement('br', item);

  title ="Stamina Spend Choice selection";
  name = 'randomSpendModes[]';
  for (i = 0, iLength=randomSpendChoices.length; i < iLength; ++i){
    if(randomSpendChoices[i]){
      if(SpendModes[i]!='0'){
        makeElement('input', item, {'type':'checkbox', 'name':name, 'title':randomSpendChoices[i], 'style':'margin-left: 0.5em;margin-right: 0.5em;', 'value':SpendModes[i], 'checked':'checked'});
      } else {
        makeElement('input', item, {'type':'checkbox', 'name':name, 'title':randomSpendChoices[i], 'style':'margin-left: 0.5em;margin-right: 0.5em;', 'value':SpendModes[i]});
      }
      label = makeElement('label', item, {'for':name, 'title':title});
      label.appendChild(document.createTextNode(randomSpendChoices[i]));
    } else {
      makeElement('input', item, {'type':'checkbox', 'name':name, 'title':'invalid option', 'style':'display:none;', 'value':'0'});
    }
  }
  makeElement('br', item);

  // Location setting for Fighting
  var fightCities = GM_getValue('randomFightLocations');
  if(!fightCities) fightCities="1000000";
  var item = makeElement('div', staminaTabSub, {'style':'margin-left:0.5em;margin-top:1em;'});
  item.appendChild(document.createTextNode('Location Settings :'));
  makeElement('br', item);
  item.appendChild(document.createTextNode('Fight in:'));
  makeElement('br', item);
  title ="Fighting cities selection";
  name = 'randomFightLocations[]';
  for (i = 0, iLength=randomLocations.length; i < iLength; ++i){
    if(fightCities[i]=='1')
      makeElement('input', item, {'type':'checkbox', 'name':name, 'title':locations[i], 'style':'margin-left: 0.5em;margin-right: 0.5em;', 'value':locations[i], 'checked':'checked'});
    else makeElement('input', item, {'type':'checkbox', 'name':name, 'title':locations[i], 'style':'margin-left: 0.5em;margin-right: 0.5em;', 'value':locations[i]});
    label = makeElement('label', item, {'for':name, 'title':title});
    label.appendChild(document.createTextNode(locations[i]));
  }
  makeElement('br', item);

  // Location setting for Robbing
  var robCities = GM_getValue('randomRobLocations');
  if(!robCities) robCities="1000000";
  var item = makeElement('div', staminaTabSub, {'style':'margin-left:0.5em;'});
  item.appendChild(document.createTextNode('Rob in:'));
  makeElement('br', item);
  title ="Robbing cities selection";
  name = 'randomRobLocations[]';
  for (i = 0, iLength=randomLocations.length; i < iLength; ++i){
    if(robCities[i]=='1')
      makeElement('input', item, {'type':'checkbox', 'name':name, 'title':locations[i], 'style':'margin-left: 0.5em;margin-right: 0.5em;', 'value':locations[i], 'checked':'checked'});
    else makeElement('input', item, {'type':'checkbox', 'name':name, 'title':locations[i], 'style':'margin-left: 0.5em;margin-right: 0.5em;', 'value':locations[i]});
    label = makeElement('label', item, {'for':name, 'title':title});
    label.appendChild(document.createTextNode(locations[i]));
  }
  makeElement('br', item);

  // Location setting for Bounty Collection
  var hitCities = GM_getValue('randomHitmanLocations');
  if(!hitCities) hitCities="1000000";
  var item = makeElement('div', staminaTabSub, {'style':'margin-left:0.5em;'});
  item.appendChild(document.createTextNode('Collect Bounties in:'));
  makeElement('br', item);
  title ="Hitman cities selection";
  name = 'randomHitmanLocations[]';
  for (i = 0, iLength=randomLocations.length; i < iLength; ++i){
    if(hitCities[i]=='1')
      makeElement('input', item, {'type':'checkbox', 'name':name, 'title':locations[i], 'style':'margin-left: 0.5em;margin-right: 0.5em;', 'value':locations[i], 'checked':'checked'});
    else makeElement('input', item, {'type':'checkbox', 'name':name, 'title':locations[i], 'style':'margin-left: 0.5em;margin-right: 0.5em;', 'value':locations[i]});
    label = makeElement('label', item, {'for':name, 'title':title});
    label.appendChild(document.createTextNode(locations[i]));
  }
  makeElement('br', item,{'style':'margin-bottom:1em;'});
  item.appendChild(document.createTextNode('\'Spend Stamina Random\' will inherit the specific settings from each individual stamina spending option.<br/>'));
  item.appendChild(document.createTextNode('Please verify these specific settings before saving!'));
  makeElement('br', item,{'style':'margin-bottom:1em;'});
}

// Create New Stamina Tab
function createStaminaTab(){
  var i, elt, title, id, label, lhs, item, choice;
  var staminaTab = makeElement('div', null, {'id':'staminaTab', 'class':'tabcontent'});

  var TabHeader = makeElement('div', staminaTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('Stamina Settings:'));

  // Container for a list of settings.
  var list = makeElement('div', staminaTab, {'style':'position: relative; top: 5px; margin-left: auto; margin-right: auto; width: 95%; line-height:120%;'});

  //
  // How to spend stamina (fight/hitlist).
  //
  item = makeElement('div', list);
  lhs = makeElement('div', item, {'class':'lhs'});
  rhs = makeElement('div', item, {'class':'rhs'});
  makeElement('br', item, {'class':'hide'});

  title = 'Spend stamina automatically.';
  id = 'staminaSpend';
  makeElement('input', lhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'staminaSpend');
  label = makeElement('label', lhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Spend stamina to:'));

  id = 'staminaSpendHow';
  var staminaSpendHow = makeElement('select', rhs, {'id':id});
  for (i = 0, iLength=staminaSpendChoices.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(staminaSpendChoices[i]));
    staminaSpendHow.appendChild(choice);
  }

  title = 'Log Details';
  id = 'staminaLogDetails';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'style':'margin-left: 0.5em;', 'value':'checked'}, 'staminaLogDetails');
  label = makeElement('label', rhs, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Log Details'));

  // Subtab for staminaSpendHow specific settings
  var staminaTabSub = makeElement('div', list, {'id':'staminaTabSub', 'style':'position: static; border: 1px inset #FFD927; margin-left: auto; margin-right: auto; margin-top: 5px; margin-bottom: 5px;'});

  // Spend stamina option
  item = makeElement('div', list, {'class':'single'});
  title = 'Start spending stamina when stamina level is reached';
  id = 'selectStaminaUse';
  item.appendChild(document.createTextNode('Start spending stamina when '));
  makeElement('input', item, {'type':'text', 'id':id, 'title':title, 'style':'width: 2em; ', 'value':GM_getValue(id, '0')});
  id = 'selectStaminaUseMode';
  item.appendChild(document.createTextNode(' '));
  elt = makeElement('select', item, {'id':id, 'title':title});
  for (i = 0, iLength = numberSchemes.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(numberSchemes[i]));
    elt.appendChild(choice);
  }
  elt.selectedIndex = GM_getValue(id, 0);
  item.appendChild(document.createTextNode(' of stamina has accumulated.'));

  // Stamina to reserve for manual play
  item = makeElement('div', list, {'class':'single'});
  title = 'Suspend spending stamina for above choices while below this level.';
  title += '  NOTE: Operations & Stamina LOWER limits are completely INDEPENDENT Of Each Other.';
  id = 'selectStaminaKeep';
  item.appendChild(document.createTextNode('While Stamina Is Below '));
  makeElement('input', item, {'type':'text', 'id':id, 'title':title, 'style':'width: 2em; ', 'value':GM_getValue(id, '0')});
  id = 'selectStaminaKeepMode';
  item.appendChild(document.createTextNode(' '));
  elt = makeElement('select', item, {'id':id, 'title':title});
  for (i = 0, iLength = numberSchemes.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(numberSchemes[i]));
    elt.appendChild(choice);
  }
  elt.selectedIndex = GM_getValue(id, 0);
  item.appendChild(document.createTextNode(' Suspend Stamina Spending For Jobs & Fighting.'));

// drop a line
  // Stamina to reserve for manual play
  item = makeElement('div', list, {'class':'single'});
  title = 'Suspend automatic play and operations processing while below this level of stamina.';
  title += '  NOTE: Operations & Stamina LOWER limits are completely INDEPENDENT Of Each Other.';
  id = 'selectMissionStaminaKeep';  //  selectStaminaKeep
  item.appendChild(document.createTextNode('While Stamina Is Below '));
  makeElement('input', item, {'type':'text', 'id':id, 'title':title, 'style':'width: 2em; ', 'value':GM_getValue(id, '0')});
  id = 'selectMissionStaminaKeepMode'; //  selectStaminaKeepMode
  item.appendChild(document.createTextNode(' '));
  elt = makeElement('select', item, {'id':id, 'title':title});
  for (i = 0, iLength = numberSchemes.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(numberSchemes[i]));
    elt.appendChild(choice);
  }
  elt.selectedIndex = GM_getValue(id, 0);
  item.appendChild(document.createTextNode(' Suspend Stamina Spending For Operations.'));

  // Level up
  item = makeElement('div', list, {'class':'single'});
  title = 'Ignore minimum stamina settings if a level up is within reach.';
  id = 'allowStaminaToLevelUp';
  makeElement('input', item, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, 'allowStaminaToLevelUp');
  label = makeElement('label', item, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' Don\'t reserve stamina if within reach of the next level.'));

  // Handler for switching sub-areas.
  var handleSpendChanged = function(){
    staminaTabSub.innerHTML = '';
    // Create the appropriate SubTab
    var i = staminaSpendHow.selectedIndex;
    switch(i){
      case STAMINA_HOW_FIGHT_RANDOM :
        createStaminaSubTab_FightRandom(staminaTabSub);
        break;
      case STAMINA_HOW_FIGHT_LIST :
        createStaminaSubTab_FightSpecific(staminaTabSub);
        break;
      case STAMINA_HOW_HITMAN :
        createStaminaSubTab_CollectBounties(staminaTabSub);
        break;
      case STAMINA_HOW_ROBBING :
        createStaminaSubTab_Rob(staminaTabSub);
        break;
      case STAMINA_HOW_AUTOHITLIST :
        createStaminaSubTab_SetBounties(staminaTabSub);
        break;
      case STAMINA_HOW_RANDOM :
        createStaminaSubTab_Random(staminaTabSub);
        break;
      case STAMINA_HOW_FIGHTROB :
        createStaminaSubTab_FightRob(staminaTabSub);
        break;
//newchange_fight
//      case STAMINA_HOW_LVJOBFIGHT :
//        createStaminaSubTab_LVJobFight(staminaTabSub);
//        break;
      case STAMINA_HOW_ROBFIGHT :// New Stamina Mode
        createStaminaSubTab_RobFight(staminaTabSub);
        break;
      default :
        createStaminaSubTab_Random(staminaTabSub);
        break;
    }
  }

  staminaSpendHow.selectedIndex = GM_getValue('staminaSpendHow', 0);
  handleSpendChanged();
  staminaSpendHow.addEventListener('change', handleSpendChanged, false);

  return staminaTab;
}

// Create Heal Tab
function createHealTab(){
  var elt, title, id, label, item, lhs, rhs, i, choice;
  var healTab = makeElement('div', null, {'id':'healTab', 'class':'tabcontent'});

  var TabHeader = makeElement('div', healTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('Health Settings:'));

  // Container for a list of settings.
   var list = makeElement('div', healTab, {'style':'position: relative; top: 10px; margin-left: 0px; margin-right: auto; width: 95%; line-height:120%;'});

  // Healing options
  item = makeElement('div', list);
  lhs = makeElement('div', item, {'class':'lhs'});
  rhs = makeElement('div', item, {'class':'rhs'});
  makeElement('br', item, {'class':'hide'});
  title = 'Heal when health lands below indicated health.';
  id = 'autoHeal';
  makeElement('input', lhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id, 'checked');
  makeElement('img', lhs, {'style':'padding-left: 5px;','src':stripURI(healthIcon)});
  makeElement('label', lhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' Heal in:'));
  id = 'healLocation';
  var healLocation = makeElement('select', rhs, {'id':id});
  for (i = 0, iLength=locations.length; i < iLength; ++i){
    choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(locations[i]));
    healLocation.appendChild(choice);
  }

  healLocation.selectedIndex = GM_getValue('healLocation', NY);
  makeElement('label', rhs, {'title':title}).appendChild(document.createTextNode(' when health falls below '));
  makeElement('input', rhs, {'style':'text-align: center','type':'text', 'value':GM_getValue('healthLevel', '50'), 'id':'healthLevel', 'size':'1'});
  makeElement('label', rhs, {'title':title}).appendChild(document.createTextNode(' points'));

  item = makeElement('div', list);
  lhs = makeElement('div', item, {'class':'lhs'});
  rhs = makeElement('div', item, {'class':'rhs'});
  makeElement('br', item, {'class':'hide'});
  title = 'Set NY as backup for healing';
  id = 'autoHealBackup';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id, 'checked');
  makeElement('label', rhs, {'for':id, 'title':title}).appendChild(document.createTextNode(' Use NY as backup for healing'));

  // stamina minimum to allow healing
  item = makeElement('div', list);
  lhs = makeElement('div', item, {'class':'lhs'});
  rhs = makeElement('div', item, {'class':'rhs'});
  makeElement('br', item, {'class':'hide'});
  title = 'Set the minimum Stamina Points Needed for Auto-Heal.';
  label = makeElement('label', rhs, {'title':title});
  label.appendChild(document.createTextNode('Disable Auto-Heal when Stamina falls below '));
  makeElement('input', rhs, {'type':'text', 'value':GM_getValue('stamina_min_heal', '22'), 'id':'stamina_min_heal', 'size':'3'});
  rhs.appendChild(document.createTextNode(' points.'));
  makeElement('br', rhs, {'class':'hide'});
  makeElement('font', rhs, {'style':'font-size: 10px;color:yellow;'}).appendChild(document.createTextNode('This setting determins switching from fighting to robbing when \'Fight then Rob\' is chosen from the Stamina subTab.'));

  // Attack at critical health
  item = makeElement('div', list);
  lhs = makeElement('div', item, {'class':'lhs'});
  rhs = makeElement('div', item, {'class':'rhs'});
  makeElement('br', item, {'class':'hide'});
  title = 'Check to attack even when at critical health (21-28 health points) ';
  id = 'attackCritical';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'title':title, 'value':'checked'}, id);
  makeElement('img', rhs, {'style':'padding-left: 5px;','src':stripURI(attackIcon)});
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Attack at critical health'));

  // Hide in hospital
  item = makeElement('div', list);
  lhs = makeElement('div', item, {'class':'lhs'});
  rhs = makeElement('div', item, {'class':'rhs'});
  makeElement('br', item, {'class':'hide'});
  title = 'Hide in hospital ';
  id = 'hideInHospital';
  var hideInHosp = makeElement('input', rhs, {'type':'checkbox', 'title':title, 'id':id, 'value':'checked'}, id);
  makeElement('img', rhs, {'style':'padding-left: 5px;','src':stripURI(hideIcon)});
  title = hideInHosp.checked ? ' Hide in hospital but...' : ' Hide in hospital';
  makeElement('label', rhs, {'id':'hideLabel', 'for':id, 'title':title}).appendChild(document.createTextNode(title));

  elt = makeElement('div', rhs, {'style':'line-height: 135%;','id':'hideOpts'});
  for (i = 0, iLength=healOptions.length; i < iLength; i++){
    id = healOptions[i][0];
    title = healOptions[i][1];
    var info = healOptions[i][2];
    var optElt = makeElement('div', elt);
    makeElement('input', optElt, {'type':'checkbox', 'id':id, 'title':info, 'value':'checked', 'style':'margin-left: 15px;'}, id);
    label = makeElement('label', optElt, {'for':id, 'title':info});
    label.appendChild(document.createTextNode(' '+ title));
  }
  elt.style.display = hideInHosp.checked ? '' : 'none';

  var hideHandler = function(){
    var hideOpts = document.getElementById('hideOpts');
    var hideLabel = document.getElementById('hideLabel');
    if(!hideOpts) return false;
    if(this.checked){
      hideOpts.style.display = '';
      hideLabel.firstChild.nodeValue = ' Hide in hospital but...';
    } else {
      hideOpts.style.display = 'none';
      hideLabel.firstChild.nodeValue = ' Hide in hospital';
    }
    return true;
  };
  hideInHosp.addEventListener('click', hideHandler, false);

  // Health reserve
  item = makeElement('div', list);
  lhs = makeElement('div', item, {'class':'lhs'});
  rhs = makeElement('div', item, {'class':'rhs'});
  makeElement('br', item, {'class':'hide'});
  id = 'stopPA';
  title = 'do not use Powerattack when health is below treshold';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Do not use Power Attack when health falls below  '));
  id = 'stopPAHealth';
  title = 'Enter min health level';
  makeElement('input', rhs, {'type':'text', 'value':GM_getValue(id, '0'), 'title':title, 'id':id, 'style':'width: 25px'});

  // Hitlist riding
  item = makeElement('div', list);
  lhs = makeElement('div', item, {'class':'lhs'});
  rhs = makeElement('div', item, {'class':'rhs'});
  makeElement('br', item, {'class':'hide'});
  id = 'hideAttacks';
  title = 'Enable hitlist riding: PS MWAP disables autoHeal after you got XP from attacks; it enables it again after parsing a snuffed message.';
  makeElement('input', rhs, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', rhs, {'for':id,'title':title}).appendChild(document.createTextNode(' Hitlist riding, turn off autoHeal after '));
  id = 'rideHitlistXP';
  title = 'Enter the XP you want to gain before PS MWAP turns off autoHeal. Enter \'0\' if you want PS MWAP to turn off autoHeal after it detected a 0 xp attack.';
  makeElement('input', rhs, {'type':'text', 'value':GM_getValue(id, '0'), 'title':title, 'id':id, 'style':'width: 25px'});
  rhs.appendChild(document.createTextNode(' xp'));

  return healTab;

}

// Create Cash tab
function createCashTab (){
  var elt, title, id, label;
  var cashTab = makeElement('div', null, {'id':'cashTab', 'class':'tabcontent','style':'height:460px;overflow-y:auto;overflow-x:hidden'});

  var TabHeader = makeElement('div', cashTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('Cash / Properties Settings:'));

  var xTop = 0;
  for(ctCount=0;ctCount < ctLength;ctCount++){
    xTop += 23;
    // Option Label and Check Box
    title = cityProperties[ctCount][ctTitle];
    id = cityProperties[ctCount][ctGMId];
    var baseElt = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
    makeElement('input', baseElt, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
    label = makeElement('label', baseElt, {'for':id, 'title':title});
    label.appendChild(document.createTextNode(cityProperties[ctCount][ctText]));

    // Option Items
    id = cityProperties[ctCount][ctGMId]+'Id';
    var elt = makeElement('select', baseElt, {'id':id, 'style':'position: static; margin-left: 5px;'});

    for (i = 0, iLength=cityProperties[ctCount][ctArray].length; i < iLength; ++i){
      var choice = makeElement('option', null, {'value':i,'title':cityProperties[ctCount][ctArray][i][2]});
      choice.appendChild(document.createTextNode(cityProperties[ctCount][ctArray][i][0]));
      elt.appendChild(choice);
    }
    elt.selectedIndex = GM_getValue(id, 8);
    elt.setAttribute('title', cityProperties[ctCount][ctArray][elt.selectedIndex][2]);
  }

  xTop += 33;
  makeElement('div', cashTab, {'style':'font-size: 10px;top: '+xTop+'px;'}).appendChild(document.createTextNode('These may result in some delay, when the request is not ready for processing.'));
  // Ask for Special Parts
  xTop += 15;

/*
  title = 'Check this to Ask for Special Parts every 12 hours';
  id = 'askSpecialParts';
  var specialParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', specialParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', specialParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Special Parts '));
*/
  title = 'Check this to Ask for Event Parts Parts every 4 hours';
  id = 'askEventParts';
  var eventParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;left:150px;'});
  makeElement('input', eventParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', eventParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Event Parts'));


  for(ctCount=0,cpLength=cityParts.length;ctCount < cpLength;ctCount++){
    xTop += 23;
    // Option Label and Check Box
    title = cityParts[ctCount][ptTitle];
    id = cityParts[ctCount][ptGMId];
    var baseElt = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
    makeElement('input', baseElt, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
    label = makeElement('label', baseElt, {'for':id, 'title':title});
    label.appendChild(document.createTextNode(cityParts[ctCount][ptProp]));
    //label.appendChild(document.createTextNode('Ask for '+cityParts[ctCount][ptProp])+' parts');

    if(cityParts[ctCount][ptPropId]){
      // Option Items (if available)
      id = cityParts[ctCount][ptGMId]+'Id';
      var elt = makeElement('select', baseElt, {'id':id, 'style':'position: static; margin-left: 5px;'});

      for (i = 0, iLength=cityParts[ctCount][ptArray].length; i < iLength; ++i){
        var choice = makeElement('option', null, {'value':i,'title':cityParts[ctCount][ptArray][i][0]});
        choice.appendChild(document.createTextNode(cityParts[ctCount][ptArray][i][0]));
        elt.appendChild(choice);
      }
      elt.selectedIndex = GM_getValue(id, 0);
    }
  }
/*
  // Ask for Chop Shop Parts
  xTop += 23;
  title = 'Check this to Ask for Chop Shop Parts every 12 hours';
  id = 'askShopParts';
  var shopParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});

  makeElement('input', shopParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', shopParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Chop Shop Parts'));

  // List Chop Shop Parts
  id = 'askShopPartsId';
  var shopPartsType = makeElement('select', shopParts, {'id':id, 'style':'position: static; margin-left: 5px;'});
  for (i = 0, iLength=cityShopParts.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i,'title':cityShopParts[i][0]});
    choice.appendChild(document.createTextNode(cityShopParts[i][0]));
    shopPartsType.appendChild(choice);
  }
  shopPartsType.selectedIndex = GM_getValue(id, 0);

  // Ask for Weapon Depots Parts
  xTop += 23;
  title = 'Check this to Ask for Weapon Depots Parts every 12 hours';
  id = 'askDepotParts';
  var depotParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', depotParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', depotParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Weapon Depots Parts'));

  // List Weapon Depots Parts
  id = 'askDepotPartsId';
  var depotPartsType = makeElement('select', depotParts, {'id':id, 'style':'position: static; margin-left: 5px;'});
  for (i = 0, iLength=cityDepotParts.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i,'title':cityDepotParts[i][0]});
    choice.appendChild(document.createTextNode(cityDepotParts[i][0]));
    depotPartsType.appendChild(choice);
  }
  depotPartsType.selectedIndex = GM_getValue(id, 0);

  // Ask for Armor Parts
  xTop += 23;
  title = 'Check this to Ask for Armor Parts every 12 hours';
  id = 'askArmorParts';
  var armorParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', armorParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', armorParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Armor Parts'));

  // List Armor Parts
  id = 'askArmorPartsId';
  var armorPartsType = makeElement('select', armorParts, {'id':id, 'style':'position: static; margin-left: 5px;'});
  for (i = 0, iLength=cityArmorParts.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i,'title':cityArmorParts[i][0]});
    choice.appendChild(document.createTextNode(cityArmorParts[i][0]));
    armorPartsType.appendChild(choice);
  }
  armorPartsType.selectedIndex = GM_getValue(id, 0);

  // Ask for Zoo Parts
  xTop += 23;
  title = 'Check this to Ask for Zoo Parts every 12 hours';
  id = 'askZooParts';
  var zooParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', zooParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', zooParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Zoo Parts'));

  // List Zoo Parts
  id = 'askZooPartsId';
  var zooPartsType = makeElement('select', zooParts, {'id':id, 'style':'position: static; margin-left: 5px;'});
  for (i = 0, iLength=cityZooParts.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i,'title':cityZooParts[i][0]});
    choice.appendChild(document.createTextNode(cityZooParts[i][0]));
    zooPartsType.appendChild(choice);
  }
  zooPartsType.selectedIndex = GM_getValue(id, 0);
*/
  // Ask for New Parts
  xTop += 23;
  title = 'Check this to Ask for New Parts every 8 hours';
  id = 'askNewParts';
  var newParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', newParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', newParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for New Parts'));
  // List New Parts
  id = 'askNewPartsId';
  var newPartsType = makeElement('select', newParts, {'id':id, 'style':'position: static; margin-left: 5px;'});
  for (i = 0, iLength=cityNewParts.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i,'title':cityNewParts[i][0]});
    choice.appendChild(document.createTextNode(cityNewParts[i][0]));
    newPartsType.appendChild(choice);
  }
  newPartsType.selectedIndex = GM_getValue(id, 0);

  // Ask for Casino Parts
  xTop += 23;
  title = 'Check this to Ask for Casino Parts every 2 hours, since no MW timer available';
  id = 'askCasinoParts';
  var casinoParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', casinoParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', casinoParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Casino Parts'));

  // List Casino Parts
  id = 'askCasinoPartsId';
  var casinoPartsType = makeElement('select', casinoParts, {'id':id, 'style':'position: static; margin-left: 5px;'});
  for (i = 0, iLength=cityCasinoParts.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i,'title':cityCasinoParts[i][0]});
    choice.appendChild(document.createTextNode(cityCasinoParts[i][0]));
    casinoPartsType.appendChild(choice);
  }
  casinoPartsType.selectedIndex = GM_getValue(id, 0);

  // Ask Friends to Play your Slots
  xTop += 23;
  title = 'Check this to Ask Friends to Play your Slots every 4 hours';
  id = 'askPlaySlots';
  var playSlots = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', playSlots, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', playSlots, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask to Play your Slots'));

  // Ask for Village Parts
  xTop += 23;
  title = 'Check this to Ask for Village Parts every 2 hours, since no MW timer available';
  id = 'askVillageParts';
  var villageParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', villageParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', villageParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Village Parts'));

  // List Village Parts
  id = 'askVillagePartsId';
  var villagePartsType = makeElement('select', villageParts, {'id':id, 'style':'position: static; margin-left: 5px;'});
  for (i = 0, iLength=cityVillageParts.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i,'title':cityVillageParts[i][0]});
    choice.appendChild(document.createTextNode(cityVillageParts[i][0]));
    villagePartsType.appendChild(choice);
  }
  villagePartsType.selectedIndex = GM_getValue(id, 0);

  // Ask for Football Fans
  xTop += 23;
  title = 'Check this to Ask for Football Fans';
  id = 'askFootballFans';
  var footballFans = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', footballFans, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', footballFans, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Football Fans'));

  // Ask for Brazil Parts
  xTop += 23;
  title = 'Check this to Ask for Brazil Parts every 2 hours, since no MW timer available';
  id = 'askBrazilParts';
  var brazilParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', brazilParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', brazilParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Brazil Parts'));

  // List Brazil Parts
  id = 'askBrazilPartsId';
  var brazilPartsType = makeElement('select', brazilParts, {'id':id, 'style':'position: static; margin-left: 5px;'});
  for (i = 0, iLength=cityBrazilParts.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i,'title':cityBrazilParts[i][0]});
    choice.appendChild(document.createTextNode(cityBrazilParts[i][0]));
    brazilPartsType.appendChild(choice);
  }
  brazilPartsType.selectedIndex = GM_getValue(id, 0);

  // Ask for Chicago Parts
  xTop += 23;
  title = 'Check this to Ask for chicago Parts every 2 hours, since no MW timer available';
  id = 'askChicagoParts';
  var chicagoParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px;'});
  makeElement('input', chicagoParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', chicagoParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode('Ask for Chicago Parts'));

  // List Chicago Parts
  id = 'askChicagoPartsId';
  var chicagoPartsType = makeElement('select', chicagoParts, {'id':id, 'style':'position: static; margin-left: 5px;'});
  for (i = 0, iLength=cityChicagoParts.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i,'title':cityChicagoParts[i][0]});
    choice.appendChild(document.createTextNode(cityChicagoParts[i][0]));
    chicagoPartsType.appendChild(choice);
  }
  chicagoPartsType.selectedIndex = GM_getValue(id, 0);

  // Collect Cash Takes
  xTop = 23;
  title = 'Automatically collect from properties';
  id = 'collectTake'+ cities[0][CITY_NAME];
  var autoTake = makeElement('div', cashTab, {'style':'top: '+xTop+'px; left: 425px;'});
  makeElement('input', autoTake, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', autoTake, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' autoCollect Cash from Properties'));

  //Collect BRAZIL
  xTop += 23;
  title = 'Automatically collect in BRAZIL';
  id = 'collectTakeBrazil';
  var autoBRAZIL = makeElement('div', cashTab, {'style':'top: '+xTop+'px; left: 425px;'});
  makeElement('input', autoBRAZIL, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', autoBRAZIL, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' autoCollect in BRAZIL'));

  //Collect BRAZIL
  xTop += 23;
  title = 'Automatically collect in CHICAGO';
  id = 'collectTakeChicago';
  var autoCHICAGO = makeElement('div', cashTab, {'style':'top: '+xTop+'px; left: 425px;'});
  makeElement('input', autoCHICAGO, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', autoCHICAGO, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' autoCollect in CHICAGO'));

  //Collect Parts
  xTop += 23;
  title = 'Automatically collect Parts from properties';
  id = 'collectParts';
  var autoParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px; left: 425px;'});
  makeElement('input', autoParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', autoParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' autoCollect Parts from Properties'));

  //Auto Upgrade Limited Property
  xTop += 23;
  title = 'Automatically Upgrade/Collect Limited properties';
  id = 'autoLimitedParts';
  var autoLimitedParts = makeElement('div', cashTab, {'style':'top: '+xTop+'px; left: 425px;'});
  makeElement('input', autoLimitedParts, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  label = makeElement('label', autoLimitedParts, {'for':id, 'title':title});
  label.appendChild(document.createTextNode(' autoUpgrade Limited Property'));

  // Autobanking
  xTop += 69;
  for (var i = 0, iLength = cities.length; i < iLength; ++i){
    if(i < 1 || i > 3){
      id = cities[i][CITY_AUTOBANK];
      title = 'Enable '+ cities[i][CITY_NAME]+' banking';
      var curBank = makeElement('div', cashTab, {'style':'top: '+xTop+'px; left: 425px; width: 280px; text-align: left;'});
      makeElement('input', curBank, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
      makeElement('label', curBank, {'for':id}).appendChild(document.createTextNode(title));
      makeElement('img', curBank, {'style':'position: absolute; right: 95px; margin-top: 3px;', 'src':stripURI(cities[i][CITY_CASH_ICON])});
      id = cities[i][CITY_BANKCONFG];
      title = 'Minimum deposit amount in '+ cities[i][CITY_NAME];
      makeElement('input', curBank, {'type':'text', 'style':'position: absolute; right: 0px; width: 110px; text-align: right;', 'title':title, 'value':GM_getValue(id, '50000'), 'id':id, 'size':'5'});
      xTop += 23;
      if(i==4) xTop += 23;
    } else {
      continue;
    }
  }

  xTop -= 92;
  // Las Vegas: current vault level
  var vaultLevel = makeElement('div', cashTab, {'style':'top: '+xTop+'px; left: 475px;'});
  title = 'Las Vegas: disable automatic vault handling, or select the level of your vault and let PS MWAP handle it.';
  id = 'vaultHandling';
  makeElement('img', vaultLevel, {'src':stripURI(cashVegasIcon), 'style':'margin-right: 5px;'});
  var vaultSelect = makeElement('select', vaultLevel, {'id':id, 'title':title, 'style':'position: static; text-align: left;'});
  for (i = 0, iLength=vaultLevels.length; i < iLength; ++i){
    var choice = makeElement('option', null, {'value':i});
    choice.appendChild(document.createTextNode(vaultLevels[i][0]));
    vaultSelect.appendChild(choice);
  }
  vaultSelect.selectedIndex = GM_getValue(id, 0);

  xTop += 100;
  makeElement('div', cashTab, {'style':'top: '+xTop+'px;left: 425px; width: 150px; text-align: left;'}).appendChild(document.createTextNode('autoUpgrade New York Properties:'));

  xTop += 20;
  var buildingListContainer = makeElement('div', cashTab, {'style':'top: '+xTop+'px;left: 580px; width: 150px; text-align: left;'});
  var buildingList = makeElement('ul', buildingListContainer, {'style':'border: 1px solid rgb(204, 204, 204); width: 150px; height: 90px; list-style: none outside none; overflow: auto;'});
  for(i=0,iLength = autoUpgradeNYBuildings.length;i<iLength;i++){
    buildingListItem = makeElement('li', buildingList,{'style':'z-index:99999;'});
    id = 'upgradeNYProperty'+autoUpgradeNYBuildings[i][1];
    buildingListSelectItem = makeElement('input', buildingListItem, {'type':'checkbox', 'id':id, 'value':'unchecked'}, id);
    makeElement('label',buildingListItem, {'for':id,'title':autoUpgradeNYBuildings[i][0]}).appendChild(document.createTextNode(autoUpgradeNYBuildings[i][0]));
  }

  var upgradeNY = makeElement('div', cashTab, {'style':'top: '+xTop+'px; left: 425px; width: 150px; text-align: left;'});
  title = 'autoUpgrade NY Properties.';
  id = 'autoUpgradeNYChoice';
  var autoUpgradeNYChoice = makeElement('select', upgradeNY, {'id':id, 'title':title, 'style':'position: static; text-align: left;'});
  for (i = 0, iLength=autoUpgradeNYChoices.length; i < iLength; ++i){
    var choice = document.createElement('option');
    choice.value = i;
    choice.appendChild(document.createTextNode(autoUpgradeNYChoices[i][0]));
    autoUpgradeNYChoice.appendChild(choice);
  }
  autoUpgradeNYChoice.selectedIndex = GM_getValue('autoUpgradeNYChoice', 0);
  title = 'Minimum NY Bank Balance';
  xTop += 25;
  makeElement('div', cashTab, {'style':'top: '+xTop+'px;left: 425px; width: 150px; text-align: left;'}).appendChild(document.createTextNode(title));
  xTop += 20;
  id = 'userMinBalance';
  var upgradeBalance = makeElement('div', cashTab, {'style':'top: '+xTop+'px; left: 425px; width: 150px; text-align: left;'});
  makeElement('input', upgradeBalance, {'type':'text', 'style':'position: static; text-align: right;', 'title':title, 'value':GM_getValue(id, '100000000'), 'id':id, 'size':'15'});

  return cashTab;
}

// Create About tab
function createAboutTab(){
  var elt, title, id, label;
  var aboutTab = makeElement('div', null, {'id': 'aboutTab', 'class': 'tabcontent'});

  var TabHeader = makeElement('div', aboutTab, {'style':'width:762px;height:20px;border:none #FFFFFF;float:left;font-size: 18px; font-weight: bold;'});
  TabHeader.appendChild(document.createTextNode('Version RX6 '+ SCRIPT.version));

  var devs = makeElement('div', aboutTab, {'style': 'top: 50px; width: 550px; left: 10px; font-size: 12px; font-weight: bold;'});
  devs.appendChild(document.createTextNode('Contributors:'));
  makeElement('br', devs);

  var devNames = 'rwaldan, KCMCL, BBB, Cam, donnaB, janmillsjr, DasShrubber, Lister, Dr Squirrel, SomeUser, Lister';

  devList = makeElement('p', devs, {'style': 'position: relative; left: 15px;'});
  devList.appendChild(document.createTextNode(devNames));

  // Recent updates
  item = makeElement('div', aboutTab, {'style': 'border:1px solid #999999; padding: 2px 2px 2px 2px; overflow: ' +
                                       'auto; width: 530px; height: 120px; top: 160px; left: 30px; ' +
                                       'font-size: 10px;'});
  item.innerHTML = '<span class="good">Release changes:</span> <br><br>'+ GM_getValue('newRevList')+'<br>' +
                   '<span class="bad">Previous changes:</span> <br><br>'+ GM_getValue('oldRevList');
  item.innerHTML = 'Revision history pulled out for the mean time...<br><br>Google\'s project hosting servers are being overwhelmed by this feature :D<br><br>PS MWAP Team';

   // Test New Changes
  var devTools = makeElement('div', aboutTab, {'style': 'top: 350px; left: 10px; font-size: 12px;'});
  id = 'TestChanges';
  title = 'Enable Script Modifications In Testing Phase';

  makeElement('input', devTools, {'type':'checkbox', 'id':id, 'value':'checked'}, id);
  makeElement('label', devTools, {'for':id,'title':title}).appendChild(document.createTextNode('BETA TESTING ONLY : VERBOSITY ALERT - USE AT OWN RISK !'));

  //var sideName = GM_getValue('aboutChange');
  //var mockTest = makeElement('div', aboutTab, {'id':'mockTest','style': 'top: 400px; width: 550px; left: 10px; font-size: 12px; font-weight: bold;'});
  //mockTest.appendChild(document.createTextNode('Mock War Registration - You were registered on team: '+sideName));

  return aboutTab;
}

function grabToolbarInfo(manually){
  // Function for creating the cookies necessary to use miniPacks without installing the Zynga toolbar:
  var createToolbarCookies = function(){
    var openSinglePopup = function(strUrl){ window.open(strUrl,"toolbar","resizable=yes,scrollbars=yes,status=yes"); }
    window.setTimeout(function(){openSinglePopup('http://toolbar.zynga.com/game_iframe_proxy.php?playing=true');},1000);
    window.setTimeout(function(){openSinglePopup('http://toolbar.zynga.com/game_iframe_proxy.php');},5000);
  }

  // In case the current browser lacks greasemonkey (chrome):
  if(!gvar.isGreaseMonkey){
    if(manually && window.confirm('Can\'t retrieve Toolbar info with this browser.\n\n' +
                       'In case the miniPack doesn\'t work here at all,\nyou could let MWAP create the necessary cookies for you.\nPS: For this to work, ' +
                       'you need to allow popups in your browser, and wait for ca. 10 secs before closing the popup (after confirming this dialog).')){
      createToolbarCookies();
    }
    return;
  }

  GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://toolbar.zynga.com/game_stats_proxy.php?src=mw',
    headers: {'Accept': 'application/atom+xml'},
    onload: function (resp){
      if(resp.status != 200) return;

      var toolbarInfo = JSON.parse(resp.responseText);
      DEBUG('Toolbar response: '+ resp.responseText);
      if(!toolbarInfo || toolbarInfo.error){
        if(window.confirm('Error retrieving Toolbar info, probably because it\s the first time you are trying to fire the miniPack in this browser/-profile.\n\n' +
                           'Do you want MWAP to create the necessary cookies for you? If not, you have to install the Zynga Toolbar.\nPS: For this to work, ' +
                           'you need to allow popups in your browser, and wait for ca. 10 secs before closing the popup (after confirming this dialog).')){
          createToolbarCookies();
        }
        // abort any time changes
        return;
      }

      // Info in info.  user_health, user_energy, user_stamina, energy_timestamp, toolbar_energy_timestamp
      // has_toolbar_enery_pack, has_energypack, error

      var datNow = new Date();
      var modGMT = 8; // Default PDT
      datNow.setMilliseconds(0);
      var timer = toolbarInfo.toolbar_energy_timestamp - (datNow.getTime()/1000) + 3600 * modGMT;

      setGMTime('miniPackTimer', timer+' seconds');

      return;
    }
  });
}

function grabUpdateInfo(){
  if(!gvar.isGreaseMonkey) return;
  GM_setValue('newRevList', '');
  GM_setValue('oldRevList', '');
  return;
}
////////////////////////////////////////////////////////////////////
function validateStaminaTab(){
  var elt, id;
  var checked = function(id){ return document.getElementById(id).checked === true ? 'checked' : 0; }

  // Create an empty object to hold the settings.
  var s = {};

  // Get the common settings.
  s.staminaSpend = checked('staminaSpend');
  s.staminaSpendHow = document.getElementById('staminaSpendHow').selectedIndex;
  s.staminaLogDetails = checked('staminaLogDetails');

  var selectStaminaUse = parseInt(document.getElementById('selectStaminaUse').value);
  if(isNaN(selectStaminaUse)) selectStaminaUse = 0;
  s.selectStaminaUse = selectStaminaUse;
  s.selectStaminaUseMode = document.getElementById('selectStaminaUseMode').selectedIndex;
  var selectStaminaKeep = parseInt(document.getElementById('selectStaminaKeep').value);
  if(isNaN(selectStaminaKeep)) selectStaminaKeep = 0;
  s.selectStaminaKeep = selectStaminaKeep;
  s.selectStaminaKeepMode = document.getElementById('selectStaminaKeepMode').selectedIndex;

  var selectMissionStaminaKeep = parseInt(document.getElementById('selectMissionStaminaKeep').value);
  if(isNaN(selectMissionStaminaKeep)) selectMissionStaminaKeep = 0;
  s.selectMissionStaminaKeep = selectMissionStaminaKeep;
  s.selectMissionStaminaKeepMode = document.getElementById('selectMissionStaminaKeepMode').selectedIndex;

  s.allowStaminaToLevelUp = checked('allowStaminaToLevelUp');

  //  selectStaminaKeep  selectMissionStaminaKeep selectStaminaKeepMode  selectMissionStaminaKeepMode

  // Validate common settings
  if(isNaN(s.selectStaminaUse) || isNaN(s.selectStaminaKeep) || isNaN(s.selectMissionStaminaKeep) ){
    alert('Please enter numeric values for Stamina reserve and Stamina threshold.');
    return false;
  }

  // The method of getting and verifying the rest of the settings depends
  // on how stamina will be spent.
  switch (s.staminaSpendHow){
    case STAMINA_HOW_ROBFIGHT: // Rob then Fight
      s.robFightStaminaFloor = parseInt(document.getElementById('robFightStaminaFloor').value);
      // Validate RobFight Stamina Spending Floor settings.
      if(isNaN(s.robFightStaminaFloor)){
        alert('Please enter the threshold for switching from robbing to fighting.');
        return false;
      } else if(s.robFightStaminaFloor < 25 || s.robFightStaminaFloor > maxStamina){
        alert('Please enter a stamina between 25 and '+ maxStamina);
        return false;
      }

    case STAMINA_HOW_FIGHTROB: // Fight then Rob
      // Get the settings.
      s.robLocation = document.getElementById('robLocation').selectedIndex;
      s.fastRob = checked('fastRob');
      s.fastRobSpeed = document.getElementById('fastRobSpeed').selectedIndex;
      s.useRobSquads = checked('useRobSquads');
      s.useBurners = checked('useBurners');

    case STAMINA_HOW_FIGHT_RANDOM: // Random fighting
      // Get the specific settings.
      s.fightLocation = document.getElementById('fightRandomLoc').selectedIndex;
      s.reattackThreshold = parseInt(document.getElementById('reattackThreshold').value);
      s.staminaReattack = checked('staminaReattack');
      s.iceCheck = checked('iceCheck');
      s.staminaPowerattack = checked('staminaPowerattack');

      s.fightLevelMax = parseInt(document.getElementById('fightLevelMax').value);
      s.fightLevelMaxRelative = checked('fightLevelMaxRelative');
      s.fightLevelMaxOverride = checked('fightLevelMaxOverride');
      s.fightMafiaMax = parseInt(document.getElementById('fightMafiaMax').value);
      s.fightMafiaMaxRelative = checked('fightMafiaMaxRelative');
      s.fightMafiaMin = parseInt(document.getElementById('fightMafiaMin').value);
      s.fightMafiaMinRelative = checked('fightMafiaMinRelative');

      s.fightHealthMax = parseInt(document.getElementById('fightHealthMax').value);
      s.fightHealthPctMax = parseInt(document.getElementById('fightHealthPctMax').value);

      s.fightMobMode = checked('fightMobMode');
      s.fightIceStealers = checked('fightIceStealers');
      s.fightNames = checked('fightNames');
      s.fightAvoidNames = checked('fightAvoidNames');
      s.fightOnlyNames = checked('fightOnlyNames');
      s.fightClanName = document.getElementById('fightClanName').value;
      s.fightRemoveStronger = checked('fightRemoveStronger');


      if(document.getElementById('fightRivalsMode')) s.fightRivalsMode = document.getElementById('fightRivalsMode').selectedIndex;
      s.fightMaxAttacks = parseInt(document.getElementById('fightMaxAttacks').value);
      if(document.getElementById('fightLabelCriteria')) s.fightLabelCriteria = document.getElementById('fightLabelCriteria').selectedIndex;

      // Validate maxAttacks settings.
      if(isNaN(s.fightMaxAttacks)){
        alert('Please enter the threshold for maximum # attacks per opponent.');
        return false;
      } else if(s.fightMaxAttacks < 0){
        alert('Please enter a maximum # attacks per opponent threshold of zero or more.');
        return false;
      }

      // Validate reattack settings.
      if(isNaN(s.reattackThreshold)){
        alert('Please enter the threshold for reattacking opponents.');
        return false;
      } else if(s.reattackThreshold < 0){
        alert('Please enter a reattack threshold of zero or more.');
        return false;
      }

      // Validate the maximum level settings.
      if(isNaN(s.fightLevelMax)){
        alert('Please enter a maximum level for fighting.');
        return false;
      } else if(s.fightLevelMaxRelative && s.fightLevelMax < 0){
        alert('Please enter a maximum relative level of zero or more.');
        return false;
      } else if(!s.fightLevelMaxRelative && s.fightLevelMax < level && !s.fightLevelMaxOverride){
        addToLog('warning Icon', 'Maximum level for fighting is set to '+ s.fightLevelMax+'. Setting to current level of '+ level+'.');
        s.fightLevelMax = level;
      }

      // Validate the maximum health settings.
      if(isNaN(s.fightHealthMax)){
        alert('Please enter a maximum oppononent health for fighting.');
        return false;
      } else if(s.fightHealthMax < 0){
        alert('Please enter a maximum oppononent health for fighting of zero or more.');
        return false;
      }

      if(isNaN(s.fightHealthPctMax)){
        alert('Please enter a maximum oppononent health for fighting.');
        return false;
      } else if(s.fightHealthPctMax < 0){
        alert('Please enter a maximum oppononent health for fighting of zero or more.');
        return false;
      }

      // Validate the maximum mafia size settings.
      if(isNaN(s.fightMafiaMax)){
        alert('Please enter a maximum mafia size for fighting.');
        return false;
      } else if(!s.fightMafiaMaxRelative && (s.fightMafiaMax < 1)){
        alert('Please enter a maximum mafia size of one or more for fighting.');
        return false;
      } else if(s.fightMafiaMaxRelative && (s.fightMafiaMax + mafia < 1)){
        alert('Please enter a larger relative mafia size for fighting.');
        return false;
      }

      // Validate the minimum mafia size settings.
      if(isNaN(s.fightMafiaMin)){
        alert('Please enter a minimum mafia size for fighting.');
        return false;
      } else if(!s.fightMafiaMinRelative && (s.fightMafiaMin < 1)){
        alert('Please enter a minimum mafia size of one or more for fighting.');
        return false;
      } else if(s.fightMafiaMinRelative && (mafia - s.fightMafiaMin < 1)){
        alert('Please enter a smaller relative mafia size for fighting.');
        return false;
      }

      if(s.fightNames == 'checked'){
        // Validate the fight list.
        var list = s.fightClanName.split('\n');
        if(!list[0]){
          alert('Enter at least one clan name/symbol in the list');
          return false;
        }
      }

      break;

    case STAMINA_HOW_FIGHT_LIST: // List fighting
      // Get the settings.
      s.fightLocation = document.getElementById('fightListLoc').selectedIndex;
      s.reattackThresholdList = parseInt(document.getElementById('reattackThresholdList').value);
      s.staminaReattackList = checked('staminaReattackList');
      s.iceCheck = checked('iceCheck');

      s.staminaPowerattack = checked('staminaPowerattack');

      s.pfightlist = document.getElementById('pfightlist').value;
      s.fightRemoveStronger = document.getElementById('fightRemoveStronger').checked === true? 'checked' : 0;

      // Validate reattack settings.
      if(isNaN(s.reattackThresholdList)) alert('Please enter the threshold for reattacking opponents.');
      else if(s.reattackThresholdList < 0) alert('Please enter a reattack threshold of zero or more.');

      // Validate the fight list.
      var list = s.pfightlist.split('\n');
      if(!list[0]){
        alert('Enter the Facebook ID of at least one opponent to fight.');
        return false;
      }
      break;

    case STAMINA_HOW_HITMAN: // Hitlist bounty collection ("auto-hitman")
      // Get the settings.
      s.hitmanLocation = document.getElementById('hitmanLocation').selectedIndex;
      s.hitmanBountyMin = document.getElementById('hitmanBountyMin').value;
      s.bountySelection = document.getElementById('bountySelection').selectedIndex;

      s.hitmanNames = checked('hitmanNames');
      s.hitmanAvoidNames = checked('hitmanAvoidNames');
      s.hitmanOnlyNames = checked('hitmanOnlyNames');
      s.hitmanClanName = document.getElementById('hitmanClanName').value;
      s.fightRemoveStronger = checked('fightRemoveStronger');

      // Validate the minimum bounty.
      var min = parseCash(s.hitmanBountyMin);
      if(isNaN(min) || min < 0){
        alert('Please enter a minimum bounty amount.');
        return false;
      }

      if(s.hitmanNames == 'checked'){
        // Validate the fight list.
        var list = s.hitmanClanName.split('\n');
        if(!list[0]){
          alert('Enter at least one clan name/symbol in the list');
          return false;
        }
      }

      break;

    case STAMINA_HOW_ROBBING: // Robbing
      // Get the settings.
      s.robLocation = document.getElementById('robLocation').selectedIndex;
      s.fastRob = checked('fastRob');
      s.fastRobSpeed = document.getElementById('fastRobSpeed').selectedIndex;
      s.useRobSquads = checked('useRobSquads');
      s.useBurners = checked('useBurners');
      break;

    case STAMINA_HOW_AUTOHITLIST: // Place hitlist bounties
      // Get the settings.
      s.autoHitListLoc = document.getElementById('autoHitListLoc').selectedIndex;
      s.autoHitListBounty = document.getElementById('autoHitListBounty').value;
      s.autoHitListRandom = checked('autoHitListRandom');
      s.pautoHitOpponentList = document.getElementById('pautoHitOpponentList').value;
      s.bgAutoHitCheck  = checked('bgAutoHitCheck');

      // Validate the bounty.
      var min = parseCash(s.autoHitListBounty);
      if(isNaN(min) || min < 10000 && !s.autoHitListRandom){
        alert('Please enter a minimum bounty amount of at least $10,000');
        return false;
      }

      // Validate the autohit list.
      var list = s.pautoHitOpponentList.split('\n');
      if(!list[0]){
        alert('Enter the Facebook ID of at least one opponent to hitlist.');
        return false;
      }
      break;

    case STAMINA_HOW_RANDOM: // Random stamina spending
      var spendModes="";
      var spendModesChecked=document.getElementsByName("randomSpendModes[]");
      for (var i=0;i<spendModesChecked.length;++i){
        if(spendModesChecked[i].checked) spendModes+='1';
        else spendModes+='0';
      }
      if(!parseInt(spendModes)) spendModes = '1'+ spendModes.substr(1);
      s.randomSpendModes=spendModes;

      var randomCities="";
      var randomCitiesChecked=document.getElementsByName("randomFightLocations[]");
      for (var i=0;i<randomCitiesChecked.length;++i){
        if(randomCitiesChecked[i].checked) randomCities+='1';
        else randomCities+='0';
      }
      if(!parseInt(randomCities)) randomCities = '1'+ randomCities.substr(1);
      s.randomFightLocations=randomCities;

      randomCities="";
      randomCitiesChecked=document.getElementsByName("randomRobLocations[]");
      for (var i=0;i<randomCitiesChecked.length;++i){
        if(randomCitiesChecked[i].checked) randomCities+='1';
        else randomCities+='0';
      }
      if(!parseInt(randomCities)) randomCities = '1'+ randomCities.substr(1);
      s.randomRobLocations=randomCities;

      randomCities="";
      randomCitiesChecked=document.getElementsByName("randomHitmanLocations[]");
      for (var i=0;i<randomCitiesChecked.length;++i){
        if(randomCitiesChecked[i].checked) randomCities+='1';
        else randomCities+='0';
      }
      if(!parseInt(randomCities)) randomCities = '1'+ randomCities.substr(1);
      s.randomHitmanLocations=randomCities;
      break;

    default :
      colorDEBUG('BUG DETECTED: Unrecognized stamina setting here: staminaSpendHow='+ s.staminaSpendHow, cre);
      break;
  }

  return s;
}
/////////////////////////////////////////////////////////////////////////////////////////////
function clickAutoPause(){
  if(this.checked){
    // check to ensure at least one radio box is checked
    // enable Before level up by default
    if(document.getElementById('autoPauseBefore').checked === false && document.getElementById('autoPauseAfter').checked === false){
      document.getElementById('autoPauseBefore').checked = true;
    }
  }
}

function clickUseFightNames(){
  if(this.checked){
    // check to ensure at least one radio box is checked
    if(document.getElementById('fightAvoidNames').checked === false && document.getElementById('fightOnlyNames').checked === false){
      document.getElementById('fightAvoidNames').checked = true;
    }
  }
}

function clickUseHitmanNames(){
  if(this.checked){
    // check to ensure at least one radio box is checked
    if(document.getElementById('hitmanAvoidNames').checked === false && document.getElementById('hitmanOnlyNames').checked === false){
      document.getElementById('hitmanAvoidNames').checked = true;
    }
  }
}

function handleUnexpectedPage(){
  DEBUG('Unexpected page.');

  // Handle "try again" error pages.
  var tryAgainElt = document.getElementById('try_again_button');
  if(tryAgainElt){
    var delay = 10;
    var p = document.createElement('p');
    var wait = function(){
      if(!delay) return tryAgainElt.click();
      p.innerHTML = 'PS MWAP will automatically try again in '+ delay--+' seconds.';
      window.setTimeout(wait, 1000);
      return false;
    };
    DEBUG('Service interruption: "Try Again" button seen.');
    tryAgainElt.parentNode.appendChild(document.createElement('br'));
    tryAgainElt.parentNode.appendChild(p);
    wait();
    return;
  }

  // Skip "free boost" pages.
  var elt = xpathFirst('//a[contains(., "Skip")]');
  if(elt){
    Autoplay.fx = function(){ clickElement(elt); };
    Autoplay.delay = getAutoPlayDelay();
    Autoplay.start();
    return;
  }

  // Start a timer to reload the page if nothing else happens.
  Autoplay.fx = function(){
    // Unrecognized page.
    if(!document.body) DEBUG('No body. Possible redirect, white out or slow load?');
    else DEBUG('Can\'t read page. Possible white out?');
    loadHome();
  };
  Autoplay.delay = 5000;
  Autoplay.start();
}

var fightCount =0;
var ajaxCount =0;

function handleModificationTimer(target){
  // The timer has gone off, so assume that page updates have finished.
  //modificationTimer = undefined;
  try {
    if(ajaxHandling) {
      colorDEBUG('waiting for ajax repsonse', cli);
      if(ajaxCount++ > 10){
          ajaxHandling=false;
          ajaxCount=0;
      }
      return;
    }

    if(new_header) var mastheadElt = xpathFirst('//div[@class="header_top_row"]');
    else var mastheadElt = xpathFirst('//div[contains(@id,"mw_masthead")]');

    if(!mastheadElt || !mastheadElt.scrollWidth || !refreshGlobalStats()){
      handleUnexpectedPage();
      return;
    }

    refreshSettings();
    synchSettings();

    // Find the visible inner page.
    var pageChanged = false;
    var justPlay = false;
    var prevPageElt = innerPageElt;

    appLayoutElt = document.getElementById('mw_city_wrapper');
    statsrowElt = document.getElementById('stats_row');
    menubarElt = document.getElementById('menubar');
    popupfodderElt = document.getElementById('popup_fodder');
    innerPageElt = document.getElementById('inner_page');
    questBarElt = document.getElementById('quest');
    contentRoweElt = document.getElementById('content_row');

    if(!innerPageElt) return;

    // Determine if the displayed page has changed.
    if(!xpathFirst('./div[@id="inner_flag"]', innerPageElt)){
      setListenContent(false);
      makeElement('div', innerPageElt, {'id':'inner_flag', 'style':'display: none;'});
      setListenContent(true);
      pageChanged = true;
    } else if(prevPageElt != innerPageElt){
      pageChanged = true;
    }

    if(onFightTab() && (clickAction == 'fight' || clickAction == 'multifight') ){
      var fight_wrapper = xpathFirst('.//div[@id="fv2_widget_wrapper"]' , innerPageElt);
      if(!fight_wrapper) fight_wrapper = xpathFirst('.//div[@class="fight_results"]' , innerPageElt);
      if(!fight_wrapper){
        pageChanged = false;
        colorDEBUG('waiting for fight results',caq);
        if(fightCount++ > 10){
          pageChanged = true;
          fightCount=0;
        }
      } else {
        pageChanged = true;
      }
      if(running) justPlay = true;
    } else {

      // Brazil District Changes
      var onBrazilJobs = xpathFirst('.//div[@id="brazil_jobs"]', innerPageElt);
      if(onBrazilJobs && !running){
        currentBrazilDistrict = getCurrentBrazilDistrict();
        if(currentBrazilDistrict != oldBrazilDistrict){
          oldBrazilDistrict = currentBrazilDistrict;
          pageChanged = true;
        }
        // Brazil Job Result Changes
        if(currentBrazilDistrict){
          var activeBrazilJob = xpathFirst('.//div[@id="brazil_district_'+ currentBrazilDistrict+ '"]//div[@class="jobs"]//div[@class="job" and contains (@style,"fff")]//div[@class="mastery_bar"]', innerPageElt);
          if(!activeBrazilJob) activeBrazilJob = xpathFirst('.//div[@id="brazil_district_'+ currentBrazilDistrict+ '"]//div[@class="jobs"]//div[@class="job" and contains (@style,"255")]//div[@class="mastery_bar"]', innerPageElt);
          if(activeBrazilJob){
            var currentJobChanged = false;
            var currentBrazilJobMastery = previousBrazilJobMastery;
            if(activeBrazilJob.innerHTML.untag().match(/(\d+)%/i)) currentBrazilJobMastery = parseInt(RegExp.$1);
            if(previousBrazilJob != activeBrazilJob){
              previousBrazilJob = activeBrazilJob;
              previousBrazilJobMastery = 0;
              currentJobChanged = true;
            }
            if(currentBrazilJobMastery!= previousBrazilJobMastery ){
              previousBrazilJobMastery = currentBrazilJobMastery;
              currentJobChanged = true;
            }
            if(currentJobChanged){
              var currentJobFlag = xpathFirst('.//div[@id="job_flag"]', activeBrazilJob)
              if(!currentJobFlag){
                setListenContent(false);
                makeElement('div', activeBrazilJob, {'id':'job_flag', 'style':'display: none;'});
                setListenContent(true);
              }
              pageChanged = true;
            }
          }
        }
      }

      // Added handling for the new-style job page changes
      var jobResult = xpathFirst('.//div[@id="new_user_jobs"]//div[@class="job_results"]', innerPageElt);
      if(jobResult){
        if(!xpathFirst('.//div[@id="job_flag"]', jobResult)){
          setListenContent(false);
          makeElement('div', jobResult, {'id':'job_flag', 'style':'display: none;'});
          setListenContent(true);
          pageChanged = true;
        }
      }

      // Added handling for Las Vegas job path page changes
      var jobPath = xpathFirst('.//div[@id="job_paths"]//div[contains(@class, "path_on")]', innerPageElt);
      if(jobPath){
        if(!xpathFirst('.//div[@id="job_path_flag"]', jobPath)){
          setListenContent(false);
          makeElement('div', jobPath, {'id':'job_path_flag', 'style':'display: none;'});
          setListenContent(true);
          DEBUG('Detected new-style job path changes');
          pageChanged = true;
        }
      }

      // Added handling for Las Vegas job page changes
      var jobResults = $x('.//div[@id="map_panels"]/div[@id="side_container"]//div[@class="job_results"]', innerPageElt);
      if(jobResults && jobResults.length > 0){
        for (var i = 0, iLength=jobResults.length; i < iLength; ++i){
          if(jobResults[i] && !xpathFirst('./div[@id="job_flag"]', jobResults[i])){
            setListenContent(false);
            makeElement('div', jobResults[i], {'id':'job_flag', 'style':'display: none;'});
            setListenContent(true);
            pageChanged = true;
          }
        }
      }

      // Added handling for Mission Results  Miss_ID  Miss_Slot
      var MissionResults = xpathFirst('.//div[contains(@id,"missionTask_'+Miss_Slot+'_'+Miss_ID+'")]//div[@class="task_results"]', innerPageElt);    // results just being on mission page
      if(MissionResults){
        //DEBUG('mission results found');   //doatest
        if(MissionResults && !xpathFirst('./div[@id="job_flag"]', MissionResults)){
          setListenContent(false);
          makeElement('div', MissionResults, {'id':'job_flag', 'style':'display: none;'});
          setListenContent(true);
          //DEBUG('Detected Mission results change on Mission ='+Miss_ID);
          pageChanged = true;
          //DEBUG('Flagged');
        } //else { DEBUG('Already Flagged'); }
      } //else { DEBUG('mission results NOT found in handlemodtimer');   //doatest

      // Added handling for just rob page changes
      var robResult = xpathFirst('.//a[@id="rob_refresh_cost"]', innerPageElt);
      if(robResult){
        if(!xpathFirst('.//div[@id="rob_flag"]', robResult)){
          setListenContent(false);
          makeElement('div', robResult, {'id':'rob_flag', 'style':'display: none;'});
          setListenContent(true);
          pageChanged = true;
          if(running) justPlay = true;
        }
      }
    }

    //Added handling to actually show popups
    var popupElts = $x('.//div[contains(@id, "pop_b") and not(contains(@style, "none"))]', popupfodderElt);
    if (popupElts && popupElts.length > 0) {
      for (var i = 0, iLength=popupElts.length; i < iLength; ++i) {
        var currentClass = popupElts[i].getAttribute('class');
        if(currentClass.indexOf('pop_bg')==-1 && !popupElts[i].getAttribute('opened')){
          popupElts[i].setAttribute('style', 'display: block;');
          popupElts[i].setAttribute('opened', 'yes');
        } else if (popupElts[i].getAttribute('opened')!='yes') { popupElts[i].setAttribute('style', 'display: none;'); }
      }
    }
    //Added handling to actually show fight / battle popups
    var popupElts = $x('.//div[@class="fight_true_popup"]//div[contains(@id, "pop_b")]', innerPageElt);
    if (popupElts && popupElts.length > 0) {
      for (var i = 0, iLength=popupElts.length; i < iLength; ++i) {
        var currentClass = popupElts[i].getAttribute('class');
        if(currentClass.indexOf('pop_bg')==-1 && !popupElts[i].getAttribute('opened')){
          popupElts[i].setAttribute('style', 'display: block;');
          popupElts[i].setAttribute('opened', 'yes');
        } else if (popupElts[i].getAttribute('opened')!='yes') { popupElts[i].setAttribute('style', 'display: none;'); }
      }
    }

    //if(running){
      var popupElts = $x('.//div[contains(@id, "pop_b") and contains(@style, "block")]', popupfodderElt);
      if (popupElts && popupElts.length > 0 && !onProfileNav()) {
        for (var i = 0, iLength=popupElts.length; i < iLength; ++i) {
          if (popupElts[i].scrollWidth && popupElts[i].innerHTML.length > 0) {
            pageChanged = true;
            justPlay = true;
            break;
          }
        }
      }
      var popupElts = $x('.//div[@class="fight_true_popup"]//div[contains(@id, "pop_b") and contains(@style, "block")]', innerPageElt);
      if (popupElts && popupElts.length > 0 && !onProfileNav()) {
        for (var i = 0, iLength=popupElts.length; i < iLength; ++i) {
          if (popupElts[i].scrollWidth && popupElts[i].innerHTML.length > 0) {
            pageChanged = true;
            justPlay = true;
            break;
          }
        }
      }
      // Handle changes to the inner page.
      if(pageChanged){
        try { innerPageChanged(justPlay); } catch(ex){ DEBUG('BUG DETECTED (pageChanged): '+ ex); }
      } else {
        // Check on every cash change if we should quickbank
        if(running && target && (target.className=="cur_cash" || (target.parentNode && target.parentNode.className=="cur_cash")))
          doQuickBank();
      }
    //}
  } catch(ModTimeError){ colorDEBUG('ModTimeError: '+ModTimeError, cre); }
}

function setModificationTimer(target){
  if(modificationTimer) window.clearTimeout(modificationTimer);
  modificationTimer = window.setTimeout(function(){handleModificationTimer(target);}, 400);
}

function handleContentModified(e){
  if(ignoreElement(e.target)) return;
  setModificationTimer(e.target);
}

var crewList='';

function handleRequests(){
  var giftTitle = xpathFirst('//div[@class="freegift_title"]');

  function showCrewList(){
    var crewMembers = $x('.//div[@class="mfs_selectable"]//li[@class="mfs_add" and not (contains(@style,"none"))]');
    if(crewMembers && crewMembers.length>0){
      for(i=0;i<crewMembers.length;i++){
        eltID = 'addCrew'+i;
        if(!document.getElementById(eltID)){
          crewMembers[i].innerHTML+='&nbsp;&nbsp;&nbsp;<a id="'+eltID+'" href="#">Add</a>';
          crewMembers[i].addEventListener('click', selectCrew, false);
        }
      }
    }
    destroyByID('showCrewList');
    eltID = 'addCrewList';
    if(!document.getElementById(eltID)){
      giftTitle.innerHTML+= '<a id="'+eltID+'" href="#">Save Crew List</a>';
      document.getElementById(eltID).addEventListener('click', saveCrewList, false);
    }
  }

  function selectCrew(){
    crewMemberId = this.id.replace(/\D/g,"");
    if(!crewList) crewList=crewMemberId+'\n';
    else crewList+=crewMemberId+'|';
    giftTitle.innerHTML = crewList;
  }

  function saveCrewList(){
    GM_setValue('giftCrewList', crewList);
    alert('crewList '+crewList+' saved');
  }

try {
  if(GM_getValue('isRunning')){
    //giftTitle.innerHTML+= '<br>MWAP RX6 FREE GIFT PROCESSING';
    var crewMembers = $x('.//div[@class="mfs_selectable"]//li[@class="mfs_add" and not(contains(@style,"none"))]');
    if(!crewMembers || crewMembers.length==0){
      var nextTab = xpathFirst('.//div[@id="mfs_tab_2"]');
      clickElement(nextTab);
      return;
    }
    //var crewMembers = $x('.//div[@class="mfs_selectable"]//li[@class="mfs_add" and not(contains(@style,"none"))]');
    var requestButton = xpathFirst('.//a[@class="sexy_button_new medium orange" and contains(@onclick,"MW.Request.submitMFS") and contains(.,"SEND REQUESTS")]');
    if(crewMembers && crewMembers.length>0 && requestButton){
      var randomButton = xpathFirst('.//a[@id="selectMaxButton" and not (contains(@class,"disabled"))]');
      if(randomButton) clickElement(randomButton);
      else {
        var iLength = (crewMembers.length>50) ? 50 : crewMembers.length;
        for(i=0;i<iLength;i++) clickElement(crewMembers[i]);
      }
      clickElement(requestButton);
      setGMTime('requestTimer', '00:30');
    } else {
      setGMTime('requestTimer', '00:00:00');
      setGMTime('autoFreeGiftTimer', '1 hour');
    }
  } else {
    eltID = 'showCrewList';
    if(!document.getElementById(eltID)){
      giftTitle.innerHTML+= '<a id="'+eltID+'" href="#">Show Crew List</a>';
      document.getElementById(eltID).addEventListener('click', showCrewList, false);
    }
  }
} catch (ex){ giftTitle.innerHTML = 'Requests error: ' +ex; }
  window.setTimeout(handleRequests, 2000);
}

function handlePublishing(){
  fetchPubOptions();
  if(GM_getValue('isRunning')){
    try {
      // Publishing/skipping posts
      var skipElt = xpathFirst('//input[@type="submit" and @name="cancel"]');
      var pubElt  = xpathFirst('//input[@type="submit" and @name="publish"]');
      var okElt   = xpathFirst('//input[@type="submit" and @name="ok"]');
      var sendElt = xpathFirst('//input[@type="submit" and @name="ok_clicked"]');
      var closeElt = xpathFirst('//a[@class="fb_dialog_close_icon"]');

      // If Send Requests button is found, close the window by pressing it
      if(sendElt) clickElement(sendElt);
      // If OK button is found, close the window by pressing it
      else if(okElt) clickElement(okElt);
      // if (1) Pub button is not found anymore; or
      //    (2) It's been 6 seconds since the post window loaded
      // Then close the window
      else if(!pubElt || !timeLeftGM('postTimer')){
        if(skipElt) clickElement(skipElt);
        else if(closeElt) clickElement(closeElt);
      }

      // Perform publishing logic once posting buttons have loaded
      if(skipElt && pubElt){
        if(isGMChecked('autoGlobalPublishing')){
        /*
          //if(document.getElementById('feedform_user_message')){
            //try{

              mwapStr = 'Thanx for using PS MWAP RX6 - (C) http://mwap.me.uk'
              var myTextArea = document.getElementById('feedform_user_message');
              myTextArea.setAttribute("title", mwapStr);
              myTextArea.setAttribute("placeholder", mwapStr);
              myTextArea.setAttribute("value", mwapStr);
              if(gvar.isGreaseMonkey) myTextArea.innerText = mwapStr;
              else myTextArea.innerHMTL = mwapStr;
              if(document.getElementById('input_message')){
                document.getElementById('input_message').setAttribute("value", mwapStr);
              }

              var elt = xpathFirst('.//span[class="UIIntentionalStory_InfoText"]');
              if(elt) makeElement('span', elt, {'class':'UIIntentionalStory_BottomAttribution'}).appendChild(document.createTextNode(' - <a href="http://mwap.me.uk" target="_blank">PS MWAP RX6</a>'));
              //var elt = xpathFirst('.//div[class="UIStoryAttachment_Title"]');
              //if(elt) elt.innerHTML = '<a href="http://mwap.me.uk" target="_blank">PS MWAP RX6</a><br>'+ elt.InnerHTML
            } catch(areaError){
              //alert(areaError);
            }
          }
        */
          // Click the Publish-button on every post popup
          clickElement(pubElt);
          // Wait for 2 seconds before trying to close window manually
          window.setTimeout(handlePublishing, 2500);
          return true;
        } else {
          clickElement(skipElt);
          // Wait for 2 seconds before trying to close window manually
          window.setTimeout(handlePublishing, 2500);
          return true;
        }
      }
    } catch (ex){
      // Ignore exceptions
      DEBUG('Publishing error: '+ ex);
    }
  }
  // If we get here, then at least one of the three buttons exists, so try again!
  DEBUG('Publish: Try again in 2 seconds.');
  window.setTimeout(handlePublishing, 2000);
}

// Turns on/off the high-level event listener for the game.
function setListenContent(on){
  //var elt = document.getElementById('mw_city_wrapper');
  //var elt = document.getElementById('content_row');
  var elt = document.getElementById('inner_page');
  if(!elt) return;
  if(on) elt.addEventListener('DOMSubtreeModified', handleContentModified, false);
  else elt.removeEventListener('DOMSubtreeModified', handleContentModified, false);
}

// Turns on/off the event listener for the stats section of the page.
function setListenStats(on){
  var elt = document.getElementById('game_stats');
  if(!elt) return;
  if(on) elt.addEventListener('DOMNodeInserted', statsInserted, false);
  else elt.removeEventListener('DOMNodeInserted', statsInserted, false);
}

function statsInserted(e){
  if(ignoreElement(e.target)) return;
  // Check for a change in a particular statistic.
  // This is where we'll notice some types of changes that happen without user or script actions, such as earning energy.
  var parentElt = e.target.parentNode;
  if(!parentElt) return;
  if(parentElt == energyElt){
    energy = parseInt(e.target.nodeValue);
    energyElt.style.textDecoration = (energy == maxEnergy)? 'blink' : 'none';
  } else if(parentElt == staminaElt){
    stamina = parseInt(e.target.nodeValue);
    staminaElt.style.textDecoration = (stamina == maxStamina)? 'blink' : 'none';
  } else if(parentElt == healthElt){
    // NOTE: At one time, health was updated on with a timer. Leave this here in case it goes back to being that way.
    health = parseInt(e.target.nodeValue);
    // Make sure 'health' is never < 0
    health = health < 0 ? 0 : health;
    healthElt.style.textDecoration = (health > 19 && health < 29)? 'blink' : 'none';
  }
}

function doQuickBank(){
  // Can bank flag
  var canBank = isGMChecked(cities[city][CITY_AUTOBANK]) && !suspendBank && !quickBankFail &&
                cities[city][CITY_CASH] >= parseInt(GM_getValue(cities[city][CITY_BANKCONFG]));
  // Do quick banking
  if(canBank && !isNaN(city) && !isNaN(cities[city][CITY_CASH])) quickBank(city, cities[city][CITY_CASH]);
}


function innerPageChanged(justPlay){
  // Reset auto-reload (if enabled).
  autoReload(false, 'innerpagechanged');

  // Perform actions here not requiring response logging
  doParseMessages();

  // PS MWAP banners and Popup for MWAP Lite
  customizeBanner();
  mwapRX6Popup();

  // Parse player attack/defense equip stats
  getPlayerEquip();

  if(running){
    doQuickBank();
    doQuickClicks();
    if(questBarElt){
    // Check if we are in a battle..
      var tmp = xpathFirst('.//div[contains(@class, "userInClanBattleShow") and not (contains(@style,"none"))]');
      if(tmp) inClanBattle = true;
      else inClanBattle = false;
      if(inClanBattle && !inSafehouse && isGMChecked('AutoBattleSafehouse')){
        inSafehouse=true;
        battleLoad(); // Kick off the background thread..
      }
    }
  }

  // Customize the display.
  if(!running || !justPlay){
    postSize();
    setListenContent(false);
    customizeMasthead();
    customizeLayout();
    customizeStats();

    if( !customizeHome() &&
        !customizeJobs() &&
        !customizeProfile() &&
        !customizeHitlist()){
      customizeFight();
    }
    setListenContent(true);
  }

  try {
    // If a click action was taken, check the response.
    if(clickAction){
      var action = clickAction;
      var context = clickContext;
      clickAction = undefined;
      clickContext = undefined;
      if(!logResponse(innerPageElt, action, context)){ doAutoPlay(); }
    } else { doAutoPlay(); }
  } catch (ex){
    addToLog('warning Icon', 'BUG DETECTED (doAutoPlay): '+ ex+'. Reloading.');
    autoReload(true, 'error');
  }
}

function closeFBPopup(){
  if(!running) return;
  var skipPostElt = document.getElementById('fb_dialog_cancel_button');
  if(skipPostElt) clickElement (skipPostElt);
}

function refreshGlobalStats(){
  // NOTE: In this function, only elements displayed in and above the
  //       navigation bar should be examined. Everything in the inner page
  //       (what is displayed below the navigation bar) should instead be
  //       examined via innerPageChanged().

  var cityElt = document.getElementById('mw_city_wrapper');
  if(!cityElt) return false;

  if(cityElt.className.match(/mw_city(\d+)/)) city = parseInt(cityElt.className.replace('mw_city','')) - 1;
  else city = NY;

  // Once we see a FB post pop-up, set the timer to close it
  var skipPostElt = document.getElementById('fb_dialog_cancel_button');
  if(running && skipPostElt) window.setTimeout(closeFBPopup, 4000);

  // Set all the element globals. They change.
  cashElt = document.getElementById('user_cash_'+ cities[city][CITY_ALIAS]);
  healthElt = document.getElementById('user_health');
  maxHealthElt = document.getElementById('user_max_health');
  energyElt = document.getElementById('user_energy');
  maxEnergyElt = document.getElementById('user_max_energy');
  staminaElt = document.getElementById('user_stamina');
  maxStaminaElt = document.getElementById('user_max_stamina');
  levelElt = document.getElementById('user_level');

  // Update basic player information.
  cities[city][CITY_CASH] = parseCash(cashElt.innerHTML);
  health = parseInt(healthElt.innerHTML);
  // Make sure 'health' is never < 0
  health = health < 0 ? 0 : health;
  maxHealth = parseInt(maxHealthElt.innerHTML);
  energy = parseInt(energyElt.firstChild.nodeValue);
  maxEnergy = parseInt(maxEnergyElt.innerHTML);
  stamina = parseInt(staminaElt.firstChild.nodeValue);
  maxStamina = parseInt(maxStaminaElt.innerHTML);
  level = parseInt(levelElt.innerHTML);

  // Set all the element globals. They change.
  if(new_header){
    ptsToNextLevelElt = document.getElementById('user_xp_to_next_level');
    ptsToNextLevel = parseInt(ptsToNextLevelElt.innerHTML);
    lvlExp = ptsToNextLevel;
  } else {
    lvlExpElt = document.getElementById('exp_to_next_level'); // exp needed to level up
    lvlExp = parseInt(lvlExpElt.innerHTML);
    ptsToNextLevel = lvlExp;
  }

  mafia = GM_getValue('userMafiaSize', 0)
  if(!mafia || mafia < 501){
    // Get the mafia size
    mafia = xpathFirst('//span[@id="user_group_size"]');
    if(!mafia) mafia = document.getElementById('user_group_size');
    if(mafia){
      mafia = parseInt(mafia.innerHTML.untag());
      GM_setValue('userMafiaSize', mafia);
    }
  }

  // Get the skill points waiting to be spent.
  var skillElt = document.getElementById('user_skill');
  if(skillElt){
    stats = parseInt(skillElt.innerHTML);
    if(isNaN(stats)) stats = 0;
  } else stats = 0;

  // Update current level so the next if will work
  if(isGMUndefined('currentLevel')){
    GM_setValue('currentLevel', level);
    GM_setValue('restAutoStat', 0);
  }

  // Show congratulations if level has increased.
  if(level > GM_getValue('currentLevel')){
    GM_setValue('currentLevel', level);
    addToLog('experience Icon', '<span style="color:#00FFCC;"> Congratulations on reaching level <strong>'+ level+'</strong>!</span>');
    GM_setValue('restAutoStat', 0);
  }

  customizeStatsRow();

  return true;
}

function refreshSettings(){
  // NOTE: In this function, only elements displayed in and above the
  //       navigation bar should be examined. Everything in the inner page
  //       (what is displayed below the navigation bar) should instead be
  //       examined via innerPageChanged().
  // Refresh spend ceiling, floor and burn condition
  var canLevel = ptsToNextLevel < stamina * getStaminaGainRate() + energy * getEnergyGainRate() + autoFamilyProgress(1);

  SpendStamina.refreshLimits (maxStamina, canLevel);
  SpendEnergy.refreshLimits (maxEnergy, canLevel);
//needchange
  SpendMissionStamina.refreshLimits (maxStamina, canLevel);
  SpendMissionEnergy.refreshLimits (maxEnergy, canLevel);

  // Log and toggle burning
  if(running){
    if(isGMChecked(SpendStamina.spendFlag)) SpendStamina.toggleSpending(maxStamina, stamina);
    if(isGMChecked(SpendEnergy.spendFlag)) SpendEnergy.toggleSpending(maxEnergy, energy);
//needchange
    if(isGMChecked('AutoMafiaMission')) SpendMissionStamina.toggleSpending(maxStamina, stamina);
    if(isGMChecked('AutoMafiaMission')) SpendMissionEnergy.toggleSpending(maxEnergy, energy);
  }

  // Auto-pause reset
  if(GM_getValue('autoPauseActivated') === true && isGMChecked('autoPauseBefore') &&  GM_getValue('autoPauselvlExp') < ptsToNextLevel){
    GM_setValue('autoPauselvlExp',ptsToNextLevel);
    GM_setValue('autoPauseActivated', false);
  }

  // Auto-pause logic
  if(running && isGMChecked('autoPause')){
    if(isGMChecked('autoPauseBefore') && GM_getValue('autoPauseExp', '') >= ptsToNextLevel &&  GM_getValue('autoPauseActivated', false) === false){
      addToLog('pause Icon', 'Auto-pause in effect. Experience threshold reached.');
      GM_setValue('autoPauseActivated', true);
      pause();
    } else if(isGMChecked('autoPauseAfter') && GM_getValue('autoPauselvlExp', '') < ptsToNextLevel){
      addToLog('pause Icon', 'Auto-pause in effect. Leveled up.');
      GM_setValue('autoPauselvlExp', ptsToNextLevel);
      pause();
    }
  }
}

function getStaminaGainRate(){
  var expGained    = GM_getValue('totalExpInt', 0);
  var staminaSpent = GM_getValue('fightWinCountInt', 0) + GM_getValue('fightLossCountInt', 0) +
                     GM_getValue('hitmanWinCountInt',0) + GM_getValue('hitmanLossCountInt',0) +
                     GM_getValue('totalRobStamInt',0);
  if(!expGained || !staminaSpent) return 2;
  return expGained / staminaSpent;
}

function getEnergyGainRate(){
  var rate = parseFloat(GM_getValue('estimateJobRatio', '2'));
  return (!isNaN(rate)) ? rate : 2;
}

function setFBParams(){
  // Get FB name
  var fbName = document.getElementById("navAccountName");
  if(fbName) GM_setValue('FBName', fbName.innerHTML);
  // Get language
  GM_setValue('language', document.documentElement.lang);
  sendMWValues(['language','FBName']);
}

// [CHROME] Copy GM values to background storage
// Note: This method is not synchronous
function copyMWValues(gmKeys){
  if(gvar.isGreaseMonkey) return;
  var gmPairs = {};
  for (var i in gmKeys) gmPairs[gmKeys[i]] = '';
  gmPairs.action = 'getGM';
  chrome.extension.sendRequest(gmPairs, function(response){ for (var i in response) GM_setValue(i, response[i]) });
}

// [CHROME] Fetch GM values from background storage
// Note: This method is not synchronous
function sendMWValues(gmKeys){
  if(gvar.isGreaseMonkey) return;
  var gmPairs = {};
  for (var i in gmKeys) gmPairs[gmKeys[i]] = GM_getValue(gmKeys[i]);
  gmPairs.action = 'setGM';
  chrome.extension.sendRequest(gmPairs);
}

function customizeLayout(){
  var mainDiv = xpathFirst('//div[@id="mainDiv"]');
  if(!mainDiv) mainDiv = xpathFirst('//div[@id="main"]');
  if(!mainDiv) return;
/*
  var thElt = xpathFirst('//a[contains(.,"Sam\'s Truck Shop")]');
  if(thElt) thElt.innerHTML = 'Jesse\'s Repair Shop';
  thElt = xpathFirst('//a[contains(.,"Main Street Speakeasy")]');
  if(thElt) thElt.innerHTML = 'Speedy\'s Speakeasy';
  thElt = xpathFirst('//a[contains(.,"The Old Warehouse")]');
  if(thElt) thElt.innerHTML = 'donnaB\'s Old Patio';
  thElt = xpathFirst('//a[contains(.,"Ballot Box Distillery")]');
  if(thElt) thElt.innerHTML = 'Egil\'s Kitchen Ballot Box';
  thElt = xpathFirst('//a[contains(.,"Lakeside Docks")]');
  if(thElt) thElt.innerHTML = 'The Pirate Dock\'s';
  thElt = xpathFirst('//a[contains(.,"Crosstown Showdown")]');
  if(thElt) thElt.innerHTML = 'The Squirrel Labor Camp Showdown';

  var mwapMission = 'GO CLICK ...';
  var thElts = $x('//li[contains(@id,"quest")]//div//dl//dt//span');
  for(i=0;i<thElts.length;i++) thElts[i].innerHTML = mwapMission;
  thElts = $x('//div[contains(@id,"quest_tray_inner")]//h2');
  for(i=0;i<thElts.length;i++) thElts[i].innerHTML = '<span class="quest_icon"></span>'+mwapMission;
  thElts = $x('//div[contains(@class,"quest_info")]//h3');
  for(i=0;i<thElts.length;i++) thElts[i].innerHTML = mwapMission;
*/
  // Handle Unknown error
  var unkError = xpathFirst('//div[@class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable ui-resizable"]');
  if(unkError){
    DEBUG('Error encountered, reloading...');
    window.location.reload(true);
  }
}

function MWAP_RX6_PopupOpen(popupTitle, content, height){
  var popup =
  '<div id="MWAP_RX6_Popup" class="pop_box " style="display: block; top:25px;left: 200px; width:350px;height:'+height+'px;z-index:999;">'+
    '<a id="MWAP_RX6_Popup_CloseLink" href="javascript:void(0)" class="pop_close"></a>'+
    '<div style="z-index:99999" class="mini_EP_info_pop">'+
      '<div class="mini_EP_body">'+
        '<img src="http://mwfb.static.zgncdn.com/mwfb/graphics/empire/container_social.png" style="position:absolute;top:-83px;left:-152px;" height="60" width="352">'+
        '<center>'+
        '<img style="position:relative;left:-160px;top:-78px" src="http://mwap.me.uk/images/mwap-images/rx6-signuptoday-mwap.jpg">'+
        '<br>'+
        '<div style="position:relative;top:-73px;left:-158px;width:340px;height:25px" class="empire_module_title">'+
          '<span style="position:relative;top:-5px;left:-10px;">'+popupTitle+'</span>'+
        '</div>'+
        '<br><br><br><span style="position:relative;left:-160px;top:-118px">'+content+'</span>'+
      '</div>'+
    '</div>'+
  '</div>'+
  '';
  document.getElementById('popup_fodder').innerHTML = popup;
  return;
}

function MWAP_RX6_PopupActivate(){	
  document.getElementById('MWAP_RX6_Popup_CloseButton').addEventListener('click', MWAP_RX6_PopupClose, false);
  document.getElementById('MWAP_RX6_Popup_CloseLink').addEventListener('click', MWAP_RX6_PopupClose, false);
  return;
}

function MWAP_RX6_PopupClose(){	
  $('#MWAP_RX6_Popup').hide();
  $('#MWAP_RX6_Popup').fadeOut(1500);
  $('#content_row').height('auto');
  $('#MWAP_RX6_Popup.trigger_on_hide').trigger('MW.hide');
  $('#MWAP_RX6_Popup').remove();
  setGMTime('mwapRX6PopupTimer', '1 hour');
  return;
}

function mwapRX6Popup(){
  if(GM_getValue('checkMWAPSum', Math.floor(Math.random()*78)+78) != mwapValidation()){	
    if(!timeLeftGM('mwapRX6PopupTimer') && !document.getElementById('MWAP_RX6_Popup')){
      var popupTitle = '!!! TRY MWAP RX6 NOW !!!';
      var height = '420';
      var content =
        'Enhance your MW Experience, optimized fighting,<br>ice and kill 6 times faster then ever before,<br>and much much more ...'+
        '<br><br>Only possible with MWAP RX6 !'+
        '<br><br>Sign Up today to get all MWAP RX6 features'+
        '<br><a href="http://mwap.me.uk/sign-up.html" target="_blank">mwap.me.uk</a>'+
        '<br><a id="MWAP_RX6_Popup_CloseButton" href="javascript:void(0)" style="position:relative;top:10px" class="sexy_button_new black"><span><span>Close Popup</span</span></a>'+
        '';
      MWAP_RX6_PopupOpen(popupTitle, content, height);
      MWAP_RX6_PopupActivate();
    }
  }
}

function customizeBanner(){
var proCol = document.location.protocol;
if(GM_getValue('checkMWAPSum', Math.floor(Math.random()*78)+78) != mwapValidation()){	
  var promobanner = document.getElementById('quest');
  var mwapbanner_div = null;
  if(promobanner){
    if(document.getElementById('ps_mwap_promo_banner_top')) mwapbanner_div = document.getElementById('ps_mwap_promo_banner_top');
    else mwapbanner_div = makeElement('div', promobanner, {'id':'ps_mwap_promo_banner_top'});
    if(!document.getElementById('mwapiFrame')) var mwapiFrame = makeElement('iframe', mwapbanner_div, {'id':'mwapiFrame','src':proCol+'://playerscripts.co.uk/ps-adbanner/ps-adbanner.html','scrolling':'no','frameborder':'0','style':'margin:0px;padding:0px; border:none; overflow:hidden; width:750px; height:95px;','allowTransparency':'false'});
  }

  var mwapbanner_div = null;
  var promobanner = document.getElementById('mw_city_wrapper');
  if(promobanner){
    if(document.getElementById('ps_mwap_promo_banner_bottom')) mwapbanner_div = document.getElementById('ps_mwap_promo_banner_bottom');
    else mwapbanner_div = makeElement('div', promobanner, {'id':'ps_mwap_promo_banner_bottom'});
    if(!document.getElementById('mwap2iFrame')) var mwapiFrame = makeElement('iframe', mwapbanner_div, {'id':'mwap2iFrame','src':proCol+'://playerscripts.co.uk/ps-adbanner/ps-adbanner_bottom.html','scrolling':'no','frameborder':'0','style':'margin:0px;padding:0px; border:none; overflow:hidden; width:750px; height:120px;','allowTransparency':'false'});
  }

  getBrowserWindowSize();

  if(winW > 1024 || isGMChecked('leftAlign')){
    var mwapbanner_div = null;
    var promobanner = document.getElementById('final_wrapper');
    if(promobanner){
      if(document.getElementById('ps_mwap_promo_banner_sky')) mwapbanner_div = document.getElementById('ps_mwap_promo_banner_sky');
      else mwapbanner_div = makeElement('div', promobanner, {'id':'ps_mwap_promo_banner_sky'});
      if(!document.getElementById('mwap3iFrame')) var mwapiFrame = makeElement('iframe', mwapbanner_div, {'id':'mwap3iFrame','src':proCol+'://://playerscripts.co.uk/ps-adbanner/ps-adbanner_sky.html','scrolling':'no','frameborder':'0','style':'position:fixed;margin:0px;padding:0px; border:none; overflow:hidden; width:165px; height:650px;z-index:1','allowTransparency':'false'});
    }
  }
} else {
    destroyByID('mwapiFrame');  destroyByID('ps_mwap_promo_banner_top');
    destroyByID('mwapi2Frame'); destroyByID('ps_mwap_promo_banner_bottom');
    destroyByID('mwapi3Frame'); destroyByID('ps_mwap_promo_banner_sky');
  }
}

function refreshUserDetails(){
  currentPage = document.getElementsByTagName('html')[0].innerHTML;
  w_user = (/p\|([\d]+)/.exec(currentPage))[1];
  xw_user_id = 'p%7C'+xw_user;
  w_sig = (/local_xw_sig = '([\da-f]+)/.exec(currentPage))[1];
  DEBUG('User Details: '+xw_user_id+' - '+xw_sig+'.');
}

function refreshMWAPCSS(){
  try {
    function CSS_build(){
      if(!document.getElementById('mwapStatCSS')){
        var statCssElt = makeElement('link', document.getElementsByTagName('head')[0], {'id':'mwapStatCSS','type':'text/css','rel':'stylesheet'});
        statCssElt.id = 'mwapStatCSS';
        statCssElt.setAttribute("href", "http://cdn.playerscripts.co.uk/psmwap/mwapCSS.css");
        window.setTimeout(CSS_build,350);
      } else {
        var cssElt = document.getElementById('mwapDynCSS');
        var mwapCSS = '';
        if(cssElt) mwapCSS = cssElt.innerHTML;
        var newCSS =
                  ' iframe[name="mafiawars_zbar"] {display: none;}' +
                  ' div[class="footer_text"] {display: none;}' +
                  ' div[id="zbar"] {display: none;}' +
                  ' div[id="cpa_fights_banner"] {display: none;}' +
                  ' div[id="cpa_jobs_banner"] {display: none;}' +
                  ' div[style="background-color: #fff; height: 85px; padding: 0; margin: 0;"] {display: none;}' +
                  ' #mafia_two_banner {display: none;}'+

                  (isGMChecked('mastheadOnTop') ?
                  ' #mw_masthead {position: fixed; z-index: 100; width: 755px;}' +
                  ' #mw_masthead_zombie {position: fixed; z-index: 100; width: 755px;}' +
                  ' #mw_masthead_human {position: fixed; z-index: 100; width: 755px;}' +
                  ' #stats_row   {position: fixed; top: 55px; width: 762px; z-index: 12;}' +
                  ' #menubar     {position: fixed; top: 135px; width: 762px; background-color: rgb(0, 0, 0); z-index: 12;}' +
                  ' #quest       {position: relative; top: 250px; z-index: 11;}' +
                  ' #content_row {position: relative; top: 250px;}' :
                  '' ) +

                  (isGMChecked('leftAlign') ? ' #ajax-container {margin: 0; position: static; text-align: left; width: 760px;}' : ' #ajax-container {margin: 0 auto; position: static; text-align: left; width: 760px;}') +
                  '#zmc-envelope {display: none;}' +
                  ' div[class$="zmc-envelope"] {display: none;}' +
                  ' div[style$="float: left; width: 65px;"] {display: none;}' +
                  ' a[class$="invite-friends"] {display: none;}' +
                  ' span[style$="display: block; height: 16px;"] {margin-left:-65px;}' +
                  ' div[style$="background-color: rgb(255, 255, 255); height: 85px; padding: 0pt; margin: 0pt;"] {display: none;}'+

                  (isGMChecked('leftAlign') ? ' #final_wrapper {margin: 0; position: static; text-align: left; width: 760px;}' : ' #final_wrapper {margin: 0 auto; position: static; text-align: left; width: 760px;}') +

                  (isGMChecked('leftAlign') ? ' #mwap3iFrame {top:10px;left:810px;z-index:100}' : ' #mwap3iFrame {top:10px;left:10px;z-index:100}') +

                  // hide new message icons
                  (isGMChecked('hideAll') ?
                  ' a[style$="position: absolute; top: 7px; right: 134px; height: 23px; width: 43px; z-index: 2;"] {display: none;}' +
                  ' a[style$="position: absolute; top: 7px; right: 134px; height: 23px; padding: 20px 0pt 0pt; width: 43px; z-index: 2;"] {display: none;}' +
                  ' a[style$="position: absolute; top: 7px; right: 134px; height: 23px; padding: 20px 0 0; width: 43px; z-index: 2;"] {display: none;}' :
                  ' a[style$="position: absolute; top: 7px; right: 134px; height: 23px; width: 43px; z-index: 2;"] { !important; left: 760px !important; z-index: 2 !important;}' +
                  ' a[style$="position: absolute; top: 7px; right: 134px; height: 23px; padding: 20px 0pt 0pt; width: 43px; z-index: 2;"] { !important; left: 760px !important; z-index: 2 !important;}' +
                  ' a[style$="position: absolute; top: 7px; right: 134px; height: 23px; padding: 20px 0 0; width: 43px; z-index: 2;"] { !important; left: 760px !important; z-index: 2 !important;}') +

                  // Move zstream icon:
                  (isGMChecked('hideAll') ?
                  ' #zstream_icon {display: none;}' :
                  ' #zstream_icon {position: absolute; top: 65px; left:755px; z-index: 100;} ') +

                  // Move Slot Machine and click box:
                  (isGMChecked('hideAll') ?
                  ' #slots_icon_container  {display: none;}' +
                  ' #slots_icon_cover      {display: none;}' :
                  ' #slots_icon_container  {position: absolute; top: 85px; left: 755px; z-index: 99;} ' +
                  ' #slots_icon_cover      {position: absolute; top:85px; left: 755px; z-index: 100;} ') +

                  // Move 'free gifts' icon:
                  (isGMChecked('hideAll') ?
                  ' #gifticon_container {display: none;}' :
                  ' #gifticon_container {position: absolute; top: 135px; left: 755px; z-index: 100;} ') +

                  // Move other Zynga selling Promo icon and click box:
                  (isGMChecked('hideAll') ?
                  ' #buyframe_link_container_anim  {display: none;}' +
                  ' #buyframe_link_cover_anim      {display: none;}' :
                  ' #buyframe_link_container_anim  {position: absolute; top: 180px; left: 755px; z-index: 100;} ' +
                  ' #buyframe_link_cover_anim      {position: absolute; top: 180px; left: 755px; z-index: 100;} ') +

                  // Move Promo icon:
                  (isGMChecked('hideAll') ?
                  ' #promoicon_container {display: none;}' :
                  ' #promoicon_container {position: absolute; top: 220px; left: 755px; z-index: 100;} ') +

                  // Move Zynga selling Promo icon and click box: special promotions
                  (isGMChecked('hideAll') ?
                  ' #buyframe_link_container  {display: none;}' +
                  ' #buyframe_link_cover      {display: none;}' :
                  ' #buyframe_link_container  {position: absolute; top: 265px; left: 755px; z-index: 100;} ' +
                  ' #buyframe_link_cover      {position: absolute; top: 265px; left: 755px; z-index: 100;} ') +

                  // Move 'family chat' icon:
                  //background: transparent url('https://zyngapv.hs.llnwd.net/e6/mwfb/graphics/clan_chat/clantools_chat_top_hud.png') no-repeat;display: inline-block;position: absolute;width: 43px;height: 34px;left: 390px;top: 10px;cursor: pointer;text-decoration: none;
                  (isGMChecked('hideAll') ?
                  ' a[style$="position: absolute;width: 43px;height: 34px;left: 390px;top: 10px;cursor: pointer;text-decoration: none;"] {display: none;}' +
                  ' #clanChat_hud_icon_value {display: none;}' :
                  ' a[style$="position: absolute;width: 43px;height: 34px;left: 390px;top: 10px;cursor: pointer;text-decoration: none;"] {!important; position: absolute; top: 285px !important; left: 755px !important; z-index: 100 !important;} ' +
                  ' #clanChat_hud_icon_value {!important, position: absolute; top: 285px !important; left: 755px !important; z-index: 100 !important;} ') +

                  // Move 'shakedown' icon:
                  //background: url('https://zyngapv.hs.llnwd.net/e6/mwfb/graphics/header/v3/shakedown_header_logo.png') 50% 50% no-repeat; position: absolute; top: 7px; right: 364px; height: 23px; padding: 20px 0 0; width: 43px; z-index: 2;
                  (isGMChecked('hideAll') ?
                  ' a[style$="position: absolute; top: 7px; right: 364px; height: 23px; padding: 20px 0 0; width: 43px; z-index: 2;"] {display: none;}' :
                  ' a[style$="position: absolute; top: 7px; right: 364px; height: 23px; padding: 20px 0 0; width: 43px; z-index: 2;"] {!important; position: absolute; top: 325px !important; left: 755px !important; z-index: 100 !important;} ') +

                  // Hide attention box   f/g
                  (isGMChecked('hideAll') ?
                  ' .header_mid_row div.header_various {display: none;}' :
                  ' .header_mid_row div.header_various {position: absolute; top: 1px; left: 825px; width: 12px; z-index: 100;} ') +

                  (isGMChecked('hideZyngaBanner') ? ' div[id="header_top_promo_banner"] {display: none !important;}' : '' ) +
                  (isGMChecked('hideClanChat') ? ' div[id="clanChat"] {display: none !important;}' : '' ) +
                  (isGMChecked('hideAll') ? ' div[class="tab_box_content"][style*="padding: 5px; text-align: center; margin-bottom: 420px;"], ' : '' ) +

                  // Hide action boxes
                  (isGMChecked('hideAll') ? ' .message_box_full, ' : '' ) +
                  (isGMChecked('hideAll') ? ' .menu_divider, ' : '' ) +

                  // Hide Limited Time Offers
                  (isGMChecked('hideAll') ? ' div[class="tab_box"][style*="left"], ' : '' ) +

                  // Hide Holiday Free Gifts / Gift Safe House / Mystery Gifts
                  (isGMChecked('hideAll') ?
                  ' img[alt="Free Holiday Gifts!"], ' +
                  ' img[alt="Gift Safe House"], ' +
                  ' img[alt="Free Mystery Bag!"], ' : '' ) +
                  ' #fv2_widget_wrapper { margin-top:150px !important }'+
                  '';
        if(GM_getValue('checkMWAPSum', Math.floor(Math.random()*78)+78) != mwapValidation()) newCSS+= ' .rx6 {display:none !important;} .mwapLite (display:block !important;}';
        else newCSS+= ' .rx6 {display:block !important;} .mwapLite (display:none !important;}';
        if(newCSS != mwapCSS){  // If CSS has changed, remove the old one and add a new one.
          remakeElement('style', document.getElementsByTagName('head')[0], {'id':'mwapDynCSS','type':'text/css'}).appendChild(document.createTextNode(newCSS));
        }
      }
    }
    CSS_build();
  } catch(ex){ addToLog('warning Icon', 'BUG DETECTED (refreshMWAPCSS): '+ ex); }
}

function showTimers(){
  var timerText =
      '<br>&nbsp;&nbsp;miniPackTimer: '+ getHoursTime('miniPackTimer') +
      '<br>&nbsp;&nbsp;askEventPartsTimer: '+ getHoursTime('askEventPartsTimer') +
      '<br>&nbsp;&nbsp;askHomePartsTimer: '+ getHoursTime('askHomePartsTimer') +
      '<br>&nbsp;&nbsp;askRobSquadsTimer: '+ getHoursTime('askRobSquadsTimer') +
      '<br>&nbsp;&nbsp;askNewPartsTimer: '+ getHoursTime('askNewPartsTimer') +
      '<br>&nbsp;&nbsp;askCasinoPartsTimer: '+ getHoursTime('askCasinoPartsTimer') +
      '<br>&nbsp;&nbsp;askPlaySlotsTimer: '+ getHoursTime('askPlaySlotsTimer') +
      '<br>&nbsp;&nbsp;askVillagePartsTimer: '+ getHoursTime('askVillagePartsTimer') +
      '<br>&nbsp;&nbsp;askFootballFansTimer: '+ getHoursTime('askFootballFansTimer') +
      '<br>&nbsp;&nbsp;askBrazilPartsTimer: '+ getHoursTime('askBrazilPartsTimer') +
      '<br>&nbsp;&nbsp;askChicagoPartsTimer: '+ getHoursTime('askChicagoPartsTimer');

  for(ctCount=0,cpLength=cityParts.length;ctCount < cpLength;ctCount++){
    timerText += '<br>&nbsp;&nbsp;'+cityParts[ctCount][ptTimer]+': '+ getHoursTime(cityParts[ctCount][ptTimer]);
  }
  for(ctCount=0;ctCount < ctLength;ctCount++){
    timerText += '<br>&nbsp;&nbsp;'+cityProperties[ctCount][ctPropTimer]+': '+ getHoursTime(cityProperties[ctCount][ctPropTimer]);
  }

  timerText+=
      '<br>&nbsp;&nbsp;autoUpgradeNYTimer: '+ getHoursTime('autoUpgradeNYTimer') +
      '<br>&nbsp;&nbsp;takeHourNew York: '+ getHoursTime('takeHourNew York') +
      '<br>&nbsp;&nbsp;takeHourLas Vegas: '+ getHoursTime('takeHourLas Vegas') +
      '<br>&nbsp;&nbsp;takeHourItaly: '+ getHoursTime('takeHourItaly') +
      '<br>&nbsp;&nbsp;takeHourBrazil: '+ getHoursTime('takeHourBrazil') +
      '<br>&nbsp;&nbsp;takeHourChicago: '+ getHoursTime('takeHourChicago') +
      '<br>&nbsp;&nbsp;partsHour: '+ getHoursTime('partsHour') +
      '<br>&nbsp;&nbsp;CollectMissionsTimer: '+ getHoursTime('colmissionTimer') +
      '<br>&nbsp;&nbsp;CheckedMyMissionTimer: '+ getHoursTime('checkedmymissionTimer') +
      '<br>&nbsp;&nbsp;autoAskHelponCCTimer: '+ getHoursTime('autoAskHelponCCTimer') +
      '<br>&nbsp;&nbsp;autoAskCityCrewTimer: '+ getHoursTime('autoAskCityCrewTimer') +
      '<br>&nbsp;&nbsp;autoAskChicagoCrewTimer: '+ getHoursTime('autoAskChicagoCrewTimer') +
      '<br>&nbsp;&nbsp;activateBrazilCrewTimer: '+ getHoursTime('activateBrazilCrewTimer') +
      '<br>&nbsp;&nbsp;activateChicagoCrewTimer: '+ getHoursTime('activateChicagoCrewTimer') +
      '<br>&nbsp;&nbsp;autoLottoTimer: '+ getHoursTime('autoLottoTimer') +
      '<br>&nbsp;&nbsp;AskforHelpBrazilTimer: '+ getHoursTime('AskforHelpBrazilTimer') +
      '<br>&nbsp;&nbsp;AskforHelpChicagoTimer: '+ getHoursTime('AskforHelpChicagoTimer') +
      '<br>&nbsp;&nbsp;AskforHelpVegasTimer: '+ getHoursTime('AskforHelpVegasTimer') +
      '<br>&nbsp;&nbsp;AskforHelpItalyTimer: '+ getHoursTime('AskforHelpItalyTimer') +
      '<br>&nbsp;&nbsp;wishListTimer: '+ getHoursTime('wishListTimer') +
      '<br>&nbsp;&nbsp;warTimer: '+ getHoursTime('warTimer') +
      '<br>&nbsp;&nbsp;askEnergyPackTimer: '+ getHoursTime('askEnergyPackTimer') +
      //'<br>&nbsp;&nbsp;dailyCheckListTimer: '+ getHoursTime('dailyCheckListTimer') +
      '<br>&nbsp;&nbsp;autoAcceptMsgTimer: '+ getHoursTime('autoAcceptMsgTimer') +
      '<br>&nbsp;&nbsp;autoMissionTimer: '+ getHoursTime('autoMissionTimer') +
      '<br>&nbsp;&nbsp;changecitytimer: '+ getHoursTime('changecitytimer') +
      '<br>&nbsp;&nbsp;askFightBoostsTimer: '+ getHoursTime('askFightBoostsTimer');
  addToLog('info Icon', '<span style="color:#04B4AE;">Time left on PS MWAP Timers:'+timerText+'</span>');
  return;
}

function resetTimers(manually){
  // Reset the timers.
  // 3600 : if an hour has passed
  // 1800 : if half an hour has passed
  // 900  : if 15 minutes have passed
  // 300  : if 5 minutes have passed
  var checkTimer = function(timername, limit){ if(manually || timeLeftGM(timername) < limit) setGMTime(timername, 0); };

  checkTimer('miniPackTimer', 300);
  checkTimer('wishListTimer', 300);
  checkTimer('warTimer', 900);
  checkTimer('buildCarTimer', 900);
  checkTimer('askNewPartsTimer', 900);
  checkTimer('askCasinoPartsTimer', 900);
  checkTimer('askPlaySlotsTimer', 900);
  checkTimer('askVillagePartsTimer', 900);
  checkTimer('askFootballFansTimer', 900);
  checkTimer('askBrazilPartsTimer', 900);
  checkTimer('askChicagoPartsTimer', 900);

  for(ctCount=0;ctCount < ctLength;ctCount++) checkTimer(cityProperties[ctCount][ctPropTimer], 900);
  for(ctCount=0,cpLength=cityParts.length;ctCount < cpLength;ctCount++) checkTimer(cityParts[ctCount][ptTimer], 900);

  checkTimer('partsHour', 900);
  checkTimer('autoUpgradeNYTimer', 3600);
  checkTimer('takeHourNew York', 300);
  checkTimer('takeHourLas Vegas', 300);
  checkTimer('takeHourItaly', 300);
  checkTimer('takeHourBrazil', 300);
  checkTimer('takeHourChicago', 300);
  checkTimer('askEnergyPackTimer', 900);
  checkTimer('askEventPartsTimer', 900);
  checkTimer('askHomePartsTimer', 900);
  checkTimer('askRobSquadsTimer', 900);
  //checkTimer('dailyCheckListTimer', 900);
  checkTimer('autoAskHelponCCTimer', 3600);
  checkTimer('autoAskCityCrewTimer', 3600);
  checkTimer('autoAskChicagoCrewTimer', 3600);
  checkTimer('activateBrazilCrewTimer', 3600);
  checkTimer('activateChicagoCrewTimer', 3600);
  checkTimer('autoLottoTimer', 3600);
  checkTimer('AskforHelpBrazilTimer', 1800);
  checkTimer('AskforHelpChicagoTimer', 1800);
  checkTimer('AskforHelpVegasTimer', 1800);
  checkTimer('AskforHelpItalyTimer', 1800);
  //checkTimer('checkVaultTimer', 900);
  checkTimer('colmissionTimer', 600); // 10 min
  checkTimer('checkedmymissionTimer', 120); // 2 min
  checkTimer('autoAcceptMsgTimer',3600);
  checkTimer('automissiontimer',1800); // 30 min
  checkTimer('changecitytimer', 60); // 1 min
  checkTimer('askFightBoostsTimer', 3600);

  checkTimer('autoBattleTimer',300);
  checkTimer('autoSlotTimer',300);

  checkTimer('autoFreeGiftTimer',900);
  checkTimer('autoAskFreeGiftTimer',900);

  addToLog('warning Icon', 'All active timers have been reset.');
  if(manually){
    alert('All active timers have been reset.');
    // Restart the timers.
    Autoplay.delay = 150;
    Autoplay.start();
    autoReload(false, 'reset timers');
  }
  return;
}

// Perform click actions here
function doQuickClicks(){
  try {
    // Common clicking method
    var doClick = function (xpath){
      var elt = xpathFirst (xpath);
      if(elt){
        clickElement(elt);
        return true;
      }
      return false;
    };

    // click to open New Cities
    if(doClick('.//a[@class="sexy_button_new short white" and contains(@onclick,"travel") and contains(.,"Go to")]')) return;

    if(isGMChecked('autoGlobalPublishing')){
      // Click the level up bonus
      if(doClick('.//a[contains(@onclick,"postLevelUpFeedAndSend(); levelUpBoost();")]')) return;

      // Click the achievement bonus
      if(doClick('.//a[contains(.,"Share the wealth!")]')) return;

      // Click the reward button
      if(doClick('.//div//a[@class="sexy_button" and contains(text(),"Reward Friends")]')) return;
      if(doClick('.//div//a[@class="sexy_button_new short white sexy_call_new" and contains(text(),"Reward Friends")]')) return;

      // Click the 'Call for Help!' button
      if(doClick('.//div//a[@class="sexy_button_new short white sexy_call_new" and contains(.,"Ask Friends for Help!")]')) return;

      // Click the 'Rally More Help!' button
      if(doClick('.//div//a[@class="sexy_button_new short white sexy_call_new" and contains(text(),"Rally More Help")]')) return;

      // Operations Ask for Consumables
      if(doClick('.//div[@class="boss_operations"]//a[contains(@class,"boss_consumable_feed") and contains(.,"Ask")]')) return;

      // share from Collecting Parts
      if(doClick('.//div[@id="bm_ask_all_button"]//a[@id="collect_share_feed_btn" and contains(.,"Share")]')) return;
    }

    if(onNewHome()){

    // NewHome Ask for Parts
    if(isGMChecked('autoGlobalPublishing') && !timeLeftGM('askHomePartsTimer')){
      var partsContainerAsk = xpathFirst('.//a[contains(@class,"sexy_call_new") and contains(.,"Ask for parts")]', innerPageElt);
      if(!partsContainerAsk) partsContainerAsk = xpathFirst('.//a[contains(@class,"build_event_post_feed") and contains(.,"Ask for all parts") and not(contains(@style,"opacity: 0.5"))]', innerPageElt);
      if(partsContainerAsk){
        clickElement(partsContainerAsk);
        addToLog('info Icon','Clicked to ask your mafia to send you Parts.');
        setGMTime('askHomePartsTimer', '4 hours');
      } //else DEBUG('Asking for Parts - Container NOT Found');
    }

    if(isGMChecked('autoAskRobSquads') && !timeLeftGM('askRobSquadsTimer')){
      var robSquadAsk = xpathFirst('.//a[contains(@class,"build_event_post_feed_btn") and contains(@onclick,"showOneClickFeed") and contains(.,"Ask")]', innerPageElt);
      if(robSquadAsk){
        clickElement(robSquadAsk);
        addToLog('info Icon','Clicked to ask your mafia to send you Rob Squads.');
        setGMTime('askRobSquadsTimer', '4 hours');
      } //else DEBUG('Asking for Rob Squads - Container NOT Found');
    }

    // NewHome Ask for Event Parts
    if(isGMChecked('askEventParts') && !timeLeftGM('askEventPartsTimer')){
      var askEventPartsButton = xpathFirst('.//a[contains(@class,"sexy_call_new") and contains(.,"Ask") and contains(@onclick,"BuildEventModule")]', innerPageElt);
      if(askEventPartsButton){
        DEBUG('Asking for Event Parts - Ask button Found');
        clickElement(askEventPartsButton);
        addToLog('info Icon','Clicked to Ask your mafia for Event Parts.');
        setGMTime('askEventPartsTimer', '4 hours');
      } //else  DEBUG('Asking for Event Parts - Event Container NOT Found');
    }

    // NewHome Collect Properties Parts
    if(isGMChecked('collectParts') && !timeLeftGM('partsHour')){
      var askPartsButton = xpathFirst('.//a[@class="sexy_button_new short green" and contains(@onclick,"collectAllButton") and not(contains(@style,"none"))]', innerPageElt);
      if(askPartsButton){
        DEBUG('Collecting Parts from Properties');
        clickElement(askPartsButton);
        addToLog('info Icon','Clicked to Collect All Parts from Properties.');
        setGMTime('partsHour', '4 hours');
      } else {
        askPartsButton = xpathFirst('.//span[@id="bcm_timer_countdown"]', innerPageElt);
        if(askPartsButton){
          setGMTime('partsHour', askPartsButton.innerHTML);
          DEBUG('Collecting Parts from Properties - Resetting Timer: '+askPartsButton.innerHTML);
        }
      }
    }

    // NewHome Ask for Energy Packs
    if(isGMChecked('askEnergyPack') && !timeLeftGM('askEnergyPackTimer')){
      var EnergyContainer = xpathFirst('.//div[@class="module_subtitle" and contains(.,"ENERGY")]', innerPageElt);
      if(EnergyContainer){
        EnergyContainer = EnergyContainer.parentNode;
        var curNRGElt = xpathFirst('.//span[@id="cur_energy"]', EnergyContainer);
        var maxNRGElt = xpathFirst('.//span[contains(@style,"white")]', curNRGElt.parentNode);
        curNRG = parseInt(curNRGElt.innerHTML);
        maxNRG = parseInt(maxNRGElt.innerHTML);
        if(curNRG < maxNRG){
          var EnergyContainerAsk = xpathFirst('.//a[@class="empire_wait_ask_button sexy_button_new fl" and contains(.,"Ask")]', EnergyContainer);
          if(EnergyContainerAsk){
            clickElement(EnergyContainerAsk);
            addToLog('info Icon','Clicked to ask your mafia for Energy Packs.');
            setGMTime('askEnergyPackTimer', '4 hours');
          }
        } else {
          DEBUG('at Max for Energy Packs - not asking');
          if(!isGMChecked('askPowerPack')) setGMTime('askEnergyPackTimer', '4 hours');
        }
      }
    }

    // NewHome Ask for Power Packs
    if(isGMChecked('askPowerPack') && !timeLeftGM('askEnergyPackTimer')){
      var EnergyContainer = xpathFirst('.//div[@class="module_subtitle" and contains(.,"POWER")]', innerPageElt);
      if(EnergyContainer){
        EnergyContainer = EnergyContainer.parentNode;
        var curNRGElt = xpathFirst('.//span[@id="cur_power"]', EnergyContainer);
        var maxNRGElt = xpathFirst('.//span[contains(@style,"white")]', curNRGElt.parentNode);
        curNRG = parseInt(curNRGElt.innerHTML);
        maxNRG = parseInt(maxNRGElt.innerHTML);
        if(curNRG < maxNRG){
          var EnergyContainerAsk = xpathFirst('.//a[@class="empire_wait_ask_button sexy_button_new fl" and contains(.,"Ask")]', EnergyContainer);
          if(EnergyContainerAsk){
            clickElement(EnergyContainerAsk);
            addToLog('info Icon','Clicked to ask your mafia for Power Packs.');
            setGMTime('askEnergyPackTimer', '4 hours');
          }
        } else {
          DEBUG('at Max for Power Packs - not asking');
          setGMTime('askEnergyPackTimer', '4 hours');
        }
      }
    }

    }

    // Click hide action box elements
    var hideElts = xpath('.//a[contains(@onclick,"xw_action=dismiss_message")]', innerPageElt);
    for (var i = 0, iLength = hideElts.snapshotLength; i < iLength; ++i){
      if(hideElts.snapshotItem(i)) clickElement(hideElts.snapshotItem(i));
    }

    // Click mystery gift elements
    var mysteryElts = xpath('.//div[@class="msg_box_div_contents" and contains(.,"Mystery")]', innerPageElt);
    for (var i = 0, iLength = mysteryElts.snapshotLength; i < iLength; ++i){
      if(mysteryElts.snapshotItem(i) && !/display: none/.test(mysteryElts.snapshotItem(i).innerHTML)){
        var linkElt = getActionLink (mysteryElts.snapshotItem(i), 'Open It!');
        if(linkElt) clickElement(linkElt);
      }
    }
  } catch (ex){
    DEBUG('Error @doQuickClicks: '+ ex);
  }
}

////
// Parse certain messages appearing on the message window
function doParseMessages(){
  var msgs = $x('//td[@class="message_body"]');
  if(msgs && msgs.length > 0){
    for (var i = 0, iLength=msgs.length; i < iLength; ++i){
      // Log Minipack kick-off
      if(/Mini[\s\w]+Buff/i.test(msgs[i].innerHTML)){
        addToLog('yeah Icon', msgs[i].innerHTML);
        setGMTime('miniPackTimer', '8 hours');
        break;
      }
    }
  }
}

function preloadMWAPImages(){
  if(document.getElementById('PreLoadImages') || !document.body || !document.getElementById('verytop')) return;

  var preload_Images = makeElement('div', document.body, {'id':'PreLoadImages', 'style':'position: absolute; top: -9999px; left:-9999px;'});
  var preload_Images_Inner =
    //MWAP Settings Box Link Images
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r1_c1.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r1_c2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r1_c16.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c1.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c3.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c4.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c5.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c6.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c8.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c9.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c11.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c12.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c14.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c15.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c16.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r3_c1.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r3_c15.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r3_c16.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c1.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c4.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c7.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c10.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c13.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c16.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r6_c1.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r6_c2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r6_c16.png">' +
    //MWAP Settings Box Link Hover Images
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c2_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c3_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c4_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c5_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c6_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c8_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c9_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c11_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c12_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c14_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r2_c15_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r3_c15_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c2_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c7_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c10_f2.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'r5_c13_f2.png">' +
    //MWAP Log Box Link Images
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_10.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_11.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_05.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_06.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_07.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_08.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_08.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_09.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_12.png">' +
    //MWAP Log Box Link Hover Images
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_10-over.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_11-over.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_05-over.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_06-over.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_07-over.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_08-over.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_08-over.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_09-over.png">' +
    '<img src="'+SCRIPT.PSMWAP_imagePath+'logbox2_12-over.png">';
  preload_Images.innerHTML = preload_Images_Inner;
}

function customizeStatsRow(){
  // Show the experience to energy/stamina ratios needed to level up.
  if(!document.getElementById('level_up_ratio_stats')){
    elt = makeElement('div', statsrowElt, {'id':'level_up_ratio_stats', 'title':'Ratios needed to level up: combined, on energy only, on stamina only.'});
  }
  setLevelUpRatioStats();
}

function customizeMasthead(){
  function openMWAPMenu(){
   var mwapMenu = document.getElementById('mwapHelpMenu');
   if(mwapMenu) mwapMenu.style.display = 'block';
  }

  function closeMWAPMenu(){
   var mwapMenu = document.getElementById('mwapHelpMenu');
   if(mwapMenu) mwapMenu.style.display = 'none';
  }

  function toggleMWAPMenu(){
   var mwapMenu = document.getElementById('mwapHelpMenu');
   if(mwapMenu){
    if(mwapMenu.style.display == 'none') mwapMenu.style.display = 'block';
    if(mwapMenu.style.display == 'block') mwapMenu.style.display = 'none';
   }
  }

  var oDiv = document.getElementById('snapi_zbar');
  if(oDiv){
    oDiv.style.display = "none";
    if(oDiv.parentNode && oDiv.parentNode.parentNode) oDiv.parentNode.parentNode.removeChild(oDiv.parentNode);
  }

  oDiv = document.getElementById('mw_like_button');
  if(oDiv){
    oDiv.style.display = "none";
    if(oDiv.parentNode) oDiv.parentNode.removeChild(oDiv);
  }

  odiv = xpathFirst('.//iframe[@name="mafiawars_zbar"]');
  if(oDiv){
    oDiv.style.display = "none";
    if(oDiv.parentNode) oDiv.parentNode.removeChild(oDiv);
  }

  var oDivs = $x('.//div[contains(@id,"cpa") and contains(@id,"banner")]');
  for(i=0;i<oDivs.length;i++){
    oDiv = oDivs[i];
    if(oDiv){
      oDiv.style.display = "none";
      if(oDiv.parentNode) oDiv.parentNode.removeChild(oDiv);
    }
  }
  // Document title
  document.title = "Mafia Wars on Facebook";
  if(isGMChecked('fbwindowtitle')){
    if(GM_getValue('FBName')) document.title = GM_getValue('FBName');
  }

  if(document.getElementById('ap_menu')){
    updateMastheadMenu();
    return;
  }

  // Get the masthead.
  var mastheadElt;

  if(new_header) mastheadElt = xpathFirst('//div[@class="header_top_row"]');
  else mastheadElt = xpathFirst('.//div[contains(@id,"mw_masthead")]');

  // Links
  var linkElt = makeElement('div', mastheadElt,
    {'id':'ap_links', 'style':'position: absolute; top: 4px; right: 0px; text-align: left;font-size: 10px; font-weight: bold;'});
  makeElement('a', linkElt, {'href':'http://www.playerscripts.co.uk/mwap-script/mwap-ff-download.html','target':'_blank'})
    .appendChild(document.createTextNode('For Firefox'));
  linkElt.appendChild(document.createTextNode(' | '));
  makeElement('a', linkElt, {'href':'https://chrome.google.com/extensions/detail/cgagpckjofhomehafhognmangbjdiaap','target':'_blank'})
    .appendChild(document.createTextNode('For Chrome'));

  // Make a container for the autoplayer menu.
  var mwapTitle = 'PS MWAP RX6 '
  if(!GM_getValue('checkMWAPOK', 0)) mwapTitle += '<span style="color:#FF0000">LITE</span> ';
  mwapTitle += SCRIPT.version ;

  if(new_header) mwapTitle += ' (nH)' ; // mark new header style

  var mwapHeadTitle = makeElement('div', mastheadElt, {'style':'position: absolute; top: 20px; right: 10px; text-align: left; font-size: 10px; font-weight: bold; color: white'});
  mwapHeadTitle.innerHTML = mwapTitle;
  var mwapLikeElt = makeElement('div', mastheadElt, {'id':'mwapLikeElt','style':'position: absolute; top: 20px; right: 500px;z-index:5000;'});
  mwapLikeElt.innerHTML = '<iframe src="http://playerscripts.co.uk/ps-adbanner/ps-adbanner.html" scrolling="no" frameborder="0" style="margin:0px;padding:0px; border:none; overflow:hidden; width:0px; height:0px;" allowTransparency:"true"></iframe>';
  mwapLikeElt.innerHTML += '<iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FPS-Mafia-Wars-Autoplayer%2F160393374005267&amp;layout=button_count&amp;show_faces=true&amp;width=80&amp;action=like&amp;font=arial&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:80px; height:21px;" allowTransparency="true"></iframe>';
  mastheadElt.insertBefore(mwapLikeElt, mastheadElt.firstChild);
  var menuElt = makeElement('div', mastheadElt, {'id':'ap_menu', 'style':'position: absolute; top: 38px; font-size: 10px; right: 0px; text-align: left;'});

  var mwapHelpElt = makeElement('div', null, {'id':'mwapHelpElt', 'style':'position: absolute; top: 18px; right:170px; width: 110px; z-index: 1;'});
  var mwapHelpContainer = makeElement('div', mwapHelpElt, {'id':'help_container', 'style':'width: 110px;'});
  var mwapHelpLink = makeElement('a', mwapHelpContainer, {'class':'sexy_button_new short black_white_border','style':'width: 110px; outline-color: -moz-use-text-color; outline-style: none; outline-width: medium;'});
  var mwapHelpSpan1 = makeElement('span', mwapHelpLink);
  var mwapHelpSpan2 = makeElement('span', mwapHelpSpan1, {'style':'background: transparent url(http://mwfb.static.zynga.com/mwfb/graphics/dropdown_travel_arrow.gif) no-repeat scroll 75px 50%; text-align: left; -moz-background-clip: border; -moz-background-origin: padding; -moz-background-inline-policy: continuous;'});
  mwapHelpSpan2.appendChild(document.createTextNode(' PS MWAP '));
  var mwapHelpDiv = makeElement('div', mwapHelpContainer, {'style':'z-index: 20; display: none;margin-top:-2px;width:150px;','id':'mwapHelpMenu'});

  mwapHelpDiv.innerHTML +=
    '<div><b>Downloads</b></div> ' +
    '<a href="http://www.playerscripts.co.uk/mwap-script/mwap-ff-download.html" target="_blank"> ' +
    'For Firefox' +
    '</a> ' +
    '<a href="https://chrome.google.com/extensions/detail/cgagpckjofhomehafhognmangbjdiaap" target="_blank"> ' +
    'For Chrome' +
    '</a> ' +
    '<a href="http://www.playerscripts.co.uk/mwap-script/google-repository.html" target="_blank"> ' +
    'Revert to Previous' +
    '</a> ' +
    '<div><b>Websites</b></div> ' +
    '<a href="http://www.playerscripts.co.uk/" target="_blank"  title="Playerscripts Home> ' +
    'PlayerScripts' +
    '</a>' +
    '<a href="http://playerscripts.co.uk/pswiki/" target="_blank" title="PlayerScripts Wiki"> ' +
    'PlayerScripts Wiki' +
    '</a>' +
    '<div><b>PS Scripts</b></div> ' +
    '<a id="mwapChuckerLink" href="#">'+'PS Chucker '+'</a>'+
  '<a id="PSanalyserLink" href="#">'+'PS Analyser'+'</a>'+
    '<a style="border-bottom:1px solid #FFF" href="http://playerscripts.co.uk/pswiki/index.php?title=PS_WS_About" target="_blank" title="PS WS : Wall Scrubber"> ' +
    'PS Wall Scrubber' +
    '</a>' +
    '<a style="border-bottom:1px solid #FFF" href="http://www.playerscripts.co.uk/ps-mwe.html" target="_blank" title="PS MWE : Mafia Wars Enhanced"> ' +
    'PS MWE' +
    '</a>';

  mastheadElt.insertBefore(mwapHelpElt, mastheadElt.firstChild);

  function addChucker(){
    var newScript = 'http://simony.dk/gs/Chucker.js';
    var extElt = makeElement('script', document.getElementsByTagName('head')[0], {'id':'chuckerLink', 'type':'text/javascript'});
    extElt.src = newScript;
    extElt.id = 'chuckerLink';
  }
  // make chuckerLink clickable
  var chuckElt = document.getElementById('mwapChuckerLink');
  chuckElt.addEventListener('click', addChucker, false);

   function addPSAnalyser(){
    var newScript2 = 'http://www.playerscripts.co.uk/psbm/analyser/ps-inneed2.js';
    var extElt2 = makeElement('script', document.getElementsByTagName('head')[0], {'id':'analyserLink', 'type':'text/javascript'});
    extElt2.src = newScript2;
    extElt2.id = 'analyserLink';
  }
     // make PS Analyser clickable
  var analyserElt = document.getElementById('PSanalyserLink');
  analyserElt.addEventListener('click', addPSAnalyser, false);

  mastheadElt.insertBefore(mwapHelpElt, mastheadElt.firstChild);
  mwapHelpElt.addEventListener('click', toggleMWAPMenu, false);
  mwapHelpElt.addEventListener('mouseover', openMWAPMenu, false);
  mwapHelpElt.addEventListener('mouseout', closeMWAPMenu, false);

  // Grab Toolbar info (PS MWAP menu)
  var lobjcheckPack = makeElement('a', null, {'id':'checkPack'});
  lobjcheckPack.innerHTML = '<span id="checkPack">Grab Toolbar info</span>';
  lobjcheckPack.addEventListener('click', grabToolbarInfo, false);
  mwapHelpDiv.insertBefore(lobjcheckPack, mwapHelpDiv.firstChild);

  // Reset Timers (PS MWAP menu)
  var lobjresetTimers = makeElement('a', null, {'id':'resetTimers'});
  lobjresetTimers.innerHTML = '<span id="resetTimers">Reset Timers</span>';
  lobjresetTimers.addEventListener('click', resetTimers, false);
  mwapHelpDiv.insertBefore(lobjresetTimers, mwapHelpDiv.firstChild);

  // Show Timers (PS MWAP menu)
  var lobjshowTimers = makeElement('a', null, {'id':'showTimers'});
  lobjshowTimers.innerHTML = '<span id="showTimers">Show Timers</span>';
  lobjshowTimers.addEventListener('click', showTimers, false);
  mwapHelpDiv.insertBefore(lobjshowTimers, mwapHelpDiv.firstChild);

  // Settings Link (PS MWAP menu)
  var lobjAutoPlay = makeElement('a', null, {'id':'autoPlay'});
  lobjAutoPlay.innerHTML = '<span id="autoPlayspan">Settings</span>';
  lobjAutoPlay.addEventListener('click', toggleSettings, false);
  mwapHelpDiv.insertBefore(lobjAutoPlay, mwapHelpDiv.firstChild);

  // Settings Link main page
  menuElt.appendChild(document.createTextNode(' | '));
  var lobjAutoPlay = makeElement('span', menuElt);
  lobjAutoPlay.appendChild(document.createTextNode('Settings'));
  lobjAutoPlay.addEventListener('click', toggleSettings, false);

  // View log button.
  menuElt.appendChild(document.createTextNode(' | '));
  var lobjViewLogButton = makeElement('span', menuElt);
  lobjViewLogButton.appendChild(document.createTextNode('Log'));
  lobjViewLogButton.addEventListener('click', showMafiaLogBox, false);

  // Show resume or paused based on if we are running or not.
  updateMastheadMenu();
}

function customizeStats(){
  // Don't watch the stats area while we're making changes to it.
  setListenStats(false);

  // Make bank icon clickable for instant banking
  var bankLinkElt = xpathFirst('.//div[@id="game_stats"]//div[@id="cash_stats_'+cities[city][CITY_ALIAS]+'"]/h4/a[@id="mwap_bank"]', statsrowElt);
  var bankElt = xpathFirst('.//div[@id="game_stats"]//div[@id="cash_stats_'+cities[city][CITY_ALIAS]+'"]/h4/text()', statsrowElt);
  if(bankElt && !bankLinkElt){
    bankLinkElt = makeElement('a', null, {'id': 'mwap_bank', 'title': 'Click to bank immediately.'});
    bankElt.parentNode.insertBefore(bankLinkElt, bankElt);
    bankLinkElt.appendChild(bankElt);
    bankLinkElt.addEventListener('click', quickBank, false);
  }

  // Make energy icon & text clickable for mini pack.
  var nrgLinkElt = document.getElementById('mwap_nrg');
  var nrgElt = xpathFirst('./div[@class="mw_header"]//div[@class="mid_row_text energy_text_bg" and contains(text(), "ENERGY")]', statsrowElt);
  if(!nrgElt)  nrgElt = xpathFirst('.//div[@id="game_stats"]//h4[@class="energy" and contains(text(), "Energy")]', statsrowElt);
  if(!nrgElt)  nrgElt = xpathFirst('.//div[@id="game_stats"]//span[@class="stat_title" and contains(text(),"Energy")]', statsrowElt);
  if(nrgElt && !nrgLinkElt){
    if(isGMChecked('autoMission')){
       var nrgTitle = 'Spend Energy ON.  ';
        nrgElt.style.color="#33FF00"; // green
      } else {
//        if(below_energy_floor_needs_Identifying){
//          var nrgTitle = 'Spend Energy ON, below spend floor.  ';
//          nrgElt.style.color="#FFCC00"; // orange/yellow
//        } else {
        var nrgTitle = 'Spend Energy OFF.  ';
        nrgElt.style.color="#FF0000"; // red
      }
    //nrgTitle += '  NO LONGER FIRES ENERGY PACK.  ';
    selectedTierValue = GM_getValue('selectTier','0.0').split('.');
    masteryCity = parseInt(selectedTierValue[0]);
    masteryTier = parseInt(selectedTierValue[1]);
    if( (masteryCity == 0) && ( (masteryTier == 0 ) || ( masteryTier == undefined ) ) ){ nrgTitle += ' Mastering- Turned OFF ' ; }
    else { nrgTitle += ' Mastering-'+ cities[masteryCity][CITY_NAME] +', District/Region-'+ masteryTier+' '+  missionTabs[masteryCity][masteryTier - 1] ; }

    nrgElt.style.textDecoration="underline";
    nrgLinkElt = makeElement('a', null, {'id':'mwap_nrg', 'title':nrgTitle});
    nrgElt.parentNode.insertBefore(nrgLinkElt, nrgElt);
    nrgLinkElt.appendChild(nrgElt);

    nrgLinkElt.addEventListener('click', toggleNrgSpend, false);

    var mepakLink = document.getElementById('mwap_epack');
    if(!mepakLink){
      var timeLeftPack = getHoursTime('miniPackTimer');
      if(timeLeftPack == 0 || timeLeftPack == undefined) var miniPackTitle = 'Mini-Pack available now. ';
      else var miniPackTitle = timeLeftPack+' until Mini-Pack is available. ';
      miniPackTitle += ' Click to attempt to fire immediately.';
      if(isGMChecked('mastheadOnTop')) var ttop =  '0px' ;
      else var ttop = '60px' ;
      mepakLink = makeElement('a', null, {'id':'mwap_Fire_epak', 'title':miniPackTitle, 'style':'position:absolute; top:'+ttop+'; right:384px;'}  );
      if(timeLeftPack == 0 || timeLeftPack == undefined){
        var m_epak_icon = mini_Epak_ready ;
        mepakLink.innerHTML=mini_Epak_ready;
        var mepk = ('EP') ;
      } else {
        var m_epak_icon = mini_Epak_wait  ;
        mepakLink.innerHTML=mini_Epak_wait;
        var mepk = ('na') ;
      }
      mepakParent = nrgLinkElt.parentNode;
      mepakParent.insertBefore(mepakLink, mepakParent.childNodes[2]);
      mepakLink.appendChild(document.createTextNode(mepk));
      mepakLink.addEventListener('click', miniPackForce, false);
    }
  }

  // Make stamina text & icon pointable for showing.
  var stamLinkElt = document.getElementById('mwap_stam');
  var stamElt = xpathFirst('./div[@class="mw_header"]//div[@class="mid_row_text stamina_text_bg" and contains(text(), "STAMINA")]', statsrowElt);
  if(!stamElt)
    stamElt = xpathFirst('.//div[@id="game_stats"]//h4[contains(text(), "Stamina")]', statsrowElt);
  if(!stamElt)
    stamElt = xpathFirst('.//div[@id="game_stats"]//span[@class="stat_title" and contains(text(),"Stamina")]', statsrowElt);
  if(stamElt && !stamLinkElt){
    if(isGMChecked('staminaSpend')){
      var stamTitle = 'Spend Stamina ON.  ';
      stamElt.style.color="#33FF00";     // green
    } else {
      var stamTitle = 'Spend Stamina OFF.  ';
      stamElt.style.color="#FF0000";     // red
    }
    stamTitle += 'Minimum Stamina for auto-healing set at '+ GM_getValue('stamina_min_heal')+' points.';
    var smode = GM_getValue('staminaSpendHow') ;
    stamTitle += ' Stamina Spend Mode: '+  staminaSpendChoices[smode]  ;

    stamElt.style.textDecoration="underline";
    stamLinkElt = makeElement('a', null, {'id':'mwap_stam', 'title':stamTitle});
    stamElt.parentNode.insertBefore(stamLinkElt, stamElt);
    stamLinkElt.appendChild(stamElt);
    stamLinkElt.addEventListener('click', toggleStamSpend, false);
  }

  // Make health icon&text clickable for instant healing.
  var hospitalElt = xpathFirst('.//div[@id="game_stats"]//a[@class="heal_link" or @class="heal_link vt-p"]', statsrowElt);
  var healLinkElt = document.getElementById('mwap_heal');
  var healElt = xpathFirst('./div[@class="mw_header"]//div[@class="mid_row_text health_text_bg" and contains(text(), "HEALTH")]', statsrowElt);
  if(!healElt) healElt = xpathFirst('.//div[@id="game_stats"]//h4[@class="health" and contains(text(), "Health")]', statsrowElt);
  if(!healElt) healElt = xpathFirst('.//div[@id="game_stats"]//span[@class="stat_title" and contains(text(),"Health")]', statsrowElt);
  if(healElt){
    if(!healLinkElt){
      healElt.style.color="#FF0000";
      healElt.style.textDecoration="underline";
      healElt.style.display="inline-block";
      healLinkElt = makeElement('a', null, {'id':'mwap_heal', 'title':'Click to heal immediately.'});
      healElt.parentNode.insertBefore(healLinkElt, healElt);
      healLinkElt.appendChild(healElt);
      healLinkElt.style.textDecoration="none";

      var newLink = document.getElementById('mwap_toggleheal');
      if(!newLink){
        if(!isGMChecked('autoHeal')){ newLinkTitle='autoHeal unchecked'; }
        else {
          if(GM_getValue('staminaSpendHow') == STAMINA_HOW_FIGHTROB) newLinkTitle='autoHeal checked BUT OVERRULED - healing in '+ locations[GM_getValue('healLocation')] +' when health falls below '+GM_getValue('healthLevel')+'.';
          else newLinkTitle='autoHeal checked - healing in '+ locations[GM_getValue('healLocation')] +' when health falls below '+GM_getValue('healthLevel')+'.';
        }

        newLink = makeElement('a', null, {'id':'mwap_toggleheal', 'title':newLinkTitle});

        if(!isGMChecked('autoHeal')){ newLink.innerHTML=healOffIcon; }
        else {
          if(GM_getValue('staminaSpendHow') == STAMINA_HOW_FIGHTROB) newLink.innerHTML=healOnHoldIcon;
          else newLink.innerHTML=healOnIcon;
        }
        newLink.style.padding="5px 0px 0px 8px";
        newLink.style.position="absolute";
        healParent = healLinkElt.parentNode;
        healParent.insertBefore(newLink, healParent.childNodes[2]);
        newLink.addEventListener('click', toggleHeal, false);
      }
    }

    // Substitute the "hide" icon if currently hiding in the hospital.
    var hidingInHospital = /transparent url/i.test(healElt.getAttribute('style'));
    if(health < 20 && isGMChecked('hideInHospital')){
      if(!hidingInHospital){
        healElt.style.background = 'transparent url('+ stripURI(hideIcon)+') no-repeat scroll 0 50%';
        healElt.title = 'Currently hiding in the hospital. Click to heal immediately.';
      }
    } else if(hidingInHospital){
      healElt.style.background = '';
      healElt.title = 'Click to heal immediately.';
    }
    // Make instant heal work without switching pages.
    if(hospitalElt) healLinkElt.addEventListener('click', heal, false);
  }

  // Blink maxed out energy or stamina.
  energyElt.style.textDecoration = (energy == maxEnergy)? 'blink' : 'none';
  staminaElt.style.textDecoration = (stamina == maxStamina)? 'blink' : 'none';

  // Blink dangerous health levels.
  healthElt.style.textDecoration = (health > 19 && health < 29) ? 'blink' : 'none';

  // Once health is below 20, set the timer (this is for the conditional healing logic)
  if(isGMChecked('forceHealOpt5') && health < 20 && GM_getValue('healWaitStarted') != true){
    setGMTime('healWaitTime', '05:00');
    GM_setValue('healWaitStarted', true);
  }

  setListenStats(true);
}

function toggleHeal(){
  if(!document.getElementById('mwap_toggleheal')) return;
  if(isGMChecked('autoHeal')){
    GM_setValue('autoHeal', 0);
    document.getElementById('mwap_toggleheal').innerHTML=healOffIcon;
    document.getElementById('mwap_toggleheal').title = 'autoHeal unchecked';
    addToLog('healOffIcon Icon', 'autoHeal turned OFF by User');
  } else {
    GM_setValue('autoHeal', 'checked');
    if(GM_getValue('staminaSpendHow') == STAMINA_HOW_FIGHTROB){
      document.getElementById('mwap_toggleheal').innerHTML=healOnHoldIcon;
      document.getElementById('mwap_toggleheal').title = 'autoHeal checked BUT OVERRULED - healing in '+ locations[GM_getValue('healLocation')] +' when health falls below '+GM_getValue('healthLevel')+'.';
      addToLog('healOnHoldIcon Icon', 'autoHeal turned ON by User, but overruled');
    } else {
      document.getElementById('mwap_toggleheal').innerHTML=healOnIcon;
      document.getElementById('mwap_toggleheal').title = 'autoHeal checked - healing in '+ locations[GM_getValue('healLocation')] +' when health falls below '+GM_getValue('healthLevel')+'.';
      addToLog('healOnIcon Icon', 'autoHeal turned ON by User');
    }
  }
}

function toggleNrgSpend(){
  if(isGMChecked('autoMission')){
    GM_setValue('autoMission', 0);
    addToLog('info Icon', 'Energy Spend turned OFF by User');
  } else {
    GM_setValue('autoMission', 'checked');
    addToLog('info Icon', 'Energy turned ON by User');
  }
  update_nrg_stam();
}

function toggleStamSpend(){
  if(isGMChecked('staminaSpend')){
    GM_setValue('staminaSpend', 0);
    addToLog('info Icon', 'staminaSpend turned OFF by User');
  } else {
    GM_setValue('staminaSpend', 'checked');
    addToLog('info Icon', 'staminaSpend turned ON by User');
  }
  update_nrg_stam();
}

function quickBank(bankCity, amount){
  //var byUser = false;
  // Handle user-click action
  if(isNaN(amount)){
    if(isNaN(bankCity)){
      bankCity = city;
    //  byUser = true;
    }
    cashElt = document.getElementById('user_cash_'+ cities[bankCity][CITY_ALIAS]);
    if(cashElt){ amount = parseCash(cashElt.innerHTML); }
    else { amount = cities[bankCity][CITY_CASH]; }
  }

  // Check vault status & get the URL
  if(bankCity == LV){
    if(GM_getValue('vaultHandling', 0)){
      var vaultSpace = parseInt(GM_getValue('vaultSpace','0'));
      colorDEBUG('VaultStatus: '+ GM_getValue('vaultHandling', 0)+' - '+vaultSpace);
      if(vaultSpace <= 0 && !timeLeftGM('checkVaultTimer')){
        addToLog('info Icon', 'Your vault appears to be full, rechecking...');
        setGMTime('checkVaultTimer','1 hour');
        checkPropertyStatus(LV);
        return false;
      }
      amount = (amount > vaultSpace) ? vaultSpace : amount;
    }
    var depositUrl = "xw_controller=propertyV2&xw_action=doaction&xw_city=5&doaction=ActionBankDeposit&building_type=6&city=5&amount=" + amount;
  } else {
    var depositUrl = "xw_controller=bank&xw_action=deposit_all&xw_city=" + (bankCity + 1);
  }

  // If cash being deposited is greater than 100 billion, do NOT quick-bank!
  if(amount > 100000000000){
    addToLog('updateBad Icon', 'Depositing <strong class="good">'+ cities[bankCity][CITY_CASH_SYMBOL] + makeCommaValue(amount) +
             '</strong>!?!<strong class="bad"> HELL NO!</strong> Sink it from the banking page.');
    quickBankFail = true;
    return false;
  }

  // Do not quick-bank if city has changed
  if(city != bankCity){
    DEBUG('Switching city too fast, not quick-banking.');
    return false;
  }

  var ajaxID = createAjaxPage(false, 'quick deposit', bankCity);
  var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","remote/html_server.php?'+ depositUrl+'", 1, 1, 0, 0); return false;'});
  clickElement(elt);
  DEBUG('Clicked to quickbank.');
  return false;
}

function customizeHome(){
  var oDiv = document.getElementById('snapi_zbar');
  if(oDiv) oDiv.parentNode.parentNode.removeChild(oDiv.parentNode);
  oDiv = document.getElementById('mw_like_button');
  if(oDiv) oDiv.style.display = "none";
  odiv = xpathFirst('.//iframe[@name="mafiawars_zbar"]');
  if(oDiv){
    oDiv.style.display = "none";
    if(oDiv.parentNode) oDiv.parentNode.removeChild(oDiv);
  }
  var oDivs = $x('.//div[contains(@id,"cpa") and contains(@id,"banner")]');
  for(i=0;i<oDivs.length;i++){
    oDiv = oDivs[i];
    if(oDiv){
      oDiv.style.display = "none";
      if(oDiv.parentNode) oDiv.parentNode.removeChild(oDiv);
    }
  }
  if(!onHome() || ! onNewHome()) return false;;

  // New Style Home page
  if(onNewHome()){

    var dtElt = xpathFirst('.//div[@id="social_module_daily_take_div"]//a',innerPageElt);
    if(dtElt){
      var dtDays = GM_getValue('dtDays',0);
      var dtDate = GM_getValue('dtDate','');
      var dtTxt = 'Daily Take (Last claim date unknown)';
      if(dtDays!=0 && dtDate!=''){ dtTxt = 'Daily Take (Last claimed on '+dtDate+' for '+dtDays+' days)'; }
      dtElt.innerHTML = dtTxt;
    }

    if(!running){
    // Only customize the homepage when MWAP is paused ...
      var mainModule = xpathFirst('.//div[@id="MainModule"]',innerPageElt);
      if(mainModule) mainModule.style.height="";

      // Getting usefull info from the marketplace
      var empireModule = xpathFirst('.//div[@class="empire_main_module"]', innerPageElt);
      var ajaxID = createAjaxPage(false, 'marketplace', empireModule);
      var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+ SCRIPT.controller+'marketplace'+ SCRIPT.action+'marketplace_category&category=8", 1, 1, 0, 0); return false;'});
      clickElement(elt);
      return true;
    }
  // Old Style Home page
  } else if(onHome()){
    // Is an energy pack waiting to be used?
    energyPackElt = xpathFirst('.//a[contains(@onclick, "xw_action=use_and_energy_all")]', innerPageElt);
    energyPackElt = energyPackElt ? energyPackElt : xpathFirst('.//a[contains(@onclick, "xw_action=use_energy_pak")]', innerPageElt);
    energyPack = energyPackElt? true : false;

    // Display a message next to the energy pack button.
    if(energyPackElt && energyPackElt.scrollWidth){
      var energyGainRate = getEnergyGainRate();
      var ptsFromEnergyPack = maxEnergy * 1.25 * energyGainRate;

      var ptsNeeded = ptsToNextLevel - energy * energyGainRate - stamina * getStaminaGainRate();
      var txt = 'XP from Energy Pack = '+ parseInt(ptsFromEnergyPack)+'<br>Projected XP needed = '+ parseInt(ptsNeeded);
      var packParentElt = document.getElementById('clock_energy_pack');
      if(packParentElt){
        var descElt = makeElement('div', null, {'style':'float:left; padding: 2px 10px 0px 0px; font-size: 10px;'});
        descElt.innerHTML = txt;
        packParentElt.insertBefore(descElt, packParentElt.firstChild);
      }
    } else { energyPack = false; }
    return true;
  }
}

function getPlayerStats(){
  var statTable = xpathFirst('.//table[contains(.,"Attack:") and contains(.,"Defense:")]', innerPageElt);

  // Fetch defense and attack values from profile
  if(statTable){
    DEBUG('Fetching stats from profile page');

    // Attack
    var curAttackRow  = xpathFirst('.//tr[contains(.,"Attack:")]', statTable);
    if(curAttackRow && curAttackRow.innerHTML.match(/>\s*(\d+)/)){
      curAttack = parseInt(RegExp.$1);
      GM_setValue('curAttack', curAttack);
    }

    // Defense
    var curDefenseRow  = xpathFirst('.//tr[contains(.,"Defense:")]', statTable);
    if(curDefenseRow && curDefenseRow.innerHTML.match(/>\s*(\d+)/)){
      curDefense = parseInt(RegExp.$1);
      GM_setValue('curDefense', curDefense);
    }

    if(isUndefined(curAttack) || isUndefined(curDefense)){
      addToLog('info icon', 'Current status attributes cannot be detected, turning off auto-stat.');
      GM_setValue('autoStat', 0);
    }
  }
}

function getPlayerEquip(){
  if(!onFightTab() && !onInventoryTab() && !onLootTab()) return;
  var eltStrength = xpathFirst('.//div[@id="mafia_attack_strength"]', innerPageElt);
  if(eltStrength){
    prevAttackEquip = curAttackEquip;
    if(eltStrength.innerHTML.untag().match(/(.+)\(/)) curAttackEquip = parseInt(RegExp.$1.replace(/\D/g,''));
    var famBonusElt = xpathFirst('.//span[@title="Family Property Bonus"]', eltStrength);
    if(famBonusElt) curAttackEquip+= parseInt(famBonusElt.innerHTML.replace(/\D/g,''));
    GM_setValue('curAttackEquip', curAttackEquip);
  }

  eltStrength = xpathFirst('.//div[@id="mafia_defense_strength"]', innerPageElt);
  if(eltStrength){
    prevDefenseEquip = curDefenseEquip;
    if(eltStrength.innerHTML.untag().match(/(.+)\(/)) curDefenseEquip = parseInt(RegExp.$1.replace(/\D/g,''));
    var famBonusElt = xpathFirst('.//span[@title="Family Property Bonus"]', eltStrength);
    if(famBonusElt) curDefenseEquip+=parseInt(famBonusElt.innerHTML.replace(/\D/g,''));
    GM_setValue('curDefenseEquip', curDefenseEquip);
  }
  if(isUndefined(curAttackEquip) || isUndefined(curDefenseEquip)) DEBUG('Current equipment attributes cannot be detected.');
}

function customizeProfile(){
  // Make sure we're on a profile.
  var statsTable = xpathFirst('.//td[@class="stats_left"]', innerPageElt);
  if(!statsTable) return false;

  // Fetch Player Stats
  getPlayerStats();

  // FIXME: Need to rewrite buildAnchor, need to make it more flexible
  this.buildAnchor = function (Options){
    //Options.URLSegment = common portions if URL
    //Options.href = allow for full control of href
    //Options.clickEvent = function
    //Options.title = flyout text
    //Options.AnchorText = text inside Anchor
    var buildAnchorOptions = {};
    if(Options.URLSegment){ buildAnchorOptions.href='http://mwfb.zynga.com/mwfb/remote/html_server.php?'+Options.URLSegment; }
    else if(Options.href){ buildAnchorOptions.href = Options.href; }
    else { buildAnchorOptions.href='#'; }

    if(!Options.clickEvent && Options.URLSegment){
      buildAnchorOptions.onclick ='return do_ajax(\'inner_page\', \'/remote/html_server.php?'+Options.URLSegment+'\', 1, 1, 0, 0); return false; ';
    }
    if(Options.id){ buildAnchorOptions.id=Options.id; }

    var anchorElt = makeElement('a', statsDiv, buildAnchorOptions);
    if(Options.AnchorText){ anchorElt.appendChild(document.createTextNode(Options.AnchorText)); }
    if(Options.clickEvent){ anchorElt.addEventListener('click', Options.clickEvent, false); }
    return anchorElt;
  };

  var statsDiv = xpathFirst('.//a[contains(., "Sucker Punch")]/..', innerPageElt);
  if(statsDiv){
    // On another player's profile page. Add extra options.
    var tabElt = xpathFirst('.//li[contains(@class, "tab_on")]//a[contains(text(), "Profile")]', innerPageElt);
    if(tabElt){
      var remoteuserid;
      var remotefbid;
      var tmpKey;
      var cbKey;
      if(tabElt.getAttribute('onclick').match(/tmp=([\d,a-z]+)&cb=([\d,a-z]+)&user=p\|(\d+)/)){
        tmpKey = 'tmp='+RegExp.$1+'&';
        cbKey = 'cb='+RegExp.$2+'&';
        remoteuserid = 'p|'+RegExp.$3;
      }
      if(!remoteuserid && tabElt.getAttribute('onclick').match(/user=p\|(\d+)/)) remoteuserid = 'p|'+RegExp.$1;

      // This code is to grab the facebook id for this profile
      if(m = /xw_controller=robbing.*?target=([0-9]+)/.exec(document.getElementById('inner_page').innerHTML)){ remotefbid = m[1];	}
      if(m = /xw_controller=stats.*?user=([0-9]+)/.exec(document.getElementById('inner_page').innerHTML)){ remotefbid = m[1];	}
      if(m = /xw_action=gift_wishlist.*?user=([0-9]+)/.exec(document.getElementById('inner_page').innerHTML)){ remotefbid = m[1];	}
      if(m = /q([0-9]+)_(\d+)\.jpg/.exec(document.getElementById('inner_page').innerHTML)){	remotefbid = m[1]; }
      if(document.getElementsByClassName('fightres_image').length > 1){	var fight_image = /(\d+)_(\d+)_q.jpg/.exec(document.getElementsByClassName('fightres_image')[1].innerHTML);	remotefbid = fight_image[1];	}
      if(m = /xw_controller=VegasSlots.+?friend_id=([0-9]+)/i.exec(document.getElementById('inner_page').innerHTML)){	remotefbid = m[1]; }
      if(m = /([0-9]+)_(\d+)\_q.jpg/.exec(document.getElementById('inner_page').innerHTML)){ remotefbid = m[1];	}
      if((m=/user%2522.*?%2522([0-9A-Za-z%]+)%2522/.exec(document.getElementById('mainDiv').innerHTML)) || (m=/user%22.*?%22([0-9A-Za-z%]+)%22/.exec(document.getElementById('mainDiv').innerHTML))){
        remotefbid = atob(m[1].replace(/%253D/g,'=').replace(/%3D/g,'='));
      }

      if(!tmpKey && tabElt.getAttribute('onclick').match(/tmp=([\d,a-z]+)&/)){ tmpKey = 'tmp='+RegExp.$1+'&'; }
      if(!cbKey && tabElt.getAttribute('onclick').match(/cb=([\d,a-z]+)&/)){ cbKey = 'cb='+RegExp.$2+'&'; }

      DEBUG('Profile: Mafia Wars ID: '+ remoteuserid+' Facebook ID: '+ remotefbid);
      var userid = remoteuserid.replace('p|','');

      // See if this player is in our mafia.
      var removeElt = xpathFirst('.//a[contains(., "Remove from Mafia")]', statsDiv);

      // Show if Alive/Dead
      if(!running && !removeElt){
        var titleElt = xpathFirst('./div[@class="title stats_title"]', innerPageElt);
        if(titleElt){ titleElt.setAttribute('style', 'background: black;'); }
        var ajaxID = createAjaxPage(false, 'icecheck profile', titleElt);
        var elt = xpathFirst('.//a[contains(., "Add to Hitlist")]', innerPageElt);
        var iceCheckElt = makeElement('a', null,null);
        var newClick = elt.getAttribute('onclick');
        newClick  = newClick.replace('inner_page',ajaxID);
        iceCheckElt.setAttribute('onclick', newClick);
        clickElement(iceCheckElt);
      }
      // Don't continue if buttons already there
      if(document.getElementById('where_are_my_links')) return true;

      var rDisplay = false;

      // Explain the buttons
      makeElement('a', statsDiv, {'id':'where_are_my_links', 'href':'javascript:alert("Due to the way Mafia Wars links to Facebook there are times where PS MWAP cannot find the Facebook profile ID. In those situations PS MWAP will not display buttons that require that ID. You can make the Facebook ID available by refreshing the profile page.");'}).appendChild(document.createTextNode('Where are my links?'));

      // This is a refresh page button
      statsDiv.appendChild(document.createTextNode(' | '));
      makeElement('a', statsDiv, {'href':'http://facebook.mafiawars.com/mwfb/remote/html_server.php?xw_controller=stats&xw_action=view&xw_city=1&user='+ remoteuserid}).appendChild(document.createTextNode('Refresh this profile!'));
      rDisplay = true;

      if(remotefbid){
        // Facebook profile
        if(rDisplay) statsDiv.appendChild(document.createTextNode(' | '));
        makeElement('a', statsDiv, {'href':'http://www.facebook.com/profile.php?id='+ remotefbid,'target':'_blank'}).appendChild(document.createTextNode('Facebook Profile'));
        statsDiv.appendChild(document.createTextNode(' | '));

        // Add as Facebook friend
        makeElement('a', statsDiv, {'href':'http://www.facebook.com/addfriend.php?id='+ remotefbid,'target':'_blank'}).appendChild(document.createTextNode('Add as Friend'));
        rDisplay = true;
      }

      if(removeElt){ // Promote
        if(rDisplay) statsDiv.appendChild(document.createTextNode(' | '));
        //href Example:http://mwfb.zynga.com/mwfb/remote/html_server.php?xw_controller=group&xw_action=view&xw_city=4&tmp=9c2d83eaf30b28fa29319feb437e4f7e&cb=18309240931265744553&promote=yes&uid=48608018
        //OnClick Example: return do_ajax('inner_page', 'remote/html_server.php?xw_controller=group&xw_action=view&xw_city=4&tmp=9c2d83eaf30b28fa29319feb437e4f7e&cb=18309240931265744553&promote=yes&uid=48608018', 1, 1, 0, 0); return false;
        this.buildAnchor( { 'AnchorText':'Promote',
                            'URLSegment': 'xw_controller=group&'+'xw_action=view&'+'xw_city='+ (city + 1)+'&'+tmpKey+cbKey+'promote=yes&'+'pid='+ remoteuserid});
        rDisplay = true;
      }
      if(rDisplay) makeElement('br', statsDiv,{});
      rDisplay = false;

      if(removeElt){//Add or Remove from War List
        var isOnWarList = (getSavedList('autoWarTargetList').indexOf(userid) != -1);
        // In my mafia. Show options to add/remove from war list.
        this.buildAnchor( { 'AnchorText':isOnWarList?'Remove from War List':'Add to AutoWar List',
                            'id':userid,
                            'title':'In the settings box, under the mafia tab\nIf you have selected war friends from a list\nupdates the friends ids in the box',
                            'clickEvent':isOnWarList?clickWarListRemove:clickWarListAdd
                          });
        rDisplay = true;
      }

      // Add to AutoHitlist
      if(rDisplay) statsDiv.appendChild(document.createTextNode(' | '));
      var isOnAutoHitList = (getSavedList('pautoHitOpponentList').indexOf(userid) != -1);
      this.buildAnchor( { 'AnchorText':isOnAutoHitList?'Remove from AutoHit List':'Add to AutoHit List',
                          'id':userid,
                          'title':'In the settings box, under the stamina tab\nIf you have selected hitlist opponents \nHitlist these opponents:',
                          'clickEvent':isOnAutoHitList?clickAutoHitListRemove:clickAutoHitListAdd
                        });
      rDisplay = true;

      if(!removeElt){// Not in mafia. Show options to add/remove from fight lists.
        if(rDisplay) statsDiv.appendChild(document.createTextNode(' | '));
        rDisplay = true;
        var isOnFightList = (getSavedList('pfightlist').indexOf(userid) != -1);
        this.buildAnchor( { 'AnchorText':isOnFightList?'Remove from Fight List':'Add to AutoFight List',
                            'id':userid,
                            'title':'In the settings box, under the stamina tab\nIf you have selected fight specific opponents\nFight these opponents:',
                            'clickEvent':isOnFightList?clickFightListRemove:clickFightListAdd
                          });
        }


      if(rDisplay) makeElement('br', statsDiv,{});

      if(removeElt){//Job Help
        this.buildAnchor( { 'AnchorText':'NY - Give help',
                            'URLSegment': 'xw_controller=job&'+'xw_action=give_help&'+'xw_city='+ (city + 1)+'&'+tmpKey+cbKey+'target_id='+remoteuserid+'&'+'job_city=1'
                          });
        statsDiv.appendChild(document.createTextNode(' | '));
        makeElement('br', statsDiv,{});
        if(remotefbid){
          this.buildAnchor( { 'AnchorText':'Mafia Gift', 'title':'Requires that you set the giftkey in advance, see documentation', 'href':'http://www.spockholm.com/mafia/?id='+remotefbid
                          });
          statsDiv.appendChild(document.createTextNode(' | '));
        }
      }
    }
  }
  return true;
}
//////////////////////////////////////////////////////////////////////////////////////////
// Return the job mastery level
function getBrazilJobMastery(jobRow, newJobs){
  // Logic for new job layout
  if(newJobs){
    var mastery = 100;
    if(jobRow.innerHTML.untag().match(/(\d+)%/i)) return parseInt(RegExp.$1);
  }

  // Locked jobs are mastered too
  if(isJobLocked(jobRow)){
    DEBUG('NOT newjob, locked job, returning mastered, to allow to next tier?');
    return 100;
  }

  // if mastered show it, or show mastery
  if(/Mastered/i.test(jobRow.innerHTML) ){ return 100; }
  else if(jobRow.innerHTML.match(/Job\s+Mastery\s+(\d+)%/i) || jobRow.innerHTML.match(/>(\d+)%/i)){
    return parseInt(RegExp.$1);
  }

  // Get the job with the highest percentage in choice point jobs
  var divElts = $x('.//td[@class="job_name job_no_border"]//div[contains(text(),"%")]', jobRow);
  if(divElts){
    var iLength = divElts.length;
    var masteryPct = (iLength == 1) ? 100 : 0;
    for (var i = 0; i < iLength; ++i){
      if(divElts[i].innerHTML.match(/(\d+)%/) && parseInt(RegExp.$1) > masteryPct){
        masteryPct = parseInt(RegExp.$1);
      }
    }
    return parseInt(masteryPct);
  }
  DEBUG('No mastery items found. Assuming 0% mastery level.');
  return 0;
}

// Return the job mastery level
function getJobMastery(jobRow, newJobs){
  // Logic for new job layout
  if(newJobs){
    var mastery = 100;
    if(isJobFight(jobRow) && (isGMChecked('skipfight') ) ){ return 100; }

    if(jobRow.innerHTML.untag().match(/>(\d+)%\s+Job\s+Mastery/i) || jobRow.innerHTML.untag().match(/(\d+)%/i) || jobRow.innerHTML.match(/Job\s+Mastery\s+(\d+)%/i) || jobRow.innerHTML.match(/>(\d+)%/i)){
      mastery = parseInt(RegExp.$1);
    } else { if(jobRow.innerHTML.untag().match(/margin-right:\s+(\d+)%/i)){ mastery = 100-parseInt(RegExp.$1); } }
    return mastery;
  }

  // Locked jobs are mastered too
  if(/Mastered/i.test(jobRow.innerHTML) || isJobLocked(jobRow)){ return 100;}
  else if(jobRow.innerHTML.match(/Job\s+Mastery\s+(\d+)%/i) || jobRow.innerHTML.match(/>(\d+)%/i)){
    mastery = parseInt(RegExp.$1);
    return mastery;
  }

  // Get the job with the highest percentage in choice point jobs
  var divElts = $x('.//td[@class="job_name job_no_border"]//div[contains(text(),"%")]', jobRow);
  if(divElts){
    var iLength = divElts.length;
    var masteryPct = (iLength == 1) ? 100 : 0;
    for (var i = 0; i < iLength; ++i){
      if(divElts[i].innerHTML.match(/(\d+)%/) && parseInt(RegExp.$1) > masteryPct){
        masteryPct = parseInt(RegExp.$1);
      }
    }
    return parseInt(masteryPct);
  }
  DEBUG('No mastery items found. Assuming 0% mastery level.');
  return 0;
}

// Set the next job to be mastered for mastery job options
function jobMastery(element, newJobs){  
  colorDEBUG('jobMastery', cli);
  if(isGMChecked('repeatJob')) return;
  colorDEBUG('jobMastery repeatJob unchecked', cli);

  var selectMission = parseInt(GM_getValue('selectMission', 1));
  var currentJob = missions[selectMission][MISSION_NAME];
  var jobno      = missions[selectMission][MISSION_NUMBER];
  var tabno      = missions[selectMission][MISSION_TAB];
  var tabnopath  = missions[selectMission][MISSION_TABPATH];
  var cityno     = missions[selectMission][MISSION_CITY];
  
  var newtab = tabno;
  if((city == BRAZIL||city==CHICAGO) && tabnopath) newtab = tabnopath;      
  
  colorDEBUG('jobMastery city/cityno:' +city+'-' + cityno+' - '+newtab+' - '+currentJob, cli);
  
  if(city != cityno || !onJobTab(newtab)) return;
  var currentJobRow = getJobRow(currentJob, element);

  // Calculate tier mastery.
  var tierLevel = 0;
  var jobPercentComplete = -1;
  if(currentJobRow) jobPercentComplete = getJobMastery(currentJobRow, newJobs);
  DEBUG('Job is '+jobPercentComplete+' % complete');
  var currentJobMastered = (jobPercentComplete == 100);
  if(currentJobRow){
    if(newJobs && currentJobRow.className.match(/level_(\d+)/i)){ tierLevel = RegExp.$1; }
    else if(currentJobRow.innerHTML.match(/level (\d+)/i)){ tierLevel = RegExp.$1; }
  }

  var tierPercent = 0;
  var jobCount = 0;
  var firstUnmastered = selectMission;
  var firstFound = false;
  for (var i = 0, iLength = missions.length; i < iLength; i++){
    // Only get the jobs from this city tier
    if(city == missions[i][MISSION_CITY] && tabno == missions[i][MISSION_TAB]){
      var thisJobRow = getJobRow(missions[i][MISSION_NAME]);
      if(thisJobRow){
        var masteryLevel = getJobMastery(thisJobRow, newJobs);
        DEBUG('Masterylevel for '+missions[i][MISSION_NAME]+' : '+masteryLevel);
        if( (isGMChecked('skipfight') && !isJobFight(thisJobRow) ) || !isGMChecked('skipfight') ){
          tierPercent += masteryLevel;
          jobCount++;
          // Get the first unmastered job on this tier
          if(!firstFound && masteryLevel < 100){
            firstFound = true;
            firstUnmastered = i;
            DEBUG('firstUnmastered job is '+missions[i][MISSION_NAME]);
          }
        }
      }
    }
  }

  if(jobCount > 0){ tierPercent = Math.floor(tierPercent / jobCount); }

  if(GM_getValue('tierCompleteStatus') != tierLevel+'|'+ tierPercent){
    GM_setValue('tierCompleteStatus', tierLevel+'|'+ tierPercent);
  }
  colorDEBUG('Job tier level '+ tierLevel+' is '+ tierPercent+'% complete.', caq);

  // Calculate job mastery
  DEBUG("Checking current job mastery.");
  if(currentJobMastered || jobPercentComplete == -1){
    var jobList = getSavedList('jobsToDo');
    if(jobList.length == 0){
      DEBUG("There are no more jobs in the to-do list.");
      if(currentJobMastered) addToLog('info Icon', 'You have mastered <span class="job">'+ currentJob+'</span>.');
      else addToLog('info Icon', 'Job <span class="job">'+ currentJob+'</span> is not available.');

      // allow progression to next tier if skipping stamina jobs
      if( (tierPercent == 100) || (isGMChecked('skipfight')) ){
        // Find the first job of the next tier.
        // NOTE: This assumes that the missions array is sorted by city and then by tier.
        var nextTierJob;
        for (i = selectMission + 1, iLength=missions.length; i < iLength; i++){
          if(missions[i][MISSION_CITY] != cityno){
            nextTierJob = i;
            addToLog('info Icon', 'You have mastered the final job tier in '+cities[cityno][CITY_NAME]+'! Moving to the next tier in '+cities[missions[nextTierJob][MISSION_CITY]][CITY_NAME]+'.');
            break;
          }
          if(missions[i][MISSION_TAB] != tabno){
            nextTierJob = i;
            addToLog('info Icon', 'Current job tier is mastered. Moving to next tier in '+ cities[cityno][CITY_NAME]+'.');
            break;
          }
        }
        if(!nextTierJob) addToLog('info Icon', 'You have mastered all jobs!');
        else {
          GM_setValue('selectMission', nextTierJob);
          addToLog('info Icon', 'Job switched to <span class="job">'+ missions[GM_getValue('selectMission', 1)][MISSION_NAME]+'</span>.');
        }
      } else {
          GM_setValue('selectMission', firstUnmastered);
          addToLog('info Icon', 'Job switched to <span class="job">'+ missions[GM_getValue('selectMission', 1)][MISSION_NAME]+'</span>.');
      }
    } else DEBUG("There are jobs in the to-do list.");
  } else {
    DEBUG('Job is not mastered. Checking percent of mastery.');
    if(GM_getValue('jobCompleteStatus') != (currentJob+'|'+ String(jobPercentComplete))){
      GM_setValue('jobCompleteStatus', (currentJob+'|'+ String(jobPercentComplete)));
      DEBUG(currentJob+' is '+ jobPercentComplete+'% complete.');
    }
  }
}

function highlightJobs(worstRatio, bestRatio, bestJobs, worstJobs){
  var elt;
  if(worstRatio != bestRatio){
    while (bestJobs.length){
      elt = bestJobs.pop();
      if(!xpathFirst('.//span[@class="job_best"]', elt)){
        if(city==LV || city==ITALY) {
          elt.setAttribute('style','height:32px;');
          makeElement('br', elt);
        }
        elt = makeElement('span', elt, {'class':'job_best','style':'color:#52E259; font-size: 10px;margin-left:5px;'});
        makeElement('img', elt, {'src':stripURI(yeahIcon), 'width':'12', 'height':'12', 'style':'vertical-align:middle'});
        elt.appendChild(document.createTextNode(' BEST'));
      }
    }
    while (worstJobs.length){
      elt = worstJobs.pop();
      if(!xpathFirst('.//span[@class="job_worst"]', elt)){
        if(city==LV || city==ITALY) {
          elt.setAttribute('style','height:32px;');
          makeElement('br', elt);
        }
        elt = makeElement('span', elt, {'class':'job_worst','style':'color:#EC2D2D; font-size: 10px;margin-left:5px;'});
        makeElement('img', elt, {'src':stripURI(omgIcon), 'width':'12', 'height':'12', 'style':'vertical-align:middle'});
        elt.appendChild(document.createTextNode(' WORST'));
      }
    }
  }
}


function isJobFight(jobRow){
  var isFightJob = xpathFirst('.//div[@id="fight_opponents"]', jobRow);
  if(isFightJob) return true;
  return false;
}

function isJobBoss(jobRow){
  var isFightJob = xpathFirst('.//a[contains(@class,"attack_boss")]', jobRow);
  if(isFightJob) return true;
  return false;
}

function isJobLocked(jobAction){
  return ((/lock/i.test(jobAction.innerHTML.untag()) || /complete/i.test(jobAction.innerHTML.untag())) && !/help/i.test(jobAction.innerHTML.untag()));
}

function customizeJobs(){
try{
  // Do not go further if we are not on a jobs page yet
  if(currentJobTab()<=0) return false;

  // Extras for jobs pages.
  var jobTables;
  var newJobs = false;
  switch(city){
    case NY :
      jobTables = $x('.//table[@class="job_list"]//td[contains(@class,"job_name") or contains(@class,"job_title")]', innerPageElt);
      if(!jobTables || jobTables.length == 0) {
        jobTables = $x('.//div[@id="new_user_jobs"]//div[contains(@class, "job clearfix")]', innerPageElt);
        newJobs = true;
      }
      break;
    case LV :
    case ITALY :
      jobTables = $x('.//div[@id="map_panels"]//div[contains(@class,"job_info")]', innerPageElt);
      break;
    case BRAZIL :
    case CHICAGO :
      var districtLinksContainer = xpathFirst('.//div[(@id="brazil_district_'+ currentBrazilDistrict+'")]', innerPageElt);
      var jobTables = $x('.//div[@class="job"]', districtLinksContainer);
      if(!jobTables) var jobTables = $x('.//div[@id="brazil_jobs"]//div[@class="job"]', innerPageElt);
      break;
    default : return false
  }

  if(!jobTables || jobTables.length == 0) {
    return false;
  }

  DEBUG('customizeJobs: Found '+ jobTables.length+' new '+ cities[city][CITY_NAME] +' jobs in customize '+ cities[city][CITY_NAME] +' jobs.');

  var availableJobs = eval('({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})');
  var masteredJobs =  eval('({0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}})');
  try {
    availableJobs = eval('('+ GM_getValue('availableJobs')+')');
    masteredJobs = eval('('+ GM_getValue('masteredJobs')+')');
  } catch (ex){
    // ignore
  }

  var currentTab = currentJobTab();
  availableJobs[city][currentTab] = [];
  masteredJobs[city][currentTab] = [];

  // Display an experience to energy payoff ratio for each job.
  var bestJobs = [], worstJobs = [];
  var bestRatio = 0, worstRatio = 10;
  var bestStamJobs = [], worstStamJobs = [];
  var bestStamRatio = 0, worstStamRatio = 10;
  var masteryList = getSavedList('masteryJobsList');
  var masteredJobsCount = 0;
  var jobsFound = 0;

  for(var i=0, iLength=jobTables.length; i<iLength; i++){
    var currentJob = jobTables[i];
    var isFightJob = false;
    var isBossJob = false;
    var skipCurrentJob = false;
    var skipFightJob = false;
    var jobCostValue = energy;
    var cost = 0;

    switch(city){
      case NY :
        if(newJobs){
          var jobNameElt = xpathFirst('.//div[@class="title_results"]//h3', currentJob);
          if(!jobNameElt) continue;
          if(newJobs) var jobName = jobNameElt.innerHTML.clean().trim();
        } else {
          var jobNameElt = currentJob;
          var jobName = currentJob.innerHTML.split('<br>')[0].clean().trim().untag();
        }
        jobName = jobName.replace(/ x(\d+).*/, '');
        // Skip this name if job row is not found
        var jobRow = getJobRow(jobName);
        if(!jobRow) continue;
        break;
      case LV :
      case ITALY :
        var jobNameElt = xpathFirst('.//div[@class="job_title"]//h3', currentJob);
        if(!jobNameElt) continue;
        var jobName = jobNameElt.innerHTML.clean().trim().untag();
        break;
      case BRAZIL :
      case CHICAGO :
        var jobNameElt = xpathFirst('.//div[@class="job_details clearfix"]//h4', currentJob);
        if(!jobNameElt) continue;
        var jobName = jobNameElt.innerHTML.clean().trim().untag();
        break;
      default : return false
    }

    // Skip jobs not in missions array
    jobName = jobName.replace(/ x(\d+).*/, '');
    var jobMatch = missions.searchArray(jobName, 0)[0];
    if(isNaN(jobMatch)){
      //if(!jobName.match(/Boss/i)) 
      DEBUG('--> jobInfo: '+jobName+' not found in missions array. ');
      continue;
    } //else { colorDEBUG('--> jobInfo: '+jobName+' FOUND in missions array. '); }

    jobsFound++;

    switch(city){
      case NY :
        if(newJobs){
          var jobCost = xpathFirst('.//div[@class="use_pay"]//dl[contains(.,"Uses")]', currentJob);
          var jobReward = xpathFirst('.//div[@class="use_pay"]//dl[contains(.,"Pays")]', currentJob);
          var jobAction = xpathFirst('.//a', currentJob);
          var jobPercentage = getJobMastery(currentJob, true);
          var costElt = xpathFirst('.//dd[@class="energy"]', jobCost);          
          if(costElt) cost = parseCash(costElt.innerHTML);
        } else {
          var jobCost = xpathFirst('.//td[contains(@class,"job_energy")]', jobRow);
          var jobReward = xpathFirst('.//td[contains(@class,"job_reward")]', jobRow);
          var jobAction = xpathFirst('.//td[contains(@class,"job_action")]', jobRow);
          var jobPercentage = getJobMastery(jobRow, false);
          var costElt = xpathFirst('.//span[@class="bold_number"]', jobCost);
          if(!costElt) costElt = xpathFirst('.//span[@class="energy"]', jobCost);          
          if(costElt) cost = parseInt(costElt.innerHTML.untag());
        }
        break;
      case LV :
      case ITALY :
        var jobCost = xpathFirst('.//div[@class="job_uses"]', currentJob);
        var jobReward = xpathFirst('.//div[@class="job_pays"]', currentJob);
        var jobAction = xpathFirst('.//a[contains(@class,"sexy_button_new")]', currentJob);
        var jobPercentage = getJobMastery(currentJob, true);
        var isFightJob = isJobFight(currentJob);
        if(isFightJob && isGMChecked('skipfight')) skipFightJob = true;
        var isBossJob = isJobBoss(currentJob);        
        if(isFightJob || isBossJob){
          costElt = xpathFirst('.//dd[@class="stamina"]', jobCost);
          jobCostValue = stamina;
        } else costElt = xpathFirst('.//dd[@class="energy"]', jobCost);        
        if(costElt) cost = parseInt(costElt.innerHTML.untag());        
        break;
      case BRAZIL :
      case CHICAGO :
        var jobCost   = xpathFirst('.//ul[@class="uses clearfix"]', currentJob);
        var costElt = xpathFirst('.//li[@class="energy"]', jobCost);        
        if(costElt){
          if(costElt.hasAttribute('current_value'))   cost = parseInt(costElt.getAttribute('current_value'));
          else if(costElt.hasAttribute('base_value')) cost = parseInt(costElt.getAttribute('base_value'));
        }
        var jobReward = xpathFirst('.//ul[@class="pays clearfix"]', currentJob);
        var jobAction = xpathFirst('.//a[contains(@id, "btn_dojob")]', currentJob);
        var jobPercentage = getBrazilJobMastery(currentJob, true);
        break;
      default : return false
    }

    //colorDEBUG('--> jobInfo: '+jobName+' - jobPercentage: '+jobPercentage);
    // Determine available jobs

    // Skip locked jobs
    if(jobAction && isJobLocked(jobAction)) {
      skipCurrentJob = true;
      //DEBUG('--> jobInfo: '+ jobName+' ('+ jobMatch+') is locked. Skipping.');
    }

    // Skip mastered jobs
    if(jobPercentage == 100 || !cost){
      DEBUG('--> jobInfo: '+ jobName+'('+ jobMatch+') is Mastered. Skipping.');
      if(masteryList.length > 0 && masteryList.indexOf(String(jobMatch)) != -1){
        masteredJobs[city][currentTab].push(jobMatch);
        //DEBUG('--> jobInfo: '+ jobName+' ('+ jobMatch+') is Mastered. Added to masteredJobs.');
      }
      masteredJobsCount++;
    }

    // Skip job if we have do not have enough energy / stamina to perform the job
    if(!cost || !costElt || cost > jobCostValue) {
      skipCurrentJob = true;
      //DEBUG('--> jobInfo: '+ jobName+' ('+ jobMatch+') lacks energy/stamina. Skipping.');
    }

    // Skip fight jobs if skip fight jobs is checked
    if(skipFightJob){
      skipCurrentJob = true;
      masteredJobs[city][currentTab].push(jobMatch);
      masteredJobsCount++;
      //DEBUG('--> jobInfo: '+ jobName+' ('+ jobMatch+') is fightjob and skip fight jobs is checked. Skipping.');
    }

    // Only add jobs we can do
    if(!skipCurrentJob) {
      availableJobs[city][currentTab].push(jobMatch);
       //DEBUG('--> jobInfo: '+ jobName+' ('+ jobMatch+') is available. Adding to availableJobs Array.');
    }

    var reward = 0;
    var ratio = 0;
    var money = 0;
    var mratio = 0;

    var timePerEnergy = isGMChecked('isManiac') ? 3 : 5;
    timePerEnergy = isGMChecked('hasHelicopter') ? timePerEnergy - .5: timePerEnergy;
    timePerEnergy = isGMChecked('hasGoldenThrone') ? timePerEnergy/2: timePerEnergy;

    var timeTxt = ' (Time: 0 min)';
    var currency = cities[city][CITY_CASH_SYMBOL];
    var expElt; var moneyElt; var timeElt; var ratioElt;

    switch(city){
      case NY :
        var expElt = xpathFirst('.//span[@class="bold_number"]', jobReward);
        if(!expElt) expElt = xpathFirst('.//span[@class="experience"]', jobReward);
        if(!expElt) expElt = xpathFirst('.//dd[@class="experience"]', jobReward);
        if(expElt) {
          reward = parseInt(expElt.innerHTML);
          if(!newJobs) {
            expElt = costElt.parentNode
            if(!xpathFirst('.//span[@id="ratio_xp"]', expElt)) makeElement('br', expElt);
          }
        }

        var moneyElt = xpathFirst('.//span[@class="money"]/strong', jobReward);
        if(!moneyElt) moneyElt = xpathFirst('.//strong[@class="money"]', jobReward);
        if(!moneyElt) moneyElt = xpathFirst('.//dd[contains(@class,"cash cash")]', jobReward);
        if(moneyElt){
          money = parseCash(moneyElt.innerHTML.untag());
          if(!newJobs) moneyElt = moneyElt.parentNode;
        }

        if(cost > energy) timeTxt = ' (Time: '+ getDecimalTime((cost - energy) * timePerEnergy)+')';
        if(newJobs){
          timeElt = jobNameElt;
          if(!xpathFirst('.//span[@id="timeLeft"]', timeElt)) makeElement('br', timeElt);
          ratioElt = expElt;
        } else {
          timeElt = jobAction;
          if(!xpathFirst('.//span[@id="timeLeft"]', timeElt)){
            makeElement('br', timeElt);
            makeElement('br', timeElt);
          }
          ratioElt = costElt;
        }
        break;
      case LV :
      case ITALY :
        expElt = xpathFirst('.//dd[@class="experience"]', jobReward);
        if(expElt) {
          reward = parseInt(expElt.innerHTML);
          ratioElt = expElt;
        }
        moneyElt = xpathFirst('.//dd[contains(@class,"cash_icon")]', jobReward);
        if(moneyElt) money = parseCash(moneyElt.innerHTML.untag());
        if(costElt) timeElt = costElt;        
        if(isFightJob && cost > stamina) timeTxt = ' (Time: '+ getDecimalTime((cost - stamina) * 5)+')';
        if(!isFightJob && !isBossJob && cost > energy) timeTxt = ' (Time: '+ getDecimalTime((cost - energy) * timePerEnergy)+')';        
        break;
      case BRAZIL :
      case CHICAGO :
        expElt = xpathFirst('.//li[@class="experience"]', jobReward);
        if(expElt) reward = parseInt(expElt.getAttribute("current_value"));
        moneyElt = xpathFirst('.//li[contains(@class, "cash_icon_jobs")]', jobReward);
        if(moneyElt) money = parseCash(moneyElt.getAttribute("current_value"));
        if(costElt) timeElt = costElt;
        if(cost > energy) timeTxt = ' (Time: '+ getDecimalTime((cost - energy) * timePerEnergy)+')';
        ratioElt = expElt;
       break;
      default : return false
    }

    if(cost && costElt){
    if(ratioElt){
      ratio = Math.round (reward / cost * 100) / 100;
      if(!xpathFirst('.//span[@id="ratio_xp"]', ratioElt))
        makeElement('span', ratioElt, {'id':'ratio_xp', 'style':'color:red; font-size: 10px;'}).appendChild(document.createTextNode(' ('+ratio+')'));
    } else { ratio = 0; }

    if(moneyElt){
      mratio = Math.round(money / cost);
      if(mratio==0) mratio = Math.round(money / cost * 100)/100;
      mratio = makeCommaValue(mratio);
      if(!xpathFirst('.//span[@id="ratio_money"]', moneyElt))
        makeElement('span', moneyElt, {'id':'ratio_money', 'style':'color:red; font-size: 10px;'}).appendChild(document.createTextNode(' ('+ currency +' '+ mratio+')'));
    }

    if(!xpathFirst('.//span[@id="timeLeft"]', timeElt))
      makeElement('span', timeElt, {'id':'timeLeft','style':'color:#52E259; font-size: 10px'}).appendChild(document.createTextNode(timeTxt));

    updateJobInfo(jobMatch, cost, reward, ratio);

    // Keep track of the best & worst payoffs.
    if(newJobs) ratioElt = jobNameElt;
    // Is this a boss or fight job?
    if(!isFightJob){
      // Keep track of the best & worst payoffs for energy jobs.
      if(ratio > bestRatio){
        bestRatio = ratio;
        bestJobs = [ratioElt];
      } else if(ratio == bestRatio) bestJobs.push(ratioElt);
      if(ratio < worstRatio){
        worstRatio = ratio;
        worstJobs = [ratioElt];
      } else if(ratio == worstRatio) worstJobs.push(ratioElt);
    } else {
      // Keep track of the best & worst payoffs for stamina jobs.
      if(ratio > bestStamRatio){
        bestStamRatio = ratio;
        bestStamJobs = [ratioElt];
      } else if(ratio == bestStamRatio) bestStamJobs.push(ratioElt);
      if(ratio < worstStamRatio){
        worstStamRatio = ratio;
        worstStamJobs = [ratioElt];
      } else if(ratio == worstStamRatio) worstStamJobs.push(ratioElt);
    }
  }
  }
  
  highlightJobs(worstRatio, bestRatio, bestJobs, worstJobs);
  if(bestStamJobs) highlightJobs(worstRatio, bestRatio, bestStamJobs, worstStamJobs);

  GM_setValue('availableJobs', JSON.stringify(availableJobs));
  GM_setValue('masteredJobs', JSON.stringify(masteredJobs)); 
  
  // Set the job progress
  switch(city){
    case NY :
      if(newJobs) jobMastery(innerPageElt, true);
      else jobMastery(innerPageElt, false);
      break;
    case LV :
    case ITALY :
    case BRAZIL :
    case CHICAGO :
      jobMastery(innerPageElt, true);
      break;      
    default : return false
  }  

  tierMastery(jobsFound, masteredJobsCount, currentTab);

  return true;
} catch(jobErr){ colorDEBUG('customizeJobs:'+jobErr); }
}

function updateJobInfo(jobMatch, cost, reward, ratio){
  var missionItem = missions[jobMatch];
  // If values are not in synch, update mission array
  if(!isNaN(jobMatch) && (missionItem[MISSION_ENERGY] != cost || missionItem[MISSION_XP] != reward || missionItem[MISSION_RATIO] != ratio)){

    missions[jobMatch][MISSION_ENERGY] = cost;
    missions[jobMatch][MISSION_XP] = reward;
    missions[jobMatch][MISSION_RATIO] = ratio;

    // Save joblist
    GM_setValue('missions', JSON.stringify(missions));
  }
}

function tierMastery(jobsFound, jobsMastered, currentTab){
  colorDEBUG('checking tierMastery '+jobsFound+' - '+jobsMastered+' - '+currentTab)
  if(running && GM_getValue('selectTier','0.0') != '0.0'){
    selectedTierValue = GM_getValue('selectTier','0.0').split('.');
    masteryCity = parseInt(selectedTierValue[0]);
    masteryTier = parseInt(selectedTierValue[1]);
    if(city == masteryCity && masteryTier == currentTab && jobsFound <= jobsMastered){
      selectTier = cities[masteryCity][0]+' - '+ missionTabs[masteryCity][masteryTier - 1];
      addToLog('info Icon', 'Tier '+ selectTier+' is already mastered. Moving on to the next tier.');

      // Move on the the next tier.
      if(missionTabs[masteryCity].length <= masteryTier){
        // We have mastered all tiers. Disable tier mastery logic.
        if(cities.length < masteryCity){ 
          GM_setValue('selectTier', '0.0');
        // Next City
        } else {
          masteryCity++;
          while ( ( level < cities[masteryCity][CITY_LEVEL] ) && ( cities.length > masteryCity ) ){
            masteryCity++;
            if  (cities.length <= masteryCity ){
              DEBUG('We are out of cities to check so turning off mastery ' );
              GM_setValue('selectTier', '0.0');
              return;
            } else { DEBUG(cities[(masteryCity-1)][CITY_NAME]+' Unavaliable, Checking '+ cities[masteryCity][CITY_NAME] ); }
          }
          masteryTier = 1;
        }
      // Next Tier
      } else { 
        masteryTier++; 
        if(city==BRAZIL || city == CHICAGO){
          var missionFilter = function(v, i, a){ return a[i][MISSION_CITY]==masteryCity && a[i][MISSION_TAB]==masteryTier };
          var newMissions = missions.filter(missionFilter);
          if(newMissions[0][MISSION_TABPATH]) masteryTier = newMissions[0][MISSION_TABPATH];
        }        
      }

      if(GM_getValue('selectTier','0.0') != '0.0'){
        var mastery_jobs_list = [];
        for (i = 0, iLength = missions.length; i < iLength; i++){
          if(masteryCity == missions[i][MISSION_CITY] && masteryTier == missions[i][MISSION_TAB]){
            mastery_jobs_list.push(i);
          }
        }
        setSavedList('masteryJobsList', mastery_jobs_list);
        GM_setValue('selectTier', masteryCity+'.'+ masteryTier);
      }
    } else {
      colorDEBUG(city+' == '+masteryCity+' && '+masteryTier+' == '+currentTab+ ' && '+jobsFound+' <= '+jobsMastered);
    }
  }
}

function customizeFight(){
  if(running) return true;

  var opponents = getDisplayedOpponents(innerPageElt, true);
  if(!opponents) return false;

  // Customize the opponent list.
  var blacklist = getSavedList('fightListAvoid');
  for (var i = 0, iLength=opponents.length; i < iLength; ++i){
    var opponent = opponents[i];
    if(!opponent.profile || !opponent.id) continue;

    // Mark targets that should be avoided.
    if(blacklist.indexOf(opponent.id) != -1){
      var parentElt = opponent.profile.parentNode;
      var elt = makeElement('img', null, {'src':stripURI(omgIcon), 'width':'12', 'height':'12', 'style':'vertical-align:middle', 'title':'You have already lost to this opponent during automatic play.'});
      parentElt.insertBefore(elt, parentElt.firstChild);
    }
  }
  return true;
}

function customizeHitlist(){
  if(running) return true;

  // Extras for hitlist.
  if(!onHitlistTab()) return false;

  // Get the displayed opponents.
  var opponents = getHitlist(innerPageElt, true);
  if(!opponents) return true;

  // Customize the opponent list.
  var blacklist = getSavedList('hitmanListAvoid').concat(getSavedList('fightListAvoid'));
  var kills = getSavedList('hitmanListKilled');
  for (var i = 0, iLength=opponents.length; i < iLength; ++i){
    var opponent = opponents[i];
    if(!opponent.profile) continue;

    // Mark targets that should be avoided.
    var elt, parentElt;
    if(blacklist.indexOf(opponent.id) != -1){
      parentElt = opponent.profile.parentNode;
      elt = makeElement('img', null, {'src':stripURI(omgIcon), 'width':'12', 'height':'12', 'style':'vertical-align:middle', 'title':'You have already lost to this opponent during automatic play.'});
      parentElt.insertBefore(elt, parentElt.firstChild);
    }

    // Mark targets on which bounties have already been collected.
    if(kills.indexOf(opponent.id) != -1){
      parentElt = opponent.profile.parentNode;
      elt = makeElement('img', null, {'src':stripURI(lootbagIcon), 'width':'12', 'height':'12', 'style':'vertical-align:middle', 'title':'You have already collected a bounty on this target during automatic play.'});
      parentElt.insertBefore(elt, parentElt.firstChild);
    }
  }
  return true;
}

function setLevelUpRatioStats(){
  var elt = document.getElementById('level_up_ratio_stats');
  if(elt){
    var ratioHTML = 'Level Up Ratio\'s:&nbsp;';
    if(stamina || energy){
      var ratio = Math.ceil((ptsToNextLevel) / (energy + stamina) * 100) / 100;
      ratioHTML += 'Combined:&nbsp;'+ (ratio > 25 ? '> 25' : ratio)+'x';
      if(energy){
        var ratioEnergy = Math.ceil((ptsToNextLevel) / energy * 100) / 100;
        ratioHTML += '&nbsp;|&nbsp;Energy:&nbsp;'+ (ratioEnergy > 25 ? '> 25' : ratioEnergy)+'x';
      }
      if(stamina){
        var ratioStamina = Math.ceil((ptsToNextLevel) / stamina * 100) / 100;
        ratioHTML += '&nbsp;|&nbsp;Stamina:&nbsp;'+ (ratioStamina > 25 ? '> 25' : ratioStamina)+'x';
      }
    }
    elt.innerHTML = ratioHTML;
    if(ratio) elt.style.display = 'block';
    else elt.style.display = 'none';
  }
  if(!isGMChecked('noStats')){
    var rate = getStaminaGainRate();
    if(elt = xpathFirst('.//div[@id="expRate"]')) elt.firstChild.nodeValue = rate.toFixed(2);
    if(elt = xpathFirst('.//div[@id="expToNext"]')) elt.firstChild.nodeValue = makeCommaValue(ptsToNextLevel);
    if(elt = xpathFirst('.//div[@id="stamToNext"]')) elt.firstChild.nodeValue = rate? (ptsToNextLevel / rate).toFixed(0): 'n/a';
  }
}

// Callback for clicking 'Add to Fight List' on profile page.
function clickFightListAdd(){
  addSavedListItem('pfightlist', this.id);
  this.firstChild.nodeValue = 'Remove from Fight List';
  this.removeEventListener('click', clickFightListAdd, false);
  this.addEventListener('click', clickFightListRemove, false);
  var el = document.getElementById('pfightlist');
  if(el) el.value = GM_getValue('pfightlist', '');
}

// Callback for clicking 'Remove from Fight List' on profile page.
function clickFightListRemove(){
  while(removeSavedListItem('pfightlist', this.id))
  this.firstChild.nodeValue = 'Add to Fight List';
  this.removeEventListener('click', clickFightListRemove, false);
  this.addEventListener('click', clickFightListAdd, false);
  var el = document.getElementById('pfightlist');
  if(el) el.value = GM_getValue('pfightlist', '');
}

// Callback for clicking 'Add to AutoHit List' on profile page.
function clickAutoHitListAdd(){
  addSavedListItem('pautoHitOpponentList', this.id);
  this.firstChild.nodeValue = 'Remove from AutoHit List';
  this.removeEventListener('click', clickAutoHitListAdd, false);
  this.addEventListener('click', clickAutoHitListRemove, false);
  var el = document.getElementById('pautoHitOpponentList');
  if(el) el.value = GM_getValue('pautoHitOpponentList', '');
}

// Callback for clicking 'Remove from AutoHit List' on profile page.
function clickAutoHitListRemove(){
  while(removeSavedListItem('pautoHitOpponentList', this.id))
  this.firstChild.nodeValue = 'Add to AutoHit List';
  this.removeEventListener('click', clickAutoHitListRemove, false);
  this.addEventListener('click', clickAutoHitListAdd, false);
  var el = document.getElementById('pautoHitOpponentList');
  if(el) el.value = GM_getValue('pautoHitOpponentList', '');
}

// Callback for clicking 'Add to War List' on profile page.
function clickWarListAdd(){
  addSavedListItem('autoWarTargetList', this.id);
  this.firstChild.nodeValue = 'Remove from War List';
  this.removeEventListener('click', clickWarListAdd, false);
  this.addEventListener('click', clickWarListRemove, false);
  var el = document.getElementById('autoWarTargetList');
  if(el) el.value = GM_getValue('autoWarTargetList', '');
}

// Callback for clicking 'Remove from War List' on profile page.
function clickWarListRemove(){
  while(removeSavedListItem('autoWarTargetList', this.id))
  this.firstChild.nodeValue = 'Add to War List';
  this.removeEventListener('click', clickWarListRemove, false);
  this.addEventListener('click', clickWarListAdd, false);
  var el = document.getElementById('autoWarTargetList');
  if(el) el.value = GM_getValue('autoWarTargetList', '');
}

function getJobRow(jobName, contextNode){
  var rowElt, conTxt = '', LVjob=0;
  try {
    // Retrieve by job number first
    var jobMatch = missions.searchArray(jobName, 0)[0];
    if(!isNaN(jobMatch)){
      var jobno = missions[jobMatch][MISSION_NUMBER];
      rowElt = xpathFirst('.//table[@class="job_list"]//a[contains(@onclick, "job='+ jobno+'&")]', contextNode);
      if(!rowElt) rowElt = xpathFirst('.//table[@class="job_list"]//a[contains(@href, "job='+ jobno+'&")]', contextNode);
      //Fetching logic for Vegas jobs
      if(!rowElt && (city==LV || city==ITALY)){
        var jobContainer = "job"+jobno;
        rowElt = xpathFirst('.//div[@id="'+jobContainer+'"]', contextNode);
        LVjob = 1;
      }
    }

    // cheat way to buy needed stuff and not wait for a reply works as is
    var elt = xpathFirst('.//a[contains(@onclick, "MapController.buyItems('+jobno+'); return false;")]') ;
    if(elt){
      DEBUG('Cheating on buying for now found a link to click - - jobno='+ jobno );
      clickElement(elt);
    }

    // If no rows found, retrieve by name
    if(!rowElt){
      // Tokenize job name words
      var jobNameTokens = jobName.replace (/"/g,' ').replace(/'/g, ' ').split(' ');
      for (var i = 0; i < jobNameTokens.length; ++i){
        if(jobNameTokens[i].length > 1){
          if(conTxt.length > 0) conTxt += ' and ';
          conTxt += 'contains(., "'+jobNameTokens[i]+'")';
        }
      }
      rowElt = xpathFirst('.//table[@class="job_list"]//tr//td['+conTxt+']', contextNode);
    }

    // Get the parent TR
    if(rowElt && !LVjob) while (rowElt.tagName != "TR") rowElt = rowElt.parentNode;

    // Fetching logic for new job rows
    if(!rowElt) rowElt = xpathFirst('.//div[@id="new_user_jobs"]//div[contains(@class, "job clearfix") and '+conTxt+']', contextNode);

    // Fetching logic for Brazil job rows
    if(!rowElt){
      rowElt = xpathFirst('.//div[@class="job"]//a[contains(@href, "job='+ jobno+'&")]', contextNode);
      if(rowElt) rowElt = rowElt.parentNode.parentNode;
    }
  } catch(ex){
    DEBUG('BUG DETECTED (getJobRow): [exception: '+ ex+'], [conTxt: '+ conTxt+'], [jobName: '+ jobName+']');
  }
  if(!rowElt) return false;
  return rowElt;
}
////
function getJobRowItems(jobName){
try {
  var currentJob = jobName;
  var currentJobRow = getJobRow(currentJob, innerPageElt);
  if(!currentJobRow) return false;
  var inner = innerPageElt? innerPageElt.innerHTML : '';
  var innerNoTags = inner.untag();

  if(innerNoTags.match(/You do not have enough cash to buy/i)){
    addToLog('warning Icon', 'You don\'t have enough cash to buy necessary equipment.');
    var jobs = getSavedList('jobsToDo', '');
    if(jobs.indexOf(currentJob) == -1){
      jobs.push(currentJob);
      DEBUG('Saving '+ currentJob+' for later. Need to farm cash first.');
      setSavedList('jobsToDo', jobs);
      return true;
    }
    return false;
  }

  var buyItemElts = $x('.//a[contains(@onclick, "xw_action=buy_item")]',currentJobRow);
  if(!buyItemElts) buyItemElts = $x('.//a[contains(@onclick, "MapController.buyItems")]',currentJobRow);

  // Click to buy items
  if(buyItemElts.length > 0){
    addToLog('search Icon', 'Attempting to purchase required items.');
    for (var i = 0, numItems=buyItemElts.length; i < numItems; ++i){
      Autoplay.fx = function(){
        clickAction = 'buy item';
        clickElement(buyItemElts[i]);
        DEBUG('Clicked to buy item.');
      };
      break;
    }
    return true;
  }

  // New Job layout handling
  //
  if(isGMChecked('autoWithDraw')){
    var amtElt = xpathFirst('.//strong[@class="cash cash_'+cities[city][CITY_ALIAS]+'"]', currentJobRow);
    if(!amtElt) amtElt = xpathFirst('.//div[@class="job_uses"]//dd[contains(@class,"cash_icon")]', currentJobRow);
    if(amtElt){
      var cashDiff = parseCash(amtElt.innerHTML.untag().trim()) - cities[city][CITY_CASH];
      // Withdraw the amount we need
      if(cashDiff > 0){
        DEBUG('We need '+cashDiff+' for this job. Going to the bank/vault of '+city);
        suspendBank = true;
        return (autoBankWithdraw(cashDiff));
      }
    }
  }

  // Logic to switch to the required job first
  var necessaryItems = $x('.//div[@class="req_item"]//img', currentJobRow);

  // Figure out which loot items are needed before this job can be attempted
  // again and, consequently, which jobs will have to be done to get them.
  if(necessaryItems.length > 0){
    DEBUG('Some Items Required for this job - req_item');
    // Save the current job for later. The current job should not already exist in the list, so check first.
    var items = getSavedList('itemList');
    var jobs = getSavedList('jobsToDo', '');
    if(jobs.indexOf(currentJob) == -1){
      jobs.push(currentJob);
      DEBUG('Saving '+ currentJob+' for later. Need to fetch pre-req items first.');
      setSavedList('jobsToDo', jobs);
    }

    var itemsFound = false;
    necessaryItems.forEach(
      function(i){
        var itmSearch = i.alt;
        itmSearch = itmSearch.replace(/set of/i, '');
        itmSearch = itmSearch.replace(/\[(.+?)\]/i, '');
        itmSearch = itmSearch.trim();
        DEBUG(itmSearch);
        var itemFound = false;
        // Try fetching the items from the job requirement array
        requirementJob.forEach(
          function(j){
            if(level >= cities[j[2]][CITY_LEVEL] && j[0].toUpperCase().trim() == itmSearch.toUpperCase().trim()){
              jobs.push(j[1]);
              items.push(itmSearch);
              itemFound = true;
            }
          }
        );

        // Set the flag if at least one item is found
        if(itemFound) itemsFound = true;
        else DEBUG(itmSearch+' not found in the requirement job array.');
      }
    );

    // At least one item found
    if(itemsFound){
      setSavedList('itemList', items.unique());
      setSavedList('jobsToDo', jobs);
      popJob();
      return true;
    }
  } else {
    necessaryItems = xpathFirst('.//span[@class="missing_req_items"]', currentJobRow);
    itmSearch='';
    if(necessaryItems){
      DEBUG('Some Items Required for this job - missing_req_items');
      itmSearch = necessaryItems.innerHTML;
      if(itmSearch.match(/(.+?),/i)) itmSearch = RegExp.$1;
      DEBUG('Missing Item: '+ itmSearch);
      itmSearch = itmSearch.replace(/\(.+?\)/gi, '').trim();
      DEBUG('Parsed Missing Item: '+ itmSearch);
    } else {
      necessaryItems = xpathFirst('.//div[@class="needed_gate_loot_container"]', currentJobRow);
      if(!necessaryItems) necessaryItems = xpathFirst('.//div[@class="needed_gate_loot"]', currentJobRow);
      if(necessaryItems){
        DEBUG('Some Items Required for this job - needed_gate_loot');
        messages = $x('.//img', necessaryItems);
        numMessages = messages.length;
        for (i = 0; i < numMessages; i++){
          var item = messages[i].title;
          if(!item.match(/Gift this/i)){
            if(itmSearch == '') itmSearch = item;
            else itmSearch = itmSearch+', '+ item;
          }
        }
        DEBUG('Missing Item(s): '+ itmSearch);
      }
    }

    if(itmSearch!=''){
      DEBUG('Item(s) Required for this job : '+itmSearch);
      // Save the current job for later. The current job should not already exist in the list, so check first.
      var items = getSavedList('itemList');
      var jobs = getSavedList('jobsToDo', '');
      DEBUG('Current Job List: '+jobs);
      if(jobs.indexOf(currentJob) == -1){
        jobs.push(currentJob);
        DEBUG('Saving '+ currentJob+' for later. Need to fetch pre-req items first.');
        setSavedList('jobsToDo', jobs);
      } else { DEBUG(currentJob+' already saved for later. Need to fetch pre-req items first.'); }
      var itemFound = false;
      // Try fetching the items from the job requirement array
      requirementJob.forEach(
        function(j){
          if(level >= cities[j[2]][CITY_LEVEL] && j[0].toUpperCase().trim() == itmSearch.toUpperCase().trim()){
            jobs.push(j[1]);
            items.push(itmSearch.trim());
            itemFound = true;
            jobFound = j[1];
          }
        }
      );

      // Set the flag if at least one item is found
      if(!itemFound) DEBUG(itmSearch+' not found in the requirement job array.');
      else {
        setSavedList('itemList', items.unique());
        setSavedList('jobsToDo', jobs);
        popJob();
        return true;
      }
    }
  }

  // Withdraw money
  var amtElt = xpathFirst('.//td[contains(@class,"job_energy")]//span[@class="money" or @class="bad"]', currentJobRow);
  if(amtElt){
    var cashDiff =  parseCash(amtElt.innerHTML) - cities[city][CITY_CASH];
    // Withdraw the amount we need
    if(cashDiff > 0){
      suspendBank = true;
      return (autoBankWithdraw(cashDiff));
    }
  }

  return false;
} catch(reqError){ DEBUG('getJobRowItems Error :'+ reqError); }
}

function popJob(){
  var jobs = getSavedList('jobsToDo', '');
  // Set the very next job to perform.
  var doJob = jobs.pop();
  setSavedList('jobsToDo', jobs);
  var i = 0;
  missions.forEach(
    function(f){
      if(f[0].toUpperCase().trim() == doJob.toUpperCase().trim()){
        GM_setValue('selectMission', i);
        addToLog('info Icon', 'Switching job to '+ doJob+'(popJob).');
      }
      i++;
    }
  );
}

// Set the next job to be done for job combination options
function jobCombo(element){
  var i;
  // Cycle jobs with the same ratio
  var availableJobs = eval('('+ GM_getValue('availableJobs', "{0:{},1:{},2:{},3:{},4:{},5:{},6:{},7:{},8:{}}")+')');
  var multiple_jobs_list = getSavedList('selectMissionMultiple');
  var cycle_jobs = new Object();

  // Group selected jobs by ratio
  for (i = 0, iLength=multiple_jobs_list.length; i < iLength; ++i){
    var job = multiple_jobs_list[i];
    var mission = missions[job];
    if(!mission) continue;
    // Put non-available jobs at the end of the queue
    if(availableJobs[mission[MISSION_CITY]][mission[MISSION_TAB]] != null &&
        availableJobs[mission[MISSION_CITY]][mission[MISSION_TAB]].indexOf(parseInt(job)) == -1){
      mission[MISSION_RATIO] = 0;
    }

    if(cycle_jobs[mission[MISSION_RATIO]] == null) cycle_jobs[mission[MISSION_RATIO]] = [];
    cycle_jobs[mission[MISSION_RATIO]].push(multiple_jobs_list[i]);
  }

  // Rebuild the job list array
  multiple_jobs_list = [];
  for (i in cycle_jobs){
    if(cycle_jobs[i].length > 1){
      // Only cycle the current job's ratio group
      if(missions[GM_getValue('selectMission', 1)][MISSION_RATIO] == i) cycle_jobs[i].push(cycle_jobs[i].shift());
      for (var n = 0, nLength=cycle_jobs[i].length; n < nLength; ++n){ multiple_jobs_list.push(cycle_jobs[i][n]); }
    } else multiple_jobs_list.push(cycle_jobs[i][0]);
  }
  setSavedList('selectMissionMultiple', multiple_jobs_list);
}

function jobLoot(element){
  var i, lootbag = [];
  var strLoot = '';
  var strUsed=''
  // See what loot was gained.
  var messages = $x('.//td[class="message_body"]', element);
  var numMessages = messages.length;
  for (i = 1; i < numMessages; i++){
    var innerNoTags = messages[i].innerHTML.untag();
    if(innerNoTags.match(/you\s+?gained:\s+?an?\s+?(.+)\./i) || innerNoTags.match(/you\s+gained(?:\s+an?)?\s+(.+)\./i) ||
        innerNoTags.match(/found(?:\s+an?)?\s+(.*?)\s+on\s+the/i) || innerNoTags.match(/earned(?:\s+an?)?\s+(.*?)\.\s+you\s+/i)){
      var loot = RegExp.$1;
      if(loot.match(/(.+?)\s+?was(.+?)(\d+)/i)) loot = RegExp.$1+' x '+RegExp.$3;
      else if(loot.match(/(.+?)\s+?(\.|-)?\s+?used?(.+?)(\d+)/i)) loot = RegExp.$1+' x '+RegExp.$4;
      if(strLoot) strLoot += '<br/>'+'Found <span class="loot">'+loot+'</span> in the job.';
      else strLoot = 'Found <span class="loot">'+ loot+'</span> in the job.';
      lootbag.push(loot);
    }
  }
  if(numMessages > 0 && strLoot !='') addToLog('lootbag Icon', strLoot);

  if(city==NY || city == CUBA){
    //New NY Job Loot
    var messages = $x('.//dd[@class="message_item"]', element);
    var numMessages = messages.length;
    for (i = 0; i < numMessages; i++){
      var loot = messages[i].innerHTML.untag();
      if(loot.indexOf('remaining')==-1){
        if(strLoot) strLoot += '<br/>'+'Found <span class="loot">'+loot+'</span> in the job.';
        else strLoot = 'Found <span class="loot">'+ loot+'</span> in the job.';
        lootbag.push(loot);
      } else {
        if(strUsed) strUsed += '<br/>'+'You used <span class="loot">'+loot+'</span> in the job.';
        else strUsed = 'You used <span class="loot">'+ loot+'</span> in the job.';
      }
    }
    if(numMessages > 0 && strLoot !='') addToLog('lootbag Icon', strLoot);
    if(numMessages > 0 && strUsed !='') addToLog('lootbag Icon', strUsed);
  }

  // Vegas Loot on jobs
  if(city == LV||city==ITALY){
    var jobResults = xpathFirst('.//div[@class="job_results"]', element);
    strLoot = '';
    messages = $x('.//img', jobResults);
    numMessages = messages.length;
    for (i = 0; i < numMessages; i++){
      if(messages[i].title){
        var loot = messages[i].title;
        var parentText = messages[i].parentNode.innerHTML.untag();
        if(parentText.match(/(\d+)/)) parentText = ' x '+ RegExp.$1;
        if(loot.match(/(.+?)(\.|-)?\s+?(was|used?)/i)) loot = RegExp.$1;
        if(strLoot) strLoot += '<br/>'+'Found <span class="loot">'+loot+' ' +parentText+'</span> in the job.';
        else strLoot = 'Found <span class="loot">'+ loot+' ' +parentText+'</span> in the job.';
        lootbag.push(loot);
      }
    }
    if(numMessages > 0 && strLoot !='') addToLog('lootbag Icon', strLoot);
  }

  if(city == BRAZIL || city == CHICAGO){
    var strLoot='';
    var loot = '';
    var lootElt = '';
    var lootTxt = '';
    DEBUG('Checking for Brazil Loot');
    var jobResults = $x('.//div[@class="job_additional_results"]//div[@class="loot_item"]', element)
    if(jobResults && jobResults.length>0){
      for(j=0;j < jobResults.length;j++){
        var jobParent = jobResults[j].parentNode;
        var myParentClass='';
        if(jobParent) myParentClass = jobParent.className;
        DEBUG('ParentClass: '+myParentClass);
        if(myParentClass!='previous_loot'){
          loot = '';
          lootElt = '';
          lootTxt = '';
          messages = $x('.//div[contains(@class,"item_card_mini")]', jobResults[j]);
          numMessages = messages.length;
          for (i = 0; i < numMessages; i++){
            lootID = messages[i].getAttribute('item_id')
            DEBUG('lootID '+lootID);
            if(lootID){
              lootElt = xpathFirst('.//img[@item_id="'+lootID+'"]', element);
              if(lootElt) lootTxt = lootElt.title;
              else {
                lootElt = xpathFirst('.//img', messages[i]);
                lootAttack = xpathFirst('.//div[@class="attack"]', messages[i]);
                lootDefense = xpathFirst('.//div[@class="defense"]', messages[i]);
                if(lootElt){
                  lootTxt = lootElt.src;
                  if(lootTxt.match(/item_(.+?)_/i)) lootTxt = RegExp.$1;
                }
                if(lootAttack) lootTxt += '(A: '+lootAttack.innerHTML;
                if(lootDefense) lootTxt += '/ D: '+lootDefense.innerHTML+')';
                if(lootTxt=='') lootTxt = 'Item';
              }
              if(strLoot) strLoot += '<br/>'+'Found <span class="loot">'+lootTxt+' ('+lootID+')</span> in the job.';
              else strLoot = 'Found <span class="loot">'+ lootTxt+' ('+lootID+')</span> in the job.';
              lootbag.push(lootTxt);
            }
          }
        }
      }
    }
    if(strLoot !='') addToLog('lootbag Icon', strLoot);
  }

  DEBUG('Found '+ lootbag.length+' item(s) on this job.');

  var items = getSavedList('itemList');
  if(typeof(items[0]) == 'undefined' || items.length == 0){
    DEBUG('No items in required item list.');
    return;
  }

  var itemFound = false;
  var itemName;
  // NOTE: The single equal sign is intentional in this while() condition.
  while ((itemName = lootbag.pop())){
    DEBUG('Looking for '+ itemName+' in needed items list. We need '+ items.length+' item(s).');
    for (var i = 0; i < items.length; i++){
      if(itemName.indexOf(items[i].trim()) != -1 ){
        // we found some needed loot
        itemFound = true;
        DEBUG('<span class="loot">'+ itemName+'</span> is the item we were looking for!');
        removeSavedListItem('itemList', itemName);
        removeJobForItem('jobsToDo', itemName);
        popJob();
        return true;
      }
    }
  }
}

function debugDumpSettings(){
try{
  // Use showIfUnchecked() to show 0 value as "un-checked", or showIfSelected()
  // to show 0 value as "not selected" (for radio buttons).

  var getJobList = function(listName){
    var multiple_jobs_list = getSavedList(listName);
    var jobNames = [];
    for (var i=0, numJobs=multiple_jobs_list.length; i < numJobs; ++i){
      jobNames.push(missions[multiple_jobs_list[i]][MISSION_NAME]);
    }
    return jobNames.join(', ');
  };

  var ratioJobs = getJobList('selectMissionMultiple');
  var selectTier = 'None';
  if(GM_getValue('selectTier','0.0') != '0.0'){
    selectedTierValue = GM_getValue('selectTier','0.0').split('.');
    selectTier = cities[parseInt(selectedTierValue[0])][0]+' - '+ missionTabs[NY][parseInt(selectedTierValue[1]) - 1];
  }

  if(GM_getValue('language', 'en') != 'en'){
    DEBUG('Language is "'+ GM_getValue('language','undefined')+'".');
    addToLog('warning Icon', 'Unfortunately, only the English version of the game is fully supported. If you experience problems, set your Facebook language to English and try again.');
  }

  var BrowserDetect = {
    init: function (){
      this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
      this.version = this.searchVersion(navigator.userAgent)
        || this.searchVersion(navigator.appVersion)
        || "an unknown version";
      this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data){
      for (var i=0;i<data.length;i++)  {
        var dataString = data[i].string;
        var dataProp = data[i].prop;
        this.versionSearchString = data[i].versionSearch || data[i].identity;
        if(dataString){
          if(dataString.indexOf(data[i].subString) != -1)
            return data[i].identity;
        }
        else if(dataProp)
          return data[i].identity;
      }
    },
    searchVersion: function (dataString){
      var index = dataString.indexOf(this.versionSearchString);
      if(index == -1) return;
      return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
      { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
      { string: navigator.userAgent, subString: "OmniWeb", versionSearch: "OmniWeb/", identity: "OmniWeb" },
      { string: navigator.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version" },
      { prop: window.opera, identity: "Opera" },
      { string: navigator.vendor, subString: "iCab", identity: "iCab" },
      { string: navigator.vendor, subString: "KDE", identity: "Konqueror" },
      { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
      { string: navigator.vendor, subString: "Camino", identity: "Camino" },
      // for newer Netscapes (6+)
      { string: navigator.userAgent, subString: "Netscape", identity: "Netscape" },
      { string: navigator.userAgent, subString: "MSIE", identity: "Explorer", versionSearch: "MSIE" },
      { string: navigator.userAgent, subString: "Gecko", identity: "Mozilla", versionSearch: "rv" },
      // for older Netscapes (4-)
      { string: navigator.userAgent, subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla" }
    ],
    dataOS : [
      { string: navigator.platform,  subString: "Win",    identity: "Windows" },
      { string: navigator.platform,  subString: "Mac",    identity: "Mac" },
      { string: navigator.userAgent, subString: "iPhone", identity: "iPhone/iPod" },
      { string: navigator.platform,  subString: "Linux",  identity: "Linux" }
    ]
  };

  BrowserDetect.init();
  getBrowserWindowSize();

  var settingsDump =
        '-  -  -  -  -  BEGIN SETTINGS DUMP  -  -  -  -  -<br>' +
        '------------------ End-User System -------------------<br>' +
        'Browser Name: <strong>'+ BrowserDetect.browser+'</strong><br>' +
        'Browser Version: <strong>'+ BrowserDetect.version+'</strong><br>' +
        'Operating System: <strong>'+ BrowserDetect.OS+'</strong><br>' +
        'New Layout: <strong>'+ new_header+'</strong><br>' +
        'Browser Window Size: <strong>'+ winW+' / ' +winH+'</strong><br>' +
        '------------------ PS MWAP Settings---------------------<br>' +
        'Script Version: <strong>'+ SCRIPT.version+'</strong><br>' +
        'Language: <strong>'+ GM_getValue('language')+'</strong><br>' +
        'isRunning: <strong>'+ running+'</strong><br>' +
        'Player current level: <strong>'+ level+'</strong><br>' +
        'Player points to next level: <strong>'+ ptsToNextLevel+'</strong><br>' +
        'Player mafia size: <strong>'+ mafia+'</strong><br>' +
        'Player attack profile: <strong>'+ curAttack+'</strong><br>' +
        'Player defense profile: <strong>'+ curDefense+'</strong><br>' +
        'Player attack equip: <strong>'+ curAttackEquip+'</strong><br>' +
        'Player defense equip: <strong>'+ curDefenseEquip+'</strong><br>' +
        'Player health: <strong>'+ health+'/'+ maxHealth+'</strong><br>' +
        'Player energy: <strong>'+ energy+'/'+ maxEnergy+'</strong><br>' +
        'Player stamina: <strong>'+ stamina+'/'+ maxStamina+'</strong><br>' +
        'Player skill points: <strong>'+ stats+'</strong><br>' +
        'Energy pack waiting? <strong>'+ energyPack+'</strong><br>' +
        'Current location: <strong>'+ cities[city][CITY_NAME]+'</strong><br>';
      for(i=0,iLength=cities.length;i<iLength;i++){
        settingsDump+= cities[i][CITY_NAME]+' cash: <strong>'+ (isUndefined(cities[i][CITY_CASH])) ? 'unknown</strong><br>' : cities[i][CITY_CASH_SYMBOL] + makeCommaValue(cities[i][CITY_CASH])+'</strong><br>';
      }
      settingsDump+=
        '-------------------General Tab--------------------------<br>' +
        'Enable auto-refresh: <strong>'+ showIfUnchecked(GM_getValue('autoClick'))+ '</strong><br>' +
        '&nbsp;&nbsp;-Refresh rate low: <strong>'+ GM_getValue('r1')+'</strong><br>' +
        '&nbsp;&nbsp;-Refresh rate high: <strong>'+ GM_getValue('r2')+'</strong><br>' +
        'Enable auto-pause: <strong>'+ showIfUnchecked(GM_getValue('autoPause'))+'</strong><br>' +
        '&nbsp;&nbsp;-After level up: <strong>'+ showIfSelected(GM_getValue('autoPauseAfter'))+'</strong><br>' +
        '&nbsp;&nbsp;-Before level up: <strong>'+ showIfSelected(GM_getValue('autoPauseBefore'))+'</strong><br>' +
        '&nbsp;&nbsp;-Exp to pause at: <strong>'+ GM_getValue('autoPauseExp')+'</strong><br>' +
        'Delay rate low: <strong>'+ GM_getValue('d1')+'</strong><br>' +
        'Delay rate high: <strong>'+ GM_getValue('d2')+'</strong><br>' +
        'Idle in City: <strong>'+ showIfUnchecked(GM_getValue('idleInCity'))+'</strong><br>' +
        '&nbsp;&nbsp;Selected city: <strong>'+ cities[GM_getValue('idleLocation', NY)][CITY_NAME]+'</strong><br>' +
        'Enable auto-Daily Chance: <strong>'+ showIfUnchecked(GM_getValue('autoLottoOpt'))+'</strong><br>' +
        'Enable collect Daily Chance bonus: <strong>'+ showIfUnchecked(GM_getValue('autoLottoBonus')) +' == '+ autoLottoBonusList[GM_getValue('autoLottoList', 0)]+'</strong><br>' +
        'Spend all: <strong>'+ showIfUnchecked(GM_getValue('burnFirst'))+' == '+ burnModes[GM_getValue('burnOption')]+'</strong><br>' +
        'Popup Processing: <strong>'+ showIfUnchecked(GM_getValue('autoProcessPopups'))+'</strong><br>' +
        //'autoDailyTake: <strong>'+ showIfUnchecked(GM_getValue('autoDailyTake'))+'</strong><br>' +
        '---------------------Display Tab--------------------<br>' +
        'Show Text Labels: <strong>'+ showIfUnchecked(GM_getValue('textOnlyMode'))+'</strong><br>' +
        'Enable logging: <strong>'+ showIfUnchecked(GM_getValue('autoLog'))+'</strong><br>' +
        '&nbsp;&nbsp;-Logging length: <strong>'+ GM_getValue('autoLogLength')+'</strong><br>' +
        'Log player updates: <strong>'+ showIfUnchecked(GM_getValue('logPlayerUpdates'))+'</strong><br>' +
        '&nbsp;&nbsp;-Updates length: <strong>'+ GM_getValue('logPlayerUpdatesMax')+'</strong><br>' +
        'Enable log filtering: <strong>'+ showIfUnchecked(GM_getValue('filterLog'))+'</strong><br>' +
        '&nbsp;&nbsp;Filter mode: <strong>'+ GM_getValue('filterOpt')+'</strong><br>' +
        '&nbsp;&nbsp;Filter pass: <strong>'+ GM_getValue('filterPass')+'</strong><br>' +
        '&nbsp;&nbsp;Filter fail: <strong>'+ GM_getValue('filterFail')+'</strong><br>' +
        'Left-align main frame: <strong>'+ showIfUnchecked(GM_getValue('leftAlign'))+'</strong><br>' +
        'Elevate PS MWAP-Header: <strong>'+ showIfUnchecked(GM_getValue('mastheadOnTop'))+'</strong><br>' +
        'Hide All: <strong>'+ showIfUnchecked(GM_getValue('hideAll'))+'</strong><br>' +
        'Show pulse on the fight page: <strong>'+ showIfUnchecked(GM_getValue('showPulse'))+'</strong><br>' +
        'Show level on the hitlist page: <strong>'+ showIfUnchecked(GM_getValue('showLevel'))+'</strong><br>' +
        'Set window title to name on Facebook account: <strong>'+ showIfUnchecked(GM_getValue('fbwindowtitle'))+'</strong><br>' +
        '---------------------Mafia Tab--------------------<br>' +
        'Automatically asks for job help: <strong>'+ showIfUnchecked(GM_getValue('autoAskJobHelp'))+'</strong><br>' +
        'Minimum experience for job help: <strong>'+ GM_getValue('autoAskJobHelpMinExp')+'</strong><br>' +
        'Ask for Vegas help: <strong>'+ GM_getValue('selectVegasTier')+'</strong><br>' +
        'Ask for Italy help: <strong>'+ GM_getValue('selectItalyTier')+'</strong><br>' +
        'Ask for Brazil help: <strong>'+ GM_getValue('selectBrazilTier')+'</strong><br>' +
        'Ask for Chicago help: <strong>'+ GM_getValue('selectChicagoTier')+'</strong><br>' +
        'Miscellaneous publishing: <br>' +
        '&nbsp;&nbsp;Enable FB Wall Publishing: <strong>'+ showIfUnchecked(GM_getValue('autoGlobalPublishing'))+'</strong><br>' +
        '&nbsp;&nbsp;Ice bonus: <strong>'+ showIfUnchecked(GM_getValue('autoIcePublish'))+'</strong><br>' +
        '&nbsp;&nbsp;Ice bonus Frequency: <strong>'+ GM_getValue('autoIcePublishFrequency')+'</strong><br>' +
        '&nbsp;&nbsp;Automatically share wishlist: <strong>'+ showIfUnchecked(GM_getValue('autoShareWishlist'))+'</strong><br>' +
        '&nbsp;&nbsp;Hour interval for sharing wishlist: <strong>'+ GM_getValue('autoShareWishlistTime')+'</strong><br>' +
        'Accept mafia invitations: <strong>'+ showIfUnchecked(GM_getValue('acceptMafiaInvitations'))+'</strong><br>' +
        'Automatically ask to Join Brazil Crew: <strong>'+ showIfUnchecked(GM_getValue('autoAskCityCrew'))+'</strong><br>' +
        'Automatically ask to Join Chicago Crew: <strong>'+ showIfUnchecked(GM_getValue('autoAskChicagoCrew'))+'</strong><br>' +
        'Automatically ask for Help on Crew Collections: <strong>'+ showIfUnchecked(GM_getValue('autoAskHelponCC'))+'</strong><br>' +
        'Automatically Help on Jobs: <strong>'+ showIfUnchecked(GM_getValue('autoHelp'))+'</strong><br>' +
        'Automatically Help on Wars: <strong>'+ showIfUnchecked(GM_getValue('autoWarHelp'))+'</strong><br>' +
        'Automatically Help on Burners: <strong>'+ showIfUnchecked(GM_getValue('autoBurnerHelp'))+'</strong><br>' +
        'Automatically Help on Parts: <strong>'+ showIfUnchecked(GM_getValue('autoPartsHelp'))+'</strong><br>' +
        'Message Center : Auto Accept Gifts: <strong>'+ showIfUnchecked(GM_getValue('autoAcceptMsgGifts')) +'</strong><br>' +
        'Message Center : Auto Accept Boosts: <strong>'+ showIfUnchecked(GM_getValue('autoAcceptMsgBoosts')) +'</strong><br>' +
        'Message Center : Auto Accept Crew: <strong>'+ showIfUnchecked(GM_getValue('autoAcceptMsgCrew')) +'</strong><br>' +
        'Message Center : Auto Send Eneryg: <strong>'+ showIfUnchecked(GM_getValue('autosendMsgEnergyPack')) +'</strong><br>' +
        'Auto War: <strong>'+ showIfUnchecked(GM_getValue('autoWar')) +'</strong><br>' +
        '&nbsp;&nbsp;War Mode: <strong>'+ warModeChoices[GM_getValue('warMode', 0)] +'</strong><br>' +
        '&nbsp;&nbsp;Auto War Target List: <strong>'+ GM_getValue('autoWarTargetList', 0)+'</strong><br>' +
        '-----------------Family-----------------<br>' +
        'Enable Mafia Operations: <strong>'+ showIfUnchecked(GM_getValue('AutoMafiaMission'))+'</strong><br>' +
        'Ask Mission Help: <strong>'+ showIfUnchecked(GM_getValue('AskMissionHelp'))+'</strong><br>' +
        'Autostart Personal Operations: <strong>'+ showIfUnchecked(GM_getValue('AutoStartOperations'))+'</strong><br>' +
        'Autoretry Personal Operations: <strong>'+ showIfUnchecked(GM_getValue('AutoRetryOperations'))+'</strong><br>' +
        'Collect Operation Rewards: <strong>'+ showIfUnchecked(GM_getValue('AutoMafiaCollection'))+'</strong><br>' +
        'Do Mafia Operations: <strong>'+ showIfUnchecked(GM_getValue('AutoMafiaJob'))+'</strong><br>' +
        'Delete Operations Removed From: <strong>'+ showIfUnchecked(GM_getValue('AutoMafiaRemoved'))+'</strong><br>' +
        'CollectMissionsTimer: '+ getHoursTime('colmissionTimer')+'</strong><br>' +
        'CheckedMyMissionsTimer: '+ getHoursTime('checkedmymissionTimer')+'</strong><br>' +
        '-------------------Autostat Tab--------------------<br>' +
        'Enable auto-stat: <strong>'+ showIfUnchecked(GM_getValue('autoStat'))+'</strong><br>' +
        'Disable auto-stat: <strong>'+ showIfUnchecked(GM_getValue('autoStatDisable'))+'</strong><br>' +
        '&nbsp;&nbsp;-Attack Base: <strong>'+ GM_getValue('autoStatAttackBase')+'</strong><br>' +
        '&nbsp;&nbsp;-Defense Base: <strong>'+ GM_getValue('autoStatDefenseBase')+'</strong><br>' +
        '&nbsp;&nbsp;-Health Base: <strong>'+ GM_getValue('autoStatHealthBase')+'</strong><br>' +
        '&nbsp;&nbsp;-Energy Base: <strong>'+ GM_getValue('autoStatEnergyBase')+'</strong><br>' +
        '&nbsp;&nbsp;-Stamina Base: <strong>'+ GM_getValue('autoStatStaminaBase')+'</strong><br>' +
        '&nbsp;&nbsp;-Attack Ratio: <strong>'+ GM_getValue('autoStatAttackRatio')+'</strong><br>' +
        '&nbsp;&nbsp;-Defense Ratio: <strong>'+ GM_getValue('autoStatDefenseRatio')+'</strong><br>' +
        '&nbsp;&nbsp;-Health Ratio: <strong>'+ GM_getValue('autoStatHealthRatio')+'</strong><br>' +
        '&nbsp;&nbsp;-Energy Ratio: <strong>'+ GM_getValue('autoStatEnergyRatio')+'</strong><br>' +
        '&nbsp;&nbsp;-Stamina Ratio: <strong>'+ GM_getValue('autoStatStaminaRatio')+'</strong><br>' +
        '&nbsp;&nbsp;-Attack Mode: <strong>'+ GM_getValue('autoStatAttackMode')+'</strong><br>' +
        '&nbsp;&nbsp;-Defense Mode: <strong>'+ GM_getValue('autoStatDefenseMode')+'</strong><br>' +
        '&nbsp;&nbsp;-Health Mode: <strong>'+ GM_getValue('autoStatHealthMode')+'</strong><br>' +
        '&nbsp;&nbsp;-Energy Mode: <strong>'+ GM_getValue('autoStatEnergyMode')+'</strong><br>' +
        '&nbsp;&nbsp;-Stamina Mode: <strong>'+ GM_getValue('autoStatStaminaMode')+'</strong><br>' +
        '&nbsp;&nbsp;-Attack Prio: <strong>'+ GM_getValue('autoStatAttackPrio')+'</strong><br>' +
        '&nbsp;&nbsp;-Defense Prio: <strong>'+ GM_getValue('autoStatDefensePrio')+'</strong><br>' +
        '&nbsp;&nbsp;-Health Prio: <strong>'+ GM_getValue('autoStatHealthPrio')+'</strong><br>' +
        '&nbsp;&nbsp;-Energy Prio: <strong>'+ GM_getValue('autoStatEnergyPrio')+'</strong><br>' +
        '&nbsp;&nbsp;-Stamina Prio: <strong>'+ GM_getValue('autoStatStaminaPrio')+'</strong><br>' +
        '&nbsp;&nbsp;-Attack Fallback: <strong>'+ GM_getValue('autoStatAttackFallback')+'</strong><br>' +
        '&nbsp;&nbsp;-Defense Fallback: <strong>'+ GM_getValue('autoStatDefenseFallback')+'</strong><br>' +
        '&nbsp;&nbsp;-Health Fallback: <strong>'+ GM_getValue('autoStatHealthFallback')+'</strong><br>' +
        '&nbsp;&nbsp;-Energy Fallback: <strong>'+ GM_getValue('autoStatEnergyFallback')+'</strong><br>' +
        '&nbsp;&nbsp;-Stamina Fallback: <strong>'+ GM_getValue('autoStatStaminaFallback')+'</strong><br>' +
        '&nbsp;&nbsp;-Rest AutoStat: <strong>'+ GM_getValue('restAutoStat')+'</strong><br>' +
        '&nbsp;&nbsp;-Next Stat: <strong>'+ GM_getValue('nextStat')+'</strong><br>' +
        '-------------------Energy Tab--------------------<br>' +
        'Enable auto-mission: <strong>'+ showIfUnchecked(GM_getValue('autoMission'))+'</strong><br>' +
        '&nbsp;&nbsp;-Repeat Job: <strong>'+ showIfUnchecked(GM_getValue('repeatJob'))+'</strong><br>' +
        '&nbsp;&nbsp;-Job selected: <strong>'+ missions[GM_getValue('selectMission')][MISSION_NAME]+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;-Jobs: <strong>'+ ratioJobs+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;-Mastery Tier: <strong>'+ selectTier+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;-Optimize at end level: <strong>'+ showIfUnchecked(GM_getValue('endLevelOptimize'))+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;-Optimize at end level NY Only: <strong>'+ showIfUnchecked(GM_getValue('endLevelNYOnly'))+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;-Force Autowithdraw: <strong>'+ showIfUnchecked(GM_getValue('autoWithDraw'))+'</strong><br>' +
        'Enable Boss Fights: <strong>'+ showIfUnchecked(GM_getValue('autoFightAgostino'))+'</strong><br>' +
        'Enable auto-energy pack: <strong>'+ showIfUnchecked(GM_getValue('autoEnergyPack'))+'</strong><br>' +
        'Estimated job ratio: <strong>'+ GM_getValue('estimateJobRatio')+'</strong><br>' +
        'Has helicopter: <strong>'+ showIfUnchecked(GM_getValue('hasHelicopter'))+'</strong><br>' +
        'Has golden throne: <strong>'+ showIfUnchecked(GM_getValue('hasGoldenThrone'))+'</strong><br>' +
        'Is Maniac: <strong>'+ showIfUnchecked(GM_getValue('isManiac'))+'</strong><br>' +
        'Auto ask Energy pack: <strong>'+ showIfUnchecked(GM_getValue('askEnergyPack'))+'</strong><br>' +
        'Auto ask Power pack: <strong>'+ showIfUnchecked(GM_getValue('askPowerPack'))+'</strong><br>' +
        'Skip Fighting In Job Tier Mastery: <strong>'+ showIfUnchecked(GM_getValue('skipfight'))+'</strong><br>' +
        'Check for mini Energy Packs: <strong>'+ showIfUnchecked(GM_getValue('checkMiniPack'))+'</strong><br>' +
        'Energy threshold: <strong>'+ GM_getValue('selectEnergyUse')+' '+ numberSchemes[GM_getValue('selectEnergyUseMode', 0)]+' (refill to '+ SpendEnergy.ceiling+')</strong><br>' +
        'Energy reserve: <strong>'+ + GM_getValue('selectEnergyKeep')+' '+ numberSchemes[GM_getValue('selectEnergyKeepMode', 0)]+' (keep above '+ SpendEnergy.floor+')</strong><br>' +
        '&nbsp;&nbsp;-Energy use started: <strong>'+ GM_getValue('useEnergyStarted')+'</strong><br>' +
        '&nbsp;&nbsp;Ignore reserve to level-up: <strong>'+ showIfUnchecked(GM_getValue('allowEnergyToLevelUp'))+'</strong><br>' +
        'Mission Energy reserve: <strong>'+ + GM_getValue('selectMissionEnergyKeep')+' '+ numberSchemes[GM_getValue('selectMissionEnergyKeepMode', 0)]+' (keep above '+ SpendMissionEnergy.floor+')</strong><br>' +
        '&nbsp;&nbsp;Ignore reserve to level-up: <strong>'+ showIfUnchecked(GM_getValue('allowMissionEnergyToLevelUp'))+'</strong><br>' +
        'autoEnergyPackForce: <strong>'+ showIfUnchecked(GM_getValue('autoEnergyPackForce'))+'</strong><br>' +
        '&nbsp;&nbsp;-autoEnergyPackForcePts: <strong>'+ GM_getValue('autoEnergyPackForcePts')+'</strong><br>' +
        '-------------------Stamina Tab-------------------<br>' +
        'Spend stamina: <strong>'+ showIfUnchecked(GM_getValue('staminaSpend'))+'</strong><br>' +
        'Log Details: <strong>'+ showIfUnchecked(GM_getValue('staminaLogDetails'))+'</strong><br>' +
        'How: <strong>'+ staminaSpendChoices[GM_getValue('staminaSpendHow', 0)]+'</strong><br>' +
        '&nbsp;&nbsp;Fast Rob?: <strong>'+ showIfUnchecked(GM_getValue('fastrob'))+'</strong><br>' +
        '&nbsp;&nbsp;Use Burners?: <strong>'+ showIfUnchecked(GM_getValue('useBurners'))+'</strong><br>' +
        '&nbsp;&nbsp;Use Rob Squads?: <strong>'+ showIfUnchecked(GM_getValue('useRobSquads'))+'</strong><br>' +
        '&nbsp;&nbsp;RobFight StaminaFloor?: <strong>'+ GM_getValue('robFightStaminaFloor')+'</strong><br>' +
        '&nbsp;&nbsp;Skip iced targets: <strong>'+ showIfUnchecked(GM_getValue('iceCheck'))+'</strong><br>' +
        '&nbsp;&nbsp;-Fight in: <strong>'+ fightLocations[GM_getValue('fightLocation', 0)]+'</strong><br>' +
        '&nbsp;&nbsp;-Reattack <strong>'+ showIfUnchecked(GM_getValue('staminaReattack'))+'</strong><br>' +
        '&nbsp;&nbsp;-Reattack threshold:<strong>'+ GM_getValue('reattackThreshold')+'</strong><br>' +
        '&nbsp;&nbsp;-Powerattack <strong>'+ showIfUnchecked(GM_getValue('staminaPowerattack'))+'</strong><br>' +
        '&nbsp;&nbsp;-Max Number of Attacks per Opponent: <strong>'+ GM_getValue('fightMaxAttacks')+')</strong><br>' +
        '&nbsp;&nbsp;-Random fight max level: <strong>'+ GM_getValue('fightLevelMax')+' ('+ showIfRelative('fightLevelMaxRelative')+')</strong><br>' +
        '&nbsp;&nbsp;-Random fight max mafia: <strong>'+ GM_getValue('fightMafiaMax')+' ('+ showIfRelative('fightMafiaMaxRelative')+')</strong><br>' +
        '&nbsp;&nbsp;-Random fight min mafia: <strong>'+ GM_getValue('fightMafiaMin')+' ('+ showIfRelative('fightMafiaMinRelative')+')</strong><br>' +
        '&nbsp;&nbsp;-Random fight max health: <strong>'+ GM_getValue('fightHealthMax')+')</strong><br>' +
        '&nbsp;&nbsp;-Random fight max health pct: <strong>'+ GM_getValue('fightHealthPctMax')+')</strong><br>' +
        '&nbsp;&nbsp;-Fight Labels: <strong>'+ fightLabels[GM_getValue('fightLabelCriteria', 0)]+'</strong><br>' +
        '&nbsp;&nbsp;-Random fight use Patterns: <strong>'+ showIfUnchecked(GM_getValue('fightNames'))+'</strong><br>' +
        '&nbsp;&nbsp;-Random fight avoid names: <strong>'+ showIfUnchecked(GM_getValue('fightAvoidNames'))+'</strong><br>' +
        '&nbsp;&nbsp;-Random fight specific names: <strong>'+ showIfUnchecked(GM_getValue('fightOnlyNames'))+'</strong><br>' +
        'Families list: <strong>'+ encodeURI(GM_getValue('fightClanName'))+'</strong><br>' +
        '&nbsp;&nbsp;-List fight opponents: <strong>'+ GM_getValue('pfightlist')+'</strong><br>' +
        '&nbsp;&nbsp;-List fight remove stronger: <strong>'+ showIfUnchecked(GM_getValue('fightRemoveStronger'))+'</strong><br>' +
        '&nbsp;&nbsp;-Collect hitman bounties in: <strong>'+ locations[GM_getValue('hitmanLocation', 0)]+'</strong><br>' +
        '&nbsp;&nbsp;-Hitman min bounty: <strong>'+ parseCash(GM_getValue('hitmanBountyMin'))+'</strong><br>' +
        '&nbsp;&nbsp;-Hitman bounty selection: <strong>'+ bountySelectionChoices[(GM_getValue('bountySelection'))]+'</strong><br>' +
        '&nbsp;&nbsp;-Hitman use Patterns: <strong>'+ showIfUnchecked(GM_getValue('hitmanNames'))+'</strong><br>' +
        '&nbsp;&nbsp;-Hitman avoid names: <strong>'+ showIfUnchecked(GM_getValue('hitmanAvoidNames'))+'</strong><br>' +
        '&nbsp;&nbsp;-Hitman specific names: <strong>'+ showIfUnchecked(GM_getValue('hitmanOnlyNames'))+'</strong><br>' +
        'Families list: <strong>'+ encodeURI(GM_getValue('hitmanClanName'))+'</strong><br>' +
        '&nbsp;&nbsp;-Rob in: <strong>'+ locations[GM_getValue('robLocation', NY)]+'</strong><br>' +
        '&nbsp;&nbsp;-AutoHit bounty: <strong>'+ parseCash(GM_getValue('autoHitListBounty'))+'</strong><br>' +
        '&nbsp;&nbsp;-Set Bounties in: <strong>'+ locations[GM_getValue('autoHitListLoc', 0)]+'</strong><br>' +
        '&nbsp;&nbsp;-Random <strong>'+ showIfUnchecked(GM_getValue('autoHitListRandom'))+'</strong><br>' +
        '&nbsp;&nbsp;-AutoHit opponents: <strong>'+ GM_getValue('pautoHitOpponentList')+'</strong><br>' +
        '&nbsp;&nbsp;-AutoHit background: <strong>'+ showIfUnchecked(GM_getValue('bgAutoHitCheck'))+'</strong><br>' +
        '&nbsp;&nbsp;-Random Stam Spend - Fight in: <strong>'+ GM_getValue('randomFightLocations')+'</strong><br>' +
        '&nbsp;&nbsp;-Random Stam Spend - Rob in: <strong>'+ GM_getValue('randomRobLocations')+'</strong><br>' +
        '&nbsp;&nbsp;-Random Stam Spend - Hit in: <strong>'+ GM_getValue('randomHitmanLocations')+'</strong><br>' +
        'Stamina threshold: <strong>'+ GM_getValue('selectStaminaUse')+' '+ numberSchemes[GM_getValue('selectStaminaUseMode', 0)]+' (refill to '+ SpendStamina.ceiling+')</strong><br>' +
        '&nbsp;&nbsp;-Stamina use started: <strong>'+ GM_getValue('useStaminaStarted')+'</strong><br>' +
        'Stamina Jobs & Fights reserve: <strong>'+ + GM_getValue('selectStaminaKeep')+' '+ numberSchemes[GM_getValue('selectStaminaKeepMode', 0)]+' (keep above '+ SpendStamina.floor+')</strong><br>' +
        'Stamina Manual reserve: <strong>'+ + GM_getValue('selectMissionStaminaKeep')+' '+ numberSchemes[GM_getValue('selectMissionStaminaKeepMode', 0)]+' (Operations will keep above '+ SpendMissionStamina.floor+')</strong><br>' +
        'Ignore reserve to level-up: <strong>'+ showIfUnchecked(GM_getValue('allowStaminaToLevelUp'))+'</strong><br>' +
        '------------------Health Tab-------------------<br>' +
        'Enable auto-heal: <strong>'+ showIfUnchecked(GM_getValue('autoHeal'))+'</strong><br>' +
        '&nbsp;&nbsp;auto-heal backup: <strong>'+ showIfUnchecked(GM_getValue('autoHealBackUp'))+'</strong><br>' +
        '&nbsp;&nbsp;-Heal in : <strong>'+ locations[GM_getValue('healLocation')]+'</strong><br>' +
        '&nbsp;&nbsp;-Minimum health: <strong>'+ GM_getValue('healthLevel')+'</strong><br>' +
        '&nbsp;&nbsp;-Attack at critical health: <strong>'+ showIfUnchecked(GM_getValue('attackCritical'))+'</strong><br>' +
        '&nbsp;&nbsp;-Hide in Hospital: <strong>'+ showIfUnchecked(GM_getValue('hideInHospital'))+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;-Heal if health is above 19: <strong>'+ showIfUnchecked(GM_getValue('forceHealOpt7'))+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;-Heal after 5 minutes: <strong>'+ showIfUnchecked(GM_getValue('forceHealOpt5'))+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;-Heal when stamina is full: <strong>'+ showIfUnchecked(GM_getValue('forceHealOpt4'))+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;-Heal when stamina can be spent: <strong>'+ showIfUnchecked(GM_getValue('forceHealOpt3'))+'</strong><br>' +
        '&nbsp;&nbsp;&nbsp;-Minimum Stamina Allowing auto-Heal: <strong>'+ GM_getValue('stamina_min_heal')+'</strong><br>' +
        'Hitlist riding: <strong>'+ showIfUnchecked(GM_getValue('hideAttacks'))+'</strong><br>' +
        '&nbsp;&nbsp;Hitlist riding XP limit: <strong>'+ GM_getValue('rideHitlistXP')+'</strong><br>' +
        'Stop PA: <strong>'+ showIfUnchecked(GM_getValue('stopPA'))+'</strong><br>' +
        '&nbsp;&nbsp;when health falls below: <strong>'+ GM_getValue('stopPAHealth')+'</strong><br>' +
        '------------------Cash Tab-------------------<br>' +
        'Collect Takes: <strong>'+ showIfUnchecked(GM_getValue('collectTakeNew York'))+'</strong><br>' +
        'Collect BRAZIL Take: <strong>'+ showIfUnchecked(GM_getValue('collectTakeBrazil'))+'</strong><br>' +
        'Collect CHICAGO Take: <strong>'+ showIfUnchecked(GM_getValue('collectTakeChicago'))+'</strong><br>' +
        '&nbsp;&nbsp;-Next take at NY:'+ timeLeftGM('takeHourNew York')+'</strong><br>' +
        '&nbsp;&nbsp;-Next take at LV:'+ timeLeftGM('takeHourLas Vegas')+'</strong><br>' +
        '&nbsp;&nbsp;-Next take at Italy:'+ timeLeftGM('takeHourItaly')+'</strong><br>' +
        'Collect Parts: <strong>'+ showIfUnchecked(GM_getValue('collectParts'))+'</strong><br>' +
        '&nbsp;&nbsp;-Next take at :'+ timeLeftGM('partsHour')+'</strong><br>'+
        '';

      for(ctCount=0;ctCount < ctLength;ctCount++){
        propItemId = cityProperties[ctCount][ctGMId]+'Id';

      settingsDump+=
          cityProperties[ctCount][ctText]+': <strong>'+ showIfUnchecked(GM_getValue(cityProperties[ctCount][ctGMId]))+'</strong><br>' +
          '&nbsp;&nbsp;Item Type: <strong>'+ cityProperties[ctCount][ctArray][GM_getValue(propItemId, 0)][0]+'</strong><br>';
      }

      for(ctCount=0,cpLength=cityParts.length;ctCount < cpLength;ctCount++){
        propItemId = cityParts[ctCount][ptGMId]+'Id';

      settingsDump+=
          cityParts[ctCount][ptTitle]+': <strong>'+ showIfUnchecked(GM_getValue(cityParts[ctCount][ptGMId]))+'</strong><br>' +
          '&nbsp;&nbsp;Item Type: <strong>'+ cityParts[ctCount][ptArray][GM_getValue(propItemId, 0)][0]+'</strong><br>';
      }

      settingsDump +=
        'Ask for Event Parts: <strong>'+ showIfUnchecked(GM_getValue('askEventParts'))+'</strong><br>' +
        'Ask for Rob Squads: <strong>'+ showIfUnchecked(GM_getValue('autoAskRobSquads'))+'</strong><br>' +
        'Ask for New Parts: <strong>'+ showIfUnchecked(GM_getValue('askNewParts'))+'</strong><br>' +
        '&nbsp;&nbsp;Part Type: <strong>'+ cityNewParts[GM_getValue('askNewPartsId', 9)][0]+'</strong><br>' +
        'Ask for Casino Parts: <strong>'+ showIfUnchecked(GM_getValue('askCasinoParts'))+'</strong><br>' +
        '&nbsp;&nbsp;Part Type: <strong>'+ cityCasinoParts[GM_getValue('askCasinoPartsId', 9)][0]+'</strong><br>' +
        'Ask for Play Slots: <strong>'+ showIfUnchecked(GM_getValue('askPlaySlots'))+'</strong><br>' +
        'Ask for Village Parts: <strong>'+ showIfUnchecked(GM_getValue('askVillageParts'))+'</strong><br>' +
        '&nbsp;&nbsp;Part Type: <strong>'+ cityVillageParts[GM_getValue('askVillagePartsId', 9)][0]+'</strong><br>' +
        'Ask for Football Fans: <strong>'+ showIfUnchecked(GM_getValue('askFootballFans'))+'</strong><br>' +
        'Ask for Brazil Parts: <strong>'+ showIfUnchecked(GM_getValue('askBrazilParts'))+'</strong><br>' +
        '&nbsp;&nbsp;Part Type: <strong>'+ cityBrazilParts[GM_getValue('askBrazilPartsId', 9)][0]+'</strong><br>' +
        'Ask for chicago Parts: <strong>'+ showIfUnchecked(GM_getValue('askChicagoParts'))+'</strong><br>' +
        '&nbsp;&nbsp;Part Type: <strong>'+ cityChicagoParts[GM_getValue('askChicagoPartsId', 9)][0]+'</strong><br>' +
        'Enable auto-bank in NY: <strong>'+ showIfUnchecked(GM_getValue('autoBank'))+'</strong><br>' +
        '&nbsp;&nbsp;-Minimum deposit: $<strong>'+ GM_getValue('bankConfig')+'</strong><br>' +
        'Enable auto-bank in Vegas: <strong>'+ showIfUnchecked(GM_getValue('autoBankVegas'))+'</strong><br>' +
        '&nbsp;&nbsp;-Minimum deposit: V$<strong>'+ GM_getValue('bankConfigVegas')+'</strong><br>' +
        '&nbsp;&nbsp;-Vault Level: <strong>'+ GM_getValue('vaultHandling')+'</strong><br>' +
        '&nbsp;&nbsp;-Free vault space: V$<strong>'+ makeCommaValue(GM_getValue('vaultSpace'))+'</strong><br>' +
        'autoUpgrade NY: <strong>'+ autoUpgradeNYChoices[GM_getValue('autoUpgradeNYChoice', 0)]+'</strong><br>' +
        '&nbsp;&nbsp;-Min Bank Balance: $<strong>'+ GM_getValue('userMinBalance')+'</strong><br>' +
        '------------------About Tab-------------------<br>' +
        'Testing New Script Updates: <strong>'+ showIfUnchecked(GM_getValue('TestChanges'))+'</strong><br>' +
        '-  -  -  -  -  END SETTINGS DUMP  -  -  -  -  -';
      DEBUG(settingsDump);
} catch (bugErr){
  DEBUG(bugErr);
}
}

// This function returns false if some further action has been taken and the
// caller should not make additional calls until that action has completed.
function parsePlayerUpdates(messagebox){
  // Get the timestamp (e.g. "3 minutes ago")
  var minutesAgo = xpathFirst('.//div[@class="update_timestamp"]', messagebox);
  minutesAgo = minutesAgo? minutesAgo.innerHTML+' ' : '';
  minutesAgo = minutesAgo.indexOf('0') == 0? '' : minutesAgo;

  // Get the text and links.
  var messageTextElt = xpathFirst('.//div[@class="update_txt"]', messagebox);
  if(!messageTextElt){
    addToLog('warning Icon', 'BUG DETECTED: Unable to read update text.');
    return true;
  }
  var messageText = messageTextElt.innerHTML;
  var messageTextNoTags = messageText.untag();
  var links = messageTextElt.getElementsByTagName('a');
  var cost, user, result, userElt, elt, hitman;

  //DEBUG(messageTextNoTags);

  if(messageTextNoTags.indexOf('your war') != -1){
    addToLog('updateBad Icon', minutesAgo+' '+messageText);
  }
  else if(messageTextNoTags.indexOf('attacked') != -1){
     var attackCount = 1;
    // Attacked by some fool with a death wish.
    user = linkToString(links[0], 'user')
    if(links.length>1){
      user +=' '+linkToString(links[1], 'user');
    }
    result = 'Attacked';
    if(links[0] && links[0].nextSibling && links[0].nextSibling.nodeValue &&
        links[0].nextSibling.nodeValue.match(/(\d+) times/i)){
      attackCount = parseInt( RegExp.$1);
      result += ' '+ RegExp.lastMatch;
    } else {
      if(messageTextNoTags.match(/(\d+) times/i)){
        attackCount = parseInt(RegExp.$1);
        result += ' '+ RegExp.lastMatch;
      }
    }

    result += ' by '+ user;

    var needStatUpdate = false;
    if(messageTextNoTags.match(/you won.*you gained .*?(\d+) experience points?.*?([A-Z]*?\$|\u00A2)([\d,]*\d)/i)){
      // The fight was won.
      cost = RegExp.$2+RegExp.$3;
      var experience = RegExp.$1;
      result += ' and <span class="good">WON</span>, gaining <span class="good">'+ cost+'</span> and ' +
        '<span class="good">'+ experience+' experience</span>.';
      var cashLoc = parseCashLoc(cost);
      cost = parseCash(cost);
      experience = parseInt(experience);
      GM_setValue('passivetotalFightExpInt', parseInt(GM_getValue('passivetotalFightExpInt', 0) + experience));
      GM_setValue('passivefightWinCountInt', parseInt(GM_getValue('passivefightWinCountInt', 0) + attackCount));
      needStatUpdate = true;

      if(isGMChecked('hideAttacks')){
        DEBUG('Riding Hitlist fight won.');
        GM_setValue('currentHitXp', parseInt((GM_getValue('currentHitXp', 0)) + experience));
        GM_setValue('currentHitDollars', String(parseInt(GM_getValue('currentHitDollars', 0)) + cost));
        DEBUG(result);
        if(isGMChecked('autoHeal')){
          if(GM_getValue('rideHitlistXP', 0) == 0 && experience == 0 && GM_getValue('currentHitXp', 0) > 12){
            DEBUG('Zero experience detected; turning off auto-heal.<br>(currentHitXp = '+ GM_getValue('currentHitXp', 0)+')');
            GM_setValue('autoHeal', 0);
          } else if(GM_getValue('rideHitlistXP', 0) > 0 && GM_getValue('currentHitXp', 0) >= GM_getValue('rideHitlistXP', 0)){
            DEBUG(GM_getValue('currentHitXp', 0)+' experience accumulated; turning off auto-heal.');
            GM_setValue('autoHeal', 0);
          }
        }
      } else {
        addToLog('updateGood Icon', minutesAgo + result);
      }

      if(cost){
        GM_setValue(cityStats[cashLoc][passivecashWins], GM_getValue(cityStats[cashLoc][passivecashWins], 0) + cost);
        needStatUpdate = true;
      }
    } else if(messageTextNoTags.match(/([A-Z]*?\$|\u00A2)([\d,]*\d)/i)){

      // The fight was lost.
      cost = messageTextNoTags.match(REGEX_CASH)[0];
      result += ' and <span class="bad">LOST</span>, losing <span class="bad">'+ cost+'</span>.';
      var cashLoc = parseCashLoc(cost);
      cost = parseCash(cost);
      GM_setValue('passivefightLossCountInt', GM_getValue('passivefightLossCountInt', 0) + attackCount);
      needStatUpdate = true;

      if(isGMChecked('hideAttacks')){
        DEBUG('Ride Hitlist fight lost.');
        GM_setValue('currentHitDollars', String(parseInt(GM_getValue('currentHitDollars', 0)) - cost));
        DEBUG(result);
      } else {
        addToLog('updateBad Icon', minutesAgo + result);
      }

      if(cost){
        GM_setValue(cityStats[cashLoc][passivecashLosses], GM_getValue(cityStats[cashLoc][passivecashLosses], 0) + cost);
        needStatUpdate = true;
      }
    } else if(messageTextNoTags.match(/taking (\d+) damage/i)){
      result += ' and <span class="bad">LOST</span>, taking <span class="bad">'+RegExp.$1+'</span> damage .';
      addToLog('updateBad Icon', minutesAgo + result);
    } else if(messageTextNoTags.match(/stole your turkey/i)){
      result += ' and <span class="bad">your turkey</span> was stolen.';
      addToLog('updateBad Icon', minutesAgo + result);
    } else if(messageTextNoTags.match(/protection/i)){
      result += ' and <span class="bad">a turkey protection </span> was removed.';
      addToLog('updateBad Icon', minutesAgo + result);
    } else {
      addToLog('warning Icon', 'BUG DETECTED: Unable to read update win/loss.');
    }
    if(needStatUpdate) updateLogStats();
  } else if(messageTextNoTags.indexOf('You were snuffed') != -1){
    // Death. Ouch.
    GM_setValue('snuffCount', parseInt( GM_getValue('snuffCount', 0) + 1));
    needStatUpdate = true;
    addToLog('updateBad Icon', minutesAgo+'You <span class="bad">'+'DIED'+'</span>.');

    GM_setValue('passivetotalFightExpInt', parseInt(GM_getValue('passivetotalFightExpInt', 0)) - 6);
  } else if(messageTextNoTags.indexOf('You were knocked out') != -1){
    // Hitlist ride has ended.
    hitman = linkToString(links[0], 'user');
    user = linkToString(links[1], 'attacker');
    if(links.length>2){
      hitman +=' '+linkToString(links[1], 'user');
      user = linkToString(links[2], 'attacker');
    }

    var bounty = parseCash(messageTextNoTags.split(' who claimed the ')[1]);
    result = 'Whacked by '+ hitman+' who claimed the $' +
             makeCommaValue(parseInt(bounty))+' bounty set by ' +
             user+'.';

    GM_setValue('whackedCount', parseInt( GM_getValue('whackedCount', 0) + 1));
    needStatUpdate = true;

    if(isGMChecked('hideAttacks')){
      DEBUG('Whacked riding hitlist.');
      GM_setValue('currentHitXp', parseInt(GM_getValue('currentHitXp', 0)) - 6);
      GM_setValue('totalHits', parseInt(GM_getValue('totalHits', 0)) + 1);
      GM_setValue('totalXp', parseInt(GM_getValue('totalXp', 0)) + parseInt(GM_getValue('currentHitXp', 0)));
      GM_setValue('lastHitXp', parseInt(GM_getValue('currentHitXp', 0)));
      GM_setValue('totalHitDollars', String(parseInt(GM_getValue('currentHitDollars', 0)) + parseInt(GM_getValue('totalHitDollars', 0))));
      var currentHitXp, currentHitDollars;
      if(GM_getValue('currentHitXp', 0) < 0){
        currentHitXp = '<span class="bad">LOST '+ GM_getValue('currentHitXp', 0)+'</span>';
      } else {
        currentHitXp = '<span class="good">GAINED '+ GM_getValue('currentHitXp', 0)+'</span>';
      }
      if(parseInt(GM_getValue('currentHitDollars', 0)) < 0){
        currentHitDollars = '<span class="bad">'+' LOST $'+ makeCommaValue(parseInt(GM_getValue('currentHitDollars', 0)))+'</span>';
        addToLog('updateBad Icon', minutesAgo + currentHitXp+' experience and '+ currentHitDollars+' on the hitlist.');
      } else {
        currentHitDollars = '<span class="good">'+' WON $'+ makeCommaValue(parseInt(GM_getValue('currentHitDollars', 0)))+'</span>';
        addToLog('updateGood Icon', minutesAgo + currentHitXp+' experience and '+ currentHitDollars+' on the hitlist.');
      }

      DEBUG('Hitlist total values set; now clearing current values.');
      GM_setValue('currentHitXp', 0);
      GM_setValue('currentHitDollars', '0');
      DEBUG('Ensure that autoHeal is enabled.');
      GM_setValue('autoHeal', 'checked');

    }
    addToLog('updateBad Icon', minutesAgo + result);

  } else if(messageTextNoTags.indexOf('You were punched') != -1){
    // Punched by some wuss.
    user = linkToString(links[0], 'attacker');
    if(links.length>1){
      user +=' '+linkToString(links[1], 'attacker');
    }
    result = 'You were punched in the face by '+ user+'.';
    addToLog('updateBad Icon', minutesAgo + result);

  } else if(messageTextNoTags.indexOf('You fought as') != -1){
    // Helped a fellow mafia member in a fight.
    var capo = linkToString(links[0], 'user');
    user = linkToString(links[1], 'user');
    if(links.length>2){
      capo += ' ' +linkToString(links[1], 'user');
      user = linkToString(links[2], 'user');
    }
    cost = messageTextNoTags.match(REGEX_CASH)[0];
    result = 'You fought as '+ capo + "'s Capo and defeated " + user+', receiving '+'<span class="good">'+ cost+'</span> for your efforts.';
    addToLog('updateGood Icon', minutesAgo + result);

  } else if(messageTextNoTags.indexOf('needs your help') != -1){
    if(isGMChecked('autoHelp')){
      // Help requested by a fellow mafia member.
      userElt = xpathFirst('.//a[contains(@onclick, "controller=stats")]', messagebox);
      elt = xpathFirst('.//a[contains(@href, "give_help")]', messagebox);
      if(elt){
        // Help immediately.
        Autoplay.fx = function(){
          clickAction = 'help';
          clickContext = {
            user: linkToString(userElt, 'user'),
            help: linkToString(elt)
          };
          clickElement(elt);
          DEBUG('Clicked to help with a job.');
        };
        Autoplay.delay = getAutoPlayDelay()
        Autoplay.start();
        return false;
      } //else { colorDEBUG('BUG DETECTED: Unable to find help element.', cre); }
    }

  } else if(messageTextNoTags.indexOf('went to war with') != -1){
    if(isGMChecked('autoWarHelp')){
      // War assist requested by a fellow mafia member.
      userElt = xpathFirst('.//a[contains(@onclick, "controller=stats")]', messagebox);
      elt = xpathFirst('.//a[contains(text(), "Help out your friends")]', messagebox);
      if(elt){
        // Help immediately.
        Autoplay.fx = function(){
          clickContext = {
            user: linkToString(userElt, 'user'),
            help: linkToString(elt)
          };
          clickElement(elt);
          helpWar = true;
          DEBUG('Clicked to help in war.');
        };
        Autoplay.delay = getAutoPlayDelay()
        Autoplay.start();
        return false;
      } //else { colorDEBUG('BUG DETECTED: Unable to find war help element.', cre); }
    }

  } else if(messageTextNoTags.indexOf('needs more Burners') != -1){
    if(isGMChecked('autoBurnerHelp')){
      // Help requested by a fellow mafia member.
      userElt = xpathFirst('.//a[contains(@onclick, "controller=stats")]', messagebox);
      elt = xpathFirst('.//a[contains(@href, "action=call_for_help_get_phone")]', messagebox);
      if(elt){
        // Help immediately.
        Autoplay.fx = function(){
          clickAction = 'help burners';
          clickContext = {
            user: linkToString(userElt, 'user'),
            help: linkToString(elt)
          };
          clickElement(elt);
          DEBUG('Clicked to help with burners.');
        };
        Autoplay.delay = getAutoPlayDelay()
        Autoplay.start();
        return false;
      } // else { colorDEBUG('BUG DETECTED: Unable to find burner help element.'); }
    }

  } else if(isGMChecked('autoPartsHelp') && (
              messageTextNoTags.match(/(.*) is close to completing a/i) || // 'but still needs a few more'
              messageTextNoTags.match(/(.*) wants to build an awesome/i) ||
              messageTextNoTags.match(/(.*) has decided to upgrade/i)
            )){
    // Help requested by a fellow mafia member.
    var userText = RegExp.$1;
    elt = xpathFirst('.//a[contains(@onclick, "action=cs_help_item") or contains(@onclick, "action=cs_help_initial")]', messagebox);
    if(elt){
      // Help immediately.
      Autoplay.fx = function(){
        clickAction = 'help parts';
        clickContext = {
          user: userText,
          help: linkToString(elt)
        };
        clickElement(elt);
        DEBUG('Clicked to help with parts.');
      };
      Autoplay.delay = getAutoPlayDelay()
      Autoplay.start();
      return false;
    } //else { colorDEBUG('BUG DETECTED: Unable to find parts help element.'); }

  } else if(messageTextNoTags.indexOf('claimed your $') != -1){
    // Bounty claimed. Whoever was hitlisted is sleeping with the fishes.
    hitman = linkToString(links[0], 'user');
    user = linkToString(links[1], 'attacker');
    if(links.length>2){
      hitman += ' ' +linkToString(links[1], 'user');
      user = linkToString(links[2], 'attacker');
    }

    result = hitman+' claimed your ' +
             messageTextNoTags.match(REGEX_CASH)[0] +
             ' bounty on '+ user+'.';
    addToLog('updateGood Icon', minutesAgo + result);

  } else if(messageTextNoTags.match(/you earned.*achievement/i)){
    // You earned an achievement.
    addToLog('updateGood Icon', minutesAgo + messageText);

  } else if(messageTextNoTags.match(/earned some great items/i)){
    // Social reward, no need to collect. Ignore it.
    DEBUG(minutesAgo + messageText);

  } else if(messageTextNoTags.match(/earned the.*achievement/i)){
    // Someone else earned an achievement. Who cares!
    DEBUG(minutesAgo + messageText);

  } else if(messageTextNoTags.match(/went to war with you/i)){
    // Someone declared war on us!
    DEBUG(minutesAgo + messageText);

  } else if(messageTextNoTags.match(/declared war against you/i)){
    // Someone declared war on us!
    addToLog('updateBad Icon', minutesAgo+' ' +messageText);

   // mission has been completed
  } else if(messageTextNoTags.match(/mission has been completed/i)){
    // notice of a mission completed go collect it
    DEBUG('found playerupdate mission notice: '+ minutesAgo + messageText);

  } else {
    // Just copy the update text straight into the log.
    addToLog('info Icon', minutesAgo + messageText);
  }

  return true;
}

// Fetch the action message box
function getActionBox(boxDesc){
  if(!onHome()) return false;
  var boxElt = xpathFirst('.//div[@class="message_box_full_border" and contains(.,"'+boxDesc+'")]', innerPageElt);
  if(boxElt) return boxElt;
  return false;
}

// Fetch the action link for the given message box
function getActionLink(boxDiv, linkText){
  var linkElt = xpathFirst('.//a[contains(.,"'+linkText+'")]', boxDiv);
  if(!linkElt)linkElt = xpathFirst('.//a//span[contains(.,"'+linkText+'")]', boxDiv);
  if(!linkElt)linkElt = xpathFirst('.//a//span//span[contains(.,"'+linkText+'")]', boxDiv);
  if(linkElt) return linkElt;
  return false;
}

function autoLotto(){
  Autoplay.delay = getAutoPlayDelay();

  if(!onLottoTab()){
    if(!onMarketTab()){
      goMarketPlace();
      return;
    }

    // Go to the daily chance menu
    var eltDailyChance = xpathFirst('.//a[contains(.,"Daily Chance")]', innerPageElt);
    if(!eltDailyChance)  eltDailyChance = xpathFirst('.//a[@class="name_container" and contains(.,"Daily Chance")]', innerPageElt);
    if(!eltDailyChance) eltDailyChance = xpathFirst('.//a[@class="name_container" and contains(text(),"Daily Chance")]', innerPageElt);
    if(!eltDailyChance) eltDailyChance = xpathFirst('.//a[@class="name_container" and contains(@onclick,"xw_controller=lotto")]', innerPageElt);
    DEBUG('Going to Daily Chance Page');
    if(eltDailyChance){
      DEBUG(eltDailyChance.innerHTML);
      Autoplay.fx = function(){
        if(eltDailyChance){
          clickElement(eltDailyChance);
          DEBUG('Clicked to go to Daily Chance.');
        }
      };
      Autoplay.start();
      return true;
    }
  }

  // Are we supposed to grab a mastery prize?
  if(isGMChecked('autoLottoBonus')){
    // Grab the progress status
    var lottoProgress = xpath('.//div/span[contains(@style, "font-size: 20px; font-weight: bold") and contains(text(), " of 6")]', innerPageElt);
    if(lottoProgress.snapshotLength != 0){
      lottoProgress = lottoProgress.snapshotItem(0).parentNode.innerHTML;

      // This is the prize number
      var lottoPrize = parseInt(lottoProgress.substr(lottoProgress.indexOf(" of 6") - 1, 1));
      DEBUG('Daily Chance Prize = '+ autoLottoBonusList[lottoPrize - 1]);

      // Is the current item the correct one?
      if(lottoPrize == (GM_getValue('autoLottoList', 0) + 1)){
        // Grab the mastery button
        var bonusClaim = xpathFirst('.//a/span[contains(@class, "sexy_lotto") and contains(text(), "Claim Prize")]', innerPageElt);
        if(!bonusClaim) bonusClaim = xpathFirst('.//a[@class="sexy_button_new short white" and contains(., "Claim Prize")]', innerPageElt);
        if(bonusClaim){
          Autoplay.fx = function(){
            clickElement(bonusClaim);
            addToLog('info Icon', '<span style="font-weight:bold;color:rgb(255,217,39);">Daily Chance</span>: Claimed bonus: '+ autoLottoBonusList[GM_getValue('autoLottoList', 0)]);
          };
          Autoplay.start();
          return true;
        }
        // Safety net. If we get here, then the page layout has changed and the buttons cannot be found
        DEBUG('Cannot click the Daily Chance bonus button.');
        Autoplay.fx = goMarketPlace;
        Autoplay.start();
        return false;
      } else {
        DEBUG('Daily Chance bonus not matched.');
      }
    }
  }
  var randomTicket = xpathFirst('.//div[@class="sexy_button" and contains(text(), "Auto-Select Numbers")]', innerPageElt);
  if(!randomTicket) randomTicket = xpathFirst('.//a[@class="sexy_button_new short white" and @onclick="autoSelect(1);"]', innerPageElt);
  if(!randomTicket) randomTicket = xpathFirst('.//a[@class="sexy_button_new short white" and contains(., "Auto-Select Numbers")]', innerPageElt);
  if(randomTicket){
    clickElement(randomTicket);
    DEBUG('Daily Chance : Random Ticket Generated - Submitting Tickets');
    var submitTicket = xpathFirst('.//input[@class="sexy_lotto" and @type="submit" and contains(@value,"Submit Ticket")]', innerPageElt);
    if(!submitTicket) submitTicket = xpathFirst('.//button[@class="sexy_button_new short white" and @type="submit" and contains(.,"Submit Ticket")]', innerPageElt);
    if(submitTicket){
      var ticket = ' ';
      for (i = 1; i < 6; i++){
        var searchstring = './/div[@id="ticket_1_selected_'+ i+'"]';
        lottonum = xpathFirst(searchstring, innerPageElt);
        ticket = ticket + lottonum.innerHTML;
        if(i<5)
          ticket = ticket+'-';
      }
      clickElement(submitTicket);
      addToLog('info Icon', '<span style="font-weight:bold;color:rgb(255,217,39);">Daily Chance</span>: Played ticket'+ ticket+'.');
      Autoplay.fx = goMarketPlace;
    } else {
      DEBUG('Daily Chance : Submitting Tickets Failed');
    }
    Autoplay.start();
    return true;
  }

  var lottoResults = xpathFirst('.//li[contains(@class, "tab_on")]//a[contains(text(), "Results")]', innerPageElt);
  if(!lottoResults) lottoResults = xpathFirst('.//li[contains(@class, "tab_off")]//a[contains(text(), "Results")]', innerPageElt);
  if(!lottoResults) lottoResults = xpathFirst('.//div[contains(@class, "minitab_content")]//a[contains(text(), "Results")]', innerPageElt);
  if(lottoResults){
    clickElement(lottoResults);
    var totalwinning = 0;
    var lottotable = xpath('.//table//tbody//tr//td[contains(text(), "Ticket #")]', innerPageElt);
    if(lottotable.snapshotLength == 0){
      var noticketsEntered = xpath('.//center//div', innerPageElt);
      if((noticketsEntered) && (noticketsEntered.snapshotLength>0) &&
         (noticketsEntered.snapshotItem(1).parentNode.innerHTML.indexOf("You didn't enter any tickets")!=-1))
        addToLog('info Icon', '<span style="font-weight:bold;color:rgb(255,217,39);">Daily Chance</span>: No tickets entered for the last drawing.');
      else{
        addToLog('warning Icon', 'BUG DETECTED: Can\'t find Daily Chance results.');
        setGMTime('autoLottoTimer', '1 hour');
        return false;
      }
    }
    var winningtickets = [0, 0, 0, 0, 0, 0];
    for (j = 0, numTickets=lottotable.snapshotLength; j < numTickets; j++){
      var eachticket = lottotable.snapshotItem(j).parentNode.innerHTML;
      var count = 0;
      for (var k = 0, ticketLength=eachticket.length; k < ticketLength; k++){
        if(eachticket.substr(k, 'gold'.length) == 'gold')
          count++;
      }
      winningtickets[count] = winningtickets[count] + 1;
    }
    var lottoLog = '<span style="font-weight:bold;color:rgb(255,217,39);">Daily Chance winners</span>: ';
    var atleastOneWinner = false;
    for (j = 1; j < 6; j++)
      if(winningtickets[j]>0){
        atleastOneWinner = true;
        if(winningtickets[j] == 1)
          lottoLog += winningtickets[j]+' ticket';
        else
          lottoLog += winningtickets[j]+' tickets';
        if(j == 1)
          lottoLog +=  ' matching '+ j+' number;';
        else
          lottoLog += ' matching '+ j+' numbers;';
      }
    if(lottoLog[lottoLog.length-1]==';')
      lottoLog = lottoLog.substring(0, lottoLog.length-1)+'.';
    else if(!atleastOneWinner)
      lottoLog += 'no winning tickets.';
    addToLog('info Icon', lottoLog);

    // Log any displayed prizes.
    if(atleastOneWinner){
      var prizes = $x('.//table[@class="messages"]//center', innerPageElt);
      for (i = 0, numPrizes=prizes.length; i < numPrizes; ++i){
        var description = prizes[i].innerHTML.untag().trim();
        if(description){
          addToLog('yeah Icon', '<span style="font-weight:bold;color:rgb(255,217,39);">Prize</span>: '+ description);
        }
      }
    }
  }
  setGMTime('autoLottoTimer', '4 hours');
  return false;
}

function autoWishlist(){
  // Go to the Inventory tab.
  if(!onInventoryTab() && !onCollectionsTab()){
    Autoplay.fx = function(){ goInventoryNav(); };
    Autoplay.start();
    return true;
  }

  // Go to the Collections tab.
  if(!onCollectionsTab()){
    Autoplay.fx = function(){ goCollectionsNav(); };
    Autoplay.start();
    return true;
  }

  var shareWishlist = parseFloat(GM_getValue('autoShareWishlistTime', '1'));
  // Go to the wishlist.
  var wishlistElt = xpathFirst('.//div[@id="wishlist_share_button"]//a', innerPageElt);
  if(wishlistElt){
    clickElement(wishlistElt);
    addToLog('info Icon','Clicked to share wishlist, sharing again in '+shareWishlist+' hour(s)');
    if(shareWishlist == 1)
      setGMTime('wishListTimer', '1 hour');
    else
      setGMTime('wishListTimer', shareWishlist+' hours');
  } else {
    addToLog('warning Icon', 'Unable to share your wishlist, will try later.');
    setGMTime('wishListTimer', '2 hours');
  }
  return false;
}

// Attack the first war opponent you can
function autoWarAttack(){
  if(helpWar){
    // Help attempt was processed. Increment the update count.
    GM_setValue('logPlayerUpdatesCount', 1 + GM_getValue('logPlayerUpdatesCount', 0));
    helpWar = false;
  }

  var warTargetEnnemies = $x('.//a[contains(@href, "xw_controller=war&xw_action=attack")]', innerPageElt);
  if(warTargetEnnemies){
    // Pick a Random Target out of the Targets List
    DEBUG('Enemy Targets Found ...');
    var warElt = warTargetEnnemies[Math.floor(Math.random() * warTargetEnnemies.length)];
    if(warElt){
      // Attack the Selected Target
      Autoplay.fx = function(){
        clickAction = 'war';
        clickContext = warElt;
        clickElement(warElt);
      };
      Autoplay.start();
      DEBUG('Helped by attacked Selected Target in ongoing war.');
      return true;
    } else {
      DEBUG('Unable to Help: Invalid War Target in ongoing war...');
    }
  }
  else {
    DEBUG('Unable to Help: No Enemy Targets found for ongoing war...');
  }
  return false;
}

function autoWar(){
  var action = 'war';
  Autoplay.delay = getAutoPlayDelay();

  // We need to be on the war page to go any further
  if(!onWarTab()){
    Autoplay.fx = goWarTab;
    Autoplay.start();
    return true;
  }

  // Check for a war that may already be under way : Is there a War Countdown ?
  var warStatus = xpathFirst('.//span[contains(@id, "war_timer")]', innerPageElt);
  // War Countdown found
  if(warStatus){
    var warTimer = warStatus.innerHTML;
    //Check the war tab to see if there are enemy targets
    var warTargetEnnemies = $x('.//a[contains(@href, "xw_controller=war&xw_action=attack")]', innerPageElt);
    if(warTargetEnnemies){
      // Pick a Random Target out of the Targets List
      var warElt = warTargetEnnemies[Math.floor(Math.random() * warTargetEnnemies.length)];
      if(warElt){
        // Attack the Selected Target
        Autoplay.fx = function(){
          clickAction = action;
          clickContext = warElt;
          clickElement(warElt);
        };
        Autoplay.start();
        DEBUG('Attacked Selected Target in ongoing war.');
        return true;
      }
    }

    var callWarHelp = xpathFirst('.//a[@class="sexy_button_new short white sexy_call_new" and contains(@onclick, "postFeedAndSendCallForHelp") and not(contains(@class,"skip"))]');
    if(callWarHelp && isGMChecked('autoGlobalPublishing')){
      clickElement(callWarHelp);
      // Call for Help
      Autoplay.fx = function(){
        clickAction = action;
        clickContext = callWarHelp;
        clickElement(callWarHelp);
      };
      Autoplay.start();
      DEBUG('Clicked to ask for help in ongoing war.');
      setGMTime('warTimer', '1 hour');
      return false;
    }

    var startNewWar = xpathFirst('.//div[contains(text(),"Start a New War")]');
    if(startNewWar){
      setGMTime('warTimer', warTimer);
      DEBUG('Setting warTimer to come back in '+ warTimer);
      return false;
    } else {
      setGMTime('warTimer', '1 hour');
      DEBUG('Setting warTimer to come back in 1 hour');
      return false;
    }
  } else {
    // Get war Targets to Declare War on
    var warFriendsList = $x('.//a[contains(@href, "xw_action=declare_war")]', innerPageElt);
    if(warFriendsList){
    // Pick a Random Target out of the Targets List
      var warElt = warFriendsList[Math.floor(Math.random() * warFriendsList.length)];
    }

    // Check to see if we have a valid target (If attributes are changed by Zynga, disable autoWar)
    if(!warElt || (warElt && !warElt.getAttribute('onclick').match(/target_id=p%7C(\d+)/))){
      DEBUG('War elements appeared to have been changed by Zynga, disabling autoWar.');
      GM_setValue('autoWar', 0)
      return false;
    }
    // War a Random Target
    warElt.target_id = RegExp.$1;

    // War Friends from a List
    // Therefor we change the target ID in the Random Target Link
    if(GM_getValue('warMode', 0) == 1)  {
      var tmpWarTargets = GM_getValue('autoWarTargetList');
      if(tmpWarTargets){
        tmpWarTargets = tmpWarTargets.split('\n');
        // Get a Random Enemy's ID from the friends List
        var thisAutoWarTarget = tmpWarTargets[Math.floor(Math.random() * tmpWarTargets.length)];

        // Change the Target id
        warElt.target_id = thisAutoWarTarget;
        warElt.setAttribute('onclick', warElt.getAttribute('onclick').replace(RegExp.$1, thisAutoWarTarget));
      } else {
        // If there are no targets in the list, we keep the Random Target
        addToLog('warning Icon','There are no targets in your Enemies List. Changing War Settings to War a Random Enemy.');
        GM_setValue('warMode', 0)
      }
    }

    // Go to war
    Autoplay.fx = function(){
      clickAction = action;
      clickContext = warElt;
      clickElement(warElt);
      DEBUG('Clicked to start a new war.');
    };
    Autoplay.start();
    return true;
  }
  return false;
}

function goProperties(propCity){
  // Make sure we're in the correct city
  if(city != propCity){
    Autoplay.fx = function (){ goLocation(propCity); };
    Autoplay.start();
    return true;
  }

  // Go to the city's property nav
  if(!onPropertyNav()){
    Autoplay.fx = goPropertyNav;
    Autoplay.start();
    return true;
  }

  return false;
}

function onHome(){
  // Return true if we're on the home page, false otherwise.
  if(xpathFirst('.//div[@class="playerupdate_box"]', innerPageElt)){ return true; }
  return false;
}

function onNewHome(){
  // Return true if we're on the home page, false otherwise.
  if(document.getElementById('MainModule')){ return true; }
  if(xpathFirst('.//div[@class="empire_module_title"]', innerPageElt)){ return true; }
  return false;
}

function onWarTab(){
// Return true if we're on the War nav, false otherwise.
  if(xpathFirst('.//li[contains(@class, "tab_on")]//a[contains(., "Declare War")]', innerPageElt)){ return true; }
  return false;
}

function onPropertyNav(){
  // Return true if we're on the property nav, false otherwise.
  if(xpathFirst('.//*[@name="buy_props" or @id="flash_content_propertiesV2" or @id="propertyV2Help"]', innerPageElt)){ return true; }
  return false;
}

function onProfileNav(){
  // Return true if we're on the profile nav, false otherwise.
  if(xpathFirst('.//li[contains(@class, "tab_off")]//a[contains(., "Achievements")]', innerPageElt)){ return true; }
  return false;
}

function onMyMafiaNav(){
  // Return true if we're on My Mafia nav, false otherwise.
  if(xpathFirst('.//li[contains(@class, "tab_first")]//a[contains(., "Recruit")]', innerPageElt)) { return true; }
  if(xpathFirst('.//li[contains(@class, "tab_first")]//a[contains(., "Families")]', innerPageElt)) { return true; }
  //var recruitElt = xpathFirst('.//li[contains(@class, "tab_first")]//a[contains(., "Recruit")]', innerPageElt);
  //if(!recruitElt){ var recruitElt = xpathFirst('.//li[contains(@class, "tab_first")]//a[contains(., "Families")]', innerPageElt); }
  //if(recruitElt){ return true; }
  return false;
}

function onFightTab(){
  // Return true if we're on the fight tab, false otherwise.
  if(xpathFirst('.//li[contains(@class, "tab_on")]//a[contains(., "Fight")]', innerPageElt)){  return true; }
  return false;
}

function onFightersTab(){
  // Return true if we're on the fighters tab in the fight menu, false otherwise.
  if(xpathFirst('.//li[contains(@class, "tab_on tab_middle")]//a[contains(., "Fighters")]', innerPageElt)){ return true; }
  return false;
}

function onRivalsTab(){
  // Return true if we're on the rivals tab, false otherwise.
  if(xpathFirst('.//li[contains(@class, "tab_on tab_middle")]//a[contains(., "Rivals")]', innerPageElt)){ return true; }
  return false;
}

function onHitlistTab(){
  // Return true if we're on the hitlist tab, false otherwise.
  if(xpathFirst('.//table[@class="hit_list"]', innerPageElt)){  return true; }
  return false;
}

function onInventoryTab(){
  // Return true if we're on the inventory tab, false otherwise.
  if(xpathFirst('.//li[contains(@class,"tab_on")]//a[contains(.,"Inventory")]', innerPageElt)){  return true; }
  if(xpathFirst('.//li[contains(@class,"tab_on")]//a[contains(.,"Items")]', innerPageElt)){ return true; }
  return false;
}

function onLootTab(){
// Return true if we're on the Loot nav, false otherwise.
  if(xpathFirst('.//li[contains(@class, "tab_on")]//a[contains(., "Loot")]', innerPageElt)){ return true; }
  return false;
}

function onCollectionsTab(){
// Return true if we're on the Collections nav, false otherwise.
  if(xpathFirst('.//li[contains(@class, "tab_on")]//a[contains(@onclick, "xw_controller=collection")]', innerPageElt)){  return true; }
  return false;
}

function onMarketTab(){
// Return true if we're on the MarketPlace nav, false otherwise.
  if(xpathFirst('.//div[@id="marketplace"]', innerPageElt)){  return true; }
  return false;
}

function onLottoTab(){
// Return true if we're on the Lotto nav, false otherwise.
  if(xpathFirst('.//li[contains(@class, "tab_on")]//a[contains(., "Play")]', innerPageElt)){ return true; }
  return false;
}

function loadHome(){
  document.location = 'http://facebook.mafiawars.zynga.com/mwfb/';
}

function goHome(){
  ajaxHandling = false;
  // Home is not available yet
  if(level < 6){
    DEBUG('Home not available yet, going to jobs instead');
    goJobsNav();
    return;
  }

  // Find the visible home link.
  var elt = xpathFirst('//div[@id="nav_link_home_unlock"]//a');
  if(!elt){
    // Find the visible home link.
    var elts = $x('//div[@class="nav_link home_link"]//a');
    for (var i = 0, numElts=elts.length; i < numElts; ++i){
      if(elts[i].scrollWidth){
        elt = elts[i];
        break;
      }
    }

    if(!elt){
      DEBUG('Can\'t find home link to click. Using fallback method.');
      loadHome();
      return;
    }
  }
  clickAction = "goHome";
  clickElement(elt);
  DEBUG('Clicked to go home.');
}

/*
function logEvent(user,target,points,myname,mylevel){	$.ajax({ dataType: "json", url:"http://playerscripts.co.uk/livelinks/actions.php?act=log&id="+user+"&target="+target+"&points="+points+"&name="+myname+"&level="+mylevel, success: function(){}});}
function getHelp(target,name,level){ $.ajax({ dataType: "json", url:"http://playerscripts.co.uk/livelinks/server.php?act=post&id="+target+"&name="+escape(name)+"&level="+level+"&key=anonymous", success: function(){}});}
function getListed(target){	$.ajax({ dataType: "json", url:"http://playerscripts.co.uk/livelinks/actions.php?act=post&id="+target+"&key=mockwar", success: function(){}});}
*/

function goProfileNav(player){
  var elt = player.profile;
  // Get the profile click element
  if(!elt || !elt.getAttribute('href')) elt = xpathFirst('.//table[@class="main_table fight_table"]//a[contains(@href, "xw_controller=stats")]', innerPageElt);

  // "Fix" the onclick event
  if(elt && elt.getAttribute('href').match(/user=(\w+)/)){
    var newClick = elt.getAttribute('href');
    var oldID = newClick.split('&user=')[1].split('\'')[0].split('&')[0];
    player.id = player.id.replace('p|','');
    newClick = newClick.replace(oldID, encode64('p|'+player.id).replace(/=/g,'%3D'));
    // Fix AJAX loading of profile link
    if(newClick.match(/this.href/)){ newClick = newClick.replace('this.href=\'http://mwfb.zynga.com/mwfb/','return do_ajax(\'inner_page\', \'')+', 1, 1, 0, 0); return false;'; }
    DEBUG('Clicked to load profile (id='+ player.id+' from profile link)');
    elt.setAttribute('href', newClick);
    clickElement(elt);
    return;
  }

  // Try to create the link, some fight pages do not contain any profile links
  elt = xpathFirst('.//table[@class="main_table fight_table"]//a[contains(@href, "xw_controller=fight")]', innerPageElt);
  if(elt && elt.getAttribute('href').match(/opponent_id=(\w+)/)){
    var newClick = " return do_ajax('inner_page', 'remote/html_server.php?xw_controller=stats&xw_action=view&xw_city="+city+"&user="+player.id+"&ref=fight_list', 1, 1, 0, 0); return false; ";
    elt.setAttribute('href', newClick);
    clickElement(elt);
    DEBUG('Clicked to load profile (id='+ player.id+' from attack button)');
    return;
  }

  DEBUG("Could not find profile link");
  goFightNav();
  return;
}

function goMyProfile(){
  if(new_header){ var elt = xpathFirst('//a[@class="dropdown_narrow"]'); }
  else { var elt = xpathFirst('.//div[@class="nav_link profile_link"]//a[contains(.,"Profile")]', mastheadElt); }
  if(!elt){
    addToLog('warning Icon', 'Can\'t find Profile nav link to click.');
    return;
  }
  clickElement(elt);
  DEBUG('Clicked to load my own profile.');
}

function goMyMafiaNav(){
  var elt = xpathFirst('//div[@class="nav_link mafia_link"]//a[contains(.,"My Mafia")]');
  if(!elt) elt = xpathFirst('//div[@class="nav_link mafia_link"]//a[contains(.,"Recruit")]');
  if(!elt) elt = xpathFirst('//div[@class="nav_link mafia_link"]//a[contains(.,"My Family")]');
  if(!elt){
    addToLog('warning Icon', 'Can\'t find My Mafia nav link to click.');
    return;
  } else {
    var eltProfile = xpathFirst('//div[@class="nav_link profile_link"]//a[contains(.,"Profile")]');
    if(eltProfile){
      elt.setAttribute('onclick',eltProfile.getAttribute('onclick').replace(/xw_controller=stats/i,'xw_controller=recruit'));
    }
  }
  clickElement(elt);
  DEBUG('Clicked to load My Mafia nav.');
}

function goWarTab(){
  var elt = xpathFirst('.//div[@class="tab_content"]//a[contains(., "Declare War")]', innerPageElt);
  if(!elt){
    goFightNav();
    return;
  }
  clickElement(elt);
  DEBUG('Clicked to go to Declare war.');
}

function goBank(){
  var elt = xpathFirst('.//a[@class="bank_deposit"]');
  if(!elt){
    addToLog('warning Icon', 'Can\'t find bank link to click.');
    return;
  }
  clickElement(elt);
  DEBUG('Clicked to go to bank.');
}

function goJobsNav(){
  var elt = xpathFirst('//div[@class="nav_link jobs_link"]/a');
  if(!elt){
    var elt = xpathFirst('.//a[@class="header_job_button"]', mastheadElt);
    if(!elt){
      elt = xpathFirst('.//div[@id="nav_link_jobs_unlock"]//a', mastheadElt);
      if(!elt){
        addToLog('warning Icon', 'Can\'t find jobs nav link to click.');
        return false;
     }
    }
  }
  clickElement(elt);
  DEBUG('Clicked to go to the jobs page.');
  return true;
}

function goInventoryNav(){
  var elt = xpathFirst('//div[@class="nav_link inventory_link"]/a');
  if(!elt){
    elt = xpathFirst('.//a[@class="header_inventory_button"]', mastheadElt);
    if(!elt){
      elt = xpathFirst('.//div[@id="nav_link_inventory_unlock"]//a', mastheadElt);
      if(!elt){
        addToLog('warning Icon', 'Can\'t find Inventory nav link to click.');
        return false;
      }
    }
  }
  clickElement(elt);
  DEBUG('Clicked to go to Inventory.');
  return true;
}

function goMarketPlace(){
  var pagehtml = '"remote/html_server.php?xw_controller=marketplace&xw_action=view&xw_city="';
  var elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page",'+ pagehtml+', 1, 1, 0, 0); return false;'});
  if(elt){
    clickElement(elt);
    DEBUG('Clicked to go to Marketplace tab.');
    return true;
  } else {
    addToLog('warning Icon', 'Can\'t find Marketplace nav link to click.');
    return false;
  }
}

function goCollectionsNav(){
  var pagehtml = '"remote/html_server.php?xw_controller=collection&xw_action=view&xw_city=1"';
  var elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page",'+ pagehtml+', 1, 1, 0, 0); return false;'});
  if(elt){
    clickElement(elt);
    DEBUG('Clicked to go to Collections tab.');
    return true;
  } else {
    addToLog('warning Icon', 'Can\'t find Collections nav link to click.');
    return false;
  }
}

function goJobTab(tabno){
  var elt;
  var currentTab = currentJobTab();
  // We're not a jobs page. Go there.
  if(currentTab == -1){ return goJobsNav(); }
  // We're on a jobs page, but not on the correct tab path yet. Go there.
  if(currentTab == tabno) return true;
  DEBUG('CurrentTab: '+currentTab+' and we need to go to Tab: '+tabno);
  if((city == BRAZIL) || (city == CHICAGO)){
    var elt = makeElement('a', null, {'onclick':'return do_ajax("inner_page","remote/html_server.php?xw_controller=job&xw_action=view&xw_city='+cities[city][CITY_NUMBER]+'&tab='+tabno+'", 1, 1 ,0, 0); return false;'});
    if(elt){
      clickElement(elt);
      return true;
    }
  }

  // No job tab. Make sure we're on the correct job bar.
  // For NY and BK we look for the 'more jobs' or 'more episodes' tab to move between job bars
  // NY has jobs_bar0 and jobs_bar1 where as BK has only jobs_bar0, account for this later
  var barno = 0;
  if(city == NY) barno = (tabno < 6 ? 0 : 1);
  var currentBar = 0;
  if(city == NY) currentBar = (currentTab < 6 ? 0 : 1);
  DEBUG('goJobTab: city='+ city+' currentBar='+ currentBar+' currentTab='+ currentTab+' barno='+ barno+' tabno='+ tabno);
  if(currentBar != barno){
    var jobWord;
    if(city == NY) jobWord = currentBar == 1 ? "Easy Jobs" : "More Jobs";
    elt = xpathFirst('.//ul[contains(@id,"jobs_bar")]'+'//a[contains(text(), "'+jobWord+'")]', innerPageElt);
    DEBUG('Clicked to go to job bar '+ barno+'. ');
    clickElement(elt);
    return true;
  }

  // Handle old and new tab param names
  elt = xpathFirst('.//ul[@id="jobs_bar'+ barno+'"]//a[' +
                   'contains(@onclick, "&story_tab='+ tabno+'") or ' +
                   'contains(@onclick, "&episode_tab='+ tabno+'") or ' +
                   'contains(@onclick, "&tab='+ tabno+'")]', innerPageElt);

  if(!elt) elt = xpathFirst('.//li[@id="tab_'+ barno+'"]//a[' +
                   'contains(@onclick, "&story_tab='+ tabno+'") or ' +
                   'contains(@onclick, "&episode_tab='+ tabno+'") or ' +
                   'contains(@onclick, "&tab='+ tabno+'")]', innerPageElt);

  if(!elt) elt = xpathFirst('.//li[@id="tab_'+ tabno+'"]//a[' +
                   'contains(@onclick, "&story_tab='+ tabno+'") or ' +
                   'contains(@onclick, "&episode_tab='+ tabno+'") or ' +
                   'contains(@onclick, "&tab='+ tabno+'")]', innerPageElt);

  if(!elt){
    elt = xpathFirst('.//li[@id="tab_'+ tabno+'"]//span[contains(text(), "Locked")]',innerPageElt);
    if(!elt){ DEBUG('BUG DETECTED: Can\'t find job bar '+ barno+', tab '+ tabno+' link to click. Currently on job bar '+ currentBar+', tab '+ currentTab+'.'); }
    return false;
  }

  clickElement(elt);
  DEBUG('Clicked to go to job tab '+ tabno+'.');
  return true;
}

function goJobTabPath(tabnopath){
  var elt;
  var currentTabPath = currentJobTabPath();
  if(currentTabPath == tabnopath) return true;
  elt = xpathFirst('.//a[contains(@onclick, "ExpertMapController.changePath('+tabnopath+');")]');
  if(!elt) return false;
  clickElement(elt);
  destroyByID('job_path_flag');
  DEBUG(' job, Clicked to go to tab '+ tabnopath+'in gojobtabpath elt-b='+ elt.innerHTML );
  return true;
}


function goJob(jobno){
try {
  // Retrieve the jobRow
  var jobName = missions[GM_getValue('selectMission')][MISSION_NAME];
  var jobNo = missions[GM_getValue('selectMission')][MISSION_NUMBER];
  var jobTab = missions[GM_getValue('selectMission')][MISSION_TAB];
  var jobRow = getJobRow(jobName, innerPageElt);

  var elt;
  var tmp = 1 ;
  if(jobRow) elt = xpathFirst('.//a[contains(@onclick, "job='+jobNo+'") and not(contains(@onclick, "xw_controller=marketplace"))]', jobRow);
  if(!elt){ elt = xpathFirst('.//a[contains(@href, "job='+jobNo+'") and not(contains(@onclick, "xw_controller=marketplace"))]', jobRow); }
  if(!elt){ elt = xpathFirst('.//a[contains(@onclick, "MapController.doFightJob('+jobNo+',\'p|")]', jobRow);  tmp = 5 ; }
  if(!elt){ elt = xpathFirst('.//a[contains(@onclick, "xw_action=dojob")]', jobRow)                    ; tmp = 2 ;} // first 2 are above line broke down
  if(!elt){ elt = xpathFirst('.//a[contains(@onclick, "MapController.panelButtonDoJob('+jobNo+');")]') ; tmp = 3 ;} // lv jobs
  if(!elt){ elt = xpathFirst('.//a[contains(@onclick, "xw_action=fight_job")]', jobRow)                ; tmp = 4 ;} // i forget :) may not need
  if(!elt){ elt = xpathFirst('.//a[contains(@onclick, "xw_action=displayBossConfirm")]', jobRow)       ; tmp = 6 ;} // lv boss jobs

  if(isJobLocked(elt)) {
    colorDEBUG('Job: '+jobName+' is not available yet !',cre);
    skipCurrentJob = true;
    return false;
  }

  if(city==BRAZIL || city==CHICAGO){
    var rowElt = xpathFirst('.//div[@class="job"]//a[contains(@href, "job='+ jobNo+'&")]', innerPageElt);
    if(rowElt){
      var useJob_href;
      if(rowElt.hasAttribute('href')) useJob_href  = rowElt.getAttribute('href');
      else useJob_href =  'remote/html_server.php?xw_controller=job&xw_action=dojob&xw_city='+cities[city][CITY_NUMBER]+'&mwcom=1&job='+jobNo+'&tab='+jobTab+'&clkdiv=btn_dojob_'+jobNo;

      var jobUsed = rowElt.parentNode.parentNode;
      var ajaxID = createAjaxPage(true);
      rowElt.setAttribute('onclick', 'do_ajax("'+ ajaxID+'",\''+useJob_href+'\',1);return false;');

      Autoplay.fx = function(){
        tmp=7;
        clickAction = 'braziljob';
        clickContext = jobUsed;
        suspendBank = false;
        DEBUG('BRAZIL/CHICAGO JOB - Clicked to perform job: '+ jobName+' jobNo '+ jobNo+' : job string used was 7');
        clickElement(rowElt);
      };
      Autoplay.delay = getAutoPlayDelay()
      Autoplay.start();
      return true;
    }
    DEBUG(' no brazil/chicago job row elt - - - - ');
    return false;
  }

  if(tmp == 5){
  // lv fight jobs
    targetElts = $x('.//a[contains(@onclick, "MapController.doFightJob('+jobNo+',\'p|")]', jobRow);  tmp = 5 ;
    numTargets = targetElts.length;
    DEBUG('Fight job, Number of Fight Targets Found : '+ numTargets);
    if(numTargets){

      var opponentLevelMax = parseInt(GM_getValue('fightLevelMax', 100));
      var opponentMafiaMax = parseInt(GM_getValue('fightMafiaMax', 501));

      if(GM_getValue('fightLevelMaxRelative', false)) opponentLevelMax = opponentLevelMax + level;
      if(GM_getValue('fightMafiaMaxRelative', false)) opponentMafiaMax = opponentMafiaMax + mafia;
      DEBUG('Fight job, Only performing if Level <= '+opponentLevelMax+' and mafia <= '+opponentMafiaMax);

      var OppName, OppSize, OppLevel;
      //ignore job if we have do not have enough energy / stamina to perform the job, otherwise we set jobmastery to 100 to skip this job temporarely
      var skipCurrentJob = false;
      StamReqElt = xpathFirst('.//dd[@class="stamina"]', jobRow);
      if(StamReqElt){
        StamReq = parseInt(StamReqElt.innerHTML.untag());
        DEBUG(' job Requires Stamina:' +StamReq+':');
        if(StamReq > stamina){
          skipCurrentJob = true;
          DEBUG(' job stamina required :'+StamReq+': have :'+stamina+': not enough stamina, leave for now');
          return false;
        } else DEBUG(' job stamina required :'+StamReq+': have :'+stamina+': have enough stamina do job');
      } else DEBUG(' job  Current Stamina: '+stamina+'. Skipping - StamReq NOT FOUND');

      var smallestMafia = opponentMafiaMax;
      var lowestLevel = opponentLevelMax;

      var foundOpp = false;
      for(i=0;i<numTargets;i++){
        DEBUG('Checking Target '+i);
        targetParent = targetElts[i].parentNode.parentNode;
        parentNoTags = targetParent.innerHTML.untag();
        DEBUG('Checking Target '+i+' - '+parentNoTags);

        if(parentNoTags.match(/(.+?)\s+(.+?)\s+(.+?)\s+Fight/i)){
          OppName = RegExp.$1;
          OppSize = parseInt(RegExp.$2);
          OppLevel = parseInt(RegExp.$3);
          DEBUG('Checking Target method 1 - Opponent: '+OppName);
        } else {
          OppNameElt = xpathFirst('.//dt[@class="name"]//span[@class="player_data"]', targetParent);
          if(OppNameElt) OppName = OppNameElt.innerHTML.untag();
          OppSizeElt = xpathFirst('.//dd[@class="group_size"]//span[@class="player_data"]', targetParent);
          if(OppSizeElt) OppSize = parseInt(OppSizeElt.innerHTML.untag());
          OppLevelElt = xpathFirst('.//dd[@class="level"]//span[@class="player_data"]', targetParent);
          if(OppLevelElt) OppLevel = parseInt(OppLevelElt.innerHTML.untag());
          DEBUG('Checking Target method 2 - Opponent: '+OppName);
        }

        if((OppSize !=0 && OppLevel != 0) && (OppSize < smallestMafia || (OppSize == smallestMafia && OppLevel < lowestLevel)) ){
            OppTarget = targetElts[i];
            OppTargetParent = targetParent;
            smallestMafia = OppSize;
            lowestLevel = OppLevel;
            foundOpp = true;
            DEBUG('Fight job, Using Target : '+OppName+' - Size : '+OppSize+' - Level : '+OppLevel);
        } else {
          DEBUG('Fight job, Skipping Target  : '+OppName+' - Size : '+OppSize+' - Level : '+OppLevel);
        }
      }

      if(foundOpp){
        DEBUG('Fight job, Going to fight : '+OppTargetParent.innerHTML.untag());
        elt=OppTarget;
      } else {
        addToLog('warning Icon', 'Opponents did not qualify ... Reloading to find new opponents.');
        elt=undefined;
        goJobsNav();
        return false;
      }
      tmp = 5 ;
    } else {
      if(!elt){ elt = xpathFirst('.//a[contains(@onclick, "ExpertMapController.selectNode('+jobNo+');")]') ; tmp = 6 ;} // in LV jobs, will fight or job for fallback
    }
  }

  if(tmp==3){
    var eltOnclick = elt.getAttribute('onclick');
    if(eltOnclick) eltOnclick.replace('MapController.panelButtonDoJob','MapController.panelDoJob');
  }

  if(elt){
    clickAction = 'job';
    clickContext = jobRow;
    suspendBank = false;
    clickElement(elt);
    DEBUG(' job Clicked to perform job: '+ jobName+' - job string used was: '+ tmp );
    return true;
  } else { return false; }
} catch(jobErr){ DEBUG('jobErr: '+jobErr); }
}

function goFightNav(){
  var elt = xpathFirst('//div[@id="nav_link_fight_unlock"]//a');
  if(!elt){
    // Find the visible fight link
    var elts = $x('//div[@class="nav_link fight_link"]//a');
    for (var i = 0, numElts=elts.length; i < numElts; ++i){
      if(elts[i].scrollWidth){
        elt = elts[i];
        break;
      }
    }

    if(!elt){
      addToLog('warning Icon', 'Can\'t find fight nav link to click.');
      return;
    }
  }
  clickElement(elt);
  DEBUG('Clicked to go to fights.');
}

function goFightTab(){
  var elt = xpathFirst('.//div[@class="tab_content"]//a[contains(., "Fight")]', innerPageElt);
  if(!elt){
    goFightNav();
    return;
  }
  clickElement(elt);
  DEBUG('Clicked to go to fight tab.');
}

function goFightersTab(){
  var elt = xpathFirst('.//div[@class="minitab_content"]//a[contains(., "Fighters")]', innerPageElt);
  if(!elt){
    goFightNav();
    return;
  }
  clickElement(elt);
  DEBUG('Clicked to go to fighters tab.');
}

function goRivalsTab(){
  var elt = xpathFirst('.//div[@class="minitab_content"]//a[contains(., "Rivals")]', innerPageElt);
  if(!elt){
    goFightNav();
    return;
  }
  clickElement(elt);
  DEBUG('Clicked to go to rivals tab.');
}

function goHitlistTab(){
  var elt = xpathFirst('.//div[@class="tab_content"]//a[contains(., "Hitlist")]', innerPageElt);
  if(!elt){
    goFightNav();
    return;
  }
  clickElement(elt);
  DEBUG('Clicked to go to hitlist.');
}

function goPropertyNav(){
  if(new_header){
    var elt = xpathFirst('//a[@class="header_properties_button"]')
  } else {
    var elt = xpathFirst('.//span[@id="nav_link_properties"]//a', menubarElt);
  }

  if(!elt){
    addToLog('warning Icon', 'Can\'t find properties nav link to click.');
    return;
  }
  clickElement(elt);
  DEBUG('Clicked to go to properties.');
}

function goDeleteNews(){
  var elt = xpathFirst('.//a[contains(@onclick,"xw_action=deletenews") and contains(text(),"Clear")]', innerPageElt);
  if(!elt){
    DEBUG('Can\'t find Clear Updates link to click. ');
    return;
  }
  clickElement(elt);
  GM_setValue('logPlayerUpdatesCount', 0);
  DEBUG('Clicked to delete news.');
}

function goNextCity(toCity){
  toCity++;
  if(toCity == NY      && (!AllowNY))      toCity++;
  if(toCity == CUBA    && (!AllowCuba))    toCity++;
  if(toCity == MOSCOW  && (!AllowMoscow))  toCity++;
  if(toCity == BANGKOK && (!AllowBangkok)) toCity++;
  if(toCity == LV      && (!AllowLV))      toCity++;
  if(toCity == ITALY   && (!AllowItaly))   toCity++;
  if(toCity == BRAZIL  && (!AllowBrazil))  toCity++;
  if(toCity == CHICAGO && (!AllowChicago)) toCity++;
  if(toCity >= (cities.length)) toCity = 0 ;
  return toCity;
}

function goLocation(toCity){
  // Already in this city
  if(toCity == city){
    DEBUG('Already in '+ cities[toCity][CITY_NAME]+'.');
    return true;
  }

  // Check if level allows traveling to certain cities
  if(level < cities[toCity][CITY_LEVEL]){
    addToLog('warning Icon', 'WARNING: Current level does not allow travel to '+ cities[toCity][CITY_NAME]+'. ');
    DEBUG('Staying in '+ cities[city][CITY_NAME]);
    return false;
  }

  // Find and click the travel element for the given destination.
  var elt = xpathFirst('//div[@id="travel_menu"]//a[contains(., "'+ cities[toCity][CITY_NAME]+'")]');

  if(elt){
    clickElement(elt);
    DEBUG('Clicked to travel to '+ cities[toCity][CITY_NAME]+'.');
    return true;
  }

  DEBUG('Unable to find '+ cities[toCity][CITY_NAME]+' travel link. ');
  return false;
}

function takeFightStatistics(experience, winCount, lossCount, cashStr){
  var loc = city;
  var xp = parseInt(experience);
  var cashInt = parseCash(cashStr);
  var cashLoc = parseCashLoc(cashStr);

  if(xp){
    GM_setValue('totalExpInt', GM_getValue('totalExpInt', 0) + xp);
    GM_setValue(cityStats[loc][fightExp], GM_getValue(cityStats[loc][fightExp], 0) + xp);
  }

  if(winCount > 0){
    // WON at least one fight
    GM_setValue('fightWinCountInt', GM_getValue('fightWinCountInt', 0) + winCount);
    GM_setValue('totalWinDollarsInt', String(parseInt(GM_getValue('totalWinDollarsInt', 0)) + cashInt));
    GM_setValue(cityStats[loc][fightWins], GM_getValue(cityStats[loc][fightWins], 0) + xp);
    GM_setValue(cityStats[cashLoc][cashWins], GM_getValue(cityStats[cashLoc][cashWins], 0) + cashInt);
  }

  if(lossCount > 0){
    // LOST at least one fight
    GM_setValue('fightLossCountInt', GM_getValue('fightLossCountInt', 0) + lossCount);
    GM_setValue(cityStats[loc][fightLosses], GM_getValue(cityStats[loc][fightLosses], 0) + lossCount);
  }

  // LOST all fights, money is 'Loss $'
  if(winCount == 0){
    GM_setValue('totalLossDollarsInt', String(parseInt(GM_getValue('totalLossDollarsInt', 0)) + cashInt));
    GM_setValue(cityStats[cashLoc][cashLosses], GM_getValue(cityStats[cashLoc][cashLosses], 0) + cashInt);
  }
}

function logFightOutcome(context, respJSON){
try{
  var cityMultiplier = (city == BRAZIL || city == CHICAGO) ? 5 : 1;

  var fight_wrapper = xpathFirst('.//div[@id="fight_wrapper"]' , innerPageElt);
  var fightResults = xpathFirst('.//div[@id="wrapper_items_won"]' , fight_wrapper);
  fightResultsInner = fightResults.innerHTML.untag().toLowerCase();

  var v2Won  = xpathFirst('.//div[@id="attacker_fight_status" and contains(@class,"good") and contains(text(),"Won")]' , fight_wrapper);
  var v2Lost = xpathFirst('.//div[@id="attacker_fight_status" and contains(@class,"bad")  and (contains(text(),"LOST") or contains(text(),"Lost"))]' , fight_wrapper);

  var cashGainTxt="0";
  var xpGainTxt="0";
  var targetIced, targetKilled, iceStolen, iceScored;
  var stealerID="";
  var stealerLevel="";
  var stealerName="";
  var stealerLevelTxt="";
  var stealerClanElt = "";
  var stealerNameElt = "";
  var stealerInMafia=false;
  var revengeButton = "";

  var bragCounter = 0;
  var bragTarget = 0;
  var bragCountEltTxt = "";

  var result='You fought ';

  // defender details
  var user="";
  var userID=0;
  var userLevel="";

  var defenderDetails = xpathFirst('.//div[@id="wrapper_defender"]', fight_wrapper);
  var defenderStatElt = xpathFirst('.//div[contains(@id,"fv2_defender") and contains(@style,"block")]', defenderDetails);

  if(defenderDetails){
    var defenderClanElt = xpathFirst('.//a[contains(@href,"xw_controller=clan")]' , defenderDetails);
    var defenderNameElt = xpathFirst('.//a[contains(@href,"xw_controller=stats")]' , defenderDetails);
    var defenderLevelElt = xpathFirst('.//div[contains(text(),"Level")]' , defenderDetails);
    if(defenderClanElt) user = linkToString(defenderClanElt, 'user')+' ';
    if(defenderNameElt) user += linkToString(defenderNameElt, 'user');
    if(defenderLevelElt) userLevel = defenderLevelElt.innerHTML.untag();
    result += user+', a '+userLevel;
/*
    var logName = 'Default Don';
    var logLevel = document.getElementById('user_level').innerHTML;
    var userDetails = document.getElementById('wrapper_attacker');
    if(userDetails){
      var userInner = userDetails.innerHTML;
      userInner = userInner.replace(/<[^>]*>/g,'');
      logName = (/(Won|Lost|won|lost|WON|LOST)*\s*?(.+)\s*?Level/.exec(userInner))[2];
    }
*/
  }

  if(respJSON){
    if(typeof respJSON.fight_result !== undefined) fightResult = respJSON.fight_result;

    var fightOutcome = (fightResult.isWin ? 1 : 0);

    if(fightResult.is_power_attack){
      winCount  = parseInt(fightResult.power_attack.won);
      lossCount = parseInt(fightResult.power_attack.lost);
      fightsWon  = winCount*cityMultiplier;
      fightsLost = lossCount*cityMultiplier;
    }

    if(fightResult.cash){
      var cashCity = parseInt(fightResult.cash_city) - 1;
      cashGainTxt = cities[cashCity][CITY_CASH_SYMBOL]+makeCommaValue(fightResult.cash);
    } else {
      var cashCity = parseInt(fightResult.cash_city) - 1;
      cashGainTxt = cities[cashCity][CITY_CASH_SYMBOL]+makeCommaValue(0);
    }

    if(fightResult.experience){
      xpGainTxt = fightResult.experience;
    }

    if(fightResult.defender.is_iced){
      targetIced = true;
    }

    if(fightResult.defender.is_killed){
      targetKilled = true;
    }

    if(fightResult.defender.you_iced || fightResult.you_just_iced || fightResult.you_just_killed){
      iceScored = true;
      bragCounter = parseInt(fightResult.ices_so_far);
      bragTarget = parseInt(fightResult.ices_target);
      bragCountEltTxt = bragCounter;
      if(bragTarget) bragCountEltTxt +=' of '+bragTarget;
    }

    if(fightResult.ice_was_just_stolen){
      iceStolen = true;
      stealerID = fightResult.thief_id;
      stealerInMafia = fightResult.thief_isInMafia;
      stealerName = fightResult.thief_name;
      stealerLevelTxt = ', a '+fightResult.thief_class;
      if(stealerLevelTxt.match(/(\d+)/)) stealerLevel = RegExp.$1;
      stealerLevel = (isNaN(stealerLevel)) ? 9999 : parseInt(stealerLevel);
    }

    //Backup for differences between JSONresponse and screen output
    if(targetIced || targetKilled){
      if(defenderStatElt){
        defenderStatEltId = defenderStatElt.id;
        switch(defenderStatEltId){
        case "fv2_defender_overlay_stolen":
          iceStolen = true;
          break;
        case "fv2_defender_overlay_iced":
          iceScored = true;
          targetIced = true;
          break;
        case "fv2_defender_overlay_killed":
          iceScored = true;
          targetKilled = true;
          break;
        case "fv2_defender_iced_self":
        case "fv2_defender_was_iced":
          targetIced = true;
          break;
        }
        if(iceScored){
          var bragCountElt = xpathFirst('.//div[@class="fv2_defender_overlay_next_count"]' , defenderStatElt);
          if(bragCountElt){
            bragCountEltTxt = bragCountElt.innerHTML;
            if(bragCountEltTxt.match(/(\d+)\//)){
              bragCounter = parseInt(RegExp.$1);
            }
          }
        }
      }
    }
  } else {
    // determin win or loose
    var fightOutcome=0;
    fightResultElt = xpathFirst('.//img[contains(@src,"youwin")]', fightResults);
    if(v2Won || fightResultElt) fightOutcome = 1;

    //non-power attack results
    var winCount = fightOutcome > 0 ? 1 : 0;
    var lossCount = fightOutcome == 0 ? 1 : 0;

    var wonFights = xpathFirst('.//span[@class="good" and contains(text(),"Win")]' , fightResults);
    if(wonFights){
      wonFightsTxt = wonFights.innerHTML.untag();
      if(wonFightsTxt.match(/(\d+)/)) winCount = parseInt(RegExp.$1);
    }

    var lostFights = xpathFirst('.//span[@class="bad" and contains(text(),"Loss")]' , fightResults);
    if(lostFights){
      lostFightsTxt = lostFights.innerHTML.untag();
      if(lostFightsTxt.match(/(\d+)/)) lossCount = parseInt(RegExp.$1);
    }

    fightsWon  = winCount*cityMultiplier;
    fightsLost = lossCount*cityMultiplier;

    var cashGainElt = xpathFirst('.//td[contains(@class,"cash_icon")]' , fightResults);
    if(cashGainElt){
      cashGainTxt = cashGainElt.innerHTML.untag();
      cashGainTxt = (cashGainTxt.match(REGEX_CASH)? RegExp.lastMatch : cashGainTxt);
    }

    var xpGainElt = xpathFirst('.//td[@class="experience"]', fightResults);
    if(xpGainElt) xpGainTxt = xpGainElt.innerHTML.untag();

    if(defenderStatElt){
      defenderStatEltId = defenderStatElt.id;
      switch(defenderStatEltId){
      case "fv2_defender_overlay_stolen":
        iceStolen = true;
        break;
      case "fv2_defender_overlay_iced":
        iceScored = true;
        targetIced = true;
        break;
      case "fv2_defender_overlay_killed":
        iceScored = true;
        targetKilled = true;
        break;
      case "fv2_defender_iced_self":
      case "fv2_defender_was_iced":
        targetIced = true;
        break;
      }
      if(iceScored){
        var bragCountElt = xpathFirst('.//div[@class="fv2_defender_overlay_next_count"]' , defenderStatElt);
        if(bragCountElt){
          bragCountEltTxt = bragCountElt.innerHTML;
          if(bragCountEltTxt.match(/(\d+)\//)) bragCounter = parseInt(RegExp.$1);
        }
      }
    }
  }

  if(winCount){
    result += '. You <span class="good">WON</span> ';
    (winCount==1) ? result+= ' the fight' : result+= winCount+' fights';
  }

  if(lossCount){
    result += '. You <span class="bad">LOST</span> ';
    (lossCount==1) ? result+= 'the fight' : result+= lossCount+' fights';
  }

  if(fightOutcome){
    result += ' and gained <span class="good">'+ xpGainTxt+' experience</span> and '+'<span class="good">'+ cashGainTxt+'</span>.';
    addToLog('yeah Icon', result);
  }
  else {
    if(cashGainTxt!="0"){
      result += ', losing <span class="bad">'+ cashGainTxt+'</span>. You still gained <span class="good">'+ xpGainTxt+' experience</span>.';
    } else {
      if(xpGainTxt!=0){
        result += '. You still gained <span class="good">'+ xpGainTxt+' experience</span>.';
      } else {
        result += '.';
      }
    }
    if(isGMChecked('fightRemoveStronger')) result += '<br>Too strong: Avoiding!';
    addToLog('omg Icon', result);
  }
  result = '';

  if(!isGMChecked('noStats')){
    var experience = 0;
    if(!isNaN(xpGainTxt)) experience = parseInt(xpGainTxt);
    takeFightStatistics(experience, fightsWon, fightsLost, cashGainTxt);
    updateLogStats();
  }

  if(iceScored){
    var iceScoredIcon = "";
    if(targetIced){
      //logEvent(xw_user, context.id.replace('p|',''), 1, logName, logLevel);
      result=' You <span style="color:#00FFFF;">ICED</span> '+user;
      iceScoredIcon = 'iced Icon';
    } else if(targetKilled){
      //logEvent(xw_user, context.id.replace('p|',''), 2, logName, logLevel);
      result=' You <span class="bad">KILLED</span> '+user;
      iceScoredIcon = 'killedMobster Icon';
    }
    if(bragCountEltTxt){
      result+=', bringing your current iceCount to <span style="color:#00FFFF;">'+ bragCountEltTxt+'</span>.';
      if(bragCounter && defenderStatElt){
        var publishFrequency =  parseInt(GM_getValue('autoIcePublishFrequency')) ? parseInt(GM_getValue('autoIcePublishFrequency')) : 1;
        var logFrequency = parseInt(bragCounter % publishFrequency);
        if(logFrequency==0 && isGMChecked('autoIcePublish')){
          var bragElt = xpathFirst('.//div[@class="fv2_defender_overlay_brag_action" and not(contains(@style,"opacity: 0.5;"))]', defenderStatElt);
          if(bragElt &&isGMChecked('autoGlobalPublishing')){
            var bragLink = xpathFirst('.//a[@class="sexy_button_new medium white sexy_announce_gray"]', bragElt);
            if(bragLink){
              clickElement(bragLink);
              result+=' (Icing published: '+ publishFrequency+ ' / ' +publishFrequency+')';
            }
          }
        } else {
          result+=' (Icing not published: '+ logFrequency+ ' / ' +publishFrequency+')';
        }
      }
    } else {
      result +='.';
    }
    addToLog(iceScoredIcon, result);
  } else if(iceStolen){
    if(isGMChecked('fightIceStealers') && !inClanBattle){
      if(!defenderStatElt){
        defenderDetails = xpathFirst('.//div[@id="wrapper_defender"]', innerPageElt);
        defenderStatElt = xpathFirst('.//div[@id="fv2_defender_overlay_stolen" and contains(@style,"block")]', defenderDetails);
      }
      if(defenderStatElt && defenderStatElt.id=="fv2_defender_overlay_stolen"){
        stealerClanElt = xpathFirst('.//a[contains(@href,"xw_controller=clan")]' , defenderStatElt);
        stealerNameElt = xpathFirst('.//a[contains(@href,"xw_controller=stats")]', defenderStatElt);
        if(stealerClanElt){
          stealerName = linkToString(stealerClanElt, 'user')+' ';
        }
        if(stealerNameElt){
          stealerName += linkToString(stealerNameElt, 'user');
        }
        var stealerLevelElt = xpathFirst('.//div[@class="fv2_defender_overlay_level"]' , defenderStatElt);
        if(!stealerLevelElt) stealerLevelElt = xpathFirst('.//div[contains(text(),"Level")]', defenderStatElt);
        if(stealerLevelElt){
          stealerLevelTxt = ', a '+stealerLevelElt.innerHTML.untag();
          if(stealerLevelTxt.match(/(\d+)/)) stealerLevel = RegExp.$1;
          stealerLevel = (isNaN(stealerLevel)) ? 9999 : parseInt(stealerLevel);
        }
        addToLog('iceStolen Icon','Your ICE was stolen by <span class="user">'+stealerName+'</span>'+stealerLevelTxt+'.');
        if(stealerInMafia){
          addToLog('omg Icon', 'Skipping the Revenge on '+stealerName+stealerLevelTxt+' for stealing your Ice ... part of your mafia');
        } else {
          revengeButton = xpathFirst('.//div[@id="fv2_defender_overlay_stolen_btn"]//a' , defenderStatElt);
          if(!revengeButton) revengeButton = xpathFirst('.//div[@id="fv2_defender_overlay_stolen"]//a[contains(.,"Attack)]' , defenderDetails);
          if(revengeButton){
            var opponentLevelMax = parseInt(GM_getValue('fightLevelMax', 100));
            // Make any relative adjustments (if enabled).
            if(GM_getValue('fightLevelMaxRelative', false)){
              opponentLevelMax = opponentLevelMax + level;
            }
            if(stealerLevel <= opponentLevelMax){
              opponent = new Player();
              // Get the opponent's details.
              opponent.profile   = stealerNameElt;
              opponent.familyElt = stealerClanElt;
              opponent.nameElt   = stealerNameElt;
              if(stealerID){
                opponent.id = stealerID.replace('p|','');
              } else {
                var onClickText;
                if(opponent.profile.hasAttribute('href')) onClickText = opponent.profile.getAttribute('href');
                if(onClickText.match(/(user|opponent_id)\=(.+)/)){
                  opponent.id = decodeID(RegExp.$2);
                }
              }

              opponent.attack     = revengeButton;
              opponent.level      = stealerLevel;
              opponent.name       = stealerName;
              opponent.linkedName = stealerName;
              //opponent.faction = '';
              opponent.mafia   = '501';
              var fightNames = isGMChecked('fightNames');
              var avoidNames = isGMChecked('fightAvoidNames');
              if(fightNames && avoidNames && isFamily(decodeHTMLEntities(opponent.name),STAMINA_HOW_FIGHT_RANDOM)){
                addToLog('process Icon', 'Skipping the Revenge on '+stealerName+stealerLevelTxt+' for stealing your Ice ... isFamily');
              } else {
                opponent.fightsDone=0;
                autoFight.revengeTarget = opponent;
                Autoplay.fx = function(){
                  if(city==BRAZIL || city == CHICAGO) clickAction = 'multifight';
                  else clickAction = 'fight';
                  clickContext = opponent;
                  colorDEBUG('autoFight - Revenge: Clicked to '+revengeButton.innerHTML+' '+ stealerName+'.', cye);
                  clickElement(revengeButton);
                  addToLog('process Icon', 'Clicked to take Revenge on '+stealerName+stealerLevelTxt+' for stealing your Ice ...');
                };
                Autoplay.delay = noDelay;
                Autoplay.start();
                return true;
              }
            } else addToLog('process Icon', 'Skipping the Revenge on '+stealerName+stealerLevelTxt+' for stealing your Ice ... deemed to strong (max. level: '+opponentLevelMax+')');
          } else colorDEBUG('Revenge Button not Found !', cre);
        }
      } else colorDEBUG('Revenge Overlay Ice Stolen not Found !', cre);
    } else colorDEBUG('fightIceStealers unchecked or in famliy battle - no revenge');
  } else if(context.iced) addToLog('iceStolen Icon', user+' was already <span style="color:#00FFFF;">ICED</span>. Getting next target ...');
  else addToLog('info Icon', 'Getting next target ...');
} catch(fightErr){ colorDEBUG('fightErr:'+fightErr); }
}

function logLootDrops(statGainTxt){
  var lootDrops = $x('.//div[@class="fightV2_items_won"]/div[contains(@id,"fv2_gained_loot")]', innerPageElt);
  if(lootDrops && lootDrops.length>0){
    var lootDropTxt='';
    var lootDropItems='';
    for(i=0,iLength = lootDrops.length;i<iLength;i++){
      var fakeItem = xpathFirst('.//div[@class="item_card_mini fake_item_card"]', lootDrops[i]);
      if(fakeItem){
        if(lootDropTxt) lootDropTxt += ', '+lootDrops[i].innerHTML.untag();
        else lootDropTxt = 'Loot Found: '+lootDrops[i].innerHTML.untag();
      } else {
        var lootImg = xpathFirst('.//img', lootDrops[i]);
        if(lootImg){
          var lootDiv = lootImg.parentNode;
          if(lootDiv){
            if(lootDropItems) lootDropItems += '<div class="lootItem">'+lootDiv.innerHTML+'</div>';
            else lootDropItems = 'Loot Found:<br><div class="lootItem">'+lootDiv.innerHTML+'</div>';
          }
        }
      }
    }
    if(lootDropTxt) addToLog('lootbag Icon', lootDropTxt);
    if(lootDropItems) addToLog('lootbag Icon', lootDropItems);
  }
  if(statGainTxt) addToLog('process Icon', statGainTxt);
}

function logFightResponse(rootElt, resultElt, context, multifight, respJSON){
try{
  var fightResult=false;
  var v2Won;
  var v2Lost;
  //General Settings
  if(!resultElt) resultElt = rootElt;
  var inner = resultElt.innerHTML;
  var innerNoTags = inner.untag();
  //Fight Settings
  var isNormalFightResponse = false;
  var reAttackOpponent      = false;
  var fightMaxAttacks   =  GM_getValue('fightMaxAttacks',0);
  var fightHealthMax    =  GM_getValue('fightHealthMax',0);
  var fightHealthPctMax =  GM_getValue('fightHealthPctMax',0);
  var fightMaxAttacks   =  GM_getValue('fightMaxAttacks',0);
  var minHealth = isGMChecked('attackCritical') ? 21 : 29; // 20 works on fight page, need 21 to hit from profile page.
  var cashGainTxt;
  var cityMultiplier = (city == BRAZIL || city == CHICAGO) ? 5 : 1;
  //Opponent Settings
  var lastOpponent = context;
  if(isNaN(lastOpponent.fightsDone)){ lastOpponent.fightsDone = cityMultiplier; } else { lastOpponent.fightsDone += cityMultiplier; }
  if(isNaN(lastOpponent.totalCash)){ lastOpponent.totalCash = 0; }
  if(isNaN(lastOpponent.targetHealth)){ lastOpponent.targetHealth = 0; }
  if(isNaN(lastOpponent.targetEstimatedHealth)){ lastOpponent.targetEstimatedHealth = 0; }
  if(isNaN(lastOpponent.targetHealthCnt)){ lastOpponent.targetHealthCnt = 0; }
  if(isNaN(lastOpponent.targetHealthPct)){ lastOpponent.targetHealthPct = 0; }
  if(isNaN(lastOpponent.targetPrevHealthPct)){ lastOpponent.targetPrevHealthPct = 0; }
  if(isNaN(lastOpponent.targetStartHealthPct)){ lastOpponent.targetStartHealthPct = 0; }
  if(isNaN(lastOpponent.totaldamage)){ lastOpponent.totaldamage = 0; }

  if(respJSON){
    try{
    reAttackOpponent = true;
    isNormalFightResponse = true;
    if(respJSON.user_fields && respJSON.fight_result){
      var userFields  = respJSON.user_fields;
      fightResult = respJSON.fight_result;
      if(typeof respJSON.user_fields.user_health !== undefined) health = parseInt(respJSON.user_fields.user_health);
      if(typeof respJSON.user_fields.user_stamina !== undefined) stamina = parseInt(respJSON.user_fields.user_stamina);

      if(fightResult !== false && respJSON.fight_result.defender !== undefined){

        if(respJSON.fight_result.defender.is_iced || respJSON.fight_result.defender.is_killed){
          lastOpponent.iced = true;
          reAttackOpponent = false;
          if(respJSON.fight_result.defender.you_iced || respJSON.fight_result.you_just_iced)
            colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' - You ICED : fight_result.defender.you_iced || respJSON.fight_result.you_just_iced', caq);
          else if(respJSON.fight_result.you_just_killed)
            colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' - You KILLED : fight_result.you_just_killed', caq);
          else if(respJSON.fight_result.ice_was_just_stolen)
            colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' - ICE STOLEN : fight_result.ice_was_just_stolen', cre);
          else colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' : IS ICED : fight_result.defender.is_iced || fight_result.defender.is_killed', cre);
        }

        if(!fightResult.isWin && isGMChecked('fightRemoveStronger')){
          reAttackOpponent = false;
          lastOpponent.toStrong=true;
          colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' : LOST', cre);
        }

        lastOpponent.damage = parseInt(respJSON.fight_result.defender.damage_dealt);

        lastOpponent.totaldamage += lastOpponent.damage;

        lastOpponent.targetHealthPct = parseInt(respJSON.fight_result.defender.current_health_pct);
        if(!lastOpponent.targetStartHealthPct) lastOpponent.targetStartHealthPct = lastOpponent.targetHealthPct;

        if(fightHealthPctMax && lastOpponent.targetHealthPct > fightHealthPctMax){
          reAttackOpponent = false;
          colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' : lastOpponent.targetHealthPct > fightHealthPctMax - '+lastOpponent.targetHealthPct+' vs '+fightHealthPctMax, cre);
        }

        if(lastOpponent.targetHealthPct < lastOpponent.targetStartHealthPct){
          var healthChange = parseInt(lastOpponent.targetStartHealthPct - lastOpponent.targetHealthPct);
          if(healthChange) lastOpponent.targetEstimatedHealth = parseInt((100/healthChange)*lastOpponent.totaldamage);
          if(fightHealthMax && lastOpponent.targetEstimatedHealth > fightHealthMax){
            if(lastOpponent.targetHealthCnt>2){
              reAttackOpponent = false;
              colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' : lastOpponent.targetEstimatedHealth > fightHealthMax - '+lastOpponent.targetEstimatedHealth+' vs '+fightHealthMax, cre);
            }
            lastOpponent.targetHealthCnt++;
          }
        }

        lastOpponent.targetPrevHealthPct = lastOpponent.targetHealthPct;

        if(fightResult.is_power_attack){
          fightsWon  = parseInt(fightResult.power_attack.won);
          fightsLost = parseInt(fightResult.power_attack.lost);
          lastOpponent.fightsDone = (fightsWon+fightsLost)*cityMultiplier;
        }

        if(fightResult.cash){
          var cashCity = parseInt(fightResult.cash_city) - 1;
          if(lastOpponent.totalCash) lastOpponent.cashGained = parseInt(fightResult.cash)-lastOpponent.totalCash;
          else lastOpponent.cashGained = parseInt(fightResult.cash);
          lastOpponent.totalCash = parseInt(fightResult.cash);
          cashGainTxt = cities[cashCity][CITY_CASH_SYMBOL]+makeCommaValue(lastOpponent.cashGained);
        } else {
          var cashCity = parseInt(fightResult.cash_city) - 1;
          cashGainTxt = cities[cashCity][CITY_CASH_SYMBOL]+makeCommaValue(0);
        }

        var totalGainTxt = cities[cashCity][CITY_CASH_SYMBOL]+makeCommaValue(lastOpponent.totalCash);

        if(fightResult.experience) xpGainTxt = fightResult.experience;

        if(isGMChecked('staminaLogDetails'))
          addToLog('process Icon','Target - '+lastOpponent.linkedName+'<br>Fights - Won : '+fightsWon+', Lost: '+fightsLost+', Cash: '+totalGainTxt+', Exp: '+xpGainTxt);

        var statGainTxt = "";
        if(typeof respJSON.fightbar !== undefined){
          var fightBar = respJSON.fightbar;
          curAttack       = parseInt(fightBar.skill_atk.replace(',',''));
          curDefense      = parseInt(fightBar.skill_def.replace(',',''));
          curAttackEquip  = parseInt(fightBar.group_atk.replace(',',''));
          curDefenseEquip = parseInt(fightBar.group_def.replace(',',''));
          var attackEquipGain  = curAttackEquip - prevAttackEquip;
          var defenseEquipGain = curDefenseEquip - prevDefenseEquip;
          if(attackEquipGain)  statGainTxt += 'Equipment Attack Strength: <span class="loot">' +curAttackEquip+'</span> (was: '+prevAttackEquip+')<br>';
          if(defenseEquipGain) statGainTxt += 'Equipment Defense Strength: <span class="loot">' +curDefenseEquip+'</span> (was: '+prevDefenseEquip+')<br>';
          prevAttackEquip  = curAttackEquip;
          prevDefenseEquip = curDefenseEquip
        }

        if(fightResult.loot[0] || fightResult.socialMessageCards[0]) logLootDrops(statGainTxt)
      } else colorDEBUG('logFightResponse fightResult === false || respJSON.fight_result.defender === undefined', cre);
    } else colorDEBUG('logFightResponse invalid JSON response for fighting', cre);
    } catch(jsonErr) { colorDEBUG('jsonErr: '+jsonErr); }
  } else if(resultElt.id == "fv2_widget_wrapper"){
    var curHealth = xpathFirst('.//span[@id="user_health"]');
    health = parseInt(curHealth.innerHTML);
    isNormalFightResponse = true;
    reAttackOpponent = true;
    var fight_wrapper = xpathFirst('.//div[@id="fight_wrapper"]' , innerPageElt);
    if(!fight_wrapper) fight_wrapper = resultElt;
    var fv2_defender_was_iced = xpathFirst('.//div[@id="fv2_defender_was_iced" and contains(@style,"block")]', fight_wrapper);
    var fv2_defender_you_iced = xpathFirst('.//div[@id="fv2_defender_you_iced" and contains(@style,"block")]', fight_wrapper);
    v2Won  = xpathFirst('.//div[@id="attacker_fight_status" and contains(@class,"good") and contains(text(),"Won")]', fight_wrapper);
    v2Lost = xpathFirst('.//div[@id="attacker_fight_status" and contains(@class,"bad")  and (contains(text(),"LOST") or contains(text(),"Lost"))]', fight_wrapper);

    if(v2Won || v2Lost){
      logLootDrops();

      var defenderHealthBar = xpathFirst('.//div[@id="defender_hp"]', fight_wrapper);
      if(defenderHealthBar){
        var defenderHealthBarValue=0;
        var defenderHealthBarStyle = defenderHealthBar.getAttribute('style');
        if(defenderHealthBarStyle.match(/width:(.+)px/)) defenderHealthBarValue = RegExp.$1;
        if(!isNaN(defenderHealthBarValue)) lastOpponent.HealthBar=parseFloat(defenderHealthBarValue);
      }

      if((!v2Won || v2Lost) && isGMChecked('fightRemoveStronger')){
        reAttackOpponent = false;
        lastOpponent.toStrong = true;
        colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' : LOST', cre);
      }

      if(fv2_defender_was_iced || fv2_defender_you_iced){
        reAttackOpponent = false;
        lastOpponent.iced = true;
        if(fv2_defender_you_iced) colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' : fv2_defender_you_iced', caq);
        else colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' : fv2_defender_was_iced', cre);
      }

      var cashGainElt = xpathFirst('.//td[contains(@class,"cash_icon")]' , resultElt);
      if(cashGainElt){
        cashGainTxt = cashGainElt.innerHTML.untag();
        cashGainTxt = cashGainTxt.match(REGEX_CASH)? RegExp.lastMatch : cashGainTxt;
        lastOpponent.totalCash += parseCash(cashGainTxt);
      }

      if(isGMChecked('staminaLogDetails')){
        if(v2Won) fightTxt = '<span class="good">Fight WON</span>';
        else  fightTxt = '<span class="bad">Fight LOST</span>';
        addToLog('process Icon','Target - '+lastOpponent.linkedName+': '+ fightTxt);
      }
    } else {
      colorDEBUG('logFightResponse no v2Won / v2Lost element', cre);
      reAttackOpponent = false;
      isNormalFightResponse = true;
    }
  } else {
    if(resultElt.hasAttribute('class')){
      if(resultElt.getAttribute('class') == "fight_results"){
        reAttackOpponent = false;
        isNormalFightResponse = false;
      }
    }
  }

  if(reAttackOpponent && (!canSpendStamina() || ptsToNextLevel <= 6 ||  health < minHealth)){
    reAttackOpponent = false;
    colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' : !canSpendStamina() || ptsToNextLevel <= 6 ||  health < minHealth', cre);
  }

  if(reAttackOpponent && fightMaxAttacks && lastOpponent.fightsDone > fightMaxAttacks){
    reAttackOpponent = false;
    colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' : '+lastOpponent.fightsDone+' > '+GM_getValue('fightMaxAttacks',0), cre);
  }

  if(reAttackOpponent){
    var how = getStaminaMode();
    if(how == STAMINA_HOW_FIGHT_LIST){
      reAttackOpponent =
        isGMChecked ('staminaReattackList') &&
        ( (GM_getValue('reattackThresholdList') == 0) || (parseCash(cashGainTxt) >= GM_getValue('reattackThresholdList') && cashGainTxt.indexOf(cities[city][CITY_CASH_SYMBOL]) != -1) );
    } else {
      reAttackOpponent =
        isGMChecked ('staminaReattack') &&
        ( (GM_getValue('reattackThreshold') == 0) || (parseCash(cashGainTxt) >= GM_getValue('reattackThreshold') && cashGainTxt.indexOf(cities[city][CITY_CASH_SYMBOL]) != -1) );
    }
    if(!reAttackOpponent) colorDEBUG('SKIPPING the attack on '+ lastOpponent.name+' INVALID cashGainTxt: '+cashGainTxt, cre);
  }
  //fall back method
  if(lastOpponent.iced || (lastOpponent.toStrong && isGMChecked('fightRemoveStronger'))) reAttackOpponent == false;

  if(isGMChecked('autoHeal') &&  health < GM_getValue('healthLevel', 0) && (stamina >= GM_getValue('stamina_min_heal')) && canForceHeal() && canautoheal()) heal();

  if(reAttackOpponent!==false){
    var fv2_btncontainer;
    var fv2_btn_div;
    var fightv2_atkbtn;
    fv2_btncontainer = xpathFirst('.//div[@class="fv2_btncontainer"]', resultElt);
    if(fv2_btncontainer){
      var paStamina = cityMultiplier * 5;
      if (isGMChecked('staminaPowerattack') && stamina >=paStamina && ((isGMChecked('stopPA') && health >= GM_getValue('stopPAHealth')) || !isGMChecked('stopPA'))) {
        fv2_btn_div = xpathFirst('.//div[@id="fv2_button_row2"]/div[contains(@style,"block")]', fv2_btncontainer);
      } else fv2_btn_div = xpathFirst('.//div[@id="fv2_button_row1"]/div[contains(@style,"block")]', fv2_btncontainer);
      if(fv2_btn_div){
        fightv2_atkbtn = xpathFirst('.//a[contains(@class,"fightV2AttackBtn")]', fv2_btn_div);
        if (!fightv2_atkbtn) fightv2_atkbtn = xpathFirst('.//a[contains(@class,"fightV2PowerAtkBtn")]', fv2_btn_div);
        if(!fightv2_atkbtn) colorDEBUG('SKIPPING the attack on '+ context.name+' : fightv2_atkbtn NOT FOUND.', cre);
        else {
          eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('5 0=3.q(\'j\');h(g(\'f\',8.e(8.c()*a)+a)!=m())0=0.9(/2=\\d+/,"2=1");i 0=0.9(/2=\\d+/,"2=6");5 4=k(l);3.b(\'n\',\'o("\'+4+\'",\\\'\'+0+\'\\\',1);p 7;\');r(7,\'s t u\');v.w=3;',33,33,'v2attackhref||click_amt|fightv2_atkbtn|ajaxID|var||false|Math|replace|78|setAttribute|random||floor|checkMWAPSum|GM_getValue|if|else|href|createAjaxPage|true|mwapValidation|onclick|do_ajax|return|getAttribute|autoReload|fight|box|attacking|lastOpponent|attackAgain'.split('|'),0,{}))
          Autoplay.fx = function() {
            if(city==BRAZIL || city == CHICAGO || fightv2_atkbtn.innerHTML.match(/\d/i)) clickAction = 'multifight';
            else clickAction = 'fight';
            clickContext = context;
            clickElement(fightv2_atkbtn);
            colorDEBUG('autoFight - Clicked to REPEAT the '+fightv2_atkbtn.innerHTML+' attack on '+ context.name+'.', cye);
          };
          Autoplay.delay = noDelay;
          Autoplay.start();
          return true;
        }
      } else colorDEBUG('SKIPPING the attack on '+ context.name+' : fv2_btn_div / row INVALID / NOT FOUND.', cre);
    } else colorDEBUG('SKIPPING the attack on '+ context.name+' : fv2_btncontainer NOT FOUND.', cre);
  }

  if(isNormalFightResponse){
    if(lastOpponent.toStrong){
      setFightOpponentAvoid(lastOpponent);
/*
      fv2_btncontainer = xpathFirst('.//div[@class="fv2_btncontainer"]', resultElt);
      if(fv2_btncontainer){
        fv2_btncontainer_inner = fv2_btncontainer.innerHTML.untag();
        if(fv2_btncontainer_inner.indexOf('Attack Again') != -1 && lastOpponent.id.indexOf('p|') != -1){
          var liveTarget = lastOpponent.id.replace('p|','')
          getHelp(liveTarget, lastOpponent.name, lastOpponent.level);
          DEBUG('Fight Response : liveTarget detected and LiveLinks feed entry sent');
        }
      }
*/
    }

    try {
      if(fightResult || v2Won || v2Lost) logFightOutcome(lastOpponent, respJSON);
      if(!autoFight.revengeTarget){
        var closeWrapperBtn = xpathFirst('.//a[@class="close" and contains(@onclick,"CloseJS")]', fight_wrapper);
        if(closeWrapperBtn){
          clickElement(closeWrapperBtn);
          var close_wrapper = xpathFirst('.//div[@id="fv2_widget_wrapper" and contains(@style,"none")]' , innerPageElt);
          if(close_wrapper) destroyByID('fv2_widget_wrapper');
        }
      }

      //Ask for boosts
      if(isGMChecked('autoGlobalPublishing') && !timeLeftGM('askFightBoostsTimer')){
        var boostsAllowedElt = xpathFirst('.//div[@class="fv2_boost_ask_allowed" and not(contains(@style,"none"))]',fight_wrapper);
        if(boostsAllowedElt){
          var boostsElt = xpathFirst('.//div[@class="fv2_boost_ask_action"]//a' , fight_wrapper);
          if(boostsElt){
            clickElement(boostsElt);
            setGMTime('askFightBoostsTimer', '01:00:05');
          }
        }
      }
      if(GM_getValue('staminaSpendHow') == getStaminaMode()) cycleSavedList('pfightlist');
      randomizeStamina();
      Autoplay.delay = getAutoPlayDelay();
      return false;
    } catch (ex){  //colorDEBUG('A BUG DETECTED in log data for new fight box : '+ ex,cre );
    }
  } else if(innerNoTags.match(/you won/i)){
    var fightresstats = xpathFirst('.//div[@class="fightres_stats"]', resultElt);
    if(fightresstats) {
      var cashResult = xpathFirst('.//div[@class="sexy__cash good"]', fightresstats);
      var xpResult = xpathFirst('.//div[@class="fightres_experience good"]', fightresstats);
      var killResult = xpathFirst('.//div[@class="fightres_damage"]', fightresstats);
      addToLog('yeah Icon', 'You'+killResult.innerHTML+', gaining <span class="good">'+cashResult.innerHTML+'</span> and <span class="good">'+xpResult.innerHTML+'</span>');
    }
  } else if(innerNoTags.match(/you cannot fight|part of your mafia/i)){
    if(context.id){
      DEBUG('Opponent ('+ context.id+') is part of your mafia. Avoiding.');
      setFightOpponentAvoid(context);
    }
  } else if(innerNoTags.match(/You just set/)){
      cycleSavedList('pautoHitOpponentList');
      addToLog('yeah Icon', inner);
      if(isGMChecked('bgAutoHitCheck')) setGMTime("bgAutoHitTime", "01:00");
      var fbPopupElt = xpathFirst('//a[@id="fb_dialog_cancel_button"]');
      if(fbPopupElt){
        Autoplay.fx = function(){
          clickElement(fbPopupElt);
          DEBUG('Clicked Dismissed Popup!');
        };
      Autoplay.start();
      return true;
      }
  } else if(innerNoTags.match(/There is already a bounty/) || innerNoTags.match(/You can\'t add/)){
      cycleSavedList('pautoHitOpponentList');
      if(isGMChecked('bgAutoHitCheck')) setGMTime("bgAutoHitTime", "01:00");
  } else if(innerNoTags.indexOf('too weak') != -1){
    addToLog('info Icon', '<span style="color:#FF9999;">'+'Too weak to fight.'+ '</span>');
  } else DEBUG('Unrecognized fight response:'+ innerNoTags);
  randomizeStamina();
  if(GM_getValue('staminaSpendHow') == getStaminaMode()) cycleSavedList('pfightlist');
} catch(respError){ colorDEBUG('respError: '+respError); }
return false;
}

// Spend Stamina successful, change fight location and spend mode
function randomizeStamina(){
  if(isGMEqual('staminaSpendHow', STAMINA_HOW_RANDOM)){
    var randomModes = GM_getValue('randomSpendModes');
    var spendMode = Math.floor(Math.random() * STAMINA_HOW_ROBBING);
    while(randomModes[spendMode]!='1'){ spendMode = Math.floor(Math.random() * STAMINA_HOW_ROBBING); }
    DEBUG('Stamina Spend Mode Randomize set to : '+ spendMode+' was ' +newStaminaMode);
    newStaminaMode = spendMode;

    var randomCities = GM_getValue('randomFightLocations');

    // Randomize fight location
    while (spendMode == STAMINA_HOW_FIGHT_RANDOM || spendMode == STAMINA_HOW_FIGHT_LIST){
      var stamLoc = Math.floor(Math.random()*(cities.length-1));
      DEBUG('Fight City Randomize set to : '+ stamLoc+' was ' +GM_getValue('fightLocation'));
      if(randomCities[stamLoc]=='1'){
        GM_setValue('fightLocation', stamLoc);
        DEBUG('Fight location set to : '+ cities[stamLoc][CITY_NAME]);
        break;
      } else DEBUG('Fight location did not qualify');
    }

    // Randomize robbing location
    randomCities = GM_getValue('randomRobLocations');
    while (spendMode == STAMINA_HOW_ROBBING){
      var stamLoc = Math.floor(Math.random()*(cities.length-1));
      DEBUG('Rob City Randomize set to : '+ stamLoc+' was ' +GM_getValue('robLocation'));
      if(randomCities[stamLoc]=='1'){
        GM_setValue('robLocation', stamLoc);
        DEBUG('Robbing location set to : '+ cities[stamLoc][CITY_NAME]);
        break;
      }
      else DEBUG('Rob location did not qualify');
    }

    // Randomize hitman location
    randomCities = GM_getValue('randomHitmanLocations');
    while (spendMode == STAMINA_HOW_HITMAN){
      var stamLoc = Math.floor(Math.random()*(cities.length-1));
      DEBUG('Hitman City Randomize set to : '+ stamLoc+' was ' +GM_getValue('hitmanLocation'));
      if(randomCities[stamLoc]=='1'){
        GM_setValue('hitmanLocation', stamLoc);
        DEBUG('Hitman location set to : '+ cities[stamLoc][CITY_NAME]);
        break;
      } else DEBUG('Hitman location did not qualify');
    }
  }
}

/* Handle our private do_ajax response pages.
// case 1: autoplay==false for async clicks; please pass the variable(s) action (and optionally context)
// case 2: autoplay==true for sync clicks for use with Autoplay.start(); action and context are set with Autoplay.fx
// ajaxAction/ajaxContext are only used internally for async clicks, for sync clicks please use the default clickAction/clickContext vars.
*/
function createAjaxPage(autoplay, action, context){
  if(autoplay) ajaxHandling = true;
  //function do_ajax(div, url, liteLoad, alignTop, precall, callback, callback_params, noIncrement)
  var ajaxID = autoplay ? SCRIPT.ajaxIDSync : SCRIPT.ajaxIDAsync;
  var elt = document.getElementById(ajaxID);
  if(elt){
    elt.removeEventListener('DOMSubtreeModified', handleAjaxModified, false);
    elt.parentNode.removeChild(elt);
  }
  elt = makeElement('div', null, {'id':ajaxID, 'style':'display: none;'});
  if(!autoplay){
    ajaxAction = action;
    ajaxContext = context;
  }
  elt.addEventListener('DOMSubtreeModified', handleAjaxModified, false);
  document.getElementById('verytop').appendChild(elt);
  return ajaxID;
}

function handleAjaxModified(e){
  var ajaxElt = e.target;
  // Remove event listener
  ajaxElt.removeEventListener('DOMSubtreeModified', handleAjaxModified, false);
  // Set result parsing timer
  window.setTimeout(function(){ajaxPageChanged(ajaxElt);}, 350);
}

function ajaxPageChanged(ajaxElt){
  if(!ajaxElt) return;

  // Determine which of our private AJAX pages has changed and get the result.
  var ajaxSync = ajaxElt.id == SCRIPT.ajaxIDSync ? true : false;
  var ajaxResponse = ajaxElt.innerHTML;

  // Remove ajax response element
  ajaxElt.parentNode.removeChild(ajaxElt);

  // Handle changes to the ajax pages.
  // If a click or ajax action was taken, check the response.
  var action, context;
  if(ajaxSync){
    action = clickAction;
    context = clickContext;
    clickAction = undefined;
    clickContext = undefined;
  } else {
    action = ajaxAction;
    context = ajaxContext;
    ajaxAction = undefined;
    ajaxContext = undefined;
  }
  ajaxHandling = false;
  if(!logJSONResponse(ajaxSync, ajaxResponse, action, context)){
    // No further action was taken. Kick off auto-play.
    try {
      doAutoPlay();
    } catch (ex){
      DEBUG('BUG DETECTED (ajaxPageChanged->doAutoPlay): '+ ex+'. Reloading.');
      autoReload(true, 'error !logJSONResponse');
    }
  }
}

// Interpret the response from an ajax request, return false in case Autoplay isn't used:
function logJSONResponse(autoplay, response, action, context){
  if(action=="goHome") return false;
  try {
    colorDEBUG('logJSONResponse ('+action+') default fx: goHome, delay: '+Autoplay.delay, cfu);
    
    var responseText = response.untag();

    var cashLeft, acctBalance;
    var respJSON, respData;

    if(IsJsonString(responseText)) {
      respJSON = JSON.parse(responseText);
      if(respJSON.data) if(IsJsonString(respJSON.data)) respData = JSON.parse(respJSON.data);
    }

    // Analyze money related responses
    if(action == 'collect take' || action == 'check property' || action == 'quick deposit' || action == 'quick withdraw'){
      if(!isNaN(context)){
        context = parseInt(context);
        cashElt = document.getElementById('user_cash_'+ cities[context][CITY_ALIAS]);
      }

      if(typeof respJSON.user_fields.user_group_size != undefined){
        var oSize = respJSON.user_fields.user_group_size;
        mafia = GM_getValue('userMafiaSize', 0);
        if(!mafia || mafia < oSize ){
          mafia = oSize;
          GM_setValue('userMafiaSize', mafia);
          DEBUG('User Mafia Size set to :'+mafia);
        }
      }

      // Parse cash left for depositing anywhere but LV
      if(action == 'quick deposit' && context != LV) cashLeft = isNaN(respJSON.user_cash) ? null : parseInt(respJSON.user_cash);
      // Parsing stuff for the remaining cases
      else {
        colorDEBUG('Check Property :'+respData+'<br>'+JSON.stringify(respData));
        cashLeft = isNaN(respData.cash) ? null : parseInt(respData.cash);
        if(action != 'collect take'){
          acctBalance = parseInt(respData.acct_balance);
          // Parse vault level and set free vault space
          //if(GM_getValue('vaultHandling', 0) || action == 'check vault'){
          if(GM_getValue('vaultHandling', 0) || action == 'check property'){
          try{
            colorDEBUG('parsing json response for \'check property\'');
            var respProp = respData.properties;
            if( (typeof respData.success_message) === undefined){
              colorDEBUG('respProp:'+JSON.stringify(respProp));
              //if(respJSON.data.match(/"name":"Vault","level":"?([0-9]+)"?,/i)){
                //var vaultLevel = parseInt(RegExp.$1);
                var vaultLevel = parseInt(respProp[5].level);
                var vaultCapacity = vaultLevels[vaultLevel][1];
                var vaultSpace = vaultCapacity - acctBalance;
                if(action == 'check property' && (vaultLevel != GM_getValue('vaultHandling', 0) || vaultSpace != GM_getValue('vaultSpace', 0)))
                  addToLog(cities[LV][CITY_CASH_CSS], 'Parsed new vault status: Level '+ vaultLevel+', free vault space: V$'+ makeCommaValue(vaultSpace));
                else if(action == 'check property')
                  addToLog(cities[LV][CITY_CASH_CSS], 'No change in your vault: Level '+ vaultLevel+', free vault space: V$'+ makeCommaValue(vaultSpace));
                GM_setValue('vaultHandling', vaultLevel);
                GM_setValue('vaultSpace', String(vaultSpace));
            //}
            } else { addToLog(cities[LV][CITY_CASH_CSS], 'Check vault status : '+respData.success_message); }
          } catch(vaultErr){ colorDEBUG('vaultErr: '+vaultErr); }
          }
        }
      }

      // Attempt to correct the displayed cash value
      if(cashLeft != null){
        if(cashElt) cashElt.innerHTML = cities[context][CITY_CASH_SYMBOL] + makeCommaValue(cashLeft);
        cities[context][CITY_CASH] = cashLeft;
      }
    }

    switch (action){
      case 'ask parts':
        DEBUG('logJSONResponse for ask parts');
        return false;
        break;

      // Parse Skill Point Allocation responses
      case 'autoStatAllocation':
        DEBUG('autoStatAllocation results '+ responseText);
        return false;
        break;

      case 'load battlepage':
        return false;
        break;

      case 'collect slotbonus':
        slotBonus = 0; // Reset this
        addToLog('info Icon', 'Slot Bonus Collect Result: '  + respData.json_data.dialog_message+' itemName:  '+ respData.json_data.itemName );
        break;

      case 'collect slot':
        slotSpins = respData.json_data.freeSpins;
        slotBonus = respData.json_data.bonusMeter;
        var slotText = '';
        if(respData.json_data.isJackpot){
          slotText += 'You won on the slots! Payout: '+ respData.json_data.payout+'  jackpotWinAmt: '+  respData.json_data.jackpotWinAmt;
        } else {
          slotText += 'You did not win on this slot pull.  Remaining Spins: '+ slotSpins;
        }
        addToLog('info Icon', slotText );
        DEBUG('Result: ' +respData.json_data.result+' bonusMeter:'+ respData.json_data.bonusMeter+' payout:'+ respData.json_data.payout +  ' isJackpot:'+ respData.json_data.isJackpot+' jackpotWinAmt:'+ respData.json_data.jackpotWinAmt+' freeSpins'+ respData.json_data.freeSpins);
        break;

      case 'autoStatReward':
        DEBUG('autoStatReward results '+ responseText);
        return false;
        break;

      case 'autoUpgradeNY_getBalance':
        var userBankBalance = respJSON.user_fields.user_bank_balance+'';
        GM_setValue('userBankBalance', userBankBalance);
        addToLog('updateGood Icon', 'Current NY Bank Balance: $'+userBankBalance);
        return false;
        break;

      case 'autoUpgradeNY':
        var upgradeResponse = JSON.stringify(respData);
        var upgradeResponseMsg="";
        var userBankBalance = respJSON.user_fields.user_bank_balance+'';
        GM_setValue('userBankBalance', userBankBalance);
        if(upgradeResponse.indexOf('description') != -1){
          upgradeResponseMsg = respData.description;
          if(upgradeResponseMsg.indexOf('You have purchased') != -1){
            var currentLevel = parseInt(GM_getValue(context, 999));
            currentLevel++;
            GM_setValue(context, currentLevel);
            addToLog('updateGood Icon', upgradeResponseMsg+ '. Current Level: '+currentLevel+'. Current NY Bank Balance: <span class="good">$'+userBankBalance+'</span>.');
          }
        } else {
          addToLog('updateBad Icon', upgradeResponseMsg+'. Current NY Bank Balance: <span class="good">$'+userBankBalance+'</span>.');
          GM_setValue(context, 999);
        }
        return false;
        break;

      // Parse Ice Check responses.
      case 'icecheck profile':
        var alive = !/is already dead or too weak!/.test(responseText);
        if(context){
          context.setAttribute('style', 'background: '+ (alive ? 'green;' : 'red;'));
          context.setAttribute('title', (alive ? 'Target is alive' : 'Target is iced')+', click to refresh.');
          context.addEventListener('click', customizeProfile, false);
          DEBUG('Successfully set target status: '+ (alive ? 'alive.' : 'iced.'));
        }
        return false;
        break;

      case 'fight':
        //colorDEBUG(responseText, caq);
        var fight_wrapper = xpathFirst('.//div[@id="fv2_widget_wrapper"]' , innerPageElt);
        return logFightResponse(innerPageElt, fight_wrapper, context, 0, respJSON);
        break;

      case 'multifight':
        //colorDEBUG(responseText, caq);
        var fight_wrapper = xpathFirst('.//div[@id="fv2_widget_wrapper"]' , innerPageElt);
        return logFightResponse(innerPageElt, fight_wrapper, context, 1, respJSON);
        break;

      case 'braziljob':
        var pushNextJob = false;
        var jobCity; var jobName; var xpGain; var cashGain; var cashUsed; var jobLoot; var jobMastery;

        if(!IsJsonString(responseText)){
          jobName = xpathFirst('.//h4',context).innerHTML.untag();;
          xpGain = xpathFirst('.//ul[contains(@class,"pays")]//li[@class="experience"]',context).getAttribute('base_value');
          cashGain = xpathFirst('.//ul[contains(@class,"pays")]//li[contains(@class,"cash_icon_jobs")]',context).getAttribute('base_value');
          cashUsed = xpathFirst('.//ul[contains(@class,"uses")]//li[contains(@class,"cash_icon_jobs")]',context);
          if(cashUsed) {
            cashUsed = parseInt(cashUsed.getAttribute('base_value'));
            logTxt = 'You performed <span class="job">'+jobName+'</span>, earning <span class="good">'+xpGain+' experience</span>. You spend <span class="bad">'+cities[city][CITY_CASH_SYMBOL]+makeCommaValue(cashUsed)+'</span>';
          }
          else logTxt = 'You performed <span class="job">'+jobName+'</span>, earning <span class="good">'+cities[city][CITY_CASH_SYMBOL]+makeCommaValue(cashGain)+'</span> and <span class="good">'+xpGain+' experience</span>';
          if(logTxt)  addToLog('process Icon', logTxt);
        } else {
        try {
          if( (typeof respJSON.jobResult) !== undefined){
            var jobCity = respJSON.jobResult.city;
            jobCity = jobCity-1;
            var jobName = respJSON.jobResult.name;
            var xpGain = respJSON.jobResult.experience;
            var cashGain = makeCommaValue(parseCash(respJSON.jobResult.cash));
            var cashUsed = makeCommaValue(parseCash(respJSON.jobResult.cashUsed));
            var jobLoot = respJSON.jobResult.loot[0];

            var jobMastery = parseInt(respJSON.jobResult.masteryTotal);
            var jobMasteryInc = parseInt(respJSON.jobResult.masteryIncrease);
            var jobMastered = respJSON.jobResult.mastered;
            var jobMasteryTxt = jobMastery+' % Mastered';
            var jobMasteryLeft = 100-jobMastery;
            if(jobMastery == 100 || jobMastered) pushNextJob = true;

            if(cashGain && cashGain !="0"){
              logTxt = 'You performed <span class="job">'+jobName+'</span>, earning <span class="good">'+cities[jobCity][CITY_CASH_SYMBOL]+cashGain+'</span> and <span class="good">'+xpGain+' experience</span>';
            } else {
              if(xpGain) logTxt = 'You performed <span class="job">'+jobName+'</span>, earning <span class="good">'+xpGain+' experience</span>. You spend <span class="bad">'+cities[jobCity][CITY_CASH_SYMBOL]+cashUsed+'</span>';
              else logTxt = 'You performed <span class="job">'+jobName+'</span>';
            }

            if( (typeof respJSON.jobResult.itemsUsed) !== undefined){
              itemsUsed = respJSON.jobResult.itemsUsed;
              var iLength = itemsUsed.length;
              if(iLength>0){
                var usedAnd = '';
                logTxt +=' and used ';
                for(i=0;i<iLength;i++){
                  usedQty = itemsUsed[i].quantity;
                  if(usedQty ==1){
                    usedItem = itemsUsed[i].item.quantified_singular_name;
                    logTxt += usedAnd+'<span class="bad">'+usedItem+'</span>';
                  } else {
                    usedItem = itemsUsed[i].item.name;
                    logTxt += usedAnd+'<span class="bad">'+usedQty+' x '+usedItem+'</span>';
                  }
                  usedAnd = ' and ';
                }
              }
            }

            logTxt=logTxt+'.';
            if(jobMasteryInc && !pushNextJob) logTxt+=' Job Mastery Increased by '+jobMasteryInc+'%.';
            if(logTxt)  addToLog('process Icon', logTxt);

            if(jobLoot){
              var lootDrops = $x('.//div[@class="job_additional_results"]/div[@class="loot_item"]', context);
              if(lootDrops && lootDrops.length>0){
                var lootDropTxt='';
                var lootDropItems='';
                for(i=0,iLength = lootDrops.length;i<iLength;i++){
                  var lootImg = xpathFirst('.//img', lootDrops[i]);
                  if(lootImg){
                    var lootDiv = lootImg.parentNode;
                    if(lootDiv){
                      if(lootDropItems) lootDropItems += '<div class="lootItem">'+lootDiv.innerHTML+'</div>';
                      else lootDropItems = 'Loot Found:<br><div class="lootItem">'+lootDiv.innerHTML+'</div>';
                    }
                  }
                }
                if(lootDropItems) addToLog('lootbag Icon', lootDropItems);
              }

              var itemName;
              var reqloot = false;
              var itemFound = true;
              //We assume the job dropped the correct loot
              var lootBag = new Array();
              // Try fetching the item name from the job requirement array
              requirementJob.forEach(
                function(j){
                  if(j[1].toUpperCase().trim() == jobName.toUpperCase().trim()){
                    lootBag.push(j[0]);
                    DEBUG('Matching Item: '+j[0]+' from '+j[1]);
                    itemName = j[0];
                  }
                }
              );

              var items = getSavedList('itemList');
              if(typeof(items[0]) == 'undefined' || items.length == 0 || itemFound == false){
                DEBUG('No found / needed items in required item list.');
              } else {
                // NOTE: The single equal sign is intentional in this while() condition.
                while ((itemName = lootBag.pop())){
                  DEBUG('Looking for '+ itemName+' in needed items list. We still need '+ items.length+' item(s).');
                  for (var i = 0; i < items.length; i++){
                    if(itemName.indexOf(items[i].trim()) != -1 ){
                      // we found some needed loot
                      reqLoot = true;
                      removeSavedListItem('itemList', itemName);
                      removeJobForItem('jobsToDo', itemName);
                      popJob();
                      return false;
                    }
                  }
                }
              }
              if(reqLoot) addToLog('found Icon','We assume the job dropped the item we were looking for (<span class="loot">'+ itemName+'</span>)!');
            }
          }
        } catch (ex){ //colorDEBUG('jobResult Error: '+ ex, cre);
        }

        try {
          if( (typeof respJSON.data.impulseBuy.message) !== undefined){
            var jobMessage;
            jobMessage = respJSON.data.impulseBuy.message;
            if(jobMessage.indexOf('loot drops') !=-1){

              var currentJobTitle = xpathFirst('.//h4', context);
              var currentJob = currentJobTitle.innerHTML.trim();
              var currentJobRow = context;

              var itmSearch = (/p&gt;(.+)buy/i.exec(jobMessage))[1];
              if(itmSearch!=''){
                itmSearch = itmSearch.substring(0, itmSearch.length-2);
                DEBUG('Item(s) Required for this job : '+itmSearch);
                // Save the current job for later. The current job should not already exist in the list, so check first.
                var items = getSavedList('itemList');
                var jobs = getSavedList('jobsToDo', '');
                DEBUG('Current Job List: '+jobs);
                if(jobs.indexOf(currentJob) == -1){
                  jobs.push(currentJob);
                  DEBUG('Saving '+ currentJob+' for later. Need to fetch pre-req items first.');
                  setSavedList('jobsToDo', jobs);
                } else {
                  DEBUG(currentJob+' already saved for later. Need to fetch pre-req items first.');
                }

                var itemFound = false;
                // Try fetching the items from the job requirement array
                requirementJob.forEach(
                  function(j){
                    if(level >= cities[j[2]][CITY_LEVEL] && j[0].toUpperCase().trim() == itmSearch.toUpperCase().trim()){
                      jobs.push(j[1]);
                      items.push(itmSearch.trim());
                      itemFound = true;
                      jobFound = j[1];
                    }
                  }
                );

                // Set the flag if at least one item is found
                if(!itemFound) DEBUG(itmSearch+' not found in the requirement job array.');
                else {
                  setSavedList('itemList', items.unique());
                  setSavedList('jobsToDo', jobs);
                  popJob();
                  return false;
                }
              }
            }

            if(jobMessage.indexOf('following items') !=-1){
              jobMessage = jobMessage.wipe();
              var jobButton = xpathFirst('.//a[contains(@id, "btn_dojob")]', context);
              DEBUG(jobButton.innerHTML.untag()+' : '+jobButton.id);
              var JobId = jobButton.id;
              if(JobId.match(/dojob_(\d+)/i)) JobId=RegExp.$1;
              DEBUG(' - - brazil Message results jobMessage:'+ jobMessage+' for '+ jobButton.id+' -> '+JobId);
              addToLog('warning Icon', jobMessage);

              SelectedJob = jobButton.getAttribute('href');
              colorDEBUG('Need items for '+JobId+' - '+SelectedJob+' in '+cities[city][CITY_NAME]);
              if(SelectedJob && JobId){
                var JobTab = (/tab=([\d]+)/.exec(SelectedJob))[1];
                var JobTmp = (/tmp=([\da-f]+)/.exec(SelectedJob))[1];
                var JobCb = (/cb=([\da-f]+)/.exec(SelectedJob))[1];
                var JobPerson = (/xw_person=([\d]+)/.exec(SelectedJob))[1];
                var ajaxID = createAjaxPage(true);
                // building buy link form: html_server.php?xw_controller=job&xw_action=buy_required_items&xw_city=7&tmp=8b435d14be762b9fc799f029177a4095&cb=b17fb490555e11e0bcbc6101d420c937&xw_person=43398787&jobId=29&cityId=7&xw_client_id=8
                var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","remote/html_server.php?xw_controller=job&xw_action=buy_required_items&xw_city='+cities[city][CITY_NUMBER]+'&tmp='+JobTmp+'&cb='+JobCb+'&xw_person='+JobPerson+'&jobId='+JobId+'&cityId='+cities[city][CITY_NUMBER]+'&xw_client_id=8", 1, 1, 0, 0); return false;' } ) ;
                if(elt){// Buy Items!
                    clickAction = 'buy Brazil';
                    clickContext = city;
                    clickElement(elt);
                  return false;
                } 
              } 
            }
          }
        } catch (ex){ //colorDEBUG('Error no MessageResult: '+ ex, cre);
        }

        if(pushNextJob && !isGMChecked('repeatJob')) goJobsNav();
        }
        return false;
        break;

      case 'buy Brazil':
        DEBUG(' - - brazil buy results<br>'+ responseText);
        try {
          if( (typeof respJSON.data.impulseBuy.message) !== undefined){
            var jobMessage;
            jobMessage = respJSON.data.impulseBuy.message;
            jobMessage = jobMessage.wipe();
            DEBUG(' - - brazil Message results jobMessage:'+ jobMessage);
            addToLog('info Icon', jobMessage);
          }
        } catch (ex){ //colorDEBUG('Error no MessageResult: '+ ex, cre);
        }
        return false;
        break;

      // Parse and Save property status
      case 'check property':        
        switch(context){
          case LV : GM_setValue('casinoReport', JSON.stringify(respData));
          case ITALY: GM_setValue('villageReport', JSON.stringify(respData));
          case BRAZIL: GM_setValue('brazilReport', JSON.stringify(respData));
          case CHICAGO: GM_setValue('chicagoReport', JSON.stringify(respData));
        }        
        return false;
        break;

      // Casino Parts
      case 'casino parts':
        setGMTime('askCasinoPartsTimer', '2 hours');
        DEBUG('Parsed JSONResponse for clicking AskCasinoParts. Timer Reset for 2 hours.');
        return false;
        break;

      // Play Slots
      case 'play slots':
        setGMTime('askPlaySlotsTimer', '4 hours');
        DEBUG('Parsed JSONResponse for clicking AskPlaySlots. Timer Reset for 4 hours.');
        return false;
        break;

        // Village Parts
      case 'village parts':
        setGMTime('askVillagePartsTimer', '2 hours');
        DEBUG('Parsed JSONResponse for clicking AskVillageParts. Timer Reset for 2 hours.');
        return false;
        break;

      // Football Fans
      case 'football fans':
        setGMTime('askFootballFansTimer', '4 hours');
        DEBUG('Parsed JSONResponse for clicking AskFootballFans. Timer Reset for 4 hours.');
        return false;
        break;

      // New Parts
      case 'new parts':
        colorDEBUG('new parts: '+responseText);
        setGMTime('askNewPartsTimer', '2 hours');
        DEBUG('Parsed JSONResponse for clicking AskNewParts. Timer Reset for 2 hours.');
        return false;
        break;

      // Brazil Parts
      case 'brazil parts':
        setGMTime('askBrazilPartsTimer', '2 hours');
        DEBUG('Parsed JSONResponse for clicking AskBrazilParts. Timer Reset for 2 hours.');
        return false;
        break;

      // Chicago Parts
      case 'chicago parts':
        setGMTime('askChicagoPartsTimer', '2 hours');
        DEBUG('Parsed JSONResponse for clicking AskChicagoParts. Timer Reset for 2 hours.');
        return false;
        break;

      // Save NY 'active' properties
      case 'save properties':
        return false;
        break;

      // Build from NY Limited Properties
      case 'build limited' :
        var propCount = context.propCount;
        buildProp = cityProperties[propCount][ctPropName];
        timerName = cityProperties[propCount][ctPropTimer];

        if(responseText!=""){
          addToLog('process Icon', buildProp+': '+responseText);
          setGMTime(timerName, '18 hours');
        } else {
          addToLog('warning Icon', buildProp+': You can not craft yet.');
          setGMTime(timerName, '1 hour');
        }
        return false;
        break;

      // Build ? Purcahse from ITALY / BRAZIL / CHICAGO Properties
      case 'build other':
        var propCount = context.propCount;
        var buildItem = cityProperties[propCount][ctGMId];
        var buildProp = cityProperties[propCount][ctPropName];
        var timerName = cityProperties[propCount][ctPropTimer];
        var buildCity = cityProperties[propCount][ctPropCity];
        var cityName = cities[buildCity][CITY_NAME];

        DEBUG('Make '+cityName+': '+context.itemName+' - '+context.buildType+'.')

        var refreshRate = 0;
        var timeStamp = 0;

        var respMessage = respData.purchase_message;
        addToLog('lootbag Icon', respMessage);

        if(responseText.match(/cannot be purchased/i)){
          DEBUG(context.itemName+' can not be build, disabling');
          GM_setValue(buildItem, 0);
          return false;
        }

        if(responseText.match(/available_purchases(.+?)(\d+?),/i)){
          refreshRate = parseFloat(RegExp.$2);
          DEBUG('Available Purchases Left: '+RegExp.$2);
          if(refreshRate){
            return false;
            break;
          }
        }

        if(responseText.match(/purchase_refresh_rate(.+?)(\d+?),/i)){
          refreshRate = parseFloat(RegExp.$2);
          DEBUG('Refresh Rate: '+RegExp.$2);
        }

        if(responseText.match(/last_purchase_time_stamp(.+?)(\d+?),/i)){
          timeStamp = parseFloat(RegExp.$2);
          DEBUG('timeStamp: '+RegExp.$2);
        }

        if(refreshRate && timeStamp){
          var dueTime = timeStamp + refreshRate;
          var currentTime = Math.round(new Date().getTime()/1000.0);
          DEBUG('Current: '+currentTime);
          if(currentTime < dueTime){
            var timeLeft = parseFloat(dueTime) - parseFloat(currentTime)+10;
            DEBUG('timeLeft: '+timeLeft);
            var timeLeftTxt = secondsToHMS(timeLeft);
            (timeLeftTxt ==1) ? timeLeftTxt+= ' hour' : timeLeftTxt+= ' hours';
            setGMTime(timerName, timeLeftTxt);
            DEBUG('Parsed JSONResponse for '+cityName+' Item. Timer '+timerName+' reset for '+timeLeftTxt+'.');
          } else {
            setGMTime(timerName, '2 hours');
            DEBUG('Parsed JSONResponse for '+cityName+' Item. Timer reset for 2 hours.');
            colorDEBUG(responseText);
          }
        } else {
          setGMTime(timerName, '2 hours');
          DEBUG('Parsing JSONResponse for '+cityName+' Item FAILED. Timer reset for 2 hours.');
          colorDEBUG(responseText);
        }
        return false;
        break;

      // Log any message from collecting property take.
      case 'collect take':
        var collectResponse = JSON.stringify(respData);
        var collectResponseMsg="";
        DEBUG('Collect string take :'+collectResponse);
        if(collectResponse.indexOf('description') != -1) collectResponseMsg = respData.description;
        else collectResponseMsg = respData.success_message;

        if(collectResponseMsg.match(/collected (.+?) from your properties/i)){
          var collectString = 'You have collected <span class="money">'+ RegExp.$1+'</span> from your properties.';
          addToLog(cities[context][CITY_CASH_CSS], collectString);
        }

        if(collectResponseMsg.match(/you have also received:/i)){
          var collectXtras = respData.success_image_names;
          if(collectXtras.length>0){
            collectString = 'You have also received : ';
            collectHelp = '';
            for(i=0,iLength=collectXtras.length;i<iLength;i++){
              collectString+= collectHelp + collectXtras[i].untag();
              if(i==iLength-1) collectHelp = ', ';
              else collectHelp = ' and ';
            }
            addToLog(cities[context][CITY_CASH_CSS], collectString);
          }
        }

        switch(context){
          case NY:
            if(collectResponse.indexOf('shopname') != -1 && collectResponse.indexOf('vehicleamount') != -1 && collectResponse.indexOf('vehiclename') != -1){
              var shopNames   = respData.shopname;
              var shopAmounts = respData.vehicleamount;
              var shopParts   = respData.vehiclename;
              if(shopAmounts.length>0){
                collectString = 'You also collected ';
                collectHelp = '';
                for(i=0,iLength=shopAmounts.length;i<iLength;i++){
                  collectString+= collectHelp +'<span class="property">' +shopAmounts[i]+'</span> <span class="loot">'+ shopParts[i]+'</span> items from your <span class="property">'+ shopNames[i]+'</span>';
                  if(i==iLength-1) collectHelp = ', ';
                  else collectHelp = ' and ';
                }
                addToLog(cities[context][CITY_CASH_CSS], collectString);
              }
            }
            break;
        }

        setGMTime('takeHour'+ cities[context][CITY_NAME], '1 hour'); // collect every 1 hour
        return false;
        break;

      // Log any message from withdrawing money.
      case 'quick withdraw':
        var logBalance = '<br>Remaining Bank Balance: '+ cities[context][CITY_CASH_SYMBOL] + makeCommaValue(acctBalance);
        if(/You Withdrew/i.test(respData.success_message)){
          addToLog('cashVegas Icon', respData.success_message + logBalance);
        } else {
          addToLog('warning Icon', 'Disabling autoMission:<br>You don\'t have enough money to do '+missions[GM_getValue('selectMission', 1)][MISSION_NAME]+'.'+ logBalance);
          GM_setValue('autoMission', 0);
          update_nrg_stam(); // update the icon to show energy spend is off
        }
        return false;
        break;

      // Log any message from depositing money.
      case 'quick deposit':
        // Log if city has changed after banking
        if(city != context){
          addToLog('warning Icon', 'Warning! You have traveled from '+ cities[context][CITY_NAME]+' to '+ cities[city][CITY_NAME]+' while banking. Check your money.');
        }
        var respDeposit='';
        if(context == LV) respDeposit = respData.success_message;
        else respDeposit = respJSON.deposit_message;

        // Money deposited (all cities)
        if(respDeposit.match(/([0-9,,]+).+?was deposited/i) ||                     // success for all cities except LV
            respDeposit.match(/You Deposited .\$([0-9,,]+) into your Vault/i)){    // success for LV
          quickBankFail = false;
          var cashDeposit = RegExp.$1;
          addToLog(cities[context][CITY_CASH_CSS], '<span class="money">'+ cities[context][CITY_CASH_SYMBOL] +
                   cashDeposit+'</span> was deposited '+ (context == LV ? 'into your vault.' : 'in your account after the bank\'s fee.'));

        // Las Vegas: too much money
        } else if(/cannot deposit this much/i.test(respDeposit) || /cannot deposit that much/i.test(respDeposit)){
          quickBankFail = false;
          var logText = 'You can\'t deposit this much (you don\'t have enough cash or your vault is to small).';
          if(!GM_getValue('vaultHandling', 0)) logText += '<br>Please consider enabling PS MWAP vault handling.';
          addToLog(cities[context][CITY_CASH_CSS], logText);
        // Las Vegas: vault full
        } else if(/cannot deposit any more/i.test(respDeposit)){
          quickBankFail = false;
          var logText = 'You can\'t deposit anymore, your vault is full!';
          if(!GM_getValue('vaultHandling', 0)) logText += '<br>Please consider enabling PS MWAP vault handling.';
          addToLog(cities[context][CITY_CASH_CSS], logText);
          if(GM_getValue('vaultHandling', 0)) GM_setValue('vaultSpace', '0');
        // Las Vegas: invalid amount
        } else if(/invalid amount/i.test(respDeposit)){
          quickBankFail = false;
        // Not enough money
        } else if(/have enough money/.test(respDeposit)){
          quickBankFail = false;
        // Minimum deposit not met ($10)
        } else if(/deposit at least/.test(respDeposit) && respDeposit.match(/([0-9,,]+)/)){
          quickBankFail = false;
        // Las Vegas: no vault?
        } else if(respData.result == null || acctBalance == 0){
          quickBankFail = false;
          addToLog(cities[context][CITY_CASH_CSS], 'Depositing failed without a response; if you are in Las Vegas, perhaps you don\'t have a vault yet?');
          if(GM_getValue('vaultHandling', 0)) GM_setValue('vaultSpace', '0');
        // Unknown JSON response
        } else {
          quickBankFail = true;
          addToLog('warning Icon', 'Quick Deposit failed: Unknown JSON response:<br>'+ responseText);
        }
        return false;
        break;

      case 'marketplace':
        var responseContainer = xpathFirst('.//div[@id="responseContainer"]');
        if(!responseContainer){
          responseContainer = makeElement('div', document.getElementById('final_wrapper'), {'id':'responseContainer','style':'display:none;'});
        }
        responseContainer.innerHTML = response;

        var eltContainer = makeElement('div', null, {'id':'marketInfo','style':'clear:both; width: 745px;','class':'clearfix'});
        var eltHeader = makeElement('div', eltContainer, {'id':'FightClubModule','style':'float: left; width: 735px;','class':'empire_module_header'});
        var eltTitle = makeElement('div', eltHeader, {'class':'empire_module_title'});
        var eltTitleSpan = makeElement('span', eltTitle);
        eltTitleSpan.appendChild(document.createTextNode('Fight Club'));

        var vcEltImg = xpathFirst('.//img[contains(@src,"victory_icon.gif")]', responseContainer);
        if(vcEltImg){
          vcElt = vcEltImg.parentNode;
          if(vcElt){
            var eltVC = makeElement('div', eltTitle, {'style':'float:right;margin-right:15px'});
            eltVC.innerHTML += vcElt.innerHTML;
          }
        }

        var masteryBarElt = xpathFirst('.//div[@class="fightmastery_meter"]', responseContainer);
        if(masteryBarElt){
          var eltMasteryBar = makeElement('div', eltTitle, {'class':'fightmastery_meter','style':'float:right;margin-right:45px;margin-top:-1px;'});
          eltMasteryBar.innerHTML += masteryBarElt.innerHTML;
        }

        var marketList = xpathFirst('.//div[@id="full_list"]', responseContainer);
        if(marketList){
          var eltSubContainer = makeElement('div', eltHeader, {'style':'width: 729px; padding: 5px; float: none;','class':'playerupdate_box'});
          var eltMarketList = makeElement('div', eltSubContainer);
          var itemListElts = $x('.//div[contains(@style,"relative")]', marketList);
          if(itemListElts.length>0){
            var j=0;
            for(i=itemListElts.length-1;i>=0;i--){
              if(j>=9 && i > 1) continue;
              secondElt = itemListElts[i].firstChild.nextSibling;
              fourthElt = itemListElts[i].firstChild.nextSibling.nextSibling.nextSibling;
              if(i>1){
                itemListElt = makeElement('div',  null, {'style':'float: left; width: 220px;height:135px;border:1px dotted #484848;padding:10px;'});
                eltMarketList.appendChild(itemListElt);
              } else {
                itemListElt = makeElement('div',  null, {'style':'float: left; width: 340px;height:125px;border:1px dotted #484848;padding:10px;'});
                eltMarketList.insertBefore(itemListElt, eltMarketList.firstChild);
              }
              itemListElt.innerHTML = secondElt.innerHTML+fourthElt.innerHTML;
              j++;
            }
            var eltShadow = makeElement('div', eltContainer, {'style':'float: left; background: url("http://mwfb.static.zgncdn.com/mwfb/graphics/empire/shadow_upper_right.png") no-repeat scroll 0% 0% transparent; height: 8px; width: 8px;'});
            eltShadow = makeElement('div', eltContainer, {'style':'float: left; background: url("http://mwfb.static.zgncdn.com/mwfb/graphics/empire/shadow_right_side.png") repeat-y scroll 0% 0% transparent; height: 310px; width: 8px;'});
            eltShadow = makeElement('div', eltContainer, {'style':'float: left; background: url("http://mwfb.static.zgncdn.com/mwfb/graphics/empire/shadow_lower_left.png") repeat scroll 0% 0% transparent; height: 8px; width: 8px;'});
            eltShadow = makeElement('div', eltContainer, {'style':'float: left; background: url("http://mwfb.static.zgncdn.com/mwfb/graphics/empire/shadow_bottom.png") repeat scroll 0% 0% transparent; height: 8px; width: 727px;'});
            eltShadow = makeElement('div', eltContainer, {'style':'float: left; background: url("http://mwfb.static.zgncdn.com/mwfb/graphics/empire/shadow_lower_right.png") repeat scroll 0% 0% transparent; height: 8px; width: 8px;'});
          }
        }
        context.appendChild(eltContainer);
        postSize();
        return false;
        break;
      default:
        colorDEBUG('BUG DETECTED: Unrecognized JSON action "'+ action+'".<br>'+ responseText);
        return false;
    }
  } catch (ex){
    DEBUG('Exception (logJSONResponse): '+ ex+', autoplay: '+ autoplay+', action: '+ action+', context: '+ context+', response: <br>'+ response);
  }
}

// Interprets the response to an action that was taken.
//
// rootElt: An element whose descendents contain the response to interpret.
// action:  The action taken, such as 'fight', 'heal', 'hitlist', etc.
// context: (optional) Any further data needed to describe the action
// Returns: true if something has been done that will cause the inner page
//          to change, such as clicking somewhere or loading another page.
function logResponse(rootElt, action, context){
  if(action == 'goHome') return false;

  var messagebox;
  // Set default timer properties.
  Autoplay.fx = goHome;
  Autoplay.delay = getAutoPlayDelay();

  colorDEBUG('logResponse ('+action+') default fx: goHome, delay: '+Autoplay.delay, cfu);

  if(action=='fight' || action =='multifight'){
    //autoReload(false, 'logResponse'); // stops the forced reload page
    var fight_wrapper = xpathFirst('.//div[@id="fv2_widget_wrapper"]' , rootElt);
    if(!fight_wrapper) fight_wrapper = xpathFirst('.//div[@class="fight_results"]', rootElt);
    if(!fight_wrapper){
      if(GM_getValue('staminaSpendHow') == getStaminaMode()){
        cycleSavedList('pfightlist');
        return false;
      }
    }

    switch (action){
      case 'fight':
        return logFightResponse(innerPageElt, fight_wrapper, context, 0);
        break;
      case 'multifight':
        return logFightResponse(innerPageElt, fight_wrapper, context, 1);
        break;
    }
  }

    if(action=='load clan'){
      DEBUG('Are we on the clan page we want to be on?');
      if(onClanNav(GM_getValue('AutoBattleClanID',0))){
        DEBUG('Looking for Challenge Link');
        var challenge = xpathFirst('.//a[contains(@href,"xw_controller=epicBattle&xw_action=challengePop")]', rootElt);
        if(challenge){
          DEBUG('We found the challenge button, clicking it');
          setGMTime('autoBattleTimer', '60:00');
          clickAction = 'battlePop';
          clickElement(challenge);
        } else {
          DEBUG('No Challenge Popup found check again in 10 minutes');
          setGMTime('autoBattleTimer', '10:00');
          Autoplay.delay = getAutoPlayDelay()
          Autoplay.start();
          return true;
        }
      }
  }

  if(action=='load battlepage'){
    return false;
  }

  if(action=='load battlecollect'){
    if(onBattlePage(1)){
        DEBUG('Looking for Battle Collect Link');
        var collectLink = xpathFirst('.//a[contains(@onclick,"xw_controller=epicBattle&xw_action=getResults") and contains(.,"Collect")]');//
        if(collectLink){
          DEBUG('Found a Battle Collect link clicking it');
          setGMTime('autoBattleCollectTimer', '05:00');
          clickElement(collectLink);
          Autoplay.delay = getAutoPlayDelay()
          Autoplay.start();
          return true;
        } else {
          // no collect to link found, set the timer to 60 minutes from now..
          DEBUG('No Battle Collect link found');
          setGMTime('autoBattleCollectTimer', '60:00');
          Autoplay.delay = getAutoPlayDelay()
          Autoplay.start();
          return true;
        }

    }
  }

  // Crate selling pop-up message
  if(!messagebox){ messagebox = xpathFirst('.//div[@id="default_id_box"]', rootElt); }

  // New NY job layout message result
  if(!messagebox){ messagebox = xpathFirst('.//div[contains(@class,"message_body")]', rootElt); }

  // New job layout message result
  if(!messagebox){ messagebox = xpathFirst('.//div[@class="job_results"]', rootElt); }

  // BRAZIL job layout message result
  if(!messagebox){ messagebox = xpathFirst('.//div[contains(@class,"job_controller")]', contentRoweElt); }

  // New message box message
  if(!messagebox){ messagebox = xpathFirst('.//div[@id="msg_box_div_1"]', rootElt); }

  // Message box (new header)
  if(!messagebox){ messagebox = xpathFirst('.//div[@id="mbox_generic_1"]', rootElt); }

  // Bank message
  if(!messagebox){ messagebox = xpathFirst('.//div[@id="bank_messages"]', appLayoutElt); }

  // Hospital message
  if(!messagebox){ messagebox = xpathFirst('.//div[@id="hospital_message"]', appLayoutElt); }

  // Rob message
  if(!messagebox){ messagebox = xpathFirst('.//div[@id="'+ context +'" and @class="rob_slot"]', rootElt); }
  if(!messagebox){ messagebox = xpathFirst('.//div[@class="rob_board"]', rootElt); }

  // Build Car/Weapon success popup
  if(!messagebox){ messagebox = xpathFirst('.//div[@class="chop_build_final"]', appLayoutElt); }

  // Operations Message : shows total mastery result }
  if(!messagebox){ messagebox = xpathFirst('.//div[ contains (@id,"missionTask_'+Miss_Slot+'_'+Miss_ID+'_module")]', rootElt); }

  // Normal message
  if(!messagebox){ messagebox = xpathFirst('.//table[@class="messages"]', rootElt); }

  if(action=='withdraw' && context){
    autoBankWithdraw(context);
    Autoplay.start();
    return true;
  }


  if(!messagebox){
    //if(action == 'help') return true; // no message box for help message.  Just continue on.
    if(action == 'load clan') return true; // No log message for this..
    if(action == 'load battlecollect') return true; // No log message for this..
    if(action == 'battlePop') return true; // No log message for this..
    if(action == 'autohit') return false;
    if(action == 'fight' || action=='multifight'){
      colorDEBUG(' we have passed all message boxes but have action (multi)fight  ', cbl);
      // If fighting from a user-specified list, cycle it. Otherwise, the problem might repeat indefinitely.
      if(GM_getValue('staminaSpendHow') == getStaminaMode()) cycleSavedList('pfightlist');
      return false;
    }
    //else {
    //  colorDEBUG('Unexpected response page: action -'+ action);
    //  DEBUG('Unexpected response page: no message box found - logResponse: HTML=<br/>'+ rootElt.innerHTML.untag());
    //  return false;
    //}
    messagebox = rootElt;
  }

  // Since the attempted action received a response, stop skipping fight.
  skipStaminaSpend = false;

  var inner = messagebox ? messagebox.innerHTML : '';
  var innerNoTags = inner.untag();
  var cost, experience, result;

  switch (action){
    case 'autohit':
    case 'fight':
      var fight_wrapper = xpathFirst('.//div[@id="fv2_widget_wrapper"]' , innerPageElt);
      return logFightResponse(innerPageElt, fight_wrapper, context, 0);
      break;
    case 'multifight':
      var fight_wrapper = xpathFirst('.//div[@id="fv2_widget_wrapper"]' , innerPageElt);
      return logFightResponse(innerPageElt, fight_wrapper, context, 1);
      break;

    case 'load battlecollect':
      DEBUG('We have a load battlecollect message box to handle.. doing nothing..');
      break;

    case 'braziljob':
      break;

    // Parse Skill Point Allocation responses
    case 'autoStatAllocation':
      DEBUG('autoStatAllocation results');
      return false;
      break;

    case 'autoStatReward':
      DEBUG('autoStatReward results');
      return false;
      break;

    case 'autoRob':
      if(!isGMChecked('fastRob')) return logRobResponse(rootElt, messagebox, context);
      else {
        randomizeStamina();
        Autoplay.fx = goRobbingTab;
        Autoplay.delay = noDelay;
        Autoplay.start();
        return true;
      }

    case 'Missionjob':
 //doatest
      var Mission_ResultsElt = xpathFirst('.//div[@class="task_results"]', messagebox);
      if(Mission_ResultsElt){
        DEBUG('found Mission_ResultsElt');
        var xpGainTxt="";
        var cashGainTxt="";
        var cashCostTxt="";

        var Mission_Node = Mission_ResultsElt.parentNode;
        var Mission_Name_Elt = xpathFirst('.//div[@class="doTaskName"]', Mission_Node);
        if(!Mission_Name_Elt) Mission_Name_Elt = xpathFirst('.//span[@class="doTaskName"]', Mission_Node);
        if(Mission_Name_Elt) Mission_Name = Mission_Name_Elt.innerHTML.replace(/"/g,'');

        var doTaskPaysModule = xpathFirst('.//dl[contains(.,"gained")]', Mission_ResultsElt);

        var xpGainElt = xpathFirst('.//dd[@class="experience doTaskDDHeight"]', doTaskPaysModule);
        if(xpGainElt){
          xpGainTxt = xpGainElt.innerHTML;
          if(xpGainTxt.match(/([\d,]*\d)\s*?\(you/i)) xpGainTxt = RegExp.$1+ " experience";
        }

        var cashGainElt = xpathFirst('.//dd[@class="italy_cash_icon doTaskDDHeight"]', doTaskPaysModule);
        bankCity = ITALY;
        if(!cashGainElt){
          cashGainElt = xpathFirst('.//dd[@class="vegas_cash_icon doTaskDDHeight"]', doTaskPaysModule);
          bankCity = LV;
        }
        if(!cashGainElt){
          cashGainElt = xpathFirst('.//dd[@class="brazil_cash_icon doTaskDDHeight"]', doTaskPaysModule);
          bankCity = BRAZIL;
        }
        if(!cashGainElt){
          cashGainElt = xpathFirst('.//dd[@class="nyc_cash_icon doTaskDDHeight"]', doTaskPaysModule);
          bankCity = NY;
        }
        if(cashGainElt){
          cashGainTxt = cashGainElt.innerHTML;
          if(cashGainTxt.match(/([\d,]*\d)\s*?\(you/i)) cashGainTxt = cities[bankCity][CITY_CASH_SYMBOL]+RegExp.$1;
        }

        var doTaskUsesModule = xpathFirst('.//dl[contains(.,"Spent")]', Mission_ResultsElt);

        var cashCostElt = xpathFirst('.//dd[@class="italy_cash_icon doTaskDDHeight"]', doTaskUsesModule);
        bankCity = ITALY;
        if(!cashCostElt){
          cashCostElt = xpathFirst('.//dd[@class="vegas_cash_icon doTaskDDHeight"]', doTaskUsesModule);
          bankCity = LV;
        }
        if(!cashCostElt){
          cashCostElt = xpathFirst('.//dd[@class="brazil_cash_icon doTaskDDHeight"]', doTaskUsesModule);
          bankCity = BRAZIL;
        }
        if(!cashCostElt){
          cashCostElt = xpathFirst('.//dd[@class="nyc_cash_icon doTaskDDHeight"]', doTaskUsesModule);
          bankCity = NY;
        }
        if(!cashCostElt){
          cashCostElt = xpathFirst('.//dd[@class="chicago_cash_icon doTaskDDHeight"]', doTaskUsesModule);
          bankCity = CHICAGO;
        }
        if(cashCostElt){
          cashCostTxt = cashCostElt.innerHTML.untag();
          if(cashCostTxt.match(/([\d,]*\d)\s*?\(you/i)){
            cashCostTxt = cities[bankCity][CITY_CASH_SYMBOL]+RegExp.$1;
          }
        }

        if(xpGainElt && (cashGainElt || cashCostElt)){
          if(xpGainTxt && cashGainTxt){
            var result = 'You performed <span class="job">'+Mission_Name+'</span>, gaining <span class="good">'+xpGainTxt+'</span> and <span class="good">'+cashGainTxt+'</span>.';
          } else if(xpGainTxt && cashCostTxt){
            var result = 'You performed <span class="job">'+Mission_Name+'</span>, gaining <span class="good">'+xpGainTxt+'</span> and used <span class="bad">'+cashCostTxt+'</span>.';
          } else {
            var result = 'You performed <span class="job">'+Mission_Name+'</span>, gaining <span class="good">'+Miss_Pay_Exp+'</span> and <span class="good">'+Miss_Pay_Cash+'</span>.';
          }
        } else {
          var result = 'You tried to perform <span class="job">'+Mission_Name+'</span>, but you don\'t have enough energy or stamina to do the job.';
        }
        addToLog('process Icon', result);

        masteryGainElt = xpathFirst('.//div[@class="doTaskMastery"]', messagebox);
        var masteryGainTxt = "";
        var pushNextJob = false;
        // IF we have the mastery gain bar,
         DEBUG(' checking mastery Mission ID :'+Miss_ID  );
        if(masteryGainElt){
          if( (parseInt(masteryGainElt.innerHTML.substr(0, masteryGainElt.innerHTML.indexOf('%'))) )==100 ){
            masteryGainTxt = '. Operations Task '+ masteryGainElt.innerHTML.substr(0, masteryGainElt.innerHTML.indexOf('%'))+'% Mastered';
            pushNextJob = true;
          } else {
            masteryGainTxt = '. Operations Task '+ masteryGainElt.innerHTML.substr(0, masteryGainElt.innerHTML.indexOf('%'))+'% Mastered';
            DEBUG(' NO mastery '+Miss_ID  + masteryGainTxt );
          }
        }
      } else {
        DEBUG('found NO Mission_ResultsElt');
      }
//////////// add stuff here
//////////// add stuff here
      var Finish_Mission;
      if(pushNextJob){
        // DEBUG('Job Mastery of 100% detected, Reloading Tabno :'+tabno );
        DEBUG('Job Mastery of 100% detected, Reloading nothing:' );
        Finish_Mission = xpathFirst('.//a[contains(@id,"sm_action_button_'+Miss_ID+'") and contains(@class,"sexy_button_new medium black") and contains(@onclick,"SocialMissionView.closeTask(\''+Miss_ID+'")]', innerPageElt);
        if(Finish_Mission){
//        DEBUG(' we found the finished marker, close button' );
          clickElement(Finish_Mission);
//        if(!Check_Mission_Job()){  Go_Nxt_Page();  } // load stuff for next mission and try to start it // if there was nothing else on this page, try to go to the next page
        } else {
          DEBUG(' mission we did not find the finished close button' );
        }
        Miss_ID = null;
        Autoplay.fx = GoMissionsTab;
      } else {
        if((!chk_stam()) || (!chk_nrg()) ){
          DEBUG(' mission setting timer, you dont have enough to perform:'+ Miss_Name_is );
          setmissiontimer();
          Miss_ID = null;
          return false;
        }
        return;
      }
      Autoplay.start();
      return true;
      break;

    case 'job':
    try{
      var masteryGainElt ;
      xpGainElt = xpathFirst('.//dd[@class="message_experience"]', messagebox);
      xpGainElt = xpGainElt ? xpGainElt : xpathFirst('.//dd[@class="experience"]', messagebox);
      var jobContainer = "job"+missions[GM_getValue('selectMission')][MISSION_NUMBER];
      var jobContainerElt = xpathFirst('.//div[@id="'+jobContainer+'"]', rootElt);
      masteryGainElt = xpathFirst('.//div[@id="'+jobContainer+'"]//div[@class="mastery_bar"]', rootElt);
      jobName = missions[GM_getValue('selectMission')][MISSION_NAME];

      var masteryGainTxt = "";
      var pushNextJob = false;
      // IF we have the mastery gain bar,
      if(masteryGainElt){
        if( (GM_getValue('selectTier','0.0')!= '0.0'  )){
          if( (parseInt(masteryGainElt.innerHTML.substr(0, masteryGainElt.innerHTML.indexOf('%'))) )==100 ){
            masteryGainTxt = '. Job '+ masteryGainElt.innerHTML.substr(0, masteryGainElt.innerHTML.indexOf('%'))+'% Mastered';
            pushNextJob = true;
          }
        }
      }

      if(xpGainElt){
        jobOptimizeOn = false;
        var xpGainTxt = parseInt(xpGainElt.innerHTML);

        if(xpGainTxt){
          var xpBonusElt = xpathFirst('.//div[@class="message_experience"]', messagebox);
          if(xpBonusElt) xpGainTxt+= '+'+ parseInt(xpBonusElt.innerHTML);
          xpGainTxt += " Experience";
        }
        // Job completed successfully.
        result = 'You performed '+'<span class="job">'+ jobName+'</span> earning <span class="good">'+ xpGainTxt+'</span>';
        var cashGainTxt='';
        var cashGainElts = $x('.//dd[@class="message_cash"]', messagebox);
        for(i=0;i<cashGainElts.length;i++){
         cashGainTxt += cashGainElts[i].innerHTML;
        }

        if(cashGainElts.length==0){
          cashGainElt = xpathFirst('.//dd[contains(@class,"cash_icon")]', messagebox);
          if(cashGainElt){
            cashGainTxt = cashGainElt.innerHTML;
            if(cashGainTxt.match(REGEX_CASH)) cashGainTxt = cities[city][CITY_CASH_SYMBOL]+RegExp.lastMatch;
            else cashGainTxt = cities[city][CITY_CASH_SYMBOL] + cashGainTxt;
          }
        }
        if(cashGainTxt.match(/(.+?)\s+?\(You now have/i)) cashGainTxt = RegExp.$1;
        if(cashGainTxt) result += ' and <span class="good">'+ cashGainTxt+'</span>';

        var cashSpendElt = xpathFirst('.//dt[@class="message_cash bad"]', messagebox);
        if(!cashSpendElt) cashSpendElt = xpathFirst('.//div[@class="job_uses"]//dd[contains(@class,"cash_icon")]', messagebox);

        if(cashSpendElt){
          var cashSpendTxt = cashSpendElt.innerHTML.untag();
          if(cashSpendTxt.match(/(.+?)\s+?Bribes/)) cashSpendTxt = RegExp.$1;
          result += ', spending <span class="bad">'+ cities[city][CITY_CASH_SYMBOL] + cashSpendTxt+'</span>';
        }

        if(masteryGainElt) result += masteryGainTxt;
        result += '.';
        if(innerNoTags.indexOf('you spent no energy') != -1 || innerNoTags.indexOf('No energy cost') != -1 ||innerNoTags.indexOf('You Spent: 0') != -1 ) result += ' You spent no energy on this job.';
        addToLog('process Icon', result);

        jobCombo(rootElt);
        if(masteryGainElt) jobLoot(jobContainerElt); // here
        else jobLoot(rootElt);
        // Add message if job tier prize found.
        if(innerNoTags.match(/.*(An* .+ was added to your inventory[^.]*.)/i)){
          addToLog('lootbag Icon', RegExp.$1);
        }

        // Ask for help if auto ask is on and enough experience was gained.
        var xpGain = parseInt(xpGainElt.innerHTML);
        var parentClass="";
        var xpGainMin = parseInt(GM_getValue('autoAskJobHelpMinExp'));
        if(isGMChecked('autoAskJobHelp') && (!xpGainMin || xpGain >= xpGainMin)){
          // ask for help NY - depending on job results
          var elt = xpathFirst('.//div[@class="message_buttons"]//span[@class="sexy_jobhelp"]', messagebox);
          if(!elt) elt = xpathFirst('.//div[@class="message_buttons"]//a[@class="sexy_button_new short white sexy_call_new" and contains(.,"Let Friends Get a Bonus")]', messagebox);
          if(elt){
            Autoplay.fx = function(){
              clickElement(elt);
              addToLog('process Icon', 'Asked for help with <span class="job">'+ missions[GM_getValue('selectMission')][MISSION_NAME]+'</span>.');
            };
            Autoplay.start();
            return true;
          }
        }
      } else if(innerNoTags.indexOf('You are not high enough level to do this job') != -1){
        addToLog('warning Icon', 'You are not high enough level to do '+ missions[GM_getValue('selectMission', 1)][MISSION_NAME]+'.');
        addToLog('warning Icon', 'Job processing will stop');
        GM_setValue('autoMission', 0);
        update_nrg_stam(); // update the icon to show energy spend is off
      } else if(innerNoTags.indexOf('Success') != -1){
        jobOptimizeOn = false;
        addToLog('process Icon', inner);
      } else if(innerNoTags.indexOf('Missing') != -1){
        if(getJobRowItems(jobName)){
          DEBUG(' - - need items jobid='+jobid+' selectMission='+GM_getValue('selectMission', 1));
          if(jobid != GM_getValue('selectMission', 1))  Autoplay.fx = autoMission;
        }
      } else { DEBUG('Unrecognized job response.'); }

      if(pushNextJob){ Autoplay.fx = goJobsNav; }
      //else { return; }
      Autoplay.start();
      return false;

     } catch(je) { alert(je); }
      break;

    case 'hitman':
      // If the target is gone, there is nothing to do.
      if(innerNoTags.indexOf('someone else took out') != -1){
        DEBUG(inner);
        return false;
      }

      var targetKilled = (innerNoTags.indexOf('You knocked out') != -1);
      if(innerNoTags.indexOf('You WON') != -1){
        var cashGain = innerNoTags.match(/gained.*?([A-Z]*?\$|\u00A2)([\d,]*\d)/i);
        var cashWon = RegExp.$1+RegExp.$2;
        experience = innerNoTags.match(/\d+\s+experience\s+points?/i);
        addToLog('yeah Icon', 'Hit '+ linkToString(context.profile, 'user') +
                 ', <span class="good">WON '+ cashWon+'</span> and ' +
                 '<span class="good">'+ experience+'</span>.');
        cashWon = parseCash(cashWon);
        GM_setValue('hitmanWinCountInt',GM_getValue('hitmanWinCountInt',0)+1);
        GM_setValue('hitmanWinDollarsInt', String(parseInt(GM_getValue('hitmanWinDollarsInt', 0)) + cashWon));
        GM_setValue('totalExpInt', GM_getValue('totalExpInt', 0) + parseInt(experience));
        GM_setValue('totalWinDollarsInt', String(parseInt(GM_getValue('totalWinDollarsInt', 0)) + cashWon));
        GM_setValue('cashWinsNY', String(parseInt(GM_getValue('cashWinsNY', 0)) + cashWon));

        if(!targetKilled && canSpendStamina() && ptsToNextLevel > 6){
          var eltAtk;
          if(isGMChecked('staminaPowerattack') && ((isGMChecked('stopPA') && health >= GM_getValue('stopPAHealth')) || !isGMChecked('stopPA')))
             eltAtk = xpathFirst('.//a[contains(.,"Power Attack")]', messagebox);
          if(!eltAtk) eltAtk = xpathFirst('.//a[contains(.,"Attack Again")]', messagebox);

          if(eltAtk){
            // Attack again immediately.
            Autoplay.fx = function(){
              clickAction = action;
              clickContext = context;
              clickElement(eltAtk);
              DEBUG('Clicked to repeat the hit on '+ clickContext.name+' ('+ clickContext.id+').');
            };
            if(!isGMChecked('noStats')){ updateLogStats(STAMINA_HOW_HITMAN); }
            Autoplay.delay = noDelay;
            Autoplay.start();
            return true;
          }
        }
      } else if(innerNoTags.indexOf('You LOST') != -1){
        var t = innerNoTags.match(/LOST.*?RegExp.$1/i);
        var cashLoss = RegExp.$1+RegExp.$2;
        result = 'Hit '+ linkToString(context.profile, 'user') +
                     ' <span class="bad">LOST '+ cashLoss+'.</span>';
        cashLoss = parseCash(cashLoss);
        GM_setValue('hitmanLossCountInt',GM_getValue('hitmanLossCountInt',0)+1);
        GM_setValue('hitmanLossDollarsInt', String(parseInt(GM_getValue('hitmanLossDollarsInt', 0)) + cashLoss));
        GM_setValue('totalLossDollarsInt', String(parseInt(GM_getValue('totalLossDollarsInt', 0)) + cashLoss));
        GM_setValue('fightLoss$NY', String(parseInt(GM_getValue('fightLoss$NY', 0)) + cashLoss));
        if(context.id){
          // Add the opponent to the avoid list.
          setHitmanOpponentAvoid(context.id);
          result += ' Avoiding.';
        }
        addToLog('omg Icon', result);
      } else if(innerNoTags.indexOf('This player is currently part of your mafia') != -1){
        if(context.id){
          setHitmanOpponentAvoid(context.id);
        }
      } else {
        DEBUG(inner);
      }
      if(innerNoTags.indexOf('You were snuffed') != -1){
        addToLog('updateBad Icon', 'You <span class="bad">DIED</span>.');
      }
      if(targetKilled){
        if(context.id){
          addSavedListItem('hitmanListKilled', context.id, 100);
        }
        addToLog('killedMobster Icon', ' You <span class="bad">KILLED</span> ' +
                 linkToString(context.profile, 'user') +
                 ' and collected the <span class="money">' +
                 context.bounty+'</span> bounty set by ' +
                 linkToString(context.payer, 'user')+'.');

        GM_setValue('hitmanWinCountInt',GM_getValue('hitmanWinCountInt',0)+1);
        GM_setValue('hitmanWinDollarsInt', String(parseInt(GM_getValue('hitmanWinDollarsInt', 0)) + parseCash(context.bounty)));
        GM_setValue('totalWinDollarsInt', String(parseInt(GM_getValue('totalWinDollarsInt', 0)) + parseCash(context.bounty)));
        GM_setValue('cashWinsNY', String(parseInt(GM_getValue('cashWinsNY', 0)) + parseCash(context.bounty)));
      }
      if(!isGMChecked('noStats')){ updateLogStats(STAMINA_HOW_HITMAN); }
      randomizeStamina();
      break;

    case 'war':
      // Remove invalid war targets
      if(innerNoTags.indexOf('Target user is not a friend') != -1 ||
        innerNoTags.indexOf('Target user does not exist') != -1){
        removeSavedListItem('autoWarTargetList', context.target_id);
        addToLog('warning Icon', 'Invalid war target (id='+context.target_id+'). Removing from list.');
      }
      // Friend is already at war with somebody else
      else if(innerNoTags.indexOf('is already at war with someone else') != -1){
        addToLog('info Icon', inner.split('.')[0]+'. Cycling warlist. ' );
        cycleSavedList('autoWarTargetList');
      }
      // Go back to war page after betrayal
      else if(innerNoTags.indexOf('You successfully betrayed') != -1){
        addToLog(logIcon, inner.split('<br><br>')[0]+'</div>');
        break;
      }
      // Cycle war list after successful war declaration
      else if(innerNoTags.indexOf('You successfully declared war') != -1){
        cycleSavedList('autoWarTargetList');
        addToLog('yeah Icon', inner);
      }
      // War attack result
      else if(innerNoTags.indexOf('WON') != -1 ||
               innerNoTags.indexOf('LOST') != -1){
        var logIcon = innerNoTags.indexOf('LOST') != -1 ? 'omg Icon' : 'yeah Icon';
        if(innerNoTags.indexOf('to winning this war.') != -1){
          addToLog(logIcon, inner.split('to winning this war.')[0]+'to winning this war.</div>');
        } //else { addToLog(logIcon, inner); }
      } //else { addToLog('info Icon', inner); }

      if(helpWar){
        // Help attempt was processed. Increment the update count.
        GM_setValue('logPlayerUpdatesCount', 1 + GM_getValue('logPlayerUpdatesCount', 0));
        helpWar = false;
      }

      // Visit the War Tab again
      setGMTime('warTimer', '00:00');
      Autoplay.fx = goWarTab;
      Autoplay.start();
      return true;
      break;

    case 'stats':
      if(innerNoTags.match(/You just upgraded your (\w+) by (\d+)/i)){
        var statName = RegExp.$1;
        var statIndex = eval(statName.toUpperCase()+'_STAT');
        var statIcon = statName.toLowerCase()+' Icon';
        var statInc = isNaN(RegExp.$2) ? 1 : parseInt(RegExp.$2);
        GM_setValue('nextStat', (statIndex + 1) % 4);
        switch (statIndex){
          case ATTACK_STAT :  curAttack += statInc; break;
          case DEFENSE_STAT: curDefense += statInc; break;
          case HEALTH_STAT :  maxHealth += statInc; break;
          case ENERGY_STAT :  maxEnergy += statInc; break;
          case STAMINA_STAT: maxStamina += statInc; break;
        }
        addToLog(statIcon, '<span style="color:#885588;">'+statName+' increased by '+statInc+' point(s).</span>');
      } else { DEBUG('Failed to increment stat.'); }
      break;

    case 'energypack':
      addToLog('energyPack Icon', 'Used an <span class="good">Energy Pack</span>.');
      energyPackElt = undefined;
      DEBUG('Unrecognized response for "energypack" action : '+inner);
      break;

    case 'help':
      var helpElt = xpathFirst('.//a[contains(.,"Help ")]', messagebox);
      // If help element is found, click it immediately
      if(helpElt){
        Autoplay.fx = function(){
          clickElement(helpElt);
          clickAction = 'help';
          clickContext = context;
        };
        Autoplay.delay = getAutoPlayDelay()
        Autoplay.start();
        return true;
      }

      // Help attempt was processed. Increment the update count.
      GM_setValue('logPlayerUpdatesCount', 1 + GM_getValue('logPlayerUpdatesCount', 0));

      var user = linkToString(xpathFirst('.//a[contains(@onclick,"xw_controller=stats&xw_action=view")]', messagebox), 'user');
      if(context && !user){
        user = context.user;
      }
      if(innerNoTags.indexOf('not your friend') != -1 ||
          innerNoTags.indexOf('You need to be friends') != -1 ||
          innerNoTags.indexOf('to help on a job.') != -1){
        addToLog('info Icon', 'Failed to help'+ (user? ' '+ user : '')+'with job. Reason: not friends.');
      } else if(innerNoTags.indexOf('You are too late') != -1){
        addToLog('info Icon', 'You are too late to help '+ (user? ' '+ user : '')+' with this job.');
      } else if(innerNoTags.indexOf('already helped') != -1){
        addToLog('info Icon', 'Already helped '+ user+' with this job.');
      } else if(innerNoTags.indexOf('You received') != -1 || innerNoTags.indexOf('You helped') != -1){
        cost = innerNoTags.match(REGEX_CASH);
        experience = 0;
        if(innerNoTags.match(/(\d+)\s+experience\s+points?/i)){
          experience = parseInt(RegExp.$1);
        }
        if(innerNoTags.indexOf('Special Bonus') != -1){
          var loot = innerNoTags.split('gained a ')[1];
          addToLog('lootbag Icon', 'Found a <span class="loot">'+ loot.split('.<span')[0]+'</span> while helping on a job.');
        }
        result = 'You received '+'<span class="good">'+ cost+'</span>'+' and '+'<span class="good">'+ experience+' experience</span>' +
                 ' for helping '+ user+' complete the job.';
        GM_setValue('passivetotalJobExpInt', parseInt(GM_getValue('passivetotalJobExpInt',0)) + experience);
        addToLog('updateGood Icon', result);
        if(!isGMChecked('noStats')){ updateLogStats(); }
      } else if(innerNoTags.indexOf('25 friends') != -1){
        addToLog('info Icon', 'Failed to help'+ (user ? ' '+ user : '')+' with job. Reason: already helped 25 friends for the day in that city.');
      } else {
        addToLog('info Icon', 'WARNING: Not sure what happened when trying to help'+ (user? ' '+ user : '')+'.'+ (context? ' '+ context.help : '')+' Perhaps you interfered by clicking on something?');
      }
      Autoplay.start();
      return true;
      break;

    case 'help burners':
      var helpElt = xpathFirst('.//a[contains(.,"Accept")]', messagebox);
      // If help element is found, click it immediately
      if(helpElt){
        Autoplay.fx = function(){
          clickElement(helpElt);
          clickAction = 'help burners';
          clickContext = context;
        };
        Autoplay.delay = getAutoPlayDelay()
        Autoplay.start();
        return true;
      }

      // Help burners attempt was processed. Increment the update count.
      GM_setValue('logPlayerUpdatesCount', 1 + GM_getValue('logPlayerUpdatesCount', 0));
      addToLog('info Icon', innerNoTags);
      Autoplay.start();
      return true;
      break;

    case 'help parts':
      var helpElt = xpathFirst('.//a[contains(.,"Send Item")]', messagebox);
      // If help element is found, click it immediately
      if(helpElt){
        Autoplay.fx = function(){
          clickElement(helpElt);
          clickAction = 'help parts';
          clickContext = context;
        };
        Autoplay.delay = getAutoPlayDelay()
        Autoplay.start();
        return true;
      }

      DEBUG('Parsing parts help.');

      // Help parts attempt was processed. Increment the update count.
      GM_setValue('logPlayerUpdatesCount', 1 + GM_getValue('logPlayerUpdatesCount', 0));

      if(innerNoTags.indexOf('You sent ') != -1) addToLog('info Icon', 'You sent '+ inner.split('You sent ')[1].split('</div>')[0]);

      Autoplay.start();
      return true;
      break;

    case 'deposit':
      // Log if city has changed after banking
      if(parseInt(city) != parseInt(context)){
        addToLog('warning Icon', 'Warning! You have traveled from '+ cities[context][CITY_NAME]+' to '+ cities[city][CITY_NAME]+' while banking. Check your money.');
      }

      if(innerNoTags.match(/deposited/i)) addToLog(cities[city][CITY_CASH_CSS], inner);
      else DEBUG(inner);

      // Close banking
      var bankElt = xpathFirst('//div[@id="bank_popup"]');
      if(bankElt && bankElt.parentNode) closePopup(bankElt.parentNode, "Bank Popup");
      break;

    case 'withdraw':
      if(innerNoTags.match(/withdrew/i)) addToLog(cities[city][CITY_CASH_CSS], inner);
      else DEBUG(inner);

      // Close banking
      var bankElt = xpathFirst('//div[@id="bank_popup"]');
      if(bankElt && bankElt.parentNode) closePopup(bankElt.parentNode, "Bank Popup");
      break;

     case 'buy item':
      addToLog('info Icon', inner.untag());
      break;

    case 'buy brazil item':
      addToLog('info Icon', 'Brazil Items bought');
      break;

    case 'buy property':
      addToLog('info Icon', inner);
      break;

    case 'crew collection':
      addToLog('info Icon', inner);
      break;

    case 'build item':
      var propCount = context.propCount;
      var buildProp = cityProperties[propCount][ctPropName];
      var timerName = cityProperties[propCount][ctPropTimer];

      if(/You cannot craft/i.test(inner) || /You do not have/i.test(inner) || /You need a higher/i.test(inner) ){
        inner = buildProp+": " + inner;
        setGMTime(timerName, '1 hour');
        addToLog('warning Icon', inner);
      } else {
        setGMTime(timerName, '18 hours');
        if(inner.match(/You got (.+?)\./)){
          var log = 'You built <span class="loot">'+ RegExp.$1+'</span>.';
          if(inner.match(/You gained:(.+?) close/)) log += ' You gained '+ RegExp.$1+'.';
          addToLog('lootbag Icon', log);
        } else addToLog('lootbag Icon', inner);
      }
      break;

    default:
      colorDEBUG('BUG DETECTED: Unrecognized action "'+ action+'".', cre);
      DEBUG('Unrecognized Action :'+inner);
  }
  return false;
}

function closePopup(eltPopup, coolName){
  // This routine needs the handle of the popup!
  // Not a button in the popup, but the main element
  // So if we figure out we have a button, then let's try
  // to find the main element
  if(!eltPopup){
    DEBUG('Can not close '+ coolName+' : popupElt undefined !');
    return false;
  }

  // Once we see a post pop-up, set the timer to close it
  var closeElt = xpathFirst('.//a[@class="pop_close"]',eltPopup);
  if(!closeElt) closeElt = xpathFirst('.//a[@class="close"]',eltPopup);
  if(!closeElt) closeElt = xpathFirst('.//a[@class="sexy_button_new medium black skip" or contains(.,"Cancel")]',eltPopup);
  if(!closeElt) closeElt = xpathFirst('.//a[@class="mw_new_ajax pop_close"]',eltPopup);

  if(closeElt){
    clickElement(closeElt);
    DEBUG('Got rid of '+ coolName+' popup: '+ eltPopup.id+ '.');
  }

  var skipPostElt = document.getElementById('fb_dialog_cancel_button');
  if(skipPostElt){
    clickElement (skipPostElt);
    DEBUG('Skipped '+ coolName+' popup: '+ eltPopup.id+ '.');
  }

  if(eltPopup.parentNode) eltPopup.parentNode.removeChild(eltPopup);

  return true;
}

// Handle various popups
// This function is specifically for handling windows that popup
// during gameplay and we want to either grab some info off the
// window and log it, process it or we want to just close the window.
function handlePopups(){
  // Refresh the publishing options
  fetchPubOptions();
  try {

    //Added handling to actually show popups
    var popupElts = $x('.//div[contains(@id, "pop_b") and not(contains(@style, "none"))]', popupfodderElt);
    if (popupElts && popupElts.length > 0) {
      for (var i = 0, iLength=popupElts.length; i < iLength; ++i) {
        var currentClass = popupElts[i].getAttribute('class');
        if(currentClass.indexOf('pop_bg')==-1 && !popupElts[i].getAttribute('opened')){
          popupElts[i].setAttribute('style', 'display: block;');
          popupElts[i].setAttribute('opened', 'yes');
        } else if (popupElts[i].getAttribute('opened')!='yes') { popupElts[i].setAttribute('style', 'display: none;'); }
      }
    }
    //Added handling to actually show fight / battle popups
    var popupElts = $x('.//div[@class="fight_true_popup"]//div[contains(@id, "pop_b")]', innerPageElt);
    if (popupElts && popupElts.length > 0) {
      for (var i = 0, iLength=popupElts.length; i < iLength; ++i) {
        var currentClass = popupElts[i].getAttribute('class');
        if(currentClass.indexOf('pop_bg')==-1 && !popupElts[i].getAttribute('opened')){
          popupElts[i].setAttribute('style', 'display: block;');
          popupElts[i].setAttribute('opened', 'yes');
        } else if (popupElts[i].getAttribute('opened')!='yes') { popupElts[i].setAttribute('style', 'display: none;'); }
      }
    }

// Sent Requests Popup
  var requestPopContainer = xpathFirst('.//div[@id="requests_toaster" and contains(@style,"block")]');
  if(requestPopContainer){
    var requestPopText = xpathFirst('.//div[@id="requests_toaster_txt"]', requestPopContainer);
    if(requestPopText) addToLog('process Icon', requestPopText.innerHTML.untag());
    var closeElt = xpathFirst('.//div[contains(@onclick,"fadeOut")]', requestPopContainer);
    clickElement(closeElt);
    return;
  }

//Buy Prompt Popup
    var popupContainers = $x('.//div[@class="buy_prompt"]', appLayoutElt);
    if(running && popupContainers && popupContainers.length > 0){
      // Process each popup that is open
      for (var i = 0, iLength=popupContainers.length; i < iLength; ++i){
        if(popupContainers[i] && popupContainers[i].scrollWidth && popupContainers[i].innerHTML.length > 0){
          var currentPopup = popupContainers[i];
          return(closePopup(currentPopup, "Buy Prompt Popup"));
        }
      }
    }

    // Look for Operations popups that are showing
    var popupContainers = $x('.//div[contains(@id,"socialMissionFail") and @class="socialMissionTryAgain" and contains(@style,"block")]', appLayoutElt);
    if(running && popupContainers && popupContainers.length > 0){
      // Process each popup that is open
      for (var i = 0, iLength=popupContainers.length; i < iLength; ++i){
        if(popupContainers[i] && popupContainers[i].scrollWidth && popupContainers[i].innerHTML.length > 0){
          var currentPopup = popupContainers[i];
          var processElt;
          if(isGMChecked('AutoRetryOperations')){
            processElt = xpathFirst('.//a[contains(@onclick,"tryAgain") and contains(.,"Start")]',currentPopup);
            DEBUG('Clicking to retry expired operation');
          } else {
            processElt = xpathFirst('.//a[contains(@onclick,"tryAgain") and contains(.,"Close")]',currentPopup);
            DEBUG('Clicking to close expired operation');
          }
          if(processElt) clickElement(processElt);
          return true;
        }
      }
    }

    // Look for Achievements popups that are showing
    var popupContainers = $x('.//div[contains(@id,"zy_popup_box") and not(@class="zy_popup_box_bg") and contains(@style,"block")]', appLayoutElt);
    if(running && popupContainers && popupContainers.length > 0){
      // Process each popup that is open
      for (var i = 0, iLength=popupContainers.length; i < iLength; ++i){
        if(popupContainers[i] && popupContainers[i].scrollWidth && popupContainers[i].innerHTML.length > 0){
          var currentPopup = popupContainers[i];
          var processElt;
          processElt = xpathFirst('.//div[@class="achievement_message_text"]',currentPopup);
          if(processElt){
            var processTxt = processElt.innerHTML.untag();
            if(processTxt.match(/you earned(.+)share/i)) addToLog('yeah Icon','You earned '+RegExp.$1+'.');
            if(isGMChecked('autoGlobalPublishing')){
              processElt = xpathFirst('.//a[contains(@class,"sexy_achievement_new") and contains(.,"Share the wealth")]',currentPopup);
              if(processElt){
                clickElement(processElt);
                DEBUG('Clicked to share Achievement Bonus');
              }
            }
          }
          return(closePopup(currentPopup, "Achievement Popup"));
        }
      }
    }

    // Look for all other popups that are showing
    var popupElts = $x('.//div[(contains(@id,"pop_box") and contains(@style, "block")) or contains(@id,"mystery")]', appLayoutElt);
    if(popupElts && popupElts.length > 0){
      // Process each popup that is open
      for (var i = 0, iLength=popupElts.length; i < iLength; ++i){

        if(popupElts[i] && popupElts[i].scrollWidth && popupElts[i].innerHTML.length > 0){
          var currentPopup = popupElts[i];
          var popupInner = currentPopup.innerHTML;
          var popupInnerNoTags = popupInner.untag().toLowerCase();

          if(  popupInner.indexOf('fight_wrapper') != -1 // Don't Close Fight Popup
            || popupInner.indexOf('bank_popup') != -1 // The Bank
            || popupInner.indexOf('vault_popup') != -1 // Las Vegas Vault
          ){ continue; }

          //|| popupInner.indexOf('id="map_boss_fight"') != -1 // Vegas Boss fights
          //|| popupInner.indexOf('id="pop_box_map_boss_fight_popup"') != -1 // Boss fights

          // ALWAYS CLOSE these popups:
          if((  popupInner.indexOf('id="marketplace"') != -1 // The Marketplace
            || popupInner.indexOf('id="original_buyframe_popup"') != -1  // The Marketplace
            || popupInner.indexOf('marketplace_title.png') != -1  // The Marketplace
            || popupInner.indexOf('giftcard_iframe') != -1  // The Marketplace
            || popupInner.indexOf('newbuyer_congrats') != -1  // The Marketplace
            || popupInner.indexOf('xw_controller=hospital') != -1 // The Hospital
            || popupInner.indexOf('Build Complete') != -1 // Chop Shop/Weapon Depot success popup
            || popupInner.indexOf('id="ChopShopCarousel"') != -1 // Chop Shop/Weapon Depot craft popup
            || popupInner.indexOf('class="account_settings_title"') != -1 // Account Settings
            || popupInner.indexOf('class="exp_discount_main"') != -1 // Item Sales
            || popupInner.indexOf('TournamentController.nextPage()') != -1 // Tournament Ready to fight popup
            || popupInner.indexOf('this wave has ended') != -1 // kill zombie fight ended
            || popupInnerNoTags.indexOf('wishlist is full') != -1
            || popupInnerNoTags.indexOf('cooldown') != -1
            || popupInnerNoTags.indexOf('buy now order') != -1
            || popupInnerNoTags.indexOf('drag to reorder them') != -1
            || popupInnerNoTags.indexOf('vengeance pack') != -1
            ) && popupInnerNoTags.indexOf('select a consumable to use') == -1) {
            if(running) return(closePopup(currentPopup, "Annoying Zollipops stuff"));
            continue;
          }

          if(isGMChecked('TestChanges')) DEBUG('Popup Found: '+ popupElts[i].id +  ' - '+ popupInnerNoTags); // shows popup_fodder_zmc constantly

          /* THESE POPUPS get processed only when PS MWAP is running: */
          /* START */

          if(running){

            /* THESE POPUPS get always processed: */

            // Close Free Gift Selector if timer goes off
            if(popupInnerNoTags.indexOf('close_suggestor_iframe') !=-1){
              if(!timeLeftGM('requestTimer')) return(closePopup(currentPopup, "Free Gift Suggestor"));
              return;
            }

            // LV/ITALY Boss Confirm Popup
            var elt = xpathFirst('.//a[contains(@class,"attack_boss") and contains(@onclick,"Expert")]',currentPopup);
            if(elt) {
              endBoss = false;
              if(popupTimer){
                window.clearInterval(popupTimer);
                popupTimer = window.setInterval(handlePopups, 1500);
              }
              autoReload(false, 'Boss Fight');
              colorDEBUG('bossFight - clicked to confirmBoss Fight', caq);
              clickElement(elt);
              return;
            }

            // LV/ITALY Boss Fight
            var bossFightContainer = xpathFirst('.//div[@id="map_boss_fight"]', currentPopup);
            if(bossFightContainer){
              if(popupTimer){
                window.clearInterval(popupTimer);
                popupTimer = window.setInterval(handlePopups, 1500);
              }
              autoReload(false, 'Boss Fight');
              // Look for Boss fight Consumables and Click from Right to Left
              var bossConsumables = $x('.//a[contains(@id,"use_con") and not(contains(@class,"greyButton"))]', bossFightContainer);
              if(bossConsumables && bossConsumables.length>0){
                elt = bossConsumables[bossConsumables.length-1];
                colorDEBUG('bossFight - clicked to use consumable', caq);
                clickElement(elt);
                return;
              }
              // Get the Boss Attack Button
              elt = xpathFirst('.//a[contains(@class,"sexy_attack_new") and contains(@onclick,"BossController")]', bossFightContainer);
              if(elt) {
                colorDEBUG('bossFight - clicked to attack Boss', caq);
                clickElement(elt);
              }
              return;
            }

            // Out of Stamina Popup for Boss Fight
            var elt = xpathFirst('.//div[@id="pop_box_map_boss_fight_stamina_popup"]//a[contains(.,"Close")]',currentPopup);
            if(elt){
              colorDEBUG('bossFight - clicked to close Boss Fight Popup - out of stamina', caq);
              clickElement(elt);
              endBoss=true;
              return;
            }

            // Close Popup for Boss Fight
            elt = xpathFirst('.//div[@id="pop_box_map_boss_fight_popup"]//a[class="pop_close"]',currentPopup);
            if(elt && endBoss) {
              colorDEBUG('bossFight - clicked to close Boss Fight Popup', caq);
              clickElement(elt);
              return;
            }

            // Runaway from Boss Fight
            elt = xpathFirst('.//div[@id="pop_box_map_boss_fight_run_away_popup"]//a[contains(.,"Run Away")]',currentPopup);
            if(elt && endBoss) {
              colorDEBUG('bossFight - clicked to Run Away from Boss Fight', caq);
              clickElement(elt);
              if(popupTimer){
                window.clearInterval(popupTimer);
                popupTimer = window.setInterval(handlePopups, 350);
              }
              endBoss = false;
              Autoplay.fx = goHome;
              Autoplay.start();
              return;
            }

            //Share LV/ITALY Boss Fight Reward
            var elt = xpathFirst('.//div[@id="map_boss_fight_victory"]//a[contains(.,"Share")]',currentPopup);
            if(elt){
              colorDEBUG('bossFight - clicked to share Boss Fight Rewards', caq);
              clickElement(elt);
              if(popupTimer){
                window.clearInterval(popupTimer);
                popupTimer = window.setInterval(handlePopups, 350);
              }
              Autoplay.fx = goHome;
              Autoplay.start();
              return;
            }

            // Battle Pop
            var battlePopContainer = xpathFirst('.//div[@id="role_select_bg"]',currentPopup);
            if(battlePopContainer){
              DEBUG('Found Battle Popup');
              elt = xpathFirst('.//a[@class="rightArrow" and contains(.,"FIGHT")]', battlePopContainer);
              if(elt){
                clickElement(elt);
              }
              return(closePopup(currentPopup, "Battle Popup"));
            }

            // Slot Machine!?!
            if(popupInner.indexOf('mw_app=slotmachine') != -1){
                var flashvars = xpathFirst('//object[@id="slots"]/param[@name="flashvars"]');
                if(flashvars && flashvars.value){
                  slotSpins = flashvars.value.match(/&freeSpins=(\d+)&/)[1];
                  slotBonus = flashvars.value.match(/&bonusMeter=(\d+)&/)[1];
                  addToLog('info Icon', 'Slot Spins Remaining: '  + slotSpins+' Bonus Level: '+ slotBonus);
                }
              return(closePopup(currentPopup, "Slot Machine Popup"));
            }

            //  Limited Property Upgrade..
            if(popupInner.indexOf('class="depotTitle"') != -1){
              // Look for the ask for upgrade link to click..
              var askButtons = $x('.//a[contains(@onclick,"postfeedforproperty_part")]',currentPopup);
              if(askButtons && askButtons.length){
                var askButton = askButtons[askButtons.length-1];
                DEBUG('Clicking Ask Limited Property Element');
                clickElement(askButton); // Click the last element..
              }
              return(closePopup(currentPopup, "Limited Property"));
            }

            // Accept Gifts from MESSAGE CENTER / Total Requests popup
            if(popupInnerNoTags.indexOf('total requests') != -1){
              var acceptgiftButtons = $x('.//a[@class="sexy_button_new medium white" and contains(@onclick,"accept_gift") and not(contains(@onclick,"item_id=3009")) ]',currentPopup);
              if(acceptgiftButtons && isGMChecked('autoAcceptMsgGifts')){
                for(i=0;i<acceptgiftButtons.length>0;++i){
                  acceptgiftButton = acceptgiftButtons[i];
                  clickElement(acceptgiftButton);
                }
                DEBUG('Popup Process: MESSAGE CENTER - '+acceptgiftButtons.length+' Gifts Accepted');
              }
              // Accept Boosts from MESSAGE CENTER / Total Requests popup
              acceptgiftButtons = $x('.//a[@class="sexy_button_new medium white" and contains(@onclick,"accept_boost")]',currentPopup);
              if(acceptgiftButtons && isGMChecked('autoAcceptMsgBoosts')){
                for(i=0;i<acceptgiftButtons.length>0;++i){
                  acceptgiftButton = acceptgiftButtons[i];
                  clickElement(acceptgiftButton);
                }
                DEBUG('Popup Process: MESSAGE CENTER - '+acceptgiftButtons.length+' Boosts Accepted');
              }
              // Accept War Requests MESSAGE CENTER / Total Requests popup
              if(isGMChecked('AutoBattle')){
                  var acceptButtons = $x('.//a[@class="sexy_button_new medium white" and contains(@onclick,"xw_action=createBattle") and contains(@onclick,"opponent_id='+GM_getValue('AutoBattleClanID')+'")]',currentPopup);
                  if(acceptButtons){
                    for(i=0;i<acceptButtons.length>0;++i){
                      acceptButton = acceptButtons[i];
                      clickElement(acceptButton);
                    }
                    DEBUG('Popup Process: MESSAGE CENTER - Accepted '+acceptButtons.length+' battles.');
                  }
              }
              // Accept Mafia Invites from MESSAGE CENTER / Total Requests popup
              var acceptButtons = $x('.//a[@class="sexy_button_new medium white" and contains(.,"Join Mafia")]',currentPopup);
              if(acceptButtons && isGMChecked('acceptMafiaInvitations')){
                for(i=0;i<acceptButtons.length>0;++i){
                  acceptButton = acceptButtons[i];
                  clickElement(acceptButton);
                }
                DEBUG('Popup Process: MESSAGE CENTER - Added '+acceptButtons.length+' members to your mafia.');
              }
              // Accept Crew Invites from MESSAGE CENTER / Total Requests popup
              var acceptButtons = $x('.//a[@class="sexy_button_new medium white" and contains(.,"Accept Crew")]',currentPopup);
              if(acceptButtons && isGMChecked('autoAcceptMsgCrew')){
                for(i=0;i<acceptButtons.length>0;++i){
                  acceptButton = acceptButtons[i];
                  clickElement(acceptButton);
                }
                DEBUG('Popup Process: MESSAGE CENTER - Accepted '+acceptButtons.length+' Crew Invites to your mafia.');
              }
              // Send Eneryg Packs to your Mafia from MESSAGE CENTER / Total Requests popup
              var acceptButtons = $x('.//a[@class="sexy_button_new medium white" and (contains(.,"Send Energy") or contains(@onclick,"xw_action=accept_energy_req"))]',currentPopup);
              if(acceptButtons && isGMChecked('autosendMsgEnergyPack')){
                for(i=0;i<acceptButtons.length>0;++i){
                  acceptButton = acceptButtons[i];
                  clickElement(acceptButton);
                }
                DEBUG('Popup Process: MESSAGE CENTER - Sent '+acceptButtons.length+' energy Packs to your mafia.');
              }
              return(closePopup(currentPopup, "MESSAGE CENTER"));
            }

            // Process Red Mystery Bag popup
            if(popupInnerNoTags.indexOf('opened a red mystery bag') != -1){
              DEBUG('Popup Process: Red Mystery Bag Processed');
              var bagTxt;
              if(popupInnerNoTags.match(/you got:(.+?)(send|share)/i)) bagTxt = RegExp.$1;
              addToLog('lootbag Icon', 'Received <span class="loot">'+ bagTxt+'</span> from a red mystery bag.');
              return(closePopup(currentPopup, "Red Mystery Bag Drop"));
            }

            // Process Mystery Bag popup
            if(popupInnerNoTags.indexOf('share mystery bonus') != -1){
              DEBUG('Popup Process: Mystery Bag Processed');
              var bagTxt;
              if(popupInnerNoTags.match(/you got:(.+?)(send|share)/i)) bagTxt = RegExp.$1;
              addToLog('lootbag Icon', 'Received <span class="loot">'+ bagTxt+'</span> from a mystery bag.');
              return(closePopup(currentPopup, "Mystery Bag Drop"));
            }

            // Process Battle Rewards Collect popup
            if(popupInner.indexOf('BattleResultsController')!=-1){
              DEBUG('Found BattleRewards Popup');
              elt = xpathFirst('.//a[contains(@onclick,"BattleResultsController.collectReward") and contains(.,"Collect")]', currentPopup);
              if(elt){
                DEBUG('Found collect link to click, boom!');
                clickElement(elt);
              } else DEBUG('No collect link found :(');
              return(closePopup(currentPopup, "Battle Collect Popup"));
            }

            // Process Robbery Loot popup
            if(popupInnerNoTags.indexOf('you cleared the full board') != -1){
              var totalCash=0; var totalXP = 0; var totalNRG = 0; var totalSTAM = 0;
              // get robbing results
              var robResults = $x('.//div[@class="rob_res_expanded_details"]');
              var robResultTxt='';
              if(robResults && robResults.length>0){
                for(i=0,iLength=robResults.length;i<iLength;i++){
                  var currentRobResult = robResults[i];
                  var currentInnerResult = currentRobResult.innerHTML.untag();
                  var cashRobResult = xpathFirst('.//div[@class="rob_res_expanded_details_cash"]',currentRobResult);
                  if(cashRobResult){
                    if(cashRobResult.innerHTML.untag().match(REGEX_CASH)) totalCash+= parseCash(RegExp.lastMatch);
                  }

                  var xpRobResult = xpathFirst('.//div[@class="rob_res_expanded_details_exp"]',currentRobResult);
                  if(xpRobResult){
                    if(xpRobResult.innerHTML.untag().match(/(\d+) Experience/)) totalXP+= parseInt(RegExp.$1);
                  }
                  if(currentInnerResult.match(/\+(\d+) Energy/)) totalNRG+=parseInt(RegExp.$1);
                  if(currentInnerResult.untag().match(/\+(\d+) Stamina/)) totalSTAM+=parseInt(RegExp.$1);
                }

                if(totalCash) robResultTxt+=' <span class="good">'+cities[city][CITY_CASH_SYMBOL]+makeCommaValue(totalCash)+'</span>';
                if(totalXP)   robResultTxt+=' and <span class="good">'+totalXP+' experience</span>';
                if(totalNRG)  robResultTxt+=' and <span class="user">'+totalNRG+' energy</span>';
                if(totalSTAM) robResultTxt+=' and <span class="bad">'+totalSTAM+' stamina</span>';
                robResultTxt='You Gained '+robResultTxt+'.';
              }

              // Look for any loot on popup
              DEBUG('Popup Process: Processing robbing board');
              if(popupInnerNoTags.match(/(\d+) bonus experience/i)){
                var exp = RegExp.$1.replace(/[^0-9]/g, '');
                var boardrecord ="";
                var boardExp = parseInt(boardLastPtsToNextLevel) - parseInt(ptsToNextLevel);
                var boardStam = parseInt(boardLastStamina) - parseInt(stamina);
                var boardRatio = parseFloat(boardExp / boardStam).toFixed(2);

                if(popupInner.match(/your record on this board was\s+(.+?)\./i)) boardrecord = '<br>Board Record: <span class="good">'+ RegExp.$1+'</span>';

                addToLog('yeah Icon', 'Robbing board cleared. '+robResultTxt+' Bonus: <span class="good">'+ exp+' experience</span>.'+ boardrecord+' - Ratio: '+ boardExp+'/'+ boardStam +  ' ('+ boardRatio +') ');

                boardLastStamina = parseInt(stamina);
                boardLastPtsToNextLevel = parseInt(ptsToNextLevel);
                //DEBUG('doRob Getting start values: '+boardLastStamina+'-'+boardLastPtsToNextLevel);

                if(!isGMChecked('fastRob') || !isGMChecked('noStats')){
                  updateRobStatistics(null,parseInt(exp));
                  updateLogStats();
                }
              if(popupInner.match(/you\s+(earned|gained|received|collected)\s+(some|an?)\s+bonus\s+(.+?)\.?<\/div>/i)){
                addToLog('lootbag Icon', 'Found <span class="loot">'+ RegExp.$3+'</span> on robbing board.');
              }
              }
              return(closePopup(currentPopup, "Robbing Board Popup"));
            }

// Level Up popups
            // Process Level Up Skill Points
            var upgradePointsElt = xpathFirst('.//span[@id="level_up_skill"]',currentPopup);
            if(upgradePointsElt){
              if(isGMChecked('autoStat')){
                var upgradePoints=0;
                upgradePoints = parseInt(upgradePointsElt.innerHTML);
                var autoStatValues = autoStatVars();
                if(upgradePoints && autoStatValues[0]!='' && autoStatValues[1]!=0){
                  var StatUpgrdUrl = 'remote/html_server.php?xw_controller=stats&xw_action=upgrade&upgrade_key='+autoStatValues[0]+'&upgrade_amt='+autoStatValues[1]+'&no_load=1&source=level_up_popup';
                  var ajaxID = createAjaxPage(true);
                  var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+StatUpgrdUrl+'", 1, 0, null, update_level_up_skill); return false;' } );
                  if(elt){
                    var statName = autoStatValues[0].replace('max_','');
                    var statIndex = eval(statName.toUpperCase()+'_STAT');
                    var statIcon = statName.toLowerCase()+' Icon';
                    var statInc = isNaN(autoStatValues[1]) ? 1 : parseInt(autoStatValues[1]);
                    GM_setValue('nextStat' , (statIndex + 1) % 4);
                    switch (statIndex){
                      case ATTACK_STAT:  curAttack  += statInc; break;
                      case DEFENSE_STAT: curDefense += statInc; break;
                      case HEALTH_STAT:  maxHealth  += statInc; break;
                      case ENERGY_STAT:  maxEnergy  += statInc; break;
                      case STAMINA_STAT: maxStamina += statInc; break;
                    }
                    addToLog(statIcon, '<span style="color:#885588;">'+statName+' increased by '+statInc+' point(s).</span>');
                    clickAction = 'autoStatAllocation';
                    clickElement(elt);
                    return;
                  }
                }

                var StatUpgrdUrl = 'remote/html_server.php?xw_controller=levelUpBonus&xw_action=addBonusItem&xw_city='+city+'&no_load=1';
                var ajaxID = createAjaxPage(true);
                var elt = makeElement('a', null, {'onclick':'return do_ajax("'+ ajaxID+'","'+StatUpgrdUrl+'", 1, 0, null, update_level_up_bonus_item); return false;' } );
                if(elt && claimLevelUpBonus){
                  DEBUG('Claiming Skill Points Allocation Reward');
                  clickAction = 'autoStatReward';
                  clickElement(elt);
                  claimLevelUpBonus = false;
                  return;
                }
              } else {
                DEBUG('Skill Poinst Allocation OFF');
              }
            }

            // Click to share bonus
            if(popupInnerNoTags.match(/(you are now level|promoted to level) (\d+)/i)){
              addToLog('info Icon','You were promoted to level <span class="good">'+ RegExp.$2 +'</span>');
              if(document.getElementById('bonusItemName')){
                var bonusItemName = document.getElementById('bonusItemName');
                addToLog('lootbag Icon','Level Up Bonus Item: <span class="loot">'+ bonusItemName.innerHTML +'</span>');
              }

              if(isGMChecked('autoGlobalPublishing')){
                var eltPubButton = xpathFirst('.//a[contains(@onclick,"postLevelUpFeedAndSend") and contains(.,"Share")]',currentPopup);
                if(!eltPubButton) eltPubButton = xpathFirst('.//a[contains(@onclick,"xw_action=levelup_boost_brag") and contains(.,"Share")]',currentPopup);
                if(!eltPubButton) eltPubButton = xpathFirst('.//div[@id="bonusShareButton"]//a[contains(.,"Share")]',currentPopup);
                if(eltPubButton){
                  DEBUG('Level Up popup Share button detected');
                  clickElement(eltPubButton);
                }
              }
              claimLevelUpBonus = true;
              return(closePopup(currentPopup, "Level Up Bonus"));
            }

            // Post to friends
            var postFriendsElts = $x('.//a[contains(@onclick,"postFeedAndSendSocialList") and contains(.,"Post")]',currentPopup);
            if(postFriendsElts && postFriendsElts.length>0){
              return(closePopup(currentPopup, "Level Up Bonus Sharing"));
            }

// Operations / Missions popups
            // Get rid of not in Operations popup
            if(popupInnerNoTags.indexOf('not involved in this mission') != -1){
              return(closePopup(currentPopup, "Not in Operation"));
            }

            // Start a New Operation
            if(popupInnerNoTags.indexOf('start operation') != -1){
              var missionButton = xpathFirst('.//a[@class="sexy_button_new medium white" and contains(@onclick,"postCelebrateFeed")]',currentPopup);
              if(!missionButton) missionButton = xpathFirst('.//a[@class="sexy_button_new medium white" and contains(@onclick,"startMission")]',currentPopup);
              if(missionButton && isGMChecked('AutoMafiaMission')){
                clickElement(missionButton);
                DEBUG('Popup Process: OPERATIONS - Started a new Operation');
              }
              return(closePopup(currentPopup, "Start New Operation"));
            }

            // Invite Friends on Operation Start
            if(popupInnerNoTags.indexOf('invite friends') != -1){
              var missionButton = xpathFirst('.//a[@class="sexy_button_new medium white" and contains(@onclick,"postCelebrateFeed")]',currentPopup);
              if(missionButton){
                if(isGMChecked('AutoMafiaMission')){
                  clickElement(missionButton);
                  DEBUG('Popup Process: OPERATIONS - Started My own Operation');
                }
              }
              return(closePopup(currentPopup, "Inviting Friends on Operation Start"));
            }

            // Claim Operation Rewards Failed
            if(popupInnerNoTags.indexOf('failed to give reward') != -1){
              DEBUG('Popup Process: OPERATIONS - Claim Rewards Failed');
              return(closePopup(currentPopup, "Claim Operations Rewards Failed"));
            }

            // Log Operation Rewards
            if(popupInnerNoTags.indexOf('completed the operation') != -1){
              DEBUG('Popup Process: OPERATIONS - Claim Rewards : '+currentPopup.id);

              var rewards = $x('.//td[@class="collectPopLootItem"]', currentPopup);
              var rewardsTxt ="";
              var rewardsNoTags ="";
              for(i=0;i<rewards.length;++i){
                rewardsNoTags = rewards[i].innerHTML.untag();
                if(rewardsNoTags.match(/(.+?)(\d{2})(\d{2})$/)) rewardsNoTags = '<span class="loot">'+RegExp.$1+ '</span> (A: '+RegExp.$2+' / D: '+ RegExp.$3+')';
                else if(rewardsNoTags.match(/(.+?)(\d{2})(\d{1})$/)) rewardsNoTags = '<span class="loot">'+RegExp.$1+ '</span> (A: '+RegExp.$2+' / D: '+ RegExp.$3+')';
                else if(rewardsNoTags.match(/(.+?)(\d{1})(\d{2})$/)) rewardsNoTags = '<span class="loot">'+RegExp.$1+ '</span>(A: '+RegExp.$2+' / D: '+ RegExp.$3+')';
                else if(rewardsNoTags.match(/(.+?)(\d{1})(\d{1})$/)) rewardsNoTags = '<span class="loot">'+RegExp.$1+ '</span>(A: '+RegExp.$2+' / D: '+ RegExp.$3+')';
                if(rewardsTxt) rewardsTxt += ', '+ rewardsNoTags;
                else rewardsTxt = rewardsNoTags;
              }
              addToLog('lootbag Icon', 'Operation Rewards : '+rewardsTxt);
              if(!isGMChecked('autoShareRewards')) return(closePopup(currentPopup, "Operations Rewards claimed"));
            }

            // Share Operation Rewards
            var shareButton = xpathFirst('.//a[@class="sexy_button_new medium white sexy_call_new" and contains(@onclick,"postCelebrateFeed")]',currentPopup);
            if(shareButton){
              if(isGMChecked('autoShareRewards')){
                clickElement(shareButton);
                DEBUG('Popup Process: OPERATIONS - Share Rewards');
              }
              return(closePopup(currentPopup, "Share Operations Rewards"));
            }

// War Popups
            // Get rid of War Fight Won - Succesfull War Attack popup
            if(popupInnerNoTags.indexOf('won the fight') != -1){ return(closePopup(currentPopup, "Succesfull War Attack")); }
            // Get rid of War Fight Lost - Succesfull War Attack popup
            if(popupInnerNoTags.indexOf('lost the fight') != -1){ return(closePopup(currentPopup, "Succesfull War Attack")); }

            // Get rid of War already helped popup
            if(popupInnerNoTags.indexOf('have already helped') != -1){ return(closePopup(currentPopup, "Already Helped")); }

            // Get rid of War is already over popup
            if(popupInnerNoTags.indexOf('war is already over') != -1){ return(closePopup(currentPopup, "War already over")); }

            // Get rid of War Not in Mafia popup
            if(popupInnerNoTags.indexOf('a mafia request') != -1){ return(closePopup(currentPopup, "War Not in Mafia")); }

            // War Declaration
            var warDeclareButton = xpathFirst('.//a[@class="sexy_button_new short white sexy_call_new" and contains(@onclick,"attemptFeed")]',currentPopup);
            if(warDeclareButton){
              if(isGMChecked('autoGlobalPublishing')){
                clickElement(warDeclareButton);
                DEBUG('Popup Process: WAR - Declare War Publishing');
              }
              return(closePopup(currentPopup, "War Declaration Popup"));
            }

            // War Rally for Help
            if(popupInnerNoTags.indexOf('help to take out all 7') != -1){
              eltHelp = xpathFirst('.//a[contains(.,"Ask Friends for Help")]', currentPopup);
              if(eltHelp && isGMChecked('autoGlobalPublishing')){
                clickElement(eltHelp);
                DEBUG('Popup Process: WAR - Ask Friends for Help Publishing');
              }
              return(closePopup(currentPopup, "War Help Popup"));
            }

            // War Reward : Share Victory Coins
            if(popupInnerNoTags.indexOf('share victory coins') != -1){
              var warRewardButtons = $x('.//a[@class="sexy_button_new short white" and contains(@onclick,"postWarWin")]',currentPopup);
              if(warRewardButtons && isGMChecked('autoGlobalPublishing')){
                for(i=0;i<warRewardButtons.length>0;++i){
                  warRewardButton = warRewardButtons[i];
                  clickElement(warRewardButton);
                  DEBUG('Popup Process: WAR - Reward Friends (Share Coins) for Help Publishing');
                }
              }
              return(closePopup(currentPopup, "War Reward (Share Coins) Popup"));
            }

// Miscelaneous
            // Themed Events
            eltHelp = xpathFirst('.//a[contains(@class,"sexy_button_new") and contains(.,"Share")]', currentPopup);
            if(eltHelp && isGMChecked('autoGlobalPublishing')){
              clickElement(eltHelp);
              DEBUG('Popup Process: Shared Themed Event Items - '+popupInnerNoTags);
              DEBUG('Popup Process: Button: '+eltHelp.innerHTML);
              return(closePopup(currentPopup, "Shared Themed Event Items"));
            }

            // Loot Events
            if(popupInnerNoTags.match(/you found (.*) loot event./i) || popupInnerNoTags.match(/you found all (.*) in action./)){
              if(popupInnerNoTags.match(/you found (.*) loot event./i)) logtxt = 'You found '+ RegExp.$1+' loot event.';
              else if(popupInnerNoTags.match(/you found all (.*) in action./)) logtxt = 'You found '+ RegExp.$1+' in action.';
              if(logtxt) addToLog('yeah Icon',logtxt);
              return(closePopup(currentPopup, "Loot Event"));
            }

// Brazil City Crew
//Send city crew requests
            if(( isGMChecked('autoAskCityCrew') || isGMChecked('autoAskChicagoCrew') )&& popupInnerNoTags.indexOf('send city crew requests') != -1){
              var crewMembers = $x('.//div[@class="mfs_selectable"]//li[@class="mfs_add" and not(contains(@style,"none"))]',currentPopup);
              var requestButton = xpathFirst('.//a[@class="sexy_button_new medium orange" and contains(@onclick,"MW.Request.submitMFS") and contains(.,"SEND REQUESTS")]', currentPopup);
              if(crewMembers && crewMembers.length>0 && requestButton){
                var randomButton = xpathFirst('.//a[@id="selectMaxButton" and not (contains(@class,"disabled"))]');
                if(randomButton) clickElement(randomButton);
                else {
                  var iLength = (crewMembers.length>50) ? 50 : crewMembers.length;
                  for(i=0;i<iLength;i++) clickElement(crewMembers[i]);
                }
                clickElement(requestButton);
              } else DEBUG('autoAskCityCrew - handlePopups - NO Crew Members Available or SEND REQUESTS not found');
              if(popupInnerNoTags.indexOf('send city crew requests') != -1 && popupInnerNoTags.indexOf('you have successfully sent requests') != -1)
                addToLog('yeah Icon', 'You have successfully sent out requests to your mafia to join your City Crew');              
              return(closePopup(currentPopup, "autoAskCityCrew Requests"));
            }

// Fight // Rob Level Mastery
            if(popupInnerNoTags.indexOf('level mastered') != -1){
              var tellFriendsButton = $xpathFirst('.//a[@class="sexy_button_new short green sexy_announce" and contains(@onclick,"post_mastery_feed")]',currentPopup);
              if(tellFriendsButton && isGMChecked('autoGlobalPublishing')){
                clickElement(tellFriendsButton);
                DEBUG('Popup Process: Robbing/Fighting Level Mastery - Tell Your Friends');
              }
              return(closePopup(currentPopup, "Robbing/Fighting Level Mastered"));
            }

            /* IF THE POPUP COULD NOT BE PROCESSED AS ABOVE WE WILL CLOSE IT */
            /* THESE POPUPS get always closed: */
            // Get rid of Paypal
            if(popupInnerNoTags.indexOf('paypal') != -1) return(closePopup(currentPopup, "Paypal"));

            // Get rid of buyframe popup (You are almost out of reward points)
            if(popupInner.indexOf('xw_action=buyframe_popup') != -1) return(closePopup(currentPopup, "Buy Reward Points"));
            if(popupInnerNoTags.indexOf('div.buyframe_pop_box') != -1) return(closePopup(currentPopup, "Buy Reward Points"));

            // Get rid of Crime Spree Congratulations popup
            if(popupInnerNoTags.indexOf('safehouse_congrats') != -1) return(closePopup(currentPopup, "Crime Spree Congratulations"));

            // Get rid of Treasure Chest popup
            if(popupInnerNoTags.indexOf('treasure chest') != -1) return(closePopup(currentPopup, "Treasure Chest"));

            // Get rid of Keep Winning popup
            if(popupInnerNoTags.indexOf('keep winning') != -1) return(closePopup(currentPopup, "Robbery Keep Winning"));

            // Get rid of Tired of Losing popup
            if(popupInnerNoTags.indexOf('tired of losing') != -1) return(closePopup(currentPopup, "Robbery Tired of Losing"));

            // Get rid of Slots Collection popup
            if(popupInnerNoTags.indexOf('the slots collection') != -1) return(closePopup(currentPopup, "Slots Collection"));

            // Get rid of Grow your Mafia popup
            if(popupInnerNoTags.indexOf('friend to be in your mafia and help') != -1) return(closePopup(currentPopup, "Grow your Mafia"));

            // Get rid of Slot Machine Teaser popup
            if(popupInnerNoTags.indexOf('new loot!') != -1) return(closePopup(currentPopup, "Slot Machine Flushed"));

            // Get rid of Your Requests popup
            if(popupInnerNoTags.indexOf('your mafia wars requests have moved to the left column on facebook') != -1) return(closePopup(currentPopup, "Your Requests"));

            // Get rid of not enough health / stamina / energy popup
            if(popupInnerNoTags.indexOf('not have enough') != -1) return(closePopup(currentPopup, "not enough health, stamina or energy"));

            // Get rid of out of health / stamina / energy popup
            if(popupInnerNoTags.indexOf('out of') != -1 && popupInnerNoTags.indexOf('the bank') == -1) return(closePopup(currentPopup, "out of health, stamina or energy"));

            // Get rid of You helped in . . . popup
            if(popupInnerNoTags.indexOf('you helped in') != -1) return(closePopup(currentPopup, "You helped in"));

            // Get rid of Welcome to Tournaments popup
            if(popupInnerNoTags.indexOf('become world champion') != -1) return(closePopup(currentPopup, "Welcome to Tournaments"));

            // Get rid of Tournament Expired popup
            if(popupInnerNoTags.indexOf('your previous tournament has expired') != -1) return(closePopup(currentPopup, "Tournament Expired"));

            // Get rid of Increase your mafia popup
            var mafiaSuggestor = xpathFirst('.//div[@id="let_there_be_space"]',currentPopup);
            var mafiaRequestIfc = xpathFirst('.//div[@id="request_ifc"]',currentPopup);
            if(mafiaSuggestor && mafiaRequestIfc) return(closePopup(currentPopup, "increase your mafia"));            

            // Try to Process Unknown Popups
            if(isGMChecked('autoProcessPopups')){
              eltButton = xpathFirst('.//a[contains(@class,"sexy_button_new") and not (contains(.,"Refill")) and not (contains(.,"Buy")) and not (contains(.,"RP"))]', currentPopup);
              if(eltButton){
                DEBUG('Tried to process the following popup ('+eltButton.innerHTML+'):<br>'+popupInnerNoTags);
                clickElement(eltButton);
              } else DEBUG('Could not process the following popup :<br>'+popupInnerNoTags);
              return(closePopup(currentPopup, "autoClosing (autoProcess) Unknown"));
            }

          // End of Popups Section

          }
        /* END */
        }
      }
    }
  } catch (ex){
    DEBUG('Error @handlePopups: '+ ex);
  }
  return false;
}

function updateScript(){
  try {
    GM_xmlhttpRequest({
      method: 'GET',
      url: SCRIPT.metadata+'?'+ Math.random(),
      onload: function(resp){
        if(resp.status != 200) return;
        if(!resp.responseText.match(/@version\s+(\d+).(\d+).(\d+)/)) return;
        var googleVersion = RegExp.$1+'.'+RegExp.$2+'.'+RegExp.$3;
        var runningVersion = SCRIPT.version;
        if(googleVersion != runningVersion){
          if(window.confirm('Version '+ googleVersion+' is available!\n\n'+'Do you want to install this version?'+'\n')) window.location.href = SCRIPT.url;
        } else {
          alert('You already have the latest version: '+ googleVersion);
          return;
        }
      }
    });
  } catch (ex){
    DEBUG('BUG DETECTED (updateScript): '+ ex);
  }
}

///////////////////////////////////////////////////////////////////////////////
//                           UTILITY METHODS                                 //
///////////////////////////////////////////////////////////////////////////////

/******************************** General ********************************/

function clearSettings(){
  if(typeof GM_listValues == 'function' && typeof GM_deleteValue == 'function'){
    var values = GM_listValues();
    for (var i in values) if(typeof GM_deleteValue == 'function') GM_deleteValue(values[i]);
  }
  else alert('In order to do this you need at least GreaseMonkey version: 0.8.20090123.1. Please upgrade and try again.');  
}

/******************************** Array ********************************/

function getArrayDiffs(workingArray){
  diffArray = [];
  for (var i = 1; i < workingArray.length; i++){
    if(workingArray[i] - workingArray[i-1] < 0){ diffArray.push(0) }
    else { diffArray.push(workingArray[i] - workingArray[i-1]); }
  }
  diffArray.unshift(0);
  return diffArray;
}

// Save an array of strings. The strings must not contain "\n".
function setSavedList(listName, list){ GM_setValue(listName, list.join('\n')); }

// Get an array of strings that was saved with setSavedList().
function getSavedList(listName){
  var savedList = GM_getValue(listName, '');
  return savedList? savedList.split('\n') : [];
}

// Add an item to a list saved with setSavedList().
// If the size of the list is greater than the "max" parameter, the first item in the list is removed.
function addSavedListItem(listName, item, max){
  var savedList = getSavedList(listName);
  // Only add if it isn't already there.
  if(savedList.indexOf(item) != -1){ return; }
  savedList.push(item);
  if(max > 0) while (max < savedList.length) var itm = savedList.shift();          
  setSavedList(listName, savedList);
}

// Remove an item from a list saved with setSavedList().
function removeSavedListItem(listName, item){
  var savedList = getSavedList(listName);
  var idx = savedList.indexOf(item);
  if(idx != -1){
    savedList.splice(idx, 1);
    setSavedList(listName, savedList);
    return true;
  }
  // No matches.
  return false;
}

function removeJobForItem(jobList, itemName){
  var jobs = getSavedList(jobList, '');
  var i=0;
  if(jobs.length>0){
    var job=jobs[jobs.length-1];
    requirementJob.forEach(
     function(j){
       if(j[1] == job){
         if(requirementJob[i][0]==itemName) removeSavedListItem(jobList,requirementJob[i][1]);                    
       }
       i++;
     }
    );
  }
}

function cycleSavedList(listName){
  // Move the first item to the end of the list.
  var opponents = GM_getValue(listName, '').split('\n');
  var first = opponents.shift();
  if(first){ opponents.push(first); }
  GM_setValue(listName, opponents.join('\n'));
}

/******************************** HTML/DOM ********************************/
function stripURI(img){
  img = img.split('"')[1];
  return img.replace('" />', '');
}

function showIfUnchecked(setting){
  return setting != 'checked' ? 'unchecked' : setting;
  //if(setting != 'checked') setting = 'unchecked';
  //return setting;
}

function showIfSelected(setting){
  return setting == 'checked' ? 'selected' : 'unselected';
  //if(setting == 'checked') return 'selected';
  //else return 'not selected';
}

function showIfRelative(key){
  return GM_getValue(key) == 'checked'? 'relative' : 'absolute';
}

// Converts a link element to an HTML string with an optional CSS class.
function linkToString(link, className){
  if(!link) return link;

  // Decode ID
  var decBase64ID = function (strInput){
    if(strInput.match(/user=/)){
      var id = strInput.split('user=')[1].split('\'')[0].split('&')[0];
      strInput = strInput.replace (id, decodeID(id));
    }
    return strInput;
  };

  var str = '<a';
  if(className) str += ' class="'+ className+'"';
  if(link.hasAttribute('onclick')){
    var onclick = link.getAttribute('onclick');
    if(onclick) str += ' onclick="'+ decBase64ID(onclick)+'"';
  }

  str += ' href="'+ decBase64ID(link.href)+'">'+ link.innerHTML+'</a>';

  return str;
}

function decodeHTMLEntities(str){
  if(!str) return str;
  scratchpad.innerHTML = str;
  return scratchpad.value;
}

// Hide the element
function hideElement(elt, hideFlag){
  if(!elt) return;
  if(hideFlag == null) hideFlag = true;
  elt.setAttribute("id", hideFlag ? "mwapHide" : "", 0);
  return elt;
}

function clickElement(elt){
  if(!elt){
    colorDEBUG('BUG DETECTED: Null element passed to clickElement().', cre);
    return;
  }
  if(gvar.isGreaseMonkey){
    try{
      $(elt).click();
    } catch (clickError){
      // Simulate a mouse click on the element.	
      var evt = document.createEvent('MouseEvents');
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      elt.dispatchEvent(evt);
    }
  } else {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    elt.dispatchEvent(evt);
  }
}

function ignoreElement(element){
  var parentElt = element.parentNode;
  var id;
  if(parentElt){
    id = parentElt.id;
    if(id && (id.indexOf('countdown') != -1 || id.indexOf('timer') != -1 || id.indexOf('ask_for_job_help_time') != -1
        || id.indexOf('tournament_time_left') != -1 || id.indexOf('tournament_try_again_timer') != -1 || id.indexOf('zmc_event_count') != -1
        || id.indexOf('googleAds') != -1 || id.indexOf(' ps_mwap_promo_banner') != -1
        ))
      return true;
  }

  id = element.id;
  if(id && (id.indexOf('countdown') != -1 || id.indexOf('timer') != -1 || id.indexOf('ask_for_job_help_time') != -1
        || id.indexOf('tournament_time_left') != -1 || id.indexOf('tournament_try_again_timer') != -1 || id.indexOf('zmc_event_count') != -1
        || id.indexOf('googleAds') != -1 || id.indexOf(' ps_mwap_promo_banner') != -1
        ))
    return true;

  return false;
}

function xpathFirst(p, c){
  return document.evaluate(p, c || document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
}

function $x(p, c){
  var i, r = [], x = document.evaluate(p, c || document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  while ((i = x.iterateNext())) r.push(i);
  return r;
}

function xpath(query, element){
  var elt = (element == null) ? document : element;
  return document.evaluate(query, elt, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}

// Toggle checkbox element and return true if it is checked
function toggleCheckElt(eltId){
  if(isGMChecked(eltId)){
    GM_setValue(eltId, 0);
    return false;
  } else {
    GM_setValue(eltId, 'checked');
    return true;
  }
}

// Default an array of checkbox elements
function defaultCheckBoxElementArray(arrayEltIds, value){
  for (var i=0; i<arrayEltIds.length; i++) GM_setValue(arrayEltIds[i], value);
}

// Save an array of checkbox elements
function saveCheckBoxElementArray(arrayEltIds){
  for (var i=0; i<arrayEltIds.length; i++){
    if(document.getElementById(arrayEltIds[i])) saveCheckBoxElement(arrayEltIds[i]);
    else GM_setValue(arrayEltIds[i], 0);
  }
}

// Save checkbox element and return true if it is checked
function saveCheckBoxElement(eltId){
  if(document.getElementById(eltId).checked === true){
    GM_setValue(eltId, 'checked');
    return true;
  } else {
    GM_setValue(eltId, 0);
    return false;
  }
}

// Save an array of elements
function saveElementArray(arrayEltIds){
  for (var i=0; i<arrayEltIds.length; i++) saveElement(arrayEltIds[i]);
}

// Save element based on save option
// option 0 : save by elt ID, save value : elt
// option 1 : save by elt ID, save value : elt selectedIndex
// option 2 : save by elt ID, save value : elt value
// option 3 : save by elt ID, save value : checked
// option 4 : save by elt ID, save value : parameter value
function saveElement(eltId){
  if(document.getElementById(eltId[0]))
    switch(eltId[1]){
      case 1 :  GM_setValue(eltId[0], (document.getElementById(eltId[0]).selectedIndex) ? document.getElementById(eltId[0]).selectedIndex : 0); break;
      case 2 :  GM_setValue(eltId[0], (document.getElementById(eltId[0]).value)? document.getElementById(eltId[0]).value : 0); break;
      case 3 :  GM_setValue(eltId[0], (document.getElementById(eltId[0]).value)? 'checked' : 0); break;
      case 4 :  GM_setValue(eltId[0], (eltId[2])? eltId[2] : 0); break;
      default : GM_setValue(eltId[0], document.getElementById(eltId[0])); break;
    }
  else GM_setValue(eltId, 0);
}

// Check if a GM value is the same as the passed value
function isGMEqual (gmName, gmValue){ return GM_getValue(gmName)+'' == gmValue+''; }

// Check if a GM value is checked
function isGMChecked (gmName){ return isGMEqual(gmName, 'checked'); }

// Check if a GM value is undefined
function isGMUndefined (gmName){ return isUndefined(GM_getValue(gmName)); }

// Check if a value is undefined
function isUndefined(value){ return value+'' == 'undefined'; }

function makeElement(type, appendto, attributes, checked, chkdefault){
  var element = document.createElement(type);
  if(attributes != null) for (var i in attributes) element.setAttribute(i, attributes[i]);      
  if(checked != null) if(GM_getValue(checked, chkdefault) == 'checked') element.setAttribute('checked', 'checked');  
  if(appendto) appendto.appendChild(element);
  return element;
}

function destroyByID(id){
  var elt = document.getElementById(id);
  if(elt) elt.parentNode.removeChild(elt);
}

function remakeElement(type, appendto, attributes, checked, chkdefault){
  if(attributes.id) destroyByID(attributes.id);
  return makeElement(type, appendto, attributes, checked, chkdefault);
}

function getBrowserWindowSize(){
  if(document.body && document.body.offsetWidth){
    winW = document.body.offsetWidth;
    winH = document.body.offsetHeight;
  }
  if(document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth ){
    winW = document.documentElement.offsetWidth;
    winH = document.documentElement.offsetHeight;
  }
  if(window.innerWidth && window.innerHeight){
    winW = window.innerWidth;
    winH = window.innerHeight;
  }
}
/******************************** CASH PARSING ********************************/

// Parse a monetary value such as "C$50,000" and return an integer.
function parseCash(cash){
  var c = cash;
  if(typeof(c) == 'string'){
    c = c.trim().replace(/K$/,'00');
    c = c.trim().replace(/K/,'0');    
    c = c.trim().replace(/\D/g,'');
  }
  return parseInt(c);
}
// Parses a monetary value such as "C$50,000" and returns the city (var NY/CUBA/MOSCOW/BANGKOK/LV).
function parseCashLoc(cash){
  if(typeof(cash) == 'string'){
    if(cash.match(/([A-Z]*?\$|\u00A2)[\d,]*\d/)){
      switch (RegExp.$1){
        case '$'      : return NY; break;
        case 'C$'     : return CUBA; break;
        case 'M$'     : return MOSCOW; break;
        case 'B$'     : return BANGKOK; break;
        case 'V$'     : return LV; break;
        case 'L$'     : return ITALY; break;
        case 'BRL$'   : return BRAZIL; break;
        case '\u00A2' : return CHICAGO; break;
        default       : return NY; break;
      }
    }
  }
  return NY;
}

function makeCommaValue(nStr){
  nStr = String(nStr);  
  return nStr == (nStr = nStr.replace(/^(.*\s)?(\d+)(\d{3}\b)/, "$1$2,$3")) ? nStr : makeCommaValue(nStr);
}

/******************************** DATE/TIME ********************************/
// reads a date string from a stored GM value and converts it to seconds since 1970
function getGMTime(GMvalue){
  var tempVal = GM_getValue(GMvalue, 0);
  var d = Date.parse(tempVal);
  if(!d){
    setGMTime(GMvalue,"00:00:10"); // problem with timer, set to 10 seconds
    var tempVal = GM_getValue(GMvalue, 0);
    var d = Date.parse(tempVal);
  }
  return d/1000;
}

// takes a string input in the form of a countdown 'MM:SS', 'HH:MM:SS', 'MM minutes and SS seconds' and stores the
// time when the countdown is zero in a GM value.  Also takes an input of 'now' and stores the current time.
function setGMTime(GMvalue, countdownStr){
  var d = new Date();
  d.setMilliseconds(0);
  if(countdownStr != 'now') d.setTime(d.getTime()+(timeLeft(countdownStr)*1000));
  GM_setValue(GMvalue, d.toString());
}

// returns the number of seconds left until a date stored in a GM value
function timeLeftGM(GMvalue){
  var timeToCompare = getGMTime(GMvalue);
  var d = new Date();
  d.setMilliseconds(0);
  return Math.max(timeToCompare-(d.getTime()/1000), 0);
}

// takes a string input in the form of 'MM:SS', 'HH:MM:SS', or 'MM minutes and SS seconds' and returns the number of seconds it represents
function timeLeft(timeToConvert){
  if(!timeToConvert) return 0;
  var returnVal = 0;
  var temp = new Array();
  temp = timeToConvert.split(':');
  if(temp.length == 2)  // MM:SS
    returnVal = ((parseInt(temp[0]) * 60) + parseInt(temp[1]));
  else if(temp.length == 3) // HH:MM:SS
    returnVal = ((parseInt(temp[0]) * 60 * 60) + (parseInt(temp[1]) * 60) + parseInt(temp[2]));
  else if(temp.length == 1){  // 'HH hours and MM minutes and SS seconds'
    temp = timeToConvert.split(' and ');
    for (i = 0; i < temp.length; i++){
      spaceIndex = temp[i].indexOf(' ');
      if(spaceIndex != -1){
        firstPart = temp[i].substring(0, spaceIndex);
        secondPart = temp[i].substring(spaceIndex+1, temp[i].length);
        if((secondPart == 'minutes') || (secondPart == 'minute')) returnVal = returnVal + (parseInt(firstPart) * 60);
        else if((secondPart == 'seconds') || (secondPart == 'second')) returnVal = returnVal + (parseInt(firstPart));
        else if((secondPart == 'hours') || (secondPart == 'hour')) returnVal = returnVal + (parseInt(firstPart * 60 * 60));
        else if((secondPart == 'days') || (secondPart == 'day')) returnVal = returnVal + (parseInt(firstPart * 24 * 60 * 60));
      }
    }
  }
  return(returnVal);
}

// Convert decimal time to ?h ?m ?s format
function getDecimalTime(decimalTime){
  var num = parseFloat(decimalTime);
  var strTime = '';
  if(num){
    if(num >= 60){
      strTime = parseInt(num/60)+'h ';
      num -= parseInt(num); num *= 60;
    }
    strTime += parseInt(num)+'m ';
    num -= parseInt(num); num *= 60;
    strTime += parseInt(num)+'s';
  }
  return strTime.replace('00','0');
}

function secondsToHMS(d){
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);
  return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}

// Convert seconds to ?h ?m ?s format
function getHoursTime(timer){
  var seconds = timeLeftGM(timer);
  if(seconds == 0) return 0;
  if(isNaN(seconds)) return undefined;
  var num = parseInt(seconds);
  var strTime = '';
  if(num){
    num /= 60;
    if(num >= 60){
      num /= 60;
      strTime = parseInt(num)+'h ';
      num -= parseInt(num); num *= 60;
    }
    strTime += parseInt(num)+'m ';
    num -= parseInt(num); num *= 60;
    strTime += parseInt(num)+'s';
  }
  return strTime;
}

/******************************** Base64 Logic ********************************/
function IsJsonString(str){ try { JSON.parse(str);} catch (e){ return false; } return true; }
function decodeID (strID){
  // Unescape and clean up the ID first (for %3D string, non-base 64 strings etc)
  strID = unescape (strID);
  if(isNaN(strID)){ strID = decode64(strID); }
  return strID;
}

// Function to decode strings from Base64
function decode64(input){
  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9\+\/\=]/g;
  if(base64test.exec(input)){ DEBUG('Invalid character(s) found in input ('+ input +'). Expect errors in decoding.'); }
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  do {
     enc1 = keyStr.indexOf(input.charAt(i++));
     enc2 = keyStr.indexOf(input.charAt(i++));
     enc3 = keyStr.indexOf(input.charAt(i++));
     enc4 = keyStr.indexOf(input.charAt(i++));

     chr1 = (enc1 << 2) | (enc2 >> 4);
     chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
     chr3 = ((enc3 & 3) << 6) | enc4;

     output = output + String.fromCharCode(chr1);

     if(enc3 != 64){ output = output + String.fromCharCode(chr2); }
     if(enc4 != 64){ output = output + String.fromCharCode(chr3); }

     chr1 = chr2 = chr3 = "";
     enc1 = enc2 = enc3 = enc4 = "";

  } while (i < input.length);

  return output;
}

function encode64(input){
  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;

  do {
     chr1 = input.charCodeAt(i++);
     chr2 = input.charCodeAt(i++);
     chr3 = input.charCodeAt(i++);

     enc1 = chr1 >> 2;
     enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
     enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
     enc4 = chr3 & 63;

     if(isNaN(chr2)){ enc3 = enc4 = 64; }
     else if(isNaN(chr3)){ enc4 = 64; }

     output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
     chr1 = chr2 = chr3 = "";
     enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);

  return output;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
function Auto_Mafia_Mission(){
  Autoplay.delay = getAutoPlayDelay();  
  // Go to the missions tab
  var Miss_ID = null;
  var Miss_Slot = null;
  var MyMafiaJobs = null;

  var idleCity = GM_getValue('idleLocation', NY);
  if(city != idleCity){
    Autoplay.fx = function(){ goLocation(idleCity); };
    Autoplay.start();    
    return true;
  }

  if(!OnMissionsTab()){
    Autoplay.fx = GoMissionsTab;
    Autoplay.start();
    return true;
  }

  DEBUG('Mymission Timer '+parseInt(timeLeftGM('checkedmymissionTimer'))+' Seconds.') ;
  if(!timeLeftGM('checkedmymissionTimer')){
    if(!My_Missions_Tab()){
      Autoplay.fx = Go_My_Missions_Tab;
      Autoplay.start();
      return true;
    }

    if(isGMChecked('AutoStartOperations')) Check_For_Start_A_Mission();

    Check_For_Remove_A_Mission();

    if(isGMChecked('AskMissionHelp') ) Chk_mission_help () ;
    if(isGMChecked('AutoMafiaCollection')) Auto_Mafia_Collection() ;  // will collect mymission
    if(isGMChecked('AutoMafiaRemoved'))    Auto_Mafia_Remove() ;  // will check for being removed from operations on this page
    if(Chk_Nxt_MY_Mission()){
      Autoplay.fx = Go_Nxt_Page;
      Autoplay.start();
      return true;
    }
    DEBUG(' mission. end of myMissions processing, set timer 2 min, checking myMafia operations.');
    setGMTime('checkedmymissionTimer', '00:02:00');
  }
  // end of mymissions next is myMafia missions
  
  if(!Mafia_Missions_Tab()){
    Autoplay.fx = Go_Mafia_Missions_Tab;
    Autoplay.start();
    return true;
  }

  if(isGMChecked('AskMissionHelp')) Chk_mission_help () ;
  if(isGMChecked('AutoMafiaCollection')) Auto_Mafia_Collection() ;  // will collect mymission
  if(isGMChecked('AutoMafiaRemoved'))    Auto_Mafia_Remove() ;  // will check for being removed from missions onthis page

  if(isGMChecked('AutoMafiaJob')){
    if(Check_Mission_Job()){
    Autoplay.fx = Do_Mission_Job;
    Autoplay.start();
    return true;
    }
  }

  if(Chk_Nxt_Page()) Autoplay.fx = Go_Nxt_Page;
  else Autoplay.fx = goHome; // this fixes the hang on leaveing operations
    
  Autoplay.start();
  return true;
}
////
function OnMissionsTab(){
  if(xpathFirst('//div[@id="socialMissionNav"]//a',innerPageElt)) return true;
  return false;
}
////
function GoMissionsTab(){
  var elt = xpathFirst('//div[@id="nav_link_events_unlock"]//a',menubarElt);
  if(elt){
    var numMiss = xpathFirst('//span[contains(@id,"user_socialmissions")]',menubarElt);
    if(numMiss){
      missCnt = numMiss.innerHTML.untag();
      numMissCnt = parseInt(missCnt.replace(/\D/g ,''));
      if(numMissCnt > 0){
        DEBUG('Clicking Family Tab to go check on '+numMissCnt +' operations.');
        clickElement(elt);
        return true;
      } else {
        mmis_time = '00:15:00'; // set timer to 15 min
        DEBUG(' operations count '+numMissCnt+' timer set to: '+ mmis_time );
        setGMTime('colmissionTimer', mmis_time);
        return false;
      }
    } else {
      DEBUG('number of operations not found, go check just in case');
      clickElement(elt);
    }
  }
}
////
function Chk_mission_help(){
  var missionElts = $x('.//div[@class="socialMission" and contains(@id,"socialMission_")]',innerPageElt);
  if(missionElts && missionElts.length>0){
    for(i=0,iLength=missionElts.length;i<iLength;i++){
      var ask_mission_help = xpathFirst('.//a[@class="sexy_button_new medium white sexy_call_new ask_for_help" and contains(@onclick, "postAskHelpFeed")]', missionElts[i]);
      var emptySlots = xpathFirst('.//div[@class="missionTaskImage" and contains(@style, "silhoutte_thmb")]', missionElts[i]);
      if(ask_mission_help && emptySlots){
        clickElement(ask_mission_help);
        DEBUG('Clicked to Ask for Help on Operation '+i);
        break;
      }
    }
  }
  return;
}
////
function Mafia_Missions_Tab(){
  // if we find this string we are on the mymafiamissions page not on page for me only
  var myMafiaMissions = xpathFirst('.//a[(@id="myMafiaMissions"  and contains(@onclick, "controller=socialmission")  and contains(@style, "marketplace_menu_item_hover"))]', innerPageElt);
  if(myMafiaMissions){ return true ; }
  return false;
}
////
function My_Missions_Tab(){
  // if we find this string we are on the mymafiamissions page not on page for me only
  var MyMissions = xpathFirst('.//a[(@id="myMissions"  and contains(@onclick, "controller=socialmission")  and contains(@style, "marketplace_menu_item_hover"))]', innerPageElt);
  if(MyMissions) return true ;
  return false;
}
////
function Go_My_Missions_Tab(){
  // checking mafia operations, if hover is NOT found we are NOT on it, we are on mymafia page instead, so if string found, we need to click to change
  var MyMissionstab = xpathFirst('.//a[@id="myMissions"  and contains(@onclick, "controller=socialmission")  and not (contains(@style, "graphics/marketplace_menu_item_hover"))]', innerPageElt);
  if(MyMissionstab){
    clickElement(MyMissionstab);
    return true;
  }
  return false;
}
////
function Go_Mafia_Missions_Tab(){
  // checking mafia operations, if hover is NOT found we are NOT on it, we are on mymafia page instead, so if string found, we need to click to change
  var myMafiaMissionstab = xpathFirst('.//a[@id="myMafiaMissions"  and contains(@onclick, "controller=socialmission")  and not (contains(@style, "graphics/marketplace_menu_item_hover"))]', innerPageElt);
  if(myMafiaMissionstab){
    clickElement(myMafiaMissionstab);
    return true;
  }
  return false;
}
////
function Auto_Mafia_Collection(){
  if(Chk_Mafia_Collection()){
    Autoplay.fx = Do_Reward_Collection;
    Autoplay.delay = getAutoPlayDelay();
    Autoplay.start();
    return true;
  }
}
////
function Chk_Mafia_Collection(){
  var missionButtons;
  var numButtons;
  missionButtons = $x('.//a[@class="sexy_button_new medium green" and contains(@onclick, "collectReward")]', innerPageElt);
  numButtons = missionButtons.length;
  if(numButtons>0) return true;  
  return false;
}
////
function Do_Reward_Collection(){
  var ColMissionReward = xpathFirst('.//a[@class="sexy_button_new medium green" and contains(@onclick, "collectReward")]', innerPageElt);
  if(ColMissionReward){
    clickElement(ColMissionReward);
    return true;
  }
  return;
}
////
function Auto_Mafia_Remove(){
  var parentDivs = $x('.//div[@class="missionBoxRight"]', innerPageElt);
  numDivs = parentDivs.length;

  if(numDivs>0){
    for(i=0;i<numDivs;i++){
      var ClrRemovedButton = xpathFirst('.//a[@class="sexy_button_new medium white" and contains(@onclick, "removeMission") and not (contains(@style,"none"))]', parentDivs[i]);
      if(ClrRemovedButton){
        DEBUG(' mission closed. I was removed from, or expired.');
        clickElement(ClrRemovedButton);
        Chk_Left_Page();  // if we removed something we gotta go back a page
        return true;
      }

      var ClrCloseButton = xpathFirst('.//a[@class="sexy_button_new medium white" and contains(@onclick, "removeMission") and contains(.,"Close")]', parentDivs[i]);
      if(ClrCloseButton){
        DEBUG(' mission closed. Mission Expired.');
        clickElement(ClrCloseButton);
        Chk_Left_Page();  // if we removed something we gotta go back a page
        return true;
      }
    }
  }
  return;
}
////
function chk_nrg(){
  if(energy < Miss_Nrg_Req ){
    DEBUG(' mission Skipped. energy: '+ energy+', cost='+ Miss_Nrg_Req);
    return false;
  }
  if(energy - Miss_Nrg_Req < SpendMissionEnergy.floor ){
    DEBUG(' mission Skipped energy ='+energy+', floor='+SpendMissionEnergy.floor+', Miss_Nrg_Req='+Miss_Nrg_Req+', burn='+ SpendMissionEnergy.canBurn);
    return false;
  }
  return true;
}
////
function chk_stam(){
  if(stamina < Miss_Stam_Req ){
    DEBUG(' mission Skipped. Stamina='+ stamina+', cost='+ Miss_Stam_Req);
    return false;
  }
  if((stamina - Miss_Stam_Req) < SpendMissionStamina.floor ){
    DEBUG(' mission Skipped. Stamina='+stamina+', floor='+SpendMissionStamina.floor+', Miss_Stam_Req='+Miss_Stam_Req+', burn='+ SpendMissionStamina.canBurn);
    return false;
  }
  return true;
}
////
function Do_Mission_Job(){
  var DoMafiaMissions = xpathFirst('.//div[contains(@id,"'+Miss_ID+'") and not(contains(@style,"none"))]//a[@class="sexy_button_new do_job sexy_energy_new medium orange" and contains(@onclick, "SocialMissionController.doTask(\''+Miss_ID+'")]', innerPageElt);  
  if(DoMafiaMissions){    
    clickAction = 'Missionjob';
    suspendBank = false;
    DEBUG('Clicked to do job on Miss_ID:'+Miss_ID);
    clickElement(DoMafiaMissions);
    return true;
  }
  return false;
}
////
function Chk_Nxt_MY_Mission(){
  var page_right = xpathFirst('.//a[@class="right " and contains(@onclick, "viewPage")]', innerPageElt);
  if(page_right) return true;  
  return false;
}
////
function Chk_Nxt_Page(){
  var page_right = xpathFirst('.//a[@class="right " and contains(@onclick, "viewPage")]', innerPageElt);
  if(!page_right){
    mmis_time = '00:15:00'; // set timer to 15 min
    setmissiontimer();
    return false;
  }
  return true;
}
////
function Go_Nxt_Page(){
  var page_right = xpathFirst('.//a[@class="right " and contains(@onclick, "viewPage")]', innerPageElt);
  if(page_right){
    clickElement(page_right);    
    return true;
  }
  return false;
}
////
function Chk_Left_Page(){
  var page_left = xpathFirst('.//a[@class="left " and contains(@onclick, "viewPage")]', innerPageElt);
  if(page_left){
    clickElement(page_left);
    return true;
  }
  return false;
}
////
function Check_For_Start_A_Mission(){
  MyMafiaJobStart = xpathFirst('.//a[@class="sexy_button_new medium white" and contains(@onclick, "startMission" ) ]', innerPageElt);
  if(MyMafiaJobStart){  // if we have a mission to try to do, see if we can
    colorDEBUG('autoMission - Clicking Start Misison Button');
    clickElement(MyMafiaJobStart); // click white start operation button
    return true ;
  }
}
////
function Check_For_Remove_A_Mission(){
  MyMafiaJobStart = xpathFirst('.//a[@class="sexy_button_new medium white" and contains(@onclick, "showTryAgain" ) ]', innerPageElt);
  if(MyMafiaJobStart){  // if we have a mission to try to close, see if we can
    clickElement(MyMafiaJobStart); // click white close button
    return true ;
  }
}
////
function Check_Mission_Job(){
  // if we find this link, we are in a non finished job
  MyMafiaJobs = xpathFirst('.//a[@class="sexy_button_new do_job sexy_energy_new medium orange"  and contains(@onclick, "SocialMissionController.doTask(\''+Miss_ID+'")]', innerPageElt);
  if(MyMafiaJobs){ colorDEBUG('Check Mission_Job - Found Mission 1'); return true; }
  MyMafiaJobs = xpathFirst('.//a[@class="sexy_button_new do_job medium white" and contains(@onclick, "SocialMissionView.startTask" ) ]', innerPageElt);
  if(MyMafiaJobs){  // if we have a mission to try to do, see if we can
    Load_MMiss_Info();
    if(MyMafiaJobs){
      colorDEBUG('Check Mission_Job - Found Mission  2 - Click Start');
      clickElement(MyMafiaJobs); // click white start job button
      return true ;
    }
  }
  return false;
}
////
function Load_MMiss_Info(){
  colorDEBUG('autoMisison - Load_Mission_Info');
  MyMafiaJobs = xpathFirst('.//a[@class="sexy_button_new do_job medium white" and contains(@onclick, "SocialMissionView.startTask" ) ]', innerPageElt);

  if(MyMafiaJobs){
    Miss_ID     = MyMafiaJobs.getAttribute('onclick').split('SocialMissionView.startTask(\'')[1].split('\',\'')[0]  ;  // will pull out just the 1 id
    Miss_Slot   = MyMafiaJobs.getAttribute('onclick').split('SocialMissionView.startTask(\''+Miss_ID+'\',\'')[1].split('\',\'')[0]  ;
    MIss_chk_ID = MyMafiaJobs.getAttribute('onclick').split('SocialMissionView.startTask(\''+Miss_ID+'\',\''+Miss_Slot+'\',\'')[1].split('\'')[0] ;
    DEBUG(' mission Miss_ID='+Miss_ID+'-Miss_Slot='+Miss_Slot+'-MIss_chk_ID='+ MIss_chk_ID+'=');
    Miss_Name = xpathFirst('.//div[contains(@id,"socialMission_'+Miss_ID+'")]//div[@class="missionName"]', innerPageElt);
    if(Miss_Name){
      Miss_Name_is = Miss_Name.innerHTML.untag();
      DEBUG(' mission Miss_Name: '+Miss_Name_is+'=');
    } else { DEBUG(' mission new code to find miss name FAILED');
    }
    Chk_Miss_Pay_Exp = xpathFirst('.//div[contains (@id,"missionTask_'+Miss_Slot+'_'+Miss_ID+'_module")]//div[@class="doTaskPaysModule"]//dd[contains(@class,"experience")]', innerPageElt);
    if(Chk_Miss_Pay_Exp){ Miss_Pay_Exp = Chk_Miss_Pay_Exp.innerHTML.untag(); }

    Chk_Miss_Pay_Cash = xpathFirst('.//div[contains (@id,"missionTask_'+Miss_Slot+'_'+Miss_ID+'_module")]//div[@class="doTaskPaysModule"]//dd[contains(@class,"cash")]', innerPageElt);
    if(Chk_Miss_Pay_Cash){ Miss_Pay_Cash = Chk_Miss_Pay_Cash.innerHTML.untag(); }

    Miss_Nrg_Req = 0;
    Miss_Stam_Req = 0;
    Miss_Cash_Req = 0;

    Chk_Miss_Nrg = xpathFirst('.//div[contains (@id,"missionTask_'+Miss_Slot+'_'+Miss_ID+'_module")]//div[@class="doTaskUsesModule"]//dd[contains(@class,"energy")]', innerPageElt);
    if(Chk_Miss_Nrg){
      Miss_Nrg_Req = Chk_Miss_Nrg.innerHTML.untag();
      Miss_Ratio =  Math.round(Miss_Pay_Exp / Miss_Nrg_Req * 100 ) / 100 ;
      DEBUG(' mission Energy Required: '+Miss_Nrg_Req+' with ratio of: '+ Miss_Ratio);
    }

    Chk_Miss_Stam = xpathFirst('.//div[contains (@id,"missionTask_'+Miss_Slot+'_'+Miss_ID+'_module")]//div[@class="doTaskUsesModule"]//dd[contains(@class,"stamina")]', innerPageElt);
    if(Chk_Miss_Stam){
      Miss_Stam_Req = Chk_Miss_Stam.innerHTML.untag();
      Miss_Ratio =  Math.round(Miss_Pay_Exp / Miss_Stam_Req * 100 ) / 100 ;
      DEBUG(' mission Stamina Required: '+Miss_Stam_Req+' with ratio of: '+ Miss_Ratio);
    }

    Chk_Miss_Cash = xpathFirst('.//div[contains (@id,"missionTask_'+Miss_Slot+'_'+Miss_ID+'_module")]//div[@class="doTaskUsesModule"]//dd[contains(@class,"cash")]', innerPageElt);
    if(Chk_Miss_Cash){
      Miss_Cash_Req = Chk_Miss_Cash.innerHTML.untag();
      DEBUG(' mission Cash Required: '+Miss_Cash_Req+' for '+Chk_Miss_Cash.className);
      if(Chk_Miss_Cash.className.match(/(.+?)_cash_icon/i)){
        var MissionCityName = RegExp.$1;
        DEBUG(' mission Cash Returned: '+Miss_Cash_Req+' for '+MissionCityName);
        var MissionCity = cities.searchArray(MissionCityName, 1)[0];
        DEBUG(' mission Cash Required: '+MissionCityName+' for '+MissionCity);
        if(MissionCity!= city){
          Autoplay.fx = function(){ goLocation(MissionCity); };
          Autoplay.start();
          return false;
        }
      }

      var cashDiff = (parseCash(Miss_Cash_Req) - cities[city][CITY_CASH])+parseCash(Miss_Cash_Req)*4;
      if(cashDiff > 0){
        DEBUG('We need '+cashDiff+' to do this Operation 5 times. Going to the bank/vault of '+city);
        suspendBank = true;
        autoBankWithdraw(cashDiff);
        Autoplay.fx = GoMissionsTab;
        Autoplay.start();
        return false;
      }
    }

    if((!chk_stam()) || (!chk_nrg()) ){
      MyMafiaJobs = null;
      return false;
    }
    if(MyMafiaJobs){ colorDEBUG('autoMission - We can do this Mission'); return true ; }
  }
}
//Profile Searching
function profileSearchCallBack(controller, action, other, city, status, extra, request){
  var atklink = (/xw_controller=fight(.+)'>Attack</.exec(request.responseText))[1];
  atklink = 'remote/html_server.php?xw_controller=fight' + atklink;
  var profileTxt = GM_getValue('profileList', '');
  if(IsJsonString(profileTxt)) var profileList = JSON.parse(profileTxt);
  else var profileList = [];
  var profileMatch = profileList.searchArray(extra, 0)[0];
  if(!isNaN(profileMatch)) profileList[profileMatch]=[extra, atklink];
  else profileList.push([extra, atklink]);    
  GM_setValue('profileList', JSON.stringify(profileList));
  profileCount++;
  startProfileSearching();
}

function startProfileSearching(){
  colorDEBUG('start startProfileSearching', cli);
  if (!running || GM_getValue('staminaSpendHow')!=STAMINA_HOW_FIGHT_LIST){
    colorDEBUG('Turning off startProfileSearching');
    if(searchTimer) window.clearInterval(searchTimer);
    isProfileSearching=false;
    return;
  }
  var profileString = GM_getValue('pfightlist', '');
  if(profileString){
    var profileList = profileString.split('\n');
    if(profileCount>=profileList.length) profilecount = 0;
    if(profileList && profileList.length>0){
      colorDEBUG('Loading profile for user: '+profileList[profileCount], cli);
      var otherTxt = '&user=p|'+profileList[profileCount];
      mwap_do_ajax('stats','view','',otherTxt,profileList[profileCount],profileSearchCallBack);
    } else {
      colorDEBUG('Turning off startProfileSearching', cre);
      if(searchTimer) window.clearInterval(searchTimer);
      isProfileSearching=false;
      return;
    }
  }
}
// Heal Functions
function heal(useBackup){
  if(!timeLeftGM('healTimer')){
    colorDEBUG('healTimer has GONE off - You can try to heal', cgr);
    setGMTime('healTimer','00:03');
    var xcity = '';
    if (parseInt(GM_getValue('healLocation', NY))==NY||useBackup) xcity = '&xcity=1';
    mwap_do_ajax('hospital','heal','',xcity,'',healCallback);
  }
  return;
}
function healCallback(controller, action, other, city, status, extra, request){
  if(IsJsonString(request.responseText)){
    var jsonresult = JSON.parse(request.responseText);
    if (jsonresult.heal_success==1){
      addToLog('health Icon', jsonresult.hospital_message);
      setGMTime('healTimer','00:31'); // We hit the success, 31 seconds minimum before next attempt.
    } else if (jsonresult.heal_success==0){
      addToLog('health Icon', jsonresult.hospital_message);
      setGMTime('healTimer','00:03');// Failed.. can try again in 3 seconds..
    }
  }
}
// Family Boss Fight Functions
function bossLoad(){
  // Shows the listing of bosses..
  if (!running||!isGMChecked('autoFamilyBosses')){
    isBossRunning = false;
    return;
  }
  mwap_do_ajax('Epicclanboss','list_view','','','',bossCallback);
}
function bossLoadBoss(){
  // Shows the boss page
  mwap_do_ajax('Epicclanboss','boss_view','','&boss_id='+current_boss_id,'',bossCallback);
}
function bossJoin(){
  mwap_do_ajax('Epicclanboss','epic_join','','&role='+bossRoles[GM_getValue('bossRole',0)]+'&boss_id='+current_boss_id,'',bossCallback);
}
function bossCreate(boss_id){
  mwap_do_ajax('Epicclanboss','epic_create','','&boss_id='+boss_id,'',bossCallback);
}
function bossSendBoost(cell_id, role_id, boss_id, target_ppid){
  mwap_do_ajax('Epicclanboss','epic_send_role','','&role_id='+role_id+'&boss_id='+boss_id+'&cell_id='+cell_id+'&target_ppid='+target_ppid,'',bossCallback);
}
function bossAskBoost(role_id, boss_id){
  // Role: 1 = Bruiser, 2 = Arsonist, 3 = Racketeer
  mwap_do_ajax('Epicclanboss','epic_ask_role','','&role_id='+role_id+'&boss_id='+boss_id,'',bossCallback);
}
function bossCollect(boss_id){
  mwap_do_ajax('Epicclanboss','epic_collect','','&boss_id='+boss_id,'',bossCallback);
}
function bossAttack(num){
  mwap_do_ajax('Epicclanboss','epic_attack','','&consumable_id=0&boss_id='+current_boss_id,num,bossCallback);
}
function bossCallback(controller, action, other, city, status, extra, request){
  if (status){ // If we were successful
    var Bosses = []; // empty array
    var BossNames = [];
    var respData;
    if (action == 'epic_ask_role' || action == 'epic_send_role'){
      if(IsJsonString(request.responseText)){
        var jsonresult = JSON.parse(request.responseText);
        if (jsonresult.data && jsonresult.data.impulseBuy){
          addToLog('info Icon', jsonresult.data.impulseBuy.message.untag());
        }
      }
      window.setTimeout(bossLoad,getAutoPlayDelay());
      return;
    } else if (action=='epic_attack'){
      if(IsJsonString(request.responseText)){
        var jsonresult = JSON.parse(request.responseText);
        if(jsonresult.data) if(IsJsonString(jsonresult.data)) respData = JSON.parse(jsonresult.data);
        if (respData && respData.damage.toBoss){
          addToLog('info Icon', 'Did ' + respData.damage.toBoss + ' damage to ' + current_boss_name);
        }
      }
      if (extra==1) window.setTimeout(bossLoad,getAutoPlayDelay());
      return;
    } else if (action=='epic_collect' || action=='epic_join'){
      window.setTimeout(bossLoad,getAutoPlayDelay());
      return;
    } else if (action=='boss_view'){
      if (request.responseText.indexOf('xw_controller=Epicclanboss&xw_action=epic_join')!=-1){
        addToLog('info Icon', 'Joining Boss' + current_boss_id);
        bossJoin();
        return;
      } else {
        doc = document.createElement('div')
        doc.innerHTML = request.responseText
        var page = request.responseText;
        var boosts = 0, boss_rage = 0, boss_stamina = 0;
        var userData, bossData; // Object to store the boss userdata
        var i1 = request.responseText.indexOf('"currentCharges":');
        if (i1!=-1){
          boosts = parseInt(request.responseText.slice(i1+17,request.responseText.indexOf(',',i1)));
        }
        //addToLog('info Icon', 'We have ' + boosts + ' boosts to send for boss ' + current_boss_id);
        // Check for sending boosts..
        var sendElts = $x('.//div[contains(@class,"helpButton") and contains(@style, "block")]/a[contains(@href,"xw_action=epic_send_role&")]', doc);
        if (sendElts && sendElts.length && boosts > 0 && isGMChecked('sendBossFightBoosts')){
          var bossSendElt = sendElts[Math.floor(Math.random() * sendElts.length)]; // Random Person
          var role_id = bossSendElt.href.match(/role_id=(\d+)/)[1];
          var cell_id = bossSendElt.href.match(/cell_id=(\d+)/)[1];
          var target_ppid = bossSendElt.href.match(/target_ppid=(.*)/)[1];
          addToLog('info Icon', 'Sending a boost to a family member, playerid: ' + target_ppid);
          bossSendBoost(cell_id, role_id, current_boss_id, target_ppid);
          return;
        }
        // Check for asking boosts..
        var boostElts = $x('.//div[contains(@class,"needBoost") and not(contains(@style, "none"))]/div[contains(@class,"boostAskHelp") and not(contains(@style, "none"))]/a[contains(@href,"xw_action=epic_ask_role")]', doc);
        // Ask for a boost if we can..
        if (boostElts && boostElts.length && isGMChecked('askBossFightBoosts')){
          //addToLog('info Icon', 'We can ask for ' + boostElts.length + ' boosts');
          var role_id = boostElts[0].href.match(/role_id=(\d+)/)[1];
          bossAskBoost(role_id,current_boss_id);
          return;
        }
        // Stamina
        isearch='user_fields[\'user_stamina\'] = parseInt("';
        i1 = page.indexOf(isearch);
        if(i1!=-1){
          boss_stamina = parseInt(page.slice(i1+isearch.length,page.indexOf('"',i1+isearch.length)));
        }
        isearch = 'bossData = {';
        i1 = page.indexOf(isearch);
        if(i1!=-1){
          bossData = JSON.parse(page.slice(i1+isearch.length-1,page.indexOf('};',i1+isearch.length)+1));
        }
        isearch = 'userData = {';
        i1 = page.indexOf(isearch);
        if(i1!=-1){
          userData = JSON.parse(page.slice(i1+isearch.length-1,page.indexOf('};',i1+isearch.length)+1));
        }
        DEBUG('Rage: ' + bossData.current_rage + ' Stamina: ' + boss_stamina);
        if (
          isGMChecked('autoFamilyBossFighting') &&
          (bossData.current_rage < GM_getValue('bossRageLimit',250) || userData.pendingRoleEffects["2"]["count"] > 0) &&
          //(userData.stamina_required <= GM_getValue('bossStaminaLimit',5) || userData.pendingRoleEffects["3"]["count"] > 0) &&
          (userData.stamina_required <= bossStaminaLimits[GM_getValue('bossStaminaLimit',0)] || userData.pendingRoleEffects["3"]["count"] > 0) &&
          (bossData.currHealth > 0 && boss_stamina >= userData.stamina_required)
        ){
          if (userData.current_fatigue < 14){for (j=1;j<5;j++){bossAttack(j);}} else {bossAttack(1);}
          return;
        }
        DEBUG('Rage: ' + bossData.current_rage + ' / Limit ' + GM_getValue('bossRageLimit',250) + ' boosts: ' + userData.pendingRoleEffects["2"]["count"]);
        DEBUG('Stamina: ' + userData.stamina_required + ' / Limit ' + bossStaminaLimits[GM_getValue('bossStaminaLimit',0)] + ' boosts: ' + userData.pendingRoleEffects["3"]["count"]);
        DEBUG('Boss Health: ' + bossData.currHealth + ' Current Stamina: ' + boss_stamina);
        // We made it here.. we can't do anything else to this boss.
        setGMTime('familyBoss_'+current_boss_id, '02:00'); // Check this boss again in 2 minutes.
        window.setTimeout(bossLoad,getAutoPlayDelay());
        return;
      }
    } else {
        // List View..
        doc = document.createElement('div')
        doc.innerHTML = request.responseText
        // Check if we can collect..
        i1 = request.responseText.match(/xw_controller=Epicclanboss&xw_action=epic_collect.*?&boss_id=(\d+)/);
        if (i1 && i1[1]){
          addToLog('info Icon', 'Found boss collect for: ' + i1[1]);
          bossCollect(i1[1]);
          return;
        }
        i1 = request.responseText.match(/BossOperationController.startFight\((\d+)\)/);
        if (i1 && i1[1]){
          addToLog('info Icon', 'Found boss create for: ' + i1[1]);
          bossCreate(i1[1])
          return;
        }
        var bossElts = $x('.//div[@class="boss_operation"]',doc);
        for (i = 0; i < bossElts.length; i++) {
          var bossNameElt = xpathFirst('.//div[contains(@class,"boss_name")]', bossElts[i]);
          var bossName = bossNameElt.innerHTML.untag().trim();
          // Can we go to the boss fight?
          if (xpathFirst('.//a[contains(@onclick,"BossOperationController.goToFight")]', bossElts[i])){
            if (!timeLeftGM('familyBoss_'+bossElts[i].id.split('_')[1])){
              Bosses.push(bossElts[i].id.split('_')[1]);
              BossNames.push(bossName);
              DEBUG('Found active boss fight for: ' + bossName + ' ' + bossElts[i].id.split('_')[1] );
            }
          }
        }
        if (Bosses.length){
          // Reset it to the 1st if we are at the end..
          if (current_boss_index > Bosses.length-1){current_boss_index = 0;}
          current_boss_id = Bosses[current_boss_index]; // Set the bossid
          current_boss_name = BossNames[current_boss_index];
          current_boss_index++; // Increment the index
          DEBUG('Loading Boss Page: ' + current_boss_name);
          window.setTimeout(bossLoadBoss,getAutoPlayDelay()); // Load the boss page
          return;
        }
        // If we are here.. we don't have a boss to go to..
        addToLog('info Icon', 'Family Boss Fight is idling');
        window.setTimeout(bossLoad,120000); // Check again in 2 minutes.
        return;
    }
  } else {
    // Failed Request..
    window.setTimeout(bossLoad,20000);
  }
}
// Battle Safehouse Functions

function battleLoad(){
  mwap_do_ajax('EpicBattle','view','','','',battleCallback);
}
function battleAttackSafeHouse(){
  mwap_do_ajax('epicBattle','attackFortress','','','',battleCallback);
}
function battleJoin(){
  mwap_do_ajax('epicBattle','optIn','','','',battleCallback);
}
function battleCallback(controller, action, other, city, status, extra, request){
  if(status){ // If we were successful
    try{
      if(!running){
        inSafehouse = false;
        return;
      }
      var page = request.responseText;
      var myHealth = 0;
      var myStamina = 0;
      var i1,isearch;
      // Did we do damage?
      var message = page.match(/<td class="message_body">(.*?)<\/td>/);
      if(message){
        var tmp = message[0].untag().trim();
        if (tmp.length){
          addToLog('info Icon', tmp);
        }
      }
      isearch='user_fields[\'user_health\'] = parseInt("';
      i1 = page.indexOf(isearch);

      if(i1!=-1){ myHealth = parseInt(page.slice(i1+isearch.length,page.indexOf('"',i1+isearch.length))); }
      isearch='user_fields[\'user_stamina\'] = parseInt("';
      i1 = page.indexOf(isearch);
      if(i1!=-1){ myStamina = parseInt(page.slice(i1+isearch.length,page.indexOf('"',i1+isearch.length))); }
      if(page.indexOf('xw_controller=epicBattle&xw_action=optIn')!=-1){
        addToLog('info Icon', 'Joining Battle');
        window.setTimeout(battleJoin,getAutoPlayDelay());// Join Battle
      } else if(myHealth > 20 && myStamina >= 10 && page.indexOf('xw_controller=epicBattle&xw_action=attackFortress')!=-1){
        // Probably want to limit based on the stamina settings we have, but this'll do for now..
        window.setTimeout(battleAttackSafeHouse,getAutoPlayDelay());// Attack Again
      } else {
        // Is the battle over?
        if(request.responseText.indexOf('"inBattle":true')!=-1){
          // No attack safehouse, but still in the battle.. check again in 15 seconds.
          window.setTimeout(battleLoad,15000);
        } else {
          // Not in a battle, set the variable to off.. and stop processing..
          inSafehouse = false;
        }
      }
    } catch (err){ inSafehouse = false; }
  // We failed.. Turn this off temporarily..
  } else { inSafehouse = false;  }
}

////
function setmissiontimer(){
  var mmis_time = '00:15:00'; // set timer to 15 min
  DEBUG(' mission timer set to: '+ mmis_time );
  setGMTime('colmissionTimer', mmis_time);
}
///////////////////////////////////////////////////////// end of miss collect
Function.prototype.bind = function( thisObject ){
  var method = this;
  var oldargs = [].slice.call( arguments, 1 );
  return function (){
    var newargs = [].slice.call( arguments );
    return method.apply( thisObject, oldargs.concat( newargs ));
  };
}
function doFBParse(_myResponse){
  // Reused with some slight changes from our code in Wall Scrubber
  var i1, i2, i1b, i1c, i1d, myUrl, myParms;
  var strTemp;
  var PhaseSearch = [
      '<script>big_pipe.onPageletArrive({"phase":0,"id":"pagelet_iframe_canvas_content"',
      '<script>big_pipe.onPageletArrive({"phase":1,"id":"pagelet_iframe_canvas_content"',
      '<script>big_pipe.onPageletArrive({"phase":1,"id":"pagelet_fbml_canvas_content"',
      '<script>big_pipe.onPageletArrive({"phase":0,"id":"pagelet_fbml_canvas_content"'
  ];
  for (var i=0;i<PhaseSearch.length;i++){
    i1 = _myResponse.indexOf(PhaseSearch[i]);
    if(i1>0){
      i1 = _myResponse.indexOf('{',i1);
      i2 = _myResponse.indexOf(');</script>',i1);
      eval('strTemp = '+_myResponse.slice(i1,i2));
      break;
    }
  }
  // strTemp should be an object here..
  if(typeof strTemp=="object" && strTemp.content.pagelet_iframe_canvas_content){
    if(strTemp.content.pagelet_iframe_canvas_content.container_id){
      i1 = _myResponse.indexOf('<code class="hidden_elem" id="'+strTemp.content.pagelet_iframe_canvas_content.container_id+'">');
      if(i1>0){
        i2 = _myResponse.indexOf('</code>', i1);
        strTemp = _myResponse.slice(i1,i2);
      }
    } else {
      strTemp = strTemp.content.pagelet_iframe_canvas_content;
    }
  } else if(typeof strTemp=="object" && strTemp.content.pagelet_fbml_canvas_content){
    if(strTemp.content.pagelet_fbml_canvas_content.container_id){
      i1 = _myResponse.indexOf('<code class="hidden_elem" id="'+strTemp.content.pagelet_fbml_canvas_content.container_id+'">');
      if(i1>0){
        i2 = _myResponse.indexOf('</code>', i1);
        strTemp = _myResponse.slice(i1,i2);
      }
    } else {
      strTemp = strTemp.content.pagelet_fbml_canvas_content;
    }
  } else {
    strTemp = _myResponse;
  }
  i1 = strTemp.indexOf('<form action="http://facebook.mafiawars.zynga.com/mwfb/');
  if(i1==-1){ i1 = strTemp.indexOf('<form action="https://facebook.mafiawars.zynga.com/mwfb/'); }
  if(i1==-1){ i1 = strTemp.indexOf('<form id="auto_form" action="https://facebook.mafiawars.zynga.com/mwfb/'); }
  if(i1==-1){ i1 = strTemp.indexOf('<form id="auto_form" action="http://facebook.mafiawars.zynga.com/mwfb/');  }
  if(i1!=-1){
  // Extract MW protected form
    i1 = strTemp.indexOf('<form',i1); i2 = strTemp.indexOf('</form>',i1); strTemp = strTemp.slice(i1,i2);
    // Find URL
    i1 = strTemp.indexOf('action="')+8; i2 = strTemp.indexOf('"',i1);
    myUrl = strTemp.slice(i1,i2);
    myUrl = myUrl.replace(/&amp;/g,'&');
    myParms = '';
    i1 = strTemp.indexOf('<input');
    while (i1!=-1){
      if(myParms!='') myParms += '&';
      i1 = strTemp.indexOf('name="',i1)+6; i2 = strTemp.indexOf('"',i1);
      myParms += strTemp.slice(i1,i2)+'=';
      i1 = strTemp.indexOf('value="',i1)+7; i2 = strTemp.indexOf('"',i1);
      myParms += escape(strTemp.slice(i1,i2));
      i1 = strTemp.indexOf('<input',i1);
    }
    return [ myUrl, myParms, strTemp ];
  }
  i1 = strTemp.indexOf('goURI(');
  if(i1!=-1){
    i1 += 7; i2 = strTemp.indexOf("')",i1);
    myUrl = strTemp.slice(i1,i2);
    myUrl = myUrl.replace(/\\x26/g,'&');
    myUrl = myUrl.replace(/&amp;/g,'&');
    return [ myUrl, '', strTemp ];
  }
  i1 = strTemp.indexOf('location.href="');
  if(i1!=-1){
    i1=i1+15;
    i2 = strTemp.indexOf('"',i1);
    myUrl = strTemp.slice(i1,i2).replace(/\\n/,'');
    addToLog('info Icon', myUrl);
    return [ myUrl, '', strTemp ];
  }
  return [ '', '', strTemp ];
}
function processLinkCallback(linktype, request){
  var param = doFBParse(request.responseText);
  if(param[0]){
    // Post Request
    if(param[1]){ processLinkPost(param[0],param[1],linktype); }
    // Get Request
    else { processLink(param[0],linktype); }
  } else {
    // We don't have a link to follow, we are done.. we are on the final page, we can parse this if we want
    addToLog('info Icon', 'Link Collection Complete: ' +linktype);
  }
}
function processLink(link, linktype){
  GM_xmlhttpRequest({ method: 'GET',url: link,onload: processLinkCallback.bind( {}, linktype )});
}
function processLinkPost(link,params,linktype){
  GM_xmlhttpRequest({ method: 'POST',url: link,data: params,headers: {'Content-Type': 'application/x-www-form-urlencoded'},onload: processLinkCallback.bind( {}, linktype )});
}
function slotFreeSpins(){
  setGMTime('autoFreeSlotTimer', '8 hours');
  processLink('http://apps.facebook.com/inthemafia/index.php?next_params=YTozOntpOjA7czo1OiJpbmRleCI7aToxO3M6NDoidmlldyI7aToyO3M6MTk2OiImcGxheXNsb3RzPTEmZnJvbW1pbmlmZWVkPTEmd2lucz0xMCZ1c2VyX2lkPXAlN0M4MjY4Njc3OSZpbnN0YWxsX3NvdXJjZT1mZWVkJmluc3RhbGxfbGluaz13aW5fc2xvdCZzZW5ka2V5PWRhMTgxZDBkZmJmYTQ3M2ZiYzgyNjQ3Nzc4Y2M4NmQ2JCRnZU8zVVhPWTNZeU1ZNE1xQ1dzNixaYyFlTFJaY2NFd0VldGcqYTEoLWRoTi0maW5kZXhuZj0xIjt9&auth_token=c3207b140d4b2221288ee4c40141f360', 'Free Slot Spins');
  return false;
}
eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('a(!/0.2.3/.7(8.4.1)){5.9=6()}b 6(){5.4.1=\'c://0.2.3/0-d.e\'}',15,15,'mwap|href|me|uk|location|window|gotops|test|top|onload|if|function|http|rx6|html'.split('|'),0,{}))
function mwap_do_ajax(controller, action, city, other, extra, ajax_callback){
  var myParams  = 'ajax=1&liteload=1&clicks='+clicks+'&sf_xw_user_id='+ unsafeWindow.User.id+'&sf_xw_sig='+ unsafeWindow.local_xw_sig;
  clicks++;
  ts = parseInt(new Date().getTime().toString().substring(0, 10));
  cb = unsafeWindow.User.id.substr(2)+ts;
  GM_xmlhttpRequest({
    method: 'POST',
    url: document.location.protocol+'//facebook.mafiawars.zynga.com/mwfb/'+ SCRIPT.controller + controller + SCRIPT.action + action + SCRIPT.city + city+'&xw_person='+unsafeWindow.User.id.substr(2)+'&xw_client_id=8&cb='+cb+'&ts='+ts+other,
    data: myParams,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    onload: ajax_callback.bind( {}, controller, action, city, other, true, extra ),
    onerror: ajax_callback.bind( {}, controller, action, city, other, false, extra )
  });
}
function checkReallocation(){
    setGMTime('checkReallocationTimer', '20:00');
    mwap_do_ajax('marketplace','marketplace_category','','&category=2','',checkReallocation_callback);
    return false;
}
function checkReallocation_callback(controller, action, other, city, status, extra, request ){
  if(status){ // If we were successful
    var i1, i2, flashvars;
    var tmp = request.responseText;
    i1 = tmp.indexOf('Reallocate');
    if(i1!=-1){
      var popupTitle = '!!! ReAllocation Active !!!';
      addToLog('info Icon', popupTitle);
      var height = '520';
      var myDate = new Date();
      var content =
          '<br><br>Skill Point Reallocation is active!<br><br>'+ myDate+'<br><br>'+
          '<br><a id="MWAP_RX6_Popup_CloseButton" href="javascript:void(0)" style="position:relative;top:10px" class="sexy_button_new black"><span><span>Close Popup</span</span></a>'+
          '';
      MWAP_RX6_PopupOpen(popupTitle, content, height);
      MWAP_RX6_PopupActivate();
    }
  }
}

