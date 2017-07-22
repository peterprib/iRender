/*
 * Copyright (C) 2016 Jaroslav Peter Prib
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 * 
 */
/*
 * arg = {request:..,response:..,next:next,object:this}
 */
/*eslint-env node */
/*globals Actionstack */
function ActionStack(base) {
	this.actionStack=[];
	this.errorStack=[];
	this.stack=[];
	this.processedStack=[];
	this.base=base;
	this.workArea={};
	this.async=false;
	this.sent=false;
	this.sentHeader=false;
}
module.exports=ActionStack;
ActionStack.prototype.startSubTasking = function() {
		if(this.debug) console.log('ActionStack startSubTasking');
		if(this.subTask) {
			this.subTaskCompletionCount++;
			return;
		}
		this.subTask=[];
		this.subTaskCompletionCount=1;
	};
ActionStack.prototype.addSubTask = function(base) {
		if(this.debug) console.log('ActionStack addSubTask');
		var task=new Actionstack({response:this.base.response,request:this.base.request,onError:this.base.onError,next:this.subTaskCompleted,parent:this}.mergeReplace(base));
		this.this.subTask.push(task);
		return task;
	};
ActionStack.prototype.subTaskCompleted = function() {
		if(this.debug) console.log('ActionStack subTaskCompleted');
		if(this.actionStack.length<++this.base.subTaskCompletionCount)
			return;
		if(this.debug) console.log('ActionStack subTaskCompleted completed');
		this.popAndCall();
	};
ActionStack.prototype.wait4Tasks = ActionStack.prototype.subTaskCompleted;
ActionStack.prototype.next = function() {
	if(this.debug) console.log('ActionStack next');
	if(this.base.next==null) return;
	if(this.firstCallRunning) {
		if(this.debug) console.log('ActionStack retry next count: '+this.nextLoopCount);
		if(this.nextLoopCount==null) this.nextLoopCount=0;
		if(this.nextLoopCount++>3) {
			console.error('ActionStack next, waiting too long for main to complete ');
			this.base.next.apply(this,[this].concat(arguments));
			return;
		}
		if(this.debug) console.log('ActionStack set retry '+this.nextLoopCount);
		var thisObject=this;
		setTimeout(function(){thisObject.next.apply(thisObject)},1000);
		return;
	}
	if(this.debug) console.log('ActionStack base next and message sent: '+this.sent);
	this.base.next.apply(this,[this].concat(arguments));
};
ActionStack.prototype.send = function(message) {
		if(this.debug) console.log('ActionStack send\n');
		this.sendTyped(message);
		this.popAndCall();
};
ActionStack.prototype.sendTyped= function(message) {
		if(this.debug) console.log('ActionStack sendTyped type: '+this.base.returnType+"\n");
		if(this.sent==true) {
			console.error("ActionStack sendTyped send message already sent\n");
			return;
		}
		if(this.debug) console.log('ActionStack sendTyped setting sent to true');
		this.sent=true;
		if(this.sentHeader==false && this.base.headers) {
			if(this.debug) console.log('ActionStack sendTyped setting sentHeader to true');
			this.sentHeader=true;
			try{
				this.base.headers.forPropertyEnumerable(
						function(property,cell) {
							if(this.debug) console.log('ActionStack sendTyped setHeader: '+property+' value: '+cell);
							this.base.response.setHeader(property,cell);
						}
						,this
					);
			} catch (e) {
				console.error("ActionStack sendTyped setHeader ignoring in response, error: " +e)
			}
		}
		switch (this.base.returnType) {
			case "JSON" :
				this.base.response.json(message);
				break;
			default:
				this.base.response.send(message);
		}
	};
ActionStack.prototype.sendError= function(errorObject) {
		console.error("ActionStack sendError error: "+errorObject
				+"\n  stack: "+ (errorObject.stack ||errorObject.stacktrace || ""));
		if(this.base.onError) {
			if(this.debug) console.log('ActionStack sendError process onError');
			this.base.onError.apply(this.base.object,arguments);
			return;
		}
		if(this.errorStack.length>0) 
			try{
				var callback=this.errorStack.pop()
					,argArray=[this,errorObject];
				if(callback.arguments)
					argArray=argArray.concat(callback.arguments);
				if(this.debug) console.log('ActionStack sendError errorStack calling argument list size: '+argArray.length);
				callback.callBackFunction.apply(callback.object,argArray);
				return;
			} catch(e) {
				this.sendError("ActionStack callBack error: " + e.toString() + "\nstack trace:\n\n"+e.stack);
				return;
			}
		this.base.response.status(400);
		if(errorObject==null) errorObject="Error message is null"; 
		if(this.base.returnType=="JSON") {
			if(typeof errorObject == 'string')
				errorObject={error:errorObject};
			else if(!errorObject.hasOwnProperty('error'))
				errorObject.error=errorObject.message;
		} else if(typeof errorObject !== 'string')
			errorObject=errorObject.message;
		try{
			this.sendTyped(errorObject);
		} catch(e) {
			console.error("ActionStack sendError failure, error: "+e.message+" sending error:"+JSON.stringify(errorObject)+"\nstack trace:\n"+e.stack);
			this.base.response.send(e.toString());
		}
		this.next();
	};
ActionStack.prototype.push= function(actions) {
			try{
				for (var i = arguments.length-1; i >= 0; i--)
					this.pushAction(arguments[i]);
			} catch(e) {
				throw Error("ActionStack push argument "+i+" "+e);
			}
		}	
ActionStack.prototype.pushAction= function(actions) {
			if(actions instanceof Array) {
				for (var i = actions.length-1; i >= 0; i--)
					try{
						this.pushAction(actions[i]);
					} catch(e) {
						throw Error("ActionStack pushAction array "+i+" "+e);
					}
				return;
			}
			if(actions.callBackFunction==null)
				throw Error("action callBackFunction is null");
			this.stack.push(actions);
		}	
ActionStack.prototype.action2String= function(callback) {
			var returnData="callBackFunction: ";
			if(callback.callBackFunction == null)
				returnData+= "is null";
			else
				try{
					var functionData = callback.callBackFunction.toString();
					returnData+= functionData.substr('function'.length, functionData.indexOf(')')-'function'.length+1);
				} catch(e) {
					returnData+= "not a function error: "+e.toString();
			}
			returnData+=" ,object: ";
			if(callback.object == null)
				returnData+= "is null";
			else
				returnData+= "is specified";
			return returnData+" , action property list: "+callback.propertyList2String();
		};
ActionStack.prototype.logActionStacks = function() {
			console.error("ActionStack stack");
			var i;
			for(i=0;i<this.stack.length;i++)
				console.error("  level "+i+" callback "+this.action2String(this.stack[i]));
			console.error("ActionStack processed stack");
			for(i=0;i<this.processedStack.length;i++)
				console.error("  level "+i+" callback "+this.action2String(this.processedStack[i]));
		};
ActionStack.prototype.popAndCall = function(data) {
		if(this.debug) console.log('ActionStack popAndCall ');
		try{
			if(this.stack.length<1) {
				this.next();
				return;
			}
			if(this.processedStack.length>1000) 
				throw Error("May be in a loop over 1000 calls");
			var callback=this.stack.pop();
			this.processedStack.push(callback);
			var argArray=[this];
			if(data!==undefined) argArray.push(data);
			if(callback.arguments)
				argArray=argArray.concat(callback.arguments);
			if(this.debug) console.log('ActionStack popAndCall calling argument list size: '+argArray.length);
			callback.callBackFunction.apply(callback.object,argArray);
		} catch(e) {
			this.sendError("ActionStack callBack error: " + e.toString() + "\nstack trace:\n\n"+e.stack);
			this.logActionStacks();
		}
	};
	
module.exports={
		initialize: function(base) {
				var thisObject = this;
				base.server.all('/'+ base.action
						,function(request, response, next) {next()}
					).get('/'+ base.action
						,function(request, response, next) {
								thisObject.callProcessor(request ,response ,next ,require('url').parse(request.url,true).query ,base);
							}
					).post('/'+base.action
						,function(request, response, next) {
								thisObject.callProcessor(request ,response ,next ,request.body ,base);
							}
					)
					;
			}
		,ActionStack: ActionStack
		,doNothing: function() {return;}
		,next: function(actionStack) {
			if(this.debug) console.log('actionURL next ');
			actionStack.base.onError=this.doNothing; //Error already on console and send already completed 
			if(actionStack==null) throw Error("Call to next missing action stack");
			if(actionStack.base.destroy)
				actionStack.base.destroy.apply(actionStack.base.object,[actionStack]);
			if(this.debug) console.log('actionURL next calling express next');
			actionStack.base.nextActual.apply(actionStack.base.object,[]);
		}
		,callProcessor: function(request ,response ,next ,workArea ,base) {
				if(this.debug) console.log('actionURL callProcessor '+base.action+" parameters: "+global.json2string(workArea));
				var actionStack= new this.ActionStack(base);
				actionStack.firstCallRunning=true;
				actionStack.base.request=request;
				actionStack.base.response=response;
				actionStack.base.next=this.next;
				actionStack.base.nextActual=next;
				actionStack.workArea=workArea;
				try {
					if(actionStack.base.create)
						base.create.apply(base.object,[actionStack]);
					base.processor.apply(base.object,[actionStack]);
					actionStack.firstCallRunning=null;
				} catch(e) {
					actionStack.firstCallRunning=null;
					actionStack.sendError(e);
				}
				if(this.debug) console.log('actionURL callProcessor '+base.action+" completed");
			}
		};

	
	

