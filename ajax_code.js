var newRequest = false;

function getRequestObject()
{
  try {
    httpRequest = new XMLHttpRequest();
    //alert( "Msxml2.XMLHTTP" );
  } catch( requestError ) {
    try {
      httpRequest = new ActiveXObject( "Msxml2.XMLHTTP");
      //alert( "Msxml2.XMLHTTP" );
    } catch( requestError ) {
      try {
        httpRequest = new ActiveXObject( "Microsoft.XMLHTTP");
        //alert( "Microsoft.XMLHTTP" );
      } catch (requestError ) {
        window.alert( "Your browser does not support AJAX!" );
      }
    }
  }
  return httpRequest;
}


function newsUpdate()
{
  var agency = "http://rss.msnbc.msn.com/id/3032091/device/rss/rss/xml";
  agency = "http://www.espn.com/espn/news/story?page=rssinfo";
  if( !newRequest ) {
    newRequest = getRequestObject();
    // for( var i = 0; i < 2; ++i ) {
    //   if( document.forms[ 0 ].agency[ i ].checked == true ) {
    //     agency = document.forms[ 0 ].agency[ i ].value;

         alert( "and the type of agency is = " + typeof agency );
    //     break;
    //   }
    //}
  }
  newRequest.abort();
  newRequest.open( "get", "TopStories.php?" + "agency=" + agency, true );

  try {
    newRequest.send( null );
  } catch( e ) {
    alert( "XMLHttpRequest - send( null ) failed. Reason = " + e.description );
  }
  //alert( "error code for status is = " + newRequest.status );
  if( 200 == newRequest.status ) {
    alert( "content fetched successfully");
  }

  newRequest.onreadystatechange = fillNewsInfo;
  clearTimeout( recentNews );
  var recentNews = setTimeout( 'newsUpdate()', 5000 );
  //alert( typeof newRequest );
  // var news = 0;
  // try {
  //   news  = newRequest.responseXML;
  //   alert( "The try block for getting responseXML was executed correctly");
  // } catch( requestError ) {
  //   alert( requestError.description);
  // }
  // if( null == news ) {
  //   alert( "your news variable is empty, everything is going fo fail from that point on");
  //   return;
  // } else {
  //   alert( "the news variable has content");
  // }
}

function fillNewsInfo()
{
  if( newRequest.readyState == 4 && newRequest.status == 200 )
  {
    var news = newRequest.responseXML;
    document.getElementById( "newsCell" ).innerHTML = "";
    var newsItems = news.getElementByTagName( "item" );
    if( newsItems.length > 0 )
    {
      for( var i = 0; i < newsItems.length; ++i )
      {
        var curHeadline = newsItems[ i ].getElementByTagName( "title" )[ 0 ].firstChild.nodeValue;
        var curLink = newsItems[ i ].getElementByTagName( "link" )[ 0 ].firstChild.nodeValue;
        var curPubDate = newsItems[ i ].getElementByTagName( "pubDate" )[ 0 ].firstChild.nodeValue;
        var curDesc = newsItems[ i ].getElementByTagName( "curDesc" )[ 0 ].firstChild.nodeValue;

        var curStory = "<a href='" + curLink + "'>" + curHeadline + "</a><br />";
        curStory += "<span style='color: gray'>" + curPubDate + "/span><br />";
        curStory += curDesc + "<br />";
        document.getElementById( "newsCell").innerHTML += curStory;
      }
    }
    else
    {
      document.getElementById( "newCell" ).innerHTML = "RSS feed does not contain any items.";
    }
  }
}
