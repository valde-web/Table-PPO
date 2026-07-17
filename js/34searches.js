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