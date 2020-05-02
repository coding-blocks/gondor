import Models from 'Models';
import BaseModelService, { saveInstance } from 'Services/BaseModelService';

export default class Resource extends BaseModelService {
  @saveInstance
  create(body) {
    return Models.Resource.create(body);
  }
}
