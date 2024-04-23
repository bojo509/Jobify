import axios from 'axios'

export const baseURL = 'https://backend.jobify.one'
export const API = axios.create({ baseURL: baseURL, responseType: 'json' })

export const apiRequest = async ({ url, token, data, method }) => {
    try {
        const response = await API({
            method: method || 'GET',
            url: url,
            data: data,
            headers: {
                "content-type": "application/json",
                Authorization: token ? `Bearer ${token}` : ''
            }
        })

        return response?.data
    } catch (error) {
        const err = error.response.data
        console.log(err)
        return { status: err.status, message: err.message }
    }
}

export const handleFileUpload = async (uploadFile) => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "Jobify");
  
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/docscbcto/image/upload/`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.log(error);
    }
};

export const handleCVUpload = async (uploadFile) => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "Jobify");
  
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/docscbcto/raw/upload/`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.log(error);
    }
}

export const updateURL = ({ pageNum, query, cmpLoc, sort, navigate, location, jType, exp }) => {
    const params = new URLSearchParams()
    
    if (pageNum && pageNum > 1) {
        params.set('page', pageNum)
    }

    if (query) {
        params.set('search', query)
    }

    if (cmpLoc) {
        params.set('location', cmpLoc)
    }

    if (sort) {
        params.set('sort', sort)
    }

    if (jType) {
        params.set('type', jType)
    }

    if (exp) {
        params.set('exp', exp)
    }

    const newURL = `${location.pathname}?${params.toString()}`
    navigate(newURL, { replace: true })

    return newURL
}