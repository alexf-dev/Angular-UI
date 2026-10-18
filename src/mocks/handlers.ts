import { http, HttpResponse } from 'msw';

export const handlers = [
  // === ТЕСТОВЫЕ МОКИ ДЛЯ ПРОВЕРКИ ИНТЕРСЕСПТОРА ===

  // Эмуляция 404 ошибки
  http.get('/api/test/404', () => {
    return HttpResponse.json(
      { error: 'Resource not found' },
      { status: 404, statusText: 'Not Found' }
    );
  }),

  // Эмуляция 500 ошибки
  http.get('/api/test/500', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }),

  // Эмуляция 404 для POST (если хочешь проверить разные методы)
  http.post('/api/test/404', () => {
    return HttpResponse.json(
      { error: 'Resource not found' },
      { status: 404, statusText: 'Not Found' }
    );
  }),

  // Эмуляция 500 для POST
  http.post('/api/test/500', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  }),

  // Обычный моковый ответ
  http.get('/api/expert-examination/neurological-status', () => {
    return HttpResponse.json({ /* твои моковые данные */ });
  }),

  // Эмуляция 404 — заодно тестирует твой ErrorInterceptor
  http.get('/api/expert-examination/ophthalmology-data', () => {
    return HttpResponse.json({ message: 'Not found' }, { status: 404 });
  }),

  // Эмуляция 500
  http.post('/api/expert-examination/save', () => {
    return HttpResponse.json({ message: 'Server error' }, { status: 500 });
  }),

  // Точечный возврат на реальную сеть, если понадобится:
  // http.get('/api/some-real-endpoint', () => passthrough()),
];
