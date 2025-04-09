import StatefulHTML from './StatefulHTML.js';
import { convertGridPosToPixel, convertPixelToGridPos } from '../utils/coordinates.js';


export default class GameBoard extends StatefulHTML {
    connectedCallback() {
        const width = parseInt(this.getAttribute("width"));
        const height = parseInt(this.getAttribute("height"));
        this.dispatch({ width, height });
        this.render(this.getState());

        window.getState = this.getState;
        window.dispatch = this.dispatch;
    }

    render(state) {
        const { width, height, mouse, entities, tickInterval } = state;

        const canvas = this.querySelector("canvas")
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "steelblue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const id in entities) {
            ctx.save();
            const { x, y, color, radius, isSelected, target, firePos, range } = entities[id];
            const pos = convertGridPosToPixel(state, { x, y });
            if (target) {
                const t = convertGridPosToPixel(state, target);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(t.x, t.y);
                ctx.stroke();
            }
            if (firePos) {
                ctx.save();
                const f = convertGridPosToPixel(state, firePos);
                ctx.strokeStyle = "orange";
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(f.x, f.y);
                ctx.stroke();
                ctx.restore();
            }
            ctx.fillStyle = color;
            ctx.font = "15px Arial";
            ctx.strokeText("🚢", pos.x - radius / 2, pos.y + 3);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            // ctx.fill();
            if (isSelected) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "gold";
                ctx.stroke();
            }
            if (isSelected && range) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, range, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        }

        if (mouse.downPos != null) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            const downPixel = convertGridPosToPixel(state, mouse.downPos);
            const mWidth = mouse.curPos.x - downPixel.x;
            const mHeight = mouse.curPos.y - downPixel.y;
            ctx.strokeRect(downPixel.x, downPixel.y, mWidth, mHeight);
        }
    }

    onChange(state) {
        this.render(state);
    }

    /////////////////////////////////////////////////////////////////////////////
    // Mouse Handlers

    canvasMouseDown(ev) {
        ev.preventDefault();
        if (ev.button !== 0) return; // Only proceed for left-click
        this.dispatch({ type: "MOUSE_DOWN", ev });
    }

    canvasMouseUp(ev) {
        ev.preventDefault();
        if (ev.button !== 0) return; // Only proceed for left-click
        this.dispatch({ type: "MOUSE_UP", ev });
    }

    canvasMouseMove(ev) {
        ev.preventDefault();
        if (this.getState().mouse.downPos == null) return;
        this.dispatch({ type: "MOUSE_MOVE", ev });
    }

    canvasRightClick(ev) {
        ev.preventDefault();
        this.dispatch({ type: "RIGHT_CLICK", ev });
    }
}


