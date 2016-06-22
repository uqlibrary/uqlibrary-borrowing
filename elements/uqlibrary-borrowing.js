(function () {
  Polymer({
    is: 'uqlibrary-borrowing',
    properties: {
      /**
       * Whether the element should auto load accounts
       */
      autoload: {
        type: Boolean,
        value: true,
        notify: true
      },
      /**
       * Whether the app is in standalone mode
       */
      standAlone: {
        type: Object,
        value: false
      },
      /**
       * The header title
       */
      headerTitle: {
        type: String,
        value: 'Borrowing'
      },
      /**
       * The selected tab index
       */
      _selectedTabIndex: {
        type: Number,
        value: 0
      },
      // Users borrowed assets data
      data: {
        notify: true,
        observer: 'dataChanged'
      },

      // Users data formatted
      processedItems: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },

      // Tab selected
      selectedTab: {
        type: String,
        value: '',
        observer: 'selectedTabChanged'
      },

      // Keyboard navigation
      keyboardNavigationKeys: {
        type: String,
        value: 'space enter'
      },

      // Total in Fines
      _sumFines: {
        type: Number,
        value: 0
      },

      // Users details
      user: {
        type: Object,
        value: function () {
          return {};
        }
      },
      primoView: {
        type: String,
        value: '61UQ'
      }
    },

    /*
     * Link current user and load its account information related to Loans, Holds and Fines
     */
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
    },

    /*
    * If the data property has changed, recalculate the total in fees and inject the patrons id in each sub component
    */
    dataChanged: function () {
      if (this.user) {
        this._sumFines = this.$.fines.moneyFormat(this.$.fines.calculateFines(this.data.fines));

        var patron = this.data.recordNumber;
        this.$.loans.patron = patron;
        this.$.holds.patron = patron;
        this.$.fines.patron = patron;
        this.$.loans.primoView = this.primoView;
        this.$.holds.primoView = this.primoView;
        this.$.fines.primoView = this.primoView;

        this.fire('uqlibrary-borrowing-data-loaded');
      }
    },

    /*
     * Callback when the main tab is selected / changed
     */
    selectedTabChanged: function (newValue, oldValue) {
      // check oldValue to prevent load on init
      if (oldValue != '' && newValue != '' && oldValue != newValue) {
        this.get(newValue);
        this.$.ga.addEvent('Borrowing Tab', newValue);
      }
    },
    /**
     * Toggles the drawer panel of the main UQL app
     * @private
     */
    _toggleDrawerPanel: function () {
      this.fire('uqlibrary-toggle-drawer');
    }
  });
}());
