    var app = new Vue({
        el: '#app',
        data: {
            timeHanlde: null,
            tim: 0,
            
            masterUrls: [
                "https://bf-025.club/",
                "https://bf-014.club/",
                "https://bf-031.club/",
                "https://bf-059.club/",
                "https://bf-081.club/",
                "https://bf-091.club/",
                "https://bf-004.club/",
                "https://bf-089.club/",
                "https://bf-005.club/",
                "https://bf-018.club/",
                "https://bf-022.club/",
                "https://bf-024.club/",
            ],

            urls: [],
            moburls: [], 

            waitingText: "waiting",
            connectTimeout: "connect Timeout",
            connectFail: '9ms',
            name: 'FB777.com/',
            kefuUrl: "https://w9c0kvv.k0vc1svq.com/chatwindow.aspx?siteId=65002300&planId=1aa9ff7f-27c2-4618-9d93-28d5cd97fec2&chatgroup=3",
            apkAppUrl: 'https://bf-040.club/DownloadApp/',
            pcUrl: 'https://bf-089.club/DownloadApp/',
        },
        mounted() {
            this.urls = this.getRandomUrls(5);
            this.moburls = this.getRandomUrls(5);

            this.startPingCheck();
        },
        methods: {
            getRandomUrls(count) {
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
                    this.tim++
                }, 100)
                for (let i = 0; i < this.urls.length; i++) {
                    this.send(this.urls[i].url, i, 'urls')
                }
                for (let j = 0; j < this.moburls.length; j++) {
                    this.send(this.moburls[j].url, j, 'moburls');
                }
                setTimeout(() => {
                    this.sortList(this.urls);
                    this.sortList(this.moburls);
                }, 1000)
            },

            refresh() {
                this.tim = 0
                clearInterval(this.timeHanlde)
                
                // CẬP NHẬT: Chọn lại URL ngẫu nhiên khi làm mới
                this.urls = this.getRandomUrls(5);
                this.moburls = this.getRandomUrls(5);
                
                this.startPingCheck();
            },
            
            sortOrder(filed, type = 'asc') {
                return (a, b) => {
                    if (type === 'asc') return a[filed] > b[filed] ? 1 : -1;
                    return a[filed] > b[filed] ? -1 : 1;
                }
            },
            sortList() {
                this.urls.sort(this.sortOrder('time', 'asc'))
                this.moburls.sort(this.sortOrder('time', 'asc'))
            },
            send(url, index, listName) { 
                const _this = this
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
                            }
                            else {
                                targetList[index].second = _this.tim + 'ms';
                            }
                            targetList[index].time = _this.tim;
                        }
                        else {
                            targetList[index].second = _this.connectFail;
                            targetList[index].time = 999999;
                        }
                    },
                })
            },
            down() {
                if (this.browserDetection() == 'PC') {
                    window.location.href = this.pcUrl;
                } else {
                    if (this.browserDetection() == 'iphone' || this.browserDetection() == 'ipad') {
                        window.location.href = this.ios_step_1
                        setTimeout(() => {
                            window.location.href = this.ios_step_2
                        }, 2000)
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
                    browser = 'midp'
                } else if (userAgent.match(/rv:1.2.3.4/i)) {
                    browser = 'rv:1.2.3.4';
                } else if (userAgent.match(/ucweb/i)) {
                    browser = 'ucweb';
                } else if (userAgent.match(/android/i)) {
                    browser = 'android';
                } else if (userAgent.match(/windows ce/i)) {
                    browser = 'windowsCe';
                } else if (userAgent.match(/windows mobile/i)) {
                    browser = 'windowsMobile';
                } else {
                    browser = 'PC'
                }
                return browser;
            }
        }
    })
    document.addEventListener("DOMContentLoaded", function () {
        const txtElements = document.querySelectorAll(".txt");

        function updateRandomPing() {
            txtElements.forEach(element => {
                const randomPing = Math.floor(Math.random() * 10 + 1) + "ms";
                element.textContent = randomPing;
            });
        }

        updateRandomPing();

        setTimeout(() => {
            setInterval(updateRandomPing, 1000);
        }, 1000);
    });
