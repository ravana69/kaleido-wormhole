var canvas, stage;

var total = 8, 
    shapes = [],
    cont,
    k,
    bg,
    canv;

function init() {
  canvas = document.getElementById("testCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stage = new createjs.Stage(canvas);
  stage.autoClear = false;
  
  var w = h = Math.min(window.innerWidth, window.innerHeight),
      randColor = Math.random()*360|0;
  cont = new createjs.Container();
  
  
  for(var i=0;i<total;i++) {
    var s = new createjs.Shape(),
        _w = w - w/total*i,
        color = createjs.Graphics.getHSL(randColor, 100, i/total*100|0);
    s.fillCmd = s.graphics.f(color).command
    s.rectCmd = s.graphics.dr(0, 0, _w, _w).command;
    s.regX = s.regY = _w/2;
    s.alpha = i/total;
    shapes.push(s);
    cont.addChild(s);
  }
  
  bg = new createjs.Shape().set({alpha:0.04});
  bg.fillCmd = bg.graphics.f("black").dr(0,0,window.innerWidth,window.innerHeight).command;
  
  canv = new createjs.Bitmap(canvas).set({regX:canvas.width/2,regY:canvas.height/2,x:canvas.width/2,y:canvas.height/2})
  
  k = new Kaleidoscope(800, cont, 8, [1,5,3,2]);
  stage.addChild(k, canv, bg);
  k.x = canvas.width >> 1;
  k.y = canvas.height >> 1;
  
  var duration = 2500 + 1000/shapes.length;
  for(i=shapes.length-1;i>=0;i--) {
    (function(shape, delay){
      setTimeout(function() {
        createjs.Tween.get(shape, {loop:true})
          .to({rotation:270}, duration, createjs.Ease.quadInOut)
          .to({rotation:0}, duration*0.75, createjs.Ease.quadInOut);
      }, delay);
    })(shapes[i], i*500/shapes.length);
  }
  
  createjs.ColorPlugin.install()
  setInterval(function() {
    var randColor = Math.random()*360|0;
    for (var i=shapes.length-1; i>=0; i--) {
      var s = shapes[i];
      var color = createjs.Graphics.getHSL(randColor, 100, i/total*100|0);
      createjs.Tween.get(s.fillCmd)
        .wait(i*1000/shapes.length)
        .to({style:color}, 1000, createjs.Ease.quadOut);
    }
  },3000);
  
  createjs.Tween.get(cont, {loop:true})
    .to({scale:0.5}, 1000)
    .to({scale:1}, 1000);
  
  createjs.Ticker.on("tick", tick);
  createjs.Ticker.timingMode = "raf";
}

var r = 0;
function tick(event) {
  cont.rotation+=1;
  k.rotation-=0.8;
  canv.scale *= 1.1;
  canv.rotation+=2;
  stage.update(event);
  canv.scale = 1;
  canv.rotation = 0;
}

window.addEventListener("resize", draw);
function draw() {
  
  canvas.width = bg.fillCmd.w = window.innerWidth;
  bg.fillCmd.h = canvas.height = window.innerHeight;

  canv.set({regX:canvas.width/2,regY:canvas.height/2,x:canvas.width/2,y:canvas.height/2});
  var w = h = Math.min(window.innerWidth, window.innerHeight);
  for(var i=0;i<total;i++) {
    var s = shapes[i];
    var _w = w - w/total*i;
    s.rectCmd.w = s.rectCmd.h = _w;
    s.regX = s.regY = _w/2; 
  }
  
  k.x = canvas.width >> 1;
  k.y = canvas.height >> 1;
}


init();
LabTemplate.loadComplete();