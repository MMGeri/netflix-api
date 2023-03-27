import { Request, Response } from 'express';

interface Pet {
  id: number;
  name: string;
  type: string;
  tags: string[];
}

let pets: Pet[] = [
  {
    id: 1,
    name: 'sparky',
    type: 'dog',
    tags: ['sweet'],
  },
  {
    id: 2,
    name: 'buzz',
    type: 'cat',
    tags: ['purrfect'],
  },
  {
    id: 3,
    name: 'max',
    type: 'dog',
    tags: [],
  },
  {
    id: 4,
    name: 'maximilian',
    type: 'dog',
    tags: ['sweet','bestboi'],
  },
];
let creationId: number = 4;


function getPets(req: Request, res: Response) {
  const type = String(req.query.type);
  const limit = Number(req.query.limit);
  const tags = req.query.tags as string[] || [];  //megvalosítottam a tagek szerinti szűrést
  const result = pets.filter(pet => pet.type === type && tags.every(val => pet.tags.includes(val))).slice(0, limit);
  res.json(result);
}

function createPet(req: Request, res: Response) {
  const newPet = { ...req.body, id: creationId++ };
  pets.push(newPet);
  res.json(newPet);
}

function findPetById(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  const pet = pets.find(pet => pet.id === id);
  pet ? res.json(pet) : res.status(404).json({ message: 'not found' });
}

function deletePet(req: Request, res: Response) {
  const id: number = Number(req.params.id);
  pets = pets.filter(pet => pet.id !== id)
  res.status(204).end();
}

module.exports = {
  getPets,
  createPet,
  findPetById,
  deletePet
};
