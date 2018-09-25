import {
  Meteor
} from 'meteor/meteor'
import {
  Mongo
} from 'meteor/mongo'

const SubjectView = new Mongo.Collection('sch_subjectView')
export default SubjectView

if (Meteor.isServer) {
  const db = SubjectView.rawDatabase()

  // Drop before create
  db.dropCollection('sch_subjectView', (err, res) => {
    db.createCollection('sch_subjectView', {
      viewOn: 'sch_subjects',
      pipeline: [{
          $lookup: {
            from: "sch_level",
            localField: "levelId",
            foreignField: "_id",
            as: "levelDoc"
          }
        },
        {
          $unwind: {
            path: '$levelDoc',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            "level": {
              $last: "$levelDoc.level"
            },
            "title": {
              $last: "$title"
            },
            "type": {
              $last: '$type'
            },
            "levelId": {
              $last: "$levelId"
            },
            "status": {
              $last: "$status"
            },
          }
        }
      ],
    })
  })
}