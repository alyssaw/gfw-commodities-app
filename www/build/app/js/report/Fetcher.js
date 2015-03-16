/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-03-16/ */define(["dojo/number","dojo/Deferred","dojo/promise/all","report/config","report/Renderer","report/Suitability","esri/request","esri/tasks/query","esri/tasks/QueryTask","esri/SpatialReference","esri/geometry/Polygon","esri/tasks/GeometryService","esri/tasks/AreasAndLengthsParameters"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){"use strict";var n=[];return{getAreaFromGeometry:function(c){function e(b){1===b.areas.length?(g=a.format(b.areas[0],{places:0}),report.area=b.areas[0],h.resolve(!0)):(g=q,h.resolve(!1)),document.getElementById("total-area").innerHTML=g}function f(){document.getElementById("total-area").innerHTML=q,h.resolve(!1)}this._debug("Fetcher >>> getAreaFromGeometry");var g,h=new b,i=new l(d.geometryServiceUrl),n=new m,o=new j(54012),p=new k(c),q="Not Available";return n.areaUnit=l.UNIT_HECTARES,i.project([p],o,function(a){a.length>0?(p.rings=a[0].rings,p.setSpatialReference(o)):f(),i.simplify([p],function(a){n.polygons=a,i.areasAndLengths(n,e,f)},f)},f),h.promise},makePrintRequest:function(){function a(){e.innerHTML="<div>Sorry, we were unable to generate a map printout at this time.</div>"}if(payload.webMapJson){var b={f:"json",format:"PNG32",Layout_Template:"MAP_ONLY",Web_Map_as_JSON:payload.webMapJson},c=d.printUrl,e=document.getElementById("print-map"),f=g({url:c,content:b,handleAs:"json",callbackParamName:"callback",timeout:6e4},{usePost:!0});f.then(function(b){if(b.results.length>0){var c=b.results[0].value.url;c?e.innerHTML="<img title='map' src='"+c+"' />":a()}else a()},a)}},getPrimaryForestResults:function(){this._debug("Fetcher >>> getPrimaryForestResults");var a=new b,f=d.primaryForest;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f),this._getClearanceAlertAnalysis(f),this._getCompositionAnalysis(f)]).then(function(){a.resolve(!0)}),a.promise},getTreeCoverResults:function(){this._debug("Fetcher >>> getTreeCoverResults");var a=new b,f=d.treeCover;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f),this._getClearanceAlertAnalysis(f),this._getCompositionAnalysis(f)]).then(function(){a.resolve(!0)}),a.promise},getTreeCoverLossResults:function(){function a(a){a.histograms.length>0?(e.renderTreeCoverLossData(a.histograms[0].counts,i.pixelSize,g),e.renderCompositionAnalysis(a.histograms[0].counts,i.pixelSize,g)):e.renderAsUnavailable("loss",g),f.resolve(!0)}function c(b){b.details&&"The requested image exceeds the size limit."===b.details[0]&&500!==i.pixelSize?(i.pixelSize=500,j._computeHistogram(h,i,a,c)):f.resolve(!1)}this._debug("Fetcher >>> getTreeCoverLossResults");var f=new b,g=d.treeCoverLoss,h=d.imageServiceUrl,i=(g.rasterId,{geometryType:"esriGeometryPolygon",geometry:JSON.stringify(report.geometry),mosaicRule:JSON.stringify(g.mosaicRule),pixelSize:report.geometry.rings.length>45?500:100,f:"json"}),j=this;return e.renderTotalLossContainer(g),e.renderCompositionAnalysisLoader(g),this._computeHistogram(h,i,a,c),f.promise},getLegalClassResults:function(){this._debug("Fetcher >>> getLegalClassResults");var a=new b,f=d.legalClass;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f),this._getClearanceAlertAnalysis(f)]).then(function(){a.resolve(!0)}),a.promise},getProtectedAreaResults:function(){this._debug("Fetcher >>> getProtectedAreaResults");var a=new b,f=d.protectedArea;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f,!0),this._getClearanceAlertAnalysis(f,!0),this._getCompositionAnalysis(f)]).then(function(){a.resolve(!0)}),a.promise},getCarbonStocksResults:function(){this._debug("Fetcher >>> getCarbonStocksResults");var a=new b,f=d.carbonStock;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f),this._getClearanceAlertAnalysis(f)]).then(function(){a.resolve(!0)}),a.promise},getIntactForestResults:function(){this._debug("Fetcher >>> getIntactForestResults");var a=new b,f=d.intactForest;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f,!0),this._getClearanceAlertAnalysis(f,!0)]).then(function(){a.resolve(!0)}),a.promise},getLandCoverGlobalResults:function(){this._debug("Fetcher >>> getLandCoverGlobalResults");var a=new b,f=d.landCoverGlobal;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f),this._getClearanceAlertAnalysis(f)]).then(function(){a.resolve(!0)}),a.promise},getLandCoverAsiaResults:function(){this._debug("Fetcher >>> getLandCoverAsiaResults");var a=new b,f=d.landCoverAsia;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f),this._getClearanceAlertAnalysis(f)]).then(function(){a.resolve(!0)}),a.promise},getLandCoverIndonesiaResults:function(){this._debug("Fetcher >>> getLandCoverIndonesiaResults");var a=new b,f=d.landCoverIndo;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f),this._getClearanceAlertAnalysis(f)]).then(function(){a.resolve(!0)}),a.promise},getPeatLandsResults:function(){this._debug("Fetcher >>> getPeatLandsResults");var a=new b,f=d.peatLands;return e.renderContainers(f),n.push(f),c([this._getTotalLossAnalysis(f,!0),this._getClearanceAlertAnalysis(f,!0),this._getCompositionAnalysis(f)]).then(function(){a.resolve(!0)}),a.promise},getRSPOResults:function(){function a(a){e.renderRSPOData(a,g,i),f.resolve(!0)}function c(b){b.details&&"The requested image exceeds the size limit."===b.details[0]&&500!==k.pixelSize?(k.pixelSize=500,l._computeHistogram(h,k,a,c)):f.resolve(!1)}this._debug("Fetcher >>> getRSPOResults");var f=new b,g=d.rspo,h=d.imageServiceUrl,i=this._getEncodingFunction(g.lossBounds,g.bounds),j=i.render(d.totalLoss.rasterId,g.rasterId),k={geometryType:"esriGeometryPolygon",geometry:JSON.stringify(report.geometry),renderingRule:j,pixelSize:100,f:"json"},l=this;return e.renderRSPOContainer(g),this._computeHistogram(h,k,a,c),f.promise},_getTotalLossAnalysis:function(a,c){function f(b){b.histograms.length>0?e.renderLossData(b.histograms[0].counts,n.pixelSize,a,k,c):e.renderAsUnavailable("loss",a),h.resolve(!0)}function g(a){a.details&&"The requested image exceeds the size limit."===a.details[0]&&500!==n.pixelSize?(n.pixelSize=500,o._computeHistogram(j,n,f,g)):h.resolve(!1)}this._debug("Fetcher >>> _getTotalLossAnalysis");var h=new b,i=d.totalLoss,j=d.imageServiceUrl,k=this._getEncodingFunction(i.bounds,a.bounds),l=a.rasterRemap?a.rasterRemap:a.rasterId,m=c?k.getSimpleRule(i.rasterId,l):k.render(i.rasterId,l),n={geometryType:"esriGeometryPolygon",geometry:JSON.stringify(report.geometry),renderingRule:m,pixelSize:report.geometry.rings.length>45?500:100,f:"json"},o=this;return this._computeHistogram(j,n,f,g),h.promise},_getClearanceAlertAnalysis:function(a,c){function f(b){b.histograms.length>0?e.renderClearanceData(b.histograms[0].counts,j.pixelSize,a,k,c):e.renderAsUnavailable("clearance",a),l.resolve(!0)}function g(){l.resolve(!1)}this._debug("Fetcher >>> _getClearanceAlertAnalysis");var h,i,j,k,l=new b,m=d.clearanceAlerts,n=d.clearanceAnalysisUrl;return a.formaId&&(a.rasterId=a.formaId,a.includeFormaIdInRemap&&(a.rasterRemap.rasterFunctionArguments.Raster=a.formaId)),k=this._getEncodingFunction(report.clearanceBounds,a.bounds),i=a.rasterRemap?a.rasterRemap:a.rasterId,h=c?k.getSimpleRule(m.rasterId,i):k.render(m.rasterId,i),j={geometryType:"esriGeometryPolygon",geometry:JSON.stringify(report.geometry),renderingRule:h,pixelSize:500,f:"json"},this._computeHistogram(n,j,f,g),l.promise},_getCompositionAnalysis:function(a){function c(b){b.histograms.length>0?e.renderCompositionAnalysis(b.histograms[0].counts,j.pixelSize,a):e.renderAsUnavailable("composition",a),g.resolve(!0)}function f(a){a.details&&"The requested image exceeds the size limit."===a.details[0]&&500!==j.pixelSize?(j.pixelSize=500,k._computeHistogram(h,j,c,f)):g.resolve(!1)}e.renderCompositionAnalysisLoader(a);var g=new b,h=d.imageServiceUrl,i=a.compositionAnalysis,j={geometryType:"esriGeometryPolygon",geometry:JSON.stringify(report.geometry),mosaicRule:JSON.stringify({mosaicMethod:"esriMosaicLockRaster",lockRasterIds:[i.rasterId],ascending:!0,mosaicOperation:"MT_FIRST"}),pixelSize:report.geometry.rings.length>45?500:100,f:"json"},k=this;return this._computeHistogram(h,j,c,f),g.promise},_getSuitabilityAnalysis:function(){this._debug("Fetcher >>> _getSuitabilityAnalysis");var a=new b,c=d.suitability;return e.renderSuitabilityContainer(c),f.getSuitabilityData().then(function(b){e.renderSuitabilityData(c,b),a.resolve(!0)}),a.promise},_getMillPointAnalysis:function(){this._debug("Fetcher >>> _getMillPointAnalysis");var a,c,f=new b,g=d.millPoints;e.renderMillContainer(g),c=new XMLHttpRequest,window.shortcutConfig=g,c.open("POST",g.url,!0),c.onreadystatechange=function(){4===c.readyState&&(200===c.status?(a=JSON.parse(c.response),a.mills?(e.renderMillAssessment(a.mills,g),f.resolve(!0)):f.resolve(!1)):f.resolve(!1))},c.addEventListener("error",function(){f.resolve(!1)},!1);var h=new FormData;return h.append("mills",report.mills.map(function(a){return a.id}).join(",")),c.send(h),f.promise},_getFireAlertAnalysis:function(){this._debug("Fetcher >>> _getFireAlertAnalysis");var a,f,g,j,l=new b,m=new k(report.geometry);return f=new h,a=new h,j=new i(d.fires.url+"/0"),g=new i(d.fires.url+"/2"),f.geometry=m,a.geometry=m,f.returnGeometry=!1,a.returnGeometry=!1,f.outFields=["*"],a.outFields=["*"],f.where="1 = 1",a.where="1 = 1",c([j.execute(f),g.execute(a)]).then(function(a){e.renderFireData(n,a),l.resolve(!0)}),j.on("error",function(){l.resolve(!1)}),g.on("error",function(){l.resolve(!1)}),l.promise},_getClearanceBounds:function(){this._debug("Fetcher >>> _getClearanceBounds");var a,c,e=d.clearanceBounds,f=new b,h=0;return c=g({url:e.url,content:{f:"pjson"},handleAs:"json",callbackParamName:"callback"}),c.then(function(b){report.clearanceBounds=[b.minValues[0],b.maxValues[0]],report.clearanceLabels=[];for(var c=b.minValues[0],d=b.maxValues[0];d>=c;c++)a=c%12===0?12:c%12,report.clearanceLabels.push(a+"-"+(e.baseYearLabel+h)),c%12===0&&++h;f.resolve(!0)},function(a){f.resolve(!1,a)}),f.promise},_getEncodingFunction:function(a,b){return{A:a.fromBounds(),B:b.fromBounds(),getSimpleRule:function(a,b){return JSON.stringify({rasterFunction:"Arithmetic",rasterFunctionArguments:{Raster:a,Raster2:b,Operation:3}})},renderRule:function(a,b){return{rasterFunction:"Arithmetic",rasterFunctionArguments:{Raster:{rasterFunction:"Arithmetic",rasterFunctionArguments:{Raster:{rasterFunction:"Remap",rasterFunctionArguments:{InputRanges:[this.A[0],this.A[this.A.length-1]+1],OutputValues:[this.B.length],Raster:a,AllowUnmatched:!1}},Raster2:a,Operation:3}},Raster2:b,Operation:1}}},render:function(a,b){return JSON.stringify(this.renderRule(a,b))},encode:function(a,b){return this.B.length*a+b},decode:function(a){var b=a%this.B.length,c=(a-b)/this.B.length;return[c,b]}}},_computeHistogram:function(a,b,c,d){var e=g({url:a+"/computeHistograms",content:b,handleAs:"json",callbackParamName:"callback",timeout:6e4},{usePost:!0});e.then(c,d)},_debug:function(){}}});