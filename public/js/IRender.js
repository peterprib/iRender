
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
function eventFire(e, etype){
	if (e.fireEvent) {
		e.fireEvent('on' + etype);
	} else {
		var event = document.createEvent('Events');
		event.initEvent(etype, true, false);
		e.dispatchEvent(event);
	}
}
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
function createTable (rows,cols) {
   			var t=document.createElement("TABLE");
//   			rows=rows||1;
//   			cols=cols||1;
   			while (t.rows.length<rows) {
   				var r=document.createElement("TR");
   				t.appendChild(r);
   				while (r.cells.length<cols) {
   					var c=document.createElement("TD");
   					c.appendChild(c);
   				}
   			}
   			return t;
   		}
function createTableRow (t) {
	var r=document.createElement("TR");
	t.appendChild(r);
	return r;
}
function createTableCell (r) {
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
Action.prototype.exec_pane = function (e) {
		var p=new Pane(this.base,this.base.panes[this.pane]);
		e.setDetail(this.title,p.element);
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
		var iframe = document.createElement("IFRAME");
		iframe.src = 'about:blank';
		iframe.src=this.url;
		iframe.style="display: inline;";
		e.setDetail(this.title,iframe);
		//oSession.oResponse.headers.Remove("X-Frame-Options");
		//oSession.oResponse.headers.Add("Access-Control-Allow-Origin", "*");
	
/*		browser.webRequest.onHeadersReceived.addListener(
			    function(info) {
			        var headers = info.responseHeaders;
			        for (var i=headers.length-1; i>=0; --i) {
			            var header = headers[i].name.toLowerCase();
			            if (header == 'x-frame-options' || header == 'frame-options') {
			                headers.splice(i, 1); // Remove header
			            }
			        }
			        return {responseHeaders: headers};
			    },
			    {
*///			        urls: [ '*://*/*' ], // Pattern to match all http(s) pages
/*			        types: [ 'sub_frame' ]
			    },
			    ['blocking', 'responseHeaders']
			);
			
			browser.webRequest.onHeadersReceived.addListener();
			
/*		
		  mainWindow.webContents.session.webRequest.onHeadersReceived({}, (d, c) => {
			    if(d.responseHeaders['x-frame-options'] || d.responseHeaders['X-Frame-Options']){
			        delete d.responseHeaders['x-frame-options'];
			        delete d.responseHeaders['X-Frame-Options'];
			    }
			    c({cancel: false, responseHeaders: d.responseHeaders});
			  });
*/		
/*		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
		    if (xhr.readyState !== 4) return;
		    if (xhr.status === 200) {
		        var doc = iframe.contentWindow.document;
		        doc.open();
		        doc.write(xhr.responseText);
		        doc.close();
		    }
		}
		xhr.open('GET', this.url, true);
		xhr.setRequestHeader("Access-Control-Allow-Origin","*");
		xhr.setRequestHeader("x-frame-options", "ALLOW-FROM *");
		
		 var headers = {
    'content-type': 'application/x-www-form-urlencoded',
    origin: 'https://twitter.com',
    referer: 'https://twitter.com/',
    'x-requested-with': 'XMLHttpRequest'
  };

  Object.keys(headers).forEach((header) => {
    xhr.setRequestHeader(header, headers[header]);
  })
		
		xhr.send(null);
*/	};

function Footer (b,p,n) {
	console.log("IRender Footer");
	this.element=css.setClass(document.createElement("FOOTER"),"Footer");
	this.element.appendChild(createNode(p.footer||"No Footer Set"));
	this.parent=n;
	n.appendChild(this.element);
}

function Header(b,p,n,o) {
	console.log("IRender Header");
	p.header=this;
	this.element=css.setClass(document.createElement("HEADER"),(o&&o.style?o.style:"Header"));
	this.element.appendChild(createNode(p.title||"No Title Set"));
	this.parent=n;
	n.appendChild(this.element);
}
function Menu (b,p,n) {
	console.log("IRender Menu");
	this.element=css.setClass(document.createElement("DIV"),"Menu")
	this.table=document.createElement("TABLE");
	this.element.appendChild(this.table);
	for(var option in p.options){
		new MenuOption(b,p.options[option],this);
	}
	this.parent=n;
	n.appendChild(this.element);
}
Menu.prototype.setDetail = function (t,n) {
	this.parent.setDetail(t,n);
};
function MenuOption(b,p,parent) {
	console.log("IRender MenuOption");
	Object.assign(this,p);
	this.element=css.setClass(document.createElement("TR"),"MenuOption");
	var	c1 = document.createElement("TD")
		,c2 = document.createElement("TD")
		,c3 = document.createElement("TD");
	this.element.iRender= p;
	this.element.addEventListener('click', this.onclick.bind(this), false);	
	c1.innerText="-";
	c2.appendChild(b.getImage("file"));
	c3.innerText=p.title;
	this.element.appendChild(c1);
	this.element.appendChild(c2);
	this.element.appendChild(c3);
	this.base=b;
	this.properties=p;
	this.parent=parent;
	parent.table.appendChild(this.element);
}
MenuOption.prototype.setDetail = function (t,n) {
		this.parent.setDetail(t,n);
	};
MenuOption.prototype.onclick = function (e) {
		console.log("MenuOption onclick "+this.action);
		this.base.actions[this.action].exec(this);
	};
function Pane (b,p,n) {
	console.log("IRender Pane");
	this.element=document.createElement("DIV");
	this.centre = css.setClass(document.createElement("DIV"),"DetailPane");
	if(p.hasOwnProperty("header")) new Header(b,p.header,this.element);
	else if(p.hasOwnProperty("title")) new Header(b,{title:p.title},this.element);
	this.element.appendChild(this.centre);
	if(p.hasOwnProperty("footer")) new Footer(b,p.footer,this.element);
	if(p.hasOwnProperty("leftMenu")) new Menu(b,b.menus[p.leftMenu],this);
	this.tabPane = new TabPane(b,p,this.centre);
	if(n==null) return;
	this.parent=n;
	n.appendChild(this.element)
}
Pane.prototype.appendChild = function (n) {
		this.centre.appendChild(n);
	};
Pane.prototype.setDetail = function (title,n) {
	console.log("Pane addDetail");
	this.tabPane.setTab(title,n);
};
function TabPane(b,p,parent) {
	this.element = css.setClass(document.createElement("DIV"),"FullLeft");
	this.tabs=createTable();
	this.tabsRow=createTableRow(this.tabs);
	this.panes=css.setClass(createTable(),"FullLeft");
	this.panesRow=createTableRow(this.panes);
	this.element.appendChild(this.tabs);
	this.element.appendChild(this.panes);
	this.parent=parent;
	parent.appendChild(this.element);
}
TabPane.prototype.setTab = function (t,n) {
	console.log("TabPane setDetail");
	for(var i=0; i<this.tabsRow.cells.length;i++ ) {
		if(this.tabsRow.cells[i].innerText==t) {
			while (this.panesRow.cells[i].firstChild) {
				this.panesRow.cells[i].removeChild(this.panesRow.cells[i].firstChild);
			}
			this.panesRow.cells[i].appendChild(n);
			this.panesRow.cells[i].style.display = 'inline';

			return;
		} else {
		    if (this.panesRow.cells[i].style.display !== 'none') {
		    	this.panesRow.cells[i].style.display = 'none';
		    }
		}
	}
	
	var ct=css.setClass(createTableCell(this.tabsRow),"Tab")
		,cp=css.setClass(createTableCell(this.panesRow),"TabDetail");
	ct.innerText=t;
	cp.appendChild(n);
};
function Window (b,p,n) {
	console.log("IRender Window");
	this.parent=n;
	if(p.title) document.title=p.title;
	new Header(b,p,n,{style:"HeaderMain"});
	new Pane(b,b.panes[p.pane],n);	
	new Footer(b,p,n);
}	

function IRenderClass() {
    this.styleSheet = document.getElementById("IRenderCSS");
    if (this.styleSheet===null) {
    	console.log("IRenderClass define stylesheet IRenderCSS");
    	this.styleSheet = document.createElement("style");
    	this.styleSheet.type = "text/css";
    	this.styleSheet.id = "IRenderCSS";
    	document.getElementsByTagName("head")[0].appendChild(this.styleSheet);
    	this.rule=this.styleSheet.sheet.insertRule?this.cssInsertRule:this.cssAddRule;
    	this.add("HeaderMain","background-color: LightSkyBlue ; text-align: center;");
    	this.add("Header","background-color: LightGrey ; text-align: center;");
    	this.add("Footer","background-color: LightSkyBlue ; text-align: center;");
    	this.add("HeaderPane","background-color: LightGrey ; text-align: center;");
    	this.add("FooterPane","background-color: LightGrey ; text-align: center;");
    	this.add("DetailPane","display: flex; ");
    	this.add("Menu","width: 200px; float: left; border-right-style: solid; border-right-color: LightGrey; border-right-width: thin;");
    	this.add("MenuOption:hover","background: LightGrey;");
       	this.add("Tab","height: 20px; float: left; border: medium solid LightGrey; border-top-left-radius: 5px; border-top-right-radius: 10px;");
       	this.add("TabDetail","height: 100%; width: 100%; float: left;");
       	this.add("FullLeft","height: 100%; width: 100%; float: left;");
    }
}
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
var css = new IRenderClass();

function IRender() {
	this.actions={};
	this.guid=0;
	this.metadata = {
			action: {id:null,type:["link","pane"],url:null,title:null,target:null,pane:null}
			,pane: {id:null ,title:null, leftMenu:null}
			,menu: {id:null ,options:{"default":Array.constructor}}
			,option: {title:null ,action:null}
			,window: {title:{"default":"No Title Specified"},footer:{"default":"No Footer Specified"},pane:null}
		};
	this.panes={};
	this.window={};
	this.menus={};
//	this.imageCache={};
	this.images={file:"file.gif"}
	this.imageBase="images/";
}
IRender.prototype.getImage = function(n) {
//		if(this.imageCache.hasOwnProperty(n)) {
//			return this.imageCache[n] 
//		}
		var i = new Image(16,16);
		i.src=this.imageBase+this.images[n];
//		this.imageCache[n]=i;
		return i;
	};
IRender.prototype.addAction = function(p) {
		this.checkProperties(p,this.metadata.action);
		this.actions[p.id]=new Action(this,p);
		return this;
	};
IRender.prototype.addMenu = function(p) {
		this.checkProperties(p,this.metadata.menu);
		this.menus[p.id]=p;
		return this;
	};

IRender.prototype.addMenuOption = function(m,p) {
		this.checkProperties(p,this.metadata.option);
		this.menus[m].options.push(p);
		return this;
	};

IRender.prototype.addPane = function(p) {
		this.checkProperties(p,this.metadata.pane);
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

IRender.prototype.checkProperties = function(o,ps) {
		for(var p in o)
			if(!p.inList(ps))
				throw Error('invalid property '+p);
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
		this.checkProperties(p,this.metadata.window);
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