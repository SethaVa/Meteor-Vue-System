import _ from 'lodash'
import numeral from 'numeral'
import moment from 'moment'
import store from '/imports/store'

const Filters = {
  install(Vue, options) {
    Vue.mixin({
      filters: {
        date: formatDate,
        dateTime: formatDateTime,
        number: formatNumber,
        currency: formatCurrency,
      },
    })
  },
}

export default Filters

/**
 * Functions
 */
function formatDate(value, format) {
  const setting =
    store &&
    store.state.app &&
    store.state.app.company &&
    store.state.app.company.setting
  format =
    format || (setting && setting.dateFormat.split(' ')[0]) || 'DD/MM/YYYY'
  return moment(value).format(format)
}

function formatDateTime(value, format) {
  const setting =
    store &&
    store.state.app &&
    store.state.app.company &&
    store.state.app.company.setting
  format = format || (setting && setting.dateFormat) || 'DD/MM/YYYY H:mm:ss'
  return moment(value).format(format)
}

function formatNumber(value, format) {
  const setting =
    store &&
    store.state.app &&
    store.state.app.company &&
    store.state.app.company.setting
  format =
    format ||
    (setting && `0,0.` + _.padEnd('', setting.decimalNumber, '0')) ||
    '0,0.00'
  return numeral(value).format(format)
}

function formatCurrency(value, format) {
  const setting =
    store &&
    store.state.app &&
    store.state.app.company &&
    store.state.app.company.setting

  return (
    formatNumber(value, format) + ' ' + (setting ? setting.baseCurrency : '$')
  )
}
