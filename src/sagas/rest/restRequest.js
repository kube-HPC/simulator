import axios from 'axios';
import FileSaver from 'file-saver';
import AT from 'const/application-actions';

class RestRequest {
  constructor(baseUrl, action, successObjGenerator, rejectObjGenerator) {
    this.baseUrl = baseUrl;
    this.action = action;
    this.successObjGenerator = successObjGenerator;
    this.rejectObjGenerator = rejectObjGenerator;
    this.typeToHttpLogicMapping = {
      [AT.REST_REQ]: this.get,
      [AT.REST_REQ_POST]: this.post,
      [AT.REST_REQ_POST_FORM]: this.postForm,
      [AT.REST_REQ_PUT]: this.put,
      [AT.REST_REQ_DELETE]: this.delete,
      [AT.JOBS_DOWNLOAD_REQ]: this.downloadJobs
    };
  }

  get = () => axios.get(`${this.url}${this.action.payload.url}`);

  post = () => {
    const { url, body } = this.action.payload;
    return axios.post(`${this.baseUrl}/${url}`, body);
  };

  postForm = () => {
    const { url, formData } = this.action.payload;
    return axios.post(`${this.baseUrl}/${url}`, formData);
  };

  put = () => {
    const { url, body } = this.action.payload;
    return axios.put(`${this.baseUrl}/${url}`, body);
  };

  delete = () => {
    const { url, body } = this.action.payload;
    return axios.delete(`${this.baseUrl}/${url}/${body.algorithmName}`, {
      data: body
    });
  };

  downloadJobs = () =>
    axios.get(`${this.url}${this.action.payload.url}`, {
      responseType: 'blob',
      timeout: 30000
    });

  extractResponseFromError = err => err.response && err.response.data && err.response.data.error;

  execute = async () => {
    try {
      const actionType = this.action.type;
      const httpLogic = this.typeToHttpLogicMapping[actionType];
      const { data } = await httpLogic();

      if (actionType === AT.JOBS_DOWNLOAD_REQ) {
        FileSaver.saveAs(data, 'results.json');
      }

      return this.successObjGenerator(data, this.action);
    } catch (error) {
      const errorResponse = this.extractResponseFromError(error);
      return this.rejectObjGenerator(errorResponse, this.action);
    }
  };
}

export default RestRequest;
