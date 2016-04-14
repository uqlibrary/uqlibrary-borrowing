(function () {
  Polymer({
    is: 'uqlibrary-holds',
    properties: {
      patron: {
        type: String
      },
      contextual: {
        type: Array
      },
      footer: {
        type: Array
      },
      holds: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true,
        observer: 'holdsChanged',
        reflectToAttribute: true
      },
      transitioning: {
        type: Boolean,
        value: false
      }
    },
    ready: function () {
      this.set('$.holdsTimeline.noItemsMessage', 'No current holds');
      this.set('$.holdsTimeline.showEachDate', true);
      this.set('$.holdsTimeline.sortByDate', false);
      // we don't care about placed date, so disable sorting by date
      this.addEventListener('uqlibrary-borrowing-list-item-selected', function (e) {
        var _item = e.detail;
        if (_item.hasOwnProperty('url')) {
          window.location.href = _item.url;
        }
      });
    },
    holdsChanged: function () {
      this.processData();
    },
    processData: function () {
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

      this.contextual = [{
        title: 'About placing a hold',
        url: 'https://www.library.uq.edu.au/help/place-hold',
        id: 'aboutPlacingHold'
      }];
      if (this._patronNumber()) {
        this.footer = [{
          title: 'Manage Holds',
          url: 'https://library.uq.edu.au/patroninfo~S7/' + this._patronNumber() + '/holds'
        }];
      } else {
        this.footer = [];
      }
    },
    transitioningChangeHandler: function (e) {
      if (e.detail.hasOwnProperty('transitioning'))
        this.transitioning = e.detail.transitioning;
    },
    _patronNumber: function() {
      return this.patron;
    },
    _computeHidden: function () {
      return !(this.footer && this.footer.length);
    }
  });
}());
