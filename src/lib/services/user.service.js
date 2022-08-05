/**!
 *  user.service.js
 *
 *  Created 2275/01/2022
 *  Updated 27/01/2022
 *  Copyright © 2020/2022 [ HiWayMedia S.R.L. ]
 *  All rights reserved.
 *
 */

import {
    apiEndpoint,
    authURI,
    baseAPIURI,
    loginEndpoint,
    logoutEndpoint,
} from '../utils/constants';
import { fetchWrapper } from '../helpers/fetch-wrapper';
//
export const userService = {
    access_token: localStorage.getItem('access_token'),
    login,
    logout,
    sessionRefresh,
    getRefreshToken,
    getAccessToken,
    getUser,
    getSubscriptionInfo,
    getPaymentInfo,
};

function login(username, password) {
    const data = new URLSearchParams(
        {'username': username, 'password': password, 'captcha': 'no-website'});
    return fetchWrapper.post(`${ authURI }${ loginEndpoint }`,
        data,
        {});
}

function logout(token, user_id) {
    const data = new URLSearchParams(
        {'token': token},
    );
    return fetchWrapper.post(
        `${ authURI }/api/user/${ user_id }${ logoutEndpoint }`,
        data,
        {});
}

function sessionRefresh(data, user_id) {
    return fetchWrapper.post(
        `${ authURI }/api/user/${ user_id }/refresh-token/`, data,
        {});
}

function getSubscriptionInfo() {
    return fetchWrapper.get(
        `${ baseAPIURI }${ apiEndpoint }/my/subscriptions`, {},
    );
}

function getPaymentInfo() {

    return fetchWrapper.post(`${ baseAPIURI }${ apiEndpoint }/payment/info`, {},
        {});
}

function getAccessToken() {
    return localStorage.getItem('access_token');
}

function getRefreshToken() {
    return localStorage.getItem('refresh_token');
}

function getUser() {
    return localStorage.getItem(`user`);
}