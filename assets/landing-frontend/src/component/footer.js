import './footer.css'

function Footer (){
    return(
        <div className="footer">
            <ul className="footer-list-container">
                <li className="footer-column">
                    <h3>Company</h3>
                    <text>Aqui viene la segunda parte, aqui teoricamente se debe explicar el sentido de la compañia.</text>
                </li>
                <li className="footer-column">
                    <h3>Products</h3>
                    <h4>Product 2</h4>
                </li>
                <li className="footer-column">
                    <h3>Contact</h3>
                    <h4>Facebook</h4>
                    <h4>Twitter</h4>
                    <h4>Youtube</h4>
                </li>
            </ul>
        </div>
    )
}
  
  export default Footer;