import CardList from '../utils/fetch_cards';
  
function Home (){
    return (
        <div>
            <h1>Others screen!</h1>
            Here you can add your code:
            <CardList  apiUrl="https://<api-id>.execute-api.<region>.amazonaws.com/prod/api/users" />
        </div>
        )
}
  
export default Home;