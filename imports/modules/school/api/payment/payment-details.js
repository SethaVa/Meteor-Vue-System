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
  status: {
    type: String,
    allowedValues: ['Paid', 'Debt', 'Expires', 'Closed'],
  },
  type: {
    type: String,
  },

})

PaymentDetails.attachSchema(PaymentDetails.schema)

export default PaymentDetails