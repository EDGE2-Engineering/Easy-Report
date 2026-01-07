
export const initialProducts = [
    {
        id: 'P1',
        title: 'A2 Desi Cow Ghee',
        category: 'Ghee',
        price: 1500,
        weight: '500ml',
        stock: 50,
        description: 'Pure A2 chemical-free hand-churned Ghee from free-grazing Hallikar cows. Made using the traditional Bilona method.',
        ingredients: 'A2 Cow Milk Butter',
        benefits: 'Boosts immunity, improves digestion, good for skin, balances Vata and Pitta doshas.',
        images: [
            'https://ueirorganic.com/cdn/shop/files/a2desicowghee.jpg?v=1697902974'
        ],
        featured: true,
        status: 'In Stock'
    },
    {
        id: 'P2',
        title: 'Wild Forest Honey',
        category: 'Honey',
        price: 850,
        weight: '500g',
        stock: 100,
        description: 'Raw, unprocessed honey collected from deep forests. Rich in antioxidants and enzymes.',
        ingredients: '100% Raw Honey',
        benefits: 'Natural sweetener, soothes coughs, boosts energy, promotes wound healing.',
        images: [
            'https://cpimg.tistatic.com/10619973/b/4/Wild-Forest-Honey..jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqyq6jyGXSx-ODT8wWm5QjhQNFjMAJSYvTkA&s'
        ],
        featured: true,
        status: 'In Stock'
    },
    {
        id: 'P3',
        title: 'Cold Pressed Coconut Oil',
        category: 'Oil',
        price: 450,
        weight: '1L',
        stock: 80,
        description: 'Extracted from fresh coconut milk using cold press technology to retain vital nutrients and aroma.',
        ingredients: '100% Coconut Oil',
        benefits: 'Great for cooking, hair care, and skin moisturizing. High in healthy fatty acids.',
        images: [
            'https://honeyandspice.in/cdn/shop/files/Cold_pressed_Coconut_Oil_2__125_11zon.jpg?v=1739255180&width=1080',
            'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80'
        ],
        featured: false,
        status: 'In Stock'
    },
    {
        id: 'P4',
        title: 'Organic Palm Jaggery',
        category: 'Sweeteners',
        price: 300,
        weight: '1kg',
        stock: 150,
        description: 'Natural sweetener made from the sap of palm trees. a healthy alternative to white sugar.',
        ingredients: 'Palm Sap',
        benefits: 'Rich in iron and minerals, aids digestion, cleanses the respiratory tract.',
        images: [
            'https://organicmandya.com/cdn/shop/files/Palmjaggery_1_a09582e9-873c-412a-b922-5c9e5c1d2d74.jpg?v=1757083528&width=1000'
        ],
        featured: false,
        status: 'In Stock'
    },
    {
        id: 'P5',
        title: 'Wood Pressed Groundnut Oil',
        category: 'Oil',
        price: 380,
        weight: '1L',
        stock: 60,
        description: 'Traditional wood pressed groundnut oil (Mara Chekku) with rich aroma and nutty flavor.',
        ingredients: 'Groundnuts',
        benefits: 'Heart-healthy, high smoke point for frying, rich in Vitamin E.',
        images: [
            'https://www.anveshan.farm/cdn/shop/files/Artboard_12_6.jpg?v=1763560050&width=990'
        ],
        featured: true,
        status: 'In Stock'
    },
    {
        id: 'P6',
        title: 'Turmeric Powder',
        category: 'Spices',
        price: 250,
        weight: '250g',
        stock: 200,
        description: 'High curcumin content turmeric powder sourced from organic farms.',
        ingredients: 'Turmeric',
        benefits: 'Potent anti-inflammatory and antioxidant properties.',
        images: [
            'https://organictattva.com/cdn/shop/files/Website-lifestyle-images-turmeric-powder.jpg?v=1765784743&width=1780'
        ],
        featured: false,
        status: 'In Stock'
    }
];

export const getProducts = () => {
    const stored = localStorage.getItem('products');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
            console.error("Error parsing stored products", e);
        }
    }
    return initialProducts;
};

export const saveProducts = (products) => {
    localStorage.setItem('products', JSON.stringify(products));
    window.dispatchEvent(new Event('storage'));
};
