import mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Logs
interface LogAttrs {
  from: string;
  to: string;
  amount: string;
  precision: string;
}

// An interface that describes the properties
// that a Log Model has
interface LogModel extends mongoose.Model<LogDoc> {
  build(attrs: LogAttrs): LogDoc;
}

// An interface that describes the properties
// that a User Document has
interface LogDoc extends mongoose.Document {
  from: string;
  to: string;
  amount: string;
  precision: string;
}

const logSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  precision: {
    type: String,
    required: false,
  },
});

logSchema.statics.build = (attrs: LogAttrs) => {
  return new Log(attrs);
};

const Log = mongoose.model<LogDoc, LogModel>('User', logSchema);

export { Log };
