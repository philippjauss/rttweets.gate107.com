
var io = require('socket.io')(8008);

var TwitterStreamChannels = require('twitter-stream-channels');
var credentials = require('./twitter.credentials.json');
var timeout = 500000;

var client = new TwitterStreamChannels(credentials);
var connected = false;

var channels = {
    "languages" : ['javascript','php','java','python','perl'],
    "js-frameworks" : ['angularjs','jquery','backbone','emberjs'],
    "web" : ['javascript','nodejs','html5','css','angularjs'],
    "wow" : ['warcraft','wowselfie']
};

var stream = client.streamChannels({track:channels});
 
var count = 0;
var tweetdata;
var tweeturl;
var isRetweet;



stream.on('connect', function() {
  console.log('> attempting to connect to twitter');
});

stream.on('connected', function() {
  if(connected === false){
    console.log('> twitter emit : connected - listening to channel "wow"');
    connected = true;
  }
});

stream.on('disconnect', function() {
  console.log('> twitter emit : disconnect');
  connected = false;
});

stream.on('reconnect', function() {
  console.log('> twitter emit : reconnect');
});

stream.on('warning', function() {
  console.log('> twitter emit : warning');
});

/*stream.on('channels/languages',function(tweet){
    console.log('>languages ',tweet.$channels,tweet.$keywords,tweet.text);//any tweet with 'javascript','php','java','python','perl'
    count++;
});
 
stream.on('channels/js-frameworks',function(tweet){
    console.log('>frameworks ',tweet.$channels,tweet.$keywords,tweet.text);//any tweet with 'angularjs','jquery','backbone','emberjs' 
    count++;
});
 
stream.on('channels/web',function(tweet){
    console.log('>web: ',tweet.$channels,tweet.$keywords,tweet.text);//any tweet with 'javascript','nodejs','html5','css','angularjs' 
    count++;
});*/

stream.on('channels/wow',function(tweet){
    isRetweeted=false;
    //console.log('>wow: ',tweet.$channels,tweet.$keywords,tweet.text);//any tweet with 'warcraft','wowselfie' 
    if (tweet.entities.media){
        tweeturl="https://www.twitter.com/"+tweet.user.screen_name+"/status/"+tweet.id_str;
        if (tweet.retweeted_status){
            isRetweeted=true;
        }
        tweetdata = { 
            "picture":tweet.entities.media[0].media_url,
            "user": tweet.user.screen_name,
            "tweettext": tweet.text,
            "retweeted": isRetweeted,
            "tweetlink": tweeturl
        };
     //console.log('Id of the media');
     //console.log(tweet.entities.media[0].id);
     //console.log('Here comes the url to the picture');
     //console.log(tweet.entities.media[0].media_url);
     //console.log(tweetdata);
     //io.emit('tweet', tweet.entities.media[0].media_url);
     io.emit('tweet',tweetdata);
    }
    count++;
});

/*setTimeout(function() {
  stream.stop();
  console.log('> stopped stream '+count+' tweets captured in '+timeout+'ms');
  process.exit();
}, timeout);*/




