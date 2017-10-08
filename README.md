# EOD stock prices

Companies historical trend of end of day stock prices on top of [Quandl API](https://www.quandl.com/docs/api?json#introduction).

Demo: http://eod-stock-price.s3-website-us-east-1.amazonaws.com/


### Installing

Setup a local dev environment (http://localhost:8080/)

```
$ npm install
```

```
$ npm run start
```

## Built With

* [jQueryUI](http://api.jqueryui.com/datepicker/) - datepicker widget
* [select2](https://select2.github.io/) - select2 plugin with autocomplete
* [highcharts](http://www.highcharts.com/demo/line-time-series) - time series chart

## Todo

* UI improvements (add some fancy styles and make it responsive)
* Add unit tests
* Create a nodejs command to fetch / update companies list csv file from https://www.quandl.com/api/v3/databases/WIKI/codes.csv
