// بيانات الوجبات لكل قسم (يمكن استبدالها بأسماء الوجبات الحقيقية من خلال VS Code)
const mealsData = {
    breakfast: [
        { name: "شوفان مع فواكه طازجة", emoji: "🥣" },
        { name: "عجة الخضار", emoji: "🍳" },
        { name: "سموذي أخضر", emoji: "🥤" },
        { name: "خبز توست أفوكادو", emoji: "🥑" },
        { name: "زبادي يوناني مع عسل", emoji: "🍯" }
    ],
    lunch: [
        { name: "سلطة كينوا بالدجاج", emoji: "🥗" },
        { name: "سمك مشوي مع خضار", emoji: "🐟" },
        { name: "برجر نباتي صحي", emoji: "🍔" },
        { name: "شوربة عدس", emoji: "🥣" },
        { name: "صدر دجاج مشوي", emoji: "🍗" }
    ],
    dinner: [
        { name: "سلمون مع بروكلي", emoji: "🍣" },
        { name: "معكرونة كاملة مع صلصة طماطم", emoji: "🍝" },
        { name: "ستيك لحم مع بطاطا حلوة", emoji: "🥩" },
        { name: "كوسة محشية", emoji: "🥒" },
        { name: "طاجن خضار", emoji: "🍲" }
    ],
    desserts: [
        { name: "تشيز كيك صحي", emoji: "🍰" },
        { name: "مثلجات أفوكادو", emoji: "🍨" },
        { name: "كوكيز الشوفان", emoji: "🍪" },
        { name: "فواكه طازجة مع شوكولاتة", emoji: "🍓" },
        { name: "بودينج الشيا", emoji: "🥄" }
    ],
    snacks: [
        { name: "مكسرات مشكلة", emoji: "🥜" },
        { name: "تفاح مع زبدة الفول السوداني", emoji: "🍎" },
        { name: "حمص بالبهارات", emoji: "🧆" },
        { name: "رقائق بطاطا حلوة", emoji: "🍠" },
        { name: "سناك بار البروتين", emoji: "🍫" }
    ],
    drinks: [
        { name: "عصير أخضر", emoji: "🥬" },
        { name: "شاي أخضر", emoji: "🍵" },
        { name: "ماء معليم بالفواكه", emoji: "💧" },
        { name: "سموذي بروتين", emoji: "🥛" },
        { name: "قهوة مع حليب لوز", emoji: "☕" }
    ]
};

// رقم واتساب المستهدف
const whatsappNumber = "+22230726475";

// تخزين الوجبات المختارة
let selectedMeals = [];

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // تعبئة القوائم المنسدلة بالوجبات
    populateMealSelectors();
    
    // إضافة مستمعي الأحداث
    setupEventListeners();
    
    // تحديث عرض الوجبات المختارة
    updateSelectedMealsDisplay();
    
    // إضافة تأثير عند تحميل الصفحة
    animatePageLoad();
    
    // بدء حركة الإيموجيات الدوارة
    startEmojiAnimations();
});

// تعبئة القوائم المنسدلة بالوجبات
function populateMealSelectors() {
    for (const section in mealsData) {
        const selectElement = document.getElementById(`${section}-select`);
        if (selectElement) {
            // إضافة الخيارات لكل قسم
            mealsData[section].forEach(meal => {
                const option = document.createElement('option');
                option.value = meal.name;
                option.textContent = `${meal.emoji} ${meal.name}`;
                selectElement.appendChild(option);
            });
        }
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // استماع لتغيير الاختيار في القوائم المنسدلة
    document.querySelectorAll('.meal-select').forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                addMealToOrder(this);
            }
        });
    });
    
    // زر إرسال الطلب
    document.getElementById('send-order').addEventListener('click', sendOrderToWhatsApp);
    
    // زر مسح الطلبات
    document.getElementById('clear-order').addEventListener('click', clearOrder);
    
    // زر إغلاق نافذة التأكيد
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('confirm-modal-btn').addEventListener('click', closeModal);
    
    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('confirmation-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

// إضافة وجبة إلى الطلب
function addMealToOrder(selectElement) {
    const sectionId = selectElement.id.replace('-select', '');
    const sectionName = getSectionName(sectionId);
    const mealName = selectElement.value;
    const mealEmoji = getMealEmoji(sectionId, mealName);
    
    // التحقق من عدم تكرار الوجبة
    if (selectedMeals.some(meal => meal.name === mealName && meal.section === sectionName)) {
        alert('هذه الوجبة مضافة مسبقًا إلى طلبك!');
        selectElement.value = '';
        return;
    }
    
    // إضافة الوجبة إلى القائمة
    selectedMeals.push({
        name: mealName,
        section: sectionName,
        emoji: mealEmoji
    });
    
    // تحديث العرض
    updateSelectedMealsDisplay();
    
    // إعادة تعيين القائمة المنسدلة
    selectElement.value = '';
    
    // إظهار رسالة تأكيد
    showNotification(`تمت إضافة ${mealName} إلى طلبك`);
}

// الحصول على اسم القسم بالعربية
function getSectionName(sectionId) {
    const sectionNames = {
        breakfast: "الفطور",
        lunch: "الغداء",
        dinner: "العشاء",
        desserts: "الحلويات",
        snacks: "وجبات خفيفة",
        drinks: "مشروبات صحية"
    };
    
    return sectionNames[sectionId] || sectionId;
}

// الحصول على رمز الإيموجي للوجبة
function getMealEmoji(sectionId, mealName) {
    const sectionMeals = mealsData[sectionId];
    const meal = sectionMeals.find(m => m.name === mealName);
    return meal ? meal.emoji : "🍽️";
}

// تحديث عرض الوجبات المختارة
function updateSelectedMealsDisplay() {
    const container = document.getElementById('selected-meals');
    
    if (selectedMeals.length === 0) {
        container.innerHTML = `
            <div class="empty-order">
                <i class="fas fa-shopping-basket"></i>
                <p>لم تقم بإضافة أي وجبات بعد</p>
                <p>اختر من القوائم المنسدلة أعلاه</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    selectedMeals.forEach((meal, index) => {
        const mealElement = document.createElement('div');
        mealElement.className = 'meal-item';
        mealElement.innerHTML = `
            <div class="meal-info">
                <span class="meal-emoji">${meal.emoji}</span>
                <div>
                    <div class="meal-name">${meal.name}</div>
                    <div class="meal-section">${meal.section}</div>
                </div>
            </div>
            <button class="remove-meal" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(mealElement);
    });
    
    // إضافة مستمعي الأحداث لأزرار الحذف
    document.querySelectorAll('.remove-meal').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeMealFromOrder(index);
        });
    });
}

// إزالة وجبة من الطلب
function removeMealFromOrder(index) {
    if (index >= 0 && index < selectedMeals.length) {
        const removedMeal = selectedMeals[index];
        selectedMeals.splice(index, 1);
        updateSelectedMealsDisplay();
        showNotification(`تمت إزالة ${removedMeal.name} من طلبك`);
    }
}

// إرسال الطلب إلى واتساب
function sendOrderToWhatsApp() {
    if (selectedMeals.length === 0) {
        alert('يرجى إضافة وجبات إلى طلبك أولاً!');
        return;
    }
    
    // إنشاء نص الرسالة
    let message = `🍽️ *طلب وجبات من ISI Restaurant* 🍽️\n\n`;
    message += `*التاريخ:* ${new Date().toLocaleDateString('ar-EG')}\n`;
    message += `*الوقت:* ${new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}\n\n`;
    message += `*الوجبات المطلوبة:*\n`;
    
    selectedMeals.forEach((meal, index) => {
        message += `${index + 1}. ${meal.emoji} ${meal.name} (${meal.section})\n`;
    });
    
    message += `\n*إجمالي عدد الوجبات:* ${selectedMeals.length}\n\n`;
    message += `شكرًا لطلبكم من ISI Restaurant! 🍎`;
    
    // تشفير الرسالة للرابط
    const encodedMessage = encodeURIComponent(message);
    
    // إنشاء رابط واتساب
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // فتح الرابط في نافذة جديدة
    window.open(whatsappURL, '_blank');
    
    // إظهار نافذة التأكيد
    showConfirmationModal();
}

// مسح الطلب بالكامل
function clearOrder() {
    if (selectedMeals.length === 0) {
        alert('لا توجد وجبات في طلبك!');
        return;
    }
    
    if (confirm('هل أنت متأكد من مسح جميع الوجبات من طلبك؟')) {
        selectedMeals = [];
        updateSelectedMealsDisplay();
        showNotification('تم مسح جميع الوجبات من طلبك');
    }
}

// إظهار نافذة التأكيد
function showConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'flex';
}

// إغلاق نافذة التأكيد
function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.style.display = 'none';
}

// إظهار إشعار
function showNotification(text) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = text;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff00ff;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2), 0 0 10px rgba(255, 0, 255, 0.5);
        z-index: 1001;
        font-weight: 600;
        animation: slideInRight 0.5s ease;
        border: 1px solid rgba(255, 255, 255, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// بدء حركة الإيموجيات الدوارة
function startEmojiAnimations() {
    // إضافة تأثيرات عشوائية للإيموجيات
    const emojis = document.querySelectorAll('.rotating-emoji');
    emojis.forEach((emoji, index) => {
        // تأخير بدء كل إيموجي
        emoji.style.animationDelay = `${index * 0.5}s`;
        
        // إضافة تأثير الطفو
        emoji.style.position = 'relative';
        setInterval(() => {
            emoji.style.transform += ' translateY(-5px)';
            setTimeout(() => {
                emoji.style.transform = emoji.style.transform.replace(' translateY(-5px)', ' translateY(5px)');
            }, 500);
        }, 1000 + index * 300);
    });
}

// إضافة تأثيرات عند تحميل الصفحة
function animatePageLoad() {
    // إضافة تأثير للبطاقات
    const cards = document.querySelectorAll('.section-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // إضافة تأثير للهيدر
    const header = document.querySelector('header');
    header.style.opacity = '0';
    
    setTimeout(() => {
        header.style.transition = 'opacity 1s ease';
        header.style.opacity = '1';
    }, 300);
}

// إضافة تأثير fadeOut للرسائل
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);