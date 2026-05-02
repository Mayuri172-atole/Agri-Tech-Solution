const Product = require('../models/Product');

// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const { type, category, status, seller, search } = req.query;
    const filter = {};
    if (type)     filter.productType = type;
    if (category) filter.category = category;
    if (status)   filter.status = status;
    if (seller)   filter.seller = seller;
    if (search)   filter.$text = { $search: search };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Lafda ho gaya: ' + err.message });
  }
};

// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product nahi mila, Bidu!' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'ID galat hai!' });
  }
};

// @route POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name, image, description, category, price, oldPrice,
      countInStock, stock, brand, tag, chemicalInfo, expiryDate,
      seller, sellerName, discount, productType: reqProductType
    } = req.body;

    // ✅ Role-based category → type + status
    const freshCategories = ['vegetables', 'fruits', 'grains', 'pulses', 'grains/pulses'];
    const toolCategories  = ['hand tools', 'power tools', 'irrigation', 'machinery', 'safety gear'];
    const cat = (category || '').toLowerCase();

    let productType, status;

    if (freshCategories.includes(cat)) {
      // Farmer products — auto Live
      productType = 'fresh';
      status      = 'Live';
    } else if (toolCategories.includes(cat)) {
      // Tooler/Equipment products — auto Live (no approval needed)
      productType = 'equipment';
      status      = 'Live';
    } else {
      // Dealer chemicals/pesticides/seeds — needs admin approval
      productType = 'licensed';
      status      = 'Pending Approval';
    }

    // Override if explicitly passed
    if (reqProductType) productType = reqProductType;

    const qty = parseInt(countInStock) || parseInt(stock) || 10;

    const product = new Product({
      name, image, description, category,
      price:        parseFloat(price)    || 0,
      oldPrice:     parseFloat(oldPrice) || parseFloat(price) || 0,
      discount:     parseFloat(discount) || 0,
      countInStock: qty,
      stock:        qty,
      brand:        brand       || '',
      tag:          tag         || '',
      productType,
      status,
      chemicalInfo: chemicalInfo || '',
      expiryDate:   expiryDate   || '',
      seller:       seller       || '',
      sellerName:   sellerName   || '',
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product nahi mila!' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route PUT /api/products/:id/approve (Admin)
const approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status || 'Live' },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product nahi mila!' });
    res.json({ message: `Product ${product.status}!`, product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW — Seller ka apna products fetch (by seller email)
const getMyProducts = async (req, res) => {
  try {
    const email = req.query.seller;
    if (!email) return res.status(400).json({ message: 'Seller email required' });
    const products = await Product.find({ seller: email }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts, getProductById, createProduct,
  updateProduct, approveProduct, deleteProduct, getMyProducts
};