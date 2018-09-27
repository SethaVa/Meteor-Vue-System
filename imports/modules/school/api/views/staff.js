import {
  Meteor
} from 'meteor/meteor'
import {
  Mongo
} from 'meteor/mongo'

const StaffView = new Mongo.Collection('sch_staffView')
export default StaffView

if (Meteor.isServer) {
  const db = StaffView.rawDatabase()

  // Drop before create
  db.dropCollection('sch_staffView', (err, res) => {
    db.createCollection('sch_staffView', {
      viewOn: 'sch_staffs',
      pipeline: [{
          $lookup: {
            from: "sch_position",
            localField: "positionId",
            foreignField: "_id",
            as: "posDoc"
          }
        },
        {
          $group: {
            _id: '$_id',

            "name": {
              $last: "$name"
            },
            "gender": {
              $last: "$gender"
            },
            "dob": {
              $last: "$dob"
            },
            "tel": {
              $last: "$tel"
            },
            "positionId": {
              $last: "$positionId"
            },
            position: {
              $last: "$posDoc.position"
            },
            "baseSalary": {
              $last: "$baseSalary"
            },
            "branchId": {
              $last: "$branchId"
            }
          }
        }
      ],
    })
  })
}