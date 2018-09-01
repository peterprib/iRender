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
         "IRender": "IRender",
        "svg": "svg"
        }
	});
(function (){
	var e=document.createElement('link');
	e.type='text/javascript';
	e.rel='stylesheet';
	e.href='vis.css';
	document.getElementsByTagName('head')[0].appendChild(e);
})();

console.log("indexRequire setup processes");

var rendering;

require(["svg","IRender","/vis/vis.js"], function (Svg,IRender,vis) {
	console.log("IRender test");
	var dataseta = new vis.DataSet([
	    {x: '2014-06-11', y: 10},
	    {x: '2014-06-12', y: 25},
	    {x: '2014-06-13', y: 30},
	    {x: '2014-06-14', y: 10},
	    {x: '2014-06-15', y: 15},
	    {x: '2014-06-16', y: 30}
	  ]);
	 var options = {
			    start: '2014-06-10',
			    end: '2014-06-18'
			  };
	 
		var nodes = new vis.DataSet([
		    {id: 1, label: 'Node 1'},
		    {id: 2, label: 'Node 2'},
		    {id: 3, label: 'Node 3'},
		    {id: 4, label: 'Node 4'},
		    {id: 5, label: 'Node 5'}
		  ]);

		  // create an array with edges
		  var edges = new vis.DataSet([
		    {from: 1, to: 3},
		    {from: 1, to: 2},
		    {from: 2, to: 4},
		    {from: 2, to: 5},
		    {from: 3, to: 3}
		  ]);
		  var nodedata = {
				    nodes: nodes,
				    edges: edges
				  };
	rendering=new IRender();
	rendering.setWindow({title:"iRender",footer:"iRender by Peter Prib",pane:"main"})
		.addPane({id:"main",title:"Sub Test",leftMenu:"mainMenu",show:"Test Pane1"})
		.addPane({id:"testPane",title:"Test Pane"})
		.addPane({id:"testPane2",title:"Test Pane",closable:true})
		.addPane({id:"floatPane",title:"Floating Pane"})
		.addMenu({id:"mainMenu"})
		.addMenuOption("mainMenu",{title:"Test Link",action:"testAction1"})
		.addMenuOption("mainMenu",{title:"Test Pane1",action:"testAction2"})
		.addMenuOption("mainMenu",{title:"Test Folder",action:"folder",passing:{}})

		.addMenuOption("mainMenu",{title:"test vis",action:"vis",passing:{module:"Network",options:{},dataset:nodedata}})
		.addAction({id:"vis",title:"vis",type:"vis",pane:"vis"})
		.addMenuOption("mainMenu",{title:"test vis inline",action:"visInline"})
		.addAction({id:"visInline",title:"vis",type:"pane",pane:"visInline",
				setDetail:function (p) {
					var div=createDiv();
					p.setDetail(div);
					var nc=createDiv();
//					var nc=p.executeHeaderAction("visConfiguration").dependants.visConfiguration.centerRow.detail;
//					var nc=document.createElement("DIV");
//					nc.style.width='100%';
//					nc.style.height='100%';
					p.executeHeaderAction("visConfiguration").dependants.visConfiguration.setDetail(nc);
					var network = new vis.Network(div, nodedata,{
							configure:{enabled:true,container: nc,showButton:true}
				});
				}
			})
		.addAction({id:"visConfiguration",title:"Vis Configuration",type:"floatingPane",pane:"visConfiguration"})
		.addPane({id:"visConfiguration",title:"vis Configuration",onCloseHide:true})
						

		.addPane({id:"visInline",title:"vis",header:{right:[{image:"edit",action:"visConfiguration"}]}})
		.addPane({id:"vis",title:"vis"})

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
		.addAction({id:"svgOptions",title:"SVG Options",type:"floatingPane",pane:"svgOptions"})
		.addPane({id:"svgOptions",title:"SVG Options"
				,content:
					[{title:"zoomAndPan",action:"select",children:
						[{action:"option",label:"magnify",value:"magnify"}
						,{action:"option",label:"disable",value:"disable"}
						]}
					,{title:"preserveAspectRatio",action:"select",children:
						[{action:"option",label:"none",value:"none"}
						,{action:"option",label:"x",value:"x"}
						]}
					,{title:"Zoom",children:
						[{action:"input",type:"button",value:"Fit Window",onclick: function(ev) {this.parent.zoomAll();}}
						,{action:"input",type:"button",value:"+",onclick: function(ev) {this.parent.zoomIn();}}
						,{action:"input",type:"button",value:"-",onclick: function(ev) {this.getTargetObject().zoomOut();}}
						]}
					]
				})
		.addImage({id:"logo"		,file:"frygmaLogo.jpg"})
		.build();
});
console.log("index completed");
