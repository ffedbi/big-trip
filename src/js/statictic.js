import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import {POINTS_TYPE} from "./data";

const MONEY_CANVAS = document.querySelector(`.statistic__money`);
const TRANSPORT_CANVAS = document.querySelector(`.statistic__transport`);
const TIME_CANVAS = document.querySelector(`.statistic__time-spend`);
const BAR_HEIGHT = 55;
const timeOptions = {
  dayLengthInHours: 24,
  roundingStep: 30
};

let moneyChart = null;
let transportChart = null;
let timeChart = null;

const getDurationEvents = (arr) => {
  const duration = moment.duration(moment(arr[1]).diff(moment(arr[0])));
  return duration.days() * timeOptions.dayLengthInHours + duration.hours() + (duration.minutes() > timeOptions.roundingStep ? 1 : 0);
};

const getTypeEvent = (data) => {
  let result = {};
  data.forEach((item) => {
    let typeName = `${(POINTS_TYPE[item.type.typeName])} ${item.type.typeName}`;
    if (result[typeName]) {
      result[typeName]++;
    } else {
      result[typeName] = 1;
    }
  });

  return {
    labels: Object.keys(result),
    values: Object.values(result),
    title: `TRANSPORT`,
    formatter: (val) => `${val}x`,
  };
};

const getPriceEvents = (data) => {
  let result = {};

  data.forEach((item) => {
    let typeName = `${(POINTS_TYPE[item.type.typeName])} ${item.type.typeName}`;
    if (!result[typeName]) {
      result[typeName] = 0;
    }
    result[typeName] += +item.price;
  });

  return {
    labels: Object.keys(result),
    values: Object.values(result),
    title: `MONEY`,
    formatter: (val) => `€ ${val}`,
  };
};

const getTotalDurationEvents = (data) => {
  let result = {};
  data.forEach((item) => {
    let typeName = `${POINTS_TYPE[item.type.typeName]} ${item.type.typeName}`;
    if (!result[typeName]) {
      result[typeName] = getDurationEvents(item.timeline);
    } else {
      result[typeName] += getDurationEvents(item.timeline);
    }
  });

  return {
    labels: Object.keys(result),
    values: Object.values(result),
    title: `TIME SPENT`,
    formatter: (val) => `${val}H`,
  };
};

const createHorizontalBarChart = (canvasElement, chartData) => {
  const chart = new Chart(canvasElement, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartData.labels,
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
  chart.height = BAR_HEIGHT * data.values.length;
  chart.update();
};

export const initStat = (data) => {
  const moneyData = getPriceEvents(data);
  const transportData = getTypeEvent(data);
  const timeData = getTotalDurationEvents(data);

  if (!moneyChart) {
    moneyChart = createHorizontalBarChart(MONEY_CANVAS, moneyData);
    transportChart = createHorizontalBarChart(TRANSPORT_CANVAS, transportData);
    timeChart = createHorizontalBarChart(TIME_CANVAS, timeData);
  }

  updateChart(moneyChart, moneyData);
  updateChart(transportChart, transportData);
  updateChart(timeChart, timeData);
};
