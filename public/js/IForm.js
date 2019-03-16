
/*
function rgb(r,g,b) {
	return "#"+("00000"+((r<<16)+(g<<8)+b).toString(16)).substr(-6);
}
function createTableCell(r) {
	return createElement("TD",r);
}
function createElement(e,n) {
	var c=document.createElement(e);
	n.appendChild(c);
	return c;
}
*/

function IForm(parent,node,title) {
	this.css=new IRenderClass("IFormCSS")
	.add("Table tr td:hover","background: LightGrey; cursor: pointer")
	.add("Table","min-width: 100px; min-height: 30px; "
			+"position:absolute; filter: alpha(opacity=100); -moz-opacity: 1; background-color:white; opacity: 1; padding:0px;"
			+"overflow: auto; z-index:99999; background-color:#FFFFFF; border: 1px solid #a4a4a4;")
	.add("Header","background-color: LightGrey; height: 25px; width: 100%; text-align: center; vertical-align:top ;")
	.add("CloseIcon","float:right;height: 12px; width: 12px;  border: 4px; margin: 0px 0px 0px 4px;");
	
	this.element=this.css.createElement(node||document.getElementsByTagName("body")[0],"TABLE","Table");
	this.activeFilter=[];
	this.parent=parent;

	this.header=this.css.createElement(this.element,"TR","Header")
	this.header.appendChild(document.createTextNode(title||"Form"))
	this.closeIcon=this.css.setClass(this.getIconImage("close_s.gif"),"CloseIcon");
	this.header.appendChild(this.closeIcon);
	this.closeIcon.addEventListener('click', this.onclickClose.bind(this), false);
	
	this.core=this.css.createElement(this.element,"TR");
	this.footer=this.css.createElement(this.element,"TR");
	this.data=this.css.createElement(this.core,"TABLE");
	this.element.draggable=true;//dragStart
	this.element.addEventListener('dragstart', this.dragStart.bind(this), false);
}

IForm.prototype.createTableCell=function(r) {
	return this.createElement("TD",r);
}
IForm.prototype.createElement=function(e,n) {
	var c=document.createElement(e);
	n.appendChild(c);
	return c;
}

IForm.prototype.getIconImage = function (n) {
	var i = new Image(16,16);
	i.src="images/"+n;
	i.alt="X";
	return i;
};
IForm.prototype.setRemove = function (f) {
	this.parentRemove=f;
	return this;
}
IForm.prototype.onclickClose = function (ev) {
	ev.stopPropagation();
	this.element.parentNode.removeChild(this.element);
	if(this.parentRemove) this.parentRemove();
	delete this.element;
}
IForm.prototype.applyFilter = function (f) {
		if(f) this.activeFilter=(f instanceof Array? f : [f]);
		row:for(var t,f, i=0;i<this.data.rows.length;i++) {
			if(this.data.rows[i].filterTags) {
				f=this.data.rows[i].filterTags;
				for (var c in f) {
					var t =this.activeFilter.indexOf(f[c]);
					if(this.activeFilter.indexOf(f[c])<0) {
						this.data.rows[i].style.display="none";
						continue row;
					}
				}
				this.data.rows[i].style.display="table-row";
			}
		}
	};
//IForm.prototype.button = function (p,t) {
		//this.action(Object.assign({action:"input",type:"button"},p),t)
//	};
IForm.prototype.display = function () {
		this.element.style.display="block";
		return this;
	};

//IForm.prototype.getTargetObject = function () {
//		return this.getTargetObject();
//	};
IForm.prototype.input = function (p,m,t) {
		return this.addItem(Object.assign({action:"input"},p),m,t);
	};
IForm.prototype.options = function (s,p) {
		for(var o in p.options) {
			s.appendChild(this.set(document.createElement(p.action),Object.assign(e,p.options[o])));
		}
		return this;
	};
IForm.prototype.select = function (p,m,t) {
	return this.addItem(Object.assign({action:"select"},p),m,t);
	};
IForm.prototype.addItem = function (p,m,t) {
		if(m) r.mapping=m
		if(t) r.filterTags=(t instanceof Array? t : [t]);
		if(p instanceof Array) {
			for(var i=0;i<p.length;i++) {
				this.addItem(p[i]);
			}
			return this;
		}
		var r=this.createElement("TR",this.data);
		this.createTableCell(r).appendChild(document.createTextNode(p.title));
		this.createTableCell(r).appendChild(this.action(p));
		return this;
	};
IForm.prototype.getMapping = function () {
		for(var r={}, i=0;i<this.data.rows.length;i++) {
			if(this.data.rows[i].mapping) {
				r[this.data.rows[i].mapping]=this.getValue(i);
			}
		}
		return r;
	};
IForm.prototype.setMapping = function (p) {
		if(p== null) {
			console.error("form set mapping no properties provided");
			return;
		}
		for(var m, i=0;i<this.data.rows.length;i++) {
			if(this.data.rows[i].mapping) {
				m=this.data.rows[i].mapping;
				if(m in p) {
					this.setValue(i,p[m]);
				}
			}
		}
		return this;
	};
IForm.prototype.getTitleRow = function (t) {
		for(var i=0;i<this.data.rows.length;i++) {
			if(this.data.rows[i].cell[0].innerText==t) {
				return this.data.rows[i]
			}
		}
		throw Error("form title not found for "+t);
	};
IForm.prototype.getTitleInputCell = function (t) {
		return this.getTitleRow(t).cell[1];
	};
IForm.prototype.getTitleInput = function (t) {
		return this.getTitleInputCell(t).firstChild;
	};
IForm.prototype.getValue = function (i) {
		var e=this.data.rows[i].cells[1].firstChild;
		switch(e.nodeName) {
			case "INPUT": return e.value;
			case "SELECT": return e.options[e.selectedIndex].value;
		}
		console.error("Form getValue unknown: "+e.nodeName)
	};
IForm.prototype.rgb = function (r,g,b) {
		return "#"+("00000"+((r<<16)+(g<<8)+b).toString(16)).substr(-6);
	};
IForm.prototype.setValue = function (i,v) {
		var e=this.data.rows[i].cells[1].firstChild;
		switch(e.nodeName) {
			case "INPUT":
				if(e.type=="color" && !v.startsWith("#")) {
					if(v.startsWith("rgb(")) {
						v=eval("this."+v);
					} else {
						if(!(v in colors)) throw Error("color not found for "+v);
						v=colors[v];
					}
				}
				e.value=v; 
				return;
			case "SELECT":
				for(var i=0;i<e.options.length;i++) {
					if(e.options[i].value==v) {
						e.options[i].selected=true;
						return;
					}
				}
				console.error("Form setValue unknown select: "+v);
				return this;
		}
		console.error("Form setValue unknown: "+e.nodeName);
		return this;
	};
IForm.prototype.setTitle = function (t,v) {
		var e=this.getTitleInput(t).value=v;
		switch(e.nodeName) {
			case "INPUT":
				e.value=v;
				break;
			case "SELECT":
				for(var i in e.options) {
					if(e.options[i].value==v) {
						var j=i;
					} else {
						if(e.options[i].selected) delete e.options[i].selected;
					}
				}
				break;
			default: 
				console.error("Form set title element type unknown: "+e.nodeName)
		}
		return this;
	};
IForm.prototype.action = function (p) {
		if(typeof p === 'array') {
			var span=document.createElement("span");
			for(var i=0;i<p.length;i++) {
				span.appendChild(this.action(p[i]));
			}
			return span
		}
		if(typeof p === 'object') {
			var e= document.createElement(p.action)
			if(p.action.toUpperCase()=="TEXTAREA") {
				e.append(document.createTextNode(p.value));
			}
			return this.set(e,Object.assign(p,{draggable:true}),{action:null,title:null});

		}
		return document.createTextNode(p);
	};
IForm.prototype.set = function (e,o,r) {
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
						a.function.apply(this, [e]);
					}
				}
				continue;
			}
			e.setAttribute(p,a);
		}
		return e;
	};
IForm.prototype.positionAbsolute = function (p) {
		this.element.style.left=p.x+"px";
		this.element.style.top=p.y+"px";
		this.element.style.position="absolute";
		return this;
	};
IForm.prototype.dragStart = function(ev) {
		this.dragStartX=ev.pageX;
		this.dragStartY=ev.pageY;
		ev.target.style.opacity = .5;
		document.addEventListener('dragend',this.dragEnd.bind(this), {once:true});
		document.addEventListener("dragover",this.dragAllowDrop.bind(this), false);
	};
IForm.prototype.dragEnd = function(ev) {
	    ev.target.style.opacity = "";
	    document.removeEventListener('dragover',this.dragAllowDrop.bind(this), false);
//	    document.removeEventListener('dragEnd',this.dragEnd.bind(this), false);
	    this.movePane({x:ev.pageX-this.dragStartX,y:ev.pageY-this.dragStartY});
	};
IForm.prototype.dragAllowDrop = function(ev) {
		ev.preventDefault();
	}
IForm.prototype.movePane = function (p) {
		const rect = this.element.getBoundingClientRect();
		this.positionAbsolute({x:rect.left+p.x,y:rect.top+p.y});
		this.setMaxPaneSize();
	};
IForm.prototype.getBoundingClientRect = function() {
		return this.parent.getBoundingClientRect();
	};
IForm.prototype.setMaxPaneSize = function () {
		const p = this.element.getBoundingClientRect()
			,w=this.parent.element.getBoundingClientRect()
		if(w.width<p.right) this.element.style.width=(w.width-p.left)+"px";
 		if(w.height<p.bottom) this.element.style.height=(w.height-p.top)+"px";
	};
if (typeof define !== 'function') var define = require('amdefine')(module);
define(function(require) { return IForm; });