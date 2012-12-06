(function($) {
  var Photumblr = function(el, options) {
    var imgs = $(el).find('img');
    var slideshow_imgs = [];
    var obj = this;
    var settings = $.extend({
      param: 'defaultValue'
    }, options || {});

    var namespace = 'vhx_photubmlr_'
    var bg = $(document.createElement('div')).addClass(namespace+'bg');
    var container = $(document.createElement('div')).addClass(namespace+'container');
    var viewport = $(document.createElement('div')).addClass(namespace+'viewport');
    var close_btn = $(document.createElement('div')).addClass(namespace+'close');
    var current_img = 0;

    var startSlideshow = function(i) {
      $(document.body).addClass('slideshow-mode');

      current_img = i;

      close_btn.show();
      viewport.show();
      bg.show();

      redraw();

      renderHires(current_img);
    }

    var renderHires = function(i) {
      var cur_img = slideshow_imgs[i];
      if (cur_img && cur_img.attr('src') != cur_img.data('hd') && cur_img.data('hd')) {
        cur_img.attr('src', cur_img.data('hd'));
      }
    }

    var endSlideshow = function() {
      $(document.body).removeClass('slideshow-mode');

      viewport.hide();
      bg.hide();
      close_btn.hide();
    }

    var onPhotoClick = function(i) {
      if (i < 0) i = imgs.length - 1;

      if (i == current_img) {
        current_img += 1;
        if (current_img >= imgs.length) current_img = 0;
      }
      else {
        current_img = i;
      }

      renderHires(current_img);
      renderHires(current_img+1);
      redraw();
    }

    var redraw = function() {
      // TODO cleaner way to get the viewport height?
      var window_height = $(window)[0].innerHeight;
      if (!window_height) window_height = $(window).height();

      viewport.width($(window).width());
      viewport.height(window_height);

      container.width($(window).width() * imgs.length)

      bg.width($(window).width());
      bg.height(window_height);

      $(slideshow_imgs).each(function(i, img) {
        var img = $(img);

        if (!img.data('width') && img.width() > 0) {
          img.data('width', img.width());
          img.data('height', img.height());
        }

        var ratio = img.data('height') / img.data('width');
        var iratio = img.data('width') / img.data('height');

        var maxw = $(window).width() * .8;
        var maxh = window_height * .9;

        // Too tall?
        if (maxw * ratio > maxh) {
          img.height(maxh);
          img.width(maxh * iratio);
        }
        else {
          img.width(maxw);
          img.height(maxw * ratio);
        }

        var left = $(window).width() / 2 - img.width() / 2;
        var tab_size = 100;

        if (left - tab_size < 40) {
          tab_size = left - tab_size + 40;
        }

        if (i == current_img) {
          img.css('left', left);
          img.css('top', window_height / 2 - img.height() / 2);
        }
        else if (i == current_img + 1) {
          img.css('top', window_height / 2 - img.height() / 2);
          img.css('left', $(window).width() - tab_size);
        }
        else if (i == current_img - 1) {
          img.css('top', window_height / 2 - img.height() / 2);
          img.css('left', - img.width() + tab_size);
        }
        else {
          img.css('left', $(window).width() + 30);
        }
      })
    }

    var onKeyDown = function(event) {
      if (event.keyCode == 27) {
        endSlideshow();
      }

      if (event.keyCode == 37) {
        onPhotoClick(current_img - 1);
      }

      if (event.keyCode == 39) {
        onPhotoClick(current_img);
      }
    }

    var init = function() {
      $(document.body).append(viewport.append(container)).append(close_btn).append(bg)

      close_btn.html('&times;');

      var cls = '.' + namespace;
      var css = 'body.slideshow-mode { overflow:hidden; } ' +
      cls + 'bg { background-color: #000; background: rgba(0,0,0,0.85); position: fixed; top: 0; left: 0; width: 100%; z-index: 999997; cursor: pointer; }' +
      cls + 'viewport { cursor: pointer; position: fixed; top: 0; left: 0; overflow: hidden; z-index: 999998;}' +
      cls + 'close { cursor: pointer; position: fixed; top: 10px; right: 10px; z-index: 999999; font: bold 24px Helvetica, Arial; color: #fff; }' +
      cls + 'viewport ' + cls + 'container img { position: absolute; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; }';

      var head  = document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      // For IE
      if (style.styleSheet)
        style.styleSheet.cssText = css;
      else
        style.appendChild(document.createTextNode(css));

      head.appendChild(style);

      viewport.hide();
      bg.hide();
      close_btn.hide();

      viewport.click(endSlideshow);
      bg.click(endSlideshow);
      close_btn.click(endSlideshow);

      imgs.each(function(i, el) {

        // Events for original photos
        $(this).click(function() {
          startSlideshow(i);
        });

        // Events for slideshow photos
        var img = $(document.createElement('img')).attr('src', $(this).attr('src'));
        img.addClass('img');
        img.data('hd', $(this).data('hd'));

        container.append(img);

        img.click(function(event) {
          onPhotoClick(i);
          event.stopPropagation();
        });

        slideshow_imgs.push(img);
      });

      $(window).keydown(onKeyDown);
      $(window).resize(redraw);
      redraw();
    }

    init();
  };

  $.fn.photumblr = function(options)
  {
    return this.each(function() {
      var element = $(this);

      if (element.data('photumblr')) return;
      var photumblr = new Photumblr(this, options);
      element.data('photumblr', photumblr);
    })
  }

})(jQuery);
