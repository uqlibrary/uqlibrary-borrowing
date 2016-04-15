(function () {
  Polymer({
    is: 'uqlibrary-borrowing-list',
    properties: {
      /**
       * The `items` attribute is an array of items to display on the timeline.
       *
       * @property items
       * @type array
       */
      items: { observer: 'itemsChanged' },
      /**
       * The `noitemsMessage` a message to display when there are no upcoming items
       *
       * @property noitemsMessage
       * @type String
       */
      noItemsMessage: {
        type: String,
        value: 'You do not have any items'
      },
      showEachDate: {
        type: Boolean,
        value: false
      },
      sortByDate: {
        type: Boolean,
        value: true
      }
    },
    ready: function () {
      this.items = [];
      this.processedItems = [];
    },
    /**
     * The 'uqlibrary-borrowing-list-item-selected' item is fired when a user taps on an item in timeline,
     * object containing item details is returned
     * @item item-selected
     */
    _itemSelected: function (item, data, source) {
      var itemId = source.getAttribute('data-item-id');
      var selectedItem = this.items.filter(function (item) {
        return item.id == itemId;
      });
      this.fire('uqlibrary-borrowing-list-item-selected', selectedItem.length ? selectedItem[0] : undefined);
    },
    itemsChanged: function (_, changeValue) {
      var items = this.items;
      var processed = [];
      // Sort by date (ascending) is necessary
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
      //build processed items lists for display in timeline
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
        //same day items should not display date
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
      }
      this.processedItems = processed;
    },
    contextualButtonClicked: function (e, data, sender) {
      var _id = sender.getAttribute('id');
      if (_id) {
        this.fire('uqlibrary-borrowing-contextual-button-clicked', { button: { id: _id } });
      }
    },
    _isEmpty: function() {
      return !!(typeof this.items !== 'undefined' && this.items.length);
    }
  });
}());
