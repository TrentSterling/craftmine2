import{e as ne}from"./chunk-JVV6DKMW.js";import{b as ke}from"./chunk-26YLDVPV.js";import{a as D,d as ae}from"./chunk-XVCADGWD.js";import{a as Se,d as Me,g as oe}from"./chunk-FEWFQD6B.js";var B=Math.ceil(258.1875)*2048,P=class{constructor(){this.data=new Float32Array(B),this.origin=[0,0,0],this.dimensions=[1,1,1],this.count=0,this.indexBase=1026,this.usedWords=this.indexBase,this.rows=1,this._records=new Float32Array(1024),this._centers=new Float64Array(384),this._bounds=new Float64Array(768),this._counts=new Uint16Array(262144),this._cursors=new Uint32Array(262144),this._active=new Uint32Array(3456),this._pairCells=new Uint32Array(3456),this._pairLights=new Uint8Array(3456),this._activeCount=0,this.stats={assignments:0,nonempty:0,maxCellLights:0,buildMs:0,maxBuildMs:0}}build(e,i){let r=performance.now();if(!Array.isArray(e)||e.length>128)throw new RangeError("Light cluster source capacity exceeded");if(!i||i.length!==3||!Array.from(i).every(Number.isFinite))throw new RangeError("Invalid light cluster eye");let s=1/0,n=1/0,a=1/0,o=-1/0,c=-1/0,f=-1/0;for(let v=0;v<e.length;v++){let x=e[v],b=v*8,g=v*3,k=v*6;if(!x?.relative||x.relative.length!==3||!x.color||x.color.length!==3)throw new RangeError("Invalid light cluster source");let w=Math.fround(x.radius);if(!Number.isFinite(x.radius)||!Number.isFinite(w)||w<=0||w>16)throw new RangeError("Light cluster radius must be greater than zero and at most 16");for(let R=0;R<3;R++){let F=Math.fround(x.relative[R]),A=Math.fround(x.color[R]),C=i[R]+F;if(!Number.isFinite(x.relative[R])||!Number.isFinite(x.color[R])||!Number.isFinite(F)||!Number.isFinite(A)||A<0||!Number.isFinite(C)||Math.abs(C)>Number.MAX_SAFE_INTEGER-16)throw new RangeError("Invalid light cluster source coordinates or color");this._records[b+R]=F,this._records[b+4+R]=A,this._centers[g+R]=C,this._bounds[k+R]=Math.floor((C-w)/16),this._bounds[k+3+R]=Math.ceil((C+w)/16)-1}this._records[b+3]=w,this._records[b+7]=0,s=Math.min(s,this._bounds[k]),n=Math.min(n,this._bounds[k+1]),a=Math.min(a,this._bounds[k+2]),o=Math.max(o,this._bounds[k+3]),c=Math.max(c,this._bounds[k+4]),f=Math.max(f,this._bounds[k+5])}e.length||(s=n=a=o=c=f=0);let l=o-s+1,h=c-n+1,m=f-a+1;if(l>64||h>64||m>64)throw new RangeError("Light cluster grid capacity exceeded");for(let v=0;v<this._activeCount;v++)this._counts[this._active[v]]=0;let p=0,y=0,d=0;for(let v=0;v<e.length;v++){let x=v*3,b=v*6,g=this._centers[x],k=this._centers[x+1],w=this._centers[x+2],R=this._records[v*8+3],F=R*R;for(let A=this._bounds[b+1];A<=this._bounds[b+4];A++)for(let C=this._bounds[b+2];C<=this._bounds[b+5];C++)for(let X=this._bounds[b];X<=this._bounds[b+3];X++){let ge=Math.max(X*16-g,0,g-(X+1)*16),_e=Math.max(A*16-k,0,k-(A+1)*16),Re=Math.max(C*16-w,0,w-(C+1)*16);if(ge*ge+_e*_e+Re*Re>=F)continue;let H=X-s+(C-a)*l+(A-n)*l*m;this._counts[H]||(this._active[p++]=H),d=Math.max(d,++this._counts[H]),this._pairCells[y]=H,this._pairLights[y++]=v}}this._activeCount=p;let u=1024+l*h*m*2,E=u+y,_=Math.ceil(E/2048);this.data.fill(0,0,_*2048),this.data.set(this._records.subarray(0,e.length*8));let T=u;for(let v=0;v<p;v++){let x=this._active[v],b=this._counts[x],g=1024+x*2;this.data[g]=T,this.data[g+1]=b,this._cursors[x]=T,T+=b}for(let v=0;v<y;v++)this.data[this._cursors[this._pairCells[v]]++]=this._pairLights[v];return this.origin[0]=s*16,this.origin[1]=n*16,this.origin[2]=a*16,this.dimensions[0]=l,this.dimensions[1]=h,this.dimensions[2]=m,this.count=e.length,this.indexBase=u,this.usedWords=E,this.rows=_,this.stats.assignments=y,this.stats.nonempty=p,this.stats.maxCellLights=d,this.stats.buildMs=performance.now()-r,this.stats.maxBuildMs=Math.max(this.stats.maxBuildMs,this.stats.buildMs),this}metrics(){return{...this.stats,count:this.count,dimensions:[...this.dimensions],cells:this.dimensions[0]*this.dimensions[1]*this.dimensions[2],usedWords:this.usedWords,rows:this.rows,uploadBytes:this.rows*2048*4,capacityWords:this.data.length}}};var ce=128,at=12,ot=460,we=["dynamicCount","dynamicClusterData","dynamicClusterOffset","dynamicClusterSize","dynamicResident","dynamicWorldCell","dynamicWorldFraction"],Ae=`
uniform int dynamicCount;uniform highp sampler2D dynamicClusterData;
uniform vec3 dynamicClusterOffset,dynamicWorldFraction;uniform ivec3 dynamicClusterSize,dynamicWorldCell;uniform float dynamicResident;
float lightWord(int address){int texel=address/4;return texelFetch(dynamicClusterData,ivec2(texel%512,texel/512),0)[address%4];}
vec4 lightRecord(int address){int texel=address/4;return texelFetch(dynamicClusterData,ivec2(texel%512,texel/512),0);}
vec3 combatVisibility(vec3 start,vec3 end){
 vec3 delta=end-start;float limit=length(delta);if(limit<.04)return vec3(1.0);
 vec3 transmission=vec3(1.0);float cutoff=1.0-.025/limit;
 // Integer cell advancement cannot revisit a rounded boundary on shallow rays.
 // Keep the fractional origin separate from the integer world-cell origin.
 vec3 offset=dynamicResident>.5?dynamicWorldFraction:skyOffset;
 vec3 p=start+offset,local=fract(p),span=max(abs(delta),vec3(1e-20)),terminal=span*cutoff;
 ivec3 cell=ivec3(floor(p)),planes=ivec3(0);
 ivec3 stepCell=ivec3(greaterThan(delta,vec3(0.0)))-ivec3(lessThan(delta,vec3(0.0)));
 vec3 boundary=mix(local,1.0-local,greaterThan(delta,vec3(0.0)));
 if(delta.x==0.0)boundary.x=1e10;if(delta.y==0.0)boundary.y=1e10;if(delta.z==0.0)boundary.z=1e10;
 for(int i=0;i<32;i++){
  int block;
  if(dynamicResident>.5)block=foliageBlockCell(cell+dynamicWorldCell);
  else{
   if(any(lessThan(cell,ivec3(0)))||any(greaterThanEqual(cell,ivec3(64,128,64))))return vec3(0.0);
   block=int(texelFetch(skyField,cell.xzy,0).g*255.0+.5);
  }
  if(block!=0&&(block<70||block>73)){
  if(block==12||block==22)transmission*=vec3(.90,.95,.98);
  else if(block==7||(block>=50&&block<=57))transmission*=vec3(.85,.96,.97);
  else if(block==31)transmission*=vec3(.72,.25,.28);
  else if(block==5||block==60)transmission*=vec3(.55,.8,.45);
  else if(block==63||block==67)transmission*=vec3(.88,.64,.28);
  else if(block==64||block==68)transmission*=vec3(.79,.31,.25);
  else return vec3(0.0);
  }
  // Recompute boundary distances from integer plane counts. Comparing with
  // the segment endpoint avoids a division at every traversed cell.
  vec3 plane=boundary+vec3(planes);
  if(all(greaterThanEqual(plane,terminal)))return transmission;
  // Advance every tied axis, excluding cells touched only at an edge or corner.
  // Compare plane times by cross multiplication. Reciprocal rounding in GPU
  // division can otherwise split an exact edge into a spurious side cell.
  ivec3 advance=ivec3(lessThanEqual(plane*span.yzx,plane.yzx*span))*ivec3(lessThanEqual(plane*span.zxy,plane.zxy*span));
  cell+=advance*stepCell;planes+=advance;
 }return vec3(0.0);
}
vec3 combatLight(vec3 position,vec3 normal){
 if(dynamicCount==0)return vec3(0.0);
 ivec3 cell=ivec3(floor((position+dynamicClusterOffset)/16.0));
 if(any(lessThan(cell,ivec3(0)))||any(greaterThanEqual(cell,dynamicClusterSize)))return vec3(0.0);
 int header=1024+2*(cell.x+cell.z*dynamicClusterSize.x+cell.y*dynamicClusterSize.x*dynamicClusterSize.z);
 int first=int(lightWord(header)),count=int(lightWord(header+1));vec3 light=vec3(0.0),start=position+normal*.025;
 for(int j=0;j<count;j++){
  int index=int(lightWord(first+j));vec4 source=lightRecord(index*8);
  vec3 delta=source.xyz-position;float distance=length(delta),radius=source.w;
  if(distance>=radius||distance<.001)continue;
  float facing=max(dot(normal,delta/distance),0.0);if(facing<=0.0)continue;
  float falloff=pow(1.0-distance/radius,2.0)/(1.0+.18*distance*distance);
  light+=lightRecord(index*8+4).rgb*(facing*falloff)*combatVisibility(start,source.xyz);
 }return light;
}`,Le=(t,e)=>e.score-t.score||(t.id<e.id?-1:t.id>e.id?1:0),Ce=class{constructor(){this.positions=new Float32Array(ce*4),this.colors=new Float32Array(ce*4),this.selected=[],this.count=0,this.candidates=0,this.maxCandidates=0,this.origin=[0,0,0],this.clusters=new P,this.revision=0}begin(e){this.origin=e.position,this.selected.length=0,this.candidates=0,this.dropped=0,this.outOfRange=0}add(e,i,r,s,n){if(i.length!==3||r.length!==3||!i.every(Number.isFinite)||!r.every(Number.isFinite)||!Number.isFinite(s)||!Number.isFinite(n)||s<=0||n<=0)return;s=Math.min(at,s),this.candidates++;let a=i.map((h,m)=>h-this.origin[m]),o=Math.hypot(...a);if(o>s+ot){this.outOfRange++;return}let c=r.map(h=>Math.max(0,h)**2.2*n);if(!c.every(h=>Number.isFinite(Math.fround(h))))return;let f=s*s/(o*o+s*s)*n*Math.max(...r),l={id:e,relative:a,color:c,radius:s,strength:n,score:f};if(this.selected.length<ce)this.selected.push(l);else{let h=0;for(let m=1;m<this.selected.length;m++)Le(this.selected[m],this.selected[h])>0&&(h=m);Le(l,this.selected[h])<0&&(this.selected[h]=l),this.dropped++}}finish(){this.selected.sort((e,i)=>e.id<i.id?-1:e.id>i.id?1:0),this.count=this.selected.length,this.maxCandidates=Math.max(this.maxCandidates,this.candidates);for(let e=0;e<this.count;e++){let i=this.selected[e],r=e*4;this.positions.set([...i.relative,i.radius],r),this.colors.set([...i.color,1],r)}return this.clusters.build(this.selected,this.origin),this.revision++,this}metrics(){return{selected:this.count,candidates:this.candidates,maxCandidates:this.maxCandidates,dropped:this.dropped,outOfRange:this.outOfRange,ids:this.selected.map(e=>e.id),clusters:this.clusters.metrics()}}};var le=["foliageBricks","foliageTable","foliageOrigin","foliageTableOrigin","foliageReady"];function Ie(t){return[t.R8UI,t.R16UI].map((e,i)=>{let r=t.createTexture();return t.activeTexture(t.TEXTURE0+8+i),t.bindTexture(t.TEXTURE_3D,r),t.texStorage3D(t.TEXTURE_3D,1,e,1,1,1),t.texParameteri(t.TEXTURE_3D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_3D,t.TEXTURE_MAG_FILTER,t.NEAREST),r})}function Ue(t,e,i,r,s){let n=i?[i.bricks,i.lookup]:r;for(let a=0;a<2;a++)t.activeTexture(t.TEXTURE0+8+a),t.bindTexture(t.TEXTURE_3D,n[a]),t.uniform1i(e[le[a]],8+a);t.uniform1f(e.foliageReady,i?1:0),t.uniform3f(e.foliageOrigin,...s.position),t.uniform3iv(e.foliageTableOrigin,i?.tableOrigin||[0,0,0])}var he=`
#ifndef VOXEL_OCCUPANCY
#define VOXEL_OCCUPANCY
uniform highp usampler3D foliageBricks,foliageTable;uniform vec3 foliageOrigin;uniform ivec3 foliageTableOrigin;uniform float foliageReady;
int foliageBlockCell(ivec3 cell){
 ivec3 chunk=cell>>ivec3(5),address=chunk-foliageTableOrigin;
 if(cell.y>=128)return 0;
 if(any(lessThan(address,ivec3(0)))||any(greaterThanEqual(address,ivec3(32,4,32))))return -1;
 uint slot=texelFetch(foliageTable,address,0).r;if(slot==0u)return -1;if(slot==65535u)return 0;
 uint s=slot-1u;ivec3 brick=ivec3(int(s%8u),int(s/8u%8u),int(s/64u))*32,local=cell-chunk*32;
 int block=int(texelFetch(foliageBricks,brick+local.xzy,0).r);
 // Small opaque plant pieces cast their actual mesh shadows. Treating their
 // containing voxel as opaque here would create a full-cube lighting wall.
 return block>=70&&block<=73?0:block;
}
int foliageBlock(vec3 p){return foliageBlockCell(ivec3(floor(p)));}
#endif
`,Jt=`
${he}
bool foliageMaterial(int id){return id==5||id==60||id==63||id==64||id==67||id==68;}
vec3 foliagePath(vec3 position,vec3 normal,out vec3 receiver){
 receiver=position;
 bool resident=foliageReady>.5&&lightOverlay<.5;
 if((!resident&&skyCurrent<.5)||sunDirection.y<=0.0)return vec3(0.0);
 vec3 direction=normalize(sunDirection);
 vec3 offset=resident?foliageOrigin:skyOffset;
 vec3 start=lightOverlay>.5?skyOffset:position+offset-normal*.003;
 vec3 p=start,transmission=lightOverlay>.5?vec3(.68,.84,.54):vec3(1.0);bool opening=false;
 vec3 inv=1.0/max(abs(direction),vec3(.000001));
 for(int i=0;i<12;i++){
  ivec3 cell=ivec3(floor(p));
  if(!resident&&(any(lessThan(cell,ivec3(0)))||any(greaterThanEqual(cell,ivec3(64,128,64)))))return vec3(0.0);
  int block=resident?foliageBlock(p):int(texelFetch(skyField,cell.xzy,0).g*255.0+.5);
  if(block==0||block>=70&&block<=73){opening=true;break;}
  if(!foliageMaterial(block)&&block!=59)return vec3(0.0);
  vec3 boundary=floor(p)+step(vec3(0.0),direction);
  vec3 advance=abs(boundary-p)*inv;
  if(abs(direction.x)<.000001)advance.x=1e20;
  if(abs(direction.y)<.000001)advance.y=1e20;
  if(abs(direction.z)<.000001)advance.z=1e20;
  float stepDistance=min(advance.x,min(advance.y,advance.z));
  vec3 absorption=block==63||block==67?vec3(.26,.56,1.15):block==64||block==68?vec3(.25,1.05,1.15):vec3(.65,.28,.95);
  transmission*=exp(-absorption*stepDistance*(block==59?.35:1.0));
  p+=direction*(stepDistance+.002);
 }
 if(!opening)return vec3(0.0);
 float edge=min(min(p.x,p.z),min(64.0-p.x,64.0-p.z));
 receiver=p-offset;return transmission*(resident?1.0:smoothstep(0.0,4.0,edge));
}
// Share one filtered shadow lookup with the ordinary diffuse/specular path.
// Duplicating that kernel in a second lighting function increases link time.
float foliageVisibility(vec3 position,vec3 normal,int material,float sky,out vec3 transmission){
 vec3 receiver=position;transmission=vec3(0.0);
 bool leaf=foliageMaterial(material);
 if(leaf)transmission=foliagePath(position,normal,receiver);
 if(lightOverlay>.5&&!leaf)return min(1.0,sky*3.0);
 bool opening=any(greaterThan(transmission,vec3(0.0)));
 float visibility=sunlight(receiver,opening?normalize(sunDirection):normal);
 transmission*=visibility;return visibility;
}
vec3 foliageLighting(vec3 normal,vec3 view,vec3 albedo,vec3 transmission){
 float back=clamp((.5-dot(normal,sunDirection))/1.5,0.0,1.0);
 float forward=pow(max(dot(-view,sunDirection),0.0),3.0);
 return albedo*sunRadiance()*transmission*(.22+.85*forward)*(.35+.65*back)*dayCycle.y;
}
`;var S=64,de=S**3,$=128,fe=S*S*$,De=(t,e,i)=>t+i*S+e*S*S;function Y(t){return t.map((e,i)=>i===1?Math.max(0,Math.min(64,Math.floor(e/8)*8-32)):Math.floor(e/8)*8-32)}function ue(t,e,i=!1){let r=i?new Uint8Array(de).fill(10):null,s=[];for(let n=Math.floor(e[1]/32);n<=Math.floor((e[1]+63)/32);n++)for(let a=Math.floor(e[2]/32);a<=Math.floor((e[2]+63)/32);a++)for(let o=Math.floor(e[0]/32);o<=Math.floor((e[0]+63)/32);o++){let c=t.chunks.get(`${o},${n},${a}`);if(s.push(c?`${c.lightIncarnation??c.incarnation}:${c.contentRevision??c.revision}:${!!c.data}`:"-"),!r||!c?.data)continue;let f=o*32-e[0],l=n*32-e[1],h=a*32-e[2],m=Math.max(0,-f),p=Math.min(32,64-f);for(let y=Math.max(0,-l);y<Math.min(32,64-l);y++)for(let d=Math.max(0,-h);d<Math.min(32,64-h);d++)r.set(c.data.subarray(m+d*32+y*1024,p+d*32+y*1024),De(f+m,l+y,h+d))}return{key:e.join(",")+"|"+s.join("/"),blocks:r}}function j(t,e,i=!1){let r=i?new Uint8Array(fe).fill(10):null,s=[];for(let n=0;n<128/32;n++)for(let a=Math.floor(e[2]/32);a<=Math.floor((e[2]+63)/32);a++)for(let o=Math.floor(e[0]/32);o<=Math.floor((e[0]+63)/32);o++){let c=t.chunks.get(`${o},${n},${a}`);if(s.push(c?`${c.lightIncarnation??c.incarnation}:${c.contentRevision??c.revision}:${!!c.data}`:"-"),!r||!c?.data)continue;let f=o*32-e[0],l=a*32-e[2],h=Math.max(0,-f),m=Math.min(32,64-f);for(let p=0;p<32;p++)for(let y=Math.max(0,-l);y<Math.min(32,64-l);y++)r.set(c.data.subarray(h+y*32+p*1024,m+y*32+p*1024),De(f+h,n*32+p,l+y))}return{key:`${e[0]},${e[2]}|`+s.join("/"),blocks:r}}var M=34,fi=M**3,U=64,ct=U**3,V=16,ui=V-1,lt=Math.floor((Number.MAX_SAFE_INTEGER-U)/32),Ne=(t,e,i,r)=>t+i*r+e*r*r,ht=t=>t===48||t===58||t===62?14:t===25?11:0;function ze(t){if(t==null)return!1;if(!(t instanceof Uint8Array)||t.length!==32768)throw new TypeError("Invalid light source chunk");for(let e=0;e<t.length;e++)if(ht(t[e]))return!0;return!1}function q(t,e,i,r,s=!1){if(!t?.chunks||typeof t.chunks.get!="function"||![e,i,r].every(f=>Number.isSafeInteger(f)&&Math.abs(f)<=lt))throw new TypeError("Invalid light brick region");let n=[e*32-V,i*32-V,r*32-V],a=s?new Uint8Array(ct).fill(oe.BEDROCK):null,o=[];for(let f=i-1;f<=i+1;f++)for(let l=r-1;l<=r+1;l++)for(let h=e-1;h<=e+1;h++){let m=h*32-n[0],p=f*32-n[1],y=l*32-n[2],d=Math.max(0,-m),u=Math.min(32,U-m),E=Math.max(0,-p),_=Math.min(32,U-p),T=Math.max(0,-y),v=Math.min(32,U-y);if(f<0){o.push("floor");continue}if(f*32>=128){if(o.push("sky"),a)for(let b=E;b<_;b++)for(let g=T;g<v;g++){let k=Ne(m+d,p+b,y+g,U);a.fill(oe.AIR,k,k+u-d)}continue}let x=t.chunks.get(D(h,f,l))||t.lightSupport?.get(D(h,f,l));if(o.push(x?`${x.lightIncarnation??x.incarnation}:${x.contentRevision??x.revision}:${x.data?1:0}`:"missing"),!(!a||!x?.data)){if(!(x.data instanceof Uint8Array)||x.data.length!==32768)throw new TypeError("Invalid resident light chunk");for(let b=E;b<_;b++)for(let g=T;g<v;g++)a.set(x.data.subarray(ae(d,b,g),ae(u,b,g)),Ne(m+d,p+b,y+g,U))}}let c=D(e,i,r);return{key:`lb1|${t.epoch??0}:${t.seed??0}:${t.generator??0}|${c}|${o.join("/")}`,chunkKey:c,chunk:[e,i,r],origin:n,blocks:a}}var K=class{constructor(e,i,{maxChunks:r=1024}={}){if(!Number.isSafeInteger(r)||r<1||r>65534)throw new RangeError("Light brick maxChunks must be an integer from 1 through 65534");let s=e.getParameter(e.MAX_3D_TEXTURE_SIZE),n=Math.min(8,Math.floor(s/M)),a=Math.floor((s-65)/M);if(n*M<64||(n*M)**2<4096*2||a<1)throw Error("Insufficient 3D texture capacity for light header, fallback and bricks");this.gl=e,this.store=i,this.records=new Map,this.scan=new Set,this.dirty=new Set,this.texture=null,this.pending=null,this.generation=0,this.origin=[0,0,0],this.eye=[0,0,0],this.headerDirty=!0,this.closed=!1,this.worldIdentity=null,this.grid=n,this.layers=Math.min(a,Math.floor(65534/n**2),Math.max(16,Math.ceil(r/n**2))),this.capacity=n**2*this.layers,this.size=[n*M,n*M,65+M*this.layers],this.free=Array.from({length:this.capacity},(o,c)=>this.capacity-1-c),this.header=new Uint8Array(this.size[0]*this.size[1]),this.stats={jobs:0,rejected:0,bytes:0,maxCopyMs:0,maxUploadMs:0,maxWorkerMs:0,maxUpdateMs:0,overflow:0,error:null},this.worker=new Worker(new URL("../world/light.worker.js",import.meta.url),{type:"module"}),this.worker.onmessage=({data:o})=>this.receive(o),this.worker.onerror=o=>{this.stats.error=o.message,this.pending=null}}get current(){return!this.stats.error&&!this.pending&&!this.scan.size&&!this.dirty.size}metrics(){return{...this.stats,current:this.current,pending:!!this.pending,dirty:this.dirty.size,unscanned:this.scan.size,resident:this.records.size,support:[...this.records.values()].filter(e=>e.support).length,ready:[...this.records.values()].filter(e=>e.valid).length,published:[...this.records.values()].filter(e=>e.published).length,stale:[...this.records.values()].filter(e=>e.published&&!e.valid).length,lit:this.capacity-this.free.length,capacity:this.capacity,deferred:[...this.records.values()].filter(e=>e.deferred).length,generation:this.generation}}releaseSlot(e){e.slot!==void 0&&(this.free.push(e.slot),e.slot=void 0)}invalidate(e,i=!1){e&&((i||e.support)&&(this.releaseSlot(e),e.published=!1,e.key=null,this.headerDirty=!0),e.valid=!1,e.deferred=!1,e.support?this.dirty.delete(e.id):this.dirty.add(e.id))}neighbors(e,i,r,s){for(let n=Math.max(0,i-1);n<=Math.min(3,i+1);n++)for(let a=r-1;a<=r+1;a++)for(let o=e-1;o<=e+1;o++)s(this.records.get(D(o,n,a)))}sync(){let e=`${this.store.epoch}:${this.store.seed}:${this.store.generator}`;if(this.worldIdentity!==e){for(let r of this.records.values())this.invalidate(r,!0);this.records.clear(),this.scan.clear(),this.dirty.clear(),this.worldIdentity=e,this.headerDirty=!0}let i=new Set;for(let r of[...this.store.chunks.values(),...this.store.lightSupport?.values()||[]]){if(!r.data||r.cy<0||r.cy>3)continue;i.add(r.key);let s=`${e}:${r.lightIncarnation??r.incarnation}`,n=`${s}:${r.contentRevision??r.revision}`,a=this.records.get(r.key),o=r.lightSupport===!0;if(a?.signature===n&&(a.data===r.data||r.lightIncarnation!==void 0)){a.data=r.data,a.support!==o&&(a.support=o,this.invalidate(a,!0));continue}a?a.identity!==s&&this.invalidate(a,!0):(a={id:r.key,cx:r.cx,cy:r.cy,cz:r.cz,has:!1,scanned:!1,valid:!1,published:!1},this.records.set(r.key,a)),a.support=o,a.identity=s,a.signature=n,a.data=r.data,a.scanned=!1,a.has=!1,this.scan.add(r.key),this.neighbors(r.cx,r.cy,r.cz,c=>this.invalidate(c))}for(let[r,s]of this.records)i.has(r)||(this.invalidate(s,!0),this.records.delete(r),this.scan.delete(r),this.dirty.delete(r),this.neighbors(s.cx,s.cy,s.cz,n=>this.invalidate(n)))}allocate(){if(this.texture)return;if(this.capacity===0)throw Error("Insufficient 3D texture capacity for light bricks");let e=this.gl,i=e.createTexture();e.activeTexture(e.TEXTURE4),e.bindTexture(e.TEXTURE_3D,i),e.texStorage3D(e.TEXTURE_3D,1,e.R8,...this.size);for(let r of[e.TEXTURE_MIN_FILTER,e.TEXTURE_MAG_FILTER])e.texParameteri(e.TEXTURE_3D,r,e.LINEAR);for(let r of[e.TEXTURE_WRAP_S,e.TEXTURE_WRAP_T,e.TEXTURE_WRAP_R])e.texParameteri(e.TEXTURE_3D,r,e.CLAMP_TO_EDGE);this.texture=i,this.stats.bytes=this.size.reduce((r,s)=>r*s,1),this.headerDirty=!0,this.fallback&&this.setFallback(this.fallback)}setFallback(e){if(this.fallback=e,!this.texture)return;let i=this.gl;i.activeTexture(i.TEXTURE4),i.bindTexture(i.TEXTURE_3D,this.texture),i.texSubImage3D(i.TEXTURE_3D,0,0,0,1,64,64,64,i.RED,i.UNSIGNED_BYTE,e)}uploadHeader(){if(!this.texture||!this.headerDirty)return;this.header.fill(0);for(let r of this.records.values()){if(!r.published||r.support)continue;let s=r.cx-this.origin[0],n=r.cy,a=r.cz-this.origin[2];if(s<0||s>=32||a<0||a>=32)continue;let o=(s+n*32+a*128)*2,c=r.slot===void 0?65535:r.slot+1;this.header[o]=c&255,this.header[o+1]=c>>8}let e=this.gl;e.activeTexture(e.TEXTURE4),e.bindTexture(e.TEXTURE_3D,this.texture);let i=e.getParameter(e.UNPACK_ALIGNMENT);e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage3D(e.TEXTURE_3D,0,0,0,0,this.size[0],this.size[1],1,e.RED,e.UNSIGNED_BYTE,this.header),e.pixelStorei(e.UNPACK_ALIGNMENT,i),this.headerDirty=!1,this.generation++}receive(e){if(this.closed)return;let i=this.pending;if(this.pending=null,e.error){this.stats.error=e.error;return}this.stats.jobs++,this.stats.maxWorkerMs=Math.max(this.stats.maxWorkerMs,e.ms);let r=i&&this.records.get(i.id);if(!r||r.support||!this.store.chunks.has(i.id)||e.key!==i.key||e.key!==q(this.store,r.cx,r.cy,r.cz).key){this.stats.rejected++,r&&this.invalidate(r);return}let s=performance.now();if(e.empty)this.releaseSlot(r);else{if(r.slot===void 0&&!this.free.length){this.stats.overflow++;let c=l=>(l.cx*32+16-this.eye[0])**2+(l.cy*32+16-this.eye[1])**2+(l.cz*32+16-this.eye[2])**2,f=null;for(let l of this.records.values())l.slot!==void 0&&(!f||c(l)>c(f))&&(f=l);if(!f||c(f)<=c(r)*1.1){r.deferred=!0;return}this.invalidate(f,!0),f.deferred=!0}this.allocate();let n=r.slot??this.free.pop();r.slot=n;let a=this.gl;a.activeTexture(a.TEXTURE4),a.bindTexture(a.TEXTURE_3D,this.texture);let o=a.getParameter(a.UNPACK_ALIGNMENT);a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texSubImage3D(a.TEXTURE_3D,0,n%this.grid*M,Math.floor(n/this.grid)%this.grid*M,65+Math.floor(n/(this.grid*this.grid))*M,M,M,M,a.RED,a.UNSIGNED_BYTE,e.values),a.pixelStorei(a.UNPACK_ALIGNMENT,o)}r.valid=!0,r.published=!0,r.key=e.key,this.dirty.delete(r.id),this.headerDirty=!0,this.uploadHeader(),this.stats.maxUploadMs=Math.max(this.stats.maxUploadMs,performance.now()-s)}update(e){if(this.closed)return;let i=performance.now();this.eye=e.position;let r=[Math.floor(this.eye[0]/32)-16,0,Math.floor(this.eye[2]/32)-16],s=Math.floor(this.eye[1]/32);if(r[0]!==this.origin[0]||r[2]!==this.origin[2]||s!==this.eyeChunkY){this.origin=r,this.eyeChunkY=s,this.headerDirty=!0;for(let l of this.records.values())l.deferred=!1}if(this.sync(),this.stats.error){for(let l of this.records.values())!l.valid&&l.published&&this.invalidate(l,!0);this.uploadHeader();return}let n=0;for(let l of this.scan){let h=this.records.get(l);if(this.scan.delete(l),h&&(h.has=ze(h.data),h.scanned=!0,this.neighbors(h.cx,h.cy,h.cz,m=>{m&&!m.valid&&!m.support&&this.dirty.add(m.id)})),++n>=8)break}let a=null,o=1/0,c=null,f=1/0;for(let l of this.dirty){let h=this.records.get(l);if(!h||h.support){this.dirty.delete(l);continue}let m=!1,p=!1;if(this.neighbors(h.cx,h.cy,h.cz,d=>{d&&(m||=!d.scanned,p||=d.has)}),m)continue;if(!p){this.releaseSlot(h),h.valid=!0,h.published=!0,h.key=q(this.store,h.cx,h.cy,h.cz).key,this.dirty.delete(l),this.headerDirty=!0;continue}if(this.pending?.id===l)continue;let y=(h.cx*32+16-this.eye[0])**2+(h.cy*32+16-this.eye[1])**2+(h.cz*32+16-this.eye[2])**2;if(h.deferred&&!this.free.length){y<f&&(c=h,f=y);continue}h.deferred=!1,y<o&&(a=h,o=y)}if(this.free.length&&c&&f<o&&(a=c,c.deferred=!1),this.uploadHeader(),a&&!this.pending){let l=performance.now(),h=q(this.store,a.cx,a.cy,a.cz,!0);this.stats.maxCopyMs=Math.max(this.stats.maxCopyMs,performance.now()-l),this.pending={id:a.id,key:h.key},this.worker.postMessage({kind:"brick",key:h.key,blocks:h.blocks},[h.blocks.buffer])}this.stats.maxUpdateMs=Math.max(this.stats.maxUpdateMs,performance.now()-i)}dispose(){this.closed||(this.closed=!0,this.worker.terminate(),this.texture&&this.gl.deleteTexture(this.texture),this.records.clear(),this.scan.clear(),this.dirty.clear())}};var G=class{constructor(e){this.gl=e,this.texture=e.createTexture(),this.occupancy=Ie(e),this.rows=0,this.revision=-1,this.source=null,this.closed=!1,this.stats={bytes:16,uploadBytes:0,uploads:0,maxUploadMs:0},e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,1,1,0,e.RGBA,e.FLOAT,new Float32Array(4));for(let i of[e.TEXTURE_MIN_FILTER,e.TEXTURE_MAG_FILTER])e.texParameteri(e.TEXTURE_2D,i,e.NEAREST);for(let i of[e.TEXTURE_WRAP_S,e.TEXTURE_WRAP_T])e.texParameteri(e.TEXTURE_2D,i,e.CLAMP_TO_EDGE)}bind(e){let i=this.gl;if(i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texture),!e?.count||this.source===e&&this.revision===e.revision)return;let r=performance.now(),s=e.clusters;this.rows||(this.rows=B/2048,i.texImage2D(i.TEXTURE_2D,0,i.RGBA32F,512,this.rows,0,i.RGBA,i.FLOAT,null),this.stats.bytes=B*4),i.texSubImage2D(i.TEXTURE_2D,0,0,0,512,s.rows,i.RGBA,i.FLOAT,s.data),this.source=e,this.revision=e.revision,this.stats.uploadBytes=s.rows*2048*4,this.stats.uploads++,this.stats.maxUploadMs=Math.max(this.stats.maxUploadMs,performance.now()-r)}dispose(){if(!this.closed){this.closed=!0;for(let e of[this.texture,...this.occupancy])this.gl.deleteTexture(e)}}};var Mi=["lightField","lightOffset","lightEnabled","lightOverlay","lightBrickMode","lightBrickGrid","lightBrickOffset","lightAtlasSize","skyField","skyOffset","skyCurrent",...le,...we],ki=`
precision highp int;
uniform highp sampler3D lightField;uniform vec3 lightOffset;uniform float lightEnabled;uniform float lightOverlay;
uniform int lightBrickGrid;uniform float lightBrickMode;uniform vec3 lightBrickOffset;uniform vec3 lightAtlasSize;
uniform highp sampler3D skyField;uniform vec3 skyOffset;uniform float skyCurrent;
${he}
${Ae}
float skyVisibility(vec3 position,vec3 normal){
  if(lightEnabled<.5)return 1.0;
  vec3 p=lightOverlay>.5?skyOffset:position+normal*.55+skyOffset;
  vec3 uv=p.xzy/vec3(64,64,128);if(any(lessThan(uv,vec3(0)))||any(greaterThan(uv,vec3(1))))return 1.0;
  float edge=min(min(p.x,p.z),min(64.0-p.x,64.0-p.z));
  return mix(1.0,pow(texture(skyField,uv).r,1.35),smoothstep(0.0,4.0,edge));
}
vec3 staticLocalLight(vec3 position,vec3 normal){
  if(lightEnabled<.5)return vec3(0);
  vec3 dynamic=vec3(0.0);
  if(lightBrickMode>.5){
    vec3 p=lightOverlay>.5?lightBrickOffset:position+normal*.55+lightBrickOffset;
    ivec3 cell=ivec3(floor(p/32.0));
    if(all(greaterThanEqual(cell,ivec3(0)))&&all(lessThan(cell,ivec3(32,4,32)))){
      int address=(cell.x+cell.y*32+cell.z*128)*2,w=int(lightAtlasSize.x);
      int lo=int(texelFetch(lightField,ivec3(address%w,address/w,0),0).r*255.0+.5);
      address++;int hi=int(texelFetch(lightField,ivec3(address%w,address/w,0),0).r*255.0+.5);
      int entry=lo+hi*256;if(entry==65535)return dynamic;
      if(entry>0){int slot=entry-1,g=lightBrickGrid;vec3 base=vec3((slot%g)*34,((slot/g)%g)*34,65+(slot/(g*g))*34);
        vec3 local=p-vec3(cell)*32.0;float value=texture(lightField,(base+(local+1.0).xzy)/lightAtlasSize).r;
        return vec3(1.45,.92,.38)*pow(clamp(value*(255.0/238.0),0.0,1.0),1.35)+dynamic;
      }
    }
  }
  if(lightBrickMode>.5&&skyCurrent<.5)return dynamic;
  vec3 p=lightOverlay>.5?lightOffset:position+normal*.55+lightOffset;
  vec3 uv=p.xzy/64.0;if(any(lessThan(uv,vec3(0)))||any(greaterThan(uv,vec3(1))))return dynamic;
  float edge=min(min(min(p.x,p.y),p.z),min(min(64.0-p.x,64.0-p.y),64.0-p.z));
  if(lightBrickMode>.5)uv=(p.xzy+vec3(0,0,1))/lightAtlasSize;
  float strength=pow(clamp(texture(lightField,uv).r*(255.0/238.0),0.0,1.0),1.35)*smoothstep(0.0,4.0,edge);
  return vec3(1.45,.92,.38)*strength+dynamic;
}
vec3 localLight(vec3 position,vec3 normal){return staticLocalLight(position,normal)+combatLight(position,normal);}
`,Z=new WeakMap;function Li(t,e){Z.get(e)?.dispose(),Z.delete(e),t.deleteTexture(e)}function dt(t,e=1){let i=t.createTexture();t.activeTexture(t.TEXTURE4),t.bindTexture(t.TEXTURE_3D,i),t.texImage3D(t.TEXTURE_3D,0,t.R8,e,e,e,0,t.RED,t.UNSIGNED_BYTE,new Uint8Array(e**3));for(let r of[t.TEXTURE_MIN_FILTER,t.TEXTURE_MAG_FILTER])t.texParameteri(t.TEXTURE_3D,r,t.LINEAR);for(let r of[t.TEXTURE_WRAP_S,t.TEXTURE_WRAP_T,t.TEXTURE_WRAP_R])t.texParameteri(t.TEXTURE_3D,r,t.CLAMP_TO_EDGE);return i}function ft(t){let e=t.createTexture();t.activeTexture(t.TEXTURE7),t.bindTexture(t.TEXTURE_3D,e),t.texImage3D(t.TEXTURE_3D,0,t.RG8,S,S,$,0,t.RG,t.UNSIGNED_BYTE,null);for(let i of[t.TEXTURE_MIN_FILTER,t.TEXTURE_MAG_FILTER])t.texParameteri(t.TEXTURE_3D,i,t.LINEAR);for(let i of[t.TEXTURE_WRAP_S,t.TEXTURE_WRAP_T,t.TEXTURE_WRAP_R])t.texParameteri(t.TEXTURE_3D,i,t.CLAMP_TO_EDGE);return e}function Ci(t,e,i,r,s,n=!1,a=i?.scene){let o=i?.bricks,c=o?.texture;if(t.activeTexture(t.TEXTURE4),t.bindTexture(t.TEXTURE_3D,c||i?.texture||r),t.uniform1i(e.lightField,4),t.uniform1f(e.lightEnabled,i?.ready?1:0),t.uniform1f(e.lightOverlay,n?1:0),t.uniform1f(e.lightBrickMode,c?1:0),c){t.uniform1i(e.lightBrickGrid,o.grid);let p=n&&i.eye?i.eye:s.position;t.uniform3f(e.lightBrickOffset,p[0]-o.origin[0]*32,p[1],p[2]-o.origin[2]*32),t.uniform3f(e.lightAtlasSize,...o.size)}t.activeTexture(t.TEXTURE7),t.bindTexture(t.TEXTURE_3D,i?.skyTexture||r),t.uniform1i(e.skyField,7),t.uniform1f(e.skyCurrent,i?.occupancyCurrent?1:0);let f=i?.clusterAtlas;f||(f=Z.get(r),f||(f=new G(t),Z.set(r,f)));let l=i?.dynamic,h=(a||i?.ready&&i.dynamicValid)&&l?.count;f.bind(h?l:null),t.uniform1i(e.dynamicClusterData,0),t.uniform1i(e.dynamicCount,h?l.count:0),t.uniform1f(e.dynamicResident,a?1:0);let m=n&&i?.eye?i.eye:s.position;if(t.uniform3iv(e.dynamicWorldCell,m.map(Math.floor)),t.uniform3f(e.dynamicWorldFraction,...m.map(p=>p-Math.floor(p))),Ue(t,e,a,f.occupancy,{position:m}),h&&(t.uniform3f(e.dynamicClusterOffset,...m.map((p,y)=>p-l.clusters.origin[y])),t.uniform3iv(e.dynamicClusterSize,l.clusters.dimensions)),i?.ready){let p=n&&i.eye?i.eye:s.position;t.uniform3f(e.lightOffset,...p.map((y,d)=>y-i.origin[d])),t.uniform3f(e.skyOffset,p[0]-i.origin[0],p[1],p[2]-i.origin[2])}}var Ge=class{key(e){return ue(this.store,e).key+"|sky:"+j(this.store,e).key}get current(){return this.ready&&!!this.eye&&this.last===this.key(Y(this.eye))}constructor(e,i,r={}){this.gl=e,this.store=i,this.clusterAtlas=new G(e),this.bricks=new K(e,i,r),this.texture=dt(e,S),this.skyTexture=ft(e),this.ready=!1,this.origin=[0,0,0],this.next=0,this.pending=!1,this.wanted="",this.last="",this.closed=!1,this.stats={jobs:0,rejected:0,bytes:de,skyBytes:fe*2,maxCopyMs:0,maxUploadMs:0,maxWorkerMs:0,visits:0,skyVisits:0,error:null},this.worker=new Worker(new URL("../world/light.worker.js",import.meta.url),{type:"module"}),this.worker.onmessage=({data:s})=>{if(this.closed)return;if(this.pending=!1,s.error){this.stats.error=s.error;return}if(this.stats.jobs++,this.stats.maxWorkerMs=Math.max(this.stats.maxWorkerMs,s.ms),this.stats.visits=s.visits,this.stats.skyVisits=s.skyVisits,s.key!==this.wanted||s.key!==this.key(Y(this.eye))){this.stats.rejected++,this.next=0;return}let n=performance.now();e.activeTexture(e.TEXTURE4),e.bindTexture(e.TEXTURE_3D,this.texture),e.texSubImage3D(e.TEXTURE_3D,0,0,0,0,S,S,S,e.RED,e.UNSIGNED_BYTE,s.values),e.activeTexture(e.TEXTURE7),e.bindTexture(e.TEXTURE_3D,this.skyTexture),e.texSubImage3D(e.TEXTURE_3D,0,0,0,0,S,S,$,e.RG,e.UNSIGNED_BYTE,s.sky),this.stats.maxUploadMs=Math.max(this.stats.maxUploadMs,performance.now()-n),this.bricks.setFallback(s.values),this.origin=s.origin,this.last=s.key,this.skyKey=s.skyKey,this.ready=!0,this.dynamicValid=!0},this.worker.onerror=s=>{this.stats.error=s.message,this.pending=!1}}update(e,i){if(this.bricks.update(e),this.stats.brickCurrent=this.bricks.current,this.stats.bricks=this.bricks.metrics(),this.eye=e.position,this.occupancyCurrent=this.ready&&this.skyKey===j(this.store,this.origin).key,this.dynamicValid=!!(this.scene||this.occupancyCurrent)&&this.dynamic?.count>0,this.clusterAtlas.bind(this.dynamic),this.stats.clusters={...this.clusterAtlas.stats},i<this.next||this.stats.error)return;this.next=i+150;let r=Y(e.position),s=this.key(r);if(this.wanted=s,this.pending||s===this.last)return;let n=performance.now(),{blocks:a}=ue(this.store,r,!0),o=j(this.store,r,!0),c=o.blocks;this.stats.maxCopyMs=Math.max(this.stats.maxCopyMs,performance.now()-n),this.pending=!0,this.worker.postMessage({key:s,origin:r,blocks:a,skyBlocks:c,skyKey:o.key},[a.buffer,c.buffer])}dispose(){this.clusterAtlas.dispose(),this.bricks.dispose(),this.closed=!0,this.worker.terminate(),this.gl.deleteTexture(this.texture),this.gl.deleteTexture(this.skyTexture)}};function ut(t){return Number.isFinite(t)&&t>=0&&t<600}var Q=(t,e,i)=>{let r=Math.max(0,Math.min(1,(i-t)/(e-t)));return r*r*(3-2*r)},mt=[3.2,2.75,2.1],pt=[4.2,1.75,.57],vt=[.13,.19,.34];function me(t,e,i){let r=t.map(c=>-c),s=Q(0,.12,t[1])*e,n=Q(0,.12,r[1])*(1-e),a=mt.map((c,f)=>(c+(pt[f]-c)*i)*s),o=vt.map(c=>c*n);return{moon:r,light:t[1]>=0?t:r,sunStrength:s,moonStrength:n,sunRadiance:a,moonRadiance:o,lightRadiance:a.map((c,f)=>c+o[f])}}function Ai(t){let e=(t%600+600)%600/600,i=e*Math.PI*2,r=[Math.cos(i)*.9,Math.sin(i)*.85,-.45],s=Math.hypot(...r);for(let o=0;o<3;o++)r[o]/=s;let n=Q(-.12,.28,r[1]),a=(1-Q(.03,.4,Math.abs(r[1])))*n;return{time:t,phase:e,daylight:n,dusk:a,sun:r,...me(r,n,a),night:n<.25}}function Ii(t){if(t==null)return null;if(!ut(t.dayTime))throw new Error("Invalid saved day cycle");return{dayTime:t.dayTime}}var ve=192,He=4096,yt=512,N=[-.45,.68,-.58],xt=Math.hypot(...N);for(let t=0;t<3;t++)N[t]/=xt;var Ni=["shadowMap","shadowNearMap","shadowMatrix","shadowNearMatrix","shadowFarMatrix","shadowOffset","shadowEnabled","shadowParams","shadowFarParams"],Oi=`
uniform highp sampler2DArray shadowMap;uniform highp sampler2D shadowNearMap;
uniform mat4 shadowMatrix,shadowNearMatrix,shadowFarMatrix;uniform vec3 shadowOffset;uniform float shadowEnabled;uniform vec3 shadowParams,shadowFarParams;
float shadowFilter(int layer,vec3 p,vec3 plane,vec3 params){
  float size=params.x,extent=params.y,depth=params.z,planeScale=(extent/depth)*(extent/depth);
  // Geometric back faces must not acquire sunlight from perturbed normals.
  if(plane.z>=-1e-7)return 0.0;
  // Offset the receiver over this filter's two-texel footprint at grazing
  // angles. Scale in world units per cascade; do not inflate depth bias.
  float facing=clamp(-plane.z*depth,0.0,1.0);
  p+=plane*(extent/size*2.0)*(1.0-facing);
  // Near parallel planes project beyond their finite face into unrelated
  // geometry. Use the offset receiver depth when that projection degenerates.
  vec2 slope=-planeScale*plane.xy/plane.z*smoothstep(.01,.04,facing);
  float light=0.0;vec2 base=floor(p.xy*size-.5);
  // Continuous tent weights replace floor-snapped PCF. Every comparison uses
  // this receiver's plane at the sampled texel, including cascade scale.
  for(int y=-1;y<=2;y++)for(int x=-1;x<=2;x++){
    vec2 texel=base+vec2(x,y)+.5,delta=texel-p.xy*size;
    vec2 weight=max(vec2(0.0),vec2(2.0)-abs(delta));
    float receiver=p.z+dot(slope,delta/size);
    float caster=layer<0?texture(shadowNearMap,texel/size).r:texture(shadowMap,vec3(texel/size,float(layer))).r;
    // Empty sky is never an occluder, even when a grazing plane extrapolates
    // beyond the shadow camera's far depth.
    light+=weight.x*weight.y*(caster>=1.0?1.0:step(receiver-.000015*(192.0/depth),caster));
  }
  return light/16.0;
}
float shadowCoverage(vec3 p){return 1.0-smoothstep(.42,.49,max(max(abs(p.x-.5),abs(p.y-.5)),abs(p.z-.5)));}
float sunlight(vec3 position,vec3 normal){
  if(shadowEnabled<.5)return 1.0;
  vec4 point=vec4(position+shadowOffset,1.0);
  vec3 near=(shadowNearMatrix*point).xyz*.5+.5;
  float boundary=max(abs(near.x-.5),abs(near.y-.5));
  float nearWeight=(1.0-smoothstep(.38,.47,boundary))*(1.0-smoothstep(.42,.49,abs(near.z-.5)));
  vec3 p=vec3(0.0),far=vec3(0.0);float middleWeight=0.0,farWeight=0.0;
  int lastCascade=0;
  if(nearWeight<1.0){
    p=(shadowMatrix*point).xyz*.5+.5;middleWeight=shadowCoverage(p);lastCascade=1;
    if(middleWeight<1.0){far=(shadowFarMatrix*point).xyz*.5+.5;farWeight=shadowCoverage(far);lastCascade=2;}
  }
  float closeLight=1.0,middleLight=1.0,farLight=1.0;
  // One filter call retains the same cascades, sixteen taps and blending order.
  // Its runtime bound avoids inlining the whole PCF kernel at three call sites.
  for(int cascade=0;cascade<=lastCascade;cascade++){
    float weight=cascade==0?nearWeight:cascade==1?middleWeight:farWeight;
    if(weight<=0.0)continue;
    vec3 samplePosition,plane,params;
    if(cascade==0){samplePosition=near;plane=mat3(shadowNearMatrix)*normal;params=vec3(1024.0,16.0,512.0);}
    else if(cascade==1){samplePosition=p;plane=mat3(shadowMatrix)*normal;params=shadowParams;}
    else{samplePosition=far;plane=mat3(shadowFarMatrix)*normal;params=shadowFarParams;}
    float value=shadowFilter(cascade-1,samplePosition,plane,params);
    if(cascade==0)closeLight=value;
    else if(cascade==1)middleLight=value;
    else farLight=mix(1.0,value,farWeight);
  }
  if(nearWeight>=1.0)return closeLight;
  if(middleWeight>=1.0)return mix(middleLight,closeLight,nearWeight);
  return mix(mix(farLight,middleLight,middleWeight),closeLight,nearWeight);
}`,Tt=`#version 300 es
precision highp float;layout(location=0) in vec3 position;uniform mat4 viewProjection;uniform vec3 offset;void main(){gl_Position=viewProjection*vec4(position+offset,1);}`,Et=`#version 300 es
precision highp float;layout(location=0) in vec3 corner;layout(location=2) in vec3 center;layout(location=3) in vec3 size;layout(location=5) in float yaw;layout(location=6) in float pitch;uniform mat4 viewProjection;uniform vec3 instanceOffset;
void main(){vec3 p=corner*size;float sp=sin(pitch),cp=cos(pitch);p.yz=mat2(cp,sp,-sp,cp)*p.yz;float s=sin(yaw),c=cos(yaw);p.xz=mat2(c,-s,s,c)*p.xz;gl_Position=viewProjection*vec4(p+center+instanceOffset,1);}`,Pe=`#version 300 es
precision highp float;void main(){}`;function bt(t,e=N,i=ve,r=192){let[s,n,a]=e,o=Math.hypot(s,a),c=o>1e-8?[a/o,0,-s/o]:[1,0,0],f=[n*c[2],a*c[0]-s*c[2],-n*c[0]];t.fill(0);for(let l=0;l<3;l++)t[l*4]=c[l]/i,t[l*4+1]=f[l]/i,t[l*4+2]=-e[l]/r;return t[15]=1,t}function gt(t,e,i,r,s,n,a){bt(t,e,i,r);for(let o=0;o<3;o++){let c=0,f=0;for(let l=0;l<3;l++)c+=t[l*4+o]*(s[l]-n[l]),f+=t[l*4+o]*n[l];t[12+o]=c+(o<2?(f*a*.5-Math.round(f*a*.5))/(a*.5):0)}return t}function Ye(t,e){let i=t.createTexture();if(!i)throw new Error("Shadow texture unavailable");try{return t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,0,t.DEPTH_COMPONENT24,e,e,0,t.DEPTH_COMPONENT,t.UNSIGNED_INT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),i}catch(r){throw t.deleteTexture(i),r}}function je(t,e){let i=t.createTexture();if(!i)throw new Error("Shadow texture unavailable");try{t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D_ARRAY,i),t.texStorage3D(t.TEXTURE_2D_ARRAY,1,t.DEPTH_COMPONENT24,e,e,2);for(let[r,s]of[[t.TEXTURE_MIN_FILTER,t.NEAREST],[t.TEXTURE_MAG_FILTER,t.NEAREST],[t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE],[t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE]])t.texParameteri(t.TEXTURE_2D_ARRAY,r,s);return i}catch(r){throw t.deleteTexture(i),r}}function zi(t){return{near:Ye(t,1),far:je(t,1)}}function Fi(t,e){t.deleteTexture(e.near),t.deleteTexture(e.far)}function ye(t,e,i,r=192,s=null,n=-1){let a=!s;s??=Ye(t,e);let o;try{if(o=t.createFramebuffer(),!o)throw new Error("Shadow framebuffer unavailable");if(t.bindFramebuffer(t.FRAMEBUFFER,o),n<0?t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,s,0):t.framebufferTextureLayer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,s,0,n),t.drawBuffers([t.NONE]),t.readBuffer(t.NONE),t.checkFramebufferStatus(t.FRAMEBUFFER)!==t.FRAMEBUFFER_COMPLETE)throw new Error("Shadow framebuffer unavailable");return{texture:s,framebuffer:o,size:e,extent:i,depth:r,matrix:new Float32Array(16)}}catch(c){throw o&&t.deleteFramebuffer(o),a&&t.deleteTexture(s),c}finally{t.bindFramebuffer(t.FRAMEBUFFER,null)}}var Be=[512,1024,2048,4096];function pe(t,e={},i=null){if(!e||typeof e!="object"||Array.isArray(e))throw new TypeError("Invalid shadow options");let r=e.size===void 0?i?.requestedSize??He:e.size;if(!Be.includes(r))throw new RangeError("Shadow size must be 512, 1024, 2048 or 4096");let s=t.getParameter(t.MAX_TEXTURE_SIZE),n=Be.findLast(c=>c<=r&&c<=s);if(!n||s<1024)throw new Error("Insufficient shadow texture capacity");let a=e.middleExtent===void 0?i?.extent??(e.size===void 0?ve*n/He:ve):e.middleExtent,o=e.outerExtent===void 0?i?.far.extent??yt:e.outerExtent;if(!Number.isFinite(a)||a<=0||!Number.isFinite(o)||o<a)throw new RangeError("Invalid shadow cascade coverage");return{requestedSize:r,size:n,middleExtent:a,outerExtent:o}}function xe(t,e,i,r){i?.framebuffer&&t.deleteFramebuffer(i.framebuffer),r?.framebuffer&&t.deleteFramebuffer(r.framebuffer),e&&t.deleteTexture(e)}function We(t,{size:e,middleExtent:i,outerExtent:r}){let s,n,a;try{return s=je(t,e),n=ye(t,e,i,512,s,0),a=ye(t,e,r,r,s,1),{texture:s,middle:n,far:a}}catch(o){throw xe(t,s,n,a),o}}function Xi(t,e,i,r,s){t.uniform1i(e.shadowMap,3),t.uniform1i(e.shadowNearMap,13),t.uniform1f(e.shadowEnabled,i?1:0),i?(i.bind(),t.uniform3f(e.shadowParams,i.size,i.extent,i.depth),t.uniform3f(e.shadowFarParams,i.far.size,i.far.extent,i.far.depth),t.uniformMatrix4fv(e.shadowMatrix,!1,i.matrix),t.uniformMatrix4fv(e.shadowNearMatrix,!1,i.near.matrix),t.uniformMatrix4fv(e.shadowFarMatrix,!1,i.far.matrix),t.uniform3f(e.shadowOffset,...s.position.map((n,a)=>n-i.origin[a]))):(t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D_ARRAY,r.far),t.activeTexture(t.TEXTURE13),t.bindTexture(t.TEXTURE_2D,r.near))}var $e=class t{static async create(e,i={}){pe(e,i);let r=await Promise.allSettled([ne(e,Tt,Pe),ne(e,Et,Pe)]);if(r.some(s=>s.status==="rejected")){for(let s of r)s.status==="fulfilled"&&e.deleteProgram(s.value);throw r.find(s=>s.status==="rejected").reason}return new t(e,...r.map(s=>s.value),i)}constructor(e,i,r,s={}){this.gl=e,this.program=i,this.offset=e.getUniformLocation(i,"offset"),this.projection=e.getUniformLocation(i,"viewProjection"),this.instances={program:r,matrix:e.getUniformLocation(r,"viewProjection"),offset:e.getUniformLocation(r,"instanceOffset")},this.origin=[0,0,0],this.visibleChests=[];try{let n=pe(e,s),a=We(e,n);Object.assign(this,a.middle),this.far=a.far,this.requestedSize=n.requestedSize,this.near=ye(e,1024,16,512)}catch(n){throw this.dispose(),n}this.bytes=(this.size**2*2+1024**2)*4,this.draws=0,this.triangles=0}configure(e={}){if(this.disposed)throw new Error("Shadow map is disposed");let i=pe(this.gl,e,this),{size:r,middleExtent:s,outerExtent:n,requestedSize:a}=i;if(r===this.size&&s===this.extent&&n===this.far.extent)return this.requestedSize=a,!1;if(r!==this.size){let o;try{o=We(this.gl,i)}catch(f){throw this.bind(),f}let c={texture:this.texture,framebuffer:this.framebuffer,far:this.far};Object.assign(this,o.middle),this.far=o.far,xe(this.gl,c.texture,c,c.far)}else this.extent=s,this.far.extent=n,this.far.depth=n;return this.requestedSize=a,this.bytes=(r**2*2+1024**2)*4,this.bind(),!0}render(e,i,r,s=N){let n=this.gl;this.draws=0,this.triangles=0;for(let a=0;a<3;a++)this.origin[a]=e.position[a];for(let a of[this,this.far,this.near])this.renderCascade(a,i,r,s);n.disable(n.POLYGON_OFFSET_FILL),n.colorMask(!0,!0,!0,!0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,n.drawingBufferWidth,n.drawingBufferHeight),this.bind()}renderCascade(e,i,r,s){let n=this.gl,{matrix:a,size:o}=e,c=e===this.far?[this.origin[0],64,this.origin[2]]:this.origin;gt(a,s,e.extent,e.depth,this.origin,c,o),n.bindFramebuffer(n.FRAMEBUFFER,e.framebuffer),n.viewport(0,0,o,o),n.colorMask(!1,!1,!1,!1),n.depthMask(!0),n.clear(n.DEPTH_BUFFER_BIT),n.enable(n.DEPTH_TEST),n.depthFunc(n.LEQUAL),n.enable(n.CULL_FACE),n.cullFace(n.BACK),n.frontFace(n.CCW),n.disable(n.BLEND),n.enable(n.POLYGON_OFFSET_FILL),n.polygonOffset(1,1),n.useProgram(this.program),n.uniformMatrix4fv(this.projection,!1,a);let f=this.visibleChests??=[];f.length=0;for(let l of i.values()){let h=l.passes[0];if(!h&&!this.chests?.has(l.key))continue;let m=l.cx*32+16-this.origin[0],p=l.cy*32+16-this.origin[1],y=l.cz*32+16-this.origin[2],d=!1;for(let u=0;u<3;u++){let E=16*(Math.abs(a[u])+Math.abs(a[4+u])+Math.abs(a[8+u]));if(Math.abs(m*a[u]+p*a[4+u]+y*a[8+u]+a[12+u])>1+E){d=!0;break}}d||(this.chests?.has(l.key)&&f.push(l),h&&(n.uniform3f(this.offset,l.cx*32-this.origin[0],l.cy*32-this.origin[1],l.cz*32-this.origin[2]),n.bindVertexArray(h.vao),n.drawElements(n.TRIANGLES,h.count,h.indexType??n.UNSIGNED_INT,0),this.draws++,this.triangles+=h.count/3))}if(this.chests){let l=this.chests.draw({position:this.origin},a,f,this.instances);this.draws+=l.draws,this.triangles+=l.instances*12}if(r){let l=r({origin:this.origin,matrix:a,instances:this.instances});this.draws+=l?.draws||0,this.triangles+=(l?.instances||0)*12}}bind(){this.gl.activeTexture(this.gl.TEXTURE3),this.gl.bindTexture(this.gl.TEXTURE_2D_ARRAY,this.texture),this.gl.activeTexture(this.gl.TEXTURE13),this.gl.bindTexture(this.gl.TEXTURE_2D,this.near.texture)}dispose(){this.disposed||(this.disposed=!0,xe(this.gl,this.texture,this,this.far),this.near&&(this.gl.deleteFramebuffer(this.near.framebuffer),this.gl.deleteTexture(this.near.texture)),this.gl.deleteProgram(this.program),this.gl.deleteProgram(this.instances.program),this.bytes=0)}};var Bi=["dayCycle","sunDirection","directDirection","sunLight","moonLight"],Wi=`uniform vec4 dayCycle;uniform vec3 sunDirection,directDirection;uniform vec4 sunLight,moonLight;
vec3 daylightTint(){return dayCycle.x<.5?vec3(1):mix(vec3(.25,.32,.48),vec3(1),dayCycle.y)+vec3(.1,.01,-.025)*dayCycle.z;}
vec3 directLightDirection(){return directDirection;}
vec3 sunRadiance(){return sunLight.rgb;}
vec3 moonRadiance(){return moonLight.rgb;}
float sunStrength(){return sunLight.a;}
float moonStrength(){return moonLight.a;}
vec3 directLightRadiance(){return sunRadiance()+moonRadiance();}
vec3 directionalLight(vec3 normal,float visibility,float sky){vec3 light=directLightDirection();float facing=max(dot(normal,light),0.0);vec3 ambient=mix(vec3(.12,.15,.19),vec3(.24,.33,.49),normal.y*.5+.5);ambient=mix(vec3(.026,.045,.085),ambient,dayCycle.y);return ambient*sky+directLightRadiance()*facing*visibility*.50;}
vec3 materialSpecular(vec3 albedo,vec3 n,vec3 view,float roughness,float metal,float visibility){
 vec3 light=directLightDirection(),halfVector=light+view,h=halfVector*inversesqrt(max(dot(halfVector,halfVector),.000001));float nl=max(dot(n,light),0.0),nv=max(dot(n,view),.001),nh=max(dot(n,h),0.0),vh=max(dot(view,h),0.0);
 float a=max(.025,roughness*roughness),a2=a*a,d=nh*nh*(a2-1.0)+1.0,D=a2/(3.14159265*d*d),k=(roughness+1.0)*(roughness+1.0)/8.0,G=nl/(nl*(1.0-k)+k)*nv/(nv*(1.0-k)+k);
 vec3 f0=mix(vec3(.035),albedo,metal),F=f0+(1.0-f0)*pow(1.0-vh,5.0);return min(vec3(12),D*G*F/max(.004,4.0*nl*nv))*directLightRadiance()*nl*visibility;
}`;function $i(t,e,i){let r=i?.sun||N,s=i?.sunRadiance&&i?.moonRadiance?i:me(r,i?.daylight??1,i?.dusk??0);t.uniform4f(e.dayCycle,i?1:0,i?.daylight??1,i?.dusk??0,i?.time??0),t.uniform3f(e.sunDirection,...r),t.uniform3f(e.directDirection,...s.light),t.uniform4f(e.sunLight,...s.sunRadiance,s.sunStrength),t.uniform4f(e.moonLight,...s.moonRadiance,s.moonStrength)}var qe=Math.PI*105/180,_t=.34,Rt=.26,Te=8,J=Object.freeze([.5,.6875,.0625]),Ke=t=>Math.max(0,Math.min(1,Number.isFinite(t)?t:0)),O=[.96,.73,.45],Ee=[.35,.27,.18],St=[.58,.39,.22],be=[.29,.3,.26],Mt=[.92,.71,.27],kt=[["floor",[.5,.09375,.5],[.875,.0625,.875],O,9],["front",[.5,.40625,.90625],[.875,.5625,.0625],O,9],["back",[.5,.40625,.09375],[.875,.5625,.0625],O,9],["left",[.09375,.40625,.5],[.0625,.5625,.75],O,9],["right",[.90625,.40625,.5],[.0625,.5625,.75],O,9],["post-left",[.09375,.390625,.934375],[.0625,.5625,.01875],Ee,9],["post-right",[.90625,.390625,.934375],[.0625,.5625,.01875],Ee,9],["interior",[.5,.1328125,.5],[.75,.015625,.75],St,9],["hinge-left",[.265625,.65625,.0703125],[.125,.125,.03125],be,-1],["hinge-right",[.734375,.65625,.0703125],[.125,.125,.03125],be,-1]],Lt=[["lid",[.5,.765625,.5],[.875,.15625,.875],O,9],["lid-rim",[.5,.703125,.9421875],[.875,.03125,.015625],Ee,9],["latch",[.5,.6875,.959375],[.125,.1875,.03125],Mt,-1],["latch-slot",[.5,.6640625,.977],[.03125,.0390625,.008],be,-1]];function Ct(t,e,i,{yaw:r=0,scale:s=1}={}){if(!Array.isArray(t)||t.length!==3||!t.every(Number.isFinite)||!Number.isFinite(r)||!Number.isFinite(s)||s<=0||typeof i!="function")return!1;let n=-qe*Ke(e),a=Math.sin(n),o=Math.cos(n),c=Math.sin(r),f=Math.cos(r);for(let[l,h]of[["body",kt],["lid",Lt]])for(let[m,p,y,d,u]of h){let[E,_,T]=p;if(l==="lid"){let v=_-J[1],x=T-J[2];_=J[1]+v*o-x*a,T=J[2]+v*a+x*o}E-=.5,T-=.5,i({position:[t[0]+.5+s*(E*f+T*c),t[1]+s*_,t[2]+.5+s*(-E*c+T*f)],size:y.map(v=>v*s),color:[...d],material:u,yaw:r,pitch:l==="lid"?n:0,part:m,group:l})}return!0}function Ze(t,e=0,i){let r=[];return Ct(t,e,s=>r.push(s),i),r}function wt(t){let e=Math.min(1,t.elapsed/t.duration),i=e*e,r=i*e,s=t.fromVelocity*t.duration;t.openness=Ke((2*r-3*i+1)*t.from+(r-2*i+e)*s+(-2*r+3*i)*t.target),t.velocity=((6*i-6*e)*t.from+(3*i-4*e+1)*s+(-6*i+6*e)*t.target)/t.duration,e===1&&(t.openness=t.target,t.velocity=0,t.settled=!0)}var Ve=class{constructor({limit:e=Te}={}){this.limit=Number.isInteger(e)?Math.max(0,Math.min(Te,e)):Te,this.entries=new Map}open(e,i=e?.join(","),{yaw:r=0}={}){if(typeof i!="string"||!i.length||!Array.isArray(e)||e.length!==3||!e.every(Number.isFinite)||!Number.isFinite(r))return!1;let s=this.entries.get(i);if(s){if(s.position.some((n,a)=>n!==e[a])||s.yaw!==r)return!1}else{if(this.entries.size>=this.limit)return!1;s={key:i,position:[...e],yaw:r,openness:0,velocity:0,target:0,settled:!0},this.entries.set(i,s)}return this.target(s,1)}target(e,i){return e.target===i||(e.from=e.openness,e.target=i,e.elapsed=0,e.duration=i?_t:Rt,e.fromVelocity=Math.max(-3,Math.min(3,e.velocity)),e.settled=!1),!0}close(e){let i=this.entries.get(e);return i?this.target(i,0):!1}tick(e){if(!(!Number.isFinite(e)||e<=0))for(let i of this.entries.values())i.settled||(i.elapsed=Math.min(i.duration,i.elapsed+e),wt(i))}sample(e){let i=this.entries.get(e);return i?{key:i.key,position:[...i.position],yaw:i.yaw,openness:i.openness,angle:-qe*i.openness,target:i.target,settled:i.settled}:null}remove(e,{force:i=!1}={}){let r=this.entries.get(e);return!r||!i&&(!r.settled||r.openness!==0)?!1:this.entries.delete(e)}clear(){this.entries.clear()}metrics(){let e=0,i=0,r=0;for(let s of this.entries.values())s.settled?s.openness&&r++:s.target?e++:i++;return{active:this.entries.size,opening:e,closing:i,open:r,limit:this.limit}}};var te=Object.freeze(Ze([0,0,0],0).map(t=>Object.freeze({...t,position:Object.freeze(t.position),size:Object.freeze(t.size),color:Object.freeze(t.color)}))),Qe=`
uniform vec4 chestCenters[${14}];
uniform vec3 chestSizes[${14}],chestTints[${14}];
int sceneChestPart=-1;
bool chestReplaced(ivec3 cell){for(int i=0;i<rayChestCount;i++)if(all(equal(cell,rayChestCells[i])))return true;return false;}
SceneHit chestPartHit(int part,ivec3 cell,vec3 origin,vec3 direction,float limit){
 SceneHit hit=SceneHit(limit,vec3(0.0,1.0,0.0),vec3(1.0),vec2(0.0),0,0);
 vec4 center=chestCenters[part];vec3 size=chestSizes[part],ro=(origin-(vec3(cell)-rayOrigin))-center.xyz,inv=rayInverse(direction);
 vec3 first=(-size-ro)*inv,last=(size-ro)*inv,entry=min(first,last),leave=max(first,last);
 float near=max(entry.x,max(entry.y,entry.z)),far=min(leave.x,min(leave.y,leave.z));
 if(near>.001&&near<far&&near<limit){
  vec3 normal=entry.x>=entry.y&&entry.x>=entry.z?vec3(-sign(direction.x),0.0,0.0):entry.y>=entry.z?vec3(0.0,-sign(direction.y),0.0):vec3(0.0,0.0,-sign(direction.z));
  vec3 point=(ro+direction*near)/(size*2.0)+.5;
  hit=SceneHit(near,normal,chestTints[part],abs(normal.y)>.5?point.xz:abs(normal.x)>.5?point.zy:point.xy,int(center.w),3);
  if(normal.x>0.0||normal.z<0.0)hit.uv.x=1.0-hit.uv.x;
 }
 return hit;
}
SceneHit chestHit(ivec3 cell,vec3 origin,vec3 direction,float limit){
 SceneHit hit=SceneHit(limit,vec3(0.0,1.0,0.0),vec3(1.0),vec2(0.0),0,0);
 for(int part=0;part<${14};part++){SceneHit candidate=chestPartHit(part,cell,origin,direction,hit.distance);if(candidate.kind==3){hit=candidate;sceneChestPart=part;}}
 return hit;
}
SceneHit chestRecordHit(int part,vec3 origin,vec3 direction,float distance){
 ivec3 cell=ivec3(floor(origin+rayOrigin+direction*distance));
 return chestPartHit(part,cell,origin,direction,60.0);
}
`;var I=32,At=65535,It=(t,e,i)=>t+e*I+i*I*4,Qi=["rayBricks","rayTable","rayNodes","rayBoxes","rayOrigin","rayTableOrigin","rayEnabled","rayNodeCount","rayChestCount","rayChestCells","chestCenters","chestSizes","chestTints"],Ut=new Float32Array(te.flatMap(t=>[...t.position,t.material])),Dt=new Float32Array(te.flatMap(t=>t.size.map(e=>e*.5))),Nt=new Float32Array(te.flatMap(t=>t.color)),et=new WeakSet;function Ot(t,e){et.has(e)||(e.chestCenters!=null&&t.uniform4fv(e.chestCenters,Ut),e.chestSizes!=null&&t.uniform3fv(e.chestSizes,Dt),e.chestTints!=null&&t.uniform3fv(e.chestTints,Nt),et.add(e))}function ie(t,e,i,r,s,n,a=0){let o=t.createTexture();t.activeTexture(t.TEXTURE0+i),t.bindTexture(e,o),a?t.texStorage3D(e,1,r,s,n,a):t.texStorage2D(e,1,r,s,n);for(let c of[t.TEXTURE_MIN_FILTER,t.TEXTURE_MAG_FILTER])t.texParameteri(e,c,t.NEAREST);for(let c of a?[t.TEXTURE_WRAP_S,t.TEXTURE_WRAP_T,t.TEXTURE_WRAP_R]:[t.TEXTURE_WRAP_S,t.TEXTURE_WRAP_T])t.texParameteri(e,c,t.CLAMP_TO_EDGE);return o}var tt=class{constructor(e,i,{maxChunks:r=1024}={}){if(!Number.isSafeInteger(r)||r<1)throw new RangeError("Invalid voxel reflection capacity");let s=e.getParameter(e.MAX_3D_TEXTURE_SIZE);if(s<256)throw new Error("Voxel reflection textures unavailable");let n=Math.min(Math.ceil(Math.min(r,I*4*I)/64)*32,Math.floor(s/32)*32),a=n/32*64;this.gl=e,this.store=i,this.entries=new Map,this.free=Array.from({length:a},(o,c)=>a-1-c),this.table=new Uint16Array(I*4*I),this.origin=[0,0,0],this.tableOrigin=[-16,0,-16],this.boxes=new ke,this.closed=!1,this.plantScratch=new Uint8Array(32**3),this.chestReplacements=[],this.chestCells=new Int32Array(24),this.bricks=ie(e,e.TEXTURE_3D,8,e.R8UI,256,256,n),this.lookup=ie(e,e.TEXTURE_3D,9,e.R16UI,I,4,I),this.nodes=ie(e,e.TEXTURE_2D,10,e.RGBA32F,256,Math.ceil((4096*2-1)*2/256)),this.dynamic=ie(e,e.TEXTURE_2D,11,e.RGBA32F,256,Math.ceil(4096*4/256)),this.stats={bytes:256*256*n+this.table.byteLength+256*64*16*2,capacity:a,requestedCapacity:r,resident:0,tracked:0,pending:0,deferred:0,work:0,scans:0,evictions:0,uploads:0,tableUploads:0,uploadedBytes:0,maxUpdateMs:0,maxActorsMs:0,boxes:0,nodes:0,overflow:0}}setChestReplacements(e=[]){if(this.closed)return;if(!Array.isArray(e)||e.length>8)throw new RangeError("Invalid active chest ray replacements");let i=[],r=new Set;for(let s of e){let n=Array.isArray(s)?s:s?.position;if(!Array.isArray(n)||n.length!==3||!n.every(Number.isSafeInteger)||n[1]<1||n[1]>=128||Math.abs(n[0])>2**24-32||Math.abs(n[2])>2**24-32)throw new RangeError("Invalid active chest ray cell");let[a,o,c]=n,f=Math.floor(a/32),l=Math.floor(o/32),h=Math.floor(c/32),m=`${f},${l},${h}`,p=this.store.chunks.get(m),y=a-f*32+(c-h*32)*32+(o-l*32)*1024,d=p?.data?.[y],u=n.join(",");r.has(u)||d!==46&&d!==49||(r.add(u),i.push({position:[...n],key:m,index:y,epoch:this.store.epoch,incarnation:p.incarnation}))}this.chestReplacements=i}bindChestReplacements(e){let i=0;for(let r of this.chestReplacements){let s=this.store.chunks.get(r.key),n=s?.data?.[r.index];r.epoch!==this.store.epoch||s?.incarnation!==r.incarnation||n!==46&&n!==49||this.chestCells.set(r.position,i++*3)}this.gl.uniform1i(e.rayChestCount,i),i&&this.gl.uniform3iv(e.rayChestCells,this.chestCells.subarray(0,i*3)),this.stats.activeChests=i}updateWorld(e,i=8){if(this.closed)return;if(!Number.isFinite(i))throw new RangeError("Invalid voxel upload budget");i=Math.max(0,Math.floor(i));let r=performance.now(),s=this.gl,n=Math.floor(e.position[0]/32)-16,a=Math.floor(e.position[2]/32)-16;this.origin=e.position;let o=this.tableOrigin[0]!==n||this.tableOrigin[2]!==a;this.tableOrigin=[n,0,a];let c=[],f=d=>d?.data&&d.cx>=n&&d.cx<n+32&&d.cz>=a&&d.cz<a+32&&d.cy>=0&&d.cy<4,l=d=>(d.cx*32+16-e.position[0])**2+(d.cy*32+16-e.position[1])**2+(d.cz*32+16-e.position[2])**2,h=(d,u)=>l(d)-l(u)||d.cx-u.cx||d.cy-u.cy||d.cz-u.cz;for(let[d,u]of this.entries){let E=this.store.chunks.get(d);(!f(E)||E.incarnation!==u.incarnation)&&(u.slot>=0&&this.free.push(u.slot),this.entries.delete(d),o=!0)}for(let d of this.store.chunks.values())if(f(d)){let u=this.entries.get(d.key),E=d.contentRevision??d.revision;(!u||u.revision!==E||!u.valid)&&(u&&u.revision!==E&&(u.valid=!1,u.deferred=!1,o=!0),c.push(d))}c.sort(h);let m=null,p=d=>{let u=0,E=m.length;for(;u<E;){let _=u+E>>>1;h(m[_],d)<0?u=_+1:E=_}m.splice(u,0,d)};this.stats.uploads=0,this.stats.uploadedBytes=0,this.stats.work=0,this.stats.scans=0,this.stats.tableUploads=0;let y=()=>{if(o){this.table.fill(0);for(let d of this.entries.values())d.valid&&(this.table[It(d.cx-n,d.cy,d.cz-a)]=d.slot<0?At:d.slot+1);s.activeTexture(s.TEXTURE9),s.bindTexture(s.TEXTURE_3D,this.lookup),s.texSubImage3D(s.TEXTURE_3D,0,0,0,0,32,4,32,s.RED_INTEGER,s.UNSIGNED_SHORT,this.table),this.stats.uploadedBytes+=this.table.byteLength,this.stats.tableUploads++,o=!1}};for(let d of c){if(this.stats.work>=i)break;let u=this.entries.get(d.key),E=!1,_=d.contentRevision??d.revision;if((!u||u.revision!==_)&&(u||(u={slot:-1,incarnation:d.incarnation,cx:d.cx,cy:d.cy,cz:d.cz,valid:!1},this.entries.set(d.key,u)),u.empty=!d.data.some(T=>T!==0&&T!==59),u.revision=_,u.deferred=!1,E=!0,this.stats.scans++,this.stats.work++),u.empty&&u.slot>=0)this.free.push(u.slot),m&&m.splice(m.indexOf(u),1),u.slot=-1;else if(!u.empty&&u.slot<0){if(!this.free.length){m??=[...this.entries.values()].filter(v=>v.slot>=0).sort(h);let T=m.at(-1);if(!T||h(u,T)>=0){u.deferred=!0;continue}m.pop(),this.free.push(T.slot),T.slot=-1,T.valid=!1,T.deferred=!0,o=!0,this.stats.evictions++,y()}u.slot=this.free.pop(),m&&p(u)}if(E||this.stats.work++,!u.empty){let T=u.slot,v=d.data;if(v.includes(59)){this.plantScratch.set(v);for(let x=0;x<v.length;x++)this.plantScratch[x]===59&&(this.plantScratch[x]=0);v=this.plantScratch}s.activeTexture(s.TEXTURE8),s.bindTexture(s.TEXTURE_3D,this.bricks),s.texSubImage3D(s.TEXTURE_3D,0,T%8*32,Math.floor(T/8)%8*32,Math.floor(T/64)*32,32,32,32,s.RED_INTEGER,s.UNSIGNED_BYTE,v),this.stats.uploadedBytes+=d.data.byteLength}u.valid=!0,u.deferred=!1,o=!0,this.stats.uploads++}y(),this.stats.tracked=this.entries.size,this.stats.resident=0,this.stats.deferred=0;for(let d of this.entries.values())d.valid&&this.stats.resident++,d.deferred&&this.stats.deferred++;this.stats.pending=0;for(let d of this.store.chunks.values())f(d)&&!this.entries.get(d.key)?.valid&&this.stats.pending++;this.stats.maxUpdateMs=Math.max(this.stats.maxUpdateMs,performance.now()-r)}updateActors(e,i,r=null,s=0){let n=performance.now(),a=this.gl,o=this.boxes;o.update(e,i.position,r,s);for(let[c,f,l,h]of[[10,this.nodes,o.nodes,o.nodeCount*8],[11,this.dynamic,o.boxes,o.count*16]])if(h){let m=Math.ceil(h/(256*4));a.activeTexture(a.TEXTURE0+c),a.bindTexture(a.TEXTURE_2D,f),a.texSubImage2D(a.TEXTURE_2D,0,0,0,256,m,a.RGBA,a.FLOAT,l)}this.stats.remoteBoxes=s,this.stats.boxes=o.count,this.stats.nodes=o.nodeCount,this.stats.overflow=o.overflow,this.stats.maxActorsMs=Math.max(this.stats.maxActorsMs,performance.now()-n)}bind(e){let i=this.gl;Ot(i,e);for(let[r,s,n,a]of[[8,"rayBricks",this.bricks,i.TEXTURE_3D],[9,"rayTable",this.lookup,i.TEXTURE_3D],[10,"rayNodes",this.nodes,i.TEXTURE_2D],[11,"rayBoxes",this.dynamic,i.TEXTURE_2D]])i.activeTexture(i.TEXTURE0+r),i.bindTexture(a,n),i.uniform1i(e[s],r);i.uniform1f(e.rayEnabled,1),i.uniform1i(e.rayNodeCount,this.boxes.nodeCount),i.uniform3f(e.rayOrigin,...this.origin),i.uniform3i(e.rayTableOrigin,...this.tableOrigin),this.bindChestReplacements(e)}dispose(){if(!this.closed){this.closed=!0;for(let e of[this.bricks,this.lookup,this.nodes,this.dynamic])this.gl.deleteTexture(e);this.entries.clear(),this.chestReplacements=[],this.stats.activeChests=0}}};var er=["giField","giValid","giBricks","giTable","giTableOrigin","giEye","giMin","giEnabled","giOverlay","giSamples"],tr="vec3 indirectLight(vec3 position,vec3 normal){return vec3(0.0);}",it=`
uniform highp sampler2DArray giField;uniform highp usampler2D giValid;
uniform ivec3 giTableOrigin,giMin;
uniform vec3 giEye;uniform float giEnabled,giOverlay;
uniform int giSamples;
ivec2 giAddress(ivec3 p){ivec3 q=(p%ivec3(16,8,16)+ivec3(16,8,16))%ivec3(16,8,16);return ivec2(q.x,q.z+q.y*16);}
int giCell(vec3 p){
 ivec3 cell=ivec3(floor(p)),chunk=ivec3(floor(p/32.0)),address=chunk-giTableOrigin;
 if(any(lessThan(address,ivec3(0)))||any(greaterThanEqual(address,ivec3(32,4,32))))return -1;
 uint slot=texelFetch(giTable,address,0).r;if(slot==0u)return -1;if(slot==65535u)return 0;
 uint s=slot-1u;ivec3 local=cell-chunk*32,brick=ivec3(int(s%8u),int(s/8u%8u),int(s/64u))*32;return int(texelFetch(giBricks,brick+local.xzy,0).r);
}
bool giPassable(int b){return b==0||b==7||b==12||b==22||b==25||b==31||(b>=50&&b<=57);}
bool giVisible(vec3 from,vec3 to){
 vec3 delta=to-from;float limit=length(delta);if(limit<.01)return true;vec3 direction=delta/limit,inv=1.0/max(abs(direction),vec3(.000001));float distance=0.0;
 for(int i=0;i<12;i++){
  if(distance>=limit)return true;vec3 p=from+direction*distance;if(!giPassable(giCell(p)))return false;
  vec3 boundary=mix(fract(p),1.0-fract(p),greaterThanEqual(direction,vec3(0.0)))*inv;
  distance+=max(.001,min(boundary.x,min(boundary.y,boundary.z)))+.002;
 }return false;
}
vec3 indirectLight(vec3 position,vec3 normal){
 if(giEnabled<.5)return vec3(0.0);
 vec3 p=giEye+(giOverlay>.5?vec3(0.0):position),n=giOverlay>.5?vec3(0,1,0):normal;
 vec3 grid=(p+n*.08-.5)*.5,weight=fract(grid);ivec3 base=ivec3(floor(grid));
 if(any(lessThan(base,giMin-1))||any(greaterThanEqual(base,giMin+ivec3(16,8,16))))return vec3(0.0);
 vec3 result=vec3(0.0);float sum=0.0;
 for(int i=0;i<giSamples;i++){
  ivec3 corner=ivec3(i&1,(i>>1)&1,(i>>2)&1),cell=base+corner;
  if(any(lessThan(cell,giMin))||any(greaterThanEqual(cell,giMin+ivec3(16,8,16))))continue;
  ivec2 address=giAddress(cell);if(texelFetch(giValid,address,0).r==0u)continue;
  vec4 c0=texelFetch(giField,ivec3(address,0),0),cx=texelFetch(giField,ivec3(address,1),0),cy=texelFetch(giField,ivec3(address,2),0),cz=texelFetch(giField,ivec3(address,3),0);if(cz.a<.5)continue;
  vec3 probe=vec3(c0.a,cx.a,cy.a),v=probe-p,w=mix(1.0-weight,weight,vec3(corner));
  float blend=w.x*w.y*w.z*max(.05,dot(n,normalize(v+vec3(.00001))));if(blend<.00001||!giVisible(p+n*.06,probe))continue;
  result+=max(vec3(0.0),c0.rgb+cx.rgb*n.x+cy.rgb*n.y+cz.rgb*n.z)*blend;sum+=blend;
 }
 vec3 edge=min(grid-vec3(giMin),vec3(giMin+ivec3(15,7,15))-grid);
 return result/max(sum,.00001)*.85*smoothstep(0.0,1.0,min(edge.x,min(edge.y,edge.z)));
}`,ir=`uniform highp usampler3D giBricks,giTable;
${it}`,rr=`
#define giBricks foliageBricks
#define giTable foliageTable
${it}
#undef giBricks
#undef giTable
`;var re=[70,71,72,73].map(Me),se=re.flat(),zt=re.map((t,e)=>re.slice(0,e).reduce((i,r)=>i+r.length,0)),Ft=t=>Number.isInteger(t)?`${t}.0`:String(t),Xt=(t,e)=>`${t}(${e.map(Ft).join(",")})`,rt=(t,e,i)=>`const ${e} ${t}[${se.length}]=${e}[${se.length}](${i.map(r=>Xt(e,r)).join(",")});`,st=`
${rt("plantCenters","vec4",se.map(t=>[...t.position,t.material]))}
${rt("plantHalfSizes","vec3",se.map(t=>t.size.map(e=>e*.5)))}
const ivec4 plantOffsets=ivec4(${zt.join(",")});
const ivec4 plantCounts=ivec4(${re.map(t=>t.length).join(",")});
int scenePlantPart=-1;
int scenePlantBlock=0;
bool groundPlantMaterial(int block){return block>=70&&block<=73;}
SceneHit groundPlantPartHit(int block,int part,ivec3 cell,vec3 origin,vec3 direction,float limit){
 SceneHit hit=SceneHit(limit,vec3(0.0,1.0,0.0),vec3(1.0),vec2(0.0),0,0);
 if(!groundPlantMaterial(block)||part<0||part>=plantCounts[block-70])return hit;
 int at=plantOffsets[block-70]+part;vec4 center=plantCenters[at];vec3 halfSize=plantHalfSizes[at];
 vec3 ro=(origin-(vec3(cell)-rayOrigin))-center.xyz;
 if((direction.x==0.0&&abs(ro.x)>halfSize.x)||(direction.y==0.0&&abs(ro.y)>halfSize.y)||(direction.z==0.0&&abs(ro.z)>halfSize.z))return hit;
 vec3 first=(-halfSize-ro)*rayInverse(direction),last=(halfSize-ro)*rayInverse(direction),entry=min(first,last),leave=max(first,last);
 // A parallel in-slab axis imposes no distance interval. The finite inverse
 // used by voxel stepping would otherwise turn a tiny boundary margin into
 // a false near/far limit, rejecting rays along the edge of a plant part.
 bvec3 parallel=equal(direction,vec3(0.0));
 entry=mix(entry,vec3(-1e30),parallel);leave=mix(leave,vec3(1e30),parallel);
 float near=max(entry.x,max(entry.y,entry.z)),far=min(leave.x,min(leave.y,leave.z));
 bool inside=near<0.0;float distance=inside?far:near;
 if(distance>=0.0&&near<far&&distance<limit){
  vec3 plane=inside?-leave:entry;
  vec3 normal=plane.x>=plane.y&&plane.x>=plane.z?vec3(-sign(direction.x),0.0,0.0):plane.y>=plane.z?vec3(0.0,-sign(direction.y),0.0):vec3(0.0,0.0,-sign(direction.z));
  if(inside)normal=-normal;
  vec3 point=ro+direction*distance+halfSize;
  vec2 uv=abs(normal.x)>.5?point.zy:abs(normal.y)>.5?point.zx:point.xy;
  if(normal.x>0.0||normal.z<0.0)uv.x=-uv.x;
  hit=SceneHit(distance,normal,vec3(1.0),uv,int(center.w),4);
 }
 return hit;
}
SceneHit groundPlantHit(int block,ivec3 cell,vec3 origin,vec3 direction,float limit){
 SceneHit hit=SceneHit(limit,vec3(0.0,1.0,0.0),vec3(1.0),vec2(0.0),0,0);
 if(!groundPlantMaterial(block))return hit;
 for(int part=0;part<${Se};part++){
  if(part>=plantCounts[block-70])break;
  SceneHit candidate=groundPlantPartHit(block,part,cell,origin,direction,hit.distance);
  if(candidate.kind==4){hit=candidate;scenePlantPart=part;scenePlantBlock=block;}
 }
 return hit;
}
SceneHit groundPlantRecordHit(int block,int part,vec3 origin,vec3 direction,float distance){
 ivec3 cell=ivec3(floor(origin+rayOrigin+direction*(distance+.001)));
 return groundPlantPartHit(block,part,cell,origin,direction,distance+.01);
}
`;var Gt=`
#ifndef SCENE_FOLIAGE
#define SCENE_FOLIAGE(n,v,a,t) vec3(0.0)
#define SCENE_VISIBILITY(p,n,m,s,t) sunlight(p,n)
#endif

#ifndef SCENE_INDIRECT
#define SCENE_INDIRECT(p,n) vec3(0.0)
#endif
uniform highp usampler3D rayBricks,rayTable;
uniform highp sampler2D rayNodes,rayBoxes;
uniform vec3 rayOrigin;uniform ivec3 rayTableOrigin;uniform float rayEnabled;uniform int rayNodeCount;
uniform int rayChestCount;uniform ivec3 rayChestCells[8];
struct SceneHit{float distance;vec3 normal;vec3 tint;vec2 uv;int material;int kind;};
vec3 rayInverse(vec3 d){return mix(vec3(1.0),sign(d),greaterThan(abs(d),vec3(.0000001)))/max(abs(d),vec3(.0000001));}
`,Ht=`
SceneHit voxelHit(vec3 origin,vec3 direction,float limit){
 SceneHit hit=SceneHit(limit,vec3(0.0,1.0,0.0),vec3(1.0),vec2(0.0),0,0);vec3 inv=rayInverse(direction),normal=vec3(0.0,1.0,0.0),transmission=vec3(1.0);float distance=.03;
 for(int i=0;i<192;i++){
  if(distance>=limit)break;vec3 p=origin+rayOrigin+direction*distance;ivec3 cell=ivec3(floor(p)),chunk=ivec3(floor(p/32.0)),address=chunk-rayTableOrigin;
  if(p.y>=128.0)break;
  if(any(lessThan(address,ivec3(0.0)))||any(greaterThanEqual(address,ivec3(32,4,32)))){hit.distance=distance;hit.kind=-1;break;}
  uint slot=texelFetch(rayTable,address,0).r;if(slot==0u){hit.distance=distance;hit.kind=-1;break;}
  float size=slot==65535u?32.0:1.0;
  if(slot!=65535u){uint s=slot-1u;ivec3 local=cell-chunk*32,brick=ivec3(int(s%8u),int(s/8u%8u),int(s/64u))*32;int block=int(texelFetch(rayBricks,brick+local.xzy,0).r);
   if(block==46||block==49){if(!chestReplaced(cell)){SceneHit chest=chestHit(cell,origin,direction,limit);if(chest.kind==3){chest.tint*=transmission;return chest;}}}
   else if(groundPlantMaterial(block)){SceneHit plant=groundPlantHit(block,cell,origin,direction,limit);if(plant.kind==4){plant.tint*=transmission;return plant;}}
   else if(block==12||block==22)transmission*=vec3(.87,.94,.96);
   else if(block==7||block>=50&&block<=57)transmission*=vec3(.80,.94,.96);
   else if(block==31)transmission*=vec3(.75,.30,.32);
   else if(block!=0){hit.distance=distance;hit.normal=normal;hit.material=block==62&&normal.z<.5?61:block;hit.tint=transmission;hit.kind=1;hit.uv=abs(normal.y)>.5?p.xz:abs(normal.x)>.5?p.zy:p.xy;if(normal.x>0.0||normal.z<0.0)hit.uv.x=-hit.uv.x;return hit;}
  }
  vec3 boundary=(floor(p/size)+step(vec3(0.0),direction))*size,advance=(boundary-p)*inv;
  float next=min(advance.x,min(advance.y,advance.z));normal=advance.x<=advance.y&&advance.x<=advance.z?vec3(-sign(direction.x),0.0,0.0):advance.y<=advance.z?vec3(0.0,-sign(direction.y),0.0):vec3(0.0,0.0,-sign(direction.z));distance+=max(next,.0001)+.001;
 }
 hit.tint=transmission;return hit;
}
`,Pt=`
vec4 boxTexel(int i){return texelFetch(rayBoxes,ivec2(i&255,i>>8),0);}
SceneHit boxHit(int box,vec3 origin,vec3 direction,float limit){
 SceneHit hit=SceneHit(limit,vec3(0.0,1.0,0.0),vec3(1.0),vec2(0.0),0,0);
 int index=box*4;vec4 center=boxTexel(index),size=boxTexel(index+1),tint=boxTexel(index+2),pitch=boxTexel(index+3);
 float c=size.w,s=tint.w,cp=pitch.x,sp=pitch.y;mat3 basis=mat3(c,0.0,-s,s*sp,cp,c*sp,s*cp,-sp,c*cp);vec3 ro=transpose(basis)*(origin-center.xyz),rd=transpose(basis)*direction,ri=rayInverse(rd);
 vec3 first=(-size.xyz-ro)*ri,last=(size.xyz-ro)*ri,entry=min(first,last),leave=max(first,last);float near=max(entry.x,max(entry.y,entry.z)),far=min(leave.x,min(leave.y,leave.z));
 if(near>.001&&near<far&&near<hit.distance){vec3 normal=entry.x>=entry.y&&entry.x>=entry.z?vec3(-sign(rd.x),0.0,0.0):entry.y>=entry.z?vec3(0.0,-sign(rd.y),0.0):vec3(0.0,0.0,-sign(rd.z)),point=(ro+rd*near)/max(size.xyz*2.0,vec3(.0001))+.5;hit.distance=near;hit.normal=basis*normal;hit.tint=tint.rgb;hit.material=int(center.w);if(hit.material==62&&normal.z<.5)hit.material=61;hit.kind=2;hit.uv=abs(normal.y)>.5?point.xz:abs(normal.x)>.5?point.zy:point.xy;if(normal.x>0.0||normal.z<0.0)hit.uv.x=1.0-hit.uv.x;}
 return hit;
}`,Bt=`
int sceneBoxIndex=-1;
vec4 nodeTexel(int i){return texelFetch(rayNodes,ivec2(i&255,i>>8),0);}
bool boundsHit(vec3 origin,vec3 inv,vec3 lower,vec3 upper,float limit){vec3 a=(lower-origin)*inv,b=(upper-origin)*inv,lo=min(a,b),hi=max(a,b);return max(max(lo.x,lo.y),max(lo.z,0.0))<=min(min(hi.x,hi.y),min(hi.z,limit));}
SceneHit dynamicHit(vec3 origin,vec3 direction,SceneHit hit){
 int node=0;sceneBoxIndex=-1;vec3 inv=rayInverse(direction);
 for(int visit=0;visit<rayNodeCount&&node<rayNodeCount;visit++){vec4 a=nodeTexel(node*2),b=nodeTexel(node*2+1);
  if(!boundsHit(origin,inv,a.xyz,b.xyz,hit.distance)){node=int(a.w);continue;}
  if(b.w<.5){node++;continue;}
  int box=int(b.w)-1;SceneHit candidate=boxHit(box,origin,direction,hit.distance);
  if(candidate.kind==2){hit=candidate;sceneBoxIndex=box;}
  node=int(a.w);
 }
 return hit;
}
`,Wt=Gt+Qe+st+Ht,$t=Pt+Bt,Yt=`
vec3 sceneHitColor(SceneHit hit,vec3 position,vec3 view){
 vec3 normal=hit.normal,albedo=hit.tint;float side=hit.material==62?0.0:normal.y>.5?1.0:normal.y<-.5?2.0:0.0,glow=0.0,carved=0.0;
 if(hit.material>0){vec4 texel=textureLod(materials,vec3(hit.uv,float(hit.material)*3.0+side),0.0);albedo*=texel.rgb;glow=smoothstep(.45,.8,texel.r);if(hit.material==62)carved=smoothstep(.8,.95,texel.r)*smoothstep(.55,.75,texel.g);}
 if(hit.material==-1){vec2 cell=floor(hit.uv*16.0);albedo*=.86+fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453)*.22;}
 if(hit.kind==2&&hit.material==0)albedo*=normal.y>.5?1.0:normal.y<-.5?.5:abs(normal.x)>.5?.81:.86;
 albedo=pow(max(albedo,vec3(0.0)),vec3(2.2));if(hit.kind==2&&(hit.material==0||hit.material==-2))return albedo*2.0;
 vec3 transmission=vec3(0.0);float sky=skyVisibility(position,normal),visibility=SCENE_VISIBILITY(position,normal,hit.material,sky,transmission);vec3 result=albedo*(directionalLight(normal,visibility,sky)+localLight(position,normal)*1.5+SCENE_INDIRECT(position,normal));
 if(hit.material==5||hit.material==60||hit.material==63||hit.material==64||hit.material==67||hit.material==68)result+=SCENE_FOLIAGE(normal,view,albedo,transmission);
 if(hit.material==48)result+=albedo*vec3(8.0,5.2,2.3);if(hit.material==58)result=mix(result,albedo*vec3(8.0,5.2,2.3),glow);if(hit.material==62)result=mix(result,albedo*vec3(8.0,5.2,2.3),carved);if(hit.material==25)result=albedo*3.5+vec3(.18,.035,.002);return result;
}
`,jt=`
SceneHit intersectScene(vec3 origin,vec3 direction){
 SceneHit actor=dynamicHit(origin,direction,SceneHit(60.0,vec3(0.0,1.0,0.0),vec3(1.0),vec2(0.0),0,0)),hit=voxelHit(origin,direction,actor.distance);
 if(hit.kind==0&&actor.kind==2){actor.tint*=hit.tint;hit=actor;}
 return hit;
}
`,Vt=`
vec4 sceneReflection(vec3 origin,vec3 direction){
 SceneHit hit=intersectScene(origin,direction);
 if(hit.kind<=0)return vec4(0.0,0.0,0.0,-1.0);return vec4(sceneHitColor(hit,origin+direction*hit.distance,-direction),hit.distance);
}
`,qt=jt+Vt,lr=Wt+$t+Yt+qt;export{Ce as a,le as b,Ie as c,Ue as d,Jt as e,Mi as f,ki as g,Li as h,dt as i,Ci as j,Ge as k,ut as l,Ai as m,Ii as n,Ni as o,Oi as p,zi as q,Fi as r,Xi as s,$e as t,Bi as u,Wi as v,$i as w,Te as x,Ct as y,Ze as z,Ve as A,Qe as B,Qi as C,tt as D,er as E,tr as F,ir as G,rr as H,st as I,Gt as J,Pt as K,Wt as L,$t as M,Yt as N,jt as O};
