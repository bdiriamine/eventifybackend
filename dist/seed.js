"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const users_service_1 = require("./users/users.service");
const halls_service_1 = require("./halls/halls.service");
const services_service_1 = require("./services/services.service");
const products_service_1 = require("./products/products.service");
const bcrypt = require("bcryptjs");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const hallsService = app.get(halls_service_1.HallsService);
    const servicesService = app.get(services_service_1.ServicesService);
    const productsService = app.get(products_service_1.ProductsService);
    console.log('🌱 Seeding database...');
    let admin, manager;
    const findOrCreate = async (email, data) => {
        const existing = await usersService.findByEmail(email);
        if (existing) {
            console.log(`   ↳ ${email} already exists`);
            return existing;
        }
        const created = await usersService.create(data);
        console.log(`   ✅ Created ${email}`);
        return created;
    };
    admin = await findOrCreate('admin@eventify.tn', { name: 'Admin Eventify', email: 'admin@eventify.tn', password: await bcrypt.hash('Admin123!', 12), role: 'admin' });
    manager = await findOrCreate('manager@eventify.tn', { name: 'Manager Palais', email: 'manager@eventify.tn', password: await bcrypt.hash('Manager123!', 12), role: 'manager' });
    await findOrCreate('client@eventify.tn', { name: 'Sarra Ben Ali', email: 'client@eventify.tn', password: await bcrypt.hash('Client123!', 12), role: 'client', nationalId: '12345678', phone: '+216 22 000 000', city: 'Tunis' });
    const existingHalls = await hallsService.findAll(true);
    if (existingHalls.length === 0) {
        const managerId = manager._id.toString();
        const halls = [
            { name: 'Palais des Jasmin', location: 'Tunis, La Marsa', capacity: 500, price: 3500, managerId, description: 'Salle de luxe avec vue sur la mer.', images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600'], tags: ['wedding', 'conference'], rating: 4.8, reviewCount: 124 },
            { name: 'Villa Carthage', location: 'Carthage, Tunis', capacity: 200, price: 2200, managerId, description: 'Villa historique au cœur de Carthage.', images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600'], tags: ['wedding', 'henna'], rating: 4.6, reviewCount: 89 },
            { name: 'Le Méditerranée', location: 'Hammamet', capacity: 800, price: 5000, description: 'Complexe avec jardin et vue mer.', images: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600'], tags: ['concert', 'wedding'], rating: 4.9, reviewCount: 203 },
            { name: 'Salle Ibn Khaldoun', location: 'Sfax', capacity: 350, price: 1800, description: 'Salle moderne pour conférences.', images: ['https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600'], tags: ['conference', 'concert'], rating: 4.5, reviewCount: 67 },
        ];
        for (const h of halls) {
            await hallsService.create(h);
        }
        console.log(`   ✅ Created ${halls.length} halls`);
    }
    else {
        console.log(`   ↳ ${existingHalls.length} halls already exist`);
    }
    const existingServices = await servicesService.findAll(true);
    if (existingServices.length === 0) {
        const services = [
            { name: 'Pack Photo Basique', category: 'photography', price: 400, features: ['1 caméra', '100 photos HD'], eventTypes: ['wedding', 'henna', 'concert', 'conference'] },
            { name: 'Pack Photo Standard', category: 'photography', price: 800, features: ['2 caméras', 'Vidéo HD'], eventTypes: ['wedding', 'henna', 'concert', 'conference'] },
            { name: 'Pack Photo Premium', category: 'photography', price: 1500, features: ['3 caméras', 'Drone', 'Vidéo 4K'], eventTypes: ['wedding', 'concert'] },
            { name: 'Décor Mariage', category: 'decoration', price: 1200, features: ['Arc floral', 'LED', 'Roses'], eventTypes: ['wedding'] },
            { name: 'Décor Henna', category: 'decoration', price: 600, features: ['Bougies', 'Fleurs', 'Tissus'], eventTypes: ['henna'] },
            { name: 'Décor Conférence', category: 'decoration', price: 500, features: ['Podium', 'Bannières'], eventTypes: ['conference'] },
            { name: 'Formule Traiteur Simple', category: 'catering', price: 25, priceUnit: '/pers', features: ['Buffet froid'], eventTypes: ['wedding', 'henna', 'conference'] },
            { name: 'Formule Traiteur Std', category: 'catering', price: 55, priceUnit: '/pers', features: ['Buffet complet'], eventTypes: ['wedding', 'conference'] },
            { name: 'Formule Traiteur Premium', category: 'catering', price: 95, priceUnit: '/pers', features: ['Gastronomique', 'Chef'], eventTypes: ['wedding'] },
            { name: 'Soft Drinks', category: 'drinks', price: 5, priceUnit: '/pers', features: ['Cola, Eau'], eventTypes: ['wedding', 'henna', 'concert', 'conference'] },
            { name: 'Café & Thé', category: 'drinks', price: 8, priceUnit: '/pers', features: ['Café tunisien'], eventTypes: ['conference', 'henna'] },
            { name: 'Bar Complet', category: 'drinks', price: 18, priceUnit: '/pers', features: ['Toutes boissons'], eventTypes: ['wedding', 'concert'] },
            { name: '2 Serveurs', category: 'servers', price: 300, features: ['2 serveurs, 5h'], eventTypes: ['wedding', 'henna', 'conference'] },
            { name: '5 Serveurs', category: 'servers', price: 650, features: ['5 serveurs'], eventTypes: ['wedding', 'concert'] },
            { name: 'Équipe Complète (10)', category: 'servers', price: 1200, features: ['10 serveurs'], eventTypes: ['wedding'] },
            { name: 'DJ Set', category: 'entertainment', price: 800, features: ['DJ pro, 4h'], eventTypes: ['wedding', 'concert'] },
            { name: 'Chanteur Live', category: 'entertainment', price: 1200, features: ['2h spectacle'], eventTypes: ['wedding', 'concert'] },
            { name: 'Groupe Musical', category: 'entertainment', price: 2500, features: ['5 musiciens, 3h'], eventTypes: ['wedding'] },
        ];
        for (const s of services) {
            await servicesService.create(s);
        }
        console.log(`   ✅ Created ${services.length} services`);
    }
    else {
        console.log(`   ↳ ${existingServices.length} services already exist`);
    }
    const existingProducts = await productsService.findAll(true);
    if (existingProducts.length === 0) {
        const products = [
            { name: 'Chaises Thonet', price: 5, priceUnit: '/unité', icon: '🪑', category: 'Mobilier', stock: 200 },
            { name: 'Tables Rondes', price: 35, priceUnit: '/unité', icon: '⬜', category: 'Mobilier', stock: 50 },
            { name: 'Système Sonore', price: 400, priceUnit: '/jour', icon: '🔊', category: 'Technique', stock: 5 },
            { name: 'Éclairage LED', price: 250, priceUnit: '/jour', icon: '💡', category: 'Technique', stock: 10 },
            { name: 'Nappes Brodées', price: 15, priceUnit: '/unité', icon: '🎀', category: 'Décoration', stock: 100 },
        ];
        for (const p of products) {
            await productsService.create(p);
        }
        console.log(`   ✅ Created ${products.length} products`);
    }
    else {
        console.log(`   ↳ ${existingProducts.length} products already exist`);
    }
    console.log('\n🎉 Seed complete!');
    console.log('   admin@eventify.tn    / Admin123!');
    console.log('   manager@eventify.tn  / Manager123!');
    console.log('   client@eventify.tn   / Client123!');
    await app.close();
}
seed().catch(e => { console.error(e); process.exit(1); });
//# sourceMappingURL=seed.js.map