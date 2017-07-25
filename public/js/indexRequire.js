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
		.addPane({id:"testPane2",title:"Test Pane",closable:true})
		.addPane({id:"floatPane",title:"Floating Pane"})
		.addMenu({id:"mainMenu"})
		.addMenuOption("mainMenu",{title:"Test Link",action:"testAction1"})
		.addMenuOption("mainMenu",{title:"Test Pane1",action:"testAction2"})
		.addMenuOption("mainMenu",{title:"Test Folder",action:"folder"
			,passing:{}
			})
		.addMenuOption("mainMenu",{title:"SVG",action:"svg"})
		.addMenuOption("mainMenu",{title:"Google Map",action:"googleMap"})
		.addMenuOption("mainMenu",{title:"States",action:"states"})
		.addMenuOption("mainMenu",{title:"fileReader",action:"fileReader"})
		.addMenuOption("mainMenu",{title:"subMenu",action:"folder",passing:{menu:"subMenu"}})
		.addMenu({id:"subMenu"})
		.addMenuOption("subMenu",{action:"testAction3"})
		.addMenuOption("subMenu",{action:"floatPane"})
		.addMenuOption("subMenu",{title:"States 2",action:"states"})
		.addMenuOption("subMenu",{title:"SVG 2",action:"svg"})
		.addAction({id:"fileReader",type:"fileReader",passing:"c:/tmp/"})
		.addAction({id:"testAction1",title:"Frygma",type:"link",url:"http://frygma.pribonline.com/",target:"main"})
		.addAction({id:"testAction2",title:"Test Pane",type:"pane",pane:"testPane"})
		.addAction({id:"testAction3",title:"Test Pane closable",type:"pane",pane:"testPane2"})
		.addAction({id:"floatPane",title:"Floating Pane",type:"floatingPane",pane:"floatPane"
			,passing:{message:"These float"}})
		.addAction({id:"googleMap",title:"Google Map",type:"googleMap",pane:"testPane"})
		.addAction({id:"states",title:"States",type:"states"
			,passing:[{image:"folderOpen"},{image:"loadingPage"},{image:"folderClose"}]
			})
		.addAction({id:"svg",title:"SVG Editor",type:"svg",pane:"svgEditor"
			,passing:{draw:[{action:"circle",cx:"50",cy:"50",r:"40",stroke:"green","stroke-width":4,fill:"yellow"}
							,{action:"rect",id:"rect",x:1,y:1,width:300,height:100,style:"fill-opacity:0.1;fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"}
							]}
			})
		.addPane({id:"svgEditor",title:"SVG Editor"
			,header:{right:[{image:"edit",action:"svgOptions"}]}
			})
		.addPane({id:"svgOptions",title:"SVG Options"})
		.addAction({id:"svgOptions",title:"SVG Options",type:"floatingPane",pane:"svgOptions"})
		.addPane({id:"svgOptions",title:"SVG Options"
				,content:
					[{title:"x",value: ()=>{} }
					,{title:"y",value: ()=>{} }
					,{title:"zoomAndPan",list:["magnify","disable"]}
					,{title:"preserveAspectRatio",options:["none",["x"]]}
					]
				})
				/*
				 * x="top left corner when embedded (default 0)"
y="top left corner when embedded (default 0)"
viewBox="the points "seen" in this SVG drawing area. 4 values separated by white space or commas. (min x, min y, width, height)"
preserveAspectRatio="'none' or any of the 9 combinations of 'xVALYVAL' where VAL is 'min', 'mid' or 'max'. (default xMidYMid)"
zoomAndPan="'magnify' or 'disable'. Magnify option allows users to pan and zoom your file (default magnify)"
xml="outermost <svg> element needs to setup SVG and its namespace: xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve""
				 * 
				 */
		.addImage({id:"loadingPage"	,file:"loadingpage_small.gif"})
		.addImage({id:"logo"		,file:"frygmaLogo.jpg"})
		.addImage({id:"cancel"		,file:"icon-cancel.gif"})
		.addImage({id:"alert"		,file:"icon-alert.gif"})
		.addImage({id:"error"		,file:"icon-error.gif"})
		.addImage({id:"edit"		,file:"icon-edit.gif"})
		.build();
});
console.log("indexRequire completed");