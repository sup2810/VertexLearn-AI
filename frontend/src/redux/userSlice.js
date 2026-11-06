import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        loading: true   // BUG FIX: pehle true — API complete hone par false hoga
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
            state.loading = false   // data aa gaya ya null — dono cases mein loading done
        },
        setUserLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setUserData, setUserLoading } = userSlice.actions
export default userSlice.reducer
