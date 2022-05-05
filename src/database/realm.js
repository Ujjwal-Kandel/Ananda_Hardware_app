import Realm from 'realm';
import axios from '../services/httpService';

class Company extends Realm.Object {}
Company.schema = {
  name: 'Company',
  properties: {
    name: {type: 'string'},
    product_count: {type: 'int'},
  },
  primaryKey: 'name',
};

class Product extends Realm.Object {}
Product.schema = {
  name: 'Product',
  properties: {
    cname: 'string',
    pname: 'string',
    id: 'int',
    price: 'double',
    code: 'string',
    category: 'string',
    image: 'string[]',
    stock: 'int',
    dimension: 'string',
  },
  primaryKey: 'id',
};

let realm = new Realm({
  schema: [Product, Company],
  schemaVersion: 10,
});
export default realm;

let getAllProducts = () => {
  return realm.objects('Product');
};
let getPname = (cname = '', category = '') => {
  let mappedData = null;
  if (cname === '' || category === '') {
    mappedData = getAllProducts().map(x => x.pname);
  } else {
    mappedData = getAllProducts()
      .filtered('cname==$0 && category == $1', cname, category)
      .map(x => x.pname);
  }
  const respData = new Set(mappedData);
  const Pnames = Array.from(respData);
  return Pnames;
};

let getAllCompany = () => {
  return realm.objects('Company');
};

let getCompanyNames = () => {
  const mappedData = realm.objects('Company').map(x => x.name);
  const resData = new Set(mappedData);
  const Companies = Array.from(resData);
  return Companies;
};

let getCompanyCategories = cname => {
  const mappedData = getAllProducts()
    .filtered('cname == $0', String(cname).toUpperCase())
    .map(x => x.category);
  const resData = new Set(mappedData);
  const companyCategories = Array.from(resData);
  return companyCategories;
};

let addProduct = (
  _cname,
  _pname,
  _id,
  _price,
  _code,
  _category,
  _image,
  _stock,
  _dimension,
) => {
  realm.write(() => {
    realm.create('Product', {
      cname: _cname,
      pname: _pname,
      id: _id,
      price: _price,
      code: _code,
      image: _image,
      stock: _stock,
      dimension: _dimension,
    });
  });
};

let deleteAllProduct = () => {
  realm.write(() => {
    realm.deleteAll();
  });
};

let syncData = async () => {
  try {
    const {data} = await axios.get('/api/products');
    console.log({data});
    realm.write(() => {
      data?.data.products.forEach(obj => {
        realm.create(Product, obj);
      });
    });
  } catch (err) {
    console.log('product-data-sync-error: ', err);
    throw err;
  }
};

let syncCompany = async () => {
  try {
    const {data} = await axios.get('/api/companies');
    realm.write(() => {
      data?.data.companies.forEach(obj => {
        realm.create(Company, obj);
      });
    });
  } catch (err) {
    console.log('company-data-sync-error: ', err);
    throw err;
  }
};

export {
  getAllProducts,
  addProduct,
  deleteAllProduct,
  syncData,
  syncCompany,
  getCompanyNames,
  getAllCompany,
  getPname,
  getCompanyCategories,
};
