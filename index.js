const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const Person = require('./models/person'); // Import the Person model

async function run() {
  try {
    // Create a new Person instance and save it
    const person = new Person({
      name: 'John Doe',
      age: 30,
      favoriteFoods: ['Pizza', 'Burger']
    });

    const savedPerson = await person.save();
    console.log('Person saved:', savedPerson);

    // Create many people
    const arrayOfPeople = [
      { name: 'Alice', age: 25, favoriteFoods: ['Sushi'] },
      { name: 'Bob', age: 32, favoriteFoods: ['Tacos'] },
      { name: 'Charlie', age: 28, favoriteFoods: ['Pasta'] }
    ];

    const manyPeople = await Person.create(arrayOfPeople);
    console.log('Many people created:', manyPeople);

    // Find people with the name 'Alice'
    const peopleNamedAlice = await Person.find({ name: 'Alice' });
    console.log('People with the name Alice:', peopleNamedAlice);

    // Find one person with 'Tacos' in their favorite foods
    const personWithTacos = await Person.findOne({ favoriteFoods: 'Tacos' });
    console.log('Person with Tacos in favorites:', personWithTacos);

    // Find person by ID
    const personId = 'your-person-id-here'; // Replace with a valid ID
    const personById = await Person.findById(personId);
    console.log('Person by ID:', personById);

    // Update a person by ID
    if (personById) {
      personById.favoriteFoods.push('hamburger');
      const updatedPerson = await personById.save();
      console.log('Updated person:', updatedPerson);
    }

    // Find one and update
    const updatedPerson = await Person.findOneAndUpdate(
      { name: 'Bob' },
      { age: 20 },
      { new: true }
    );
    console.log('Updated person:', updatedPerson);

    // Delete person by ID
    const removedPerson = await Person.findByIdAndRemove(personId);
    console.log('Removed person:', removedPerson);

    // Delete many people
    const deleteResult = await Person.deleteMany({ name: 'Mary' });
    console.log('Deleted count:', deleteResult.deletedCount);

    // Find people who like burritos, sort, limit, and select fields
    const results = await Person.find({ favoriteFoods: 'burritos' })
      .sort({ name: 1 })
      .limit(2)
      .select('-age')
      .exec();
    console.log('Results:', results);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the async function
run();
