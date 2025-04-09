
import { mouseReducer } from "./mouseReducer.js";
import { tickReducer } from "./tickReducer.js";

export const rootReducer = (state, action) => {
    if (state === undefined) state = initState();

    switch (action.type) {
        case 'MOUSE_DOWN':
        case 'MOUSE_MOVE':
        case "MOUSE_UP":
        case "RIGHT_CLICK":
        case "SET_CLICK_MODE":
            return mouseReducer(state, action);
        case 'ADD_ENTITIY': {
            const { entity } = action;
            entity.id = state.nextEntityId++;
            return { ...state, entities: { ...state.entities, [entity.id]: entity } };
        }
        case 'REMOVE_ENTITY': {
            const { entityId } = action;
            delete state.entities[entityId];
            return state;
        }
        case 'START_TICK':
        case 'STOP_TICK':
        case 'TICK':
            return tickReducer(state, action);
        default:
            return state;
    }
};

export const initState = () => {
    return {
        tick: 0,
        tickInterval: null,
        tickRate: 50,

        width: 800, height: 800,
        nextEntityId: 0,
        entities: {
            0: {
                id: 0, x: 100, y: 100, speed: 2, color: "red", radius: 20,
                range: 200, fireRateTicks: 30, fireCooldown: 10,
            }
        },

        mouse: {
            downPos: null,
            curPos: null,
            upPos: null,
            clickMode: "SELECT",
        }
    };
}


