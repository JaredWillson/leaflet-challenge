# leaflet-challenge
Visualization page for most recent week of USGS Earthquakes

This repository presents a web page (index.html) that will display a map showing the latest earthquakes detected by the United States Geoligical Survey. It pulls the most recent week of data from the USGS earthquake feed, plots all events on a world map, and provides data on location, magnitude, and depth of the earthquake. The size of the markers for all events is determined by the magnitude of the earthquake, and the color of the marker is determined by the depth with green earthquakes representing shallow events, and red earthquakes representing deep events.

## Data Source
![](Images/1-Logo.png)

The USGS provides a a near-real-time public domain feed on all earthquake events detected on its [earthquake feed]("https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php") website. Different datasets are provided depending on what magnitude events you wish to see and how far back in time you wish to look. This repo plots all events from the previous week. 

OpenStreetMap is used for the base layer for plotting earthquake locations.

## Approach
the main index.html page invokes Leaflets (for interactive maps), a Leaflet CSS, D3 for parsing the USGS data feed, and a local CSS for some additional formatting. In addition, body of the index.html file calls a javascript file called logic.js. This contains code to perform the following tasks:
- Creates constants to allow the datasource to be easily updated
- Uses D3 to generate a dataset from the USGS JSON
- Uses a function to determine the color values for different ranges of earthquake depths
- Loops through the different earthquake events and creates a layer for the markers for the events
- Plots the events with the radius of the marker correlated with magnitude of the earthquake and color correlated with depth
- Provides a tooltip for each earthquake displaying location, magnitude, and depth in km
- Provides a legend showing which colors correspond with which depth ranges
