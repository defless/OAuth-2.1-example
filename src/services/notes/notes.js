import Note from '../../core/models/Note.js';

import { check } from '../../utils.js';

export const privateAction = (req, res, next) => {
  res.status(200).json({
    status: 'acces granted',
  });
};

export const getAll = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json({
    status: 'success',
    data: {
      notes,
    },
  });
};

export const getOne = async (req, res) => {
  const { id } = req.param;
  check(id, 'missing_parameter', 400);
  const note = await Note.findById(id);
  check(note, 'ressource_not_found', 404);
  res.status(200).json({
    status: 'success',
    data: {
      note,
    },
  });
};

export const remove = () => {

};

export const update = () => {

};
