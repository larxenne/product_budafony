Meteor.methods({

  // PROJECT

  addProject: function(title) {

    isConnected();

    Projects.insert({
      title: title,
      dateCreation: new Date(),
      packs_id: []
    })
  },

  deleteProject: function(projectId) {

    isConnected();

    var project = Projects.findOne({"_id":projectId});

    project.packs_id.forEach(function(entry) {
      Meteor.call("deletePack", entry);
    });

    Projects.remove(projectId);

  },

  // PACK

  addPack: function(projectParent) {

    isConnected();

    var letter_table = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "U", "V", "W", "X", "Y", "Z"];

    var current_letter = Packs.findOne({"projectParent":projectParent},{sort:{letter:-1}});

    if (current_letter == undefined) {
      var letter = "A";
    }
    else {

      var current_letter_index = letter_table.indexOf(current_letter.letter);
      var letter_index = current_letter_index + 1;

      var letter = letter_table[letter_index];
    }

    Packs.insert({
      letter: letter,
      isCompleted: false,
      dateCreation: new Date(),
      tasks_id: [],
      projectParent: projectParent
    }, function(error, _id) {

      Projects.update({
        "_id": projectParent
      }, {
        $push: {packs_id: _id}
      });

    });
  },

  deletePack: function(packId) {

    isConnected();

    var pack = Packs.findOne({"_id":packId});
    var pack_parent = pack.projectParent;

    pack.tasks_id.forEach(function(entry) {
      Meteor.call("deleteTask", entry);
    });

    Packs.remove(packId);

    Projects.update({
      "_id": pack_parent
    }, {
      $pull: {packs_id: packId}
    });

  },

  completePack: function (taskId, check) {

    isConnected();

    Packs.update({
      "_id": taskId
    }, {
      $set: {"isCompleted": check}
    });
  },

  // TASK

  addTask: function(title, packParent) {

    isConnected();

    var current_number = Tasks.findOne({"packParent":packParent},{sort:{number:-1}});

    if (current_number == undefined) {
      var number = 1;
    }
    else {
      number = current_number.number + 1;
    }

    Tasks.insert({
      title: title,
      color: "white",
      number: number,
      dateCreation: new Date(),
      messages_id: [],
      packParent: packParent
    }, function(error, _id) {

      Packs.update({
        "_id": packParent
      }, {
        $push: {tasks_id: _id}
      });

    });
  },

  deleteTask: function(taskId) {

    isConnected();

    var task = Tasks.findOne({"_id":taskId});
    var task_parent = task.packParent;

    task.messages_id.forEach(function(entry) {
      Meteor.call("deleteMessage", entry);
    });

    Tasks.remove(taskId);

    Packs.update({
      "_id": task_parent
    }, {
      $pull: {tasks_id: taskId}
    });

  },

  changeColorTask: function (taskId, color) {

    isConnected();

    Tasks.update({
      "_id": taskId
    }, {
      $set: {"color": color}
    });
  },

  // MESSAGE

  addMessage: function(text, taskParent) {

    isConnected();

    Messages.insert({
      text: text,
      owner: Meteor.user().username,
      dateCreation: new Date(),
      taskParent: taskParent
    }, function(error, _id) {

      if (error =="undefined" ) {
        Tasks.update({
          "_id": taskParent
        }, {
          $push: {messages_id: _id}
        });
      };

      var task_parent = Tasks.findOne({"_id":taskParent});

    });
    
  },

  deleteMessage: function(taskId) {

    isConnected();

    var message = Messages.findOne({"_id":taskId});
    var message_parent = message.taskParent;

    var task_parent = Tasks.findOne({"_id":message_parent});

    Messages.remove(taskId);

    Tasks.update({
      "_id": message_parent
    }, {
      $pull: {messages_id: taskId}
    });

  },
});

function isConnected() {
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-authorized");
  }
}