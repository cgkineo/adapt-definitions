import Adapt from 'core/js/adapt';
import documentModifications from 'core/js/DOMElementModifications';
import Handlebars from 'handlebars';

const forbiddenParents = 'button, a, [role=dialog], [role=heading], header, span[definition], [no-definition]';
const requireParents = '.contentobject';

class Injector extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, 'app:dataReady', this.onLoaded);
    this._isWatching = false;
    this.definitionId = 0;
  }

  onLoaded() {
    this.processDocument();
    this.startWatching();
  }

  startWatching () {
    if (this._isWatching) return;
    this._isWatching = true;
    this.listenTo(documentModifications, 'added', this.onMutation);
  }

  onMutation(event) {
    setTimeout(() => {
      this.processNode(event.target);
    });
  }

  processDocument() {
    const nodes = [...document.querySelectorAll('body *:not(script, style, svg)')];
    nodes.forEach(this.processNode);
  }

  processNode(node) {
    if (node._isBionic) return;
    const textNodes = [...node.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .filter(node => node.nodeValue.trim());
    if (!textNodes.length) return;
    textNodes.forEach(node => {
      const parentElement = node.parentNode;
      const isInsideForbiddenParents = Boolean($(parentElement).closest(forbiddenParents).length);
      if (isInsideForbiddenParents) return;
      const isInsideRequiredParents = Boolean($(parentElement).closest(requireParents).length);
      if (!isInsideRequiredParents) return;
      parentElement._isBionic = true;
      const value = String(node.nodeValue);
      const children = [];
      const keywords = [...value.matchAll(Adapt.definitions._regexp)];
      if (!keywords.length) return;
      let last = null;
      const selected = keywords.reduce((parts, entry) => {
        const keyword = entry[0];
        const nextStart = entry.index;
        const nextLength = keyword.length;
        const lastEnd = last
          ? last.index + last[0].length
          : null;
        if (!last && keywords[0].index - 1 > 0) {
          parts.push(document.createTextNode(value.substring(0, keywords[0].index)));
        }
        if (last && lastEnd < nextStart) {
          parts.push(document.createTextNode(value.substring(lastEnd, nextStart)));

        }
        const term = value.substring(nextStart, nextStart + nextLength);
        const definition = Adapt.definitions._table[keyword];
        this.definitionId++;
        const elements = $(Handlebars.templates.definition({ term, definition, id: this.definitionId }));
        parts.push(...elements);
        last = entry;
        return parts;
      }, []).filter(Boolean);
      last = keywords[keywords.length - 1];
      if (last.index + last[0].length < value.length) {
        selected.push(document.createTextNode(value.substring(last.index + last[0].length)));
      }
      children.push(...selected.map(copy => {
        parentElement.insertBefore(copy, node);
        copy._isBionic = true;
        return copy;
      }));
      parentElement.removeChild(node);
    });
  }

}

export default new Injector();
