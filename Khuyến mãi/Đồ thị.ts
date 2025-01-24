import { option } from "../Khuyến mãi/main.ts";
const chartDom = document.getElementById("main");
const myChart = echarts.init(chartDom);
option && myChart.setOption(option);
