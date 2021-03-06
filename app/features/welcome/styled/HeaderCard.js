// @flow

import styled from 'styled-components';

export default styled.div`
    background: #1754A9;
    border-radius: 0.5em;
    color: white;
    display: grid;
    grid-template-rows: repeat(3, auto);
    grid-template-columns: 1fr auto;
    grid-auto-flow: column;
    font-size: 0.9em;
    margin: 2.5em auto 1.5em;
    text-align: center;
    padding: 1em;
    width: 250px;

    &:hover {
        cursor: pointer;
    }

    span {
      margin: auto;
    }
`;
