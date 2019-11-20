console.log('location details');

//use case : Yacht Club Registeration fee special rate within 15 Days
// Depending on the number of days the user books, fees to be calculated

$('#map').hide();

$(document).ready(function(){
  $('#details').click(function(){
    $('#map').show();

    //reading user data
    var place=document.getElementById('place').value;
    var duration = document.getElementById('duration').value;
    console.log(place,duration);
    initMap(place,duration);
  });

});

//date calculation with date pickers

$("#startDate").datepicker({
  dateFormat: 'yy-mm-dd',
  changeMonth: true,
  minDate: new Date(),
  maxDate: '+1y',
  onSelect: function(date){

      var selectedDate = new Date(date);
      var msecsInADay = 86400000;
      var stDate = new Date(selectedDate.getTime() + msecsInADay);

     //Set Minimum Date of EndDatePicker After Selected Date of StartDatePicker
      $("#endDate").datepicker( "option", "minDate", stDate );
      var enDate = new Date(selectedDate.getTime() + 15 * msecsInADay);


      $("#endDate").datepicker( "option", "maxDate", enDate );

  }
});

$("#endDate").datepicker({
  dateFormat: 'yy-mm-dd',
  changeMonth: true
});

//Find the number of days between dates
function dateDiff() {

  var start = $('#startDate').datepicker('getDate');
  var end = $('#endDate').datepicker('getDate');
  var days   = (end - start)/1000/60/60/24;


  document.getElementById("noDays").value = days ;
  return;
}



$('#submit1').click(function(){
  dateDiff();
});

//accessing apiKey from external JSON file
var myKey = JSON.parse(apiKey);
console.log(myKey[0].key);


//array of objects for place details
var locations = [
  {
    name : "Lyall Bay",
    place: "Wellington",
    distance : "5.6 Km",
    travelDuration: 19,
    lat:-41.3269,
    long:174.7953
  },
  {
    name : "Days Bay",
    place: "Wellington",
    distance : "23.5 Km",
    travelDuration: 40,
    lat:-41.2816,
    long:174.9068
  },
  {
    name : "Oriental Bay",
    place: "Wellington",
    distance : "1.6 Km",
    travelDuration: 7,
    lat:-41.2913,
    long:174.7941
  },
  {
    name : "Island Bay",
    place: "Wellington",
    distance : "5.6 Km",
    travelDuration: 17,
    lat:-41.3357,
    long:174.7732
  },
  {
    name : "Lion Rock",
    place: "Auckland",
    distance : "40.2 km",
    travelDuration: 52,
    lat: -36.9539,
    long: 174.4655
  },
  {
    name : "Charcoal Bay",
    place: "Auckland",
    distance : "17.5 km",
    travelDuration: 26,
    lat: -36.8017,
    long: 174.6855
  }
] //end of array of objects


//dynamically creating script tag and appending to the html body including the apikey
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key='+ myKey[0].key ;
document.getElementsByTagName('body')[0].appendChild(script);

//function to bring map and its components
function initMap(p,d){
  console.log(p,d);

 var oldwindow;

 var center;
  //center coordinates based on user input
  if (p === "Wellington") {
   center = {lat: -41.2911449, lng: 174.7814447};

  } else if (p === "Auckland"){
    center = {lat:-36.8485 , lng:174.7633 };
  }

  //map object - compulsory requirement zoom and center.
  var map = new google.maps.Map(
      document.getElementById('map'), {
      zoom:10,
      center: center,
      mapTypeId : 'roadmap',
      styles :[
        {
          featureType : 'water',
          stylers:[
              {
                color: "#48dbfb"
              }
          ]
        },
        {
          featureType : 'road',
          elementType : 'geometry',
          stylers:[
              {
                lightness: '-40'
              }
          ]
        },
        {
          featureType : 'road',
          elementType : 'labels.text.fill',
          stylers:[
              {
                color: "#34495e"
              }
          ]
        },
        {
          featureType : 'landscape',
          stylers:[
              {
                color: "#2ecc71"
              }
          ]
        }

      ]
    });//end of map objects

// loop through all the objects in the array locations
    for ( var i = 0; i<locations.length; i++){
      console.log(p,typeof(p), d, typeof(d));
      console.log(locations[i].place, typeof(locations[i].place));
      console.log(locations[i].travelDuration, typeof(locations[i].travelDuration));
      console.log(locations[i].place === p);
      console.log(locations[i].travelDuration <= d);

      // conditional display of markers
      if (locations[i].place === p && locations[i].travelDuration <= d){

      //create content dynamically
      var content = '<div class="bg-primary h4" id="' + locations[i].id + '">' +
      '<h5> '+ locations[i].name + '</h5>' +
      '<h6>'+ locations[i].place + '</h6>' +
      '<h6>Distance: '+ locations[i].distance + '</h6>'+
      '<h6>Duration: '+ locations[i].travelDuration + ' min</h6>' +
      '<h6> from the nearest i-site visitor\'s information center</h6>'+
      '</div>';

      // create infowindow
      var infowindow = new google.maps.InfoWindow({
        content : content
      });

      //position to add marker
      var position = {lat:locations[i].lat , lng:locations[i].long };

      // create customized icon and resize
      var myIcon = {
        url : 'http://maps.google.com/mapfiles/kml/shapes/sailing.png',
        scaledSize: new google.maps.Size(50, 50)
      };

      //create marker
      var marker = new google.maps.Marker({
        position : position,
        map : map,
        icon: myIcon
      });

      newWindow(marker, infowindow); //call function to open infowindow on marker click

      function newWindow(newMarker, newInfowindow){

        newMarker.addListener('click', function(){
          //close existing infowindow
          if (oldwindow){
            oldwindow.close();
          }
          //open new infowindow
          newInfowindow.open(map, newMarker);
          oldwindow=newInfowindow;

        });//end of addListener
      }//end of newwindow function


     }
    }//end of for

}//end of initMap
