'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  author: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  }
});

/**
 * Validations
 * TODO: Should not be longer than 140 chars
 */
ArticleSchema.path('content').validate(function(content) {
  return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
ArticleSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};


try {
  mongoose.model('Article', ArticleSchema);
} catch(e) {}
