// app.js — lógica do quiz e recomendação (atualizado: modo sem preferência de marca e média de preço)
const findBtn = document.getElementById('findBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsList = document.getElementById('resultsList');
const resultsSection = document.getElementById('results');
// brand preference removed — consider all brands
const priceSummary = document.getElementById('priceSummary');

// Exemplo simples de base de dados de telefones (valores fictícios e exemplos)
const phones = [
  { id:1, name:'iPhone 14', brand:'Apple', os:'iphone', price:2200, year:2022, battery:3279, camera:92, perf:90, gaming:80, ram:6, storage:128, tags:['camera','value'], priceSources:[{site:'MercadoLivre',price:2100,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:2199,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:true, fastCharge:false, waterproof:true },
  { id:2, name:'iPhone 13', brand:'Apple', os:'iphone', price:1600, year:2021, battery:3240, camera:88, perf:85, gaming:75, ram:4, storage:128, tags:['camera','value'], priceSources:[{site:'MercadoLivre',price:1550,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:1599,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:true, fastCharge:false, waterproof:true },
  { id:3, name:'Galaxy S23', brand:'Samsung', os:'android', price:2500, year:2023, battery:3900, camera:94, perf:92, gaming:88, ram:8, storage:256, tags:['camera','performance'], priceSources:[{site:'MercadoLivre',price:2450,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:2499,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:true, fastCharge:true, waterproof:true },
  { id:4, name:'Google Pixel 7', brand:'Google', os:'android', price:1800, year:2022, battery:4350, camera:90, perf:86, gaming:78, ram:8, storage:128, tags:['camera','value'], priceSources:[{site:'MercadoLivre',price:1750,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:1799,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:true, fastCharge:true, waterproof:true },
  { id:5, name:'Xiaomi Poco F5', brand:'Xiaomi', os:'android', price:1200, year:2023, battery:5000, camera:80, perf:88, gaming:90, ram:8, storage:256, tags:['gaming','battery','value'], priceSources:[{site:'MercadoLivre',price:1150,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:1199,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:true, fastCharge:true, waterproof:false },
  { id:6, name:'OnePlus 11', brand:'OnePlus', os:'android', price:2300, year:2023, battery:5000, camera:86, perf:95, gaming:93, ram:12, storage:256, tags:['performance','gaming'], priceSources:[{site:'MercadoLivre',price:2250,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:2299,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:true, fastCharge:true, waterproof:true },
  { id:7, name:'Samsung A54', brand:'Samsung', os:'android', price:900, year:2023, battery:5000, camera:78, perf:70, gaming:60, ram:6, storage:128, tags:['battery','value'], priceSources:[{site:'MercadoLivre',price:849,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:899,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:true, fastCharge:true, waterproof:true },
  { id:8, name:'Motorola G Power', brand:'Motorola', os:'android', price:650, year:2022, battery:6000, camera:65, perf:60, gaming:50, ram:4, storage:64, tags:['battery','value'], priceSources:[{site:'MercadoLivre',price:620,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:649,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:false, fastCharge:false, waterproof:false },
  { id:9, name:'Asus ROG Phone 6', brand:'Asus', os:'android', price:3200, year:2022, battery:6000, camera:84, perf:98, gaming:99, ram:16, storage:512, tags:['gaming','performance'], priceSources:[{site:'MercadoLivre',price:3150,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:3199,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:true, fastCharge:true, waterproof:true },
  { id:10, name:'Xiaomi Redmi Note 12', brand:'Xiaomi', os:'android', price:700, year:2023, battery:5000, camera:70, perf:65, gaming:60, ram:6, storage:128, tags:['value','battery'], priceSources:[{site:'MercadoLivre',price:680,url:'https://lista.mercadolivre.com.br/',reliable:true},{site:'AmazonBR',price:699,url:'https://www.amazon.com.br/s?k=',reliable:true}] , has5g:true, fastCharge:false, waterproof:false }
];

// fallback search URL (used if no priceSources available)
phones.forEach(p => {
  p.url = 'https://www.google.com/search?q=' + encodeURIComponent(p.name + ' comprar preço');
});

function getBestPrice(phone) {
  if (!phone.priceSources || !phone.priceSources.length) return { price: phone.price, url: phone.url, site: 'N/A' };
  // build full URL for each source (product/search link)
  const sources = phone.priceSources.map(s => ({
    ...s,
    fullUrl: s.url + encodeURIComponent(phone.name + ' comprar preço')
  }));
  // prefer reliable sources when available
  const reliable = sources.filter(s => s.reliable);
  const pool = reliable.length ? reliable : sources;
  let best = pool[0];
  for (const s of pool) {
    if (s.price < best.price) best = s;
  }
  // prefer an explicit productUrl when available (direct product page)
  const finalUrl = best.productUrl || best.fullUrl || best.url;
  return { price: best.price, url: finalUrl, site: best.site };
}

function readSelection(name) {
  const el = document.querySelectorAll(`[name="${name}"]`);
  if (!el) return null;
  if (el[0].type === 'radio') {
    const selected = document.querySelector(`[name="${name}"]:checked`);
    return selected ? selected.value : null;
  }
  return null;
}

function readCheckboxes(name) {
  const nodes = document.querySelectorAll(`[name="${name}"]:checked`);
  return Array.from(nodes).map(n => n.value);
}

function parseBudget(b) {
  if (!b) return null;
  if (b === '0-500') return {min:0,max:500};
  if (b === '500-1000') return {min:500,max:1000};
  if (b === '1000-2000') return {min:1000,max:2000};
  return {min:2000,max:99999};
}

function scorePhone(phone, preferences) {
  let score = 0;
  // foco principal
  switch(preferences.focus) {
    case 'camera': score += phone.camera * 2; break;
    case 'performance': score += phone.perf * 2; break;
    case 'gaming': score += phone.gaming * 2; break;
    case 'battery': score += (phone.battery/1000) * 40; break; // scale
    case 'value': score += (1000 / phone.price) * 100; break;
  }

  // storage preference bonus
  const wantStorage = Number(preferences.storage || 0);
  // treat chosen storage as a minimum requirement
  if (wantStorage) {
    if (phone.storage < wantStorage) return -9999; // exclude phones with less storage than chosen
    else score += 15; // small bonus if meets or exceeds
  }

  // recency preference (phone.year expected)
  const year = Number(phone.year || 2022);
  if (preferences.recency === 'very') {
    // favor newer phones: stronger bonus per year after 2020
    score += Math.max(0, year - 2020) * 5;
  } else if (preferences.recency === 'less') {
    // mild preference for older phones
    score += Math.max(0, 2025 - year) * 1;
  }


  // OS filter
  if (preferences.os === 'android' && phone.os !== 'android') return -9999;
  if (preferences.os === 'iphone' && phone.os !== 'iphone') return -9999;

  // 5G requirement
  if (preferences.fiveg === 'yes' && !phone.has5g) return -9999;

  // waterproof requirement (soft)
  if (preferences.waterproof === 'yes') {
    if (phone.waterproof) score += 20; else score -= 10;
  }

  // fast charge preference
  if (preferences.fastcharge === 'yes') {
    if (phone.fastCharge) score += 18; else score -= 6;
  }

  // (tamanho de tela removido) — não aplicável

  // budget filter (soft)
  if (preferences.budget) {
    const b = preferences.budget;
    if (phone.price < b.min || phone.price > b.max) score -= 50;
  }

  // condition preference (novo/used) - dataset doesn't track usado, placeholder
  if (preferences.condition === 'used') {
    score += 2;
  }

  // small tie-breaker by perf
  score += phone.perf/5;

  return score;
}

function formatBRL(v) {
  try { return Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v); } catch(e) { return v; }
}

function showResults(preferences) {
  // compute scores (use best price for scoring and budget)
  const scored = phones.map(p => {
    const best = getBestPrice(p);
    return {...p, bestPrice: best.price, bestUrl: best.url, bestSite: best.site, score: scorePhone({...p, price: best.price}, preferences)};
  }).filter(p => p.score > -9000);
  if (scored.length === 0) {
    priceSummary.textContent = '–';
    resultsList.innerHTML = '<div>Nenhum aparelho encontrado com esses filtros. Tente ajustar o orçamento ou remover alguns filtros.</div>';
    return;
  }
  scored.sort((a,b) => b.score - a.score);

  // calcular média de preço (dos aparelhos encontrados) e indicar que é aproximado
  const avgPrice = scored.reduce((s,p) => s + p.bestPrice, 0) / scored.length;
  priceSummary.textContent = `Preço médio aproximado dos resultados: ${formatBRL(avgPrice)}`;

  // mostra top 6
  const top = scored.slice(0,6);
  resultsList.innerHTML = '';
  // trigger results animation
  if (resultsSection) {
    resultsSection.classList.remove('has-results');
    void resultsSection.offsetWidth;
  }
  top.forEach(p => {
    const div = document.createElement('div');
    div.className = 'cardItem';
    div.innerHTML = `<div style="flex:1">
        <strong style="font-size:16px">${p.name} — <span style="font-weight:600">${p.brand}</span></strong>
  <div class="specs">OS: ${p.os.toUpperCase()} • ${p.ram} GB RAM • ${p.storage} GB • Bateria: ${p.battery} mAh • Tela: ${p.screen || '—'} • 5G: ${p.has5g ? 'Sim' : 'Não'} • Ano: ${p.year || '—'}</div>
        <div style="margin-top:8px">${buildHighlights(p,preferences)}</div>
      </div>
      <div style="text-align:right">
  <div style="font-weight:700">${formatBRL(p.bestPrice)} <span style="font-size:12px;color:#9aa9b2">(aprox.)</span></div>
  <div style="margin-top:8px"><a target="_blank" rel="noopener noreferrer" href="${p.bestUrl}">Comprar (melhor preço: ${p.bestSite})</a></div>
      </div>`;
    resultsList.appendChild(div);
  });

  // nota de confiança
  const note = document.createElement('div');
  note.className = 'muted';
  note.style.marginTop = '8px';
  note.textContent = 'Recomendações baseadas em um conjunto de exemplos. Preços apresentados são aproximados. Clique em "Comprar" para ver preços e lojas atualizados.';
  resultsList.appendChild(note);
  if (resultsSection) resultsSection.classList.add('has-results');
}

function buildHighlights(phone, prefs) {
  const parts = [];
  if (prefs.focus === 'camera') parts.push(`Ótima câmera (pontuação ${phone.camera}/100)`);
  if (prefs.focus === 'performance') parts.push(`Desempenho forte (pontuação ${phone.perf}/100)`);
  if (prefs.focus === 'gaming') parts.push(`Focado em jogos (pontuação ${phone.gaming}/100)`);
  if (prefs.focus === 'battery') parts.push(`Bateria grande: ${phone.battery} mAh`);
  if (prefs.focus === 'value') {
    const priceToShow = phone.bestPrice || phone.price;
    parts.push(`Custo aproximado: ${formatBRL(priceToShow)}${phone.bestPrice ? ' (aprox.)' : ''}`);
  }
  // novos atributos
  // (tamanho de tela removido das perguntas)
  if (prefs.fiveg === 'yes' && phone.has5g) parts.push('Suporta 5G');
  if (prefs.fastcharge === 'yes' && phone.fastCharge) parts.push('Carregamento rápido');
  if (prefs.waterproof === 'yes' && phone.waterproof) parts.push('Resistente à água');
  return parts.join(' • ');
}

findBtn.addEventListener('click', () => {
  const focus = readSelection('focus');
  const os = readSelection('os');
  const budgetRaw = readSelection('budget');
  const storage = readSelection('storage');
  const recency = readSelection('recency');
  const fiveg = readSelection('fiveg');
  const fastcharge = readSelection('fastcharge');
  const waterproof = readSelection('waterproof');
  const condition = readSelection('condition');
  const budget = parseBudget(budgetRaw);
  const prefs = { focus, os, budget, storage, recency, fiveg, fastcharge, waterproof, condition };
  // animação de loading: mostra spinner e pulse no botão
  // add quick click animation class
  findBtn.classList.add('clicked');
  setTimeout(() => findBtn.classList.remove('clicked'), 220);
  setLoading(true);
  // curta espera para permitir animação visível
  setTimeout(() => {
    showResults(prefs);
    setLoading(false);
  }, 700);
});

resetBtn.addEventListener('click', () => {
  // reset form
  document.querySelectorAll('input[type="radio"]').forEach(r=>r.checked=false);
  // set defaults
  document.querySelector('[name="focus"][value="camera"]').checked = true;
  document.querySelector('[name="os"][value="android"]').checked = true;
  document.querySelector('[name="budget"][value="500-1000"]').checked = true;
  document.querySelector('[name="storage"][value="128"]').checked = true;
  document.querySelectorAll('input[type="checkbox"]').forEach(c=>c.checked=false);
  resultsList.innerHTML = 'Responda as perguntas e clique em "Encontrar meu celular".';
  priceSummary.textContent = '–';
});

// animação visual rápida para o botão de limpar
resetBtn.addEventListener('click', () => {
  resetBtn.classList.add('clicked');
  setTimeout(() => resetBtn.classList.remove('clicked'), 260);
});

// preenche defaults
resetBtn.click();

// brand preference UI removed — nothing to wire here

function setLoading(state) {
  const resultsEl = document.getElementById('results');
  if (state) {
    findBtn.disabled = true;
    resetBtn.disabled = true;
    findBtn.classList.add('loading');
    if (resultsEl) resultsEl.classList.add('loading');
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'block';
  } else {
    findBtn.disabled = false;
    resetBtn.disabled = false;
    findBtn.classList.remove('loading');
    if (resultsEl) resultsEl.classList.remove('loading');
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }
}
