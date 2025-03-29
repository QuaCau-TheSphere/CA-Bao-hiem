// deno-lint-ignore-file
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// Thưởng.ts
function t\u00EDnhTh\u01B0\u1EDFng(ph\u00ED, A = 85e5) {
  if (ph\u00ED >= 125e7) return khuy\u1EBFnM\u00E3i1250tr(ph\u00ED, A);
  if (ph\u00ED >= 25e7) return khuy\u1EBFnM\u00E3i250tr(ph\u00ED, A);
  return khuy\u1EBFnM\u00E3iL\u1EBB(ph\u00ED);
}
__name(t\u00EDnhTh\u01B0\u1EDFng, "t\xEDnhTh\u01B0\u1EDFng");
function khuy\u1EBFnM\u00E3i1250tr(ph\u00ED, A) {
  const ph\u1EA7nB\u1ED9i = Math.floor(ph\u00ED / 125e7);
  const ph\u1EA7nD\u01B0 = ph\u00ED % 125e7;
  return ph\u1EA7nB\u1ED9i * A * 6 + khuy\u1EBFnM\u00E3i250tr(ph\u1EA7nD\u01B0, A);
}
__name(khuy\u1EBFnM\u00E3i1250tr, "khuy\u1EBFnM\xE3i1250tr");
function khuy\u1EBFnM\u00E3i250tr(ph\u00ED, A) {
  const ph\u1EA7nB\u1ED9i = Math.floor(ph\u00ED / 25e7);
  const ph\u1EA7nD\u01B0 = ph\u00ED % 25e7;
  return ph\u1EA7nB\u1ED9i * A + khuy\u1EBFnM\u00E3iL\u1EBB(ph\u1EA7nD\u01B0);
}
__name(khuy\u1EBFnM\u00E3i250tr, "khuy\u1EBFnM\xE3i250tr");
function khuy\u1EBFnM\u00E3iL\u1EBB(ph\u00ED) {
  if (ph\u00ED >= 2e8) return 4e6;
  if (ph\u00ED >= 13e7) return 2e6;
  if (ph\u00ED >= 8e7) return 5e5;
  if (ph\u00ED >= 3e7) return 1e5;
  return 0;
}
__name(khuy\u1EBFnM\u00E3iL\u1EBB, "khuy\u1EBFnM\xE3iL\u1EBB");

// utils.ts
function vi\u1EBFtS\u1ED1Ti\u1EC1nD\u01B0\u1EDBiD\u1EA1ngD\u1EC5\u0110\u1ECDc(s\u1ED1Ti\u1EC1n) {
  if (!s\u1ED1Ti\u1EC1n) return void 0;
  return `${s\u1ED1Ti\u1EC1n.toLocaleString("en")} \u0111`;
}
__name(vi\u1EBFtS\u1ED1Ti\u1EC1nD\u01B0\u1EDBiD\u1EA1ngD\u1EC5\u0110\u1ECDc, "vi\u1EBFtS\u1ED1Ti\u1EC1nD\u01B0\u1EDBiD\u1EA1ngD\u1EC5\u0110\u1ECDc");

// main.ts
var dsPh\u00ED = [];
var dsKhuy\u1EBFnM\u00E3iTh\u01B0\u1EDDng = [];
var dsC\u1EAFtM\u00E1u = [];
for (let ph\u00ED = 3e7; ph\u00ED <= 1e10; ph\u00ED += 1e7) {
  const khuy\u1EBFnM\u00E3iChoKh\u00E1ch = t\u00EDnhTh\u01B0\u1EDFng(ph\u00ED);
  const th\u01B0\u1EDFngChoTvv = t\u00EDnhTh\u01B0\u1EDFng(ph\u00ED, 28e5);
  const hoaH\u1ED3ngTvv = ph\u00ED * 0.02;
  const c\u1EAFtM\u00E1u = th\u01B0\u1EDFngChoTvv + hoaH\u1ED3ngTvv * 10;
  dsPh\u00ED.push(ph\u00ED);
  dsKhuy\u1EBFnM\u00E3iTh\u01B0\u1EDDng.push(khuy\u1EBFnM\u00E3iChoKh\u00E1ch);
  dsC\u1EAFtM\u00E1u.push(c\u1EAFtM\u00E1u);
  console.log(
    vi\u1EBFtS\u1ED1Ti\u1EC1nD\u01B0\u1EDBiD\u1EA1ngD\u1EC5\u0110\u1ECDc(ph\u00ED),
    vi\u1EBFtS\u1ED1Ti\u1EC1nD\u01B0\u1EDBiD\u1EA1ngD\u1EC5\u0110\u1ECDc(c\u1EAFtM\u00E1u)
  );
}
var option = {
  xAxis: {
    type: "category",
    data: dsPh\u00ED
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: dsKhuy\u1EBFnM\u00E3iTh\u01B0\u1EDDng,
      type: "line"
    },
    {
      data: dsC\u1EAFtM\u00E1u,
      type: "line"
    }
  ]
};

// Đồ thị.ts
var chartDom = document.getElementById("main");
var myChart = echarts.init(chartDom);
option && myChart.setOption(option);
