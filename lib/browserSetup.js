"use strict";
const path = require('path')
	,express = require('express');
function browserSetup(app,p) {
	console.log('browserSetup');
	var f,include,type,n
		,s="console.log('initialise');"
			+"\nfunction Loading (f) {this.callOnLoaded=f;this.count=1"
					+"\nthis.scriptNode = document.currentScript;"
					+"\nthis.finished=function () {loading.count--;"
							+"\console.log('loaded, remaining '+loading.count);"
							+"\nif(loading.count>0) return;"
							+"\nif(loading.callOnLoaded) this.callOnLoaded.call;"
							+"\nif(loading.scriptNode.dataset.execute) {"
								+"\console.log('intial script '+loading.scriptNode.dataset.execute+' to be loaded');"
								+"\nvar e=document.createElement('script');"
								+"\ne.type='text/javascript';"
								+"\ne.src = loading.scriptNode.dataset.execute;"
								+"\nhead0.appendChild(e);"
							+	"}"
							+"\ndelete head0;"
							+"\ndelete loading;"
			+"}}"
			+"\nvar head0=document.getElementsByTagName('head')[0]"
			+"\nvar loading=new Loading();"
			;
	s+="\n(function() {";
	for(var i in p) {
		n=p[i];
		try{ 
			if(n.file) {
				f=require.resolve(n.file);
			} else {
				f=path.dirname(require.resolve(n.id+path.sep+"README.md"))+(n.offset?path.sep+n.offset:"");
			}
		} catch (e) {
			console.error("browserSetup Cannot provision "+n.id+" reason: "+e);
			continue;
		}
		console.log("use "+n.id +' ==> '+f);
		app.use('/'+n.id, express.static(f));
		if(n.include) {
			for(var j in n.include) {
				include=n.id+'/'+n.include[j];
				if((include.match(/[^\\\/]\.([^.\\\/]+)$/) || [null]).pop()==='js') {
					s+="loading.count++;"
						+"\nvar e=document.createElement('script');"
						+"\ne.type='text/javascript';"
						+"\ne.src = '"+include+"';"; 
				} else {
					s+="\nvar e=document.createElement('link');"
						+"\ne.type='text/javascript';"
						+"\ne.rel='stylesheet';"
						+"\ne.href='"+include+"';" ;
				}
				s+=	"\ne.onload = loading.finished;"
					+"\nhead0.appendChild(e);"
					+"\nconsole.log('initialise include  issued for: "+include+"');";
			}
		}
	}
	s+="\n})()";
	s+="\nloading.finished();\nconsole.log('initialise end');";
	app.get('/initialise',function (req, res, next) {
		res.header("content-type","application/javascript"); 
		res.send(s); 
	});
}

module.exports = browserSetup;
if (typeof define !== 'function') {
    var define = require('amdefine')(browserSetup);
}
define(function(require) {
    //The value returned from the function is
    //used as the module export visible to Node.
    	return browserSetup;
	});
