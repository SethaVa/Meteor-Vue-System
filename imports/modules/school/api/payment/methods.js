import {
  Meteor
} from 'meteor/meteor'
import {
  ValidatedMethod
} from 'meteor/mdg:validated-method'
import {
  CallPromiseMixin
} from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'

import Payment from './payment'
import PaymentDetails from './payment-details'
import Students from '../students/students'
import _ from 'lodash'
import moment from 'moment'

import {
  insertIncome,
  removeIncomeFromOther,
  updateIncomeForPaymentNew,
} from '../Income/methods'

// Find All Data
export const findPayment = new ValidatedMethod({
  name: 'sch.findPayment',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    option
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}

      return Payment.find(selector, option).fetch()
    }
  },
})

export const findPaymentForClass = new ValidatedMethod({
  name: 'sch.findPaymentForClass',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // option = option || {}
      return aggregatePayment(selector)
    }
  },
})

export const findClassForStudenDetails = new ValidatedMethod({
  name: 'sch.findClassForStudenDetails',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
  }) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(500)
      selector = selector || {}
      return aggregatePayment(selector)
    }
  },
})

// find One
export const findOnePayment = new ValidatedMethod({
  name: 'sch.findOnePayment',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    _id
  }) {
    if (Meteor.isServer) {
      return Payment.findOne(_id)
    }
  },
})

// find One
export const findOnePaymentByCode = new ValidatedMethod({
  name: 'sch.findOnePaymentByCode',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      return Payment.findOne(selector)
    }
  },
})

// Find Data For Options
export const findPaymentOpts = new ValidatedMethod({
  name: 'sch.findPaymentOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run(selector, option) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}
      let data = []
      let Payment = Payment.find(selector, option).fetch()
      _.forEach(Payment, o => {
        data.push({
          label: o._id + '-' + o.PaymentName,
          value: o._id,
        })
      })
      return data
    }
  },
})
// For New Student
export const insertPayementForNew = new ValidatedMethod({
  name: 'sch.insertPaymentForNew',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Payment.schema,
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      // let paymentDate = []
      // for (let m = doc.payDate; m < doc.endPayDate; m.setMonth(m.getMonth() + 1)) {

      //   paymentDate.push(m)

      // }
      // doc.paymentDate = paymentDate

      Payment.insert(doc, (error, paymentId) => {
        if (!error) {
          let paymentDetails = {
            totalRecieve: doc.totalRecieve,
            fee: doc.fee,
            tranDate: doc.tranDate,
            payDate: doc.payDate,
            endPayDate: doc.endPayDate,
            refType: doc.refType,
            paymentId: paymentId,
            totalPay: doc.totalPay,
            duration: doc.duration,
            type: doc.type,
          }
          InsertPaymentDetails({
            doc: paymentDetails,
          })
          // Income

          let data = {
            tranDate: doc.tranDate,
            referenceId: paymentId,
            referenceType: 'New',
            totalUsd: doc.usd,
            totalKhr: doc.khr,
          }
          insertIncome.run({
            doc: data,
          })
        } else {
          console.log(error)
        }
      })

      return 'Success'
    }
  },
})
// update for new Student
export const updatePayementForNew = new ValidatedMethod({
  name: 'sch.updatePayementForNew',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    doc
  }) {
    if (Meteor.isServer) {
      let _id = doc._id
      Payment.update({
          _id: _id,
        }, {
          $set: doc,
        },
        error => {
          if (!error) {
            // Remove Before Insert
            PaymentDetails.remove({
              refId: doc._id,
            })
            // Details Payment
            let paymentDetails = {
              totalRecieve: doc.totalRecieve,
              fee: doc.fee,
              tranDate: doc.tranDate,
              payDate: doc.payDate,
              endPayDate: doc.endPayDate,
              refType: doc.refType,
              paymentId: doc._id,
              totalPay: doc.totalPay,
              duration: doc.duration,
              type: doc.type,
            }
            InsertPaymentDetails({
              doc: paymentDetails,
            })

            // Income
            let data = {
              tranDate: doc.tranDate,
              referenceId: _id,
              referenceType: 'New',
              totalUsd: doc.usd,
              totalKhr: doc.khr,
            }
            updateIncomeForPaymentNew.run({
              doc: data,
            })
          }
        }
      )

      return 'Success'
    }
  },
})

// Insert from Exchange Student

export const insertPaymentFromExchangeClass = new ValidatedMethod({
  name: 'sch.insertPaymentFromExchangeClass',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Payment.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      try {
        let data = {
          tranDate: doc.tranDate,
          fee: doc.fee,
          payDate: doc.payDate,
          duration: doc.duration,
          endPayDate: doc.endPayDate,
          totalPay: doc.totalPay,
          discountVal: doc.discountVal,
          usd: doc.usd,
          khr: doc.khr,
          totalRecieve: doc.totalRecieve,
          remaining: doc.remaining,
          refType: doc.refType,
          classId: doc.classId,
          studentId: doc.studentId,
          type: doc.type,
          status: doc.status,
          lastId: doc.paymentId,
          refId: doc.refId
        }
        Payment.update({
          _id: doc.paymentId
        }, {
          $set: {
            status: 'Closed'
          }
        })

        Payment.insert(data, (error, paymentId) => {
          if (!error) {
            // Update Status Expire Payement
            // let value = 'Closed'
            // updatePaymentStatus.run({
            //   _id: doc.paymentId,
            //   value,
            // })

            PaymentDetails.remove({
              refId: doc.paymentId,
              payDate: {
                $gte: doc.tranDate
              }
            })

            let paymentDetails = {
              totalRecieve: doc.totalRecieve,
              fee: doc.fee,
              tranDate: doc.tranDate,
              payDate: doc.payDate,
              endPayDate: doc.endPayDate,
              refType: doc.refType,
              paymentId: paymentId,
              totalPay: doc.totalPay,
              duration: doc.duration,
              type: doc.type,
            }
            InsertPaymentDetails({
              doc: paymentDetails,
            })

          }
        })

        return 'Success'
      } catch (error) {
        throw new Meteor.Error('Error', 'Payment', error.reason)
      }
    }
  },
})


// Insert សំរាបើសិស្សចាស់ដែលគាតមកបងលុយ
export const insertPayment = new ValidatedMethod({
  name: 'sch.insertPayment',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Payment.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      try {
        Payment.insert(doc, (error, paymentId) => {
          if (!error) {
            // Update Status Expire Payement
            let value = 'Closed'
            updatePaymentStatus.run({
              _id: doc.lastId,
              value,
            })

            let paymentDetails = {
              totalRecieve: doc.totalRecieve,
              fee: doc.fee,
              tranDate: doc.tranDate,
              payDate: doc.payDate,
              endPayDate: doc.endPayDate,
              refType: doc.refType,
              paymentId: paymentId,
              totalPay: doc.totalPay,
              duration: doc.duration,
              type: doc.type,
            }
            InsertPaymentDetails({
              doc: paymentDetails,
            })
            //Income
            let dataIncome = {
              tranDate: doc.tranDate,
              referenceId: paymentId,
              referenceType: 'Payment',
              totalUsd: doc.usd,
              totalKhr: doc.khr,
            }
            updateIncomeForPaymentNew.run({
              doc: dataIncome,
            })
          }
        })

        return 'Success'
      } catch (error) {
        throw new Meteor.Error('Error', 'Payment', error.reason)
      }
    }
  },
})

// update សំរាបើសិស្សចាស់ដែលគាតមកបងលុយ
export const updatePaymentForPayment = new ValidatedMethod({
  name: 'sch.updatePaymentForPayment',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Payment.schema,
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      try {
        Payment.update({
            _id: doc._id,
          }, {
            $set: doc,
          },
          error => {
            if (!error) {
              // remove before insert
              PaymentDetails.remove({
                refId: doc._id,
              })
              // Details Payment
              let paymentDetails = {
                totalRecieve: doc.totalRecieve,
                fee: doc.fee,
                tranDate: doc.tranDate,
                payDate: doc.payDate,
                endPayDate: doc.endPayDate,
                refType: doc.refType,
                paymentId: doc._id,
                totalPay: doc.totalPay,
                duration: doc.duration,
                type: doc.type,
              }
              InsertPaymentDetails({
                doc: paymentDetails,
              })
              // Income
              let data = {
                tranDate: doc.tranDate,
                referenceId: doc._id,
                referenceType: 'Payment',
                totalUsd: doc.usd,
                totalKhr: doc.khr,
              }
              updateIncomeForPaymentNew.run({
                doc: data,
              })
            }
          }
        )

        return 'Success'
      } catch (error) {
        throw new Meteor.Error('Error', 'Payment', error.reason)
      }
    }
  },
})

// Update សំរាប់សិស្សដែលគាតជំពាក់លុយ រួចហើយគាតមកសងលុយវិញ
export const updatePaymentForRefund = new ValidatedMethod({
  name: 'sch.updatePayment',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    doc
  }) {
    if (Meteor.isServer) {
      Payment.update({
          _id: doc._id,
        }, {
          $set: {
            status: doc.status,
            remaining: doc.remaining,
          },
          $inc: {
            usd: doc.usd,
            khr: doc.khr,
            totalRecieve: doc.totalRecieve,
          },
        },
        error => {
          if (!error) {
            // Remove Before Insert
            PaymentDetails.remove({
              refId: doc._id,
            })
            // Insert Payment Details
            let data = Payment.findOne({
              _id: doc._id,
            })
            let paymentDetails = {
              totalRecieve: data.totalRecieve,
              fee: data.fee,
              tranDate: data.tranDate,
              payDate: data.payDate,
              endPayDate: data.endPayDate,
              refType: data.refType,
              paymentId: data._id,
              totalPay: data.totalPay,
              duration: data.duration,
              type: data.type,
            }
            InsertPaymentDetails({
              doc: paymentDetails,
            })
          }
        }
      )

      return 'Success'
    }
  },
})
// Update Status
export const updatePaymentStatus = new ValidatedMethod({
  name: 'sch.updatePaymentStatus',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: String,
    value: String,
    totalRecieve: {
      type: Number,
      optional: true,
    },
  }).validator(),
  run({
    _id,
    value,
    totalRecieve
  }) {
    if (Meteor.isServer) {
      return Payment.update({
        _id: _id,
      }, {
        $set: {
          status: value,
        },
        $inc: totalRecieve,
      })
    }
  },
})

// Delete
export const removePayment = new ValidatedMethod({
  name: 'sch.removePayment',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({
    selector
  }) {
    if (Meteor.isServer) {
      Payment.update({
        _id: selector.lastId,
      }, {
        $set: {
          status: 'Expires',
        },
      })

      Payment.remove({
          _id: selector._id,
        },
        error => {
          if (!error) {
            PaymentDetails.remove({
              refId: selector._id,
            })

            removeIncomeFromOther.run({
              referenceId: selector._id,
              referenceType: selector.referenceType,
            })
          }
        }
      )
      return 'Success'
    }
  },
})

// Delete ECC = Exchange Class
export const removePaymentFromECC = new ValidatedMethod({
  name: 'sch.removePaymentFromECC',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({
    selector
  }) {
    if (Meteor.isServer) {
      // for get LastId
      let data = Payment.findOne({
        refId: selector.refId,
      })
      // old Payment that Exchange Class From
      let oldPaymentECCFrom = Payment.findOne({
        _id: data.lastId
      })
      Payment.update({
        _id: data.lastId,
      }, {
        $set: {
          status: data.status,
        },
      })

      // Remove Before Insert
      PaymentDetails.remove({
        refId: oldPaymentECCFrom._id,
      })

      // Insert to Payment Details

      let paymentDetails = {
        totalRecieve: oldPaymentECCFrom.totalRecieve,
        fee: oldPaymentECCFrom.fee,
        tranDate: oldPaymentECCFrom.tranDate,
        payDate: oldPaymentECCFrom.payDate,
        endPayDate: oldPaymentECCFrom.endPayDate,
        refType: oldPaymentECCFrom.refType,
        paymentId: oldPaymentECCFrom._id,
        totalPay: oldPaymentECCFrom.totalPay,
        duration: oldPaymentECCFrom.duration,
        type: oldPaymentECCFrom.type,
      }
      InsertPaymentDetails({
        doc: paymentDetails,
      })


      // Update Student Type
      Students.update({
        _id: data.studentId
      }, {
        $set: {
          type: oldPaymentECCFrom.type
        }
      })

      // Remove Payment from Exchange Class
      Payment.remove({
          refId: selector.refId,
        },
        error => {
          if (!error) {
            // Remove Payment Details from Exchange class 
            PaymentDetails.remove({
              refId: data._id,
            })
          }
        }
      )
      return 'Success'
    }
  },
})


// Remove Payment from Refund
export const removePaymentFromRefund = new ValidatedMethod({
  name: 'sch.removePaymentFromRefund',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: {
      type: String,
    },
  }).validator(),
  run({
    _id
  }) {
    if (Meteor.isServer) {
      Payment.remove({
        _id: _id,
      })

      return 'Success'
    }
  },
})


// const loopDate = (from, to) => {
//   let data = []

//   for (let m = from; m <= to; m.setMonth(m.getMonth() + 1)) {
//     data.push({
//       date: moment(m).format('YYYY-MM-D')
//     })
//   }

//   return data
// }

// Insert To Payment Details
const InsertPaymentDetails = ({
  doc
}) => {
  let i = 0
  let numOfMonth = doc.totalRecieve / doc.fee
  numOfMonth = _.floor(numOfMonth, 0)
  // if (doc.status == 'Paid') {
  for (let m = doc.payDate; m < doc.endPayDate; m.setMonth(m.getMonth() + 1)) {
    // data.push({
    //   date: moment(m).format('YYYY-MM-D')
    // })
    if (i == numOfMonth) {
      break
    }
    i++
    // doc.paymentDate.push(m);

    let data = {
      refType: doc.refType,
      refId: doc.paymentId,
      tranDate: doc.tranDate,
      fee: doc.fee,
      pay: doc.totalPay / doc.duration,
      payDate: m,
      status: 'Paid',
      type: doc.type,
    }
    PaymentDetails.insert(data)
  }
}

const aggregatePayment = (selector) => {
  selector = selector || {}
  let data = Payment.aggregate([{
      $match: selector,
    },
    {
      $lookup: {
        from: 'classStudy',
        localField: 'classId',
        foreignField: '_id',
        as: 'classDoc',
      },
    },
    {
      $unwind: {
        path: '$classDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'rooms',
        localField: 'classDoc.roomId',
        foreignField: '_id',
        as: 'roomDoc',
      },
    },
    {
      $unwind: {
        path: '$roomDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'timeStudy',
        localField: 'classDoc.timeId',
        foreignField: '_id',
        as: 'timeDoc',
      },
    },
    {
      $unwind: {
        path: '$timeDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'subjects',
        localField: 'classDoc.subId',
        foreignField: '_id',
        as: 'subjectDoc',
      },
    },
    {
      $unwind: {
        path: '$subjectDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'staff',
        localField: 'classDoc.staffId',
        foreignField: '_id',
        as: 'staffDoc',
      },
    },
    {
      $unwind: {
        path: '$staffDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'students',
        localField: 'studentId',
        foreignField: '_id',
        as: 'studentDoc',
      },
    },
    {
      $unwind: {
        path: '$studentDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$classId',
        staffId: {
          $last: '$staffDoc._id',
        },
        teacher: {
          $last: '$staffDoc.name',
        },
        room: {
          $last: '$roomDoc.roomName',
        },
        subject: {
          $last: '$subjectDoc.title',
        },
        time: {
          $last: '$timeDoc.timeStudy',
        },
        classDetail: {
          $push: {
            _id: '$_id',
            classId: '$classId',
            studentId: '$studentDoc._id',
            student: '$studentDoc.enName',
            gender: '$studentDoc.gender',
            payDate: '$payDate',
            duration: '$duration',
            usd: '$usd',
            khr: '$khr',
            discountVal: '$discountVal',
            remaining: '$remaining',
            endPayDate: '$endPayDate',
            type: '$type',
            status: '$status',
          },
        },
      },
    },
    {
      $project: {
        staffId: 1,
        teacher: 1,
        room: 1,
        subject: 1,
        time: 1,
        classDetail: 1,
      },
    },

  ])
  return data
}