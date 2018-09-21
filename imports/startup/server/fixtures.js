import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { Accounts } from 'meteor/accounts-base'

import Branches from '../../api/branches/branches'
import Company from '../../api/company/company'
// import Groups from '../../api/user-groups/user-groups';

Meteor.startup(function() {
  // Branch
  if (Branches.find().count() == 0) {
    const data = [
      {
        // name: 'Banan',
        // shortName: 'BN',
        // address: 'Battambang Province',
        // telephone: '053 50 66 777',
        // email: 'banan@gmail.com',mon
        _id: '001',
        name: 'Baydom Ram',
        shortName: 'BR',
        address: 'Battambang Province',
        telephone: '08757645',
        email: 'admin@gmail.com',
      },
    ]

    data.forEach(doc => {
      Branches.insert(doc)
    })
  }
// Company
if (Company.find().count() === 0) {
  const data = {
    _id: '1',
    name: 'សាលាបង្រៀនភាសាបរទេស ប៊ី អេ ឌី',
    address: 'ខេត្តបាត់ដំបង',
    telephone: '070/89 33 44 80',
    email: 'badschool@gmail.com',
    website: 'http://bad-school.com',
    industry: 'IT',
    setting: {
      baseCurrency: 'USD',
      decimalNumber: 2,
      accountingIntegration: true,
      dateFormat: 'DD/MM/YYYY H:mm:ss',
      lang: 'EN',
    },
  }

  Company.insert(data)
}
  // User
  const users = [
    {
      username: 'super',
      email: 'super@super.com',
      password: '123456',
      profile: {
        fullName: 'Super',
        allowedBranches: ['001'],
          status: 'Active',
      },
      roles: 'super',
    },
    {
      username: 'admin',
      email: 'admin@admin.com',
      password: '123456',
      profile: {
        fullName: 'Admin',
        allowedBranches: ['001'],
        status: 'Active',
      },
      roles: 'admin',
    },
  ]

  // User
  if (Meteor.users.find().count() === 0) {
    // const data = EJSON.parse(Assets.getText('user-account.json'))
    users.forEach(({ username, email, password, profile, roles }) => {
      const userExists = Accounts.findUserByUsername(username)

      if (!userExists) {
        const userId = Accounts.createUser({
          username,
          email,
          password,
          profile,
        })
        Roles.addUsersToRoles(userId, roles)
      }
    })
  }
})
