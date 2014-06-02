function LogBuilder (start) {
  var values = [];
  if (start){
    values.push( start );
  }

  return {
    customAppend: function (value) {
      values.push( (new Date()) +": " + value);
      app.log_container(values.join(''));
    },
    toString: function () {
      return values.join('');
    }
  };
};

var app = {
  // Application Constructor
  initialize: function() {
    this.log = new LogBuilder(app.log_container());

    this.chain_length = 5;

    this.bindEvents();
  },
  log_container: function(data){
    var out = void 0;
    if (typeof data != "undefined"){
      data = data || false;
      if (data){
        window.localStorage.setItem("log_container", data);
        out = data;
      } else {
        window.localStorage.removeItem("log_container");
        out = {};
      }
    } else {
      out = window.localStorage.getItem("log_container") ? window.localStorage.getItem("log_container") : "";
    }
    return out;
  },

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady: function() {
    console.log("onDeviceReady invoked");
    app.deferred_chaining();
//    app.collectGeoPosition();
  },
  collectGeoPosition: function(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
            app.appendToContainer("position success: " + JSON.stringify(position));
            setTimeout(app.collectGeoPosition, 35000);
          }, function(error){
            app.appendToContainer("position error: " + JSON.stringify(error));
            setTimeout(app.collectGeoPosition, 35000);
          },
          {timeout:30000, maximumAge: 0, enableHighAccuracy: false});

    } else {
      app.appendToContainer("navigator.geolocation is undefined");
      setTimeout(app.collectGeoPosition, 35000);
    }
  },
  appendToContainer: function(text){
    var div = document.getElementById('container');
    div.innerHTML = div.innerHTML + ((new Date().toTimeString()) + ": " + text + "<br/>");
  },

  deferred_chaining: function(){
    console.log("deferred_chaining invoked");
    app.appendToContainer("deferred_chaining invoked</br>");
    app.log.customAppend("deferred_chaining invoked!\r\n");

    var dfrrd = $.Deferred();
    dfrrd.resolve();

    for(var i=1; i<=app.chain_length; i++){
      (function(chain_elm){
        dfrrd = dfrrd.then(function(){
          return $.Deferred(function($def){
            var resolve = function(){
                console.log("chain_elm "+ chain_elm +" resolved");
                app.appendToContainer("chain_elm "+ chain_elm +" resolved</br>");
                app.log.customAppend("chain_elm "+ chain_elm +" resolved\r\n");
                $def.resolve({
                  status: 'success'
                });
              };
            setTimeout(resolve, chain_elm*1000);
          }).promise();
        });
      })(i);

    }
  }

};
