Meteor.startup(function () {

  Meteor.publish("projects", function () {
    return Projects.find();
  });

  Meteor.publish("packs", function () {
    return Packs.find();
  });

  Meteor.publish("tasks", function () {
    return Tasks.find();
  });

  Meteor.publish("messages", function () {
    return Messages.find();
  });
});