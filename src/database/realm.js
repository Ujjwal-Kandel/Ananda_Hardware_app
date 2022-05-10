import Realm from 'realm';
import axios from '../services/httpService';

class Company extends Realm.Object {}
Company.schema = {
  name: 'Company',
  properties: {
    name: {type: 'string'},
    product_count: {type: 'int'},
  },
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
      .filtered('cname==[c] $0 && category == $1', cname, category)
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
    .filtered('cname ==[c] $0', String(cname).toLowerCase())
    .map(x => x.category);
  const resData = new Set(mappedData);
  const companyCategories = Array.from(resData);
  return companyCategories;
};

let getCompanyCategoriesProducts = (category, cname) => {
  let data = getAllProducts().filtered(
    'category ==[c] $0 && cname ==[c] $1',
    category,
    String(cname).toLowerCase(),
  );
  return data;
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
      cname: String(_cname).toLowerCase(),
      pname: _pname,
      id: _id,
      price: _price,
      code: _code,
      category: _category,
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

let updateOnOrderPlaced = products => {
  const idsQuery = products.map(product => `id = ${product.id}`).join(' OR ');
  realm.write(() => {
    for (const product of realm.objects('Product').filtered(`(${idsQuery})`)) {
      const quantity = products.filter(p => p.id === product.id)[0].quantity;
      product.stock -= quantity;
    }
  });
};

let syncData = async () => {
  try {
    const {data} = await axios.get('/api/products');
    realm.write(() => {
      data?.data.products.forEach(obj => {
        realm.create(Product, obj, 'modified');
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
      realm.delete(realm.objects('Company'));
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
  getCompanyCategoriesProducts,
  updateOnOrderPlaced,
};
