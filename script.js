document.addEventListener('DOMContentLoaded', () => {
    // العناصر
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

    // كائن لتخزين أسعار الصرف الحالية
    let currentRates = {};

    // دالة لتنسيق الأرقام بالإنجليزية
    function formatNumberEnglish(number) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            style: 'decimal'
        }).format(number);
    }

    // دالة لتنسيق الأرقام بالعربية
    function formatNumberArabic(number) {
        return new Intl.NumberFormat('ar-SA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            style: 'decimal'
        }).format(number);
    }

    // دالة لجلب أسعار العملات من Yandex
    async function fetchExchangeRates() {
        try {
            // استخدام Yandex API مباشرة
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            const data = await response.json();
            
            if (data && data.Valute) {
                const rates = {
                    USD: { RUB: 0, SAR: 0, YER: 0 },
                    RUB: { USD: 0, SAR: 0, YER: 0 },
                    SAR: { USD: 0, RUB: 0, YER: 0 },
                    YER: { USD: 0, RUB: 0, SAR: 0 }
                };

                // استخراج سعر الدولار مقابل الروبل
                const usdRate = data.Valute.USD.Value;
                rates.USD.RUB = usdRate;
                rates.USD.SAR = 3.75;  // سعر ثابت للريال السعودي
                rates.USD.YER = 250.35; // سعر تقريبي للريال اليمني

                // حساب الأسعار المتقاطعة
                rates.RUB.USD = 1 / usdRate;
                rates.RUB.SAR = rates.RUB.USD * rates.USD.SAR;
                rates.RUB.YER = rates.RUB.USD * rates.USD.YER;

                rates.SAR.USD = 1 / rates.USD.SAR;
                rates.SAR.RUB = rates.SAR.USD * rates.USD.RUB;
                rates.SAR.YER = rates.SAR.USD * rates.USD.YER;

                rates.YER.USD = 1 / rates.USD.YER;
                rates.YER.RUB = rates.YER.USD * rates.USD.RUB;
                rates.YER.SAR = rates.YER.USD * rates.USD.SAR;

                // تحديث الأسعار الحالية
                currentRates = rates;
                console.log('تم تحديث الأسعار من البنك المركزي الروسي:', currentRates);

                // تحديث العرض
                updateDisplayRates();

                // حفظ الأسعار في التخزين المحلي
                localStorage.setItem('exchangeRates', JSON.stringify({
                    rates: currentRates,
                    timestamp: new Date().toISOString()
                }));
            } else {
                throw new Error('بيانات API غير صحيحة');
            }
        } catch (error) {
            console.error('خطأ في تحديث الأسعار:', error);
            useDefaultRates();
        }
    }

    // دالة لاستخدام الأسعار الافتراضية
    function useDefaultRates() {
        // محاولة استخدام الأسعار المخزنة محلياً
        const savedRates = localStorage.getItem('exchangeRates');
        if (savedRates) {
            const { rates, timestamp } = JSON.parse(savedRates);
            const lastUpdate = new Date(timestamp);
            const now = new Date();
            
            // استخدام الأسعار المخزنة إذا كانت أقل من ساعة
            if ((now - lastUpdate) < 3600000) {
                currentRates = rates;
                updateDisplayRates();
                return;
            }
        }

        // استخدام أسعار افتراضية
        currentRates = {
            USD: {
                RUB: 92.50,  // تحديث السعر الافتراضي
                SAR: 3.75,
                YER: 250.35
            },
            RUB: {
                USD: 0.0108,
                SAR: 0.0405,
                YER: 2.706
            },
            SAR: {
                USD: 0.2667,
                RUB: 24.67,
                YER: 66.76
            },
            YER: {
                USD: 0.00399,
                RUB: 0.369,
                SAR: 0.015
            }
        };
        updateDisplayRates();
    }

    // دالة لتحديث عرض الأسعار في الصفحة
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

        // تحديث عرض الأسعار مع تأثيرات بصرية
        function updateRateWithAnimation(element, newRate, oldRate, currency) {
            const oldValue = parseFloat(oldRate) || 0;
            const newValue = parseFloat(newRate);

            element.style.color = newValue > oldValue ? '#22c55e' : 
                                newValue < oldValue ? '#ef4444' : 'inherit';
            
            element.innerHTML = `1 ${currency} = <span class="rate-value">${formatNumberArabic(newRate)}</span> RUB`;
            
            setTimeout(() => {
                element.style.color = 'inherit';
            }, 1000);
        }

        // الحصول على الأسعار القديمة
        const oldUsdRate = usdRate.querySelector('.rate-value')?.textContent;
        const oldSarRate = sarRate.querySelector('.rate-value')?.textContent;
        const oldYerRate = yerRate.querySelector('.rate-value')?.textContent;

        // تحديث العرض مع التأثيرات
        updateRateWithAnimation(usdRate, currentRates.USD.RUB, oldUsdRate, 'USD');
        updateRateWithAnimation(sarRate, currentRates.SAR.RUB, oldSarRate, 'SAR');
        updateRateWithAnimation(yerRate, currentRates.YER.RUB, oldYerRate, 'YER');
        
        updateTime.textContent = `آخر تحديث: ${formattedDate}`;
    }

    // دالة التحويل بين العملات
    function convertCurrency() {
        if (!amount.value) {
            alert('الرجاء إدخال المبلغ');
            return;
        }

        const from = fromCurrency.value;
        const to = toCurrency.value;
        const amountValue = parseFloat(amount.value);

        if (isNaN(amountValue)) {
            alert('الرجاء إدخال رقم صحيح');
            return;
        }

        let convertedAmount;

        if (from === to) {
            convertedAmount = amountValue;
        } else if (currentRates[from] && currentRates[from][to]) {
            convertedAmount = amountValue * currentRates[from][to];
        } else {
            // التحويل عبر الدولار إذا لم يكن هناك سعر مباشر
            const toUsd = from === 'USD' ? amountValue : amountValue * currentRates[from].USD;
            convertedAmount = to === 'USD' ? toUsd : toUsd * currentRates.USD[to];
        }

        // تنسيق النتيجة بالأرقام الإنجليزية
        result.value = formatNumberEnglish(convertedAmount);

        // تأثير بصري للتحديث
        result.style.backgroundColor = '#f0fff4';
        setTimeout(() => {
            result.style.backgroundColor = '';
        }, 300);
    }

    // دالة تبديل العملات
    function swapCurrencies() {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        
        if (amount.value) {
            convertCurrency();
        }
    }

    // تحديث الأسعار عند تحميل الصفحة
    fetchExchangeRates();

    // تحديث الأسعار كل دقيقة
    setInterval(fetchExchangeRates, 60000);

    // إضافة مستمعي الأحداث
    convertBtn.addEventListener('click', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    
    // تحويل مباشر عند تغيير أي قيمة
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
