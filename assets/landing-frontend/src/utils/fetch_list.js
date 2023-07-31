import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

/*
    Función que retorna una lista compuesta por los items 
    que se obtienen de la API.
    
    - Entradas:
        apiUrl: URL de la API a llamar

    - Salidas: 
        Tabla construida con Datagrid

*/

const columns = [
    { field: 'commentId', headerName: 'ID', width: 300 },
    { field: 'platform', headerName: 'Platform', width: 130 },
    { field: 'userName', headerName: 'Name', width: 130 },
]

export default function ItemsList(props) {
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
        <DataGrid
          rows={listItems}
          columns={columns}
          getRowId={(row) =>  row.commentId}
          pageSizeOptions={[5, 10]}
          />
        </div>    
      </div>);
  }