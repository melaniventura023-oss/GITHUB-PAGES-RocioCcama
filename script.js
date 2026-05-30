// ══════════════════════════════════════════════
// CURSOR PERSONALIZADO
// ══════════════════════════════════════════════
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx+'px'; dot.style.top = my+'px';
});

function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ══════════════════════════════════════════════
// FONDO PARALLAX ANIMADO
// ══════════════════════════════════════════════
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let bgW, bgH, bgParticles = [], bgMouse = {x: 0, y: 0};

function resizeBg() {
  bgW = bgCanvas.width = window.innerWidth;
  bgH = bgCanvas.height = window.innerHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);

document.addEventListener('mousemove', e => {
  bgMouse.x = e.clientX; bgMouse.y = e.clientY;
});

class BgParticle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * bgW;
    this.y = Math.random() * bgH;
    this.size = Math.random() * 3 + 0.7;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.baseOpacity = Math.random() * 0.4 + 0.1;
    this.opacity = this.baseOpacity;
    this.pulse = Math.random() * Math.PI * 2;
    this.hue = Math.random() > 0.75 ? '#f3d36b' : (Math.random() > 0.5 ? '#c04a1a' : '#8b9aa2');
  }
  update() {
    this.pulse += 0.02;
    this.opacity = this.baseOpacity + Math.sin(this.pulse) * 0.12;
    const dx = bgMouse.x - this.x, dy = bgMouse.y - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 180) {
      this.x -= dx * 0.0025;
      this.y -= dy * 0.0025;
    }
    this.x += this.speedX + Math.sin(this.pulse) * 0.1;
    this.y += this.speedY + Math.cos(this.pulse) * 0.08;
    if (this.x < -20) this.x = bgW + 20;
    if (this.x > bgW + 20) this.x = -20;
    if (this.y < -20) this.y = bgH + 20;
    if (this.y > bgH + 20) this.y = -20;
  }
  draw() {
    bgCtx.save();
    bgCtx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
    bgCtx.fillStyle = this.hue;
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.size + Math.sin(this.pulse) * 0.6, 0, Math.PI*2);
    bgCtx.fill();
    bgCtx.restore();
  }
}

for (let i = 0; i < 220; i++) bgParticles.push(new BgParticle());

const bgLines = Array.from({length: 18}, () => ({
  x: Math.random() * bgW, y: Math.random() * bgH,
  len: Math.random() * 280 + 80, angle: Math.random() * Math.PI,
  speed: (Math.random() - 0.5) * 0.3,
  opacity: Math.random() * 0.07 + 0.03,
  hue: Math.random() > 0.7 ? '#f5c842' : '#8a7560'
}));

const bgGlows = Array.from({length: 12}, () => ({
  x: Math.random() * bgW,
  y: Math.random() * bgH,
  r: Math.random() * 260 + 160,
  alpha: Math.random() * 0.28 + 0.18,
  speedX: (Math.random() - 0.5) * 0.22,
  speedY: (Math.random() - 0.5) * 0.22,
  hue: Math.random() > 0.5 ? 'rgba(245,200,66,0.3)' : 'rgba(255,255,255,0.2)'
}));

function animateBg() {
  const gradient = bgCtx.createLinearGradient(0, 0, bgW, bgH);
  gradient.addColorStop(0, '#000105');
  gradient.addColorStop(0.3, '#000a14');
  gradient.addColorStop(0.65, '#00070f');
  gradient.addColorStop(1, '#000309');
  bgCtx.fillStyle = gradient;
  bgCtx.fillRect(0, 0, bgW, bgH);

  bgGlows.forEach(glow => {
    glow.x += glow.speedX;
    glow.y += glow.speedY;
    glow.alpha = 0.22 + Math.sin(Date.now() * 0.0009 + glow.r) * 0.08;
    if (glow.x < -glow.r) glow.x = bgW + glow.r;
    if (glow.x > bgW + glow.r) glow.x = -glow.r;
    if (glow.y < -glow.r) glow.y = bgH + glow.r;
    if (glow.y > bgH + glow.r) glow.y = -glow.r;

    const glowGradient = bgCtx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.r);
    const baseColor = glow.hue.slice(0, glow.hue.lastIndexOf(','));
    glowGradient.addColorStop(0, `${baseColor}, ${Math.min(0.75, glow.alpha + 0.35)})`);
    glowGradient.addColorStop(0.18, `${baseColor}, ${Math.min(0.45, glow.alpha + 0.18)})`);
    glowGradient.addColorStop(1, 'rgba(0,0,0,0)');
    bgCtx.fillStyle = glowGradient;
    bgCtx.fillRect(glow.x - glow.r, glow.y - glow.r, glow.r * 2, glow.r * 2);
  });

  bgLines.forEach(l => {
    l.angle += l.speed * 0.02;
    l.x += Math.cos(l.angle) * l.speed * 3;
    l.y += Math.sin(l.angle) * l.speed * 2;
    if (l.x < -100) l.x = bgW + 100;
    if (l.x > bgW + 100) l.x = -100;
    if (l.y < -100) l.y = bgH + 100;
    if (l.y > bgH + 100) l.y = -100;

    bgCtx.save();
    bgCtx.globalAlpha = l.opacity;
    bgCtx.strokeStyle = l.hue;
    bgCtx.lineWidth = 0.8;
    bgCtx.beginPath();
    bgCtx.moveTo(l.x, l.y);
    bgCtx.lineTo(l.x + Math.cos(l.angle) * l.len, l.y + Math.sin(l.angle) * l.len);
    bgCtx.stroke();
    bgCtx.restore();
  });

  bgParticles.forEach(p => { p.update(); p.draw(); });

  bgCtx.save();
  bgCtx.globalCompositeOperation = 'lighter';
  bgCtx.fillStyle = 'rgba(255,255,255,0.02)';
  bgCtx.fillRect(0, 0, bgW, bgH);
  bgCtx.restore();

  requestAnimationFrame(animateBg);
}
animateBg();

// ══════════════════════════════════════════════
// ARTE DE EMOCIONES (canvas cards)
// ══════════════════════════════════════════════
const emotionArts = {
  alegria: { bg: '#0a0805', colors: ['#f5c842','#f5a623','#fff5a0','#ff9f1c'], type: 'burst' },
  ansiedad: { bg: '#0d0a14', colors: ['#9b4dca','#6a1fa0','#ff00ff','#3a1a5a'], type: 'spiral' },
  nostalgia: { bg: '#080d14', colors: ['#4a90d9','#2c5f8a','#a8d4f5','#1a3a5c'], type: 'waves' },
  ira: { bg: '#140808', colors: ['#e63030','#8b1a1a','#ff6060','#400000'], type: 'shatter' },
  calma: { bg: '#080e0e', colors: ['#2dcca7','#1a8a70','#a0f0e0','#0a4a40'], type: 'flow' }
};

function drawEmotionArt(canvasId, emotion) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 200; canvas.height = 270;
  const { bg, colors, type } = emotionArts[emotion];
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 200, 270);
  if (type === 'burst') drawBurst(ctx, colors);
  else if (type === 'spiral') drawSpiral(ctx, colors);
  else if (type === 'waves') drawWaves(ctx, colors);
  else if (type === 'shatter') drawShatter(ctx, colors);
  else if (type === 'flow') drawFlow(ctx, colors);
}

function drawBurst(ctx, c) {
  const cx=100,cy=135;
  for (let i=0;i<80;i++) {
    const a=Math.random()*Math.PI*2, r=Math.random()*120, len=Math.random()*60+10;
    ctx.save(); ctx.globalAlpha=Math.random()*0.7+0.2;
    ctx.strokeStyle=c[Math.floor(Math.random()*c.length)];
    ctx.lineWidth=Math.random()*3+0.5;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r);
    ctx.lineTo(cx+Math.cos(a)*(r+len), cy+Math.sin(a)*(r+len));
    ctx.stroke(); ctx.restore();
  }
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,80);
  g.addColorStop(0,'rgba(255,220,50,0.3)'); g.addColorStop(1,'transparent');
  ctx.fillStyle=g; ctx.fillRect(0,0,200,270);
}

function drawSpiral(ctx, c) {
  let a=0, r=2;
  ctx.save(); ctx.translate(100,135);
  for (let i=0;i<600;i++) {
    a+=0.1; r+=0.15;
    const x=Math.cos(a)*r, y=Math.sin(a)*r;
    ctx.globalAlpha=0.6;
    ctx.fillStyle=c[i%c.length];
    ctx.beginPath(); ctx.arc(x,y,1.5,0,Math.PI*2); ctx.fill();
  }
  for (let i=0;i<20;i++) {
    const x=(Math.random()-0.5)*200, y=(Math.random()-0.5)*270;
    ctx.globalAlpha=0.3; ctx.strokeStyle=c[i%c.length]; ctx.lineWidth=0.5;
    ctx.strokeRect(x,y,Math.random()*30,Math.random()*30);
  }
  ctx.restore();
}

function drawWaves(ctx, c) {
  for (let j=0;j<6;j++) {
    ctx.beginPath(); ctx.globalAlpha=0.5;
    ctx.strokeStyle=c[j%c.length]; ctx.lineWidth=2;
    for (let x=0;x<=200;x+=2) {
      const y=135+Math.sin((x+j*30)*0.04)*60*Math.sin(j*0.8) + j*15;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha=0.15; ctx.fillStyle=c[0];
  ctx.fillRect(0,0,200,270);
}

function drawShatter(ctx, c) {
  for (let i=0;i<40;i++) {
    const x=Math.random()*200, y=Math.random()*270;
    const w=Math.random()*60+10, h=Math.random()*8+2;
    const angle=(Math.random()-0.5)*0.5;
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
    ctx.globalAlpha=Math.random()*0.7+0.2;
    ctx.fillStyle=c[Math.floor(Math.random()*c.length)];
    ctx.fillRect(-w/2,-h/2,w,h); ctx.restore();
  }
  const g=ctx.createRadialGradient(100,135,10,100,135,130);
  g.addColorStop(0,'rgba(230,48,48,0.1)'); g.addColorStop(1,'transparent');
  ctx.fillStyle=g; ctx.fillRect(0,0,200,270);
}

function drawFlow(ctx, c) {
  for (let i=0;i<50;i++) {
    const x=Math.random()*200, y=Math.random()*270;
    const r=Math.random()*40+5;
    const g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0, c[i%c.length]+'66');
    g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(0,0,200,270);
  }
  for (let j=0;j<3;j++) {
    ctx.beginPath(); ctx.globalAlpha=0.4;
    ctx.strokeStyle=c[j]; ctx.lineWidth=1;
    for (let x=0;x<=200;x+=3) {
      const y=135+Math.sin(x*0.03+j*2)*50;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
}

Object.keys(emotionArts).forEach(e => drawEmotionArt('art-'+e, e));

// ══════════════════════════════════════════════
// DATOS EMOCIONES
// ══════════════════════════════════════════════
const emotionData = {
  alegria: {
    titulo: 'ALEGRÍA',
    bg: 'linear-gradient(135deg, #1a1000 0%, #2a1a00 50%, #0a0805 100%)',
    glow: '#f5c842',
    obras: [
      { titulo:'La Danza', artista:'Henri Matisse', psico:'La alegría activa el sistema de recompensa dopaminérgico, generando comportamientos expansivos y movimientos amplios.', color:'#f5c842' },
      { titulo:'Domingo en el Parque', artista:'Georges Seurat', psico:'Los estados de alegría amplían el campo visual y perceptivo, aumentando la sensación de espacio y luminosidad.', color:'#f5a623' },
      { titulo:'El Grito Inverso', artista:'Obra Generada', psico:'La emoción positiva reduce la actividad de la amígdala, creando una percepción más suave y colorida del entorno.', color:'#fff5a0' }
    ],
    psico: 'La alegría es una emoción básica mediada por la liberación de dopamina, serotonina y endorfinas. Desde la perspectiva de Barbara Fredrickson, amplía el repertorio de pensamiento y acción (teoría "broaden-and-build"). Las personas en estados de alegría tienen mayor pensamiento divergente, mayor conectividad neuronal y una percepción más amplia del espacio visual. En el arte, se manifiesta como colores cálidos, formas expansivas y composiciones que irradian desde el centro.'
  },
  ansiedad: {
    titulo: 'ANSIEDAD',
    bg: 'linear-gradient(135deg, #0a0014 0%, #1a0030 50%, #050008 100%)',
    glow: '#9b4dca',
    obras: [
      { titulo:'El Grito', artista:'Edvard Munch', psico:'La ansiedad hipersensibiliza el sistema nervioso. Líneas ondulantes en el arte reflejan la inestabilidad percibida del entorno.', color:'#9b4dca' },
      { titulo:'Repetición Nocturna', artista:'Louise Bourgeois', psico:'Los pensamientos rumiantes de la ansiedad se manifiestan visualmente como patrones que se repiten en espiral, sin punto de salida.', color:'#6a1fa0' },
      { titulo:'Fragmento Atrapado', artista:'Francis Bacon', psico:'La amígdala en modo de alarma filtra toda percepción. Las formas distorsionadas representan la realidad vista a través del miedo.', color:'#ff00ff' }
    ],
    psico: 'La ansiedad activa el eje hipotálamo-hipófisis-suprarrenal, inundando el sistema con cortisol. El cerebro en estado ansioso percibe amenazas donde no las hay (hipervigilancia). Visualmente, se traduce en espirales que no tienen fin, fragmentación de formas y ausencia de horizonte estable. Carl Jung describía la ansiedad como el encuentro con la Sombra: aquello que no queremos ver de nosotros mismos.'
  },
  nostalgia: {
    titulo: 'NOSTALGIA',
    bg: 'linear-gradient(135deg, #000814 0%, #001a2e 50%, #000508 100%)',
    glow: '#4a90d9',
    obras: [
      { titulo:'Persistencia de la Memoria', artista:'Salvador Dalí', psico:'El tiempo subjetivo de la memoria nunca coincide con el tiempo real. Los relojes blandos son la metáfora perfecta de este fenómeno.', color:'#4a90d9' },
      { titulo:'Regreso', artista:'Giorgio de Chirico', psico:'Las sombras largas de la nostalgia representan cómo el pasado proyecta su forma sobre el presente.', color:'#2c5f8a' },
      { titulo:'Umbral Azul', artista:'Yves Klein', psico:'El azul activa zonas del cerebro asociadas a la introspección y la distancia emocional, propiciando el estado nostálgico.', color:'#a8d4f5' }
    ],
    psico: 'La nostalgia es paradójica: es una emoción agridulce donde el dolor del pasado se convierte en placer. Estudios de Constantine Sedikides demuestran que nos reconforta al reforzar la continuidad del yo. Involucra la misma red neuronal que la empatía y la proyección hacia el futuro. El hipocampo reconstruct el pasado siempre imperfectamente, por eso la nostalgia es, de algún modo, una ficción que preferimos a la realidad.'
  },
  ira: {
    titulo: 'IRA',
    bg: 'linear-gradient(135deg, #140000 0%, #2a0000 50%, #080000 100%)',
    glow: '#e63030',
    obras: [
      { titulo:'Guernica', artista:'Pablo Picasso', psico:'La fragmentación de las formas en la ira refleja el colapso del pensamiento racional: la amígdala secuestra el córtex prefrontal.', color:'#e63030' },
      { titulo:'Marea de Sangre', artista:'Mark Rothko', psico:'Los campos de color puro de Rothko activan respuestas viscerales. El rojo intenso eleva presión arterial y frecuencia cardíaca.', color:'#8b1a1a' },
      { titulo:'Explosión Negra', artista:'Franz Kline', psico:'Los gestos amplios y violentos del Action Painting canalizan la energía kinestésica de la ira hacia un acto creativo catártico.', color:'#ff6060' }
    ],
    psico: 'La ira es una respuesta adaptativa ante la percepción de injusticia o amenaza. Activa el sistema nervioso simpático: adrenalina, cortisol, aumento de fuerza física. La amígdala lateral genera la reacción antes de que el pensamiento consciente intervenga (teoría del "secuestro emocional" de Goleman). Sin embargo, la ira canalizada creativamente —como en el Arte como catarsis de Aristóteles— puede ser una fuerza transformadora poderosa.'
  },
  calma: {
    titulo: 'CALMA',
    bg: 'linear-gradient(135deg, #000e0e 0%, #001a18 50%, #000505 100%)',
    glow: '#2dcca7',
    obras: [
      { titulo:'El Gran Estanque', artista:'Claude Monet', psico:'La contemplación de formas orgánicas y horizontes abiertos activa el sistema nervioso parasimpático, induciendo estados de reposo.', color:'#2dcca7' },
      { titulo:'Blanco sobre Blanco', artista:'Kasimir Malevich', psico:'La reducción visual máxima libera los recursos cognitivos, creando espacio mental para la presencia plena.', color:'#1a8a70' },
      { titulo:'Jardín Zen', artista:'Tradición Japonesa', psico:'Los patrones repetitivos en el arte zen inducen un estado de flujo cognitivo que reduce la actividad de la red neuronal por defecto.', color:'#a0f0e0' }
    ],
    psico: 'La calma no es ausencia de emoción sino un estado activo de regulación. Activa el nervio vago y el sistema parasimpático. Las frecuencias de ondas cerebrales cambian de beta (alertas) a alfa (relajadas). La teoría de la Atención Restaurativa de Kaplan señala que ciertos entornos visuales —especialmente naturales— restauran la capacidad cognitiva. La calma genuina se asocia con alta interoceptividad: la capacidad de escuchar el propio cuerpo.'
  }
};

// ══════════════════════════════════════════════
// SALA VIRTUAL
// ══════════════════════════════════════════════
function abrirSala(emotion) {
  const data = emotionData[emotion];
  const sala = document.getElementById('sala-virtual');
  document.getElementById('sala-titulo').textContent = data.titulo;
  sala.style.background = data.bg;
  sala.style.setProperty('--glow', data.glow);

  const obrasEl = document.getElementById('sala-obras');
  obrasEl.innerHTML = data.obras.map(o => `
    <div class="obra-card">
      <canvas class="obra-img" width="400" height="300" id="obra-${Math.random().toString(36).substr(2,5)}"></canvas>
      <div class="obra-info">
        <div class="obra-titulo">${o.titulo}</div>
        <div class="obra-artista">${o.artista}</div>
        <div class="psico-badge" style="color:${o.color};">Análisis</div>
        <div class="obra-psico">${o.psico}</div>
      </div>
    </div>
  `).join('');

  obrasEl.querySelectorAll('canvas').forEach((c, i) => {
    const ctx = c.getContext('2d');
    generateAbstractArt(ctx, 400, 300, data.obras[i].color, emotion);
  });

  document.getElementById('psico-texto').textContent = data.psico;
  sala.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarSala() {
  document.getElementById('sala-virtual').classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.emotion-card').forEach(card => {
  card.addEventListener('click', () => abrirSala(card.dataset.emotion));
});

// ══════════════════════════════════════════════
// GENERADOR DE ARTE
// ══════════════════════════════════════════════
const respuestas = { estado: null, energia: null, color: null };
const colorMap = {
  rojo: '#e63030', naranja: '#f5a623', amarillo: '#f5c842',
  verde: '#2ecc71', azul: '#4a90d9', violeta: '#9b4dca',
  blanco: '#f0e8d0', negro: '#2a2018'
};

function seleccionarOpcion(btn, tipo, valor) {
  btn.closest('.opciones-grid').querySelectorAll('.opcion-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  respuestas[tipo] = valor;
  const pNum = tipo === 'estado' ? 2 : tipo === 'energia' ? 3 : null;
  if (pNum) {
    document.querySelector(`#p${pNum}`).classList.add('active');
  }
  previsualizarArte();
}

function seleccionarColor(sw, color) {
  sw.closest('.color-picker-row').querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  sw.classList.add('selected');
  respuestas.color = color;
  document.querySelector('#p3').classList.add('active');
  previsualizarArte();
}

function previsualizarArte() {
  if (!respuestas.color) return;
  const canvas = document.getElementById('arte-canvas');
  const ctx = canvas.getContext('2d');
  const col = colorMap[respuestas.color] || '#c04a1a';
  generateAbstractArt(ctx, 500, 500, col, respuestas.estado || 'calma', true);
}

function generarArte() {
  if (!respuestas.estado || !respuestas.energia || !respuestas.color) {
    document.getElementById('arte-descripcion').innerHTML = '<span style="color:var(--rust);">// Responde todas las preguntas primero.</span>';
    return;
  }
  previsualizarArte();

  const descripciones = {
    eufórico: 'patrones explosivos y centrífugos', tranquilo: 'ondas suaves y horizontes abiertos',
    melancólico: 'capas semitransparentes superpuestas', ansioso: 'espirales sin punto de fuga',
    enojado: 'fragmentos angulares en tensión', confuso: 'vectores que no convergen'
  };
  const energias = { explosiva: 'formas de alta frecuencia', alta: 'dinamismo compositivo', media: 'equilibrio tenso', baja: 'disolución gradual', nula: 'vacío estructurado' };

  document.getElementById('arte-descripcion').innerHTML = `
    <strong style="color:var(--acid);letter-spacing:2px;">// ANÁLISIS GENERATIVO</strong><br><br>
    Tu obra refleja <em>${descripciones[respuestas.estado] || 'composición única'}</em> con <em>${energias[respuestas.energia] || 'energía variable'}</em>.
    El predominio del ${respuestas.color} indica un estado de ${
      ['rojo','naranja'].includes(respuestas.color) ? 'alta activación y necesidad de acción' :
      ['amarillo'].includes(respuestas.color) ? 'búsqueda de claridad y optimismo' :
      ['azul','violeta'].includes(respuestas.color) ? 'introspección y procesamiento profundo' :
      ['verde'].includes(respuestas.color) ? 'equilibrio y regeneración' : ['blanco'].includes(respuestas.color) ? 'necesidad de espacio y simplificación' : 'integración de sombra y luz'
    }. <br><br>
    <em style="opacity:0.6;">Esta obra ha sido añadida a la galería colectiva.</em>
  `;
  addToGallery();
}

// ══════════════════════════════════════════════
// GENERADOR DE ARTE ABSTRACTO
// ══════════════════════════════════════════════
function generateAbstractArt(ctx, w, h, mainColor, style, animated) {
  ctx.fillStyle = '#080806';
  ctx.fillRect(0, 0, w, h);

  const hsl = hexToHSL(mainColor);
  const palette = [
    mainColor,
    HSLToHex(hsl.h + 30, hsl.s, hsl.l),
    HSLToHex(hsl.h - 30, hsl.s * 0.7, hsl.l * 1.3),
    HSLToHex(hsl.h + 180, hsl.s * 0.5, hsl.l * 0.6),
    '#f0e8d0'
  ];

  const styles = { eufórico: 'burst', tranquilo: 'flow', melancólico: 'waves',
    ansioso: 'spiral', enojado: 'shatter', confuso: 'scatter',
    alegria: 'burst', calma: 'flow', nostalgia: 'waves', ansiedad: 'spiral', ira: 'shatter' };
  const s = styles[style] || 'scatter';

  if (s === 'burst') {
    for (let i=0;i<120;i++) {
      const a=Math.random()*Math.PI*2, r=Math.random()*w*0.45, len=Math.random()*w*0.12+5;
      ctx.save(); ctx.globalAlpha=Math.random()*0.8+0.1;
      ctx.strokeStyle=palette[Math.floor(Math.random()*palette.length)];
      ctx.lineWidth=Math.random()*4+0.5;
      ctx.beginPath(); ctx.moveTo(w/2+Math.cos(a)*r, h/2+Math.sin(a)*r);
      ctx.lineTo(w/2+Math.cos(a)*(r+len), h/2+Math.sin(a)*(r+len));
      ctx.stroke(); ctx.restore();
    }
    const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*0.4);
    g.addColorStop(0,mainColor+'40'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  } else if (s === 'spiral') {
    let a=0, r=3;
    ctx.save(); ctx.translate(w/2, h/2);
    ctx.beginPath();
    for (let i=0;i<800;i++) {
      a+=0.08; r+=0.2;
      const x=Math.cos(a)*r, y=Math.sin(a)*r;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=palette[0]; ctx.lineWidth=1.5; ctx.globalAlpha=0.7; ctx.stroke();
    for (let i=0;i<30;i++) {
      const x=(Math.random()-0.5)*w, y=(Math.random()-0.5)*h;
      ctx.globalAlpha=0.2; ctx.strokeStyle=palette[i%palette.length]; ctx.lineWidth=0.5;
      ctx.strokeRect(x,y,Math.random()*50,Math.random()*50);
    }
    ctx.restore();
  } else if (s === 'waves') {
    for (let j=0;j<8;j++) {
      ctx.beginPath(); ctx.globalAlpha=0.5;
      ctx.strokeStyle=palette[j%palette.length]; ctx.lineWidth=2;
      for (let x=0;x<=w;x+=3) {
        const y=h/2+Math.sin((x/w*Math.PI*4)+j*0.6)*(h*0.25)*Math.sin(j*0.5) + j*h*0.04;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
  } else if (s === 'shatter') {
    for (let i=0;i<60;i++) {
      const x=Math.random()*w, y=Math.random()*h;
      const bw=Math.random()*w*0.25+5, bh=Math.random()*12+2;
      const angle=(Math.random()-0.5)*0.8;
      ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
      ctx.globalAlpha=Math.random()*0.8+0.1;
      ctx.fillStyle=palette[Math.floor(Math.random()*palette.length)];
      ctx.fillRect(-bw/2,-bh/2,bw,bh); ctx.restore();
    }
  } else {
    for (let i=0;i<80;i++) {
      const x=Math.random()*w, y=Math.random()*h;
      const r=Math.random()*w*0.1+2;
      const g=ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0, palette[i%palette.length]+'88');
      g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.globalAlpha=1;
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
  }

  ctx.globalAlpha=0.05;
  for (let i=0;i<200;i++) {
    ctx.fillStyle=Math.random()>0.5?'#fff':'#000';
    ctx.fillRect(Math.random()*w, Math.random()*h, Math.random()*3+1, Math.random()*2+1);
  }
  ctx.globalAlpha=1;
}

function hexToHSL(hex) {
  let r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h, s, l=(max+min)/2;
  if (max===min) { h=s=0; } else {
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max) {
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      case b: h=(r-g)/d+4; break;
    }
    h/=6;
  }
  return { h: h*360, s: s*100, l: l*100 };
}

function HSLToHex(h,s,l) {
  h=((h%360)+360)%360; s=Math.min(100,Math.max(0,s)); l=Math.min(100,Math.max(0,l));
  s/=100; l/=100;
  const a=s*Math.min(l,1-l);
  const f=n=>{ const k=(n+h/30)%12; const c=l-a*Math.max(Math.min(k-3,9-k,1),-1); return Math.round(255*c).toString(16).padStart(2,'0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// ══════════════════════════════════════════════
// ZONAS MENTALES
// ══════════════════════════════════════════════
const zonaData = {
  memoria: { titulo:'MEMORIA', sub:'Zona 01 — Mnemonics', color:'#f5c842',
    experimentos: [
      { n:'EXP.01', t:'El Efecto Von Restorff', d:'¿Por qué recordamos lo que destaca? Interactúa con una secuencia de estímulos visuales y descubre tu patrón de memoria selectiva.' },
      { n:'EXP.02', t:'Reconstrucción Falsa', d:'La memoria no es un archivo: es una reconstrucción activa. Observa una escena, luego comprueba cuántos detalles "recuerdas" que nunca existieron.' },
      { n:'EXP.03', t:'Palacio de la Memoria', d:'La técnica de loci de los griegos. Asocia información con espacios mentales y prueba si tu capacidad de retención mejora drásticamente.' }
    ]},
  suenos: { titulo:'SUEÑOS', sub:'Zona 02 — Oneironautics', color:'#9b4dca',
    experimentos: [
      { n:'EXP.01', t:'Lucidez Inducida', d:'¿Puedes entrenar tu mente para despertar dentro de un sueño? Aprende las técnicas MILD y WILD y registra tus intentos en el diario de sueños.' },
      { n:'EXP.02', t:'Símbolos Arquetípicos', d:'Desde Jung: ciertos símbolos aparecen en sueños de culturas sin contacto entre sí. Identifica los arquetipos en tus propias experiencias oníricas.' },
      { n:'EXP.03', t:'El Teatro Nocturno', d:'Durante el sueño REM, el córtex narrativo construye historias a partir de activaciones aleatorias del tronco cerebral. Explora esta narrativa sin autor.' }
    ]},
  creatividad: { titulo:'CREATIVIDAD', sub:'Zona 03 — Generativity', color:'#2ecc71',
    experimentos: [
      { n:'EXP.01', t:'Test de Usos Alternativos', d:'Se te muestra un objeto cotidiano. Tienes 2 minutos para listar todos los usos posibles. Mide tu pensamiento divergente según el modelo Guilford.' },
      { n:'EXP.02', t:'Incubación y Eureka', d:'El cerebro resuelve problemas mientras "no piensa" en ellos. Experimenta el proceso de incubación con acertijos que requieren insight súbito.' },
      { n:'EXP.03', t:'Flujo Creativo', d:'Mihaly Csikszentmihalyi describió el flujo como óptimo rendimiento creativo. Configura las condiciones y mide cuánto tiempo tardas en alcanzarlo.' }
    ]},
  inconsciente: { titulo:'INCONSCIENTE', sub:'Zona 04 — The Shadow', color:'#e63030',
    experimentos: [
      { n:'EXP.01', t:'Proyección de Rorschach', d:'Las manchas de tinta no tienen significado objetivo. Lo que "ves" revela tus estructuras mentales proyectadas. Interpreta 10 láminas y analiza los patrones.' },
      { n:'EXP.02', t:'Asociación Libre', d:'La técnica freudiana por excelencia. Una palabra dispara la siguiente sin censura. En 3 minutos de escritura automática, ¿qué emerge de las capas profundas?' },
      { n:'EXP.03', t:'Sombra Junguiana', d:'Todo lo que rechazamos de nosotros mismos vive en nuestra Sombra. Identifica tus "defectos" en otros y descubre lo que en realidad te pertenece.' }
    ]},
  percepcion: { titulo:'PERCEPCIÓN', sub:'Zona 05 — Phenomenology', color:'#4a90d9',
    experimentos: [
      { n:'EXP.01', t:'Ilusiones Ópticas Clásicas', d:'Müller-Lyer, Ponzo, Ebbinghaus. Estas ilusiones no son "errores": revelan los algoritmos de construcción de realidad que usa tu cerebro.' },
      { n:'EXP.02', t:'Ceguera por Inatención', d:'¿Cuánto de lo que "ves" en realidad no percibes? El famoso experimento del gorila invisible: puedes estar mirando sin ver.' },
      { n:'EXP.03', t:'Efecto McGurk', d:'Cuando lo que oyes y ves se contradicen, ¿cuál gana? El cerebro integra sentidos activamente, y a veces, literalmente te hace oír lo que ve.' }
    ]},
  empatia: { titulo:'EMPATÍA', sub:'Zona 06 — Mirror Neurons', color:'#2dcca7',
    experimentos: [
      { n:'EXP.01', t:'Lectura de Ojos', d:'El "Test de la Mente en los Ojos" de Simon Baron-Cohen: solo mirando ojos, adivina la emoción. Calibra tu empatía cognitiva con 36 pares de ojos.' },
      { n:'EXP.02', t:'Resonancia Emocional', d:'Observa rostros con distintas emociones. Tus neuronas espejo imitarán micro-expresiones. Mide la actividad muscular de tu propio rostro mientras miras.' },
      { n:'EXP.03', t:'Perspectiva Radical', d:'Sumérgete en la historia de una persona radicalmente diferente a ti. Mide antes y después cómo cambia tu juicio sobre comportamientos que antes parecían incomprensibles.' }
    ]}
};

function abrirZona(zona) {
  const data = zonaData[zona];
  document.getElementById('modal-title').textContent = data.titulo;
  document.getElementById('modal-sub').textContent = data.sub;
  document.getElementById('modal-zona').style.setProperty('--zona-color', data.color);
  document.getElementById('modal-experimentos').innerHTML = data.experimentos.map(e => `
    <div class="experimento">
      <div class="exp-num" style="color:${data.color};">${e.n}</div>
      <div class="exp-titulo">${e.t}</div>
      <div class="exp-desc">${e.d}</div>
    </div>
  `).join('');
  document.getElementById('modal-zona').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarZona() {
  document.getElementById('modal-zona').classList.remove('active');
  document.body.style.overflow = '';
}

// ══════════════════════════════════════════════
// TEST PSICOLÓGICO
// ══════════════════════════════════════════════
const testSelecciones = {};
const testPalettes = [
  ['#e63030','#8b1a1a','#ff9f1c'],
  ['#4a90d9','#2c5f8a','#a8d4f5'],
  ['#9b4dca','#6a1fa0','#2a2018'],
  ['#2dcca7','#f5c842','#f0e8d0']
];

function generarImagenesTest() {
  [1,2,3,4].forEach(step => {
    const cont = document.getElementById(`imagenes-${step}`);
    if (!cont) return;
    cont.innerHTML = '';
    for (let i=0;i<4;i++) {
      const div = document.createElement('div');
      div.className = 'img-test';
      div.dataset.val = i;
      const canvas = document.createElement('canvas');
      canvas.width = 150; canvas.height = 150;
      const ctx = canvas.getContext('2d');
      const palette = testPalettes[(step+i)%testPalettes.length];
      const styles = ['burst','spiral','waves','shatter','flow','scatter'];
      generateAbstractArt(ctx, 150, 150, palette[0], styles[(step*i)%styles.length]);
      div.appendChild(canvas);
      div.addEventListener('click', () => {
        cont.querySelectorAll('.img-test').forEach(el => el.classList.remove('selected'));
        div.classList.add('selected');
        testSelecciones[step] = i;
      });
      cont.appendChild(div);
    }
  });
}

function siguientePaso(current) {
  document.getElementById(`step-${current}`).classList.remove('active');
  document.getElementById(`step-${current+1}`).classList.add('active');
  const dots = document.querySelectorAll('.progress-dot');
  dots[current-1].classList.remove('active'); dots[current-1].classList.add('done');
  if (dots[current]) dots[current].classList.add('active');
}

const perfiles = [
  { titulo:'EXPLORADOR CAÓTICO', creativo:'EXPRESIONISTA', emocional:'INTENSA', arquetipo:'EL TRICKSTER',
    desc:'Tu psique opera en el límite del caos creativo. Procesas el mundo a través de emociones viscerales antes que racionales. Tu mente busca continuamente ruptura de patrones. Psicológicamente, esto indica alta sensibilidad a la novedad y probable dominancia del pensamiento divergente.' },
  { titulo:'ARQUITECTO DEL SILENCIO', creativo:'MINIMALISTA', emocional:'CONTENIDA', arquetipo:'EL SABIO',
    desc:'Buscas estructura y significado en la reducción. Tu mente tiende a filtrar lo superficial en busca de esencias. Alta introspección y capacidad de contemplación sostenida. Tu tipo creativo se acerca al pensamiento convergente con destellos de insight profundo.' },
  { titulo:'TEJEDOR DE MUNDOS', creativo:'SURREALISTA', emocional:'ONÍRICA', arquetipo:'EL MAGO',
    desc:'La frontera entre lo real y lo imaginado es permeable en tu mente. Combinas lógica e intuición de maneras que otros no comprenden. Alta capacidad asociativa y tendencia a la síntesis improbable. Jung llamaría a esto "función transcendente".' },
  { titulo:'GUARDIÁN DEL UMBRAL', creativo:'FIGURATIVO', emocional:'PROFUNDA', arquetipo:'EL HÉROE',
    desc:'Eres un puente entre mundos: lo conocido y lo desconocido. Tu proceso creativo necesita narrativa y transformación. Alta empatía y orientación hacia el significado. Procesas las emociones a través de historias y arquetipos universales.' }
];

function mostrarResultado() {
  document.getElementById('step-4').classList.remove('active');
  const result = document.getElementById('resultado-test');
  result.classList.add('active');
  const totalSel = Object.values(testSelecciones).reduce((a,b)=>a+b,0);
  const perfil = perfiles[totalSel % perfiles.length];
  document.getElementById('resultado-titulo').textContent = 'PERFIL: ' + perfil.titulo;
  document.getElementById('resultado-desc').textContent = perfil.desc;
  document.getElementById('perfil-creativo').textContent = perfil.creativo;
  document.getElementById('perfil-emocional').textContent = perfil.emocional;
  document.getElementById('perfil-arquetipo').textContent = perfil.arquetipo;
  const dots = document.querySelectorAll('.progress-dot');
  dots.forEach(d => { d.classList.remove('active'); d.classList.add('done'); });
}

function reiniciarTest() {
  document.getElementById('resultado-test').classList.remove('active');
  document.getElementById('step-1').classList.add('active');
  const dots = document.querySelectorAll('.progress-dot');
  dots.forEach((d,i) => { d.classList.remove('done','active'); if (i===0) d.classList.add('active'); });
  for (let k in testSelecciones) delete testSelecciones[k];
  generarImagenesTest();
}

// ══════════════════════════════════════════════
// GALERÍA COLECTIVA
// ══════════════════════════════════════════════
const galleryData = [
  { name:'Usuario_8821', color:'#e63030', style:'shatter' },
  { name:'Anonymous', color:'#9b4dca', style:'spiral' },
  { name:'Maria_K', color:'#4a90d9', style:'waves' },
  { name:'The_Watcher', color:'#2dcca7', style:'flow' },
  { name:'X.0019', color:'#f5c842', style:'burst' },
  { name:'Anon_77', color:'#f5a623', style:'scatter' },
  { name:'Luna_D', color:'#2ecc71', style:'flow' },
  { name:'Usuario_3301', color:'#c04a1a', style:'shatter' }
];

function buildGallery() {
  const grid = document.getElementById('galeria-grid');
  galleryData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'galeria-item';
    const canvas = document.createElement('canvas');
    canvas.width = 200; canvas.height = 200;
    const ctx = canvas.getContext('2d');
    generateAbstractArt(ctx, 200, 200, item.color, item.style);
    const overlay = document.createElement('div');
    overlay.className = 'galeria-overlay';
    overlay.innerHTML = `<span class="galeria-nombre">${item.name}</span>`;
    div.appendChild(canvas); div.appendChild(overlay);
    grid.appendChild(div);
  });
}

function addToGallery() {
  const grid = document.getElementById('galeria-grid');
  const div = document.createElement('div');
  div.className = 'galeria-item';
  const canvas = document.createElement('canvas');
  canvas.width = 200; canvas.height = 200;
  const ctx = canvas.getContext('2d');
  const col = colorMap[respuestas.color] || '#c04a1a';
  generateAbstractArt(ctx, 200, 200, col, respuestas.estado || 'calma');
  const overlay = document.createElement('div');
  overlay.className = 'galeria-overlay';
  overlay.innerHTML = '<span class="galeria-nombre" style="color:var(--acid);">TÚ — Ahora mismo</span>';
  div.appendChild(canvas); div.appendChild(overlay);
  grid.insertBefore(div, grid.firstChild);
}

// ══════════════════════════════════════════════
// TALLER DE DIBUJO
// ══════════════════════════════════════════════
const drawCanvas = document.getElementById('draw-canvas');
const drawCtx = drawCanvas ? drawCanvas.getContext('2d') : null;
let isDrawing = false;
let drawColor = '#f5c842';
let drawSize = 4;
let drawMode = 'line';
let drawOpacity = 0.9;
let currentBg = 'noche';
let lastPointer = { x: 0, y: 0 };

const canvasBackgrounds = {
  noche: { gradient: ['#0a0f16', '#101c2a'], speck: '#ffffff11' },
  amanecer: { gradient: ['#2b1b30', '#ff8e72'], speck: '#ffe1bd11' },
  luna: { gradient: ['#101a29', '#5f718f'], speck: '#d6e4ff14' },
  tierra: { gradient: ['#1c2b1f', '#2f5f4b'], speck: '#bdd6c711' }
};

function initializeDrawCanvas() {
  if (!drawCanvas || !drawCtx) return;
  drawCanvas.style.touchAction = 'none';
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  applyCanvasBackground(currentBg);

  const colorButtons = document.querySelectorAll('.color-btn');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawColor = btn.dataset.color;
    });
  });

  const toolButtons = document.querySelectorAll('.tool-btn');
  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toolButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawSize = Number(btn.dataset.size);
    });
  });

  const textureButtons = document.querySelectorAll('.texture-btn');
  textureButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      textureButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      drawMode = btn.dataset.mode;
    });
  });

  const bgButtons = document.querySelectorAll('.bg-btn');
  bgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      bgButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setCanvasBackground(btn.dataset.bg);
    });
  });

  const opacityRange = document.getElementById('opacity-range');
  const opacityValue = document.getElementById('opacity-value');
  if (opacityRange && opacityValue) {
    opacityRange.addEventListener('input', () => {
      drawOpacity = Number(opacityRange.value);
      opacityValue.textContent = Math.round(drawOpacity * 100) + '%';
    });
  }

  const clearButton = document.getElementById('clear-draw');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      applyCanvasBackground(currentBg);
    });
  }

  const saveButton = document.getElementById('save-draw');
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = drawCanvas.toDataURL('image/png');
      link.download = 'obra-digital.png';
      link.click();
    });
  }

  drawCanvas.addEventListener('pointerdown', e => {
    isDrawing = true;
    const rect = drawCanvas.getBoundingClientRect();
    lastPointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    drawCtx.strokeStyle = drawColor;
    drawCtx.lineWidth = drawSize;
    drawCtx.globalAlpha = drawOpacity;
    drawCtx.beginPath();
    drawCtx.moveTo(lastPointer.x, lastPointer.y);
  });

  drawCanvas.addEventListener('pointermove', e => {
    if (!isDrawing) return;
    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawCtx.strokeStyle = drawColor;
    drawCtx.lineWidth = drawSize;
    drawCtx.globalAlpha = drawOpacity;

    if (drawMode === 'spray') {
      drawSpray(x, y);
    } else if (drawMode === 'pastel') {
      drawPastel(x, y);
    } else if (drawMode === 'grain') {
      drawGrain(x, y);
    } else {
      drawCtx.lineTo(x, y);
      drawCtx.stroke();
    }

    lastPointer = { x, y };
  });

  ['pointerup', 'pointerleave', 'pointercancel'].forEach(event => {
    drawCanvas.addEventListener(event, () => {
      if (!isDrawing) return;
      isDrawing = false;
      drawCtx.closePath();
    });
  });
}

function setCanvasBackground(bgKey) {
  currentBg = bgKey;
  applyCanvasBackground(bgKey);
}

function applyCanvasBackground(bgKey) {
  if (!drawCanvas || !drawCtx) return;
  const preset = canvasBackgrounds[bgKey] || canvasBackgrounds.noche;
  const gradient = drawCtx.createLinearGradient(0, 0, 0, drawCanvas.height);
  gradient.addColorStop(0, preset.gradient[0]);
  gradient.addColorStop(1, preset.gradient[1]);
  drawCtx.globalCompositeOperation = 'source-over';
  drawCtx.globalAlpha = 1;
  drawCtx.fillStyle = gradient;
  drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
  drawCtx.fillStyle = preset.speck;
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * drawCanvas.width;
    const y = Math.random() * drawCanvas.height;
    const size = Math.random() * 2.4;
    drawCtx.beginPath();
    drawCtx.arc(x, y, size, 0, Math.PI * 2);
    drawCtx.fill();
  }
}

function drawSpray(x, y) {
  for (let i = 0; i < 18; i++) {
    const offsetX = (Math.random() - 0.5) * drawSize * 2.3;
    const offsetY = (Math.random() - 0.5) * drawSize * 2.3;
    drawCtx.beginPath();
    drawCtx.globalAlpha = drawOpacity * 0.14;
    drawCtx.fillStyle = drawColor;
    drawCtx.arc(x + offsetX, y + offsetY, Math.random() * (drawSize / 2) + 0.8, 0, Math.PI * 2);
    drawCtx.fill();
  }
}

function drawPastel(x, y) {
  drawCtx.save();
  drawCtx.globalAlpha = drawOpacity * 0.22;
  drawCtx.fillStyle = drawColor;
  drawCtx.beginPath();
  drawCtx.arc(x, y, drawSize * 1.8, 0, Math.PI * 2);
  drawCtx.fill();
  drawCtx.restore();
}

function drawGrain(x, y) {
  drawCtx.save();
  drawCtx.globalAlpha = drawOpacity * 0.35;
  for (let i = 0; i < 5; i++) {
    const offsetX = (Math.random() - 0.5) * drawSize * 1.6;
    const offsetY = (Math.random() - 0.5) * drawSize * 1.6;
    drawCtx.beginPath();
    drawCtx.arc(x + offsetX, y + offsetY, Math.random() * 1.8 + 0.5, 0, Math.PI * 2);
    drawCtx.fillStyle = drawColor;
    drawCtx.fill();
  }
  drawCtx.restore();
}

initializeDrawCanvas();

// ══════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
buildGallery();
generarImagenesTest();
