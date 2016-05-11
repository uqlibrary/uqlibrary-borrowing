(function () {
  Polymer({
    is: 'uqlibrary-borrowing-list',
    properties: {
      // Items array to be displayed
      items: { observer: 'itemsChanged' },
      // If items array is empty, display emptyMessage
      emptyMessage: {
        type: String
      },
      // same day items should not display date
      showEachDate: {
        type: Boolean,
        value: false
      },
      // the list should be order by date? true/false
      sortByDate: {
        type: Boolean,
        value: true
      },
      // true if items array is empty
      isEmpty: {
        type: Boolean,
        value: true
      }
    },

    /*
     * once component has been loaded, reset main properties
     */
    ready: function () {
      this.items = [];
      this.processedItems = [];
    },

    /*
     * when item clicked, open its respective URL
     */
    _itemSelected: function (e) {
      window.open(e.model.item.url, '_blank');
    },

    /*
     * If the 'data' property has changed, recalculate the total in fees and inject the patrons id in each sub component
     */
    itemsChanged: function (_, changeValue) {
      var items = this.items;
      var processed = [];
      if (this.sortByDate) {
        items.sort(function (a, b) {
          var aDate = new Date(a.date).getTime();
          var bDate = new Date(b.date).getTime();
          if (aDate > bDate) {
            return 1;
          }
          if (aDate < bDate) {
            return -1;
          }
          return 0;
        });
      }
      var haveDivider = false;
      for (var i = 0; i < items.length; i++) {
        items[i].date = new Date(items[i].date);
        if (!items[i].hasOwnProperty('day')) {
          items[i].day = items[i].date.getDate();
        }
        if (!items[i].hasOwnProperty('dayPrefixText')) {
          items[i].dayPrefixText = moment(items[i].date).format('ddd');
        }
        if (!items[i].hasOwnProperty('daySuffixText')) {
          items[i].daySuffixText = moment(items[i].date).format('MMM');
        }
        items[i].class += ' item-item';

        if (!this.showEachDate && i > 0 && items[i].date.getDay() === items[i - 1].date.getDay() && items[i].date.getDate() === items[i - 1].date.getDate()) {
          items[i].day = '';
          items[i].dayPrefixText = '';
          items[i].daySuffixText = '';
        }
        //insert divider between past and upcoming
        if (i > 0 && !haveDivider && new Date().getTime() < items[i].date.getTime() && new Date().getTime() >= items[i - 1].date.getTime()) {
          items[i - 1].class += ' last';
          haveDivider = true;
          processed.push({ isDivider: true });
        }
        processed.push(items[i]);
      }
      if (processed.length > 0) {
        processed[0].class += ' first';
        this.processedItems = processed;
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }
    }
  });
}());
