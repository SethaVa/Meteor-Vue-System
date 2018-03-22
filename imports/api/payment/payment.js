import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Payment = new Mongo.Collection('payment')

Payment.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  classId: {
    type: String,
  },
  studentId: {
    type: String,
    optional: true,
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
  pay: {
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
})

Payment.attachSchema(Payment.schema)

export default Payment
