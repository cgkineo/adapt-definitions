define([
    'core/js/adapt',
    'handlebars',
    'core/js/accessibility'
],function(Adapt, Handlebars) {

    function escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    function chain(subject, func_name, callback) {
        var original = subject[func_name];
        subject[func_name] = function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(function() {
                var args = Array.prototype.slice.call(arguments, 0);
                return original.apply(this, args);
            }.bind(this));
            return callback.apply(this, args);
        };
    }

    var Definitions = Backbone.Controller.extend({

        initialize: function() {
            _.bindAll(this, "a11y_text", "onAbbrClick");
            this.listenTo(Adapt, "app:dataLoaded", this.loadData);

            $('body').on('click', "[definition]", this.onAbbrClick);
        },

        loadData: function() {
            this.model = new Backbone.Model(Adapt.course.get("_definitions") || {_isEnabled: false});

            if (!this.model.get("_isEnabled")) {
                return;
            }

            var items = this.model.get("_items");
            if (!items || !items.length) {
                return;
            }

            this.setUpRegExps();
            this.setUpA11yTextHook();

        },

        setUpRegExps: function() {
            this._items = this.model.get("_items");
            var allWords = [];
            this._items.forEach(function(item, index) {
                item._index = index;
                var words = [];
                item.words.forEach(function(find) {
                    var escaped = escapeRegExp(find);
                    words.push(escaped);
                    allWords.push(escaped);
                });
                item._regexp = new RegExp("\\b"+words.join("\\b|\\b")+"\\b", "gi");
            });
            this._regexp = new RegExp("\\b"+allWords.join("\\b|\\b")+"\\b", "gi");
        },

        setUpA11yTextHook: function() {
            chain(Handlebars.helpers, "a11y_text", this.a11y_text);
        },

        a11y_text: function a11y_text(a11y_text, html) {

            var $html= $("<div>", {
                html: html
            });
            $html.find("*").add($html).each(function(index, node) {

                if ($(node).is("[definition], [no-definition]")){
                    return;
                }

                var newChildNodes = [];
                var wasChanged = false;

                for (var nc = 0, ncl = node.childNodes.length; nc < ncl; nc++) {

                    var child = node.childNodes[nc];

                    if (child.nodeType !== 3) {
                        newChildNodes.push(child);
                        continue;
                    }

                    var text = child.textContent;
                    if (text.search(this._regexp) < 0) {
                        newChildNodes.push(child);
                        continue;
                    }

                    wasChanged = true;

                    text = text.replace(this._regexp, function(match, offset, string) {
                        for (var d = 0, dl = this._items.length; d < dl; d++) {
                            var item = this._items[d];
                            if (!match.match(item._regexp)) continue;

                            return "<span definition='"+item.definition+"'>"+match+"</span>";
                        }
                    }.bind(this));

                    var $html2 = $("<div>", {
                        html: text
                    });

                    $html2[0].childNodes.forEach(function(childNode) {
                        newChildNodes.push(childNode);
                    });

                }

                if (!wasChanged) return;

                for (var i = node.childNodes.length-1; i > -1; i--) {
                    node.removeChild(node.childNodes[i]);
                }

                newChildNodes.forEach(function(child) {
                    node.appendChild(child);
                });

            }.bind(this));

            return a11y_text($html[0].outerHTML);
        },

        onAbbrClick: function(event) {
            Adapt.trigger("definition:remove");
            var $target = $(event.target);

            var word = $target.text();
            var definition = $target.attr("definition");

            var json = _.extend({}, this.model.toJSON(), {word: word, definition: definition});

            var title = Handlebars.compile(this.model.get("title"))(json);
            var body =  Handlebars.compile(this.model.get("body"))(json);

            Adapt.trigger("notify:prompt", {
                "title": title,
                "body": "<div no-definition=\"true\">"+body+"</div>",
                "_prompts": [
                    {
                        promptText: this.model.get("confirmText") || "Close"
                    }
                ],
                "_showIcon": this.model.get("_showIcon")
            });

        }

    });

    return new Definitions();

});
