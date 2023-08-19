import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'must provide a title'],
      trim: true,
      maxLength: [40, 'title cannot be more than 40 characters'],
    },
    body: {
      type: String,
      required: [true, 'must provide body '],
      trim: true,
      maxLength: [200, 'body cannot be more than 200 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'must provide userId for a new task'],
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model('Task', TaskSchema);

export default TaskModel;
