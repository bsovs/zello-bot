(this["webpackJsonpzello-bot"]=this["webpackJsonpzello-bot"]||[]).push([[0],{148:function(e,t,n){e.exports=n(380)},153:function(e,t,n){},175:function(e,t,n){},373:function(e,t){},380:function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o),r=n(139),c=n.n(r),s=(n(153),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)));function i(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var l=n(140),u=n.n(l),h=n(33),m=n(4),d=n(141),p=n(15),f=n(17),b=n(20),v=n(19),g=n(18),k=n(35),w=(n(55),n(85),n(86),n(87),n(143)),C=n.n(w),E=n(27),y=n.n(E),S=n(52),j=(n(175),n(144)),D=n(53),O=n(36),x="#b082ff",W="#F47373",I="#37D67A",A="#2CCCE4",L="#FFA500",M=function(e){Object(b.a)(n,e);var t=Object(v.a)(n);function n(e){var o;Object(p.a)(this,n),(o=t.call(this,e)).toggle=function(){if(o.state.prefersDarkScheme.matches){document.body.classList.toggle("light-theme");var e=document.body.classList.contains("light-theme")?"light":"dark"}else{document.body.classList.toggle("dark-theme");e=document.body.classList.contains("dark-theme")?"dark":"light"}o.props.setIsDark(!o.props.isDark),localStorage.setItem("theme",e)},o.handleChangeComplete=function(e){e&&e.hex&&(g("body").css("--btn-color",e.hex),g("body").css("--global-color",e.hex),o.state.localTheme!==e.hex&&localStorage.setItem("themeColor",e.hex),o.setState({themeColor:e.hex}))};var a=localStorage.getItem("themeColor");return o.state={prefersDarkScheme:window.matchMedia("(prefers-color-scheme: dark)"),currentTheme:localStorage.getItem("theme"),localTheme:a,themeColor:a||x},o.props.setIsDark(!!o.state.prefersDarkScheme.matches),o}return Object(f.a)(n,[{key:"componentDidMount",value:function(){var e=Object(S.a)(y.a.mark((function e(){return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:"dark"===this.state.currentTheme?(document.body.classList.add("dark-theme"),this.props.setIsDark(!0)):"light"===this.state.currentTheme&&(document.body.classList.add("light-theme"),this.props.setIsDark(!1)),this.state.localTheme&&(g("body").css("--btn-color",this.state.themeColor),g("body").css("--global-color",this.state.themeColor));case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.props.isDark;return a.a.createElement(a.a.Fragment,null,a.a.createElement("button",{className:"btn float-right",onClick:this.toggle,"aria-label":e?"Enable Light-Mode":"Enable Dark-Mode"},a.a.createElement(D.a,{icon:e?O.c:O.b,size:"1x"})),a.a.createElement(j.CirclePicker,{className:"float-right",width:"220px",colors:[x,W,I,A,L],color:this.state.themeColor,onChangeComplete:this.handleChangeComplete}))}}]),n}(o.Component),T=n(145),F=n.n(T),N=("".concat(window.location.protocol.toString(),"//").concat(window.location.hostname.toString()),"".concat(window.location.port.toString())),z=!1;"localhost"===window.location.hostname&&"web"===k.a.platform&&(":".concat(N),z=!0);var B=z?"http://localhost:8080":"https://pokeweather.herokuapp.com",P=F()("".concat(B)),R=function(e){Object(b.a)(n,e);var t=Object(v.a)(n);function n(e){var o;return Object(p.a)(this,n),(o=t.call(this,e)).state={},o}return Object(f.a)(n,[{key:"componentDidMount",value:function(){var e=Object(S.a)(y.a.mark((function e(){var t=this;return y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.props.isWeb&&(P.on("connect_error",(function(){t.props.setSocketConnected(!1).then((function(){}))})),P.on("connected",(function(){t.props.setSocketConnected(!0)})));case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.props,t=e.isWeb,n=e.socketConnected;return t&&!n?a.a.createElement("div",{class:"alert alert-dismissible  show",role:"alert"},a.a.createElement(D.a,{icon:O.a,size:"1x"}),a.a.createElement("strong",null,"Internet not Connected")):null}}]),n}(o.Component),U=(new function e(){Object(p.a)(this,e)},function(e){Object(b.a)(n,e);var t=Object(v.a)(n);function n(e){var o;return Object(p.a)(this,n),(o=t.call(this,e)).state=e,o}return Object(f.a)(n,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.state.value;return a.a.createElement(a.a.Fragment,null,a.a.createElement("h2",null,e))}}]),n}(o.Component)),J=function(e){Object(b.a)(n,e);var t=Object(v.a)(n);function n(e){var o;return Object(p.a)(this,n),(o=t.call(this,e)).home=function(){o.setState({})},o.joinRoom=function(e){e.preventDefault(),o.setState({})},o.state={isDark:!1,isWeb:"web"===k.a.platform,socketConnected:!0},o}return Object(f.a)(n,[{key:"componentDidMount",value:function(){this.setState({socketConnected:!this.state.isWeb||null!==this.state.socketConnected})}},{key:"render",value:function(){var e=this;return Object(d.a)(this.state),a.a.createElement("div",{className:"App noselect"},a.a.createElement("header",null,a.a.createElement("span",null,a.a.createElement(R,{isWeb:this.state.isWeb,socketConnected:this.state.socketConnected,setSocketConnected:function(t){return new Promise((function(n,o){e.setState({socketConnected:t},n())}))}})),a.a.createElement(a.a.Fragment,null,a.a.createElement(M,{isDark:this.state.isDark,setIsDark:function(t){return e.setState({isDark:t})}}))),a.a.createElement("main",null,a.a.createElement("h1",null,"Zello Bot"),a.a.createElement(C.a,{enableMouseEvents:!0},a.a.createElement(U,{value:"Swipe Card -> "}),a.a.createElement(U,{value:"Another Card"}),a.a.createElement(U,{value:"Another one..."}))),a.a.createElement("footer",null,a.a.createElement("p",null,"Created by Brandon Sovran.")))}}]),n}(o.Component),Z=function(){return a.a.createElement(m.c,null," ",a.a.createElement(m.a,{exact:!0,path:"/",component:J}))};c.a.render(a.a.createElement(u.a,null,a.a.createElement(h.a,null,a.a.createElement(Z,null))),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");s?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var o=n.headers.get("content-type");404===n.status||null!=o&&-1===o.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):i(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):i(t,e)}))}}()},85:function(e,t,n){e.exports=n.p+"static/media/logo.ee7cd8ed.svg"},86:function(e,t,n){}},[[148,1,2]]]);
//# sourceMappingURL=main.365313fb.chunk.js.map