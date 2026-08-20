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
    // ✅ Cung cấp ảnh mặc định phòng trường hợp API chưa có banner
    banners: [
      "images/banner/1.jpg",
      "images/banner/2.jpg",
      "images/banner/3.jpg",
      "images/banner/4.jpg",
      "images/banner/5.jpg",
      "images/banner/6.jpg"
    ],
    apiUrl: "https://linksbackend.nnt79g.workers.dev/api/admin/links?site_id=fb777"
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

          const kefu = data.find(i => i.key_name === 'kefuUrl');
          const apk = data.find(i => i.key_name === 'apkAppUrl');
          const pc = data.find(i => i.key_name === 'pcUrl');

          if (kefu) this.kefuUrl = kefu.value;
          if (apk) this.apkAppUrl = apk.value;
          if (pc) this.pcUrl = pc.value;

          const pings = data.filter(i => i.category === 'ping_link').map(i => i.value);
          if (pings.length > 0) {
            this.masterUrls = pings;
            this.urls = this.getRandomUrls(5);
            this.moburls = this.getRandomUrls(5);
          }

          data.filter(i => i.category === 'social_link').forEach(item => {
            if (item.value) this.socialLinks[item.key_name] = item.value;
          });

          const bannerList = data.filter(i => i.category === 'banner_image').map(i => i.value);
          if (bannerList.length > 0) {
            this.banners = bannerList;
          }
        }
      } catch (err) {
        console.error("Lỗi tải link từ API:", err);
      }
    },
    getRandomUrls(count) {
      if (!this.masterUrls || this.masterUrls.length === 0) return [];
      // Trộn ngẫu nhiên danh sách link từ API
      const shuffled = this.masterUrls.slice().sort(() => 0.5 - Math.random());
      const selectedUrls = shuffled.slice(0, count);
      return selectedUrls.map((url, index) => ({
        url: url,
        title: `Link sa Pag-access ${index + 1}`,
        second: this.waitingText,
        time: 0
      }));
    },
    startPingCheck() {
      // Giả lập kiểm tra ping cho danh sách PC
      for (let i = 0; i < this.urls.length; i++) {
        this.sendFakePing(i, 'urls');
      }
      // Giả lập kiểm tra ping cho danh sách Mobile
      for (let j = 0; j < this.moburls.length; j++) {
        this.sendFakePing(j, 'moburls');
      }

      // Sắp xếp danh sách sau khi đã tạo xong ms giả
      setTimeout(() => {
        this.sortList();
      }, 300);
    },
    sendFakePing(index, listName) {
      // Tạo số ngẫu nhiên từ 3ms đến 9ms
      const fakeMs = Math.floor(Math.random() * (9 - 3 + 1)) + 3;
      const targetList = this[listName];
      if (targetList[index]) {
        targetList[index].time = fakeMs;
        targetList[index].second = fakeMs + 'ms';
      }
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
