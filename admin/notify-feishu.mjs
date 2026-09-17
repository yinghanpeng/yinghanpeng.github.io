// 飞书机器人通知（共享模块）
// 使用方式（两种）：
//   1) 作为模块导入：import { notifyFeishu } from './notify-feishu.mjs';
//   2) 作为脚本执行：node notify-feishu.mjs "要发送的文本"
//
// 依赖环境变量 FEISHU_WEBHOOK_URL，未设置时返回 { skipped: true }，不影响调用方流程。

import { request as httpsRequest } from 'node:https';

export function notifyFeishu(payload) {
  const url = process.env.FEISHU_WEBHOOK_URL;
  if (!url) return Promise.resolve({ skipped: true });
  return new Promise((resolve) => {
    const data = JSON.stringify({ msg_type: 'text', content: { text: String(payload || '') } });
    const options = new URL(url);
    const req = httpsRequest({
      hostname: options.hostname,
      path: options.pathname + options.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      res.resume();
      resolve({ ok: res.statusCode === 200, statusCode: res.statusCode });
    });
    req.on('error', (err) => resolve({ ok: false, error: err.message }));
    req.write(data);
    req.end();
  });
}

// 支持直接以脚本方式运行：node notify-feishu.mjs "消息内容"
if (process.argv[1]?.endsWith('notify-feishu.mjs')) {
  const message = process.argv[2] || '博客通知测试';
  const result = await notifyFeishu(message);
  if (result.skipped) {
    console.error('未设置 FEISHU_WEBHOOK_URL，跳过通知。');
    process.exitCode = 1;
  } else if (result.ok) {
    console.log('飞书通知已发送。');
  } else {
    console.error(`飞书通知失败：HTTP ${result.statusCode ?? result.error}`);
    process.exitCode = 1;
  }
}