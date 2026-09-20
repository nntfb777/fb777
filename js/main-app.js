var app = new Vue({
  el: '#app',
  data: {
    timeHanlde: null,
    tim: 0,
    masterUrls: [],
    urls: [],
    moburls: [],
    waitingText: "waiting",
    connectTimeout: "connect Timeout",
    connectFail: '3ms',
    name: 'FB777.com/',
    kefuUrl: "",
    apkAppUrl: "",
    pcUrl: "",
    socialLinks: {
      telegramUrl: "https://telegram.me/FB777_Official77",
      dailyTelegramUrl: "https://telegram.me/FB777_Official77",
      facebookUrl: "",
      agentLoginUrl: "http://fc.fb777.ac/",
      giftcodeUrl: "https://bf-023.club//DownloadApp/"
    },
    banners: [
      "images/banner/1.jpg",
      "images/banner/2.jpg",
      "images/banner/3.jpg",
      "images/banner/4.jpg",
      "images/banner/5.jpg",
      "images/banner/6.jpg"
    ],
    apiUrl: "https://linksbackend.nnt79g.workers.dev/api/config?site_id=fb777"
  },
  computed: {
    groupedBanners() {
      const pairs = [];
      if (!this.banners || this.banners.length === 0) return pairs;
      for (let i = 0; i < this.banners.length; i += 2) {
        pairs.push(this.banners.slice(i, i + 2));
      }
      return pairs;
    }
  },
  async mounted() {
    await this.fetchLinksFromApi();
    this.urls = this.getRandomUrls(5);
    this.moburls = this.getRandomUrls(5);
    this.startPingCheck();
  },
  methods: {
    async fetchLinksFromApi() {
      try {
        const res = await fetch(this.apiUrl);
        const result = await res.json();

        if (result.success && result.data) {
          const data = result.data;

          if (data.systemLinks) {
            if (data.systemLinks.kefuUrl) this.kefuUrl = data.systemLinks.kefuUrl;
            if (data.systemLinks.apkAppUrl) this.apkAppUrl = data.systemLinks.apkAppUrl;
            if (data.systemLinks.pcUrl) this.pcUrl = data.systemLinks.pcUrl;
          }

          if (data.masterUrls && data.masterUrls.length > 0) {
            this.masterUrls = data.masterUrls;
            this.urls = this.getRandomUrls(5);
            this.moburls = this.getRandomUrls(5);
          }

          if (data.banners && data.banners.length > 0) {
            this.banners = data.banners;
          }

          if (data.socialLinks) {
            Object.assign(this.socialLinks, data.socialLinks);
          }
        }
      } catch (err) {
        console.error("Lỗi tải link từ API:", err);
      }
    },
    getRandomUrls(count) {
      if (!this.masterUrls || this.masterUrls.length === 0) return [];
      const shuffled = this.masterUrls.slice().sort(() => 0.5 - Math.random());
      const selectedUrls = shuffled.slice(0, count);
      return selectedUrls.map((url, index) => {
        const fakeMs = Math.floor(Math.random() * (9 - 3 + 1)) + 3;
        return {
          url: url,
          title: `Link sa Pag-access ${index + 1}`,
          second: fakeMs + 'ms',
          time: fakeMs
        };
      });
    },
    startPingCheck() {
      if (this.timeHanlde) clearInterval(this.timeHanlde);

      this.timeHanlde = setInterval(() => {
        if (this.urls && this.urls.length > 0) {
          this.urls.forEach(item => {
            const fakeMs = Math.floor(Math.random() * (9 - 3 + 1)) + 3;
            item.time = fakeMs;
            item.second = fakeMs + 'ms';
          });
        }
        if (this.moburls && this.moburls.length > 0) {
          this.moburls.forEach(item => {
            const fakeMs = Math.floor(Math.random() * (9 - 3 + 1)) + 3;
            item.time = fakeMs;
            item.second = fakeMs + 'ms';
          });
        }
      }, 1500);
    },
    refresh() {
      this.urls = this.getRandomUrls(5);
      this.moburls = this.getRandomUrls(5);
      this.startPingCheck();
    },
    sortOrder(filed, type = 'asc') {
      return (a, b) => {
        if (type === 'asc') return a[filed] > b[filed] ? 1 : -1;
        return a[filed] > b[filed] ? -1 : 1;
      };
    },
    sortList() {
      this.urls.sort(this.sortOrder('time', 'asc'));
      this.moburls.sort(this.sortOrder('time', 'asc'));
    },
    down() {
      if (this.browserDetection() == 'PC') {
        window.location.href = this.pcUrl;
      } else {
        if (this.browserDetection() == 'iphone' || this.browserDetection() == 'ipad') {
          window.location.href = this.ios_step_1;
          setTimeout(() => {
            window.location.href = this.ios_step_2;
          }, 2000);
        } else {
          window.location.href = this.apkAppUrl;
        }
      }
    },
    browserDetection() {
      var userAgent = window.navigator.userAgent.toLowerCase();
      var browser = null;
      if (userAgent.match(/ipad/i)) {
        browser = 'ipad';
      } else if (userAgent.match(/iphone os/i)) {
        browser = 'iphone';
      } else if (userAgent.match(/midp/i)) {
        browser = 'midp';
      } else if (userAgent.match(/android/i)) {
        browser = 'android';
      } else {
        browser = 'PC';
      }
      return browser;
    }
  }
});
