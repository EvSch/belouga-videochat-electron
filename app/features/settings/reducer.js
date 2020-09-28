// @flow

import {
    SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
    SET_AUDIO_MUTED,
    SET_EMAIL,
    SET_NAME,
    SET_USERNAME,
    SET_PASSWORD,
    SET_SERVER_URL,
    SET_SERVER_TIMEOUT,
    SET_VIDEO_MUTED,
    SET_LOGGED_IN,
    SET_LOGIN_ERROR,
    SET_DISPLAY_ADVANCED_SETTINGS,
    SET_DEFAULT_LIVE_URL
} from './actionTypes';

type State = {
    alwaysOnTopWindowEnabled: boolean,
    email: string,
    name: string,
    username: string,
    password: string,
    loggedIn: boolean,
    loginError: boolean,
    showAdvanced: boolean,
    liveURL: ?string,
    serverURL: ?string,
    serverTimeout: ?number,
    startWithAudioMuted: boolean,
    startWithVideoMuted: boolean
};

const username = window.jitsiNodeAPI.osUserInfo().username;

const DEFAULT_STATE = {
    alwaysOnTopWindowEnabled: true,
    email: '',
    username: undefined,
    password: undefined,
    loggedIn: false,
    loginError: false,
    showAdvanced: false,
    liveURL: '',
    name: username,
    serverURL: undefined,
    serverTimeout: undefined,
    startWithAudioMuted: false,
    startWithVideoMuted: false
};

/**
 * Reduces redux actions for features/settings.
 *
 * @param {State} state - Current reduced redux state.
 * @param {Object} action - Action which was dispatched.
 * @returns {State} - Updated reduced redux state.
 */
export default (state: State = DEFAULT_STATE, action: Object) => {
    switch (action.type) {
    case SET_ALWAYS_ON_TOP_WINDOW_ENABLED:
        return {
            ...state,
            alwaysOnTopWindowEnabled: action.alwaysOnTopWindowEnabled
        };

    case SET_AUDIO_MUTED:
        return {
            ...state,
            startWithAudioMuted: action.startWithAudioMuted
        };

    case SET_EMAIL:
        return {
            ...state,
            email: action.email
        };

    case SET_NAME:
        return {
            ...state,
            name: action.name
        };

    case SET_USERNAME:
        return {
            ...state,
            username: action.username
        };

    case SET_PASSWORD:
        return {
            ...state,
            password: action.password
        };

    case SET_SERVER_URL:
        return {
            ...state,
            serverURL: action.serverURL
        };

    case SET_SERVER_TIMEOUT:
        return {
            ...state,
            serverTimeout: action.serverTimeout
        };

    case SET_VIDEO_MUTED:
        return {
            ...state,
            startWithVideoMuted: action.startWithVideoMuted
        };

    case SET_LOGGED_IN:
        return {
            ...state,
            loggedIn: action.isLoggedIn
        };

    case SET_LOGIN_ERROR:
        return {
            ...state,
            loginError: action.showLoginError
        };

    case SET_DISPLAY_ADVANCED_SETTINGS:
        return {
            ...state,
            showAdvanced: action.showAdvancedSettings
        };

    case SET_DEFAULT_LIVE_URL:
        return {
            ...state,
            liveURL: action.liveUrl
        };

    default:
        return state;
    }
};
