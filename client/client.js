Meteor.subscribe("projects");
Meteor.subscribe("packs");
Meteor.subscribe("tasks");
Meteor.subscribe("messages");

Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});

// BODY

Template.body.helpers({
	tasks: function() {

		var selected_pack = Session.get('selectedPack');

		return Tasks.find({packParent: selected_pack}, {sort: {dateCreation: -1}});
	},

	projects: function() {
		return Projects.find({}, {sort: {dateCreation: -1}});
	}
});

Template.body.events({
	'submit .new-message': function (event) {

		var title = document.getElementById("message").value;
		var selected_pack = Session.get('selectedPack');

		if (selected_pack === undefined) {
			alert('Select a pack first!');
		}
		else {
			Meteor.call("addTask", title, selected_pack);
			event.target.text.value = "";
		}
		
		return false;
	},

	'submit .new-project': function (event) {

		var title = document.getElementById("project").value;

		Meteor.call("addProject", title);

		return false;
	},
});

// PROJECT

Template.project.helpers({

	selectedProject: function() {

		var project_id = this._id;
		var selected_project = Session.get('selectedProject');

		if (project_id == selected_project) {
			return "selected_project";
		};

	}

});

Template.project.events({
	"click .project_container": function(event) {

		var project_id = this._id;

		Session.set('selectedProject', project_id);

		var selected_project = Session.get('selectedProject');
		
	},

	"click .add_pack": function() {
		Meteor.call("addPack", this._id);
	},

	"click .delete": function() {
		Meteor.call("deleteProject", this._id);
	},
});

// PACK

Template.pack.helpers({
	selectedPack: function() {

		var pack_id = this._id;
		var selected_pack = Session.get('selectedPack');

		if (pack_id == selected_pack) {
			return "selected_pack";
		};
	}
});

Template.pack.events({

	"click .pack_container": function(event) {

		var pack_id = this._id;

		Session.set('selectedPack', pack_id);

		var selected_pack = Session.get('selectedPack');
		
	},

	"click .delete": function(event) {
		Meteor.call("deletePack", this._id);
		var selected_pack = Session.get('');
	},

	"click .complete": function(event) {

		var is_checked = !this.isCompleted;

		Meteor.call("completePack", this._id, is_checked);
	},

	"submit .pack_title_form": function(event) {

		var title = event.target.pack_title.value;
		console.log(title);
		
		Meteor.call("changeTitlePack", this._id, title);

		return false;
	}
});

// TASK

Template.task.helpers({
	colorTask: function() {

		var color = this.color;
		var color_class = "task_"+color;

		return color_class;
	},

	selectedColor: function(color) {

		var actual_color = this.color;

		if (actual_color == color) {
			return "selected";
		}
		else {
			return "";
		}

	},

	selectedTask: function() {

		var task_id = this._id;
		var selected_task = Session.get('selectedTask');

		if (task_id == selected_task) {
			return "selected_task";
		};
	}
});

Template.task.events({
	"click .delete": function(event) {
		Meteor.call("deleteTask", this._id);
	},

	"submit .new-message": function(event) {
		var message = event.target.message.value;

		Meteor.call("addMessage", message, this._id);

		event.target.message.value = "";
		return false;
	},

	"change .task_color": function(event) {

		var color = event.target.value;

		Meteor.call("changeColorTask", this._id, color);
	},

	"click .task_container": function(event) {

		var task_id = this._id;

		Session.set('selectedTask', task_id);

		var selected_pack = Session.get('selectedTask');

	}

});

// MESSAGE

Template.message.helpers({

});

Template.message.events({
	"click .delete": function(event) {
		Meteor.call("deleteMessage", this._id);
	}

});