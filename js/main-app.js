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
    connectFail: '9ms',
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
    banners: [],
    apiUrl: "https://linksbackend.nnt79g.workers.dev/api/admin/links?site_id=fb777"
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

          // 1. Gán Link Hệ Thống
          const kefu = data.find(i => i.key_name === 'kefuUrl');
          const apk = data.find(i => i.key_name === 'apkAppUrl');
          const pc = data.find(i => i.key_name === 'pcUrl');

          if (kefu) this.kefuUrl = kefu.value;
          if (apk) this.apkAppUrl = apk.value;
          if (pc) this.pcUrl = pc.value;

          // 2. Gán Master URLs (Ping links)
          const pings = data.filter(i => i.category === 'ping_link').map(i => i.value);
          if (pings.length > 0) this.masterUrls = pings;

          // 3. Gán Social Links
          data.filter(i => i.category === 'social_link').forEach(item => {
            if (item.value) this.socialLinks[item.key_name] = item.value;
          });

          // 4. Gán Banner Slideshow
          const bannerList = data.filter(i => i.category === 'banner_image').map(i => i.value);
          if (bannerList.length > 0) this.banners = bannerList;
        }
      } catch (err) {
        console.error("Lỗi tải link từ API:", err);
      }
    },
    getRandomUrls(count) {
      if (!this.masterUrls || this.masterUrls.length === 0) return [];
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
      this.timeHanlde = setInterval(() => {
        this.tim++;
      }, 100);

      for (let i = 0; i < this.urls.length; i++) {
        this.send(this.urls[i].url, i, 'urls');
      }
      for (let j = 0; j < this.moburls.length; j++) {
        this.send(this.moburls[j].url, j, 'moburls');
      }

      setTimeout(() => {
        this.sortList(this.urls);
        this.sortList(this.moburls);
      }, 1000);
    },
    refresh() {
      this.tim = 0;
      clearInterval(this.timeHanlde);
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
    send(url, index, listName) {
      const _this = this;
      $.ajax({
        type: 'get',
        url: url,
        dataType: 'jsonp',
        timeout: 1000,
        complete: function (res) {
          const targetList = _this[listName];
          if (res.status == 200) {
            if (_this.tim > 5000) {
              targetList[index].second = _this.connectTimeout;
            } else {
              targetList[index].second = _this.tim + 'ms';
            }
            targetList[index].time = _this.tim;
          } else {
            targetList[index].second = _this.connectFail;
            targetList[index].time = 999999;
          }
        },
      });
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
computed: {
  groupedBanners() {
    const pairs = [];
    for (let i = 0; i < this.banners.length; i += 2) {
      pairs.push(this.banners.slice(i, i + 2));
    }
    return pairs;
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
