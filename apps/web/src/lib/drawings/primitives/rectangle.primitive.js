class RectRenderer {
    _series;
    _chart;
    _p1;
    _p2;
    _options;
    constructor(series, chart, p1, p2, options) {
        this._series = series;
        this._chart = chart;
        this._p1 = p1;
        this._p2 = p2;
        this._options = options;
    }
    draw(target) {
        target.useBitmapCoordinateSpace((scope) => {
            if (!this._p1 || !this._p2 || !this._chart)
                return;
            const ctx = scope.context;
            const x1 = this._chart.timeScale().timeToCoordinate(this._p1.time);
            const y1 = this._series.priceToCoordinate(this._p1.price);
            const x2 = this._chart.timeScale().timeToCoordinate(this._p2.time);
            const y2 = this._series.priceToCoordinate(this._p2.price);
            if (x1 === null || y1 === null || x2 === null || y2 === null)
                return;
            const scaledX1 = Math.round(Math.min(x1, x2) * scope.horizontalPixelRatio);
            const scaledY1 = Math.round(Math.min(y1, y2) * scope.verticalPixelRatio);
            const scaledX2 = Math.round(Math.max(x1, x2) * scope.horizontalPixelRatio);
            const scaledY2 = Math.round(Math.max(y1, y2) * scope.verticalPixelRatio);
            const width = scaledX2 - scaledX1;
            const height = scaledY2 - scaledY1;
            ctx.fillStyle = this._options.fillColor || 'rgba(41, 98, 255, 0.2)';
            ctx.fillRect(scaledX1, scaledY1, width, height);
            ctx.strokeStyle = this._options.color || '#2962FF';
            ctx.lineWidth = (this._options.width || 2) * scope.horizontalPixelRatio;
            ctx.strokeRect(scaledX1, scaledY1, width, height);
        });
    }
}
class RectPaneView {
    _series;
    _chart;
    _p1;
    _p2;
    _options;
    constructor(series, chart, p1, p2, options) {
        this._series = series;
        this._chart = chart;
        this._p1 = p1;
        this._p2 = p2;
        this._options = options;
    }
    zOrder() {
        return 'normal';
    }
    renderer() {
        return new RectRenderer(this._series, this._chart, this._p1, this._p2, this._options);
    }
}
export class RectanglePrimitive {
    _series = null;
    _chart = null;
    _p1 = null;
    _p2 = null;
    _options;
    requestUpdate;
    constructor(options = {}) {
        this._options = options;
    }
    attached({ requestUpdate, chart, series }) {
        this.requestUpdate = requestUpdate;
        this._series = series;
        this._chart = chart;
    }
    detached() {
        this.requestUpdate = undefined;
        this._series = null;
        this._chart = null;
    }
    updateAllViews() {
        this.requestUpdate?.();
    }
    paneViews() {
        if (!this._series || !this._chart)
            return [];
        return [new RectPaneView(this._series, this._chart, this._p1, this._p2, this._options)];
    }
    setPoints(p1, p2) {
        this._p1 = p1;
        this._p2 = p2;
        this.updateAllViews();
    }
}
//# sourceMappingURL=rectangle.primitive.js.map