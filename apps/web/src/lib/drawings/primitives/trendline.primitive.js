class TrendlineRenderer {
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
            // Scale coordinates to bitmap ratio
            const scaledX1 = Math.round(x1 * scope.horizontalPixelRatio);
            const scaledY1 = Math.round(y1 * scope.verticalPixelRatio);
            const scaledX2 = Math.round(x2 * scope.horizontalPixelRatio);
            const scaledY2 = Math.round(y2 * scope.verticalPixelRatio);
            ctx.beginPath();
            ctx.moveTo(scaledX1, scaledY1);
            if (this._options.isRay) {
                // Extend the line to the edge of the screen
                const dx = scaledX2 - scaledX1;
                const dy = scaledY2 - scaledY1;
                if (dx === 0 && dy === 0)
                    return;
                // Ray cast far to the right (or left)
                const multiplier = 10000;
                ctx.lineTo(scaledX1 + dx * multiplier, scaledY1 + dy * multiplier);
            }
            else {
                ctx.lineTo(scaledX2, scaledY2);
            }
            ctx.strokeStyle = this._options.color || '#2962FF';
            ctx.lineWidth = (this._options.width || 2) * scope.horizontalPixelRatio;
            ctx.stroke();
        });
    }
}
class TrendlinePaneView {
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
        return 'top';
    }
    renderer() {
        return new TrendlineRenderer(this._series, this._chart, this._p1, this._p2, this._options);
    }
}
export class TrendlinePrimitive {
    _series = null;
    _chart = null;
    _p1 = null;
    _p2 = null;
    _options;
    // LWC uses this callback to trigger redraws
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
        return [new TrendlinePaneView(this._series, this._chart, this._p1, this._p2, this._options)];
    }
    setPoints(p1, p2) {
        this._p1 = p1;
        this._p2 = p2;
        this.updateAllViews();
    }
}
//# sourceMappingURL=trendline.primitive.js.map