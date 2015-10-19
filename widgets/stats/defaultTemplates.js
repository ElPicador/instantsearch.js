module.exports = {
  header: '',
  body: `<div class="{{cssClasses.root}}">
  {{#hasNoResults}}No results{{/hasNoResults}}
  {{#hasOneResult}}1 result{{/hasOneResult}}
  {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results{{/hasManyResults}}
  <span class="{{cssClasses.time}}">found in {{processingTimeMS}}ms</span>
</div>`,
  footer: ''
};