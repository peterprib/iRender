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
         ,"svg": "svg"
        }
	});
console.log("indexRequire setup processes");

var rendering;
require(["require","svg","IRender"], function (require,Svg,IRender) {
	console.log("IRender test");
	rendering=new IRender();
	rendering.setWindow({title:"iRender",footer:"iRender by Peter Prib",pane:"main"})
		.addPane({id:"main",title:"Sub Test",leftMenu:"mainMenu",show:"Test Pane1"})
		.addPane({id:"testPane",title:"Test Pane"})
		.addPane({id:"testPane2",title:"Test Pane"})
		.addMenu({id:"mainMenu"})
		.addMenuOption("mainMenu",{title:"Test Link",action:"testAction1"})
		.addMenuOption("mainMenu",{title:"Test Pane1",action:"testAction2"})
		.addMenuOption("mainMenu",{title:"Test Folder",action:"folder"})
		.addMenuOption("mainMenu",{title:"SVG",action:"svg"})
		.addMenuOption("mainMenu",{title:"Google Map",action:"googleMap"})
		.addMenuOption("mainMenu",{title:"States",action:"states"})
		.addAction({id:"testAction1",title:"Frygma",type:"link",url:"http://frygma.pribonline.com/",target:"main"})
		.addAction({id:"testAction2",title:"Test Pane",type:"pane",pane:"testPane"})
		.addAction({id:"googleMap",title:"Google Map",type:"googleMap",pane:"testPane"})
		.addAction({id:"states",title:"States",type:"states"
			,passing:[{image:"folderOpen"},{image:"loadingPage"},{image:"folderClose"}]
			})
		.addAction({id:"svg",title:"Test Svg",type:"svg",pane:"testPane"
			,passing:{draw:[{action:"circle",cx:"50",cy:"50",r:"40",stroke:"green","stroke-width":4,fill:"yellow"}
							,{action:"rect",id:"rect",x:20,y:10,width:300,height:100,style:"fill-opacity:0.1;fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"}
							]}
			})
		.addImage({id:"loadingPage",file:"loadingpage_small.gif"})
		.build();
});
console.log("indexRequire completed");