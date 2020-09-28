// @flow
import { OnboardingModal, OnboardingSpotlight } from './components';
import { openDrawer, closeDrawer } from '../navbar';
import { startOnboarding } from './';
import { SettingsDrawer } from '../settings';

export const advenaceSettingsSteps = [
    'server-timeout',
    'always-on-top-window',
    'invisible-mode'
];

export const onboardingSteps = {
    'welcome-page': [
        'onboarding-modal',
        'conference-url',
        'settings-drawer-button'
    ],
    'settings-drawer': [
        'name-setting',
        'start-muted-toggles',
        //...advenaceSettingsSteps,
    ],
    'welcome-page2': [
        'help-menu-button'
    ],
};

export const onboardingComponents = {
    'onboarding-modal': { type: OnboardingModal },
    'conference-url': {
        type: OnboardingSpotlight,
        dialogPlacement: 'bottom center',
        target: 'conference-url',
        text: 'onboarding.conferenceUrl'
    },
    'settings-drawer-button': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'settings-drawer-button',
        text: 'onboarding.settingsDrawerButton',
        onNext: (props: OnboardingSpotlight.props) => props.dispatch(openDrawer(SettingsDrawer))
    },
    'name-setting': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'name-setting',
        text: 'onboarding.nameSetting'
    },
    'start-muted-toggles': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'start-muted-toggles',
        text: 'onboarding.startMutedToggles',
        onNext: (props: OnboardingSpotlight.props) => setTimeout(() => {
            props.dispatch(closeDrawer());
            props.dispatch(startOnboarding('welcome-page2'))
        }, 300)
    },
    'server-timeout': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'server-timeout',
        text: 'onboarding.serverTimeout'
    },
    'always-on-top-window': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'always-on-top-window',
        text: 'onboarding.alwaysOnTop',
    },
    'invisible-mode': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'invisible-mode',
        text: 'onboarding.invisibleMode',
        onNext: (props: OnboardingSpotlight.props) => setTimeout(() => {
            props.dispatch(closeDrawer());
        }, 300)
    },
    'help-menu-button': {
        type: OnboardingSpotlight,
        dialogPlacement: 'top right',
        target: 'help-menu-button',
        text: 'onboarding.helpButton',
    }
};
