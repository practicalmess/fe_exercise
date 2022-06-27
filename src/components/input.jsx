import React from 'react';
import styled from 'styled-components';

const Input = styled.input.attrs(props => ({
	type: props.type,
	name: props.name,
	onChange: props.onChange
}))`
	border: #bdbdbd 2px solid;
	border-radius: 5px;
	display: block;
	padding: 8px;
	font-size: 1em;
`;

export default Input;