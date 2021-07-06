module.exports = {
	PORT: process.env.PORT || 8000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/clothing-store',
	TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://dunder_mifflin@localhost/clothing-store-test',
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRY: 60*60,
	CLIENT_ORIGIN: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://clothing-store-client.vercel.app/"
}
