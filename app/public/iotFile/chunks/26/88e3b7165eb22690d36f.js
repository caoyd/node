(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{222:function(e,n,a){"use strict";a.r(n),a(44);var t=a(24),r=(a(41),a(18)),o=(a(379),a(233)),l=a(2),c=a.n(l),i=(a(566),a(316)),s=(a(55),a(17)),u=a(0),m=a.n(u),p=a(1),f=a.n(p),v=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])}return e},d=s.a.create,h=s.a.Item,b=i.a.RangePicker;function w(e){var n=this,a=e.visible,l=e.form,i=e.onOk,u=e.onCancel,p={labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:18}}},f=l.getFieldDecorator,d={visible:a,title:"发布信息",onCancel:u,onOk:function(){l.validateFieldsAndScroll(function(){var e=function(e){return function(){var n=e.apply(this,arguments);return new Promise(function(e,a){return function t(r,o){try{var l=n[r](o),c=l.value}catch(e){return void a(e)}if(!l.done)return Promise.resolve(c).then(function(e){t("next",e)},function(e){t("throw",e)});e(c)}("next")})}}(c.a.mark(function e(a,t){var r=t.timeRange,o=function(e,n){var a={};for(var t in e)n.indexOf(t)>=0||Object.prototype.hasOwnProperty.call(e,t)&&(a[t]=e[t]);return a}(t,["timeRange"]);return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:a||i(v({},o,{startDate:r[0].format("YYYY-MM-DD HH:mm:ss"),endDate:r[1].format("YYYY-MM-DD HH:mm:ss")}));case 1:case"end":return e.stop()}},e,n)}));return function(n,a){return e.apply(this,arguments)}}())}};return m.a.createElement(t.a,d,m.a.createElement(s.a,null,m.a.createElement(h,v({},p,{label:"持续时间："}),f("timeRange",{rules:[{type:"array",required:!0,message:"请选择信息的有效时间!"}]})(m.a.createElement(b,{showTime:!0,format:"YYYY-MM-DD HH:mm:ss"}))),m.a.createElement(h,v({},p,{label:"开启视频："}),f("useVideo",{valuePropName:"checked"})(m.a.createElement(o.a,null))),m.a.createElement(h,v({},p,{label:"图片链接："}),f("showPhoto")(m.a.createElement(r.a,{placeholder:"请输入图片地址"}))),m.a.createElement(h,v({},p,{label:"视频链接："}),f("video")(m.a.createElement(r.a,{placeholder:"请输入视频地址"})))))}w.propTypes={visible:f.a.bool,onOk:f.a.func},w.defaultProps={visible:!1,onOk:function(){},onCancel:function(){}},n.default=d()(w)}}]);