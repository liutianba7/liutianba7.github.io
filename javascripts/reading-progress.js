// 阅读进度和阅读时间估算
document.addEventListener('DOMContentLoaded', function() {
    // 创建阅读信息显示容器
    const readingInfo = document.createElement('div');
    readingInfo.className = 'reading-info';
    readingInfo.innerHTML = `
        <div class="reading-info-item">
            <span class="icon">📖</span>
            <span class="reading-time-text">-- 分钟</span>
        </div>
        <div class="reading-info-item">
            <span class="icon">📍</span>
            <span class="reading-progress-text">0%</span>
        </div>
    `;
    document.body.appendChild(readingInfo);

    // 计算阅读时间（按中文每分钟 300 字估算）
    function calculateReadingTime() {
        const content = document.querySelector('.md-content__inner, article');
        if (!content) return;

        const text = content.innerText || content.textContent;
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        const englishWords = text.match(/[a-zA-Z]+/g) || [];

        // 中文字符 + 英文单词数，按每分钟 300 字计算
        const totalChars = chineseChars.length + englishWords.length;
        const readingMinutes = Math.ceil(totalChars / 300);

        const timeText = readingInfo.querySelector('.reading-time-text');
        if (timeText) {
            timeText.textContent = readingMinutes + ' 分钟';
        }
    }

    // 滚动时更新进度
    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;

        let progress = 0;
        if (documentHeight > 0) {
            progress = Math.round((scrolled / documentHeight) * 100);
        }

        const progressText = readingInfo.querySelector('.reading-progress-text');
        if (progressText) {
            progressText.textContent = progress + '%';
        }
    }

    // 初始化
    calculateReadingTime();

    // 监听滚动
    window.addEventListener('scroll', function() {
        requestAnimationFrame(updateProgress);
    });

    // 窗口大小变化时重新计算
    window.addEventListener('resize', calculateReadingTime);
});
