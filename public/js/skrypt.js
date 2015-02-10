

$("#bottom").click(function(event){
	$("#target").load("../"+ event.target.className.split(" ")[0] +".html");
});


var out = "";

$.get('http://api.openweathermap.org/data/2.5/weather?q=Gdansk,pl', function(data){
var temp1 = Math.round(data.main.temp - 273.15);
out += " temp: " + temp1 + "*C" + " cisn: " + data.main.pressure + "hPa";
 $('#weather').html(out);
	out = "";
	
	socket.on('update temperature', function(temperature) {
	
		console.log(temperature);

		$('#temperatura').html(temperature);	
	});

	setInterval (function(){
		var rand = Math.floor((Math.random() * 1000000) + 1);
		$('#right3').html('<img src="../../image.jpg?nocache='+rand+'"></img>');
		$('#test').html('<img src="../../image1.jpg?nocache='+rand+'"></img>');

		console.log('aaa');
			
	}, 10000);	
});



function buttonClick(clicked_id){

  if (clicked_id == "1"){
    $.ajax({
      type: 'GET',
      url: '/send',
      async: false,
      data: {state: 'on'},
      success: function( data ) {
        json_data = jQuery.parseJSON(data);
      }
    });  
  } 

  if (clicked_id == "2"){
    $.ajax({
      type: 'GET',
      url: '/send',
      async: false,
      data: {state: 'off'},
      success: function( data ) {
        json_data = jQuery.parseJSON(data);
      }
    });  
  }  
};
var socket = io();




