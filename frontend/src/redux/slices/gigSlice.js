import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const gigAPI = api.gigs



export const getGigs = createAsyncThunk(
  'gigs/getGigs',
  async (searchQuery = '', thunkAPI) => {
    try {
      // This appends ?search=yourquery to the API call
      const response = await axios.get(`/api/gigs?search=${searchQuery}`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const createGig = createAsyncThunk(
  'gigs/createGig',
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await gigAPI.create(gigData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gig')
    }
  }
)

export const getMyGigs = createAsyncThunk(
  'gigs/getMyGigs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gigAPI.getMyGigs()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your gigs')
    }
  }
)




const gigSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [],
    myGigs: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGigs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getGigs.fulfilled, (state, action) => {
        state.isLoading = false
        state.gigs = action.payload.data
      })
      .addCase(getGigs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.gigs.unshift(action.payload.data)
        state.isLoading = false
      })
      .addCase(getMyGigs.fulfilled, (state, action) => {
        state.myGigs = action.payload.data
        state.isLoading = false
      })
  }
})

export default gigSlice.reducer
