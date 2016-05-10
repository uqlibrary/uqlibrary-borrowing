(function () {
  Polymer({
    is: 'uqlibrary-loans',
    properties: {
      /**
       * Loans array received by uqlibrary-borrowing
       */
      loans: {
        type: Array,
        notify: true,
        observer: 'loansChanged'
      },
      /**
       * Formatted version of the Loans array
       */
      _processedItems: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },
      /**
       * Whether to show the footer
       */
      _hideFooter: {
        type: Boolean,
        value: false
      },
      /**
       * User ID
       */
      patron: {
        type: String
      }
    },
    /*
     * Initial settings
     */
    ready: function() {
      this.addEventListener('uqlibrary-borrowing-list-item-selected', function (e) {
        var _item = e.detail;
        if (_item.hasOwnProperty('url')) {
          window.location.href = _item.url;
        }
      });
    },
    /*
     * If 'loans' array change, 
     * reformat rows and reset hideFooter property
     */
    loansChanged: function () {
      this._processedItems = [];
      var loans = [];
      for (var i = 0; i < this.loans.length; i++) {
        var _loan = this.loans[i];
        _loan.class = '';
        _loan.id = i;
        _loan.date = new Date(_loan.dueDate);
        _loan.dateText = _loan.date.getDate() + '/' + (_loan.date.getMonth() + 1) + '/' + _loan.date.getFullYear();
        if (_loan.barcodes) {
          _loan.subtitle = 'Barcode: ' + _loan.barcodes;
        }
        if (_loan.callNumber) {
          _loan.secondaryText = 'Call Number: ' + _loan.callNumber;
        }
        _loan.actions = [];
        var today = new Date();
        var overdue = Math.ceil((_loan.date - today) / (1000 * 60 * 60 * 24));
        _loan.daysRemain = -1;
        if (overdue < 0) {
          _loan.isOverdue = true;
        } else  if (overdue >= 0 && overdue < 5) {
          _loan.daysRemain = overdue;
        }

        _loan.ariaLabel = _loan.title + ". Due " + _loan.dateText;

        loans.push(_loan);
      }
      this._processedItems = loans;
      this._hideFooter = !(loans.length>0);
    },
    /*
     * Open users loans dashboard
     */
    _openUrl: function() {
      window.location = 'https://library.uq.edu.au/patroninfo~S7/' + this.patron + '/items';
    }
  });
}());