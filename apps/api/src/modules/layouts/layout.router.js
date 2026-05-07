import { LayoutController } from './layout.controller';
export default async function layoutRoutes(app) {
    // Routes are protected via onRequest hook in app.ts
    app.get('/', LayoutController.getLayouts);
    app.post('/', LayoutController.createLayout);
    app.put('/:id', LayoutController.updateLayout);
    app.delete('/:id', LayoutController.deleteLayout);
}
//# sourceMappingURL=layout.router.js.map