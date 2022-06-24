import { gql } from '@apollo/client';

// get all novels
// user is the user who made the novel
export const GET_NOVELS = gql`
query getNovels($user: ID) {
    novels(user: $user) {
      _id
      title
      description
      penName
      imageLink
      chapters {
        _id
        chapterTitle
      }
      favorites{
        _id
      }
      user {
        _id
        username
      }
      reviews {
        _id
      }
      chapterCount
      reviewCount
      favoritesCount
    }
}
`

// info on one novel
export const GET_NOVEL = gql`
query getNovel($_id: ID!) {
    novel(_id: $_id) {
      _id
      title
      description
      penName
      user {
        _id
        username
        email
      }
      imageLink
      chapters {
        _id
        chapterTitle
      }
      favorites{
        _id
      }
      createdAt
      reviews {
        _id
        reviewText
        rating
        createdAt
        user{
            _id
            username
        }
      }
      chapterCount
      reviewCount
      favoritesCount
    }
}
`

export const GET_CHAPTER = gql`
query getChapter($_id: ID!) {
    chapter(_id: $_id) {
      _id
      chapterTitle
      chapterText
      createdAt
      comments{
        commentText
        createdAt
        user{
          _id
          username
        }
      }
      novelId{
        _id
        title
        penName
        user {
          _id
          username
        }
        imageLink
        chapters {
          _id
          chapterTitle
        }
        chapterCount
      }
    }
}
`

export const GET_ME = gql`
query me{
  me{
    _id
    username
    email
    createdAt
    favoriteNovels {
      _id
      title
      description
      imageLink
      penName
      user {
        _id
        username
      }
      favorites {
        _id
      }
      createdAt
      reviews {
        _id
        rating
      }
      chapterCount
      reviewCount
    }
    following{
      _id
    }
    novels {
      _id
      title
      imageLink
      description
      penName
      reviews {
        _id
      }
      reviewCount
      chapterCount
    }
    givenReviews {
      _id
      reviewText
      createdAt
    }
    followerCount
    followingCount
    givenReviewCount
  }
}
`

export const GET_ME_SMALL = gql`
{
  me{
    _id
    username
  }
}
`

export const GET_USER = gql`
query getUser($username: String!) {
  user(username: $username) {
    _id
    username
    email
    createdAt
    favoriteNovels {
      _id
      title
      description
      chapters{
        _id
      }
      imageLink
      penName
      user {
        _id
        username
      }
      favorites {
        _id
      }
      createdAt
      reviews {
        _id
        rating
      }
      chapterCount
      reviewCount
      favoritesCount
    }
    following{
      _id
      username
    }
    followers{
      _id
      username
    }
    novels {
      _id
      title
      description
      penName
      imageLink
      chapters{
        _id
      }
      reviews {
        _id
      }
      user{
        username
        _id

      }
      reviewCount
      chapterCount
      favoritesCount
    }
    givenReviews {
      _id
      reviewText
      createdAt
      rating
      novel{
        title
        imageLink
        _id
      }
      user{
        _id
        username
      }
    }
    followerCount
    followingCount
    givenReviewCount
  }
}
`