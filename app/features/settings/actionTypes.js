/**
 * The type of (redux) action that sets Window always on top.
 *
 * @type {
 *     type: SET_ALWAYS_ON_TOP_WINDOW_ENABLED,
 *     alwaysOnTopWindowEnabled: boolean
 * }
 */
export const SET_ALWAYS_ON_TOP_WINDOW_ENABLED
    = Symbol('SET_ALWAYS_ON_TOP_WINDOW_ENABLED');

/**
 * The type of (redux) action that sets Start with Audio Muted.
 *
 * @type {
 *     type: SET_AUDIO_MUTED,
 *     startWithAudioMuted: boolean
 * }
 */
export const SET_AUDIO_MUTED = Symbol('SET_AUDIO_MUTED');

/**
 * The type of (redux) action that sets the email of the user.
 *
 * @type {
 *     type: SET_EMAIL,
 *     email: string
 * }
 */
export const SET_EMAIL = Symbol('SET_EMAIL');

/**
 * The type of (redux) action that sets the name of the user.
 *
 * @type {
 *     type: SET_NAME,
 *     name: string
 * }
 */
export const SET_NAME = Symbol('SET_NAME');

/**
 * The type of (redux) action that sets the email of the user.
 *
 * @type {
 *     type: SET_USERNAME,
 *     email: string
 * }
 */
export const SET_USERNAME = Symbol('SET_USERNAME');

/**
 * The type of (redux) action that sets the name of the user.
 *
 * @type {
 *     type: SET_PASSWORD,
 *     name: string
 * }
 */
export const SET_PASSWORD = Symbol('SET_PASSWORD');

/**
 * The type of (redux) action that sets the Server URL.
 *
 * @type {
 *     type: SET_SERVER_URL,
 *     serverURL: string
 * }
 */
export const SET_SERVER_URL = Symbol('SET_SERVER_URL');

/**
 * The type of (redux) action that sets the Server Timeout.
 *
 * @type {
 *     type: SET_SERVER_TIMEOUT,
 *     serverTimeout: number
 * }
 */
export const SET_SERVER_TIMEOUT = Symbol('SET_SERVER_TIMEOUT');

/**
 * The type of (redux) action that sets Start with Video Muted.
 *
 * @type {
 *     type: SET_VIDEO_MUTED,
 *     startWithVideoMuted: boolean
 * }
 */
export const SET_VIDEO_MUTED = Symbol('SET_VIDEO_MUTED');

export const SET_LOGGED_IN = Symbol('SET_LOGGED_IN');
export const SET_LOGIN_ERROR = Symbol('SET_LOGIN_ERROR');
export const SET_DISPLAY_ADVANCED_SETTINGS = Symbol('SET_DISPLAY_ADVANCED_SETTINGS');
export const SET_DEFAULT_LIVE_URL = Symbol('SET_DEFAULT_LIVE_URL');
