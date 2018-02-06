import {Session} from 'meteor/session';
import _ from 'lodash';

const app = {
    namespaced: true,
    state: {
        currentUser: null,
        currentModule: Session.get('currentModule'), // Use session for refresh page
        currentBranch: Session.get('currentBranch'), // Use session for refresh page
        currentBranches: null,
        company: null,
    },
    getters: {
        // langUI(state) {
        //     return state.lang == 'en' ? 'KH' : 'EN';
        // },
        fullName(state) {
            return state.currentUser ? state.currentUser.profile.fullName : 'Unknown';
        },
        
    },
    mutations: {
        updateCurrentUser(state, user) {
            state.currentUser = user;
        },
        updateCurrentBranches(state, branches) {
            state.currentBranches = branches;

            // Set current branch
            if (branches.length > 0 && !Session.get('currentBranch')) {
                let branchId = branches[0]._id;

                Session.setAuth('currentBranch', branchId);
                state.currentBranch = branchId;
            }
        },
        // updateCurrentModule(state, moduleName) {
        //     Session.setAuth('currentModule', moduleName);
        //     state.currentModule = moduleName;
        // },
        updateCurrentBranch(state, branchId) {
            Session.setAuth('currentBranch', branchId);
            state.currentBranch = branchId;
        },
        // updateCompany(state, doc) {
        //     state.company = doc;
        // },
    }
};

export default app;
