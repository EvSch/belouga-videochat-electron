// @flow

import TextField from '@atlaskit/textfield';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import { SpotlightTarget } from '@atlaskit/onboarding';
import Panel from '@atlaskit/panel';
import Button from '@atlaskit/button';
import { Field, ErrorMessage } from '@atlaskit/form';

import React, { Component, Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { compose } from 'redux';

import { closeDrawer, DrawerContainer, Logo } from '../../navbar';
import { AkCustomDrawer } from '../../navigation';
import { Onboarding, advenaceSettingsSteps, startOnboarding } from '../../onboarding';
import { ButtonWrapper, Form, SettingsContainer, TogglesContainer } from '../styled';
import {
    setEmail, setName, setUsername, setPassword, setWindowAlwaysOnTop,
    setStartWithAudioMuted, setStartWithVideoMuted, login, loginError,
    showAdvanced, setLiveUrl
} from '../actions';

import SettingToggle from './SettingToggle';
import ServerURLField from './ServerURLField';
import ServerTimeoutField from './ServerTimeoutField';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * Is the drawer open or not.
     */
    isOpen: boolean;

    /**
     * Email of the user.
     */
    _email: string;

    /**
     * Whether onboarding is active or not.
     */
    _isOnboardingAdvancedSettings: boolean,

    /**
     * Name of the user.
     */
    _name: string;

    /**
     * Username of the user.
     */
    _username: string;

    /**
     * Password of the user.
     */
    _password: string;

    /**
     * If Logged in.
     */
    loggedIn: boolean;

    /**
     * Show Login Error
     */
    loginError: boolean;

    /**
     * Show SuperUser options
     */
    showAdvanced: boolean;

    /**
     * I18next translation function.
     */
    t: Function;
};

/**
 * Drawer that open when SettingsAction is clicked.
 */
class SettingsDrawer extends Component<Props, *> {
    /**
     * Initializes a new {@code SettingsDrawer} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this._onBackButton = this._onBackButton.bind(this);
        this._onEmailBlur = this._onEmailBlur.bind(this);
        this._onEmailFormSubmit = this._onEmailFormSubmit.bind(this);
        this._onNameBlur = this._onNameBlur.bind(this);
        this._onNameFormSubmit = this._onNameFormSubmit.bind(this);
        this._onUsernameBlur = this._onUsernameBlur.bind(this);
        this._onUsernameFormSubmit = this._onUsernameFormSubmit.bind(this);
        this._onPasswordBlur = this._onPasswordBlur.bind(this);
        this._onPasswordFormSubmit = this._onPasswordFormSubmit.bind(this);
        this._onLoginFormSubmit = this._onLoginFormSubmit.bind(this);
    }

    /**
     * Start Onboarding once component is mounted.
     *
     * NOTE: It automatically checks if the onboarding is shown or not.
     *
     * @param {Props} prevProps - Props before component updated.
     * @returns {void}
     */
    componentDidUpdate(prevProps: Props) {
        if (!prevProps.isOpen && this.props.isOpen) {
            if (prevProps.loginError) {
              this.props.dispatch(loginError(false));
            }

            // TODO - Find a better way for this.
            // Delay for 300ms to let drawer open.
            setTimeout(() => {
                this.props.dispatch(startOnboarding('settings-drawer'));
            }, 300);
        }
    }

    renderError() {
      if (this.props.loginError) {
        return (<ErrorMessage>Invalid username or password!</ErrorMessage>)
      }
    }

    renderAdvancedSettings() {
      const { t } = this.props;
      if (this.props.showAdvanced) {
        return (<Panel
            header = { t('settings.advancedSettings') }
            isDefaultExpanded = { this.props._isOnboardingAdvancedSettings }>
            <ServerURLField />
            <SpotlightTarget name = 'server-timeout'>
                <ServerTimeoutField />
            </SpotlightTarget>
            <TogglesContainer>
                <SpotlightTarget
                    name = 'always-on-top-window'>
                    <SettingToggle
                        label = { t('settings.alwaysOnTopWindow') }
                        settingChangeEvent = { setWindowAlwaysOnTop }
                        settingName = 'alwaysOnTopWindowEnabled' />
                </SpotlightTarget>
                <SpotlightTarget
                    name = 'invisible-mode'>
                    <SettingToggle
                        label = { t('settings.invisibleMode') }
                        settingName = 'invisibleMode' />
                </SpotlightTarget>
            </TogglesContainer>
        </Panel>)
      }
    }

    LogInRender() {
      const { t, loggedIn} = this.props;
      if (loggedIn) {
        return (
          <Form onSubmit = { this._onLoginFormSubmit }>
          You are logged in as {this.props._username}.
          <ButtonWrapper>
          <Button
            id = "loginButton"
            appearance = 'primary'
            type = 'submit'>
          Log Out
          </Button>
          </ButtonWrapper>
          </Form>);
      } else {
        return (
          <Form onSubmit = { this._onLoginFormSubmit }>
          <Field id="username"
          name="username"
          label = { t('settings.username') }
        /*onBlur = { this._onUsernameBlur } */
          type = 'text'
          value = { this.props._username }>
           {({ fieldProps, error, valid }) => <TextField {...fieldProps} />}
          </Field>
          <Field id="password"
          name="password"
          label = { t('settings.password') }
        /* onBlur = { this._onPasswordBlur } */
          value = { this.props._password }>
            {({ fieldProps, error, valid }) => <TextField {...fieldProps} type = 'password'/>}
          </Field>
        { this.renderError() }
        <ButtonWrapper>
        <Button
          id = "loginButton"
          appearance = 'primary'
          type = 'submit'>
        Log In
        </Button>
      </ButtonWrapper>
      </Form>);
      }
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <AkCustomDrawer
                backIcon = { <ArrowLeft label = { t('settings.back') } /> }
                isOpen = { this.props.isOpen }
                onBackButton = { this._onBackButton }
                primaryIcon = { <Logo /> }
                width = { 'narrow' } >
                <DrawerContainer>
                    <SettingsContainer>
                        <SpotlightTarget
                            name = 'name-setting'>
                        <div>
                          {this.LogInRender()}
                        </div>
                      </SpotlightTarget>
                      <SpotlightTarget
                          name = 'start-muted-toggles'>
                        <TogglesContainer>
                                <SettingToggle
                                    label = { t('settings.startWithAudioMuted') }
                                    settingChangeEvent = { setStartWithAudioMuted }
                                    settingName = 'startWithAudioMuted' />
                                <SettingToggle
                                    label = { t('settings.startWithVideoMuted') }
                                    settingChangeEvent = { setStartWithVideoMuted }
                                    settingName = 'startWithVideoMuted' />
                        </TogglesContainer>
                        </SpotlightTarget>
                        { this.renderAdvancedSettings() }
                        <Onboarding section = 'settings-drawer' />
                    </SettingsContainer>
                </DrawerContainer>
            </AkCustomDrawer>
        );
    }


    _onBackButton: (*) => void;

    /**
     * Closes the drawer when back button is clicked.
     *
     * @returns {void}
     */
    _onBackButton() {
        this.props.dispatch(closeDrawer());
    }

    _onEmailBlur: (*) => void;

    /**
     * Updates email in (redux) state when email is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onEmailBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setEmail(event.currentTarget.value));
    }

    _onEmailFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates email.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onEmailFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setEmail(event.currentTarget.elements[0].value));
    }

    _onUsernameBlur: (*) => void;

    /**
     * Updates username in (redux) state when username is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onUsernameBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setUsername(event.currentTarget.value));
    }

    _onLoginFormSubmit: (*) => void;

    async _onLoginFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        if (this.props.loginError) {
          this.props.dispatch(loginError(false));
        }
        if (this.props.loggedIn) {
          this.props.dispatch(showAdvanced(false));
          this.props.dispatch(setUsername(""));
          this.props.dispatch(setPassword(""));
          this.props.dispatch(setLiveUrl(""));
          loginButton.textContent = "Log In";
        } else {
          const username = event.currentTarget.querySelector("#username").value;
          const password = event.currentTarget.querySelector("#password").value;
          const loginButton = event.currentTarget.querySelector("#loginButton");
          loginButton.textContent = "Logging In...";
          loginButton.disabled = true;
          let valid, isSuper, liveUrl;
          const test = await fetch('https://belouga.org/users/validate_login/', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json'
             },
             body: JSON.stringify({username: username, password: password})
            })
          .then(response => response.json())
          .then(data => {console.log(data); valid = data.success, isSuper = data.superUserAccess, liveUrl = data.live_url});
          loginButton.disabled = false;
          if (!valid) {
            loginButton.textContent = "Log In";
            this.props.dispatch(loginError(true));
            return;
          }
          if (liveUrl) {
            this.props.dispatch(setLiveUrl(liveUrl));
          }
          this.props.dispatch(showAdvanced(isSuper));
          loginButton.textContent = "Log Out";
          this.props.dispatch(setUsername(username));
          this.props.dispatch(setPassword(password));
        }

        this.props.dispatch(login(!this.props.loggedIn));
    }

    _onUsernameFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates username.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onUsernameFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setUsername(event.currentTarget.elements[0].value));
    }

    _onPasswordBlur: (*) => void;

    /**
     * Updates username in (redux) state when username is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onPasswordBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setPassword(event.currentTarget.value));
    }

    _onPasswordFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates username.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onPasswordFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setPassword(event.currentTarget.elements[0].value));
    }

    _onNameBlur: (*) => void;

    /**
     * Updates name in (redux) state when name is updated.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onNameBlur(event: SyntheticInputEvent<HTMLInputElement>) {
        this.props.dispatch(setName(event.currentTarget.value));
    }

    _onNameFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and updates name.
     *
     * @param {SyntheticEvent<HTMLFormElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onNameFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        // $FlowFixMe
        this.props.dispatch(setName(event.currentTarget.elements[0].value));
    }
}

/**
 * Maps (parts of) the redux state to the React props.
 *
 * @param {Object} state - The redux state.
 * @returns {Props}
 */
function _mapStateToProps(state: Object) {
    //console.log(advenaceSettingsSteps.every(i => {console.log(i); console.log(state.onboarding.onboardingShown); return state.onboarding.onboardingShown.includes(i)}))
    //_isOnboardingAdvancedSettings: !advenaceSettingsSteps.every(i => state.onboarding.onboardingShown.includes(i)),
    return {
        _email: state.settings.email,
        _isOnboardingAdvancedSettings: false,
        _name: state.settings.name,
        _username: state.settings.username,
        _password: state.settings.password,
        loggedIn: state.settings.loggedIn,
        loginError: state.settings.loginError,
        showAdvanced: state.settings.showAdvanced
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(SettingsDrawer);
