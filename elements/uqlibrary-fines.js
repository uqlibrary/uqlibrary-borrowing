(function () {
  Polymer({
    is: 'uqlibrary-fines',
    properties: {
      // links to be displayed in the Info modal page
      contextual: {
        type: Array
      },
      // Fine Minimum payable amount, literally
      fineMinimumPayableAmount: {
        value: function () {
          return 20 * 100;
        }
      },
      // Array with all users fines
      fines: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true,
        observer: 'finesChanged'
      },
      // users fines data formatted
      processedItems: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },
      // Users total fine
      finesSum: {
        type: Number,
        value: 0
      },
      // Users ID
      patron: {
        type: String
      },
      // Transitioning process running 
      transitioning: {
        type: Boolean,
        value: false
      },
      // Disable pay now button if finesSum < fineMinimumPayableAmount
      hidePayNow: {
        type: Boolean,
        value: false
      }
    },

    /*
     * Initial settings
     */
    ready: function () {
      this.set('$.finesList.showEachDate', true);
      this.addEventListener('uqlibrary-borrowing-list-item-selected', function (e) {
        var _item = e.detail;
        if (_item.hasOwnProperty('url')) {
          window.location.href = _item.url;
        }
      });
      this.contextual = [
        {
          title: 'About overdue charges',
          url: 'https://www.library.uq.edu.au/help/borrowing#overdues',
          id: 'aboutOverdueCharges'
        },
        {
          title: 'Payment options',
          url: 'https://www.library.uq.edu.au/help/payment-options',
          id: 'paymentOptions'
        }
      ];
    },
    /*
     * If 'fines' array change, 
     * recalculate the total in fees, reformat rows and reset hidePayNow property
     */
    finesChanged: function () {
      this.processedItems = [];
      var fines = [];
      for (var i = 0; i < this.fines.length; i++) {
        var _fine = this.fines[i];
        _fine.class = 'fine-item';
        _fine.id = i;
        _fine.date = new Date(_fine.dateAssessed);
        _fine.day = this.moneyFormat(_fine.fineAmount);
        _fine.dayPrefixText = '';
        _fine.daySuffixText = '';
        if (_fine.dueDate) {
          _fine.dueDate = new Date(_fine.dueDate);
          _fine.dueDateText = _fine.dueDate.getDate() + '/' + (_fine.dueDate.getMonth() + 1) + '/' + _fine.dueDate.getFullYear();
        }
        if (_fine.dateReturned) {
          _fine.dateReturned = new Date(_fine.dateReturned);
          _fine.dateReturnedText = _fine.dateReturned.getDate() + '/' + (_fine.dateReturned.getMonth() + 1) + '/' + _fine.dateReturned.getFullYear();
        }
        _fine.actions = [];
        if (_fine.dueDateText && _fine.dateReturnedText) {
          _fine.subtitle = 'Due date: ' + _fine.dueDateText;
          _fine.secondaryText = 'Date returned: ' + _fine.dateReturnedText;
        } else if (_fine.description) {
          _fine.subtitle = _fine.description;
        }
        fines.push(_fine);
      }
      this.processedItems = fines;
      this.finesSum = this.calculateFines(fines);
      this.hidePayNow = (this.finesSum < this.fineMinimumPayableAmount);
    },
    /*
     * sum all users fines and convert the total to integer
     */
    calculateFines: function (fines) {
      this.finesSum = 0;
      if (fines && fines.length > 0) {
        for (var i = 0; i < fines.length; i++) {
          if (fines[i].fineAmount) {
            this.finesSum += parseInt(fines[i].fineAmount);
          }
        }
      }
      return this.finesSum;
    },
    /*
     * currency format ($.00) 
     */
    moneyFormat: function (value) {
      return '$' + (value > 0 ? (parseFloat(value) / 100).toFixed(2) : '0');
    },
    /*
     * Open users overdue dashboard
     */
    _openUrl: function () {
      window.location = 'https://library.uq.edu.au/patroninfo~S7/' + this.patron + '/overdues';
    },
    /*
     * Open Info modal page
     */
    _toggleInfo: function() {
      this.$.finesInfoDialog.toggle();
    }

  });
}());
