/**
 * select2 plugin wrapper
 *
 * @link https://select2.github.io/
 */
export default class SelectBox {
  /**
   * @param {String} container
   */
  constructor(container) {
    this.container = container;

    this._$select = null;
    this._slectedItem = null;
    this._onChangeCb = null;
  }

  /**
   * @param {*} data
   * @returns {SelectBox}
   */
  draw(data) {
    this._$select = $(this.container).select2({data});

    this._$select.on('change', (event) => {
      if (event.params) {
        this._slectedItem = event.params.data.id;
      } else {
        this._slectedItem = this._$select.val();
      }

      if (this._onChangeCb) {
        this._onChangeCb(this._slectedItem);
      }
    });

    return this;
  }

  /**
   * @returns {String|null}
   */
  get selectedItem() {
    return this._slectedItem;
  }

  /**
   * @param {String} val
   * @returns {SelectBox}
   */
  setValue(val) {
    this._$select.val(val).trigger('change');

    return this;
  }

  /**
   * @param {Function} callback
   * @returns {SelectBox}
   */
  onChange(callback) {
    this._onChangeCb = callback;

    return this;
  }
}