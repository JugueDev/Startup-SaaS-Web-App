import React from 'react';
import ItemsList from '../utils/fetch_list';


function About () {
    return (
    <div>
        <h1>About screen!</h1>
        Here you can add your code:
        <ItemsList apiUrl="https://<api-id>.execute-api.<region>.amazonaws.com/prod/api/comments"/>
    </div>
    )
}
export default About;