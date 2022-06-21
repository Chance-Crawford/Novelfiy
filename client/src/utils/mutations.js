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

export const TOGGLE_ADD_TO_FOLLOWING = gql`
mutation addToFollowing($userId: ID!) {
  addToFollowing(userId: $userId) {
    username
    _id
    following{
      _id
    }
    followingCount
  }
}
`

export const ADD_NOVEL = gql`
mutation addNovel($title: String!, $description: String!, $penName: String) {
  addNovel(title: $title, description: $description, penName: $penName) {
    _id
    title
    imageLink
    user {
      _id
    }
  }
}
`

export const ADD_CHAPTER = gql`
mutation addChapter($chapterTitle: String!, $chapterText: String!, $novelId: ID!) {
  addChapter(chapterTitle: $chapterTitle, chapterText: $chapterText, novelId: $novelId) {
    _id
    chapterTitle
    chapterText
    novelId {
      _id
    }
  }
}
`

export const SINGLE_UPLOAD = gql`
mutation singleUpload($file: Upload!) {
  singleUpload(file: $file) {
    filename
    mimetype
    encoding
  }
}
`

export const REMOVE_NOVEL = gql`
  mutation removeNovel($novelId: ID!) {
    removeNovel(novelId: $novelId) {
      _id
      username
      novels{
        _id
        title
      }
    }
  }
`;

export const UPDATE_NOVEL = gql`
mutation updateNovel($novelId: ID!, $title: String!, $description: String!, $penName: String, $imageLink: String) {
  updateNovel(novelId: $novelId, title: $title, description: $description, penName: $penName, imageLink: $imageLink) {
    _id
    title
    imageLink
    user {
      _id
    }
  }
}
`

export const UPDATE_CHAPTER = gql`
mutation updateChapter($chapterTitle: String!, $chapterText: String!, $chapterId: ID!) {
  updateChapter(chapterTitle: $chapterTitle, chapterText: $chapterText, chapterId: $chapterId) {
    _id
    chapterTitle
    chapterText
    novelId {
      _id
    }
  }
}
`

export const REMOVE_CHAPTER = gql`
  mutation removeChapter($chapterId: ID!, $novelId: ID!) {
    removeChapter(chapterId: $chapterId, novelId: $novelId) {
      _id
      title
      chapters{
        _id
        chapterTitle
      }
    }
  }
`;