import { gql } from '@apollo/client';

// get all novels
// user is the user who made the novel
export const GET_NOVELS = gql`
query getNovels {
    novels {
      _id
      title
      description
      penName
      user {
        _id
        username
      }
      reviews {
        _id
      }
      chapterCount
      reviewCount
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
      }
      createdAt
      reviews {
        _id
        reviewText
        createdAt
        user{
            _id
        }
      }
      chapterCount
      reviewCount
    }
}
`