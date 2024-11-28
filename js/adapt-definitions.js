import './Injector';
import Adapt from 'core/js/adapt';
import Handlebars from 'handlebars';
import notify from 'core/js/notify';

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

class Definitions extends Backbone.Controller {

  initialize () {
    _.bindAll(this, 'onAbbrClick');
    this.listenTo(Adapt, 'app:dataLoaded', this.loadData);

    $('body').on('click', '[definition]', this.onAbbrClick);
    $('body').on('keypress', '[definition]', e => {
      if (e.which !== 13) return;
      this.onAbbrClick(e);
    });
  }

  loadData() {
    this.model = new Backbone.Model(Adapt.course.get('_definitions') || { _isEnabled: false });
    if (!this.model.get('_isEnabled')) return;
    this._items = this.model.get('_items');
    if (!this._items?.length) return;
    this.setUpRegExps();
    this.setUpTable();
  }

  setUpRegExps() {
    const allWords = [];
    this._items.forEach(function(item, index) {
      item._index = index;
      const words = [];
      item.words.forEach(function(find) {
        const escaped = escapeRegExp(find);
        words.push(escaped);
        allWords.push(escaped);
      });
      item._regexp = new RegExp('\\b' + words.join('\\b|\\b') + '\\b', 'g');
    });
    this._regexp = new RegExp('\\b' + allWords.join('\\b|\\b') + '\\b', 'g');
  }

  setUpTable() {
    this._table = {};
    this._items.forEach(item => {
      item.words.forEach(word => {
        this._table[word] = item.definition;
      });
    });
  }

  onAbbrClick(event) {
    const $target = $(event.target);

    const word = $target.text();
    const definition = $target.attr('definition');

    const json = _.extend({}, this.model.toJSON(), { word, definition });

    const title = Handlebars.compile(this.model.get('title'))(json);
    const body = Handlebars.compile(this.model.get('body'))(json);

    notify.popup({
      title,
      body: '<div no-definition="true">' + body + '</div>',
      _showIcon: this.model.get('_showIcon'),
      _classes: 'is-extension is-definitions'
    });

  }

}

export default (Adapt.definitions = new Definitions());
