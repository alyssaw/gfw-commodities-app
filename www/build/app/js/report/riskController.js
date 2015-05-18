/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-05-18/ */define(["dojo/Deferred","dojo/promise/all","dojo/_base/lang","report/riskRequests","report/config"],function(a,b,c,d,e){var f,g=function(a,b,c){return c>a?3:b>=c?1:2},h=function(a,b){return function(c){var d=c.histograms[0].counts[1],e=o(d),h=e/f;return g(a,b,h)}},i=function(a){if(!a.histograms.length)return 1;var b=a.histograms[0].counts[1];return b>0?3:1},j=function(a,b,c){return{rasterFunction:"Remap",rasterFunctionArguments:{InputRanges:a,OutputValues:b,Raster:c},variableName:"Raster"}},k=function(a){return j([0,1,1,2014],[0,1],a)},l=function(a){return j([1,22],[1],a)},m=function(a,b,c){return{rasterFunction:"Arithmetic",rasterFunctionArguments:{Raster:a,Raster2:b,Operation:c}}},n=function(a){return{mosaicMethod:"esriMosaicLockRaster",lockRasterIds:[parseInt(a.replace("$",""))],ascending:!0,mosaicOperation:"MT_FIRST"}},o=function(a,b){var c=b*b,d=a*c,e=d/1e4;return e},p={histogram:d.computeHistogram,query:d.queryEsri},q={commodities:"http://gis-gfw.wri.org/arcgis/rest/services/GFW/analysis/ImageServer",fires:"http://gis-potico.wri.org/arcgis/rest/services/Fires/FIRMS_ASEAN/MapServer/0"},r=[{label:"Legality",categories:["legal"]},{label:"Deforestation",categories:["umd_loss","area_primary","umd_loss_primary","forma","forma_primary"],high:27,low:21},{label:"Carbon",categories:["loss_carbon","alerts_carbon","area_carbon"]},{label:"Peat",categories:["loss_peat_area","clearance","presence"],high:7,low:4},{label:"RSPO",categories:["rspo"]},{label:"Fires",categories:["fire"]}],s=[{category:"legal",service:q.commodities,request:p.histogram,ind_params:{renderingRule:j([0,2,2,3,3,5,5,6,6,7],[0,1,0,1,0],e.legalClass.rasterId),pixelSize:100},params:{renderingRule:n(e.protectedArea.rasterId),pixelSize:100},callbacks:{radius:i,concession:i},ind_callback:i},{category:"umd_loss",service:q.commodities,request:p.histogram,params:{renderingRule:k(e.treeCoverLoss.rasterId),pixelSize:100},callbacks:{radius:function(a){var b=o(a.histograms[0].counts[1],100),c=b/f;return g(.05,.28,c)},concession:function(a){var b=o(a.histograms[0].counts[1],100),c=b/f;return g(.05,.28,c)}}},{category:"area_primary",service:q.commodities,request:p.histogram,params:{renderingRule:j([1,3],[1],e.primaryForest.rasterId),pixelSize:100},callbacks:{radius:h(.12,.18),concession:h(.12,.18)}},{category:"umd_loss_primary",service:q.commodities,request:p.histogram,ind_params:{renderingRule:m(k(e.treeCoverLoss.rasterId),e.primaryForest.rasterId,3),pixelSize:100},params:{renderingRule:m(k(e.treeCoverLoss.rasterId),e.intactForest.rasterId,3),pixelSize:100},callbacks:{radius:i,concession:i}},{category:"forma",service:q.commodities,request:p.histogram,params:{renderingRule:l(e.clearanceAlerts.rasterId),pixelSize:500},callbacks:{radius:i,concession:i}},{category:"forma_primary",service:q.commodities,request:p.histogram,ind_params:{renderingRule:m(l(e.clearanceAlerts.rasterId),j([1,3],[1],e.primaryForest.rasterId),3),pixelSize:100},params:{renderingRule:m(l(e.clearanceAlerts.rasterId),e.intactForest.rasterId,3),pixelSize:100},callbacks:{radius:i,concession:i}},{category:"area_carbon",service:q.commodities,request:p.histogram,params:{renderingRule:j([0,100,100,369],[0,1],e.carbonStock.rasterId),pixelSize:500},callbacks:{radius:h(0,.2),concession:h(0,.2)}},{category:"loss_carbon",service:q.commodities,request:p.histogram,params:{renderingRule:m(k(e.treeCoverLoss.rasterId),j([0,20,20,100,100,369],[0,1,2],e.carbonStock.rasterId),3),pixelSize:500},callbacks:{radius:function(a){return a.histograms.length||1},concession:function(a){return a.histograms.length||1}}},{category:"alerts_carbon",service:q.commodities,request:p.histogram,params:{renderingRule:j([0,1,1,369],[0,1],e.carbonStock.rasterId),pixelSize:500},callbacks:{radius:i,concession:i}},{category:"rate_change_loss",service:q.commodities,request:p.histogram,params:{renderingRule:"",pixelSize:100},callbacks:{radius:function(a){},concession:function(a){}}},{category:"loss_peat_area",service:q.commodities,request:p.histogram,params:{renderingRule:m(k(e.treeCoverLoss.rasterId),e.peatLands.rasterId,3),pixelSize:100},callbacks:{radius:i,concession:i}},{category:"clearance",service:q.commodities,request:p.histogram,params:{renderingRule:m(l(e.clearanceAlerts.rasterId),e.peatLands.rasterId,3),pixelSize:100},callbacks:{radius:i,concession:i}},{category:"presence",service:q.commodities,request:p.histogram,params:{mosaicRule:n(e.peatLands.rasterId),pixelSize:100},callbacks:{radius:h(.0059,.0063),concession:h(.0059,.0063)}},{category:"fire",service:q.fires,request:p.query,params:{where:"1=1",geometry:""},execution:"executeForCount",callback:function(a,b){return a>0?3:1},callbacks:{radius:function(a,b){return a>0?3:1},concession:function(a,b){return a>0?3:1}}}],t=function(a){var b=c.clone(r);return b.forEach(function(b){var c=0;if(1==b.categories.length)var d=a[b.categories[0]];else{var e=[];b.categories.forEach(function(b,d){c+=a[b],e.push({key:b,risk:a[b]})}),b.categories=e;var d=g(b.high,b.low,c)}b.risk=d}),b};return function(e,g,h,i,j){var k=new a;f=g,i=i,j=j;var l=[];return s.forEach(function(b){var c=new a,f=j&&b.ind_params?b.ind_params:b.params;b.request==d.computeHistogram?(f.renderingRule=JSON.stringify(f.renderingRule),f.mosaicRule=f.mosaicRule?JSON.stringify(f.mosaicRule):"",f.geometryType="esriGeometryPolygon",f.geometry=JSON.stringify(e)):f.geometry=e,f.f="json",b.request(b.service,f,b.execution).then(function(a){var d={},e=b.callbacks[h];b.results=a,d[b.category]=e(a,c),c.resolve(d)}),l.push(c.promise)}),b(l).then(function(a){var b={};a.forEach(function(a){c.mixin(b,a)});var d=t(b);k.resolve(d)}),k.promise}});