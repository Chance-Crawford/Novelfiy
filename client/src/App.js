
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { Route, Switch } from 'react-router-dom';
import { useEffect } from 'react';

import { setContext } from '@apollo/client/link/context';

import Header from './components/Header';
import Footer from './components/Footer';
import Intro from './pages/Intro';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import CreateNovel from './pages/CreateNovel';


// add a proxy to the client folder's package.json.
// "proxy": "http://localhost:3001", so server can run on different port
// then React.
// restart the server and client with npm run develop.
const httpLink =  createUploadLink({uri: "/graphql"});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    // set the header object to have all the other headers, and then add
    // an authorization header
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
// cahnge to auth link when setting context
const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
            <div className='main-contain w-100 text-over'>
              <Switch>
                <Route exact path="/" component={Intro} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/create" component={CreateNovel} />
                <Route component={PageNotFound} />
              </Switch>
            </div>
          </main>

          {/* right sidebar */}
          <section className='col-lg-2'>

          </section>
        </div>
        <Footer></Footer>
    </ApolloProvider>
  );
}

export default App;
