let React = require('react');
let ReactDOM = require('react-dom');

let utils = require('../../lib/utils.js');
let autoHideContainer = require('../../decorators/autoHideContainer');
let headerFooter = require('../../decorators/headerFooter');
let bem = require('../../lib/utils').bemHelper('ais-stats');
let cx = require('classnames');

let defaultTemplates = require('./defaultTemplates.js');

/**
 * Display various stats about the current search state
 * @param  {string|DOMElement} options.container CSS Selector or DOMElement to insert the widget
 * @param  {Object} [options.cssClasses] CSS classes to add
 * @param  {string} [options.cssClasses.root] CSS class to add to the root element
 * @param  {string} [options.cssClasses.header] CSS class to add to the header element
 * @param  {string} [options.cssClasses.body] CSS class to add to the body element
 * @param  {string} [options.cssClasses.footer] CSS class to add to the footer element
 * @param  {string} [options.cssClasses.time] CSS class to add to the element wrapping the time processingTimeMs
 * @param  {Object} [options.templates] Templates to use for the widget
 * @param  {string|Function} [options.templates.header=''] Header template
 * @param  {string|Function} [options.templates.body] Body template
 * @param  {string|Function} [options.templates.footer=''] Footer template
 * @param  {Function} [options.transformData] Function to change the object passed to the `body` template
 * @param  {boolean} [hideContainerWhenNoResults=true] Hide the container when there's no results
 * @return {Object}
 */
function stats({
    container,
    cssClasses: userCssClasses = {},
    hideContainerWhenNoResults = true,
    templates = defaultTemplates,
    transformData
  }) {
  let containerNode = utils.getContainerNode(container);

  let Stats = headerFooter(require('../../components/Stats/Stats.js'));
  if (hideContainerWhenNoResults === true) {
    Stats = autoHideContainer(Stats);
  }

  if (!containerNode) {
    throw new Error('Usage: stats({container[, template, transformData, hideContainerWhenNoResults]})');
  }

  return {
    render: function({results, templatesConfig}) {
      let hasNoResults = results.nbHits === 0;
      let templateProps = utils.prepareTemplateProps({
        transformData,
        defaultTemplates,
        templatesConfig,
        templates
      });

      let cssClasses = {
        body: cx(bem('body'), userCssClasses.body),
        footer: cx(bem('footer'), userCssClasses.footer),
        header: cx(bem('header'), userCssClasses.header),
        root: cx(bem(null), userCssClasses.root),
        time: cx(bem('time'), userCssClasses.time)
      };

      ReactDOM.render(
        <Stats
          cssClasses={cssClasses}
          hitsPerPage={results.hitsPerPage}
          nbHits={results.nbHits}
          nbPages={results.nbPages}
          page={results.page}
          processingTimeMS={results.processingTimeMS}
          query={results.query}
          shouldAutoHideContainer={hasNoResults}
          templateProps={templateProps}
        />,
        containerNode
      );
    }
  };
}

module.exports = stats;
