import { getUserSettings, updateUserSettings, getApiKeys, createApiKey, revokeApiKey } from './user.controller';
export default async function userRoutes(app) {
    app.get('/settings', getUserSettings);
    app.patch('/settings', updateUserSettings);
    app.get('/api-keys', getApiKeys);
    app.post('/api-keys', createApiKey);
    app.delete('/api-keys/:id', revokeApiKey);
}
//# sourceMappingURL=user.router.js.map