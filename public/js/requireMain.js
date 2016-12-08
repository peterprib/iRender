console.log('requireMain config');
requirejs.onError = function (e) {
    console.log(e.requireType);
    if (e.requireType === 'timeout') {
        console.log('modules: ' + e.requireModules);
    }
    console.error('requirejs.onError '+ e + "\nStack: "+e.stack);
    throw e;
};
require.config({
    paths: {
        'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min'
        ,'loaderDocument': 'loaderDocument'
        ,'xsltTransform': 'xslTransform'
        ,'IRender': 'IRender'
        ,'vis':'../vis/vis'
        }
	});
console.log('requireMain setup processes');
require(['vis'], function (vis) {
		console.log('vis');
		var networkNode = document.getElementById('network');
		if(networkNode==null) return;
		var graphData = {nodes:new vis.DataSet([
		                               {id: 1, label: 'Node 1'},
		                               {id: 2, label: 'Node 2'},
		                               {id: 3, label: 'Node 3'},
		                               {id: 4, label: 'Node 4',cid:1},
		                               {id: 5, label: 'Node 5',cid:1}
		                           ])
		   					,edges: new vis.DataSet([
		                               {from: 1, to: 3},
		                               {from: 1, to: 2},
		                               {from: 2, to: 4},
		                               {from: 2, to: 5}
		                           ])
		  	};
		var network = new vis.Network(networkNode, graphData, {});
		network.clustering.cluster({
				joinCondition:function(nodeOptions) {
						return nodeOptions.cid === 1;
					}
			});
	});

require(['xsltTransform'], function (Xslt) {
		console.log('xslt');
		var xslt,xsltNodes
			,xsltNodes = document.getElementsByClassName('xslt');
		for(var i=0,l=xsltNodes.length;i<l;i++) {
			xsltNode=xsltNodes[i];
			xsltNode.innerHTML='<h1>XSL Transform</h1><form></form><p/><textarea class="xsltOut" rows="20" cols="100">No call</textarea>';
			xslt=new Xslt()
				,outAreaNode=xsltNode.getElementsByClassName("xsltOut")[0];
			outAreaNode.value="loading";
			xslt.initialise("./xslt/verintAttributesExtract.xsl","./dbschema.xml"
					,function() {outAreaNode.value = this.getText()}
					,xslt);
		}
	});

require(['jquery','loaderDocument','xsltTransform'], function ($,loader,xslt) {
		console.log('requireMain test');
		var header=document.getElementsByTagName("header")[0];
		header.innerHTML='Test Header';
	});
var rendering;
require(['IRender'], function (IRender) {
	console.log('IRender test');
	rendering=new IRender();
	rendering.setWindow({title:'A Test',footer:"A Footer"})
	rendering.addPane({id:'a',title:'Sub Test'})
	rendering.build();
});
console.log('requireMain completed');





