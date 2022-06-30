import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {WithUserProps} from '../App';
import client from '../api/client';
import {gql} from '@apollo/client';
import Input from '../components/input';
import Button from '../components/button';
import ResultsTable from '../components/table';

const queryTradeDataByState = async (stateId: String) => {
    const response = await fetch(`https://datausa.io/api/data?Origin%20State=${stateId}&measure=Millions%20Of%20Dollars,Thousands%20Of%20Tons&drilldowns=Destination%20State&year=latest`);
    return response.json();
}

const InterstateTrade = ({user}: WithUserProps) => {
    const searchStates = async (e:React.MouseEvent<HTMLButtonElement>, input: string) => {
        e.preventDefault();
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
        let formattedData = [];
        statesList.data.states.forEach((state) => {
            queryTradeDataByState(state.id).then(data => {
                const dollarTotal = data.data.reduce((a, b) => a + b['Millions Of Dollars'], 0);
                const tonsTotal = data.data.reduce((a, b) => a + b['Thousands Of Tons'], 0);
                data.data.sort((a, b) => b['Millions Of Dollars'] - a['Millions Of Dollars']);
                const topStatesDollars = data.data.slice(0, 5);
                data.data.sort((a, b) => b['Thousands Of Tons'] - a['Thousands Of Tons']);
                const topStatesTons = data.data.slice(0, 5);
                formattedData.push({
                    name: data.data,
                    dollarTotal,
                    tonsTotal,
                    topStatesDollars,
                    topStatesTons
                })
            });
            
        });
    };
    const [searchText, setSearchText] = useState<string>('');
    const [resultsData, setResultsData] = useState([]);
    let navigate = useNavigate();
    useEffect(() => {
        if (!user?.id) {
            navigate('/login', {replace: true});
        }
    }, []);

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
                <Button onClick={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => searchStates(e, searchText)} >Submit</Button>
            </div>
            <ResultsTable columnHeaders={tableHeaders} data={resultsData} />
        </div>
    );
}

export default InterstateTrade
