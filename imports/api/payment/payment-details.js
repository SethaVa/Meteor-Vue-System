import {
  Mongo
} from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const PaymentDetails = new Mongo.Collection('paymentDetailsDetails')

PaymentDetails.schema = new SimpleSchema({
  tranDate: {
    type: Date,
  },
  // New = Register , PaymentDetails,Refunt
  refType: {
    type: String,
  },
  refId: {
    type: String,
  },
  fee: {
    type: Number
  },
  payDate: {
    type: Date,
  },

  pay: {
    type: Number,
  },
  // discountVal: {
  //   type: Number,
  //   defaultValue: 0,
  // },
  // usd: {
  //   type: Number,
  //   defaultValue: 0,
  // },
  // khr: {
  //   type: Number,
  //   defaultValue: 0,
  // },
  // Check PaymentDetailss
  status: {
    type: String,
    allowedValues: ['Paid', 'Debt', 'Expires', 'Closed'],
  },
  type: {
    type: String,
  },
  // for PaymentDetails
  // lastId: {
  //   type: String,
  //   optional: true,
  // },
})

PaymentDetails.attachSchema(PaymentDetails.schema)

export default PaymentDetails