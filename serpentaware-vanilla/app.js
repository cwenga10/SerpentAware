// SerpentAware - Vanilla JavaScript Application

class SerpentAware {
    constructor() {
        this.snakes = [];
        this.continents = [];
        this.emergencyInfo = [];
        this.stats = {};
        this.currentView = 'home';
        this.selectedContinent = '';
        this.selectedSnake = null;
        this.filteredSnakes = [];
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.hideLoading();
        this.renderHome();
    }

    setupEventListeners() {
        // Search form
        document.getElementById('search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        // Navigation buttons
        document.getElementById('emergency-btn').addEventListener('click', () => {
            this.showView('emergency');
        });

        document.getElementById('back-to-home').addEventListener('click', () => {
            this.showView('home');
        });

        document.getElementById('back-to-home-emergency').addEventListener('click', () => {
            this.showView('home');
        });

        document.getElementById('back-to-snakes').addEventListener('click', () => {
            this.showView('snakes');
        });
    }

    async loadData() {
        // Initialize with sample data (in a real app, this would come from an API)
        await this.initializeSampleData();
        this.calculateStats();
    }

    async initializeSampleData() {
        // Sample snake data
        this.snakes = [
            {
                id: '1',
                name: 'Eastern Diamondback Rattlesnake',
                scientific_name: 'Crotalus adamanteus',
                continent: 'North America',
                countries: ['United States'],
                danger_level: 'Deadly',
                is_venomous: true,
                image_url: 'https://images.pexels.com/photos/32715145/pexels-photo-32715145.jpeg',
                description: 'Largest venomous snake in North America, known for its distinctive diamond pattern and loud rattle.',
                habitat: ['Pine forests', 'Coastal plains', 'Scrublands'],
                size_range: '3-8 feet (0.9-2.4 meters)',
                identification_features: ['Diamond-shaped patterns', 'Heavy-bodied', 'Prominent rattle', 'Heat-sensing pits'],
                behavior: 'Generally shy but will defend itself vigorously when threatened. Active during day and night.',
                diet: 'Small mammals, birds, occasionally other reptiles',
                what_to_do: ['Back away slowly', 'Call emergency services immediately', 'Keep victim calm and still', 'Remove jewelry near bite site'],
                what_not_to_do: ['Don\'t try to catch or kill the snake', 'Don\'t apply ice to bite', 'Don\'t cut the wound', 'Don\'t use a tourniquet'],
                first_aid: ['Call 911 immediately', 'Keep bite below heart level', 'Remove tight clothing', 'Monitor breathing'],
                interesting_facts: ['Can strike up to 2/3 of their body length', 'Rattle is made of keratin segments', 'Heat sensors can detect temperature differences of 0.5°F']
            },
            {
                id: '2',
                name: 'Copperhead',
                scientific_name: 'Agkistrodon contortrix',
                continent: 'North America',
                countries: ['United States'],
                danger_level: 'Venomous',
                is_venomous: true,
                image_url: 'https://images.pexels.com/photos/2062316/pexels-photo-2062316.jpeg',
                description: 'Common venomous snake with distinctive copper-colored head and hourglass patterns.',
                habitat: ['Deciduous forests', 'Mixed woodlands', 'Rocky areas'],
                size_range: '2-4 feet (0.6-1.2 meters)',
                identification_features: ['Copper-colored head', 'Hourglass crossbands', 'Elliptical pupils', 'Heat-sensing pits'],
                behavior: 'Tends to freeze when threatened rather than flee. Active at dusk and night.',
                diet: 'Rodents, frogs, insects, small birds',
                what_to_do: ['Seek immediate medical attention', 'Keep calm and still', 'Note time of bite', 'Remove constricting items'],
                what_not_to_do: ['Don\'t panic', 'Don\'t try to suck out venom', 'Don\'t apply heat or cold', 'Don\'t drink alcohol'],
                first_aid: ['Get to hospital quickly', 'Keep bitten area below heart', 'Wash with soap and water', 'Cover with clean bandage'],
                interesting_facts: ['Babies are born with yellow-tipped tails', 'Can remain motionless for hours', 'Venom is hemotoxic']
            },
            {
                id: '3',
                name: 'Fer-de-Lance',
                scientific_name: 'Bothrops asper',
                continent: 'South America',
                countries: ['Colombia', 'Venezuela', 'Ecuador', 'Peru', 'Brazil'],
                danger_level: 'Deadly',
                is_venomous: true,
                image_url: 'https://images.unsplash.com/photo-1670806507392-49c3d52d0266',
                description: 'Aggressive and deadly pit viper responsible for most snakebite fatalities in Central and South America.',
                habitat: ['Tropical rainforests', 'Agricultural areas', 'Near human settlements'],
                size_range: '4-8 feet (1.2-2.4 meters)',
                identification_features: ['Triangular head', 'Heat-sensing pits', 'Varied brown/gray patterns', 'Keeled scales'],
                behavior: 'Highly aggressive when threatened. Often found near human habitation.',
                diet: 'Small mammals, birds, frogs, other snakes',
                what_to_do: ['Get antivenom immediately', 'Call emergency services', 'Keep victim calm', 'Immobilize bitten limb'],
                what_not_to_do: ['Don\'t delay medical treatment', 'Don\'t apply tourniquet', 'Don\'t cut wound', 'Don\'t give alcohol'],
                first_aid: ['Rush to nearest hospital', 'Keep bite below heart', 'Monitor vital signs', 'Prepare for potential shock'],
                interesting_facts: ['Accounts for 50% of snakebites in its range', 'Can inject large amounts of venom', 'Young are more venomous than adults']
            },
            {
                id: '4',
                name: 'Black Mamba',
                scientific_name: 'Dendroaspis polylepis',
                continent: 'Africa',
                countries: ['South Africa', 'Botswana', 'Namibia', 'Zimbabwe', 'Kenya'],
                danger_level: 'Deadly',
                is_venomous: true,
                image_url: 'https://images.unsplash.com/photo-1703636998491-4f0cffcc6fbd',
                description: 'Africa\'s deadliest snake, known for its speed, aggression, and highly potent neurotoxic venom.',
                habitat: ['Savannas', 'Rocky hills', 'Dense forests', 'Scrublands'],
                size_range: '6-14 feet (1.8-4.3 meters)',
                identification_features: ['Dark gray to black color', 'Coffin-shaped head', 'Black mouth interior', 'Long and slender'],
                behavior: 'Extremely fast and aggressive. Can move up to 12 mph. Highly territorial.',
                diet: 'Small mammals, birds, eggs',
                what_to_do: ['Get antivenom within 20 minutes if possible', 'Call emergency immediately', 'Keep victim completely still', 'Prepare for respiratory support'],
                what_not_to_do: ['Don\'t waste time', 'Don\'t move victim', 'Don\'t try traditional remedies', 'Don\'t give food or water'],
                first_aid: ['Race to hospital', 'Support breathing if needed', 'Keep airway clear', 'Monitor consciousness'],
                interesting_facts: ['Can kill a human in 15-20 minutes', 'Fastest snake in the world', 'Named for black mouth, not body color']
            },
            {
                id: '5',
                name: 'Puff Adder',
                scientific_name: 'Bitis arietans',
                continent: 'Africa',
                countries: ['South Africa', 'Kenya', 'Tanzania', 'Nigeria', 'Ghana'],
                danger_level: 'Highly Venomous',
                is_venomous: true,
                image_url: 'https://images.pexels.com/photos/1660997/pexels-photo-1660997.jpeg',
                description: 'Responsible for more snakebite fatalities in Africa than any other species due to its wide distribution and aggressive nature.',
                habitat: ['Grasslands', 'Bush country', 'Desert edges', 'Agricultural areas'],
                size_range: '3-6 feet (0.9-1.8 meters)',
                identification_features: ['Thick, heavy body', 'Distinctive V-shaped markings', 'Large triangular head', 'Short tail'],
                behavior: 'Relies on camouflage and remains motionless. Very aggressive when disturbed.',
                diet: 'Small mammals, birds, amphibians',
                what_to_do: ['Seek immediate medical care', 'Keep victim calm and still', 'Remove rings and tight clothing', 'Monitor breathing'],
                what_not_to_do: ['Don\'t apply ice', 'Don\'t cut bite wound', 'Don\'t give alcohol', 'Don\'t use electric shock'],
                first_aid: ['Get to hospital quickly', 'Splint bitten limb', 'Keep bite below heart level', 'Watch for swelling'],
                interesting_facts: ['Hisses loudly when threatened', 'Can give birth to 60 young at once', 'Excellent camouflage makes them hard to spot']
            },
            {
                id: '6',
                name: 'King Cobra',
                scientific_name: 'Ophiophagus hannah',
                continent: 'Asia',
                countries: ['India', 'China', 'Thailand', 'Malaysia', 'Indonesia'],
                danger_level: 'Deadly',
                is_venomous: true,
                image_url: 'https://images.unsplash.com/photo-1638855370496-1ec25682adbe',
                description: 'World\'s longest venomous snake, capable of delivering enough venom to kill an elephant.',
                habitat: ['Dense forests', 'Mangrove swamps', 'Bamboo thickets', 'Near water sources'],
                size_range: '8-18 feet (2.4-5.5 meters)',
                identification_features: ['Distinctive hood', 'Olive-brown coloration', 'Chevron patterns', 'Large size'],
                behavior: 'Generally shy but extremely dangerous when threatened. Can rear up to 6 feet high.',
                diet: 'Primarily other snakes, including venomous species',
                what_to_do: ['Get antivenom immediately', 'Call emergency services', 'Keep victim still', 'Support breathing if needed'],
                what_not_to_do: ['Don\'t delay treatment', 'Don\'t panic', 'Don\'t try to catch snake', 'Don\'t use folk remedies'],
                first_aid: ['Rush to hospital', 'Assist breathing', 'Keep bite below heart', 'Monitor for paralysis'],
                interesting_facts: ['Only snake that builds a nest', 'Can inject 7ml of venom in one bite', 'Immune to other snake venoms']
            },
            {
                id: '7',
                name: 'Russell\'s Viper',
                scientific_name: 'Daboia russelii',
                continent: 'Asia',
                countries: ['India', 'Sri Lanka', 'Myanmar', 'Thailand', 'Pakistan'],
                danger_level: 'Deadly',
                is_venomous: true,
                image_url: 'https://images.unsplash.com/photo-1662103563173-30e577e4e391',
                description: 'One of the \'Big Four\' venomous snakes of India, responsible for thousands of deaths annually.',
                habitat: ['Grasslands', 'Scrub forests', 'Agricultural areas', 'Rocky terrain'],
                size_range: '3-5 feet (0.9-1.5 meters)',
                identification_features: ['Three rows of dark spots', 'Flat triangular head', 'Prominent supraocular scales', 'Keeled scales'],
                behavior: 'Aggressive and quick to strike. Often found in agricultural areas.',
                diet: 'Rodents, birds, frogs, crabs',
                what_to_do: ['Get polyvalent antivenom', 'Reach hospital within hours', 'Keep victim calm', 'Monitor kidney function'],
                what_not_to_do: ['Don\'t delay treatment', 'Don\'t apply tight bands', 'Don\'t give aspirin', 'Don\'t ignore mild symptoms'],
                first_aid: ['Immediate hospitalization', 'Watch for bleeding', 'Monitor urine output', 'Support blood pressure'],
                interesting_facts: ['Causes more snakebite deaths than any other species', 'Venom affects blood clotting', 'Very loud hiss when threatened']
            },
            {
                id: '8',
                name: 'Inland Taipan',
                scientific_name: 'Oxyuranus microlepidotus',
                continent: 'Australia',
                countries: ['Australia'],
                danger_level: 'Deadly',
                is_venomous: true,
                image_url: 'https://images.unsplash.com/photo-1651138666546-e1e276686b59',
                description: 'World\'s most venomous snake, with enough venom in one bite to kill 100 adult humans.',
                habitat: ['Arid regions', 'Channel country', 'Cracking clay soils', 'Remote areas'],
                size_range: '6-8 feet (1.8-2.4 meters)',
                identification_features: ['Olive to dark tan color', 'Rectangular head scales', 'Small eyes', 'Seasonal color changes'],
                behavior: 'Generally shy and reclusive. Rarely encountered by humans.',
                diet: 'Small mammals, particularly rodents',
                what_to_do: ['Get antivenom immediately', 'Call flying doctor service', 'Keep victim absolutely still', 'Prepare for intensive care'],
                what_not_to_do: ['Don\'t waste any time', 'Don\'t move victim', 'Don\'t apply pressure bandage incorrectly', 'Don\'t give up hope'],
                first_aid: ['Apply compression bandage', 'Splint entire limb', 'Mark swelling progression', 'Get helicopter evacuation'],
                interesting_facts: ['Venom is 50x more toxic than cobra venom', 'Also called \'fierce snake\'', 'Can kill in 30-45 minutes']
            },
            {
                id: '9',
                name: 'Eastern Brown Snake',
                scientific_name: 'Pseudonaja textilis',
                continent: 'Australia',
                countries: ['Australia'],
                danger_level: 'Deadly',
                is_venomous: true,
                image_url: 'https://images.pexels.com/photos/16105771/pexels-photo-16105771.jpeg',
                description: 'Highly aggressive and fast-moving snake, second most venomous land snake in the world.',
                habitat: ['Woodlands', 'Scrublands', 'Grasslands', 'Urban areas'],
                size_range: '4-7 feet (1.2-2.1 meters)',
                identification_features: ['Variable brown coloration', 'Round pupils', 'Relatively small head', 'Smooth scales'],
                behavior: 'Extremely aggressive and fast. Will pursue threats. Active during day.',
                diet: 'Small mammals, birds, eggs, other reptiles',
                what_to_do: ['Apply pressure-immobilization bandage', 'Call emergency 000', 'Keep victim still', 'Get antivenom quickly'],
                what_not_to_do: ['Don\'t remove bandage', 'Don\'t wash bite site', 'Don\'t cut or suck wound', 'Don\'t give alcohol'],
                first_aid: ['Broad pressure bandage', 'Splint limb', 'Mark time and swelling', 'Helicopter to hospital'],
                interesting_facts: ['Can move at 12 mph', 'Accounts for 60% of snakebite deaths in Australia', 'Very territorial during breeding season']
            },
            {
                id: '10',
                name: 'European Adder',
                scientific_name: 'Vipera berus',
                continent: 'Europe',
                countries: ['United Kingdom', 'Norway', 'Sweden', 'Germany', 'France'],
                danger_level: 'Venomous',
                is_venomous: true,
                image_url: 'https://images.unsplash.com/photo-1529978515127-dba8c80bbf05',
                description: 'Only venomous snake native to Britain and most of northern Europe.',
                habitat: ['Heathlands', 'Moors', 'Woodland edges', 'Sunny slopes'],
                size_range: '2-3 feet (0.6-0.9 meters)',
                identification_features: ['Zigzag pattern down back', 'V or X mark on head', 'Vertical pupils', 'Keeled scales'],
                behavior: 'Generally shy and non-aggressive. Bites are rare and usually defensive.',
                diet: 'Small mammals, lizards, frogs, birds',
                what_to_do: ['Seek medical attention', 'Clean wound gently', 'Remove jewelry', 'Monitor for allergic reaction'],
                what_not_to_do: ['Don\'t panic - rarely fatal', 'Don\'t apply ice', 'Don\'t cut wound', 'Don\'t use tourniquet'],
                first_aid: ['Clean with antiseptic', 'Take painkiller if needed', 'Watch for swelling', 'Get medical advice'],
                interesting_facts: ['Hibernates for 4-5 months', 'Can swim well', 'Gives birth to live young']
            },
            {
                id: '11',
                name: 'Grass Snake',
                scientific_name: 'Natrix natrix',
                continent: 'Europe',
                countries: ['United Kingdom', 'Germany', 'France', 'Poland', 'Netherlands'],
                danger_level: 'Harmless',
                is_venomous: false,
                image_url: 'https://images.unsplash.com/photo-1672697823081-7bbae6d25c1c',
                description: 'Harmless snake commonly found near water sources across Europe.',
                habitat: ['Near water', 'Gardens', 'Compost heaps', 'Woodland edges'],
                size_range: '3-6 feet (0.9-1.8 meters)',
                identification_features: ['Yellow/orange collar behind head', 'Olive-green color', 'Round pupils', 'Smooth scales'],
                behavior: 'Non-venomous and harmless. May play dead when threatened.',
                diet: 'Frogs, toads, fish, small mammals',
                what_to_do: ['Leave it alone', 'Enjoy observing from distance', 'No medical treatment needed if bitten', 'Clean minor wounds'],
                what_not_to_do: ['Don\'t kill - they\'re beneficial', 'Don\'t handle roughly', 'Don\'t be afraid', 'Don\'t confuse with adders'],
                first_aid: ['Clean any bite wound', 'Apply antiseptic', 'No special treatment needed', 'Watch for infection'],
                interesting_facts: ['Excellent swimmer', 'Can hold breath for 30 minutes', 'Releases foul smell when threatened']
            }
        ];

        // Emergency information
        this.emergencyInfo = [
            {
                id: '1',
                title: 'Snake Bite Emergency',
                icon: '🚨',
                priority: 1,
                quick_steps: [
                    'Call emergency services immediately',
                    'Keep victim calm and still',
                    'Remove jewelry near bite site',
                    'Do NOT cut, suck, or apply ice to wound',
                    'Take photo of snake if safe to do so'
                ],
                emergency_numbers: ['911 (US)', '000 (Australia)', '112 (Europe)', '102 (India)']
            },
            {
                id: '2',
                title: 'First Aid Basics',
                icon: '🏥',
                priority: 2,
                quick_steps: [
                    'Keep bite below heart level',
                    'Remove tight clothing/jewelry',
                    'Clean wound gently with water',
                    'Cover with clean, dry bandage',
                    'Monitor breathing and consciousness'
                ],
                emergency_numbers: ['Contact local poison control center']
            },
            {
                id: '3',
                title: 'Snake Encounter Safety',
                icon: '⚠️',
                priority: 3,
                quick_steps: [
                    'Back away slowly - don\'t run',
                    'Give snake space to escape',
                    'Don\'t try to catch or kill snake',
                    'Wear protective footwear in snake areas',
                    'Use flashlight when walking at night'
                ],
                emergency_numbers: ['Local wildlife control services']
            }
        ];

        // Calculate continents
        this.calculateContinents();
    }

    calculateContinents() {
        const continentCounts = {};
        this.snakes.forEach(snake => {
            if (continentCounts[snake.continent]) {
                continentCounts[snake.continent]++;
            } else {
                continentCounts[snake.continent] = 1;
            }
        });

        this.continents = Object.keys(continentCounts).map(continent => ({
            continent: continent,
            count: continentCounts[continent]
        }));
    }

    calculateStats() {
        this.stats = {
            total_snakes: this.snakes.length,
            venomous_snakes: this.snakes.filter(snake => snake.is_venomous).length,
            deadly_snakes: this.snakes.filter(snake => snake.danger_level === 'Deadly').length,
            continents: {}
        };

        this.snakes.forEach(snake => {
            if (this.stats.continents[snake.continent]) {
                this.stats.continents[snake.continent]++;
            } else {
                this.stats.continents[snake.continent] = 1;
            }
        });
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }

    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });

        // Show selected view
        document.getElementById(`${viewName}-view`).classList.remove('hidden');
        this.currentView = viewName;

        // Render content based on view
        switch (viewName) {
            case 'home':
                this.renderHome();
                break;
            case 'snakes':
                this.renderSnakes();
                break;
            case 'snake-detail':
                this.renderSnakeDetail();
                break;
            case 'emergency':
                this.renderEmergency();
                break;
        }
    }

    renderHome() {
        // Update stats
        document.getElementById('total-snakes').textContent = this.stats.total_snakes;
        document.getElementById('venomous-snakes').textContent = this.stats.venomous_snakes;

        // Render continents
        const continentsGrid = document.getElementById('continents-grid');
        continentsGrid.innerHTML = this.continents.map(continent => `
            <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-green-500 card-hover" 
                 onclick="app.handleContinentSelect('${continent.continent}')">
                <h3 class="text-xl font-bold mb-2">${continent.continent}</h3>
                <p class="text-gray-600 mb-4">${continent.count} snake species documented</p>
                <div class="text-green-600 font-semibold">Explore →</div>
            </div>
        `).join('');
    }

    renderSnakes() {
        const snakesGrid = document.getElementById('snakes-grid');
        const snakeCount = document.getElementById('snake-count');
        const snakesTitle = document.getElementById('snakes-title');

        snakeCount.textContent = `${this.filteredSnakes.length} species found`;
        snakesTitle.textContent = this.selectedContinent ? `${this.selectedContinent} Snakes` : 'Search Results';

        snakesGrid.innerHTML = this.filteredSnakes.map(snake => `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow card-hover"
                 onclick="app.handleSnakeSelect('${snake.id}')">
                <img src="${snake.image_url}" alt="${snake.name}" class="snake-image" />
                <div class="p-4">
                    <h3 class="text-lg font-bold mb-1">${snake.name}</h3>
                    <p class="text-sm text-gray-600 italic mb-2">${snake.scientific_name}</p>
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-2 py-1 text-xs rounded-full ${this.getDangerColorClass(snake.danger_level)}">
                            ${snake.danger_level}
                        </span>
                        <span class="text-sm text-gray-600">
                            ${snake.is_venomous ? '⚠️ Venomous' : '✅ Non-venomous'}
                        </span>
                    </div>
                    <p class="text-sm text-gray-700 line-clamp-2">${snake.description}</p>
                </div>
            </div>
        `).join('');
    }

    renderSnakeDetail() {
        if (!this.selectedSnake) return;

        const snake = this.selectedSnake;
        const content = document.getElementById('snake-detail-content');

        content.innerHTML = `
            <!-- Header -->
            <div class="relative">
                <img src="${snake.image_url}" alt="${snake.name}" class="snake-detail-image" />
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <h1 class="text-3xl font-bold text-white mb-2 text-shadow">${snake.name}</h1>
                    <p class="text-xl text-gray-200 italic">${snake.scientific_name}</p>
                </div>
            </div>

            <div class="p-6">
                <!-- Quick Info -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="text-sm text-gray-600">Danger Level</div>
                        <div class="inline-block px-3 py-1 text-sm rounded-full mt-1 ${this.getDangerColorClass(snake.danger_level)}">
                            ${snake.danger_level}
                        </div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="text-sm text-gray-600">Size Range</div>
                        <div class="font-semibold">${snake.size_range}</div>
                    </div>
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <div class="text-sm text-gray-600">Venomous</div>
                        <div class="font-semibold">
                            ${snake.is_venomous ? '⚠️ Yes' : '✅ No'}
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <section class="mb-6">
                    <h2 class="text-xl font-bold mb-3">Description</h2>
                    <p class="text-gray-700 leading-relaxed">${snake.description}</p>
                </section>

                <!-- Location -->
                <section class="mb-6">
                    <h2 class="text-xl font-bold mb-3">Location & Habitat</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 class="font-semibold mb-2">Countries</h3>
                            <div class="flex flex-wrap gap-2">
                                ${snake.countries.map(country => `
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded">${country}</span>
                                `).join('')}
                            </div>
                        </div>
                        <div>
                            <h3 class="font-semibold mb-2">Habitat</h3>
                            <div class="flex flex-wrap gap-2">
                                ${snake.habitat.map(hab => `
                                    <span class="bg-green-100 text-green-800 px-2 py-1 text-sm rounded">${hab}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Identification -->
                <section class="mb-6">
                    <h2 class="text-xl font-bold mb-3">🔍 Identification Features</h2>
                    <ul class="space-y-2">
                        ${snake.identification_features.map(feature => `
                            <li class="flex items-start gap-2">
                                <span class="text-green-600 mt-1">•</span>
                                <span>${feature}</span>
                            </li>
                        `).join('')}
                    </ul>
                </section>

                ${snake.is_venomous ? `
                    <!-- Safety Information -->
                    <div class="safety-section">
                        <h2 class="safety-title">🚨 Safety Information</h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="font-bold text-green-800 mb-2">✅ What TO Do</h3>
                                <ul class="space-y-1">
                                    ${snake.what_to_do.map(action => `
                                        <li class="flex items-start gap-2 text-sm">
                                            <span class="text-green-600 mt-1">✓</span>
                                            <span>${action}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 class="font-bold text-red-800 mb-2">❌ What NOT To Do</h3>
                                <ul class="space-y-1">
                                    ${snake.what_not_to_do.map(action => `
                                        <li class="flex items-start gap-2 text-sm">
                                            <span class="text-red-600 mt-1">✗</span>
                                            <span>${action}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>

                        <div class="mt-4 pt-4 border-t border-red-200">
                            <h3 class="font-bold text-red-800 mb-2">🏥 First Aid Steps</h3>
                            <ol class="space-y-1">
                                ${snake.first_aid.map((step, index) => `
                                    <li class="flex items-start gap-2 text-sm">
                                        <span class="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                            ${index + 1}
                                        </span>
                                        <span>${step}</span>
                                    </li>
                                `).join('')}
                            </ol>
                        </div>
                    </div>
                ` : ''}

                <!-- Behavior and Diet -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <section>
                        <h2 class="text-xl font-bold mb-3">🦎 Behavior</h2>
                        <p class="text-gray-700">${snake.behavior}</p>
                    </section>
                    
                    <section>
                        <h2 class="text-xl font-bold mb-3">🍽️ Diet</h2>
                        <p class="text-gray-700">${snake.diet}</p>
                    </section>
                </div>

                <!-- Interesting Facts -->
                <section>
                    <h2 class="text-xl font-bold mb-3">🤔 Interesting Facts</h2>
                    <ul class="space-y-2">
                        ${snake.interesting_facts.map(fact => `
                            <li class="flex items-start gap-2">
                                <span class="text-blue-600 mt-1">💡</span>
                                <span>${fact}</span>
                            </li>
                        `).join('')}
                    </ul>
                </section>
            </div>
        `;
    }

    renderEmergency() {
        const content = document.getElementById('emergency-content');
        
        content.innerHTML = this.emergencyInfo.map(info => `
            <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                <div class="flex items-center gap-3 mb-4">
                    <span class="text-2xl">${info.icon}</span>
                    <h2 class="text-2xl font-bold">${info.title}</h2>
                </div>
                
                <div class="mb-4">
                    <h3 class="font-bold text-lg mb-2">Quick Steps:</h3>
                    <ol class="space-y-2">
                        ${info.quick_steps.map((step, index) => `
                            <li class="flex items-start gap-2">
                                <span class="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                                    ${index + 1}
                                </span>
                                <span>${step}</span>
                            </li>
                        `).join('')}
                    </ol>
                </div>

                <div>
                    <h3 class="font-bold text-lg mb-2">Emergency Numbers:</h3>
                    <div class="flex flex-wrap gap-2">
                        ${info.emergency_numbers.map(number => `
                            <span class="bg-red-100 text-red-800 px-3 py-1 rounded font-mono">${number}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleContinentSelect(continent) {
        this.selectedContinent = continent;
        this.filteredSnakes = this.snakes.filter(snake => snake.continent === continent);
        this.showView('snakes');
    }

    handleSnakeSelect(snakeId) {
        this.selectedSnake = this.snakes.find(snake => snake.id === snakeId);
        this.showView('snake-detail');
    }

    handleSearch() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredSnakes = this.snakes;
        } else {
            this.filteredSnakes = this.snakes.filter(snake => 
                snake.name.toLowerCase().includes(searchTerm) ||
                snake.scientific_name.toLowerCase().includes(searchTerm) ||
                snake.countries.some(country => country.toLowerCase().includes(searchTerm))
            );
        }
        
        this.selectedContinent = '';
        this.showView('snakes');
    }

    getDangerColorClass(dangerLevel) {
        switch (dangerLevel) {
            case 'Harmless': return 'badge-harmless';
            case 'Mildly Venomous': return 'badge-mildly-venomous';
            case 'Venomous': return 'badge-venomous';
            case 'Highly Venomous': return 'badge-highly-venomous';
            case 'Deadly': return 'badge-deadly';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SerpentAware();
});