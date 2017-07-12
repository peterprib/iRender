"use strict";
const nsSVG = "http://www.w3.org/2000/svg";
function Svg(d) {
	this.element=document.createElementNS(nsSVG,"svg"); 
	d.width=d.width||"100%";
	d.height=d.height||"100%";
	this.set(d);
}
Svg.prototype.appendTo = function (n) {
		n.appendChild(this.element);
		this.parent;
		return this;
	};
Svg.prototype.set = function (o) {
		for (var p in o) {
			switch (p) {
				case "viewBox":
					this.element.setAttribute(p,o[p].minx+" "+o[p].miny+" "+o[p].width+" "+o[p].height);
					break;
				case "draw":
					this.draw(o[p]);
					break;
				default:
					this.element.setAttribute(p,o[p]);
			}
		}
	};
Svg.prototype.draw = function (p) {
		if(p instanceof Array) {
			for(var i=0;i<p.length;i++) {
				this.draw(p[i]);
			}
		} else {
			var o = document.createElementNS(nsSVG, p.action);
			if(o==undefined) throw Error("SVG invalid function "+p.action);
			for(var a in p){
				if(a=="action") continue;
		        o.setAttributeNS(null, a, p[a]);
			}
	        this.element.appendChild(o);
		}
		return this;
	};
Svg.prototype.zoomAll = function () {
		var bb=this.element.getBBox();
		this.element.setAttribute("viewBox", [bb.x,bb.y,bb.width,bb.height].join(" ") );
	};
	
try {
	module.exports = Svg;
} catch(e) {
	if (typeof define !== 'function') {
		var define = require('amdefine')(Svg);
	}
	define(function(require) {return Svg;});
    //The value returned from the function is
    //used as the module export visible to Node.
}
