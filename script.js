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

    // أسعار الصرف الحالية
    const currentRates = {
        USD: {
            RUB: 97.00,
            SAR: 3.75,
            YER: 250.35
        },
        RUB: {
            USD: 0.0103,
            SAR: 0.0387,
            YER: 2.581
        },
        SAR: {
            USD: 0.2667,
            RUB: 25.87,
            YER: 66.76
        },
        YER: {
            USD: 0.00399,
            RUB: 0.387,
            SAR: 0.015
        }
    };

    // دالة لتنسيق الأرقام بالعربية
    function formatNumberArabic(number) {
        return new Intl.NumberFormat('ar-SA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    // تحديث عرض الأسعار في الصفحة
    function updateDisplayRates() {
        const currentDate = new Date();
        const formattedDate = new Intl.DateTimeFormat('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(currentDate);

        // تحديث عرض الأسعار
        usdRate.innerHTML = `1 USD = <span class="rate-value">${formatNumberArabic(currentRates.USD.RUB)}</span> RUB`;
        sarRate.innerHTML = `1 SAR = <span class="rate-value">${formatNumberArabic(currentRates.SAR.RUB)}</span> RUB`;
        yerRate.innerHTML = `1 YER = <span class="rate-value">${formatNumberArabic(currentRates.YER.RUB)}</span> RUB`;
        
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
            result.value = formatNumberArabic(amountValue);
            return;
        }

        let rate = 1;
        if (currentRates[from] && currentRates[from][to]) {
            rate = currentRates[from][to];
        } else if (currentRates[to] && currentRates[to][from]) {
            rate = 1 / currentRates[to][from];
        }

        const convertedAmount = amountValue * rate;
        result.value = formatNumberArabic(convertedAmount);

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

    // عرض الأسعار عند تحميل الصفحة
    updateDisplayRates();

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
