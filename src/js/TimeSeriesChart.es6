/**
 * Highcharts plugin wrapper
 *
 * @link http://www.highcharts.com/demo/line-time-series
 */
export default class TimeSeriesChart {
  /**
   * @param {String} container
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * @returns {*}
   */
  static get DEFAULT_OPTIONS() {
    return {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'Historical trend of end of day stock price (USD)'
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
          'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Stock price (USD)'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      }
    };
  }

  /**
   * @param {Array} data
   * @returns {TimeSeriesChart}
   */
  draw(data) {
    let options = TimeSeriesChart.DEFAULT_OPTIONS;

    options.series = [{
      type: 'area',
      name: 'Price',
      data: this._adjustData(data)
    }];

    Highcharts.chart(this.container, options);

    return this;
  }

  /**
   * @param {Array} data
   * @returns {Array}
   * @private
   */
  _adjustData(data) {
    return data.map(item => {
      item[0] = new Date(item[0]).getTime();

      return item;
    });
  }
}