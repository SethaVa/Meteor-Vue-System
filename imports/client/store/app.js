// import {
//   Meteor
// } from 'meteor/meteor'
// import {
//   Session
// } from 'meteor/session'
// import _ from 'lodash'
// import Msg from '../libs/message'
// const app = {
//   namespaced: true,
//   state: {
//     currentUser: null
//   },
//   getters: {
//     userFullName(state) {
//       return state.currentUser ? state.currentUser.profile.fullName : 'Unknown'
//     },
//   },
//   mutations: {
//     updateCurrentUser(state, user) {
//       state.currentUser = user
//     },
//     logout(state, self) {
//       Meteor.logout(() => {
//         Session.clear()
//         self.$nextTick(() => {
//           Msg.success('You are logout!')
//           self.$router.push({
//             name: 'login'
//           })
//         })
//       })
//     },
//   },
// }
// export default app