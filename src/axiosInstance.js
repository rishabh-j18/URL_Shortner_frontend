import axios from 'axios';
const apiRequest = async(url, method, body={},headers)=>{
    try{
        const config={
            method,
            url,
            data:body,
            headers: headers || {
                'Content-Type': 'application/json',
            },
        };
        console.dir(config)
        const response = await axios(config);
        return response;
    }catch(error)
    {
        if(error.response)
        {
            console.error('Error response', error.response);
            return{
                status: error.response.status,
                message: error.response.data || 'An error occured.',
            };
        }
        else if (error.request)
        {
            console.error('Error request',error.request);
            return {message:'No response recieved from server.'};
        }
        else{
            console.error('Error',error.message);
            return{message: error.message};
        }
    }
};
export default apiRequest;