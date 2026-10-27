import{C as y,G as A,L as T,N as _,b as u,d as h,e as v,f as d,g,j as m,o as p,p as b,s as E,u as R,v as x,w as F}from"./chunk-3I2MYMXQ.js";import{e as f}from"./chunk-EXPZN3PA.js";import"./chunk-26YLDVPV.js";import"./chunk-XVCADGWD.js";import"./chunk-FEWFQD6B.js";var l=`
vec3 probeDirection(vec3 cell,int ray){
 float rotation=fract(sin(dot(cell,vec3(17.13,91.71,31.37)))*43758.5453)*6.2831853;
 float h=1.0-2.0*(float(ray)+.5)/24.0,r=sqrt(1.0-h*h),angle=float(ray)*2.39996323+rotation;
 return vec3(cos(angle)*r,h,sin(angle)*r);
}`,I=`#version 300 es
precision highp float;layout(location=0) in vec3 coordinate;flat out vec3 cell;flat out int ray;
void main(){cell=coordinate;ray=gl_VertexID;gl_Position=vec4((vec2(ray,gl_InstanceID)+.5)/vec2(24,64)*2.0-1.0,0,1);gl_PointSize=1.0;}`,U=`#version 300 es
precision highp float;flat in vec3 cell;flat in int ray;
layout(location=0) out vec4 hitPosition;layout(location=1) out vec4 hitSurface;
layout(location=2) out vec4 hitTint;layout(location=3) out vec4 probePoint;
${T}
${A.split("vec3 indirectLight")[0]}
${l}
void main(){
 vec3 point=cell*2.0+.5;bool valid=false;
 for(int i=0;i<8;i++){vec3 candidate=cell*2.0+.5+vec3(i&1,(i>>1)&1,(i>>2)&1);if(giPassable(giCell(candidate))){point=candidate;valid=true;break;}}
 probePoint=vec4(point,valid?1.0:0.0);hitPosition=vec4(0);hitSurface=vec4(0);hitTint=vec4(0);
 if(!valid)return;
 vec3 direction=probeDirection(cell,ray);SceneHit hit=voxelHit(point-rayOrigin,direction,20.0);
 if(hit.kind!=1&&hit.kind!=3)return;
 // Preserve the exact texture coordinates from intersection, including negative
 // world coordinates and the chosen face. No half-float round trip at seams.
 hitPosition=vec4(point-rayOrigin+direction*hit.distance,float(hit.material));
 hitSurface=vec4(hit.uv,dot(hit.normal,vec3(1,2,3)),1);
 hitTint=vec4(hit.tint,1);
}`,O=`#version 300 es
precision highp float;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0,1);}`,w=`#version 300 es
precision highp float;out vec4 radiance;
uniform highp sampler2D tracePosition,traceSurface,traceTint,tracePoint;
uniform highp sampler2DArray materials;
${x}
${b}
${g}${v}
#define SCENE_FOLIAGE(n,v,a,t) foliageLighting(n,v,a,t)
#define SCENE_VISIBILITY(p,n,m,s,t) foliageVisibility(p,n,m,s,t)
#define SCENE_INDIRECT(p,n) vec3(0.0)
struct SceneHit{float distance;vec3 normal;vec3 tint;vec2 uv;int material;int kind;};
// A short-lived flash must not survive in the gradually refreshed probe cache.
// Visible surface/reflection shading still uses ordinary localLight elsewhere.
#define localLight staticLocalLight
${_}
#undef localLight
${l}
void main(){
 ivec2 pixel=ivec2(gl_FragCoord.xy);vec4 surface=texelFetch(traceSurface,pixel,0);radiance=vec4(0);
 if(surface.w<.5)return;
 vec4 position=texelFetch(tracePosition,pixel,0),point=texelFetch(tracePoint,pixel,0);
 float axis=abs(surface.z);vec3 normal=(axis<1.5?vec3(1,0,0):axis<2.5?vec3(0,1,0):vec3(0,0,1))*sign(surface.z);
 SceneHit hit=SceneHit(0.0,normal,texelFetch(traceTint,pixel,0).rgb,surface.xy,int(position.w),1);
 vec3 direction=probeDirection(floor(point.xyz*.5),pixel.x);
 radiance=vec4(min(vec3(4.0),sceneHitColor(hit,position.xyz,-direction)),1);
}`,V=`#version 300 es
precision highp float;layout(location=0) in vec3 coordinate;flat out vec3 cell;flat out int row;
void main(){cell=coordinate;row=gl_VertexID;ivec3 q=(ivec3(coordinate)%ivec3(16,8,16)+ivec3(16,8,16))%ivec3(16,8,16);vec2 address=vec2(q.x,q.z+q.y*16);gl_Position=vec4((address+.5)/vec2(16,128)*2.0-1.0,0,1);gl_PointSize=1.0;}`,C=`#version 300 es
precision highp float;flat in vec3 cell;flat in int row;uniform highp sampler2D rayRadiance,tracePoint;uniform int giRays;
layout(location=0) out vec4 c0;layout(location=1) out vec4 cx;layout(location=2) out vec4 cy;layout(location=3) out vec4 cz;
${l}
void main(){
 vec4 point=texelFetch(tracePoint,ivec2(0,row),0);vec3 a=vec3(0),x=vec3(0),y=vec3(0),z=vec3(0);
 for(int i=0;i<giRays;i++){vec3 direction=probeDirection(cell,i),light=texelFetch(rayRadiance,ivec2(i,row),0).rgb;a+=light;x+=light*direction.x;y+=light*direction.y;z+=light*direction.z;}
 c0=vec4(a/24.0,point.x);cx=vec4(x/12.0,point.y);cy=vec4(y/12.0,point.z);cz=vec4(z/12.0,point.w);
}`,N=["materials","giBricks","giTable","giTableOrigin","giRays","tracePosition","traceSurface","traceTint","tracePoint","rayRadiance",...y,...R,...p,...d,...u],S=class L{static async create(i){let t=await Promise.allSettled([[I,U],[O,w],[V,C]].map(([a,e])=>f(i,a,e)));if(t.some(a=>a.status==="rejected")){for(let a of t)a.status==="fulfilled"&&i.deleteProgram(a.value);throw t.find(a=>a.status==="rejected").reason}let r=new L(i,t.map(a=>a.value));try{return r.allocate(),r}catch(a){throw r.dispose(),a}}constructor(i,t){this.gl=i,this.programs=t.map(r=>({program:r,u:Object.fromEntries(N.map(a=>[a,i.getUniformLocation(r,a)]))})),this.targets=[],this.bytes=1536*16*5}target(i){let t=this.gl,r={framebuffer:t.createFramebuffer(),textures:[]};this.targets.push(r),t.bindFramebuffer(t.FRAMEBUFFER,r.framebuffer);for(let a=0;a<i;a++){let e=t.createTexture();r.textures.push(e),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,e),t.texStorage2D(t.TEXTURE_2D,1,t.RGBA32F,24,64);for(let n of[t.TEXTURE_MIN_FILTER,t.TEXTURE_MAG_FILTER])t.texParameteri(t.TEXTURE_2D,n,t.NEAREST);t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+a,t.TEXTURE_2D,e,0)}if(t.drawBuffers(r.textures.map((a,e)=>t.COLOR_ATTACHMENT0+e)),t.checkFramebufferStatus(t.FRAMEBUFFER)!==t.FRAMEBUFFER_COMPLETE)throw Error("Diffuse lighting scratch framebuffer unavailable");return t.bindFramebuffer(t.FRAMEBUFFER,null),r}allocate(){let i=this.gl;this.hits=this.target(4),this.radiance=this.target(1),this.rayVao=i.createVertexArray(),this.integrateVao=i.createVertexArray(),this.fullscreenVao=i.createVertexArray(),this.buffer=i.createBuffer(),i.bindBuffer(i.ARRAY_BUFFER,this.buffer),i.bufferData(i.ARRAY_BUFFER,768,i.DYNAMIC_DRAW);for(let[t,r]of[[this.rayVao,1],[this.integrateVao,0]])i.bindVertexArray(t),i.bindBuffer(i.ARRAY_BUFFER,this.buffer),i.enableVertexAttribArray(0),i.vertexAttribPointer(0,3,i.FLOAT,!1,12,0),i.vertexAttribDivisor(0,r)}texture(i,t,r,a){let e=this.gl;e.activeTexture(e.TEXTURE0+r),e.bindTexture(e.TEXTURE_2D,a),e.uniform1i(i[t],r)}draw(i,t,r,a){let e=this.gl;e.disable(e.DEPTH_TEST),e.disable(e.BLEND),e.disable(e.CULL_FACE),e.bindBuffer(e.ARRAY_BUFFER,this.buffer),e.bufferSubData(e.ARRAY_BUFFER,0,i.vertices);let{program:n,u:o}=this.programs[0];e.useProgram(n),i.scene.bind(o),e.uniform1i(o.giBricks,8),e.uniform1i(o.giTable,9),e.uniform3i(o.giTableOrigin,...i.scene.tableOrigin),e.bindFramebuffer(e.FRAMEBUFFER,this.hits.framebuffer),e.viewport(0,0,24,64),e.bindVertexArray(this.rayVao),e.drawArraysInstanced(e.POINTS,0,24,a),{program:n,u:o}=this.programs[1],e.useProgram(n),h(e,o,i.scene,null,t),r.materials.bind(),e.uniform1i(o.materials,2),F(e,o,r.environment),m(e,o,r.localLight,r.lightFallback,t,!1,i.scene),E(e,o,r.shadow,r.shadowFallback,t);for(let[P,D,B]of[[0,"tracePosition",10],[1,"traceSurface",1],[2,"traceTint",5],[3,"tracePoint",6]])this.texture(o,D,B,this.hits.textures[P]);e.bindFramebuffer(e.FRAMEBUFFER,this.radiance.framebuffer),e.viewport(0,0,24,a),e.bindVertexArray(this.fullscreenVao),e.drawArrays(e.TRIANGLES,0,3),{program:n,u:o}=this.programs[2],e.useProgram(n),this.texture(o,"rayRadiance",0,this.radiance.textures[0]),this.texture(o,"tracePoint",1,this.hits.textures[3]),e.uniform1i(o.giRays,24),e.bindFramebuffer(e.FRAMEBUFFER,i.framebuffer),e.viewport(0,0,16,128),e.bindVertexArray(this.integrateVao),e.drawArrays(e.POINTS,0,a),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight)}dispose(){let i=this.gl;for(let t of this.targets){for(let r of t.textures)i.deleteTexture(r);i.deleteFramebuffer(t.framebuffer)}for(let t of this.programs)i.deleteProgram(t.program);for(let t of[this.rayVao,this.integrateVao,this.fullscreenVao])t&&i.deleteVertexArray(t);this.buffer&&i.deleteBuffer(this.buffer)}};export{S as IrradiancePasses};
