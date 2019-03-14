/*
 * [{column:0,format:afunction,title:"a col"},...]
 */
function IFormat() {
	this.arguments=arguments;
	return this;
}

IFormat.prototype.copy = function (v) {
		return v;
};
IFormat.prototype.clone = IFormat.prototype.copy;
IFormat.prototype.noChange = IFormat.prototype.copy;
IFormat.prototype.getStringAfterDelimiter = function (v) {
	return getStringAfterDelimiter(v,wordPosition,delimiter);
};
IFormat.prototype.regexp = function (v) {
	return v.split(regPattern,1)[0];
};
IFormat.prototype.substr = function (v) {
	if(isNaN(stringLength))
    	return v.substr(startPosition);
	else
    	return v.substr(startPosition,stringLength);
};
IFormat.prototype.substring = function (v) {
	if(isNaN(stringLength))
    	return v.substring(startPosition);
	else
    	return v.substring(startPosition,stringLength);
};
IFormat.prototype.word = function (v) {
	try{
		return v.split(wordPattern,wordPositionLimit)[wordPosition];
	} catch(e) {}
	return ""; 
};
IFormat.prototype.toDuration = function (v) {
	v=parseFloat(v);
	var r="",t;
	if(v>=60) {
		if(v>=3600) {
			if(v>=86440) {
				if(Options.toDuration=='D') return Math.round(v/86400).toString()+'D'; 
				t = Math.floor(v/86400);
				v=v-t*86400;
				r+=t.toString()+'D';
			}
			if(Options.toDuration=='H') return r+Math.round(v/360).toString()+'H'; 
			t = Math.floor(v/3600);
			v-=t*3600;
			r+=(t>9?'':'0')+t.toString()+'H';
		}
		if(Options.toDuration=='M') return r+Math.round(v/60).toString()+'M'; 
		t = Math.floor(v/60);
		v-=t*60;
		r+=(t>9?'':'0')+t.toString()+'M';
	}
	if(Options.toDuration=='S') return r+Math.round(v/60).toString()+'S'; 
	return r+(v>9?'':'0')+v.toFixed(6).toString();
};
IFormat.prototype.parseFloat = parseFloat;
IFormat.prototype.parseInt = parseInt;
IFormat.prototype.toExponential = function (v) {
	return Number(v).toExponential(Options.toExponentialVal);
};
IFormat.prototype.toFixed = function (v) {
	return Number(v).toFixed(Options.toFixedVal);
};
IFormat.prototype.toPrecision = function (v) {
	return Number(v).toPrecision(Options.toPrecisionVal);
};
IFormat.prototype.toBase = function (v) {
	return Number(v).toString(Options.toBaseVal);
};
IFormat.prototype.number = function (v) {
	v = Number(v);
	if(Options.separator) {
		var valueString=v.toString().split('.');
		v="";
		if(valueString[1]!=null) {
			v='.'+valueString[1].substr(0,3);
			for (var i=3;i<valueString[1].length;i+=3) {
				v+=Options.separator+valueString[1].substr(i,3);
			}
		} 
		len=valueString[0].length-1;
		value=valueString[0].substr(valueString[0].length-1,1)+v;
		for (var i=valueString[0].length-2;i>=0;i--) {
			value=valueString[0].substr(i,1)+((len-i)%3==0?Options.separator:'')+v;
		}
	}
};
IFormat.prototype.toAbbreviatedNumber = function (v) {
	return formatNumberToAbbreviated(v);
};
IFormat.prototype.appendAbbreviatedNumber = function (v) {
	return v + " ("+this.toAbbreviatedNumber(v)+")";
};
IFormat.prototype.prependAbbreviatednumber = function (v) {
	return this.toAbbreviatedNumber(v) + " ("+v+")";
};
IFormat.prototype.wrap = function (v) {
	return Options.pre + v + Options.post;
};
IFormat.prototype.toYesNo = function (v) {
	return v=="y"||v=="1"||v==1?'Yes':"No";
};
IFormat.prototype.toBoolean = function (v) {
	return v=="t"||v=="1"||v==1?"True":'False';
};
IFormat.prototype.normalize = function (v) {
	return (normalizer==0 ? null : v/normalizer);
};
IFormat.prototype.percent = function (v) {
	return 100*this.normalize(v);
};
IFormat.prototype.percent = IFormat.prototype.percentage;

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function(require) {
	    //The value returned from the function is
	    //used as the module export visible to Node.
	    return IFormat;
	});

/*

display_link: function(mask, tableObject, rowToRender, columnObject) {
	var icon = columnObject.components.link_icon != null ? columnObject.components.link_icon : "images/icon-help-contextual-light.gif";
	var link = columnObject.components.link;
	if(mask != null) {
		if(mask.link != null) {
			link = mask.link;
		} else if(columnObject.hide_Non_Maked_Value) {
			link = null;
		}
	}
	if(link == null)
		return "";
		
	return "<a onclick='OpenURLInFloatingWindow(\"" + link + "\")'><img border='0' src='" + icon + "'></a>";
},

display_image: function(mask, tableObject, rowToRender, columnObject) {
	var image = columnObject.components.image;
	
	if(mask != null) {
		if(mask.image != null) {
			image = mask.image;
		} else if(columnObject.hide_Non_Maked_Value) {
			image = null;
		}
	}
	if(image != null)
		return "<img border='0' src='" + image + "' />";
	return "";
},

inlineGraph: function(v){
	var flipColor = columnObject.inline_histogram.flipColor;
	var style = columnObject.inline_histogram.style;
	
	if(value == null) return "<font style='color:red;font-weight: bold;'>null</font>";
	if(value < 0) return ""; //PWK do not draw graph if -1
	
	var left = parseInt(value);
	left = left > 100 ? 100 : left;
	colorCoding = flipColor ? 100 - left : left;

	var right = 100 - left;
	var color = "#00FF00";
	if(colorCoding <= 33) {
		var hexCode = (156+colorCoding*3).toString(16);
		var index = hexCode.indexOf('.');
		if(index > 0)
			hexCode = hexCode.substr(0,index);
		
		color = "#00" + (hexCode.length == 1 ? "0" + hexCode : hexCode) + "00";
	} else if(colorCoding < 66) {
		var hexCode = (7.5*(colorCoding-33)).toString(16);
		var index = hexCode.indexOf('.');
		if(index > 0)
			hexCode = hexCode.substr(0,index);

		color = "#" + (hexCode.length == 1 ? "0" + hexCode : hexCode) + "FF00";
	} else {
		var hexCode = (254 - (7.5*(colorCoding-66))).toString(16);
		if (hexCode=-1) 
			hexCode ="00";
		else {
			var index = hexCode.indexOf('.');
			if(index > 0)
				hexCode = hexCode.substr(0,index);
		}
		color = "#FF" + (hexCode.length == 1 ? "0" + hexCode : hexCode) + "00";
	}

	var toreturn = '<table class="TableBar" style="width:100%;min-width: 100px"><tr><td><table style="' + style + ';width:100%;"><tr>';
	toreturn += '<td width="' + left + '%" bgcolor="' + color + '" ></td><td width="' + right + '%" ></td></tr></table></td>';
	
	if(columnObject.fieldType != "bg_wo")
			toreturn += "<td align='right' style='width:10px;'>&nbsp;" + left.toFixed(0) + "%</td>";

	return toreturn + "</tr></table>";
	
},
display: {
	 

 	,"object"	: function(value, tableObject, rowToRender, columnObject, type , displayColumn) {
 			var stringObject=JSON.stringify(value);
 			if(stringObject==null) stringObject="*** cannot stringify ***";
	 	 	return this.s(stringObject, tableObject, rowToRender, columnObject, type , displayColumn,null,null,"showObjectHTML");
 		}
 	,"objecthtml"	: function(value) {
				return "<table style='padding:0px;margin:0px;' cellpadding='0px' cellspacing='0px'><tr><tdstyle='padding:0px;margin:0px;'>" +value.toTableHTML()+ "</td></tr></table>";
 			}
 	,"c"		: function(value, tableObject, rowToRender, columnObject, type , displayColumn) { return this.s(value, tableObject, rowToRender, columnObject, type , displayColumn,'pre','pre');}
 	,"l"		: function(value, tableObject, rowToRender, columnObject, type , displayColumn) { return this.s(value, tableObject, rowToRender, columnObject, type , displayColumn);}
 	,"s"		: function(value, tableObject, rowToRender, columnObject, type , displayColumn , whiteSpace , tag , more) {
 			if(whiteSpace==null) whiteSpace='nowrap';
 			if(tag==null) tag='span';
 			if(displayColumn==null) displayColumn = tableObject.getDisplayColumn(tableObject,columnObject.name);
 			var maxSize = (displayColumn==null ? LONG_FIELD_MAX : ( displayColumn['maxSize'] !=null && displayColumn['maxSize'] != "" ? displayColumn['maxSize'] : LONG_FIELD_MAX));
 			if(value.length > maxSize && tableObject.baseTableData.detailedView != true)
 				return "<table style='padding:0px;margin:0px;' cellpadding='0px' cellspacing='0px'><tr><td style='padding:0px;margin:0px;'><"+tag+" style='white-space: "+whiteSpace+";'>" + value.substr(0,maxSize-3).escapeHTML() + "...</"+tag+"></td><td><image onclick='TABLE_COLUMN_RENDERING_MODULES.get(\"column\")."+(more?more:"showMore")+"(\"" + tableObject.GUID + "\"," + rowToRender + ", \"" + columnObject.name + "\");' src='"+ IMAGE_BASE_DIRECTORY + "/icon-down-on.gif'/></td></tr></table>";
 			if(value.length > maxSize)
 				return String(value).escapeHTML();
 			if(type == 'number')
 				return "<"+tag+" style='white-space: nowrap'>" + value + "</"+tag+">";
 			return "<"+tag+" style='white-space: "+whiteSpace+";'>" + String(value).escapeHTML() + "</"+tag+">";
 		}

},
display_value: function(value, tableObject, rowToRender, columnObject, type , displayColumn) {
	if(tableObject.baseTableData.baseData == null) return;
	if(value === null || value === undefined)
	 	return "<font style='color:red;font-weight: bold;'>null</font>";
	if(this.display[columnObject.fieldType]!=null) 
		return this.display[columnObject.fieldType](value, tableObject, rowToRender, columnObject, type , displayColumn); 
	if(type == number)
		return "<span style='white-space: nowrap'>" + value + "</span>";
	return "<span style='white-space: nowrap;'>" + String(value).escapeHTML() + "</span>";
},

*/
