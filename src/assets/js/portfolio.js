var defaults = {
  cell_size: 75,
  variance: 0.75,
  x_colors: 'Blues',
  y_colors: 'Blues',
  palette: Trianglify.colorbrewer,
  color_space: 'lab',
  // color_function: function(x, y) {
  //   return 'hsl('+Math.floor(Math.abs(x*y)*360)+',80%,60%)';
  // },
  stroke_width: 1.51,
  seed: null
};
var filters = ['16a085', '2980b9', 'f1c40f', '8e44ad', 'c0392b'];
$(document).ready(function() {

  defaults.width = $(window).width();
  defaults.height = $(window).height()*0.75;

  var pattern = Trianglify(defaults);

  //SVG DOM node
  $('.top-bar').after('<div class="bg"><div class="title"><h1>What</h1><h2>A collection of work.</h2></div><div id="svg">' + pattern.svg().outerHTML + '</div></div>')

  //Canvas DOM node
  // pattern.canvas();
  // $('.title-bg').each(function(index, el){
  //   $(el).css('background', '#' + filters[index]);
  // });

  // setInterval(function(){
  // // $('#svg svg path').each(function(index, path){
  //   $('#svg svg path').eq(Math.floor(Math.random()*$('#svg svg path').length)).animate({opacity: 0.3}, 500).delay(1000).animate({opacity: 1}, 500);//delay(index*1000).css('fill', '#fff');
  // }, 1000);
//   var counter = 0, direction=0;
//   setInterval(function(){
//     if(counter < $('#svg svg path').length && direction === 0){
//   // $('#svg svg path').each(function(index, path){
//     console.log($('#svg svg path').eq(counter).attr('fill'))
//     $('#svg svg path').eq(counter).animate({'fill-opacity': 0.7}, 500);//delay(index*1000).css('fill', '#fff');
//     counter++;
//   }else {
//     direction = 1;
//     $('#svg svg path').eq(counter).animate({'fill-opacity': 1}, 500);//delay(index*1000).css('fill', '#fff');
//     counter--;
//     if(counter < 0){
//       direction = 0;
//     }
//   }
// }, 50);

  // $('#svg svg path').on('mouseenter', function(){
  //   var original = $(this).attr('fill');
  //   $(this).css({'fill': '#16a085', transition: "1.0s"}).delay(1000)
  //   .queue(function (next) {
  //     $(this).css({fill: original, transition: "1.0s"})
  //     next();
  //   });
  // });

  function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

  $('#svg svg path').on('mouseenter', function(){
    var original = $(this).attr('fill');
    var rgb = hexToRgb($(this).attr('fill'));
    var opacity = ((rgb.r + rgb.g + rgb.b)/765);
    var $newEl = $(this).clone().appendTo('#svg svg');
    $newEl.css({'fill': 'rgba(22, 160, 133,' + opacity + ')', 'stroke': 'rgba(22, 160, 133,' + opacity + ')', transition: "1.0s"}).delay(1000)
    .queue(function (next) {
      $(this).fadeOut(1000).remove();//.({fill: original, transition: "1.0s"})
      next();
    });
  });

  // $('#svg svg path').on('mouseleave', function(){
  //   $(this).animate({'fill': '#c0392b'}, 500);
  // });

});

$(window).resize(function() {
  defaults.width = $(window).width();
  defaults.height = $(window).height()*0.75;
    var pattern = Trianglify(defaults);

  $('#svg').html('').html(pattern.svg())
  // $('svg').css({'width': $(window).width(), 'height': $(window).height()*0.75});
});
