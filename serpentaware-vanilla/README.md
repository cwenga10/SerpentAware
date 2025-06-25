# 🐍 SerpentAware - Snake Safety & Education

A comprehensive educational webapp that helps users identify venomous and dangerous snakes from around the world, providing critical safety information and first aid guidance.

## Features

### 🌍 **Continental Organization**
- Explore snakes by continent (North America, South America, Europe, Africa, Asia, Australia)
- Easy navigation from continent selection to detailed snake information

### 🚨 **Emergency Information**
- Prominent emergency section with immediate access to first aid steps
- Step-by-step emergency procedures
- International emergency contact numbers
- Critical "what to do" and "what not to do" guidelines

### 🔍 **Snake Identification**
- High-quality snake images for accurate visual identification
- Detailed identification features for each species
- Danger level indicators (Harmless, Venomous, Deadly, etc.)
- Scientific names and common names

### 📚 **Educational Content**
- Comprehensive snake profiles including:
  - Habitat and geographic distribution
  - Behavior patterns and activity times
  - Diet and feeding habits
  - Size ranges and physical characteristics
  - Interesting facts and unique traits

### 🏥 **Safety Education**
- Species-specific safety information
- First aid procedures for snake bites
- Prevention and encounter safety guidelines
- Emergency contact information by region

### 🔎 **Search & Filter**
- Search by snake name, scientific name, or country
- Filter by continent and danger level
- Quick access to specific species information

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Tailwind CSS (CDN)
- **Images**: High-quality stock photography
- **Data**: Local JSON data structure
- **Responsive**: Mobile-first design approach

## Installation & Setup

1. **Clone or Download** the repository
2. **Open** `index.html` in any modern web browser
3. **No build process required** - pure vanilla JavaScript implementation

### Local Development
```bash
# Option 1: Simple HTTP server (Python)
python -m http.server 8000

# Option 2: Node.js HTTP server
npx http-server

# Option 3: Live Server (VS Code extension)
# Install Live Server extension and right-click index.html > "Open with Live Server"
```

## File Structure

```
serpentaware-vanilla/
├── index.html          # Main HTML structure
├── styles.css          # Custom CSS styles and animations
├── app.js             # Main JavaScript application logic
└── README.md          # Project documentation
```

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Snake Database

Currently includes **11 dangerous and educational snake species**:

### North America
- Eastern Diamondback Rattlesnake
- Copperhead

### South America
- Fer-de-Lance

### Africa
- Black Mamba
- Puff Adder

### Asia
- King Cobra
- Russell's Viper

### Australia
- Inland Taipan
- Eastern Brown Snake

### Europe
- European Adder
- Grass Snake (Harmless)

## Safety Disclaimer

**⚠️ Important**: This application is for educational purposes only. In case of an actual snake bite:

1. **Call emergency services immediately**
2. **Seek professional medical attention**
3. **Do not rely solely on this app for medical decisions**
4. **Contact local poison control centers**

## Contributing

To add more snake species or improve the application:

1. **Snake Data**: Add new entries to the `sample_snakes` array in `app.js`
2. **Images**: Ensure high-quality, appropriate snake images
3. **Safety Info**: Include accurate medical and safety information
4. **Testing**: Test thoroughly across different browsers and devices

## License

This project is open source and available under the [MIT License](LICENSE).

## Emergency Numbers by Region

- **United States**: 911
- **Australia**: 000
- **Europe**: 112
- **India**: 102
- **Poison Control**: Contact local poison control centers

## Credits

- Snake images from Pexels and Unsplash
- Tailwind CSS for styling framework
- Educational content compiled from reputable herpetological sources

---

**Built with 🐍 for snake safety education and awareness**