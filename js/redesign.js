(function () {
  const data = window.BLOG_DATA || { site: {}, posts: [] };
  const site = data.site;
  const posts = [...data.posts].sort((a, b) => b.date.localeCompare(a.date));
  const root = document.documentElement;
  const app = document.getElementById('app');
  const progress = document.getElementById('reading-progress');
  const route = document.body.dataset.route || 'home';
  const postUrl = document.body.dataset.postUrl || '';
  const archiveYear = document.body.dataset.archiveYear || '';
  const archiveMonth = document.body.dataset.archiveMonth || '';

  const state = {
    searchOpen: false,
    query: ''
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatMonth(month) {
    return `${month} 月`;
  }

  function unique(values) {
    return [...new Set(values)];
  }

  function yearOf(post) {
    return post.date.slice(0, 4);
  }

  function monthOf(post) {
    return post.date.slice(5, 7);
  }

  function activePost() {
    return posts.find((post) => post.url === postUrl) || posts[0];
  }

  function archivePosts() {
    return posts.filter((post) => {
      if (archiveYear && yearOf(post) !== archiveYear) return false;
      if (archiveMonth && monthOf(post) !== archiveMonth) return false;
      return true;
    });
  }

  function archiveTitle(count) {
    if (archiveYear && archiveMonth) {
      return `${archiveYear} 年 ${formatMonth(archiveMonth)}归档`;
    }
    if (archiveYear) {
      return `${archiveYear} 年归档`;
    }
    return '全部归档';
  }

  function archiveDescription(count) {
    if (archiveYear && archiveMonth) {
      return `${archiveYear} 年 ${formatMonth(archiveMonth)}共有 ${count} 篇文章。`;
    }
    if (archiveYear) {
      return `${archiveYear} 年共有 ${count} 篇文章。`;
    }
    return `目前共计 ${posts.length} 篇文章。`;
  }

  function allTags() {
    return unique(posts.flatMap((post) => post.tags));
  }

  function activeNav(name) {
    if (name === 'home') return route === 'home';
    if (name === 'archives') return route === 'archive';
    if (name === 'post') return route === 'post';
    return false;
  }

  function renderTags(tags) {
    return `
      <ul class="pill-list">
        ${tags.map((tag) => `<li><span class="pill">${escapeHtml(tag)}</span></li>`).join('')}
      </ul>
    `;
  }

  function renderPostCard(post, heading = 'h2') {
    return `
      <article class="post-card">
        <div class="post-date">${escapeHtml(post.date)}</div>
        <${heading}><a href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a></${heading}>
        <p>${escapeHtml(post.summary)}</p>
        <div class="post-card-foot">
          <div class="meta-line">
            <span>${escapeHtml(String(post.minutes))} 分钟阅读</span>
            <span>更新于 ${escapeHtml(post.updated)}</span>
          </div>
          ${renderTags(post.tags)}
        </div>
      </article>
    `;
  }

  function renderHome() {
    return `
      <section aria-labelledby="home-title">
        <div class="section-head">
          <div>
            <h1 id="home-title">最新文章</h1>
            <p>少一点装饰，多一点可读性。这里显示全部 ${posts.length} 篇文章，并与归档数据保持一致。</p>
          </div>
          <div class="inline-actions">
            <a class="button" href="/archives/">查看归档</a>
            <button class="button primary" type="button" data-action="open-search">搜索文章</button>
          </div>
        </div>

        <div class="post-list">
          ${posts.map((post) => renderPostCard(post)).join('')}
        </div>
      </section>
    `;
  }

  function renderArticle() {
    const post = activePost();
    return `
      <article class="article">
        <header class="article-header">
          <div class="meta-line">
            <time class="post-date" datetime="${escapeHtml(post.datetime)}">${escapeHtml(post.date)}</time>
            <span>更新于 ${escapeHtml(post.updated)}</span>
            <span>${escapeHtml(String(post.minutes))} 分钟阅读</span>
          </div>
          <h1>${escapeHtml(post.title)}</h1>
          <p class="site-desc">${escapeHtml(post.summary)}</p>
          <div class="inline-actions" style="margin-top:18px">
            <a class="button primary" href="/">返回首页</a>
            <button class="button" type="button" data-action="copy-link">复制链接</button>
          </div>
        </header>

        <div class="article-body">
          ${post.contentHtml}
        </div>

        <footer class="article-footer">
          ${renderTags(post.tags)}
          <a class="plain-action" href="/archives/">查看全部归档</a>
        </footer>
      </article>
    `;
  }

  function groupByYear(list) {
    return list.reduce((groups, post) => {
      const year = yearOf(post);
      groups[year] = groups[year] || [];
      groups[year].push(post);
      return groups;
    }, {});
  }

  function renderArchive() {
    const filtered = archivePosts();
    const groups = groupByYear(filtered);
    const years = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return `
      <section aria-labelledby="archive-title">
        <div class="section-head">
          <div>
            <h1 id="archive-title">${escapeHtml(archiveTitle(filtered.length))}</h1>
            <p>${escapeHtml(archiveDescription(filtered.length))}</p>
          </div>
          <div class="inline-actions">
            ${archiveYear ? '<a class="button" href="/archives/">全部归档</a>' : ''}
            <button class="button primary" type="button" data-action="open-search">搜索文章</button>
          </div>
        </div>

        ${filtered.length ? `
          <div class="archive-list">
            ${years.map((year) => `
              <section class="year-block">
                <strong>${escapeHtml(year)}</strong>
                <div class="archive-items">
                  ${groups[year].map((post) => `
                    <article class="archive-item">
                      <time datetime="${escapeHtml(post.datetime)}">${escapeHtml(post.date.slice(5))}</time>
                      <a href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a>
                      <span class="pill">${escapeHtml(post.tags[0] || '文章')}</span>
                    </article>
                  `).join('')}
                </div>
              </section>
            `).join('')}
          </div>
        ` : '<div class="empty-state">这个时间段还没有文章。</div>'}
      </section>
    `;
  }

  function currentMainContent() {
    if (route === 'post') return renderArticle();
    if (route === 'archive') return renderArchive();
    return renderHome();
  }

  function renderToc() {
    if (route !== 'post') {
      const latest = posts.slice(0, 4);
      return `
        <section class="utility-section">
          <h2 class="utility-title">最近文章</h2>
          <ol class="toc-list">
            ${latest.map((post) => `<li><a href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a></li>`).join('')}
          </ol>
        </section>
      `;
    }

    const post = activePost();
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.contentHtml, 'text/html');
    const headings = [...doc.querySelectorAll('h2[id]')].map((heading) => ({
      id: heading.id,
      text: heading.textContent.trim()
    }));

    if (!headings.length) {
      return `
        <section class="utility-section">
          <h2 class="utility-title">文章目录</h2>
          <p class="site-desc">这篇文章暂时没有二级标题。</p>
        </section>
      `;
    }

    return `
      <section class="utility-section">
        <h2 class="utility-title">文章目录</h2>
        <ol class="toc-list">
          ${headings.map((heading) => `<li><a href="#${escapeHtml(heading.id)}">${escapeHtml(heading.text)}</a></li>`).join('')}
        </ol>
      </section>
    `;
  }

  function renderUtilityPanel() {
    return `
      ${renderToc()}

      <section class="utility-section">
        <h2 class="utility-title">标签</h2>
        ${renderTags(allTags())}
      </section>

      <section class="utility-section">
        <h2 class="utility-title">站点状态</h2>
        <p class="site-desc">${posts.length} 篇文章，${unique(posts.map(yearOf)).length} 个年份，${allTags().length} 个标签。</p>
      </section>
    `;
  }

  function renderSearchResults(query) {
    const normalized = query.trim().toLowerCase();
    const matches = posts.filter((post) => {
      const haystack = [post.title, post.summary, post.date, post.updated, ...post.tags].join(' ').toLowerCase();
      return haystack.includes(normalized);
    });

    if (!matches.length) {
      return '<p class="site-desc">没有找到匹配的文章。</p>';
    }

    return matches.map((post) => `
      <article class="search-result">
        <h3><a href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a></h3>
        <p>${escapeHtml(post.summary)}</p>
        <div class="meta-line">
          <span>${escapeHtml(post.date)}</span>
          <span>${escapeHtml(String(post.minutes))} 分钟阅读</span>
        </div>
      </article>
    `).join('');
  }

  function shell() {
    const years = unique(posts.map(yearOf));
    return `
      <div class="site-layout">
        <aside class="brand-panel">
          <div class="brand-row">
            <img class="avatar" src="/images/image.jpg" alt="${escapeHtml(site.author)}">
            <div>
              <p class="site-name">${escapeHtml(site.name)}</p>
              <p class="site-desc">${escapeHtml(site.description)}</p>
            </div>
          </div>

          <nav class="site-nav" aria-label="主导航">
            <a class="nav-link" href="/" ${activeNav('home') ? 'aria-current="page"' : ''}>首页 <span class="nav-kbd">${posts.length}</span></a>
            <a class="nav-link" href="/archives/" ${activeNav('archives') ? 'aria-current="page"' : ''}>归档 <span class="nav-kbd">${years.length}</span></a>
            <button class="nav-link" type="button" data-action="open-search">搜索 <span class="nav-kbd">/</span></button>
          </nav>

          <div class="stat-row">
            <div class="stat"><strong>${posts.length}</strong><span>文章</span></div>
            <div class="stat"><strong>${years.length}</strong><span>年份</span></div>
            <div class="stat"><strong>${allTags().length}</strong><span>标签</span></div>
          </div>

          <div class="side-actions">
            <button class="button" type="button" data-action="toggle-theme">切换浅色</button>
            <a class="button" href="https://github.com/yinghanpeng/yinghanpeng.github.io" target="_blank" rel="noopener">GitHub</a>
          </div>
        </aside>

        <main class="content-panel" id="main-content">
          ${currentMainContent()}
          <footer class="site-footer">© 2026 ${escapeHtml(site.author)}. Powered by GitHub Pages.</footer>
        </main>

        <aside class="utility-panel">
          ${renderUtilityPanel()}
        </aside>
      </div>

      <section class="search-panel" id="search-panel" aria-hidden="true">
        <div class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
          <div class="search-head">
            <input class="search-box" id="search-box" type="search" placeholder="搜索文章、标签或关键词" autocomplete="off">
            <button class="button" type="button" data-action="close-search">关闭</button>
          </div>
          <div class="search-results" id="search-results" aria-live="polite">
            ${renderSearchResults('')}
          </div>
        </div>
      </section>

      <button class="back-top" type="button" data-action="back-top" aria-label="回到顶部">↑</button>
    `;
  }

  function applyTheme(theme) {
    const mode = theme === 'light' ? 'light' : 'dark';
    root.classList.toggle('theme-light', mode === 'light');
    root.classList.toggle('theme-dark', mode === 'dark');
    const themeButton = document.querySelector('[data-action="toggle-theme"]');
    if (themeButton) {
      themeButton.textContent = mode === 'dark' ? '切换浅色' : '切换深色';
    }
    try {
      localStorage.setItem('blog-theme', mode);
    } catch {
      // Keep rendering even when storage is disabled.
    }
  }

  function openSearch() {
    state.searchOpen = true;
    const panel = document.getElementById('search-panel');
    const input = document.getElementById('search-box');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => input.focus(), 30);
  }

  function closeSearch() {
    state.searchOpen = false;
    const panel = document.getElementById('search-panel');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
  }

  function copyCurrentLink(button) {
    const url = window.location.href;
    const done = () => {
      const original = button.textContent;
      button.textContent = '已复制';
      window.setTimeout(() => {
        button.textContent = original;
      }, 1200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(done);
    } else {
      done();
    }
  }

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : '0';
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const actionElement = event.target.closest('[data-action]');
      if (!actionElement) return;

      const action = actionElement.dataset.action;
      if (action === 'open-search') {
        event.preventDefault();
        openSearch();
      }
      if (action === 'close-search') {
        closeSearch();
      }
      if (action === 'toggle-theme') {
        const next = root.classList.contains('theme-dark') ? 'light' : 'dark';
        applyTheme(next);
      }
      if (action === 'copy-link') {
        copyCurrentLink(actionElement);
      }
      if (action === 'back-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && state.searchOpen) {
        closeSearch();
      }
      if (event.key === '/' && !state.searchOpen && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        openSearch();
      }
    });

    document.addEventListener('input', (event) => {
      if (event.target.id !== 'search-box') return;
      state.query = event.target.value;
      document.getElementById('search-results').innerHTML = renderSearchResults(state.query);
    });

    document.getElementById('search-panel').addEventListener('click', (event) => {
      if (event.target.id === 'search-panel') {
        closeSearch();
      }
    });

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  function boot() {
    let preferredTheme = 'dark';
    try {
      preferredTheme = localStorage.getItem('blog-theme') || 'dark';
    } catch {
      preferredTheme = 'dark';
    }
    applyTheme(preferredTheme);
    app.innerHTML = shell();
    applyTheme(preferredTheme);
    bindEvents();
    updateProgress();
  }

  boot();
})();
