import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function  (props) {
    const apiUrl = props.apiUrl;
    const [listItems, setListItems] = useState([])

      useEffect(() => {
        async function fetchData() {
            fetch(apiUrl)
            .then(response => response.json())
            .then((responseJson) => {
              setListItems(responseJson)
            })
            .catch((error) => {
              console.log(error);
            });          
        }
        fetchData();
    }, [])

    return (
      <div class="container" style={{ display: "flex", "justify-content": "center"}}>
        <div style={{ height: 400, width: '70%'}}>
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={listItems}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="first_name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="id" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
        </div>    
      </div>)
      ;
  }
