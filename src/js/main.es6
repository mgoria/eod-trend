import DataProvider from './DataProvider'
import TimeSeriesChart from './TimeSeriesChart'
import SelectBox from './SelectBox'
import DateRange from './DateRange'

class App {
  /**
   * @param {*} config 
   * @param {DataProvider} dataProvider 
   * @param {TimeSeriesChart} eodTrendChart 
   * @param {SelectBox} selectBox 
   * @param {DateRange} dateRange 
   */
  constructor(config, dataProvider, eodTrendChart, selectBox, dateRange) {
    this._config = config;

    this.dataProvider = dataProvider;

    this.eodTrendChart = eodTrendChart;

    this.selectBox = selectBox;

    this.dateRange = dateRange;
  }

  start() {
    this._log('Start app');

    let database = this._config.api.database;

    this._log('Loading companies list', {database});

    this.showSpinner(true);

    this.dataProvider.getCompaniesList(database)
      .then(companies => {
        this._log('Companies list', companies);

        this.selectBox
          .draw(companies)
          .onChange(companyCode => {
            this._log('Selected company', companyCode);

            this.loadChart(database, companyCode, this.dateRange.getFromDate(), this.dateRange.getToDate());
          })
          .setValue(this._config.defaults.company);

        this.dateRange
          .onChange((fromDate, toDate) => {
            this._log('Selected date range', {fromDate, toDate});

            if (this.selectBox.selectedItem) {
              this.loadChart(database, this.selectBox.selectedItem, fromDate, toDate);
            }
          });
      })
      .catch(console.error);
  }

  /**
   * @param {String} database
   * @param {String} companyCode
   * @param {Date|null} fromDate
   * @param {Date|null} toDate
   */
  loadChart(database, companyCode, fromDate = null, toDate = null) {
    let params = {
      order: 'asc',
      collapse: 'daily',
      column_index: 4, // Close
    };

    if (fromDate) {
      params.start_date = fromDate;
    }

    if (toDate) {
      params.end_date = toDate;
    }

    this._log('Loading chart data', {database, companyCode, params});

    this.showSpinner(true);

    this.dataProvider.getCompanyData(database, companyCode, params)
      .then(data => {
        this._log('Chart data loaded', data);

        this.eodTrendChart.draw(data);

        this.showSpinner(false);
      })
      .catch(error => {
        console.error(`Error loading data for ${database}/${companyCode}. ${error}`);
      });
  }

  /**
   * @param {Boolean} show
   */
  showSpinner(show) {
    $(this._config.selectors.spinner).css('visibility', show ? 'visible' : 'hidden');
  }

  /**
   * @param {String} message
   * @param {*} contextObj
   * @private
   */
  _log(message, contextObj = {}) {
    if (this._config.debug) {
      console.log(`[DEBUG: ${new Date().toISOString()}] ${message}`, contextObj);
    }
  }
}

const config = {
  debug: true,
  api: {
    database: 'WIKI', // currently only this supported
    key: 'y_WmgAQy7RaiRgF4Er9g',
  },
  defaults: {
    company: 'AMZN' // Amazon: first displayed company chart
  },
  selectors: {
    spinner: '#loadingSpinner',
  }
};

new App(
  config,
  new DataProvider(config.api.key),
  new TimeSeriesChart('eodTrendChart'),
  new SelectBox('#companiesSelect'),
  new DateRange('#fromDate', '#toDate')
).start();