const catalog = {
  trial: { name: "Trial Mini Tiffin (1st Time Only)", price: 70, qty: 1, pro: "14g" },
  gym_sprouts: { name: "Sprouts & Paneer Power Salad (BF)", price: 110, qty: 0, pro: "24g" },
  gym_bhurji: { name: "Paneer Bhurji + 2 Multigrain Roti (BF)", price: 130, qty: 0, pro: "28g" },
  gym_paneer_lunch: { name: "Paneer Beast Meal 200g (Lunch)", price: 160, qty: 0, pro: "40g" },
  gym_soya_lunch: { name: "High-Protein Soya Curry + Rice (Lunch)", price: 120, qty: 0, pro: "46g" },
  gym_double_dal: { name: "Double Dal & Tofu/Paneer Bowl (Lunch)", price: 140, qty: 0, pro: "32g" },
  gym_tikka_dinner: { name: "Grilled Herb Paneer Salad (Dinner)", price: 150, qty: 0, pro: "32g" },
  gym_soya_dinner: { name: "Soya Veggie Stir-Fry Bowl (Dinner)", price: 110, qty: 0, pro: "36g" },
  daily_lunch: { name: "Daily Regular Lunch Thali", price: 80, qty: 0, pro: "18g" },
  daily_dinner: { name: "Daily Regular Dinner Thali", price: 80, qty: 0, pro: "16g" }
};

const WHATSAPP_NUM = "91998828360";

const weeklySchedule = {
  0: { day: "Sunday", lunch: "Special Rajma Masala + Jeera Aloo + 4 Butter Roti + Basmati Rice + Salad", dinner: "Dal Makhani + Seasonal Sabzi + 4 Tawa Roti + Rice + Salad" },
  1: { day: "Monday", lunch: "Rajma Masala + Aloo Gobi Matar + 4 Tawa Roti + Steamed Rice + Salad", dinner: "Moong Dhuli Dal + Sukhi Bhindi Masala + 4 Tawa Roti + Rice + Achar" },
  2: { day: "Tuesday", lunch: "Kadhi Pakoda + Sukhe Aloo Jeera + 4 Roti + Steamed Rice + Salad", dinner: "Mix Dal Fry + Baingan Bharta + 4 Roti + Rice + Salad" },
  3: { day: "Wednesday", lunch: "Chana Masala (Chole) + Lauki Sabzi + 4 Roti + Jeera Rice + Salad", dinner: "Yellow Dal Tadka + Aloo Shimla Mirch + 4 Roti + Rice + Salad" },
  4: { day: "Thursday", lunch: "Dal Makhani + Aloo Matar Masala + 4 Butter Roti + Steamed Rice + Salad", dinner: "Arhar Dal Fry + Gajar Matar Aloo + 4 Tawa Roti + Rice + Salad" },
  5: { day: "Friday", lunch: "Kala Chana Masala + Lauki Chana Dal + 4 Roti + Steamed Rice + Salad", dinner: "Dal Tadka + Masala Bhindi + 4 Fresh Tawa Roti + Rice + Salad" },
  6: { day: "Saturday", lunch: "Pindi Chole + Aloo Jeera + 4 Tawa Roti + Steamed Rice + Salad", dinner: "Panchmel Dal + Aloo Gobhi + 4 Tawa Roti + Steamed Rice + Salad" }
};

window.addEventListener('DOMContentLoaded', () => {
  const dayIdx = new Date().getDay();
  const plan = weeklySchedule[dayIdx];
  const todayDateEl = document.getElementById('todayDate');
  const lunchDescEl = document.getElementById('lunchMenuDesc');
  const dinnerDescEl = document.getElementById('dinnerMenuDesc');

  if (todayDateEl && plan) todayDateEl.innerText = `Today is ${plan.day} 📅`;
  if (lunchDescEl && plan) lunchDescEl.innerText = plan.lunch;
  if (dinnerDescEl && plan) dinnerDescEl.innerText = plan.dinner;
});

function modifyQty(key, delta) {
  if (!catalog[key]) return;
  catalog[key].qty = Math.max(0, catalog[key].qty + delta);
  const countEl = document.getElementById('qty-' + key);
  if (countEl) countEl.innerText = catalog[key].qty;
  refreshCart();
}

function refreshCart() {
  let total = 0;
  let count = 0;
  for (const k in catalog) {
    total += catalog[k].qty * catalog[k].price;
    count += catalog[k].qty;
  }
  document.getElementById('cartBill').innerText = '₹' + total;
  document.getElementById('cartCount').innerText = `${count} ${count === 1 ? 'ITEM' : 'ITEMS'} SELECTED`;
}

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

function placeWhatsAppOrder() {
  const name = document.getElementById('custName').value.trim();
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
    alert("Kam se kam 1 item cart me add karein!");
    return;
  }
  if (!name || !addr) {
    alert("Kripya apna naam aur Kharar ka delivery address daalein.");
    return;
  }

  const dayIdx = new Date().getDay();
  const currentDay = weeklySchedule[dayIdx].day;

  let text = `*Ghar Se Tiffin - Naya Order*\n`;
  text += `📅 *Day:* ${currentDay}\n`;
  text += `------------------------------------\n`;
  text += `👤 *Customer:* ${name}\n`;
  text += `📍 *Delivery Address:* ${addr}\n`;
  text += `------------------------------------\n`;
  text += `*Ordered Items:*\n`;
  text += orderLines.join('\n') + `\n`;
  text += `------------------------------------\n`;
  text += `💰 *Total Amount:* ₹${grandTotal}\n`;
  if (hasTrial) {
    text += `\n*(Note: Trial ₹70 meal included - verified 1st time order)*\n`;
  }
  text += `\nKripya confirm karein aur delivery time bata dein!`;

  const link = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(text)}`;
  window.open(link, '_blank');
}
