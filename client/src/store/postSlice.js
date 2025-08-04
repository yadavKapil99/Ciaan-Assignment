import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: null,
  likedPosts: [],
  commentPosts: {},
  allPosts: null
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload; 
    },
    setAllPosts: (state, action) => {
      state.allPosts = action.payload;  
    },
    setLikedPosts: (state, action) => {
      state.likedPosts = action.payload; 
    },
    setCommentPosts: (state, action) => { 
      state.commentPosts = action.payload;
    }
  },
});

export const { setPosts, setLikedPosts, setCommentPosts, setAllPosts } = postSlice.actions;
export default postSlice.reducer;
