import{c as d,g as Z}from"./_commonjsHelpers-de833af9.js";import{r as p}from"./__federation_shared_react-e93ad879.js";import{j as H}from"./jsx-runtime-5fe4d0a7.js";var J={},E={},m={};Object.defineProperty(m,"__esModule",{value:!0});m.eventNameFactory=void 0;var ee=function(u,i){return u+":"+i};m.eventNameFactory=ee;Object.defineProperty(E,"__esModule",{value:!0});E.useNuiEvent=void 0;var S=p,te=m;function re(u,i,t){u.addEventListener(i,t)}var ne=function(u,i,t){var a=S.useRef();S.useEffect(function(){a.current=t},[t]),S.useEffect(function(){var n=te.eventNameFactory(u,i),e=function(o){if(a.current&&a.current.call){var s=o.data,f=s;a.current(f)}};return re(window,n,e),function(){return window.removeEventListener(n,e)}},[u,i])};E.useNuiEvent=ne;var g={},_={};Object.defineProperty(_,"__esModule",{value:!0});_.NuiContext=void 0;var ue=p;_.NuiContext=ue.createContext(null);Object.defineProperty(g,"__esModule",{value:!0});g.useNuiCallback=void 0;var l=p,ae=_,ie=m,D=E,oe=function(u,i,t,a){var n=l.useContext(ae.NuiContext),e=n.sendAbortable,o=n.callbackTimeout,s=l.useRef(),f=l.useRef(),r=l.useRef(ie.eventNameFactory(u,i)),c=l.useRef(i),v=l.useRef(u),N=l.useState(!1),y=N[0],T=N[1],k=l.useState(!1),z=k[0],M=k[1],A=l.useState(!1),x=A[0],j=A[1],L=l.useState(null),K=L[0],O=L[1],q=l.useState(null),Q=q[0],F=q[1],V=l.useCallback(function(b){x&&(f.current&&clearTimeout(f.current),!y&&(F(b),O(null),j(!1),t?.(b)))},[t,y,x]),P=l.useCallback(function(b){f.current&&clearTimeout(f.current),O(b),F(null),j(!1),a?.(b)},[a]);D.useNuiEvent(v.current,c.current+"Success",V),D.useNuiEvent(v.current,c.current+"Error",P);var W=l.useCallback(function(b,X){j(function(U){if(!U){T(!1),M(!1),O(null),F(null),s.current=e(c.current,b),s.current.promise.catch(function(Y){y||(P(Y),M(!0),f.current=void 0,s.current=void 0)});var B=X||{timeout:o},$=B.timeout===!1?!1:B.timeout||o;return $&&!z&&(clearTimeout(f.current),f.current=setTimeout(function(){T(!0),P(new Error('fivem-nui-react-lib: "'+r.current+'" event callback timed out after '+$+" milliseconds")),s.current&&s.current.abort(),f.current=void 0,s.current=void 0},$)),!0}return U})},[]);return[W,{loading:x,response:Q,error:K}]};g.useNuiCallback=oe;var C={};Object.defineProperty(C,"__esModule",{value:!0});C.useNuiRequest=void 0;var G=p,ce=_,se=function(u){var i=u===void 0?{}:u,t=i.resource,a=G.useContext(ce.NuiContext);if(!a)throw new Error("fivem-nui-react-lib: useNuiRequest must be used inside NuiProvider passing the `resource` prop");var n=a.send,e=a.sendAbortable;return G.useMemo(function(){return{send:function(o,s){return s===void 0&&(s={}),n(o,s,t)},sendAbortable:function(o,s){return s===void 0&&(s={}),e(o,s,t)}}},[n,e,t])};C.useNuiRequest=se;var R={},w=d&&d.__assign||function(){return w=Object.assign||function(u){for(var i,t=1,a=arguments.length;t<a;t++){i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(u[n]=i[n])}return u},w.apply(this,arguments)},fe=d&&d.__awaiter||function(u,i,t,a){function n(e){return e instanceof t?e:new t(function(o){o(e)})}return new(t||(t=Promise))(function(e,o){function s(c){try{r(a.next(c))}catch(v){o(v)}}function f(c){try{r(a.throw(c))}catch(v){o(v)}}function r(c){c.done?e(c.value):n(c.value).then(s,f)}r((a=a.apply(u,i||[])).next())})},le=d&&d.__generator||function(u,i){var t={label:0,sent:function(){if(e[0]&1)throw e[1];return e[1]},trys:[],ops:[]},a,n,e,o;return o={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function s(r){return function(c){return f([r,c])}}function f(r){if(a)throw new TypeError("Generator is already executing.");for(;t;)try{if(a=1,n&&(e=r[0]&2?n.return:r[0]?n.throw||((e=n.return)&&e.call(n),0):n.next)&&!(e=e.call(n,r[1])).done)return e;switch(n=0,e&&(r=[r[0]&2,e.value]),r[0]){case 0:case 1:e=r;break;case 4:return t.label++,{value:r[1],done:!1};case 5:t.label++,n=r[1],r=[0];continue;case 7:r=t.ops.pop(),t.trys.pop();continue;default:if(e=t.trys,!(e=e.length>0&&e[e.length-1])&&(r[0]===6||r[0]===2)){t=0;continue}if(r[0]===3&&(!e||r[1]>e[0]&&r[1]<e[3])){t.label=r[1];break}if(r[0]===6&&t.label<e[1]){t.label=e[1],e=r;break}if(e&&t.label<e[2]){t.label=e[2],t.ops.push(r);break}e[2]&&t.ops.pop(),t.trys.pop();continue}r=i.call(u,t)}catch(c){r=[6,c],n=0}finally{a=e=0}if(r[0]&5)throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}};Object.defineProperty(R,"__esModule",{value:!0});R.NuiProvider=void 0;var ve=H,h=p,de=_,be=m;function me(u,i){var t=new AbortController,a=t.signal;return{abort:function(){return t.abort()},promise:fetch(u,w(w({},i),{signal:a}))}}function I(u,i,t){return["https://"+u+"/"+i,{method:"post",headers:{"Content-Type":"application/json; charset=UTF-8"},body:JSON.stringify(t)}]}var _e=1e4,Ne=function(u){var i=u.resource,t=u.children,a=u.timeout,n=h.useRef(i||""),e=h.useRef(a||_e),o=function(r){var c=r.data,v=c.app,N=c.method,y=c.data;v&&N&&window.dispatchEvent(new MessageEvent(be.eventNameFactory(v,N),{data:y}))};h.useEffect(function(){return window.addEventListener("message",o),function(){return window.removeEventListener("message",o)}},[]);var s=h.useCallback(function(r,c,v){return c===void 0&&(c={}),fe(void 0,void 0,void 0,function(){return le(this,function(N){return[2,fetch.apply(void 0,I(v||n.current,r,c))]})})},[]),f=h.useCallback(function(r,c,v){return c===void 0&&(c={}),me.apply(void 0,I(v||n.current,r,c))},[]);return ve.jsx(de.NuiContext.Provider,w({value:{send:s,sendAbortable:f,resource:n.current,callbackTimeout:e.current}},{children:t}),void 0)};R.NuiProvider=Ne;(function(u){var i=d&&d.__createBinding||(Object.create?function(a,n,e,o){o===void 0&&(o=e),Object.defineProperty(a,o,{enumerable:!0,get:function(){return n[e]}})}:function(a,n,e,o){o===void 0&&(o=e),a[o]=n[e]}),t=d&&d.__exportStar||function(a,n){for(var e in a)e!=="default"&&!Object.prototype.hasOwnProperty.call(n,e)&&i(n,a,e)};Object.defineProperty(u,"__esModule",{value:!0}),t(E,u),t(g,u),t(C,u),t(_,u),t(R,u),t(m,u)})(J);const pe=Z(J);export{pe as default};
