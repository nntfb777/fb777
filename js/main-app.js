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
      giftcodeUrl: ""
    },
    banners: [],
    apiUrl: "https://linksbackend.nnt79g.workers.dev/api/admin/links?site_id=fb777"
  },
  computed: {
    groupedBanners: function () {
      var pairs = [];
      if (!this.banners || this.banners.length === 0) return pairs;
      for (var i = 0; i < this.banners.length; i += 2) {
        pairs.push(this.banners.slice(i, i + 2));
      }
      return pairs;
    }
  },
  async mounted() {
    await this.fetchLinksFromApi();
  },
  methods: {
    async fetchLinksFromApi() {
      try {
        var res = await fetch(this.apiUrl);
        var result = await res.json();
        
        if (result.success && result.data && result.data.length > 0) {
          var data = result.data;

          var kefu = data.find(function(i) { return i.key_name === 'kefuUrl'; });
          var apk = data.find(function(i) { return i.key_name === 'apkAppUrl'; });
          var pc = data.find(function(i) { return i.key_name === 'pcUrl'; });

          if (kefu && kefu.value) this.kefuUrl = kefu.value;
          if (apk && apk.value) this.apkAppUrl = apk.value;
          if (pc && pc.value) this.pcUrl = pc.value;

          // 1. Lấy mảng link ping từ API
          var pings = data.filter(function(i) { return i.category === 'ping_link'; }).map(function(i) { return i.value; });
          if (pings.length > 0) {
            this.masterUrls = pings;
            
            // 2. Tải link LẦN ĐẦU THEO ĐÚNG THỨ TỰ API (chưa xáo trộn)
            this.initOrderedUrls();
            
            // 3. Sau khi trang tải xong 1.5 giây, tiến hành thay đổi thứ tự ngẫu nhiên
            setTimeout(() => {
              this.refresh();
            }, 1500);
          }

          var _this = this;
          data.filter(function(i) { return i.category === 'social_link'; }).forEach(function(item) {
            if (item.value) _this.socialLinks[item.key_name] = item.value;
          });

          var bannerList = data.filter(function(i) { return i.category === 'banner_image'; }).map(function(i) { return i.value; });
          if (bannerList.length > 0) {
            this.banners = bannerList;
          }
        }
      } catch (err) {
        console.error("Lỗi nạp link từ API:", err);
      }
    },
    // Khởi tạo link theo ĐÚNG THỨ TỰ gốc từ API
    initOrderedUrls() {
      var _this = this;
      var list = this.masterUrls.slice(0, 5).map(function(url, index) {
        var fakeMs = Math.floor(Math.random() * 12) + 3;
        return {
          url: url,
          title: 'Link sa Pag-access ' + (index + 1),
          second: fakeMs + 'ms',
          time: fakeMs
        };
      });
      this.urls = JSON.parse(JSON.stringify(list));
      this.moburls = JSON.parse(JSON.stringify(list));
      this.startFakePing();
    },
    // Xáo trộn ngẫu nhiên link sau khi trang tải xong
    getRandomUrls(count) {
      if (!this.masterUrls || this.masterUrls.length === 0) return [];
      var shuffled = this.masterUrls.slice().sort(function() { return 0.5 - Math.random(); });
      var selectedUrls = shuffled.slice(0, count);
      return selectedUrls.map(function(url, index) {
        var fakeMs = Math.floor(Math.random() * 12) + 3;
        return {
          url: url,
          title: 'Link sa Pag-access ' + (index + 1),
          second: fakeMs + 'ms',
          time: fakeMs
        };
      });
    },
    startFakePing() {
      if (this.timeHanlde) clearInterval(this.timeHanlde);
      var _this = this;
      
      this.timeHanlde = setInterval(function() {
        if (_this.urls) {
          _this.urls.forEach(function(item) {
            var variation = Math.floor(Math.random() * 5) - 2;
            var newTime = Math.max(2, item.time + variation);
            item.second = newTime + 'ms';
          });
        }
        if (_this.moburls) {
          _this.moburls.forEach(function(item) {
            var variation = Math.floor(Math.random() * 5) - 2;
            var newTime = Math.max(2, item.time + variation);
            item.second = newTime + 'ms';
          });
        }
      }, 1500);
    },
    refresh() {
      this.urls = this.getRandomUrls(5);
      this.moburls = this.getRandomUrls(5);
      this.startFakePing();
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
});
