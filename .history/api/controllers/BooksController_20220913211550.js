const { Op } = require('sequelize');
const BookModel = require('../models/Books');
const CategoryModel = require('../models/Categories');
const PublishingModel = require('../models/Publishers');
const FormatModel = require('../models/Formats');
const LogModel = require('../models/Logs');

class BooksController {

  index = async (req, res, next) => {
    const params = req.query;
    const limit = params.limit || 100;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    const sort = params.sort || 'id';
    const order = params.order || 'ASC';
    const where = {};

    if (params.title) {
      where.title = {
        [Op.iLike]: `%${params.title}%`
      };
    }
    
    if (sort == 'Category') {
      sort = { model: CategoryModel };
      order = 'description', 'DESC';
    }


    const books = await BookModel.findAll({
      include: [{
        model: CategoryModel,
        required: false,
        attributes: ['description']
      },{
        model: PublishingModel,
        required: false,
        attributes: ['name']
      },{
        model: FormatModel,
        required: false,
        attributes: ['description']
      }
    ], 
      where: where,
      limit: limit,
      offset: offset,
      order: [ [sort, order] ]
    });
    res.json(books);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const book = await BookModel.create(data);
      LogModel.create({
        action: 'Book: '+book.title+' created.'
      });
      res.json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const book = await BookModel.findByPk(req.params.bookId);
    res.json(book);
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.bookId;
      const data = await this._validateData(req.body, id);
      await BookModel.update(data, {
        where: {
          id: id
        }
      });
      LogModel.create({
        action: 'Book: '+data.title+' updated.'
      });
      res.json(await BookModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await BookModel.destroy({
      where: {
        id: req.params.bookId
      }
    });
    LogModel.create({
      action: 'Book: '+req.params.title+' deleted.'
    });
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['title', 'author', 'publication_year', 'pages', 'value', 'CategoryId', 'PublishingId', 'FormatId'];
    const book = {};
    for (const attribute of attributes) {
      if (! data[attribute]){
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      book[attribute] = data[attribute];
    }
    if( await (book.value < 0)){
      throw new Error (`The value cannot be negative!`)
    }

    if (await this._checkIfTitleExists(book.title, id)) {
      throw new Error(`The book "${book.title}" already registred.`);
    }

    return book;
  }

  _checkIfTitleExists = async (title, id) => {
    const where = {
      title: title
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await BookModel.count({
      where: where
    });

    return count > 0;
  }

}

module.exports = new BooksController();