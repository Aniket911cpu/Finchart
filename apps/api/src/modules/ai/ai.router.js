import { chartSummary, aiAsk, detectPatterns } from './ai.controller';
export default async function aiRoutes(app) {
    app.post('/chart-summary', chartSummary);
    app.post('/ask', aiAsk);
    app.post('/patterns', detectPatterns);
}
//# sourceMappingURL=ai.router.js.map