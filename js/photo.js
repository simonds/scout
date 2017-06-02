var fb = new Firebase('https://spokaneedibletree.firebaseio.com/');

$(function() {

    var photo = $('#photo'),
    recordId = getParameterByName('id'),
    treeRef = fb.child('trees/' + recordId);
    treeRef.once('value', function(snapshot) {
         if(snapshot.val() !== null) {
            if (snapshot.val().contact) {
                $('#type').html(snapshot.val().type);
                $('#name').html(snapshot.val().contact.name);
                $('#phone').html(snapshot.val().contact.phone);
                $('#email').html(snapshot.val().contact.email);
                $('#contactRow').show()
            }
            photo.attr('src', snapshot.val().photo);
            photo.show();
            loadMap(snapshot.val().location);
            $('#mapCanvas').show();
        }
    });

});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function loadMap(position) {
    var mapLatlng = new google.maps.LatLng(position.latitude, position.longitude),
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