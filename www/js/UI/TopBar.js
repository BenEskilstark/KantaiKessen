import StatefulHTML from './StatefulHTML.js';


export default class TopBar extends StatefulHTML {
    prevTickInterval = "init";

    connectedCallback() {
        const state = this.getState();
        if (state.tickInterval == null) this.togglePause();
        this.render(this.getState());
    }

    onChange(state) {
        if (state.tickInterval != this.prevTickInterval) {
            this.render(state);
            this.prevTickInterval = state.tickInterval;
        }
    }

    render(state) {
        const { tickInterval, mouse } = state;

        this.innerHTML = `
          <button onclick="closest('top-bar').togglePause()">
            ${tickInterval ? "Pause" : "Play"}
          </button>
          <button onclick="closest('top-bar').toggleClickMode()">
            ${mouse.clickMode == "SELECT" ? "Fire Mode (F)" : "Select Mode"}
          </button>
        `;
    }

    togglePause() {
        const { tickInterval } = this.getState();
        if (tickInterval) {
            this.dispatch({ type: "STOP_TICK" });
        } else {
            this.dispatch({
                type: "START_TICK",
                dispatchFn: () => this.dispatch({ type: "TICK" })
            });
        }
    }

    toggleClickMode() {
        const { mouse } = this.getState();
        if (mouse.clickMode == "FIRE") {
            this.dispatch({ type: "SET_CLICK_MODE", clickMode: "SELECT" });
        } else {
            this.dispatch({ type: "SET_CLICK_MODE", clickMode: "FIRE" });
        }
    }
}