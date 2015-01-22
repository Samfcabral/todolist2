// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

// wait for window load
$(function () {

  // grab the `todos-con`
  var $todosCon = $("#todos-con");

  $.get("/todos.json")
    .done(function (todos) {
      console.log("All Todos:", todos);

      // append each todo
      todos.forEach(function (todo) {
        var $todo = $("<div class=\"todo\" data-id=" + todo.id + ">" + 
                            todo.content + 
                            "<input type=\"checkbox\" class=\"completed\">" +
                            "<button class=\"delete\">Delete</button></div>");

        $todo.find(".completed").attr("checked", todo.completed);

        if (todo.completed) {
          $todo.toggleClass("todo-complete")
        }

        $todosCon.append($todo);             
      });
  });

  var $todoForm = $("#new_todo")
  $todoForm.on("submit", function (event) { 
    event.preventDefault();
    console.log("Form submitted", $(this).serialize());

    var content = $("#todo_content").val();
    $.post("/todos.json", {
      todo: {
        content: content
      }
    }).done(function (createdTodo) {
         var $todo = $("<div class=\"todo\" data-id=" + createdTodo.id + ">" + 
                              createdTodo.content + 
                              "<input type=\"checkbox\" class=\"completed\">" +
                              "<button class=\"delete\">Delete</button></div>");

          $todo.find(".completed").attr("checked", createdTodo.completed)
          $todosCon.append($todo); 
    });
  });

  // setup a click handler that only
  //  handle clicks from an element
  //  with the `.delete` className
  //  that is inside the $todosCon
  $todosCon.on("click", ".delete", function (event) {
    alert("I was clicked!");

    // grab the entire todo
    var $todo = $(this).closest(".todo");

    // send our delete request
    $.ajax({
      // grab the data-id attribute
      url: "/todos/" + $todo.data("id") + ".json",
      type: "DELETE"
    }).done(function (){
      // once we completed the delete
      $todo.remove();
    })
  });

  // we are waiting for a click on a checkbox
  $todosCon.on("click", ".completed", function () {
    //grab the todo
      var $todo = $(this).closest(".todo");

      $.ajax({
        // use the data-id to make the URL
        url: "/todos/" + $todo.data("id") + ".json",
        type: "PATCH",
        data: {
          todo: {
            completed: this.checked
          }
        }
      }).done(function (data) {
        //console.lot the data
        console.log("UPDATED: ", data)

        // update the styling of our todo
        $todo.toggleClass("todo-complete")
      })
    });

});