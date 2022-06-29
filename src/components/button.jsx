import React from 'react';
import styled from 'styled-components';

const Button = styled.button.attrs(props => ({
	onClick: props.onClick
}))`
	border: black 2px solid;
	border-radius: 5px;
	display: block;
	margin: 16px 8px 0 8px;
	font-family: monospace;
	font-size: 1em;
`;

export default Button;