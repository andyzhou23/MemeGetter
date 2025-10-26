// ==UserScript==
// @name         MemeGetter
// @match        https://mp.weixin.qq.com/*
// @run-at       context-menu

// ==/UserScript==

'use strict';
function waitForElement(selector, timeout = 1000) {
    return new Promise((resolve, reject) => {
        const interval = 5;
        const maxTries = timeout / interval;
        let tries = 0;

        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                resolve(el); // 找到后继续
            } else if (++tries > maxTries) {
                clearInterval(timer);
                alert(`element ${selector} not found`);
                reject(new Error(`element ${selector} not found`));
            }
        }, interval);
    });
}

await waitForElement('img');
let existingPanel = document.querySelector('div.customized-img-panel');
if (existingPanel) {
    console.log('existing panel found, removing');
    existingPanel.remove();
}
// const imgs = document.querySelectorAll('img.wxw-img, img.__bg_gif'
// );
const imgs = document.querySelectorAll('img');
// 创建容器（固定右下角）
const panel = document.createElement('div');
panel.className = 'customized-img-panel';
Object.assign(panel.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    maxHeight: '100vh',
    maxWidth: '30vw',
    overflow: 'auto',
    background: 'white',
    border: '1px solid #ccc',
    zIndex: 999999,
    padding: '10px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 200px)',
    gap: '8px'
});

// 加载图片
imgs.forEach(img => {
    let src = img.getAttribute('data-src');
    if (src) {
        const imgElement = document.createElement('img');
        imgElement.src = src;
        imgElement.style.width = '200px';
        imgElement.style.height = 'auto';
        imgElement.style.cursor = 'pointer';
        imgElement.title = src;
        imgElement.onclick = () => window.open(src, '_blank');
        panel.appendChild(imgElement);
    }
});


// 插入页面
document.body.appendChild(panel);