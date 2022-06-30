import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {WithUserProps} from '../App';
import client from '../api/client';
import {gql} from '@apollo/client';
import Input from '../components/input';
import Button from '../components/button';
import ResultsTable from '../components/table';

interface TradeData {
    'Destination State': string
    'ID Destination State': string
    'ID Origin': string
    'ID Year': number
    'Millions Of Dollars': number,
    'Origin': string,
    'Thousands Of Tons': number,
    'Year': string
}

interface FormattedTradeData {
    name: string,
    dollarTotal: number,
    tonsTotal: number,
    topStatesDollars: React.ReactElement,
    topStatesTons: React.ReactElement
}

// TODO
/*
- make a component to render a list of top states by tons or dollars
- pass custom component to table component
- write tests
    - clicking submit fires searchStates
    - if data is present it will render in the expected HTML elements
    - given a set of mock data it will calculate accurate totals
- add keys for maps
- create interface for formattedData
*/

enum SortByValue {
    TONS,
    DOLLARS
}

const TopStatesCell = (props: {statesData: TradeData[], sortBy: SortByValue}) => {
    return (
        <ul>
            {props.statesData.map((state: TradeData) => {
                switch (props.sortBy) {
                    case 0:
                        return (
                            <li>{state['Destination State']}: {state['Thousands Of Tons']} thousand</li>
                        );
                    case 1:
                    return (
                        <li>{state['Destination State']}: ${state['Millions Of Dollars']} million</li>
                    );
                }
                
            })}
        </ul>
    );
}

const queryTradeDataByState = async (stateId: String) => {
    const response = await fetch(`https://datausa.io/api/data?Origin%20State=${stateId}&measure=Millions%20Of%20Dollars,Thousands%20Of%20Tons&drilldowns=Destination%20State&year=latest`);
    return response.json();
}

const InterstateTrade = ({user}: WithUserProps) => {
    const searchStates = async (input: string) => {
        const statesList = await client.query({
            query: gql`
                query Query($name: String) {
                    states(name: $name) {
                        id
                    }
                }
            `,
            variables: {
                name: input
            }
        });
        let formattedData: FormattedTradeData[] = [];
        await statesList.data.states.forEach((state: {id: string}) => {
            queryTradeDataByState(state.id).then(data => {
                const dollarTotal = data.data.reduce((a: number, b: TradeData) => a + b['Millions Of Dollars'], 0);
                const tonsTotal = data.data.reduce((a: number, b: TradeData) => a + b['Thousands Of Tons'], 0);
                data.data.sort((a: TradeData, b: TradeData) => b['Millions Of Dollars'] - a['Millions Of Dollars']);
                const topStatesDollars = data.data.slice(0, 5);
                data.data.sort((a: TradeData, b: TradeData) => b['Thousands Of Tons'] - a['Thousands Of Tons']);
                const topStatesTons = data.data.slice(0, 5);
                formattedData.push({
                    name: data.data[0]['Origin'],
                    dollarTotal,
                    tonsTotal,
                    topStatesDollars: <TopStatesCell statesData={topStatesDollars} sortBy={1} />,
                    topStatesTons: <TopStatesCell statesData={topStatesTons} sortBy={0} />
                });
            });
        });
        return(formattedData);
    };
    const [searchText, setSearchText] = useState<string>('');
    const [resultsData, setResultsData] = useState<FormattedTradeData[]>([]);
    let navigate = useNavigate();
    useEffect(() => {
        if (!user?.id) {
            navigate('/login', {replace: true});
        }
    }, []);
    const handleSearch = async (input: string) => {
        const results = await searchStates(input);
        setResultsData(results);
    }

    const tableHeaders = [
        'Name',
        'Total Amount in $',
        'Total Amount in Tons',
        'Top 5 Destination States in $',
        'Top 5 Destination States in Tons'
    ];
    
    return (
        <div>
            <h1>Interstate Trade Summary</h1>
            <h2>State List</h2>
            <div style={{
                display: 'flex'
            }}>
                <div>
                    <label htmlFor="searchText">Search state by name</label>
                    <Input type="text" value={searchText} name="searchText" onChange={(e: React.FormEvent<HTMLInputElement>) => setSearchText((e.target as HTMLInputElement).value)} />
                </div>
                <Button onClick={() => setSearchText('')}>X</Button>
                <Button onClick={() => handleSearch(searchText)} >Submit</Button>
            </div>
            <ResultsTable columnHeaders={tableHeaders} data={resultsData} />
        </div>
    );
}

export default InterstateTrade
