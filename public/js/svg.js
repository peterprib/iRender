"use strict";
const nsSVG = "http://www.w3.org/2000/svg";

function createTable(rows,cols) {
	var t=document.createElement("TABLE");
	while (t.rows.length<rows) {
		var r=createTableRow(t);
		while (r.cells.length<cols) {
			createTableCell(r);
		}
	}
	return t;
}
function createTableRow(t) {
	var r=document.createElement("TR");
	t.appendChild(r);
	return r;
}
function createTableCell(r) {
	var c=document.createElement("TD");
	r.appendChild(c);
	return c;
}
function eventDoNothing(ev) {
	ev.stopPropagation();
}

function getMousePositionRelative(ev) {
	var e=ev.currentTarget;
	return { x: ev.pageX - (e.offsetLeft + e.parentElement.offsetLeft)
		,y: ev.pageY - (e.offsetTop + e.parentElement.offsetTop)};
}
function createNode (nodeDetails) {
	if(nodeDetails.constructor === String) return document.createTextNode(nodeDetails);
	throw Error("creadeNode unknown type, "+JSON.stringify(nodeDetails));
};
var shapes={
		circle: {action:"circle",cx:"40",cy:"40",r:"40",stroke:"black","stroke-width":4,fill:"yellow"}
		,square:{action:"rect",id:"rect",x:0,y:0,width:32,height:32,stroke:"black","stroke-width":4,fill:"yellow"}
		,arrowHead:{action:"polyline",points:"40 60 80 20 120 60"   ,stroke:"black","stroke-width":"20","stroke-linecap":"butt",fill:"none","stroke-linejoin":"miter"}
		,arrowHeadRound:{action:"polyline",points:"40 140 80 100 120 140",stroke:"black","stroke-width":"20","stroke-linecap":"round",fill:"none","stroke-linejoin":"round"}
		,arrowHeadBevel:{action:"polyline",points:"40 220 80 180 120 220",stroke:"black","stroke-width":"20","stroke-linecap":"square",fill:"none","stroke-linejoin":"bevel"}
	};

function Form() {
	this.element=createTable();
	this.activeFilter=[];
}
Form.prototype.applyFilter = function (f) {
		if(f) this.activeFilter=(f instanceof Array? f : [f]);
		row:for(var t,f, i=0;i<this.element.rows.length;i++) {
			if(this.element.rows[i].filterTags) {
				f=this.element.rows[i].filterTags;
				for (var c in f) {
					var t =this.activeFilter.indexOf(f[c]);
					if(this.activeFilter.indexOf(f[c])<0) {
						this.element.rows[i].style.display="none";
						continue row;
					}
				}
				this.element.rows[i].style.display="table-row";
			}
		}
	};
Form.prototype.input = function (p,t) {
		return this.addItem(Object.assign({action:"input"},p),t);
	};
Form.prototype.options = function (s,p) {
		for(var o in p.options) {
			s.appendChild(this.set(document.createElement(p.action),Object.assign(e,p.options[o])));
		}
	};
Form.prototype.select = function (p,t) {
	return this.addItem(Object.assign({action:"select"},p),t);
	};
Form.prototype.addItem = function (p,t) {
		var r=createTableRow(this.element);
		if(t) r.filterTags=(t instanceof Array? t : [t]);
		createTableCell(r).appendChild(createNode(p.title));
		createTableCell(r).appendChild(this.action(p));
		return this;
	};
Form.prototype.action = function (p) {
		if(typeof p === 'object') 
			return this.set(document.createElement(p.action),p,{action:null,title:null});
		return createNode(p);
	};
Form.prototype.set = function (e,o,r) {
		var a;
		for (var p in o) {
			a=o[p];
			if(r && p in r) {
				if(r.p==null) continue;
				this[p](e,a);
				continue;
			}
			if(a instanceof Array) {
				if(p=="children") {
					for(var l=a.length,i=0;i<l;i++) {
						e.appendChild(this.action(a[i]));
					}
					continue;
				}
				for(var l=a.length,i=0;i<l;i++) {
					e.appendChild(this.action(Object.assign({action:p},a[i])));
				}
				continue;
			}
			if(a instanceof Function) {
				e.addEventListener((p.substr(0,2)=="on"?p.substr(2):p), a.bind(this), false);
				continue;
			}
			if(a instanceof Object) {
				for(var p1 in a) {
					if(p1=="function") {
						a.function.apply(this, [e])
					}
				}
				continue
			}
			e.setAttribute(p,a);
		}
		return e;
	};
	
function Svg(d) {
	this.element=document.createElement("div");
	this.element.style.width="100%";
	this.element.style.height="100%";
//	this.element.style.border="1px solid";
	this.svg=document.createElementNS(nsSVG,"svg");
	this.set(Object.assign({},d,{width:"100%",height:"100%"}));
	this.element.appendChild(this.svg);
	this.element.addEventListener('click', this.onclick.bind(this), false)
//onactivate, onclick, onfocusin, onfocusout, onload, onmousedown, onmousemove, onmouseout, onmouseover, onmouseup
}
Svg.prototype.appendTo = function (n) {
		n.appendChild(this.svg);
		this.parent;
		return this;
	};
Svg.prototype.onclick = function (ev) {
		ev.stopPropagation();
		if(this.floatPane) {
			this.floatPane.style.display="table";
		} else {
			this.createFloat("Edit");
		}
		this.positionFixed(this.floatPane,ev.clientX,ev.clientY); //event.clientY ev.pageY
	};
Svg.prototype.createFloat = function (title) {
		this.floatPane=createTable(2,1);
		this.floatPane.addEventListener('click', eventDoNothing.bind(this), false);
		this.floatPane.mySvg=this;
		this.element.appendChild(this.floatPane);
		this.floatPaneHeader=this.floatPane.rows[0].style.width="100%";
		this.floatPaneHeader=this.floatPane.rows[0].cells[0];
		this.floatPaneHeader.mySvg=this;
		this.floatPaneHeader.style="background-color: LightGrey; height: 25px; width: 100%; text-align: center; vertical-align:top ;";
		this.floatPaneHeader.appendChild(createNode("\u00a0"+(title||"No Title Set")+"\u00a0"));
		this.closeIcon=this.getIconImage("close_s.gif");
		this.closeIcon.align="right";
		this.floatPaneHeader.appendChild(this.closeIcon);
		this.closeIcon.addEventListener('click', this.onclickClose.bind(this), false);
		this.closeIcon.addEventListener('mouseenter', this.iconEnter.bind(this), false);
		this.closeIcon.addEventListener('mouseleave', this.iconLeave.bind(this), false);
		this.floatPane.style=
			"min-width: 100px; min-height: 100px;"
			+"position:fixed; filter: alpha(opacity=100); -moz-opacity: 1; background-color:white; opacity: 1; padding:0px;"
			+"overflow:auto; z-index:99999; background-color:#FFFFFF; border: 1px solid #a4a4a4;"
			;
		this.floatPaneDetail=this.floatPane.rows[1].cells[0];
		this.floatPaneDetail.mySvg=this;
		this.form=new Form()
			.select({title:"Shape"
				,option: { "function": function(e) {
						for(var s in shapes) {
							e.appendChild(this.action({action:"option",label:s,value:s,children:[s]}));
					}}}
				,onchange: function(ev) {
						this.shape=ev.target.value;
						this.applyFilter(shapes[this.shape].action);
					}
				})
			.input({title:"Radius",type:"number"},["circle"])
			.input({title:"Fill",type:"color"});
		this.floatPaneDetail.appendChild(this.form.element);
	};
Svg.prototype.iconEnter = function (ev) {
		ev.target.style.cursor="pointer"
		ev.target.style.filter="invert(100%)"
	};
Svg.prototype.iconLeave = function (ev) {
		ev.target.style.cursor="inherit"
		ev.target.style.filter="inherit"
	};
Svg.prototype.getIconImage = function(n) {
		var i = new Image(16,16);
		i.src="images/"+n;
		return i;
	};
Svg.prototype.onclickClose = function (ev) {
		ev.stopPropagation();
		this.close(ev);
	};
Svg.prototype.close = function () {
//		this.svgFloat.parentElement.removeChild(this.svgFloat);
		this.floatPane.style.display="none";
//		this.element.removeChild(this.floatPane);
//		delete this.floatPane;
	};
Svg.prototype.positionFixed = function (e,x,y) {
		e.style.left=x+"px";
		e.style.top=y+"px";
	};
Svg.prototype.set = function (o) {
		for (var p in o) {
			switch (p) {
				case "viewBox":
					this.svg.setAttribute(p,o[p].minx+" "+o[p].miny+" "+o[p].width+" "+o[p].height);
					break;
				case "draw":
					this.draw(o[p]);
					break;
				default:
					this.svg.setAttribute(p,o[p]);
			}
		}
	};
Svg.prototype.draw = function (p) {
		this.drawObject(p);
		return this;
	};
Svg.prototype.drawObject = function (p) {
		if(p instanceof Array) {
			for(var i=0;i<p.length;i++) {
				this.drawObject(p[i]);
			}
			return;
		}
		var o = document.createElementNS(nsSVG, p.action);
		if(o==undefined) throw Error("SVG invalid function "+p.action);
		for(var a in p){
			if(a=="action") continue;
			try{
				o.setAttributeNS(null, a, p[a]);
			} catch(e) {
				throw Error("failed set attribute "+a+" to "+p[a]+" error "+e)
			}
		}
		switch (p.action){
			case "foreignObject" :
				o.setAttributeNS(null, "requiredExtensions", "http://www.w3.org/1999/xhtml");
				break;
		}
		this.svg.appendChild(o);
		return o;
	};
Svg.prototype.zoomAll = function () {
		var bb=this.svg.getBBox();
		this.svg.setAttribute("viewBox", [bb.x,bb.y,bb.width,bb.height].join(" ") );
	};
Svg.prototype.zoomIn = function () {	
		this.svg.currentScale = 1.1 * this.svg.currentScale; // zoom out
	};
Svg.prototype.zoomOut = function () {	
		this.svg.currentScale = 0.9 * this.svg.currentScale; // zoom out
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
