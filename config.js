// إعدادات API لتحديث أسعار العملات
const CONFIG = {
    PAIRS: ['USD/RUB', 'USD/SAR', 'USD/YER'],  // أزواج العملات
    UPDATE_INTERVAL: 60000,  // تحديث كل دقيقة
    BASE_CURRENCY: 'USD',    // العملة الأساسية
    CURRENCIES: ['USD', 'RUB', 'SAR', 'YER']  // العملات المدعومة
};

if (typeof module !== 'undefined') {
    module.exports = CONFIG;
}
