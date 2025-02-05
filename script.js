document.addEventListener('DOMContentLoaded', () => {
    const amount = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const result = document.getElementById('result');
    const convertBtn = document.getElementById('convert');
    const swapBtn = document.getElementById('swap-currency');
    const updateTime = document.getElementById('update-time');
    const usdRate = document.getElementById('usd-rate');
    const sarRate = document.getElementById('sar-rate');
    const yerRate = document.getElementById('yer-rate');

    // أسعار الصرف الحالية (تحديث 5 فبراير 2025)
    const exchangeRates = {
        USD: {
            RUB: 92.50,
            SAR: 3.75,
            YER: 250.00
        },
        RUB: {
            USD: 0.0108,
            SAR: 0.041,
            YER: 2.70
        },
        SAR: {
            USD: 0.27,
            RUB: 24.67,
            YER: 66.67
        },
        YER: {
            USD: 0.004,
            RUB: 0.37,
            SAR: 0.015
        }
    };

    // تحديث أسعار العملات في الصفحة
    function updateDisplayRates() {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        usdRate.textContent = `1 USD = ${exchangeRates.USD.RUB.toFixed(2)} RUB`;
        sarRate.textContent = `1 SAR = ${exchangeRates.SAR.RUB.toFixed(2)} RUB`;
        yerRate.textContent = `1 YER = ${exchangeRates.YER.RUB.toFixed(2)} RUB`;
        updateTime.textContent = `آخر تحديث: ${formattedDate}`;
    }

    function convertCurrency() {
        if (!amount.value) {
            alert('الرجاء إدخال المبلغ');
            return;
        }

        const from = fromCurrency.value;
        const to = toCurrency.value;
        const amountValue = parseFloat(amount.value);

        if (from === to) {
            result.value = amountValue.toFixed(2);
            return;
        }

        let rate = 1;
        if (exchangeRates[from] && exchangeRates[from][to]) {
            rate = exchangeRates[from][to];
        } else if (exchangeRates[to] && exchangeRates[to][from]) {
            rate = 1 / exchangeRates[to][from];
        }

        const convertedAmount = (amountValue * rate).toFixed(2);
        result.value = convertedAmount;

        // إضافة تأثير بصري للتحديث
        result.style.backgroundColor = '#f0fff4';
        setTimeout(() => {
            result.style.backgroundColor = '';
        }, 300);
    }

    function swapCurrencies() {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        if (amount.value) {
            convertCurrency();
        }
    }

    // تحديث أسعار العملات كل دقيقة
    updateDisplayRates();
    setInterval(updateDisplayRates, 60000);

    // إضافة مستمعي الأحداث
    convertBtn.addEventListener('click', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    amount.addEventListener('input', convertCurrency);
    fromCurrency.addEventListener('change', convertCurrency);
    toCurrency.addEventListener('change', convertCurrency);

    // إضافة تأثيرات تفاعلية
    const inputs = [amount, fromCurrency, toCurrency];
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
});
