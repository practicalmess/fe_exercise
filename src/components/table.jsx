import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
	border: 2px solid grey;
	border-radius: 5px;
	padding: 8px;
	margin: 24px 0;
`

const ResultsTable = (props) => {
	return (
		<Table>
		    <thead style={{backgroundColor: '#c7d5ed'}}>
		        <tr>
		        {props.columnHeaders.map((header) => {
		        	return (
		        		<th>{header}</th>
		        	)
		        })}
		        </tr>
		    </thead>
		    <tbody>
		    {props.data?.map((row) => {
		        return(
			        <tr>
			        	{Object.keys(row).map(key => {
			        		if (key == 'link') {
			        			return <td><a href={row[key]}>Population API</a></td>
			        		}
			        		return (
			        			<td>{row[key]}</td>
			        		)
			        	})}
			        	{props.customColumn &&
			        		<td>{props.customColumn}</td>
			        	}
			        </tr>
		        )
		    })}
		    </tbody>
		</Table>
	)
}

export default ResultsTable;