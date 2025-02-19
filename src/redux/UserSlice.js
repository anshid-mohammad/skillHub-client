// src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { decodeToken, isTokenExpired } from '../componets/Utils/jwtUtils';

const initialState = {
    token: localStorage.getItem('token') || null,
    user: null,
    userRole: null,
    loggedIn: false,
    loading: true,
};

const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const decodedToken = decodeToken(action.payload.token);
            if (!decodedToken) return;

            state.token = action.payload.token;
            state.user = decodedToken;
            state.userRole = decodedToken.role;
            state.loggedIn = true;
            state.userId=decodedToken.id._id;

            localStorage.setItem('token', action.payload.token);
        },
        checkAuthStatus: (state) => {
            state.loading = true;
            const token = state.token || localStorage.getItem('token');
            if (token && !isTokenExpired(token)) {
                const decodedToken = decodeToken(token);
                if (!decodedToken) return;
console.log(decodedToken)
                state.loggedIn = true;
                state.user = decodedToken;
                state.userRole = decodedToken.id.role;
                state.userId=decodedToken.id._id;
                state.username=decodedToken.id.name;
                                state.useremail = decodedToken.id.email;
                                 state.userPhoto = decodedToken.id.photo;
                                 state.userAddress = decodedToken.id.address;
                                 state.userPhoneNumber = decodedToken.id.phoneNumber;
                                 state.userBio = decodedToken.id.bio;
                                 state.userGender = decodedToken.id.genter;
                                 state.userDob= decodedToken.id.dob;
                                 state. userNation  = decodedToken.id. nation ;
                                 state.userSkills = decodedToken.id.skills;
                                 state.userHobbies = decodedToken.id.hobbies;
                                 state.userSpecialisation = decodedToken.id.specialisation;
                                 state.userWorkExperience = decodedToken.id.workExperience;


                                




                console.log("",state.name)
            } else {
                state.loggedIn = false;
                state.token = null;
                state.user = null;
                state.userRole = 'user';
                localStorage.removeItem('token');
            }
            state.loading = false;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.userRole = 'user';
            state.loggedIn = false;

            localStorage.removeItem('token');
        },
    },
});

export const { loginSuccess, checkAuthStatus, logout } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';
// import { decodeToken, isTokenExpired } from '../componets/Utils/jwtUtils';

// const initialState = {
//     token: localStorage.getItem('token') || null,
//     user: null,
//     userRole: null,
//     loggedIn: false,
//     loading: true,
// };

// const authSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         loginSuccess: (state, action) => {
//             const decodedToken = decodeToken(action.payload.token);
//             if (!decodedToken) return;

//             state.token = action.payload.token;
//             state.user = decodedToken;
//             state.userRole = decodedToken.id.role;
//             state.userId = decodedToken.id._id;
//             state.username = decodedToken.id.name;
//             state.useremail = decodedToken.id.email;
//             state.userPhoto = decodedToken.id.photo;
//             state.userAddress = decodedToken.id.address;
//             state.userPhoneNumber = decodedToken.id.phoneNumber;
            
//             localStorage.setItem('token', action.payload.token);
//         },
//         checkAuthStatus: (state) => {
//             state.loading = true;
//             const token = state.token || localStorage.getItem('token');
//             if (token && !isTokenExpired(token)) {
//                 const decodedToken = decodeToken(token);
//                 if (!decodedToken) return;

//                 state.loggedIn = true;
//                 state.user = decodedToken;
//                 state.userRole = decodedToken.id.role;
//                 state.userId = decodedToken.id._id;
//                 state.username = decodedToken.id.name;
//                 state.useremail = decodedToken.id.email;
//                 // state.userPhoto = decodedToken.id.photo;
//                 // state.userAddress = decodedToken.id.address;
//                 // state.userPhoneNumber = decodedToken.id.phoneNumber;
//                 console.log("user",state.user)

//             } else {
//                 state.loggedIn = false;
//                 state.token = null;
//                 state.user = null;
//                 state.userRole = 'user';
//                 localStorage.removeItem('token');
//             }
//             state.loading = false;
//         },
//         logout: (state) => {
//             state.token = null;
//             state.user = null;
//             state.userRole = 'user';
//             state.loggedIn = false;

//             localStorage.removeItem('token');
//         },
//         updateProfile: (state, action) => {
//             if (state.user) {
//                 state.user = { ...state.user, ...action.payload };

//                 if (action.payload.name) state.username = action.payload.name;
//                 if (action.payload.email) state.useremail = action.payload.email;
//                 if (action.payload.photo) state.userPhoto = action.payload.photo;
//                 if (action.payload.address) state.userAddress = action.payload.address;
//                 if (action.payload.phoneNumber) state.userPhoneNumber = action.payload.phoneNumber;
//                 if (action.payload.bio) state.userBio = action.payload.bio;
//                 if (action.payload.gender) state.userGender = action.payload.genter;


//             }
//         },
//     },
// });

// export const { loginSuccess, checkAuthStatus, logout, updateProfile } = authSlice.actions;
// export default authSlice.reducer;
