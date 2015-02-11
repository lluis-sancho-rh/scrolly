(function ($) {

  var myScroll;

  window.Scrolly = function (attachTo, config) {
    this.attachTo = attachTo;
    this.config = config || {};

    for (var i = 0; i < this.config.offset; i++) {
      $(attachTo + ' ul').prepend('<li></li>');
    }

    this.attachToSnap = attachTo + ' ' + config.snap;
    this.currentPage = config.offset;
    this.paddingFactor = config.paddingFactor || 5;

    this.init();
  };

  Scrolly.prototype = {
    init: function () {
      this.ele = $(this.attachTo);
      this.ele.eleSnap = $(this.attachToSnap);
      this.ele.eleNumber = this.ele.eleSnap.size();
      this.ele.eleSnapHeight = this.ele.eleSnap[0].offsetHeight;

      myScroll = new IScroll(this.attachTo, {
        scrollX: false,
        scrollY: true,
        momentum: false,
        bounceEasing: false,
        snap: this.config.snap,
        probeType: 3
      });

      myScroll.scrolly = this;
      this.setActive(this.currentPage);
      this.refreshScrollStyle();

      myScroll.on('scroll', function () {
        myScroll.scrolly.currentPage = Math.abs(
          Math.round(
              myScroll.y / myScroll.scrolly.ele.eleSnapHeight
          )
        ) + myScroll.scrolly.config.offset;

        if (myScroll.scrolly.endOfScroll()) {
          myScroll.disable();
        }

        myScroll.scrolly.setActive(myScroll.scrolly.currentPage);
        myScroll.scrolly.refreshScrollStyle();
      });

      myScroll.on('scrollEnd', function () {
        myScroll.enable();

        if(myScroll.scrolly.currentPage > myScroll.scrolly.ele.eleNumber-1){
          myScroll.goToPage(0, myScroll.scrolly.ele.eleNumber-myScroll.scrolly.config.offset-1, 400);
        }
      });
    },

    setActive: function (index) {
      this.ele.eleSnap.removeClass('active nearest-1 nearest-2');

      $(this.ele.eleSnap[index]).addClass('active');

      for(var i=1; i<this.config.offset; i++){
        $(this.ele.eleSnap[index-i]).addClass('nearest-'+i);
        $(this.ele.eleSnap[index+i]).addClass('nearest-'+i);
      }

    },

    refreshScrollStyle: function () {
      $(this.ele.eleSnap).css('padding-left', 0);

      $.each(this.ele.eleSnap, function (index, el) {
        if (index >= myScroll.scrolly.config.offset) {
          var _index = index - myScroll.scrolly.config.offset;

          var padding = Math.abs(myScroll.y) < (myScroll.scrolly.ele.eleSnapHeight * _index) ?
            (myScroll.scrolly.ele.eleSnapHeight * _index) - Math.abs(myScroll.y) :
            (Math.abs(myScroll.y) - (myScroll.scrolly.ele.eleSnapHeight * _index));
          $(el).css('padding-left', padding / myScroll.scrolly.paddingFactor);
        }
      });
    },

    endOfScroll: function () {
      return myScroll.y < -((myScroll.scrolly.ele.eleNumber - myScroll.scrolly.config.offset - 1) * myScroll.scrolly.ele.eleSnapHeight)
    }
  };

  $(document).on('mouseup touchend', '#wrapper', function () {
    myScroll.enable();
  });

  document.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, false);

}(window.jQuery));
