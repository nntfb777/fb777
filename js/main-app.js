const { createApp } = Vue;

createApp({
  data() {
    return {
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
      banners: [
        "images/banner/1.jpg",
        "images/banner/2.jpg",
        "images/banner/3.jpg",
        "images/banner/4.jpg"
      ],
      apiUrl: "https://linksbackend.nnt79g.workers.dev/api/admin/links?site_id=fb777"
    };
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
            // Khởi tạo lại danh sách xáo trộn ngẫu nhiên sau khi có Master URLs từ API
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
      if (this.timeHanlde) clearInterval(this.timeHanlde);
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
        this.sortList();
      }, 1000);
    },
    refresh() {
      this.tim = 0;
      if (this.timeHanlde) clearInterval(this.timeHanlde);
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
      if (typeof $ !== 'undefined' && $.ajax) {
        $.ajax({
          type: 'get',
          url: url,
          dataType: 'jsonp',
          timeout: 1000,
          complete: function (res) {
            const targetList = _this[listName];
            if (targetList && targetList[index]) {
              if (res.status == 200) {
                targetList[index].second = _this.tim > 5000 ? _this.connectTimeout : _this.tim + 'ms';
                targetList[index].time = _this.tim;
              } else {
                targetList[index].second = _this.connectFail;
                targetList[index].time = 999999;
              }
            }
          },
        });
      }
    },
    down() {
      if (this.browserDetection() == 'PC') {
        window.location.href = this.pcUrl || '#';
      } else {
        window.location.href = this.apkAppUrl || '#';
      }
    },
    browserDetection() {
      var userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.match(/ipad|iphone|android|midp/i)) {
        return 'mobile';
      }
      return 'PC';
    }
  }
}).mount('#app');
