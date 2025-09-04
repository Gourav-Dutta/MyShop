import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";



const initialState = {
    token :(localStorage.getItem("ACCESS_TOKEN") || null),
    user : JSON.parse( localStorage.getItem('USER') || null)
}
const authSlice = createSlice(
    {
        name:"Authentication",
        initialState,
        reducers : {
            login : (state , action) => {
                state.token = action.payload.token;
                state.user = action.payload.user;
                localStorage.setItem('ACCESS_TOKEN', action.payload.token);
                localStorage.setItem('USER', JSON.stringify(action.payload.user));
                // console.log(action.payload);
                // return (action.payload);
            },

            logout : (state , action) => 
            {
                state.token = null;
                state.user = null;
                localStorage.removeItem('ACCESS_TOKEN');
                localStorage.removeItem('USER');
            },
        }
    }
) ;



export const getAuthSelector = createSelector(
    (state) => state.auth,
    (state) => state
)

export const {login, logout, setUser, deleteUser} = authSlice.actions;
export default authSlice.reducer;
