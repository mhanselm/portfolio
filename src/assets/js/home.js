// 'use strict'
var filters = ['16a085', '2980b9', 'f1c40f', '8e44ad', 'c0392b'],
  filterIndex = 0,
  frame = 0,
  bgIndex = 0,
  speed = 1500,
  LIMIT = 9,
  backgroundLimit = LIMIT,
  backgrounds = [],
  progressWidth = $('.track').width(),
  wHeight = $(document).height() - $('.top-bar').outerHeight(),
  hour = 0,
  minutes = 0,
  seconds = 0;

var timer = new Foundation.Timer($('body'), {
  duration: 2000,
  infinite: true
}, function() {
  timer.pause();
  if (filterIndex >= filters.length) {
    getImage();
  } else {
    $('.progress:first').clone().appendTo('.track').css({
      background: 'rgba(255,255,255,' + (1 - ((filterIndex) / filters.length)) + ')'
    }).animate({
      width: (1) * 100 / (filters.length) + '%',
      left: (filterIndex) * 100 / (filters.length) + '%'
    });
    $('.bg-animate').animate({
      backgroundColor: '#' + filters[filterIndex]
    }, speed, function() {
      filterIndex++;
      timer.start();
    });

  }

});

function convertToDataURLviaCanvas(url, outputFormat, callback){
    var img = document.getElementById('image');
    img.crossOrigin = 'anonymous';
    img.onload = function(){
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
        canvas = null;
    };
    img.src = url;
}

function resizeHeader() {
        var containerW = $(window).width();
        var containerH = $(window).height();
        var containerAspect = containerW /containerH;
        var imgHeight = $('#backgrounds .bg-img:last').attr('data-height') || $('#backgrounds .bg-img:last').height(),
        imgWidth = $('#backgrounds .bg-img:last').attr('data-width') || $('#backgrounds .bg-img:last').width();
        var imgAspectRatio = (imgWidth ) / (imgHeight );

        $('#backgrounds .bg-img:last').attr('data-height', imgHeight).attr('data-width', imgWidth);
        if (containerAspect < imgAspectRatio) {
            // taller
            $('#backgrounds .bg-img:last')
                    .css({
                        width: 'auto',
                        height: containerH,
                        top: 0,
                        left: -(containerH * imgAspectRatio - containerW) / 2,
                        right: 0,
                        bottom: 0
                    });
        } else {
            // wider
            $('#backgrounds .bg-img:last')
                    .css({
                        width: containerW,
                        height: 'auto',
                        top: -(containerW / imgAspectRatio - containerH) / 2,
                        left: 0,
                        right: 0,
                    });
        }
}

function getImage() {
  if (backgrounds.length < backgroundLimit && window.navigator.onLine) {
    // $.ajax({
    //   url: 'https://crossorigin.me/https://source.unsplash.com/random',
    //   beforeSend: function(xhr) {
    //     xhr.overrideMimeType("text/plain; charset=x-user-defined");
    //   },
    //   // contentType: 'text/plain',
    //   crossDomain: true,
    //   timeout: 5000,
    //   success: function(data, status, xhr) {
    //     for (var responseText = data, responseTextLen = data.length, binary = "", i = 0; i < responseTextLen; ++i) {
    //       binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
    //     }
    //     backgrounds.push('url(data:image/jpeg;base64,' + window.btoa(binary) + ') 50% no-repeat');
    //     changeBackgroundImage(backgrounds[backgrounds.length - 1]);
    //     $(document).trigger('image-resolved');
    //   }
    // });

    // convertToDataURLviaCanvas('https://crossorigin.me/https://source.unsplash.com/random', 'image/jpeg', function(base64Img){
        $('#backgrounds').append('<img class="bg-img" src="https://source.unsplash.com/random/' + Date.now() + '" style="visibility:hidden;"/>');
          $('#backgrounds .bg-img:last').on('load', function(){
            resizeHeader();
            backgrounds.push($('#backgrounds .bg-img:last').get(0));
            changeBackgroundImage(true);
            $(document).trigger('image-resolved');
          });

    // });

  } else {
      changeBackgroundImage();
  }
}
getImage();

function changeBackgroundImage(preloaded) {
  $('.bg-animate').animate({
    backgroundColor: '#fff',
    opacity: 1
  }, speed, function() {
    // $('.index-content').css('background', background);
    if(!preloaded){
      $('#backgrounds').append(backgrounds[bgIndex])
      resizeHeader();
    }
    $('#backgrounds .bg-img:last').css('visibility', 'visible');
    $('#backgrounds .bg-img:not(:last)').remove();
    $('#index').text(bgIndex + 1);
    filterIndex = 0;
    bgIndex++;
    bgIndex = bgIndex >= backgroundLimit ? 0 : (bgIndex);
    $('.track').html('<div class="progress"></div>');
    $('.progress:first').css({
      background: 'rgba(255,255,255,' + (1 - ((filterIndex) / filters.length)) + ')'
    }).animate({
      width: (1) * 100 / (filters.length) + '%',
      left: (filterIndex) * 100 / (filters.length) + '%'
    });
    filterIndex++;
    $('.bg-animate').animate({
      backgroundColor: '#' + filters[0],
      opacity: '0.4'
    }, speed, function() {
      timer.start();
      frame = 0;
    });
  });
}

$(window).resize(function() {
  resizeHeader();
  wHeight = $(window).height() - $('.top-bar').outerHeight();
  $('section.home').height(wHeight);
  $('.home .name').css('margin-top', wHeight / 4);
});

$(document).ready(function() {
  $('section.home').height(wHeight);
  $('.home .name').css('margin-top', wHeight / 4);
  $('#firstname').width($('#firstname').width());
  $('#lastname').width($('#lastname').width());
  $('#index').text(bgIndex + 1);
  $('#count').text(backgroundLimit);

  $.simpleWeather({
    location: 'Toronto, ON',
    woeid: '',
    unit: 'c',
    success: function(weather) {
      html = '<h2><i class="icon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
      html += '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
      html += '<li class="currently">' + weather.currently + '</li>';
      html += '<li>' + weather.wind.direction + ' ' + weather.wind.speed + ' ' + weather.units.speed + '</li></ul>';

      $("#weather").html(html);
    }
  });

  $('.image-count').click(function() {
    if (backgroundLimit < LIMIT * 5) {
      backgroundLimit += LIMIT;
    }
    $('#count').fadeOut(500, function() {
      $(this).text(backgroundLimit).fadeIn();
    });
  });

  var clockspeed = 400;
  var currentTime = 0;
  //Update time
  setInterval(function() {
    currentTime = new Date();
    if (currentTime.getHours() !== hours) {
      hours = currentTime.getHours();
      $('#time #hours').fadeOut(clockspeed, function() {
        $(this).text((hours < 10 ? '0' : '') + hours).fadeIn(clockspeed);
      })
    }
    if (currentTime.getMinutes() !== minutes) {
      minutes = currentTime.getMinutes();
      $('#time #minutes').fadeOut(clockspeed, function() {
        $(this).text((minutes < 10 ? '0' : '') + minutes).fadeIn(clockspeed);
      });
    }
    if (currentTime.getSeconds() !== seconds) {
      seconds = currentTime.getSeconds();
      // $('#time #seconds').fadeOut(speed, function(){
      $('#time #seconds').text((seconds < 10 ? '0' : '') + seconds);
      // });
    }
  }, 1000);
});



$(document).one("image-resolved", function() {
  timer.start();
  // $('.bg-animate').css('background', '#' + filters[0]);
  $('.home .name').css('transition', 'all 2s ease-in-out');
  $('.name h1').animate({color: '#fefefe'}, 2000);
  $('.name').css({border: '0.15em solid #fefefe'});
  setTimeout(function() {
    $('#firstname').html('M<small>atthew</small>').animate({
      width: $("#firstname").clone().appendTo('.home .name h1').hide().css('width', 'auto').width()
    }, 600, function() {
      $('#lastname').html('H<small>anselman</small>').delay(300).animate({
        width: $("#lastname").clone().appendTo('.home .name h1').hide().css('width', 'auto').width()
      }, 600, function() {
        $('.name .firstname:last').remove();
        $('.name .lastname:last').remove();
      });
    });

  }, 2500);
});
