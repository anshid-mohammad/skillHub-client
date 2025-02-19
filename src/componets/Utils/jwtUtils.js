import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const isTokenExpired = (token) => {
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
        return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};