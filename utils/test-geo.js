const { getLocalLocation } = require('./geo.js');

const testCases = [
  { lon: 116.4074, lat: 39.9042, expectedProvince: '北京市', expectedCity: '北京市' }, // 北京
  { lon: 113.2644, lat: 23.1291, expectedProvince: '广东省', expectedCity: '广州市' }, // 广州
  { lon: 114.0579, lat: 22.5431, expectedProvince: '广东省', expectedCity: '深圳市' }, // 深圳
  { lon: 104.0665, lat: 30.5723, expectedProvince: '四川省', expectedCity: '成都市' }, // 成都
  { lon: 121.4737, lat: 31.2304, expectedProvince: '上海市', expectedCity: '上海市' }, // 上海
];

testCases.forEach(tc => {
  const result = getLocalLocation(tc.lon, tc.lat);
  console.log(`Input: [${tc.lon}, ${tc.lat}]`);
  console.log(`Expected: ${tc.expectedProvince}, ${tc.expectedCity}`);
  console.log(`Result: ${result.province}, ${result.city}`);
  const passed = result.province === tc.expectedProvince && result.city === tc.expectedCity;
  console.log(`Status: ${passed ? 'PASSED' : 'FAILED'}`);
  console.log('---');
});
