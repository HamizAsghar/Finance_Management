import mongoose from "mongoose"
export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONOGO_DB_URL, {
            dbName: 'FinanceManagement',
        });
        console.log("DB Connected...");
    } catch (error) {
        console.log('Failed To Connect With DataBase')
        console.log(error)
    }
}



