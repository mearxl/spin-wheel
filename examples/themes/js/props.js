import {AlignText} from '../../../src/constants.js';

export let props = {
  name: 'Workout',
  radius: 0.7,
  itemLabelRadius: 0.93,
  itemLabelRadiusMax: 0.35,
  itemLabelRotation: 180,
  itemLabelAlign: AlignText.left,
  itemLabelColors: ['#fff'],
  itemLabelBaselineOffset: -0.07,
  itemLabelFont: 'Dosis',
  itemLabelFontSizeMax: 50,
  itemBackgroundColors: ['#ffba00', '#03c7f1', '#eb2d54', '#2f2453'],
  rotationSpeedMax: 700,
  rotationResistance: -50,
  lineWidth: 1,
  lineColor: '#fff',
  image: './img/example-0-image.png',
  overlayImage: './img/example-0-overlay.png',
  items: []
};

// Function to load items from text file
export async function loadItemsFromFile() {
  try {
    const response = await fetch('./items.txt'); // Fetches the text file
    const text = await response.text();  // Reads file as text
    const lines = text.split('\n').filter(line => line.trim() !== '');  // Splits by line and filters out empty lines
    props.items = lines.map(line => ({ label: line.trim() }));  // Maps each line to {label: "item"}
  } catch (error) {
    console.error('Error loading items:', error);
  }
}

// Export a function to initialize the wheel after loading items
export async function initializeWheel(Wheel) {
  await loadItemsFromFile(); // Ensure items are loaded before initializing the wheel
  const wheel = new Wheel(props);  // Initialize the wheel with loaded props
  wheel.render(document.querySelector('.wheel-wrapper')); // Render the wheel in the correct container
}
