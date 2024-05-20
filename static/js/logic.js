// There are multiple possible datasets we could use for our plot. I will store a couple
// in constants for use to use so it's easy to update the code if we want to switch.
const allDay = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
const allWeek = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const mFourPlusWeek = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson'


// Now we will grab our dataset and assign it to the "data" variable
// However, we don't want all the data in the JSON, we just want parts of the "features"
// section of the JSON since each 'feature' corresponds to an earthquake event. So, we will
// pass our results to an asynchronous function to organize our data.

d3.json(allWeek).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

// For the color coding of our earthquake depths, we will want to determine the color ranges
function getColor(depth) {
    return depth > 90  ? '#FF3333' :
           depth > 70  ? '#FF8333' :
           depth > 50  ? '#FFBE33' :
           depth > 30  ? '#FFE033' :
           depth > 10  ? '#E3FF33' :
                         '#9CFF33' ;
};

// The 'style' of the feature--in this case color--is determined by this function
function style(feature) {
    return {
        fillColor: getColor(feature.geometry.coordinates[2]),
        weight: 1,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7
    };
};

// Create a function that, when passed a particular feature (earthquake) determines its location, magnitude, etc.
// from our JSON
function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place, magnitude, and depth. Round the depth
    // to the nearest tenth of a kilometer.
    // The radius of the earthquake is proportional to the square of the magnitude since magnitudes are a
    // logrithmic function; this should give a better representation of relative energy for the event.
    function onEachFeatureFn(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag},
                             Depth (km): ${Math.round(feature.geometry.coordinates[2]*10)/10} </p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each event in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeatureFn,
        style: style,
        'pointToLayer': function(geoJsonPoint, latlng){
                        var circleMarker=L.circle(latlng, {
                            'radius': Math.pow(geoJsonPoint.properties.mag, 2)*10000,

                        });
                        return circleMarker
        }
      });
  
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }


function createMap(earthquakes) {

    // Create the base layer.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

        // Create our map, giving it the streetmap and earthquakes layers to display on load.
    // We will choose to center the map on the US (somewhere in Kansas) with a zoom level
    // that lets us see much of North America as the beginning data set
    let map = L.map('map', {
      center: [
        39.1, -96.6
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });

    // Create a legend to display information about our map.
    var legend = L.control({
        position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend".
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

        // loop through our depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

    return div
    };
    legend.addTo(map);
  };
