define([
    'core/js/adapt'
], function(Adapt) {

    var DefinitionView = Backbone.View.extend({

        className: "definition-popup hidden",

        initialize: function(options) {

            this.render();
            this.attachToDocument();
            this.setPlacementFromTarget(options.$target);
            this.setUpEventListeners();

        },

        render: function() {
            this.$el.html(Handlebars.templates[this.constructor.template](this.model.toJSON()));
        },
        
        attachToDocument: function() {
            this.$el.appendTo("body");
        },

        setPlacementFromTarget: function($target) {
            var offset = $target.offset();
            this.$el.css({
                top: offset.top - this.$el.outerHeight(),
                left: offset.left,
            });
            this.$el.removeClass("hidden");
        },


        setUpEventListeners: function() {
            _.bindAll(this, "onBodyClick");
            $("body").on("click", this.onBodyClick);
            this.listenTo(Adapt, "remove", this.remove);
        },

        onBodyClick: function() {
            this.remove();
        },

        remove: function() {
            $("body").off("click", this.onBodyClick);
            Backbone.View.prototype.remove.call(this);
        }

    },{
        template: "definition-popup"
    });

    return DefinitionView;

});