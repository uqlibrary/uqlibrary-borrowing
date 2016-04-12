(function () {
  Polymer({
    is: 'uqlibrary-loans',
    properties: {
      actionButtons: { notify: true },
      loans: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true,
        observer: 'loansChanged'
      },
      processedItems: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },
      transitioning: {
        type: Boolean,
        value: false
      },
      noItemsMessage: {
        type: String,
        value: 'No Loans'
      }
    },
    ready: function() {
      this.addEventListener('uqlibrary-borrowing-list-item-selected', function (e) {
        var _item = e.detail;
        if (_item.hasOwnProperty('url')) {
          window.location.href = _item.url;
        }
      });
    },
    loansChanged: function () {
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
        } else //_loan.attentionIcon = {icon: "warning", text: "This item is "+ Math.abs(overdue) + " day(s) overdue", type: 'warning'};
        //_loan.class += ' warning';
        //_loan.daysOverdue = Math.abs(overdue);
        //this.data.loansOverdue ++;
        if (overdue >= 0 && overdue < 5) {
          _loan.daysRemain = overdue;
        }
        loans.push(_loan);
      }
      this.processedItems = loans;
    },
    //_loan.attentionIcon = {icon: "warning", text: (overdue == 0 ? 'Last day of the loan' : "This item is due in "+ overdue + " day(s)"), type: 'warning'};
    //this.data.dueSoon ++;
    transitioningChangeHandler: function (e) {
      if (e.detail.hasOwnProperty('transitioning'))
        this.transitioning = e.detail.transitioning;
    }
  });
}());
