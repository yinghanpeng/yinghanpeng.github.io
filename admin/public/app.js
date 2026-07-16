const elements = Object.fromEntries(
  [...document.querySelectorAll('[id]')].map((element) => [element.id, element])
);

const state = {
  posts: [],
  active: null,
  dirty: false,
  hydrating: false,
  toastTimer: null
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({ ok: false, error: '服务返回了无法解析的数据。' }));
  if (!response.ok || !payload.ok) throw new Error(payload.error || `请求失败（${response.status}）。`);
  return payload;
}

function showBusy(message) {
  elements['busy-message'].textContent = message;
  elements['busy-layer'].classList.add('is-open');
  elements['busy-layer'].setAttribute('aria-hidden', 'false');
}

function hideBusy() {
  elements['busy-layer'].classList.remove('is-open');
  elements['busy-layer'].setAttribute('aria-hidden', 'true');
}

function showToast(message, error = false) {
  window.clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.toggle('is-error', error);
  elements.toast.classList.add('is-open');
  state.toastTimer = window.setTimeout(() => elements.toast.classList.remove('is-open'), 3200);
}

function today() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function slugFromUrl(url) {
  return String(url || '').split('/').filter(Boolean).at(-1) || '';
}

function setDirty(dirty) {
  state.dirty = dirty;
  elements['save-state'].textContent = dirty ? '有未保存更改' : '已保存';
  elements['save-state'].classList.toggle('is-dirty', dirty);
  elements['preview-button'].disabled = dirty || !state.active?.url;
}

function updateContentStats() {
  const content = elements['content-input'].value;
  const lines = content ? content.split('\n').length : 0;
  elements['content-stats'].textContent = `${content.length.toLocaleString()} 字符 · ${lines.toLocaleString()} 行`;
}

function updateUrlPreview() {
  const date = elements['date-input'].value || 'YYYY-MM-DD';
  const [year = 'YYYY', month = 'MM', day = 'DD'] = date.split('-');
  const slug = elements['slug-input'].value.trim() || 'slug';
  elements['url-preview'].textContent = `/${year}/${month}/${day}/${slug}/`;
}

function renderPosts() {
  const query = elements['post-search'].value.trim().toLowerCase();
  const filtered = state.posts.filter((post) => {
    const haystack = [post.title, post.date, post.summary, ...(post.tags || [])].join(' ').toLowerCase();
    return !query || haystack.includes(query);
  });
  elements['post-count'].textContent = `${state.posts.length}`;
  elements['welcome-panel'].querySelector('.welcome-index').textContent = state.posts.length;
  elements['post-list'].innerHTML = filtered.length
    ? filtered.map((post) => `
        <button class="post-item ${state.active?.url === post.url ? 'is-active' : ''}" type="button" data-url="${escapeHtml(post.url)}">
          <strong>${escapeHtml(post.title)}</strong>
          <span class="post-item-meta">
            <i class="format-dot ${post.contentFormat === 'markdown' ? 'markdown' : ''}"></i>
            <span>${escapeHtml(post.date)}</span>
            <span>${post.contentFormat === 'markdown' ? 'MD' : 'HTML'}</span>
          </span>
        </button>
      `).join('')
    : '<p class="empty-list">没有匹配的文章。</p>';
}

async function loadStatus() {
  try {
    const { status } = await api('/api/status');
    const latest = status.latest.split('|');
    elements['repo-status'].textContent = status.clean
      ? `${status.branch} · ${latest[0] || '无提交'}`
      : `${status.changedFiles} 个文件待发布 · ${latest[0] || status.branch}`;
    elements['repo-status'].classList.toggle('is-dirty', !status.clean);
    elements['publish-summary'].textContent = `${status.branch}\n${status.changedFiles} 个文件待发布\n最近提交：${latest[0] || '-'} ${latest[1] || ''}`;
  } catch (error) {
    elements['repo-status'].textContent = '仓库状态读取失败';
    elements['repo-status'].classList.add('is-dirty');
  }
}

async function loadPosts(preserveUrl = state.active?.url) {
  const payload = await api('/api/posts');
  state.posts = payload.posts;
  renderPosts();
  if (preserveUrl && state.posts.some((post) => post.url === preserveUrl)) {
    renderPosts();
  }
}

function populateEditor(post) {
  state.hydrating = true;
  state.active = post;
  elements['welcome-panel'].classList.add('is-hidden');
  elements['editor-form'].classList.remove('is-hidden');
  elements['title-input'].value = post.title || '';
  elements['content-input'].value = post.content || '';
  elements['date-input'].value = post.date || today();
  elements['time-input'].value = post.time || '20:00';
  elements['updated-input'].value = post.updated || post.date || today();
  elements['updated-time-input'].value = post.updatedTime || post.time || '20:00';
  elements['slug-input'].value = slugFromUrl(post.url) || post.slug || '';
  elements['summary-input'].value = post.summary || '';
  elements['tags-input'].value = (post.tags || []).join(', ');
  elements['minutes-input'].value = post.minutes || 1;
  elements['editor-mode'].textContent = post.contentFormat === 'html' ? 'HTML' : 'MARKDOWN';
  elements['source-path'].textContent = post.contentFile || '内嵌 HTML';
  elements['delete-button'].disabled = !post.url;
  updateContentStats();
  updateUrlPreview();
  setDirty(false);
  renderPosts();
  state.hydrating = false;
}

async function selectPost(url) {
  if (state.dirty && !window.confirm('当前文章有未保存更改，确定放弃吗？')) return;
  showBusy('正在加载文章');
  try {
    const { post } = await api(`/api/post?url=${encodeURIComponent(url)}`);
    populateEditor(post);
  } catch (error) {
    showToast(error.message, true);
  } finally {
    hideBusy();
  }
}

function newPost() {
  if (state.dirty && !window.confirm('当前文章有未保存更改，确定放弃吗？')) return;
  const timestamp = new Date();
  const suffix = `${String(timestamp.getHours()).padStart(2, '0')}${String(timestamp.getMinutes()).padStart(2, '0')}`;
  populateEditor({
    title: '未命名文章',
    url: '',
    date: today(),
    time: '20:00',
    updated: today(),
    updatedTime: '20:00',
    summary: '',
    tags: [],
    minutes: 3,
    contentFormat: 'markdown',
    contentFile: '',
    content: '# 未命名文章\n\n'
  });
  elements['slug-input'].value = `new-post-${today().replaceAll('-', '')}-${suffix}`;
  updateUrlPreview();
  setDirty(true);
  elements['title-input'].focus();
  elements['title-input'].select();
}

function formPayload() {
  return {
    originalUrl: state.active?.url || '',
    title: elements['title-input'].value,
    content: elements['content-input'].value,
    contentFormat: state.active?.contentFormat || 'markdown',
    date: elements['date-input'].value,
    time: elements['time-input'].value,
    updated: elements['updated-input'].value,
    updatedTime: elements['updated-time-input'].value,
    slug: elements['slug-input'].value,
    summary: elements['summary-input'].value,
    tags: elements['tags-input'].value,
    minutes: elements['minutes-input'].value
  };
}

async function savePost() {
  if (!elements['editor-form'].reportValidity()) return null;
  showBusy('正在保存并生成站点');
  try {
    const payload = await api('/api/post', {
      method: 'POST',
      body: JSON.stringify(formPayload())
    });
    populateEditor(payload.post);
    await Promise.all([loadPosts(payload.post.url), loadStatus()]);
    showToast('文章已保存，首页、归档和搜索已同步。');
    return payload.post;
  } catch (error) {
    showToast(error.message, true);
    return null;
  } finally {
    hideBusy();
  }
}

function openPreview() {
  if (!state.active?.url) return;
  if (state.dirty) {
    showToast('请先保存文章再预览。', true);
    return;
  }
  elements['preview-title'].textContent = state.active.title;
  elements['preview-frame'].src = `${state.active.url}?preview=${Date.now()}`;
  elements['preview-drawer'].classList.add('is-open');
  elements['preview-drawer'].setAttribute('aria-hidden', 'false');
  elements['preview-scrim'].classList.add('is-open');
}

function closePreview() {
  elements['preview-drawer'].classList.remove('is-open');
  elements['preview-drawer'].setAttribute('aria-hidden', 'true');
  elements['preview-scrim'].classList.remove('is-open');
  window.setTimeout(() => {
    if (!elements['preview-drawer'].classList.contains('is-open')) elements['preview-frame'].src = 'about:blank';
  }, 200);
}

async function confirmDelete() {
  if (!state.active?.url) return;
  elements['delete-dialog'].close();
  showBusy('正在删除并重新生成站点');
  try {
    await api('/api/post', {
      method: 'DELETE',
      body: JSON.stringify({ url: state.active.url })
    });
    state.active = null;
    state.dirty = false;
    elements['editor-form'].classList.add('is-hidden');
    elements['welcome-panel'].classList.remove('is-hidden');
    await Promise.all([loadPosts(''), loadStatus()]);
    showToast('文章已删除，原始 Markdown 文件仍保留。');
  } catch (error) {
    showToast(error.message, true);
  } finally {
    hideBusy();
  }
}

async function generateSite() {
  showBusy('正在重新生成站点');
  try {
    await api('/api/generate', { method: 'POST', body: '{}' });
    await loadStatus();
    showToast('站点生成完成。');
  } catch (error) {
    showToast(error.message, true);
  } finally {
    hideBusy();
  }
}

async function publishSite() {
  elements['publish-dialog'].close();
  showBusy('正在生成、提交并推送');
  try {
    const result = await api('/api/publish', {
      method: 'POST',
      body: JSON.stringify({ message: elements['commit-message-input'].value })
    });
    await loadStatus();
    showToast(result.push || '发布完成。');
  } catch (error) {
    showToast(error.message, true);
  } finally {
    hideBusy();
  }
}

elements['post-list'].addEventListener('click', (event) => {
  const item = event.target.closest('[data-url]');
  if (item) selectPost(item.dataset.url);
});

elements['post-search'].addEventListener('input', renderPosts);
elements['new-post-button'].addEventListener('click', newPost);
elements['refresh-button'].addEventListener('click', async () => {
  showBusy('正在刷新');
  try {
    await Promise.all([loadPosts(), loadStatus()]);
    showToast('数据已刷新。');
  } catch (error) {
    showToast(error.message, true);
  } finally {
    hideBusy();
  }
});

elements['editor-form'].addEventListener('input', (event) => {
  if (state.hydrating) return;
  setDirty(true);
  if (event.target === elements['content-input']) updateContentStats();
  if (event.target === elements['date-input'] || event.target === elements['slug-input']) updateUrlPreview();
});

elements['editor-form'].addEventListener('submit', (event) => {
  event.preventDefault();
  savePost();
});

elements['preview-button'].addEventListener('click', openPreview);
elements['close-preview-button'].addEventListener('click', closePreview);
elements['preview-scrim'].addEventListener('click', closePreview);
elements['delete-button'].addEventListener('click', () => {
  elements['delete-message'].textContent = `“${state.active?.title || ''}”将从博客、归档和搜索中移除。`;
  elements['delete-dialog'].showModal();
});
elements['confirm-delete-button'].addEventListener('click', (event) => {
  event.preventDefault();
  confirmDelete();
});
elements['generate-button'].addEventListener('click', generateSite);
elements['publish-button'].addEventListener('click', async () => {
  await loadStatus();
  elements['publish-dialog'].showModal();
});
elements['confirm-publish-button'].addEventListener('click', (event) => {
  event.preventDefault();
  publishSite();
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    if (state.active) savePost();
  }
  if (event.key === 'Escape') closePreview();
});

window.addEventListener('beforeunload', (event) => {
  if (!state.dirty) return;
  event.preventDefault();
  event.returnValue = '';
});

async function init() {
  showBusy('正在加载管理台');
  try {
    await Promise.all([loadPosts(''), loadStatus()]);
    if (state.posts[0]) await selectPost(state.posts[0].url);
  } catch (error) {
    showToast(error.message, true);
  } finally {
    hideBusy();
  }
}

init();
