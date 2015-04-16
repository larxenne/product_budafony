Projects = new Mongo.Collection("projects");
Packs = new Mongo.Collection("packs");
Tasks = new Mongo.Collection("tasks");
Messages =  new Mongo.Collection("messages");

var Schemas = {};

// MESSAGE

Schemas.Message = new SimpleSchema({
  text: {
    type: String,
    label: "Text",
    max: 400
  },

  owner: {
    type: String,
    label: "Owner",
    max: 100
  },

  dateCreation: {
    type: Date,
    label: "Created at"
  },

  taskParent: {
    type: String,
    label: "Task Parent"
  }

});

// TASK

Schemas.Task = new SimpleSchema({
  title: {
    type: String,
    label: "title",
    max: 400,
    optional: true
  },

  color: {
    type: String,
    label: "Color",
    max: 100
  },

  number: {
    type: Number,
    label: "task number",
    min: 1

  },

  dateCreation: {
    type: Date,
    label: "Created at"
  },

  messages_id: {
    type: [String],
    optional: true
  },

  packParent: {
    type: String
  }

});

// PACK

Schemas.Pack = new SimpleSchema({
  letter: {
    type: String,
    label: "Letter",
    max: 1
  },

  title: {
    type: String,
    label: "Title",
    max:50,
    optional: true
  },

  isCompleted: {
    type: Boolean,
    label: "isCompleted"
  },

  dateCreation: {
    type: Date,
    label: "Created at"
  },

  tasks_id: {
    type: [String],
    optional: true
  },

  projectParent: {
    type: String
  }

});

// PROJECT

Schemas.Project = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },

  dateCreation: {
    type: Date,
    label: "Created at"
  },

  packs_id: {
    type: [String],
    optional: true
  },

});

Projects.attachSchema(Schemas.Project);
Packs.attachSchema(Schemas.Pack);
Tasks.attachSchema(Schemas.Task);
Messages.attachSchema(Schemas.Message);

Tasks.helpers({
  messages: function() {
    return Messages.find({ taskParent: this._id}, {sort: {dateCreation: -1}});
  }
});

Projects.helpers({
  packs: function() {
    return Packs.find({projectParent: this._id}, {sort: {dateCreation: -1}});
  }
});