const app = document.getElementById('app');
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const bySlug = slug => animeData.find(a => a.slug === slug) || animeData[0];
const episodesFor = slug => episodeData.filter(e => e.animeSlug === slug);
const img = (src, cls='', alt='') => `<img class="${cls}" src="${src}" alt="${alt}" loading="lazy" onerror="this.src='/assets/poster-01.jpg'">`;

function getWatchlist(){
  try { return JSON.parse(localStorage.getItem('animiko_watchlist') || '[]'); } catch { return []; }
}
function setWatchlist(list){ localStorage.setItem('animiko_watchlist', JSON.stringify([...new Set(list)])); }
function isSaved(slug){ return getWatchlist().includes(slug); }
function toggleWatch(slug){
  const list = getWatchlist();
  setWatchlist(list.includes(slug) ? list.filter(x=>x!==slug) : [...list, slug]);
  route();
}
function go(path){ history.pushState(null,'',path); route(); }
window.addEventListener('popstate', route);

document.addEventListener('click', e=>{
  const link = e.target.closest('[data-link]');
  if(link){ e.preventDefault(); go(link.getAttribute('href')); }
  const toggle = e.target.closest('[data-menu]');
  if(toggle) document.body.classList.toggle('menu-open');
  const close = e.target.closest('[data-close-menu]');
  if(close) document.body.classList.remove('menu-open');
  const add = e.target.closest('[data-watch]');
  if(add){ e.preventDefault(); toggleWatch(add.dataset.watch); }
  const tab = e.target.closest('[data-auth-tab]');
  if(tab){ $$('.auth-tab,.auth-form').forEach(x=>x.classList.remove('active')); $(`[data-auth-tab="${tab.dataset.authTab}"]`).classList.add('active'); $(`#${tab.dataset.authTab}Form`).classList.add('active'); }
});

document.addEventListener('submit', e=>{ e.preventDefault(); });

document.addEventListener('keydown', e=>{
  if(e.key === 'Enter' && e.target.matches('.nav-search input')){
    const q = e.target.value.trim(); if(q) go('/browse?q='+encodeURIComponent(q));
  }
});

function layout(content, active='Home'){
  const links = ['Home','Browse','Movies','Series','Watchlist'];
  return `
  <header class="nav">
    <a href="/" data-link class="brand">
      <span class="brand-icon">A</span>
      <span class="brand-name">ᴀɴɪᴍɪᴋᴏ</span>
    </a>
    <nav class="nav-links">
      ${links.map(n=>`<a href="${n==='Home'?'/':n==='Watchlist'?'/watchlist':'/browse?type='+n}" data-link class="${active===n?'active':''}">${n}</a>`).join('')}
    </nav>
    <label class="nav-search">
      <span class="search-icon"></span>
      <input placeholder="Search anime, genres..." value="">
    </label>
    <button class="circle">N</button>
    <button class="avatar">A</button>
    <button data-menu class="menu-btn">Menu</button>
  </header>
  <aside class="mobile-panel">
    <label class="mobile-search"><input placeholder="Search anime..." onkeydown="if(event.key==='Enter'&&this.value.trim()) location.href='/browse?q='+encodeURIComponent(this.value.trim())"></label>
    ${['Home','Browse','Movies','Series','Watchlist','Admin','Login'].map(n=>`<a data-close-menu data-link href="${n==='Home'?'/':n==='Watchlist'?'/watchlist':n==='Admin'?'/admin':n==='Login'?'/auth':'/browse'}">${n}</a>`).join('')}
  </aside>
  <main>${content}</main>
  <footer class="footer">
    <div>
      <b>ᴀɴɪᴍɪᴋᴏ</b>
      <p>A premium anime streaming frontend. Watch your favorite series, movies, and classics — all in one beautifully crafted space.</p>
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
      <a data-link href="/admin">Admin Dashboard</a>
    </div>
  </footer>`;
}

function section(title, sub, inner, view=true){
  return `<section class="section">
    <div class="section-head">
      <div><h2>${title}</h2>${sub?`<p>${sub}</p>`:''}</div>
      ${view?`<a data-link href="/browse">View all</a>`:''}
    </div>
    ${inner}
  </section>`;
}

function card(a){
  return `<article class="anime-card" onclick="go('/anime/${a.slug}')">
    <div class="poster-wrap">
      ${img(a.posterUrl,'poster',a.title)}
      <div class="card-badges">
        <span>${a.rating.toFixed(1)}</span>
        <span>${a.genres[0]}</span>
      </div>
      <button class="save-small" data-watch="${a.slug}" onclick="event.stopPropagation()">${isSaved(a.slug)?'Saved':'Save'}</button>
    </div>
    <div class="card-body">
      <h3>${a.title}</h3>
      <p>${a.releaseYear} &middot; ${a.type}</p>
      <div class="mini-tags"><span>${a.status}</span><span>${a.genres[1]}</span></div>
    </div>
  </article>`;
}

function rowCards(list){ return `<div class="card-row">${list.map(a=>card(a)).join('')}</div>`; }
function gridCards(list){ return `<div class="anime-grid">${list.map(a=>card(a)).join('')}</div>`; }

function latestList(){
  const eps = episodeData.slice(0,8);
  return `<div class="latest-list">${eps.map(e=>{
    const a = bySlug(e.animeSlug);
    return `<a data-link href="/watch/${a.slug}/${e.episodeNumber}" class="episode-row">
      <div class="ep-thumb">${img(e.thumbnailUrl,'','')}</div>
      <div>
        <b>${a.title}</b>
        <span>Episode ${String(e.episodeNumber).padStart(2,'0')} &middot; ${e.releaseDate}</span>
      </div>
      <em>New</em>
    </a>`;
  }).join('')}</div>`;
}

function hero(){
  return `<section class="hero" style="--hero:url('/assets/hero-main.jpg')">
    <button class="hero-arrow left">&lsaquo;</button>
    <button class="hero-arrow right">&rsaquo;</button>
    <div class="hero-copy">
      <span class="eyebrow">Premium anime library</span>
      <h1>Stream Anime,<br>Discover Classics</h1>
      <p>Explore the latest simulcasts, hidden gems, and timeless classics all in one beautifully curated place.</p>
      <div class="hero-tags">
        <span>Trending</span>
        <span>HD Library</span>
        <span>Old &amp; New</span>
      </div>
      <div class="hero-actions">
        <a data-link href="/watch/shadow-ronin/1" class="btn primary">ᴡᴀᴛᴄʜ ɴᴏᴡ</a>
        <a data-link href="/browse" class="btn muted">ʙʀᴏᴡsᴇ ʟɪʙʀᴀʀʏ</a>
      </div>
      <div class="dots"><i></i><i></i><i></i></div>
    </div>
  </section>`;
}

function genreChips(){
  return `<div class="chips">${['Action','Fantasy','Romance','Sci-Fi','Slice of Life','Adventure','Comedy','Horror','Mecha','Mystery'].map(g=>`<a data-link href="/browse?genre=${encodeURIComponent(g)}">${g}</a>`).join('')}</div>`;
}

function premium(){
  return `<section class="premium">
    <div class="premium-icon">A</div>
    <div>
      <h3>AniMiko Premium</h3>
      <p>Ad-free streaming, early access to simulcasts, and exclusive community rewards.</p>
    </div>
    <button>Start Free Trial</button>
  </section>`;
}

function homePage(){
  const trending = animeData.filter(a=>a.isTrending).slice(0,8);
  const popular  = animeData.filter(a=>a.isPopular).slice(0,8);
  const classic  = animeData.filter(a=>a.isClassic).slice(0,8);
  const recent   = animeData.filter(a=>a.isRecentlyAdded).slice(0,8);
  return layout(`${hero()}${genreChips()}
    <div class="home-showcase">
      ${section('ᴛʀᴇɴᴅɪɴɢ ɴᴏᴡ','Top picks from the AniMiko library.',rowCards(trending))}
      ${section('ʟᴀᴛᴇsᴛ ᴇᴘɪsᴏᴅᴇs','Fresh episode updates from ongoing series.',latestList())}
      ${section('ᴘᴏᴘᴜʟᴀʀ ᴀɴɪᴍᴇ','Most watched titles from new and classic shows.',rowCards(popular))}
      ${section('ᴄʟᴀssɪᴄ ᴘɪᴄᴋs','Timeless anime from every era.',rowCards(classic))}
      ${section('ʀᴇᴄᴇɴᴛʟʏ ᴀᴅᴅᴇᴅ','Recently updated titles in the library.',rowCards(recent))}
    </div>${premium()}`,'Home');
}

function filterAnime(){
  const params = new URLSearchParams(location.search);
  let q      = (params.get('q') || '').toLowerCase();
  let genre  = params.get('genre') || '';
  let status = params.get('status') || '';
  let type   = params.get('type') || '';
  let year   = params.get('year') || '';
  let sort   = params.get('sort') || 'Popularity';
  let list = animeData.filter(a =>
    (!q      || a.title.toLowerCase().includes(q) || a.genres.join(' ').toLowerCase().includes(q)) &&
    (!genre  || a.genres.includes(genre)) &&
    (!status || a.status===status) &&
    (!type   || a.type.includes(type)) &&
    (!year   || String(a.releaseYear)===year)
  );
  if(sort==='Rating')    list.sort((a,b)=>b.rating-a.rating);
  if(sort==='Newest')    list.sort((a,b)=>b.releaseYear-a.releaseYear);
  if(sort==='Oldest')    list.sort((a,b)=>a.releaseYear-b.releaseYear);
  if(sort==='Title A-Z') list.sort((a,b)=>a.title.localeCompare(b.title));
  return {list, q, genre, status, type, year, sort};
}
function selectFilter(label, name, values, current){
  return `<div class="filter-select">
    <span>${label}</span>
    <select onchange="updateParam('${name}',this.value)">
      <option value="">Any</option>
      ${values.map(v=>`<option ${current==v?'selected':''}>${v}</option>`).join('')}
    </select>
  </div>`;
}
window.updateParam = (k,v)=>{
  const p = new URLSearchParams(location.search);
  if(v) p.set(k,v); else p.delete(k);
  go('/browse?'+p.toString());
};
function browsePage(){
  const f = filterAnime();
  const genres = [...new Set(animeData.flatMap(a=>a.genres))].slice(0,14);
  const years  = [...new Set(animeData.map(a=>a.releaseYear))].sort((a,b)=>b-a).slice(0,20);
  const filters = `
    ${selectFilter('Genre','genre',genres,f.genre)}
    ${selectFilter('Year','year',years,f.year)}
    ${selectFilter('Type','type',['TV Series','Movie'],f.type)}
    ${selectFilter('Status','status',['Ongoing','Completed'],f.status)}
    ${selectFilter('Sort By','sort',['Popularity','Rating','Newest','Oldest','Title A-Z'],f.sort)}
  `;
  return layout(`<div class="browse-layout">
    <aside class="filters">
      <h1>Browse</h1>
      <p>Discover anime across every genre and era.</p>
      <button onclick="go('/browse')" class="clear">Clear All Filters</button>
      <h3>Genres</h3>
      ${genres.map(g=>`<label>
        <input type="checkbox" ${f.genre===g?'checked':''} onchange="updateParam('genre',this.checked?'${g}':'')">
        <span>${g}</span>
        <span>${36+g.length*8}</span>
      </label>`).join('')}
    </aside>
    <section class="browse-main">
      <div class="big-search">
        <input value="${f.q}" placeholder="Search anime, genres, years..." onkeydown="if(event.key==='Enter')updateParam('q',this.value)">
        <button onclick="updateParam('q',this.previousElementSibling.value)">Search</button>
      </div>
      <div class="filter-row">${filters}<button class="grid-toggle">Grid</button></div>
      <p class="result-count">${f.list.length} result${f.list.length!==1?'s':''} found</p>
      ${f.list.length ? gridCards(f.list) : `<div class="empty" style="min-height:40vh"><h1>No results</h1><p>Try adjusting your filters or search terms.</p></div>`}
      <div class="pagination">
        <button>Prev</button>
        <button class="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>Next</button>
      </div>
      ${premium()}
    </section>
  </div>`,'Browse');
}

function detailsPage(slug){
  const a   = bySlug(slug);
  const eps = episodesFor(a.slug).length ? episodesFor(a.slug) : episodesFor('shadow-ronin');
  return layout(`
    <section class="details-hero" style="--banner:url('${a.bannerUrl}')">
      <div class="detail-poster">${img(a.posterUrl,'poster',a.title)}</div>
      <div class="detail-info">
        <h1>${a.title}</h1>
        <div class="meta">
          <span>${a.rating.toFixed(1)} Rating</span>
          <span>${a.releaseYear}</span>
          <span>${a.ageRating}</span>
          <span>HD</span>
        </div>
        <div class="facts">
          <div><span>Status</span><b>${a.status}</b></div>
          <div><span>Type</span><b>${a.type}</b></div>
          <div><span>Episodes</span><b>${a.totalEpisodes}</b></div>
          <div><span>Studio</span><b>${a.studio}</b></div>
        </div>
        <div class="tag-list">${a.genres.map(g=>`<span>${g}</span>`).join('')}</div>
        <p>${a.description}</p>
        <div class="hero-actions">
          <a data-link class="btn primary" href="/watch/${a.slug}/1">ᴡᴀᴛᴄʜ ɴᴏᴡ</a>
          <button data-watch="${a.slug}" class="btn muted">${isSaved(a.slug)?'ʀᴇᴍᴏᴠᴇ ꜰʀᴏᴍ ʟɪsᴛ':'ᴀᴅᴅ ᴛᴏ ᴡᴀᴛᴄʜʟɪsᴛ'}</button>
          <button class="btn icon">&#8679;</button>
        </div>
      </div>
    </section>
    <div class="tabs">
      <a class="active" onclick="">Overview</a>
      <a onclick="">Episodes</a>
      <a onclick="">Characters</a>
      <a onclick="">More Like This</a>
    </div>
    <div class="detail-grid">
      <section class="episode-panel">
        <div class="panel-head">
          <h2>Episodes <span style="color:var(--muted);font-weight:500;font-size:14px">(${eps.length})</span></h2>
          <select><option>Oldest First</option><option>Newest First</option></select>
        </div>
        ${eps.map(e=>`
          <a data-link class="episode-wide" href="/watch/${a.slug}/${e.episodeNumber}">
            <b>${String(e.episodeNumber).padStart(2,'0')}</b>
            ${img(e.thumbnailUrl,'wide-thumb',e.title)}
            <div>
              <h3>${e.title}</h3>
              <p>${e.description}</p>
            </div>
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
              <span>${r.rating.toFixed(1)} Rating</span>
              <small>${r.releaseYear} &middot; ${r.totalEpisodes} eps</small>
            </div>
          </a>`).join('')}
      </aside>
    </div>`,'');
}

function watchPage(slug, num){
  const a   = bySlug(slug);
  const eps = episodesFor(a.slug).length ? episodesFor(a.slug) : episodesFor('shadow-ronin');
  const n   = Math.max(1, Math.min(Number(num)||1, eps.length));
  const e   = eps[n-1];
  return layout(`
    <section class="watch-layout">
      <div class="watch-main">
        <div class="breadcrumb">
          <a data-link href="/">Home</a> /
          <a data-link href="/anime/${a.slug}">${a.title}</a> /
          Episode ${n}
        </div>
        <div class="watch-title">
          <h1>${a.title} <span>Episode ${n}: ${e.title}</span></h1>
          <div>
            <button data-watch="${a.slug}" class="btn muted">${isSaved(a.slug)?'Saved':'ᴀᴅᴅ ᴛᴏ ʟɪsᴛ'}</button>
            <button class="btn icon">&#8679;</button>
          </div>
        </div>
        <div class="player" style="--watch:url('/assets/watch-bg.jpg')">
          <span>1080p</span>
          <button class="play">&#9654;</button>
          <div class="controls">
            <i></i>
            <b>10:42 / 23:50</b>
            <small>CC</small>
            <small>Settings</small>
            <small>Full</small>
          </div>
        </div>
        <div class="prev-next">
          <a data-link class="btn muted ${n===1?'disabled':''}" href="/watch/${a.slug}/${Math.max(1,n-1)}">Previous Episode</a>
          <a data-link class="btn primary ${n===eps.length?'disabled':''}" href="/watch/${a.slug}/${Math.min(eps.length,n+1)}">Next Episode</a>
        </div>
        <div class="episode-about">
          ${img(a.posterUrl,'about-poster',a.title)}
          <div>
            <h2>Episode ${n}: ${e.title}</h2>
            <p>${e.description}</p>
            <div class="tag-list" style="margin-top:12px">
              ${a.genres.map(g=>`<span>${g}</span>`).join('')}
              <span>${e.releaseDate}</span>
              <span>${e.duration}</span>
            </div>
          </div>
        </div>
        ${section('ʏᴏᴜ ᴍᴀʏ ᴀʟsᴏ ʟɪᴋᴇ','',rowCards(animeData.filter(x=>x.slug!==a.slug).slice(1,7)))}
      </div>
      <aside class="watch-side">
        <h2>Episodes <span>${n} / ${eps.length}</span></h2>
        <div class="side-ep-list">
          ${eps.map(x=>`
            <a data-link href="/watch/${a.slug}/${x.episodeNumber}" class="side-ep ${x.episodeNumber===n?'active':''}">
              ${img(x.thumbnailUrl,'side-thumb',x.title)}
              <div>
                <b>${x.episodeNumber}. ${x.title}</b>
                <span>${x.duration}</span>
              </div>
              <em>${x.episodeNumber<n?'Seen':x.episodeNumber===n?'Now':'Soon'}</em>
            </a>`).join('')}
        </div>
      </aside>
    </section>
    <div class="comments">
      <div><b>Comments (124)</b><b>Report Issue</b></div>
      <input placeholder="Share your thoughts about this episode...">
      <button>Post Comment</button>
    </div>`,'');
}

function authPage(){
  return layout(`
    <section class="auth-page">
      <div class="auth-art" style="--auth:url('/assets/auth-art.jpg')">
        <h1>Your Anime Adventure Starts Here</h1>
        <p>Exclusive simulcasts, hidden gems, and a growing anime community.</p>
        <div class="hero-tags">
          <span>Exclusive Simulcasts</span>
          <span>Hidden Gems</span>
          <span>Join the Community</span>
        </div>
      </div>
      <div class="auth-card">
        <div class="auth-tabs">
          <button class="auth-tab active" data-auth-tab="login">Sign In</button>
          <button class="auth-tab" data-auth-tab="register">Register</button>
        </div>
        <form id="loginForm" class="auth-form active">
          <h2>Welcome Back</h2>
          <label>Email Address<input type="email" placeholder="miko@example.com"></label>
          <label>Password<input type="password" placeholder="Your password"></label>
          <a>Forgot Password?</a>
          <button class="btn primary">Sign In</button>
          <button class="btn muted">Continue with Google</button>
          <button class="btn muted">Continue with Discord</button>
        </form>
        <form id="registerForm" class="auth-form">
          <h2>Create Account</h2>
          <label>Display Name<input placeholder="Your name"></label>
          <label>Email Address<input type="email" placeholder="you@example.com"></label>
          <label>Password<input type="password" placeholder="Create a password"></label>
          <label>Confirm Password<input type="password" placeholder="Repeat your password"></label>
          <button class="btn primary">Create Account</button>
        </form>
      </div>
    </section>`,'');
}

function watchlistPage(){
  let list = getWatchlist();
  if(!list.length) list = animeData.slice(0,5).map(a=>a.slug);
  const items = list.map(bySlug);
  return layout(`
    <section class="profile-head" style="--profile:url('/assets/profile-banner.jpg')">
      <div class="profile-avatar">M</div>
      <div>
        <h1>MikoShadow <span>Premium</span></h1>
        <p>Exploring stories, one episode at a time.</p>
        <div class="profile-stats">
          <b>92<span>Watchlisted</span></b>
          <b>37<span>Completed</span></b>
          <b>14<span>On Hold</span></b>
          <b>256<span>Hours</span></b>
        </div>
      </div>
      <button>Edit Profile</button>
    </section>
    ${section('ᴡᴀᴛᴄʜʟɪsᴛ','Your saved anime series and films.',`
      <div class="watchlist-row">
        ${items.map((a,i)=>`
          <article class="watch-card">
            ${img(a.posterUrl,'watch-poster',a.title)}
            <div>
              <h3>${a.title}</h3>
              <p>${a.genres.join(', ')}</p>
              <span>${a.rating.toFixed(1)} Rating</span>
              <div class="progress"><i style="width:${18+i*10}%"></i></div>
              <small>Episode ${i+1} of ${a.totalEpisodes}</small>
              <div>
                <a data-link class="btn primary" href="/watch/${a.slug}/1">ʀᴇsᴜᴍᴇ</a>
                <button data-watch="${a.slug}" class="btn danger">ʀᴇᴍᴏᴠᴇ</button>
              </div>
            </div>
          </article>`).join('')}
      </div>`,false)}
    <div class="profile-grid">
      ${section('Continue Watching','',latestList(),false)}
      ${section('Recently Viewed','',latestList(),false)}
      <section class="section favorite">
        <div class="section-head"><div><h2>Favorite Genres</h2></div></div>
        ${['Fantasy','Sci-Fi','Adventure','Action','Romance','Drama'].map((g,i)=>`
          <p>
            <span>${g}</span>
            <b style="width:${42-i*5}%"></b>
            <em>${32-i*4}%</em>
          </p>`).join('')}
      </section>
    </div>`,'Watchlist');
}

function adminPage(){
  const navItems = ['Dashboard','Anime','Episodes','Users','Reports','Settings'];
  const stats = [['Total Anime','1,248'],['Total Episodes','18,563'],['Registered Users','156,892'],['Active Today','2,847']];
  return layout(`
    <section class="admin">
      <aside class="admin-side">
        <b>ᴀɴɪᴍɪᴋᴏ Admin</b>
        ${navItems.map((x,i)=>`<a class="${i===0?'active':''}">${x}</a>`).join('')}
        <div class="admin-user">
          <div class="admin-user-ava">A</div>
          <div>
            <b>Administrator</b>
            <span>Full Access</span>
          </div>
        </div>
      </aside>
      <main class="admin-main">
        <div class="admin-top">
          <h1>Dashboard</h1>
          <input placeholder="Search anime, users, episodes...">
        </div>
        <div class="stat-grid">
          ${stats.map(s=>`
            <div class="stat">
              <span>${s[0]}</span>
              <b>${s[1]}</b>
              <small>+28 this month</small>
            </div>`).join('')}
        </div>
        <section class="table-box">
          <div class="panel-head">
            <h2>Anime Management</h2>
            <button class="btn primary" style="height:36px;padding:0 18px;font-size:12px">Add Anime</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Episodes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${animeData.slice(0,10).map((a,i)=>`
                <tr>
                  <td>${i+1}</td>
                  <td>
                    <div class="td-title">
                      ${img(a.posterUrl,'tiny',a.title)}
                      <b>${a.title}<span>${a.genres.join(' / ')}</span></b>
                    </div>
                  </td>
                  <td><mark>${i===5?'Draft':'Published'}</mark></td>
                  <td>${a.type}</td>
                  <td>${a.releaseYear}</td>
                  <td>${a.totalEpisodes}</td>
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
        ${['Title','Alternative Title','Synopsis','Type','Status','Year','Episodes','Rating','Age Rating','Genres','Poster URL','Banner URL'].map(x=>`
          <label>${x}<input placeholder="${x}"></label>`).join('')}
        <button class="btn muted">Cancel</button>
        <button class="btn primary">Save Anime</button>
      </aside>
    </section>`,'');
}

function notFound(){
  return layout(`
    <section class="empty">
      <h1>404</h1>
      <p>This page does not exist or has been moved.</p>
      <a data-link class="btn primary" href="/" style="margin-top:8px">Back to Home</a>
    </section>`,'');
}

function route(){
  document.body.classList.remove('menu-open');
  const path = location.pathname.replace(/\/+$/,'') || '/';
  if(path === '/')                        app.innerHTML = homePage();
  else if(path === '/browse')             app.innerHTML = browsePage();
  else if(path.startsWith('/anime/'))     app.innerHTML = detailsPage(path.split('/')[2]);
  else if(path.startsWith('/watch/'))   { const p=path.split('/'); app.innerHTML = watchPage(p[2], p[3]||1); }
  else if(path === '/auth')               app.innerHTML = authPage();
  else if(path === '/watchlist')          app.innerHTML = watchlistPage();
  else if(path === '/admin')              app.innerHTML = adminPage();
  else                                    app.innerHTML = notFound();
  window.scrollTo(0,0);
}
route();
