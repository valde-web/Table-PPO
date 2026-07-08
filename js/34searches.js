// функция отображения ячеек cell в поиск ппо и 2.0
document.addEventListener('DOMContentLoaded', () => {
  // Параметры debounce
  const DEBOUNCE_MS = 8;

  // Утилита debounce
  function debounce(fn, wait) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Берёт текст для поиска из ячейки: если есть data-copy — используем его, иначе textContent
  function getCellText(cell) {
    if (!cell) return '';
    const dc = cell.dataset && cell.dataset.copy;
    if (dc !== undefined && dc !== null && String(dc).trim() !== '') {
      return String(dc).toLowerCase();
    }
    return (cell.textContent || '').toLowerCase();
  }

  // Обработчик одного поля поиска (фильтрация только в своём контейнере)
  function attachSearchToInput(inputEl) {
    const containerId = inputEl.dataset.container;
    if (!containerId) {
      console.warn('Поле поиска не содержит data-container, пропускаем:', inputEl);
      return;
    }

    const runFilter = () => {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn('Контейнер не найден:', containerId);
        return;
      }

      const searchTerm = (inputEl.value || '').trim().toLowerCase();

      // Получаем актуальный список .cell (учитываем динамическую подгрузку)
      const cells = Array.from(container.getElementsByClassName('cell-wrapper'));

      // Если строка поиска пустая — просто убираем класс hidden у всех ячеек
      if (searchTerm === '') {
        cells.forEach(cell => cell.classList.remove('hidden-cell'));
        return;
      }

      // Иначе — показываем только те, которые соответствуют
      cells.forEach(cell => {
        const text = getCellText(cell);
        if (text.includes(searchTerm)) {
          cell.classList.remove('hidden-cell');
        } else {
          cell.classList.add('hidden-cell');
        }
      });
    };

    // Навешиваем с debounce
    const debounced = debounce(() => requestAnimationFrame(runFilter), DEBOUNCE_MS);
    inputEl.addEventListener('input', debounced);

    // Опционально: реагируем на очистку через Esc (если нужно)
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        inputEl.value = '';
        requestAnimationFrame(runFilter);
      }
    });
  }

  // Инициализируем для всех полей .search-input
  document.querySelectorAll('.search-input').forEach(attachSearchToInput);
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Функция кнопки скрытия масок для Поисков ППО, по дефолту маски не показываются, чтоб показывались надо в скрипте че то поменять или кнопку нажать, кнопку и эту и ту для выбора я скрыл и этот скрипт скрывает слова с "маск", вот кнопка - <button id="toggle-mask-btn">Показать объявления с "маск"</button>
  document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-mask-btn');

  // Флаг: показывать ли элементы с "маск". По умолчанию — нет.
  let showMasks = false;

  // Функция: проверяет один DOM-узел (если это .item-text или .cell-text) и скрывает/показывает его
  function processTextNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
    const isTarget = node.classList && (node.classList.contains('item-wrapper') || node.classList.contains('cell-wrapper'));
    if (!isTarget) return;

    const text = (node.textContent || '').toLowerCase();
    if (text.includes('маск') || text.includes('балаклав')) {
      if (!showMasks) {
        node.classList.add('masked-hidden');
      } else {
        node.classList.remove('masked-hidden');
      }
    }
  }

  // Обрабатываем элемент и его потомков (на случай, если добавлен контейнер с вложенными item-text / cell-text)
  function processElementAndChildren(el) {
    if (!el) return;
    // Если сам элемент — целевой
    processTextNode(el);
    // Ищем вложенные целевые элементы
    const targets = el.querySelectorAll && el.querySelectorAll('.item-text, .cell-text');
    if (targets && targets.length) {
      targets.forEach(t => processTextNode(t));
    }
  }

  // Изначальная одноразовая проверка: существующие элементы в DOM
  function initialHide() {
    // Найдём все текущие .item-text и .cell-text и обработаем их
    const existing = document.querySelectorAll('.item-text, .cell-text');
    existing.forEach(node => processTextNode(node));
  }

  // MutationObserver: следим за добавлением узлов в документе, чтобы применить логику к новым
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      // обрабатываем добавленные узлы
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(added => {
          // Если добавлен элемент, обрабатываем его и его потомков
          if (added.nodeType === Node.ELEMENT_NODE) {
            processElementAndChildren(added);
          }
        });
      }
      // Если обновился текст внутри существующего узла — тоже проверим
      if (m.type === 'characterData' && m.target && m.target.parentElement) {
        processTextNode(m.target.parentElement);
      }
    }
  });

  // Начнём слежение за body, чтобы поймать добавление элементов в любые контейнеры.
  // Если у вас много динамических изменений и производительность важна, можно заменить document.body
  // на более точные контейнеры (например, container1 и container2).
  const obsConfig = { childList: true, subtree: true, characterData: true };
  observer.observe(document.body, obsConfig);

  // Инициализация: скрываем уже существующие элементы
  initialHide();

  // Кнопка переключения: показать маски и отключить кнопку
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (showMasks) return;
      showMasks = true;
      // Показать все текущие скрытые элементы
      document.querySelectorAll('.item-text.masked-hidden, .cell-text.masked-hidden').forEach(el => {
        el.classList.remove('masked-hidden');
      });
      toggleBtn.textContent = 'Объявления с "маск" показаны';
      toggleBtn.disabled = true;
    });
  } else {
    // Если кнопки нет, просто оставляем скрытыми — ничего не делаем
    console.warn('Кнопка toggle-mask-btn не найдена. Маск-элементы остаются скрытыми.');
  }
});