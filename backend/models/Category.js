const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before saving if not exists
categorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[\s_]+/g, '-');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
