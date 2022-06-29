import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {WithUserProps} from '../App';
import {State} from '../pages/StateSearch';
import client from '../api/client';
import {gql} from '@apollo/client';

const InterstateTrade = ({user}: WithUserProps) => {
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
    
    return (
        <div>
            
        </div>
    );
}

export default InterstateTrade
