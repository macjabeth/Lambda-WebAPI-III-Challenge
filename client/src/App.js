import React, { Component } from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const url = 'http://penguin.linux.test:4000/api/users';

class App extends Component {
  state = { users: [] }

  async componentDidMount() {
    try {
      const { data } = await axios.get(url);
      this.setState({ users: data });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { users } = this.state;
    const { location } = this.props;
    return (
      <div className="app">
        <h1>Web API</h1>
        <h5>Welcome... Please continue by clicking the link below. It will show you list of users.</h5>
        {location.pathname === '/' ? (
          <Link to="/api/users">Display Users</Link>
        ) : (
          <Link to="/">Hide Users</Link>
        )}
        <Route path="/api/users" render={props => (
          <React.Fragment>
            <h3>Users</h3>
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  <NavLink to={`${props.match.url}/${user.id}`}>{user.name}</NavLink>
                </li>
              ))}
            </ul>
          </React.Fragment>
        )} />
        <Route path="/api/users/:id" component={Posts} />
      </div>
    );
  }
}

class Posts extends Component {
  state = { posts: [] }

  componentDidMount() {
    this.fetchPosts();
  }

  componentDidUpdate(prevProps) {
    const prevID = prevProps.match.params.id;
    const newID = this.props.match.params.id;
    if (newID !== prevID) this.fetchPosts();
  }

  fetchPosts = async () => {
    const { data: { posts } } = await axios.get(`${url}/${this.props.match.params.id}`);
    this.setState({ posts });
  }

  render() {
    const { posts } = this.state;
    return (
      <div>
        {posts.length ? (
          <React.Fragment>
            <h3>Posts</h3>
            {posts.map(post => (
              <blockquote key={post.id}>
                {post.text}
              </blockquote>
            ))}
          </React.Fragment>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

export default App;
