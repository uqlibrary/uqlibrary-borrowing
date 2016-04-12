(function () {
  Polymer({
    is: 'uqlibrary-fines',
    properties: {
      actionButtons: { notify: true },
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
        observer: 'finesChanged',
        reflectToAttribute: true
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
      patronNumber: {
        type: String,
        value: ''
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
      this.processData();
      if (this.finesSum < this.fineMinimumPayableAmount) {
        this.set('actionButtons.footer', []);
      }
      if (this.finesSum >= this.fineMinimumPayableAmount) {
        this.needToPay = 'need';
      }
    },
    processData: function () {
      var _fines = [];
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
        this.finesSum = this.calculateFines(this.fines);
      }
    },
    transitioningChangeHandler: function (e) {
      if (e.detail.hasOwnProperty('transitioning'))
        this.transitioning = e.detail.transitioning;
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
    toggleInfo: function () {
      this.$.finesInfoDialog.toggle();
    },
    moneyFormat: function (value) {
      return '$' + (value > 0 ? (parseFloat(value) / 100).toFixed(2) : '0');
    },
    _computeHidden: function (finesSum) {
      return finesSum == 0;
    },
    _computeHidden2: function (fineMinimumPayableAmount, finesSum) {
      return finesSum >= fineMinimumPayableAmount;
    },
    _computeLabel: function (fineMinimumPayableAmount) {
      return 'No need to pay unless you reach ' + this.moneyFormat(fineMinimumPayableAmount);
    },
    _computeHidden3: function (fineMinimumPayableAmount, finesSum) {
      return finesSum < fineMinimumPayableAmount;
    },
    _computeHref: function (patronNumber) {
      return 'https://library.uq.edu.au/patroninfo~S7/' + patronNumber + '/overdues';
    }
  });
}());
