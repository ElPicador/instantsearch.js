// force using index because package 'main' is dist/
var instantsearch = require('../../index');

var search = instantsearch({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'movies',
  urlSync: {
    useHash: true
  }
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-box',
    placeholder: 'Search for movies',
    poweredBy: true
  })
);

search.addWidget(
  instantsearch.widgets.stats({
    container: '#stats'
  })
);

search.addWidget(
  instantsearch.widgets.hitsPerPageSelector({
    container: '#hits-per-page-selector',
    options: [
      {value: 8, label: '6 per page'},
      {value: 12, label: '12 per page'},
      {value: 24, label: '24 per page'}
    ],
    cssClasses: {
      select: 'form-control'
    }
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      empty: require('./templates/no-results.html'),
      item: require('./templates/item.html')
    },
    hitsPerPage: 12
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
    cssClasses: {
      root: 'pagination',
      active: 'active'
    },
    maxPages: 20
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#genres',
    facetName: 'genre',
    operator: 'and',
    limit: 10,
    templates: {
      header: 'Genres'
    }
  })
);

search.addWidget(
  instantsearch.widgets.rangeSlider({
    container: '#years',
    facetName: 'year',
    templates: {
      header: 'Year'
    }
  })
);

search.addWidget(
  instantsearch.widgets.refinementList({
    container: '#actors',
    facetName: 'actor_facets',
    operator: 'and',
    limit: 10,
    templates: {
      header: 'Brands',
      item: '<a href="{{href}}"><span class="pull-right badge">{{count}}</span><img class="pull-left" src="{{image_url}}" /> {{name}}</a>'
    },
    transformData: function(data) {
      var s = data.name.split('|');
      data.image_url = s[0];
      data.name = s[1];
      return data;
    }
  })
);

search.once('render', function() {
  document.querySelector('.search').className = 'row search search--visible';
});

search.start();
