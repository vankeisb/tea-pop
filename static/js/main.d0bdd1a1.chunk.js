(this.webpackJsonpdemo=this.webpackJsonpdemo||[]).push([[0],[,,function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||t.hasOwnProperty(n)||r(t,e,n)};Object.defineProperty(t,"__esModule",{value:!0}),i(n(14),t);var u=n(73);Object.defineProperty(t,"menuUpdate",{enumerable:!0,get:function(){return u.update}}),Object.defineProperty(t,"ViewMenu",{enumerable:!0,get:function(){return u.ViewMenu}}),Object.defineProperty(t,"defaultItemRenderer",{enumerable:!0,get:function(){return u.defaultItemRenderer}}),Object.defineProperty(t,"separator",{enumerable:!0,get:function(){return u.separator}}),Object.defineProperty(t,"item",{enumerable:!0,get:function(){return u.item}}),Object.defineProperty(t,"Menu",{enumerable:!0,get:function(){return u.Menu}}),Object.defineProperty(t,"menu",{enumerable:!0,get:function(){return u.menu}}),Object.defineProperty(t,"menuSubscriptions",{enumerable:!0,get:function(){return u.subscriptions}}),Object.defineProperty(t,"menuOpen",{enumerable:!0,get:function(){return u.open}});var o=n(78);Object.defineProperty(t,"dropDownOpen",{enumerable:!0,get:function(){return o.open}}),Object.defineProperty(t,"dropDownUpdate",{enumerable:!0,get:function(){return o.update}}),Object.defineProperty(t,"dropDownSubscriptions",{enumerable:!0,get:function(){return o.subscriptions}}),Object.defineProperty(t,"ViewDropDown",{enumerable:!0,get:function(){return o.ViewDropDown}})},,,,,,,,,,,,function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||t.hasOwnProperty(n)||r(t,e,n)};Object.defineProperty(t,"__esModule",{value:!0}),i(n(70),t),i(n(20),t),i(n(15),t),i(n(32),t),i(n(71),t),i(n(72),t)},function(e,t,n){"use strict";var r=n(4);Object.defineProperty(t,"__esModule",{value:!0}),t.dim=t.Dim=void 0;var i=function e(t,n){r(this,e),this.w=t,this.h=n};function u(e,t){return new i(e,null!==t&&void 0!==t?t:e)}t.Dim=i,i.zero=u(0),t.dim=u},,,,,function(e,t,n){"use strict";var r=n(4),i=n(5);Object.defineProperty(t,"__esModule",{value:!0}),t.pos=t.Pos=void 0;var u=function(){function e(t,n){r(this,e),this.x=t,this.y=n}return i(e,[{key:"add",value:function(t){return new e(this.x+t.x,this.y+t.y)}}]),e}();function o(e,t){return new u(e,t)}t.Pos=u,u.origin=o(0,0),t.pos=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.docMouseDown=t.gotItemBox=t.childMsg=t.gotKeyDown=t.gotMenuBox=t.gotUuid=t.gotWindowDimensions=t.noop=void 0,t.noop=function(){return{tag:"noop"}},t.gotWindowDimensions=function(e){return{tag:"got-window-dimensions",d:e}},t.gotUuid=function(e){return{tag:"got-uuid",uuid:e}},t.gotMenuBox=function(e){return{tag:"got-menu-box",r:e}},t.gotKeyDown=function(e){return{tag:"key-down",key:e}},t.childMsg=function(e){return{tag:"child-msg",m:e}},t.gotItemBox=function(e,t,n,r){return{tag:"got-item-box",item:e,selectFirst:r,r:t,subMenuCounter:n}},t.docMouseDown=function(){return{tag:"doc-mouse-down"}}},function(e,t,n){"use strict";var r=n(4),i=n(5);Object.defineProperty(t,"__esModule",{value:!0}),t.menuItemTask=t.menuTask=t.menuItemId=t.menuId=t.separator=t.item=t.menu=t.Menu=void 0;var u=n(0),o=function(){function e(t){r(this,e),this.elements=t}return i(e,[{key:"selectFirstItem",value:function(){return new e(this.elements.selectIndex(0))}},{key:"selectItem",value:function(t){return new e(this.elements.select((function(e){return e===t})))}},{key:"deselectAll",value:function(){return new e(u.ListWithSelection.fromArray(this.elements.toArray()))}},{key:"isSelected",value:function(e){return this.elements.isSelected(e)}},{key:"findNextItemIndex",value:function(e){for(var t=this.elems,n=e===t.length-1?0:e+1;n<t.length;n++)if("item"===t[n].tag)return u.just(n);return u.nothing}},{key:"findPreviousItemIndex",value:function(e){for(var t=this.elems,n=0===e?t.length-1:e-1;n>=0;n--)if("item"===t[n].tag)return u.just(n);return u.nothing}},{key:"moveSelection",value:function(t){var n=this;return this.elements.getSelectedIndex().map((function(r){return(t?n.findNextItemIndex(r):n.findPreviousItemIndex(r)).map((function(t){return new e(n.elements.selectIndex(t))})).withDefault(n)})).withDefaultSupply((function(){return new e(n.elements.selectIndex(t?0:n.elements.length()-1))}))}},{key:"indexOfItem",value:function(e){var t=this.elements.toArray().indexOf(e);return-1===t?u.nothing:u.just(t)}},{key:"elems",get:function(){return this.elements.toArray()}},{key:"selectedItem",get:function(){var e=this.elements.getSelected();return"Just"===e.type&&"item"===e.value.tag?u.just(e.value):u.nothing}}]),e}();function a(e){return"tm-".concat(btoa(e))}function c(e,t){return"tm-item-".concat(e,"-").concat(t)}function s(e){return u.Task.fromLambda((function(){var t=document.getElementById(e);if(null===t)throw new Error("element not found with id:"+e);return t}))}t.Menu=o,t.menu=function(e){return new o(u.ListWithSelection.fromArray(e))},t.item=function(e,t){return{tag:"item",userData:e,subMenu:u.maybeOf(t)}},t.separator={tag:"separator"},t.menuId=a,t.menuItemId=c,t.menuTask=function(e){return s(a(e))},t.menuItemTask=function(e,t){return s(c(e,t))}},,,,,,,,,,function(e,t,n){"use strict";var r=n(4),i=n(5);Object.defineProperty(t,"__esModule",{value:!0}),t.box=t.Box=void 0;var u=n(20),o=n(15),a=function(){function e(t,n){r(this,e),this.p=t,this.d=n}return i(e,null,[{key:"fromDomRect",value:function(e){var t=e.x,n=e.y,r=e.height,i=e.width;return c(u.pos(t,n),o.dim(i,r))}}]),e}();function c(e,t){return new a(e,t)}t.Box=a,t.box=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.keyboardNavigated=t.menuStatePlacing=t.initialModel=void 0;var r=n(0);function i(e){return{tag:"placing",refBox:e}}t.initialModel=function(e,t){return{uuid:r.nothing,windowSize:r.nothing,menu:e,state:i(t),error:r.nothing,child:r.nothing,navigatedWithKeyboard:!1,subMenuCounter:0}},t.menuStatePlacing=i,t.keyboardNavigated=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return Object.assign(Object.assign({},e),{navigatedWithKeyboard:t})}},,function(e,t,n){e.exports=n(79)},,,,,function(e,t,n){},function(e,t,n){},,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.stopEvent=void 0,t.stopEvent=function(e){e.preventDefault(),e.stopPropagation()}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.place1DStart=t.place1DEnd=t.placeCombo=t.place=void 0;var r=n(32),i=n(15),u=n(20);function o(e,t,n,r){return t+n+r>e?r<t?{offset:t-r,len:r}:r<e?{offset:t+n-(t+n+r-e),len:r}:{offset:0,len:e}:{offset:t+n,len:r}}function a(e,t,n,r){return r>e?{offset:0,len:e}:t+r>e?r<t+n?{offset:t+n-r,len:r}:r<e?{offset:t+n-(t+n+r-e),len:r}:{offset:0,len:10}:{offset:t,len:r}}t.place=function(e,t,n){var c=o(e.w,t.p.x,t.d.w,n.w),s=a(e.h,t.p.y,t.d.h,n.h);return r.box(u.pos(c.offset,s.offset),i.dim(c.len,s.len))},t.placeCombo=function(e,t,n){var o=a(e.w,t.p.x,t.d.w,n.w),c=function(e,t,n,r){var i=t+n,u=t,o=e-i;return r<o?{offset:i,len:r}:r<u?{offset:t-r,len:r}:u>o?{offset:0,len:u}:{offset:i,len:o}}(e.h,t.p.y,t.d.h,n.h);return r.box(u.pos(o.offset,c.offset),i.dim(o.len,c.len))},t.place1DEnd=o,t.place1DStart=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getWindowDimensions=t.windowDimensions=void 0;var r=n(15),i=n(0);function u(){return r.dim(window.innerWidth,window.innerHeight)}t.windowDimensions=u,t.getWindowDimensions=i.Task.succeedLazy((function(){return u()}))},function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||t.hasOwnProperty(n)||r(t,e,n)};Object.defineProperty(t,"__esModule",{value:!0}),i(n(33),t),i(n(21),t),i(n(22),t),i(n(74),t),i(n(75),t),i(n(76),t),i(n(77),t)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.subscriptions=t.update=t.open=void 0;var r=n(21),i=n(0),u=n(33),o=n(22),a=n(14);function c(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return[u.initialModel(n?e.selectFirstItem():e.deselectAll(),t),i.Cmd.batch([i.Task.perform(g,(function(e){return r.gotWindowDimensions(e)})),i.Task.perform(i.uuid(),(function(e){return r.gotUuid(e)}))])]}function s(e){return"Nothing"===e.uuid.type||"Nothing"===e.windowSize.type?i.noCmd(e):[e,i.Task.attempt(o.menuTask(e.uuid.value).map((function(e){return a.Box.fromDomRect(e.getBoundingClientRect())})),(function(e){return r.gotMenuBox(e)}))]}function d(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:i.nothing;return[e[0],e[1],t]}function m(e){return i.just({tag:"item-selected",data:e.userData})}function l(e,t,n,u,c){if(n.subMenu.isNothing())return i.noCmd(e);var s=e.subMenuCounter+1;return i.Tuple.t2n(Object.assign(Object.assign({},e),{subMenuCounter:s}),i.Task.attempt(o.menuItemTask(t,u).map((function(e){return a.Box.fromDomRect(e.getBoundingClientRect())})),(function(e){return r.gotItemBox(n,e,s,c)})))}t.open=c,t.update=function e(t,n){switch(t.tag){case"got-window-dimensions":return d(s(Object.assign(Object.assign({},n),{windowSize:i.just(t.d)})));case"got-uuid":return d(s(Object.assign(Object.assign({},n),{uuid:i.just(t.uuid)})));case"got-menu-box":if("placing"===n.state.tag){var o=n.state;return d(i.noCmd(n.windowSize.map((function(e){return t.r.match((function(t){return Object.assign(Object.assign({},n),{state:{tag:"open",box:a.place(e,o.refBox,t.d)}})}),(function(e){return Object.assign(Object.assign({},n),{error:i.just(e)})}))})).withDefault(n)))}return d(i.noCmd(n));case"key-down":switch(t.key){case"Escape":return d(h(u.keyboardNavigated(n)),n.child.isNothing()?i.just({tag:"request-close"}):i.nothing);case"ArrowDown":case"ArrowUp":return b(u.keyboardNavigated(n),(function(e){return d(i.noCmd(Object.assign(Object.assign({},e),{menu:e.menu.moveSelection("ArrowDown"===t.key)})))}));case"ArrowLeft":return d(h(u.keyboardNavigated(n)));case"ArrowRight":return function(e){return b(e,(function(e){return e.menu.selectedItem.map((function(t){return t.subMenu.map((function(){if("Nothing"===e.uuid.type)return d(i.noCmd(e));var n=e.uuid.value;return d(e.menu.indexOfItem(t).map((function(r){return l(e,n,t,r,!0)})).withDefaultSupply((function(){return i.noCmd(e)})))})).withDefaultSupply((function(){return d(i.noCmd(e))}))})).withDefaultSupply((function(){return d(i.noCmd(e))}))}))}(u.keyboardNavigated(n));case"Enter":case" ":return function(e){return b(e,(function(e){return e.menu.selectedItem.map((function(t){if("Nothing"===e.uuid.type)return d(i.noCmd(e));var n=e.uuid.value;return t.subMenu.map((function(){return d(e.menu.indexOfItem(t).map((function(r){return l(e,n,t,r,!0)})).withDefaultSupply((function(){return i.noCmd(e)})))})).withDefaultSupply((function(){return d(i.noCmd(e),m(t))}))})).withDefaultSupply((function(){return d(i.noCmd(e))}))}))}(n);default:return d(i.noCmd(n))}case"mouse-enter":var f=Object.assign(Object.assign({},n),{subMenuCounter:n.subMenuCounter+1});if(n.navigatedWithKeyboard)return d(i.noCmd(u.keyboardNavigated(f,!1)));if("Nothing"===n.uuid.type)return d(i.noCmd(f));var p=n.menu.selectItem(t.item),g=n.uuid.value;return d(l(Object.assign(Object.assign({},f),{menu:p,child:i.nothing}),g,t.item,t.itemIndex,!1));case"mouse-leave":return d(i.noCmd(n.child.isJust()?n:Object.assign(Object.assign({},n),{menu:n.menu.deselectAll()})));case"got-item-box":return t.subMenuCounter!==n.subMenuCounter?d(i.noCmd(n)):d(t.r.match((function(e){var u=Object.assign(Object.assign({},n),{menu:n.menu.selectItem(t.item)});return t.item.subMenu.map((function(n){var o=c(n,e,t.selectFirst),a=Object.assign(Object.assign({},u),{child:i.just(o[0])});return i.Tuple.t2n(a,o[1].map(r.childMsg))})).withDefaultSupply((function(){return u.child.map((function(){return i.noCmd(Object.assign(Object.assign({},n),{child:i.nothing}))})).withDefaultSupply((function(){return i.noCmd(n)}))}))}),(function(e){return i.noCmd(Object.assign(Object.assign({},n),{error:i.just(e)}))})));case"child-msg":return n.child.map((function(u){var o=e(t.m,u),a=Object.assign(Object.assign({},n),{child:i.just(o[0])});return d(i.Tuple.t2n(a,o[1].map(r.childMsg)),o[2])})).withDefaultSupply((function(){return d(i.noCmd(n))}));case"item-clicked":return d(i.noCmd(n),m(t.item));case"doc-mouse-down":return d(i.noCmd(n),i.just({tag:"request-close"}));case"noop":return d(i.noCmd(n))}};var f=new i.WindowEvents,p=new i.DocumentEvents;t.subscriptions=function(e){return i.Sub.batch([f.on("resize",(function(){return r.gotWindowDimensions(a.dim(window.innerWidth,window.innerHeight))})),p.on("mousedown",(function(e){if(2===e.button)return r.noop();for(var t=e.target;t;){if(t.classList.contains("tm"))return r.noop();t=t.parentElement}return r.docMouseDown()})),"open"===e.state.tag?p.on("keydown",(function(e){return r.gotKeyDown(e.key)})):i.Sub.none()])};var g=i.Task.succeedLazy((function(){return a.dim(window.innerWidth,window.innerHeight)}));function b(e,t){switch(e.child.type){case"Nothing":return t(e);case"Just":var n=b(e.child.value,t);return[Object.assign(Object.assign({},e),{child:i.just(n[0])}),n[1].map(r.childMsg),n[2]]}}function h(e){switch(e.child.type){case"Nothing":return i.noCmd(e);case"Just":var t=e.child.value;return t.child.isJust()?i.Tuple.fromNative(h(t)).mapFirst((function(t){return Object.assign(Object.assign({},e),{child:i.just(t)})})).mapSecond((function(e){return e.map(r.childMsg)})).toNative():i.noCmd(Object.assign(Object.assign({},e),{child:i.nothing}))}}},function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),u=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.hasOwnProperty.call(e,n)&&r(t,e,n);return i(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.ViewMenuItem=t.ViewMenu=void 0;var o=u(n(1)),a=n(22),c=n(21),s=n(0),d=n(14);function m(e){var t=e.menu,n=e.item,r=e.renderer,i=e.dispatch,u=e.uuid,c=e.itemIndex,s=t.isSelected(n);return o.createElement("div",{id:a.menuItemId(u,c),onMouseEnter:function(){return i({tag:"mouse-enter",item:n,itemIndex:c})},onMouseLeave:function(){return i({tag:"mouse-leave",item:n,itemIndex:c})},onClick:function(){i({tag:"item-clicked",item:n})}},r({data:n.userData,active:s,hasSubMenu:n.subMenu.isJust()}))}t.ViewMenu=function e(t){var n=t.model,r=t.dispatch,i=t.renderer,u=n.menu,l=n.state,f=n.uuid,p=n.windowSize;if("Nothing"===f.type)return o.createElement(o.Fragment,null);if("Nothing"===p.type)return o.createElement(o.Fragment,null);var g=function(){return u.elems.map((function(e,n){switch(e.tag){case"item":return o.createElement(m,Object.assign({key:"item-".concat(n),uuid:f.value,itemIndex:n,menu:u,item:e},t));case"separator":return o.createElement("div",{key:"sep-".concat(n),className:"tm-separator"})}}))};switch(l.tag){case"placing":var b=l.refBox;return o.createElement("div",{className:"tm-placer",style:{position:"absolute",top:0,left:0,bottom:0,right:0,overflow:"hidden"},onContextMenu:d.stopEvent},o.createElement("div",{className:"tm",id:a.menuId(f.value),style:{position:"absolute",top:b.p.y,left:b.p.x,visibility:"hidden"},onContextMenu:d.stopEvent},g()));case"open":var h=l.box,v=h.p,w=h.d;return o.createElement(o.Fragment,null,o.createElement("div",{className:"tm",id:a.menuId(f.value),style:{position:"absolute",top:v.y,left:v.x,width:w.w,height:w.h},onContextMenu:d.stopEvent},g()),n.child.map((function(t){return o.createElement(e,{model:t,dispatch:s.map(r,c.childMsg),renderer:i})})).withDefaultSupply((function(){return o.createElement(o.Fragment,null)})))}},t.ViewMenuItem=m},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0})},function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),u=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.hasOwnProperty.call(e,n)&&r(t,e,n);return i(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.defaultItemRenderer=void 0;var o=u(n(1));t.defaultItemRenderer=function(e){return function(t){var n=t.data,r=t.active,i=t.hasSubMenu,u=r?" tm-active":"";return o.createElement("div",{className:"tm-item".concat(u)},o.createElement("div",{className:"tm-item__content"},e(n)),i?o.createElement("div",{className:"tm-item__submenu"},"\u203a"):o.createElement(o.Fragment,null))}}},function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),u=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.hasOwnProperty.call(e,n)&&r(t,e,n);return i(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.subscriptions=t.update=t.ViewDropDown=t.open=void 0;var o=u(n(1)),a=n(14),c=n(0);function s(e){return{tag:"got-rendered-box",r:e}}function d(e){return{tag:"got-init-data",r:e}}var m={tag:"noop"},l={tag:"request-close"};function f(e){return console.error(e),p(c.noCmd({tag:"error",e:e}))}function p(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return[e[0],e[1],t]}t.open=function(e){var t=e.andThen((function(e){return a.getWindowDimensions.andThen((function(t){return c.uuid().map((function(n){return{refBox:e,windowDimensions:t,uuid:n}}))}))}));return[{tag:"fresh"},c.Task.attempt(t,d)]},t.ViewDropDown=function(e){var t=e.renderer,n=e.model;switch(n.tag){case"fresh":return o.createElement("div",{className:"tm-drop-down tm-placing",style:{position:"absolute",top:0,left:0,visibility:"hidden"}},t());case"error":return o.createElement(o.Fragment,null);case"ready":return n.placed.map((function(e){var r=e.p,i=e.d;return o.createElement("div",{id:n.initData.uuid,className:"tm-drop-down tm-placed",style:{position:"absolute",top:r.y,left:r.x,width:i.w,height:i.h}},t())})).withDefaultSupply((function(){return o.createElement("div",{id:n.initData.uuid,className:"tm-drop-down tm-placing",style:{position:"absolute",top:0,left:0,visibility:"hidden"}},t())}))}},t.update=function(e,t){switch(e.tag){case"got-init-data":return"fresh"!==t.tag?p(c.noCmd(t)):e.r.match((function(e){return[{tag:"ready",initData:e,placed:c.nothing},c.Task.attempt(function(e){return(t=e,c.Task.fromLambda((function(){var e=document.getElementById(t);if(!e)throw new Error("element not found "+t);return e}))).map((function(e){return a.Box.fromDomRect(e.getBoundingClientRect())}));var t}(e.uuid),s),!1]}),f);case"got-rendered-box":return e.r.match((function(e){if("ready"!==t.tag)return p(c.noCmd(t));var n=t.initData,r=n.windowDimensions,i=n.refBox,u=a.placeCombo(r,i,e.d);return p(c.noCmd(Object.assign(Object.assign({},t),{placed:c.just(u)})))}),f);case"request-close":return p([t,c.Cmd.none()],!0);case"noop":return p(c.noCmd(t))}};var g=new c.DocumentEvents;t.subscriptions=function(){return c.Sub.batch([g.on("keydown",(function(e){return"Escape"===e.key?l:m})),g.on("mousedown",(function(e){for(var t=e.target;t;){if(t.classList.contains("tm-drop-down"))return m;t=t.parentElement}return l}))])}},function(e,t,n){"use strict";n.r(t);var r=n(1),i=n.n(r),u=n(34),o=n.n(u),a=(n(40),n(41),n(0)),c=n(3),s=n(2);function d(){return{tag:"main-page",menuModel:a.nothing,lastClicked:a.nothing}}function m(e){return{tag:"dd-page-msg",m:e}}function l(e){return{tag:"main-page-msg",m:e}}function f(e){return{tag:"got-window-dimensions",d:e}}function p(e){return{tag:"menu-msg",msg:e}}function g(e){return{tag:"switch-page",page:e}}var b=Object(s.menu)([Object(s.item)("Try"),Object(s.item)("Finally")]),h=Object(s.menu)([Object(s.item)("Do this"),Object(s.item)("Do that"),s.separator,Object(s.item)("Another sub menu...",b)]),v=Object(s.menu)([Object(s.item)("Copy"),Object(s.item)("Cut"),Object(s.item)("Paste"),s.separator,Object(s.item)("Yalla",h),Object(s.item)("I am a bit longer")]),w=Object(s.defaultItemRenderer)((function(e){return r.createElement("span",null,e)}));function j(){return Object(a.noCmd)({mousePos:s.Pos.origin,page:d()})}function O(e,t){switch(t.page.tag){case"main-page":return function(e,t){return r.createElement(r.Fragment,null,r.createElement("div",{className:"demo",onContextMenu:s.stopEvent,onMouseDown:function(t){return e(l({tag:"mouse-down",button:t.button}))}},r.createElement("div",{className:"page-switch"},r.createElement("a",{href:"#",onClick:function(){return e(g("drop-down-page"))}},"Drop-down")," ","|"," ",r.createElement("a",{href:"#",onClick:function(){return e(g("placement-page"))}},"Placement tests")),t.menuModel.map((function(){return r.createElement("span",null,"Menu is open")})).withDefaultSupply((function(){return t.lastClicked.map((function(e){return r.createElement("span",null,"You selected ",r.createElement("em",null,e))})).withDefaultSupply((function(){return r.createElement(r.Fragment,null,r.createElement("div",null,"Right-click anywhere, or use the ",r.createElement("code",null,"\u2263")," key."))}))}))),t.menuModel.map((function(t){return r.createElement(s.ViewMenu,{model:t,dispatch:Object(a.map)(e,(function(e){return l(p(e))})),renderer:w})})).withDefault(r.createElement(r.Fragment,null)))}(e,t.page);case"placement-page":return function(e,t,n){return n.viewportDim.map((function(e){var i="menu"===n.mode?s.place:s.placeCombo,u=t.mousePos,o=Object(s.dim)(600,400),a=Object(s.dim)(100,50),c=i(e,Object(s.box)(Object(s.pos)(u.x,u.y),a),o),d=function(e){return r.createElement("span",null,e.w,"*",e.h)},m=function(e){return r.createElement("span",null,e.x,":",e.y)};return r.createElement("div",{className:"demo"},r.createElement("div",{className:"dimensions"},r.createElement("h1",null,"Placement tests (",r.createElement("code",null,"x")," to close)"),r.createElement("ul",null,r.createElement("li",null,"mode: ",n.mode," (toggle with ",r.createElement("code",null,"M"),")"),r.createElement("li",null,"elem: ",d(o)),r.createElement("li",null,"viewport: ",d(e)),r.createElement("li",null,"ref: ",d(a)),r.createElement("li",null,"mousePos: ",m(u)),r.createElement("li",null,"placed: ",m(c.p),", ",d(c.d)))),r.createElement("div",{className:"ref-elem",style:{height:a.h,width:a.w,left:t.mousePos.x,top:t.mousePos.y}}),r.createElement("div",{className:"menu-elem",style:{height:c.d.h,width:c.d.w,left:c.p.x,top:c.p.y}}))})).withDefaultSupply((function(){return r.createElement(r.Fragment,null)}))}(0,t,t.page);case"drop-down-page":return function(e,t){return t.viewportDim.map((function(n){for(var i=Math.floor(n.w/10),u=Math.floor(n.h/10),o=[],a=1,c=u-8,d=i-8,l=0;l+4+d<n.w;l+=i)for(var f=function(n){var i=a,u=n+4,f=l+4,p=t.indexAndModel.map((function(e){return e.a})).filter((function(e){return e===i})).map((function(){return"lightblue"})).withDefault("lightgray");o.push(r.createElement("button",{key:"btn"+a,style:{position:"absolute",top:u,left:f,height:c,width:d,border:"none",backgroundColor:p},onClick:function(t){return e(m({tag:"button-clicked",index:i,b:s.Box.fromDomRect(t.target.getBoundingClientRect())}))}},a)),a++},p=0;p+4+c<n.h;p+=u)f(p);return r.createElement(r.Fragment,null,r.createElement("div",{className:"drop-down-page"},o),t.indexAndModel.map((function(e){return r.createElement(s.ViewDropDown,{renderer:function(){return r.createElement("div",{className:"my-drop-down"},"HELLO")},model:e.b})})).withDefaultSupply((function(){return r.createElement(r.Fragment,null)})))})).withDefaultSupply((function(){return r.createElement(r.Fragment,null)}))}(e,t.page)}}function y(e,t){switch(e.tag){case"main-page-msg":if("main-page"!==t.page.tag)return Object(a.noCmd)(t);var n=e.m,r=t.page;switch(n.tag){case"menu-msg":if("Nothing"===r.menuModel.type)return Object(a.noCmd)(t);var i=r.menuModel.value,u=Object(s.menuUpdate)(n.msg,i),o=Object(c.a)(Object(c.a)({},r),{},{menuModel:Object(a.just)(u[0])}),g=Object(c.a)(Object(c.a)({},t),{},{page:o}),b=u[1].map(p).map(l),h=[g,b];return u[2].map((function(e){switch(e.tag){case"request-close":var t=E(g);return a.Tuple.fromNative(t).mapSecond((function(e){return a.Cmd.batch([b,e])})).toNative();case"item-selected":var n=E(g,Object(a.just)(e.data));return a.Tuple.fromNative(n).mapSecond((function(e){return a.Cmd.batch([b,e])})).toNative()}})).withDefault(h);case"mouse-down":return 2===n.button?x(t,Object(s.menuOpen)(v,Object(s.box)(t.mousePos,s.Dim.zero))):Object(a.noCmd)(t)}break;case"key-down":switch(t.page.tag){case"main-page":return"ContextMenu"===e.key?x(t,Object(s.menuOpen)(v,Object(s.box)(t.mousePos,s.Dim.zero))):Object(a.noCmd)(t);case"placement-page":var w=t.page;switch(e.key){case"x":return Object(a.noCmd)(Object(c.a)(Object(c.a)({},t),{},{page:d()}));case"m":return Object(a.noCmd)(Object(c.a)(Object(c.a)({},t),{},{page:Object(c.a)(Object(c.a)({},w),{},{mode:"menu"===w.mode?"drop-down":"menu"})}));default:return Object(a.noCmd)(t)}case"drop-down-page":switch(e.key){case"x":return Object(a.noCmd)(Object(c.a)(Object(c.a)({},t),{},{page:d()}))}return Object(a.noCmd)(t)}break;case"mouse-move":return Object(a.noCmd)(Object(c.a)(Object(c.a)({},t),{},{mousePos:e.pos}));case"switch-page":switch(e.page){case"main-page":return function(e){return Object(a.noCmd)(Object(c.a)(Object(c.a)({},e),{},{page:d()}))}(t);case"drop-down-page":return function(e){return a.Tuple.t2n(Object(c.a)(Object(c.a)({},e),{},{page:{tag:"drop-down-page",viewportDim:a.nothing,indexAndModel:a.nothing}}),a.Task.perform(s.getWindowDimensions,f))}(t);case"placement-page":return function(e){return a.Tuple.t2n(Object(c.a)(Object(c.a)({},e),{},{page:{tag:"placement-page",viewportDim:a.nothing,refDim:Object(s.dim)(100),mode:"menu"}}),a.Task.perform(a.Task.succeedLazy((function(){return Object(s.dim)(window.innerWidth,window.innerHeight)})),f))}(t)}break;case"got-window-dimensions":if("placement-page"===t.page.tag||"drop-down-page"===t.page.tag){var j=t.page;return Object(a.noCmd)(Object(c.a)(Object(c.a)({},t),{},{page:Object(c.a)(Object(c.a)({},j),{},{viewportDim:Object(a.just)(e.d)})}))}return Object(a.noCmd)(t);case"dd-page-msg":if("drop-down-page"!==t.page.tag)return Object(a.noCmd)(t);var O=t.page,y=e.m;switch(y.tag){case"button-clicked":var D=Object(s.dropDownOpen)(a.Task.succeed(y.b));return a.Tuple.fromNative(D).mapFirst((function(e){return Object(c.a)(Object(c.a)({},t),{},{page:Object(c.a)(Object(c.a)({},O),{},{indexAndModel:Object(a.just)(new a.Tuple(y.index,e))})})})).mapSecond((function(e){return e.map((function(e){return m({tag:"dd-msg",m:e})}))})).toNative();case"dd-msg":return t.page.indexAndModel.map((function(e){var n=Object(s.dropDownUpdate)(y.m,e.b);if(n[2]){var r=Object(c.a)(Object(c.a)({},t),{},{page:Object(c.a)(Object(c.a)({},O),{},{indexAndModel:a.nothing})});return Object(a.noCmd)(r)}return a.Tuple.fromNative([n[0],n[1]]).mapFirst((function(e){return Object(c.a)(Object(c.a)({},t),{},{page:Object(c.a)(Object(c.a)({},O),{},{indexAndModel:O.indexAndModel.map((function(t){return new a.Tuple(t.a,e)}))})})})).mapSecond((function(e){return e.map((function(e){return m({tag:"dd-msg",m:e})}))})).toNative()})).withDefaultSupply((function(){return Object(a.noCmd)(t)}))}}}var D=new a.DocumentEvents,M=new a.WindowEvents;function C(e){var t=D.on("mousemove",(function(e){return{tag:"mouse-move",pos:Object(s.pos)(e.pageX,e.pageY)}})),n=D.on("keydown",(function(e){return{tag:"key-down",key:e.key}}));switch(e.page.tag){case"main-page":var r=e.page.menuModel.map((function(e){return Object(s.menuSubscriptions)(e).map(p).map(l)})).withDefaultSupply((function(){return a.Sub.none()}));return a.Sub.batch([r,t,n]);case"placement-page":return a.Sub.batch([t,n,M.on("resize",(function(e){return f(Object(s.dim)(window.innerWidth,window.innerHeight))}))]);case"drop-down-page":return a.Sub.batch([Object(s.dropDownSubscriptions)().map((function(e){return m({tag:"dd-msg",m:e})})),n,M.on("resize",(function(e){return f(Object(s.dim)(window.innerWidth,window.innerHeight))}))])}}function x(e,t){if("main-page"!==e.page.tag)return Object(a.noCmd)(e);var n=e.page;return a.Tuple.fromNative(t).mapFirst((function(t){return Object(c.a)(Object(c.a)({},e),{},{page:Object(c.a)(Object(c.a)({},n),{},{menuModel:Object(a.just)(t)})})})).mapSecond((function(e){return e.map(p).map(l)})).toNative()}function E(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:a.nothing;if("main-page"!==e.page.tag)return Object(a.noCmd)(e);var n=e.page,r=Object(c.a)(Object(c.a)({},e),{},{page:Object(c.a)(Object(c.a)({},n),{},{menuModel:a.nothing,lastClicked:t})});return Object(a.noCmd)(r)}var k=function(){return i.a.createElement(a.Program,{init:j,view:O,update:y,subscriptions:C,devTools:a.DevTools.init(window)})};o.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(k,null)),document.getElementById("root"))}],[[35,1,2]]]);
//# sourceMappingURL=main.d0bdd1a1.chunk.js.map