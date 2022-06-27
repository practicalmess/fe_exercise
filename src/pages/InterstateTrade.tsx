import React, {useEffect} from 'react'
import {WithUserProps} from '../App';

const InterstateTrade = ({user}: WithUserProps) => {
    useEffect(() => {
        if (!user?.id) {
            window.location.href = '/login'
        }
    }, []);
    return <div>Implement me</div>
}

export default InterstateTrade
