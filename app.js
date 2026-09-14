// APNA WHATSAPP NUMBER YAHAN DALEIN (Country code 91 ke sath, 10 digits)
// Poster par number: 6239813663 (agar 10th digit bacha ho toh update karein)
const STORE_WHATSAPP = "916239813663"; 

// 7-DAY ROTATIONAL MENU (INDIAN HOMESTYLE)
const weeklySchedule = {
  0: { day: "Sunday", lunch: "Rajma Masala + Jeera Aloo + 4 Tawa Roti + Basmati Rice + Salad", dinner: "Dal Makhani + Seasonal Mix Veg + 4 Tawa Roti + Rice + Salad" },
  1: { day: "Monday", lunch: "Dal Tadka + Aloo Gobi Matar + 4 Tawa Roti + Steamed Rice + Salad", dinner: "Moong Dhuli Dal + Bhindi Masala + 4 Tawa Roti + Rice + Achar" },
  2: { day: "Tuesday", lunch: "Kadhi Pakoda + Aloo Jeera + 4 Tawa Roti + Steamed Rice + Salad", dinner: "Panchmel Dal + Baingan Bharta + 4 Tawa Roti + Rice + Salad" },
  3: { day: "Wednesday", lunch: "Chana Masala (Chole) + Lauki Kofta + 4 Tawa Roti + Jeera Rice + Salad", dinner: "Yellow Dal Fry + Shimla Mirch Aloo + 4 Tawa Roti + Rice + Salad" },
  4: { day: "Thursday", lunch: "Dal Makhani + Aloo Matar + 4 Butter Tawa Roti + Steamed Rice + Salad", dinner: "Arhar Dal Tadka + Gajar Matar Methi + 4 Tawa Roti + Rice + Salad" },
  5: { day: "Friday", lunch: "Kala Chana Curry + Lauki Chana Dal + 4 Tawa Roti + Steamed Rice + Salad", dinner: "Dal Fry + Masala Bhindi + 4 Fresh Tawa Roti + Rice + Salad" },
  6: { day: "Saturday", lunch: "Pindi Chole + Sukhe Aloo + 4 Tawa Roti + Jeera Rice + Boondi Raita", dinner: "Mix Dal Tadka + Aloo Gobi + 4 Tawa Roti + Steamed Rice + Salad" }
};

// MASTER PRODUCT CATALOG
const catalog = {
  trial: { name: "Trial Mini Tiffin (1st Time Only)", price: 70, qty: 1, pro: "14g" },
  gym_sprouts: { name: "Sprouts & Raw Paneer Salad (BF)", price: 110, qty: 0, pro: "24g" },
  gym_bhurji: { name: "Paneer Bhurji + 2 Multigrain Roti (BF)", price: 130, qty: 0, pro: "28g" },
  gym_paneer_lunch: { name: "Paneer Beast Meal 200g (Lunch)", price: 160, qty: 0, pro: "40g" },
  gym_soya_lunch: { name: "High-Protein Soya Curry + Rice (Lunch)", price: 120, qty: 0, pro: "46g" },
  gym_double_dal: { name: "Double Dal & Sautéed Paneer Bowl (Lunch)", price: 140, qty: 0, pro: "32g" },
  gym_tikka_dinner: { name: "Grilled Herb Paneer Tikka Salad (Dinner)", price: 150, qty: 0, pro: "32g" },
  gym_soya_dinner: { name: "Soya Veggie Stir-Fry + 2 Phulkas (Dinner)", price: 110, qty: 0, pro: "36g" },
  daily_lunch: { name: "Daily Regular Lunch Thali", price: 80, qty: 0, pro: "18g" },
  daily_dinner: { name: "Daily Regular Dinner Thali", price: 80, qty: 0, pro: "16g" }
};

// AUTO DATE SYNC
window.addEventListener('DOMContentLoaded', () => {
  const dayIdx = new Date().getDay();
  const plan = weeklySchedule[dayIdx];
  const dateEl = document.getElementById('todayDate');
  const lunchEl = document.getElementById('lunchMenuDesc');
  const dinnerEl = document.getElementById('dinnerMenuDesc');

  if (dateEl && plan) dateEl.innerText = `Today is ${plan.day} 📅`;
  if (lunchEl && plan) lunchEl.innerText = plan.lunch;
  if (dinnerEl && plan) dinnerEl.innerText = plan.dinner;
  refreshCart();
});

// QUANTITY CONTROLS
function modifyQty(key, delta) {
  if (!catalog[key]) return;
  catalog[key].qty = Math.max(0, catalog[key].qty + delta);
  const countDisplay = document.getElementById('qty-' + key);
  if (countDisplay) countDisplay.innerText = catalog[key].qty;
  refreshCart();
}

// CART CALCULATION
function refreshCart() {
  let total = 0;
  let count = 0;
  for (const k in catalog) {
    total += catalog[k].qty * catalog[k].price;
    count += catalog[k].qty;
  }
  const billEl = document.getElementById('cartBill');
  const countEl = document.getElementById('cartCount');
  if (billEl) billEl.innerText = '₹' + total;
  if (countEl) countEl.innerText = `${count} ${count === 1 ? 'ITEM' : 'ITEMS'} SELECTED`;
}

// CATEGORY FILTERS
function filterMenu(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('.item-card');
  cards.forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// WHATSAPP REDIRECTION & VALIDATION
function placeWhatsAppOrder() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const addr = document.getElementById('custAddr').value.trim();

  let orderLines = [];
  let grandTotal = 0;
  let hasTrial = false;

  for (const k in catalog) {
    if (catalog[k].qty > 0) {
      if (k === 'trial') hasTrial = true;
      orderLines.push(`▪ ${catalog[k].name} (x${catalog[k].qty}) [${catalog[k].pro} Prot] -> ₹${catalog[k].qty * catalog[k].price}`);
      grandTotal += catalog[k].qty * catalog[k].price;
    }
  }

  if (orderLines.length === 0) {
    alert("Kam se kam 1 item cart me select karein!");
    return;
  }
  if (!name || !phone || !addr) {
    alert("Kripya apna naam, mobile number aur delivery address daalein.");
    return;
  }
  if (phone.length < 10) {
    alert("Kripya sahi 10-digit mobile number enter karein.");
    return;
  }

  const dayIdx = new Date().getDay();
  const currentDay = weeklySchedule[dayIdx].day;

  let text = `*Ghar Se Tiffin - Naya Order*\n`;
  text += `📅 *Day:* ${currentDay}\n`;
  text += `------------------------------------\n`;
  text += `👤 *Customer:* ${name}\n`;
  text += `📞 *Phone:* ${phone}\n`;
  text += `📍 *Delivery Address:* ${addr}\n`;
  text += `------------------------------------\n`;
  text += `*Ordered Items:*\n`;
  text += orderLines.join('\n') + `\n`;
  text += `------------------------------------\n`;
  text += `💰 *Total Amount:* ₹${grandTotal}\n`;
  if (hasTrial) {
    text += `\n*(Notice: 1-Time ₹70 Trial Applied)*\n`;
  }
  text += `\nKripya mera order confirm karein aur delivery time bata dein!`;

  const link = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(text)}`;
  window.open(link, '_blank');
}
