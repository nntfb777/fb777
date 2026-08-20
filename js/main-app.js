var app = new Vue({
  el: '#app',
  data: {
    timeHanlde: null,
    tim: 0,
    // Danh sách 5 link cố định ban đầu
    masterUrls: [
      "https://bf-025.club/",
      "https://bf-014.club/",
      "https://bf-031.club/",
      "https://bf-020.club/",
      "https://bf-021.club/"
    ],
    urls: [],
    moburls: [],
    waitingText: "waiting",
    connectTimeout: "connect Timeout",
    connectFail: '9ms',
    name: 'FB777.com/',
    kefuUrl: "https://t.me/FB777_Official77",
    apkAppUrl: "http://fc.fb777.ac/",
    pcUrl: "http://fc.fb777.ac/",
    // API dành riêng cho tải trang trong tương lai
    apiUrl: "https://linksbackend.nnt79g.workers.dev/api/admin/links?site_id=fb777"
  },
  mounted() {
    // 1. Tải link từ mảng cố định ban đầu
    this.refresh();

    // 2. Gọi API để lấy dữ liệu (khi Backend sẵn sàng trả về đúng 5 link)
    this.fetchLinksFromApi();
  },
  methods: {
    async fetchLinksFromApi() {
      try {
        var res = await fetch(this.apiUrl);
        var result = await res.json();
        
        // Khi Backend đã chuẩn hóa logic trả về 5 link
        if (result.success && result.data && result.data.length > 0) {
          var pings = result.data.filter(function(i) { return i.category === 'ping_link'; }).map(function(i) { return i.value; });
          if (pings.length > 0) {
            this.masterUrls = pings;
            this.refresh();
          }
        }
      } catch (err) {
        // Nếu API chưa sẵn sàng, trang vẫn chạy mượt bằng link cố định ở trên
      }
    },
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
