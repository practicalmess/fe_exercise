import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import client from '../api/client';
import {gql} from '@apollo/client';
import Input from '../components/input';
import Button from '../components/button';
import ResultsTable from '../components/table';
import {WithUserProps} from '../App';

interface State {
    id: string,
    key: string,
    slug: string,
    name: string,
    link: string
}


const StateSearch = ({user}: WithUserProps) => {
    const [resultsData, setResultsData] = useState<State[] | null>([]);
    const searchStates = async (e:React.MouseEvent<HTMLButtonElement>, input: string) => {
        e.preventDefault();
        const data = await client.query({
            query: gql`
                query Query($name: String) {
                    states(name: $name) {
                        id
                        key
                        slug
                        name
                    }
                }
            `,
            variables: {
                name: input
            }
        });
        let formattedData: State[] = [];
        data.data.states.forEach((state: State) => {
            formattedData.push({
                id: state.id,
                key: state.key,
                slug: state.slug,
                name: state.name,
                link: `https://datausa.io/api/data?Geography=${state.key}&Nativity=2&measure=Total%20Population,Total%20Population%20MOE%20Appx&drilldowns=Birthplace&properties=Country%20Code`
            })
        });
        setResultsData(formattedData);
    };
    const [searchText, setSearchText] = useState<string>('');
    let navigate = useNavigate();
    useEffect(() => {
        if (!user?.id) {
            navigate('/login', {replace: true});
        }
    }, []);

    const tableHeaders = [
        'ID',
        'Key',
        'Name',
        'Slug',
        'Example API Endpoint'
    ];
    return (
        <div>
            <h1>Search States</h1>
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

export default StateSearch
