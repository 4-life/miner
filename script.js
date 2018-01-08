(function() {
    'use strict';

    function WeNeedToGoDeeper() {
        this.start = document.body.querySelector('.mainBtn-start');
        this.stop = document.body.querySelector('.mainBtn-stop');

        this.throttleMinus = document.body.querySelector('.throttleBtn-minus');
        this.throttlePlus = document.body.querySelector('.throttleBtn-plus');
        this.throttleVal = document.body.querySelector('.throttleVal');

        this.hashPerSecond = document.body.querySelector('.hashPerSecond').querySelector('span');
        this.totalHashes = document.body.querySelector('.totalHashes').querySelector('span');

        this.stop.style.visibility = 'hidden';

        this.throttle = 5;
        this.throttleVal.innerText = (this.throttle * 10) + '%';
    }

    var miner = new WeNeedToGoDeeper();

    var coinhive = new CoinHive.Anonymous('0tAcgWi5E5lT88AJd91iSYVopNjpkfjb', {
        throttle: miner.throttle / 10
    });

    function setEvents() {
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
            miner.throttleVal.innerText = (miner.throttle * 10) + '%';
            coinhive.setThrottle((10 - miner.throttle) / 10);
        });

        miner.throttlePlus.addEventListener('click', function() {
            miner.throttle > 9 ? miner.throttle = 10 : miner.throttle++;
            miner.throttleVal.innerText = (miner.throttle * 10) + '%';
            coinhive.setThrottle((10 - miner.throttle) / 10);
        });
    }

    function updatingHashesPerSecond() {
        miner.getHashesPerSecond = setInterval(function () {
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
