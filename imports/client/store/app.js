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

// import createPersistedState from 'vuex-persistedstate'
//Router 
import router from '/imports/router'
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
    allowedBranchOpts(state) {
      let opts = []
      state.allowedBranches.forEach(doc => {
        opts.push({
          label: `${doc._id} : ${doc.name}`,
          value: doc._id,
          doc
        })
      })

      return opts
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
    //     // localStorage.removeItem('vuex')
    //     Session.clearAuth()
    //     state.currentUser = null
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
      Msg.success('You are logout!')
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

      Meteor.loginWithPassword(
        formData.username,
        formData.password,
        error => {
          if (!error) {
            commit('updateCurrentUser', Meteor.user())
          }
        }
      )
    },
    logout({
      commit
    }) {
      Meteor.logout(() => {
        console.log('Action: logout')
        commit('logout')
      })
    },
    loadCurrentUser({
      commit
    }) {
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
}