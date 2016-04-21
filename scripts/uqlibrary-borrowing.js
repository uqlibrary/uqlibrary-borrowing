(function () {
  Polymer({
    is: 'uqlibrary-borrowing',
    properties: {
      // Should the component auto-load the user account. turn it off for debug
      autoload: {
        type: Boolean,
        value: true,
        notify: true
      },

      // Users data
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
      sumFines: {
        type: Number,
        value: 0
      },

      // Users details
      user: {
        type: Object,
        value: function () {
          return {};
        }
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
        this.sumFines = this.$.fines.moneyFormat(this.$.fines.calculateFines(this.data.fines));

        var patron = this.data.recordNumber;
        this.$.loans.patron = patron;
        this.$.holds.patron = patron;
        this.$.fines.patron = patron;

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
    }
  });
}());
