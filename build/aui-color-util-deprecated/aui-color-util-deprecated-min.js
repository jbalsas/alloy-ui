YUI.add("aui-color-util-deprecated",function(e,t){var n=e.Lang,r=n.isArray,i=n.isObject,s=n.isString,o=function(e){return e&&(e.slice(-3)=="deg"||e.slice(-1)=="\u00b0")},u=function(e){return e&&e.slice(-1)=="%"},a={hs:1,rg:1},f=Math,l=f.max,c=f.min,h=/\s*,\s*/,p=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,d=/^(?=[\da-f]$)/,v=/^\s+|\s+$/g,m="",g={constrainTo:function(e,t,n,r){var i=this;if(e<t||e>n)e=r;return e},getRGB:e.cached(function(e){if(!e||!!((e=String(e)).indexOf("-")+1))return new g.RGB("error");if(e=="none")return new g.RGB;!a.hasOwnProperty(e.toLowerCase().substring(0,2))&&e.charAt(0)!="#"&&(e=g._toHex(e));var t,n,r,i,s,f=e.match(p),l;return f?(f[2]&&(r=parseInt(f[2].substring(5),16),n=parseInt(f[2].substring(3,5),16),t=parseInt(f[2].substring(1,3),16)),f[3]&&(r=parseInt((s=f[3].charAt(3))+s,16),n=parseInt((s=f[3].charAt(2))+s,16),t=parseInt((s=f[3].charAt(1))+s,16)),f[4]&&(l=f[4].split(h),t=parseFloat(l[0]),u(l[0])&&(t*=2.55),n=parseFloat(l[1]),u(l[1])&&(n*=2.55),r=parseFloat(l[2]),u(l[2])&&(r*=2.55),f[1].toLowerCase().slice(0,4)=="rgba"&&(i=parseFloat(l[3])),u(l[3])&&(i/=100)),f[5]?(l=f[5].split(h),t=parseFloat(l[0]),u(l[0])&&(t*=2.55),n=parseFloat(l[1]),u(l[1])&&(n*=2.55),r=parseFloat(l[2]),u(l[2])&&(r*=2.55),o(l[0])&&(t/=360),f[1].toLowerCase().slice(0,4)=="hsba"&&(i=parseFloat(l[3])),u(l[3])&&(i/=100),g.hsb2rgb(t,n,r,i)):f[6]?(l=f[6].split(h),t=parseFloat(l[0]),u(l[0])&&(t*=2.55),n=parseFloat(l[1]),u(l[1])&&(n*=2.55),r=parseFloat(l[2]),u(l[2])&&(r*=2.55),o(l[0])&&(t/=360),f[1].toLowerCase().slice(0,4)=="hsla"&&(i=parseFloat(l[3])),u(l[3])&&(i/=100),g.hsb2rgb(t,n,r,i)):(f=new g.RGB(t,n,r,i),f)):new g.RGB("error")}),hex2rgb:function(e){var t=this;return e=String(e).split("#"),e.unshift("#"),t.getRGB(e.join(""))},hsb2rgb:function(){var e=this,t=e._getColorArgs("hsbo",arguments);return t[2]/=2,e.hsl2rgb.apply(e,t)},hsv2rgb:function(){var e=this,t=e._getColorArgs("hsv",arguments),n=e.constrainTo(t[0],0,1,0),r=e.constrainTo(t[1],0,1,0),i=e.constrainTo(t[2],0,1,0),s,o,u,a=Math.floor(n*6),f=n*6-a,l=i*(1-r),c=i*(1-f*r),h=i*(1-(1-f)*r);switch(a%6){case 0:s=i,o=h,u=l;break;case 1:s=c,o=i,u=l;break;case 2:s=l,o=i,u=h;break;case 3:s=l,o=c,u=i;break;case 4:s=h,o=l,u=i;break;case 5:s=i,o=l,u=c}return new g.RGB(s*255,o*255,u*255)},hsl2rgb:function(){var e=this,t=e._getColorArgs("hslo",arguments),n=t[0],r=Math.max(Math.min(t[1],1),0),i=Math.max(Math.min(t[2],1),0),s=t[3],o,u,a;if(r==0)o=u=a=i;else{var f=e._hue2rgb,l=i<.5?i*(1+r):i+r-i*r,c=2*i-l;o=f(c,l,n+1/3),u=f(c,l,n),a=f(c,l,n-1/3)}return new g.RGB(o*255,u*255,a*255,s)},rgb2hex:function(e,t,n){var r=this,i=r._getColorArgs("rgb",arguments),s=i[0],o=i[1],u=i[2];return(16777216|u|o<<8|s<<16).toString(16).slice(1)},rgb2hsb:function(){var e=this,t=e.rgb2hsv.apply(e,arguments);return t.b=t.v,t},rgb2hsl:function(){var e=this,t=e._getColorArgs("rgb",arguments),n=t[0]/255,r=t[1]/255,i=t[2]/255,s=Math.max(n,r,i),o=Math.min(n,r,i),u,a,f=(s+o)/2;if(s==o)u=a=0;else{var l=s-o;a=f>.5?l/(2-s-o):l/(s+o);switch(s){case n:u=(r-i)/l+(r<i?6:0);break;case r:u=(i-n)/l+2;break;case i:u=(n-r)/l+4}u/=6}return{h:u,s:a,l:f,toString:g._hsltoString}},rgb2hsv:function(){var e=this,t=e._getColorArgs("rgb",arguments),n=t[0]/255,r=t[1]/255,i=t[2]/255,s=Math.max(n,r,i),o=Math.min(n,r,i),u,a,f=s,l=s-o;a=s==0?0:l/s;if(s==o)u=0;else{switch(s){case n:u=(r-i)/l+(r<i?6:0);break;case r:u=(i-n)/l+2;break;case i:u=(n-r)/l+4}u/=6}return{h:u,s:a,v:f,toString:g._hsbtoString}},_getColorArgs:function(t,n){var s=this,o=[],u=n[0];if(r(u)&&u.length)o=u;else if(i(u)){var a=t.split(""),f=a.length;for(var l=0;l<f;l++)o[l]=u[a[l]]}else o=e.Array(n);return o},_hsbtoString:function(){var e=this;return["hs","v"in e?"v":"b","(",e.h,e.s,e.b,")"].join("")},_hsltoString:function(){var e=this;return["hsl(",e.h,e.s,e.l,")"].join("")},_hue2rgb:function(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+(t-e)*6*n:n<.5?t:n<2/3?e+(t-e)*(2/3-n)*6:e},_toHex:function(t){var n=this;if(e.UA.ie)n._toHex=e.cached(function(t){var n,r=e.config.win;try{var i=new r.ActiveXObject("htmlfile");i.write("<body>"),i.close(),n=i.body}catch(s){n=r.createPopup().document.body}var o=n.createTextRange();try{n.style.color=String(t).replace(v,m);var u=o.queryCommandValue("ForeColor");return u=(u&255)<<16|u&65280|(u&16711680)>>>16,"#"+("000000"+u.toString(16)).slice(-6)}catch(s){return"none"}});else{var r=e.config.doc.createElement("i");r.title="AlloyUI Color Picker",r.style.display="none",e.getBody().append(r),n._toHex=e.cached(function(t){return r.style.color=t,e.config.doc.defaultView.getComputedStyle(r,m).getPropertyValue("color")})}return n._toHex(t)}};g.RGB=function(e,t,n,r){var i=this;e=="error"?i.error=1:arguments.length&&(i.r=~~e,i.g=~~t,i.b=~~n,i.hex="#"+g.rgb2hex(i),isFinite(parseFloat(r))&&(i.o=r))},g.RGB.prototype={r:-1,g:-1,b:-1,hex:"none",toString:function(){var e=this;return e.hex}},e.ColorUtil=g},"3.0.3-deprecated.12",{requires:[]});
