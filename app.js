const bookForm = document.getElementById("bookForm");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const countryInput = document.getElementById("country");

const bookList = document.getElementById("bookList");
const countryCountList = document.getElementById("countryCountList");
const countryOptions = document.getElementById("countryOptions");
const errorMessage = document.getElementById("errorMessage");
const clearAllButton = document.getElementById("clearAllButton");

const STORAGE_KEY = "bookMapBooks";

const GEOJSON_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

let map;
let geoJsonLayer;

const countries = [
  { code: "AU", ru: "Австралия" },
  { code: "AT", ru: "Австрия" },
  { code: "AZ", ru: "Азербайджан" },
  { code: "AL", ru: "Албания" },
  { code: "DZ", ru: "Алжир" },
  { code: "AO", ru: "Ангола" },
  { code: "AD", ru: "Андорра" },
  { code: "AG", ru: "Антигуа и Барбуда" },
  { code: "AR", ru: "Аргентина" },
  { code: "AM", ru: "Армения" },
  { code: "AF", ru: "Афганистан" },
  { code: "BS", ru: "Багамы" },
  { code: "BD", ru: "Бангладеш" },
  { code: "BB", ru: "Барбадос" },
  { code: "BH", ru: "Бахрейн" },
  { code: "BZ", ru: "Белиз" },
  { code: "BY", ru: "Беларусь" },
  { code: "BE", ru: "Бельгия" },
  { code: "BJ", ru: "Бенин" },
  { code: "BG", ru: "Болгария" },
  { code: "BO", ru: "Боливия" },
  { code: "BA", ru: "Босния и Герцеговина" },
  { code: "BW", ru: "Ботсвана" },
  { code: "BR", ru: "Бразилия" },
  { code: "BN", ru: "Бруней" },
  { code: "BF", ru: "Буркина-Фасо" },
  { code: "BI", ru: "Бурунди" },
  { code: "BT", ru: "Бутан" },
  { code: "VU", ru: "Вануату" },
  { code: "VA", ru: "Ватикан" },
  { code: "GB", ru: "Великобритания" },
  { code: "HU", ru: "Венгрия" },
  { code: "VE", ru: "Венесуэла" },
  { code: "TL", ru: "Восточный Тимор" },
  { code: "VN", ru: "Вьетнам" },
  { code: "GA", ru: "Габон" },
  { code: "HT", ru: "Гаити" },
  { code: "GY", ru: "Гайана" },
  { code: "GM", ru: "Гамбия" },
  { code: "GH", ru: "Гана" },
  { code: "GT", ru: "Гватемала" },
  { code: "GN", ru: "Гвинея" },
  { code: "GW", ru: "Гвинея-Бисау" },
  { code: "DE", ru: "Германия" },
  { code: "HN", ru: "Гондурас" },
  { code: "GD", ru: "Гренада" },
  { code: "GR", ru: "Греция" },
  { code: "GE", ru: "Грузия" },
  { code: "DK", ru: "Дания" },
  { code: "DJ", ru: "Джибути" },
  { code: "DM", ru: "Доминика" },
  { code: "DO", ru: "Доминиканская Республика" },
  { code: "EG", ru: "Египет" },
  { code: "ZM", ru: "Замбия" },
  { code: "ZW", ru: "Зимбабве" },
  { code: "IL", ru: "Израиль" },
  { code: "IN", ru: "Индия" },
  { code: "ID", ru: "Индонезия" },
  { code: "JO", ru: "Иордания" },
  { code: "IQ", ru: "Ирак" },
  { code: "IR", ru: "Иран" },
  { code: "IE", ru: "Ирландия" },
  { code: "IS", ru: "Исландия" },
  { code: "ES", ru: "Испания" },
  { code: "IT", ru: "Италия" },
  { code: "YE", ru: "Йемен" },
  { code: "CV", ru: "Кабо-Верде" },
  { code: "KZ", ru: "Казахстан" },
  { code: "KH", ru: "Камбоджа" },
  { code: "CM", ru: "Камерун" },
  { code: "CA", ru: "Канада" },
  { code: "QA", ru: "Катар" },
  { code: "KE", ru: "Кения" },
  { code: "CY", ru: "Кипр" },
  { code: "KG", ru: "Киргизия" },
  { code: "KI", ru: "Кирибати" },
  { code: "CN", ru: "Китай" },
  { code: "CO", ru: "Колумбия" },
  { code: "KM", ru: "Коморы" },
  { code: "CG", ru: "Конго" },
  { code: "CD", ru: "Демократическая Республика Конго" },
  { code: "KP", ru: "КНДР" },
  { code: "KR", ru: "Южная Корея" },
  { code: "CR", ru: "Коста-Рика" },
  { code: "CI", ru: "Кот-д’Ивуар" },
  { code: "CU", ru: "Куба" },
  { code: "KW", ru: "Кувейт" },
  { code: "LA", ru: "Лаос" },
  { code: "LV", ru: "Латвия" },
  { code: "LS", ru: "Лесото" },
  { code: "LR", ru: "Либерия" },
  { code: "LB", ru: "Ливан" },
  { code: "LY", ru: "Ливия" },
  { code: "LT", ru: "Литва" },
  { code: "LI", ru: "Лихтенштейн" },
  { code: "LU", ru: "Люксембург" },
  { code: "MU", ru: "Маврикий" },
  { code: "MR", ru: "Мавритания" },
  { code: "MG", ru: "Мадагаскар" },
  { code: "MW", ru: "Малави" },
  { code: "MY", ru: "Малайзия" },
  { code: "ML", ru: "Мали" },
  { code: "MV", ru: "Мальдивы" },
  { code: "MT", ru: "Мальта" },
  { code: "MA", ru: "Марокко" },
  { code: "MH", ru: "Маршалловы Острова" },
  { code: "MX", ru: "Мексика" },
  { code: "MZ", ru: "Мозамбик" },
  { code: "MD", ru: "Молдова" },
  { code: "MC", ru: "Монако" },
  { code: "MN", ru: "Монголия" },
  { code: "MM", ru: "Мьянма" },
  { code: "NA", ru: "Намибия" },
  { code: "NR", ru: "Науру" },
  { code: "NP", ru: "Непал" },
  { code: "NE", ru: "Нигер" },
  { code: "NG", ru: "Нигерия" },
  { code: "NL", ru: "Нидерланды" },
  { code: "NI", ru: "Никарагуа" },
  { code: "NZ", ru: "Новая Зеландия" },
  { code: "NO", ru: "Норвегия" },
  { code: "AE", ru: "ОАЭ" },
  { code: "OM", ru: "Оман" },
  { code: "PK", ru: "Пакистан" },
  { code: "PW", ru: "Палау" },
  { code: "PA", ru: "Панама" },
  { code: "PG", ru: "Папуа — Новая Гвинея" },
  { code: "PY", ru: "Парагвай" },
  { code: "PE", ru: "Перу" },
  { code: "PL", ru: "Польша" },
  { code: "PT", ru: "Португалия" },
  { code: "RU", ru: "Россия" },
  { code: "RW", ru: "Руанда" },
  { code: "RO", ru: "Румыния" },
  { code: "SV", ru: "Сальвадор" },
  { code: "WS", ru: "Самоа" },
  { code: "SM", ru: "Сан-Марино" },
  { code: "ST", ru: "Сан-Томе и Принсипи" },
  { code: "SA", ru: "Саудовская Аравия" },
  { code: "MK", ru: "Северная Македония" },
  { code: "SC", ru: "Сейшелы" },
  { code: "SN", ru: "Сенегал" },
  { code: "VC", ru: "Сент-Винсент и Гренадины" },
  { code: "KN", ru: "Сент-Китс и Невис" },
  { code: "LC", ru: "Сент-Люсия" },
  { code: "RS", ru: "Сербия" },
  { code: "SG", ru: "Сингапур" },
  { code: "SY", ru: "Сирия" },
  { code: "SK", ru: "Словакия" },
  { code: "SI", ru: "Словения" },
  { code: "US", ru: "США" },
  { code: "SB", ru: "Соломоновы Острова" },
  { code: "SO", ru: "Сомали" },
  { code: "SD", ru: "Судан" },
  { code: "SR", ru: "Суринам" },
  { code: "SL", ru: "Сьерра-Леоне" },
  { code: "TJ", ru: "Таджикистан" },
  { code: "TH", ru: "Таиланд" },
  { code: "TZ", ru: "Танзания" },
  { code: "TG", ru: "Того" },
  { code: "TO", ru: "Тонга" },
  { code: "TT", ru: "Тринидад и Тобаго" },
  { code: "TV", ru: "Тувалу" },
  { code: "TN", ru: "Тунис" },
  { code: "TM", ru: "Туркменистан" },
  { code: "TR", ru: "Турция" },
  { code: "UG", ru: "Уганда" },
  { code: "UZ", ru: "Узбекистан" },
  { code: "UA", ru: "Украина" },
  { code: "UY", ru: "Уругвай" },
  { code: "FM", ru: "Федеративные Штаты Микронезии" },
  { code: "FJ", ru: "Фиджи" },
  { code: "PH", ru: "Филиппины" },
  { code: "FI", ru: "Финляндия" },
  { code: "FR", ru: "Франция" },
  { code: "HR", ru: "Хорватия" },
  { code: "CF", ru: "ЦАР" },
  { code: "TD", ru: "Чад" },
  { code: "ME", ru: "Черногория" },
  { code: "CZ", ru: "Чехия" },
  { code: "CL", ru: "Чили" },
  { code: "CH", ru: "Швейцария" },
  { code: "SE", ru: "Швеция" },
  { code: "LK", ru: "Шри-Ланка" },
  { code: "EC", ru: "Эквадор" },
  { code: "GQ", ru: "Экваториальная Гвинея" },
  { code: "ER", ru: "Эритрея" },
  { code: "SZ", ru: "Эсватини" },
  { code: "EE", ru: "Эстония" },
  { code: "ET", ru: "Эфиопия" },
  { code: "ZA", ru: "ЮАР" },
  { code: "SS", ru: "Южный Судан" },
  { code: "JM", ru: "Ямайка" },
  { code: "JP", ru: "Япония" }
];

let books = loadBooks();

fillCountryOptions();
initMap();
renderAll();

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  errorMessage.textContent = "";

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const countryRu = countryInput.value.trim();

  if (!title || !author || !countryRu) {
    return;
  }

  const countryData = countries.find(
    (country) => country.ru.toLowerCase() === countryRu.toLowerCase()
  );

  if (!countryData) {
    errorMessage.textContent = "Пожалуйста, выбери страну из списка подсказок.";
    return;
  }

  const book = {
    id: Date.now().toString(),
    title: title,
    author: author,
    countryCode: countryData.code,
    countryRu: countryData.ru
  };

  books.push(book);
  saveBooks();
  renderAll();
  bookForm.reset();
});

clearAllButton.addEventListener("click", function () {
  if (books.length === 0) {
    return;
  }

  const confirmed = confirm("Точно удалить все книги?");
  if (!confirmed) {
    return;
  }

  books = [];
  saveBooks();
  renderAll();
});

function fillCountryOptions() {
  countryOptions.innerHTML = "";

  for (const country of countries) {
    const option = document.createElement("option");
    option.value = country.ru;
    countryOptions.appendChild(option);
  }
}

function renderAll() {
  renderBooks();
  renderCountryCounts();
  updateMapColors();
}

function renderBooks() {
  bookList.innerHTML = "";

  if (books.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Пока книг нет.";
    bookList.appendChild(li);
    return;
  }

  for (const book of books) {
    const li = document.createElement("li");
    li.className = "book-item";

    const bookText = document.createElement("span");
    bookText.className = "book-text";
    bookText.textContent = `${book.title} — ${book.author} (${book.countryRu})`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Удалить";

    deleteButton.addEventListener("click", function () {
      deleteBook(book.id);
    });

    li.appendChild(bookText);
    li.appendChild(deleteButton);
    bookList.appendChild(li);
  }
}

function renderCountryCounts() {
  countryCountList.innerHTML = "";

  const countryCounts = {};

  for (const book of books) {
    if (countryCounts[book.countryCode]) {
      countryCounts[book.countryCode].count += 1;
    } else {
      countryCounts[book.countryCode] = {
        name: book.countryRu,
        count: 1
      };
    }
  }

  const entries = Object.values(countryCounts).sort((a, b) => b.count - a.count);

  if (entries.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Пока данных нет.";
    countryCountList.appendChild(li);
    return;
  }

  for (const entry of entries) {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.count}`;
    countryCountList.appendChild(li);
  }
}

function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveBooks();
  renderAll();
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooks() {
  const savedBooks = localStorage.getItem(STORAGE_KEY);

  if (!savedBooks) {
    return [];
  }

  try {
    return JSON.parse(savedBooks);
  } catch (error) {
    console.error("Ошибка чтения сохраненных книг:", error);
    return [];
  }
}

function initMap() {
  map = L.map("map", {
    zoomControl: true,
    worldCopyJump: true
  }).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  fetch(GEOJSON_URL)
    .then((response) => response.json())
    .then((geojsonData) => {
      geoJsonLayer = L.geoJSON(geojsonData, {
        style: styleCountryFeature,
        onEachFeature: onEachCountryFeature
      }).addTo(map);
    })
    .catch((error) => {
      console.error("Ошибка загрузки GeoJSON карты:", error);
    });
}

function getCountryCountsForMap() {
  const counts = {};

  for (const book of books) {
    if (counts[book.countryCode]) {
      counts[book.countryCode] += 1;
    } else {
      counts[book.countryCode] = 1;
    }
  }

  return counts;
}

function getColorByCount(count) {
  if (count >= 5) return "#2e7d32";
  if (count >= 3) return "#7cb342";
  if (count >= 2) return "#f9a825";
  if (count >= 1) return "#ef6c00";
  return "#d9d9d9";
}

function styleCountryFeature(feature) {
  const counts = getCountryCountsForMap();
  const countryCode = feature.properties.ISO_A2 || feature.properties["ISO3166-1-Alpha-2"];
  const count = counts[countryCode] || 0;

  return {
    fillColor: getColorByCount(count),
    weight: 1,
    opacity: 1,
    color: "#ffffff",
    dashArray: "2",
    fillOpacity: 0.8
  };
}

function onEachCountryFeature(feature, layer) {
  const countryCode = feature.properties.ISO_A2 || feature.properties["ISO3166-1-Alpha-2"];
  const counts = getCountryCountsForMap();
  const count = counts[countryCode] || 0;

  const countryName =
    feature.properties.ADMIN ||
    feature.properties.name ||
    feature.properties.NAME ||
    countryCode ||
    "Неизвестная страна";

  layer.bindPopup(`${countryName}: ${count} книг`);

  layer.on({
    mouseover: function (event) {
      event.target.setStyle({
        weight: 2,
        color: "#333",
        dashArray: "",
        fillOpacity: 0.9
      });
    },
    mouseout: function (event) {
      geoJsonLayer.resetStyle(event.target);
    }
  });
}

function updateMapColors() {
  if (!geoJsonLayer) {
    return;
  }

  geoJsonLayer.setStyle(styleCountryFeature);

  geoJsonLayer.eachLayer(function (layer) {
    const feature = layer.feature;
    const countryCode = feature.properties.ISO_A2 || feature.properties["ISO3166-1-Alpha-2"];
    const counts = getCountryCountsForMap();
    const count = counts[countryCode] || 0;

    const countryName =
      feature.properties.ADMIN ||
      feature.properties.name ||
      feature.properties.NAME ||
      countryCode ||
      "Неизвестная страна";

    layer.bindPopup(`${countryName}: ${count} книг`);
  });
}