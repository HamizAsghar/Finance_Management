// import { connectDb } from '@/helper/db';
// import SavingsGoal from '@/models/SavingsGoal';
// import { NextResponse } from 'next/server';


// export async function GET() {
//     try {
//         await connectDb();
//         const goals = await SavingsGoal.find({}).sort({ createdAt: -1 });
//         return NextResponse.json({ success: true, data: goals });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: 'Failed to fetch savings goals' }, { status: 500 });
//     }
// }

// export async function POST(request) {
//     try {
//         await connectDb();
//         const data = await request.json();
//         const goal = await SavingsGoal.create(data);
//         return NextResponse.json({ success: true, data: goal });
//     } catch (error) {
//         return NextResponse.json({ success: false, error: 'Failed to create savings goal' }, { status: 500 });
//     }
// }




import { connectDb } from '@/helper/db';
import SavingsGoal from '@/models/SavingsGoal';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();
        const goals = await SavingsGoal.find({ userId: session.user.id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: goals });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch savings goals' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }

        await connectDb();
        const data = await request.json();
        const goal = await SavingsGoal.create({
            ...data,
            userId: session.user.id
        });
        return NextResponse.json({ success: true, data: goal });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to create savings goal' },
            { status: 500 }
        );
    }
}

