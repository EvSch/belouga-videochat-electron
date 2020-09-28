// @flow

import React from 'react';

import { Dialog } from '../../dialog';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import TextArea from '@atlaskit/textarea';
import { TextWrapper } from '../styled';

type Props = {

    /**
     * Invoked to obtain translated strings.
     */
    t: Function,

    /**
     * The redux {@code dispatch} function.
     */
    onSubmit: Function
};

/**
 * Component that renders the confirm set compatibility mode dialog.
 *
 * @returns {React$Element<any>}
 */
export function ContactModal({t, onSubmit}: Props) {
    return (
        <Dialog
          okKey = 'dialog.send'
          disableEnter = { true }
          onSubmit = { onSubmit }
          titleKey = 'dialog.feedbackTitle'
          width = 'small'>
          <TextWrapper>
          { t('dialog.feedbackBody') }
          </TextWrapper>
          <TextArea />
        </Dialog>
    );
}

export default withTranslation()(ContactModal);
