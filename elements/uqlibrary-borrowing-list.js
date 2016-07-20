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
      },
      primoView: {
        type: String
      },
      listType: {
        type: String
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
      e.stopPropagation();
      window.open(e.model.item.url + '&vid=' + this.primoView, '_blank');
    },

    /*
     * If the 'data' property has changed, recalculate the total in fees and inject the patrons id in each sub component
     */
    itemsChanged: function (_, changeValue) {
      var items;
      var processed = [];
      var haveDivider = false;

      if (this.sortByDate) {
        this.items.sort(function (a, b) {
          var aDate = moment(a.date);
          var bDate = moment(b.date);
          if (aDate.isAfter(bDate)) {
            return 1;
          } else {
            return -1;
          }
        });
      }

      for (var i = 0; i < this.items.length; i++) {
        var item = JSON.parse(JSON.stringify(this.items[i]));
        item.date = new Date(item.date);

        var numMinutesLeft = moment(item.date).fromNow(true);
        var textCheck = 'minutes';
        if (-1 != numMinutesLeft.indexOf(textCheck)) { // different display for items due in an hour or less
            item.dayPrefixText = 'Due in';
            item.day = numMinutesLeft.replace(textCheck, '').trim();
            item.daySuffixText = textCheck;

        } else
        {
            item.day = item.date.getDate();
            item.dayPrefixText = moment(item.date).format('ddd');
            item.daySuffixText = moment(item.date).format('MMM');
        }

        if (item.class == '') {
          item.thetime = moment(item.date).format('HH:mm');
        }

        item.class += ' item-item';

        //insert divider between past and upcoming
        if (i > 0 && !haveDivider 
          && new Date().getTime() < item.date.getTime() 
          && new Date().getTime() >= processed[i - 1].date.getTime()) {
          processed[i - 1].class += ' last';
          haveDivider = true;
          processed.push({ isDivider: true });
        }
        processed.push(item);
      }
      if (processed.length > 0) {
        processed[0].class += ' first';
        this.processedItems = processed;
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }

      if (!this.colHeader) {
        this.colHeader = 'DUE DATE';
      }

    }
  });
}());
