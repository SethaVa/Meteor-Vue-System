import {
  Meteor
} from 'meteor/meteor'
import {
  Session
} from 'meteor/session'
import _ from 'lodash'
import Msg from '../libs/message'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import createPersistedState from 'vuex-persistedstate'

export const store = new Vuex.Store({
  namespaced: true,
  state: {
    currentUser: null,
  },
  getters: {
    userFullName(state) {
      return state.currentUser ? state.currentUser.profile.fullName : 'Unknown'
    },
    userIsInRole: state => roles => {
      roles = _.isString(roles) ? [roles] : roles
      return roles.some(val => {
        return _.includes(state.currentUser && state.currentUser.roles, val)
      })
    },
  },
  mutations: {
    updateCurrentUser(state, user) {
      return state.currentUser = user
    },
    logout(state, self) {
      Meteor.logout(() => {
        Session.clear()
        self.$nextTick(() => {
          Msg.success('You are logout!')
          self.$router.push({
            name: 'login'
          })
        })
      })
    },
  },
  plugins: [createPersistedState()]
})
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