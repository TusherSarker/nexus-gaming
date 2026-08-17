import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    customerEmail: {
      type: String,
    },
    customerName: {
      type: String,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.Mixed,
          ref: 'Product',
        },
        name: String,
        price: Number,
        image: String,
        qty: Number,
      },
    ],
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    subtotal: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    promoCode: {
      type: String,
    },
    paymentMethod: {
      type: String,
      default: 'card',
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('save', function (next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = 'NXS-' + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

export default mongoose.model('Order', orderSchema);
