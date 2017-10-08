/**
 * quandl api client
 *
 * @link https://www.quandl.com/docs/api?csv#introduction
 */
export default class DataProvider {
  /**
   * @returns {String}
   */
  static get API_DATASETS_BASE_URL() {
    return 'https://www.quandl.com/api/v3/datasets';
  }

  /**
   * @param {String} apiKey
   */
  constructor(apiKey) {
    this._apiKey = apiKey;
  }

  /**
   * @param {String} databaseCode
   * @param {String} companyCode
   * @param {*} qsParams
   * @returns {String}
   * @private
   */
  _buildUrl(databaseCode, companyCode, qsParams = {}) {
    qsParams.api_key = this._apiKey;

    qsParams = $.param(qsParams);

    return `${DataProvider.API_DATASETS_BASE_URL}/${databaseCode}/${companyCode}.json?${qsParams}`;
  }

  /**
   * @param {String} database
   * @param {String} rawCode
   * @param {String} rawName
   * @returns {{id: *, text: *}}
   * @private
   */
  _companyTrimmer(database, rawCode, rawName) {
    let item = {
      id: rawCode,
      text: rawName
    };

    switch (database) {
      case 'WIKI':
        item.id = rawCode.replace(/^WIKI\//i, '');
        item.text = rawName.replace(/Prices, Dividends, Splits and Trading Volume$/i, '');
        break;
    }

    return item;
  }

  /**
   * @param {String} database
   * @param {String} companyCode
   * @param {*} params
   * @returns {Promise}
   */
  getCompanyData(database, companyCode, params = {}) {
    return new Promise((resolve, reject) => {
      $.get(this._buildUrl(database, companyCode, params), response => {

        return resolve(response.dataset.data);
      }).fail(reject);
    });
  }

  /**
   * @returns {Promise}
   */
  getCompaniesList(database = 'WIKI') {
    return new Promise((resolve, reject) => {
      let companies = [];
      let errors = [];

      // @see http://papaparse.com/#remote-files
      Papa.parse(`/data/${database}-datasets-codes.csv`, {
        download: true,
        worker: true,
        step: row => {
          if (row.errors.length > 0) {
            errors.push(row.errors.join(', '));
          } else {
            row = row.data.shift();

            if (row.length >= 2) {
              companies.push(this._companyTrimmer(database, row[0], row[1]));
            } else {
              console.warn('Broken csv line: ', row);
            }
          }
        },
        complete: () => {
          if (errors.length > 0) {
            return reject(errors);
          } else {
            return resolve(companies);
          }
        }
      });
    });
  }
}
