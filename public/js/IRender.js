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
   		
function fireEvent(node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9){
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

     if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
                eventClass = "MouseEvents";
                break;
            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;
            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                break;
        }
        var event = doc.createEvent(eventClass);
        event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.
        event.synthetic = true; // allow detection of synthetic events
        // The second parameter says go ahead with the default action
        node.dispatchEvent(event, true);
    } else  if (node.fireEvent) {
        // IE-old school style, you can drop this if you don't need to support IE8 and lower
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
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
Action.prototype.exec_floatingPane = function (e) {
	};
Action.prototype.exec_pane = function (e) {
		var p=new Pane(this.base,this.base.panes[this.pane]);
		e.setDetail(this.title,p.element);
	};
Action.prototype.iframeLoad = function (e) {
		console.log("iframeLoad");
	};
Action.prototype.iframeError = function (e) {
		console.log("iframeError");
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
		try{
			e.setDetail(this.title,new Svg(this.passing).element);
		} catch(ex) {
			this.setCatchError(e,ex);
		}
	};
Action.prototype.exec_googleMap = function (e) {
		try{
		    var mapOptions = this.passing||{
			        center: new google.maps.LatLng(51.5, -0.12),
			        zoom: 10,
			        mapTypeId: google.maps.MapTypeId.HYBRID
			    };
			e.map = new google.maps.Map(e.element, mapOptions);
		} catch(ex) {
			this.setCatchError(e,ex);
		}
	};
Action.prototype.setCatchError = function (e,ex) {
		console.error("IRender action "+this.type+" error: "+ex+"\nStack: "+ex.stack);	
		e.setDetail(this.title,new TextArea(ex.toString()+"\nStack: "+ex.stack,{height:"100%"}).element);
	};
function CenterRow(b,p,n,o) {
	this.element=css.setClass(document.createElement("TR"),(o&&o.style?o.style:"CenterRow"));
	n.appendChild(this.element);
	this.centerCell=document.createElement("TD");
	this.element.appendChild(this.centerCell);
	this.table=css.setClass(createTable(1,2),"Table");
	this.tabPane = new TabPane(b,p,this.table.rows[0].cells[1]);
	if(p.hasOwnProperty("leftMenu")) {
		this.menu=new Menu(b,b.menus[p.leftMenu],this.table.rows[0].cells[0],this.tabPane);
	} else {
		this.table.rows[0].cells[0].style.display = 'none';
	}
	this.centerCell.appendChild(this.table);
}
CenterRow.prototype.appendChild = function (n) {
	this.centerCell.appendChild(n);
};
CenterRow.prototype.setDetail = function (title,n) {
	this.tabPane.setDetail(title,n);
};
function Footer (b,p,n,o) {
	this.element=css.setClass(document.createElement("DIV"),(o&&o.style?o.style:"Footer"));
	this.element.appendChild(createNode(p.footer||"No Footer Set"));
	this.parent=n;
	n.appendChild(this.element);
}
function FooterRow(b,p,n,o) {
	this.element=css.setClass(document.createElement("TR"),(o&&o.style?o.style:"Footer"));
	n.appendChild(this.element);
	this.center=css.setClass(document.createElement("TD"),(o&&o.style?o.style:"Footer")+"Cell");
	this.center.appendChild(createNode(p.footer||"No Title Set"));
	this.element.appendChild(this.center);
}
function Header(b,p,n,o) {
	p.header=this;
	this.element=css.setClass(document.createElement("DIV"),(o&&o.style?o.style:"Header"));
	this.element.appendChild(createNode(p.title||"No Title Set"));
	this.parent=n;
	n.appendChild(this.element);
}
function HeaderRow(b,p,n,o) {
	this.element=css.setClass(document.createElement("TR"),(o&&o.style?o.style:"HeaderRow"));
	n.appendChild(this.element);
	this.center=document.createElement("TD");
	this.center.appendChild(createNode(p.title||"No Title Set"));
	this.element.appendChild(this.center);
}
function Menu(b,p,n,t) {
	this.target=t;
	this.resizeHover=false;
	css.setClass(n,"MenuCell")
	this.element=document.createElement("TABLE");
	this.options={};
	for(var option in p.options){
		this.options[option] = new MenuOption(b,p.options[option],this);
	}
	this.parent=n;
	n.appendChild(this.element);
	n.addEventListener('mousemove', this.mousemove.bind(this), false);	
}
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
		this.target.setDetail(t,n);
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
	this.element=css.setClass(document.createElement("TR"),"MenuOption");
	this.expandCell=document.createElement("TD");
	this.iconCell=document.createElement("TD");
	this.textCell=css.setClass(document.createElement("TD"),"MenuText");
	this.element.iRender= p;
	this.element.addEventListener('click', this.onclick.bind(this), false);
	switch(p.action) {
		case "folder":
			this.setCollapsed();
			break;
		case "states":
			this.state=0;
			this.iconCell.appendChild(this.base.getImage(b.actions[p.action].passing[0].image));
			break;
		default:
			this.iconCell.appendChild(b.getImage(p.image||"file"));
	}
	this.textCell.innerText=this.title;
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
MenuOption.prototype.setExpanded = function () {
		this.expandCell.innerText="-";
		this.iconCell.removeChild(this.iconCell.firstChild);
		this.iconCell.appendChild(this.base.getImage("folderOpen"));
	};
MenuOption.prototype.setCollapsed = function () {
		this.expandCell.innerText="+";
		try{
			this.iconCell.removeChild(this.iconCell.firstChild);
		} catch(ex) {}
		this.iconCell.appendChild(this.base.getImage("folderClose"));
	};
MenuOption.prototype.setDetail = function (t,n) {
		this.parent.setDetail(this.title||t,n);
	};
MenuOption.prototype.onclick = function (e) {
		this.base.actions[this.action].exec(this);
	};
function Pane(b,p,n) {
	this.element=css.setClass(createTable(),"Table");
	var header=(p.hasOwnProperty("header")?p.header:(p.hasOwnProperty("title")?{title:p.title}:null))
	if(header) this.headerRow=new HeaderRow(b,header,this.element,{style:"Header"});
	this.centerRow=new CenterRow(b,p,this.element);
	if(p.hasOwnProperty("footer")) this.footerRow=new FooterRow(b,p,this.element,{style:"Footer"});
	if(n) n.appendChild(this.element);
}
Pane.prototype.sizeCenter = function () {
		this.centerNode.style.height= this.element.clientHeight
				-(this.headerNode?this.headerNode.element.getBoundingClientRect().Height:0)
				-(this.footerNode?this.footerNode.element.getBoundingClientRect().Height:0);
	};
Pane.prototype.appendChild = function (n) {
		this.centerNode.appendChild(n);
	};
Pane.prototype.setDetail = function (title,n) {
		this.tabPane.setDetail(title,n);
	};
function PaneRow(b,p,n) {
	this.element=css.setClass(document.createElement("TR"),"TableRow");
	n.appendChild(this.element);
	this.center=document.createElement("TD");
	this.centerCell=new Pane(b,p,n);
	this.element.appendChild(this.centerCell.element);
}
function TabPane(b,p,parent) {
	this.element=parent;
	this.tabs=createTable();
	this.tabsRow=createTableRow(this.tabs);
	this.panes=css.setClass(createTable(),"Table");
	this.panesRow=css.setClass(createTableRow(this.panes),"Row");
	
	this.table=css.setClass(createTable(2,1),"Table");
	this.table.rows[0].style.height="30px";
	this.tabsHide();
	this.table.rows[0].cells[0].appendChild(this.tabs);;
	this.table.rows[1].cells[0].appendChild(this.panes);
	css.setClass(this.table.rows[1].cells[0],"TabPaneCell");
	this.element.appendChild(this.table);
}
TabPane.prototype.onclick = function (e) {
	this.hideCurrent();
	this.setCurrent(e.currentTarget.cellIndex);
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
TabPane.prototype.setDetail = function (t,n) {
		this.hideCurrent();
		for(var done, i=0; i<this.tabsRow.cells.length;i++ ) {
			if(this.tabsRow.cells[i].innerText==t) {
				this.activeTab=i;
				while (this.panesRow.cells[i].firstChild) {
					this.panesRow.cells[i].removeChild(this.panesRow.cells[i].firstChild);
				}
				this.panesRow.cells[i].appendChild(n);
				this.setCurrent(i);
				return;
			}
		}
		var ct=css.setClass(createTableCell(this.tabsRow),"Tab")
			,cp=css.setClass(createTableCell(this.panesRow),"TabDetail");
		ct.addEventListener('click', this.onclick.bind(this), false);	
		ct.innerText=t;
		this.setCurrent(this.tabsRow.cells.length-1);
		cp.appendChild(n);
		if(this.tabsRow.cells.length>1) this.tabsUnhide();
	};
TabPane.prototype.tabsHide = function () {
		this.table.rows[0].style.display = 'none';
	};
TabPane.prototype.tabsUnhide = function () {
		this.table.rows[0].style.display = 'table-row';;
	};
function TextArea(v,o,n) {
	this.element=document.createElement("textarea");
	if(o) Object.assign(this.element,o);
	this.element.irender=this;
	this.element.value=v; 
	this.appendTo(n);
}
TextArea.prototype.appendTo = function (n) {
	if(n) this.appendChild(n)
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
    	this.add("HeaderMain","background-color: LightSkyBlue; height: 25px; width: 100%; text-align: center;  padding: 1px; display: table-row;");
    	this.add("Header","background-color: LightGrey; height: 25px; width: 100%; text-align: center; vertical-align:top ;");
    	this.add("FooterMain","background-color: LightSkyBlue; height: 25px; width: 100%; text-align: center; display: table-row;");
    	this.add("FooterMainCell","background-color: LightSkyBlue; display: table-cell;");
    	this.add("Footer","background-color: LightGrey; width: 100%; text-align: center;");
    	this.add("DetailPane"," width: 100%; overflow: auto;");
    	this.add("MenuCell","vertical-align: top; width: 200px; height: 100%; border-right-style: solid; border-right-color: LightGrey; border-right-width: 5px;");
    	this.add("Menu","width: 200px; height: 100%; float: left; border-right-style: solid; border-right-color: LightGrey; border-right-width: 5px;");
    	this.add("MenuText:hover","background: LightGrey;");
    	this.add("MenuOption","height: 20px;");
    	this.add("resizeVertical:hover","cursor: ew-resize;");
       	this.add("Tab","height: 20px; float: left; border: medium solid LightGrey; border-top-left-radius: 5px; border-top-right-radius: 10px;");
//       	this.add("TabDetail","height: 100%; width: 100%; float: left;");
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
			,option: {title:null ,action:null}
			,pane: {id:null ,title:null, leftMenu:null,show:null}
			,window: {title:{"default":"No Title Specified"},footer:{"default":"No Footer Specified"},pane:null}
		};
	this.panes={};
	this.window={};
	this.menus={};
	this.images={file:"file.gif",folderOpen:"folderOpen.gif",folderClose:"folderClose.gif"}
	this.imageBase="images/";
	this.addAction({id:"folder",type:"folder"});
}
IRender.prototype.getImage = function(n) {
		var i = new Image(16,16);
		i.src=this.imageBase+this.images[n];
		return i;
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
		this.checkProperties(p,"option");
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
		console.log("IRender buildBase");
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
	console.log("IRender BODY");
	new Window(this,this.window,n);
}	

IRender.prototype.checkProperties = function(o,e) {
		var ps=this.metadata[e];
		for(var p in o)
			if(!p.inList(ps))
				throw Error('invalid property '+p+" for "+e);
		for(var p in ps) {
			if(!o.hasOwnProperty(p)) {
				if(ps[p]!==null) {
					var d=ps[p]["default"]||null;
					if(d == Array.constructor) {
						o[p] = [];
					} else if(d == Object.constructor) {
						o[p] = {};
					} else if(d instanceof Function) {
//						o[p] =  new (d.bind.apply(d, []))();
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
		return this.tag("header",a,n||this.window.title||"No Title Set");
	};
IRender.prototype.insertFooter = function(n) {
		console.log("IRender insertFooter");
		var h = css.setClass(document.createElement("FOOTER"),"Footer");
		h.appendChild(this.createNode(this.window.footer||"No Footer Set"));
		n.appendChild(h);
        return this;
	};
IRender.prototype.insertHeader = function(n) {
		console.log("IRender insertHeader");
		var h = css.setClass(document.createElement("HEADER"),"Header");
		h.appendChild(createNode(this.window.title||"No Title Set"));
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
		var f=f||this[c]||null;
		if(f===null) return;
		for(var ns = document.getElementsByClassName(c),nsl=ns.length,i=0;i<nsl;i++)
			f.apply(this,[ns[i]]);
        return this;
	};
IRender.prototype.setAllProperties = function(t,p,m) {
		for(var i in p)
			t[i]=p[i]||this.metadata.window.default[i]||null;
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
		return "<"+tag+this.attributes(a)+">"+(n||"")+"</"+tag+">";
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