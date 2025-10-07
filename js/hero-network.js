(function(){
  var canvas = document.getElementById('hero-network');
  if(!canvas){ return; }
  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount; // will be set based on size
  var maxLineDist = 140;
  var deviceRatio = Math.min(window.devicePixelRatio || 1, 2);
  var mouse = { x: null, y: null, active: false };

  function setCanvasSize(){
    var rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * deviceRatio);
    canvas.height = Math.floor(rect.height * deviceRatio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
    particleCount = Math.max(40, Math.min(120, Math.floor(rect.width * rect.height / 18000)));
    initParticles();
  }

  function initParticles(){
    particles = [];
    for(var i=0;i<particleCount;i++){
      particles.push({
        x: Math.random() * canvas.width / deviceRatio,
        y: Math.random() * canvas.height / deviceRatio,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 0.6
      });
    }
  }

  function step(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
    requestAnimationFrame(step);
  }

  function draw(){
    // nodes
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for(var i=0;i<particles.length;i++){
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > canvas.width/deviceRatio) p.vx *= -1;
      if(p.y < 0 || p.y > canvas.height/deviceRatio) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }
    // connections
    for(var a=0;a<particles.length;a++){
      for(var b=a+1;b<particles.length;b++){
        var pa = particles[a], pb = particles[b];
        var dx = pa.x - pb.x, dy = pa.y - pb.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < maxLineDist){
          var alpha = 1 - (dist / maxLineDist);
          ctx.strokeStyle = 'rgba(255,255,255,' + (alpha*0.45) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
      if(mouse.active){
        var pm = particles[a];
        var mdx = pm.x - mouse.x, mdy = pm.y - mouse.y;
        var md = Math.sqrt(mdx*mdx + mdy*mdy);
        if(md < maxLineDist){
          var malpha = 1 - (md / maxLineDist);
          ctx.strokeStyle = 'rgba(255,255,255,' + (malpha*0.6) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pm.x, pm.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function onMouseMove(e){
    var rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left);
    mouse.y = (e.clientY - rect.top);
    mouse.active = true;
  }
  function onMouseLeave(){ mouse.active = false; }

  window.addEventListener('resize', debounce(setCanvasSize, 150));
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);

  function debounce(fn, wait){
    var t; return function(){
      clearTimeout(t); var args = arguments; var self = this;
      t = setTimeout(function(){ fn.apply(self, args); }, wait);
    };
  }

  setCanvasSize();
  requestAnimationFrame(step);
})();


