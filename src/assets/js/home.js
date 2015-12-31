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

function getImage() {
  if (backgrounds.length < backgroundLimit && window.navigator.onLine) {
    $.ajax({
      url: 'https://source.unsplash.com/random',
      beforeSend: function(xhr) {
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
      },
      timeout: 5000,
      success: function(data, status, xhr) {
        for (var responseText = data, responseTextLen = data.length, binary = "", i = 0; i < responseTextLen; ++i) {
          binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
        }
        backgrounds.push('url(data:image/jpeg;base64,' + window.btoa(binary) + ') 50% no-repeat');
        changeBackgroundImage(backgrounds[backgrounds.length - 1]);
        $(document).trigger('image-resolved');
      }
    });
  } else {
    changeBackgroundImage(backgrounds[bgIndex]);
  }
}
getImage();

function changeBackgroundImage(background) {
  $('.bg-animate').animate({
    backgroundColor: '#fff',
    opacity: 1
  }, speed, function() {
    $('.index-content').css('background', background);
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
  wHeight = $(document).height() - $('.top-bar').outerHeight();
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
        $(this).text(hours).fadeIn(clockspeed);
      })
    }
    if (currentTime.getMinutes() !== minutes) {
      minutes = currentTime.getMinutes();
      $('#time #minutes').fadeOut(clockspeed, function() {
        $(this).text(minutes).fadeIn(clockspeed);
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
