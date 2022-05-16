
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { Route, Switch} from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import SingleNovel from './pages/SingleNovel'

// add a proxy to the client folder's package.json.
// "proxy": "http://localhost:3001", so server can run on different port
// then React.
// restart the server and client with npm run develop.
const httpLink = createHttpLink({
  uri: '/graphql',
});
// cahnge to auth link when setting context
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ApolloProvider client={client}>
        <Header></Header>
        <div className='row'>
          {/* left sidebar */}
          <section className='col-lg-2'>

          </section>

          {/* middle main content */}
          <main className='col-lg-8'>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/novel/:id" component={SingleNovel} />
            </Switch>
          </main>

          {/* right sidebar */}
          <section className='col-lg-2'>

          </section>
        </div>
    </ApolloProvider>
  );
}

export default App;
