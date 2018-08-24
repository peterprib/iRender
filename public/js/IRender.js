var svg=require("svg");
if(String.prototype.inList)
	console.log("String.prototype.inList already defined");
else
	String.prototype.inList = function () {
			var thisString=this.toString(), argValue;
			for (var i=0; i<arguments.length; i++) {
				argValue=arguments[i];
				if(argValue===null) continue;
				if(argValue instanceof Array) {
					for (var j= 0; j<argValue.length;j++)
						if(thisString==argValue[j]) return true;
				} else if(argValue instanceof Object) {
						for (var j in argValue)
							if(thisString===j) return true;
				} else if(thisString===argValue) return true;
			}
			return false;
   		};
function coalesce() {
	for (var a,len=arguments.length, i=0; i<len; i++) {
		a=arguments[i];
		if(a===null || a===undefined) continue;
		return a;
	}
	return null;
 }
function fireEvent(node, eventName) {
    var doc;
    if(node.ownerDocument) {
        doc = node.ownerDocument;  // ownerDocument from the provided node to avoid cross-window problems
    } else if(node.nodeType == 9){
        doc = node; // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }
    if(node.dispatchEvent) {
        // Gecko-style approach (now the standard) but takes more work
        var event = doc.createEvent(this.getEventClass(eventName));
        event.initEvent(eventName, true, true); // All events created as bubbling and can be cancelled.
        event.synthetic = true; // allow detection of synthetic events
        node.dispatchEvent(event, true); // The second parameter says go ahead with the default action
    } else  if(node.fireEvent) { // IE-old school style - IE8 and lower
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
};
fireEvent.prototype.eventClasses = {
		MouseEvents: ["click", "mousedown","mouseup"]
		,HTMLEvents: ["focus","change","blur","select"]
	};
fireEvent.prototype.getEventClass = function (e) {
		for(var c in this.eventClasses) {
			for(var p in this.eventClasses[c]) {
				if(e==this.eventClasses[c][p]) return c;
			}
		}
		throw Error("fireEvent: Couldn't find an event class for event '" + eventName + "'.");
	};
function createDiv () {
	return css.setClass(document.createElement("DIV"),"FullLeft");
}
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
function createNode (nodeDetails) {
	if (nodeDetails.constructor === String) return document.createTextNode(nodeDetails);
	throw Error("creadeNode unknown type, "+JSON.stringify(nodeDetails));
};

function addCloseIcon (o,n) {
//	var t=css.setClass(document.createElement("a"),"MenuText");
//	t.innerText="  ";
//	n.appendChild(t);
	o.closeIcon=css.setClass(o.base.getImage("closeIcon"),"CloseIcon");
	n.appendChild(o.closeIcon);
	o.closeIcon.addEventListener('click', o.onclickClose.bind(o), false);
}

function Action (b,p) {
	Object.assign(this,p);
	this.base=b;
	var a=b.actions[p.id];
	try{
		this.exec=this["exec_"+this.type];
	} catch (e) {
		throw Error(this.type+" action not valid");	
	}
};

function Form(parent) {
	this.element=createTable();
	this.activeFilter=[];
	this.parent=parent;
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
//Form.prototype.button = function (p,t) {
		//this.action(Object.assign({action:"input",type:"button"},p),t)
//	};

Form.prototype.getTargetObject = function () {
		return this.getTargetObject();
	};
Form.prototype.input = function (p,m,t) {
		return this.addItem(Object.assign({action:"input"},p),m,t);
	};
Form.prototype.options = function (s,p) {
		for(var o in p.options) {
			s.appendChild(this.set(document.createElement(p.action),Object.assign(e,p.options[o])));
		}
	};
Form.prototype.select = function (p,m,t) {
	return this.addItem(Object.assign({action:"select"},p),m,t);
	};
Form.prototype.addItem = function (p,m,t) {
		if(p instanceof Array) {
			for(var i=0;i<p.length;i++) {
				this.addItem(p[i],m,t);
			}
			return this;
		}
		var r=createTableRow(this.element);
		if(m) r.mapping=m
		if(t) r.filterTags=(t instanceof Array? t : [t]);
		createTableCell(r).appendChild(createNode(p.title));
		createTableCell(r).appendChild(this.action(p));
		return this;
	};
Form.prototype.getMapping = function () {
		for(var r={}, i=0;i<this.element.rows.length;i++) {
			if(this.element.rows[i].mapping) {
				r[this.element.rows[i].mapping]=this.getValue(i);
			}
		}
		return r;
	};
Form.prototype.setMapping = function (p) {
		if(p== null) {
			console.error("form set mapping no properties provided");
			return;
		}
		for(var m, i=0;i<this.element.rows.length;i++) {
			if(this.element.rows[i].mapping) {
				m=this.element.rows[i].mapping;
				if(m in p) {
					this.setValue(i,p[m]);
				}
			}
		}
		return this;
	};
Form.prototype.getTitleRow = function (t) {
		for(var i=0;i<this.element.rows.length;i++) {
			if(this.element.rows[i].cell[0].innerText==t) {
				return this.element.rows[i];
			}
		}
		throw Error("form title not found for "+t);
	};
Form.prototype.getTitleInputCell = function (t) {
		return this.getTitleRow(t).cell[1];
	};
Form.prototype.getTitleInput = function (t) {
		return this.getTitleInputCell(t).firstChild;
	};
Form.prototype.getValue = function (i) {
		var e=this.element.rows[i].cells[1].firstChild;
		switch(e.nodeName) {
			case "INPUT": return e.value;
			case "SELECT": return e.options[e.selectedIndex].value;
		}
		console.error("Form getValue unknown: "+e.nodeName)
	};
function rgb(r,g,b) {
	return "#"+("00000"+((r<<16)+(g<<8)+b).toString(16)).substr(-6);
}
Form.prototype.setValue = function (i,v) {
		var e=this.element.rows[i].cells[1].firstChild;
		switch(e.nodeName) {
			case "INPUT":
				if(e.type=="color" && !v.startsWith("#")) {
					if(v.startsWith("rgb(")) {
						v=eval(v);
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
Form.prototype.setTitle = function (t,v) {
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
Form.prototype.action = function (p) {
		if(typeof p === 'array') {
			var span=document.createElement("span");
			for(var i=0;i<p.length;i++) {
				span.appendChild(this.action(p[i]));
			}
			return span
		}
		if(typeof p === 'object') 
			return this.set(document.createElement(p.action),Object.assign(p,{draggable:true}),{action:null,title:null});
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

Action.prototype.exec_fileReader = function (e) {
	    var thisObject=this
	    	,request=new XMLHttpRequest();
	    request.onreadystatechange= function() {
	        if (request.readyState==4 && request.status==200) {
	            var regexp = /(?<=addRow\()(.*\n?)(?=\))/gi;      // (?<=beginningstringname)(.*\n?)(?=endstringname)
				var matches = xmlhttp.responseText.match(regexp);
	        }
	    }
	    request.onerror = function(progress){
	    	thisObject.setCatchError(e,new Error("Load failed, check log for details"));
	    };
	    request.open("GET", "file:"+this.passing);
	    request.withCredentials = "true";
    	request.send();
	};
Action.prototype.exec_floatingPane = function (e,ev,p) {
		if(this.passing) {
			if(this.passing) {
				if(this.passing.target instanceof Object) {
					var target=this.passing.target;
				}
			}
		} 
		new PaneFloat(this.base,this.base.getPane(this.pane),Object.assign({y:ev.pageY,x:ev.pageX},this.passing),target);
	};
Action.prototype.exec_menu = function (e) {
		new Error("to be done");
	};
Action.prototype.exec_pane = function (e) {
		var p=new Pane(this.base,this.base.getPane(this.pane));
		e.setDetail(this.title,p.element);
	};
Action.prototype.iframeLoad = function (ev) {
		if(ev.currentTarget.childElementCount>0) return;
		this.iframeError(ev);
	};
Action.prototype.iframeError = function (ev) {
		var base = ev.currentTarget.parentElement
		base.removeChild(base.firstChild);
		new TextArea("Load failed, check log for details",null,base); 
	};
Action.prototype.exec_folder = function (e) {
		if(e.isExpanded()) {
			e.setCollapsed();
		} else {
			e.setExpanded();
		}
	};
Action.prototype.exec_states = function (e) {
		e.nextState(this);
	};
Action.prototype.exec_link = function (e) {
		console.log("Action exec_Link");
		if(this.target==null) {
			window.open(this.url);
			return;
		}
		if(this.target=='_blank') {
			window.open(this.url, '_blank').focus();
			return;
		}
		var iframe =  css.setClass(document.createElement("IFRAME"),"FullLeft");
		iframe.addEventListener('load', this.iframeLoad.bind(this), false);	
		iframe.addEventListener('error', this.iframeError.bind(this), false);	
		iframe.referrerPolicy = "unsafe-url";
		iframe.src=this.url;
		iframe.style="display: inline;";
		iframe.scrolling="auto";
		e.setDetail(this.title,iframe);
	};
Action.prototype.exec_svg = function (e) {
		var p=new Pane(this.base,Object.assign({tab:false},this.base.getPane(this.pane)));
		e.setDetail(this.title,p.element);
		try{
			p.setDetail(new Svg(this.passing).element);
		} catch(ex) {
			this.setCatchError(e,ex);
		}
	};
Action.prototype.exec_googleMap = function (e) {
		try{
		    var mapOption=coalesce(this.passing,{
			        center: new (51.5, -0.12),
			        zoom: 10,
			        mapTypeId: google.maps.MapTypeId.HYBRID
			    });
			e.map = new google.maps.Map(e.element, mapOptions);
		} catch(ex) {
			this.setCatchError(e,ex);
		}
	};
Action.prototype.setCatchError = function (e,ex) {
		console.error("IRender action "+this.type+" error: "+ex+"\nStack: "+ex.stack);	
		e.setDetail(this.title,new TextArea(ex.toString()+"\nStack: "+ex.stack).element).setFullSize();
	};
function CenterRow(parent,b,p,n,o) {
	this.parent=parent;
	this.element=css.setClass(document.createElement("TR"),(o&&o.style?o.style:"CenterRow"));
	n.appendChild(this.element);
	this.centerCell=document.createElement("TD");
	this.element.appendChild(this.centerCell);
	this.table=css.setClass(createTable(1,2),"Table");
	if(coalesce(p.tab,true)) {
			this.tabPane = new TabPane(b,p,this.table.rows[0].cells[1]);
	}
	if(p.hasOwnProperty("leftMenu")) {
		this.menu=new Menu(b,b.menus[p.leftMenu],this.table.rows[0].cells[0],this.tabPane);
	} else {
		this.table.rows[0].cells[0].style.display = 'none';
	}
	this.centerCell.appendChild(this.table);
	this.detail=this.table.rows[0].cells[1]
}
CenterRow.prototype.getTargetObject = function () {
	return this.parent.getTargetObject();
};
CenterRow.prototype.getDetailObject = function () {
		return this.detail.firstChild.iRender;
	};
CenterRow.prototype.content = function (c) {
		this.content=new Form(this).addItem(c);
		this.detail.appendChild(this.content.element);
	};
CenterRow.prototype.appendChild = function (n) {
		this.table.rows[0].cells[1].appendChild(n);
//	this.centerCell.appendChild(n);
	};
CenterRow.prototype.setDetail = function (title,n) {
		return this.tabPane.setDetail(title,n);
	};
function FooterRow(b,p,n,o) {
	this.element=css.setClass(document.createElement("TR"),(o&&o.style?o.style:"Footer"));
	n.appendChild(this.element);
	this.center=css.setClass(document.createElement("TD"),(o&&o.style?o.style:"Footer")+"Cell");
	this.center.appendChild(createNode(p.footer||"No Title Set"));
	this.element.appendChild(this.center);
}
function HeaderRow(b,p,n,o) {
	this.base=b;
	Object.assign(this,o,p);
	this.element=css.setClass(document.createElement("TR"),(o&&o.style?o.style:"HeaderRow"));
	n.appendChild(this.element);
	this.center=document.createElement("TD");
	this.center.appendChild(createNode("\u00a0"+(p.title||"No Title Set")+"\u00a0"));
	this.element.appendChild(this.center);
	if(p.right) {
		for(var i in p.right) {
			var icon=p.right[i];
			if("image"in icon) {
				var iconNode=css.setClass(this.base.getImage(icon.image),"CellRight");
				iconNode.addEventListener('click', this.onclickAction.bind(this), false);
				iconNode.iRenderAction=this.base.actions[icon.action];
				this.center.appendChild(iconNode);
			}
		}
	}
	if(p.closable) {
		addCloseIcon(this,this.center);
	}
}

HeaderRow.prototype.onclickAction = function (ev) {
		ev.stopPropagation();
		var action=ev.currentTarget.iRenderAction
		action.exec(this,ev,this.passing);
	};
HeaderRow.prototype.onclickClose = function (e) {
		e.stopPropagation();
		this.pane.close(e);
	};
function Menu(b,p,n,t) {
	this.base=b;
	this.parent=n;
	this.target=t;
	this.resizeHover=false;
	if(!p.subMenu)
		css.setClass(n,"MenuCell");
	this.element=css.setClass(document.createElement("TABLE"),"Menu")
	this.options={};
	for(var option in p.options){
		this.addOption(option,p.options[option]);
	}
	n.appendChild(this.element);
	if(!p.subMenu)
		n.addEventListener('mousemove', this.mousemove.bind(this), false);	
}
Menu.prototype.addOption = function (o,p) {
		this.options[o] = new MenuOption(this.base,p,this);
	};
Menu.prototype.appendChild = function (n) {
		this.element.appendChild(n);
	};
Menu.prototype.mousemove = function (e) {
		//* resize
		if (e.clientX > e.currentTarget.clientWidth) {
			if(this.resizeHover==false) {
				css.addClass(this.parent,"resizeVertical");
				this.resizeHover=true;
			}
		} else if(this.resizeHover==true) {
			this.resizeHover=false;
			 css.removeClass(this.parent,"resizeVertical");
		}
	};
Menu.prototype.select = function (o) {
		if(o==null) return;
		fireEvent(this.find(o).element, "click");
	};
Menu.prototype.setDetail = function (t,n) {
		return this.target.setDetail(t,n);
	};
Menu.prototype.find = function (t) {
		for(var option in this.options){
			if(this.options[option].title==t) return this.options[option];
		}
		throw Error("menu option "+t+" not found");
	};
function MenuOption(b,p,parent) {
	this.base=b;
	Object.assign(this,p);
	this.actionObject=this.base.actions[this.action];
	this.element=css.setClass(document.createElement("TR"),"MenuOption");
	this.expandCell=document.createElement("TD");
	this.iconCell=document.createElement("TD");
	this.textCell=document.createElement("TD");
	this.element.iRender= p;
	this.element.addEventListener('click', this.onclick.bind(this), false);
	switch(p.action) {
		case "folder":
			this.setCollapsed();
			break;
		case "states":
			this.state=0;
			this.iconCell.appendChild(this.base.getImage(this.actionObject.passing[0].image));
			break;
		default:
			this.iconCell.appendChild(b.getImage(coalesce(p.image,"file")));
	}
	this.textA=css.setClass(document.createElement("a"),"MenuText");
	this.textA.innerText=coalesce(this.title,this.actionObject.title,"*** no title specifed *** ");
	this.textCell.appendChild(this.textA);
	this.element.appendChild(this.expandCell);
	this.element.appendChild(this.iconCell);
	this.element.appendChild(this.textCell);
	this.properties=p;
	this.parent=parent;
	parent.appendChild(this.element);
}
MenuOption.prototype.nextState = function (a) {
		this.iconCell.removeChild(this.iconCell.firstChild);
		if(++this.state>=a.passing.length) this.state=0;
		this.iconCell.appendChild(this.base.getImage(a.passing[this.state].image));
	};
MenuOption.prototype.isExpanded = function () {
		return (this.expandCell.innerText=="-");
	};
MenuOption.prototype.setExpanded = function (b) {
		this.expandCell.innerText="-";
		this.iconCell.removeChild(this.iconCell.firstChild);
		this.iconCell.appendChild(this.base.getImage("folderOpen"));
		
		if(this.textCell.lastChild.nodeName=="TABLE") {
			this.textCell.lastChild.style.display="TABLE";
			return;
		}
		if (!("menu" in this.passing)) throw Error("no menu entry specified pasy options");
		this.menu=new Menu(this.base,Object.assign({subMenu:true},this.base.menus[this.passing.menu]),this.textCell,this.parent.target);
	};
MenuOption.prototype.setCollapsed = function () {
		this.expandCell.innerText="+";
		try{
			this.iconCell.removeChild(this.iconCell.firstChild);
		} catch(ex) {}
		this.iconCell.appendChild(this.base.getImage("folderClose"));
		if(this.textCell.childElementCount>1) this.textCell.lastChild.style.display="none";
	};
MenuOption.prototype.setDetail = function (t,n) {
		return this.parent.setDetail(coalesce(this.title,t),n);
	};
MenuOption.prototype.onclick = function (ev) {
		ev.stopPropagation();
		this.actionObject.exec(this,ev,this.passing);
	};
function Pane(b,p,n,t) {
	this.base=b;
	this.target=t;
	Object.assign(this,p);
	this.element=css.setClass(createTable(),"Table");
	this.element.IRender=this;
	var header=Object.assign({},p.header,{closable:p.closable ,title:p.title,pane:this});
	if(header) this.headerRow=new HeaderRow(b,header,this.element,{style:"Header"});
	this.centerRow=new CenterRow(this,b,p,this.element);
	if(p.hasOwnProperty("footer")) this.footerRow=new FooterRow(b,p,this.element,{style:"Footer"});
	if(n) n.appendChild(this.element);
	if(p.hasOwnProperty("content")) this.centerRow.content(p.content);
}
Pane.prototype.close = function (e) {
		if(this.element.iRender) {
			this.element.iRender.tabPane.close(this.element.iRender.title);
		}
		this.element.parentElement.removeChild(this.element);
		delete this;
	};
//Pane.prototype.sizeCenter = function () {
//		this.centerNode.style.height= this.element.clientHeight
//				-(this.headerNode?this.headerNode.element.getBoundingClientRect().Height:0)
//				-(this.footerNode?this.footerNode.element.getBoundingClientRect().Height:0);
//	};
Pane.prototype.appendChild = function (n) {
		this.centerRow.appendChild(n);
	};
Pane.prototype.getDetailObject = function () {
		return this.centerRow.getDetailObject();
	};
Pane.prototype.getTarget = function () {
		return this.target||this;
	};
Pane.prototype.setDetail = Pane.prototype.appendChild;
function PaneFloat(b,p,o,t) {
	this.pane=new Pane(b,Object.assign({},p,{closable:true,tab:false}),b.floatHandle,t);
	css.setClass(this.pane.element,"PaneFloat");
	this.position(o.x,o.y);
	if(o) {
		if("message" in o) {
			this.pane.appendChild(Text(o.message));
		}
	}
}
//PaneFloat.prototype.size = function () {
		//
//	};
PaneFloat.prototype.position = function (x,y) {
		var e=this.pane.element
			,a=this.pane.base.getAdjustedPosition(x,y,e);
		e.style.left=a.x+"px";
		e.style.top=a.y+"px";
	};
PaneFloat.prototype.close = function () {
		this.pane.element.parentElement.removeChild(this.pane.element);
		delete this;
	};
function PaneRow(b,p,n) {
	this.element=css.setClass(document.createElement("TR"),"TableRow");
	n.appendChild(this.element);
	this.center=document.createElement("TD");
	this.centerCell=new Pane(b,p,n);
	this.element.appendChild(this.centerCell.element);
}
function TabPane(b,p,parent) {
	this.base=b;
	this.element=parent;
	this.tabs=createTable();
	this.tabsRow=createTableRow(this.tabs);
	this.panes=css.setClass(createTable(),"Table");
	this.panesRow=css.setClass(createTableRow(this.panes),"Row");
	this.table=css.setClass(createTable(2,1),"Table");
	this.table.rows[0].style.height="30px";
	this.tabsHide();
	this.table.rows[0].cells[0].appendChild(this.tabs);
	this.table.rows[1].cells[0].appendChild(this.panes);
	css.setClass(this.table.rows[1].cells[0],"TabPaneCell");
	this.element.appendChild(this.table);
}
TabPane.prototype.close = function (t) {
		var i=this.find(t);
		this.activeTab=null;
		this.panesRow.deleteCell(i);
		this.tabsRow.deleteCell(i);
		if(this.tabsRow.cells.length<1) return;
		if(i>=this.tabsRow.cells.length) i--;
		this.setCurrent(i);
	};
TabPane.prototype.onclick = function (ev) {
	this.hideCurrent();
	this.setCurrent(ev.currentTarget.cellIndex);
};
TabPane.prototype.onclickClose = function (ev) {
	this.close(ev.currentTarget.cellIndex);
};
TabPane.prototype.setCurrent = function (i) {
	this.panesRow.cells[i].style.display = 'table-cell';
	this.tabsRow.cells[i].style.backgroundColor="LightGrey";
	this.activeTab=i;
};
TabPane.prototype.hideCurrent = function (e) {
		if(this.activeTab==null) return;
		this.panesRow.cells[this.activeTab].style.display = 'none';
		this.tabsRow.cells[this.activeTab].style.backgroundColor="";
		this.activeTab=null;
	};
TabPane.prototype.setFullSize = function (n) {
		var c=this.panesRow.cells[this.activeTab];
		if(n==undefined) {
			n=c.lastChild;
		}
		n.style.width=c.clientWidth+"px";
		n.style.height=c.clientHeight+"px";
		return this;
};
TabPane.prototype.find = function (t,f) {
		for(var i=0; i<this.tabsRow.cells.length;i++ ) {
			if(this.tabsRow.cells[i].firstChild.innerText==t) return i
		}
		return null
	};
TabPane.prototype.setDetail = function (t,n) {
		this.hideCurrent();
		var i=this.find(t);
		if(i!==null) {
			this.activeTab=i;
			while (this.panesRow.cells[i].firstChild) {
				this.panesRow.cells[i].removeChild(this.panesRow.cells[i].firstChild);
			}
			this.panesRow.cells[i].appendChild(n);
			this.setCurrent(i);
			return;
		}
		var ct=css.setClass(createTableCell(this.tabsRow),"Tab")
			,cp=css.setClass(createTableCell(this.panesRow),"TabDetail");
		ct.addEventListener('click', this.onclick.bind(this), false);	
		var ctt=css.setClass(document.createElement("a"),"MenuText");
		ctt.innerText=t;
		ct.appendChild(ctt);
		addCloseIcon(this,ct);
		this.setCurrent(this.tabsRow.cells.length-1);
		n.iRender={tabPane:this,title:t};
		cp.appendChild(n);
		if(this.tabsRow.cells.length>1) this.tabsUnhide();
		return this;
	};
TabPane.prototype.tabsHide = function () {
		this.table.rows[0].style.display="none";
	};
TabPane.prototype.tabsUnhide = function () {
		this.table.rows[0].style.display="table-row";;
	};
function Text(t) {
	var n=document.createElement("a");
	n.innerText=t;
	return n;
}
function TextArea(v,o,n) {
	this.element=document.createElement("textarea");
	if(o) Object.assign(this.element,o);
	this.element.iRender=this;
	this.element.value=v;
	this.appendTo(n);
}
TextArea.prototype.appendTo = function (n) {
	if(n) {
		this.element.style.width=n.clientWidth+"px";
		this.element.style.height=n.clientHeight+"px";
		n.appendChild(this.element);
	}
	return this;
};
function Table() {
	this.element=document.createElement("TABLE");
}
Table.prototype.addRow = function () {
	this.appendCell(new Cell(this));
	return this;
};
Table.prototype.appendRow = function (row) {
	this.element.appendChild(row.element);
	return this;
};
function Row(table) {
	this.table=table;
	this.element=document.createElement("TR");
	table.appendRow(this);
}
Row.prototype.addCell = function () {
		this.appendCell(new Cell(this));
		return this;
	};
Row.prototype.appendCell = function (cell) {
		this.element.appendChild(cell.element);
		return this;
	};
function Cell(row) {
	this.row=row;
	this.element=document.createElement("TD");
	row.appendCell(this);
}
function Window (b,p,n) {
	this.element=css.setClass(createTable(),"Table");
	if(p.title) document.title=p.title;
	this.headerRow=new HeaderRow(b,p,this.element,{style:"HeaderMain"});
	this.centerRow=new PaneRow(b,b.panes[p.pane],this.element);	
	this.footerRow=new FooterRow(b,p,this.element,{style:"FooterMain"});
	n.append(this.element);
	b.floatHandle=n;
//	this.sizeCenter();
}	
Window.prototype.sizeCenter = function () {
		// rect is a DOMRect object with eight properties: left, top, right, bottom, x, y, width, height
		this.centerNode.element.height = (this.element.clientHeight
				-(this.headerNode?this.headerRow.element.getBoundingClientRect().height:0)
				-(this.footerNode?this.footerRow.element.getBoundingClientRect().height:0)
				) + "px";
	};
function IRenderClass() {
    this.styleSheet = document.getElementById("IRenderCSS");
    if (this.styleSheet===null) {
    	console.log("IRenderClass define stylesheet IRenderCSS");
    	this.styleSheet = document.createElement("style");
    	this.styleSheet.type = "text/css";
    	this.styleSheet.id = "IRenderCSS";
    	document.getElementsByTagName("head")[0].appendChild(this.styleSheet);
    	this.rule=this.styleSheet.sheet.insertRule?this.cssInsertRule:this.cssAddRule;
    	this.add("CloseIcon","float:right;height: 12px; width: 12px;  border: 4px; margin: 0px 0px 0px 4px;");
    	this.add("CellRight","float:right;");
    	this.add("CellRight:hover","cursor: pointer; filter: invert(100%);");
    	this.add("CellRight:focus","cursor: pointer; filter: invert(100%);");
    	this.add("HeaderMain","background-color: LightSkyBlue; height: 25px; width: 100%; text-align: center;  padding: 1px; display: table-row;");
    	this.add("Header","background-color: LightGrey; height: 25px; width: 100%; text-align: center; vertical-align:top ;");
    	this.add("FooterMain","background-color: LightSkyBlue; height: 25px; width: 100%; text-align: center; display: table-row;");
    	this.add("FooterMainCell","background-color: LightSkyBlue; display: table-cell;");
    	this.add("Footer","background-color: LightGrey; width: 100%; text-align: center;");
    	this.add("DetailPane"," width: 100%; overflow: auto;");
    	this.add("MenuCell","vertical-align: top; width: 200px; height: 100%; border-right-style: solid; border-right-color: LightGrey; border-right-width: 5px;");
    	this.add("Menu","vertical-align: top;");
    	this.add("MenuText:hover","background: LightGrey;");
    	this.add("MenuOption","height: 20px; vertical-align: top;");
    	this.add("PaneFloat","min-width: 100px; min-height: 100px;"
    			+"position:absolute; filter: alpha(opacity=100); -moz-opacity: 1; background-color:white; opacity: 1; padding:0px;"
    			+"overflow:auto; z-index:99999; background-color:#FFFFFF; border: 1px solid #a4a4a4;")
    	this.add("resizeVertical:hover","cursor: ew-resize;");
       	this.add("Tab","height: 20px; float: left; border: medium solid LightGrey; border-top-left-radius: 5px; border-top-right-radius: 10px;");
       	this.add("TabDetail","");
    	this.add("TabPaneCell","border-top-style: solid; border-top-color: LightGrey;");
       	this.add("FullLeft","display: inline-block; height: 100%; width: 100%; background-color: white;");
       	this.add("Table","display: table; height: 100%; width: 100%; border-spacing: 0px;");
       	this.add("TableCell","background-color: inherit");
       	this.add("TableRow","display: table-row;");
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
  		this.rule.call(this,name,rules);
  		return this;
	};
IRenderClass.prototype.cssInsertRule = function (name,rules) {
	   this.styleSheet.sheet.insertRule('.IRender'+name+"{"+rules+"}",0);
	   return this;
    };
IRenderClass.prototype.cssAddRule = function (name,rules) {
	   this.styleSheet.sheet.addRule('.IRender'+name, rules);
	   return this;
    };
IRenderClass.prototype.setClass = function (n,name) {
		n.className="IRender"+name;
		return n;
	};
IRenderClass.prototype.addClass = function (n,name) {
		n.classList.add("IRender"+name);
		return n;
	};
IRenderClass.prototype.removeClass = function (n,name) {
		n.classList.remove("IRender"+name);
		return n;
	};
IRenderClass.prototype.replaceClass = function (n,name) {
		return css.addClass(css.removeClass(n,from),to);
	};
IRenderClass.prototype.resetClass = function (n,name) {
		return css.removeClass(n,name,name);
	};
	
var css = new IRenderClass();

function IRender() {
	this.actions={folder:{type:"folder"}};
	this.guid=0;
	this.metadata = {
			action: {id:null,type:["link","pane","svg","googleMap"],url:null,title:null,target:null,pane:null,passing:null}
			,image: {id:null ,file:null}
			,menu: {id:null ,options:{"default":Array.constructor}}
			,menuOption: {title:null ,action:null ,passing:null}
			,pane: {id:null ,title:null, leftMenu:null,show:null ,closable:null ,header:null ,footer:null, content:null}
			,window: {title:{"default":"No Title Specified"},footer:{"default":"No Footer Specified"},pane:null}
		};
	this.panes={};
	this.window={};
	this.menus={};
	this.images={file:"file.gif",folderOpen:"folderOpen.gif",folderClose:"folderClose.gif"}
	this.imageBase="images/";
	this.addAction({id:"folder",type:"folder"});
	this.addImage({id:"loadingPageIcon",file:"loadingpage_small.gif"});
	this.addImage({id:"closeIcon",file:"close_s.gif"});
}
IRender.prototype.getImage = function(n) {
		var i = new Image(16,16);
		i.src=this.imageBase+this.images[n];
		return i;
	};
IRender.prototype.getPane = function(n) {
		if(n in this.panes)	return this.panes[n];
		throw Error("Pane "+n+" not found");
	};
IRender.prototype.addAction = function(p) {
		this.checkProperties(p,"action");
		this.actions[p.id]=new Action(this,p);
		return this;
	};
IRender.prototype.addImage = function(p) {
		this.checkProperties(p,"image");
		this.images[p.id]=p.file;
        return this;
	};
IRender.prototype.addMenu = function(p) {
		this.checkProperties(p,"menu");
		this.menus[p.id]=p;
		return this;
	};
IRender.prototype.addMenuOption = function(m,p) {
		this.checkProperties(p,"menuOption");
		if(!(m in this.menus)) throw Error("menu not found for "+m)
		this.menus[m].options.push(p);
		return this;
	};
IRender.prototype.addPane = function(p) {
		this.checkProperties(p,"pane");
		this.panes[p.id]=p;
        return this;
	};
IRender.prototype.attributes = function(a) {
		if(a===null) return "";
		var r="";
		for(var p in a)
			r+=" "+p+"='"+a[p]+"'";
		return r;
	};
IRender.prototype.build = function() {
		console.log("IRender build");
		this.setAllNodes('IRender',this.buildBase);
        return this;
	};
IRender.prototype.buildBase = function(n) {
		try{var f=this[n.nodeName];} catch(e) {
			console.error("IRender buildBase ignored tag "+n.nodeName.toString());	
			return this;
		}
		try{f.apply(this,[n]);} catch(e) {
			console.log("IRender buildBase "+e);	
			console.error("IRender buildBase tag "+n.nodeName.toString()+ "error: "+e+"\nStack: "+e.stack);	
		}
        return this;
	};
IRender.prototype.BODY = function(n) {
		this.windowObject=new Window(this,this.window,n);
	};
IRender.prototype.getAdjustedPosition = function(x,y,n) {
		// rect is a DOMRect object with eight properties: left, top, right, bottom, x, y, width, height
		var window=this.windowObject.element.getBoundingClientRect()
			,pane=n.getBoundingClientRect()
			,paneEndx=x+pane.width
			,paneEndy=y+pane.height
			,ax=(paneEndx<window.width?x:x-paneEndx+window.width)
			,ay=(paneEndy<window.height?y:y-paneEndy+window.height);
		return {x:ax,y:ay};
	};

IRender.prototype.checkProperties = function(o,e) {
		var ps=this.metadata[e];
		for(var p in o)
			if(!p.inList(ps))
				throw Error("invalid property "+p+" for "+e);
		for(var p in ps) {
			if(!o.hasOwnProperty(p)) {
				if(ps[p]!==null) {
					var d=coalesce(ps[p]["default"],null);
					if(d == Array.constructor) {
						o[p] = [];
					} else if(d == Object.constructor) {
						o[p] = {};
					} else if(d instanceof Function) {
						o[p] = new d();
					} else if(d instanceof Array) {
						if (ps[p] in d)
							throw Error("unknown value for "+p+" found "+ps[p]+" expecting "+d.join());
					} else {
						op[p]= d;
					}
				}
			}
		}
		return this;
	};
IRender.prototype.header = function(a,n) {
		return this.tag("header",a,coalesce(n,this.window.title,"No Title Set"));
	};
IRender.prototype.insertFooter = function(n) {
		console.log("IRender insertFooter");
		var h = css.setClass(document.createElement("FOOTER"),"Footer");
		h.appendChild(this.createNode(coalesce(this.window.footer,"No Footer Set")));
		n.appendChild(h);
        return this;
	};
IRender.prototype.insertHeader = function(n) {
		console.log("IRender insertHeader");
		var h = css.setClass(document.createElement("HEADER"),"Header");
		h.appendChild(createNode(coalesce(this.window.title,"No Title Set")));
		if(n.childNodes.length>0)
			n.insertBefore(h,n.childNodes[0]);
		else
			n.appendChild(h);
        return this;
	};
IRender.prototype.input = function(a,n) {
		return this.tag("input",a,n);
	};
IRender.prototype.options = function(id,o) {
		var r="";
		for(var i in o)
			r+=this.tag("option",{label:i},o[i]);
		return this.tag("select",{id:id},r);
	};
IRender.prototype.getPaneDetail = function(id,node) {
//	 	for(var p=node.parentNode;node.name!=="";p=node.parentNode) continue;
	 	
	};
IRender.prototype.setAllNodes = function(c,f) {
		var f=coalesce(f,this[c],null);
		if(f===null) return;
		for(var ns = document.getElementsByClassName(c),nsl=ns.length,i=0;i<nsl;i++)
			f.apply(this,[ns[i]]);
        return this;
	};
IRender.prototype.setAllProperties = function(t,p,m) {
		for(var i in p)
			t[i]=coalesce(p[i],(m.default?m.default[i]:null));
        return this;
	};
IRender.prototype.setWindow = function(p) {
		this.checkProperties(p,"window");
		this.window=p;
		this.setAllProperties(this.window,p,this.metadata.window);
        return this;
	};
//IRender.prototype.submitButton = function() {
//		return this.input({type:"submit",value:"Submit"});
//	};
IRender.prototype.tag = function(tag,a,n) {
		return "<"+tag+this.attributes(a)+">"+coalesce(n,"")+"</"+tag+">";
	};
//	module.exports=IRender;
	
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function(require) {
	    //The value returned from the function is
	    //used as the module export visible to Node.
	    return IRender;
	});