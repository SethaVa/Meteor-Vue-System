import {
  Meteor
} from 'meteor/meteor'
import {
  Mongo
} from 'meteor/mongo'

const ClassView = new Mongo.Collection('sch_classView')
export default ClassView

if (Meteor.isServer) {
  const db = ClassView.rawDatabase()

  // Drop before create
  db.dropCollection('sch_classView', (err, res) => {
    db.createCollection('sch_classView', {
      viewOn: 'sch_classStudy',
      pipeline: [{
          $lookup: {
            from: "sch_rooms",
            localField: "roomId",
            foreignField: "_id",
            as: "roomDoc"
          }
        },
        {
          $unwind: {
            path: '$roomDoc',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "sch_timeStudy",
            localField: "timeId",
            foreignField: "_id",
            as: "timeDoc"
          }
        },
        {
          $unwind: {
            path: '$timeDoc',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "sch_staffs",
            localField: "staffId",
            foreignField: "_id",
            as: "staffDoc"
          }
        },
        {
          $unwind: {
            path: '$staffDoc',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "sch_subjects",
            localField: "subId",
            foreignField: "_id",
            as: "subjectDoc"
          }
        },
        {
          $unwind: {
            path: '$subjectDoc',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "sch_rateSalary",
            localField: "rateId",
            foreignField: "_id",
            as: "rateDoc"
          }
        },
        {
          $unwind: {
            path: '$rateDoc',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            "code": {
              $last: "$code"
            },
            "classDate": {
              $last: "$classDate"
            },
            "roomId": {
              $last: "$roomId"
            },
            "timeId": {
              $last: "$timeId"
            },
            "staffId": {
              $last: "$staffId"
            },
            "subId": {
              $last: "$subId"
            },
            "type": {
              $last: "$type"
            },
            "status": {
              $last: "$status"
            },
            "rateId": {
              $last: "$rateId"
            },
            branchId: {
              $last: '$branchId'
            },
            time: {
              $last: "$timeDoc.timeStudy"
            },
            room: {
              $last: "$roomDoc.name"
            },
            staffName: {
              $last: "$staffDoc.name"
            },
            subjectName: {
              $last: "$subjectDoc.title"
            },
            rate: {
              $last: "$rateDoc.name"
            }
          }
        }
      ],
    })
  })
}