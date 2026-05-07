import { register, login, getMe, forgotPassword, logout } from './auth.controller';
export default async function authRoutes(app) {
    app.post('/register', register);
    app.post('/login', login);
    app.post('/forgot-password', forgotPassword);
    // Protected
    app.get('/me', { onRequest: [app.authenticate] }, getMe);
    app.post('/logout', { onRequest: [app.authenticate] }, logout);
}
//# sourceMappingURL=auth.router.js.map