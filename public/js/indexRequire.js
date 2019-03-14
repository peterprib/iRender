console.log("indexRequire config");
requirejs.onError = function (e) {
    console.log(e.requireType);
    if (e.requireType === "timeout") {
        console.log("modules: " + e.requireModules);
    }
    console.error("requirejs.onError "+ e + "\nStack: "+e.stack);
    throw e;
};
require.config({
    paths: {
        "IRenderClass": "IRenderClass",
        "IContextMenu":"IContextMenu",
        "IForm": "IForm",
         "IFormat": "IFormat",
         "ITableDataRender": "ITableDataRender"
        }
	});
console.log("indexRequire setup processes");

require(["ITableDataRender","IRenderClass","IFormat","IContextMenu",'IForm'], function (ITableDataRender,IRenderClass,IFormat,IContextMenu,IForm) {
	var table= new ITableDataRender(null,null,[[1,2,"a"],[3,4,"bb"],[5,6,"bbcc"]]);
	table.setMetaData([{title:"col1",type:"number"},
		{title:"col2",type:"number"},
		{title:"col3",type:"string"}]);
	table.setMapping([{column:1},{column:3}]);
	table.appendTo("test1");
});
console.log("indexRequire completed");