import { connectDb } from "@/helper/db";
import Contact from "@/models/Contact";


// Handle POST request
export async function POST(req) {
    try {
        const { name, email, message } = await req.json();

        // Connect to MongoDB
        await connectDb();

        // Create a new contact entry in the database
        const newContact = new Contact({
            name,
            email,
            message,
        });

        // Save the new entry to the database
        await newContact.save();

        return new Response(
            JSON.stringify({ message: 'Message sent successfully!' }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'Failed to send message.' }),
            { status: 500 }
        );
    }
}

// Handle GET request (if needed, for example, to retrieve contact data)
export async function GET() {
    try {
        // Connect to MongoDB
        await connectDb();

        // Retrieve all contact messages from the database
        const contacts = await Contact.find();

        return new Response(
            JSON.stringify({ contacts }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch contact data.' }),
            { status: 500 }
        );
    }
}
