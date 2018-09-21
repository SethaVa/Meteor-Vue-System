import {
  Meteor
} from 'meteor/meteor'
import {
  Tracker
} from 'meteor/tracker'
import {
  Session
} from 'meteor/session'
import _ from 'lodash'
import Msg from '../lib/message'

import createPersistedState from 'vuex-persistedstate'
//Router 
import router from '/imports/startup/client/routes'
// export const store = new Vuex.Store({
export default {
  namespaced: true,
  state: {
    company: Session.get('company'),
    currentBranch: Session.get('currentBranch'),
    allowedBranches: Session.get('allowedBranches'),
    currentUser: Meteor.user(),
  },
  getters: {
    currentBranchId(state) {
      return state.currentBranch ? state.currentBranch._id : null
    },
    userFullName(state) {
      return state.currentUser ? state.currentUser.profile.fullName : 'Unknown'
    },
    userIsInRole: state => roles => {
      roles = _.isString(roles) ? [roles] : roles
      return roles.some(val => {
        return _.includes(state.currentUser && state.currentUser.roles, val)
      })
    },
    dateFormat(state) {
      let format = state.company ?
        state.company.setting.dateFormat.split(' ') :
        'DD/MM/YYYY'
      if (format[0] === 'DD/MM/YYYY') {
        return 'dd/MM/yyyy'
      }
    },
    dateTimeFormat(state) {
      let format = state.company ?
        state.company.setting.dateFormat.split(' ') :
        'DD/MM/YYYY'
      if (format[0] === 'DD/MM/YYYY') {
        return 'dd/MM/yyyy'
      }
    },
  },
  mutations: {
    updateCurrentUser(state, user) {
      return state.currentUser = user
    },
    updateCompany(state, value) {
      Session.setAuth('company', value)
      state.company = value
    },
    updateAllowedBranches(state, value) {
      Session.setAuth('allowedBranches', value)
      state.allowedBranches = value
    },
    updateCurrentBranch(state, value) {
      Session.setAuth('currentBranch', value)
      state.currentBranch = value
    },
    // logout(state, self) {
    //   Meteor.logout(() => {
    //     // Session.clear()
    //     localStorage.removeItem('vuex')
    //     self.$nextTick(() => {
    //       Msg.success('You are logout!')
    //       self.$router.push({
    //         name: 'login'
    //       })
    //     })
    //   })
    // },
    logout(state) {
      Session.clearAuth()
      state.currentUser = null
      router.push({
        name: 'login'
      })
    },
  },
  actions: {
    login({
      commit
    }, formData) {
      console.log('Action: login')

      // return new Promise((resolve, reject) => {
      Meteor.loginWithPassword(
        formData.username,
        formData.password,
        error => {
          if (!error) {
            commit('updateCurrentUser', Meteor.user())
          }
          // else {
          //   reject(error)
          //   resolve('success')
          // }
        }
      )
      // })
    },
    loadCurrentUser({
      commit
    }) {
      // see https://forums.meteor.com/t/meteor-userid-returns-an-id-but-meteor-user-returns-undefined/18355/5

      //! Meteor.user() will not be ready right away,
      //! it is reactive so we need to wait for it
      Tracker.autorun(() => {
        if (Meteor.user()) {
          console.log('Action: loadCurrentUser')
          commit('updateCurrentUser', Meteor.user())
        }
      })
    },
    updateAllowedBranches({
      commit
    }, branches) {
      console.log('Action: updateAllowedBranches')
      commit('updateAllowedBranches', branches)
      commit(
        'updateCurrentBranch',
        branches && branches.length ? branches[0] : Session.get('currentBranch')
      )
    },
  },
  // nested modules
  // modules: {
  //   //...
  // }
  // plugins: [createPersistedState()]
}
// })
// export default store


// State
// import app from './app'

// const store = new Vuex.Store({
//   // modules: {
//   app: app,
//   // },
// })

// export default store
//========================================================

// export default app;