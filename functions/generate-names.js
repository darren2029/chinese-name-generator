const https = require('https');

// 从环境变量获取API密钥，避免硬编码在代码中
const API_KEY = process.env.DEEPSEEK_API_KEY || 'e10c3a1a-5a5f-4ca0-ad72-d2c3dcaa77fc';
const API_HOST = 'ark.cn-beijing.volces.com';
const API_PATH = '/api/v3/chat/completions';

exports.handler = async function(event, context) {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: '方法不允许' })
    };
  }

  try {
    // 解析请求体
    const requestData = JSON.parse(event.body);
    const englishName = requestData.englishName;
    
    if (!englishName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '缺少英文名参数' })
      };
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
    
    // 调用DeepSeek API
    const response = await new Promise((resolve, reject) => {
      const apiRequestBody = JSON.stringify(apiRequestData);
      
      const options = {
        hostname: API_HOST,
        path: API_PATH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Length': Buffer.byteLength(apiRequestBody)
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`API请求失败: ${res.statusCode} ${data}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.write(apiRequestBody);
      req.end();
    });
    
    // 返回API响应
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // 允许跨域请求
      },
      body: response
    };
    
  } catch (error) {
    console.error('处理请求时出错:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '服务器内部错误' })
    };
  }
};