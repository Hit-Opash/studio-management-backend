require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Worker = require('./models/Worker');
const EventWorker = require('./models/EventWorker');
const Expense = require('./models/Expense');
const Payment = require('./models/Payment');
const Package = require('./models/Package');
const Equipment = require('./models/Equipment');
const Lead = require('./models/Lead');
const Settings = require('./models/Settings');
const moment = require('moment');

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
        Event.deleteMany({}), Worker.deleteMany({}), EventWorker.deleteMany({}),
        Expense.deleteMany({}), Payment.deleteMany({}), Package.deleteMany({}),
        Equipment.deleteMany({}), Lead.deleteMany({}), Settings.deleteMany({})
    ]);

    // Settings
    const settings = await Settings.create({
        companyName: 'PixelPerfect Studios',
        businessPhone: '+91 98765 43210',
        businessEmail: 'hello@pixelperfect.com',
        address: '42 MG Road, Bangalore, Karnataka 560001',
        currency: 'INR',
        currencySymbol: '₹'
    });

    // Packages
    const packages = await Package.insertMany([
        { name: 'Silver Package', description: 'Basic photography coverage', price: 25000, includedServices: ['4 hours coverage', '100 edited photos', 'Online gallery'], duration: '4 hours' },
        { name: 'Gold Package', description: 'Full day photography with album', price: 50000, includedServices: ['8 hours coverage', '300 edited photos', 'Photo album', 'Online gallery', 'Pre-event shoot'], duration: '8 hours' },
        { name: 'Platinum Package', description: 'Complete photography + videography', price: 100000, includedServices: ['Full day coverage', '500+ edited photos', 'Premium album', 'Highlight video', 'Drone shots', 'Pre-event shoot'], duration: 'Full day' },
        { name: 'Portrait Session', description: 'Studio portrait session', price: 5000, includedServices: ['1 hour session', '20 edited photos', 'Digital delivery'], duration: '1 hour' },
        { name: 'Corporate Event', description: 'Corporate event coverage', price: 35000, includedServices: ['6 hours coverage', '200 edited photos', 'Same-day previews', 'Online gallery'], duration: '6 hours' }
    ]);

    // Workers
    const workers = await Worker.insertMany([
        { name: 'Arjun Sharma', phone: '+91 99887 76655', email: 'arjun@pixelperfect.com', role: 'Photographer', salaryType: 'Per Event', salaryAmount: 5000 },
        { name: 'Priya Patel', phone: '+91 99776 65544', email: 'priya@pixelperfect.com', role: 'Photographer', salaryType: 'Monthly', salaryAmount: 40000 },
        { name: 'Rahul Kumar', phone: '+91 99665 54433', email: 'rahul@pixelperfect.com', role: 'Videographer', salaryType: 'Per Event', salaryAmount: 6000 },
        { name: 'Sneha Reddy', phone: '+91 99554 43322', email: 'sneha@pixelperfect.com', role: 'Editor', salaryType: 'Monthly', salaryAmount: 35000 },
        { name: 'Vikram Singh', phone: '+91 99443 32211', email: 'vikram@pixelperfect.com', role: 'Assistant', salaryType: 'Per Day', salaryAmount: 1500 },
        { name: 'Meera Nair', phone: '+91 99332 21100', email: 'meera@pixelperfect.com', role: 'Photographer', salaryType: 'Per Event', salaryAmount: 4500 }
    ]);

    // Events
    const eventData = [
        { clientName: 'Rajesh & Anita', clientPhone: '+91 98765 11111', clientEmail: 'rajesh@email.com', clientAddress: 'HSR Layout, Bangalore', eventType: 'Wedding', eventDate: moment().add(1, 'days').toDate(), eventTime: '09:00 AM', eventDuration: 'Full Day', venueName: 'Royal Orchid Resort', venueAddress: 'Yelahanka, Bangalore', latitude: 13.1007, longitude: 77.5963, packagePrice: 100000, extraCharges: 15000, discount: 5000, advancePayment: 50000, status: 'Upcoming', eventNotes: 'Outdoor ceremony, need drone shots' },
        { clientName: 'Deepak Mehta', clientPhone: '+91 98765 22222', clientEmail: 'deepak@email.com', eventType: 'Corporate', eventDate: moment().add(3, 'days').toDate(), eventTime: '10:00 AM', eventDuration: '6 hours', venueName: 'Taj West End', venueAddress: 'Race Course Road, Bangalore', latitude: 12.9716, longitude: 77.5946, packagePrice: 35000, extraCharges: 5000, discount: 0, advancePayment: 20000, status: 'Upcoming' },
        { clientName: 'Kavitha & Suresh', clientPhone: '+91 98765 33333', clientEmail: 'kavitha@email.com', eventType: 'Engagement', eventDate: moment().toDate(), eventTime: '05:00 PM', eventDuration: '4 hours', venueName: 'Leela Palace', venueAddress: 'HAL Airport Road, Bangalore', latitude: 12.9611, longitude: 77.6472, packagePrice: 25000, extraCharges: 3000, discount: 2000, advancePayment: 15000, status: 'Upcoming' },
        { clientName: 'Amit Joshi', clientPhone: '+91 98765 44444', clientEmail: 'amit@email.com', eventType: 'Birthday', eventDate: moment().add(7, 'days').toDate(), eventTime: '06:00 PM', eventDuration: '3 hours', venueName: 'Fun World', venueAddress: 'JC Nagar, Bangalore', packagePrice: 15000, extraCharges: 2000, discount: 0, advancePayment: 5000, status: 'Upcoming' },
        { clientName: 'Nisha & Karthik', clientPhone: '+91 98765 55555', clientEmail: 'nisha@email.com', eventType: 'Pre-Wedding', eventDate: moment().add(2, 'days').toDate(), eventTime: '06:30 AM', eventDuration: '5 hours', venueName: 'Nandi Hills', venueAddress: 'Nandi Hills, Chikkaballapur', latitude: 13.3702, longitude: 77.6835, packagePrice: 30000, extraCharges: 10000, discount: 0, advancePayment: 20000, status: 'Upcoming' },
        { clientName: 'Sanjay Gupta', clientPhone: '+91 98765 66666', clientEmail: 'sanjay@email.com', eventType: 'Corporate', eventDate: moment().subtract(5, 'days').toDate(), eventTime: '09:00 AM', eventDuration: '8 hours', venueName: 'ITC Gardenia', venueAddress: 'Residency Road, Bangalore', packagePrice: 50000, extraCharges: 0, discount: 5000, advancePayment: 45000, status: 'Completed' },
        { clientName: 'Pooja & Ravi', clientPhone: '+91 98765 77777', clientEmail: 'pooja@email.com', eventType: 'Wedding', eventDate: moment().subtract(10, 'days').toDate(), eventTime: '10:00 AM', eventDuration: 'Full Day', venueName: 'Palace Grounds', venueAddress: 'Sadashivanagar, Bangalore', packagePrice: 100000, extraCharges: 20000, discount: 10000, advancePayment: 110000, status: 'Completed' },
        { clientName: 'Lakshmi Iyer', clientPhone: '+91 98765 88888', clientEmail: 'lakshmi@email.com', eventType: 'Baby Shower', eventDate: moment().subtract(3, 'days').toDate(), eventTime: '11:00 AM', eventDuration: '3 hours', venueName: 'Home', venueAddress: 'Koramangala, Bangalore', packagePrice: 15000, extraCharges: 0, discount: 0, advancePayment: 15000, status: 'Completed' },
        { clientName: 'Vikram & Divya', clientPhone: '+91 98765 99999', clientEmail: 'vikram.d@email.com', eventType: 'Wedding', eventDate: moment().subtract(15, 'days').toDate(), eventTime: '08:00 AM', eventDuration: 'Full Day', venueName: 'Bangalore Palace', venueAddress: 'Vasanth Nagar, Bangalore', packagePrice: 100000, extraCharges: 25000, discount: 15000, advancePayment: 80000, status: 'Completed' },
        { clientName: 'Mohan Das', clientPhone: '+91 98765 00000', clientEmail: 'mohan@email.com', eventType: 'Portrait', eventDate: moment().subtract(1, 'days').toDate(), eventTime: '02:00 PM', eventDuration: '2 hours', venueName: 'Studio', venueAddress: 'MG Road, Bangalore', packagePrice: 5000, extraCharges: 1000, discount: 0, advancePayment: 6000, status: 'Completed' },
        { clientName: 'Arun Kumar', clientPhone: '+91 88765 11111', clientEmail: 'arun@email.com', eventType: 'Wedding', eventDate: moment().add(14, 'days').toDate(), eventTime: '09:00 AM', eventDuration: 'Full Day', venueName: 'Convention Center', venueAddress: 'Whitefield, Bangalore', packagePrice: 100000, extraCharges: 10000, discount: 5000, advancePayment: 30000, status: 'Upcoming' },
        { clientName: 'Fatima Sheikh', clientPhone: '+91 88765 22222', clientEmail: 'fatima@email.com', eventType: 'Fashion', eventDate: moment().add(5, 'days').toDate(), eventTime: '03:00 PM', eventDuration: '4 hours', venueName: 'Studio 42', venueAddress: 'Indiranagar, Bangalore', packagePrice: 20000, extraCharges: 5000, discount: 0, advancePayment: 10000, status: 'Upcoming' }
    ];

    const events = [];
    for (const data of eventData) {
        const event = new Event(data);
        await event.save();
        events.push(event);
    }

    // Event Worker Assignments
    const assignments = [
        { event: events[0]._id, worker: workers[0]._id, role: 'Lead Photographer', payment: 8000 },
        { event: events[0]._id, worker: workers[2]._id, role: 'Videographer', payment: 6000 },
        { event: events[0]._id, worker: workers[4]._id, role: 'Assistant', payment: 2000 },
        { event: events[1]._id, worker: workers[1]._id, role: 'Photographer', payment: 5000 },
        { event: events[2]._id, worker: workers[0]._id, role: 'Photographer', payment: 4000 },
        { event: events[2]._id, worker: workers[4]._id, role: 'Assistant', payment: 1500 },
        { event: events[3]._id, worker: workers[5]._id, role: 'Photographer', payment: 3000 },
        { event: events[4]._id, worker: workers[0]._id, role: 'Photographer', payment: 6000 },
        { event: events[4]._id, worker: workers[2]._id, role: 'Videographer', payment: 5000 },
        { event: events[5]._id, worker: workers[1]._id, role: 'Photographer', payment: 5000 },
        { event: events[6]._id, worker: workers[0]._id, role: 'Lead Photographer', payment: 8000 },
        { event: events[6]._id, worker: workers[1]._id, role: 'Second Photographer', payment: 5000 },
        { event: events[6]._id, worker: workers[2]._id, role: 'Videographer', payment: 6000 },
    ];
    await EventWorker.insertMany(assignments);

    // Expenses
    await Expense.insertMany([
        { title: 'Canon EOS R5 Body', amount: 295000, category: 'Equipment', date: moment().subtract(60, 'days').toDate() },
        { title: 'Studio Rent - March', amount: 25000, category: 'Rent', date: moment().subtract(5, 'days').toDate() },
        { title: 'Travel to Nandi Hills', amount: 3500, category: 'Travel', date: moment().subtract(2, 'days').toDate() },
        { title: 'Team Lunch', amount: 4200, category: 'Food', date: moment().subtract(1, 'days').toDate() },
        { title: 'Google Ads - March', amount: 15000, category: 'Marketing', date: moment().subtract(10, 'days').toDate() },
        { title: 'Worker Salary - Feb', amount: 75000, category: 'Salary', date: moment().subtract(15, 'days').toDate() },
        { title: 'Memory Cards (5 pack)', amount: 8500, category: 'Equipment', date: moment().subtract(20, 'days').toDate() },
        { title: 'Studio Rent - February', amount: 25000, category: 'Rent', date: moment().subtract(35, 'days').toDate() },
        { title: 'Instagram Promotion', amount: 5000, category: 'Marketing', date: moment().subtract(25, 'days').toDate() },
        { title: 'Backdrop & Props', amount: 12000, category: 'Equipment', date: moment().subtract(45, 'days').toDate() },
        { title: 'Travel to Palace Grounds', amount: 1200, category: 'Travel', date: moment().subtract(10, 'days').toDate() },
        { title: 'Editing Software Subscription', amount: 3500, category: 'Other', date: moment().subtract(7, 'days').toDate() }
    ]);

    // Equipment
    await Equipment.insertMany([
        { name: 'Canon EOS R5', brand: 'Canon', model: 'EOS R5', serialNumber: 'CN-R5-001', purchaseDate: moment().subtract(6, 'months').toDate(), purchasePrice: 295000, status: 'Available' },
        { name: 'Canon EOS R6', brand: 'Canon', model: 'EOS R6 Mark II', serialNumber: 'CN-R6-002', purchaseDate: moment().subtract(3, 'months').toDate(), purchasePrice: 175000, status: 'In Use' },
        { name: 'Sony A7 IV', brand: 'Sony', model: 'A7 IV', serialNumber: 'SN-A7-003', purchaseDate: moment().subtract(1, 'year').toDate(), purchasePrice: 195000, status: 'Available' },
        { name: 'Canon RF 70-200mm f/2.8', brand: 'Canon', model: 'RF 70-200mm', serialNumber: 'CN-LN-004', purchaseDate: moment().subtract(8, 'months').toDate(), purchasePrice: 185000, status: 'Available' },
        { name: 'Godox AD600Pro', brand: 'Godox', model: 'AD600Pro', serialNumber: 'GD-FL-005', purchaseDate: moment().subtract(4, 'months').toDate(), purchasePrice: 65000, status: 'Available' },
        { name: 'DJI Mavic 3 Pro', brand: 'DJI', model: 'Mavic 3 Pro', serialNumber: 'DJ-DR-006', purchaseDate: moment().subtract(2, 'months').toDate(), purchasePrice: 160000, status: 'Available' },
        { name: 'Canon RF 50mm f/1.2', brand: 'Canon', model: 'RF 50mm f/1.2L', serialNumber: 'CN-LN-007', purchaseDate: moment().subtract(5, 'months').toDate(), purchasePrice: 155000, status: 'Under Repair' },
        { name: 'Manfrotto Tripod', brand: 'Manfrotto', model: '190X', serialNumber: 'MF-TR-008', purchaseDate: moment().subtract(1, 'year').toDate(), purchasePrice: 15000, status: 'Available' }
    ]);

    // Leads
    await Lead.insertMany([
        { clientName: 'Rohan Desai', phone: '+91 77765 11111', email: 'rohan@email.com', eventType: 'Wedding', eventDate: moment().add(30, 'days').toDate(), budget: 80000, source: 'Instagram', status: 'New' },
        { clientName: 'Swati Kapoor', phone: '+91 77765 22222', email: 'swati@email.com', eventType: 'Pre-Wedding', eventDate: moment().add(20, 'days').toDate(), budget: 25000, source: 'Referral', status: 'Follow Up' },
        { clientName: 'Imran Ali', phone: '+91 77765 33333', email: 'imran@email.com', eventType: 'Corporate', eventDate: moment().add(15, 'days').toDate(), budget: 40000, source: 'Google', status: 'New' },
        { clientName: 'Priyanka Chopra', phone: '+91 77765 44444', email: 'priyanka.c@email.com', eventType: 'Birthday', eventDate: moment().add(10, 'days').toDate(), budget: 15000, source: 'Website', status: 'Converted', notes: 'Converted to booking - Event #4' },
        { clientName: 'Aditya Verma', phone: '+91 77765 55555', email: 'aditya@email.com', eventType: 'Wedding', eventDate: moment().add(45, 'days').toDate(), budget: 120000, source: 'Referral', status: 'Follow Up' }
    ]);

    console.log('✅ Seed data created successfully!');
    console.log(`   - ${events.length} events`);
    console.log(`   - ${workers.length} workers`);
    console.log(`   - ${assignments.length} worker assignments`);
    console.log(`   - 12 expenses`);
    console.log(`   - ${packages.length} packages`);
    console.log(`   - 8 equipment items`);
    console.log(`   - 5 leads`);
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
