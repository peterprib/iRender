
/*
 * metadata [name: ???, type: ???, title:"a col"} ]
 * [{column:0,format:afunction,title:"a col"},...]
 * 
 * to run require(["IRenderClass","IFormat"]), required
 * 
 * 
 * var myWindow = window.open("", "newWindow", "width=500,height=700");
 * 
 */

function ITableDataRender(md,mp,d) {
	if(md) this.setMetaData(md);
	if(mp) this.setMapping(mp);
	this.data=d||[];
	return this;
}
ITableDataRender.prototype.setMetaData = function (md) {
	this.metaData=md;
	this.columns={};
	for(var c,i=0;i<md.length;i++) {
		this.columns[md[i].name]=Object.assign({offset:i},md[i]);
	}
	return this;
};

ITableDataRender.prototype.setMapping = function (m) {
		this.mapping=[];
		for(var c,i=0;i<m.length;i++) {
			c=m[i];
			var offset=c.column instanceof String?this.columns[c.column].offset:offset=c.column-1;
			this.mapping.push( {format:(new IFormat()),offset:offset} );
		}
		return this;
	};
ITableDataRender.prototype.transform = function (d) {
	var o;
	for(var dl=d.length,i=0; i<dl ;i++) {
		for(var ml=this.mapping.length,m=0; m<ml; m++) {
			o+=this.mapping[m].format(d[this.mapping[m].column])																										;
		}
	}
	return o;
};
ITableDataRender.prototype.contextmenu = function (ev) {
	ev.preventDefault();
	if (this.dataMenu) {
		this.dataMenu.close();
		delete this.dataMenu;
	}
	this.dataMenu=new IContextMenu();
	var row=ev.target.parentNode.rowIndex,
		cell=ev.target.cellIndex;
	if(row==0) { // Header row
		this.dataMenu.add("Unhide all",this.unhideRowAll,[],this);
	} else {
		this.dataMenu.add("Row Details",this.displayRow,[row,cell],this)
			.add("Hide",this.hideRow,[row,cell],this);
	}
	this.dataMenu.positionAbsolute({y:ev.pageY,x:ev.pageX});
};
ITableDataRender.prototype.appendTo = function (n) {
	document.getElementById(n).appendChild(this.getHTMLTable());
	return this;
};
ITableDataRender.prototype.displayRow = function (ev) {
	if(!this.displayRowForm) {
		this.displayRowForm = new IForm(this).setRemove(this.displayRowRemove.bind(this)).addItem("test").positionAbsolute({y:ev.pageY,x:ev.pageX}); 
	}
	this.displayRowForm.display();
};
ITableDataRender.prototype.displayRowRemove = function () {
	delete this.displayRowForm;
};
ITableDataRender.prototype.hideRow = function (ev,r) {
	this.element.childNodes[r].style.display="none";
};
ITableDataRender.prototype.unhideRowAll = function (ev) {
	for(var r=0;r<this.element.childElementCount;r++) {
		this.element.childNodes[r].style.display="";
	}
};
ITableDataRender.prototype.getHTMLTable = function () {
	if(!this.css) {
		this.css=new IRenderClass("ITableCSS")
			.add("Table","border: 1px solid #a4a4a4;;")
			.add("Head","padding-left:4px; border-bottom: 1px solid black;")
			.add("Head:hover","background: LightGrey; cursor: pointer")
			.add("Left","padding-left:4px; display: none;")
			.add("Left:hover","background: LightGrey; cursor: pointer")
			.add("Cell","padding-left:4px; ")
			.add("Cell:hover","background: LightGrey; cursor: pointer")
			.add("Cell0","padding-left:4px; display: none;");
	}
	var mp,md,r,t=this.css.createElement(null,"TABLE","Table"),
		r0=this.css.createElement(t,"TR");
	t.addEventListener('contextmenu', this.contextmenu.bind(this), false);
	var c=this.css.createElement(r0,"TD","Cell0");
	
	for(var dl=this.data.length,i=0; i<dl ;i++) {  // define all label cells
		const r=this.css.createElement(t,"TR"),
			c=this.css.createElement(r,"TD","Left");
	}
	for(var ml=this.mapping.length,m=0; m<ml; m++) { //columns
		mp=this.mapping[m];
		md=this.metaData[mp.offset];
		const c=this.css.createElement(r0,"TD","Head").appendChild(document.createTextNode(md.title));
		for(var i=0; i<dl ;i++) {
			r=t.rows[i+1];
			const c=this.css.createElement(r,"TD","Cell").appendChild(document.createTextNode(this.data[i][mp.offset]));
		}
	}
	this.element=t;
	return t;
};

if (typeof define !== 'function') var define = require('amdefine')(module);
define(function(require) { return ITableDataRender; });