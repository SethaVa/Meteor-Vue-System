import {
  Meteor
} from 'meteor/meteor'
import {
  Roles
} from 'meteor/alanning:roles'
import {
  Accounts
} from 'meteor/accounts-base'

import Branches from '../../api/branches/branches'
// import Groups from '../../api/user-groups/user-groups';

if (Meteor.isDevelopment) {
  // Company
  // if (Company.find().count() === 0) {
  //     const data = {
  //         "khName": "បាត់ដំបង",
  //         "khShortName": "បប",
  //         "enName": "Battambang",
  //         "enShortName": "BTB",
  //         "khAddress": "ខេត្តបាត់ដំបង",
  //         "enAddress": "Battambang Province",
  //         "telephone": "053 50 66 777",
  //         "email": "yuom.theara@gmail.com",
  //         "website": "http://rabbit-tech.com"
  //     };

  //     Company.insert(data);
  // }

  // Branch
  if (Branches.find().count() == 0) {
    const data = [{
      // name: 'Banan',
      // shortName: 'BN',
      // address: 'Battambang Province',
      // telephone: '053 50 66 777',
      // email: 'banan@gmail.com',mon
      _id: '001',
      name: 'Head Office',
      shortName: 'HO',
      address: 'Battambang Province',
      telephone: '08757645',
      email: 'admin@gmail.com',
    }, ]

    data.forEach(doc => {
      Branches.insert(doc)
    })
  }

  // User
  const users = [{
      username: "super",
      email: "super@super.com",
      password: "123456",
      profile: {
        fullName: "Super",
        branchPermissions: ["001"]
      },
      roles: "super"
    },
    {
      username: "admin",
      email: "admin@admin.com",
      password: "123456",
      profile: {
        fullName: "Admin",
        branchPermissions: ["001"]
      },
      roles: "admin"
    }
  ]

  // User
  if (Meteor.users.find().count() === 0) {
    // const data = EJSON.parse(Assets.getText('user-account.json'))
    users.forEach(({
      username,
      email,
      password,
      profile,
      roles
    }) => {
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
}