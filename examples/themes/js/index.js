import {Wheel} from '../../../dist/spin-wheel-esm.js';
import {loadFonts, loadImages} from '../../../scripts/util.js';

// Modified props.js file that includes loadItemsFromFile functionality
let props = [];

// Function to load items from text file
async function loadItemsFromFile() {
  try {
    const response = await fetch('./items.txt'); // Fetch the text file
    const text = await response.text();  // Read file as text
    const lines = text.split('\n').filter(line => line.trim() !== '');  // Split by line and filter out empty lines
    const items = lines.map(line => ({ label: line.trim() }));  // Map each line to { label: "item" }

    props = [
      {
        name: 'Workout',
        radius: 0.7,
        itemLabelRadius: 0.93,
        itemLabelRadiusMax: 0.35,
        itemLabelRotation: 180,
        itemLabelAlign: 'left',
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
        items: items  // Use dynamically loaded items here
      }
    ];
  } catch (error) {
    console.error('Error loading items from file:', error);
  }
}

window.onload = async () => {
  // Load items from text file first
  await loadItemsFromFile();

  // Load fonts based on props
  await loadFonts(props.map(i => i.itemLabelFont));

  // Initialize the wheel
  const wheel = new Wheel(document.querySelector('.wheel-wrapper'));
  const dropdown = document.querySelector('select');

  const images = [];

  for (const p of props) {
    // Initialize dropdown with the names of each example
    const opt = document.createElement('option');
    opt.textContent = p.name;
    dropdown.append(opt);

    // Convert image URLs into actual images
    images.push(initImage(p, 'image'));
    images.push(initImage(p, 'overlayImage'));
    for (const item of p.items) {
      images.push(initImage(item, 'image'));
    }
  }

  // Load all images
  await loadImages(images);

  // Show the wheel once everything has loaded
  document.querySelector('.wheel-wrapper').style.visibility = 'visible';

  // Handle dropdown change
  dropdown.onchange = () => {
    wheel.init({
      ...props[dropdown.selectedIndex],
      rotation: wheel.rotation, // Preserve value.
    });
  };

  // Select default option
  dropdown.options[0].selected = 'selected';
  dropdown.onchange();

  // Save object globally for easy debugging
  window.wheel = wheel;

  const btnSpin = document.querySelector('button');
  let modifier = 0;

  // Listen for click event on the spin button
  window.addEventListener('click', (e) => {
    if (e.target === btnSpin) {
      const {duration, winningItemRotaion} = calcSpinToValues();
      wheel.spinTo(winningItemRotaion, duration);
    }
  });

  function calcSpinToValues() {
    const duration = 3000;
    const winningItemRotaion = getRandomInt(360, 360 * 1.75) + modifier;
    modifier += 360 * 1.75;
    return {duration, winningItemRotaion};
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function initImage(obj, pName) {
    if (!obj[pName]) return null;
    const i = new Image();
    i.src = obj[pName];
    obj[pName] = i;
    return i;
  }
};
