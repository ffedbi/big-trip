import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
const BAR_HEIGTH = 55;

const CHART_MOK_DATA = {
  time: {
    labels: [`🛳️ HOTEL`, `🚕 TO AIRPORT`, `✈️ TO GENEVA`, `🛳️ TO CHAMONIX`],
    values: [72, 1, 3, 2],
    title: `TIME SPENT`,
    formatter: (val) => `${val}H`,
  },
  money: {
    labels: [`✈️ FLY`, `🏨 STAY`, `🚗 DRIVE`, `🏛️ LOOK`, `🏨 EAT`, `🚕 RIDE`],
    values: [400, 300, 200, 160, 150, 100],
    title: `MONEY`,
    formatter: (val) => `€ ${val}`,
  },
  transport: {
    labels: [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`],
    values: [4, 3, 2, 1],
    title: `TRANSPORT`,
    formatter: (val) => `${val}x`,
  },
};

const getTypeEvent = (arr) => {
  let result = {};
  arr.forEach((item) => {
    result.hasOwnProperty(item.type.typeName) ? result[item.type.typeName]++ : result[item.type.typeName] = 1;
  });
  const labels = Object.keys(result);
  const values = Object.values(result);

  return {
    labels,
    values,
    title: `TRANSPORT`,
    formatter: (val) => `${val}x`,
  };
};

const getPriceEvent = (arr) => {
  let eventType = getTypeEvent(arr).labels;
  let price = [];
  arr.forEach((item) => price.push(item.price));

  return {
    labels: eventType,
    values: price,
    title: `MONEY`,
    formatter: (val) => `€ ${val}`,
  };
};

class Stat {
  constructor(canvas, data) {
    this._element = null;

    this._canvas = document.querySelector(canvas);
    this._canvas.height = BAR_HEIGTH * data.values.length;
    this._labels = data.labels;
    this._values = data.values;
    this._title = data.title;
    this._formatter = data.formatter;
  }

  render() {
    this._element = new Chart(this._canvas, this.configChart);
    return this._element;
  }

  destroy() {
    this._element.destroy();
  }

  update() {}

  get configChart() {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._labels,
        datasets: [{
          data: this._values,
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
            formatter: this._formatter,
          },
        },
        title: {
          display: true,
          text: this._title,
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
    };
  }
}

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
  return chart;
};

export const initStat = (data) => {
  const transportData = getTypeEvent(data);
  const moneyData = getPriceEvent(data);
  // createHorizontalBarChart(MONEY_CANVAS, moneyData);
  // createHorizontalBarChart(TRANSPORT_CANVAS, transportData);
  // createHorizontalBarChart(TIME_CANVAS, CHART_MOK_DATA.time);
  new Stat(`.statistic__money`, moneyData).render();
  new Stat(`.statistic__transport`, transportData).render();
  new Stat(`.statistic__time-spend`, CHART_MOK_DATA.time).render();
};
