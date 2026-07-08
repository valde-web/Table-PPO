// Функция поиска и фильтрации масок для колонки "Значение:" в Выбор ППО - кнопка масок <button id="toggleMaskButton">Показать Маски</button>
document.addEventListener('DOMContentLoaded', function() {
  const itemmSearchInput = document.getElementById('itemmSearch');
  const itemmSelect = document.getElementById('itemm');
  const toggleMaskButton = document.getElementById('toggleMaskButton');

  if (!itemmSearchInput || !itemmSelect) {
    console.error('Не найдены элементы itemmSearch или itemm. Проверьте HTML.');
    return;
  }

  let maskVisible = false; // Флаг видимости масок
  let allOptionsData = []; // Массив для хранения данных (изначальных и из Firebase)

  // Утилиты
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  const maxResults = 500;

  // Функция для загрузки данных из Firebase
  function loadOptionsFromFirebase(section, callback) {
      // Инициализация Firebase
      const app = firebase.initializeApp(firebaseConfig);
      const database = firebase.database();

    const dataRef = database.ref(section);

    dataRef.once('value', (snapshot) => { // Используем once вместо on, чтобы избежать повторных загрузок
      const firebaseData = [];

      snapshot.forEach((childSnapshot) => {
        const itemData = childSnapshot.val();
        const optionValue = itemData.value || itemData.text || ''; //  Предполагаем наличие поля "value" или "text"
        const optionText = itemData.text || optionValue || '';

        // Добавляем данные в массив, учитывая "маск"
        firebaseData.push({
          text: optionText.trim(),
          value: optionValue.trim(),
          lower: optionText.trim().toLowerCase(),
          isMask: optionText.toLowerCase().includes('маск') || optionText.toLowerCase().includes('балаклав')
        });
      });

      callback(firebaseData); // Вызываем коллбэк с данными из Firebase
    });
  }

  // Функция для отрисовки options в DOM
  function renderOptions(filteredArr, preserveValue) {
    const prev = preserveValue ? itemmSelect.value : null;

    const frag = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '(Выберите)';
    frag.appendChild(defaultOption);

    const count = Math.min(filteredArr.length, maxResults);
    for (let i = 0; i < count; i++) {
      const o = document.createElement('option');
      o.value = filteredArr[i].value;
      o.textContent = filteredArr[i].text;
      frag.appendChild(o);
    }

    itemmSelect.innerHTML = '';
        itemmSelect.appendChild(frag);

    if (prev) {
      const exists = Array.from(itemmSelect.options).some(opt => opt.value === prev);
      if (exists) itemmSelect.value = prev;
    }
  }

  // Функция для фильтрации
  function doFilter() {
    const term = itemmSearchInput.value.trim().toLowerCase();

    const filtered = allOptionsData.filter(o => {
      const passesMask = !o.isMask || maskVisible;
      const passesSearch = term === '' || o.lower.includes(term);
      return passesMask && passesSearch;
    });

    renderOptions(filtered, true);
  }

  const debouncedFilter = debounce(doFilter, 150);

  itemmSearchInput.addEventListener('input', debouncedFilter);

  // Инициализация:
  loadOptionsFromFirebase('itemm', (firebaseData) => {
    // 1) Сохраняем изначальные данные из select в allOptionsData
    const initialOptionsData = Array.from(itemmSelect.options).map(opt => ({
        text: opt.textContent.trim(),
        value: opt.value,
        lower: opt.textContent.trim().toLowerCase(),
        isMask: opt.textContent.toLowerCase().includes('маск') || opt.textContent.toLowerCase().includes('балаклав')
    }));

   // Функция для добавления данных с проверкой на дубликаты
   function addOptionWithCheck(option) {
    const isDuplicate = allOptionsData.some(existingOption => existingOption.value === option.value);
    if (!isDuplicate) {
      allOptionsData.push(option);
    }
  }
  initialOptionsData.forEach(addOptionWithCheck);
    firebaseData.forEach(addOptionWithCheck);

    // 2) Отрисовываем всё
    renderOptions(allOptionsData, false);
  });

   // --- 5) Маски
  if (toggleMaskButton) {
    toggleMaskButton.addEventListener('click', () => {
      maskVisible = !maskVisible;

      doFilter();
    });
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// функция всей логики выбор ппо
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
        copyButton.textContent = 'Скопировано!'; // Меняем текст (можно убрать) ЭТО ДЛЯ ВЫБОР ППО КНОПКА КОПИРОВАТЬ
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

    // --- НОВОЕ: Очистка полей поиска ---
  const itemmmSearch = document.getElementById('itemmmSearch');
  const itemmSearch = document.getElementById('itemmSearch');

  if (itemmmSearch) {
    itemmmSearch.value = ''; // Стираем текст поиска
    filterOptions();        // Запускаем фильтр, чтобы показать все опции
  }

  if (itemmSearch) {
    itemmSearch.value = ''; // Очищаем поле

    // 1. Принудительно вызываем событие 'input'. 
    // Это заставит все функции, которые «слушают» ввод в это поле, пересчитать результат.
    itemmSearch.dispatchEvent(new Event('input', { bubbles: true }));
    itemmSearch.dispatchEvent(new Event('keyup', { bubbles: true }));

    // 2. Если в твоем коде есть глобальная переменная term (как в прошлом скрипте), 
    // ее нужно обнулить вручную перед вызовом doFilter
    if (typeof term !== 'undefined') {
        term = ''; 
    }

    // 3. Вызываем функцию фильтрации
    if (typeof doFilter === 'function') {
        doFilter(); 
    }

    // 4. На всякий случай проходимся по DOM-элементам еще раз
    const itemmSelect = document.getElementById('itemm');
    if (itemmSelect) {
        const options = itemmSelect.querySelectorAll('option');
        options.forEach(opt => {
            opt.style.display = ''; // Показываем
            opt.disabled = false;   // Включаем, если были выключены
        });
    }
}
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

  actionSelect.addEventListener('change', function() {
    if (this.value === 'Куплю') {
      priceTypeSelect.value = 'Бюджет:';
    } else if (this.value === 'Продам') {
      priceTypeSelect.value = 'Цена:';
    } else {
      priceTypeSelect.value = ''; // Сброс, если выбрано "Обменяю" или ничего не выбрано
    }
  });
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Функция поиска и фильтрации масок в колонке "Знач. с тюнингом" выбор ппо - кнопка выше в 1 скрипте которая за маски отвечает
  function filterOptions() {
  let input, filter, select, options, i, txtValue;
  input = document.getElementById("itemmmSearch");
  filter = input.value.toUpperCase();
  select = document.getElementById("itemmm");
  options = select.getElementsByTagName("option");

  // Если поле поиска пустое, показываем сразу все элементы и выходим
  if (filter === "") {
    for (i = 0; i < options.length; i++) {
      options[i].style.display = "";
    }
    return; 
  }

  for (i = 0; i < options.length; i++) {
    // Исправлено: добавлены операторы ||
    txtValue = options[i].textContent || options[i].innerText;
    let valValue = options[i].value || "";

    // Проверяем совпадение в тексте или в value
    if (txtValue.toUpperCase().indexOf(filter) > -1 || valValue.toUpperCase().indexOf(filter) > -1) {
      options[i].style.display = "";
    } else {
      options[i].style.display = "none";
    }
  }
}