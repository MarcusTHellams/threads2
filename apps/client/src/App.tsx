import { useQuery, gql } from '@apollo/client';

function App() {
  useQuery(gql`
    query HELLO_WORLD {
      helloWorld
    }
  `);
  return (
    <>
      <h1>Hello World</h1>
    </>
  );
}

export default App;
