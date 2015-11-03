let React = require('react');
let ReactDOM = require('react-dom');

let utils = require('../../lib/utils.js');
let bem = utils.bemHelper('ais-clear-all');
let cx = require('classnames');

let autoHideContainer = require('../../decorators/autoHideContainer');
let headerFooter = require('../../decorators/headerFooter');

let isEmpty = require('lodash/lang/isEmpty');

let defaultTemplates = require('./defaultTemplates');

/**
 * Allows to clear all refinements at once
 * @param  {string|DOMElement} options.container CSS Selector or DOMElement to insert the widget
 * @param  {Object} [options.cssClasses] CSS classes to add
 * @param  {string|string[]} [options.cssClasses.root] CSS class to add to the root element
 * @param  {string|string[]} [options.cssClasses.header] CSS class to add to the header element
 * @param  {string|string[]} [options.cssClasses.body] CSS class to add to the body element
 * @param  {string|string[]} [options.cssClasses.footer] CSS class to add to the footer element
 * @param  {string|string[]} [options.cssClasses.link] CSS class to add to the link element
 * @param  {Object} [options.templates] Templates to use for the widget
 * @param  {string|Function} [options.templates.header=''] Header template
 * @param  {string|Function} [options.templates.body] Item template
 * @param  {string|Function} [options.templates.footer=''] Footer template
 * @param  {boolean} [options.autoHideContainer=true] Hide the container when there's no refinement to clear
 * @return {Object}
 */
function clearAll({
    container,
    templates = defaultTemplates,
    cssClasses: userCssClasses = {},
    hideContainerWhenNoResults = true
  } = {}) {
  let containerNode = utils.getContainerNode(container);
  let usage = 'Usage: toggle({container[, cssClasses.{root,header,body,footer,link}, templates.{header,body,footer}, autoHideContainer]})';

  let Template = headerFooter(require('../../components/Template.js'));
  if (hideContainerWhenNoResults === true) {
    Template = autoHideContainer(Template);
  }

  if (!container) {
    throw new Error(usage);
  }

  return {
    render: function({helper, state, templatesConfig, createURL}) {
      let hasRefinements = !isEmpty(helper.state.facetsRefinements)
        || !isEmpty(helper.state.facetsExcludes)
        || !isEmpty(helper.state.disjunctiveFacetsRefinements)
        || !isEmpty(helper.state.numericRefinements)
        || !isEmpty(helper.state.tagRefinements)
        || !isEmpty(helper.state.hierarchicalFacetsRefinements);

      let cssClasses = {
        root: cx(bem(null), userCssClasses.root),
        header: cx(bem('header'), userCssClasses.header),
        body: cx(bem('body'), userCssClasses.body),
        footer: cx(bem('footer'), userCssClasses.footer),
        link: cx(bem('link'), userCssClasses.link)
      };

      let url = createURL(state.clearRefinements());

      let data = {
        hasRefinements: hasRefinements,
        cssClasses: cssClasses,
        url: url
      };

      let templateProps = utils.prepareTemplateProps({
        transformData: null,
        defaultTemplates,
        templatesConfig,
        templates
      });

      ReactDOM.render(
        <Template
          className={cssClasses.body}
          data={data}
          shouldAutoHideContainer={!hasRefinements}
          templateKey="body"
          templateProps={templateProps}
          {...templateProps}
        />,
        containerNode
      );
    }
  };
}

module.exports = clearAll;
