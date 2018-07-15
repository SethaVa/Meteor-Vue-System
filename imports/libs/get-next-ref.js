import {
  Meteor
} from 'meteor/meteor'
import {
  MongoInternals
} from 'meteor/mongo'
import {
  ValidatedMethod
} from 'meteor/mdg:validated-method'
import {
  CallPromiseMixin
} from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'
import _ from 'lodash'

// Validate schema
const Schema = new SimpleSchema({
  collectionName: String,
  opts: {
    type: Object,
  },
  'opts.field': String,
  'opts.selector': {
    type: Object,
    blackbox: true,
    optional: true,
  },
  'opts.seq': {
    type: String,
    optional: true,
  },
  'opts.paddingType': {
    type: String,
    optional: true,
  },
  'opts.paddingLength': {
    type: SimpleSchema.Integer,
    optional: true,
  },
  'opts.paddingChar': {
    type: String,
    optional: true,
  },
  'opts.prefix': {
    type: String,
    optional: true,
  },
})

/*** Client ***/
export const getNextRef = new ValidatedMethod({
  name: 'getNextRef',
  mixins: [CallPromiseMixin],
  validate: Schema.validator(),
  run({
    collectionName,
    opts
  }) {
    if (Meteor.isServer) {
      return makeNextRef({
        collectionName,
        opts
      })
    }
  },
})

/*** Server ***/
const doNextRefServer = function ({
  collectionName,
  opts
}, callback) {
  Schema.validator({
    collectionName,
    opts
  })
  let ref = makeNextRef({
    collectionName,
    opts
  })

  callback(null, ref)
}

export const getNextRefServer = Meteor.wrapAsync(doNextRefServer)

// ----------------- Make Function ----------------
const makeNextRef = ({
  collectionName,
  opts
}) => {
  opts = opts || {}

  _.defaults(opts, {
    // field: 'refNo',
    selector: {},
    seq: 1,
    paddingType: null, // start, end
    paddingLength: 0,
    paddingChar: '0',
    prefix: '',
  })

  const Collection = MongoInternals.defaultRemoteCollectionDriver().open(
    collectionName
  )

  //lookup highest value
  let ref = 0
  let sort = {
    [opts.field]: -1
  }
  let doc = Collection.findOne(opts.selector, {
    sort
  })
  if (doc) {
    // Extract numbers from a string
    let exNumber = doc[opts.field].match(/\d+/g)
    ref = _.toNumber(_.last(exNumber))
  }
  ref += opts.seq

  // Check padding
  switch (opts.paddingType) {
    case 'start':
      ref = _.padStart(ref, opts.paddingLength, opts.paddingChar)
      break
    case 'end':
      ref = _.padEnd(ref, opts.paddingLength, opts.paddingChar)
      break
  }
  ref = opts.prefix ? `${opts.prefix}${ref}` : ref

  return ref
}