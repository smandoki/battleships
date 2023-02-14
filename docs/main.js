(()=>{"use strict";function t(e){const r=[];return e.forEach((e=>{Array.isArray(e)?r.push(t(e)):r.push(e)})),r}class e{#t=0;#e;constructor(t){this.#e=t}hit(){this.isSunk()||this.#t++}isSunk(){return this.#t===this.#e}getLength(){return this.#e}getHitCount(){return this.#t}}class r{#r={};#n;#s=0;constructor(){this.#n=function(t,e){const r=new Array(7);for(let t=0;t<7;t++)r[t]=new Array(7);return r}()}addShip(t,r,n,s){const i=new e(n);for(let e=0;e<n;e++)"row"===s?this.#n[t+e][r]=this.#s:this.#n[t][r+e]=this.#s;this.#r[this.#s++]=i}receiveAttack(t,e){void 0===this.#n[t][e]?this.#n[t][e]="miss":(this.#r[this.#n[t][e]].hit(),this.#n[t][e]="hit")}isValidPlacement(t,e,r,n){for(let s=0;s<r;s++)if("row"===n){if(!this.#i(t+s,e))return!1}else if(!this.#i(t,e+s))return!1;return!0}#i(t,e){return t>=0&&t<7&&e>=0&&e<7&&void 0===this.#n[t][e]}isAllShipsSunk(){if(0===Object.keys(this.#r).length)return!1;for(const[t,e]of Object.entries(this.#r))if(!e.isSunk())return!1;return!0}getBoard(){return t(this.#n)}}const n=function(){const t=["Place your carrier (length: 5)","Place your battleship (length: 4)","Place your cruiser (length: 3)","Place your submarine (length: 3)","Place your destroyer (length: 2)"],e=new r;let n="row",s=[2,3,3,4,5].pop();function i(t){n="row"===n?"col":"row",t.target.innerText="row"===n?"Axis: row":"Axis: column"}function o(t){const r=t.target.dataset.index,i=document.querySelectorAll(".cell");for(const t of i)t.classList.remove("shipPlaceholder");const{x:o,y:l}=function(t){return{y:Math.floor(t/7),x:t%7}}(r);e.isValidPlacement(o,l,s,n)&&function(t,e,r,n,s){const i=document.querySelectorAll(".cell");for(let r=0;r<s;r++){let s;s="row"===n?c(t+r,e):c(t,e+r),i[s].classList.add("shipPlaceholder")}}(o,l,0,n,s)}function c(t,e){return 7*e+t}return{init:function(e){const r=document.createElement("div");r.setAttribute("id","shipPlacementPage");const n=document.createElement("h2");n.innerText=t.shift(),r.appendChild(n);const s=document.createElement("button");s.innerText="Axis: row",s.addEventListener("click",i),r.append(s);const c=document.createElement("div");c.classList.add("grid"),c.style.gridTemplateColumns="repeat(7, 1fr)",c.style.gridTemplateRows="repeat(7, 1fr)";for(let t=0;t<49;t++){const e=document.createElement("div");e.classList.add("cell"),e.dataset.index=t,e.addEventListener("mouseover",o),c.appendChild(e)}r.appendChild(c),e.appendChild(r)}}}(),s=n,i=document.getElementById("root");s.init(i)})();