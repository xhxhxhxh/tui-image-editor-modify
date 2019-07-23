/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Free drawing module, Set brush
 */
import fabric from 'fabric/dist/fabric.require';
import Component from '../interface/component';
import consts from '../consts';

/**
 * FreeDrawing
 * @class FreeDrawing
 * @param {Graphics} graphics - Graphics instance
 * @extends {Component}
 * @ignore
 */
class FreeDrawing extends Component {
    constructor(graphics) {
        super(consts.componentNames.FREE_DRAWING, graphics);

        /**
         * Brush width
         * @type {number}
         */
        this.width = 12;

        /**
         * fabric.Color instance for brush color
         * @type {fabric.Color}
         */
        this.oColor = new fabric.Color('rgba(0, 0, 0, 0.5)');
    }

    /**
     * Start free drawing mode
     * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
     */
    start(setting, control) {
        if (control) {
            const event = control.event;
            const canvas = this.getCanvas();
            if (event === 'start') { //手动触发start
                canvas.isDrawingMode = true;
                this.setBrush(control.setting);
            }else if (event === 'mousedown') {
                this._onMouseDownInDrawingMode(canvas, control)
            }else if (event === 'mousemove') {
                this._onMouseMoveInDrawingMode(canvas, control)
            }else if (event === 'mouseup') {
                this._onMouseUpInDrawingMode(canvas)
            }
        } else {
            const canvas = this.getCanvas();

            canvas.isDrawingMode = true;
            this.setBrush(setting);
        }
    }

    /**
     * Set brush
     * @param {{width: ?number, color: ?string}} [setting] - Brush width & color
     */
    setBrush(setting) {
        const brush = this.getCanvas().freeDrawingBrush;
        setting = setting || {};
        this.width = setting.width || this.width;
        if (setting.color) {
            this.oColor = new fabric.Color(setting.color);
        }
        brush.width = this.width;
        brush.color = this.oColor.toRgba();
    }

    /**
     * End free drawing mode
     */
    end() {
        const canvas = this.getCanvas();

        canvas.isDrawingMode = false;
    }

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseDownInDrawingMode(canvas, control) {
        canvas._isCurrentlyDrawing = true;
        canvas.renderAll();
        if (canvas.clipTo) {
            fabric.util.clipContext(canvas, canvas.contextTop);
        }
        const pointer = control.position;
        canvas.freeDrawingBrush.onMouseDown(pointer);
    }

    /**
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    _onMouseMoveInDrawingMode(canvas, control) {
        if (canvas._isCurrentlyDrawing) {
            const pointer = control.position;
            canvas.freeDrawingBrush.onMouseMove(pointer);
        }
        canvas.setCursor(canvas.freeDrawingCursor);
    }

    /**
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    _onMouseUpInDrawingMode(canvas) {
        canvas._isCurrentlyDrawing = false;
        if (canvas.clipTo) {
            canvas.contextTop.restore();
        }
        canvas.freeDrawingBrush.onMouseUp();
    }
}

module.exports = FreeDrawing;
