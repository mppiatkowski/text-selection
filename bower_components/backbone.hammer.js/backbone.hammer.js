(function(root, factory) {
  // Set up Backbone appropriately for the environment.
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['underscore', 'backbone'], function(_, Backbone) {
      factory(_, Backbone);
    });
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    factory(_, Backbone);
  } else {
    // Browser globals
    factory(root._, root.Backbone);
  }
}(this, function(_, Backbone) {
  var $ = Backbone.$;

  var delegateEventSplitter = /^(\S+)\s*(.*)$/;
  var viewOptions = ['hammerEvents', 'hammerOptions'];

  var View = Backbone.View;
  var delegateEvents = View.prototype.delegateEvents;
  var undelegateEvents = View.prototype.undelegateEvents;
  var stopListening = View.prototype.stopListening;
  var remove = View.prototype.remove;

  Backbone.View = View.extend({
    constructor: function(options){
      options = options || {};
      _.extend(this, _.pick(options, viewOptions));
      return View.apply(this, arguments);
    },

    _hammered: false,

    remove: function(){
      this.undelegateHammerEvents();
      return remove.apply(this, arguments);
    },

    stopListening: function(){
      this.undelegateHammerEvents();
      return stopListening.apply(this, arguments);
    },

    undelegateEvents: function(){
      this.undelegateHammerEvents();
      return undelegateEvents.apply(this, arguments);
    },

    undelegateHammerEvents: function(element){
      if(_.isUndefined(element) || element.length < 1){
        element = this.$el;
      }

      //console.log('undelegate') ;
      element._delegated = false;
      if(element._mc_self && element._mc_self.hammer){
        for(var eventIdx in element._mc_self.events) {
          //console.log("off!", element._mc_self.events[eventIdx]);
          if(element._mc_self.hammer){
            element._mc_self.hammer.off(element._mc_self.events[eventIdx]);
          }
        }
        element._mc_self.hammer.destroy();
        element._mc_self.hammer = null;
      }
      if(element._mc_selectors){
        for(var selector in element._mc_selectors){
          if(element._mc_selectors[selector].hammer){
            for(var eventIdx in element._mc_selectors[selector].events) {
              //console.log("off!", element._mc_selectors[selector].events[eventIdx]);
              element._mc_selectors[selector].hammer.off(element._mc_selectors[selector].events[eventIdx]);
            }
            element._mc_selectors[selector].hammer.destroy();
            element._mc_selectors[selector].hammer = null;
          }
        }
      }
      return this;
    },

    delegateEvents: function(){
      delegateEvents.apply(this, arguments);
      this.delegateHammerEvents();
      return this;
    },

    recognizerFromEvent: function(eventName){
        if(eventName.indexOf("pan")>=0){
            return Hammer.Pan;
        }
        if(eventName.indexOf("tap")>=0){
            return Hammer.Tap;
        }
        if(eventName.indexOf("pinch")>=0){
            return Hammer.Pinch;
        }
        if(eventName.indexOf("swipe")>=0){
            return Hammer.Swipe;
        }
        if(eventName.indexOf("press")>=0){
            return Hammer.Press;
        }
        if(eventName.indexOf("rotate")>=0){
            return Hammer.Rotate;
        }

    },

    delegateHammerEvents: function(events, element){
      var key, match, eventName, method, optionKey, recognizer, i, options, eventsArray, hammerInstance, hammer, that=this;

      if(_.isUndefined(element) || element.length < 1){
        element = this.$el;
      }else{
        var redelegate = function(e){
          $(element).off("DOMNodeRemoved");
          setTimeout(function(){
              e&&that.undelegateHammerEvents(e.target);
              $(element).on("DOMNodeRemoved", redelegate);
          }, 10);
        }
        redelegate();
      }

      //console.log('delegate!');
      if(element._delegated === true){
        this.undelegateHammerEvents();
      }
      element._delegated = true;
      element._mc_selectors = {};
      element._mc_self = null;

      // basic checks
      if (!(events || (events = _.result(this, 'hammerEvents')))) return this;
      if(Object.keys(events).length === 0) return this;
      options = _.result(this, 'hammerOptions') || {};
      for(optionKey in Backbone.hammerOptions){
        options[optionKey] = _.extend(options[optionKey], Backbone.hammerOptions[optionKey]);
      }

      // detect which recognizers are needed
      var recognizersForSelector = {};
      for(key in events) {
          match = key.match(delegateEventSplitter);
          eventName = match[1];
          selector = match[2];
          var recognizers = recognizersForSelector[selector]||[];
          recognizer = this.recognizerFromEvent(eventName);
          if(recognizer && !([recognizer] in recognizers)){
            var unique = true;
            for(i=0;i<recognizers.length; i++){
              if(recognizers[i][0] === recognizer){
                unique = false;
                break;
              }
            }
            if(unique){
              recognizers.push([recognizer]);
            }
          }
          recognizersForSelector[selector] = recognizers;
      }

      // create recognizers and bind events
      for(key in events) {
          method = events[key];
          if (!_.isFunction(method)) method = this[events[key]];
          if (!method) continue;

          match = key.match(delegateEventSplitter);
          eventName = match[1];
          selector = match[2];

          method = _.bind(method, this);
          eventsArray = null;
          hammerInstance = null;
          if(selector === ''){
            if(!element._mc_self){
              hammer = new Hammer.Manager(element[0], {
                recognizers: recognizersForSelector[selector]
              });
              element._mc_self = {
                hammer: hammer,
                events: []
              };
            }
            eventsArray = element._mc_self.events;
            hammerInstance = element._mc_self.hammer;
            if(eventsArray && hammerInstance){
              eventsArray.push(eventName);
              hammerInstance.on(eventName, method);
              for(optionKey in options){
                recognizer = hammerInstance.get(optionKey);
                if(recognizer){
                  recognizer.set(options[optionKey]);
                }
              }
            }
          }else{
            var subElem = $(element.find(selector));
            if(subElem.length === 0){
              continue;
            }
            for(i=0;i<subElem.length;i++){
              if(!element._mc_selectors[selector]){
                hammer = new Hammer.Manager(subElem[i], {
                  recognizers: recognizersForSelector[selector]
                });
                element._mc_selectors[selector+i] = {
                  hammer: hammer,
                  events: []
                };
              }
              eventsArray = element._mc_selectors[selector+i].events;
              hammerInstance = element._mc_selectors[selector+i].hammer;
              if(eventsArray && hammerInstance){
                eventsArray.push(eventName);
                hammerInstance.on(eventName, method);
                for(optionKey in options){
                  recognizer = hammerInstance.get(optionKey);
                  if(recognizer){
                    recognizer.set(options[optionKey]);
                  }
                }
              }
            }
          }
      }
      return this;
    }
  });
}));