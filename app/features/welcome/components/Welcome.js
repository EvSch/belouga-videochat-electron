// @flow

import Button from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import { SpotlightTarget } from '@atlaskit/onboarding';
import Page from '@atlaskit/page';
import { AtlasKitThemeProvider } from '@atlaskit/theme';

import { generateRoomWithoutSeparator } from 'js-utils/random';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Navbar } from '../../navbar';
import { Onboarding, startOnboarding } from '../../onboarding';
import { RecentList } from '../../recent-list';
import { createConferenceObjectFromURL } from '../../utils';
import { DialogContainer } from '../../dialog';
import { ErrorMessage } from '@atlaskit/form';
import Icon from '@atlaskit/icon';
import HomeIcon from '../../../images/home.svg';
import { Body, FieldWrapper, Form, Header, Label, Wrapper, HeaderWrapper, HeaderCard, Spacer} from '../styled';
import { ConferenceTitle, TruncatedText } from '../../recent-list';

type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;

    /**
     * React Router location object.
     */
    location: Object;

    homeRoom: ?String;

    /**
     * I18next translate function.
     */
     t: Function;
};

type State = {

    /**
     * Timer for animating the room name geneeration.
     */
    animateTimeoutId: ?TimeoutID,

    /**
     * Generated room name.
     */
    generatedRoomname: string,

    /**
     * Current room name placeholder.
     */
    roomPlaceholder: string,

    /**
     * Timer for re-generating a new room name.
     */
    updateTimeoutId: ?TimeoutID,

    /**
     * URL of the room to join.
     * If this is not a url it will be treated as room name for default domain.
     */
    url: string;
};

/**
 * Welcome Component.
 */
class Welcome extends Component<Props, State> {
    /**
     * Initializes a new {@code Welcome} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        // Initialize url value in state if passed using location state object.
        let url = '';

        // Check and parse url if exists in location state.
        if (props.location.state) {
            const { room, serverURL } = props.location.state;

            if (room && serverURL) {
                url = `${room}`;
            }
        }

        this.state = {
            animateTimeoutId: undefined,
            generatedRoomname: '',
            roomPlaceholder: '',
            updateTimeoutId: undefined,
            url
        };

        // Bind event handlers.
        this._animateRoomnameChanging = this._animateRoomnameChanging.bind(this);
        this._onURLChange = this._onURLChange.bind(this);
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onJoin = this._onJoin.bind(this);
        this._updateRoomname = this._updateRoomname.bind(this);
        this._onHomeClick = this._onHomeClick.bind(this);
    }

    componentDidUpdate(prevProps: Props) {
        console.log("updating");
    }


    /**
     * Start Onboarding once component is mounted.
     * Start generating randdom room names.
     *
     * NOTE: It autonatically checks if the onboarding is shown or not.
     *
     * @returns {void}
     */
    componentDidMount() {
        this.props.dispatch(startOnboarding('welcome-page'));

        //this._updateRoomname();
    }

    /**
     * Stop all timers when unmounting.
     *
     * @returns {voidd}
     */
    componentWillUnmount() {
        this._clearTimeouts();
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Page navigation = { <Navbar /> }>
                <AtlasKitThemeProvider mode = 'light'>
                    <Wrapper>
                        { this._renderHeader() }
                        { this._renderBody() }
                        { this._renderDialogContainer() }
                        <Onboarding section = 'welcome-page' />
                        <Onboarding section = 'welcome-page2' />
                    </Wrapper>
                </AtlasKitThemeProvider>
            </Page>
        );
    }

    renderHomeUrlButton() {
      if (this.props.homeRoom) {
        return (
          <HeaderCard
            onClick = { this._onHomeClick }>
              <Icon
                glyph = { HomeIcon }
              size = 'large' />
              <ConferenceTitle>
                My Home Room
              </ConferenceTitle>
              <TruncatedText>
              { this.props.homeRoom }
              </TruncatedText>
          </HeaderCard>
      );
      } else {
        return (<Spacer />)
      }
    }

    renderORLabel() {
      if (this.props.homeRoom) {
        return (<Label>
        OR
        </Label>)
      }
    }

    /**
     * Renders the platform specific dialog container.
     *
     * @returns {React$Element}
     */
    _renderDialogContainer: () => React$Element<*>;

    _renderDialogContainer() {
        return (
            <AtlasKitThemeProvider mode = 'light'>
                <DialogContainer />
            </AtlasKitThemeProvider>
        );
    }

    _animateRoomnameChanging: (string) => void;

    /**
     * Animates the changing of the room name.
     *
     * @param {string} word - The part of room name that should be added to
     * placeholder.
     * @private
     * @returns {void}
     */
    _animateRoomnameChanging(word: string) {
        let animateTimeoutId;
        const roomPlaceholder = this.state.roomPlaceholder + word.substr(0, 1);

        if (word.length > 1) {
            animateTimeoutId
                = setTimeout(
                    () => {
                        this._animateRoomnameChanging(
                            word.substring(1, word.length));
                    },
                    70);
        }
        this.setState({
            animateTimeoutId,
            roomPlaceholder
        });
    }

    /**
     * Method that clears timeouts for animations and updates of room name.
     *
     * @private
     * @returns {void}
     */
    _clearTimeouts() {
        clearTimeout(this.state.animateTimeoutId);
        clearTimeout(this.state.updateTimeoutId);
    }

    _onFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and delegates the join logic.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onFormSubmit(event: Event) {
        event.preventDefault();
        this._onJoin();
    }

    _onHomeClick: (*) => void;

    /**
     * Goes to assigned home room, if set.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onHomeClick(event: Event) {
        event.preventDefault();
        const conference = createConferenceObjectFromURL(this.props.homeRoom);

        // Don't navigate if conference couldn't be created
        if (!conference) {
            return;
        }
        console.log("clicked");
        this.props.dispatch(push('/conference', conference));
    }

    _onJoin: (*) => void;

    /**
     * Redirect and join conference.
     *
     * @returns {void}
     */
    _onJoin() {
        const inputURL = this.state.url || this.state.generatedRoomname;
        const conference = createConferenceObjectFromURL(inputURL);

        // Don't navigate if conference couldn't be created
        if (!conference) {
            return;
        }

        this.props.dispatch(push('/conference', conference));
    }

    _onURLChange: (*) => void;

    /**
     * Keeps URL input value and URL in state in sync.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onURLChange(event: SyntheticInputEvent<HTMLInputElement>) {
        this.setState({
            url: event.currentTarget.value
        });
    }

    /**
     * Renders the body for the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderBody() {
        return (
            <Body>
                <RecentList />
            </Body>
        );
    }

    _renderError(msg) {
      if (msg !== undefined && msg !== '') {
        return (<ErrorMessage>{msg}</ErrorMessage>)
      }
    }

    /**
     * Renders the header for the welcome page.
     *
     * @returns {ReactElement}
     */
    _renderHeader() {
        const locationState = this.props.location.state;
        const locationError = locationState && locationState.error;
        const { t } = this.props;

        return (
            <HeaderWrapper>
            { this.renderHomeUrlButton() }
            { this.renderORLabel() }
            <Header>
                <SpotlightTarget name = 'conference-url'>
                    <Form onSubmit = { this._onFormSubmit }>
                        <Label>{ t('enterConferenceNameOrUrl') } </Label>
                        <FieldWrapper>
                            <TextField
                                autoFocus = { true }
                                isInvalid = { locationError }
                                onChange = { this._onURLChange }
                                placeholder = { this.state.roomPlaceholder }
                                type = 'text'
                                value = { this.state.url } />
                            <Button
                                appearance = 'primary'
                                onClick = { this._onJoin }
                                type = 'button'>
                                { t('go') }
                            </Button>
                        </FieldWrapper>
                        { locationState && this._renderError(locationState.errorDesc) }
                    </Form>
                </SpotlightTarget>
            </Header>
            </HeaderWrapper>
        );
    }

    _updateRoomname: () => void;

    /**
     * Triggers the generation of a new room name and initiates an animation of
     * its changing.
     *
     * @protected
     * @returns {void}
     */
    _updateRoomname() {
        const generatedRoomname = generateRoomWithoutSeparator();
        const roomPlaceholder = '';
        const updateTimeoutId = setTimeout(this._updateRoomname, 10000);

        this._clearTimeouts();
        this.setState(
            {
                generatedRoomname,
                roomPlaceholder,
                updateTimeoutId
            },
            () => this._animateRoomnameChanging(generatedRoomname));
    }
}

function _mapStateToProps(state: Object) {
    return {
        homeRoom: state.settings.liveURL
    };
}

export default compose(connect(_mapStateToProps), withTranslation())(Welcome);
