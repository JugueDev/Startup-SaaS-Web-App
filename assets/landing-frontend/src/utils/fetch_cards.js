import React, { useEffect, useState } from 'react';
import './card.css'


export default function CardList(props) {
    const [listItems, setListItems] = useState([])
    const apiUrl = props.apiUrl;

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

    const lista = listItems.map((item) =>
    <div className="items">

    <div className="title">
        Nombre: {item.name} <br/>
        Email: {item.email} <br/>
        Producto Favorito: {item.favorito}
    </div>
    <div className="id">
        ID de Usuario: {item.userId} <br/>
        Edad: {item.edad} <br/>
        Interaccion: {item.interaccion}
    </div>
    </div>


    );
    return (
        <div className="container">{lista}</div>
    );
  }
  
