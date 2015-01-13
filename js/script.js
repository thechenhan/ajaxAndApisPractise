
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetName = $('#street').val(); 
    var cityName =  $('#city').val();
    var addName = streetName + ", " + cityName;
    $greeting.text('Here we go, this is what the address ' + addName +' looks like');
    var streetViewURL = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + addName;
    //appending the BGimg
    $('body').append('<img class="bgimg" src="' + streetViewURL + '">');
    


    //New York City News API
    var NYUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + 
    cityName + '&sort=newest&api-key=4f536e3c8585d911b58f788b18ed4514:12:70746388';

    $nytHeaderElem.text('The New York Times News in ' + cityName + '.');

    $.getJSON(NYUrl, function( data ) {
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
             var article = articles[i];
            $nytElem.append('<li class="article">' + 
                '<a href="'+article.web_url+'">' + article.headline.main+'</a>' +
                '<p>' + article.snippet + '</p>' +
                '</li>'
            );            
        }; 
    }).error(function(){  //chaining.error to avoid error
        $nytHeaderElem.text('It seems something wrong, and we cannot get the news');
    })


    //Wikipedia API
    
    //check there is a good response from the server;
    //If there is no response from server, we should stop

    var wikiRequestTimeOut = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    var WikiUrl = 'http://en.wikipedia.org/w/api.php?format=json&action=opensearch&' +
    '&search=' + cityName;
    $.ajax({
        url : WikiUrl,
        dataType: "jsonp",
        success: function ( data ) {
            var articleList = data[1];
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' +
                    articleStr + '</a></li>');
            };

            //If there is a good response, stop the timeout.
            clearTimeout(wikiRequestTimeOut); 
        }
    })




    return false;

};

$('#form-container').submit(loadData); //in the brackets should be the function, no the call function.

//loadData();
