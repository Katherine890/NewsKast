// Grab the articles as a json
// $.getJSON("/articles", function (data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>");
//   }
// });


$("#scrape").on("click", function (event) {
  //location.href = "index";
  // Grab the articles as a json
  $.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      //$("#articles").append(`<div data-class="article-div"><a target="_blank" href=${data[i].link}><p>${data[i].title}</p></a><p>${data[i].summary}</p></div>`);
       //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].summary + "</p>");
      //$("#articles").append("<div class=article-div>" + "<a target='blank' href='" + data[i].link + "'>" + "<p>" + data[i].title + "</p>" + "</a>" + "<p>" + data[i].summary + "</p>" + "</div>");
       $("#articles").append( "<div class=card>" + "<div class=card-header>" + "<a target='blank' href='" + data[i].link + "'>" + 
       "<h3>" + data[i].title + "</h3>" + "</a>" + "</div>" + "<div class=card-body>" + "<blockquote class=blockquote mb-0>" + 
       "<p>" + data[i].summary + "</p>" + "</blockquote>" + "<button id=saveButton  data-target=#savedArticles class=btn btn-primary>Save Article</button>" + 
       "<button data-id='" + data[i]._id + "' class=btn btn-primary>" + "Article Notes" + "</button>" + "</div>" + "</div>");
    }
  });
});

// $("#saveButton").on("click", function (data) {
//   event.preventDefault();

//   var saveName = $("#articles");
//   saveName.append("#savedArticles");
//   console.log("saved", saveName);
 


// })

// Whenever someone clicks a p tag
 //$(document).on("click", "p", function () {
  $(document).on("click", "button", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
