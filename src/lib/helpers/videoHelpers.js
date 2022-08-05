import {fetchWrapper} from './fetch-wrapper';
import {baseAPIURI, apiEndpoint} from '../utils/constants'

const videoRefreshToken = async (params) =>  {
    return await fetchWrapper.post(`${baseAPIURI}${apiEndpoint}video/token/`,
        params, {})
}

export const videoHelpers = {
    videoRefreshToken,
}

