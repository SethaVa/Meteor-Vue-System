import {
  Mongo
} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Payment = new Mongo.Collection('sch_payment')

Payment.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  receiptCode:{
    type: String,
  },
  tranDate: {
    type: Date,
  },
  // New = Register , Payment,Refunt
  refType: {
    type: String,
  },
  classId: {
    type: String,
  },
  studentId: {
    type: String,
    optional: true,
  },
  fee: {
    type: Number
  },
  payDate: {
    type: Date,
  },
  duration: {
    type: Number,
  },
  endPayDate: {
    type: Date,
  },
  totalPay: {
    type: Number,
  },
  discountVal: {
    type: Number,
    defaultValue: 0,
  },
  usd: {
    type: Number,
    defaultValue: 0,
  },
  khr: {
    type: Number,
    defaultValue: 0,
  },

  remaining: {
    type: Number,
    defaultValue: 0,
  },
  // Check Payments
  status: {
    type: String,
    allowedValues: ['Paid', 'Debt', 'Expires', 'Closed'],
  },
  type: {
    type: String,
  },
  // for Payment
  lastId: {
    type: String,
    optional: true,
  },
  totalRecieve: {
    type: Number,
  },
  // Exchange Class
  refId: {
    type: String,
    optional: true
  }
})

Payment.attachSchema(Payment.schema)

export default Payment