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
         "IRender": "IRender"
        }
	});
console.log("indexRequire setup processes");

var rendering;
require(["IRender"], function (IRender) {
	console.log("IRender test");
	rendering=new IRender();
	rendering.setWindow({title:"iRender",footer:"iRender by Peter Prib",pane:"main"})
		.addPane({id:"main",title:"Sub Test",leftMenu:"mainMenu"})
		.addPane({id:"testPane",title:"Test Pane"})
		.addMenu({id:"mainMenu"})
		.addMenuOption("mainMenu",{title:"Test Link",action:"testAction1"})
		.addMenuOption("mainMenu",{title:"Test Pane",action:"testAction2"})
		.addAction({id:"testAction1",title:"Frygma",type:"link",url:"http://frygma.pribonline.com/",target:"main"})
		.addAction({id:"testAction2",title:"Test Pane",type:"pane",pane:"testPane"})
		.build();
});
console.log("indexRequire completed");