const app = document.getElementById('app');
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const bySlug = slug => animeData.find(a=>a.slug===slug)||animeData[0];
const episodesFor = slug => episodeData.filter(e=>e.animeSlug===slug);
const img = (src,cls='',alt='')=>`<img class="${cls}" src="${src}" alt="${alt}" loading="lazy" onerror="this.src='/assets/poster-01.jpg'">`;

/* ── Watchlist ── */
function getWatchlist(){try{return JSON.parse(localStorage.getItem('animiko_watchlist')||'[]')}catch{return[]}}
function setWatchlist(l){localStorage.setItem('animiko_watchlist',JSON.stringify([...new Set(l)]))}
function isSaved(slug){return getWatchlist().includes(slug)}
function toggleWatch(slug){
  const l=getWatchlist();
  setWatchlist(l.includes(slug)?l.filter(x=>x!==slug):[...l,slug]);
  route();
}

/* ── Routing ── */
function go(path){history.pushState(null,'',path);route()}
window.addEventListener('popstate',route);

let heroTimer=null;

/* ── Global clicks ── */
document.addEventListener('click',e=>{
  const link=e.target.closest('[data-link]');
  if(link){e.preventDefault();go(link.getAttribute('href'))}
  if(e.target.closest('[data-menu]')) document.body.classList.toggle('menu-open');
  if(e.target.closest('[data-close-menu]')) document.body.classList.remove('menu-open');
  const add=e.target.closest('[data-watch]');
  if(add){e.preventDefault();e.stopPropagation();toggleWatch(add.dataset.watch)}
  const tab=e.target.closest('[data-auth-tab]');
  if(tab){
    $$('.auth-tab,.auth-form').forEach(x=>x.classList.remove('active'));
    $(`[data-auth-tab="${tab.dataset.authTab}"]`).classList.add('active');
    $(`#${tab.dataset.authTab}Form`).classList.add('active');
  }
  const arrow=e.target.closest('.row-arrow');
  if(arrow){
    const row=arrow.closest('.row-wrap').querySelector('.card-row,.top10-row,.ongoing-row');
    if(row) row.scrollBy({left:arrow.classList.contains('right')?560:-560,behavior:'smooth'});
  }
  const ft=e.target.closest('.ep-filter-tab');
  if(ft){ft.closest('.ep-filter-row').querySelectorAll('.ep-filter-tab').forEach(t=>t.classList.remove('active'));ft.classList.add('active')}
  const dot=e.target.closest('.hero-dots i');
  if(dot){
    const idx=$$('.hero-dots i').indexOf(dot);
    showHeroSlide(idx);
  }
});
document.addEventListener('submit',e=>e.preventDefault());
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.matches('.nav-search input,.mobile-search input')){
    const q=e.target.value.trim();if(q)go('/browse?q='+encodeURIComponent(q));
  }
});

/* ── Nav scroll ── */
function initNavScroll(){
  const nav=document.querySelector('.nav');
  if(!nav)return;
  const fn=()=>nav.classList.toggle('scrolled',window.scrollY>40);
  window.removeEventListener('scroll',window._navScroll);
  window._navScroll=fn;
  window.addEventListener('scroll',fn,{passive:true});
  fn();
}

/* ── Hero Carousel ── */
const HERO_FEATURED=[
  {slug:'shadow-ronin',    title:'Shadow Ronin',     tag:'Trending Now',    year:2024,genre:'Action · Samurai',    desc:'A nameless ronin walks through a neon war era while hunted by memories and enemies. An epic tale of honor, betrayal, and survival.'},
  {slug:'iron-eclipse',   title:'Iron Eclipse',      tag:'New Episode',     year:2023,genre:'Mecha · Sci-Fi',      desc:'When the last functioning mech pilot discovers a conspiracy buried in steel, the fate of two civilizations hangs by a wire.'},
  {slug:'crystal-academy',title:'Crystal Academy',   tag:'Ongoing',         year:2024,genre:'Fantasy · Magic',     desc:'Students with forbidden magic powers must unite against an academy that wants to erase them from history.'},
  {slug:'starlight-riders',title:'Starlight Riders',  tag:'Popular',         year:2023,genre:'Sci-Fi · Space',      desc:'Five strangers bound by the cosmos race across galaxies to stop a prophecy that was never meant to be fulfilled.'},
  {slug:'moon-harbor',    title:'Moon Harbor',       tag:'Top Rated',       year:2022,genre:'Drama · Slice of Life',desc:'Life unfolds slowly and beautifully in a small coastal town where every resident carries a secret heavier than the sea.'},
];

let heroIdx=0;
function showHeroSlide(i){
  heroIdx=((i%HERO_FEATURED.length)+HERO_FEATURED.length)%HERO_FEATURED.length;
  const slides=$$('.hero-slide');
  const dots=$$('.hero-dots i');
  slides.forEach((s,j)=>{s.classList.toggle('active',j===heroIdx)});
  dots.forEach((d,j)=>{d.classList.toggle('active',j===heroIdx)});
  const f=HERO_FEATURED[heroIdx];
  const a=bySlug(f.slug);
  const copy=$('.hero-copy');
  if(!copy)return;
  copy.style.opacity='0';
  setTimeout(()=>{
    $('.hero-tag',copy).textContent=f.tag;
    $('h1',copy).textContent=f.title;
    $('.hero-meta-text.yr',copy).textContent=f.year;
    $('.hero-meta-text.gn',copy).textContent=f.genre;
    $('p',copy).textContent=f.desc;
    $$('a',copy).forEach(a=>{
      if(a.classList.contains('watch-link')) a.href='/watch/'+f.slug+'/1';
      if(a.classList.contains('info-link'))  a.href='/anime/'+f.slug;
    });
    copy.style.opacity='1';
  },250);
}
function startHeroTimer(){
  clearInterval(heroTimer);
  heroTimer=setInterval(()=>showHeroSlide(heroIdx+1),6000);
}

function hero(){
  const slides=HERO_FEATURED.map((f,i)=>`
    <div class="hero-slide${i===0?' active':''}" style="background-image:url('/assets/hero-main.jpg')"></div>`).join('');
  const f=HERO_FEATURED[0];
  return `<section class="hero">
    ${slides}
    <div class="hero-overlay"></div>
    <div class="hero-bottom-fade"></div>
    <div class="hero-copy" style="transition:opacity .25s ease">
      <div class="hero-tag"><i></i><span>${f.tag}</span></div>
      <h1>${f.title}</h1>
      <div class="hero-meta">
        <span class="hero-meta-badge hd">HD</span>
        <span class="hero-meta-badge cc">CC</span>
        <span class="hero-meta-sep">|</span>
        <span class="hero-meta-text yr">${f.year}</span>
        <span class="hero-meta-sep">|</span>
        <span class="hero-meta-text gn">${f.genre}</span>
      </div>
      <p>${f.desc}</p>
      <div class="hero-actions">
        <a data-link href="/watch/${f.slug}/1" class="btn white hero-play-btn watch-link">&#9654;&ensp;Watch Now</a>
        <a data-link href="/anime/${f.slug}" class="btn muted info-link">More Info</a>
      </div>
      <div class="hero-dots">${HERO_FEATURED.map((_,i)=>`<i class="${i===0?'active':''}"></i>`).join('')}</div>
    </div>
  </section>`;
}

/* ── Layout ── */
function layout(content,active='Home'){
  const links=['Home','Browse','Movies','Series','Watchlist'];
  return `
  <header class="nav">
    <a href="/" data-link class="brand">
      <span class="brand-icon">A</span>
      <span class="brand-name">Ani<span>Miko</span></span>
    </a>
    <nav class="nav-links">
      ${links.map(n=>`<a href="${n==='Home'?'/':n==='Watchlist'?'/watchlist':'/browse?type='+n}" data-link class="${active===n?'active':''}">${n}</a>`).join('')}
    </nav>
    <div class="nav-right">
      <div class="nav-search-wrap">
        <div class="nav-search" id="navSearch" onclick="this.classList.add('open');this.querySelector('input').focus()">
          <span class="search-icon-btn">&#128269;</span>
          <input placeholder="Search..." onblur="if(!this.value)this.closest('.nav-search').classList.remove('open')">
        </div>
      </div>
      <button class="icon-btn" title="Notifications">&#128276;</button>
      <button class="avatar" onclick="go('/auth')">A</button>
      <button data-menu class="menu-btn">&#9776; Menu</button>
    </div>
  </header>
  <aside class="mobile-panel">
    <label class="mobile-search"><input placeholder="Search anime..." onkeydown="if(event.key==='Enter'&&this.value.trim())go('/browse?q='+encodeURIComponent(this.value.trim()))"></label>
    ${['Home','Browse','Watchlist','Admin','Sign In'].map(n=>`<a data-close-menu data-link href="${n==='Home'?'/':n==='Watchlist'?'/watchlist':n==='Admin'?'/admin':n==='Sign In'?'/auth':'/browse'}">${n}</a>`).join('')}
  </aside>
  <main>${content}</main>
  <footer class="footer">
    <div>
      <b>ANIMIKO</b>
      <p>Premium anime streaming — simulcasts, classics, and hidden gems, all in one place.</p>
    </div>
    <div>
      <b>Navigate</b>
      <a data-link href="/">Home</a>
      <a data-link href="/browse">Browse</a>
      <a data-link href="/watchlist">Watchlist</a>
      <a data-link href="/auth">Sign In</a>
    </div>
    <div>
      <b>Info</b>
      <span>Terms of Service</span>
      <span>Privacy Policy</span>
      <a data-link href="/admin">Admin Panel</a>
    </div>
  </footer>`;
}

/* ── Section header ── */
function section(title,inner,viewAll=true,sub=''){
  return `<section class="section">
    <div class="section-head">
      <h2>${title}</h2>
      ${sub?`<p style="font-size:11px;color:var(--muted);flex:1">${sub}</p>`:''}
      ${viewAll?`<a data-link href="/browse">View all</a>`:''}
    </div>
    ${inner}
  </section>`;
}

/* ── Card ── */
function card(a){
  const ep=episodesFor(a.slug).length||12;
  return `<article class="anime-card" onclick="go('/anime/${a.slug}')">
    <div class="poster-wrap">
      ${img(a.posterUrl,'poster',a.title)}
      <div class="card-badges">
        <span>&#9733; ${a.rating.toFixed(1)}</span>
        <span>${a.genres[0]}</span>
      </div>
      ${a.status==='Ongoing'?`<span class="card-ep-badge">EP ${ep}</span>`:''}
      <div class="card-play-overlay"><div class="card-play-btn">&#9654;</div></div>
      <button class="save-small" data-watch="${a.slug}" onclick="event.stopPropagation()">${isSaved(a.slug)?'Saved':'+ Save'}</button>
    </div>
    <div class="card-hover-info">
      <div class="card-hover-top">
        <a data-link href="/watch/${a.slug}/1" class="card-hover-play" onclick="event.stopPropagation()">&#9654;</a>
        <button class="card-save-btn" data-watch="${a.slug}" onclick="event.stopPropagation()">+</button>
        <span class="card-hover-rating">&#9733; ${a.rating.toFixed(1)}</span>
      </div>
      <div class="card-hover-h3">${a.title}</div>
      <div class="card-hover-meta">${a.releaseYear} &middot; ${a.totalEpisodes} eps &middot; ${a.status}</div>
      <div class="card-hover-tags">
        ${a.genres.slice(0,2).map(g=>`<span>${g}</span>`).join('')}
        <span>${a.type==='Movie'?'Movie':'TV'}</span>
      </div>
    </div>
  </article>`;
}

/* ── Row with arrows ── */
function rowCards(list){
  return `<div class="row-wrap">
    <button class="row-arrow left">&#8249;</button>
    <div class="card-row">${list.map(a=>card(a)).join('')}</div>
    <button class="row-arrow right">&#8250;</button>
  </div>`;
}

/* ── Grid (browse) ── */
function gridCards(list){
  return `<div class="anime-grid">${list.map(a=>`
    <article class="anime-card" onclick="go('/anime/${a.slug}')">
      <div class="poster-wrap">
        ${img(a.posterUrl,'poster',a.title)}
        <div class="card-badges"><span>&#9733; ${a.rating.toFixed(1)}</span><span>${a.genres[0]}</span></div>
        ${a.status==='Ongoing'?`<span class="card-ep-badge">EP ${episodesFor(a.slug).length||12}</span>`:''}
        <div class="card-play-overlay"><div class="card-play-btn">&#9654;</div></div>
        <button class="save-small" data-watch="${a.slug}" onclick="event.stopPropagation()">${isSaved(a.slug)?'Saved':'+ Save'}</button>
      </div>
      <div class="card-body">
        <h3>${a.title}</h3>
        <p>${a.releaseYear} &middot; ${a.type}</p>
        <div class="mini-tags"><span>${a.status}</span><span>${a.genres[1]||a.genres[0]}</span></div>
      </div>
    </article>`).join('')}</div>`;
}

/* ── Ongoing cards (wide landscape style) ── */
function ongoingCards(list){
  return `<div class="row-wrap">
    <button class="row-arrow left">&#8249;</button>
    <div class="card-row ongoing-row" style="gap:10px">
      ${list.map((a,i)=>{
        const ep=episodesFor(a.slug).length||Math.floor(6+i*1.5);
        const total=a.totalEpisodes||24;
        const pct=Math.round((ep/total)*100);
        return `<div class="ongoing-card" onclick="go('/anime/${a.slug}')">
          <div class="ongoing-card-top">
            ${img(a.bannerUrl||a.posterUrl,'','banner')}
            <span class="live-dot">AIRING</span>
            <span class="ep-num">EP ${ep} / ${total}</span>
          </div>
          <div class="ongoing-card-body">
            <h3>${a.title}</h3>
            <p>${a.genres.slice(0,2).join(' &middot; ')} &middot; ${a.releaseYear}</p>
            <div class="ongoing-card-progress"><i style="width:${pct}%"></i></div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <button class="row-arrow right">&#8250;</button>
  </div>`;
}

/* ── Top 10 row ── */
function top10Row(){
  const top=[...animeData].sort((a,b)=>b.rating-a.rating).slice(0,10);
  return `<div class="row-wrap">
    <button class="row-arrow left">&#8249;</button>
    <div class="top10-row">
      ${top.map((a,i)=>`
        <div class="top10-item" onclick="go('/anime/${a.slug}')">
          <span class="top10-num">${i+1}</span>
          <div class="top10-poster">${img(a.posterUrl,'',a.title)}</div>
        </div>`).join('')}
    </div>
    <button class="row-arrow right">&#8250;</button>
  </div>`;
}

/* ── Latest episodes ── */
function latestList(){
  const eps=episodeData.slice(0,8);
  return `
    <div class="ep-filter-row">
      <button class="ep-filter-tab active">All</button>
      <button class="ep-filter-tab">Sub</button>
      <button class="ep-filter-tab">Dub</button>
      <button class="ep-filter-tab">Trending</button>
    </div>
    <div class="latest-list">
      ${eps.map(e=>{
        const a=bySlug(e.animeSlug);
        return `<a data-link href="/watch/${a.slug}/${e.episodeNumber}" class="episode-row">
          <div class="ep-thumb">${img(e.thumbnailUrl,'','')}</div>
          <div>
            <b>${a.title}</b>
            <span>Episode ${String(e.episodeNumber).padStart(2,'0')} &middot; ${e.releaseDate}</span>
          </div>
          <em>New</em>
        </a>`;
      }).join('')}
    </div>`;
}

/* ── Genre chips ── */
function genreChips(){
  return `<div class="chips">${['Action','Fantasy','Romance','Sci-Fi','Slice of Life','Adventure','Comedy','Horror','Mecha','Mystery','Drama','Thriller','School','Sports'].map(g=>`<a data-link href="/browse?genre=${encodeURIComponent(g)}">${g}</a>`).join('')}</div>`;
}

/* ── Premium banner ── */
function premium(){
  return `<section class="premium">
    <div class="premium-icon">A</div>
    <div>
      <h3>AniMiko Premium</h3>
      <p>Ad-free streaming, simulcasts, exclusive content and more.</p>
    </div>
    <button>Start Free Trial</button>
  </section>`;
}

/* ── Ongoing alert bar ── */
function ongoingBanner(count){
  return `<div class="ongoing-banner">
    <span class="ongoing-dot"></span>
    <b>CURRENTLY AIRING</b>
    <span>${count} anime airing this season &mdash; updated daily</span>
  </div>`;
}

/* ══════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════ */
function homePage(){
  const trending=animeData.filter(a=>a.isTrending).slice(0,10);
  const ongoing =animeData.filter(a=>a.status==='Ongoing').slice(0,12);
  const popular =animeData.filter(a=>a.isPopular).slice(0,10);
  const classic =animeData.filter(a=>a.isClassic).slice(0,10);
  const recent  =animeData.filter(a=>a.isRecentlyAdded).slice(0,10);
  const movies  =animeData.filter(a=>a.type==='Movie').slice(0,10);

  return layout(`
    ${hero()}
    <div class="page-wrap">
      ${genreChips()}
      ${ongoingBanner(ongoing.length)}
      ${section('<span>Currently Airing</span> <span class="live-badge">LIVE</span>',ongoingCards(ongoing.length?ongoing:animeData.slice(0,10)),'','')}
      ${section('Trending Now',rowCards(trending))}
      ${section('Latest Episodes',latestList(),false)}
      ${section('Top 10 This Week',top10Row(),false)}
      ${section('Popular Anime',rowCards(popular))}
      ${section('Movies',rowCards(movies.length?movies:animeData.slice(5,15)))}
      ${section('Classic Picks',rowCards(classic))}
      ${section('Recently Added',rowCards(recent))}
      ${premium()}
    </div>`,'Home');
}

/* ══════════════════════════════════════════
   BROWSE PAGE
══════════════════════════════════════════ */
function filterAnime(){
  const p=new URLSearchParams(location.search);
  let q=(p.get('q')||'').toLowerCase();
  let genre=p.get('genre')||'',status=p.get('status')||'',
      type=p.get('type')||'',year=p.get('year')||'',sort=p.get('sort')||'Popularity';
  let list=animeData.filter(a=>
    (!q||a.title.toLowerCase().includes(q)||a.genres.join(' ').toLowerCase().includes(q))&&
    (!genre||a.genres.includes(genre))&&(!status||a.status===status)&&
    (!type||a.type.includes(type))&&(!year||String(a.releaseYear)===year));
  if(sort==='Rating')    list.sort((a,b)=>b.rating-a.rating);
  if(sort==='Newest')    list.sort((a,b)=>b.releaseYear-a.releaseYear);
  if(sort==='Oldest')    list.sort((a,b)=>a.releaseYear-b.releaseYear);
  if(sort==='Title A-Z') list.sort((a,b)=>a.title.localeCompare(b.title));
  return{list,q,genre,status,type,year,sort};
}
function selectFilter(label,name,values,current){
  return `<div class="filter-select">
    <span>${label}</span>
    <select onchange="updateParam('${name}',this.value)">
      <option value="">Any</option>
      ${values.map(v=>`<option ${current==v?'selected':''}>${v}</option>`).join('')}
    </select>
  </div>`;
}
window.updateParam=(k,v)=>{
  const p=new URLSearchParams(location.search);
  if(v)p.set(k,v);else p.delete(k);go('/browse?'+p.toString());
};
function browsePage(){
  const f=filterAnime();
  const genres=[...new Set(animeData.flatMap(a=>a.genres))].slice(0,14);
  const years=[...new Set(animeData.map(a=>a.releaseYear))].sort((a,b)=>b-a).slice(0,20);
  return layout(`<div class="page-wrap" style="padding-top:calc(var(--nav-h) + 14px)">
    <div class="browse-layout">
      <aside class="filters">
        <h1>Browse</h1>
        <p>Find anime by genre, year, status and more.</p>
        <button onclick="go('/browse')" class="clear">Clear Filters</button>
        <h3>Genres</h3>
        ${genres.map(g=>`<label>
          <input type="checkbox" ${f.genre===g?'checked':''} onchange="updateParam('genre',this.checked?'${g}':'')">
          <span>${g}</span><span>${36+g.length*8}</span>
        </label>`).join('')}
      </aside>
      <section class="browse-main">
        <div class="big-search">
          <input value="${f.q}" placeholder="Search by title, genre..." onkeydown="if(event.key==='Enter')updateParam('q',this.value)">
          <button onclick="updateParam('q',this.previousElementSibling.value)">Search</button>
        </div>
        <div class="filter-row">
          ${selectFilter('Genre','genre',genres,f.genre)}
          ${selectFilter('Year','year',years,f.year)}
          ${selectFilter('Type','type',['TV Series','Movie'],f.type)}
          ${selectFilter('Status','status',['Ongoing','Completed'],f.status)}
          ${selectFilter('Sort By','sort',['Popularity','Rating','Newest','Oldest','Title A-Z'],f.sort)}
          <button class="grid-toggle">Grid</button>
        </div>
        <p class="result-count">${f.list.length} result${f.list.length!==1?'s':''} found</p>
        ${f.list.length?gridCards(f.list):`<div class="empty" style="min-height:40vh"><h1>No results</h1><p>Try adjusting your filters.</p></div>`}
        <div class="pagination">
          <button>Prev</button><button class="active">1</button><button>2</button><button>3</button><button>Next</button>
        </div>
        ${premium()}
      </section>
    </div>
  </div>`,'Browse');
}

/* ══════════════════════════════════════════
   DETAILS PAGE
══════════════════════════════════════════ */
function detailsPage(slug){
  const a=bySlug(slug);
  const eps=episodesFor(a.slug).length?episodesFor(a.slug):episodesFor('shadow-ronin');
  return layout(`
    <div style="padding-top:var(--nav-h)">
      <section class="details-hero" style="--banner:url('${a.bannerUrl}')">
        <div class="detail-poster">${img(a.posterUrl,'poster',a.title)}</div>
        <div class="detail-info">
          <h1>${a.title}</h1>
          <div class="meta">
            <span>&#9733; ${a.rating.toFixed(1)}</span>
            <span>${a.releaseYear}</span>
            <span>${a.ageRating}</span>
            <span>${a.status}</span>
            <span>HD</span>
          </div>
          <div class="facts">
            <div><span>Type</span><b>${a.type}</b></div>
            <div><span>Episodes</span><b>${a.totalEpisodes}</b></div>
            <div><span>Studio</span><b>${a.studio}</b></div>
            <div><span>Season</span><b>${a.season||'Summer 2024'}</b></div>
          </div>
          <div class="tag-list">${a.genres.map(g=>`<span>${g}</span>`).join('')}</div>
          <p>${a.description}</p>
          <div class="hero-actions">
            <a data-link class="btn white" href="/watch/${a.slug}/1" style="height:44px;padding:0 26px;font-size:13.5px">&#9654;&ensp;Watch Now</a>
            <button data-watch="${a.slug}" class="btn muted">${isSaved(a.slug)?'&#10003; Remove':'+ Add to List'}</button>
            <button class="btn icon" title="Share">&#8679;</button>
          </div>
        </div>
      </section>
      <div class="page-wrap" style="padding-top:0">
        <div class="tabs">
          <a class="active">Overview</a><a>Episodes</a><a>Characters</a><a>Related</a>
        </div>
        <div class="detail-grid">
          <section class="episode-panel">
            <div class="panel-head">
              <h2>Episodes <span style="color:var(--muted);font-weight:500;font-size:12.5px">(${eps.length})</span></h2>
              <select><option>Oldest First</option><option>Newest First</option></select>
            </div>
            ${eps.map(e=>`
              <a data-link class="episode-wide" href="/watch/${a.slug}/${e.episodeNumber}">
                <b>${String(e.episodeNumber).padStart(2,'0')}</b>
                ${img(e.thumbnailUrl,'wide-thumb',e.title)}
                <div><h3>${e.title}</h3><p>${e.description}</p></div>
                <span>${e.duration}</span>
                <small>${e.releaseDate}</small>
                <em>Play</em>
              </a>`).join('')}
          </section>
          <aside class="recommend">
            <h2>You May Also Like</h2>
            ${animeData.filter(x=>x.slug!==a.slug).slice(0,6).map(r=>`
              <a data-link href="/anime/${r.slug}">
                ${img(r.posterUrl,'rec-img',r.title)}
                <div>
                  <b>${r.title}</b>
                  <span>&#9733; ${r.rating.toFixed(1)}</span>
                  <small>${r.releaseYear} &middot; ${r.totalEpisodes} eps</small>
                </div>
              </a>`).join('')}
          </aside>
        </div>
        ${section('More Like This',rowCards(animeData.filter(x=>x.slug!==a.slug).slice(0,8)))}
      </div>
    </div>`,'');
}

/* ══════════════════════════════════════════
   WATCH PAGE
══════════════════════════════════════════ */
function watchPage(slug,num){
  const a=bySlug(slug);
  const eps=episodesFor(a.slug).length?episodesFor(a.slug):episodesFor('shadow-ronin');
  const n=Math.max(1,Math.min(Number(num)||1,eps.length));
  const e=eps[n-1];
  return layout(`
    <div style="padding-top:var(--nav-h)">
      <div class="page-wrap">
        <section class="watch-layout">
          <div class="watch-main">
            <div class="breadcrumb">
              <a data-link href="/">Home</a> / <a data-link href="/anime/${a.slug}">${a.title}</a> / Episode ${n}
            </div>
            <div class="watch-title">
              <h1>${a.title} <span>Ep ${n}: ${e.title}</span></h1>
              <div>
                <button data-watch="${a.slug}" class="btn muted" style="height:36px;padding:0 12px;font-size:12px">${isSaved(a.slug)?'&#10003; Saved':'+ List'}</button>
                <button class="btn icon" style="width:36px;height:36px" title="Share">&#8679;</button>
              </div>
            </div>
            <div class="player" style="--watch:url('/assets/watch-bg.jpg')">
              <span>1080p</span>
              <button class="play">&#9654;</button>
              <div class="controls">
                <i></i><b>10:42 / 23:50</b>
                <small>CC</small><small>Settings</small><small>Full</small>
              </div>
            </div>
            <div class="prev-next">
              <a data-link class="btn muted ${n===1?'disabled':''}" href="/watch/${a.slug}/${Math.max(1,n-1)}">&larr; Previous</a>
              <a data-link class="btn primary ${n===eps.length?'disabled':''}" href="/watch/${a.slug}/${Math.min(eps.length,n+1)}">Next &rarr;</a>
            </div>
            <div class="episode-about">
              ${img(a.posterUrl,'about-poster',a.title)}
              <div>
                <h2>Episode ${n}: ${e.title}</h2>
                <p>${e.description}</p>
                <div class="tag-list" style="margin-top:9px">
                  ${a.genres.map(g=>`<span>${g}</span>`).join('')}
                  <span>${e.releaseDate}</span><span>${e.duration}</span>
                </div>
              </div>
            </div>
            ${section('More Like This',rowCards(animeData.filter(x=>x.slug!==a.slug).slice(1,9)))}
          </div>
          <aside class="watch-side">
            <h2>Episodes <span>${n} / ${eps.length}</span></h2>
            <div class="side-ep-list">
              ${eps.map(x=>`
                <a data-link href="/watch/${a.slug}/${x.episodeNumber}" class="side-ep ${x.episodeNumber===n?'active':''}">
                  ${img(x.thumbnailUrl,'side-thumb',x.title)}
                  <div><b>${x.episodeNumber}. ${x.title}</b><span>${x.duration}</span></div>
                  <em>${x.episodeNumber<n?'Seen':x.episodeNumber===n?'Now':'Soon'}</em>
                </a>`).join('')}
            </div>
          </aside>
        </section>
        <div class="comments">
          <div><b>Comments (124)</b><b>Report Issue</b></div>
          <input placeholder="Share your thoughts about this episode...">
          <button>Post</button>
        </div>
      </div>
    </div>`,'');
}

/* ══════════════════════════════════════════
   AUTH PAGE
══════════════════════════════════════════ */
function authPage(){
  return layout(`
    <div style="padding-top:var(--nav-h)">
      <div class="page-wrap">
        <section class="auth-page">
          <div class="auth-art" style="--auth:url('/assets/auth-art.jpg')">
            <h1>Your Anime Journey Starts Here</h1>
            <p>Simulcasts, hidden gems, and a passionate anime community — all in one place.</p>
          </div>
          <div class="auth-card">
            <div class="auth-tabs">
              <button class="auth-tab active" data-auth-tab="login">Sign In</button>
              <button class="auth-tab" data-auth-tab="register">Register</button>
            </div>
            <form id="loginForm" class="auth-form active">
              <h2>Welcome Back</h2>
              <label>Email<input type="email" placeholder="you@example.com"></label>
              <label>Password<input type="password" placeholder="Your password"></label>
              <a>Forgot Password?</a>
              <button class="btn primary">Sign In</button>
              <button class="btn muted">Continue with Google</button>
              <button class="btn muted">Continue with Discord</button>
            </form>
            <form id="registerForm" class="auth-form">
              <h2>Create Account</h2>
              <label>Display Name<input placeholder="Your name"></label>
              <label>Email<input type="email" placeholder="you@example.com"></label>
              <label>Password<input type="password" placeholder="Create a password"></label>
              <label>Confirm Password<input type="password" placeholder="Repeat password"></label>
              <button class="btn primary">Create Account</button>
            </form>
          </div>
        </section>
      </div>
    </div>`,'');
}

/* ══════════════════════════════════════════
   WATCHLIST PAGE
══════════════════════════════════════════ */
function watchlistPage(){
  let list=getWatchlist();
  if(!list.length)list=animeData.slice(0,5).map(a=>a.slug);
  const items=list.map(bySlug);
  return layout(`
    <div style="padding-top:var(--nav-h)">
      <div class="page-wrap">
        <section class="profile-head" style="--profile:url('/assets/profile-banner.jpg')">
          <div class="profile-avatar">M</div>
          <div>
            <h1>MikoShadow <span>PREMIUM</span></h1>
            <p>Exploring stories, one episode at a time.</p>
            <div class="profile-stats">
              <b>${items.length}<span>Watchlisted</span></b>
              <b>37<span>Completed</span></b>
              <b>14<span>On Hold</span></b>
              <b>256<span>Hours</span></b>
            </div>
          </div>
          <button>Edit Profile</button>
        </section>
        ${section('My Watchlist',`
          <div class="watchlist-row">
            ${items.map((a,i)=>`
              <article class="watch-card">
                ${img(a.posterUrl,'watch-poster',a.title)}
                <div>
                  <h3>${a.title}</h3>
                  <p>${a.genres.join(', ')}</p>
                  <span>&#9733; ${a.rating.toFixed(1)}</span>
                  <div class="progress"><i style="width:${18+i*10}%"></i></div>
                  <small>Episode ${i+1} of ${a.totalEpisodes}</small>
                  <div>
                    <a data-link class="btn primary" href="/watch/${a.slug}/1">Resume</a>
                    <button data-watch="${a.slug}" class="btn danger">Remove</button>
                  </div>
                </div>
              </article>`).join('')}
          </div>`,false)}
        <div class="profile-grid">
          ${section('Continue Watching',latestList(),false)}
          ${section('Recently Viewed',latestList(),false)}
          <section class="section favorite">
            <div class="section-head"><h2>Favorite Genres</h2></div>
            ${['Fantasy','Sci-Fi','Adventure','Action','Romance','Drama'].map((g,i)=>`
              <p><span>${g}</span><b style="width:${42-i*5}%"></b><em>${32-i*4}%</em></p>`).join('')}
          </section>
        </div>
      </div>
    </div>`,'Watchlist');
}

/* ══════════════════════════════════════════
   ADMIN PAGE
══════════════════════════════════════════ */
function adminPage(){
  const navItems=['Dashboard','Anime','Episodes','Users','Reports','Settings'];
  const stats=[['Total Anime','1,248'],['Total Episodes','18,563'],['Registered Users','156,892'],['Active Today','2,847']];
  return layout(`
    <div style="padding-top:var(--nav-h)">
      <section class="admin">
        <aside class="admin-side">
          <b>ANIMIKO Admin</b>
          ${navItems.map((x,i)=>`<a class="${i===0?'active':''}">${x}</a>`).join('')}
          <div class="admin-user">
            <div class="admin-user-ava">A</div>
            <div><b>Administrator</b><span>Full Access</span></div>
          </div>
        </aside>
        <main class="admin-main">
          <div class="admin-top">
            <h1>Dashboard</h1>
            <input placeholder="Search anime, users...">
          </div>
          <div class="stat-grid">
            ${stats.map(s=>`<div class="stat"><span>${s[0]}</span><b>${s[1]}</b><small>+28 this month</small></div>`).join('')}
          </div>
          <section class="table-box">
            <div class="panel-head">
              <h2>Anime Management</h2>
              <button class="btn primary" style="height:34px;padding:0 14px;font-size:12px">+ Add Anime</button>
            </div>
            <table>
              <thead><tr><th>#</th><th>Title</th><th>Status</th><th>Genre</th><th>Year</th><th>Eps</th><th>Actions</th></tr></thead>
              <tbody>
                ${animeData.slice(0,10).map((a,i)=>`
                  <tr>
                    <td>${i+1}</td>
                    <td><div class="td-title">${img(a.posterUrl,'tiny',a.title)}<b>${a.title}<span>${a.genres.join(' / ')}</span></b></div></td>
                    <td><mark>${i===5?'Draft':'Published'}</mark></td>
                    <td>${a.type}</td><td>${a.releaseYear}</td><td>${a.totalEpisodes}</td>
                    <td>Edit &nbsp; Copy &nbsp; Delete</td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </section>
        </main>
        <aside class="add-panel">
          <h2>Add Anime</h2>
          <div class="auth-tabs">
            <button class="auth-tab active">Details</button>
            <button class="auth-tab">Media</button>
          </div>
          ${['Title','Alt Title','Synopsis','Type','Status','Year','Episodes','Rating','Age Rating','Genres','Poster URL','Banner URL'].map(x=>`<label>${x}<input placeholder="${x}"></label>`).join('')}
          <button class="btn muted">Cancel</button>
          <button class="btn primary">Save Anime</button>
        </aside>
      </section>
    </div>`,'');
}

/* ── 404 ── */
function notFound(){
  return layout(`<div style="padding-top:var(--nav-h)"><section class="empty"><h1>404</h1><p>Page not found.</p><a data-link class="btn primary" href="/">Back to Home</a></section></div>`,'');
}

/* ── Router ── */
function route(){
  document.body.classList.remove('menu-open');
  clearInterval(heroTimer);
  const path=location.pathname.replace(/\/+$/,'')||'/';
  if(path==='/')                       app.innerHTML=homePage();
  else if(path==='/browse')            app.innerHTML=browsePage();
  else if(path.startsWith('/anime/'))  app.innerHTML=detailsPage(path.split('/')[2]);
  else if(path.startsWith('/watch/')){ const p=path.split('/');app.innerHTML=watchPage(p[2],p[3]||1)}
  else if(path==='/auth')              app.innerHTML=authPage();
  else if(path==='/watchlist')         app.innerHTML=watchlistPage();
  else if(path==='/admin')             app.innerHTML=adminPage();
  else                                 app.innerHTML=notFound();
  window.scrollTo(0,0);
  initNavScroll();
  if(path==='/')startHeroTimer();
}
route();
