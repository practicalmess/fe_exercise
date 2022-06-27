import React, {useEffect, useState} from 'react';
import client from '../api/client';
import {gql} from '@apollo/client';
import Input from '../components/input';
import Button from '../components/button';
import styled from 'styled-components';
import {WithUserProps} from '../App';

interface State {
    id: string,
    key: string,
    slug: string,
    name: string,
    link: string
}

const SearchBlock  = styled.div`
    display: flex;
`

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

    const clearSearch = () => {
        setSearchText('');
    };
    useEffect(() => {
        if (!user?.id) {
            window.location.href = '/login'
        }
    }, []);
    return (
        <div>
            <h1>State List</h1>
            <SearchBlock as="div">
            <div>
                <label htmlFor="searchText">Search state by name</label>
                <Input type="text" value={searchText} name="searchText" onChange={(e: React.FormEvent<HTMLInputElement>) => setSearchText((e.target as HTMLInputElement).value)} />
                </div>
                <Button onClick={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => searchStates(e, searchText)} >Submit</Button>
                <Button onClick={clearSearch} >X</Button>
            </SearchBlock>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Key</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Example API Endpoint</th>
                    </tr>
                </thead>
                <tbody>
                {resultsData?.map((state: State) => {
                    return(
                    <tr>
                        <td>{state.id}</td>
                        <td>{state.key}</td>
                        <td>{state.name}</td>
                        <td>{state.slug}</td>
                        <td><a href={state.link}>Population API</a></td>
                    </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    );
}

export default StateSearch
