require('dotenv').config(); // Load .env file

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const User = require('./models/User'); // Adjust the path as necessary

const SALT_ROUNDS = 10; // Salt rounds for hashing

// Function to convert an image file to base64
const getImageBase64 = (imagePath) => {
    try {
        return fs.readFileSync(imagePath, { encoding: 'base64' });
    } catch (error) {
        console.error(`Error reading image file at ${imagePath}:`, error);
        return null;
    }
};

if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI is undefined. Check your .env file.");
    process.exit(1); // Stop execution if no URI is found
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected for seeding...');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Sample Teachers Data
// Sample Teachers Data
const teachers = [
    {
        username: 'ajitkumar@khachane',
        password: 'ajitkumar@2003',
        role: 'Teacher',
        name: 'Ajitkumar Khachane',
        department: 'Information Technology',
        email: 'ajitkumar.khachane@vit.edu',
        designation: 'Associate Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'AjitkumarKhachane-9-1-1.jpg')),
        employeeCode: 'VIT001',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'akshay@loke',
        password: 'akshay@2003',
        role: 'Teacher',
        name: 'Akshay Vijay Loke',
        department: 'Information Technology',
        email: 'akshay.loke@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'AkshayLoke-8-1.jpg')),
        employeeCode: 'VIT002',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'bhanu@tekwani',
        password: 'bhanu@2003',
        role: 'Teacher',
        name: 'Bhanu Tekwani',
        department: 'Information Technology',
        email: 'bhanu.tekwani@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'BhanuTekwani-10-1.jpg')),
        employeeCode: 'VIT003',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'bushra@shaikh',
        password: 'bushra@2003',
        role: 'Teacher',
        name: 'Bushra Shaikh',
        department: 'Information Technology',
        email: 'bushra.shaikh@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'bushra-shaikh.jpg')),
        employeeCode: 'VIT004',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'debarati@ghosal',
        password: 'debarati@2003',
        role: 'Teacher',
        name: 'Debarati Ghosal',
        department: 'Information Technology',
        email: 'debarati.ghosal@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'debarti_ghoshal.jpg')),
        employeeCode: 'VIT005',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'deepali@shrikhande',
        password: 'deepali@2003',
        role: 'Teacher',
        name: 'Deepali Shrikhande',
        department: 'Information Technology',
        email: 'deepali.shrikhande@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'DeepaliShrikhande-2-1.jpg')),
        employeeCode: 'VIT006',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'dilip@motwani',
        password: 'dilip@2003',
        role: 'Teacher',
        name: 'Dr. Dilip Motwani',
        department: 'Information Technology',
        email: 'dilip.motwani@vit.edu',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'DrDilipMotwani-2-1.jpg')),
        employeeCode: 'VIT007',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'sushopti@gawade',
        password: 'sushopti@2003',
        role: 'Teacher',
        name: 'Dr. Sushopti Gawade',
        department: 'Information Technology',
        email: 'sushopti.gawade@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'sushopti_gawade.jpg')),
        employeeCode: 'VIT008',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'varsha@bhosale',
        password: 'varsha@2003',
        role: 'Teacher',
        name: 'Dr. Varsha Bhosale',
        department: 'Information Technology',
        email: 'varsha.bhosale@vit.edu',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'varsha_bhosale.jpg')),
        employeeCode: 'VIT009',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'kanchan@dhuri',
        password: 'kanchan@2003',
        role: 'Teacher',
        name: 'Kanchan Dhuri',
        department: 'Information Technology',
        email: 'kanchan.dhuri@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'KanchanDhuri-1-1.jpg')),
        employeeCode: 'VIT011',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'neha@kudu',
        password: 'neha@2003',
        role: 'Teacher',
        name: 'Neha Kudu',
        department: 'Information Technology',
        email: 'neha.kudu@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'NehaKudu-2-1.jpg')),
        employeeCode: 'VIT012',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'rasika@ransing',
        password: 'rasika@2003',
        role: 'Teacher',
        name: 'Rasika Ransing',
        department: 'Information Technology',
        email: 'rasika.ransing@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'RasikaRansing-3-1.jpg')),
        employeeCode: 'VIT013',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'rohit@barve',
        password: 'rohit@2003',
        role: 'Teacher',
        name: 'Rohit Barve',
        department: 'Information Technology',
        email: 'rohit.barve@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'RohitBarve-1-1.jpg')),
        employeeCode: 'VIT014',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'santosh@tamboli',
        password: 'santosh@2003',
        role: 'Teacher',
        name: 'Santosh Tamboli',
        department: 'Information Technology',
        email: 'santosh.tamboli@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'santosh-tamboli.jpg')),
        employeeCode: 'VIT015',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'shashikant@mahajan',
        password: 'shashikant@2003',
        role: 'Teacher',
        name: 'Shashikant Mahajan',
        department: 'Information Technology',
        email: 'shashikant.mahajan@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'ShashikantMahajan-7-1.jpg')),
        employeeCode: 'VIT016',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'shruti@agrawal',
        password: 'shruti@2003',
        role: 'Teacher',
        name: 'Shruti Agrawal',
        department: 'Information Technology',
        email: 'shruti.agrawal@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'ShrutiAgrawal-4-1.jpg')),
        employeeCode: 'VIT017',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'vinita@bhandiwad',
        password: 'vinita@2003',
        role: 'Teacher',
        name: 'Vinita Bhandiwad',
        department: 'Information Technology',
        email: 'vinita.bhandiwad@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'VinitaBhandiwad-5-1.jpg')),
        employeeCode: 'VIT018',
        assignedRO: 'vidya@chitre',
        status: 'Not Submitted'
    },
    {
        username: 'amit@aylani',
        password: 'amit2003',
        role: 'Teacher',
        name: 'Amit Aylani',
        department: 'Computer Engineering',
        email: 'amit.aylani@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'AmitAylani.jpg')),
        employeeCode: 'VIT019',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'amit@nerurkar',
        password: 'amit2003',
        role: 'Teacher',
        name: 'Amit Nerurkar',
        department: 'Computer Engineering',
        email: 'amit.nerurkar@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'AmitNerurkar.jpg')),
        employeeCode: 'VIT020',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'devendra@pandit',
        password: 'devendra2003',
        role: 'Teacher',
        name: 'Devendra Pandit',
        department: 'Computer Engineering',
        email: 'devendra.pandit@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'Devendra-Pandit.jpg')),
        employeeCode: 'VIT021',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'divya@surve',
        password: 'divya2003',
        role: 'Teacher',
        name: 'Divya Surve',
        department: 'Computer Engineering',
        email: 'divya.surve@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'DivyaSurve.jpg')),
        employeeCode: 'VIT022',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'kavita@shirsat',
        password: 'kavita2003',
        role: 'Teacher',
        name: 'Dr. Kavita Shirsat',
        department: 'Computer Engineering',
        email: 'kavita.shirsat@vit.edu',
        designation: 'Associate Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'DrKavitaShirsat.jpg')),
        employeeCode: 'VIT023',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'mandar@sohani',
        password: 'mandar2003',
        role: 'Teacher',
        name: 'Dr. Mandar Sohani',
        department: 'Computer Engineering',
        email: 'mandar.sohani@vit.edu',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'DrMandarSohani.jpg')),
        employeeCode: 'VIT024',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'pankaj@vanwari',
        password: 'pankaj2003',
        role: 'Teacher',
        name: 'Pankaj Vanwari',
        department: 'Computer Engineering',
        email: 'pankaj.vanwari@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'PankajVanwari.jpg')),
        employeeCode: 'VIT025',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'prakash@parmar',
        password: 'prakash2003',
        role: 'Teacher',
        name: 'Prakash Parmar',
        department: 'Computer Engineering',
        email: 'prakash.parmar@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'PrakashParmar.jpg')),
        employeeCode: 'VIT026',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'sachin@bojewar',
        password: 'sachin2003',
        role: 'Teacher',
        name: 'Dr. Sachin Bojewar',
        department: 'Computer Engineering',
        email: 'sachin.bojewar@vit.edu',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'DrSachinBojewar.jpg')),
        employeeCode: 'VIT027',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'sachin@deshpande',
        password: 'sachin2003',
        role: 'Teacher',
        name: 'Sachin Deshpande',
        department: 'Computer Engineering',
        email: 'sachin.deshpande@vit.edu',
        designation: 'Associate Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'SachinDeshpande-10-1.jpg')),
        employeeCode: 'VIT028',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'sanjeev@dwivedi',
        password: 'sanjeev2003',
        role: 'Teacher',
        name: 'Sanjeev Dwivedi',
        department: 'Computer Engineering',
        email: 'sanjeev.dwivedi@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'Sanjeev-diwedi.jpg')),
        employeeCode: 'VIT029',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'sneha@annappanavar',
        password: 'sneha2003',
        role: 'Teacher',
        name: 'Sneha Annappanavar',
        department: 'Computer Engineering',
        email: 'sneha.annappanavar@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'Sneha-A1.jpg')),
        employeeCode: 'VIT030',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'snehal@andhare',
        password: 'snehal2003',
        role: 'Teacher',
        name: 'Snehal Andhare',
        department: 'Computer Engineering',
        email: 'snehal.andhare@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'SnehaAndhare.jpg')),
        employeeCode: 'VIT031',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'suja@jayachandran',
        password: 'suja2003',
        role: 'Teacher',
        name: 'Suja Jayachandran',
        department: 'Computer Engineering',
        email: 'vrutika.pillai@vit.edu.in',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'SujaJayachandran.jpg')),
        employeeCode: 'VIT032',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'suvarna@sapre',
        password: 'suvarna2003',
        role: 'Teacher',
        name: 'Suvarna Sapre',
        department: 'Computer Engineering',
        email: 'suvarna.sapre@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'Suvarna.jpg')),
        employeeCode: 'VIT033',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'swapnil@sonawane',
        password: 'swapnil2003',
        role: 'Teacher',
        name: 'Swapnil Sonawane',
        department: 'Computer Engineering',
        email: 'swapnil.sonawane@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'Swapnil-sonawane.jpg')),
        employeeCode: 'VIT034',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'umesh@kulkarni',
        password: 'umesh2003',
        role: 'Teacher',
        name: 'Dr. Umesh Kulkarni',
        department: 'Computer Engineering',
        email: 'umesh.kulkarni@vit.edu',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'DrUmeshKulkarni.jpg')),
        employeeCode: 'VIT035',
        assignedRO: 'ravindra@sangle',
        status: 'Not Submitted'
    },
    {
        username: 'Komal@Lawand',
        password: 'komal2003',
        role: 'Teacher',
        name: 'Komal Lawand-Shinde',
        department: 'Biomedical Engineering',
        email: 'komal.lawand@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'BioMed', 'Komal-Lawand.jpg')),
        employeeCode: 'VIT036',
        assignedRO: 'gajanan@nagare',
        status: 'Not Submitted'
    },
    {
        username: 'Harish@Ojha',
        password: 'harish2003',
        role: 'Teacher',
        name: 'Harish Ojha',
        department: 'Biomedical Engineering',
        email: 'vrutikapillai14@gmail.com',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'BioMed', 'Harish-Oza.jpg')),
        employeeCode: 'VIT037',
        assignedRO: 'gajanan@nagare',
        status: 'Not Submitted'
    },
    {
        username: 'Geetha@Thekkedath',
        password: 'geetha2003',
        role: 'Teacher',
        name: 'Geetha Thekkedath',
        department: 'Biomedical Engineering',
        email: 'geetha.thekkedath@vit.edu',
        designation: 'Associate Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'BioMed', 'Geetha-N-1.jpg')),
        employeeCode: 'VIT038',
        assignedRO: 'gajanan@nagare',
        status: 'Not Submitted'
    },
    {
        username: 'Arunkumar@Ram',
        password: 'arunkumar2003',
        role: 'Teacher',
        name: 'Arunkumar Ram',
        department: 'Biomedical Engineering',
        email: 'arunkumar.ram@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'BioMed', 'ArunKumarRa-5-1.jpg')),
        employeeCode: 'VIT039',
        assignedRO: 'gajanan@nagare',
        status: 'Not Submitted'
    },
    {
        username: 'Suvarna@Udgire',
        password: 'suvarna2003',
        role: 'Teacher',
        name: 'Suvarna Udgire',
        department: 'Biomedical Engineering',
        email: 'suvarna.udgire@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'BioMed', 'SuvarnaUdgire-1-1.jpg')),
        employeeCode: 'VIT040',
        assignedRO: 'gajanan@nagare',
        status: 'Not Submitted'
    },
    {
        username: 'Neelam@Punjabi',
        password: 'neelam2003',
        role: 'Teacher',
        name: 'Neelam Punjabi',
        department: 'Biomedical Engineering',
        email: 'neelam.punjabi@vit.edu',
        designation: 'Assistant Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'BioMed', 'NeelamPunjabi-8-1.jpg')),
        employeeCode: 'VIT041',
        assignedRO: 'gajanan@nagare',
        status: 'Not Submitted'
    },
    {
        username: 'vidya@chitre1',
        password: 'vidya@2003',
        role: 'Teacher',
        name: 'Dr. Vidya Chitre',
        department: 'All Department HOD',
        email: 'anushreeshetty@gmail.com',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'vidya-chitre.jpg')),
        employeeCode: 'VIT042',
        assignedRO: 'varsha@bhosaleRO',
        status: 'Not Submitted'
    },
    {
        username: 'ravindra@sangle1',
        password: 'ravindra2003',
        role: 'Teacher',
        name: 'Dr. Ravindra Sangle',
        department: 'All Department HOD',
        email: 'sunpreethora@gmail.com',
        designation: 'Associate Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'RavindraSangale.jpg')),
        employeeCode: 'VIT043',
        assignedRO: 'varsha@bhosaleRO',
        status: 'Not Submitted'
    },
    {
        username: 'gajanan@nagare1',
        password: 'gajanan@2003',
        role: 'Teacher',
        name: 'Dr. Gajanan Nagare',
        department: 'All Department HOD',
        email: 'sunpreet1.huda@vit.edu',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'BioMed', 'gajananNagare.jpg')),
        employeeCode: 'VIT044',
        assignedRO: 'varsha@bhosaleRO',
        status: 'Not Submitted'
    },

];



// Sample RO Data
const ro = [
    {
        username: 'vidya@chitre',
        password: 'vidya@2003',
        role: 'RO',
        name: 'Dr. Vidya Chitre',
        department: 'Information Technology',
        email: 'anushreeshetty604@gmail.com',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'vidya-chitre.jpg')),
        employeeCode: 'RO001'
    },
    {
        username: 'ravindra@sangle',
        password: 'ravindra2003',
        role: 'RO',
        name: 'Dr. Ravindra Sangle',
        department: 'Computer Engineering',
        email: 'jayrams604@gmail.com',
        designation: 'Associate Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'CMPN', 'RavindraSangale.jpg')),
        employeeCode: 'RO002'
    },
    {
        username: 'gajanan@nagare',
        password: 'gajanan@2003',
        role: 'RO',
        name: 'Dr. Gajanan Nagare',
        department: 'Biomedical Engineering',
        email: 'sunpreet.huda@vit.edu.in',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'BioMed', 'gajananNagare.jpg')),
        employeeCode: 'RO003'
    },
    {
        username: 'varsha@bhosaleRO',
        password: 'varsha@2003',
        role: 'RO',
        name: 'Dr. Varsha Bhosale',
        department: 'All Department HOD',
        email: 'varsha.bhosale@vit.edu',
        designation: 'Professor',
        image: getImageBase64(path.join(__dirname, 'images', 'IT', 'varsha_bhosale.jpg')),
        employeeCode: 'RO004',
    },
];

// Function to hash passwords before inserting
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};

// Function to insert users into the database
const insertUsers = async (users, userType) => {
    for (let user of users) {
        const existingUser = await User.findOne({ username: user.username });

        if (!existingUser) {
            user.password = await hashPassword(user.password); // Hash password
            await User.create(user);
            console.log(`Inserted ${userType}: ${user.username}`);
        } else {
            console.log(`Skipping existing ${userType}: ${user.username}`);
        }
    }
};

// Seed Data into MongoDB
const seedDatabase = async () => {
    try {
        await insertUsers(teachers, "Teacher");
        await insertUsers(ro, "RO");

        console.log('Seeding complete.');
        mongoose.connection.close(); // Close DB connection after seeding
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

// Run the Seed Function
seedDatabase();
