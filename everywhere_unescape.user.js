// ==UserScript==
// @name           Unescape Everywhere!
// @namespace      http://beeswax.noneofyours.inc
// @description    Resolves shortlinks and removes tracking args
// @downloadURL    
// @updateURL      
// @version        1.8.80
// @include        *://*.*
// @exclude        *://bitly.com/*
// @exclude        *://*.duckduckgo.com/*
// @exclude        *://duckduckgo.com/*
// @exclude        *://*.twitter.com/*
// @exclude        *://twitter.com/*
// @exclude        *://*.facebook.com/*
// @exclude        *://facebook.com/*
// @exclude        *://accounts.google.com/*
// @exclude        *://clients6.google.com/*
// @exclude        *://docs.google.com/file/*
// @exclude        *://docs.google.com/document/*
// @exclude        *://docs.google.com/spreadsheets/*
// @exclude        *://docs.google.com/spreadsheet/*
// @exclude        *://*.docs.google.com/spreadsheet/*
// @exclude        *://docs.google.com/presentation/*
// @exclude        *://docs.google.com/picker*
// @exclude        *://drive.google.com/*
// @exclude        *://mail.google.com/*
// @exclude        *://plus.googleapis.com/u/0/_/widget/render/comments?*
// @exclude        *://plus.google.com/*
// @exclude        *://talkgadget.google.com/*
// @exclude        *://www.google.com/maps/*
// ==/UserScript==
console.log("Unescaping "+ document.location.href)
var stripped=0
var resolved=0

var GetDomain = function(Url){
    var b = document.createElement('a');
    b.href = Url;
    return b.hostname;
    }

var fragCheck = function(fragment) {
    excl=['fb_','utm_','action_','WT.','hc_location','hpw','notif_','pf_rd_','bicm','refer']
    excl_exact=['hp','fblinkge0']
    excl_key=['c','cx','cof','CST','wpisrc','ref','rref','eid','smid','mod','xrs','nclick_check','keywords','sr','_r','BAN',
          'sc','cc','ei','directed_target_id','sa','igref','trk','source','product','src','soc_src','dom', 'google_editors_picks',
          'emc','aref','medium','bcode','n_m','lloc','fref','usg','sntz','contentCollection','module','intcmp','iref',
          'viewer_id','region','pgtype','campaign','_php','_type','hc_location','stream_ref','linkCode', 'socfid', 'socpid',
          'wprss','camp','creative', 'source_newsfeed_story_type','pldnSite','spref','wpsrc','version','mag','click','kw','link']
    for (i in excl) {
        if (fragment.substr(0,excl[i].length)==excl[i]){
            return 'skip'
            }
        }
    for (i in excl_key) {
        eq=fragment.search('=');
        if (eq>-1) {
            if (fragment.substr(0,eq)==excl_key[i]){
                return 'skip'
                }
            }
        }
    for (i in excl_exact) {
        if (fragment==excl_exact[i]){
            return 'skip'
            }
        }
    return ''
    }

// Resolve links from known URL shortening services
var Unshorten=function(entity,attrib,last){
    a=entity.getAttribute(attrib)
    if ((a) && a!=last){
        d=GetDomain(a);
        if (['1.usa.gov', '4ms.me', '4sq.com', '8nn.tv', 'ab21.org', 'abcn.ws',
             'andp.lc', 'alln.cc', 'alln.tv', 'alj.am', 'ampr.gs', 'amzn.to',
             'atfp.co', 'avc.lu', 'b.globe.com', 'bbc.in', 'bitly.com', 'bit.ly',
             'buff.ly', 'buswk.co', 'bzfd.it', 'cart.mn', 'cbsn.ws', 'celeb.bz',
             'conta.cc', 'cnb.cx', 'cnn.it', 'dalaila.ma', 'dmreg.co', 'drudge.tw',
             'eonefil.ms', 'eonli.ne', 'es.pn', 'fox.tv', 'foxs.pt', 'gat.es',
             'gaw.kr', 'go.fox13now.com', 'go.pix11.com', 'go.spin.com', 'gtg.lu',
             'huff.to', 'ibm.co', 'ift.tt', 'imdb.to', 'isdai.ly', 'j.mp', 'kck.st',
             'kiro.tv', 'lat.ms', 'linkd.in', 'mapq.st', 'mojo.ly', 'mrkt.ms',
             'n.pr', 'natl.re', 'nbcnews.to', 'njour.nl', 'nswk.ly', 'nwsdy.li',
             'nyob.co', 'nydn.us', 'nyti.ms', 'nyp.st', 'oh.vh1.com', 'on-msn.com',
             'on.cc.com', 'on.cnn.com', 'on.kcci.com', 'on.kcci.tv', 'on.mash.to',
             'on.mktw.net', 'on.recode.net', 'on.thestar.com', 'on.wsj.com',
             'onion.com', 'pdora.co', 'pep.si', 'politi.co', 'propub.ca', 'read.bi',
             'rickey.io', 'rol.st', 'sacb.ee', 'sdrv.ms', 'slate.me', 'smrt.io',
             'snlg.ht', 'squid.us', 'strw.rs', 'tcrn.ch', 'tgt.biz', 'theatln.tc',
             'thebea.st', 'thesoup.tv', 'thetim.es', 'thkpr.gs', 'ti.me', 'tnw.co',
             'to.pbs.org', 'u.pw', 'upw.to', 'usat.ly', 'vogue.cm', 'vrge.co',
             'vult.re', 'wapo.st', 'wbur.fm', 'wny.cc', 'yhoo.it'].indexOf(d) !==-1){
            resolved++
            BitLong(entity,attrib)
            }
        else if (['goo.gl'].indexOf(d) !==-1){
            resolved++
            GooLong(entity,attrib)
            }
        else if (['tiny.cc'].indexOf(d) !==-1){
            resolved++
            TinyLong(entity,attrib)
            }
        else if (['scholar.google.com','google.com','www.google.com','news.google.com','www.godlikeproductions.com','clicks.parsely.com','parsely.com','www.deviantart.com','redirect.disqus.com','refer.ccbill.com'].indexOf(d) !==-1){
            resolved++
            UrlUnescape(entity,attrib)
            }
        // This isn't about privacy, but since this is a personal script
        // and this tweak fits very well right here, I'm adding it thusly
        else if (d=='open.spotify.com') {
            resolved++
            entity.setAttribute(attrib,a.replace('open.spotify.com','play.spotify.com'))
            StripArgs(entity,attrib)
            }
        else if ((d=='amazon.com')||(d=='www.amazon.com')) {
            resolved++
            entity.setAttribute(attrib,a.replace(d,'smile.amazon.com'))
            StripArgs(entity,attrib)
            }
        else {
            StripArgs(entity,attrib)
            }
        }
    else {
        StripArgs(entity,attrib)
        }
    }

var UrlUnescape = function(entity,attrib){
    a=entity.getAttribute(attrib)
    last=a
    if (a) {
        if ((a.indexOf('?') > -1) && (a.indexOf('www.google.com/imgres') == -1)) {
            resolved++
            b=a.substr(a.indexOf('?'))
            if (b.indexOf('http') > 0) {
                c=b.substr(b.indexOf('http'))
                end=c.indexOf('&')
                if (end > -1) {
                    entity.setAttribute(attrib,unescape(c.substr(0,end)))
                    }
                else {
                    entity.setAttribute(attrib,unescape(c))
                    }
                }
            }
        }
    Unshorten(entity,attrib,last)
    }

// Remove tracking-related (or unknown?) arguments from the end of resolved urls
var StripArgs=function(entity,attrib){
    a=entity.getAttribute(attrib)
    last=a
    if (a) {
        args=''
        discarded=''
        off=a.indexOf('?')
        if (off >= 0) {
            var fragments;
            fragments=a.substr(off+1).split('&')
            for (var fi=0; fi < fragments.length; fi++) {
                fragment=unescape(fragments[fi])
                if (!fragCheck(fragment)){
                    if (args.length > 0) {
                      args=args+'&'+fragments[fi]
                        }
                    else {
                      args=args+fragments[fi]
                        }
                    }
                else {
                    discarded=discarded+'&'+fragments[fi]
                    }
                }
            if (discarded.length>0) {
                stripped++
                }
            if (args.length>0) {
                b=a.substr(0,off)+'?'+args
                entity.setAttribute(attrib,b)
                }
            else {
                b=a.substr(0,off)
                entity.setAttribute(attrib,b)
                }
            }
        }
    }

var FBUnescape = function(target){
    if (target){
        if (target.relatedNode){
            doTheBlur(target.relatedNode)

            allLinks = target.relatedNode.getElementsByTagName('a');
            for(var i=0; i < allLinks.length; i++) {
                if (allLinks[i].hasAttribute('fbu-proc')){
                    continue
                    }
                else {

                    a=allLinks[i].getAttribute('href')
                    if (a) {
                        Unshorten(allLinks[i],'href','');
                        allLinks[i].setAttribute('fbu-href-old',allLinks[i].getAttribute('href'))
                        }

                    a=allLinks[i].getAttribute('data-href')
                    if (a) {
                        Unshorten(allLinks[i],'data-href','')
                        allLinks[i].setAttribute('fbu-data-href-old',allLinks[i].getAttribute('href'))
                        }
                    }
                    allLinks[i].setAttribute('fbu-proc','true')
                }

                // These elements don't seem to perform any useful purpose
                // and may be used to track users.
                dd=0;
                bb=['data-track','data-beacon','data-ctorig','data-cturl',
                    'data-beacon-action','data-cb-ad-id','data-cb-dfp-id','ping',
                    'data-parsely-site', 'data-ga-target','data-ad-slot','data-ad-client',
                    'track','track_load','track_mousedown','data-async-context','data-href',
                    'data-hveid','data-jiis', 'data-jibp','jsaction','data-ved']
                for (var jj=0;jj<bb.length;jj++) {
                    aa=target.relatedNode.querySelectorAll('['+bb[jj]+']')
                    for (var ii=0;ii<aa.length;ii++) {
                        if (aa[ii] && aa[ii].hasAttribute(bb[jj])) {
                            dd=dd+1
                            aa[ii].removeAttribute(bb[jj])
                            if (aa[ii].getAttribute('fbu-attrm')){oldrm=aa[ii].getAttribute('fbu-attrm');aa[ii].setAttribute('fbu-attrm',oldrm+','+bb[jj])}
                            else {aa[ii].setAttribute('fbu-attrm',bb[jj])}
                            }
                        }
                    }
                if (dd>0) { console.log('removed '+dd+' data-* attributes')}
            }

            //Youtube-specific to disable link redirects
            yts=0
            a=target.relatedNode.querySelectorAll(".yt-uix-redirect-link")
            for (i in a) {
                if (a[i].getAttribute) {
                    yts++
                    a[i].setAttribute('class',a[i].getAttribute('class').replace('yt-uix-redirect-link',''))
                }
            }
            grs=0
            a=target.relatedNode.querySelectorAll(".gsc-table-cell-snippet-close")
            for (i in a) {
                if (a[i].getAttribute) {
                    if (a[i].onclick) {
                        grs++
                        a[i].removeAttribute('onclick')
                    }
                }
            }

            a=target.relatedNode.querySelectorAll('a')
            for (i in a) {
                if (a[i].getAttribute) {
                    if (a[i].onmousedown) {
                        grs++
                        a[i].removeAttribute('onmousedown')
                    }
                }
            }

            if (yts>0) {
                console.log('Removed redirecting link class from ' + yts + ' links.')
            }
        undoTheBlur(target.relatedNode)
        }
    }

// Resolve bit.ly links, then pass the link back to the unshortener in case there are multiple layers
var BitLong = function(entity,attrib){
    a=entity.getAttribute(attrib)
    last=a
    access_token="INSERT_YOUR_BITLY_API_KEY_HERE"
    if (a) {
        hash=a.replace(/.*\//,"")
        var ReqURL="https://api-ssl.bitly.com/v3/expand?hash="+hash+"&access_token="+access_token
        GM_xmlhttpRequest ( {
            method: 'GET',
            url:    ReqURL,
            referer: 'https://nonayodamn.biz/ness',
            userAgent: 'luminiferous æther',
            onload: function (responseDetails) {
                        b=null
                        if(responseDetails){
                            jsonData=eval("("+responseDetails.responseText+")");
                            b=jsonData.data.expand[0].long_url
                            }
                        if(b){
                            entity.setAttribute(attrib,b)
                            }
                    Unshorten(entity,attrib,last)
                }
            } );
        }
    }

// Resolve goo.gl links, then pass the link back to the unshortener in case there are multiple layers
var GooLong = function(entity,attrib){
    a=entity.getAttribute(attrib)
    last=a
    if (a) {
        var ReqURL="https://www.googleapis.com/urlshortener/v1/url?shortUrl="+a
        GM_xmlhttpRequest ( {
            method: 'GET',
            url:    ReqURL,
            referer: 'https://nonayodamn.biz/ness',
            userAgent: 'luminiferous æther',
            onload: function (responseDetails) {
                        if(responseDetails){
                            jsonData=eval("("+responseDetails.responseText+")");
                            a=jsonData.longUrl
                            }
                        if(a){
                            entity.setAttribute(attrib,a)
                            }
                    Unshorten(entity,attrib,last)
                }
            } );
        }
    }

var TinyLong = function(entity,attrib){
    a=entity.getAttribute(attrib)
    last=a
    login="INSERT_YOUR_TINYCC_LOGIN_HERE"
    apiKey="INSERT_YOUR_TINYCC_API_KEY_HERE"
    if (a) {
        var ReqURL="http://tiny.cc/?c=rest_api&login="+login+"&apiKey="+apiKey+"&version=2.0.3&format=json&m=expand&shortUrl="+a
        var jsonHttp=null;
        GM_xmlhttpRequest ( {
            method: 'GET',
            url:    ReqURL,
            referer: 'https://nonayodamn.biz/ness',
            userAgent: 'luminiferous æther',
            onload: function (responseDetails) {
                        if(responseDetails){
                            jsonData=eval("("+responseDetails.responseText+")");
                            a=jsonData.results.longUrl
                            }
                        if(a){
                            entity.setAttribute(attrib,a)
                            }
                    Unshorten(entity,attrib,last)
                }
            } );
        }
    }

var doTheBlur=function(target) {
    if (target) {
        if (target.relatedNode) {
            if (target.relatedNode.style) {
                target.relatedNode.style.setProperty("-webkit-filter","blur(5px)")
                target.relatedNode.style.setProperty("-moz-filter","blur(5px)")
                target.relatedNode.style.setProperty("-o-filter","blur(5px)")
                target.relatedNode.style.setProperty("-ms-filter","blur(5px)")
                target.relatedNode.style.setProperty("filter","blur(5px)")
                }
            }
        }
    }

var undoTheBlur=function(target){
    if (target) {
        if (target.relatedNode) {
            if (target.relatedNode.style) {
                target.relatedNode.style.removeProperty("-webkit-filter")
                target.relatedNode.style.removeProperty("-moz-filter")
                target.relatedNode.style.removeProperty("-o-filter")
                target.relatedNode.style.removeProperty("-ms-filter")
                target.relatedNode.style.removeProperty("filter")
                }
            }
        }
    }

// Make the document look like it was an event. This is done so that it's simpler to only apply
// the FBUnescape() function only to new items.
document.relatedNode=document
FBUnescape(document)

document.addEventListener("DOMNodeInserted", FBUnescape, false);

