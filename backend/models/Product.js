const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    sizes: {
      type: [String],
      required: true, // e.g. ["S", "M", "L"]
    },
    images: {
      type: [String], // Array of cloudinary URLs
      required: true,
    },
    brand: {
      type: String,
      required: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

// Optimize database queries
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
