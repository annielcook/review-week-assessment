var mongoose = require('mongoose')
var _ = require('lodash')
var Task;
var Schema = mongoose.Schema;
var models = require('../models')

var TaskSchema = new Schema({
  // setup schema here
  parent: { type: Schema.Types.ObjectId, ref: 'Task'},
  name: { type: String, required: true },
  complete: { type: Boolean, required: true, default: false },
  due: Date
  
});


//virtuals

TaskSchema.virtual('timeRemaining').get(function() {
  if (!this.due) return Infinity;
  var now = new Date();
  return this.due - now;
})

TaskSchema.virtual('overdue').get(function() {
	var now = new Date();
	if(((this.due - now) < 0) && !this.completed) return true;
	return false;
})

//methods

TaskSchema.methods.addChild = function(params) {
	var this_parent = this;
	return new Promise(function(res, rej){
			var child = new Task (params);
			child.parent = this_parent._id
		 	res(child);
	})

}

TaskSchema.methods.getChildren = function() {
	var this_parent = this;
	return new Promise (function (res, rej) {
		console.log(Task.db.collections.tasks)
		Task.find({parent: this_parent._id}, function (err, data) {
			console.log(data);
			res (data);
		});
	})
}

TaskSchema.methods.getSiblings = function() {

}

Task = mongoose.model('Task', TaskSchema);


module.exports = Task;