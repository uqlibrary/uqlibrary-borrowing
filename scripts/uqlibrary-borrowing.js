(function () {
  Polymer({
    is: 'uqlibrary-borrowing',
    properties: {
      patron: {
        type: String
      },
      autoload: {
        type: Boolean,
        value: true,
        notify: true
      },
      data: {
        notify: true,
        observer: 'dataChanged'
      },
      processedItems: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },
      selectedTab: {
        type: String,
        value: '',
        observer: 'selectedTabChanged'
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

      this.$.loansApi.addEventListener('uqlibrary-api-account-loans-loaded', function (e) {
        that.data = e.detail;
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
        this.sumFines = this.$.fines.moneyFormat(this.$.fines.calculateFines(this.data.fines));
        if (this.data && typeof this.data.recordNumber !== 'undefined' && this.data.recordNumber) {
          this.patron = this.data.recordNumber;
        } else {
          this.patron = '';
        }
        this.fire('uqlibrary-borrowing-data-loaded');
      }
    },
    selectedTabChanged: function (newValue, oldValue) {
      // check oldValue to prevent load on init
      if (oldValue != '' && newValue != '') {
        this.get(newValue);
        this.$.ga.addEvent('Borrowing Tab', newValue);
      }
    },
    transitionPrepareHandler: function () {
      this.transitioning = true;
      this.fire('iron-signal', {
        name: 'transitioning-change',
        data: { transitioning: this.transitioning }
      });
    },
    transitionEndHandler: function () {
      this.transitioning = false;
      this.fire('iron-signal', {
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
