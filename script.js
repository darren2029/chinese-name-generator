document.addEventListener('DOMContentLoaded', function() {
    const englishNameInput = document.getElementById('english-name');
    const generateBtn = document.getElementById('generate-btn');
    const loadingElement = document.getElementById('loading');
    const resultsElement = document.getElementById('results');
    const namesContainer = document.getElementById('names-container');
    
    // 检测当前环境并设置相应的API端点
    let API_ENDPOINT = '/.netlify/functions/generate-names';
    
    // 如果是在本地环境运行
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_ENDPOINT = '/api/generate-names';
    }
    // 如果是在GitHub Pages上运行（检测URL是否包含github.io）
    else if (window.location.hostname.includes('github.io')) {
        // 获取仓库名称作为基础路径
        const pathSegments = window.location.pathname.split('/');
        const repoName = pathSegments[1]; // 通常是第二个路径段
        API_ENDPOINT = `/${repoName}/api/generate-names`;
    }
    
    // 生成按钮点击事件
    generateBtn.addEventListener('click', async function() {
        const englishName = englishNameInput.value.trim();
        
        // 验证输入
        if (!englishName) {
            alert('Please enter your English name! (请输入您的英文名！)');
            return;
        }
        
        // 显示加载动画，隐藏结果区域
        loadingElement.style.display = 'block';
        resultsElement.style.display = 'none';
        generateBtn.disabled = true;
        
        try {
            // 调用后端API
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ englishName })
            });
            
            if (!response.ok) {
                throw new Error(`请求失败: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // 检查是否有错误
            if (data.error) {
                throw new Error(data.error);
            }
            
            // 解析API返回的JSON内容
            try {
                const content = data.choices[0].message.content;
                // 查找JSON内容（可能嵌在文本中）
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const jsonContent = jsonMatch[0];
                    const chineseNames = JSON.parse(jsonContent).names;
                    // 显示结果
                    displayResults(chineseNames);
                } else {
                    throw new Error('Unable to extract JSON data from API response (无法从API响应中提取JSON数据)');
                }
            } catch (parseError) {
                console.error('解析API响应时出错:', parseError);
                throw new Error('Error parsing name data (解析名字数据时出错)');
            }
        } catch (error) {
            console.error('生成中文名时出错:', error);
            alert('Error generating Chinese names, please try again later! (生成中文名时出错，请稍后再试！)');
        } finally {
            // 隐藏加载动画，启用按钮
            loadingElement.style.display = 'none';
            generateBtn.disabled = false;
        }
    });
    
    // 显示生成的中文名结果
    function displayResults(names) {
        // 清空之前的结果
        namesContainer.innerHTML = '';
        
        // 为每个名字创建卡片
        names.forEach(name => {
            const nameCard = document.createElement('div');
            nameCard.className = 'name-card';
            
            nameCard.innerHTML = `
                <div class="chinese-name">${name.chinese}</div>
                <div class="pinyin">${name.pinyin}</div>
                <div class="meaning">
                    <p><strong>Meaning in Chinese: </strong>${name.meaning_cn}</p>
                    <p><strong>Meaning in English: </strong>${name.meaning_en}</p>
                </div>
                <div class="cultural-reference">
                    <p><strong>Cultural Reference: </strong>${name.cultural_reference}</p>
                </div>
            `;
            
            namesContainer.appendChild(nameCard);
        });
        
        // 显示结果区域
        resultsElement.style.display = 'block';
    }
});