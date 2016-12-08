function LoaderDocument(baseElement) {
	this.baseElement=baseElement||document.head;
}
LoaderDocument.prototype.load = function(url,callBack,callBackObject,callBackArgs) {
	console.log("LoaderDocument load "+url);
	var elementType = (url.match(/[^\\\/]\.([^.\\\/]+)$/) || [null]).pop();
	if(this.hasHistory(elementType,url)) {
		console.log("LoaderDocument already loaded "+url);
		if(callBack)
			callBack.apply(callBackObject,callBackArgs);
		return;
	}
	var thisObject=this
		,fileElement = document.createElement({js:"script",css:"link"}[elementType]);
	fileElement.type = "text/"+{js:"javascript",css:"css"}[elementType];
	switch (elementType) {
		case 'js' : 
			fileElement.src = url;
			break;
		case 'css':
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("href", filename)
			break;
	}
	fileElement.onload = function () {
			if(thisObject.hasHistory(elementType,url))
				console.error("LoaderDocument "+elementType+" already loaded before "+url+", could be timing");
			else {
				thisObject.history[elementType][url]=fileElement;
				console.log("LoaderDocument "+elementType+" loaded "+url);
			}
			if(callBack)
				callBack.apply(callBackObject,callBackArgs);
		}
	fileElement.onerror = function () {
			console.error("LoaderDocument error loading "+url);
		};
	this.baseElement.appendChild(fileElement);
};
LoaderDocument.prototype.hasHistory = function(elementType,url) {
		return this.history.hasOwnProperty(elementType) && this.history[elementType].hasOwnProperty(url);
	};
LoaderDocument.prototype.history = {
		js:{}
		,css:{}
	};
var loaderDocument = new LoaderDocument();

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function(require) {
    //The value returned from the function is
    //used as the module export visible to Node.
    return LoaderDocument;
});