var accessToken;

window.Instagram = {
    /**
     * Store application settings
     */
    config: {},

    BASE_URL: 'https://api.instagram.com/v1',

    init: function( opt ) {
        opt = opt || {};

        this.config.client_id = opt.client_id;
    },

    login: function(callback){
      var endpoint = "https://api.instagram.com/oauth/authorize/?client_id=" + this.config.client_id + "&redirect_uri=http://localhost:8888/photoFeed&response_type=token";
      window.location = endpoint;
    },

    /**
     * Get a list of recently tagged media.
     */
    tagsByName: function( name, callback ) {
        var endpoint = this.BASE_URL + '/tags/' + name + '/media/recent?' + accessToken;
        console.log(endpoint);
        this.getJSON( endpoint, callback );
    },

    getJSON: function( url, callback ) {
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'jsonp',
            success: function( response ) {
                if ( typeof callback === 'function' ) callback( response );
            }
        });
    }
};

Instagram.init({
    client_id: 'b6edbab56b1e42e3bb8661015c98e78c'
});


$( document ).ready(function() {

    if(window.location.hash){
      var hash = window.location.hash.substring(1);
      accessToken = hash;
    }else{
      Instagram.login(function(response){
        console.log(repsonse);
      })
    }


    $( '#form' ).on('submit', function( e ) {
        e.preventDefault();

        var tagName = $( '#search' ).val();
        Instagram.tagsByName(tagName, function( response ) {
          console.log(response);
            var $instagram = $( '#instagram' );
                $instagram.html('');

            for ( var i = 0; i < response.data.length; i++ ) {
                username = response.data[i].user.username;
                avatar = response.data[i].user.profile_picture;
                postLink = response.data[i].link;
                imageUrl = response.data[i].images.low_resolution.url;
                $instagram.append( '<li><a href="' + postLink + '" target="_blank"><img src="' + imageUrl + '" /></a><p class="username"><img src="' + avatar +'" class="avatar-img">By ' + username +'</p></li>' );

            }
        });

    });

});
