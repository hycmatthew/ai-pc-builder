import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import rawDataReducer from './rawDataReducer'
import aiLogicReducer from '../module/aiComponentList/store/aiLogicReducer'

const store = configureStore({
  reducer: {
    rawData: rawDataReducer,
    aiLogic: aiLogicReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export default store
