console.log('indexRequire config');
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
         'IRender': 'IRender'
        }
	});
console.log('indexRequire setup processes');

var rendering;
require(['IRender'], function (IRender) {
	console.log('IRender test');
	rendering=new IRender();
	rendering.setWindow({title:'iRender',footer:"iRender by Peter Prib"})
	rendering.addPane({id:'a',title:'Sub Test'})
	rendering.build();
});
console.log('requireMain completed');





