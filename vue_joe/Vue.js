const { set } = require("vue/types/umd");

(function (global,factory){
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Vue = factory());
})(this, function(){
  const {warn} = console

    var ASSET_TYPES = [
      'component',
      'directive',
      'filter'
    ];


    var LIFECYCLE_HOOKS = [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'activated',
      'deactivated',
      'errorCaptured'
    ];



    var config = {
      optionsMergeStrategy: Object.create(null)
    }

    
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function hasOwn(obj, key) {
      return hasOwnProperty.call(obj, key)
    }
    const strats = config.optionsMergeStrategy
    
    
    	//自定义策略处理
	strats.data = function(parentVal, childVal, vm) {
    // todo 如何理解这里的入参： vm
		//组件的基本原理
		//聚焦到vm   是根实例 还是组件
		if (!vm) { // 组件
      if(childVal && typeof childVal !== "function"){
				console.error("data选项应该为函数 返回组件中每个实例的值")
			}
      
		} else {

    }
	}


  	//所有钩子函数的自定义策略  parentVal === undefined   childVal === function(){}   [function(){}]

    function mergeHook(parentVal,childVal){
      return childVal ? 
       parentVal ? parentVal.concat(childVal) :
       Array.isArray(childVal) ? 
       childVal : [childVal] : parentVal
    }



    LIFECYCLE_HOOKS.forEach(function(hook) {
      strats[hook] = mergeHook;
    })

   

    // "所有" 选择的默认策略
    var defaultStrats = function(parentVal, childVal) {
      return childVal === undefined ?
        parentVal :
        childVal
    };



    function mergeOptions(parent,child,vm){
      const options = {}
      for(k in parent){
        mergeField(k)
      }
      for(k in child){
        if(!hasOwn(parent,k)){
          mergeField(k)
        }
      }

      function mergeField(key){
        console.log('mergeField key:',key);
        const strat = strats[key] || defaultStrats
        options[key] = strat(parent.key,child.key,vm, key)
      }

      return options

    }
    // todo 修改到这里了！
    
    function callHook(vm,hookName){
      console.log('vm:',vm);
      const hookHandlers = vm.$options[hookName]
      hookHandlers.forEach((hook)=>{
        hook.call(vm)
      })
    }

    function initMixin(Vue) {
      Vue.prototype._init = function(options) {
        var vm = this;
        console.log(Vue.options)
        //选项合并
        vm.$options = mergeOptions(Vue.options, options || {}, vm);
        const beforeCreateHook = vm.$options['beforeCreate']
        beforeCreateHook && typeof beforeCreateHook === 'function' && callHook(vm,'beforeCreate')       
      }
    }



        	//config
	function initGlobalAPI(Vue) {
		var configDef = {};
		configDef.get = function() {
			return config;
		}
		configDef.set = function(newval) {
			console.error("不要尝试修改Vue.config的引用")
		}
		Object.defineProperty(Vue, 'config', configDef); //监听你对Vue.config
	}
  

  function Vue(option){
    if(!(this instanceof Vue)){
      warn('Vue is a countructor, pls call it with new keyword')
      return false
    }
    this._init(option);
  }

  Vue.options = Object.create(null); //Vue.options = {}
    ASSET_TYPES.forEach((type)=>{
      Vue.options[type + 's'] = Object.create(null); //Vue.options.components
    })



    console.log('Vue.options::',Vue.options);






    function initExtend(Vue) {
      /*用于原型继承  缓存构造函数*/
      Vue.cid = 0;
      var cid = 1;
      Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};
        var Super = this; //Super  === Vue
        var SuperId = Super.cid;
        //缓存检测 cachedCtors
        var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
        //缓存处理  cachedCtors[0] = 子类的引用
        if (cachedCtors[SuperId]) {
          return cachedCtors[SuperId]
        }
        var name = extendOptions.name || Super.options.name;
        if (name) {
          //validateComponentName(name);   //规范检测
        }
  
        //子类 构造函数
        var Sub = function VueComponent(options) {
          this._init(options);
        };
        //{}.__proto__ = Super.prototype = Vue.prototype
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.cid = cid++;
        //Super == Vue  Vue.component  注册全局组件   Vue.options.components  内置的抽象组件
        ASSET_TYPES.forEach(function(type) {
          Sub[type] = Super[type];
        });
        console.log(1111)
        //组件在初始化 mergeOptions  选项的合并 => 规范的检测  => 策略的处理
        Sub.options = mergeOptions(
          Super.options,    //Vue.options
          extendOptions      //组件的选项对象
        );
        cachedCtors[SuperId] = Sub;
        return Sub;
      }
    }

    initGlobalAPI(Vue)
    initMixin(Vue)
    initExtend(Vue)


  return Vue
})