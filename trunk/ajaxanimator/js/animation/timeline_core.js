Ax.timeline = {el: null, mask: null};
Ax.layers = {};
Ax.keyframes = [];

Ax.timeline_contextmenu = null;
Ax.tstat = {
  layers: 0,
  frames: 0
}

Ax.tcurrent = {
  layer: null,
  frame: null
}

Ax.renameLayer = function(oldname,newname){
  Ax.layers[newname]=Ax.layers[oldname];
  delete Ax.layers[oldname]
  
  Ax.canvas_storage[newname] = Ax.canvas_storage[oldname]
  delete Ax.canvas_storage[oldname]
  
  return Ax.layers
}

Ax.deleteLayer = function(name){
  delete Ax.layers[name]
  
}

Ax.addLayer = function(layername){
  layername = (layername)?layername:"Layer "+((Ax.tstat.layers+1).toString());
  if(Ax.viewport){
    Ax.viewport.findById("layers").getStore().add(new Ext.data.Record({comment:layername}))
  }
  var f_layer = document.createElement("tr"); 
  Ax.layers[layername] = {el:f_layer, keyframes: [], tweens: []}
  //Ext.log(f_layer.innerHTML)
  //Ax.current.layer = layer
  Ax.tstat.layers++
  Ax.timeline.el.appendChild(f_layer)
  
  for(var frame = 0; frame < Ax.tstat.frames; frame++){
    Ax.addFrame_core(frame+1,layername)
  }
  //Ext.log(f_layer.innerHTML)
  return f_layer;
}

Ax.addFrame = function(){
  Ax.tstat.frames++
  for(var layer in Ax.layers){
    Ax.addFrame_core(Ax.tstat.frames,layer)
  }
}

Ax.addFrames = function(frames){ //mind the s, this just loops through whatever number and makes so many frames
  for(var i = 0; i < frames; i++){
    Ax.addFrame()
  }
}

Ax.create_timeline_mask = function(){
  Ax.timeline.mask = document.createElement("div")
  Ax.timeline.mask.className = "fselect_mask"
  Ax.timeline.el.appendChild(Ax.timeline.mask)
}

Ax.addFrameListeners = function(frame_cell,frame,layer){
  new Ext.ToolTip({
   target: frame_cell,
   trackMouse: true,
   shadow: false,
   title: 'Frame '+frame.toString()+", "+layer.toString(),
   html: 'A very simple tooltip'
  });
 
  Ext.get(frame_cell.firstChild).on("mousedown",function(event,target){
    for(var layer in Ax.layers){
      if(target.parentNode.parentNode == Ax.layers[layer].el){
        Ax.selectFrame(parseInt(target.innerHTML),layer)
        break;
      }
    }
  })
}

Ax.addFrame_core = function(frame,layer){
  //console.log(layer)
  var frame_cell = document.createElement("td")
  //frame.style.bgColor = "#99BBE8";
  frame_cell.className = "frame"

  var frame_content = document.createElement("div")
  frame_content.className = "frame"
  frame_content.innerHTML =  frame //[1,2,5,10,42,420,316,4242,1337][Math.floor(Math.random()*9)];

  switch(frame_content.innerHTML.length){
    case 1:
      frame_content.style.marginTop = "1px";    
      frame_content.style.fontSize = "110%";
      //frame_content.style.marginTop = "-6px";
      //frame_content.style.fontSize = "140%";
    break;
    case 2:
      frame_content.style.marginBottom = "-2px";    
      frame_content.style.fontSize = "90%";
      break;
    case 3:
      frame_content.style.marginBottom = "-7px"
      frame_content.style.fontSize = "65%";
    break;
    case 4:
      frame_content.style.marginBottom = "-11px"
      frame_content.style.fontSize = "40%";
    break;
  }
  
  frame_cell.appendChild(frame_content)
  
  Ax.addFrameListeners(frame_cell,frame,layer)
  
  Ax.layers[layer].el.appendChild(frame_cell)
}
//#99BBE8



Ax.getFrame = function(frame,layer){
  if(frame > 0){
    return Ext.get(Ax.layers[layer].el.childNodes[frame-1]);
  }
}

Ax.selectFrame = function(frame,layer){
  Ax.autodiff(); //save current state, etc.
    
  //Set cursor
  Ax.tcurrent.frame = frame;
  Ax.tcurrent.layer = layer;
  //Change Styles
  Ax.selectFrame_core(frame,layer);
  //Add frames if necessary
  if(frame > Ax.tstat.frames - 5){
    Ax.addFrames(10 - (Ax.tstat.frames - frame))
  }

  //change the canvas to new one if possible
  Ax.loadframe(frame,layer)
  
  
}

Ax.selectFrame_core = function(frame,layer){
  Ax.timeline.mask.style.top = (Ax.getFrame(frame,layer).getY()-Ext.get(Ax.timeline.el).getY()).toString()+"px"
  Ax.timeline.mask.style.left = (Ax.getFrame(frame,layer).getX()-Ext.get(Ax.timeline.el).getX()).toString()+"px"
}

Ax.insertFrame = function(frame,layer,count){
  if(frame < 1){return false;}; //OMG!! PONIES!
  if(!frame){frame = Ax.tcurrent.frame}
  if(!layer){layer = Ax.tcurrent.layer}
  if(!count){count = 1}

  for(var i = 0; i < Ax.layers[layer].keyframes.length; i++){
    if(Ax.layers[layer].keyframes[i] > frame){
      Ax.layers[layer].keyframes[i]+=count
    }
  }
  for(var i = 0; i < Ax.layers[layer].tweens.length; i++){
    if(Ax.layers[layer].tweens[i] > frame){
      Ax.layers[layer].tweens[i]+=count
    }
  }
  for(var i = frame; i < Ax.tstat.frames; i++){
    Ax.renderFrame(i,layer)
  }
}

Ax.renderFrame = function(frame,layer){
  switch(Ax.frameType(frame,layer)){
    case "keyframe":
      Ax.toKeyframe_core(frame,layer)
      break;
    case "tween":
      Ax.toTween_core(frame,layer)
      break;
    case "blank":
      Ax.toBlank_core(frame,layer)
      break;
  }
}

Ax.frameType = function(frame,layer){
  if(Ax.layers[layer].keyframes.indexOf(frame) != -1){
    return "keyframe"
  }
  if(Ax.layers[layer].tweens.indexOf(frame) != -1){
    return "tween"
  }
  return "blank"
}

Ax.toKeyframe = function(frame,layer){
  if(!frame){frame = Ax.tcurrent.frame}
  if(!layer){layer = Ax.tcurrent.layer}
  
  if(Ax.layers[layer].keyframes.indexOf(frame) == -1){
    Ax.layers[layer].keyframes.push(frame);
  }
  return Ax.toKeyframe_core(frame,layer)
}

Ax.frameClass = function(frame,layer,frameclass){
  Ax.getFrame(frame,layer).dom.className = "frame "+frameclass;
}

Ax.toKeyframe_core = function(frame,layer){
  Ax.frameClass(frame,layer,"keyframe");
}

//there is no non-core Ax.toTween as it is supposedly automatic
Ax.toTween_core = function(frame,layer){
  Ax.frameClass(frame,layer,"tween");
}

Ax.toBlank_core = function(frame,layer){
  Ax.frameClass(frame,layer)
}




Ax.initTimeline = function(){
  Ext.get("timeline_core").dom.innerHTML = ""
  var frameTable = document.createElement("table");
  frameTable.setAttribute("cellspacing","0")
  frameTable.setAttribute("cellpadding","0")
  frameTable.setAttribute("border","0")
  //frameTable.style.border = "1px solid gra"
  var frameTBody = document.createElement("tbody");
  frameTable.appendChild(frameTBody)
  Ext.get("timeline_core").dom.appendChild(frameTable)
  Ax.timeline.el = frameTBody;
  Ext.get("timeline_core").on("selectstart",function(){return false})

  Ext.get("timeline_core").on("contextmenu",function(event,target){
    //console.log(event,target)
    event.stopEvent();
    if(target.className == "fselect_mask"){
      new Ext.menu.Menu({
        items: [
        {text: "Add Layer", iconCls: "tb_newlayer", handler: function(){Ax.addLayer()}},
        {text: "To Keyframe", iconCls: "tb_addkeyframe", handler: function(){Ax.toKeyframe()}},
        {text: "Insert Frame", iconCls: "tb_insertframe", handler: function(){Ax.insertFrame()}}
        ]
      }).showAt(event.xy)
    }else{
      new Ext.menu.Menu({
        items: [
         {text: "Add Layer", iconCls: "tb_newlayer", handler: function(){Ax.addLayer()}}
        ]
      }).showAt(event.xy)
    }
  })
  Ax.create_timeline_mask();
}

/*
Ext.onReady(function(){
  Ax.initTimeline()
  Ax.addLayer()
  Ax.addFrames(150)
})
//*/ /**/ //END

