import SimpleSchema from 'simpl-schema'

const ProfileSchema = new SimpleSchema({
  fullName: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  oldPassword: {
    type: String,
  },
  newPassword: {
    type: String,
  },
  newConfirmPassword: {
    type: String,
  },
})

export default ProfileSchema
