// speciesModel.ts

import {ResultSetHeader, RowDataPacket} from 'mysql2';
import CustomError from '../../classes/CustomError';
import promisePool from '../../database/db';
import {Species} from '../../types/DBTypes';

const getAllSpecies = async () => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Species[]>(
    'SELECT * FROM species'
  );
  if (!rows) {
    throw new CustomError('No species found', 404);
  }
  return rows;
};

const getSpeciesById = async (id: number) => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Species[]>(
    'SELECT * FROM species WHERE species_id = ?',
    [id]
  );
  if (!rows) {
    throw new CustomError('No species found', 404);
  }
  return rows[0];
};

const addSpecies = async (species: Pick<Species, 'species_name'>) => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO species (species_name) VALUES (?);',
    [species.species_name]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Species not added', 400);
  }
  return headers.insertId;
};

const updateSpecies = async (
  id: number,
  species: Pick<Species, 'species_name'>
): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'UPDATE species SET species_name = ? WHERE species_id = ?;',
    [species.species_name, id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Species not updated', 304);
  }
  return true;
};

const deleteSpecies = async (id: number): Promise<boolean> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'DELETE FROM species WHERE species_id = ?;',
    [id]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Species not updated', 304);
  }
  return true;
};

export {
  getAllSpecies,
  getSpeciesById,
  addSpecies,
  updateSpecies,
  deleteSpecies,
};
