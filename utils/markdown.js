const marked = require('./marked.js');

/**
 * 使用标准库 marked.js 将 Markdown 转换为 HTML
 * 遵循最佳实践，保持解析逻辑简洁且符合标准
 */
function parse(md) {
  if (!md) return '';
  
  try {
    // 配置 marked
    const options = {
      gfm: true,
      breaks: true,
      pedantic: false,
      smartLists: true,
      smartypants: false
    };

    // 如果 marked 是个对象且含有 parse 方法
    if (typeof marked.parse === 'function') {
      return marked.parse(md, options);
    }
    // 如果 marked 本身就是个函数
    if (typeof marked === 'function') {
      return marked(md, options);
    }
    return String(md);
  } catch (e) {
    console.error('Markdown parse error:', e);
    return String(md);
  }
}

module.exports = {
  parse
};
