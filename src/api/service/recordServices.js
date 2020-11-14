/**
 * FileName: auth
 * Auth: admin
 * Created at: 2020/8/6
 * Description:
 */
import axios from './../request';

export const addRecord = (data) => {
    return axios.post('/api/record/add', {data});
};


