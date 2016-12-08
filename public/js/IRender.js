
if(String.prototype.inList)
	console.log("String.prototype.inList already defined");
else
	String.prototype.inList = function () {
			var thisString=this.toString(), argValue;
			for (var i=0; i<arguments.length; i++) {
				var argValue=arguments[i];
				if(argValue==null) continue;
				if(argValue instanceof Array) {
					for (var j= 0; j<argValue.length;j++)
						if(thisString==argValue[j]) return true;
				} else if(argValue instanceof Object) {
						for (var j in argValue)
							if(thisString==j) return true;
				} else if(thisString==argValue) return true;
			}
			return false;
   		};
function IRenderClass() {
}
IRenderClass.prototype.nav = function (n) {
		console.log('nav');
	};
IRenderClass.prototype["navbar-Default"] = function (n) {
		console.log('nav');
	};
function IRender() {
	this.action={};
	this.classFunction= new IRenderClass();
	this.guid=0;
	this.metadata = {
			action: {}
			,pane: {id:null ,title:null}
			,window: {title:{"default":"No Title Specified"},footer:{"default":"No Footer Specified"}}
		};
	this.pane={};
	this.window={};
}
IRender.prototype.addPane = function(p) {
		this.checkProperties(p,this.metadata.pane);
		this.pane[p.id]=p;
	};
IRender.prototype.appendPane = function(n,p) {
		var h = document.createElement("HEADER");
		h.nodeValue=p.title||"No Pane Title Set";
		d.className = "IRenderPaneH";
		n.appendChild(h);
		var d = document.createElement("DIV");
		d.className = "IRenderPaneD";
		n.appendChild(d);
	};
IRender.prototype.attributes = function(a) {
		if(a==null) return "";
		var r="";
		for(var p in a)
			r+=" "+p+"='"+a[p]+"'";
		return r;
	};
IRender.prototype.build = function() {
		this.setAllNodes('IRender',this.buildBase);
	};
IRender.prototype.buildBase = function(n) {
		console.log("IRender buildBase");
		try{var f=this[n.nodeName];} catch(e) {
			console.error("IRender buildBase ignored tag "+n.nodeName.toString());	
			return;
		}
		try{f.apply(this,[n]);} catch(e) {
			console.log("IRender buildBase "+e);	
			console.error("IRender buildBase tag "+n.nodeName.toString()+ "error: "+e+"\nStack: "+e.stack);	
		}
	};
IRender.prototype.BODY = function(n) {
		if(this.window.title) document.title=this.window.title;
		if(n.firstChild==null || n.firstChild.nodeName!=="HEADER") this.insertHeader(n);
		if(n.lastChild.nodeName!=="FOOTER") this.insertFooter(n);
		var d=n.getElementsByTagName('div');
		if(d.l==0) {
			this.appendPane(n,this.pane.main);
		}
		return;
	};
IRender.prototype.checkProperties = function(o,ps) {
		for(var p in o)
			if(!p.inList(ps))
				throw Error('invalid property '+p);
	};
IRender.prototype.formHtml = function(form) {
		var r="",q=(form.questions||[]),l=q.length;
		for(var i=0;i<l;i++)
			r+="";
		return this.div({class:'nav'},this.header()+this.questions(form.questions)+submitButton());
	};
IRender.prototype.header = function(a,n) {
		return this.tag("header",a,n||this.window.title||"No Title Set");
	};
IRender.prototype.insertFooter = function(n) {
		var h = document.createElement("FOOTER");
		h.nodeValue=this.window.footer||"No Footer Set";
		n.appendChild(h);
	};
IRender.prototype.insertHeader = function(n) {
		var h = document.createElement("HEADER");
		h.nodeValue=this.window.title||"No Title Set";
		if(n.childNodes.length>0)
			n.insertBefore(h,n.childNodes[0]);
		else
			n.appendChild(h);
	};
IRender.prototype.input = function(a,n) {
		return this.tag("input",a,n);
	};
IRender.prototype.options = function(id,o) {
		var r="";
		for(var i in o)
			r+=this.input({name:a,value:o},o[i])+"<br>";
		return r;
	};
IRender.prototype.setAction = function(a) {
		var n;
		for(var i in a) {
			n=a[i];
			this.checkProperties(n,this.metadata.action);
			this.actions[n.id] = a[i];
		}
	};
IRender.prototype.setAllNodes = function(c,f) {
		var f=f||this[c]||null;
		if(f==null) return;
		for(var ns = document.getElementsByClassName(c),nsl=ns.length,i=0;i<nsl;i++)
			f.apply(this,[ns[i]]);
	};
IRender.prototype.setAllProperties = function(t,p,m) {
		for(var i in p)
			t[i]=p[i]||this.metadata.window.default||null;
	};
IRender.prototype.setWindow = function(p) {
		this.checkProperties(p,this.metadata.window);
		this.setAllProperties(this.window,p,this.metadata.window);
	};
IRender.prototype.submitButton = function() {
		return this.input({type:"submit",value:"Submit"});
	};
IRender.prototype.tag = function(t,a,n) {
		return "<"+tag+this.attributes(a)+">"+data||""+"</"+tag+">";
	};

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function(require) {
    //The value returned from the function is
    //used as the module export visible to Node.
    return IRender;
});