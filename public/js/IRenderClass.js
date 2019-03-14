function IRenderClass(n) {
    this.styleSheet = document.getElementById(n||"IRenderCSS");
    if (this.styleSheet===null) {
    	console.log("IRenderClass define stylesheet"+n||"IRenderCSS");
    	this.styleSheet = document.createElement("style");
    	this.styleSheet.type = "text/css";
    	this.styleSheet.id = n||"IRenderCSS";
    	document.getElementsByTagName("head")[0].appendChild(this.styleSheet);
    	this.rule=this.styleSheet.sheet.insertRule?this.cssInsertRule:this.cssAddRule;
    	this.add("CloseIcon","float:right;height: 12px; width: 12px;  border: 4px; margin: 0px 0px 0px 4px;");
       	this.add("FullLeft","display: inline-block; height: 100%; width: 100%; background-color: white;");
    	this.add("FullSize","height: 100%; width: 100%;");
    	this.add("PaneFloat","min-width: 100px; min-height: 100px; "
    			+"position:absolute; filter: alpha(opacity=100); -moz-opacity: 1; background-color:white; opacity: 1; padding:0px;"
    			+"overflow: auto; z-index:99999; background-color:#FFFFFF; border: 1px solid #a4a4a4;")
    	this.add("resizeVertical:hover","cursor: ew-resize;");
       	this.setHTMLBody("height: 100%; width: 100%; margin: 0px 0px 0px 0px; overflow: hidden;");
    }
}

IRenderClass.prototype.setHTMLBody = function (r) {
		if(this.styleSheet.sheet.insertRule) {
			this.styleSheet.sheet.insertRule("html,body {"+r+"}",0);
		} else {
			 this.styleSheet.sheet.addRule("html,body", r);
		}
	};
IRenderClass.prototype.add = function (name,rules) { 
  		try{
  			this.rule.call(this,name,rules);
  		} catch(e){} //ignore as may have already been added
  		return this;
	};
IRenderClass.prototype.cssInsertRule = function (name,rules) {
	   this.styleSheet.sheet.insertRule('.'+this.styleSheet.id+name+"{"+rules+"}",0);
	   return this;
    };
IRenderClass.prototype.cssAddRule = function (name,rules) {
	   this.styleSheet.sheet.addRule('.'+this.styleSheet.id+name, rules);
	   return this;
    };
IRenderClass.prototype.setClass = function (n,name) {
		if(name) n.className=this.styleSheet.id+name;
		return n;
	};
IRenderClass.prototype.addClass = function (n,name) {
		n.classList.add(this.styleSheet.id+name);
		return n;
	};
IRenderClass.prototype.removeClass = function (n,name) {
		n.classList.remove(this.styleSheet.id+name);
		return n;
	};
IRenderClass.prototype.replaceClass = function (n,name) {
		return css.addClass(css.removeClass(n,from),to);
	};
IRenderClass.prototype.resetClass = function (n,name) {
		return css.removeClass(n,name,name);
};
IRenderClass.prototype.createElement = function (n,t,c) {
		var e=this.setClass(document.createElement(t),c)
		if(n) n.appendChild(e);
		return e;
	};
	
if (typeof define !== 'function') var define = require('amdefine')(module);
define(function(require) {return IRenderClass;});
