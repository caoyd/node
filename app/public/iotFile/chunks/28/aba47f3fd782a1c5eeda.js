(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{223:function(e,n,a){"use strict";a.r(n),a(44);var r=a(24),t=(a(41),a(18)),o=a(2),c=a.n(o),l=(a(55),a(17)),s=a(0),i=a.n(s),u=a(1),p=a.n(u),f=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},d=l.a.create,v=l.a.Item;function m(e){var n=this,a=e.addClass,o=e.form,s=e.onOk,u=e.onCancel,p={labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:18}}},d=o.getFieldDecorator,m={visible:!!a,title:a,onCancel:u,onOk:function(){o.validateFieldsAndScroll(function(){var e=function(e){return function(){var n=e.apply(this,arguments);return new Promise(function(e,a){return function r(t,o){try{var c=n[t](o),l=c.value}catch(e){return void a(e)}if(!c.done)return Promise.resolve(l).then(function(e){r("next",e)},function(e){r("throw",e)});e(l)}("next")})}}(c.a.mark(function e(a,r){var t=function(e,n){var a={};for(var r in e)n.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(a[r]=e[r]);return a}(r,[]);return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a||s(f({},t));case 1:case"end":return e.stop()}},e,n)}));return function(n,a){return e.apply(this,arguments)}}())}};return i.a.createElement(r.a,m,i.a.createElement(l.a,null,i.a.createElement(v,f({},p,{label:"分类主图："}),d("picUrl")(i.a.createElement(t.a,{placeholder:"请输入图片地址"}))),i.a.createElement(v,f({},p,{label:"分类名称："}),d("className",{rules:[{required:!0,message:"请填写分类名称"}]})(i.a.createElement(t.a,{placeholder:"请输入分类名称"})))))}m.propTypes={addClass:p.a.string,onOk:p.a.func},m.defaultProps={addClass:"",onOk:function(){},onCancel:function(){}},n.default=d()(m)}}]);