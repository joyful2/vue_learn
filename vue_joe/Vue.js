
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
		//组件的基本原理
		//聚焦到vm   是根实例 还是组件
		if (!vm) { // 组件
      if(childVal && typeof childVal !== "function"){
				console.error("data选项应该为函数 返回组件中每个实例的值")
			}
      return mergeData(parentVal, childVal)
      
		} else {
      return mergeData(parentVal, childVal, vm)
    }
	}

  function mergeData(parentVal, childVal, vm){
    if (!vm) {
			//1: 子组件中的parentVal childVal 都应该是函数
			/*
			会遇到的情况:
			1: parentVal === undefined   return childVal
			2: childVal === undefined   return parentVal
			3: parentVal ===  function(){}  childVal ===  function(){}  mergeData  把两者的返回值对象合并成一个
			*/
			// todo 有空去看这部分的 vue源码
		} else {
			return function mergedInstanceDataFn() {
				return typeof childVal === 'function' ? childVal.call(vm, vm) : childVal;
			}
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
        // console.log('mergeField key:',key);
        const strat = strats[key] || defaultStrats
        options[key] = strat(parent[key],child[key],vm, key)
      }

      return options
    }
    // todo 修改到这里了！
    
    function callHook(vm,hookName){
      const hookHandlers = vm.$options[hookName]
      hookHandlers.forEach((hook)=>{
        hook.call(vm)
      })
    }

    Vue.options = Object.create(null); //Vue.options = {}

    function initMixin(Vue) {
      Vue.prototype._init = function(options) {
        var vm = this;
        //选项合并
        vm.$options = mergeOptions(Vue.options, options || {}, vm);
        const beforeCreateHook = vm.$options['beforeCreate']
        beforeCreateHook && typeof beforeCreateHook === 'function' && callHook(vm,'beforeCreate')
        initState(vm)       
      }
    }

    function initState(vm){
      if(vm.options.data){
        initData(vm)
      } else {
        // observe(vm._data = {},true)
      }
    }

    function isPlainObject(obj){
      toString.call(obj) === '[object, Object]'
    }

    function isReserved(str) {
      var c = (str + '').charCodeAt(0);   //获取Unicode 编码  0-65535
      return c === 0x24 || c === 0x5F     // 十六进制的Unicode 编码  $ === 0x24  _ === 0x5F
    }
  
    function initData(vm){
      var data = vm.$options.data; //  函数  mergedInstanceDataFn
      data = vm._data = typeof data === 'function' ? data(vm) : data
      if (!isPlainObject(data)) {
        data = {};
        console.error(
          'data functions should return an object:\n' +
          'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
          vm
        );
      }
      const props = vm.$options.props
      const methods = vm.$options.methods
      const {_data} = vm
      for(let k in _data){
        if(props && hasOwn(props,k)){
          console.error('props 中已存在 ' + k+'属性')
        }
        if(methods && hasOwn(methods,k)){
          console.error('methods 中已存在 ' + k+'属性')
        }
        else if (!isReserved(k)) {   //$  _
          //数据代理的时候 是否有不合法的属性
          proxy(vm, "_data", k);
        }
      }
    }

    function proxy(vm,str,key){
      Object.defineProperty(vm,key,{
        get(){
          return vm[str][key]
        },
        set(newVal){
          vm[str][key] = newVal
        }
      })
    }

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

  ASSET_TYPES.forEach((type)=>{
    Vue.options[type + 's'] = Object.create(null); //Vue.options.components
  })


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