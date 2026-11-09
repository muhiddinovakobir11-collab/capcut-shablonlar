/**
 * CapCut Shablonlari - Onlayn Video Studio Generatori
 * Brauzerning o'zida Canvas va Web Audio / MediaRecorder yordamida video yasash
 * Muallif: Akobir
 */

class WebVideoStudio {
  constructor() {
    this.canvas = document.getElementById('studio-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.userImages = []; // Yuklangan Image obyektlari
    this.audioElement = new Audio();
    this.isPlaying = false;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.animationFrameId = null;

    // Sozlamalar
    this.fps = 30;
    this.durationPerImage = 2.5; // har bir rasm 2.5 soniya
    this.totalDuration = 10; // umumiy davomiylik (soniya)
    this.startTime = 0;
    this.currentEffect = 'zoom'; // 'zoom', 'beat', 'flash'
    this.overlayText = '';
    this.aspectRatio = window.innerWidth <= 768 ? '9:16' : '16:9';

    this.initCanvasSize();
    this.initEvents();
  }

  initCanvasSize() {
    if (!this.canvas) return;
    if (this.aspectRatio === '9:16') {
      this.canvas.width = 720;
      this.canvas.height = 1280;
    } else {
      this.canvas.width = 1280;
      this.canvas.height = 720;
    }
    this.drawPlaceholder();
  }

  initEvents() {
    window.addEventListener('resize', () => {
      const newRatio = window.innerWidth <= 768 ? '9:16' : '16:9';
      if (newRatio !== this.aspectRatio) {
        this.aspectRatio = newRatio;
        this.initCanvasSize();
      }
    });
  }

  // Boshlang'ich fon rasmi yoki ko'rsatma
  drawPlaceholder() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Gradient fon
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Kichik markaziy yozuv
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Suratlaringizni yuklang", w / 2, h / 2 - 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText("va 'Videoni yasash' tugmasini bosing", w / 2, h / 2 + 30);
  }

  // Rasmlarni yuklash (Fayllardan)
  async loadImagesFromFiles(files) {
    this.userImages = [];
    const loadPromises = Array.from(files).map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    });

    this.userImages = await Promise.all(loadPromises);
    if (this.userImages.length > 0) {
      this.totalDuration = this.userImages.length * this.durationPerImage;
      this.drawFrame(0);
    }
  }

  // Bitta kadrni chizish
  drawFrame(progressTime) {
    if (!this.ctx || this.userImages.length === 0) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    const imgIndex = Math.min(
      Math.floor(progressTime / this.durationPerImage),
      this.userImages.length - 1
    );
    const currentImg = this.userImages[imgIndex];
    const imageLocalTime = progressTime % this.durationPerImage;
    const t = imageLocalTime / this.durationPerImage; // 0 dan 1 gacha

    // Fonni tozalash
    ctx.clearRect(0, 0, w, h);

    // Effekt hisoblash (Zoom va Ritm)
    ctx.save();
    let scale = 1.0 + t * 0.15; // Sekin zoom
    let alpha = 1.0;

    // O'tish effekti (Fade in/out)
    if (t < 0.15) {
      alpha = t / 0.15;
    } else if (t > 0.85) {
      alpha = (1 - t) / 0.15;
    }

    // Beat titrash effekti
    if (this.currentEffect === 'beat') {
      const beatPulse = Math.sin(t * Math.PI * 8);
      if (beatPulse > 0.6) {
        scale += 0.04;
      }
    }

    ctx.globalAlpha = Math.max(0.1, alpha);

    // Rasmni markazdan masshtab bilan chizish (cover)
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    ctx.translate(-w / 2, -h / 2);

    this.drawImageCover(ctx, currentImg, 0, 0, w, h);
    ctx.restore();

    // Flash / chaqnash effekti (o'tish lahzasida)
    if (t < 0.1 && this.currentEffect === 'flash') {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * (1 - t / 0.1)})`;
      ctx.fillRect(0, 0, w, h);
    }

    // Qorong'ulashtiruvchi gradient (pastki matn o'qilishi uchun)
    const overlayGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
    overlayGrad.addColorStop(0, 'rgba(0,0,0,0)');
    overlayGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, h * 0.6, w, h * 0.4);

    // Matn overlay
    if (this.overlayText) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(236, 72, 153, 0.8)';
      ctx.shadowBlur = 15;
      ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.overlayText, w / 2, h - 80);

      // Suv belgisi (Watermark)
      ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 5;
      ctx.fillText("Akobir CapCut Studio", w / 2, h - 35);
      ctx.restore();
    }
  }

  // Rasmni to'liq proporsiyada markazlashtirib chizish (object-fit: cover)
  drawImageCover(ctx, img, x, y, w, h) {
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let sWidth = img.width;
    let sHeight = img.height;
    let sx = 0;
    let sy = 0;

    if (imgRatio > canvasRatio) {
      sWidth = img.height * canvasRatio;
      sx = (img.width - sWidth) / 2;
    } else {
      sHeight = img.width / canvasRatio;
      sy = (img.height - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
  }

  // Jonli ijroni boshlash (Preview)
  playPreview(onComplete) {
    if (this.userImages.length === 0) return;
    this.stopPreview();

    this.isPlaying = true;
    this.startTime = performance.now();

    const loop = (currentTime) => {
      if (!this.isPlaying) return;

      const elapsed = (currentTime - this.startTime) / 1000;
      if (elapsed >= this.totalDuration) {
        this.stopPreview();
        if (onComplete) onComplete();
        return;
      }

      this.drawFrame(elapsed);
      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  // Ijroni to'xtatish
  stopPreview() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Videoni yozib olish va Yuklab berish (Export)
  exportVideo(onProgress, onDone) {
    if (this.userImages.length === 0) {
      alert("Iltimos, avval kamida 1-2 ta rasm yuklang!");
      return;
    }

    this.stopPreview();
    this.isRecording = true;
    this.recordedChunks = [];

    // Canvas'dan video oqimini olish (30 FPS)
    const stream = this.canvas.captureStream(this.fps);
    let options = { mimeType: 'video/webm; codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm' };
    }

    try {
      this.mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      this.mediaRecorder = new MediaRecorder(stream);
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-montaj-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      this.isRecording = false;
      if (onDone) onDone();
    };

    this.mediaRecorder.start();
    this.startTime = performance.now();

    const recordLoop = (currentTime) => {
      const elapsed = (currentTime - this.startTime) / 1000;
      const progressPercent = Math.min(100, Math.round((elapsed / this.totalDuration) * 100));
      
      if (onProgress) onProgress(progressPercent);

      if (elapsed >= this.totalDuration) {
        this.mediaRecorder.stop();
        return;
      }

      this.drawFrame(elapsed);
      requestAnimationFrame(recordLoop);
    };

    requestAnimationFrame(recordLoop);
  }
}

window.WebVideoStudio = WebVideoStudio;
