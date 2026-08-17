import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a subscription name'],
      enum: ['Starter', 'Pro', 'Elite'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    monthlyPrice: {
      type: Number,
      required: [true, 'Please add a monthly price'],
    },
    annualPrice: {
      type: Number,
      required: [true, 'Please add an annual price'],
    },
    features: [
      {
        type: String,
      },
    ],
    excludedFeatures: [
      {
        type: String,
      },
    ],
    badge: {
      type: String,
    },
    accentColor: {
      type: String,
      enum: ['silver', 'cyan', 'gold'],
    },
    maxProfiles: {
      type: Number,
    },
    streamQuality: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model('Subscription', subscriptionSchema);
