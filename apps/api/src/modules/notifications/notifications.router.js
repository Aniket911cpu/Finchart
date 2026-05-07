import { listNotifications, markRead, markAllRead, clearRead, unreadCount } from './notifications.controller';
export default async function notificationsRoutes(app) {
    app.get('/', listNotifications);
    app.get('/unread-count', unreadCount);
    app.patch('/:id/read', markRead);
    app.post('/read-all', markAllRead);
    app.delete('/clear', clearRead);
}
//# sourceMappingURL=notifications.router.js.map