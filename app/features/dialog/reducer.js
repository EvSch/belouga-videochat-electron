/* @flow */

import { HIDE_DIALOG, OPEN_DIALOG } from './actionTypes';

/**
 * Reduces redux actions which show or hide dialogs.
 *
 * @param {State} state - The current redux state.
 * @param {Action} action - The redux action to reduce.
 * @param {string} action.type - The type of the redux action to reduce..
 * @returns {State} The next redux state that is the result of reducing the
 * specified action.
 */
export default (state: {}, action: Object) => {
    switch (action.type) {
    case HIDE_DIALOG: {
        const { component } = action;

        if (typeof component === 'undefined' || state.component === component) {
            return {
                component: undefined,
                componentProps: undefined,
                rawDialog: false
            }
        }
        break;
    }

    case OPEN_DIALOG:
        return {
            component: action.component,
            componentProps: action.componentProps,
            rawDialog: action.rawDialog
        };
        break;

    default: return {
        component: undefined,
        componentProps: undefined,
        rawDialog: false
    }
    }

    //return state;
};
