<style>
/* === Hero 一体化区域 === */
.md-typeset .hero-section {
  position: relative;
  border-radius: 16px;
  overflow: visible;
  margin: 20px -20px 50px;
  padding: 0 20px;
}
/* 光晕背景 - 向外扩散 */
.md-typeset .hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 100px);
  height: calc(100% + 200px);
  background: radial-gradient(ellipse at center, rgba(26,115,232,0.15) 0%, rgba(124,77,255,0.08) 35%, rgba(233,30,99,0.04) 60%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  z-index: 0;
}
/* 主体卡片 */
.md-typeset .hero-card {
  position: relative;
  z-index: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(26,115,232,0.2),
    0 8px 40px rgba(124,77,255,0.12),
    0 16px 60px rgba(233,30,99,0.08);
}
.md-typeset .hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a73e8 0%, #7c4dff 35%, #e91e63 70%, #ff5722 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
}
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.md-typeset .hero-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%),
                    radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 0%, transparent 30%);
}
.md-typeset .hero-content {
  position: relative;
  z-index: 1;
  padding: 50px 40px 60px;
  text-align: center;
  color: white;
}
/* === 头像 === */
.md-typeset .hero-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255,255,255,0.9);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}
.md-typeset .hero-avatar:hover {
  transform: scale(1.05);
}
/* === 标题 === */
.md-typeset .hero-title {
  font-size: 2em;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}
.md-typeset .hero-subtitle {
  font-size: 1.05em;
  opacity: 0.9;
  margin: 0 0 20px 0;
}
/* === 标签 === */
.md-typeset .hero-tags {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.md-typeset .hero-tag {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;
}
.md-typeset .hero-tag:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}
/* === 统计 === */
.md-typeset .hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.2);
}
.md-typeset .hero-stat-value {
  font-size: 1.8em;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.md-typeset .hero-stat-label {
  font-size: 0.85em;
  opacity: 0.85;
  margin-top: 2px;
}
/* === 波浪分割 === */
.md-typeset .hero-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  overflow: hidden;
}
.md-typeset .hero-wave svg {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
}

/* === 卡片容器 === */
.md-typeset .card-container {
  background: var(--md-default-bg-color);
  border: 1px solid var(--md-default-fg-color--lightest);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px var(--md-shadow-key1-color);
  margin: 20px 0;
}

/* === 技术栈 === */
.md-typeset .tech-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
  line-height: 1.8;
}
.md-typeset .tech-row img {
  vertical-align: middle;
  height: 22px;
}
.md-typeset .divider {
  border-top: 1px dashed var(--md-default-fg-color--lighter);
  margin: 16px 0;
}

/* === 联系卡片 === */
.md-typeset .contact-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--md-code-bg-color);
  padding: 10px 18px;
  border-radius: 10px;
  margin: 4px;
  transition: all 0.3s ease;
  text-decoration: none;
}
.md-typeset .contact-card:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px var(--md-shadow-key1-color);
  background: linear-gradient(135deg, rgba(26,115,232,0.1), rgba(156,39,176,0.1));
}

/* === 滚动渐入动画 === */
.md-typeset .fade-in {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease forwards;
}
.md-typeset .fade-in:nth-child(1) { animation-delay: 0.1s; }
.md-typeset .fade-in:nth-child(2) { animation-delay: 0.2s; }
.md-typeset .fade-in:nth-child(3) { animation-delay: 0.3s; }
.md-typeset .fade-in:nth-child(4) { animation-delay: 0.4s; }
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === 深色模式适配 === */
[data-md-color-scheme="slate"] .md-typeset .hero-glow {
  background: radial-gradient(ellipse at center, rgba(26,115,232,0.25) 0%, rgba(124,77,255,0.15) 35%, rgba(233,30,99,0.08) 60%, transparent 70%);
}
[data-md-color-scheme="slate"] .md-typeset .hero-bg {
  background: linear-gradient(135deg, #0d47a1 0%, #4a148c 35%, #880e4f 70%, #bf360c 100%);
  background-size: 400% 400%;
}
</style>

<!-- === Hero 一体化区域 === -->
<div class="fade-in">
  <div class="hero-glow"></div>
  <div class="hero-card">
    <div class="hero-bg"></div>
    <div class="hero-pattern"></div>
    <div class="hero-content">
      <img class="hero-avatar" src="./assets/banner.jpg" alt="Avatar">
      <h1 class="hero-title">👋 Hi, I'm LiuTianBa7</h1>
      <p class="hero-subtitle">🎓 东南大学 · 计算机科学与技术 · 研 0</p>
      <div class="hero-tags">
        <span class="hero-tag">🤖 深度学习</span>
        <span class="hero-tag">💻 全栈开发</span>
        <span class="hero-tag">🔥 开源爱好者</span>
      </div>
      <div class="hero-stats">
        <div class="hero-stat-item">
          <div class="hero-stat-value">20+</div>
          <div class="hero-stat-label">技术笔记</div>
        </div>
        <div class="hero-stat-item">
          <div class="hero-stat-value">10+</div>
          <div class="hero-stat-label">面经</div>
        </div>
        <div class="hero-stat-item">
          <div class="hero-stat-value">2026</div>
          <div class="hero-stat-label">求求了，我真想要大厂实习！</div>
        </div>
      </div>
    </div>
    <div class="hero-wave">
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path d="M0,30 C150,60 350,0 600,30 C850,60 1050,0 1200,30 L1200,60 L0,60 Z" fill="var(--md-default-bg-color)"/>
      </svg>
    </div>
  </div>
</div>

### 🛠️ 技术栈

<div class="card-container fade-in" markdown>

<div class="tech-row">
<b>☕ Java 生态</b>：
<img src="https://img.shields.io/badge/-Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white">
<img src="https://img.shields.io/badge/-SSM-6DB33F?style=flat-square&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/-SpringBoot-6DB33F?style=flat-square&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/-SpringCloud-6DB33F?style=flat-square&logo=spring&logoColor=white">
</div>

<div class="tech-row">
<b>🐍 Python & AI</b>：
<img src="https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white">
<img src="https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white">
<img src="https://img.shields.io/badge/-PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white">
<img src="https://img.shields.io/badge/-LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white">
</div>

<div class="tech-row">
<b>💾 基础 & 中间件</b>：
<img src="https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white">
<img src="https://img.shields.io/badge/-RabbitMQ-FF6600?style=flat-square&logo=rabbitmq&logoColor=white">
<img src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white">
</div>

<div class="tech-row">
<b>🌐 前端技术</b>：
<img src="https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/-Vue.js-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white">
</div>

<div class="divider"></div>

🚀 **目标**：<span style="background: linear-gradient(135deg, #1a73e8, #e91e63); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;">大厂! 大厂! 还是大厂!</span>

</div>

---

### 📂 本站收录

<div class="grid cards fade-in" markdown>

-   :material-code-tags:{ .lg .middle } **技术笔记**

    汇总个人在 Code 学习路上的所有笔记，涵盖算法、框架与实战。

-   :material-book-open-variant:{ .lg .middle } **面经心得**

    沉淀面试总结、核心源码研读及复杂 Bug 解决思路。在不断复盘中构建完善的底层知识体系，记录每一次技术突破。

-   :material-coffee:{ .lg .middle } **生活随笔**

    记录 2026 的碎碎念。

-   :material-folder-zip:{ .lg .middle } **项目作品**

    展示我的开源项目与个人作品集。

</div>

---

### 📬 联系我

欢迎通过以下方式联系我！

<div class="fade-in" markdown>
<span class="contact-card">:material-email: [liutianba7@163.com](mailto:liutianba7@163.com)</span>
<span class="contact-card">:material-gmail: [liutianba92@gmail.com](mailto:liutianba92@gmail.com)</span>
<span class="contact-card">:material-github: [Lqqqqqq123123](https://github.com/Lqqqqqq123123)</span>
</div>