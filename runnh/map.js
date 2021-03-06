DebugOverlay.prototype = new google.maps.OverlayView();

function DebugOverlay(bounds, image, map) {
  this.bounds_ = bounds;
  this.image_ = image;
  this.map_ = map;
  this.div_ = null;
  this.setMap(map);
}

DebugOverlay.prototype.onAdd = function() {

  var div = document.createElement('div');
  div.style.borderStyle = 'none';
  div.style.borderWidth = '0px';
  div.style.position = 'absolute';
  var img = document.createElement('img');
  img.src = this.image_;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.opacity = '0.8';
  img.style.position = 'absolute';
  div.appendChild(img);
  this.div_ = div;
  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);
};

DebugOverlay.prototype.draw = function() {
  var overlayProjection = this.getProjection();
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';
};

DebugOverlay.prototype.updateBounds = function(bounds){
  this.bounds_ = bounds;
  this.draw();
};

DebugOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

function applyMarkers(swBound, neBound, overlay, map) {
  var markerA = new google.maps.Marker({
    position: swBound,
    map: map,
    draggable:true
  });

  var markerB = new google.maps.Marker({
    position: neBound,
    map: map,
    draggable:true
  });

  google.maps.event.addListener(markerA,'drag', function(){
    var newPointA = markerA.getPosition();
    var newPointB = markerB.getPosition();
    var newBounds =  new google.maps.LatLngBounds(newPointA, newPointB);
    overlay.updateBounds(newBounds);
  });

  google.maps.event.addListener(markerB,'drag', function(){
    var newPointA = markerA.getPosition();
    var newPointB = markerB.getPosition();
    var newBounds =  new google.maps.LatLngBounds(newPointA, newPointB);
    overlay.updateBounds(newBounds);
  });

  google.maps.event.addListener(markerA, 'dragend', function() {
    var newPointA = markerA.getPosition();
    var newPointB = markerB.getPosition();
    console.log("point1"+ newPointA);
    console.log("point2"+ newPointB);
  });

  google.maps.event.addListener(markerB, 'dragend', function() {
    var newPointA = markerA.getPosition();
    var newPointB = markerB.getPosition();
    console.log("point1"+ newPointA);
    console.log("point2"+ newPointB);
  });
}

function addLayer(layer) {
  var swBound = new google.maps.LatLng(layer.position.sw[0], layer.position.sw[1]);
  var neBound = new google.maps.LatLng(layer.position.ne[0], layer.position.ne[1]);
  var bounds = new google.maps.LatLngBounds(swBound, neBound);

  var overlay = new DebugOverlay(bounds, layer.url, this.map);

  if (this.movable) {
    applyMarkers(swBound, neBound, overlay, this.map);
  }
};

var maps = [
  {
    name: 'West Rock',
    url: 'maps/westrock.png',
    position: { sw: [41.32708472242821, -73.007609431123],
                ne: [41.4196322018014, -72.91313148617854] }
  },
  {
    name: 'East Rock',
    url: 'maps/eastrock.png',
    position: { sw: [41.31428920200999, -72.92332369503902],
                ne: [41.34351046715718, -72.8936479198943] }
  },
  {
    name: 'Maltby Lakes',
    url: 'maps/maltbylakes.png',
    position: { sw: [41.29933105219036, -72.99546438870357],
                ne: [41.31482903008587, -72.96855665326223] }
  },
  {
    name: 'Edgewood Park',
    url: 'maps/edgewoodpark.png',
    position: { sw: [41.31212950873465, -72.96162563977168],
                ne: [41.326577055389386, -72.9468844044219] }
  },
  {
    name: 'West River Memorial Park',
    url: 'maps/westriver.png',
    position: { sw: [41.29630031935377, -72.96334225354121],
                ne: [41.314941846982975, -72.94761396527394] }
  },
  {
    name: 'Historic Indian Trails',
    url: 'maps/indiantrails.png',
    position: { sw: [41.33030737932233, -73.00074297604488],
                ne: [41.35208022106614, -72.98151708722219] }
  },
  {
    name: 'Race Brook Tract',
    url: 'maps/racebrooktract.png',
    position: { sw: [41.301354149183624, -73.0199475925915],
                ne: [41.315997481345065, -73.00382233739003] }
  },
  {
    name: 'Race Brook Estates',
    url: 'maps/racebrookestates.png',
    position: { sw: [41.3423345382991, -73.01054913220332],
                ne: [41.35100906351358, -72.99729920506581] }
  },
  {
    name: 'Bishop Estates',
    url: 'maps/bishopestate.png',
    position: { sw: [41.35792706493516, -72.98493940052913],
                ne: [41.37501325987299, -72.96823478818044] }
  },
  {
    name: 'Bishop West',
    url: 'maps/bishopwest.png',
    position: { sw: [41.35944101631607, -72.99120504078792],
                ne: [41.376784436422305, -72.97838426709279] }
  },
];

var movable = false;

function initialize() {
  var mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(41.32708472242821,-73.007609431123),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  maps.forEach(addLayer, {map: map, movable: movable});

  var styles = [
  {
    "featureType": "water",
    "stylers": [
      { "hue": "#00f6ff" },
      { "saturation": -48 }
    ]
  },{
    "featureType": "road.arterial",
    "stylers": [
      { "hue": "#ffc300" },
      { "saturation": 73 }
    ]
  },{
    "featureType": "poi.park",
    "stylers": [
      { "hue": "#00fff7" },
      { "lightness": 100 }
    ]
  }
];

map.setOptions({styles: styles});
}

initialize();
//google.maps.event.addDomListener(window, 'load', initialize);
