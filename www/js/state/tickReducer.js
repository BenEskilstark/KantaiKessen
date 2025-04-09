
import { dist, subtract, vectorTheta } from '../utils/vectors.js';

export const tickReducer = (state, action) => {
    switch (action.type) {
        case 'START_TICK': {
            const { dispatchFn } = action;
            const { tickRate } = state;
            return {
                ...state,
                tickInterval: setInterval(dispatchFn, tickRate),
            };
        }
        case 'STOP_TICK':
            clearInterval(state.tickInterval);
            return { ...state, tickInterval: null };
        case 'TICK':
            return tick(state);
    }
}

const tick = (state) => {
    state.tick++;

    const { entities } = state;

    // move entities towards their targets
    for (const id in entities) {
        const entity = entities[id];
        if (entity.target != null && dist(entity.target, entity) > 1) {
            const theta = vectorTheta(subtract(entity.target, entity));
            entity.x += entity.speed * Math.cos(theta);
            entity.y += entity.speed * Math.sin(theta);
        }
    }

    return state;
}