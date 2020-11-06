// @flow

import Droplist, { Item, Group } from '../../droplist';
import HelpIcon from '@atlaskit/icon/glyph/question-circle';
import type { Dispatch } from 'redux';
import { compose } from 'redux';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { openDialog, hideDialog } from '../../dialog';
import { SpotlightTarget } from '@atlaskit/onboarding';
import config from '../../config';
import { openExternalLink } from '../../utils';
import { version } from '../../../../package.json';
import { ContactModal } from './ContactModal';

type Props = {
  dispatch: Dispatch<*>;

  _username: string;

  _loggedIn: boolean;
}

type State = {

    /**
     * Whether the droplist is open or not.
     */
    droplistOpen: boolean
};

/**
 * Help button for Navigation Bar.
 */
class HelpButton extends Component<Props, State> {
    /**
     * Initializes a new {@code HelpButton} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            droplistOpen: false
        };

        this._onAboutClick = openExternalLink.bind(undefined, config.aboutURL);
        this._onSourceClick = openExternalLink.bind(undefined, config.sourceURL);
        this._onIconClick = this._onIconClick.bind(this);
        this._onFeedbackSubmit = this._onFeedbackSubmit.bind(this);
        this._onOpenChange = this._onOpenChange.bind(this);
        this._onPrivacyClick
            = openExternalLink.bind(undefined, config.privacyPolicyURL);
        this._onTermsClick
            = openExternalLink.bind(undefined, config.termsAndConditionsURL);
        this._onSendFeedbackClick
            =  this._onSendFeedbackClick.bind(this);
            //openExternalLink.bind(undefined, config.feedbackURL);
    }

    _onAboutClick: (*) => void;

    _onSourceClick: (*) => void;

    _onIconClick: (*) => void;

    /**
     * Toggles the droplist.
     *
     * @returns {void}
     */
    _onIconClick() {
        this.setState({
            droplistOpen: !this.state.droplistOpen
        });
    }

    _onOpenChange: (*) => void;

    /**
     * Closes droplist when clicked outside.
     *
     * @returns {void}
     */
    _onOpenChange() {
        this.setState({
            droplistOpen: false
        });
    }

    _onFeedbackSubmit: (*) => void;

    _onPrivacyClick: (*) => void;

    _onTermsClick: (*) => void;

    _onSendFeedbackClick: (*) => void;

    _onSendFeedbackClick() {
      const {  dispatch } = this.props;
      dispatch(openDialog(withTranslation()(connect(() => {return {onSubmit: this._onFeedbackSubmit}})(ContactModal))));
    };

    async _onFeedbackSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        const { dispatch } = this.props;
        const username = this.props._username
        const form = event.currentTarget.getAttribute('form');
        const formData = document.getElementById(form).querySelector('textarea').value;
        const test = await fetch('https://belouga.org/dashboard/submitVideochatHelpRequest', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({username: username, message: formData})
          })
        .then(response => {
          dispatch(hideDialog());
        })
    };

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t, _loggedIn } = this.props;
        let showFeedBack = _loggedIn ? <Item onActivate = { this._onSendFeedbackClick }>
            { t('sendFeedbackLink') }
        </Item> : null;
        return (
          <SpotlightTarget
              name = 'help-menu-button'>
            <Droplist
                isOpen = { this.state.droplistOpen }
                onClick = { this._onIconClick }
                onOpenChange = { this._onOpenChange }
                position = 'right bottom'
                trigger = { <HelpIcon /> }>
                <Group heading = { t('help') } >
                    <Item onActivate = { this._onTermsClick }>
                        { t('termsLink') }
                    </Item>
                    <Item onActivate = { this._onPrivacyClick }>
                        { t('privacyLink') }
                    </Item>
                    {showFeedBack}
                    <Item onActivate = { this._onAboutClick }>
                        { t('aboutLink') }
                    </Item>
                    <Item>
                        { t('versionLabel', { version }) }
                    </Item>
                </Group>
            </Droplist>
          </SpotlightTarget>
        );
    }
}

function _mapStateToProps(state: Object) {
    return {
        _username: state.settings.username,
        _loggedIn: state.settings.loggedIn
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(HelpButton);
