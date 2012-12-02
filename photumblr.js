
(function($) {
  var Photumblr = function(el, options) {
    var imgs = $(el).children();
    var slideshow_imgs = [];
    var obj = this;
    var settings = $.extend({
      param: 'defaultValue'
    }, options || {});

    var bg = $(document.createElement('div')).addClass('bg');
    var container = $(document.createElement('div')).addClass('container');
    var viewport = $(document.createElement('div')).addClass('viewport');

    var current_img = 0;

    var startSlideshow = function(i) {
      $(document.body).css('overflow', 'hidden');

      current_img = i;

      viewport.show();
      bg.show();

      redraw();

      bg.css('opactiy', '0');
      bg.animate({ opacity: '1' }, 500);
    }

    var endSlideshow = function() {
      $(document.body).css('overflow', 'default');

      viewport.hide();
      bg.hide();
    }

    var onPhotoClick = function(i) {
      if (i == current_img) {
        current_img += 1;
        if (current_img >= imgs.length) current_img = 0;
      }
      else {
        current_img = i;
      }


      redraw();
    }

    var redraw = function() {
      viewport.width($(window).width());
      viewport.height($(window).height());

      container.width($(window).width() * imgs.length)

      bg.width($(window).width());
      bg.height($(window).height());

      $(slideshow_imgs).each(function(i, img) {
        var img = $(img);

        if (!img.data('width') && img.width() > 0) {
          img.data('width', img.width());
          img.data('height', img.height());
        }

        var ratio = img.data('height') / img.data('width');
        var iratio = img.data('width') / img.data('height');

        var maxw = $(window).width() * .7;
        var maxh = $(window).height() * .8;

        // Too tall?
        if (maxw * ratio > maxh) {
          img.height(maxh);
          img.width(maxh * iratio);
        }
        else {
          img.width(maxw);
          img.height(maxw * ratio);
        }

        if (i == current_img) {
          img.css('left', $(window).width() / 2 - img.width() / 2);
          img.css('top', $(window).height() / 2 - img.height() / 2);
        }
        else if (i == current_img + 1) {
          img.css('top', $(window).height() / 2 - img.height() / 2);
          img.css('left', $(window).width() - 50);
        }
        else if (i == current_img - 1) {
          img.css('top', $(window).height() / 2 - img.height() / 2);
          img.css('left', - img.data('width') + 50);
        }
        else {
          img.css('left', $(window).width() + 30);
        }
      })
    }

    var init = function() {
      $(document.body).append(viewport.append(container)).append(bg)

      // viewport.css('visibility', 'hidden');
      // bg.css('visibility', 'hidden');
      viewport.hide();
      bg.hide();

      viewport.click(endSlideshow);
      bg.click(endSlideshow);

      imgs.each(function(i, el) {

        // Events for original photos
        $(this).click(function() {
          startSlideshow(i);
        });

        // Events for slideshow photos
        var img = $(document.createElement('img')).attr('src', $(this).attr('src'));
        img.addClass('img');


        img.click(function(event) {
          onPhotoClick(i);
          event.stopPropagation();
        });
        container.append(img);

        slideshow_imgs.push(img);
      })

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