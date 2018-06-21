import SimpleSchema from 'simpl-schema'

export const UserInsertSchema = new SimpleSchema({
  fullName: {
    type: String,
  },
  username: {
    type: String,
    min: 5,
    max: 20,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    min: 6,
  },
  status: {
    type: String,
  },
  branchPermissions: {
    type: Array,
    optional: true
  },
  'branchPermissions.$': {
    type: String,
  },
  roles: {
    type: String,
  },
  // 'roles.$': {
  //   type: String,
  // },
})

export const UserUpdateSchema = new SimpleSchema({
  _id: {
    type: String,
  },
  fullName: {
    type: String,
  },
  username: {
    type: String,
    min: 5,
    max: 20,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    min: 6,
  },
  status: {
    type: String,
  },
  branchPermissions: {
    type: Array,
    optional: true
  },
  'branchPermissions.$': {
    type: String,
  },
  roles: {
    type: String,
  },
  // 'roles.$': {
  //   type: String,
  // },
})