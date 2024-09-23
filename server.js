// server.js
import { serve } from 'bun';

const PORT = 3000;

function getContentType(filePath) {
  // 根据文件扩展名设置Content-Type
  const ext = filePath.split('.').pop();
  switch (ext) {
    case 'html': return 'text/html';
    case 'css': return 'text/css';
    case 'js': return 'application/javascript';
    case 'png': return 'image/png';
    case 'jpg': return 'image/jpeg';
    // 添加其他文件类型的处理
    default: return 'application/octet-stream';
  }
}

serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    const fullPath = url.pathname.slice(1);

    // 首页
    if (fullPath === '') {
      // 返回index.html文件
      return new Response(Bun.file('index.html'), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // 其他文件，尝试读取并返回文件
    try {
      const file = Bun.file(fullPath);
      const headers = { 'Content-Type': getContentType(fullPath) };
      return new Response(file, { headers });
    } catch (_) {
      // 文件不存在或读取错误
      return new Response('Not Found', { status: 404 });
    }
  },
});


console.log(`Server running on http://localhost:${PORT}`);
