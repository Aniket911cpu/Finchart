class HRayRenderer {
    _series;
    _chart;
    _p1;
    _options;
    constructor(series, chart, p1, options) {
        this._series = series;
        this._chart = chart;
        this._p1 = p1;
        this._options = options;
    }
    draw(target) {
        target.useBitmapCoordinateSpace((scope) => {
            if (!this._p1 || !this._chart)
                return;
            const ctx = scope.context;
            const x1 = this._chart.timeScale().timeToCoordinate(this._p1.time);
            const y1 = this._series.priceToCoordinate(this._p1.price);
            if (x1 === null || y1 === null)
                return;
            const scaledX1 = Math.round(x1 * scope.horizontalPixelRatio);
            const scaledY1 = Math.round(y1 * scope.verticalPixelRatio);
            // Get the width of the canvas to draw the ray to the end
            const canvasWidth = scope.mediaSize.width * scope.horizontalPixelRatio;
            ctx.beginPath();
            ctx.moveTo(scaledX1, scaledY1);
            ctx.lineTo(canvasWidth, scaledY1);
            ctx.strokeStyle = this._options.color || '#2962FF';
            ctx.lineWidth = (this._options.width || 2) * scope.horizontalPixelRatio;
            ctx.stroke();
        });
    }
}
class HRayPaneView {
    _series;
    _chart;
    _p1;
    _options;
    constructor(series, chart, p1, options) {
        this._series = series;
        this._chart = chart;
        this._p1 = p1;
        this._options = options;
    }
    zOrder() {
        return 'top';
    }
    renderer() {
        return new HRayRenderer(this._series, this._chart, this._p1, this._options);
    }
}
export class HorizontalRayPrimitive {
    _series = null;
    _chart = null;
    _p1 = null;
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
        return [new HRayPaneView(this._series, this._chart, this._p1, this._options)];
    }
    setPoints(p1, p2) {
        this._p1 = p1;
        // p2 is ignored for horizontal ray as it only needs one anchor
        this.updateAllViews();
    }
}
//# sourceMappingURL=horizontal-ray.primitive.js.map