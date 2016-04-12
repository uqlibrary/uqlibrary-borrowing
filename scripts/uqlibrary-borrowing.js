(function () {
  Polymer({
    is: 'uqlibrary-borrowing',
    properties: {
      autoload: {
        type: Boolean,
        value: true,
        notify: true
      },
      data: {
        notify: true,
        observer: 'dataChanged'
      },
      // Accessibility issues fixes
      keyboardNavigationKeys: {
        type: String,
        value: 'space enter'
      },
      patronNumber: {
        type: String,
        value: ''
      },
      sumFines: {
        type: Number,
        value: 0
      },
      user: {
        type: Object,
        value: function () {
          return {};
        }
      }
    },
    a11yKeyPressed: function (source, event) {
      if (source.path && source.path.length > 0 && source.path[0].target) {
        source.path[0].target.fire('tap');
      }
    },
    ready: function () {
      var that = this;

/*
      this.$.account.addEventListener('uqlibrary-api-account-loaded', function (e) {
        if (e.detail.hasSession) {
          that.user = e.detail;
          that.$.loansApi.get();
        } else {
          // Not logged in
          that.$.account.login(window.location.href);
        }
      });
      if (this.autoload) {
        this.$.account.get();
      }
*/

      this.$.uqlibraryMenu.addEventListener('uqlibrary-menu-loaded', function (e) {
        var borrowingData = that.$.uqlibraryMenu.applications.filter(function (element) {
          return element.app == 'uqlibrary-borrowing';
        })[0];
        if (borrowingData && borrowingData.subApplications) {
          that.hideLoans = borrowingData.subApplications.filter(function (element) {
            return element.app == 'Loans';
          })[0].ptypes.indexOf(Number(that.user.type)) == -1;
          that.hideHolds = borrowingData.subApplications.filter(function (element) {
            return element.app == 'Holds';
          })[0].ptypes.indexOf(Number(that.user.type)) == -1;
          that.hideFines = borrowingData.subApplications.filter(function (element) {
            return element.app == 'Fines';
          })[0].ptypes.indexOf(Number(that.user.type)) == -1;
        }
        that.pages.selected = that.tabs.selected;
      });
/*
      this.$.loansApi.addEventListener('uqlibrary-api-account-loans-loaded', function (e) {
        that.data = e.detail;
      });
*/

      this.addEventListener('iron-select', function() {
//      this.$.ga.addEvent('Tab changed', that.tabs.selected);
        var pages = document.querySelector('iron-pages');
        var tabs = document.querySelector('paper-tabs');
        pages.selected = tabs.selected;
      });
      // Listen to persistent footer buttons clicks
      this.addEventListener('uqlibrary-persistent-footer-action-button-clicked', function (e) {
        this.$.ga.addEvent('Action button clicked', e.detail.button.title);
      });
      // Listen to persistent footer buttons clicks
      this.addEventListener('uqlibrary-borrowing-contextual-button-clicked', function (e) {
        this.$.ga.addEvent('Contextual button clicked', e.detail.button.id);
      });
    },
    dataChanged: function () {
      if (this.user) {
        this.processData();
      }
    },
    processData: function () {
      this.sumFines = this.$.fines.moneyFormat(this.$.fines.calculateFines(this.data.fines));
      var patronNumber = this.data.recordNumber;
      //Contextual and footer links
      this.set('$.holds.actionButtons', {
        footer: [],
        contextual: []
      });
      if (this.data.checkedOut && this.data.checkedOut.length > 0) {
        this.set('$.loans.actionButtons', {
          footer: [{
              title: 'Renew Loans',
              url: 'https://library.uq.edu.au/patroninfo~S7/' + patronNumber + '/items'
            }]
        });
      }
      // Support different contextual links
      this.set('$.loans.actionButtons.contextual', [{
          title: 'Your borrowing rights and limits',
          url: 'https://www.library.uq.edu.au/borrowing-requesting/borrowing-rules',
          id: 'borrowingGuide'
        }]);
      this.set('$.holds.actionButtons', {
        footer: [],
        contextual: []
      });
      if (this.data.holds && this.data.holds.length > 0) {
        this.set('$.holds.actionButtons.footer', [{
            title: 'Manage Holds',
            url: 'https://library.uq.edu.au/patroninfo~S7/' + patronNumber + '/holds'
          }]);
      }
      this.set('$.holds.actionButtons.contextual', [{
          title: 'About placing a hold',
          url: 'https://www.library.uq.edu.au/help/place-hold',
          id: 'aboutPlacingHold'
        }]);
      this.set('$.fines.actionButtons', {
        footer: [],
        contextual: []
      });
      this.set('$.fines.patronNumber', patronNumber);
      if (this.data.fines && this.data.fines.length > 0) {
      }
      this.$.fines.actionButtons.footer = [{title: 'Pay now', url: 'https://library.uq.edu.au/patroninfo~S7/' + patronNumber + '/overdues'}];
      this.set('$.fines.actionButtons.contextual', [
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
      ]);
      this.fire('uqlibrary-borrowing-data-loaded');
    },
    transitionPrepareHandler: function () {
      this.transitioning = true;
      this.fire('core-signal', {
        name: 'transitioning-change',
        data: { transitioning: this.transitioning }
      });
    },
    transitionEndHandler: function () {
      this.transitioning = false;
      this.fire('core-signal', {
        name: 'transitioning-change',
        data: { transitioning: this.transitioning }
      });
    },
    hostAttributes: {
      'layout': '',
      'center': ''
    },
    _polywrapper: function(field) {
      return this.$[field];
    }
  });
}());
