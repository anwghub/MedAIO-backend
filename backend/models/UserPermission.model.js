import mongoose from 'mongoose';
//import Permission from './Permission.model';

const UserPermissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    permissions: [{
        permission_name: String,
        permission_value: [Number]  // 0 -> create, 1 -> read, 2 -> edit, 3 -> delete
    }]
});

export default mongoose.model("UserPermission", UserPermissionSchema);
