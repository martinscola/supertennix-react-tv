import { userService } from '../services/user.service';

export const fetchWrapper = {
    get,
    post,
};

async function get(url, context) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', ...authHeader(
                context),
        },
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
}

async function post(url, body, context) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', ...authHeader(
                context),
        },
        body: body,
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
}

// helper functions

function authHeader(context) {
    //
    let token = userService.getAccessToken();
    // console.log(`fetch-wrapper line 38: ${ token }`);
    if ( token ) {
        return {
            Authorization: `Bearer ${ localStorage.getItem('access_token') }`,
        };
    } else {
        // console.log(`can't get userService.access_token`);
        return {};
    }
}

async function handleResponse(response) {
    // console.log(response);
    
    if (!response.ok) {
        const message = await response.json()
        return {
            "response": "KO",
            "message": message,
            "data": null
        }
    }
    const json = await response.json()
    return json
}