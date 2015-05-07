/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-05-06/ */define(["dojo/_base/array"],function(a){"use strict";function b(a){var b,c,d,e,f,g,h,i,j="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",k=0,l=0,m="",n=[];if(!a)return a;do b=a.charCodeAt(k++),c=a.charCodeAt(k++),d=a.charCodeAt(k++),i=b<<16|c<<8|d,e=i>>18&63,f=i>>12&63,g=i>>6&63,h=63&i,n[l++]=j.charAt(e)+j.charAt(f)+j.charAt(g)+j.charAt(h);while(k<a.length);m=n.join("");var o=a.length%3;return(o?m.slice(0,o-3):m)+"===".slice(o||3)}function c(a,b){b=b||"";for(var c=1024,d=atob(a),e=d.length,f=Math.ceil(e/c),g=new Array(f),h=0;f>h;++h){for(var i=h*c,j=Math.min(i+c,e),k=new Array(j-i),l=0,m=i;j>m;++l,++m)k[l]=d[m].charCodeAt(0);g[h]=new Uint8Array(k)}return new Blob(g,{type:b})}function d(b){var c=b.series,d=[],e=[];return a.forEach(c[0].data,function(a){e.push(a.category)}),d.push("Suitability,"+e.join(",")),a.forEach(c,function(b){e=[],e.push(b.name),a.forEach(b.data,function(a){e.push(Math.abs(a.y.toFixed(2)))}),d.push(e.join(","))}),d}function e(b){var c,d=b.series,e=[],f=[];return c=b.xAxis[0].categories,a.forEach(c,function(a){f.push(a)}),e.push("Type,"+f.join(",")),a.forEach(d,function(b){f=[],f.push(b.name),a.forEach(b.data,function(a){f.push(a.y)}),e.push(f.join(","))}),e}function f(b){var c,d=["Unsuitable"],e=["Suitable"],f=b.series,g=0,h=0,i=0,j=0,k=0,l=0,m=[];return m.push("Suitability,Total,HP/HPT,HPK,APL"),c=f[0],a.forEach(c.data,function(a){"Suitable"===a.name?e.push(a.y):d.push(a.y)}),c=f[1],a.forEach(c.data,function(a){switch(a.name){case"HP/HPT":"donut-Suitable"===a.parentId?j=a.y||0:g=a.y||0;break;case"APL":"donut-Suitable"===a.parentId?l=a.y||0:i=a.y||0;break;case"HPK":"donut-Suitable"===a.parentId?k=a.y||0:h=a.y||0}}),e=e.concat([j,k,l]),d=d.concat([g,h,i]),m.push(e.join(",")),m.push(d.join(",")),m}function g(){var b,c=document.getElementById("title").innerHTML,d=$("#suitabilityAnalysis_content tr"),e=[];return e.push("Suitability Statistics"),e.push(c),e.push("Parameter, Value"),a.forEach(d,function(a){b=a.cells[1].innerHTML.replace(",",""),e.push(a.cells[0].innerHTML+","+b)}),e}var h={exportCSV:function(a){var d,e="data:application/vnd.ms-excel;base64,",f="text/csv;charset=utf-8",g="data.csv",h=document.createElement("a");saveAs&&new Blob?(d=c(b(a),f),saveAs(d,g)):""===h.download?(h.href=e+b(a),h.target="_blank",h.download=g,h.click()):window.open(e+b(a))},exportSuitabilityByLegalClass:f,exportSuitabilityStatistics:g,exportCompositionAnalysis:d,exportSimpleChartAnalysis:e};return h});