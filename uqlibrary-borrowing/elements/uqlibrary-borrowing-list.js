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
      url: {
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
      window.location.href = this.url + '&vid=' + this.primoView;
    },

    _itemClass: function (item){
      return item.classType;
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
        items[i].classType = '';

        var numMinutesLeft = moment(items[i].date).fromNow(true);
        var textCheck = 'minutes';
        if (-1 != numMinutesLeft.indexOf(textCheck)) { // different display for items due in an hour or less
          items[i].classType = ' dueWithinOneHour';
          if (!items[i].hasOwnProperty('dayPrefixText')) {
            items[i].dayPrefixText = 'Due in';
          }
          if (!items[i].hasOwnProperty('day')) {
            items[i].day = numMinutesLeft.replace(textCheck, '').trim();
          }
          if (!items[i].hasOwnProperty('daySuffixText')) {
            items[i].daySuffixText = textCheck;
          }

        } else
        {
          if (!items[i].hasOwnProperty('day')) {
            items[i].day = items[i].date.getDate();
          }
          if (!items[i].hasOwnProperty('dayPrefixText')) {
            items[i].dayPrefixText = moment(items[i].date).format('ddd');
          }
          if (!items[i].hasOwnProperty('daySuffixText')) {
            items[i].daySuffixText = moment(items[i].date).format('MMM');
          }
        }

        if (items[i].class == '' && !items[i].hasOwnProperty('thetime')) {
          items[i].thetime = moment(items[i].date).format('HH:mm');
        }

        items[i].class += ' item-item';

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

      if (!this.colHeader) {
        this.colHeader = 'DUE DATE';
      }

    }
  });
}());
