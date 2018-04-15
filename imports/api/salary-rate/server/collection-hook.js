import AutoId from '../../../libs/auto-id'
import SalaryRate from '../salaryRate'

SalaryRate.before.insert(function(userId, doc) {
  doc._id = AutoId.make(SalaryRate, {
    length: 2,
  })
})