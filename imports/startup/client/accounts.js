import { Accounts } from 'meteor/accounts-base'

// Router
import router from '/imports/router'

Accounts.onLogout(() => {
  console.log('Auto logout if no activity (15m)')
  router.push({ name: 'login' })
})
