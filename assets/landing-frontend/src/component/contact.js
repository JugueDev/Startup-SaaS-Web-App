import React from 'react';
import SampleChart from '../utils/fetch_chart';


function Contact (){

 return (
    <div>
            <h1>Contact screen:</h1>
            <SampleChart apiUrl="https://<api-id>.execute-api.<region>.amazonaws.com/prod/api/sales"/>
    </div>
)
}
  
export default Contact;