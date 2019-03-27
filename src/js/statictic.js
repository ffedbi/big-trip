import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import {DATA_POINTS} from "./data";

const moneyCanvas = document.querySelector(`.statistic__money`);
const transportCanvas = document.querySelector(`.statistic__transport`);
const timeCanvas = document.querySelector(`.statistic__time-spend`);
const BAR_HEIGHT = 55;

const getFullLabels = (labels) => {
  return labels.map((item) => {
    item = `${(DATA_POINTS.POINTS_TYPE[item])} ${item}`;
    return item;
  });
};

const getTypeEvent = (arr) => {
  let result = {};
  arr.forEach((item) => {
    if (result.hasOwnProperty(item.type.typeName)) {
      result[item.type.typeName]++;
    } else {
      result[item.type.typeName] = 1;
    }
  });

  let labels = Object.keys(result);
  const values = Object.values(result);

  labels = getFullLabels(labels);

  return {
    labels,
    values,
    title: `TRANSPORT`,
    formatter: (val) => `${val}x`,
  };
};

const getPriceEvent = (arr) => {
  let result = {};
  let testPrice = {};
  arr.forEach((item) => {
    if (result.hasOwnProperty(item.type.typeName)) {
      result[item.type.typeName]++;
    } else {
      result[item.type.typeName] = 1;
    }
  });

  let labels = Object.keys(result);

  for (let i = 0; i <= arr.length; i++) {
    testPrice[labels[i]] = 0;
  }

  for (let i = 0; i < arr.length; i++) {
    if (testPrice.hasOwnProperty(arr[i].type.typeName)) {
      testPrice[arr[i].type.typeName] += +arr[i].price;
    }
  }

  const price = Object.values(testPrice);
  labels = getFullLabels(labels);

  return {
    labels,
    values: price,
    title: `MONEY`,
    formatter: (val) => `€ ${val}`,
  };
};

const getConvertHoursDuration = (arr) => {
  const timeStart = moment(arr[0]);
  const timeEnd = moment(arr[1]);
  return moment.utc(timeEnd.diff(timeStart));
};

const getTotalDurationEvents = (arr) => {
  let result = {};
  arr.forEach((item) => {
    if (result.hasOwnProperty(item.type.typeName)) {
      result[item.type.typeName] += getConvertHoursDuration(item.timeline);
    } else {
      result[item.type.typeName] = getConvertHoursDuration(item.timeline);
    }
  });

  let labels = Object.keys(result);
  let values = Object.values(result);

  labels = getFullLabels(labels);
  values = values.map((item) => moment(item).hour());

  return {
    labels,
    values,
    title: `TIME SPENT`,
    formatter: (val) => `${val}H`,
  };
};

const createHorizontalBarChart = (canvasElement, chartData) => {
  const chart = new Chart(canvasElement, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartData.labels.map((item) => item.toUpperCase()),
      datasets: [{
        data: chartData.values,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: chartData.formatter,
        },
      },
      title: {
        display: true,
        text: chartData.title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  chart.height = BAR_HEIGHT * chartData.values.length;
  return chart;
};

const updateChart = (chart, data) => {
  chart.data.labels = data.labels.map((item) => item.toUpperCase());
  chart.data.datasets[0].data = data.values;
  chart.update();
};

export const initStat = (data) => {
  const moneyData = getPriceEvent(data);
  const transportData = getTypeEvent(data);
  const timeData = getTotalDurationEvents(data);

  const moneyChart = createHorizontalBarChart(moneyCanvas, moneyData);
  const transportChart = createHorizontalBarChart(transportCanvas, transportData);
  const timeChart = createHorizontalBarChart(timeCanvas, timeData);

  updateChart(moneyChart, moneyData);
  updateChart(transportChart, transportData);
  updateChart(timeChart, timeData);
};
