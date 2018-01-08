(function() {
    'use strict';

    var languages = {
        'en': {
            'start': 'Start',
            'stop': 'Stop',
            'cpu_load': 'CPU load',
            'hash_per_sec': 'HASHES/S',
            'total': 'TOTAL HASHES',
            'error_adguard': 'Error! AdBlock or antivirus block mining. Please, turn them off'
        },
        'ru': {
            'start': 'Начать',
            'stop': 'Остановить',
            'cpu_load': 'Нагрузка',
            'hash_per_sec': 'Блок/сек',
            'total': 'Всего блоков',
            'error_adguard': 'Ошибка! AdBlock или антивирус блокируют майнинг. Пожалуйста, отключите их'
        }
    };

    function WeNeedToGoDeeper() {
        this.start = document.body.querySelector('.mainBtn-start');
        this.stop = document.body.querySelector('.mainBtn-stop');

        this.throttleMinus = document.body.querySelector('.throttleBtn-minus');
        this.throttlePlus = document.body.querySelector('.throttleBtn-plus');
        this.throttleVal = document.body.querySelector('.throttleVal');

        this.hashPerSecond = document.body.querySelector('.hashPerSecond').querySelector('.value');
        this.totalHashes = document.body.querySelector('.totalHashes').querySelector('.value');

        this.error = document.body.querySelector('.error');

        this.stop.style.visibility = 'hidden';

        this.throttle = 5;
        this.countError = 0;
        this.throttleVal.innerText = (this.throttle * 10) + '%';
    }

    var miner = new WeNeedToGoDeeper();

    var coinhive = new CoinHive.Anonymous('0tAcgWi5E5lT88AJd91iSYVopNjpkfjb');

    function i18n() {
        var lang = navigator.languages && navigator.languages[0] || navigator.language;
        lang = lang.substring(0,2);

        miner.i18n = document.body.querySelectorAll('[i18n]');

        for(var i = 0; i < miner.i18n.length; i++) {
            var key = miner.i18n[i].getAttribute('i18n');
            miner.i18n[i].innerText = languages[lang][key];
        }
    }

    i18n();

    function setEvents() {
        setThrottle();

        miner.start.addEventListener('click', function() {
            coinhive.start();
            updatingHashesPerSecond();
            updatingTotalHashes();
            miner.stop.style.visibility = 'visible';
            miner.start.style.visibility = 'hidden';
        });

        miner.stop.addEventListener('click', function() {
            coinhive.stop();
            stopUpdating();
            miner.stop.style.visibility = 'hidden';
            miner.start.style.visibility = 'visible';
        });

        miner.throttleMinus.addEventListener('click', function() {
            miner.throttle < 1 ? miner.throttle = 0 : miner.throttle--;
            setThrottle();
        });

        miner.throttlePlus.addEventListener('click', function() {
            miner.throttle > 9 ? miner.throttle = 10 : miner.throttle++;
            setThrottle();
        });
    }

    function setThrottle() {
        miner.throttleVal.innerText = (miner.throttle * 10) + '%';
        coinhive.setThrottle((10 - miner.throttle) / 10);
    }

    function updatingHashesPerSecond() {
        miner.getHashesPerSecond = setInterval(function () {
            if (coinhive.getHashesPerSecond()*1 === 0) {
                miner.countError++;
            }

            if (miner.countError > 5) {
                miner.error.style.display = 'block';
                stopUpdating();
            }
            miner.hashPerSecond.innerText = coinhive.getHashesPerSecond().toFixed(1);
        }, 1000);
    }

    function updatingTotalHashes() {
        miner.getTotalHashes = setInterval(function () {
            miner.totalHashes.innerText = coinhive.getTotalHashes();
        }, 1000);
    }

    function stopUpdating() {
        clearInterval(miner.getHashesPerSecond);
        clearInterval(miner.getTotalHashes);
    }

    window.addEventListener('load', setEvents);
})();
