(function () {
  Polymer({
    is: 'uqlibrary-holds',
    properties: {
      /**
       * All holds
       */
      holds: {
        type: Array,
        notify: true,
        observer: 'holdsChanged'
      },
      /**
       * UserID
       */
      patron: {
        type: String
      },
      /**
       * Whether to hide the footer
       */
      hideFooter: {
        type: Boolean,
        value: false
      }
    },

    /*
     * Initial settings
     */
    ready: function () {
      this.set('$.holdsTimeline.showEachDate', true);

      // we don't care about placed date, so disable sorting by date
      this.set('$.holdsTimeline.sortByDate', false);

      this.addEventListener('uqlibrary-borrowing-list-item-selected', function (e) {
        var _item = e.detail;
        if (_item.hasOwnProperty('url')) {
          window.location.href = _item.url;
        }
      });
    },

    /*
     * If 'holds' array change
     * reformat rows and reset hideFooter property
     */
    holdsChanged: function () {
      for (var i = 0; i < this.holds.length; i++) {
        var _hold = this.holds[i];
        _hold.class = 'hold-item';
        _hold.id = i;
        _hold.date = new Date(_hold.datePlaced);
        _hold.dateText = _hold.date.getDate() + '/' + (_hold.date.getMonth() + 1) + '/' + _hold.date.getFullYear();
        //_hold.actions = [];
        if (_hold.status == 'bibReady' || _hold.status == 'itemReady') {
          _hold.dayPrefixText = 'Ready';
          _hold.day = '';
          _hold.daySuffixText = 'for pickup';
          if (_hold.pickupLocation) {
            _hold.subtitle = 'Pickup location: ' + _hold.pickupLocation;
          }
        } else if (_hold.status == 'itemTransit') {
          _hold.dayPrefixText = 'Transit';
          _hold.day = '';
          _hold.daySuffixText = 'for pickup';
          _hold.subtitle = '';
          if (_hold.pickupLocation) {
            _hold.secondaryText = 'Pickup location: ' + _hold.pickupLocation;
          }
        } else {
          _hold.dayPrefixText = 'On';
          _hold.daySuffixText = 'Hold';
          _hold.day = '';
          _hold.subtitle = 'Date placed: ' + _hold.dateText;
        }
      }
      // Sort by status
      this.holds.sort(function (a, b) {
        var statusOrder = {
          itemReady: 0,
          bibReady: 0,
          itemTransit: 5,
          onHold: 10
        };
        if (statusOrder[a.status] > statusOrder[b.status]) {
          return 1;
        }
        if (statusOrder[b.status] > statusOrder[a.status]) {
          return -1;
        }
        return 0;
      });
      this._hideFooter = !(this.holds.length>0);
    },
    /*
     * Open users holds dashboard
     */
    _openUrl: function() {
      window.location = 'https://library.uq.edu.au/patroninfo~S7/' + this.patron + '/holds';
    }
  });
}());
