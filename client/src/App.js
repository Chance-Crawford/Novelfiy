
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { Route, Switch } from 'react-router-dom';

import { setContext } from '@apollo/client/link/context';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SingleNovel from './pages/SingleNovel';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PageNotFound from './pages/PageNotFound';
import CreateNovel from './pages/CreateNovel';
import CreateChapter from './pages/CreateChapter';

// add a proxy to the client folder's package.json.
// "proxy": "http://localhost:3001", so server can run on different port
// then React.
// restart the server and client with npm run develop.
const httpLink =  createUploadLink({uri: "http://localhost:3001/graphql"});
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
            <div className='main-contain w-100'>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/novel/:id" component={SingleNovel} />
                <Route exact path="/user/:username" component={Profile} />
                <Route exact path="/create" component={CreateNovel} />
                <Route exact path="/create-chapter/:novelId" component={CreateChapter} />
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
