(function($) {
  function SlidingPanel(el, options) {
    this.el = $(el);
    this.options = {
      contents: {}, 
      /*width: '500px',*/
      spanClass: 'span7',
      preloadContent: false
    };
    this.setOptions(options);
    this.initialize();
  }

  $.fn.slidingPanel = function(options) {
    return new SlidingPanel(this.get(0), options);
  };

  SlidingPanel.prototype = {
    setOptions: function(options) {
      var o = this.options;
      $.extend(o, options);
    },

    loadContent: function(contentId) {
        var options = this.options;   
        var bodyDiv = this.bodyDiv;

        options.contents[contentId].content = $('<div id="sliding-panel-' + contentId + '"></div>').appendTo(bodyDiv);
        options.contents[contentId].isLoading = true;
        options.contents[contentId].content.load(options.contents[contentId].url, function (responseText, textStatus, XMLHttpRequest) {
          console.log("Loaded " + contentId);
          options.contents[contentId].isLoaded = true;
          options.contents[contentId].isLoading = false;
        });
    },

    initialize: function() {
      var self = this, divs;

      this.el.hide();
      this.el.addClass('sliding-panel');
      this.el.addClass(this.options.spanClass);
      this.el.html('<div class="sliding-panel-header"><a href="#" id="sliding-panel-close" class="close">×</a><h3 id="sliding-panel-header-title"></h3></div><div class="sliding-panel-body"></div>');
      divs = this.el.children();
      $($(divs.get(0)).children().get(0)).click(function() { self.el.hide('slide', 'fast'); });
      this.bodyDiv = $(divs.get(1));
      this.el.height(screen.height);

      for (contentId in self.options.contents) {
        if (self.options.contents[contentId].preloadContent) {
          self.loadContent(contentId);
        }
      }
    },

  // TODO (Me - Sat 02 Jun 2012 12:08:42 AM EDT) :
  // add the title param so it can be dynamically be changed
    slide: function(contentId, cb) {
      var self = this;
      
      // this.bodyDiv.html("");
      
      //this.el.height($(window).height()-50);
      $('#sliding-panel-header-title').html(this.options.contents[contentId].header);
      $('#sliding-panel-close').attr('href', this.options.contents[contentId].closeUri);
      this.bodyDiv.children().hide();

      if (this.el.is(":hidden"))
        this.el.show('slide', 'fast', function() {
            self.switch(contentId, cb);
        });
      else
        this.switch(contentId, cb);      
    },

    close: function(cb) {
      if (!this.el.is(":hidden")) {
        $('#sliding-panel-close').click();
      }
    },
   
    switch: function(contentId, cb) {
      var el = this.el;
      
      if (!this.options.contents[contentId].isLoaded && !this.options.contents[contentId].isLoading) {
        this.loadContent(contentId);
      }
      else {
        this.options.contents[contentId].content.show();
      }

      if (cb != undefined && typeof cb == 'function') 
        cb();
    }
  }
}(jQuery));
