import{r as P,a as Pc,g as xc}from"./react-vendor-DJ1oPbzn.js";import{l as Ot,L as Rt,M as Oc,T as Dc,a as Ho,P as Vo,u as Mc,b as Lc}from"./leaflet-vendor-BvoLZIOn.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();var Wo={exports:{}},mi={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fc=P,Uc=Symbol.for("react.element"),jc=Symbol.for("react.fragment"),Bc=Object.prototype.hasOwnProperty,Hc=Fc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Vc={key:!0,ref:!0,__self:!0,__source:!0};function zo(n,e,t){var i,s={},r=null,o=null;t!==void 0&&(r=""+t),e.key!==void 0&&(r=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Bc.call(e,i)&&!Vc.hasOwnProperty(i)&&(s[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)s[i]===void 0&&(s[i]=e[i]);return{$$typeof:Uc,type:n,key:r,ref:o,props:s,_owner:Hc.current}}mi.Fragment=jc;mi.jsx=zo;mi.jsxs=zo;Wo.exports=mi;var p=Wo.exports,$o,Nr=Pc;$o=Nr.createRoot,Nr.hydrateRoot;const Wc=()=>{};var kr={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Go={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I=function(n,e){if(!n)throw Gt(e)},Gt=function(n){return new Error("Firebase Database ("+Go.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qo=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&i+1<n.length&&(n.charCodeAt(i+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++i)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},zc=function(n){const e=[];let t=0,i=0;for(;t<n.length;){const s=n[t++];if(s<128)e[i++]=String.fromCharCode(s);else if(s>191&&s<224){const r=n[t++];e[i++]=String.fromCharCode((s&31)<<6|r&63)}else if(s>239&&s<365){const r=n[t++],o=n[t++],a=n[t++],l=((s&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[i++]=String.fromCharCode(55296+(l>>10)),e[i++]=String.fromCharCode(56320+(l&1023))}else{const r=n[t++],o=n[t++];e[i++]=String.fromCharCode((s&15)<<12|(r&63)<<6|o&63)}}return e.join("")},ys={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let s=0;s<n.length;s+=3){const r=n[s],o=s+1<n.length,a=o?n[s+1]:0,l=s+2<n.length,c=l?n[s+2]:0,h=r>>2,f=(r&3)<<4|a>>4;let m=(a&15)<<2|c>>6,E=c&63;l||(E=64,o||(m=64)),i.push(t[h],t[f],t[m],t[E])}return i.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(qo(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):zc(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<n.length;){const r=t[n.charAt(s++)],a=s<n.length?t[n.charAt(s)]:0;++s;const c=s<n.length?t[n.charAt(s)]:64;++s;const f=s<n.length?t[n.charAt(s)]:64;if(++s,r==null||a==null||c==null||f==null)throw new $c;const m=r<<2|a>>4;if(i.push(m),c!==64){const E=a<<4&240|c>>2;if(i.push(E),f!==64){const S=c<<6&192|f;i.push(S)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class $c extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ko=function(n){const e=qo(n);return ys.encodeByteArray(e,!0)},Gn=function(n){return Ko(n).replace(/\./g,"")},qn=function(n){try{return ys.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gc(n){return Yo(void 0,n)}function Yo(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!qc(t)||(n[t]=Yo(n[t],e[t]));return n}function qc(n){return n!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kc(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yc=()=>Kc().__FIREBASE_DEFAULTS__,Qc=()=>{if(typeof process>"u"||typeof kr>"u")return;const n=kr.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Jc=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&qn(n[1]);return e&&JSON.parse(e)},Es=()=>{try{return Wc()||Yc()||Qc()||Jc()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Qo=n=>{var e,t;return(t=(e=Es())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Xc=n=>{const e=Qo(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},Jo=()=>{var n;return(n=Es())===null||n===void 0?void 0:n.config},Xo=n=>{var e;return(e=Es())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gi{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zc(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",s=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:s,exp:s+3600,auth_time:s,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Gn(JSON.stringify(t)),Gn(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ws(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(pe())}function eu(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function tu(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Zo(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function nu(){const n=pe();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function iu(){return Go.NODE_ADMIN===!0}function su(){try{return typeof indexedDB=="object"}catch{return!1}}function ru(){return new Promise((n,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(i);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(i),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var r;e(((r=s.error)===null||r===void 0?void 0:r.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ou="FirebaseError";class ot extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=ou,Object.setPrototypeOf(this,ot.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Cn.prototype.create)}}class Cn{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},s=`${this.service}/${e}`,r=this.errors[e],o=r?au(r,i):"Error",a=`${this.serviceName}: ${o} (${s}).`;return new ot(s,a,i)}}function au(n,e){return n.replace(lu,(t,i)=>{const s=e[i];return s!=null?String(s):`<${i}?>`})}const lu=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pn(n){return JSON.parse(n)}function ce(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ea=function(n){let e={},t={},i={},s="";try{const r=n.split(".");e=pn(qn(r[0])||""),t=pn(qn(r[1])||""),s=r[2],i=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:i,signature:s}},cu=function(n){const e=ea(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},uu=function(n){const e=ea(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ke(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Bt(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Ji(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Kn(n,e,t){const i={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(i[s]=e.call(t,n[s],s,n));return i}function mt(n,e){if(n===e)return!0;const t=Object.keys(n),i=Object.keys(e);for(const s of t){if(!i.includes(s))return!1;const r=n[s],o=e[s];if(Rr(r)&&Rr(o)){if(!mt(r,o))return!1}else if(r!==o)return!1}for(const s of i)if(!t.includes(s))return!1;return!0}function Rr(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qt(n){const e=[];for(const[t,i]of Object.entries(n))Array.isArray(i)?i.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class du{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const i=this.W_;if(typeof e=="string")for(let f=0;f<16;f++)i[f]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let f=0;f<16;f++)i[f]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let f=16;f<80;f++){const m=i[f-3]^i[f-8]^i[f-14]^i[f-16];i[f]=(m<<1|m>>>31)&4294967295}let s=this.chain_[0],r=this.chain_[1],o=this.chain_[2],a=this.chain_[3],l=this.chain_[4],c,h;for(let f=0;f<80;f++){f<40?f<20?(c=a^r&(o^a),h=1518500249):(c=r^o^a,h=1859775393):f<60?(c=r&o|a&(r|o),h=2400959708):(c=r^o^a,h=3395469782);const m=(s<<5|s>>>27)+c+l+h+i[f]&4294967295;l=a,a=o,o=(r<<30|r>>>2)&4294967295,r=s,s=m}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const i=t-this.blockSize;let s=0;const r=this.buf_;let o=this.inbuf_;for(;s<t;){if(o===0)for(;s<=i;)this.compress_(e,s),s+=this.blockSize;if(typeof e=="string"){for(;s<t;)if(r[o]=e.charCodeAt(s),++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}else for(;s<t;)if(r[o]=e[s],++o,++s,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let s=this.blockSize-1;s>=56;s--)this.buf_[s]=t&255,t/=256;this.compress_(this.buf_);let i=0;for(let s=0;s<5;s++)for(let r=24;r>=0;r-=8)e[i]=this.chain_[s]>>r&255,++i;return e}}function hu(n,e){const t=new fu(n,e);return t.subscribe.bind(t)}class fu{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let s;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");pu(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:i},s.next===void 0&&(s.next=Mi),s.error===void 0&&(s.error=Mi),s.complete===void 0&&(s.complete=Mi);const r=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),r}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function pu(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Mi(){}function Is(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mu=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let s=n.charCodeAt(i);if(s>=55296&&s<=56319){const r=s-55296;i++,I(i<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(i)-56320;s=65536+(r<<10)+o}s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):s<65536?(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},_i=function(n){let e=0;for(let t=0;t<n.length;t++){const i=n.charCodeAt(t);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,t++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ie(n){return n&&n._delegate?n._delegate:n}class gt{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ct="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new gi;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&i.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),s=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(vu(e))try{this.getOrInitializeService({instanceIdentifier:ct})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:s});i.resolve(r)}catch{}}}}clearInstance(e=ct){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ct){return this.instances.has(e)}getOptions(e=ct){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);i===a&&o.resolve(s)}return s}onInit(e,t){var i;const s=this.normalizeInstanceIdentifier(t),r=(i=this.onInitCallbacks.get(s))!==null&&i!==void 0?i:new Set;r.add(e),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&e(o,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const s of i)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:_u(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=ct){return this.component?this.component.multipleInstances?e:ct:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function _u(n){return n===ct?void 0:n}function vu(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yu{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new gu(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var H;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(H||(H={}));const Eu={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},wu=H.INFO,Iu={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},bu=(n,e,...t)=>{if(e<n.logLevel)return;const i=new Date().toISOString(),s=Iu[e];if(s)console[s](`[${i}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class bs{constructor(e){this.name=e,this._logLevel=wu,this._logHandler=bu,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Eu[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}const Cu=(n,e)=>e.some(t=>n instanceof t);let Pr,xr;function Tu(){return Pr||(Pr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Su(){return xr||(xr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ta=new WeakMap,Xi=new WeakMap,na=new WeakMap,Li=new WeakMap,Cs=new WeakMap;function Au(n){const e=new Promise((t,i)=>{const s=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{t(et(n.result)),s()},o=()=>{i(n.error),s()};n.addEventListener("success",r),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&ta.set(t,n)}).catch(()=>{}),Cs.set(e,n),e}function Nu(n){if(Xi.has(n))return;const e=new Promise((t,i)=>{const s=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{t(),s()},o=()=>{i(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});Xi.set(n,e)}let Zi={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Xi.get(n);if(e==="objectStoreNames")return n.objectStoreNames||na.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return et(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function ku(n){Zi=n(Zi)}function Ru(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=n.call(Fi(this),e,...t);return na.set(i,e.sort?e.sort():[e]),et(i)}:Su().includes(n)?function(...e){return n.apply(Fi(this),e),et(ta.get(this))}:function(...e){return et(n.apply(Fi(this),e))}}function Pu(n){return typeof n=="function"?Ru(n):(n instanceof IDBTransaction&&Nu(n),Cu(n,Tu())?new Proxy(n,Zi):n)}function et(n){if(n instanceof IDBRequest)return Au(n);if(Li.has(n))return Li.get(n);const e=Pu(n);return e!==n&&(Li.set(n,e),Cs.set(e,n)),e}const Fi=n=>Cs.get(n);function xu(n,e,{blocked:t,upgrade:i,blocking:s,terminated:r}={}){const o=indexedDB.open(n,e),a=et(o);return i&&o.addEventListener("upgradeneeded",l=>{i(et(o.result),l.oldVersion,l.newVersion,et(o.transaction),l)}),t&&o.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),s&&l.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const Ou=["get","getKey","getAll","getAllKeys","count"],Du=["put","add","delete","clear"],Ui=new Map;function Or(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Ui.get(e))return Ui.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,s=Du.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(s||Ou.includes(t)))return;const r=async function(o,...a){const l=this.transaction(o,s?"readwrite":"readonly");let c=l.store;return i&&(c=c.index(a.shift())),(await Promise.all([c[t](...a),s&&l.done]))[0]};return Ui.set(e,r),r}ku(n=>({...n,get:(e,t,i)=>Or(e,t)||n.get(e,t,i),has:(e,t)=>!!Or(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mu{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Lu(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function Lu(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const es="@firebase/app",Dr="0.11.4";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ze=new bs("@firebase/app"),Fu="@firebase/app-compat",Uu="@firebase/analytics-compat",ju="@firebase/analytics",Bu="@firebase/app-check-compat",Hu="@firebase/app-check",Vu="@firebase/auth",Wu="@firebase/auth-compat",zu="@firebase/database",$u="@firebase/data-connect",Gu="@firebase/database-compat",qu="@firebase/functions",Ku="@firebase/functions-compat",Yu="@firebase/installations",Qu="@firebase/installations-compat",Ju="@firebase/messaging",Xu="@firebase/messaging-compat",Zu="@firebase/performance",ed="@firebase/performance-compat",td="@firebase/remote-config",nd="@firebase/remote-config-compat",id="@firebase/storage",sd="@firebase/storage-compat",rd="@firebase/firestore",od="@firebase/vertexai",ad="@firebase/firestore-compat",ld="firebase",cd="11.6.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ts="[DEFAULT]",ud={[es]:"fire-core",[Fu]:"fire-core-compat",[ju]:"fire-analytics",[Uu]:"fire-analytics-compat",[Hu]:"fire-app-check",[Bu]:"fire-app-check-compat",[Vu]:"fire-auth",[Wu]:"fire-auth-compat",[zu]:"fire-rtdb",[$u]:"fire-data-connect",[Gu]:"fire-rtdb-compat",[qu]:"fire-fn",[Ku]:"fire-fn-compat",[Yu]:"fire-iid",[Qu]:"fire-iid-compat",[Ju]:"fire-fcm",[Xu]:"fire-fcm-compat",[Zu]:"fire-perf",[ed]:"fire-perf-compat",[td]:"fire-rc",[nd]:"fire-rc-compat",[id]:"fire-gcs",[sd]:"fire-gcs-compat",[rd]:"fire-fst",[ad]:"fire-fst-compat",[od]:"fire-vertex","fire-js":"fire-js",[ld]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yn=new Map,dd=new Map,ns=new Map;function Mr(n,e){try{n.container.addComponent(e)}catch(t){ze.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ht(n){const e=n.name;if(ns.has(e))return ze.debug(`There were multiple attempts to register component ${e}.`),!1;ns.set(e,n);for(const t of Yn.values())Mr(t,n);for(const t of dd.values())Mr(t,n);return!0}function Ts(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Se(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hd={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},tt=new Cn("app","Firebase",hd);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(e,t,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new gt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw tt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kt=cd;function ia(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const i=Object.assign({name:ts,automaticDataCollectionEnabled:!1},e),s=i.name;if(typeof s!="string"||!s)throw tt.create("bad-app-name",{appName:String(s)});if(t||(t=Jo()),!t)throw tt.create("no-options");const r=Yn.get(s);if(r){if(mt(t,r.options)&&mt(i,r.config))return r;throw tt.create("duplicate-app",{appName:s})}const o=new yu(s);for(const l of ns.values())o.addComponent(l);const a=new fd(t,i,o);return Yn.set(s,a),a}function sa(n=ts){const e=Yn.get(n);if(!e&&n===ts&&Jo())return ia();if(!e)throw tt.create("no-app",{appName:n});return e}function nt(n,e,t){var i;let s=(i=ud[n])!==null&&i!==void 0?i:n;t&&(s+=`-${t}`);const r=s.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const a=[`Unable to register library "${s}" with version "${e}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ze.warn(a.join(" "));return}Ht(new gt(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pd="firebase-heartbeat-database",md=1,mn="firebase-heartbeat-store";let ji=null;function ra(){return ji||(ji=xu(pd,md,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(mn)}catch(t){console.warn(t)}}}}).catch(n=>{throw tt.create("idb-open",{originalErrorMessage:n.message})})),ji}async function gd(n){try{const t=(await ra()).transaction(mn),i=await t.objectStore(mn).get(oa(n));return await t.done,i}catch(e){if(e instanceof ot)ze.warn(e.message);else{const t=tt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});ze.warn(t.message)}}}async function Lr(n,e){try{const i=(await ra()).transaction(mn,"readwrite");await i.objectStore(mn).put(e,oa(n)),await i.done}catch(t){if(t instanceof ot)ze.warn(t.message);else{const i=tt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});ze.warn(i.message)}}}function oa(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _d=1024,vd=30;class yd{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new wd(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Fr();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:s}),this._heartbeatsCache.heartbeats.length>vd){const o=Id(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){ze.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Fr(),{heartbeatsToSend:i,unsentEntries:s}=Ed(this._heartbeatsCache.heartbeats),r=Gn(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return ze.warn(t),""}}}function Fr(){return new Date().toISOString().substring(0,10)}function Ed(n,e=_d){const t=[];let i=n.slice();for(const s of n){const r=t.find(o=>o.agent===s.agent);if(r){if(r.dates.push(s.date),Ur(t)>e){r.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Ur(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class wd{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return su()?ru().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await gd(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Lr(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const s=await this.read();return Lr(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Ur(n){return Gn(JSON.stringify({version:2,heartbeats:n})).length}function Id(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let i=1;i<n.length;i++)n[i].date<t&&(t=n[i].date,e=i);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bd(n){Ht(new gt("platform-logger",e=>new Mu(e),"PRIVATE")),Ht(new gt("heartbeat",e=>new yd(e),"PRIVATE")),nt(es,Dr,n),nt(es,Dr,"esm2017"),nt("fire-js","")}bd("");var jr={};const Br="@firebase/database",Hr="1.0.14";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let aa="";function Cd(n){aa=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Td{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),ce(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:pn(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sd{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return Ke(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const la=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Td(e)}}catch{}return new Sd},dt=la("localStorage"),Ad=la("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt=new bs("@firebase/database"),Nd=function(){let n=1;return function(){return n++}}(),ca=function(n){const e=mu(n),t=new du;t.update(e);const i=t.digest();return ys.encodeByteArray(i)},Tn=function(...n){let e="";for(let t=0;t<n.length;t++){const i=n[t];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=Tn.apply(null,i):typeof i=="object"?e+=ce(i):e+=i,e+=" "}return e};let ln=null,Vr=!0;const kd=function(n,e){I(!0,"Can't turn on custom loggers persistently."),Dt.logLevel=H.VERBOSE,ln=Dt.log.bind(Dt)},fe=function(...n){if(Vr===!0&&(Vr=!1,ln===null&&Ad.get("logging_enabled")===!0&&kd()),ln){const e=Tn.apply(null,n);ln(e)}},Sn=function(n){return function(...e){fe(n,...e)}},is=function(...n){const e="FIREBASE INTERNAL ERROR: "+Tn(...n);Dt.error(e)},$e=function(...n){const e=`FIREBASE FATAL ERROR: ${Tn(...n)}`;throw Dt.error(e),new Error(e)},ve=function(...n){const e="FIREBASE WARNING: "+Tn(...n);Dt.warn(e)},Rd=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&ve("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},ua=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},Pd=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},Vt="[MIN_NAME]",_t="[MAX_NAME]",Yt=function(n,e){if(n===e)return 0;if(n===Vt||e===_t)return-1;if(e===Vt||n===_t)return 1;{const t=Wr(n),i=Wr(e);return t!==null?i!==null?t-i===0?n.length-e.length:t-i:-1:i!==null?1:n<e?-1:1}},xd=function(n,e){return n===e?0:n<e?-1:1},nn=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+ce(e))},Ss=function(n){if(typeof n!="object"||n===null)return ce(n);const e=[];for(const i in n)e.push(i);e.sort();let t="{";for(let i=0;i<e.length;i++)i!==0&&(t+=","),t+=ce(e[i]),t+=":",t+=Ss(n[e[i]]);return t+="}",t},da=function(n,e){const t=n.length;if(t<=e)return[n];const i=[];for(let s=0;s<t;s+=e)s+e>t?i.push(n.substring(s,t)):i.push(n.substring(s,s+e));return i};function ye(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const ha=function(n){I(!ua(n),"Invalid JSON number");const e=11,t=52,i=(1<<e-1)-1;let s,r,o,a,l;n===0?(r=0,o=0,s=1/n===-1/0?1:0):(s=n<0,n=Math.abs(n),n>=Math.pow(2,1-i)?(a=Math.min(Math.floor(Math.log(n)/Math.LN2),i),r=a+i,o=Math.round(n*Math.pow(2,t-a)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-i-t))));const c=[];for(l=t;l;l-=1)c.push(o%2?1:0),o=Math.floor(o/2);for(l=e;l;l-=1)c.push(r%2?1:0),r=Math.floor(r/2);c.push(s?1:0),c.reverse();const h=c.join("");let f="";for(l=0;l<64;l+=8){let m=parseInt(h.substr(l,8),2).toString(16);m.length===1&&(m="0"+m),f=f+m}return f.toLowerCase()},Od=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},Dd=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function Md(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const i=new Error(n+" at "+e._path.toString()+": "+t);return i.code=n.toUpperCase(),i}const Ld=new RegExp("^-?(0*)\\d{1,10}$"),Fd=-2147483648,Ud=2147483647,Wr=function(n){if(Ld.test(n)){const e=Number(n);if(e>=Fd&&e<=Ud)return e}return null},Qt=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw ve("Exception was thrown by user callback.",t),e},Math.floor(0))}},jd=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},cn=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bd{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,Se(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(i=>this.appCheck=i)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(i=>i.addTokenListener(e))}notifyForInvalidToken(){ve(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hd{constructor(e,t,i){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(s=>this.auth_=s)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(fe("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',ve(e)}}class Hn{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Hn.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const As="5",fa="v",pa="s",ma="r",ga="f",_a=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,va="ls",ya="p",ss="ac",Ea="websocket",wa="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ia{constructor(e,t,i,s,r=!1,o="",a=!1,l=!1,c=null){this.secure=t,this.namespace=i,this.webSocketOnly=s,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=l,this.emulatorOptions=c,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=dt.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&dt.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function Vd(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function ba(n,e,t){I(typeof e=="string","typeof type must == string"),I(typeof t=="object","typeof params must == object");let i;if(e===Ea)i=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===wa)i=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);Vd(n)&&(t.ns=n.namespace);const s=[];return ye(t,(r,o)=>{s.push(r+"="+o)}),i+s.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wd{constructor(){this.counters_={}}incrementCounter(e,t=1){Ke(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return Gc(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bi={},Hi={};function Ns(n){const e=n.toString();return Bi[e]||(Bi[e]=new Wd),Bi[e]}function zd(n,e){const t=n.toString();return Hi[t]||(Hi[t]=e()),Hi[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $d{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let s=0;s<i.length;++s)i[s]&&Qt(()=>{this.onMessage_(i[s])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zr="start",Gd="close",qd="pLPCommand",Kd="pRTLPCB",Ca="id",Ta="pw",Sa="ser",Yd="cb",Qd="seg",Jd="ts",Xd="d",Zd="dframe",Aa=1870,Na=30,eh=Aa-Na,th=25e3,nh=3e4;class xt{constructor(e,t,i,s,r,o,a){this.connId=e,this.repoInfo=t,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Sn(e),this.stats_=Ns(t),this.urlFn=l=>(this.appCheckToken&&(l[ss]=this.appCheckToken),ba(t,wa,l))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new $d(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(nh)),Pd(()=>{if(this.isClosed_)return;this.scriptTagHolder=new ks((...r)=>{const[o,a,l,c,h]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===zr)this.id=a,this.password=l;else if(o===Gd)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,a]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const i={};i[zr]="t",i[Sa]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[Yd]=this.scriptTagHolder.uniqueCallbackIdentifier),i[fa]=As,this.transportSessionId&&(i[pa]=this.transportSessionId),this.lastSessionId&&(i[va]=this.lastSessionId),this.applicationId&&(i[ya]=this.applicationId),this.appCheckToken&&(i[ss]=this.appCheckToken),typeof location<"u"&&location.hostname&&_a.test(location.hostname)&&(i[ma]=ga);const s=this.urlFn(i);this.log_("Connecting via long-poll to "+s),this.scriptTagHolder.addTag(s,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){xt.forceAllow_=!0}static forceDisallow(){xt.forceDisallow_=!0}static isAvailable(){return xt.forceAllow_?!0:!xt.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!Od()&&!Dd()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=ce(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=Ko(t),s=da(i,eh);for(let r=0;r<s.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,s.length,s[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const i={};i[Zd]="t",i[Ca]=e,i[Ta]=t,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=ce(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class ks{constructor(e,t,i,s){this.onDisconnect=i,this.urlFn=s,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=Nd(),window[qd+this.uniqueCallbackIdentifier]=e,window[Kd+this.uniqueCallbackIdentifier]=t,this.myIFrame=ks.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){fe("frame writing exception"),a.stack&&fe(a.stack),fe(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||fe("No IE domain setting required")}catch{const i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Ca]=this.myID,e[Ta]=this.myPW,e[Sa]=this.currentSerial;let t=this.urlFn(e),i="",s=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+Na+i.length<=Aa;){const o=this.pendingSegs.shift();i=i+"&"+Qd+s+"="+o.seg+"&"+Jd+s+"="+o.ts+"&"+Xd+s+"="+o.d,s++}return t=t+i,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,i){this.pendingSegs.push({seg:e,ts:t,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const i=()=>{this.outstandingRequests.delete(t),this.newRequest_()},s=setTimeout(i,Math.floor(th)),r=()=>{clearTimeout(s),i()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){const s=i.readyState;(!s||s==="loaded"||s==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),t())},i.onerror=()=>{fe("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ih=16384,sh=45e3;let Qn=null;typeof MozWebSocket<"u"?Qn=MozWebSocket:typeof WebSocket<"u"&&(Qn=WebSocket);class Ae{constructor(e,t,i,s,r,o,a){this.connId=e,this.applicationId=i,this.appCheckToken=s,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Sn(this.connId),this.stats_=Ns(t),this.connURL=Ae.connectionURL_(t,o,a,s,i),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,i,s,r){const o={};return o[fa]=As,typeof location<"u"&&location.hostname&&_a.test(location.hostname)&&(o[ma]=ga),t&&(o[pa]=t),i&&(o[va]=i),s&&(o[ss]=s),r&&(o[ya]=r),ba(e,Ea,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,dt.set("previous_websocket_failure",!0);try{let i;iu(),this.mySock=new Qn(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");const s=i.message||i.data;s&&this.log_(s),this.onClosed_()}}start(){}static forceDisallow(){Ae.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(t);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&Qn!==null&&!Ae.forceDisallow_}static previouslyFailed(){return dt.isInMemoryStorage||dt.get("previous_websocket_failure")===!0}markConnectionHealthy(){dt.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const i=pn(t);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(I(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const i=this.extractFrameCount_(t);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();const t=ce(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=da(t,ih);i.length>1&&this.sendString_(String(i.length));for(let s=0;s<i.length;s++)this.sendString_(i[s])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(sh))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Ae.responsesRequiredToBeHealthy=2;Ae.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gn{static get ALL_TRANSPORTS(){return[xt,Ae]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=Ae&&Ae.isAvailable();let i=t&&!Ae.previouslyFailed();if(e.webSocketOnly&&(t||ve("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[Ae];else{const s=this.transports_=[];for(const r of gn.ALL_TRANSPORTS)r&&r.isAvailable()&&s.push(r);gn.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}gn.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rh=6e4,oh=5e3,ah=10*1024,lh=100*1024,Vi="t",$r="d",ch="s",Gr="r",uh="e",qr="o",Kr="a",Yr="n",Qr="p",dh="h";class hh{constructor(e,t,i,s,r,o,a,l,c,h){this.id=e,this.repoInfo_=t,this.applicationId_=i,this.appCheckToken_=s,this.authToken_=r,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=l,this.onKill_=c,this.lastSessionId=h,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Sn("c:"+this.id+":"),this.transportManager_=new gn(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,i)},Math.floor(0));const s=e.healthyTimeout||0;s>0&&(this.healthyTimeout_=cn(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>lh?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>ah?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(s)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Vi in e){const t=e[Vi];t===Kr?this.upgradeIfSecondaryHealthy_():t===Gr?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===qr&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=nn("t",e),i=nn("d",e);if(t==="c")this.onSecondaryControl_(i);else if(t==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Qr,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Kr,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Yr,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=nn("t",e),i=nn("d",e);t==="c"?this.onControl_(i):t==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=nn(Vi,e);if($r in e){const i=e[$r];if(t===dh){const s=Object.assign({},i);this.repoInfo_.isUsingEmulator&&(s.h=this.repoInfo_.host),this.onHandshake_(s)}else if(t===Yr){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let s=0;s<this.pendingDataMessages.length;++s)this.onDataMessage_(this.pendingDataMessages[s]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===ch?this.onConnectionShutdown_(i):t===Gr?this.onReset_(i):t===uh?is("Server Error: "+i):t===qr?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):is("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,i=e.v,s=e.h;this.sessionId=e.s,this.repoInfo_.host=s,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),As!==i&&ve("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,i),cn(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(rh))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):cn(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(oh))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Qr,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(dt.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ka{put(e,t,i,s){}merge(e,t,i,s){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,i){}onDisconnectMerge(e,t,i){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{constructor(e){this.allowedEvents_=e,this.listeners_={},I(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const i=[...this.listeners_[e]];for(let s=0;s<i.length;s++)i[s].callback.apply(i[s].context,t)}}on(e,t,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:i});const s=this.getInitialEvent(e);s&&t.apply(i,s)}off(e,t,i){this.validateEventType_(e);const s=this.listeners_[e]||[];for(let r=0;r<s.length;r++)if(s[r].callback===t&&(!i||i===s[r].context)){s.splice(r,1);return}}validateEventType_(e){I(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn extends Ra{static getInstance(){return new Jn}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!ws()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return I(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jr=32,Xr=768;class V{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let i=0;for(let s=0;s<this.pieces_.length;s++)this.pieces_[s].length>0&&(this.pieces_[i]=this.pieces_[s],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function U(){return new V("")}function D(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function st(n){return n.pieces_.length-n.pieceNum_}function W(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new V(n.pieces_,e)}function Pa(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function fh(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function xa(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function Oa(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new V(e,0)}function re(n,e){const t=[];for(let i=n.pieceNum_;i<n.pieces_.length;i++)t.push(n.pieces_[i]);if(e instanceof V)for(let i=e.pieceNum_;i<e.pieces_.length;i++)t.push(e.pieces_[i]);else{const i=e.split("/");for(let s=0;s<i.length;s++)i[s].length>0&&t.push(i[s])}return new V(t,0)}function F(n){return n.pieceNum_>=n.pieces_.length}function ge(n,e){const t=D(n),i=D(e);if(t===null)return e;if(t===i)return ge(W(n),W(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function Rs(n,e){if(st(n)!==st(e))return!1;for(let t=n.pieceNum_,i=e.pieceNum_;t<=n.pieces_.length;t++,i++)if(n.pieces_[t]!==e.pieces_[i])return!1;return!0}function Ne(n,e){let t=n.pieceNum_,i=e.pieceNum_;if(st(n)>st(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[i])return!1;++t,++i}return!0}class ph{constructor(e,t){this.errorPrefix_=t,this.parts_=xa(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=_i(this.parts_[i]);Da(this)}}function mh(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=_i(e),Da(n)}function gh(n){const e=n.parts_.pop();n.byteLength_-=_i(e),n.parts_.length>0&&(n.byteLength_-=1)}function Da(n){if(n.byteLength_>Xr)throw new Error(n.errorPrefix_+"has a key path longer than "+Xr+" bytes ("+n.byteLength_+").");if(n.parts_.length>Jr)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+Jr+") or object contains a cycle "+ut(n))}function ut(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ps extends Ra{static getInstance(){return new Ps}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}getInitialEvent(e){return I(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sn=1e3,_h=60*5*1e3,Zr=30*1e3,vh=1.3,yh=3e4,Eh="server_kill",eo=3;class We extends ka{constructor(e,t,i,s,r,o,a,l){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=i,this.onConnectStatus_=s,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=l,this.id=We.nextPersistentConnectionId_++,this.log_=Sn("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=sn,this.maxReconnectDelay_=_h,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,l)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Ps.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Jn.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,i){const s=++this.requestNumber_,r={r:s,a:e,b:t};this.log_(ce(r)),I(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),i&&(this.requestCBHash_[s]=i)}get(e){this.initConnection_();const t=new gi,s={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?t.resolve(a):t.reject(a)}};this.outstandingGets_.push(s),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,i,s){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),I(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),I(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const a={onComplete:s,hashFn:t,query:e,tag:i};this.listens.get(o).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(i)})}sendListen_(e){const t=e.query,i=t._path.toString(),s=t._queryIdentifier;this.log_("Listen on "+i+" for "+s);const r={p:i},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,a=>{const l=a.d,c=a.s;We.warnOnListenWarnings_(l,t),(this.listens.get(i)&&this.listens.get(i).get(s))===e&&(this.log_("listen response",a),c!=="ok"&&this.removeListen_(i,s),e.onComplete&&e.onComplete(c,l))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&Ke(e,"w")){const i=Bt(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){const s='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();ve(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${s} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||uu(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Zr)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=cu(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(t,i,s=>{const r=s.s,o=s.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,i=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,i)})}unlisten(e,t){const i=e._path.toString(),s=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+s),I(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,s)&&this.connected_&&this.sendUnlisten_(i,s,e._queryObject,t)}sendUnlisten_(e,t,i,s){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";s&&(r.q=i,r.t=s),this.sendRequest(o,r)}onDisconnectPut(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:i})}onDisconnectMerge(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:i})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,i,s){const r={p:t,d:i};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{s&&setTimeout(()=>{s(o.s,o.d)},Math.floor(0))})}put(e,t,i,s){this.putInternal("p",e,t,i,s)}merge(e,t,i,s){this.putInternal("m",e,t,i,s)}putInternal(e,t,i,s,r){this.initConnection_();const o={p:t,d:i};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:s}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,s=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,i,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),s&&s(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,i=>{if(i.s!=="ok"){const r=i.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+ce(e));const t=e.r,i=this.requestCBHash_[t];i&&(delete this.requestCBHash_[t],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):is("Unrecognized action received from server: "+ce(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){I(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=sn,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=sn,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>yh&&(this.reconnectDelay_=sn),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*vh)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),s=this.id+":"+We.nextConnectionId_++,r=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,i())},c=function(f){I(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(f)};this.realtime_={close:l,sendRequest:c};const h=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[f,m]=await Promise.all([this.authTokenProvider_.getToken(h),this.appCheckTokenProvider_.getToken(h)]);o?fe("getToken() completed but was canceled"):(fe("getToken() completed. Creating connection."),this.authToken_=f&&f.accessToken,this.appCheckToken_=m&&m.token,a=new hh(s,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,i,E=>{ve(E+" ("+this.repoInfo_.toString()+")"),this.interrupt(Eh)},r))}catch(f){this.log_("Failed to get token: "+f),o||(this.repoInfo_.nodeAdmin&&ve(f),l())}}}interrupt(e){fe("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){fe("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Ji(this.interruptReasons_)&&(this.reconnectDelay_=sn,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let i;t?i=t.map(r=>Ss(r)).join("$"):i="default";const s=this.removeListen_(e,i);s&&s.onComplete&&s.onComplete("permission_denied")}removeListen_(e,t){const i=new V(e).toString();let s;if(this.listens.has(i)){const r=this.listens.get(i);s=r.get(t),r.delete(t),r.size===0&&this.listens.delete(i)}else s=void 0;return s}onAuthRevoked_(e,t){fe("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=eo&&(this.reconnectDelay_=Zr,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){fe("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=eo&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+aa.replace(/\./g,"-")]=1,ws()?e["framework.cordova"]=1:Zo()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Jn.getInstance().currentlyOnline();return Ji(this.interruptReasons_)&&e}}We.nextPersistentConnectionId_=0;We.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new M(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vi{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const i=new M(Vt,e),s=new M(Vt,t);return this.compare(i,s)!==0}minPost(){return M.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Un;class Ma extends vi{static get __EMPTY_NODE(){return Un}static set __EMPTY_NODE(e){Un=e}compare(e,t){return Yt(e.name,t.name)}isDefinedOn(e){throw Gt("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return M.MIN}maxPost(){return new M(_t,Un)}makePost(e,t){return I(typeof e=="string","KeyIndex indexValue must always be a string."),new M(e,Un)}toString(){return".key"}}const Mt=new Ma;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(e,t,i,s,r=null){this.isReverse_=s,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?i(e.key,t):1,s&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class le{constructor(e,t,i,s,r){this.key=e,this.value=t,this.color=i??le.RED,this.left=s??_e.EMPTY_NODE,this.right=r??_e.EMPTY_NODE}copy(e,t,i,s,r){return new le(e??this.key,t??this.value,i??this.color,s??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let s=this;const r=i(e,s.key);return r<0?s=s.copy(null,null,null,s.left.insert(e,t,i),null):r===0?s=s.copy(null,t,null,null,null):s=s.copy(null,null,null,null,s.right.insert(e,t,i)),s.fixUp_()}removeMin_(){if(this.left.isEmpty())return _e.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let i,s;if(i=this,t(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),t(e,i.key)===0){if(i.right.isEmpty())return _e.EMPTY_NODE;s=i.right.min_(),i=i.copy(s.key,s.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,le.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,le.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}le.RED=!0;le.BLACK=!1;class wh{copy(e,t,i,s,r){return this}insert(e,t,i){return new le(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class _e{constructor(e,t=_e.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new _e(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,le.BLACK,null,null))}remove(e){return new _e(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,le.BLACK,null,null))}get(e){let t,i=this.root_;for(;!i.isEmpty();){if(t=this.comparator_(e,i.key),t===0)return i.value;t<0?i=i.left:t>0&&(i=i.right)}return null}getPredecessorKey(e){let t,i=this.root_,s=null;for(;!i.isEmpty();)if(t=this.comparator_(e,i.key),t===0){if(i.left.isEmpty())return s?s.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else t<0?i=i.left:t>0&&(s=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new jn(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new jn(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new jn(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new jn(this.root_,null,this.comparator_,!0,e)}}_e.EMPTY_NODE=new wh;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ih(n,e){return Yt(n.name,e.name)}function xs(n,e){return Yt(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rs;function bh(n){rs=n}const La=function(n){return typeof n=="number"?"number:"+ha(n):"string:"+n},Fa=function(n){if(n.isLeafNode()){const e=n.val();I(typeof e=="string"||typeof e=="number"||typeof e=="object"&&Ke(e,".sv"),"Priority must be a string or number.")}else I(n===rs||n.isEmpty(),"priority of unexpected type.");I(n===rs||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let to;class ae{static set __childrenNodeConstructor(e){to=e}static get __childrenNodeConstructor(){return to}constructor(e,t=ae.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,I(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),Fa(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new ae(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:ae.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return F(e)?this:D(e)===".priority"?this.priorityNode_:ae.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:ae.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const i=D(e);return i===null?t:t.isEmpty()&&i!==".priority"?this:(I(i!==".priority"||st(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,ae.__childrenNodeConstructor.EMPTY_NODE.updateChild(W(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+La(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=ha(this.value_):e+=this.value_,this.lazyHash_=ca(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===ae.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof ae.__childrenNodeConstructor?-1:(I(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,i=typeof this.value_,s=ae.VALUE_TYPE_ORDER.indexOf(t),r=ae.VALUE_TYPE_ORDER.indexOf(i);return I(s>=0,"Unknown leaf type: "+t),I(r>=0,"Unknown leaf type: "+i),s===r?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-s}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}ae.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ua,ja;function Ch(n){Ua=n}function Th(n){ja=n}class Sh extends vi{compare(e,t){const i=e.node.getPriority(),s=t.node.getPriority(),r=i.compareTo(s);return r===0?Yt(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return M.MIN}maxPost(){return new M(_t,new ae("[PRIORITY-POST]",ja))}makePost(e,t){const i=Ua(e);return new M(t,new ae("[PRIORITY-POST]",i))}toString(){return".priority"}}const X=new Sh;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ah=Math.log(2);class Nh{constructor(e){const t=r=>parseInt(Math.log(r)/Ah,10),i=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const s=i(this.count);this.bits_=e+1&s}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Xn=function(n,e,t,i){n.sort(e);const s=function(l,c){const h=c-l;let f,m;if(h===0)return null;if(h===1)return f=n[l],m=t?t(f):f,new le(m,f.node,le.BLACK,null,null);{const E=parseInt(h/2,10)+l,S=s(l,E),O=s(E+1,c);return f=n[E],m=t?t(f):f,new le(m,f.node,le.BLACK,S,O)}},r=function(l){let c=null,h=null,f=n.length;const m=function(S,O){const j=f-S,ne=f;f-=S;const ue=s(j+1,ne),ie=n[j],me=t?t(ie):ie;E(new le(me,ie.node,O,null,ue))},E=function(S){c?(c.left=S,c=S):(h=S,c=S)};for(let S=0;S<l.count;++S){const O=l.nextBitIsOne(),j=Math.pow(2,l.count-(S+1));O?m(j,le.BLACK):(m(j,le.BLACK),m(j,le.RED))}return h},o=new Nh(n.length),a=r(o);return new _e(i||e,a)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wi;const Pt={};class Be{static get Default(){return I(Pt&&X,"ChildrenNode.ts has not been loaded"),Wi=Wi||new Be({".priority":Pt},{".priority":X}),Wi}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=Bt(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof _e?t:null}hasIndex(e){return Ke(this.indexSet_,e.toString())}addIndex(e,t){I(e!==Mt,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const i=[];let s=!1;const r=t.getIterator(M.Wrap);let o=r.getNext();for(;o;)s=s||e.isDefinedOn(o.node),i.push(o),o=r.getNext();let a;s?a=Xn(i,e.getCompare()):a=Pt;const l=e.toString(),c=Object.assign({},this.indexSet_);c[l]=e;const h=Object.assign({},this.indexes_);return h[l]=a,new Be(h,c)}addToIndexes(e,t){const i=Kn(this.indexes_,(s,r)=>{const o=Bt(this.indexSet_,r);if(I(o,"Missing index implementation for "+r),s===Pt)if(o.isDefinedOn(e.node)){const a=[],l=t.getIterator(M.Wrap);let c=l.getNext();for(;c;)c.name!==e.name&&a.push(c),c=l.getNext();return a.push(e),Xn(a,o.getCompare())}else return Pt;else{const a=t.get(e.name);let l=s;return a&&(l=l.remove(new M(e.name,a))),l.insert(e,e.node)}});return new Be(i,this.indexSet_)}removeFromIndexes(e,t){const i=Kn(this.indexes_,s=>{if(s===Pt)return s;{const r=t.get(e.name);return r?s.remove(new M(e.name,r)):s}});return new Be(i,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rn;class k{static get EMPTY_NODE(){return rn||(rn=new k(new _e(xs),null,Be.Default))}constructor(e,t,i){this.children_=e,this.priorityNode_=t,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&Fa(this.priorityNode_),this.children_.isEmpty()&&I(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||rn}updatePriority(e){return this.children_.isEmpty()?this:new k(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?rn:t}}getChild(e){const t=D(e);return t===null?this:this.getImmediateChild(t).getChild(W(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(I(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const i=new M(e,t);let s,r;t.isEmpty()?(s=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(i,this.children_)):(s=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(i,this.children_));const o=s.isEmpty()?rn:this.priorityNode_;return new k(s,o,r)}}updateChild(e,t){const i=D(e);if(i===null)return t;{I(D(e)!==".priority"||st(e)===1,".priority must be the last token in a path");const s=this.getImmediateChild(i).updateChild(W(e),t);return this.updateImmediateChild(i,s)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let i=0,s=0,r=!0;if(this.forEachChild(X,(o,a)=>{t[o]=a.val(e),i++,r&&k.INTEGER_REGEXP_.test(o)?s=Math.max(s,Number(o)):r=!1}),!e&&r&&s<2*i){const o=[];for(const a in t)o[a]=t[a];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+La(this.getPriority().val())+":"),this.forEachChild(X,(t,i)=>{const s=i.hash();s!==""&&(e+=":"+t+":"+s)}),this.lazyHash_=e===""?"":ca(e)}return this.lazyHash_}getPredecessorChildName(e,t,i){const s=this.resolveIndex_(i);if(s){const r=s.getPredecessorKey(new M(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new M(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new M(t,this.children_.get(t)):null}forEachChild(e,t){const i=this.resolveIndex_(e);return i?i.inorderTraversal(s=>t(s.name,s.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getIteratorFrom(e,s=>s);{const s=this.children_.getIteratorFrom(e.name,M.Wrap);let r=s.peek();for(;r!=null&&t.compare(r,e)<0;)s.getNext(),r=s.peek();return s}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getReverseIteratorFrom(e,s=>s);{const s=this.children_.getReverseIteratorFrom(e.name,M.Wrap);let r=s.peek();for(;r!=null&&t.compare(r,e)>0;)s.getNext(),r=s.peek();return s}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===An?-1:0}withIndex(e){if(e===Mt||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new k(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===Mt||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const i=this.getIterator(X),s=t.getIterator(X);let r=i.getNext(),o=s.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=i.getNext(),o=s.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===Mt?null:this.indexMap_.get(e.toString())}}k.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class kh extends k{constructor(){super(new _e(xs),k.EMPTY_NODE,Be.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return k.EMPTY_NODE}isEmpty(){return!1}}const An=new kh;Object.defineProperties(M,{MIN:{value:new M(Vt,k.EMPTY_NODE)},MAX:{value:new M(_t,An)}});Ma.__EMPTY_NODE=k.EMPTY_NODE;ae.__childrenNodeConstructor=k;bh(An);Th(An);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rh=!0;function he(n,e=null){if(n===null)return k.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),I(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new ae(t,he(e))}if(!(n instanceof Array)&&Rh){const t=[];let i=!1;if(ye(n,(o,a)=>{if(o.substring(0,1)!=="."){const l=he(a);l.isEmpty()||(i=i||!l.getPriority().isEmpty(),t.push(new M(o,l)))}}),t.length===0)return k.EMPTY_NODE;const r=Xn(t,Ih,o=>o.name,xs);if(i){const o=Xn(t,X.getCompare());return new k(r,he(e),new Be({".priority":o},{".priority":X}))}else return new k(r,he(e),Be.Default)}else{let t=k.EMPTY_NODE;return ye(n,(i,s)=>{if(Ke(n,i)&&i.substring(0,1)!=="."){const r=he(s);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(i,r))}}),t.updatePriority(he(e))}}Ch(he);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ph extends vi{constructor(e){super(),this.indexPath_=e,I(!F(e)&&D(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const i=this.extractChild(e.node),s=this.extractChild(t.node),r=i.compareTo(s);return r===0?Yt(e.name,t.name):r}makePost(e,t){const i=he(e),s=k.EMPTY_NODE.updateChild(this.indexPath_,i);return new M(t,s)}maxPost(){const e=k.EMPTY_NODE.updateChild(this.indexPath_,An);return new M(_t,e)}toString(){return xa(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xh extends vi{compare(e,t){const i=e.node.compareTo(t.node);return i===0?Yt(e.name,t.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return M.MIN}maxPost(){return M.MAX}makePost(e,t){const i=he(e);return new M(t,i)}toString(){return".value"}}const Oh=new xh;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ba(n){return{type:"value",snapshotNode:n}}function Wt(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function _n(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function vn(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function Dh(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(e){this.index_=e}updateChild(e,t,i,s,r,o){I(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(t);return a.getChild(s).equals(i.getChild(s))&&a.isEmpty()===i.isEmpty()||(o!=null&&(i.isEmpty()?e.hasChild(t)?o.trackChildChange(_n(t,a)):I(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(Wt(t,i)):o.trackChildChange(vn(t,i,a))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(t,i).withIndex(this.index_)}updateFullNode(e,t,i){return i!=null&&(e.isLeafNode()||e.forEachChild(X,(s,r)=>{t.hasChild(s)||i.trackChildChange(_n(s,r))}),t.isLeafNode()||t.forEachChild(X,(s,r)=>{if(e.hasChild(s)){const o=e.getImmediateChild(s);o.equals(r)||i.trackChildChange(vn(s,r,o))}else i.trackChildChange(Wt(s,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?k.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(e){this.indexedFilter_=new Os(e.getIndex()),this.index_=e.getIndex(),this.startPost_=yn.getStartPost_(e),this.endPost_=yn.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&i}updateChild(e,t,i,s,r,o){return this.matches(new M(t,i))||(i=k.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,i,s,r,o)}updateFullNode(e,t,i){t.isLeafNode()&&(t=k.EMPTY_NODE);let s=t.withIndex(this.index_);s=s.updatePriority(k.EMPTY_NODE);const r=this;return t.forEachChild(X,(o,a)=>{r.matches(new M(o,a))||(s=s.updateImmediateChild(o,k.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,s,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mh{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const i=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=t=>{const i=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new yn(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,i,s,r,o){return this.rangedFilter_.matches(new M(t,i))||(i=k.EMPTY_NODE),e.getImmediateChild(t).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,i,s,r,o):this.fullLimitUpdateChild_(e,t,i,r,o)}updateFullNode(e,t,i){let s;if(t.isLeafNode()||t.isEmpty())s=k.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){s=k.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const a=r.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))s=s.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{s=t.withIndex(this.index_),s=s.updatePriority(k.EMPTY_NODE);let r;this.reverse_?r=s.getReverseIterator(this.index_):r=s.getIterator(this.index_);let o=0;for(;r.hasNext();){const a=r.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:s=s.updateImmediateChild(a.name,k.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,s,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,i,s,r){let o;if(this.reverse_){const f=this.index_.getCompare();o=(m,E)=>f(E,m)}else o=this.index_.getCompare();const a=e;I(a.numChildren()===this.limit_,"");const l=new M(t,i),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),h=this.rangedFilter_.matches(l);if(a.hasChild(t)){const f=a.getImmediateChild(t);let m=s.getChildAfterChild(this.index_,c,this.reverse_);for(;m!=null&&(m.name===t||a.hasChild(m.name));)m=s.getChildAfterChild(this.index_,m,this.reverse_);const E=m==null?1:o(m,l);if(h&&!i.isEmpty()&&E>=0)return r!=null&&r.trackChildChange(vn(t,i,f)),a.updateImmediateChild(t,i);{r!=null&&r.trackChildChange(_n(t,f));const O=a.updateImmediateChild(t,k.EMPTY_NODE);return m!=null&&this.rangedFilter_.matches(m)?(r!=null&&r.trackChildChange(Wt(m.name,m.node)),O.updateImmediateChild(m.name,m.node)):O}}else return i.isEmpty()?e:h&&o(c,l)>=0?(r!=null&&(r.trackChildChange(_n(c.name,c.node)),r.trackChildChange(Wt(t,i))),a.updateImmediateChild(t,i).updateImmediateChild(c.name,k.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ds{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=X}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return I(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return I(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Vt}hasEnd(){return this.endSet_}getIndexEndValue(){return I(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return I(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:_t}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return I(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===X}copy(){const e=new Ds;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function Lh(n){return n.loadsAllData()?new Os(n.getIndex()):n.hasLimit()?new Mh(n):new yn(n)}function no(n){const e={};if(n.isDefault())return e;let t;if(n.index_===X?t="$priority":n.index_===Oh?t="$value":n.index_===Mt?t="$key":(I(n.index_ instanceof Ph,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=ce(t),n.startSet_){const i=n.startAfterSet_?"startAfter":"startAt";e[i]=ce(n.indexStartValue_),n.startNameSet_&&(e[i]+=","+ce(n.indexStartName_))}if(n.endSet_){const i=n.endBeforeSet_?"endBefore":"endAt";e[i]=ce(n.indexEndValue_),n.endNameSet_&&(e[i]+=","+ce(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function io(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==X&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn extends ka{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(I(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,i,s){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=i,this.appCheckTokenProvider_=s,this.log_=Sn("p:rest:"),this.listens_={}}listen(e,t,i,s){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Zn.getListenId_(e,i),a={};this.listens_[o]=a;const l=no(e._queryParams);this.restRequest_(r+".json",l,(c,h)=>{let f=h;if(c===404&&(f=null,c=null),c===null&&this.onDataUpdate_(r,f,!1,i),Bt(this.listens_,o)===a){let m;c?c===401?m="permission_denied":m="rest_error:"+c:m="ok",s(m,null)}})}unlisten(e,t){const i=Zn.getListenId_(e,t);delete this.listens_[i]}get(e){const t=no(e._queryParams),i=e._path.toString(),s=new gi;return this.restRequest_(i+".json",t,(r,o)=>{let a=o;r===404&&(a=null,r=null),r===null?(this.onDataUpdate_(i,a,!1,null),s.resolve(a)):s.reject(new Error(a))}),s.promise}refreshAuthToken(e){}restRequest_(e,t={},i){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([s,r])=>{s&&s.accessToken&&(t.auth=s.accessToken),r&&r.token&&(t.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+qt(t);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(i&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let l=null;if(a.status>=200&&a.status<300){try{l=pn(a.responseText)}catch{ve("Failed to parse JSON response for "+o+": "+a.responseText)}i(null,l)}else a.status!==401&&a.status!==404&&ve("Got unsuccessful REST response for "+o+" Status: "+a.status),i(a.status);i=null}},a.open("GET",o,!0),a.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fh{constructor(){this.rootNode_=k.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ei(){return{value:null,children:new Map}}function Ha(n,e,t){if(F(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const i=D(e);n.children.has(i)||n.children.set(i,ei());const s=n.children.get(i);e=W(e),Ha(s,e,t)}}function os(n,e,t){n.value!==null?t(e,n.value):Uh(n,(i,s)=>{const r=new V(e.toString()+"/"+i);os(s,r,t)})}function Uh(n,e){n.children.forEach((t,i)=>{e(i,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jh{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&ye(this.last_,(i,s)=>{t[i]=t[i]-s}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const so=10*1e3,Bh=30*1e3,Hh=5*60*1e3;class Vh{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new jh(e);const i=so+(Bh-so)*Math.random();cn(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){const e=this.statsListener_.get(),t={};let i=!1;ye(e,(s,r)=>{r>0&&Ke(this.statsToReport_,s)&&(t[s]=r,i=!0)}),i&&this.server_.reportStats(t),cn(this.reportStats_.bind(this),Math.floor(Math.random()*2*Hh))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ke;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(ke||(ke={}));function Va(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function Ms(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function Ls(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ti{constructor(e,t,i){this.path=e,this.affectedTree=t,this.revert=i,this.type=ke.ACK_USER_WRITE,this.source=Va()}operationForChild(e){if(F(this.path)){if(this.affectedTree.value!=null)return I(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new V(e));return new ti(U(),t,this.revert)}}else return I(D(this.path)===e,"operationForChild called for unrelated child."),new ti(W(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e,t){this.source=e,this.path=t,this.type=ke.LISTEN_COMPLETE}operationForChild(e){return F(this.path)?new En(this.source,U()):new En(this.source,W(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(e,t,i){this.source=e,this.path=t,this.snap=i,this.type=ke.OVERWRITE}operationForChild(e){return F(this.path)?new vt(this.source,U(),this.snap.getImmediateChild(e)):new vt(this.source,W(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn{constructor(e,t,i){this.source=e,this.path=t,this.children=i,this.type=ke.MERGE}operationForChild(e){if(F(this.path)){const t=this.children.subtree(new V(e));return t.isEmpty()?null:t.value?new vt(this.source,U(),t.value):new wn(this.source,U(),t)}else return I(D(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new wn(this.source,W(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e,t,i){this.node_=e,this.fullyInitialized_=t,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(F(e))return this.isFullyInitialized()&&!this.filtered_;const t=D(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wh{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function zh(n,e,t,i){const s=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(Dh(o.childName,o.snapshotNode))}),on(n,s,"child_removed",e,i,t),on(n,s,"child_added",e,i,t),on(n,s,"child_moved",r,i,t),on(n,s,"child_changed",e,i,t),on(n,s,"value",e,i,t),s}function on(n,e,t,i,s,r){const o=i.filter(a=>a.type===t);o.sort((a,l)=>Gh(n,a,l)),o.forEach(a=>{const l=$h(n,a,r);s.forEach(c=>{c.respondsTo(a.type)&&e.push(c.createEvent(l,n.query_))})})}function $h(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function Gh(n,e,t){if(e.childName==null||t.childName==null)throw Gt("Should only compare child_ events.");const i=new M(e.childName,e.snapshotNode),s=new M(t.childName,t.snapshotNode);return n.index_.compare(i,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yi(n,e){return{eventCache:n,serverCache:e}}function un(n,e,t,i){return yi(new yt(e,t,i),n.serverCache)}function Wa(n,e,t,i){return yi(n.eventCache,new yt(e,t,i))}function as(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function Et(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zi;const qh=()=>(zi||(zi=new _e(xd)),zi);class G{static fromObject(e){let t=new G(null);return ye(e,(i,s)=>{t=t.set(new V(i),s)}),t}constructor(e,t=qh()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:U(),value:this.value};if(F(e))return null;{const i=D(e),s=this.children.get(i);if(s!==null){const r=s.findRootMostMatchingPathAndValue(W(e),t);return r!=null?{path:re(new V(i),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(F(e))return this;{const t=D(e),i=this.children.get(t);return i!==null?i.subtree(W(e)):new G(null)}}set(e,t){if(F(e))return new G(t,this.children);{const i=D(e),r=(this.children.get(i)||new G(null)).set(W(e),t),o=this.children.insert(i,r);return new G(this.value,o)}}remove(e){if(F(e))return this.children.isEmpty()?new G(null):new G(null,this.children);{const t=D(e),i=this.children.get(t);if(i){const s=i.remove(W(e));let r;return s.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,s),this.value===null&&r.isEmpty()?new G(null):new G(this.value,r)}else return this}}get(e){if(F(e))return this.value;{const t=D(e),i=this.children.get(t);return i?i.get(W(e)):null}}setTree(e,t){if(F(e))return t;{const i=D(e),r=(this.children.get(i)||new G(null)).setTree(W(e),t);let o;return r.isEmpty()?o=this.children.remove(i):o=this.children.insert(i,r),new G(this.value,o)}}fold(e){return this.fold_(U(),e)}fold_(e,t){const i={};return this.children.inorderTraversal((s,r)=>{i[s]=r.fold_(re(e,s),t)}),t(e,this.value,i)}findOnPath(e,t){return this.findOnPath_(e,U(),t)}findOnPath_(e,t,i){const s=this.value?i(t,this.value):!1;if(s)return s;if(F(e))return null;{const r=D(e),o=this.children.get(r);return o?o.findOnPath_(W(e),re(t,r),i):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,U(),t)}foreachOnPath_(e,t,i){if(F(e))return this;{this.value&&i(t,this.value);const s=D(e),r=this.children.get(s);return r?r.foreachOnPath_(W(e),re(t,s),i):new G(null)}}foreach(e){this.foreach_(U(),e)}foreach_(e,t){this.children.inorderTraversal((i,s)=>{s.foreach_(re(e,i),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,i)=>{i.value&&e(t,i.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(e){this.writeTree_=e}static empty(){return new Pe(new G(null))}}function dn(n,e,t){if(F(e))return new Pe(new G(t));{const i=n.writeTree_.findRootMostValueAndPath(e);if(i!=null){const s=i.path;let r=i.value;const o=ge(s,e);return r=r.updateChild(o,t),new Pe(n.writeTree_.set(s,r))}else{const s=new G(t),r=n.writeTree_.setTree(e,s);return new Pe(r)}}}function ro(n,e,t){let i=n;return ye(t,(s,r)=>{i=dn(i,re(e,s),r)}),i}function oo(n,e){if(F(e))return Pe.empty();{const t=n.writeTree_.setTree(e,new G(null));return new Pe(t)}}function ls(n,e){return It(n,e)!=null}function It(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(ge(t.path,e)):null}function ao(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(X,(i,s)=>{e.push(new M(i,s))}):n.writeTree_.children.inorderTraversal((i,s)=>{s.value!=null&&e.push(new M(i,s.value))}),e}function it(n,e){if(F(e))return n;{const t=It(n,e);return t!=null?new Pe(new G(t)):new Pe(n.writeTree_.subtree(e))}}function cs(n){return n.writeTree_.isEmpty()}function zt(n,e){return za(U(),n.writeTree_,e)}function za(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let i=null;return e.children.inorderTraversal((s,r)=>{s===".priority"?(I(r.value!==null,"Priority writes must always be leaf nodes"),i=r.value):t=za(re(n,s),r,t)}),!t.getChild(n).isEmpty()&&i!==null&&(t=t.updateChild(re(n,".priority"),i)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fs(n,e){return Ka(e,n)}function Kh(n,e,t,i,s){I(i>n.lastWriteId,"Stacking an older write on top of newer ones"),s===void 0&&(s=!0),n.allWrites.push({path:e,snap:t,writeId:i,visible:s}),s&&(n.visibleWrites=dn(n.visibleWrites,e,t)),n.lastWriteId=i}function Yh(n,e){for(let t=0;t<n.allWrites.length;t++){const i=n.allWrites[t];if(i.writeId===e)return i}return null}function Qh(n,e){const t=n.allWrites.findIndex(a=>a.writeId===e);I(t>=0,"removeWrite called with nonexistent writeId.");const i=n.allWrites[t];n.allWrites.splice(t,1);let s=i.visible,r=!1,o=n.allWrites.length-1;for(;s&&o>=0;){const a=n.allWrites[o];a.visible&&(o>=t&&Jh(a,i.path)?s=!1:Ne(i.path,a.path)&&(r=!0)),o--}if(s){if(r)return Xh(n),!0;if(i.snap)n.visibleWrites=oo(n.visibleWrites,i.path);else{const a=i.children;ye(a,l=>{n.visibleWrites=oo(n.visibleWrites,re(i.path,l))})}return!0}else return!1}function Jh(n,e){if(n.snap)return Ne(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&Ne(re(n.path,t),e))return!0;return!1}function Xh(n){n.visibleWrites=$a(n.allWrites,Zh,U()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function Zh(n){return n.visible}function $a(n,e,t){let i=Pe.empty();for(let s=0;s<n.length;++s){const r=n[s];if(e(r)){const o=r.path;let a;if(r.snap)Ne(t,o)?(a=ge(t,o),i=dn(i,a,r.snap)):Ne(o,t)&&(a=ge(o,t),i=dn(i,U(),r.snap.getChild(a)));else if(r.children){if(Ne(t,o))a=ge(t,o),i=ro(i,a,r.children);else if(Ne(o,t))if(a=ge(o,t),F(a))i=ro(i,U(),r.children);else{const l=Bt(r.children,D(a));if(l){const c=l.getChild(W(a));i=dn(i,U(),c)}}}else throw Gt("WriteRecord should have .snap or .children")}}return i}function Ga(n,e,t,i,s){if(!i&&!s){const r=It(n.visibleWrites,e);if(r!=null)return r;{const o=it(n.visibleWrites,e);if(cs(o))return t;if(t==null&&!ls(o,U()))return null;{const a=t||k.EMPTY_NODE;return zt(o,a)}}}else{const r=it(n.visibleWrites,e);if(!s&&cs(r))return t;if(!s&&t==null&&!ls(r,U()))return null;{const o=function(c){return(c.visible||s)&&(!i||!~i.indexOf(c.writeId))&&(Ne(c.path,e)||Ne(e,c.path))},a=$a(n.allWrites,o,e),l=t||k.EMPTY_NODE;return zt(a,l)}}}function ef(n,e,t){let i=k.EMPTY_NODE;const s=It(n.visibleWrites,e);if(s)return s.isLeafNode()||s.forEachChild(X,(r,o)=>{i=i.updateImmediateChild(r,o)}),i;if(t){const r=it(n.visibleWrites,e);return t.forEachChild(X,(o,a)=>{const l=zt(it(r,new V(o)),a);i=i.updateImmediateChild(o,l)}),ao(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}else{const r=it(n.visibleWrites,e);return ao(r).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}}function tf(n,e,t,i,s){I(i||s,"Either existingEventSnap or existingServerSnap must exist");const r=re(e,t);if(ls(n.visibleWrites,r))return null;{const o=it(n.visibleWrites,r);return cs(o)?s.getChild(t):zt(o,s.getChild(t))}}function nf(n,e,t,i){const s=re(e,t),r=It(n.visibleWrites,s);if(r!=null)return r;if(i.isCompleteForChild(t)){const o=it(n.visibleWrites,s);return zt(o,i.getNode().getImmediateChild(t))}else return null}function sf(n,e){return It(n.visibleWrites,e)}function rf(n,e,t,i,s,r,o){let a;const l=it(n.visibleWrites,e),c=It(l,U());if(c!=null)a=c;else if(t!=null)a=zt(l,t);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const h=[],f=o.getCompare(),m=r?a.getReverseIteratorFrom(i,o):a.getIteratorFrom(i,o);let E=m.getNext();for(;E&&h.length<s;)f(E,i)!==0&&h.push(E),E=m.getNext();return h}else return[]}function of(){return{visibleWrites:Pe.empty(),allWrites:[],lastWriteId:-1}}function ni(n,e,t,i){return Ga(n.writeTree,n.treePath,e,t,i)}function Us(n,e){return ef(n.writeTree,n.treePath,e)}function lo(n,e,t,i){return tf(n.writeTree,n.treePath,e,t,i)}function ii(n,e){return sf(n.writeTree,re(n.treePath,e))}function af(n,e,t,i,s,r){return rf(n.writeTree,n.treePath,e,t,i,s,r)}function js(n,e,t){return nf(n.writeTree,n.treePath,e,t)}function qa(n,e){return Ka(re(n.treePath,e),n.writeTree)}function Ka(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lf{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,i=e.childName;I(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),I(i!==".priority","Only non-priority child changes can be tracked.");const s=this.changeMap.get(i);if(s){const r=s.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(i,vn(i,e.snapshotNode,s.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(i);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(i,_n(i,s.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(i,Wt(i,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(i,vn(i,e.snapshotNode,s.oldSnap));else throw Gt("Illegal combination of changes: "+e+" occurred after "+s)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cf{getCompleteChild(e){return null}getChildAfterChild(e,t,i){return null}}const Ya=new cf;class Bs{constructor(e,t,i=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=i}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const i=this.optCompleteServerCache_!=null?new yt(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return js(this.writes_,e,i)}}getChildAfterChild(e,t,i){const s=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:Et(this.viewCache_),r=af(this.writes_,s,t,1,i,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uf(n){return{filter:n}}function df(n,e){I(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),I(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function hf(n,e,t,i,s){const r=new lf;let o,a;if(t.type===ke.OVERWRITE){const c=t;c.source.fromUser?o=us(n,e,c.path,c.snap,i,s,r):(I(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered()&&!F(c.path),o=si(n,e,c.path,c.snap,i,s,a,r))}else if(t.type===ke.MERGE){const c=t;c.source.fromUser?o=pf(n,e,c.path,c.children,i,s,r):(I(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered(),o=ds(n,e,c.path,c.children,i,s,a,r))}else if(t.type===ke.ACK_USER_WRITE){const c=t;c.revert?o=_f(n,e,c.path,i,s,r):o=mf(n,e,c.path,c.affectedTree,i,s,r)}else if(t.type===ke.LISTEN_COMPLETE)o=gf(n,e,t.path,i,r);else throw Gt("Unknown operation type: "+t.type);const l=r.getChanges();return ff(e,o,l),{viewCache:o,changes:l}}function ff(n,e,t){const i=e.eventCache;if(i.isFullyInitialized()){const s=i.getNode().isLeafNode()||i.getNode().isEmpty(),r=as(n);(t.length>0||!n.eventCache.isFullyInitialized()||s&&!i.getNode().equals(r)||!i.getNode().getPriority().equals(r.getPriority()))&&t.push(Ba(as(e)))}}function Qa(n,e,t,i,s,r){const o=e.eventCache;if(ii(i,t)!=null)return e;{let a,l;if(F(t))if(I(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const c=Et(e),h=c instanceof k?c:k.EMPTY_NODE,f=Us(i,h);a=n.filter.updateFullNode(e.eventCache.getNode(),f,r)}else{const c=ni(i,Et(e));a=n.filter.updateFullNode(e.eventCache.getNode(),c,r)}else{const c=D(t);if(c===".priority"){I(st(t)===1,"Can't have a priority with additional path components");const h=o.getNode();l=e.serverCache.getNode();const f=lo(i,t,h,l);f!=null?a=n.filter.updatePriority(h,f):a=o.getNode()}else{const h=W(t);let f;if(o.isCompleteForChild(c)){l=e.serverCache.getNode();const m=lo(i,t,o.getNode(),l);m!=null?f=o.getNode().getImmediateChild(c).updateChild(h,m):f=o.getNode().getImmediateChild(c)}else f=js(i,c,e.serverCache);f!=null?a=n.filter.updateChild(o.getNode(),c,f,h,s,r):a=o.getNode()}}return un(e,a,o.isFullyInitialized()||F(t),n.filter.filtersNodes())}}function si(n,e,t,i,s,r,o,a){const l=e.serverCache;let c;const h=o?n.filter:n.filter.getIndexedFilter();if(F(t))c=h.updateFullNode(l.getNode(),i,null);else if(h.filtersNodes()&&!l.isFiltered()){const E=l.getNode().updateChild(t,i);c=h.updateFullNode(l.getNode(),E,null)}else{const E=D(t);if(!l.isCompleteForPath(t)&&st(t)>1)return e;const S=W(t),j=l.getNode().getImmediateChild(E).updateChild(S,i);E===".priority"?c=h.updatePriority(l.getNode(),j):c=h.updateChild(l.getNode(),E,j,S,Ya,null)}const f=Wa(e,c,l.isFullyInitialized()||F(t),h.filtersNodes()),m=new Bs(s,f,r);return Qa(n,f,t,s,m,a)}function us(n,e,t,i,s,r,o){const a=e.eventCache;let l,c;const h=new Bs(s,e,r);if(F(t))c=n.filter.updateFullNode(e.eventCache.getNode(),i,o),l=un(e,c,!0,n.filter.filtersNodes());else{const f=D(t);if(f===".priority")c=n.filter.updatePriority(e.eventCache.getNode(),i),l=un(e,c,a.isFullyInitialized(),a.isFiltered());else{const m=W(t),E=a.getNode().getImmediateChild(f);let S;if(F(m))S=i;else{const O=h.getCompleteChild(f);O!=null?Pa(m)===".priority"&&O.getChild(Oa(m)).isEmpty()?S=O:S=O.updateChild(m,i):S=k.EMPTY_NODE}if(E.equals(S))l=e;else{const O=n.filter.updateChild(a.getNode(),f,S,m,h,o);l=un(e,O,a.isFullyInitialized(),n.filter.filtersNodes())}}}return l}function co(n,e){return n.eventCache.isCompleteForChild(e)}function pf(n,e,t,i,s,r,o){let a=e;return i.foreach((l,c)=>{const h=re(t,l);co(e,D(h))&&(a=us(n,a,h,c,s,r,o))}),i.foreach((l,c)=>{const h=re(t,l);co(e,D(h))||(a=us(n,a,h,c,s,r,o))}),a}function uo(n,e,t){return t.foreach((i,s)=>{e=e.updateChild(i,s)}),e}function ds(n,e,t,i,s,r,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let l=e,c;F(t)?c=i:c=new G(null).setTree(t,i);const h=e.serverCache.getNode();return c.children.inorderTraversal((f,m)=>{if(h.hasChild(f)){const E=e.serverCache.getNode().getImmediateChild(f),S=uo(n,E,m);l=si(n,l,new V(f),S,s,r,o,a)}}),c.children.inorderTraversal((f,m)=>{const E=!e.serverCache.isCompleteForChild(f)&&m.value===null;if(!h.hasChild(f)&&!E){const S=e.serverCache.getNode().getImmediateChild(f),O=uo(n,S,m);l=si(n,l,new V(f),O,s,r,o,a)}}),l}function mf(n,e,t,i,s,r,o){if(ii(s,t)!=null)return e;const a=e.serverCache.isFiltered(),l=e.serverCache;if(i.value!=null){if(F(t)&&l.isFullyInitialized()||l.isCompleteForPath(t))return si(n,e,t,l.getNode().getChild(t),s,r,a,o);if(F(t)){let c=new G(null);return l.getNode().forEachChild(Mt,(h,f)=>{c=c.set(new V(h),f)}),ds(n,e,t,c,s,r,a,o)}else return e}else{let c=new G(null);return i.foreach((h,f)=>{const m=re(t,h);l.isCompleteForPath(m)&&(c=c.set(h,l.getNode().getChild(m)))}),ds(n,e,t,c,s,r,a,o)}}function gf(n,e,t,i,s){const r=e.serverCache,o=Wa(e,r.getNode(),r.isFullyInitialized()||F(t),r.isFiltered());return Qa(n,o,t,i,Ya,s)}function _f(n,e,t,i,s,r){let o;if(ii(i,t)!=null)return e;{const a=new Bs(i,e,s),l=e.eventCache.getNode();let c;if(F(t)||D(t)===".priority"){let h;if(e.serverCache.isFullyInitialized())h=ni(i,Et(e));else{const f=e.serverCache.getNode();I(f instanceof k,"serverChildren would be complete if leaf node"),h=Us(i,f)}h=h,c=n.filter.updateFullNode(l,h,r)}else{const h=D(t);let f=js(i,h,e.serverCache);f==null&&e.serverCache.isCompleteForChild(h)&&(f=l.getImmediateChild(h)),f!=null?c=n.filter.updateChild(l,h,f,W(t),a,r):e.eventCache.getNode().hasChild(h)?c=n.filter.updateChild(l,h,k.EMPTY_NODE,W(t),a,r):c=l,c.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=ni(i,Et(e)),o.isLeafNode()&&(c=n.filter.updateFullNode(c,o,r)))}return o=e.serverCache.isFullyInitialized()||ii(i,U())!=null,un(e,c,o,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vf{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const i=this.query_._queryParams,s=new Os(i.getIndex()),r=Lh(i);this.processor_=uf(r);const o=t.serverCache,a=t.eventCache,l=s.updateFullNode(k.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode(k.EMPTY_NODE,a.getNode(),null),h=new yt(l,o.isFullyInitialized(),s.filtersNodes()),f=new yt(c,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=yi(f,h),this.eventGenerator_=new Wh(this.query_)}get query(){return this.query_}}function yf(n){return n.viewCache_.serverCache.getNode()}function Ef(n,e){const t=Et(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!F(e)&&!t.getImmediateChild(D(e)).isEmpty())?t.getChild(e):null}function ho(n){return n.eventRegistrations_.length===0}function wf(n,e){n.eventRegistrations_.push(e)}function fo(n,e,t){const i=[];if(t){I(e==null,"A cancel should cancel all event registrations.");const s=n.query._path;n.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(t,s);o&&i.push(o)})}if(e){let s=[];for(let r=0;r<n.eventRegistrations_.length;++r){const o=n.eventRegistrations_[r];if(!o.matches(e))s.push(o);else if(e.hasAnyCallback()){s=s.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=s}else n.eventRegistrations_=[];return i}function po(n,e,t,i){e.type===ke.MERGE&&e.source.queryId!==null&&(I(Et(n.viewCache_),"We should always have a full cache before handling merges"),I(as(n.viewCache_),"Missing event cache, even though we have a server cache"));const s=n.viewCache_,r=hf(n.processor_,s,e,t,i);return df(n.processor_,r.viewCache),I(r.viewCache.serverCache.isFullyInitialized()||!s.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,Ja(n,r.changes,r.viewCache.eventCache.getNode(),null)}function If(n,e){const t=n.viewCache_.eventCache,i=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(X,(r,o)=>{i.push(Wt(r,o))}),t.isFullyInitialized()&&i.push(Ba(t.getNode())),Ja(n,i,t.getNode(),e)}function Ja(n,e,t,i){const s=i?[i]:n.eventRegistrations_;return zh(n.eventGenerator_,e,t,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ri;class bf{constructor(){this.views=new Map}}function Cf(n){I(!ri,"__referenceConstructor has already been defined"),ri=n}function Tf(){return I(ri,"Reference.ts has not been loaded"),ri}function Sf(n){return n.views.size===0}function Hs(n,e,t,i){const s=e.source.queryId;if(s!==null){const r=n.views.get(s);return I(r!=null,"SyncTree gave us an op for an invalid query."),po(r,e,t,i)}else{let r=[];for(const o of n.views.values())r=r.concat(po(o,e,t,i));return r}}function Af(n,e,t,i,s){const r=e._queryIdentifier,o=n.views.get(r);if(!o){let a=ni(t,s?i:null),l=!1;a?l=!0:i instanceof k?(a=Us(t,i),l=!1):(a=k.EMPTY_NODE,l=!1);const c=yi(new yt(a,l,!1),new yt(i,s,!1));return new vf(e,c)}return o}function Nf(n,e,t,i,s,r){const o=Af(n,e,i,s,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),wf(o,t),If(o,t)}function kf(n,e,t,i){const s=e._queryIdentifier,r=[];let o=[];const a=rt(n);if(s==="default")for(const[l,c]of n.views.entries())o=o.concat(fo(c,t,i)),ho(c)&&(n.views.delete(l),c.query._queryParams.loadsAllData()||r.push(c.query));else{const l=n.views.get(s);l&&(o=o.concat(fo(l,t,i)),ho(l)&&(n.views.delete(s),l.query._queryParams.loadsAllData()||r.push(l.query)))}return a&&!rt(n)&&r.push(new(Tf())(e._repo,e._path)),{removed:r,events:o}}function Xa(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function Lt(n,e){let t=null;for(const i of n.views.values())t=t||Ef(i,e);return t}function Za(n,e){if(e._queryParams.loadsAllData())return Ei(n);{const i=e._queryIdentifier;return n.views.get(i)}}function el(n,e){return Za(n,e)!=null}function rt(n){return Ei(n)!=null}function Ei(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let oi;function Rf(n){I(!oi,"__referenceConstructor has already been defined"),oi=n}function Pf(){return I(oi,"Reference.ts has not been loaded"),oi}let xf=1;class mo{constructor(e){this.listenProvider_=e,this.syncPointTree_=new G(null),this.pendingWriteTree_=of(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function tl(n,e,t,i,s){return Kh(n.pendingWriteTree_,e,t,i,s),s?Nn(n,new vt(Va(),e,t)):[]}function ht(n,e,t=!1){const i=Yh(n.pendingWriteTree_,e);if(Qh(n.pendingWriteTree_,e)){let r=new G(null);return i.snap!=null?r=r.set(U(),!0):ye(i.children,o=>{r=r.set(new V(o),!0)}),Nn(n,new ti(i.path,r,t))}else return[]}function wi(n,e,t){return Nn(n,new vt(Ms(),e,t))}function Of(n,e,t){const i=G.fromObject(t);return Nn(n,new wn(Ms(),e,i))}function Df(n,e){return Nn(n,new En(Ms(),e))}function Mf(n,e,t){const i=Ws(n,t);if(i){const s=zs(i),r=s.path,o=s.queryId,a=ge(r,e),l=new En(Ls(o),a);return $s(n,r,l)}else return[]}function hs(n,e,t,i,s=!1){const r=e._path,o=n.syncPointTree_.get(r);let a=[];if(o&&(e._queryIdentifier==="default"||el(o,e))){const l=kf(o,e,t,i);Sf(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const c=l.removed;if(a=l.events,!s){const h=c.findIndex(m=>m._queryParams.loadsAllData())!==-1,f=n.syncPointTree_.findOnPath(r,(m,E)=>rt(E));if(h&&!f){const m=n.syncPointTree_.subtree(r);if(!m.isEmpty()){const E=Uf(m);for(let S=0;S<E.length;++S){const O=E[S],j=O.query,ne=sl(n,O);n.listenProvider_.startListening(hn(j),ai(n,j),ne.hashFn,ne.onComplete)}}}!f&&c.length>0&&!i&&(h?n.listenProvider_.stopListening(hn(e),null):c.forEach(m=>{const E=n.queryToTagMap.get(Ii(m));n.listenProvider_.stopListening(hn(m),E)}))}jf(n,c)}return a}function Lf(n,e,t,i){const s=Ws(n,i);if(s!=null){const r=zs(s),o=r.path,a=r.queryId,l=ge(o,e),c=new vt(Ls(a),l,t);return $s(n,o,c)}else return[]}function Ff(n,e,t,i){const s=Ws(n,i);if(s){const r=zs(s),o=r.path,a=r.queryId,l=ge(o,e),c=G.fromObject(t),h=new wn(Ls(a),l,c);return $s(n,o,h)}else return[]}function go(n,e,t,i=!1){const s=e._path;let r=null,o=!1;n.syncPointTree_.foreachOnPath(s,(m,E)=>{const S=ge(m,s);r=r||Lt(E,S),o=o||rt(E)});let a=n.syncPointTree_.get(s);a?(o=o||rt(a),r=r||Lt(a,U())):(a=new bf,n.syncPointTree_=n.syncPointTree_.set(s,a));let l;r!=null?l=!0:(l=!1,r=k.EMPTY_NODE,n.syncPointTree_.subtree(s).foreachChild((E,S)=>{const O=Lt(S,U());O&&(r=r.updateImmediateChild(E,O))}));const c=el(a,e);if(!c&&!e._queryParams.loadsAllData()){const m=Ii(e);I(!n.queryToTagMap.has(m),"View does not exist, but we have a tag");const E=Bf();n.queryToTagMap.set(m,E),n.tagToQueryMap.set(E,m)}const h=Fs(n.pendingWriteTree_,s);let f=Nf(a,e,t,h,r,l);if(!c&&!o&&!i){const m=Za(a,e);f=f.concat(Hf(n,e,m))}return f}function Vs(n,e,t){const s=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,a)=>{const l=ge(o,e),c=Lt(a,l);if(c)return c});return Ga(s,e,r,t,!0)}function Nn(n,e){return nl(e,n.syncPointTree_,null,Fs(n.pendingWriteTree_,U()))}function nl(n,e,t,i){if(F(n.path))return il(n,e,t,i);{const s=e.get(U());t==null&&s!=null&&(t=Lt(s,U()));let r=[];const o=D(n.path),a=n.operationForChild(o),l=e.children.get(o);if(l&&a){const c=t?t.getImmediateChild(o):null,h=qa(i,o);r=r.concat(nl(a,l,c,h))}return s&&(r=r.concat(Hs(s,n,i,t))),r}}function il(n,e,t,i){const s=e.get(U());t==null&&s!=null&&(t=Lt(s,U()));let r=[];return e.children.inorderTraversal((o,a)=>{const l=t?t.getImmediateChild(o):null,c=qa(i,o),h=n.operationForChild(o);h&&(r=r.concat(il(h,a,l,c)))}),s&&(r=r.concat(Hs(s,n,i,t))),r}function sl(n,e){const t=e.query,i=ai(n,t);return{hashFn:()=>(yf(e)||k.EMPTY_NODE).hash(),onComplete:s=>{if(s==="ok")return i?Mf(n,t._path,i):Df(n,t._path);{const r=Md(s,t);return hs(n,t,null,r)}}}}function ai(n,e){const t=Ii(e);return n.queryToTagMap.get(t)}function Ii(n){return n._path.toString()+"$"+n._queryIdentifier}function Ws(n,e){return n.tagToQueryMap.get(e)}function zs(n){const e=n.indexOf("$");return I(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new V(n.substr(0,e))}}function $s(n,e,t){const i=n.syncPointTree_.get(e);I(i,"Missing sync point for query tag that we're tracking");const s=Fs(n.pendingWriteTree_,e);return Hs(i,t,s,null)}function Uf(n){return n.fold((e,t,i)=>{if(t&&rt(t))return[Ei(t)];{let s=[];return t&&(s=Xa(t)),ye(i,(r,o)=>{s=s.concat(o)}),s}})}function hn(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(Pf())(n._repo,n._path):n}function jf(n,e){for(let t=0;t<e.length;++t){const i=e[t];if(!i._queryParams.loadsAllData()){const s=Ii(i),r=n.queryToTagMap.get(s);n.queryToTagMap.delete(s),n.tagToQueryMap.delete(r)}}}function Bf(){return xf++}function Hf(n,e,t){const i=e._path,s=ai(n,e),r=sl(n,t),o=n.listenProvider_.startListening(hn(e),s,r.hashFn,r.onComplete),a=n.syncPointTree_.subtree(i);if(s)I(!rt(a.value),"If we're adding a query, it shouldn't be shadowed");else{const l=a.fold((c,h,f)=>{if(!F(c)&&h&&rt(h))return[Ei(h).query];{let m=[];return h&&(m=m.concat(Xa(h).map(E=>E.query))),ye(f,(E,S)=>{m=m.concat(S)}),m}});for(let c=0;c<l.length;++c){const h=l[c];n.listenProvider_.stopListening(hn(h),ai(n,h))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gs{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new Gs(t)}node(){return this.node_}}class qs{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=re(this.path_,e);return new qs(this.syncTree_,t)}node(){return Vs(this.syncTree_,this.path_)}}const Vf=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},_o=function(n,e,t){if(!n||typeof n!="object")return n;if(I(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return Wf(n[".sv"],e,t);if(typeof n[".sv"]=="object")return zf(n[".sv"],e);I(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},Wf=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:I(!1,"Unexpected server value: "+n)}},zf=function(n,e,t){n.hasOwnProperty("increment")||I(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const i=n.increment;typeof i!="number"&&I(!1,"Unexpected increment value: "+i);const s=e.node();if(I(s!==null&&typeof s<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!s.isLeafNode())return i;const o=s.getValue();return typeof o!="number"?i:o+i},$f=function(n,e,t,i){return Ks(e,new qs(t,n),i)},rl=function(n,e,t){return Ks(n,new Gs(e),t)};function Ks(n,e,t){const i=n.getPriority().val(),s=_o(i,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const o=n,a=_o(o.getValue(),e,t);return a!==o.getValue()||s!==o.getPriority().val()?new ae(a,he(s)):n}else{const o=n;return r=o,s!==o.getPriority().val()&&(r=r.updatePriority(new ae(s))),o.forEachChild(X,(a,l)=>{const c=Ks(l,e.getImmediateChild(a),t);c!==l&&(r=r.updateImmediateChild(a,c))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ys{constructor(e="",t=null,i={children:{},childCount:0}){this.name=e,this.parent=t,this.node=i}}function Qs(n,e){let t=e instanceof V?e:new V(e),i=n,s=D(t);for(;s!==null;){const r=Bt(i.node.children,s)||{children:{},childCount:0};i=new Ys(s,i,r),t=W(t),s=D(t)}return i}function Jt(n){return n.node.value}function ol(n,e){n.node.value=e,fs(n)}function al(n){return n.node.childCount>0}function Gf(n){return Jt(n)===void 0&&!al(n)}function bi(n,e){ye(n.node.children,(t,i)=>{e(new Ys(t,n,i))})}function ll(n,e,t,i){t&&e(n),bi(n,s=>{ll(s,e,!0)})}function qf(n,e,t){let i=n.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function kn(n){return new V(n.parent===null?n.name:kn(n.parent)+"/"+n.name)}function fs(n){n.parent!==null&&Kf(n.parent,n.name,n)}function Kf(n,e,t){const i=Gf(t),s=Ke(n.node.children,e);i&&s?(delete n.node.children[e],n.node.childCount--,fs(n)):!i&&!s&&(n.node.children[e]=t.node,n.node.childCount++,fs(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yf=/[\[\].#$\/\u0000-\u001F\u007F]/,Qf=/[\[\].#$\u0000-\u001F\u007F]/,$i=10*1024*1024,cl=function(n){return typeof n=="string"&&n.length!==0&&!Yf.test(n)},ul=function(n){return typeof n=="string"&&n.length!==0&&!Qf.test(n)},Jf=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),ul(n)},dl=function(n,e,t,i){i&&e===void 0||Js(Is(n,"value"),e,t)},Js=function(n,e,t){const i=t instanceof V?new ph(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+ut(i));if(typeof e=="function")throw new Error(n+"contains a function "+ut(i)+" with contents = "+e.toString());if(ua(e))throw new Error(n+"contains "+e.toString()+" "+ut(i));if(typeof e=="string"&&e.length>$i/3&&_i(e)>$i)throw new Error(n+"contains a string greater than "+$i+" utf8 bytes "+ut(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let s=!1,r=!1;if(ye(e,(o,a)=>{if(o===".value")s=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!cl(o)))throw new Error(n+" contains an invalid key ("+o+") "+ut(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);mh(i,o),Js(n,a,i),gh(i)}),s&&r)throw new Error(n+' contains ".value" child '+ut(i)+" in addition to actual children.")}},hl=function(n,e,t,i){if(!ul(t))throw new Error(Is(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},Xf=function(n,e,t,i){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),hl(n,e,t)},fl=function(n,e){if(D(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},Zf=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!cl(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!Jf(t))throw new Error(Is(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ep{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function Xs(n,e){let t=null;for(let i=0;i<e.length;i++){const s=e[i],r=s.getPath();t!==null&&!Rs(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(s)}t&&n.eventLists_.push(t)}function pl(n,e,t){Xs(n,t),ml(n,i=>Rs(i,e))}function Ge(n,e,t){Xs(n,t),ml(n,i=>Ne(i,e)||Ne(e,i))}function ml(n,e){n.recursionDepth_++;let t=!0;for(let i=0;i<n.eventLists_.length;i++){const s=n.eventLists_[i];if(s){const r=s.path;e(r)?(tp(n.eventLists_[i]),n.eventLists_[i]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function tp(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const i=t.getEventRunner();ln&&fe("event: "+t.toString()),Qt(i)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const np="repo_interrupt",ip=25;class sp{constructor(e,t,i,s){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=i,this.appCheckProvider_=s,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new ep,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=ei(),this.transactionQueueTree_=new Ys,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function rp(n,e,t){if(n.stats_=Ns(n.repoInfo_),n.forceRestClient_||jd())n.server_=new Zn(n.repoInfo_,(i,s,r,o)=>{vo(n,i,s,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>yo(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{ce(t)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}n.persistentConnection_=new We(n.repoInfo_,e,(i,s,r,o)=>{vo(n,i,s,r,o)},i=>{yo(n,i)},i=>{op(n,i)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(i=>{n.server_.refreshAuthToken(i)}),n.appCheckProvider_.addTokenChangeListener(i=>{n.server_.refreshAppCheckToken(i.token)}),n.statsReporter_=zd(n.repoInfo_,()=>new Vh(n.stats_,n.server_)),n.infoData_=new Fh,n.infoSyncTree_=new mo({startListening:(i,s,r,o)=>{let a=[];const l=n.infoData_.getNode(i._path);return l.isEmpty()||(a=wi(n.infoSyncTree_,i._path,l),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),er(n,"connected",!1),n.serverSyncTree_=new mo({startListening:(i,s,r,o)=>(n.server_.listen(i,r,s,(a,l)=>{const c=o(a,l);Ge(n.eventQueue_,i._path,c)}),[]),stopListening:(i,s)=>{n.server_.unlisten(i,s)}})}function gl(n){const t=n.infoData_.getNode(new V(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function Zs(n){return Vf({timestamp:gl(n)})}function vo(n,e,t,i,s){n.dataUpdateCount++;const r=new V(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(s)if(i){const l=Kn(t,c=>he(c));o=Ff(n.serverSyncTree_,r,l,s)}else{const l=he(t);o=Lf(n.serverSyncTree_,r,l,s)}else if(i){const l=Kn(t,c=>he(c));o=Of(n.serverSyncTree_,r,l)}else{const l=he(t);o=wi(n.serverSyncTree_,r,l)}let a=r;o.length>0&&(a=Ci(n,r)),Ge(n.eventQueue_,a,o)}function yo(n,e){er(n,"connected",e),e===!1&&lp(n)}function op(n,e){ye(e,(t,i)=>{er(n,t,i)})}function er(n,e,t){const i=new V("/.info/"+e),s=he(t);n.infoData_.updateSnapshot(i,s);const r=wi(n.infoSyncTree_,i,s);Ge(n.eventQueue_,i,r)}function _l(n){return n.nextWriteId_++}function ap(n,e,t,i,s){tr(n,"set",{path:e.toString(),value:t,priority:i});const r=Zs(n),o=he(t,i),a=Vs(n.serverSyncTree_,e),l=rl(o,a,r),c=_l(n),h=tl(n.serverSyncTree_,e,l,c,!0);Xs(n.eventQueue_,h),n.server_.put(e.toString(),o.val(!0),(m,E)=>{const S=m==="ok";S||ve("set at "+e+" failed: "+m);const O=ht(n.serverSyncTree_,c,!S);Ge(n.eventQueue_,e,O),hp(n,s,m,E)});const f=Il(n,e);Ci(n,f),Ge(n.eventQueue_,f,[])}function lp(n){tr(n,"onDisconnectEvents");const e=Zs(n),t=ei();os(n.onDisconnect_,U(),(s,r)=>{const o=$f(s,r,n.serverSyncTree_,e);Ha(t,s,o)});let i=[];os(t,U(),(s,r)=>{i=i.concat(wi(n.serverSyncTree_,s,r));const o=Il(n,s);Ci(n,o)}),n.onDisconnect_=ei(),Ge(n.eventQueue_,U(),i)}function cp(n,e,t){let i;D(e._path)===".info"?i=go(n.infoSyncTree_,e,t):i=go(n.serverSyncTree_,e,t),pl(n.eventQueue_,e._path,i)}function up(n,e,t){let i;D(e._path)===".info"?i=hs(n.infoSyncTree_,e,t):i=hs(n.serverSyncTree_,e,t),pl(n.eventQueue_,e._path,i)}function dp(n){n.persistentConnection_&&n.persistentConnection_.interrupt(np)}function tr(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),fe(t,...e)}function hp(n,e,t,i){e&&Qt(()=>{if(t==="ok")e(null);else{const s=(t||"error").toUpperCase();let r=s;i&&(r+=": "+i);const o=new Error(r);o.code=s,e(o)}})}function vl(n,e,t){return Vs(n.serverSyncTree_,e,t)||k.EMPTY_NODE}function nr(n,e=n.transactionQueueTree_){if(e||Ti(n,e),Jt(e)){const t=El(n,e);I(t.length>0,"Sending zero length transaction queue"),t.every(s=>s.status===0)&&fp(n,kn(e),t)}else al(e)&&bi(e,t=>{nr(n,t)})}function fp(n,e,t){const i=t.map(c=>c.currentWriteId),s=vl(n,e,i);let r=s;const o=s.hash();for(let c=0;c<t.length;c++){const h=t[c];I(h.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),h.status=1,h.retryCount++;const f=ge(e,h.path);r=r.updateChild(f,h.currentOutputSnapshotRaw)}const a=r.val(!0),l=e;n.server_.put(l.toString(),a,c=>{tr(n,"transaction put response",{path:l.toString(),status:c});let h=[];if(c==="ok"){const f=[];for(let m=0;m<t.length;m++)t[m].status=2,h=h.concat(ht(n.serverSyncTree_,t[m].currentWriteId)),t[m].onComplete&&f.push(()=>t[m].onComplete(null,!0,t[m].currentOutputSnapshotResolved)),t[m].unwatcher();Ti(n,Qs(n.transactionQueueTree_,e)),nr(n,n.transactionQueueTree_),Ge(n.eventQueue_,e,h);for(let m=0;m<f.length;m++)Qt(f[m])}else{if(c==="datastale")for(let f=0;f<t.length;f++)t[f].status===3?t[f].status=4:t[f].status=0;else{ve("transaction at "+l.toString()+" failed: "+c);for(let f=0;f<t.length;f++)t[f].status=4,t[f].abortReason=c}Ci(n,e)}},o)}function Ci(n,e){const t=yl(n,e),i=kn(t),s=El(n,t);return pp(n,s,i),i}function pp(n,e,t){if(e.length===0)return;const i=[];let s=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const l=e[a],c=ge(t,l.path);let h=!1,f;if(I(c!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),l.status===4)h=!0,f=l.abortReason,s=s.concat(ht(n.serverSyncTree_,l.currentWriteId,!0));else if(l.status===0)if(l.retryCount>=ip)h=!0,f="maxretry",s=s.concat(ht(n.serverSyncTree_,l.currentWriteId,!0));else{const m=vl(n,l.path,o);l.currentInputSnapshot=m;const E=e[a].update(m.val());if(E!==void 0){Js("transaction failed: Data returned ",E,l.path);let S=he(E);typeof E=="object"&&E!=null&&Ke(E,".priority")||(S=S.updatePriority(m.getPriority()));const j=l.currentWriteId,ne=Zs(n),ue=rl(S,m,ne);l.currentOutputSnapshotRaw=S,l.currentOutputSnapshotResolved=ue,l.currentWriteId=_l(n),o.splice(o.indexOf(j),1),s=s.concat(tl(n.serverSyncTree_,l.path,ue,l.currentWriteId,l.applyLocally)),s=s.concat(ht(n.serverSyncTree_,j,!0))}else h=!0,f="nodata",s=s.concat(ht(n.serverSyncTree_,l.currentWriteId,!0))}Ge(n.eventQueue_,t,s),s=[],h&&(e[a].status=2,function(m){setTimeout(m,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(f==="nodata"?i.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):i.push(()=>e[a].onComplete(new Error(f),!1,null))))}Ti(n,n.transactionQueueTree_);for(let a=0;a<i.length;a++)Qt(i[a]);nr(n,n.transactionQueueTree_)}function yl(n,e){let t,i=n.transactionQueueTree_;for(t=D(e);t!==null&&Jt(i)===void 0;)i=Qs(i,t),e=W(e),t=D(e);return i}function El(n,e){const t=[];return wl(n,e,t),t.sort((i,s)=>i.order-s.order),t}function wl(n,e,t){const i=Jt(e);if(i)for(let s=0;s<i.length;s++)t.push(i[s]);bi(e,s=>{wl(n,s,t)})}function Ti(n,e){const t=Jt(e);if(t){let i=0;for(let s=0;s<t.length;s++)t[s].status!==2&&(t[i]=t[s],i++);t.length=i,ol(e,t.length>0?t:void 0)}bi(e,i=>{Ti(n,i)})}function Il(n,e){const t=kn(yl(n,e)),i=Qs(n.transactionQueueTree_,e);return qf(i,s=>{Gi(n,s)}),Gi(n,i),ll(i,s=>{Gi(n,s)}),t}function Gi(n,e){const t=Jt(e);if(t){const i=[];let s=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(I(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(I(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),s=s.concat(ht(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&i.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?ol(e,void 0):t.length=r+1,Ge(n.eventQueue_,kn(e),s);for(let o=0;o<i.length;o++)Qt(i[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mp(n){let e="";const t=n.split("/");for(let i=0;i<t.length;i++)if(t[i].length>0){let s=t[i];try{s=decodeURIComponent(s.replace(/\+/g," "))}catch{}e+="/"+s}return e}function gp(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const i=t.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):ve(`Invalid query segment '${t}' in query '${n}'`)}return e}const Eo=function(n,e){const t=_p(n),i=t.namespace;t.domain==="firebase.com"&&$e(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&t.domain!=="localhost"&&$e("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||Rd();const s=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new Ia(t.host,t.secure,i,s,e,"",i!==t.subdomain),path:new V(t.pathString)}},_p=function(n){let e="",t="",i="",s="",r="",o=!0,a="https",l=443;if(typeof n=="string"){let c=n.indexOf("//");c>=0&&(a=n.substring(0,c-1),n=n.substring(c+2));let h=n.indexOf("/");h===-1&&(h=n.length);let f=n.indexOf("?");f===-1&&(f=n.length),e=n.substring(0,Math.min(h,f)),h<f&&(s=mp(n.substring(h,f)));const m=gp(n.substring(Math.min(n.length,f)));c=e.indexOf(":"),c>=0?(o=a==="https"||a==="wss",l=parseInt(e.substring(c+1),10)):c=e.length;const E=e.slice(0,c);if(E.toLowerCase()==="localhost")t="localhost";else if(E.split(".").length<=2)t=E;else{const S=e.indexOf(".");i=e.substring(0,S).toLowerCase(),t=e.substring(S+1),r=i}"ns"in m&&(r=m.ns)}return{host:e,port:l,domain:t,subdomain:i,secure:o,scheme:a,pathString:s,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wo="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz",vp=function(){let n=0;const e=[];return function(t){const i=t===n;n=t;let s;const r=new Array(8);for(s=7;s>=0;s--)r[s]=wo.charAt(t%64),t=Math.floor(t/64);I(t===0,"Cannot push at time == 0");let o=r.join("");if(i){for(s=11;s>=0&&e[s]===63;s--)e[s]=0;e[s]++}else for(s=0;s<12;s++)e[s]=Math.floor(Math.random()*64);for(s=0;s<12;s++)o+=wo.charAt(e[s]);return I(o.length===20,"nextPushId: Length should be 20."),o}}();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yp{constructor(e,t,i,s){this.eventType=e,this.eventRegistration=t,this.snapshot=i,this.prevName=s}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+ce(this.snapshot.exportVal())}}class Ep{constructor(e,t,i){this.eventRegistration=e,this.error=t,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wp{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return I(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir{constructor(e,t,i,s){this._repo=e,this._path=t,this._queryParams=i,this._orderByCalled=s}get key(){return F(this._path)?null:Pa(this._path)}get ref(){return new at(this._repo,this._path)}get _queryIdentifier(){const e=io(this._queryParams),t=Ss(e);return t==="{}"?"default":t}get _queryObject(){return io(this._queryParams)}isEqual(e){if(e=Ie(e),!(e instanceof ir))return!1;const t=this._repo===e._repo,i=Rs(this._path,e._path),s=this._queryIdentifier===e._queryIdentifier;return t&&i&&s}toJSON(){return this.toString()}toString(){return this._repo.toString()+fh(this._path)}}class at extends ir{constructor(e,t){super(e,t,new Ds,!1)}get parent(){const e=Oa(this._path);return e===null?null:new at(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class li{constructor(e,t,i){this._node=e,this.ref=t,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new V(e),i=In(this.ref,e);return new li(this._node.getChild(t),i,X)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,s)=>e(new li(s,In(this.ref,i),X)))}hasChild(e){const t=new V(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function ee(n,e){return n=Ie(n),n._checkNotDeleted("ref"),e!==void 0?In(n._root,e):n._root}function In(n,e){return n=Ie(n),D(n._path)===null?Xf("child","path",e):hl("child","path",e),new at(n._repo,re(n._path,e))}function Ip(n,e){n=Ie(n),fl("push",n._path),dl("push",e,n._path,!0);const t=gl(n._repo),i=vp(t),s=In(n,i),r=In(n,i);let o;return o=Promise.resolve(r),s.then=o.then.bind(o),s.catch=o.then.bind(o,void 0),s}function oe(n,e){n=Ie(n),fl("set",n._path),dl("set",e,n._path,!1);const t=new gi;return ap(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}class sr{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const i=t._queryParams.getIndex();return new yp("value",this,new li(e.snapshotNode,new at(t._repo,t._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new Ep(this,e,t):null}matches(e){return e instanceof sr?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function bp(n,e,t,i,s){const r=new wp(t,void 0),o=new sr(r);return cp(n._repo,n,o),()=>up(n._repo,n,o)}function qi(n,e,t,i){return bp(n,"value",e)}Cf(at);Rf(at);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cp="FIREBASE_DATABASE_EMULATOR_HOST",ps={};let Tp=!1;function Sp(n,e,t,i){n.repoInfo_=new Ia(e,!1,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0,t),i&&(n.authTokenProvider_=i)}function Ap(n,e,t,i,s){let r=i||n.options.databaseURL;r===void 0&&(n.options.projectId||$e("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),fe("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=Eo(r,s),a=o.repoInfo,l;typeof process<"u"&&jr&&(l=jr[Cp]),l?(r=`http://${l}?ns=${a.namespace}`,o=Eo(r,s),a=o.repoInfo):o.repoInfo.secure;const c=new Hd(n.name,n.options,e);Zf("Invalid Firebase Database URL",o),F(o.path)||$e("Database URL must point to the root of a Firebase Database (not including a child path).");const h=kp(a,n,c,new Bd(n,t));return new Rp(h,n)}function Np(n,e){const t=ps[e];(!t||t[n.key]!==n)&&$e(`Database ${e}(${n.repoInfo_}) has already been deleted.`),dp(n),delete t[n.key]}function kp(n,e,t,i){let s=ps[e.name];s||(s={},ps[e.name]=s);let r=s[n.toURLString()];return r&&$e("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new sp(n,Tp,t,i),s[n.toURLString()]=r,r}class Rp{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(rp(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new at(this._repo,U())),this._rootInternal}_delete(){return this._rootInternal!==null&&(Np(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&$e("Cannot call "+e+" on a deleted database.")}}function Pp(n=sa(),e){const t=Ts(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const i=Xc("database");i&&xp(t,...i)}return t}function xp(n,e,t,i={}){n=Ie(n),n._checkNotDeleted("useEmulator");const s=`${e}:${t}`,r=n._repoInternal;if(n._instanceStarted){if(s===n._repoInternal.repoInfo_.host&&mt(i,r.repoInfo_.emulatorOptions))return;$e("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(r.repoInfo_.nodeAdmin)i.mockUserToken&&$e('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new Hn(Hn.OWNER);else if(i.mockUserToken){const a=typeof i.mockUserToken=="string"?i.mockUserToken:Zc(i.mockUserToken,n.app.options.projectId);o=new Hn(a)}Sp(r,s,i,o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Op(n){Cd(Kt),Ht(new gt("database",(e,{instanceIdentifier:t})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return Ap(i,s,r,t)},"PUBLIC").setMultipleInstances(!0)),nt(Br,Hr,n),nt(Br,Hr,"esm2017")}We.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};We.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};Op();var Dp="firebase",Mp="11.6.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */nt(Dp,Mp,"app");function rr(n,e){var t={};for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&e.indexOf(i)<0&&(t[i]=n[i]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,i=Object.getOwnPropertySymbols(n);s<i.length;s++)e.indexOf(i[s])<0&&Object.prototype.propertyIsEnumerable.call(n,i[s])&&(t[i[s]]=n[i[s]]);return t}function bl(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Lp=bl,Cl=new Cn("auth","Firebase",bl());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ci=new bs("@firebase/auth");function Fp(n,...e){ci.logLevel<=H.WARN&&ci.warn(`Auth (${Kt}): ${n}`,...e)}function Vn(n,...e){ci.logLevel<=H.ERROR&&ci.error(`Auth (${Kt}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function De(n,...e){throw ar(n,...e)}function xe(n,...e){return ar(n,...e)}function or(n,e,t){const i=Object.assign(Object.assign({},Lp()),{[e]:t});return new Cn("auth","Firebase",i).create(e,{appName:n.name})}function pt(n){return or(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Up(n,e,t){const i=t;if(!(e instanceof i))throw i.name!==e.constructor.name&&De(n,"argument-error"),or(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function ar(n,...e){if(typeof n!="string"){const t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=n.name),n._errorFactory.create(t,...i)}return Cl.create(n,...e)}function R(n,e,...t){if(!n)throw ar(e,...t)}function He(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Vn(e),new Error(e)}function qe(n,e){n||He(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ms(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function jp(){return Io()==="http:"||Io()==="https:"}function Io(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bp(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(jp()||tu()||"connection"in navigator)?navigator.onLine:!0}function Hp(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn{constructor(e,t){this.shortDelay=e,this.longDelay=t,qe(t>e,"Short delay should be less than long delay!"),this.isMobile=ws()||Zo()}get(){return Bp()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lr(n,e){qe(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;He("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;He("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;He("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vp={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wp=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],zp=new Rn(3e4,6e4);function cr(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Xt(n,e,t,i,s={}){return Sl(n,s,async()=>{let r={},o={};i&&(e==="GET"?o=i:r={body:JSON.stringify(i)});const a=qt(Object.assign({key:n.config.apiKey},o)).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const c=Object.assign({method:e,headers:l},r);return eu()||(c.referrerPolicy="no-referrer"),Tl.fetch()(await Al(n,n.config.apiHost,t,a),c)})}async function Sl(n,e,t){n._canInitEmulator=!1;const i=Object.assign(Object.assign({},Vp),e);try{const s=new Gp(n),r=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await r.json();if("needConfirmation"in o)throw Bn(n,"account-exists-with-different-credential",o);if(r.ok&&!("errorMessage"in o))return o;{const a=r.ok?o.errorMessage:o.error.message,[l,c]=a.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Bn(n,"credential-already-in-use",o);if(l==="EMAIL_EXISTS")throw Bn(n,"email-already-in-use",o);if(l==="USER_DISABLED")throw Bn(n,"user-disabled",o);const h=i[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw or(n,h,c);De(n,h)}}catch(s){if(s instanceof ot)throw s;De(n,"network-request-failed",{message:String(s)})}}async function $p(n,e,t,i,s={}){const r=await Xt(n,e,t,i,s);return"mfaPendingCredential"in r&&De(n,"multi-factor-auth-required",{_serverResponse:r}),r}async function Al(n,e,t,i){const s=`${e}${t}?${i}`,r=n,o=r.config.emulator?lr(n.config,s):`${n.config.apiScheme}://${s}`;return Wp.includes(t)&&(await r._persistenceManagerAvailable,r._getPersistenceType()==="COOKIE")?r._getPersistence()._getFinalTarget(o).toString():o}class Gp{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(xe(this.auth,"network-request-failed")),zp.get())})}}function Bn(n,e,t){const i={appName:n.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);const s=xe(n,e,i);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qp(n,e){return Xt(n,"POST","/v1/accounts:delete",e)}async function ui(n,e){return Xt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fn(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Kp(n,e=!1){const t=Ie(n),i=await t.getIdToken(e),s=ur(i);R(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const r=typeof s.firebase=="object"?s.firebase:void 0,o=r==null?void 0:r.sign_in_provider;return{claims:s,token:i,authTime:fn(Ki(s.auth_time)),issuedAtTime:fn(Ki(s.iat)),expirationTime:fn(Ki(s.exp)),signInProvider:o||null,signInSecondFactor:(r==null?void 0:r.sign_in_second_factor)||null}}function Ki(n){return Number(n)*1e3}function ur(n){const[e,t,i]=n.split(".");if(e===void 0||t===void 0||i===void 0)return Vn("JWT malformed, contained fewer than 3 sections"),null;try{const s=qn(t);return s?JSON.parse(s):(Vn("Failed to decode base64 JWT payload"),null)}catch(s){return Vn("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function bo(n){const e=ur(n);return R(e,"internal-error"),R(typeof e.exp<"u","internal-error"),R(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bn(n,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof ot&&Yp(i)&&n.auth.currentUser===n&&await n.auth.signOut(),i}}function Yp({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const s=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=fn(this.lastLoginAt),this.creationTime=fn(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function di(n){var e;const t=n.auth,i=await n.getIdToken(),s=await bn(n,ui(t,{idToken:i}));R(s==null?void 0:s.users.length,t,"internal-error");const r=s.users[0];n._notifyReloadListener(r);const o=!((e=r.providerUserInfo)===null||e===void 0)&&e.length?Nl(r.providerUserInfo):[],a=Xp(n.providerData,o),l=n.isAnonymous,c=!(n.email&&r.passwordHash)&&!(a!=null&&a.length),h=l?c:!1,f={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:a,metadata:new gs(r.createdAt,r.lastLoginAt),isAnonymous:h};Object.assign(n,f)}async function Jp(n){const e=Ie(n);await di(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Xp(n,e){return[...n.filter(i=>!e.some(s=>s.providerId===i.providerId)),...e]}function Nl(n){return n.map(e=>{var{providerId:t}=e,i=rr(e,["providerId"]);return{providerId:t,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zp(n,e){const t=await Sl(n,{},async()=>{const i=qt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:r}=n.config,o=await Al(n,s,"/v1/token",`key=${r}`),a=await n._getAdditionalHeaders();return a["Content-Type"]="application/x-www-form-urlencoded",Tl.fetch()(o,{method:"POST",headers:a,body:i})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function em(n,e){return Xt(n,"POST","/v2/accounts:revokeToken",cr(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){R(e.idToken,"internal-error"),R(typeof e.idToken<"u","internal-error"),R(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):bo(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){R(e.length!==0,"internal-error");const t=bo(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(R(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:i,refreshToken:s,expiresIn:r}=await Zp(e,t);this.updateTokensAndExpiration(i,s,Number(r))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){const{refreshToken:i,accessToken:s,expirationTime:r}=t,o=new Ft;return i&&(R(typeof i=="string","internal-error",{appName:e}),o.refreshToken=i),s&&(R(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),r&&(R(typeof r=="number","internal-error",{appName:e}),o.expirationTime=r),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ft,this.toJSON())}_performRefresh(){return He("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(n,e){R(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Re{constructor(e){var{uid:t,auth:i,stsTokenManager:s}=e,r=rr(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Qp(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=i,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new gs(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await bn(this,this.stsTokenManager.getToken(this.auth,e));return R(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Kp(this,e)}reload(){return Jp(this)}_assign(e){this!==e&&(R(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Re(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){R(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await di(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Se(this.auth.app))return Promise.reject(pt(this.auth));const e=await this.getIdToken();return await bn(this,qp(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var i,s,r,o,a,l,c,h;const f=(i=t.displayName)!==null&&i!==void 0?i:void 0,m=(s=t.email)!==null&&s!==void 0?s:void 0,E=(r=t.phoneNumber)!==null&&r!==void 0?r:void 0,S=(o=t.photoURL)!==null&&o!==void 0?o:void 0,O=(a=t.tenantId)!==null&&a!==void 0?a:void 0,j=(l=t._redirectEventId)!==null&&l!==void 0?l:void 0,ne=(c=t.createdAt)!==null&&c!==void 0?c:void 0,ue=(h=t.lastLoginAt)!==null&&h!==void 0?h:void 0,{uid:ie,emailVerified:me,isAnonymous:Ee,providerData:Me,stsTokenManager:be}=t;R(ie&&be,e,"internal-error");const On=Ft.fromJSON(this.name,be);R(typeof ie=="string",e,"internal-error"),Qe(f,e.name),Qe(m,e.name),R(typeof me=="boolean",e,"internal-error"),R(typeof Ee=="boolean",e,"internal-error"),Qe(E,e.name),Qe(S,e.name),Qe(O,e.name),Qe(j,e.name),Qe(ne,e.name),Qe(ue,e.name);const z=new Re({uid:ie,auth:e,email:m,emailVerified:me,displayName:f,isAnonymous:Ee,photoURL:S,phoneNumber:E,tenantId:O,stsTokenManager:On,createdAt:ne,lastLoginAt:ue});return Me&&Array.isArray(Me)&&(z.providerData=Me.map(x=>Object.assign({},x))),j&&(z._redirectEventId=j),z}static async _fromIdTokenResponse(e,t,i=!1){const s=new Ft;s.updateFromServerResponse(t);const r=new Re({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:i});return await di(r),r}static async _fromGetAccountInfoResponse(e,t,i){const s=t.users[0];R(s.localId!==void 0,"internal-error");const r=s.providerUserInfo!==void 0?Nl(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(r!=null&&r.length),a=new Ft;a.updateFromIdToken(i);const l=new Re({uid:s.localId,auth:e,stsTokenManager:a,isAnonymous:o}),c={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:r,metadata:new gs(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(r!=null&&r.length)};return Object.assign(l,c),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Co=new Map;function Ve(n){qe(n instanceof Function,"Expected a class definition");let e=Co.get(n);return e?(qe(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Co.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kl{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}kl.type="NONE";const To=kl;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wn(n,e,t){return`firebase:${n}:${e}:${t}`}class Ut{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;const{config:s,name:r}=this.auth;this.fullUserKey=Wn(this.userKey,s.apiKey,r),this.fullPersistenceKey=Wn("persistence",s.apiKey,r),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await ui(this.auth,{idToken:e}).catch(()=>{});return t?Re._fromGetAccountInfoResponse(this.auth,t,e):null}return Re._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new Ut(Ve(To),e,i);const s=(await Promise.all(t.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let r=s[0]||Ve(To);const o=Wn(i,e.config.apiKey,e.name);let a=null;for(const c of t)try{const h=await c._get(o);if(h){let f;if(typeof h=="string"){const m=await ui(e,{idToken:h}).catch(()=>{});if(!m)break;f=await Re._fromGetAccountInfoResponse(e,m,h)}else f=Re._fromJSON(e,h);c!==r&&(a=f),r=c;break}}catch{}const l=s.filter(c=>c._shouldAllowMigration);return!r._shouldAllowMigration||!l.length?new Ut(r,e,i):(r=l[0],a&&await r._set(o,a.toJSON()),await Promise.all(t.map(async c=>{if(c!==r)try{await c._remove(o)}catch{}})),new Ut(r,e,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function So(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Ol(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Rl(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ml(e))return"Blackberry";if(Ll(e))return"Webos";if(Pl(e))return"Safari";if((e.includes("chrome/")||xl(e))&&!e.includes("edge/"))return"Chrome";if(Dl(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=n.match(t);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function Rl(n=pe()){return/firefox\//i.test(n)}function Pl(n=pe()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function xl(n=pe()){return/crios\//i.test(n)}function Ol(n=pe()){return/iemobile/i.test(n)}function Dl(n=pe()){return/android/i.test(n)}function Ml(n=pe()){return/blackberry/i.test(n)}function Ll(n=pe()){return/webos/i.test(n)}function dr(n=pe()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function tm(n=pe()){var e;return dr(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function nm(){return nu()&&document.documentMode===10}function Fl(n=pe()){return dr(n)||Dl(n)||Ll(n)||Ml(n)||/windows phone/i.test(n)||Ol(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ul(n,e=[]){let t;switch(n){case"Browser":t=So(pe());break;case"Worker":t=`${So(pe())}-${n}`;break;default:t=n}const i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Kt}/${i}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class im{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const i=r=>new Promise((o,a)=>{try{const l=e(r);o(l)}catch(l){a(l)}});i.onAbort=t,this.queue.push(i);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sm(n,e={}){return Xt(n,"GET","/v2/passwordPolicy",cr(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rm=6;class om{constructor(e){var t,i,s,r;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:rm,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(i=e.allowedNonAlphanumericCharacters)===null||i===void 0?void 0:i.join(""))!==null&&s!==void 0?s:"",this.forceUpgradeOnSignin=(r=e.forceUpgradeOnSignin)!==null&&r!==void 0?r:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,i,s,r,o,a;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,l),this.validatePasswordCharacterOptions(e,l),l.isValid&&(l.isValid=(t=l.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),l.isValid&&(l.isValid=(i=l.meetsMaxPasswordLength)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(s=l.containsLowercaseLetter)!==null&&s!==void 0?s:!0),l.isValid&&(l.isValid=(r=l.containsUppercaseLetter)!==null&&r!==void 0?r:!0),l.isValid&&(l.isValid=(o=l.containsNumericCharacter)!==null&&o!==void 0?o:!0),l.isValid&&(l.isValid=(a=l.containsNonAlphanumericCharacter)!==null&&a!==void 0?a:!0),l}validatePasswordLengthOptions(e,t){const i=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let s=0;s<e.length;s++)i=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,s,r){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class am{constructor(e,t,i,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ao(this),this.idTokenSubscription=new Ao(this),this.beforeStateQueue=new im(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Cl,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(r=>this._resolvePersistenceManagerAvailable=r)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ve(t)),this._initializationPromise=this.queue(async()=>{var i,s,r;if(!this._deleted&&(this.persistenceManager=await Ut.create(this,e),(i=this._resolvePersistenceManagerAvailable)===null||i===void 0||i.call(this),!this._deleted)){if(!((s=this._popupRedirectResolver)===null||s===void 0)&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((r=this.currentUser)===null||r===void 0?void 0:r.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await ui(this,{idToken:e}),i=await Re._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Se(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const i=await this.assertedPersistence.getCurrentUser();let s=i,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,a=s==null?void 0:s._redirectEventId,l=await this.tryRedirectSignIn(e);(!o||o===a)&&(l!=null&&l.user)&&(s=l.user,r=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(s)}catch(o){s=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return R(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await di(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Hp()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Se(this.app))return Promise.reject(pt(this));const t=e?Ie(e):null;return t&&R(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&R(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Se(this.app)?Promise.reject(pt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Se(this.app)?Promise.reject(pt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ve(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await sm(this),t=new om(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Cn("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await em(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Ve(e)||this._popupRedirectResolver;R(t,this,"argument-error"),this.redirectPersistenceManager=await Ut.create(this,[Ve(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,s){if(this._deleted)return()=>{};const r=typeof t=="function"?t:t.next.bind(t);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(R(a,this,"internal-error"),a.then(()=>{o||r(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,i,s);return()=>{o=!0,l()}}else{const l=e.addObserver(t);return()=>{o=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return R(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ul(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const i=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());i&&(t["X-Firebase-Client"]=i);const s=await this._getAppCheckToken();return s&&(t["X-Firebase-AppCheck"]=s),t}async _getAppCheckToken(){var e;if(Se(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&Fp(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Si(n){return Ie(n)}class Ao{constructor(e){this.auth=e,this.observer=null,this.addObserver=hu(t=>this.observer=t)}get next(){return R(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let hr={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function lm(n){hr=n}function cm(n){return hr.loadJS(n)}function um(){return hr.gapiScript}function dm(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hm(n,e){const t=Ts(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),r=t.getOptions();if(mt(r,e??{}))return s;De(s,"already-initialized")}return t.initialize({options:e})}function fm(n,e){const t=(e==null?void 0:e.persistence)||[],i=(Array.isArray(t)?t:[t]).map(Ve);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function pm(n,e,t){const i=Si(n);R(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const s=!1,r=jl(e),{host:o,port:a}=mm(e),l=a===null?"":`:${a}`,c={url:`${r}//${o}${l}/`},h=Object.freeze({host:o,port:a,protocol:r.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!i._canInitEmulator){R(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),R(mt(c,i.config.emulator)&&mt(h,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=c,i.emulatorConfig=h,i.settings.appVerificationDisabledForTesting=!0,gm()}function jl(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function mm(n){const e=jl(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const i=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(i);if(s){const r=s[1];return{host:r,port:No(i.substr(r.length+1))}}else{const[r,o]=i.split(":");return{host:r,port:No(o)}}}function No(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function gm(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return He("not implemented")}_getIdTokenResponse(e){return He("not implemented")}_linkToIdToken(e,t){return He("not implemented")}_getReauthenticationResolver(e){return He("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jt(n,e){return $p(n,"POST","/v1/accounts:signInWithIdp",cr(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _m="http://localhost";class wt extends Bl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new wt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):De("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:s}=t,r=rr(t,["providerId","signInMethod"]);if(!i||!s)return null;const o=new wt(i,s);return o.idToken=r.idToken||void 0,o.accessToken=r.accessToken||void 0,o.secret=r.secret,o.nonce=r.nonce,o.pendingToken=r.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return jt(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,jt(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,jt(e,t)}buildRequest(){const e={requestUri:_m,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=qt(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn extends fr{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je extends Pn{constructor(){super("facebook.com")}static credential(e){return wt._fromParams({providerId:Je.PROVIDER_ID,signInMethod:Je.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Je.credentialFromTaggedObject(e)}static credentialFromError(e){return Je.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Je.credential(e.oauthAccessToken)}catch{return null}}}Je.FACEBOOK_SIGN_IN_METHOD="facebook.com";Je.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je extends Pn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return wt._fromParams({providerId:je.PROVIDER_ID,signInMethod:je.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return je.credentialFromTaggedObject(e)}static credentialFromError(e){return je.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return je.credential(t,i)}catch{return null}}}je.GOOGLE_SIGN_IN_METHOD="google.com";je.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe extends Pn{constructor(){super("github.com")}static credential(e){return wt._fromParams({providerId:Xe.PROVIDER_ID,signInMethod:Xe.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Xe.credentialFromTaggedObject(e)}static credentialFromError(e){return Xe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Xe.credential(e.oauthAccessToken)}catch{return null}}}Xe.GITHUB_SIGN_IN_METHOD="github.com";Xe.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze extends Pn{constructor(){super("twitter.com")}static credential(e,t){return wt._fromParams({providerId:Ze.PROVIDER_ID,signInMethod:Ze.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ze.credentialFromTaggedObject(e)}static credentialFromError(e){return Ze.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return Ze.credential(t,i)}catch{return null}}}Ze.TWITTER_SIGN_IN_METHOD="twitter.com";Ze.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,s=!1){const r=await Re._fromIdTokenResponse(e,i,s),o=ko(i);return new $t({user:r,providerId:o,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);const s=ko(i);return new $t({user:e,providerId:s,_tokenResponse:i,operationType:t})}}function ko(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hi extends ot{constructor(e,t,i,s){var r;super(t.code,t.message),this.operationType=i,this.user=s,Object.setPrototypeOf(this,hi.prototype),this.customData={appName:e.name,tenantId:(r=e.tenantId)!==null&&r!==void 0?r:void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,s){return new hi(e,t,i,s)}}function Hl(n,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(r=>{throw r.code==="auth/multi-factor-auth-required"?hi._fromErrorAndOperation(n,r,e,i):r})}async function vm(n,e,t=!1){const i=await bn(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return $t._forOperation(n,"link",i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ym(n,e,t=!1){const{auth:i}=n;if(Se(i.app))return Promise.reject(pt(i));const s="reauthenticate";try{const r=await bn(n,Hl(i,s,e,n),t);R(r.idToken,i,"internal-error");const o=ur(r.idToken);R(o,i,"internal-error");const{sub:a}=o;return R(n.uid===a,i,"user-mismatch"),$t._forOperation(n,s,r)}catch(r){throw(r==null?void 0:r.code)==="auth/user-not-found"&&De(i,"user-mismatch"),r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Em(n,e,t=!1){if(Se(n.app))return Promise.reject(pt(n));const i="signIn",s=await Hl(n,i,e),r=await $t._fromIdTokenResponse(n,i,s);return t||await n._updateCurrentUser(r.user),r}function wm(n,e,t,i){return Ie(n).onIdTokenChanged(e,t,i)}function Im(n,e,t){return Ie(n).beforeAuthStateChanged(e,t)}function Ro(n,e,t,i){return Ie(n).onAuthStateChanged(e,t,i)}const fi="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vl{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(fi,"1"),this.storage.removeItem(fi),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bm=1e3,Cm=10;class Wl extends Vl{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Fl(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const i=this.storage.getItem(t),s=this.localCache[t];i!==s&&e(t,s,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,l)=>{this.notifyListeners(o,l)});return}const i=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(i);!t&&this.localCache[i]===o||this.notifyListeners(i,o)},r=this.storage.getItem(i);nm()&&r!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Cm):s()}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const s of Array.from(i))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},bm)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Wl.type="LOCAL";const Tm=Wl;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zl extends Vl{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}zl.type="SESSION";const $l=zl;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sm(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ai{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const i=new Ai(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:i,eventType:s,data:r}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:s});const a=Array.from(o).map(async c=>c(t.origin,r)),l=await Sm(a);t.ports[0].postMessage({status:"done",eventId:i,eventType:s,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ai.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pr(n="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Am{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let r,o;return new Promise((a,l)=>{const c=pr("",20);s.port1.start();const h=setTimeout(()=>{l(new Error("unsupported_event"))},i);o={messageChannel:s,onMessage(f){const m=f;if(m.data.eventId===c)switch(m.data.status){case"ack":clearTimeout(h),r=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(r),a(m.data.response);break;default:clearTimeout(h),clearTimeout(r),l(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oe(){return window}function Nm(n){Oe().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gl(){return typeof Oe().WorkerGlobalScope<"u"&&typeof Oe().importScripts=="function"}async function km(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Rm(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Pm(){return Gl()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ql="firebaseLocalStorageDb",xm=1,pi="firebaseLocalStorage",Kl="fbase_key";class xn{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ni(n,e){return n.transaction([pi],e?"readwrite":"readonly").objectStore(pi)}function Om(){const n=indexedDB.deleteDatabase(ql);return new xn(n).toPromise()}function _s(){const n=indexedDB.open(ql,xm);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const i=n.result;try{i.createObjectStore(pi,{keyPath:Kl})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const i=n.result;i.objectStoreNames.contains(pi)?e(i):(i.close(),await Om(),e(await _s()))})})}async function Po(n,e,t){const i=Ni(n,!0).put({[Kl]:e,value:t});return new xn(i).toPromise()}async function Dm(n,e){const t=Ni(n,!1).get(e),i=await new xn(t).toPromise();return i===void 0?null:i.value}function xo(n,e){const t=Ni(n,!0).delete(e);return new xn(t).toPromise()}const Mm=800,Lm=3;class Yl{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await _s(),this.db)}async _withRetries(e){let t=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(t++>Lm)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Gl()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ai._getInstance(Pm()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await km(),!this.activeServiceWorker)return;this.sender=new Am(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);i&&!((e=i[0])===null||e===void 0)&&e.fulfilled&&!((t=i[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Rm()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await _s();return await Po(e,fi,"1"),await xo(e,fi),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>Po(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(i=>Dm(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>xo(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const r=Ni(s,!1).getAll();return new xn(r).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],i=new Set;if(e.length!==0)for(const{fbase_key:s,value:r}of e)i.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(r)&&(this.notifyListeners(s,r),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!i.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const s of Array.from(i))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Mm)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Yl.type="LOCAL";const Fm=Yl;new Rn(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ql(n,e){return e?Ve(e):(R(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr extends Bl{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return jt(e,this._buildIdpRequest())}_linkToIdToken(e,t){return jt(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return jt(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Um(n){return Em(n.auth,new mr(n),n.bypassAuthState)}function jm(n){const{auth:e,user:t}=n;return R(t,e,"internal-error"),ym(t,new mr(n),n.bypassAuthState)}async function Bm(n){const{auth:e,user:t}=n;return R(t,e,"internal-error"),vm(t,new mr(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jl{constructor(e,t,i,s,r=!1){this.auth=e,this.resolver=i,this.user=s,this.bypassAuthState=r,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:i,postBody:s,tenantId:r,error:o,type:a}=e;if(o){this.reject(o);return}const l={auth:this.auth,requestUri:t,sessionId:i,tenantId:r||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(l))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Um;case"linkViaPopup":case"linkViaRedirect":return Bm;case"reauthViaPopup":case"reauthViaRedirect":return jm;default:De(this.auth,"internal-error")}}resolve(e){qe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){qe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hm=new Rn(2e3,1e4);async function Vm(n,e,t){if(Se(n.app))return Promise.reject(xe(n,"operation-not-supported-in-this-environment"));const i=Si(n);Up(n,e,fr);const s=Ql(i,t);return new ft(i,"signInViaPopup",e,s).executeNotNull()}class ft extends Jl{constructor(e,t,i,s,r){super(e,t,s,r),this.provider=i,this.authWindow=null,this.pollId=null,ft.currentPopupAction&&ft.currentPopupAction.cancel(),ft.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return R(e,this.auth,"internal-error"),e}async onExecution(){qe(this.filter.length===1,"Popup operations only handle one event");const e=pr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(xe(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(xe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ft.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,i;if(!((i=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(xe(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Hm.get())};e()}}ft.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wm="pendingRedirect",zn=new Map;class zm extends Jl{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=zn.get(this.auth._key());if(!e){try{const i=await $m(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}zn.set(this.auth._key(),e)}return this.bypassAuthState||zn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function $m(n,e){const t=Km(e),i=qm(n);if(!await i._isAvailable())return!1;const s=await i._get(t)==="true";return await i._remove(t),s}function Gm(n,e){zn.set(n._key(),e)}function qm(n){return Ve(n._redirectPersistence)}function Km(n){return Wn(Wm,n.config.apiKey,n.name)}async function Ym(n,e,t=!1){if(Se(n.app))return Promise.reject(pt(n));const i=Si(n),s=Ql(i,e),o=await new zm(i,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qm=10*60*1e3;class Jm{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Xm(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!Xl(e)){const s=((i=e.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";t.onError(xe(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Qm&&this.cachedEventUids.clear(),this.cachedEventUids.has(Oo(e))}saveEventToCache(e){this.cachedEventUids.add(Oo(e)),this.lastProcessedEventTime=Date.now()}}function Oo(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Xl({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Xm(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Xl(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zm(n,e={}){return Xt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eg=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,tg=/^https?/;async function ng(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Zm(n);for(const t of e)try{if(ig(t))return}catch{}De(n,"unauthorized-domain")}function ig(n){const e=ms(),{protocol:t,hostname:i}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&i===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===i}if(!tg.test(t))return!1;if(eg.test(n))return i===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(i)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sg=new Rn(3e4,6e4);function Do(){const n=Oe().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function rg(n){return new Promise((e,t)=>{var i,s,r;function o(){Do(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Do(),t(xe(n,"network-request-failed"))},timeout:sg.get()})}if(!((s=(i=Oe().gapi)===null||i===void 0?void 0:i.iframes)===null||s===void 0)&&s.Iframe)e(gapi.iframes.getContext());else if(!((r=Oe().gapi)===null||r===void 0)&&r.load)o();else{const a=dm("iframefcb");return Oe()[a]=()=>{gapi.load?o():t(xe(n,"network-request-failed"))},cm(`${um()}?onload=${a}`).catch(l=>t(l))}}).catch(e=>{throw $n=null,e})}let $n=null;function og(n){return $n=$n||rg(n),$n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ag=new Rn(5e3,15e3),lg="__/auth/iframe",cg="emulator/auth/iframe",ug={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},dg=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function hg(n){const e=n.config;R(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?lr(e,cg):`https://${n.config.authDomain}/${lg}`,i={apiKey:e.apiKey,appName:n.name,v:Kt},s=dg.get(n.config.apiHost);s&&(i.eid=s);const r=n._getFrameworks();return r.length&&(i.fw=r.join(",")),`${t}?${qt(i).slice(1)}`}async function fg(n){const e=await og(n),t=Oe().gapi;return R(t,n,"internal-error"),e.open({where:document.body,url:hg(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:ug,dontclear:!0},i=>new Promise(async(s,r)=>{await i.restyle({setHideOnLeave:!1});const o=xe(n,"network-request-failed"),a=Oe().setTimeout(()=>{r(o)},ag.get());function l(){Oe().clearTimeout(a),s(i)}i.ping(l).then(l,()=>{r(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pg={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},mg=500,gg=600,_g="_blank",vg="http://localhost";class Mo{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function yg(n,e,t,i=mg,s=gg){const r=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString();let a="";const l=Object.assign(Object.assign({},pg),{width:i.toString(),height:s.toString(),top:r,left:o}),c=pe().toLowerCase();t&&(a=xl(c)?_g:t),Rl(c)&&(e=e||vg,l.scrollbars="yes");const h=Object.entries(l).reduce((m,[E,S])=>`${m}${E}=${S},`,"");if(tm(c)&&a!=="_self")return Eg(e||"",a),new Mo(null);const f=window.open(e||"",a,h);R(f,n,"popup-blocked");try{f.focus()}catch{}return new Mo(f)}function Eg(n,e){const t=document.createElement("a");t.href=n,t.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wg="__/auth/handler",Ig="emulator/auth/handler",bg=encodeURIComponent("fac");async function Lo(n,e,t,i,s,r){R(n.config.authDomain,n,"auth-domain-config-required"),R(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:i,v:Kt,eventId:s};if(e instanceof fr){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Ji(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,f]of Object.entries({}))o[h]=f}if(e instanceof Pn){const h=e.getScopes().filter(f=>f!=="");h.length>0&&(o.scopes=h.join(","))}n.tenantId&&(o.tid=n.tenantId);const a=o;for(const h of Object.keys(a))a[h]===void 0&&delete a[h];const l=await n._getAppCheckToken(),c=l?`#${bg}=${encodeURIComponent(l)}`:"";return`${Cg(n)}?${qt(a).slice(1)}${c}`}function Cg({config:n}){return n.emulator?lr(n,Ig):`https://${n.authDomain}/${wg}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yi="webStorageSupport";class Tg{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=$l,this._completeRedirectFn=Ym,this._overrideRedirectResult=Gm}async _openPopup(e,t,i,s){var r;qe((r=this.eventManagers[e._key()])===null||r===void 0?void 0:r.manager,"_initialize() not called before _openPopup()");const o=await Lo(e,t,i,ms(),s);return yg(e,o,pr())}async _openRedirect(e,t,i,s){await this._originValidation(e);const r=await Lo(e,t,i,ms(),s);return Nm(r),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:r}=this.eventManagers[t];return s?Promise.resolve(s):(qe(r,"If manager is not set, promise should be"),r)}const i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){const t=await fg(e),i=new Jm(e);return t.register("authEvent",s=>(R(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:i.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Yi,{type:Yi},s=>{var r;const o=(r=s==null?void 0:s[0])===null||r===void 0?void 0:r[Yi];o!==void 0&&t(!!o),De(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=ng(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Fl()||Pl()||dr()}}const Sg=Tg;var Fo="@firebase/auth",Uo="1.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ag{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){R(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ng(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function kg(n){Ht(new gt("auth",(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),r=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=i.options;R(o&&!o.includes(":"),"invalid-api-key",{appName:i.name});const l={apiKey:o,authDomain:a,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ul(n)},c=new am(i,s,r,l);return fm(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),Ht(new gt("auth-internal",e=>{const t=Si(e.getProvider("auth").getImmediate());return(i=>new Ag(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),nt(Fo,Uo,Ng(n)),nt(Fo,Uo,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rg=5*60,Pg=Xo("authIdTokenMaxAge")||Rg;let jo=null;const xg=n=>async e=>{const t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>Pg)return;const s=t==null?void 0:t.token;jo!==s&&(jo=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Og(n=sa()){const e=Ts(n,"auth");if(e.isInitialized())return e.getImmediate();const t=hm(n,{popupRedirectResolver:Sg,persistence:[Fm,Tm,$l]}),i=Xo("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const r=new URL(i,location.origin);if(location.origin===r.origin){const o=xg(r.toString());Im(t,o,()=>o(t.currentUser)),wm(t,a=>o(a))}}const s=Qo("auth");return s&&pm(t,`http://${s}`),t}function Dg(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}lm({loadJS(n){return new Promise((e,t)=>{const i=document.createElement("script");i.setAttribute("src",n),i.onload=e,i.onerror=s=>{const r=xe("internal-error");r.customData=s,t(r)},i.type="text/javascript",i.charset="UTF-8",Dg().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});kg("Browser");const Mg={apiKey:"AIzaSyBFB_-a5O4KD1V0MSa4HYpsEMekpBTL044",authDomain:"cummap-7afee.firebaseapp.com",databaseURL:"https://cummap-7afee-default-rtdb.europe-west1.firebasedatabase.app",projectId:"cummap-7afee",storageBucket:"cummap-7afee.firebasestorage.app",messagingSenderId:"402641775282",appId:"1:402641775282:web:585cabb0a67ae4475937ab"},Zl=ia(Mg),an=Og(Zl),vs=new je,te=Pp(Zl);var ec={},tc={},nc={};(function(n){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e=function(){for(var s=arguments.length,r=new Array(s),o=0;o<s;o++)r[o]=arguments[o];if(typeof window<"u"){var a;typeof window.gtag>"u"&&(window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)}),(a=window).gtag.apply(a,r)}},t=e;n.default=t})(nc);var ic={};(function(n){Object.defineProperty(n,"__esModule",{value:!0}),n.default=o;var e=/^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;function t(a){return a.toString().trim().replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g,function(l,c,h){return c>0&&c+l.length!==h.length&&l.search(e)>-1&&h.charAt(c-2)!==":"&&(h.charAt(c+l.length)!=="-"||h.charAt(c-1)==="-")&&h.charAt(c-1).search(/[^\s-]/)<0?l.toLowerCase():l.substr(1).search(/[A-Z]|\../)>-1?l:l.charAt(0).toUpperCase()+l.substr(1)})}function i(a){return typeof a=="string"&&a.indexOf("@")!==-1}var s="REDACTED (Potential Email Address)";function r(a){return i(a)?(console.warn("This arg looks like an email address, redacting."),s):a}function o(){var a=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"",l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0,c=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0,h=a||"";return l&&(h=t(a)),c&&(h=r(h)),h}})(ic);(function(n){Object.defineProperty(n,"__esModule",{value:!0}),n.default=n.GA4=void 0;var e=o(nc),t=o(ic),i=["eventCategory","eventAction","eventLabel","eventValue","hitType"],s=["title","location"],r=["page","hitType"];function o(y){return y&&y.__esModule?y:{default:y}}function a(y,g){if(y==null)return{};var _=l(y,g),v,T;if(Object.getOwnPropertySymbols){var A=Object.getOwnPropertySymbols(y);for(T=0;T<A.length;T++)v=A[T],!(g.indexOf(v)>=0)&&Object.prototype.propertyIsEnumerable.call(y,v)&&(_[v]=y[v])}return _}function l(y,g){if(y==null)return{};var _={},v=Object.keys(y),T,A;for(A=0;A<v.length;A++)T=v[A],!(g.indexOf(T)>=0)&&(_[T]=y[T]);return _}function c(y){"@babel/helpers - typeof";return c=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(g){return typeof g}:function(g){return g&&typeof Symbol=="function"&&g.constructor===Symbol&&g!==Symbol.prototype?"symbol":typeof g},c(y)}function h(y){return E(y)||m(y)||ue(y)||f()}function f(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function m(y){if(typeof Symbol<"u"&&y[Symbol.iterator]!=null||y["@@iterator"]!=null)return Array.from(y)}function E(y){if(Array.isArray(y))return ie(y)}function S(y,g){var _=Object.keys(y);if(Object.getOwnPropertySymbols){var v=Object.getOwnPropertySymbols(y);g&&(v=v.filter(function(T){return Object.getOwnPropertyDescriptor(y,T).enumerable})),_.push.apply(_,v)}return _}function O(y){for(var g=1;g<arguments.length;g++){var _=arguments[g]!=null?arguments[g]:{};g%2?S(Object(_),!0).forEach(function(v){z(y,v,_[v])}):Object.getOwnPropertyDescriptors?Object.defineProperties(y,Object.getOwnPropertyDescriptors(_)):S(Object(_)).forEach(function(v){Object.defineProperty(y,v,Object.getOwnPropertyDescriptor(_,v))})}return y}function j(y,g){return Ee(y)||me(y,g)||ue(y,g)||ne()}function ne(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ue(y,g){if(y){if(typeof y=="string")return ie(y,g);var _=Object.prototype.toString.call(y).slice(8,-1);if(_==="Object"&&y.constructor&&(_=y.constructor.name),_==="Map"||_==="Set")return Array.from(y);if(_==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(_))return ie(y,g)}}function ie(y,g){(g==null||g>y.length)&&(g=y.length);for(var _=0,v=new Array(g);_<g;_++)v[_]=y[_];return v}function me(y,g){var _=y==null?null:typeof Symbol<"u"&&y[Symbol.iterator]||y["@@iterator"];if(_!=null){var v,T,A,$,K=[],Y=!0,se=!1;try{if(A=(_=_.call(y)).next,g!==0)for(;!(Y=(v=A.call(_)).done)&&(K.push(v.value),K.length!==g);Y=!0);}catch(Z){se=!0,T=Z}finally{try{if(!Y&&_.return!=null&&($=_.return(),Object($)!==$))return}finally{if(se)throw T}}return K}}function Ee(y){if(Array.isArray(y))return y}function Me(y,g){if(!(y instanceof g))throw new TypeError("Cannot call a class as a function")}function be(y,g){for(var _=0;_<g.length;_++){var v=g[_];v.enumerable=v.enumerable||!1,v.configurable=!0,"value"in v&&(v.writable=!0),Object.defineProperty(y,x(v.key),v)}}function On(y,g,_){return g&&be(y.prototype,g),Object.defineProperty(y,"prototype",{writable:!1}),y}function z(y,g,_){return g=x(g),g in y?Object.defineProperty(y,g,{value:_,enumerable:!0,configurable:!0,writable:!0}):y[g]=_,y}function x(y){var g=Le(y,"string");return c(g)==="symbol"?g:String(g)}function Le(y,g){if(c(y)!=="object"||y===null)return y;var _=y[Symbol.toPrimitive];if(_!==void 0){var v=_.call(y,g);if(c(v)!=="object")return v;throw new TypeError("@@toPrimitive must return a primitive value.")}return(g==="string"?String:Number)(y)}var q=function(){function y(){var g=this;Me(this,y),z(this,"reset",function(){g.isInitialized=!1,g._testMode=!1,g._currentMeasurementId,g._hasLoadedGA=!1,g._isQueuing=!1,g._queueGtag=[]}),z(this,"_gtag",function(){for(var _=arguments.length,v=new Array(_),T=0;T<_;T++)v[T]=arguments[T];g._testMode||g._isQueuing?g._queueGtag.push(v):e.default.apply(void 0,v)}),z(this,"_loadGA",function(_,v){var T=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"https://www.googletagmanager.com/gtag/js";if(!(typeof window>"u"||typeof document>"u")&&!g._hasLoadedGA){var A=document.createElement("script");A.async=!0,A.src="".concat(T,"?id=").concat(_),v&&A.setAttribute("nonce",v),document.body.appendChild(A),window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)},g._hasLoadedGA=!0}}),z(this,"_toGtagOptions",function(_){if(_){var v={cookieUpdate:"cookie_update",cookieExpires:"cookie_expires",cookieDomain:"cookie_domain",cookieFlags:"cookie_flags",userId:"user_id",clientId:"client_id",anonymizeIp:"anonymize_ip",contentGroup1:"content_group1",contentGroup2:"content_group2",contentGroup3:"content_group3",contentGroup4:"content_group4",contentGroup5:"content_group5",allowAdFeatures:"allow_google_signals",allowAdPersonalizationSignals:"allow_ad_personalization_signals",nonInteraction:"non_interaction",page:"page_path",hitCallback:"event_callback"},T=Object.entries(_).reduce(function(A,$){var K=j($,2),Y=K[0],se=K[1];return v[Y]?A[v[Y]]=se:A[Y]=se,A},{});return T}}),z(this,"initialize",function(_){var v=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(!_)throw new Error("Require GA_MEASUREMENT_ID");var T=typeof _=="string"?[{trackingId:_}]:_;g._currentMeasurementId=T[0].trackingId;var A=v.gaOptions,$=v.gtagOptions,K=v.nonce,Y=v.testMode,se=Y===void 0?!1:Y,Z=v.gtagUrl;if(g._testMode=se,se||g._loadGA(g._currentMeasurementId,K,Z),g.isInitialized||(g._gtag("js",new Date),T.forEach(function(Tt){var we=O(O(O({},g._toGtagOptions(O(O({},A),Tt.gaOptions))),$),Tt.gtagOptions);Object.keys(we).length?g._gtag("config",Tt.trackingId,we):g._gtag("config",Tt.trackingId)})),g.isInitialized=!0,!se){var bt=h(g._queueGtag);for(g._queueGtag=[],g._isQueuing=!1;bt.length;){var Ct=bt.shift();g._gtag.apply(g,h(Ct)),Ct[0]==="get"&&(g._isQueuing=!0)}}}),z(this,"set",function(_){if(!_){console.warn("`fieldsObject` is required in .set()");return}if(c(_)!=="object"){console.warn("Expected `fieldsObject` arg to be an Object");return}Object.keys(_).length===0&&console.warn("empty `fieldsObject` given to .set()"),g._gaCommand("set",_)}),z(this,"_gaCommandSendEvent",function(_,v,T,A,$){g._gtag("event",v,O(O({event_category:_,event_label:T,value:A},$&&{non_interaction:$.nonInteraction}),g._toGtagOptions($)))}),z(this,"_gaCommandSendEventParameters",function(){for(var _=arguments.length,v=new Array(_),T=0;T<_;T++)v[T]=arguments[T];if(typeof v[0]=="string")g._gaCommandSendEvent.apply(g,h(v.slice(1)));else{var A=v[0],$=A.eventCategory,K=A.eventAction,Y=A.eventLabel,se=A.eventValue;A.hitType;var Z=a(A,i);g._gaCommandSendEvent($,K,Y,se,Z)}}),z(this,"_gaCommandSendTiming",function(_,v,T,A){g._gtag("event","timing_complete",{name:v,value:T,event_category:_,event_label:A})}),z(this,"_gaCommandSendPageview",function(_,v){if(v&&Object.keys(v).length){var T=g._toGtagOptions(v),A=T.title,$=T.location,K=a(T,s);g._gtag("event","page_view",O(O(O(O({},_&&{page_path:_}),A&&{page_title:A}),$&&{page_location:$}),K))}else _?g._gtag("event","page_view",{page_path:_}):g._gtag("event","page_view")}),z(this,"_gaCommandSendPageviewParameters",function(){for(var _=arguments.length,v=new Array(_),T=0;T<_;T++)v[T]=arguments[T];if(typeof v[0]=="string")g._gaCommandSendPageview.apply(g,h(v.slice(1)));else{var A=v[0],$=A.page;A.hitType;var K=a(A,r);g._gaCommandSendPageview($,K)}}),z(this,"_gaCommandSend",function(){for(var _=arguments.length,v=new Array(_),T=0;T<_;T++)v[T]=arguments[T];var A=typeof v[0]=="string"?v[0]:v[0].hitType;switch(A){case"event":g._gaCommandSendEventParameters.apply(g,v);break;case"pageview":g._gaCommandSendPageviewParameters.apply(g,v);break;case"timing":g._gaCommandSendTiming.apply(g,h(v.slice(1)));break;case"screenview":case"transaction":case"item":case"social":case"exception":console.warn("Unsupported send command: ".concat(A));break;default:console.warn("Send command doesn't exist: ".concat(A))}}),z(this,"_gaCommandSet",function(){for(var _=arguments.length,v=new Array(_),T=0;T<_;T++)v[T]=arguments[T];typeof v[0]=="string"&&(v[0]=z({},v[0],v[1])),g._gtag("set",g._toGtagOptions(v[0]))}),z(this,"_gaCommand",function(_){for(var v=arguments.length,T=new Array(v>1?v-1:0),A=1;A<v;A++)T[A-1]=arguments[A];switch(_){case"send":g._gaCommandSend.apply(g,T);break;case"set":g._gaCommandSet.apply(g,T);break;default:console.warn("Command doesn't exist: ".concat(_))}}),z(this,"ga",function(){for(var _=arguments.length,v=new Array(_),T=0;T<_;T++)v[T]=arguments[T];if(typeof v[0]=="string")g._gaCommand.apply(g,v);else{var A=v[0];g._gtag("get",g._currentMeasurementId,"client_id",function($){g._isQueuing=!1;var K=g._queueGtag;for(A({get:function(Z){return Z==="clientId"?$:Z==="trackingId"?g._currentMeasurementId:Z==="apiVersion"?"1":void 0}});K.length;){var Y=K.shift();g._gtag.apply(g,h(Y))}}),g._isQueuing=!0}return g.ga}),z(this,"event",function(_,v){if(typeof _=="string")g._gtag("event",_,g._toGtagOptions(v));else{var T=_.action,A=_.category,$=_.label,K=_.value,Y=_.nonInteraction,se=_.transport;if(!A||!T){console.warn("args.category AND args.action are required in event()");return}var Z={hitType:"event",eventCategory:(0,t.default)(A),eventAction:(0,t.default)(T)};$&&(Z.eventLabel=(0,t.default)($)),typeof K<"u"&&(typeof K!="number"?console.warn("Expected `args.value` arg to be a Number."):Z.eventValue=K),typeof Y<"u"&&(typeof Y!="boolean"?console.warn("`args.nonInteraction` must be a boolean."):Z.nonInteraction=Y),typeof se<"u"&&(typeof se!="string"?console.warn("`args.transport` must be a string."):(["beacon","xhr","image"].indexOf(se)===-1&&console.warn("`args.transport` must be either one of these values: `beacon`, `xhr` or `image`"),Z.transport=se)),g._gaCommand("send",Z)}}),z(this,"send",function(_){g._gaCommand("send",_)}),this.reset()}return On(y,[{key:"gtag",value:function(){this._gtag.apply(this,arguments)}}]),y}();n.GA4=q;var Fe=new q;n.default=Fe})(tc);(function(n){function e(a){"@babel/helpers - typeof";return e=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(l){return typeof l}:function(l){return l&&typeof Symbol=="function"&&l.constructor===Symbol&&l!==Symbol.prototype?"symbol":typeof l},e(a)}Object.defineProperty(n,"__esModule",{value:!0}),n.default=n.ReactGAImplementation=void 0;var t=s(tc);function i(a){if(typeof WeakMap!="function")return null;var l=new WeakMap,c=new WeakMap;return(i=function(f){return f?c:l})(a)}function s(a,l){if(a&&a.__esModule)return a;if(a===null||e(a)!=="object"&&typeof a!="function")return{default:a};var c=i(l);if(c&&c.has(a))return c.get(a);var h={},f=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var m in a)if(m!=="default"&&Object.prototype.hasOwnProperty.call(a,m)){var E=f?Object.getOwnPropertyDescriptor(a,m):null;E&&(E.get||E.set)?Object.defineProperty(h,m,E):h[m]=a[m]}return h.default=a,c&&c.set(a,h),h}var r=t.GA4;n.ReactGAImplementation=r;var o=t.default;n.default=o})(ec);const Te=xc(ec),de=[];for(let n=0;n<256;++n)de.push((n+256).toString(16).slice(1));function Lg(n,e=0){return(de[n[e+0]]+de[n[e+1]]+de[n[e+2]]+de[n[e+3]]+"-"+de[n[e+4]]+de[n[e+5]]+"-"+de[n[e+6]]+de[n[e+7]]+"-"+de[n[e+8]]+de[n[e+9]]+"-"+de[n[e+10]]+de[n[e+11]]+de[n[e+12]]+de[n[e+13]]+de[n[e+14]]+de[n[e+15]]).toLowerCase()}let Qi;const Fg=new Uint8Array(16);function Ug(){if(!Qi){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");Qi=crypto.getRandomValues.bind(crypto)}return Qi(Fg)}const jg=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Bo={randomUUID:jg};function Bg(n,e,t){var s;if(Bo.randomUUID&&!n)return Bo.randomUUID();n=n||{};const i=n.random??((s=n.rng)==null?void 0:s.call(n))??Ug();if(i.length<16)throw new Error("Random bytes length must be >= 16");return i[6]=i[6]&15|64,i[8]=i[8]&63|128,Lg(i)}const Hg="/logo.svg",gr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",_r="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8JCAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWNSHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rpdJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphjrC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQWgiSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHLhLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTowIgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zGp8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC";console.log("Firebase Auth:",an);console.log("Google Provider:",vs);let Vg=new Ot.Icon({iconUrl:gr,shadowUrl:_r,iconSize:[25,41],iconAnchor:[12,41],className:"default-marker-icon"}),Wg=new Ot.Icon({iconUrl:gr,shadowUrl:_r,iconSize:[25,41],iconAnchor:[12,41],className:"user-location-icon"});new Ot.Icon({iconUrl:gr,shadowUrl:_r,iconSize:[25,41],iconAnchor:[12,41],className:"hotel-icon"});const sc="G-C7EB2DWKD0";console.log("[GA] ID de mesure utilisé:",sc);Te.initialize(sc,{testMode:!1,gaOptions:{sendPageView:!1}});console.log("[GA] Objet ReactGA:",Te);Te.event({category:"testing",action:"ga_test",label:"Validation de connexion GA4"});console.log("[GA] Google Analytics initialisé en mode test");function zg(){const[n,e]=P.useState(null),[t,i]=P.useState(null),s=Mc();return P.useEffect(()=>{if(s){if(!navigator.geolocation){i("La géolocalisation n'est pas supportée par votre navigateur");return}const r={enableHighAccuracy:!0,timeout:1e4,maximumAge:0};navigator.geolocation.getCurrentPosition(a=>{const{latitude:l,longitude:c}=a.coords,h=new Ot.LatLng(l,c);e(h),s.flyTo(h,16),i(null)},a=>{console.error("Erreur de géolocalisation:",a);let l="Erreur de géolocalisation";switch(a.code){case a.PERMISSION_DENIED:l="L'accès à la géolocalisation a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";break;case a.POSITION_UNAVAILABLE:l="La position n'est pas disponible. Vérifiez que la géolocalisation est activée sur votre appareil.";break;case a.TIMEOUT:l="La demande de géolocalisation a expiré. Veuillez réessayer.";break}i(l)},r);const o=navigator.geolocation.watchPosition(a=>{const{latitude:l,longitude:c}=a.coords,h=new Ot.LatLng(l,c);e(h),i(null)},a=>{console.error("Erreur de suivi de position:",a)},r);return()=>{navigator.geolocation.clearWatch(o)}}},[s]),t?p.jsxs("div",{className:"error-message",children:[t,p.jsxs("div",{className:"retry-container",onClick:()=>{if(i(null),s){const r={enableHighAccuracy:!0,timeout:1e4,maximumAge:0};navigator.geolocation.getCurrentPosition(o=>{const{latitude:a,longitude:l}=o.coords,c=new Ot.LatLng(a,l);e(c),s.flyTo(c,16)},o=>{console.error("Erreur de géolocalisation:",o);let a="Erreur de géolocalisation";switch(o.code){case o.PERMISSION_DENIED:a="L'accès à la géolocalisation a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";break;case o.POSITION_UNAVAILABLE:a="La position n'est pas disponible. Vérifiez que la géolocalisation est activée sur votre appareil.";break;case o.TIMEOUT:a="La demande de géolocalisation a expiré. Veuillez réessayer.";break}i(a)},r)}},children:[p.jsx("div",{className:"retry-icon"}),p.jsx("span",{children:"Réessayer"})]})]}):n===null?null:p.jsx(Ho,{position:n,icon:Wg,children:p.jsx(Vo,{children:"Vous êtes ici"})})}function $g({onMapClick:n}){return Lc({click:n}),null}function Gg(){const n=P.useRef(null),e=P.useRef([]),[t,i]=P.useState([]),[s,r]=P.useState(!1),[o,a]=P.useState(!1);P.useEffect(()=>{const u=Ro(an,d=>{if(console.log("État de l'authentification changé:",d),d){console.log("Utilisateur connecté - UID:",d.uid),console.log("Email:",d.email),console.log("Nom:",d.displayName),Ln(d);const w=ee(te,"admins");qi(w,C=>{const b=C.val();r(b&&b[d.uid])})}else console.log("Aucun utilisateur connecté"),Ln(null),r(!1);Ar(!1)});return()=>u()},[]);const l=()=>s?!0:(alert("Cette action nécessite des droits d'administrateur."),!1),[c,h]=P.useState([{id:"1",name:"F1 Les Ulis",position:[48.6819,2.1694],description:"Hôtel F1 Les Ulis - Courtaboeuf",address:"Zi Courtaboeuf, Rue Rio Solado N°2, 91940 Les Ulis",type:"hotel",date:"",latitude:48.6819,longitude:2.1694,emoji:"🏨",sport:"Hotel"},{id:"2",name:"F1 Orly-Rungis",position:[48.7486,2.3522],description:"Hôtel F1 Orly-Rungis",address:"7 Rue du Pont des Halles, 94150 Rungis",type:"hotel",date:"",latitude:48.7486,longitude:2.3522,emoji:"🏨",sport:"Hotel"}]),[f]=P.useState([{id:"1",name:"La Palmeraie",position:[48.8392,2.2756],description:"Soirée Pompoms du 24 au 25 avril 2025, 21h-3h",address:"20, rue du Colonel Pierre Avia, 75015 Paris",type:"party",date:"2025-04-24T21:00:00",latitude:48.8392,longitude:2.2756,emoji:"🎉",sport:"Pompom"},{id:"2",name:"Bridge Club",position:[48.8655,2.3144],description:"Soirée du 25 au 26 avril 2025, 21h-3h",address:"3, Port des Champs-Élysées, 75008 Paris",type:"party",date:"2025-04-25T21:00:00",latitude:48.8655,longitude:2.3144,emoji:"🎉",sport:"Party"},{id:"3",name:"Terminal 7",position:[48.8323,2.2883],description:"Soirée du 26 au 27 avril 2025, 22h-4h",address:"1, Place de la Porte de Versailles Pavillon 7 - Etage 7.4, 75015 Paris",type:"party",date:"2025-04-26T22:00:00",latitude:48.8323,longitude:2.2883,emoji:"🎉",sport:"Party"}]);P.useEffect(()=>{const u=ee(te,"venues"),d=qi(u,w=>{const C=w.val();if(C){const b=Object.entries(C).map(([N,L])=>({...L,id:N,matches:L.matches||[],sport:L.sport||"",date:L.date||"",latitude:L.position?L.position[0]:0,longitude:L.position?L.position[1]:0,emoji:L.emoji||""}));i(b)}else i([])});return()=>d()},[]);const[m,E]=P.useState(!1),[S,O]=P.useState(!1),[j,ne]=P.useState(""),[ue,ie]=P.useState(""),[me,Ee]=P.useState(""),[Me,be]=P.useState("Football"),[On,z]=P.useState(null),[x,Le]=P.useState({venueId:null,match:null}),[q,Fe]=P.useState({date:"",teams:"",description:""}),[y,g]=P.useState(null),[_,v]=P.useState(!1),[T,A]=P.useState(!1),[$,K]=P.useState(null),[Y,se]=P.useState("osm"),[Z,bt]=P.useState("map"),[Ct,Tt]=P.useState(null),[we,St]=P.useState({id:null,venue:null}),[rc,vr]=P.useState("⚽"),[Zt,oc]=P.useState("all"),[en,ac]=P.useState([]),[Ye,ki]=P.useState(-1),[qg,Kg]=P.useState(!1),yr={osm:{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'},cyclosm:{url:"https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'},humanitarian:{url:"https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'},osmfr:{url:"https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}},Er={Football:"⚽",Basketball:"🏀",Handball:"🤾",Rugby:"🏉",Volleyball:"🏐",Tennis:"🎾",Badminton:"🏸",Hockey:"🏑","Base-ball":"⚾",Golf:"⛳","Ping-pong":"🏓",Ultimate:"🥏",Natation:"🏊",Trail:"🏃",Boxe:"🥊",Athlétisme:"🏃‍♂️",Pétanque:"🍹",Escalade:"🧗‍♂️","Jeux de société":"🎲",Other:"🎯",Pompom:"🎀",Party:"🎉",Hotel:"🏨"},lc=async u=>{try{const w=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(u)}`)).json();return w&&w.length>0?[parseFloat(w[0].lat),parseFloat(w[0].lon)]:null}catch(d){return console.error("Erreur de géocodage:",d),null}},cc=u=>{const d=new Date(u),w=new Date,C=d.getTime()-w.getTime(),b=Math.ceil(C/(1e3*60*60));return b<0?{color:"#808080",rotation:"0deg"}:b<=1?{color:"#FF0000",rotation:"0deg"}:b<=3?{color:"#FF4500",rotation:"45deg"}:b<=6?{color:"#FFA500",rotation:"90deg"}:b<=12?{color:"#FFD700",rotation:"135deg"}:{color:"#4CAF50",rotation:"180deg"}},wr=u=>({Football:"⚽",Basketball:"🏀",Handball:"🤾",Rugby:"🏉",Ultimate:"🥏",Natation:"🏊",Badminton:"🏸",Tennis:"🎾",Trail:"🏃",Volleyball:"🏐","Ping-pong":"🏓",Boxe:"🥊",Athlétisme:"🏃‍♂️",Pétanque:"🍹",Escalade:"🧗‍♂️","Jeux de société":"🎲"})[u]||"🏆",At=u=>{const d=en.slice(0,Ye+1);d.push(u),ac(d),ki(d.length-1)},uc=async()=>{Ye>=0&&(await en[Ye].undo(),ki(Ye-1))},dc=async()=>{if(Ye<en.length-1){const u=en[Ye+1];switch(u.type){case"ADD_VENUE":{const d=u.data,w=ee(te,`venues/${d.id}`);await oe(w,{name:d.name,position:[d.latitude,d.longitude],description:d.description,address:d.address,matches:d.matches||[],sport:d.sport,date:d.date,latitude:d.latitude,longitude:d.longitude,emoji:d.emoji})}break;case"UPDATE_VENUE":{const{after:d}=u.data,w=ee(te,`venues/${d.id}`);await oe(w,d)}break;case"DELETE_VENUE":{const d=u.data,w=ee(te,`venues/${d.id}`);await oe(w,null)}break;case"ADD_MATCH":{const{venueId:d,match:w}=u.data,C=t.find(b=>b.id===d);if(C){const b=[...C.matches||[]];if(!b.some(N=>N.id===w.id)){b.push(w);const N=ee(te,`venues/${d}`);await oe(N,{...C,matches:b})}}}break;case"UPDATE_MATCH":{const{venueId:d,matchId:w,after:C}=u.data,b=t.find(N=>N.id===d);if(b){const N=b.matches.map(B=>B.id===w?{...B,...C}:B),L=ee(te,`venues/${d}`);await oe(L,{...b,matches:N})}}break;case"DELETE_MATCH":{const{venueId:d,match:w}=u.data,C=t.find(b=>b.id===d);if(C){const b=C.matches.filter(L=>L.id!==w.id),N=ee(te,`venues/${d}`);await oe(N,{...C,matches:b})}}break}ki(Ye+1)}};P.useEffect(()=>{const u=async d=>{(d.ctrlKey||d.metaKey)&&d.key==="z"&&!d.shiftKey&&(d.preventDefault(),await uc()),(d.ctrlKey||d.metaKey)&&d.key==="z"&&d.shiftKey&&(d.preventDefault(),await dc())};return window.addEventListener("keydown",u),()=>{window.removeEventListener("keydown",u)}},[en,Ye,t]);const[lt,Nt]=P.useState(null),[Ir,tn]=P.useState(!1),hc=async()=>{if(!l())return;if(!j||!ue||!me&&!lt){alert("Veuillez remplir tous les champs requis ou placer un marqueur sur la carte.");return}let u=null;if(lt)u=lt;else if(me&&(u=await lc(me),!u)){alert("Adresse non trouvée. Veuillez vérifier l'adresse saisie ou placer un marqueur sur la carte.");return}if(!u){alert("Une erreur est survenue lors de la récupération des coordonnées.");return}const d=ee(te,"venues"),w=Ip(d),C={name:j,position:u,description:ue,address:me||`${u[0]}, ${u[1]}`,matches:[],sport:Me,date:"",latitude:u[0],longitude:u[1],emoji:rc,type:"venue"};try{await oe(w,C);const b=w.key||"";At({type:"ADD_VENUE",data:{...C,id:b},undo:async()=>{const N=ee(te,`venues/${b}`);await oe(N,null)}}),ne(""),ie(""),Ee(""),be("Football"),Nt(null),tn(!1),E(!1)}catch(b){console.error("Erreur lors de l'ajout du lieu:",b),alert("Une erreur est survenue lors de l'ajout du lieu.")}},fc=u=>{if(Ir){const d=u.latlng.lat,w=u.latlng.lng;Nt([d,w]),Ee(`${d.toFixed(6)}, ${w.toFixed(6)}`),tn(!1),E(!0)}},pc=async u=>{if(!l()||!window.confirm("Êtes-vous sûr de vouloir supprimer ce lieu ? Cette action est irréversible."))return;const d=t.find(w=>w.id===u);if(d){const w=ee(te,`venues/${u}`);await oe(w,null),At({type:"DELETE_VENUE",data:d,undo:async()=>{const C=ee(te,`venues/${u}`);await oe(C,{name:d.name,position:[d.latitude,d.longitude],description:d.description,address:d.address,matches:d.matches||[],sport:d.sport,date:d.date,latitude:d.latitude,longitude:d.longitude,emoji:d.emoji})}}),z(null)}},mc=async u=>{if(!l())return;const d=t.find(b=>b.id===u);if(!d)return;if(!q.date||!q.teams||!q.description){alert("Veuillez remplir tous les champs requis (date de début, équipes et description)");return}const C={id:Bg(),name:`${d.name} - Match`,description:q.description,address:d.address,latitude:d.latitude,longitude:d.longitude,position:[d.latitude,d.longitude],date:q.date,type:"match",teams:q.teams,sport:d.sport,time:new Date(q.date).toTimeString().split(" ")[0],endTime:q.endTime||"",venueId:d.id,emoji:d.emoji};try{const b=ee(te,`venues/${u}`),N=[...d.matches||[],C];await oe(b,{...d,matches:N}),At({type:"ADD_MATCH",data:{venueId:u,match:C},undo:async()=>{const B=ee(te,`venues/${u}`);await oe(B,{...d,matches:d.matches||[]})}}),Fe({date:"",teams:"",description:"",endTime:""}),Le({venueId:null,match:null}),g(u);const L=e.current.find(B=>B.getLatLng().lat===d.latitude&&B.getLatLng().lng===d.longitude);L&&setTimeout(()=>{L.openPopup()},300)}catch(b){console.error("Erreur lors de l'ajout du match:",b),alert("Une erreur est survenue lors de l'ajout du match.")}},gc=async(u,d,w)=>{if(!l())return;const C=ee(te,`venues/${u}`),b=t.find(N=>N.id===u);if(b){const N={...b},L=b.matches.find(Q=>Q.id===d),B=b.matches.map(Q=>Q.id===d?{...Q,...w,endTime:w.endTime||""}:Q);try{await oe(C,{...b,matches:B}),L&&At({type:"UPDATE_MATCH",data:{venueId:u,matchId:d,before:L,after:{...L,...w}},undo:async()=>{const J=ee(te,`venues/${u}`);await oe(J,N)}}),g(u);const Q=e.current.find(J=>J.getLatLng().lat===b.latitude&&J.getLatLng().lng===b.longitude);Q&&setTimeout(()=>{Q.openPopup()},300)}catch(Q){console.error("Erreur lors de la mise à jour du match:",Q),alert("Une erreur est survenue lors de la mise à jour du match.")}}},_c=async(u,d)=>{if(!l()||!window.confirm("Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible."))return;const w=ee(te,`venues/${u}`),C=t.find(b=>b.id===u);if(C){const b={...C},N=C.matches.find(B=>B.id===d),L=C.matches.filter(B=>B.id!==d);await oe(w,{...C,matches:L}),N&&At({type:"DELETE_MATCH",data:{venueId:u,match:N},undo:async()=>{const B=ee(te,`venues/${u}`);await oe(B,b)}})}},vc=async()=>{if(l()&&we.id&&j&&ue){const u=t.find(d=>d.id===we.id);if(u){const d={...u},w=ee(te,`venues/${we.id}`),C=lt||[u.latitude,u.longitude],b={...u,name:j,description:ue,address:me||`${C[0].toFixed(6)}, ${C[1].toFixed(6)}`,sport:Me,latitude:C[0],longitude:C[1],position:C};try{await oe(w,b),At({type:"UPDATE_VENUE",data:{before:d,after:b},undo:async()=>{const N=ee(te,`venues/${we.id}`);await oe(N,d)}}),ne(""),ie(""),Ee(""),be("Football"),Nt(null),St({id:null,venue:null}),E(!1)}catch(N){console.error("Erreur lors de la mise à jour du lieu:",N),alert("Une erreur est survenue lors de la mise à jour du lieu.")}}}},yc=u=>{l()&&(x.venueId&&Mn(),St({id:u.id||"",venue:u}),a(!0),E(!0),ne(u.name),ie(u.description),Ee(u.address||""),be(u.sport),vr(Er[u.sport]||"⚽"),Nt([u.latitude,u.longitude]))},Ec=()=>{St({id:null,venue:null}),ne(""),ie(""),Ee(""),be("Football"),Nt(null),tn(!1),E(!1)},Ri=(u,d,w="match")=>{const C=new Date,b=new Date(u);if(d){const B=new Date(d);return C>B}const N=w==="party"?6:2,L=new Date(b.getTime()+N*60*60*1e3);return C>L},wc=()=>{const u=[];return t.forEach(d=>{d.matches&&d.matches.length>0&&d.matches.forEach(w=>{u.push({id:`match-${d.id}-${w.id}`,name:w.teams,date:w.date,endTime:w.endTime,description:w.description,address:d.address||`${d.latitude}, ${d.longitude}`,location:[d.latitude,d.longitude],type:"match",teams:w.teams,venue:d.name,venueId:d.id,isPassed:Ri(w.date,w.endTime,"match"),sport:d.sport})})}),f.forEach(d=>{u.push({id:`party-${d.id||d.name}`,name:d.name,date:d.date,description:d.description,address:d.address||`${d.latitude}, ${d.longitude}`,location:[d.latitude,d.longitude],type:"party",isPassed:Ri(d.date,void 0,"party"),sport:d.sport})}),u.sort((d,w)=>new Date(d.date).getTime()-new Date(w.date).getTime())},br=()=>{const u=wc();return Zt==="all"?u:u.filter(d=>Zt==="party"?d.type==="party":d.type==="match"&&d.sport===Zt)},Cr=(u,d)=>{const w=new Date(u),b=["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"][w.getDay()],N=w.getHours().toString().padStart(2,"0"),L=w.getMinutes().toString().padStart(2,"0");if(d){const B=new Date(d),Q=B.getHours().toString().padStart(2,"0"),J=B.getMinutes().toString().padStart(2,"0");return`${b} ${N}:${L} - ${Q}:${J}`}return`${b} ${N}:${L}`},Pi=u=>{Te.event({category:"navigation",action:"open_google_maps",label:u.name});const d=encodeURIComponent(u.address||`${u.latitude},${u.longitude}`);window.open(`https://www.google.com/maps/search/?api=1&query=${d}`,"_blank")},Ic=u=>{g(u)},bc=u=>{const{latitude:d,longitude:w}=u.coords;K([d,w]),v(!1),A(!1)},Cc=u=>{console.error("Erreur de géolocalisation:",u);let d="Impossible d'accéder à votre position. ";switch(u.code){case u.PERMISSION_DENIED:d+="Veuillez autoriser l'accès à la géolocalisation dans les paramètres de votre navigateur.";break;case u.POSITION_UNAVAILABLE:d+="La position n'est pas disponible. Vérifiez que la géolocalisation est activée sur votre appareil.";break;case u.TIMEOUT:d+="La demande a expiré. Veuillez réessayer.";break;default:d+="Une erreur inattendue s'est produite."}v(d),A(!1)},Tc=()=>{Te.event({category:"location",action:"retry_location"}),v(!1),A(!0),navigator.geolocation.getCurrentPosition(bc,Cc,{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})},Dn=u=>{navigator.clipboard.writeText(u).then(()=>{alert("Adresse copiée !")}).catch(d=>{console.error("Erreur lors de la copie : ",d)})};P.useEffect(()=>{!_&&n.current&&(e.current.forEach(u=>{u.remove()}),e.current=[],t.forEach(u=>{const d=cc(u.date),w=Rt.marker([u.latitude,u.longitude],{icon:Rt.divIcon({className:"custom-marker",html:`<div class="marker-content" style="background-color: ${d.color}; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                     <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${wr(u.sport)}</span>
                   </div>`,iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-15]})}),C=document.createElement("div");C.className="venue-popup",C.innerHTML=`
          <h3>${u.name}</h3>
          <p>${u.description}</p>
          <p><strong>Sport:</strong> ${u.sport}</p>
          <p class="venue-address">${u.address||`${u.latitude}, ${u.longitude}`}</p>
        `;const b=document.createElement("div");b.className="popup-buttons";const N=document.createElement("button");N.className="maps-button",N.textContent="Ouvrir dans Google Maps",N.addEventListener("click",()=>{Pi(u)}),b.appendChild(N);const L=document.createElement("button");L.className="copy-button",L.textContent="Copier l'adresse",L.addEventListener("click",()=>{Dn(u.address||`${u.latitude},${u.longitude}`)}),b.appendChild(L),C.appendChild(b);const B=document.createElement("div");if(B.className="matches-list",u.matches&&u.matches.length>0&&(B.innerHTML="<h4>Matchs à venir :</h4>",[...u.matches].sort((J,Ce)=>new Date(J.date).getTime()-new Date(Ce.date).getTime()).forEach(J=>{const Ce=document.createElement("div");if(Ce.className=`match-item ${Ri(J.date,J.endTime)?"match-passed":""}`,Ce.innerHTML=`
              <p class="match-date">${Cr(J.date,J.endTime)}</p>
              <p class="match-teams">${J.teams}</p>
              <p class="match-description">${J.description}</p>
            `,o){const Ue=document.createElement("div");Ue.className="match-actions";const kt=document.createElement("button");kt.className="edit-match-button",kt.textContent="Modifier",kt.addEventListener("click",Di=>{Di.stopPropagation(),Tr(u.id||"",J)});const Fn=document.createElement("button");Fn.className="delete-match-button",Fn.textContent="Supprimer",Fn.addEventListener("click",Di=>{Di.stopPropagation(),_c(u.id||"",J.id)}),Ue.appendChild(kt),Ue.appendChild(Fn),Ce.appendChild(Ue)}B.appendChild(Ce)}),C.appendChild(B)),o){const Q=document.createElement("div");Q.className="popup-buttons";const J=document.createElement("button");J.className="add-match-button",J.textContent="Ajouter un match",J.addEventListener("click",kt=>{kt.stopPropagation(),Tr(u.id||"",null)}),Q.appendChild(J);const Ce=document.createElement("button");Ce.className="edit-button",Ce.textContent="Modifier ce lieu",Ce.addEventListener("click",()=>{yc(u)}),Q.appendChild(Ce);const Ue=document.createElement("button");Ue.className="delete-button",Ue.textContent="Supprimer ce lieu",Ue.addEventListener("click",()=>{pc(u.id||"")}),Q.appendChild(Ue),C.appendChild(Q)}w.bindPopup(C),w.on("click",()=>{Ic(u.id||"")}),n.current&&(w.addTo(n.current),e.current.push(w))}),c.forEach(u=>{const d=Rt.marker([u.latitude,u.longitude],{icon:Rt.divIcon({className:"custom-marker hotel-marker",html:`<div style="background-color: #1976D2; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                     <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">🏨</span>
                   </div>`,iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-15]})}),w=document.createElement("div");w.className="venue-popup",w.innerHTML=`
          <h3>${u.name}</h3>
          <p>${u.description}</p>
          <p class="venue-address">${u.address||`${u.latitude}, ${u.longitude}`}</p>
        `;const C=document.createElement("div");C.className="popup-buttons";const b=document.createElement("button");b.className="maps-button",b.textContent="Ouvrir dans Google Maps",b.addEventListener("click",()=>{Pi(u)}),C.appendChild(b);const N=document.createElement("button");N.className="copy-button",N.textContent="Copier l'adresse",N.addEventListener("click",()=>{Dn(u.address||`${u.latitude},${u.longitude}`)}),C.appendChild(N),w.appendChild(C),d.bindPopup(w),n.current&&(d.addTo(n.current),e.current.push(d))}),f.forEach(u=>{const d=Rt.marker([u.latitude,u.longitude],{icon:Rt.divIcon({className:"custom-marker party-marker",html:`<div style="background-color: #9C27B0; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                     <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${u.sport==="Pompom"?"🎀":"🎉"}</span>
                   </div>`,iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-15]})}),w=document.createElement("div");w.className="venue-popup",w.innerHTML=`
          <h3>${u.name}</h3>
          <p>${u.description}</p>
          <p class="venue-address">${u.address}</p>
        `;const C=document.createElement("div");C.className="popup-buttons";const b=document.createElement("button");b.className="maps-button",b.textContent="Ouvrir dans Google Maps",b.addEventListener("click",()=>{Pi(u)}),C.appendChild(b);const N=document.createElement("button");N.className="copy-button",N.textContent="Copier l'adresse",N.addEventListener("click",()=>{Dn(u.address||`${u.latitude},${u.longitude}`)}),C.appendChild(N),w.appendChild(C),d.bindPopup(w),n.current&&(d.addTo(n.current),e.current.push(d))}))},[t,c,f,o,s]);const Tr=(u,d)=>{l()&&((we.id||m)&&(St({id:null,venue:null}),E(!1)),Le({venueId:u,match:d}),Fe(d?{date:d.date,teams:d.teams,description:d.description,endTime:d.endTime}:{date:"",teams:"",description:""}))},Mn=()=>{Le({venueId:null,match:null})};P.useEffect(()=>{setTimeout(()=>{console.log("[GA] Envoi du pageview à Google Analytics"),Te.send({hitType:"pageview",page:window.location.pathname+window.location.search}),console.log("[GA] Pageview envoyé"),Te.event({category:"page",action:"view",label:window.location.pathname})},1e3);const u=(d,w)=>{console.log(`[GA] Envoi d'événement: ${d}/${w}`),Te.event({category:d,action:w})};return u("app","app_loaded"),()=>{u("app","app_closed")}},[]);const Sc=()=>{if(!n.current)return;const u=e.current,d=br();u.forEach(w=>{const C=w.getElement();C&&(d.find(N=>{const[L,B]=N.location,Q=w.getLatLng();return L===Q.lat&&B===Q.lng})?(C.style.display="block",C.style.opacity="1"):(C.style.display="none",C.style.opacity="0"))})};P.useEffect(()=>{n.current&&Sc()},[Zt]);const Ac=u=>{var d,w;if(Tt(u),bt("map"),u.type==="party"){const C=u.id.split("-")[1],b=f.find(N=>N.id===C||N.name===C);if(b){(d=n.current)==null||d.flyTo([b.latitude,b.longitude],18,{duration:2.5});const N=e.current.find(L=>L.getLatLng().lat===b.latitude&&L.getLatLng().lng===b.longitude);N&&setTimeout(()=>{N.openPopup()},2500)}}else{const C=t.find(b=>b.id===u.venueId);if(C){(w=n.current)==null||w.flyTo([C.latitude,C.longitude],18,{duration:2.5});const b=e.current.find(N=>N.getLatLng().lat===C.latitude&&N.getLatLng().lng===C.longitude);b&&setTimeout(()=>{b.openPopup()},2500)}}},[xi,Sr]=P.useState(!1),Nc=()=>{document.fullscreenElement?(document.exitFullscreen(),Sr(!1)):(document.documentElement.requestFullscreen(),Sr(!0))},[Oi,Ln]=P.useState(null),[kc,Ar]=P.useState(!0);P.useEffect(()=>{console.log("Démarrage de l'écouteur d'authentification...");const u=Ro(an,d=>{if(console.log("État de l'authentification changé:",d),d){console.log("Utilisateur connecté - UID:",d.uid),console.log("Email:",d.email),console.log("Nom:",d.displayName),Ln(d);const w=ee(te,"admins");qi(w,C=>{const b=C.val();r(b&&b[d.uid])})}else console.log("Aucun utilisateur connecté"),Ln(null),r(!1);Ar(!1)});return()=>u()},[]);const Rc=async()=>{try{console.log("Tentative de connexion..."),console.log("Provider configuré:",vs);const u=await Vm(an,vs);console.log("Résultat de la connexion:",u),console.log("UID de l'utilisateur:",u.user.uid),console.log("Email de l'utilisateur:",u.user.email)}catch(u){console.error("Erreur détaillée de connexion:",u)}};return kc?p.jsx("div",{children:"Chargement..."}):p.jsxs("div",{className:"app",children:[p.jsxs("div",{className:"app-header",children:[p.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[p.jsx("img",{src:Hg,alt:"CumMap Logo",style:{height:"40px",width:"auto"}}),p.jsx("h1",{children:"CumMap"}),p.jsx("button",{className:`fullscreen-button ${xi?"active":""}`,onClick:Nc,title:xi?"Quitter le mode plein écran":"Mode plein écran",style:{padding:"8px",backgroundColor:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:xi?p.jsx("svg",{viewBox:"0 0 24 24",width:"24",height:"24",fill:"currentColor",children:p.jsx("path",{d:"M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"})}):p.jsx("svg",{viewBox:"0 0 24 24",width:"24",height:"24",fill:"currentColor",children:p.jsx("path",{d:"M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"})})}),p.jsx("button",{className:"admin-button",onClick:()=>{Oi?an.signOut():Rc()},title:Oi?"Se déconnecter":"Se connecter",style:{padding:"8px",backgroundColor:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px"},children:Oi?"🔓":"🔒"})]}),p.jsxs("div",{className:"controls",children:[!o&&p.jsxs("select",{className:"map-style-selector",value:Y,onChange:u=>{Te.event({category:"map",action:"change_map_style",label:u.target.value}),se(u.target.value)},children:[p.jsx("option",{value:"osm",children:"OpenStreetMap"}),p.jsx("option",{value:"cyclosm",children:"CyclOSM"}),p.jsx("option",{value:"humanitarian",children:"Humanitarian"}),p.jsx("option",{value:"osmfr",children:"OSM France"})]}),p.jsx("button",{className:`edit-button ${o?"active":""}`,onClick:()=>{Te.event({category:"app",action:"toggle_edit_mode",label:o?"off":"on"}),a(!o),o&&(E(!1),St({id:null,venue:null}),Nt(null),tn(!1))},children:o?"Terminer l'édition":"Mode édition"}),o&&p.jsx("button",{className:"add-place-button",onClick:()=>{x.venueId&&Mn(),E(!0),St({id:null,venue:null}),ne(""),ie(""),Ee(""),be("Football")},children:"Ajouter un lieu"}),(m||we.id)&&!Ir&&p.jsx("div",{className:"form-overlay",children:p.jsxs("div",{className:"edit-form",children:[p.jsx("div",{className:"edit-form-header",children:p.jsx("h3",{children:we.id?"Modifier le lieu":"Ajouter un nouveau lieu"})}),p.jsxs("div",{className:"edit-form-content",children:[p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"venue-name",children:"Nom du lieu"}),p.jsx("input",{id:"venue-name",type:"text",value:j,onChange:u=>ne(u.target.value),placeholder:"Ex: Stade de France",className:"form-input"})]}),p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"venue-description",children:"Description"}),p.jsx("input",{id:"venue-description",type:"text",value:ue,onChange:u=>ie(u.target.value),placeholder:"Ex: Stade principal de football",className:"form-input"})]}),p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"venue-address",children:"Adresse"}),p.jsxs("div",{style:{display:"flex",gap:"10px"},children:[p.jsx("input",{id:"venue-address",type:"text",value:me,onChange:u=>Ee(u.target.value),placeholder:"Entrez l'adresse ou cliquez sur la carte",className:"form-input",style:{flex:1}}),p.jsx("button",{className:"place-marker-button",onClick:()=>{tn(!0),E(!1)},style:{width:"32px",height:"32px",padding:"4px",border:"1px solid var(--border-color)",borderRadius:"4px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:"📍"})]}),lt&&p.jsxs("p",{style:{color:"var(--success-color)",fontSize:"0.8rem",marginTop:"4px"},children:["Position sélectionnée : ",me]})]}),p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"venue-sport",children:"Sport"}),p.jsxs("select",{id:"venue-sport",value:Me,onChange:u=>{be(u.target.value),vr(Er[u.target.value]||"⚽")},className:"form-input",children:[p.jsx("option",{value:"Football",children:"Football ⚽"}),p.jsx("option",{value:"Basketball",children:"Basketball 🏀"}),p.jsx("option",{value:"Handball",children:"Handball 🤾"}),p.jsx("option",{value:"Rugby",children:"Rugby 🏉"}),p.jsx("option",{value:"Volleyball",children:"Volleyball 🏐"}),p.jsx("option",{value:"Tennis",children:"Tennis 🎾"}),p.jsx("option",{value:"Badminton",children:"Badminton 🏸"}),p.jsx("option",{value:"Hockey",children:"Hockey 🏑"}),p.jsx("option",{value:"Base-ball",children:"Base-ball ⚾"}),p.jsx("option",{value:"Golf",children:"Golf ⛳"}),p.jsx("option",{value:"Ping-pong",children:"Ping-pong 🏓"}),p.jsx("option",{value:"Ultimate",children:"Ultimate 🥏"}),p.jsx("option",{value:"Natation",children:"Natation 🏊"}),p.jsx("option",{value:"Trail",children:"Trail 🏃"}),p.jsx("option",{value:"Boxe",children:"Boxe 🥊"}),p.jsx("option",{value:"Athlétisme",children:"Athlétisme 🏃‍♂️"}),p.jsx("option",{value:"Pétanque",children:"Pétanque 🍹"}),p.jsx("option",{value:"Escalade",children:"Escalade 🧗‍♂️"}),p.jsx("option",{value:"Jeux de société",children:"Jeux de société 🎲"}),p.jsx("option",{value:"Other",children:"Autre 🎯"})]})]}),p.jsxs("div",{className:"form-actions",children:[p.jsx("button",{className:"add-button",onClick:()=>{we.id?vc():hc()},disabled:!j||!ue,children:we.id?"Mettre à jour":"Ajouter"}),p.jsx("button",{className:"cancel-button",onClick:()=>{we.id?Ec():(E(!1),ne(""),ie(""),Ee(""),be("Football"))},children:"Annuler"})]})]})]})})]})]}),p.jsx("main",{className:"app-main",children:_?p.jsxs("div",{className:"location-error",children:[p.jsx("p",{children:_}),p.jsxs("div",{className:"retry-container",onClick:Tc,children:[p.jsx("div",{className:"retry-icon"}),p.jsx("span",{children:"Réessayer"})]})]}):T?p.jsx("div",{className:"loading",children:"Chargement de la carte..."}):p.jsxs("div",{className:"map-container",children:[p.jsxs(Oc,{center:[48.8566,2.3522],zoom:12,style:{height:"100%",width:"100%"},ref:u=>{n.current=u||null},zoomControl:!1,children:[p.jsx(Dc,{url:yr[Y].url,attribution:yr[Y].attribution}),p.jsx(zg,{}),p.jsx($g,{onMapClick:fc}),lt&&p.jsx(Ho,{position:lt,icon:Vg,children:p.jsx(Vo,{children:"Nouveau lieu"})}),p.jsx("div",{className:"leaflet-control-container",children:p.jsx("div",{className:"leaflet-top leaflet-right",children:p.jsxs("div",{className:"leaflet-control-zoom leaflet-bar leaflet-control",children:[p.jsx("a",{className:"leaflet-control-zoom-in",href:"#",title:"Zoom in",role:"button","aria-label":"Zoom in",onClick:u=>{var d;u.preventDefault(),(d=n.current)==null||d.zoomIn()},children:"+"}),p.jsx("a",{className:"leaflet-control-zoom-out",href:"#",title:"Zoom out",role:"button","aria-label":"Zoom out",onClick:u=>{var d;u.preventDefault(),(d=n.current)==null||d.zoomOut()},children:"−"})]})})})]}),p.jsx("button",{className:`events-toggle-button ${Z==="events"?"active":""}`,onClick:()=>{Te.event({category:"navigation",action:"change_tab",label:Z==="map"?"events":"map"}),bt(Z==="map"?"events":"map")},children:Z==="map"?"📆 Événements":"✖️ Fermer"}),Z==="events"&&p.jsxs("div",{className:"events-panel",children:[p.jsxs("div",{className:"events-panel-header",children:[p.jsx("h3",{children:"Événements à venir"}),p.jsx("button",{className:"close-events-button",onClick:()=>bt("map"),title:"Fermer le panneau",children:"Fermé"})]}),p.jsx("div",{className:"event-filters",children:p.jsxs("select",{className:"filter-select",value:Zt,onChange:u=>oc(u.target.value),children:[p.jsx("option",{value:"all",children:"Tous les événements"}),p.jsx("option",{value:"party",children:"Soirées"}),p.jsx("option",{value:"Football",children:"Football"}),p.jsx("option",{value:"Basketball",children:"Basketball"}),p.jsx("option",{value:"Handball",children:"Handball"}),p.jsx("option",{value:"Rugby",children:"Rugby"}),p.jsx("option",{value:"Ultimate",children:"Ultimate"}),p.jsx("option",{value:"Natation",children:"Natation"}),p.jsx("option",{value:"Badminton",children:"Badminton"}),p.jsx("option",{value:"Tennis",children:"Tennis"}),p.jsx("option",{value:"Trail",children:"Trail"}),p.jsx("option",{value:"Volleyball",children:"Volleyball"}),p.jsx("option",{value:"Ping-pong",children:"Ping-pong"}),p.jsx("option",{value:"Boxe",children:"Boxe"}),p.jsx("option",{value:"Athlétisme",children:"Athlétisme"}),p.jsx("option",{value:"Pétanque",children:"Pétanque"}),p.jsx("option",{value:"Escalade",children:"Escalade"}),p.jsx("option",{value:"Jeux de société",children:"Jeux de société"})]})}),p.jsx("div",{className:"events-list",children:br().map(u=>p.jsxs("div",{className:`event-item ${u.isPassed?"passed":""} ${u.type==="match"?"match-event":"party-event"} ${(Ct==null?void 0:Ct.id)===u.id?"selected":""}`,onClick:()=>Ac(u),children:[p.jsxs("div",{className:"event-header",children:[p.jsx("span",{className:"event-type-badge",children:u.type==="match"?`${wr(u.sport||"")} ${u.sport}`:"🎉 Soirée"}),p.jsx("span",{className:"event-date",children:Cr(u.date)})]}),p.jsx("div",{className:"event-title-container",children:p.jsx("h3",{className:"event-name",children:u.name})}),u.type==="match"&&p.jsxs(p.Fragment,{children:[p.jsx("p",{className:"event-description",children:u.description}),p.jsx("p",{className:"event-venue",children:u.venue})]}),u.type==="party"&&p.jsxs(p.Fragment,{children:[p.jsx("p",{className:"event-description",children:u.description}),p.jsx("p",{className:"event-address",children:u.address})]}),p.jsxs("div",{className:"event-actions",children:[p.jsx("button",{className:"maps-button",onClick:d=>{d.stopPropagation(),window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(u.address)}`,"_blank")},children:"Ouvrir dans Google Maps"}),p.jsx("button",{className:"copy-button",onClick:d=>{d.stopPropagation(),Dn(u.address)},children:"Copier l'adresse"})]})]},u.id))})]})]})}),x.venueId&&p.jsx("div",{className:"form-overlay",children:p.jsxs("div",{className:"edit-form match-edit-form",children:[p.jsx("div",{className:"edit-form-header",children:p.jsx("h3",{children:x.match?"Modifier le match":"Ajouter un match"})}),p.jsxs("div",{className:"edit-form-content",children:[p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"match-date",children:"Date et heure de début"}),p.jsx("input",{id:"match-date",type:"datetime-local",value:x.match?x.match.date:q.date,onChange:u=>{if(x.match){const d={...x.match,date:u.target.value};Le({...x,match:d})}else Fe({...q,date:u.target.value})},className:"form-input"})]}),p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"match-end-time",children:"Heure de fin"}),p.jsx("input",{id:"match-end-time",type:"datetime-local",value:x.match?x.match.endTime:q.endTime||"",min:x.match?x.match.date:q.date,onChange:u=>{if(x.match){const d={...x.match,endTime:u.target.value};Le({...x,match:d})}else Fe({...q,endTime:u.target.value})},className:"form-input"})]}),p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"match-teams",children:"Équipes"}),p.jsx("input",{id:"match-teams",type:"text",value:x.match?x.match.teams:q.teams,onChange:u=>{if(x.match){const d={...x.match,teams:u.target.value};Le({...x,match:d})}else Fe({...q,teams:u.target.value})},placeholder:"Ex: France vs Brésil",className:"form-input"})]}),p.jsxs("div",{className:"form-group",children:[p.jsx("label",{htmlFor:"match-description",children:"Description"}),p.jsx("input",{id:"match-description",type:"text",value:x.match?x.match.description:q.description,onChange:u=>{if(x.match){const d={...x.match,description:u.target.value};Le({...x,match:d})}else Fe({...q,description:u.target.value})},placeholder:"Ex: Match de qualification",className:"form-input"})]}),p.jsxs("div",{className:"form-actions",children:[p.jsx("button",{className:"add-button",onClick:()=>{x.match?(gc(x.venueId,x.match.id,{date:x.match.date,endTime:x.match.endTime||"",teams:x.match.teams,description:x.match.description}),Mn()):mc(x.venueId)},disabled:x.match?!x.match.date||!x.match.teams||!x.match.description:!q.date||!q.teams||!q.description,children:x.match?"Mettre à jour":"Ajouter"}),p.jsx("button",{className:"cancel-button",onClick:Mn,children:"Annuler"})]})]})]})})]})}$o(document.getElementById("root")).render(p.jsx(P.StrictMode,{children:p.jsx(Gg,{})}));
