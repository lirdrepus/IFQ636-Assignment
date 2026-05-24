const Recipe = require('../models/Recipe');

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user.id });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addRecipe = async (req, res) => {
  const { title, description, ingredients, steps } = req.body;
  try {
    const recipe = await Recipe.create({
      userId: req.user.id,
      title,
      description,
      ingredients,
      steps
    });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecipe = async (req, res) => {
  const { title, description, ingredients, steps } = req.body;
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.steps = steps || recipe.steps;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecipes, addRecipe, updateRecipe, deleteRecipe };

