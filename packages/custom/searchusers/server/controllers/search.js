'use strict';

 var mongoose =require('mongoose'),
 	User = mongoose.model('User');

 exports.username = function (req, res, next, id) {

 };

 exports.search = function(req, res) {
 	console.error(req);
 	User.find({ 'username': new RegExp(req.param.username, "i") }, function (err, results) {
 		res.json(results);
 	});
 };