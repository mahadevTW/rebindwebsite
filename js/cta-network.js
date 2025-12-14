(function(){
  var canvas = document.getElementById('cta-network');
  if(!canvas){ return; }
  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount; 
  var maxLineDist = 160;
  var deviceRatio = Math.min(window.devicePixelRatio || 1, 2);

  function setCanvasSize(){
    var rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * deviceRatio);
    canvas.height = Math.floor(rect.height * deviceRatio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
    particleCount = Math.max(40, Math.min(110, Math.floor(rect.width * rect.height / 22000)));
    initParticles(rect);
  }

  function initParticles(rect){
    particles = [];
    for(var i=0;i<particleCount;i++){
      particles.push({
        x: Math.random() * canvas.width / deviceRatio,
        y: Math.random() * canvas.height / deviceRatio,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.8 + 0.6
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // nodes
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
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
          ctx.strokeStyle = 'rgba(255,255,255,' + (alpha*0.35) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
    }
  }

  function step(){ draw(); requestAnimationFrame(step); }

  window.addEventListener('resize', debounce(setCanvasSize, 150));

  function debounce(fn, wait){
    var t; return function(){ clearTimeout(t); t = setTimeout(fn, wait); };
  }

  setCanvasSize();
  requestAnimationFrame(step);
})();



