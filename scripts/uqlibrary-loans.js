(function () {
  Polymer({
    is: 'uqlibrary-loans',
    properties: {
      // links to be displayed in the Info modal page
      contextual: {
        type: Array
      },
      // Array with all users loans
      loans: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true,
        observer: 'loansChanged'
      },
      // loans array formatted
      processedItems: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },
      // Transitioning process running 
      transitioning: {
        type: Boolean,
        value: false
      },
      // Hide footer if no loans
      hideFooter: {
        type: Boolean,
        value: false
      },
      // User id
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
      this.contextual = [{
        title: 'Your borrowing rights and limits',
        url: 'https://www.library.uq.edu.au/borrowing-requesting/borrowing-rules',
        id: 'borrowingGuide'
      }];
    },

    /*
     * If 'loans' array change, 
     * recalculate the total in fees and inject the patrons id in each sub component
     */
    loansChanged: function () {
      this.processedItems = [];
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
        loans.push(_loan);
      }
      this.processedItems = loans;
      this.hideFooter = !(loans.length>0);
    },

    /*
     * Transitioning change handler
     */
    transitioningChangeHandler: function (e) {
      if (e.detail.hasOwnProperty('transitioning'))
        this.transitioning = e.detail.transitioning;
    },

    /*
     * Open users loans dashboard
     */
    _openUrl: function() {
      window.location = 'https://library.uq.edu.au/patroninfo~S7/' + this.patron + '/items';
    }
  });
}());
