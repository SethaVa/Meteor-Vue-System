import SimpleSchema from 'simpl-schema';

const UsersSchema = new SimpleSchema({
    username: {
        type: String,
        max: 30
    },
});

export default UsersSchema;
