import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import {
  copyFile,
  mkdir,
  readFile,
  rename,
  rm,
  rmdir,
  stat,
  writeFile
} from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const adminRoot = dirname(fileURLToPath(import.meta.url));
const root = dirname(adminRoot);
const publicRoot = join(adminRoot, 'public');
const postsPath = join(root, 'content/posts.json');
const backupRoot = join(root, '.admin-backups');
const host = '127.0.0.1';
const port = Number.parseInt(process.env.BLOG_ADMIN_PORT || '4173', 10);
const maxBodySize = 12 * 1024 * 1024;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8'
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  response.end(JSON.stringify(payload));
}

function sendError(response, error, status = 500) {
  console.error(error);
  sendJson(response, status, {
    ok: false,
    error: error instanceof Error ? error.message : String(error)
  });
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodySize) throw new Error('请求内容超过 12 MB 限制。');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('请求数据不是有效的 JSON。');
  }
}

async function run(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, ...options.env },
      shell: false
    });
    const stdout = [];
    const stderr = [];
    child.stdout.on('data', (chunk) => stdout.push(chunk));
    child.stderr.on('data', (chunk) => stderr.push(chunk));
    child.on('error', rejectRun);
    child.on('close', (code) => {
      const result = {
        code,
        stdout: Buffer.concat(stdout).toString('utf8').trim(),
        stderr: Buffer.concat(stderr).toString('utf8').trim()
      };
      if (code === 0 || options.allowExitCodes?.includes(code)) {
        resolveRun(result);
        return;
      }
      rejectRun(new Error(result.stderr || result.stdout || `${command} 执行失败（${code}）。`));
    });
  });
}

async function loadPosts() {
  return JSON.parse(await readFile(postsPath, 'utf8'));
}

async function backupFile(file, group = 'data') {
  try {
    await stat(file);
  } catch {
    return;
  }
  const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
  const folder = join(backupRoot, group);
  await mkdir(folder, { recursive: true });
  await copyFile(file, join(folder, `${timestamp}-${file.split(sep).at(-1)}`));
}

async function writePosts(posts) {
  await backupFile(postsPath);
  const temporaryPath = `${postsPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(posts, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, postsPath);
}

function ensureInsideRoot(relativePath) {
  const absolutePath = resolve(root, relativePath);
  const relation = relative(root, absolutePath);
  if (!relation || relation.startsWith('..') || relation.includes(`..${sep}`)) {
    throw new Error('内容文件路径不安全。');
  }
  return absolutePath;
}

function postTime(post, field = 'datetime') {
  return post[field]?.slice(11, 16) || '20:00';
}

function metadata(post) {
  const { contentHtml, ...rest } = post;
  return {
    ...rest,
    time: postTime(post),
    updatedTime: postTime(post, 'updatedDatetime')
  };
}

async function postWithContent(post) {
  const content = post.contentFormat === 'markdown'
    ? await readFile(ensureInsideRoot(post.contentFile), 'utf8')
    : post.contentHtml || '';
  return { ...metadata(post), content };
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function normalizeTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value || '') ? value : '20:00';
}

function normalizeSlug(value) {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) throw new Error('文章地址标识不能为空，建议使用英文或数字。');
  return slug;
}

function normalizeTags(value) {
  const values = Array.isArray(value) ? value : String(value || '').split(/[,，]/);
  return [...new Set(values.map((tag) => String(tag).trim()).filter(Boolean))];
}

function routeFor(date, slug) {
  const [year, month, day] = date.split('-');
  return `/${year}/${month}/${day}/${slug}/`;
}

function contentPathFor(date, slug) {
  return `content/posts/${date}-${slug}.md`;
}

async function generateSite() {
  const result = await run('node', ['tools/render-site.mjs']);
  await run('node', ['--check', 'tools/render-site.mjs']);
  await run('node', ['--check', 'js/redesign.js']);
  return result.stdout;
}

async function removeGeneratedRoute(url) {
  if (!/^\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+\/$/.test(url || '')) return;
  const directory = resolve(root, url.slice(1));
  if (!relative(root, directory).startsWith('..')) {
    await rm(directory, { recursive: true, force: true });
  }
}

async function cleanupDateDirectories(date, posts) {
  if (!validDate(date)) return;
  const [year, month, day] = date.split('-');
  const hasMonthPosts = posts.some((post) => post.date.startsWith(`${year}-${month}-`));
  const hasYearPosts = posts.some((post) => post.date.startsWith(`${year}-`));
  if (!hasMonthPosts) await rm(join(root, 'archives', year, month), { recursive: true, force: true });
  if (!hasYearPosts) await rm(join(root, 'archives', year), { recursive: true, force: true });
  for (const directory of [
    join(root, year, month, day),
    join(root, year, month),
    join(root, year)
  ]) {
    try {
      await rmdir(directory);
    } catch {
      // A non-empty parent still contains another article.
    }
  }
}

async function savePost(input) {
  const posts = await loadPosts();
  const originalUrl = input.originalUrl || '';
  const existingIndex = originalUrl ? posts.findIndex((post) => post.url === originalUrl) : -1;
  const existing = existingIndex >= 0 ? posts[existingIndex] : null;
  const title = String(input.title || '').trim();
  const date = String(input.date || '').trim();
  if (!title) throw new Error('标题不能为空。');
  if (!validDate(date)) throw new Error('发布日期无效。');

  const slug = normalizeSlug(input.slug);
  const url = routeFor(date, slug);
  if (posts.some((post, index) => post.url === url && index !== existingIndex)) {
    throw new Error('这个文章地址已经存在，请修改日期或地址标识。');
  }

  const contentFormat = existing?.contentFormat || (input.contentFormat === 'html' ? 'html' : 'markdown');
  const time = normalizeTime(input.time);
  const updated = validDate(input.updated) ? input.updated : date;
  const updatedTime = normalizeTime(input.updatedTime || time);
  const nextPost = {
    title,
    url,
    date,
    datetime: `${date}T${time}:00+08:00`,
    updated,
    updatedDatetime: `${updated}T${updatedTime}:00+08:00`,
    summary: String(input.summary || '').trim(),
    tags: normalizeTags(input.tags),
    minutes: Math.max(1, Number.parseInt(input.minutes, 10) || 1),
    contentFormat
  };

  if (contentFormat === 'markdown') {
    nextPost.contentFile = existing?.contentFile || contentPathFor(date, slug);
    const contentFile = ensureInsideRoot(nextPost.contentFile);
    await mkdir(dirname(contentFile), { recursive: true });
    await backupFile(contentFile, 'content');
    await writeFile(contentFile, String(input.content || ''), 'utf8');
  } else {
    nextPost.contentHtml = String(input.content || '');
  }

  if (existingIndex >= 0) posts[existingIndex] = nextPost;
  else posts.push(nextPost);
  await writePosts(posts);
  const generated = await generateSite();
  if (existing?.url && existing.url !== url) {
    await removeGeneratedRoute(existing.url);
    await cleanupDateDirectories(existing.date, posts);
  }
  return { post: await postWithContent(nextPost), generated };
}

async function deletePost(url) {
  const posts = await loadPosts();
  const index = posts.findIndex((post) => post.url === url);
  if (index < 0) throw new Error('没有找到要删除的文章。');
  const [removed] = posts.splice(index, 1);
  await writePosts(posts);
  const generated = await generateSite();
  await removeGeneratedRoute(removed.url);
  await cleanupDateDirectories(removed.date, posts);
  return { removed: metadata(removed), generated };
}

async function repositoryStatus() {
  const [status, latest] = await Promise.all([
    run('git', ['status', '--short', '--branch']),
    run('git', ['log', '-1', '--pretty=format:%h|%s|%ci'])
  ]);
  const lines = status.stdout.split('\n').filter(Boolean);
  return {
    branch: lines[0]?.replace(/^##\s*/, '') || 'unknown',
    changedFiles: Math.max(0, lines.length - 1),
    clean: lines.length <= 1,
    latest: latest.stdout
  };
}

async function publish(message) {
  const generated = await generateSite();
  await run('git', ['add', '-A']);
  const staged = await run('git', ['diff', '--cached', '--quiet'], { allowExitCodes: [1] });
  let commit = '没有需要提交的更改。';
  if (staged.code === 1) {
    const commitResult = await run('git', ['commit', '-m', String(message || '').trim() || 'Update blog posts']);
    commit = commitResult.stdout;
  }
  const push = await run(
    'git',
    ['push', 'git@github.com:yinghanpeng/yinghanpeng.github.io.git', 'master'],
    { env: { GIT_SSH_COMMAND: 'ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new' } }
  );
  return { generated, commit, push: push.stdout || push.stderr };
}

async function serveFile(response, base, requestPath) {
  const requested = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  let filePath = resolve(base, requested);
  const relation = relative(base, filePath);
  if (relation.startsWith('..') || relation.includes(`..${sep}`)) {
    sendJson(response, 403, { ok: false, error: '禁止访问。' });
    return;
  }
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = join(filePath, 'index.html');
    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);
  try {
    if (url.pathname === '/api/posts' && request.method === 'GET') {
      const posts = (await loadPosts())
        .map(metadata)
        .sort((a, b) => b.datetime.localeCompare(a.datetime));
      sendJson(response, 200, { ok: true, posts });
      return;
    }
    if (url.pathname === '/api/post' && request.method === 'GET') {
      const post = (await loadPosts()).find((item) => item.url === url.searchParams.get('url'));
      if (!post) {
        sendJson(response, 404, { ok: false, error: '文章不存在。' });
        return;
      }
      sendJson(response, 200, { ok: true, post: await postWithContent(post) });
      return;
    }
    if (url.pathname === '/api/post' && request.method === 'POST') {
      sendJson(response, 200, { ok: true, ...(await savePost(await readJsonBody(request))) });
      return;
    }
    if (url.pathname === '/api/post' && request.method === 'DELETE') {
      const body = await readJsonBody(request);
      sendJson(response, 200, { ok: true, ...(await deletePost(body.url)) });
      return;
    }
    if (url.pathname === '/api/generate' && request.method === 'POST') {
      sendJson(response, 200, { ok: true, output: await generateSite() });
      return;
    }
    if (url.pathname === '/api/publish' && request.method === 'POST') {
      const body = await readJsonBody(request);
      sendJson(response, 200, { ok: true, ...(await publish(body.message)) });
      return;
    }
    if (url.pathname === '/api/status' && request.method === 'GET') {
      sendJson(response, 200, { ok: true, status: await repositoryStatus() });
      return;
    }
    if (url.pathname.startsWith('/admin-assets/')) {
      await serveFile(response, publicRoot, url.pathname.replace('/admin-assets/', '/'));
      return;
    }
    if (url.pathname === '/' || url.pathname === '/admin' || url.pathname === '/admin/') {
      await serveFile(response, publicRoot, '/index.html');
      return;
    }
    await serveFile(response, root, url.pathname);
  } catch (error) {
    sendError(response, error, error.message?.includes('不存在') ? 404 : 400);
  }
});

server.listen(port, host, () => {
  console.log(`Blog Admin running at http://${host}:${port}`);
});
