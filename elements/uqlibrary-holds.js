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
      },
      /**
       * Whether to hide the view more link
       */
      _hideViewMore: {
        type: Boolean,
        value: true
      },
      primoView: {
        type: String,
        observer: 'primoViewChanged'
      },
      recordCount: {
        type: Number,
        observer: 'recordCountChanged'
      }
    },

    /*
     * Initial settings
     */
    ready: function () {
      this.set('$.holdsTimeline.showEachDate', true);
      this.set('$.holdsTimeline.listType', 'holds');

      // we don't care about placed date, so disable sorting by date
      this.set('$.holdsTimeline.sortByDate', false);

      this.addEventListener('uqlibrary-borrowing-list-item-selected', function (e) {
        var _item = e.detail;
        if (_item.hasOwnProperty('url')) {
          window.location.href = _item.url;
        }
      });
    },
    primoViewChanged: function () {
      this.$.holdsTimeline.primoView = this.primoView;
    },
    recordCountChanged: function () {
      this._hideViewMore = (this.recordCount <= this.holds.length);
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
        _hold.ariaLabel = _hold.title + '. Status: ';

        //_hold.actions = [];
        if (_hold.status == 'ON_HOLD_SHELF') {
          _hold.dayPrefixText = 'Ready';
          _hold.day = '';
          _hold.daySuffixText = 'for pickup';
          _hold.ariaLabel += 'Ready for pickup';
          if (_hold.pickupLocation) {
            _hold.subtitle = 'Pickup location: ' + _hold.pickupLocation;
            _hold.ariaLabel += _hold.subtitle;
          }
        } else if (_hold.status == 'IN_PROCESS') {
          _hold.dayPrefixText = 'Transit';
          _hold.day = '';
          _hold.daySuffixText = 'for pickup';
          _hold.subtitle = '';
          _hold.ariaLabel += 'Transit for pickup.';
          if (_hold.pickupLocation) {
            _hold.secondaryText = 'Pickup location: ' + _hold.pickupLocation;
            _hold.ariaLabel += _hold.secondaryText;
          }
        } else { // NOT_STARTED
          _hold.dayPrefixText = 'On';
          _hold.daySuffixText = 'Hold';
          _hold.day = '';
          _hold.subtitle = 'Date placed: ' + _hold.dateText;
          _hold.ariaLabel += 'On hold. ' + _hold.subtitle;
        }
      }
      // Sort by status
      this.holds.sort(function (a, b) {
        var statusOrder = {
          ON_HOLD_SHELF: 0,
          IN_PROCESS: 5,
          NOT_STARTED: 10
        };
        if (statusOrder[a.status] > statusOrder[b.status]) {
          return 1;
        }
        if (statusOrder[b.status] > statusOrder[a.status]) {
          return -1;
        }
        return 0;
      });
      this._hideFooter = (this.holds.length<1);
      //this._hideViewMore = (this.total_holds_count <= this.holds.length);
    },
    /*
     * Open users holds dashboard
     */
    _openUrl: function() {
      window.open('http://search.library.uq.edu.au/primo_library/libweb/action/myAccountMenu.do?activity=requests&vid='+this.primoView, '_blank');
    }
  });
}());
