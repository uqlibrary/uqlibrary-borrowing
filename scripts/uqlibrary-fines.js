(function () {
  Polymer({
    is: 'uqlibrary-fines',
    properties: {
      patron: {
        type: String,
        value: ''
      },
      contextual: {
        type: Array
      },
      footer: {
        type: Array
      },
      fineMinimumPayableAmount: {
        value: function () {
          return 20 * 100;
        }
      },
      fines: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true,
        observer: 'finesChanged'
      },
      processedItems: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },
      finesSum: {
        type: Number,
        value: 0
      },
      // in cents
      needToPay: {
        type: String,
        value: 'don\'t need'
      },
      transitioning: {
        type: Boolean,
        value: false
      }
    },
    ready: function () {
      this.set('$.finesList.noItemsMessage', 'No overdue charges');
      this.set('$.finesList.showEachDate', true);
      this.addEventListener('uqlibrary-borrowing-list-item-selected', function (e) {
        var _item = e.detail;
        if (_item.hasOwnProperty('url')) {
          window.location.href = _item.url;
        }
      });
    },
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
        } else
        //if(_fine.description) {
        //_fine.attentionIcon = {icon: "warning", text: _fine.description, type: 'warning'};
        //}
        {
          if (_fine.description) {
            _fine.subtitle = _fine.description;
          }
        }
        fines.push(_fine);
      }
      this.processedItems = fines;
      this.finesSum = this.calculateFines(fines);
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
      if (this._patronNumber()) {
        this.footer = [{
          title: 'Pay now',
          url: 'https://library.uq.edu.au/patroninfo~S7/' + this._patronNumber() + '/overdues'
        }];
      } else {
        this.footer = [];
      }
      if (this.finesSum >= this.fineMinimumPayableAmount) {
        this.needToPay = 'need';
      }
    },
    transitioningChangeHandler: function (e) {
      if (e.detail.hasOwnProperty('transitioning'))
        this.transitioning = e.detail.transitioning;
    },
    _patronNumber: function() {
      return this.patron;
    },
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
    moneyFormat: function (value) {
      return '$' + (value > 0 ? (parseFloat(value) / 100).toFixed(2) : '0');
    },
    _msgNoPay: function () {
      return 'No need to pay unless you reach ' + this.moneyFormat(this.fineMinimumPayableAmount);
    },
    _lessThenMin: function () {
      return (this.finesSum < this.fineMinimumPayableAmount);
    },
    _getHref: function () {
      return 'https://library.uq.edu.au/patroninfo~S7/' + this._patronNumber() + '/overdues';
    }
  });
}());
