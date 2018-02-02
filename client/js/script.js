var addToLibraryValue = true;

$(function(){
	var searchField = $('#query');
	var icon = $('#search-btn');


	// Focus Event Handler
	$(searchField).on('focus', function(){
		$(this).animate({
			width:'100%'
		}, 400);
		$(icon).animate({
			right: '10px'
		}, 400);
	});



	//Blur Event Handler

	$(searchField).on('blur', function(){
		if(searchField.val() == ''){
			$(searchField).animate({
				width: '45%'
			}, 400, function(){});
			$(icon).animate({
				right: '360px'
			}, 400, function(){});
		}
	});

	$('#search-form').submit(function(e){
		e.preventDefault()
	});
})



function search(){
	
	//Clear Results
	$('#results').html('');
	$('#buttons').html('');


	//Get Form Input
	q = $('#query').val();
	alert(q)
	//Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			type: 'video',
			key: 'AIzaSyBJ8LPolgSeWdEEWumqX9wBOF27G4jwCy0'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				//Log Data
				console.log(data);

				$.each(data.items, function(i, item){
					var output = getOutput(item);

					//Display Results
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken)

				//Display Buttons
				$('#buttons').append(buttons)
			}

		);

}


//Next Page Function
function nextPage(){

	var token = $('#next-button').data('token');
	var q = $('#next-button').data('query');
	alert(token)
	alert(q)

	//Clear Results
	$('#results').html('');
	$('#buttons').html('');


	//Get Form Input
	q = $('#query').val();
	alert(q)
	//Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type: 'video',
			key: 'AIzaSyBJ8LPolgSeWdEEWumqX9wBOF27G4jwCy0'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				//Log Data
				console.log(data);

				$.each(data.items, function(i, item){
					var output = getOutput(item);

					//Display Results
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken)

				//Display Buttons
				$('#buttons').append(buttons)
			}

		);

}



//Previous Page Button

function prevPage(){

	var token = $('#prev-button').data('token');
	var q = $('#prev-button').data('query');
	alert(token)
	alert(q)

	//Clear Results
	$('#results').html('');
	$('#buttons').html('');



	//Get Form Input
	q = $('#query').val();
	alert(q)
	//Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part: 'snippet, id',
			q: q,
			pageToken: token,
			type: 'video',
			key: 'AIzaSyBJ8LPolgSeWdEEWumqX9wBOF27G4jwCy0'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				//Log Data
				console.log(data);

				$.each(data.items, function(i, item){
					var output = getOutput(item);

					//Display Results
					$('#results').append(output);
				});

				var buttons = getButtons(prevPageToken, nextPageToken)

				//Display Buttons
				$('#buttons').append(buttons)
			}

		);
}

// Build Output

function getOutput(item){
	var videoId = item.id.videoId;
	// alert("videoId")
	// alert(videoId)
	var title = item.snippet.title;
	console.log(title)
	var description = item.snippet.description;
	var thumb = item.snippet.thumbnails.high.url;
	var channelTitle = item.snippet.channelTitle;
	var videoDate = item.snippet.publishedAt;

	var url = "/video_id/" + videoId;
	// alert(thumb)
	//Build Output String
	var output =
	'<li>'+
	'<div class="list-left">'+
	'<a href = "https://www.youtube.com/embed/' + videoId +'"> <img src="'+thumb+'"></a>'+
	'</div>'+ 
	'<div class = "list-right">'+
	'<h3> <a href = "https://www.youtube.com/embed/' + videoId +'">' + title + '</a></h3>'+
	'<small> By <span class="cTitle">' + channelTitle + '</span> on ' + videoDate + '</small>'+
	'<p>' + description + '</p>'+
	'</div>'+
	'<a href=' + url + ' onclick = "return postToDB(\'' + videoId + '\', \'' + thumb + '\', \'' + title + '\');" >Library <img src= ../img/tag-icon.png style = "width:3%;></a>"'+
	'</li>'+
	'<div class = "clearfix"></div>'+
	'';
	// console.log("addToLibrary")
	// console.log(addToLibraryValue)
	alert(output)

	return output;
	
	
}


// function addToLibrary(){
// 	console.log("in addToLibrary")
// 	if(addToLibraryValue){
// 		console.log("in if")
// 		$('#myLnk').click(function(event){
// 		  event.preventDefault();
// 		  var data = {
// 		  	video_id : $("#myLnk").data("video_id"),
// 		  	thumb : $("#myLnk").data("thumb"),
// 		  	title : $("#myLnk").data("title")
// 		  }
// 		  console.log(data);
// 		  postToDB(data);
// 		});
// 		addToLibraryValue = false;
// 	}
// }

function postToDB(videoId, thumb, title){

	console.log("postToDB")
	var data = {
		  	video_id : videoId,
		  	thumb : thumb,
		  	title :title
		  }
	alert(data.title)
	$.ajax({
		type: "POST",
		url: "/api/Videos",
		dataType : 'json',
		data : data,
		success : function (response) {
			console.log(response)
		},
		error: function (response) {
	    alert("ERROR")
	}
	
});

}



// Build the buttons

function getButtons(prevPageToken, nextPageToken){
	if(!prevPageToken){
		var btnoutput = '<div class="button-container">'+
		'<button id = "next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"'+
		'onclick="nextPage();">Next Page</button></div>';
	} else{
		var btnoutput = '<div class="button-container">'+
		'<button id = "prev-button" class="paging-button" data-token="'+prevPageToken+'" data-query="'+q+'"'+
		'onclick="prevPage();">Prev Page</button>'+
		'<button id = "next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"'+
		'onclick="nextPage();">Next Page</button></div>';
	}

	return btnoutput;
}