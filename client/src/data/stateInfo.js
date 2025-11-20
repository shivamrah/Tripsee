const STATE_INFO = {
    "Andhra Pradesh": {
        description:
            "A southeastern state known for its long coastline, historic temples and cuisine.",
        imageQuery: "Andhra Pradesh city",
        imagePath: "/state-images/Andhra_Pradesh.svg",
        attractions: [
            { name: "Tirupati Balaji Temple", price: 300 },
            { name: "Araku Valley", price: 800 },
            { name: "Borra Caves", price: 600 },
            { name: "RK Beach (Visakhapatnam)", price: 200 },
            { name: "Amaravati Buddhist Monuments", price: 250 },
            { name: "Srisailam", price: 400 }
        ],
    },
    "Arunachal Pradesh": {
        description: "A Himalayan state with lush valleys, tribal culture and mountain views.",
        imageQuery: "Arunachal Pradesh landscape",
        imagePath: "/state-images/Arunachal_Pradesh.svg",
        attractions: [
            { name: "Tawang Monastery", price: 350 },
            { name: "Ziro Valley", price: 700 },
            { name: "Namdapha National Park", price: 900 },
            { name: "Sela Pass", price: 300 },
            { name: "Dirang", price: 250 },
            { name: "Bomdila", price: 300 }
        ],
    },
    Assam: {
        description: "Northeastern state known for tea gardens, wildlife and the Brahmaputra River.",
        imageQuery: "Assam tea garden",
        imagePath: "/state-images/Assam.svg",
        attractions: [
            { name: "Kaziranga National Park", price: 1200 },
            { name: "Majuli Island", price: 500 },
            { name: "Kamakhya Temple", price: 150 },
            { name: "Hajo", price: 200 },
            { name: "Sivasagar", price: 250 },
            { name: "Manas National Park", price: 1100 }
        ],
    },
    Bihar: {
        description: "An eastern state with rich historical sites and Buddhist heritage.",
        imageQuery: "Bihar heritage site",
        imagePath: "/state-images/Bihar.svg",
        attractions: [
            { name: "Bodh Gaya", price: 200 },
            { name: "Nalanda University ruins", price: 300 },
            { name: "Vaishali", price: 180 },
            { name: "Rajgir", price: 220 },
            { name: "Patna Sahib Gurudwara", price: 150 },
            { name: "Sonepur Mela", price: 400 }
        ],
    },
    "Chhattisgarh": {
        description: "Central Indian state known for forests, waterfalls and tribal traditions.",
        imageQuery: "Chhattisgarh waterfall",
        imagePath: "/state-images/Chhattisgarh.svg",
        attractions: [
            { name: "Chitrakote Falls", price: 350 },
            { name: "Barnawapara Wildlife Sanctuary", price: 800 },
            { name: "Bastar", price: 300 },
            { name: "Kanger Valley National Park", price: 700 },
            { name: "Sirpur", price: 200 },
            { name: "Danteshwari Temple", price: 150 }
        ],
    },
    Goa: {
        description: "A small coastal state famous for beaches, seafood and Portuguese heritage.",
        imageQuery: "Goa beach",
        imagePath: "/state-images/Goa.svg",
        attractions: [
            { name: "Baga Beach", price: 300 },
            { name: "Old Goa Basilica", price: 150 },
            { name: "Dudhsagar Falls", price: 400 },
            { name: "Calangute Beach", price: 250 },
            { name: "Fort Aguada", price: 200 },
            { name: "Palolem Beach", price: 300 }
        ],
    },
    Gujarat: {
        description: "Western state known for vibrant culture, handicrafts and the Rann of Kutch.",
        imageQuery: "Gujarat landscape",
        imagePath: "/state-images/Gujarat.svg",
        attractions: [
            { name: "Rann of Kutch", price: 600 },
            { name: "Gir National Park", price: 1000 },
            { name: "Somnath Temple", price: 200 },
            { name: "Sabarmati Ashram", price: 150 },
            { name: "Dwarka", price: 300 },
            { name: "Modhera Sun Temple", price: 180 }
        ],
    },
    Haryana: {
        description: "A north Indian state surrounding Delhi, with historic sites and agriculture.",
        imageQuery: "Haryana city",
        imagePath: "/state-images/Haryana.svg",
        attractions: [
            { name: "Kurukshetra", price: 120 },
            { name: "Sultanpur National Park", price: 200 },
            { name: "Pinjore Gardens", price: 150 },
            { name: "Panipat", price: 100 },
            { name: "Brahma Sarovar", price: 80 },
            { name: "Pehowa", price: 90 }
        ],
    },
    "Himachal Pradesh": {
        description: "A Himalayan state popular for hill stations, trekking and mountain scenery.",
        imageQuery: "Himachal Pradesh mountains",
        imagePath: "/state-images/Himachal_Pradesh.svg",
        attractions: [
            { name: "Shimla", price: 400 },
            { name: "Manali", price: 450 },
            { name: "Dharamshala", price: 350 },
            { name: "Spiti Valley", price: 1200 },
            { name: "Kullu", price: 300 },
            { name: "Kasol", price: 220 }
        ],
    },
    Jharkhand: {
        description: "A state with forests, waterfalls and mineral resources.",
        imageQuery: "Jharkhand waterfall",
        imagePath: "/state-images/Jharkhand.svg",
        attractions: [
            { name: "Betla National Park", price: 700 },
            { name: "Dassam Falls", price: 200 },
            { name: "Ranchi Rock Garden", price: 120 },
            { name: "Deoghar", price: 180 },
            { name: "Hazaribagh National Park", price: 600 },
            { name: "Jonha Falls", price: 150 }
        ],
    },
    Karnataka: {
        description: "A tech and cultural hub with beaches, historic sites and rich cuisine.",
        imageQuery: "Karnataka Bangalore",
        imagePath: "/state-images/Karnataka.svg",
        attractions: [
            { name: "Hampi", price: 500 },
            { name: "Mysore Palace", price: 250 },
            { name: "Coorg", price: 600 },
            { name: "Gokarna", price: 200 },
            { name: "Badami", price: 220 },
            { name: "Bandipur National Park", price: 900 }
        ],
    },
    Kerala: {
        description: "A southwestern coastal state known for backwaters, spices and lush greenery.",
        imageQuery: "Kerala backwaters",
        imagePath: "/state-images/Kerala.svg",
        attractions: [
            { name: "Alleppey backwaters", price: 700 },
            { name: "Munnar", price: 450 },
            { name: "Kovalam Beach", price: 200 },
            { name: "Fort Kochi", price: 150 },
            { name: "Thekkady", price: 550 },
            { name: "Varkala", price: 250 }
        ],
    },
    "Madhya Pradesh": {
        description: "A central state with wildlife reserves, temples and historic cities.",
        imageQuery: "Madhya Pradesh wildlife",
        imagePath: "/state-images/Madhya_Pradesh.svg",
        attractions: [
            { name: "Khajuraho Temples", price: 300 },
            { name: "Bandhavgarh National Park", price: 1000 },
            { name: "Sanchi Stupa", price: 150 },
            { name: "Pench National Park", price: 800 },
            { name: "Orchha", price: 200 },
            { name: "Bhimbetka Rock Shelters", price: 180 }
        ],
    },
    Maharashtra: {
        description: "A large western state home to Mumbai, forts and diverse cultures.",
        imageQuery: "Maharashtra Mumbai",
        imagePath: "/state-images/Maharashtra.svg",
        attractions: [
            { name: "Gateway of India (Mumbai)", price: 250 },
            { name: "Ajanta & Ellora Caves", price: 800 },
            { name: "Mahabaleshwar", price: 300 },
            { name: "Lonavala", price: 220 },
            { name: "Pune (Aga Khan Palace)", price: 180 },
            { name: "Elephanta Caves", price: 200 }
        ],
    },
    Manipur: {
        description: "A northeastern state known for its dance, lakes and ethnic diversity.",
        imageQuery: "Manipur lake",
        imagePath: "/state-images/Manipur.svg",
        attractions: [
            { name: "Loktak Lake", price: 250 },
            { name: "Imphal War Cemetery", price: 100 },
            { name: "Khonghampat Orchidarium", price: 120 },
            { name: "Shirui Kashong Peak", price: 400 },
            { name: "Keibul Lamjao National Park", price: 600 },
            { name: "Kangla Fort", price: 80 }
        ],
    },
    Meghalaya: {
        description: "Known for living root bridges, high rainfall and scenic hills.",
        imageQuery: "Meghalaya hills",
        imagePath: "/state-images/Meghalaya.svg",
        attractions: [
            { name: "Living Root Bridges", price: 350 },
            { name: "Shillong", price: 220 },
            { name: "Cherrapunji", price: 200 },
            { name: "Mawlynnong", price: 150 },
            { name: "Nongriat", price: 300 },
            { name: "Dawki", price: 180 }
        ],
    },
    Mizoram: {
        description: "A hilly northeastern state with tribal cultures and forested landscapes.",
        imageQuery: "Mizoram hills",
        imagePath: "/state-images/Mizoram.svg",
        attractions: [
            { name: "Aizawl", price: 200 },
            { name: "Vantawng Falls", price: 180 },
            { name: "Dampa Tiger Reserve", price: 700 },
            { name: "Phawngpui (Blue Mountain)", price: 450 },
            { name: "Reiek", price: 150 },
            { name: "Khawzawl Falls", price: 120 }
        ],
    },
    Nagaland: {
        description: "A northeastern state celebrated for festivals, crafts and mountains.",
        imageQuery: "Nagaland festival",
        imagePath: "/state-images/Nagaland.svg",
        attractions: [
            { name: "Hornbill Festival", price: 500 },
            { name: "Kohima War Cemetery", price: 100 },
            { name: "Dzükou Valley", price: 300 },
            { name: "Mon", price: 200 },
            { name: "Naga Heritage Village", price: 180 },
            { name: "Mokokchung", price: 150 }
        ],
    },
    Odisha: {
        description: "An eastern coastal state with temples, beaches and classical art.",
        imageQuery: "Odisha temple",
        imagePath: "/state-images/Odisha.svg",
        attractions: [
            { name: "Konark Sun Temple", price: 180 },
            { name: "Puri", price: 220 },
            { name: "Chilika Lake", price: 400 },
            { name: "Dhauli", price: 120 },
            { name: "Bhitarkanika National Park", price: 700 },
            { name: "Lingaraja Temple", price: 150 }
        ],
    },
    Punjab: {
        description: "A northwestern state famed for its Punjabi culture, food and fields.",
        imageQuery: "Punjab fields",
        imagePath: "/state-images/Punjab.svg",
        attractions: [
            { name: "Golden Temple (Amritsar)", price: 0 },
            { name: "Wagah Border", price: 100 },
            { name: "Anandpur Sahib", price: 80 },
            { name: "Jallianwala Bagh", price: 50 },
            { name: "Patiala", price: 120 },
            { name: "Bathinda Fort", price: 90 }
        ],
    },
    Rajasthan: {
        description: "A desert state with palaces, forts and vibrant folk traditions.",
        imageQuery: "Rajasthan forts",
        imagePath: "/state-images/Rajasthan.svg",
        attractions: [
            { name: "Jaipur City Palace", price: 250 },
            { name: "Jaisalmer Fort", price: 200 },
            { name: "Udaipur Lake Pichola", price: 300 },
            { name: "Pushkar", price: 180 },
            { name: "Jodhpur", price: 220 },
            { name: "Bikaner", price: 200 }
        ],
    },
    Sikkim: {
        description: "A small Himalayan state known for monasteries, trekking and mountain vistas.",
        imageQuery: "Sikkim mountains",
        imagePath: "/state-images/Sikkim.svg",
        attractions: [
            { name: "Gangtok", price: 300 },
            { name: "Tsomgo Lake", price: 250 },
            { name: "Nathu La Pass", price: 800 },
            { name: "Yuksom", price: 200 },
            { name: "Pelling", price: 220 },
            { name: "Lachung", price: 260 }
        ],
    },
    "Tamil Nadu": {
        description: "A southern state with Dravidian temples, classical arts and coastline.",
        imageQuery: "Tamil Nadu temple",
        imagePath: "/state-images/Tamil_Nadu.svg",
        attractions: [
            { name: "Meenakshi Temple (Madurai)", price: 100 },
            { name: "Mahabalipuram", price: 200 },
            { name: "Ooty", price: 400 },
            { name: "Kanyakumari", price: 220 },
            { name: "Kodaikanal", price: 300 },
            { name: "Rameswaram", price: 180 }
        ],
    },
    Telangana: {
        description: "A southern state with a mix of IT hubs, historic sites and cuisine.",
        imageQuery: "Telangana Hyderabad",
        imagePath: "/state-images/Telangana.svg",
        attractions: [
            { name: "Charminar (Hyderabad)", price: 80 },
            { name: "Golconda Fort", price: 150 },
            { name: "Ramoji Film City", price: 1200 },
            { name: "Hussain Sagar", price: 100 },
            { name: "Warangal Fort", price: 200 },
            { name: "Bhadrachalam", price: 160 }
        ],
    },
    Tripura: {
        description: "A small northeastern state with palaces, hills and cultural heritage.",
        imageQuery: "Tripura palace",
        imagePath: "/state-images/Tripura.svg",
        attractions: [
            { name: "Ujjayanta Palace", price: 120 },
            { name: "Neermahal", price: 300 },
            { name: "Unakoti", price: 180 },
            { name: "Sepahijala Wildlife Sanctuary", price: 500 },
            { name: "Jampui Hills", price: 200 },
            { name: "Chabimura", price: 150 }
        ],
    },
    "Uttar Pradesh": {
        description: "A populous northern state with historic cities and religious sites.",
        imageQuery: "Uttar Pradesh taj mahal",
        imagePath: "/state-images/Uttar_Pradesh.svg",
        attractions: [
            { name: "Taj Mahal (Agra)", price: 250 },
            { name: "Varanasi Ghats", price: 200 },
            { name: "Fatehpur Sikri", price: 180 },
            { name: "Agra Fort", price: 150 },
            { name: "Sarnath", price: 120 },
            { name: "Lucknow (Bara Imambara)", price: 200 }
        ],
    },
    Uttarakhand: {
        description: "A Himalayan state with pilgrimage sites, hill stations and valleys.",
        imageQuery: "Uttarakhand mountains",
        imagePath: "/state-images/Uttarakhand.svg",
        attractions: [
            { name: "Haridwar & Rishikesh", price: 180 },
            { name: "Nainital", price: 220 },
            { name: "Valley of Flowers", price: 600 },
            { name: "Auli", price: 400 },
            { name: "Mussoorie", price: 250 },
            { name: "Jim Corbett National Park", price: 900 }
        ],
    },
    "West Bengal": {
        description: "An eastern state known for Kolkata, culture, tea gardens and the Sundarbans.",
        imageQuery: "West Bengal Kolkata",
        imagePath: "/state-images/West_Bengal.svg",
        attractions: [
            { name: "Victoria Memorial (Kolkata)", price: 100 },
            { name: "Darjeeling", price: 350 },
            { name: "Sundarbans", price: 800 },
            { name: "Dakshineswar Kali Temple", price: 50 },
            { name: "Santiniketan", price: 200 },
            { name: "Mirik", price: 150 }
        ],
    },
};

export default STATE_INFO;
