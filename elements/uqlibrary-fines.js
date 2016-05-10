(function () {
  Polymer({
    is: 'uqlibrary-fines',
    properties: {
      /**
       * The minimum amount when the fine becomes payable in cents
       */
      fineMinimumPayableAmount: {
        type: Number,
        value: 2000
      },
      /**
       * The user's fines
       */
      fines: {
        type: Array,
        notify: true,
        observer: 'finesChanged'
      },
      /**
       * Formatted version of the fines
       */
      _processedItems: {
        type: Array,
        notify: true
      },
      /**
       * Total fine amount for the user
       */
      finesSum: {
        type: Number,
        value: 0
      },
      /**
       * User ID
       */
      patron: {
        type: String
      },
      /**
       * Whether to hide the Pay now button
       */
      _hidePayNow: {
        type: Boolean,
        value: true
      },
      /**
       * Whether to hide the bottom footer
       */
      _hideFooter: {
        type: Boolean,
        value: true
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
    },
    /*
     * If 'fines' array change, 
     * recalculate the total in fees, reformat rows and reset _hidePayNow property
     */
    finesChanged: function () {
      this._processedItems = [];
      var fines = [];
      for (var i = 0; i < this.fines.length; i++) {
        var _fine = this.fines[i];
        _fine.class = 'fine-item';
        _fine.id = i;
        _fine.date = new Date(_fine.dateAssessed);
        _fine.day = this.moneyFormat(_fine.fineAmount);
        _fine.dayPrefixText = '';
        _fine.daySuffixText = '';
        _fine.ariaLabel = _fine.day + ' due for loan ' + _fine.title;
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
      this._processedItems = fines;
      this.finesSum = this.calculateFines(fines);

      this._hidePayNow = (this.finesSum < this.fineMinimumPayableAmount);
      this._hideFooter = (this.finesSum == 0);
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
      window.open('https://library.uq.edu.au/patroninfo~S7/' + this.patron + '/overdues', '_blank');
    },
    /*
     * Open Info modal page
     */
    _toggleInfo: function() {
      this.$.finesInfoDialog.toggle();
    }

  });
}());
