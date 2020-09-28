// @flow

import { combineReducers } from 'redux';

import { reducer as navbarReducer } from '../navbar';
import { reducer as onboardingReducer } from '../onboarding';
import { reducer as recentListReducer } from '../recent-list';
import { reducer as routerReducer } from '../router';
import { reducer as settingsReducer } from '../settings';
import { reducer as dialogReducer } from '../dialog';

export default combineReducers({
    dialog: dialogReducer,
    navbar: navbarReducer,
    onboarding: onboardingReducer,
    recentList: recentListReducer,
    router: routerReducer,
    settings: settingsReducer
});
