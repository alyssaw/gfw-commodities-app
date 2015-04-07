/*! Global-Forest-Watch-Commodities - v2.0.0 - 2015-04-07/ */define(["esri/request","esri/tasks/query","esri/tasks/QueryTask","esri/geometry/Polygon","report/config","dojo/Deferred","dojo/_base/lang","dojo/promise/all"],function(a,b,c,d,e,f,g,h){return{getSuitabilityData:function(){function a(a){b.resolve(a)}var b=new f;return h([this.getSuitableAreas(),this.getLCHistogramData(),this.getRoadData(),this.getConcessionData(),this.computeLegalHistogram()]).then(a),b.promise},getSuitableAreas:function(){function a(a){a.histograms.length>0?(j.data=a.histograms[0],j.pixelSize=i.pixelSize,c.resolve(j)):c.resolve(!1)}function b(d){d.details&&"The requested image exceeds the size limit."===d.details[0]&&500!==i.pixelSize?(i.pixelSize=500,h.getHistogram(g,i,a,b)):c.resolve(!1)}var c=new f,d=report.suitable.renderRule,g=e.suitability.url,h=this,i={f:"json",pixelSize:100,geometryType:e.suitability.geometryType,geometry:JSON.stringify(report.geometry)},j={};return d.rasterFunction=e.suitability.rasterFunction,i.renderingRule=JSON.stringify(d),this.getHistogram(g,i,a,b),c.promise},getLCHistogramData:function(){function a(a){a.histograms.length>0?(k.data=a.histograms[0],k.pixelSize=j.pixelSize,c.resolve(k)):c.resolve(!1)}function b(d){d.details&&"The requested image exceeds the size limit."===d.details[0]&&500!==j.pixelSize?(j.pixelSize=500,i.getHistogram(h,j,a,b)):c.resolve(!1)}var c=new f,d=e.suitability.lcHistogram,g=d.renderRule,h=e.suitability.url,i=this,j={f:"json",pixelSize:100,geometryType:e.suitability.geometryType,geometry:JSON.stringify(report.geometry),renderingRule:JSON.stringify(g)},k={};return this.getHistogram(h,j,a,b),c.promise},getRoadData:function(){function a(a){a.histograms.length>0?(k.data=a.histograms[0],k.pixelSize=j.pixelSize,c.resolve(k)):c.resolve(!1)}function b(d){d.details&&"The requested image exceeds the size limit."===d.details[0]&&500!==j.pixelSize?(j.pixelSize=500,i.getHistogram(g,j,a,b)):c.resolve(!1)}var c=new f,d=e.suitability.roadHisto,g=e.suitability.url,h=d.mosaicRule,i=this,j={f:"json",pixelSize:100,geometryType:e.suitability.geometryType,geometry:JSON.stringify(report.geometry),mosaicRule:JSON.stringify(h)},k={};return this.getHistogram(g,j,a,b),c.promise},getConcessionData:function(){var a=new f,g=e.suitability.concessions,h=new b,i=new c(g.url+"/"+g.layer);return h.returnGeometry=!1,h.geometry=new d(report.geometry),i.executeForCount(h,function(b){a.resolve({value:b>0?"Yes":"No"})},function(){a.resolve(!1)}),a.promise},computeLegalHistogram:function(){function a(a){a.histograms.length>0?(m.data=a.histograms[0],m.pixelSize=l.pixelSize,c.resolve(m)):c.resolve(!1)}function b(d){d.details&&"The requested image exceeds the size limit."===d.details[0]&&500!==l.pixelSize?(l.pixelSize=500,k.getHistogram(j,l,a,b)):c.resolve(!1)}var c=new f,d=report.suitable.renderRule,h=e.suitability.lcHistogram,i=h.renderRuleSuitable,j=e.suitability.url,k=this,l={f:"json",pixelSize:100,geometryType:e.suitability.geometryType,geometry:JSON.stringify(report.geometry)},m={};return g.mixin(d.rasterFunctionArguments,i.rasterFunctionArguments),d.rasterFunction=i.rasterFunction,l.renderingRule=JSON.stringify(d),this.getHistogram(j,l,a,b),c.promise},getHistogram:function(b,c,d,e){var f=a({url:b+"/computeHistograms?",content:c,handleAs:"json",callbackParamName:"callback"});f.then(d,e)}}});