 // ---------------------------------------------------------------Старый скрипт  itemm вернуть его если маски вернем в использование -------------------------------------------
 const itemmSearchInput = document.getElementById('itemmSearch');
 const itemmSelect = document.getElementById('itemm');

 itemmSearchInput.addEventListener('input', function() {
   const searchTerm = itemmSearchInput.value.toLowerCase();
   const options = itemmSelect.options;

   for (let i = 0; i < options.length; i++) {
     const option = options[i];
     const optionText = option.text.toLowerCase();

     if (optionText.includes(searchTerm)) {
       option.style.display = ''; // Показать опцию
     } else {
       option.style.display = 'none'; // Скрыть опцию
     }
   }
 });

 // const itemmSearchInput = document.getElementById('itemmSearch');
// const itemmSelect = document.getElementById('itemm');

// itemmSearchInput.addEventListener('input', function() {
  // const searchTerm = itemmSearchInput.value.toLowerCase();
  // const options = itemmSelect.options;

  // for (let i = 0; i < options.length; i++) {
    // const option = options[i];
    // const optionText = option.text.toLowerCase();

    // if (optionText.includes(searchTerm)) {
      // option.style.display = ''; // Показать опцию
    // } else {
      // option.style.display = 'none'; // Скрыть опцию
    // }
  // }
// });

// ----------------------------------------------------если по пизде пойдет, то 2 строчки ниже расскоментировать и удалить первый скрипт-----------------------------------------
//const itemmSearchInput = document.getElementById('itemmSearch');
//const itemmSelect = document.getElementById('itemm');
const toggleMaskButton = document.getElementById('toggleMaskButton'); // Получаем кнопку

let maskVisible = false; // Изначально маски скрыты

// Функция для фильтрации опций
function filterOptions() {
    const searchTerm = itemmSearchInput.value.toLowerCase();
    const options = itemmSelect.options;

    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionText = option.text.toLowerCase();
        const isMask = optionText.includes('маск'); // Проверяем, содержит ли опция "маск"

        if (optionText.includes(searchTerm) && (maskVisible || !isMask)) {
            option.style.display = ''; // Показать опцию
        } else {
            option.style.display = 'none'; // Скрыть опцию
        }
    }
}

// Обработчик для кнопки "Показать/Скрыть маски"
toggleMaskButton.addEventListener('click', function() {
    maskVisible = !maskVisible; // Инвертируем состояние
    filterOptions(); // Перефильтровываем опции
    toggleMaskButton.textContent = maskVisible ? 'Скрыть Маски' : 'Показать Маски'; // Изменяем текст кнопки
});

// Обработчик для поля поиска
itemmSearchInput.addEventListener('input', filterOptions);

// Инициализация: фильтруем опции при загрузке страницы
filterOptions();

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const actionSelect = document.getElementById('action');
  const itemmmSelect = document.getElementById('itemmm');
  const itemSelect = document.getElementById('itemm');
  const tuningSelect = document.getElementById('tuning');
  const priceTypeSelect = document.getElementById('price_type');
  const priceSelect = document.getElementById('price');
  const tradeSelect = document.getElementById('trade');

  const customPriceInput = document.getElementById('customPrice');
  const setPriceButton = document.getElementById('setPrice');

  const resultDiv = document.getElementById('result');
  const copyButton = document.getElementById('copyButton');
  const clearButton = document.getElementById('clearButton'); // Получаем ссылку на кнопку Стереть

  function updateResult() {
    let resultText = '';

    if (actionSelect.value) resultText += actionSelect.value + ' ';
    if (itemmmSelect.value) resultText += itemmmSelect.value + ' ';
    if (itemSelect.value) resultText += itemSelect.value + ' ';
    if (tuningSelect.value) resultText += tuningSelect.value + ' ';
    if (priceTypeSelect.value) resultText += priceTypeSelect.value + ' ';

    if (priceSelect.value === 'input') {
        // Если выбрано "Введите сумму", используем значение из поля ввода
        if(customPriceInput.value) {
          resultText += formatNumber(customPriceInput.value) + ' рублей. ';
        }
    } else if (priceSelect.value) {
        // Иначе используем значение из выпадающего списка price
        resultText += priceSelect.value + ' ';
    }
        if (tradeSelect.value) resultText += tradeSelect.value + ' ';

    resultDiv.textContent = resultText.trim();
  }

  actionSelect.addEventListener('change', updateResult);
  itemmmSelect.addEventListener('change', updateResult);
  itemSelect.addEventListener('change', updateResult);
  tuningSelect.addEventListener('change', updateResult);
  priceTypeSelect.addEventListener('change', updateResult);
  priceSelect.addEventListener('change', function() {
    if (this.value === 'input') {
      customPriceInput.style.display = 'block';
      setPriceButton.style.display = 'inline-block';
    } else {
      customPriceInput.style.display = 'none';
      setPriceButton.style.display = 'none';
      updateResult(); // Обновляем результат при выборе предустановленной цены
    }
  });

  tradeSelect.addEventListener('change', updateResult);

  setPriceButton.addEventListener('click', function() {
      if (customPriceInput.value) {
        updateResult();
        customPriceInput.value = ''; // Очищаем поле ввода
        customPriceInput.style.display = 'none';
        setPriceButton.style.display = 'none';
        priceSelect.value = ""; // Сбрасываем значение select
      } else {
        alert('Пожалуйста, введите сумму.');
      }
    });

    customPriceInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        setPriceButton.click(); // Эмулируем нажатие кнопки "Готово"
      }
    });

  copyButton.addEventListener('click', () => {
    const originalText = copyButton.textContent; // Сохраняем оригинальный текст
    copyButton.classList.add('copied'); // Добавляем класс для подсветки

    navigator.clipboard.writeText(resultDiv.textContent)
      .then(() => {
        copyButton.textContent = 'Скопировано!'; // Меняем текст (можно убрать)
        setTimeout(() => {
          copyButton.classList.remove('copied'); // Убираем подсветку
          copyButton.textContent = originalText; // Возвращаем текст (если меняли)
        }, 2000);
      })
      .catch(err => {
        console.error('Не удалось скопировать: ', err);
        //  Можно добавить отображение ошибки в интерфейсе
        copyButton.classList.remove('copied'); // Убираем класс, если была ошибка (чтобы не остаться подсвеченным навсегда)
        copyButton.textContent = 'Ошибка!'; // Например, показать ошибку (можно убрать)
        setTimeout(() => {
          copyButton.textContent = originalText; // Возвращаем текст
        }, 2000)
      });
  });
  //  Обработчик события для кнопки "Стереть"
  clearButton.addEventListener('click', () => {
    actionSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    itemmmSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    itemSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    tuningSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    priceTypeSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    priceSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    tradeSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    customPriceInput.value = ''; // Очищаем поле ввода

    updateResult(); // Обновить отображаемый результат
  });

  function formatNumber(number) {
    const num = parseInt(number); // Преобразуем в число
    if(isNaN(num)){
       return ""; // Возвращаем пустую строку если не число
    }

    const formattedNumber = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedNumber;
  }
  //------------------------------------------------ Функция поиска в Знач. с тюнингом, возможно ее надо будеть сделать одним скриптом, если маски появятся----------------------------
  function filterOptions() {
  let input, filter, select, options, i, txtValue;
  input = document.getElementById("itemmmSearch");
  filter = input.value.toUpperCase();
  select = document.getElementById("itemmm");
  options = select.getElementsByTagName("option");

  for (i = 0; i < options.length; i++) {
    txtValue = options[i].textContent || options[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1 || options[i].value.toUpperCase().indexOf(filter) > -1) { // Ищем и в value
      options[i].style.display = "";
    } else {
      options[i].style.display = "none";
    }
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  document.querySelectorAll('.cell').forEach(item => {
  item.addEventListener('click', () => {
    const textElem = item.querySelector('.item-text');
    let text;

    if (textElem) {
      text = textElem.innerText || textElem.textContent;
    } else {
      text = item.innerText || item.textContent;
    }
    // Заменяем множественные пробелы на один
    text = text.replace(/\s+/g, ' ');

    // Копируем текст в буфер обмена
    navigator.clipboard.writeText(text).then(() => {
      // Добавляем подсветку
      item.classList.add('highlight');
      // Убираем подсветку через 1.5 секунды
      setTimeout(() => {
        item.classList.remove('highlight');
      }, 1500);
    }).catch(err => {
      console.error('Не удалось скопировать текст: ', err);
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const searchInputs = document.querySelectorAll('.search-input');

  searchInputs.forEach(searchInput => {
    const containerId = searchInput.dataset.container;
    const container = document.getElementById(containerId);
    let cells = [];

    if (container) {
      cells = Array.from(container.getElementsByClassName('cell'));
    }

    searchInput.addEventListener('input', function() {
      const searchTerm = searchInput.value.toLowerCase();

      requestAnimationFrame(() => {
        const filteredCells = [];

        cells.forEach(cell => {
          const cellText = cell.textContent.toLowerCase();
          const shouldShow = cellText.includes(searchTerm);

          if (shouldShow) {
            filteredCells.push(cell);
            cell.classList.remove('hidden-cell'); // Удаляем класс hidden-cell у подходящих
          } else {
            cell.classList.add('hidden-cell'); // Добавляем класс hidden-cell к неподходящим
          }
        });

        // Очищаем контейнер
        container.innerHTML = '';

        // Добавляем отфильтрованные ячейки в контейнер
        filteredCells.forEach(cell => {
          container.appendChild(cell);
        });

        // Добавляем обратно скрытые ячейки (необязательно, если hidden-cell работает)
        cells.forEach(cell => {
          const cellText = cell.textContent.toLowerCase();
          if (!cellText.includes(searchTerm)) {
            container.appendChild(cell);
          }
        });
      });
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('.section-header:not(.toggle-legend)');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement; // родитель .section
      const items = section.querySelector('.items');
      const icon = header.querySelector('.toggle-icon');

      if (items && (items.style.display === 'none' || items.classList.contains('collapsed'))) {
        // Показать содержимое
        items.style.display = 'grid';
        items.classList.remove('collapsed');
        if (icon) icon.classList.remove('collapsed'); // стрелка вверх
      } else {
        // Скрыть содержимое
        items.style.display = 'none';
        items.classList.add('collapsed');
        if (icon) icon.classList.add('collapsed'); // стрелка вниз
      }
    });
  });
});

    // Функция открытия модального окна с увеличенной картинкой
  function openModal(imgElem) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    modalImg.src = imgElem.src;
    modalImg.alt = imgElem.alt;
    modal.classList.add('open');
  }

  // Функция закрытия модального окна
  function closeModal(event) {
    if (event.target.id === 'modal-img') return;
    const modal = document.getElementById('modal');
    modal.classList.remove('open');
  }

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const legendHeader = document.getElementById('legend-header');
  const legendContent = document.getElementById('legend-content');

  if (legendHeader && legendContent) {
    legendHeader.addEventListener('click', () => {
      legendContent.classList.toggle('open'); // Добавляем или удаляем класс 'open'
    });
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', () => {
    const textElem = item.querySelector('.item-text');
    if (!textElem) return;

    const text = textElem.innerText || textElem.textContent;

    // Копируем текст в буфер обмена
    navigator.clipboard.writeText(text).then(() => {
      // Добавляем подсветку
      item.classList.add('highlight');
      // Убираем подсветку через 1.5 секунды
      setTimeout(() => {
        item.classList.remove('highlight');
      }, 1500);
    }).catch(err => {
      console.error('Не удалось скопировать текст: ', err);
    });
    });
    });

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  document.querySelectorAll('.toggle-legend').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      if (!content) return;
      content.classList.toggle('collapsed');

      const icon = header.querySelector('.legend-icon');
      if (content.classList.contains('collapsed')) {
        icon.innerHTML = '&#9660;'; // стрелка вниз
        header.setAttribute('aria-expanded', 'false');
      } else {
        icon.innerHTML = '&#9650;'; // стрелка вверх
        header.setAttribute('aria-expanded', 'true');
      }
    });

    // Для доступности: переключение по клавише Enter или Space
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  actionSelect.addEventListener('change', function() {
    if (this.value === 'Куплю') {
      priceTypeSelect.value = 'Бюджет:';
    } else if (this.value === 'Продам') {
      priceTypeSelect.value = 'Цена:';
    } else {
      priceTypeSelect.value = ''; // Сброс, если выбрано "Обменяю" или ничего не выбрано
    }
  });

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const dropdownContents = document.querySelectorAll('.dropdown-content');
    const tableSections = document.querySelectorAll('.table-section');

    function showTable(selectedTable) {
        tableSections.forEach(tableSection => {
            tableSection.classList.add('hidden');
        });
        if (selectedTable) {
            selectedTable.classList.remove('hidden');
        }
    }

    dropdownContents.forEach(dropdownContent => {
        dropdownContent.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                event.preventDefault();
                const selectedTableId = event.target.dataset.table;
                const selectedTable = document.getElementById(selectedTableId);
                showTable(selectedTable);
            }
        });
    });

    // Инициализация: показываем первую таблицу при загрузке
    showTable(document.getElementById('table1'));
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const toggleControlsButton = document.getElementById('toggleControlsButton');
    const controlsContainer = document.getElementById('controlsContainer');
    const setShortcutButton = document.getElementById('setShortcutButton');
    const clearShortcutButton = document.getElementById('clearShortcutButton');
    const shortcutInput = document.getElementById('shortcutInput');
    const currentShortcutElement = document.getElementById('currentShortcut');

    let keys = [];
    const defaultInputValue = "Введите бинд...";

    // Функция для проверки доступности window.api и setShortcut
    function isApiReady() {
      return typeof window.api !== 'undefined' && typeof window.api.setShortcut === 'function';
    }

    // Функция для установки горячей клавиши, с проверкой API
    function setShortcut(newShortcut) {
      if (isApiReady()) {
        window.api.setShortcut(newShortcut);
      } else {
        console.error('window.api или window.api.setShortcut не определены.');
        // Можно добавить здесь логику обработки ошибки, например, показать сообщение пользователю
      }
    }

    toggleControlsButton.addEventListener('click', toggleControls);

    setShortcutButton.addEventListener('click', () => {
      let newShortcut = shortcutInput.value === defaultInputValue ? "" : shortcutInput.value;
      newShortcut = transliterate(newShortcut);  // Транслитерация
      setShortcut(newShortcut);  // Используем функцию setShortcut
    });

    clearShortcutButton.addEventListener('click', () => {
      keys = [];
      shortcutInput.value = defaultInputValue;
    });

    function toggleControls() {
      console.log("controlsContainer.style.display:", controlsContainer.style.display);
      if (controlsContainer.style.display === 'none') {
        controlsContainer.style.display = 'block';
        toggleControlsButton.textContent = 'Закрыть настройки бинда';
      } else {
        controlsContainer.style.display = 'none';
        toggleControlsButton.textContent = 'Настройки бинда для приложения';
      }
    }

    shortcutInput.addEventListener('focus', () => {
      if (shortcutInput.value === defaultInputValue) {
        shortcutInput.value = '';
      }
      keys = [];
      shortcutInput.style.color = '#7a7a7aff'; // При фокусе - белый
    });

    shortcutInput.addEventListener('blur', () => {
      if (shortcutInput.value === '') {
shortcutInput.value = defaultInputValue;
      }
          shortcutInput.style.color = ''; // Убираем стиль при потере фокуса (возвращает к стилю по умолчанию)
    });

    document.addEventListener('keydown', (event) => {
      if (document.activeElement === shortcutInput && keys.length < 3) {
        event.preventDefault();

        let key = event.key === ' ' ? 'Space' : event.key;

        if (event.location === 3) {
          key = 'Num' + key;
        }
        if (!keys.includes(key)) {
          keys.push(key);
          shortcutInput.value = keys.join('+');
        }
      }
    });

    // Функция для транслитерации
  function transliterate(text) {
      const transliterationMap = {
        'ё': '`', 'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ъ': ']', 
        'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'э': "'", 
        'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.', '.': '/', 
        'Ё': '~', 'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '{', 'Ъ': '}', '/': '|', 
        'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ':', 'Э': '"', 
        'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M', 'Б': '<', 'Ю': '>', ',': '?'
      };

    let result = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        result += transliterationMap[char] || char;
      }
      return result;
    }

    // Обработчик для получения текущей горячей клавиши
    if (isApiReady()) {
        window.api.onShortcutChanged((event, shortcut) => {
            currentShortcutElement.textContent = `Текущая горячая клавиша: ${shortcut}`;
            shortcutInput.value = shortcut;
              shortcutInput.style.color = ''; // Убираем стиль при получении нового значения из API
        });
    } else {
        console.warn('window.api не доступен при загрузке страницы. Обработчик onShortcutChanged не установлен.');
    }
  });

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const notification = document.getElementById('update-notification');
  const closeButton = document.getElementById('close-notification');
  const currentVersion = '1.3'; // <--  УКАЖИТЕ ТЕКУЩУЮ ВЕРСИЮ ОБНОВЛЕНИЯ

  function getCookie(name) { /* ... функция getCookie из предыдущих примеров ... */ }
  function setCookie(name, value, days) { /* ... функция setCookie из предыдущих примеров ... */ }

  if (localStorage.getItem('updateVersion') !== currentVersion) { // <-- Используем localStorage
    notification.classList.add('show');
  }

  closeButton.addEventListener('click', function() {
    notification.classList.remove('show');
    notification.classList.add('hide');

    localStorage.setItem('updateVersion', currentVersion); // <-- Сохраняем текущую версию
    setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  });

  // Принудительное закрытие при первой загрузке, если версия уже совпадает
  if (localStorage.getItem('updateVersion') === currentVersion) {
    notification.style.display = 'none';
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //----------- Крч, этот сркипт убрал все маски, для него есть в целом кнопка, но я её убрал, поэтому все что связано с "маск", не видимо из-за этого скрипта, убери его и все маски появятся-----------
    // Вот код этой кнопки и сразу после него код для кнопки в таблице Выбор ППО - <button id="toggle-mask-btn">Показать объявления с "маск"</button> - <button id="toggleMaskButton">Показать Маски</button>
    document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-mask-btn');

    // Находим все элементы с "маск" в тексте (регистр не важен)
    const maskElements = Array.from(document.querySelectorAll('.item, .cell'))
      .filter(el => el.textContent.toLowerCase().includes('маск'));

    // Изначально скрываем эти элементы
    maskElements.forEach(el => {
      el.style.display = 'none';
    });

    // Флаг, чтобы показать элементы только один раз
    let shown = false;

    toggleBtn.addEventListener('click', () => {
      if (!shown) {
        maskElements.forEach(el => {
          el.style.display = ''; // Показываем элементы
        });
        shown = true;
        toggleBtn.textContent = 'Объявления с "маск" показаны';
        toggleBtn.disabled = true; // Отключаем кнопку, чтобы больше не нажималась
      }
    });
  });

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/* Скрипт: открытие, закрытие, выбор темы, сохранение в localStorage */
document.addEventListener('DOMContentLoaded', () => {
  const arc = document.getElementById('themeArc');
  if (!arc) return console.warn('themeArc not found');
  const toggle = document.getElementById('themeToggle');
  const options = arc.querySelectorAll('.theme-option');

  // Применяет тему: 'dark' — дефолт (не добавляем класс), 'light'/'pink' добавляем класс
  function applyTheme(theme){
    document.body.classList.remove('light','pink');
    if(theme && theme !== 'dark'){
      document.body.classList.add(theme);
    }
    localStorage.setItem('site-theme', theme || 'dark');
  }

  // Инициализация — читаем сохранённую тему или ставим dark
  const saved = localStorage.getItem('site-theme') || 'dark';
  applyTheme(saved);

  // Открыть/закрыть меню
  function toggleArc(e){
    e.stopPropagation();
    arc.classList.toggle('open');
    const opened = arc.classList.contains('open');
    toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  }

  toggle.addEventListener('click', toggleArc);

  // Клик на опцию — применяем тему и закрываем меню
  options.forEach(opt => {
    opt.addEventListener('click', (e) => {
      const theme = opt.dataset.theme;
      applyTheme(theme);
      arc.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });

    // Доступность: выбор клавишей Enter/Space
    opt.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        opt.click();
      }
    });
  });

  // Закрывать при клике вне
  document.addEventListener('click', (e) => {
    if(!arc.contains(e.target)){
      arc.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Закрыть по Esc
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      arc.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  // На мобильных :hover не работает — пусть клик управляет открытием (уже сделано).
  // Можно закрывать меню при смене темы — уже делаем.
});

// --------------------------------------------------------------------------------0000000000000000000000000000000000000-----------------------------------------------------
      
