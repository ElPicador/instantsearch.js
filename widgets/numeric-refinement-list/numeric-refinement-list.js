let React = require('react');
let ReactDOM = require('react-dom');

let utils = require('../../lib/utils.js');
let bem = utils.bemHelper('ais-refinement-list');
let cx = require('classnames');

let autoHideContainer = require('../../decorators/autoHideContainer');
let headerFooter = require('../../decorators/headerFooter');

let defaultTemplates = require('./defaultTemplates');

/**
 * Instantiate a list of refinements based on a facet
 * @param  {string|DOMElement} options.container CSS Selector or DOMElement to insert the widget
 * @param  {string} options.attributeName Name of the attribute for filtering
 * @param  {Object} [options.cssClasses] CSS classes to add to the wrapping elements: root, list, item
 * @param  {string|string[]} [options.cssClasses.root] CSS class to add to the root element
 * @param  {string|string[]} [options.cssClasses.header] CSS class to add to the header element
 * @param  {string|string[]} [options.cssClasses.body] CSS class to add to the body element
 * @param  {string|string[]} [options.cssClasses.footer] CSS class to add to the footer element
 * @param  {string|string[]} [options.cssClasses.list] CSS class to add to the list element
 * @param  {string|string[]} [options.cssClasses.link] CSS class to add to each link element
 * @param  {string|string[]} [options.cssClasses.active] CSS class to add to each active element
 * @param  {Object} [options.templates] Templates to use for the widget
 * @param  {string|Function} [options.templates.header] Header template
 * @param  {string|Function} [options.templates.item] Item template, provided with `name`, `count`, `isRefined`
 * @param  {string|Function} [options.templates.footer] Footer template
 * @param  {Function} [options.transformData] Function to change the object passed to the item template
 * @param  {boolean} [hideContainerWhenNoResults=true] Hide the container when there's no results
 * @return {Object}
 */
function numericRefinementList({
  container,
  attributeName,
  options,
  cssClasses: userCssClasses = {},
  templates = defaultTemplates,
  transformData,
  hideContainerWhenNoResults = true
  }) {
  let containerNode = utils.getContainerNode(container);
  let usage = 'Usage: numericRefinementList({container, attributeName, options, [sortBy, limit, cssClasses.{root,header,body,footer,list,item,active,label,checkbox,count}, templates.{header,item,footer}, transformData, hideContainerWhenNoResults]})';

  let RefinementList = headerFooter(require('../../components/RefinementList/RefinementList.js'));
  if (hideContainerWhenNoResults === true) {
    RefinementList = autoHideContainer(RefinementList);
  }

  if (!container || !attributeName) {
    throw new Error(usage);
  }

  return {
    getConfiguration: () => {
      return {};
    },

    render: function({results, helper, templatesConfig, state, createURL}) {
      let templateProps = utils.prepareTemplateProps({
        transformData,
        defaultTemplates,
        templatesConfig,
        templates
      });

      let facetValues = options.map(function (option) {
        option.isRefined = isRefined(helper.state, attributeName, option);
        return option;
      });

      let hasNoResults = facetValues.length === 0;

      let cssClasses = {
        root: cx(bem(null), userCssClasses.root),
        header: cx(bem('header'), userCssClasses.header),
        body: cx(bem('body'), userCssClasses.body),
        footer: cx(bem('footer'), userCssClasses.footer),
        list: cx(bem('list'), userCssClasses.list),
        link: cx(bem('link'), userCssClasses.link),
        active: cx(bem('item', 'active'), userCssClasses.active)
      };

      ReactDOM.render(
        <RefinementList
          createURL={(facetValue) => createURL(refine(state, attributeName, options, facetValue))}
          cssClasses={cssClasses}
          facetValues={facetValues}
          shouldAutoHideContainer={hasNoResults}
          templateProps={templateProps}
          toggleRefinement={toggleRefinement.bind(null, helper, attributeName, options)}
          />,
        containerNode
      );
    }
  };
}

function isRefined(state, attributeName, option) {
  var currentRefinements = state.getNumericRefinements(attributeName);

  if (option.start !== undefined && option.end !== undefined) {
    if (option.start === option.end) {
      return currentRefinements['='] != undefined &&
        currentRefinements['='].find(function (refinement) { return refinement == option.start }) !== undefined;
    }
  }

  if (option.start !== undefined) {
    return currentRefinements['>='] != undefined &&
      currentRefinements['>='].find(function (refinement) { return refinement == option.start }) !== undefined;
  }

  if (option.end !== undefined) {
    return currentRefinements['<='] != undefined &&
      currentRefinements['<='].find(function (refinement) { return refinement == option.end }) !== undefined;
  }

  if (option.start === undefined && option.end === undefined) {
    return Object.keys(currentRefinements).length === 0
  }
}

function refine(state, attributeName, options, facetValue) {
  var refinedOption = options.find(function (option) {
    return option.name == facetValue;
  });

  var currentRefinements = state.getNumericRefinements(attributeName);

  if (refinedOption.start === undefined && refinedOption.end === undefined) {
    return state.clearRefinements(attributeName);
  }

  if (isRefined(state, attributeName, refinedOption) === false) {
    state = state.clearRefinements(attributeName);
  }

  if (refinedOption.start !== undefined && refinedOption.end !== undefined) {
    if (refinedOption.start > refinedOption.end) {
      throw new Error("option.start should be > to option.end");
    }

    if (refinedOption.start === refinedOption.end) {
      if (currentRefinements['='] != undefined &&
        currentRefinements['='].find(function (refinement) { return refinement == refinedOption.start }) !== undefined) {
        state = state.removeNumericRefinement(attributeName, '=', refinedOption.start);
      } else {
        state = state.addNumericRefinement(attributeName, '=', refinedOption.start);
      }
      return state;
    }
  }

  if (refinedOption.start !== undefined) {
    if (currentRefinements['>='] != undefined &&
      currentRefinements['>='].find(function (refinement) { return refinement == refinedOption.start }) !== undefined) {
      state = state.removeNumericRefinement(attributeName, '>=', refinedOption.start);
    } else {
      state = state.addNumericRefinement(attributeName, '>=', refinedOption.start);
    }
  }

  if (refinedOption.end !== undefined) {
    if (currentRefinements['<='] != undefined &&
      currentRefinements['<='].find(function (refinement) { return refinement == refinedOption.end }) !== undefined) {
      state = state.removeNumericRefinement(attributeName, '<=', refinedOption.end);
    } else {
      state = state.addNumericRefinement(attributeName, '<=', refinedOption.end);
    }
  }

  return state;
}

function toggleRefinement(helper, attributeName, options, facetValue) {
  var newState = refine(helper.state, attributeName, options, facetValue);

  helper.setState(newState);

  helper.search();
}

module.exports = numericRefinementList;
