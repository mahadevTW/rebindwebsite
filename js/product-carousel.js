(function(){
  var root = document.getElementById('productCarousel');
  if(!root){ return; }
  var slides = Array.prototype.slice.call(root.querySelectorAll('.pc-slide'));
  var indicators = Array.prototype.slice.call(root.querySelectorAll('.pc-indicators li'));
  var progress = root.querySelector('.pc-progress-bar');
  var flow = null; // flow path removed
  var flowFg = null;

  var index = 0;
  var duration = 2000; // autoplay per slide (ms)
  var timer, startTs, rafId;
  var paused = false;

  function show(i){
    slides.forEach(function(s){ s.classList.remove('active'); });
    indicators.forEach(function(b){ b.classList.remove('active'); });
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    resetProgress();
    triggerImageEnter(slides[index]);
  }

  function resetProgress(){
    if(progress){ progress.style.width = '0%'; }
    cancelAnimationFrame(rafId);
    clearTimeout(timer);
    startTs = performance.now();
    if(progress){ tick(startTs); }
    timer = setTimeout(function(){ next(); }, duration);
  }

  function tick(ts){
    if(paused){ startTs += 16; }
    var elapsed = Math.min(duration, ts - startTs);
    if(progress){ progress.style.width = (elapsed / duration * 100) + '%'; }
    rafId = requestAnimationFrame(tick);
  }

  function next(){ show(index + 1); }
  function goTo(i){ show(i); }

  // Controls
  indicators.forEach(function(btn){
    btn.addEventListener('click', function(){ goTo(parseInt(btn.getAttribute('data-target'), 10)); });
  });

  // Pause on hover for desktop only
  if(!window.matchMedia('(max-width: 480px)').matches){
    root.addEventListener('mouseenter', function(){ paused = true; });
    root.addEventListener('mouseleave', function(){ paused = false; });
  }

  // Swipe support (basic)
  var touchStartX = null;
  root.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; });
  root.addEventListener('touchend', function(e){
    if(touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){ show(index + (dx < 0 ? 1 : -1)); }
    touchStartX = null;
  });

  show(0);

  // flow animation removed

  // Add a subtle fade/scale-in for active slide image
  function triggerImageEnter(activeSlide){
    try{
      var img = activeSlide && activeSlide.querySelector('.pc-media img');
      if(!img){ return; }
      img.classList.remove('img-enter');
      // reflow to restart animation
      void img.offsetWidth;
      img.classList.add('img-enter');
    }catch(e){}
  }
})();


