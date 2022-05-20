import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// sign up user
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// add a review
export const ADD_REVIEW = gql`
  mutation addReview($reviewText: String!, $rating: Int!, $novel: ID!) {
    addReview(reviewText: $reviewText, rating: $rating, novel: $novel) {
        _id
        reviewText
        rating
        createdAt
        user {
          _id
        }
        novel {
          _id
        }
    }
  }
`

export const TOGGLE_ADD_TO_FAVORITES = gql`
mutation addFavNovel($novelId: ID!) {
  addFavNovel(novelId: $novelId) {
    username
    _id
    favoriteNovels{
      _id
    }
  }
}
`