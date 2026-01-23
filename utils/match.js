const stringSimilarity = require('string-similarity');

/**
 * 字符串标准化：去除冗余词汇和后缀
 */
function normalize(str) {
  if (!str) return '';
  return str
    .replace(/博物馆|博物院|景区|风景区|有限公司|集团|.md/g, '')
    .trim();
}

/**
 * 根据 POI 名称匹配知识库中的条目
 * @param {string} poiName 目标名称
 * @param {Array} knowledgeList 知识库列表 [{title, url, file, ...}]
 * @param {number} threshold 相似度阈值
 */
function matchKnowledge(poiName, knowledgeList, threshold = 0.5) {
  const target = normalize(poiName);
  if (!target) return null;

  let best = null;
  let bestScore = 0;

  for (const item of knowledgeList) {
    const score = stringSimilarity.compareTwoStrings(
      target,
      normalize(item.title)
    );

    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (bestScore >= threshold) {
    return { ...best, score: bestScore };
  }

  return null;
}

module.exports = {
  normalize,
  matchKnowledge
};
