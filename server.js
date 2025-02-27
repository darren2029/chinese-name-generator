const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');

// 配置
const PORT = 3000;
const API_KEY = 'e10c3a1a-5a5f-4ca0-ad72-d2c3dcaa77fc';
const API_HOST = 'ark.cn-beijing.volces.com';
const API_PATH = '/api/v3/chat/completions';

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // 处理API代理请求
    if (pathname === '/api/generate-names') {
        if (req.method === 'POST') {
            let body = '';
            
            req.on('data', chunk => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const requestData = JSON.parse(body);
                    const englishName = requestData.englishName;
                    
                    if (!englishName) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: '缺少英文名参数' }));
                        return;
                    }
                    
                    // 构建发送到DeepSeek API的请求数据
                    const systemPrompt = `你是一个专业的中文名字生成专家，擅长为外国人创造有趣、有文化内涵的中文名。
请根据用户提供的英文名，生成三个独特的中文名，每个名字都应该：
1. 考虑英文名的含义和音译
2. 融入中国文化元素
3. 包含一些幽默或有趣的成分
4. 提供详细的中英文解释

对于每个名字，请提供以下信息：
- 中文名字
- 拼音
- 名字含义（中文）
- 名字含义（英文）
- 文化参考（可以是历史人物、文学作品、成语典故等）

请以JSON格式返回结果，格式如下：
{
  "names": [
    {
      "chinese": "中文名",
      "pinyin": "拼音",
      "meaning_cn": "中文含义",
      "meaning_en": "英文含义",
      "cultural_reference": "文化参考"
    },
    {...},
    {...}
  ]
}`;

                    const userPrompt = `请为英文名"${englishName}"生成三个有趣、有文化内涵的中文名。`;
                    
                    const apiRequestData = {
                        model: "deepseek-v3-241226",
                        messages: [
                            {role: "system", content: systemPrompt},
                            {role: "user", content: userPrompt}
                        ]
                    };
                    
                    const apiRequestBody = JSON.stringify(apiRequestData);
                    
                    // 设置请求选项
                    const options = {
                        hostname: API_HOST,
                        path: API_PATH,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${API_KEY}`,
                            'Content-Length': Buffer.byteLength(apiRequestBody)
                        },
                        timeout: 60000 // 60秒超时
                    };
                    
                    // 发送请求到DeepSeek API
                    const apiReq = https.request(options, (apiRes) => {
                        let apiData = '';
                        
                        apiRes.on('data', (chunk) => {
                            apiData += chunk;
                        });
                        
                        apiRes.on('end', () => {
                            res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
                            res.end(apiData);
                        });
                    });
                    
                    apiReq.on('error', (error) => {
                        console.error('API请求错误:', error);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'API请求失败' }));
                    });
                    
                    apiReq.on('timeout', () => {
                        apiReq.destroy();
                        res.writeHead(504, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'API请求超时' }));
                    });
                    
                    apiReq.write(apiRequestBody);
                    apiReq.end();
                    
                } catch (error) {
                    console.error('处理请求时出错:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '请求格式错误' }));
                }
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '方法不允许' }));
        }
        return;
    }
    
    // 处理静态文件请求
    let filePath;
    if (pathname === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else {
        filePath = path.join(__dirname, pathname.substring(1));
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 文件不存在
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>The requested resource was not found on this server.</p>');
            } else {
                // 服务器错误
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // 成功返回文件内容
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});