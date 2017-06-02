var fb = new Firebase('https://spokaneedibletree.firebaseio.com/'),
    position = {},
    photoUrl = null;

$(function() {

    var spinnerMask = document.getElementById('spinnerMask');
    var opts = {
      lines: 9, // The number of lines to draw
      length: 16, // The length of each line
      width: 16, // The line thickness
      radius: 30, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#fff', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '50%', // Top position relative to parent
      left: '50%' // Left position relative to parent
    };
    var spinner = new Spinner(opts).spin(spinnerMask);

    $('#fileChooserButton').show().on('click', function(){
        $('#fileChooser').click();
    });

    $('#fileChooser').on('change', function(){
        var file = this.files[0];
        $('#spinnerMask').show();
        uploadPhoto(file, function(url){
            photoUrl = url;
            $('#fileChooserButton').hide();
            $('#location').show();
            $('#spinnerMask').hide();
        });
    });

    $('#location').on('click', function(){
        $('#spinnerMask').show();
        get_location(function(location){
            position = location;
            $('#location').html('<span class="glyphicon glyphicon-globe"> Get Location Again</span>');
            $('#contactRow').show();
            loadMap(position);
            $('#spinnerMask').hide();
        }, function(error){
            if (err.code == 999) {
                window.alert(error.message);
            } else {
                window.alert('Please allow your browser to get your location.');
            }
            
        });
    });

    $('#submit').on('click', function(){
        $('#spinnerMask').show();
        $('#location').html('<span class="glyphicon glyphicon-globe"> Get Location</span>').hide();
        register_tree();
    });

    $('#new').on('click', function(){
        $(this).hide();
        $('#mapCanvas').html('');
        $('#location').hide();
        $('#contactRow').hide();
        postion = null;
        photoUrl = null;
        $('#fileChooserButton').show();
    });

});

function get_location(callback, error) {
    if (Modernizr.geolocation) {
        navigator.geolocation.getCurrentPosition(function(capturedPosition) {
            callback(capturedPosition);
        }, function(err) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
            error(err);
        });
    } else {
        err({code: '',message: 'Please allow location services for this browser.'});
    // no native support; maybe try a fallback?
    }
}

function loadMap(position) {
    var mapLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        mapOptions = {
            center: mapLatlng,
            zoom: 18
        },
        mapElement = document.getElementById('mapCanvas'),
        map = new google.maps.Map(mapElement, mapOptions),
        marker = new google.maps.Marker({
            position: mapLatlng,
            map: map
        });
}

function register_tree() {
    if (photoUrl !== null && position != {}) {
        var treeRef = fb.child('trees');
        var newTreeRef = treeRef.push({
            dateAdded: Date(),
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            photo: photoUrl,
            contact: {
                name: $('#inputName').val(),
                email: $('#inputEmail').val(),
                phone: $('#inputPhone').val()
            }
        }, function(error) {
            if (error) {

            } else {
                $('#contactRow').hide();
                $('#submit').disabled = false;
                $('#inputName').val('');
                $('#inputEmail').val('');
                $('#inputPhone').val('');
                $('#new').show();
                $('#spinnerMask').hide();
            }
        });

    }
}

function uploadPhoto(file, callback) {
    if (file) {
        AWS.config.update({
            accessKeyId: 'AKIAIJFPJ2G2IOZ5NPGA',
            secretAccessKey: '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'
        });
        var bucket = new AWS.S3({params: {Bucket: 'spokaneedibletree'}});
        var objId = new Date().getTime();
        var objKey = objId + '_' + file.name;
        var params = {Key: objKey, ContentType: file.type, Body: file, ACL: 'public-read'};
        bucket.putObject(params, function (err, data) {
            if (err) {
                window.alert('ERROR: ' + err);
            } else {
                callback('http://spokaneedibletree.s3.amazonaws.com/' + objKey);
            }
        });
    } else {
        window.alert('Select a photo.');
    }
}
