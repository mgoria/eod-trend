/**
 * jquery ui datepicker widget wrapper
 *
 * @link http://api.jqueryui.com/datepicker/
 */
export default class DateRange {
  /**
   * @param {String} fromContainer
   * @param {String} toContainer
   * @param {String} dateFormat
   */
  constructor(fromContainer, toContainer, dateFormat = 'mm/dd/yy') {
    this.fromContainer = fromContainer;
    this.toContainer = toContainer;
    this.dateFormat = dateFormat;
    this._onChangeCb = null;

    this.$from = this._createDatepicker(this.fromContainer);
    this.$to = this._createDatepicker(this.toContainer);

    this._bindListeners();
  }

  /**
   * @returns {Date|null}
   */
  getFromDate() {
    return this.$from.datepicker('getDate');
  }

  /**
   * @returns {Date|null}
   */
  getToDate() {
    return this.$to.datepicker('getDate');
  }

  /**
   * @param {Function} callback
   */
  onChange(callback) {
    this._onChangeCb = callback;
  }

  /**
   * @returns {DateRange}
   * @private
   */
  _bindListeners() {
    let _this = this;

    let invokeCallback = () => {
      if (this._onChangeCb) {
        this._onChangeCb(this.getFromDate(), this.getToDate());
      }
    };

    let getDate = (value) => {
      let date;
      try {
        date = $.datepicker.parseDate(this.dateFormat, value );
      } catch (error) {
        date = null;
      }

      return date;
    }

    this.$from.on('change', function() {
      _this.$to.datepicker('option', 'minDate', getDate(this.value));
      invokeCallback();
    });

    this.$to.on('change', function() {
      _this.$from.datepicker('option', 'maxDate', getDate(this.value));
      invokeCallback();
    });

    return this;
  }

  /**
   * @param {String} container
   * @returns {*|jQuery}
   * @private
   */
  _createDatepicker(container) {
    return $(container).datepicker({
      defaultDate: '+1w',
      changeMonth: true
    });
  }
}
